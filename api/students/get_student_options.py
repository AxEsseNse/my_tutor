from http import HTTPStatus
from fastapi import Depends, Request, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.repositories import UserRepository, StudentRepository
from my_tutor.routers import students_router
from my_tutor.session import get_db_session
from my_tutor.domain import StudentOption

user_repository = UserRepository()
student_repository = StudentRepository()


@students_router.get("/options/", response_model=list[StudentOption])
async def get_student_options(request: Request, session: AsyncSession = Depends(get_db_session)) -> list[StudentOption]:
    header_token = request.headers['My-Tutor-Auth-Token']
    user_model = await user_repository.get_user_by_token(session=session, token=header_token)

    if user_model.role_id == 2:
        # для преподавателя грузить только его студентов в будущем
        return await student_repository.get_students_options(session=session)
    elif user_model.role_id == 1:
        # для админа всех студентов грузить
        return await student_repository.get_students_options(session=session)
    else:
        raise HTTPException(HTTPStatus.UNAUTHORIZED, "Bad request data")
