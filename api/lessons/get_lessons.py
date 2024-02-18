from fastapi import Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.domain import TutorLesson, StudentLesson
from my_tutor.repositories import LessonRepository, UserRepository, StudentRepository, TutorRepository
from my_tutor.routers import lessons_router
from my_tutor.session import get_db_session

lesson_repository = LessonRepository()
user_repository = UserRepository()
tutor_repository = TutorRepository()
student_repository = StudentRepository()


@lessons_router.get("/", response_model=list[TutorLesson] | list[StudentLesson])
async def get_lessons(request: Request, session: AsyncSession = Depends(get_db_session)) -> list[TutorLesson] | list[StudentLesson]:
    header_token = request.headers['My-Tutor-Auth-Token']
    user_model = await user_repository.get_user_by_token(session=session, token=header_token)
    if user_model.role_id == 2:
        tutor_id = await tutor_repository.get_tutor_id(session=session, user_id=user_model.user_id)
        return await lesson_repository.get_tutor_lessons(session=session, tutor_id=tutor_id)
    elif user_model.role_id == 3:
        student_id = await student_repository.get_student_id(session=session, user_id=user_model.user_id)
        return await lesson_repository.get_student_lessons(session=session, student_id=student_id)
