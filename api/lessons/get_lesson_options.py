from http import HTTPStatus
from fastapi import Depends, Request, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.repositories import UserRepository, StudentRepository, TutorRepository, ThemeRepository
from my_tutor.routers import lessons_router
from my_tutor.session import get_db_session
from my_tutor.domain import LessonOptions

user_repository = UserRepository()
tutor_repository = TutorRepository()
student_repository = StudentRepository()
theme_repository = ThemeRepository()


def _to_lesson_options(tutor, student, theme):
    return LessonOptions(
        tutor=tutor,
        student=student,
        theme=theme
    )


@lessons_router.get("/info/", response_model=LessonOptions)
async def get_lesson_options(request: Request, session: AsyncSession = Depends(get_db_session)) -> LessonOptions:
    header_token = request.headers['My-Tutor-Auth-Token']
    user_model = await user_repository.get_user_by_token(session=session, token=header_token)

    if user_model.role_id == 2:
        tutor = await tutor_repository.get_tutor_options(session=session, user_id=user_model.user_id)
        student = await student_repository.get_students_options(session=session)
    elif user_model.role_id == 1:
        tutor = await tutor_repository.get_tutor_options(session=session)
        student = await student_repository.get_students_options(session=session)
    else:
        raise HTTPException(HTTPStatus.UNAUTHORIZED, "Bad request data")

    theme = await theme_repository.get_themes_options(session=session)

    return _to_lesson_options(tutor, student, theme)
