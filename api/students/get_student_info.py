from http import HTTPStatus

from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import UserNotFoundError, StudentNotFoundError
from my_tutor.domain import StudentInfo
from my_tutor.repositories import UserRepository, StudentRepository
from my_tutor.routers import students_router
from my_tutor.session import get_db_session

user_repository = UserRepository()
student_repository = StudentRepository()


@students_router.get("/student/{login:str}/", response_model=StudentInfo)
async def get_student_info(login: str, session: AsyncSession = Depends(get_db_session)):
    try:
        user_id = await user_repository.get_user_id_by_login(session=session, login=login)

        return await student_repository.get_student_info(session=session, user_id=user_id, login=login)
    except UserNotFoundError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)
    except StudentNotFoundError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)
