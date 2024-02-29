from typing import Annotated

from fastapi import Cookie, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.domain import UserInfo
from my_tutor.constants import LessonAccess
from my_tutor.repositories import UserRepository, LessonRepository, TutorRepository, StudentRepository
from my_tutor.session import get_db_session


user_repository = UserRepository()
lesson_repository = LessonRepository()
tutor_repository = TutorRepository()
student_repository = StudentRepository()

AUTH_TOKEN_NAME = "My-Tutor-Auth-Token"
ROLES_ID = {
    "Администратор": 1,
    "Преподаватель": 2,
    "Студент": 3
}


async def get_authorized_user(
    token: Annotated[str | None, Cookie(alias=AUTH_TOKEN_NAME)] = None,
    session: AsyncSession = Depends(get_db_session),
) -> UserInfo | None:

    if token is None:
        #print('DEPEND tokena net')
        return None
    async with session.begin():
        is_valid_token = await user_repository.valid_token(session=session, token=token)
        if not is_valid_token:
            #print('DEPEND token ne validniy')
            return None
        try:
            user = await user_repository.get_user_info(session=session, token=token)
            if user.role == "Преподаватель":
                tutor_id = await tutor_repository.get_tutor_id(session=session, user_id=user.user_id)
                current_lesson_id = await lesson_repository.get_current_user_lesson(
                    session=session,
                    tutor_id=tutor_id
                )
                user.current_lesson_id = current_lesson_id
            elif user.role == "Студент":
                student_id = await student_repository.get_student_id(session=session, user_id=user.user_id)
                current_lesson_id = await lesson_repository.get_current_user_lesson(
                    session=session,
                    student_id=student_id
                )
                user.current_lesson_id = current_lesson_id
            print(current_lesson_id)
        except Exception as e:
            print('DEPEND oshibka get user info?', e)
            return None

    return user


async def check_access(
    request: Request,
    token: Annotated[str | None, Cookie(alias=AUTH_TOKEN_NAME)] = None,
    session: AsyncSession = Depends(get_db_session),
) -> LessonAccess:
    lesson_id = int(request.url.path.split('/')[-1])

    async with session.begin():
        try:
            user = await user_repository.get_user_info(session=session, token=token)

            if user.role == "Преподаватель":
                tutor_id = await tutor_repository.get_tutor_id(session=session, user_id=user.user_id)
                is_authorize_to_lesson = await lesson_repository.authorize_lesson(
                    session=session,
                    lesson_id=lesson_id,
                    tutor_id=tutor_id
                )

            elif user.role == "Студент":
                student_id = await student_repository.get_student_id(session=session, user_id=user.user_id)
                is_authorize_to_lesson = await lesson_repository.authorize_lesson(
                    session=session,
                    lesson_id=lesson_id,
                    student_id=student_id
                )

            if not is_authorize_to_lesson:
                return LessonAccess.NOT_AUTHORIZED

            is_available_lesson = await lesson_repository.is_available_lesson(session=session, lesson_id=lesson_id)

            if not is_available_lesson:
                return LessonAccess.NOT_AVAILABLE

            return LessonAccess.AVAILABLE
        except Exception as e:
            print('DEPEND oshibka get user info?', e)
            return LessonAccess.ERROR
