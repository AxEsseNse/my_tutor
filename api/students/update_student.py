from http import HTTPStatus

from fastapi import Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import StudentNotFoundError
from my_tutor.repositories import StudentRepository, UserRepository
from my_tutor.routers import students_router
from my_tutor.schemes import (
    UpdateStudentPrimaryInfoRequest,
    UpdateStudentContactInfoRequest,
    UpdateStudentPrimaryInfoResponse,
    UpdateStudentContactInfoResponse
)
from my_tutor.session import get_db_session

student_repository = StudentRepository()
user_repository = UserRepository()


@students_router.put("/student/{login:str}/")
async def update_student(
    login: str,
    student_data: UpdateStudentPrimaryInfoRequest | UpdateStudentContactInfoRequest,
    session: AsyncSession = Depends(get_db_session)
) -> UpdateStudentPrimaryInfoResponse | UpdateStudentContactInfoResponse:
    if login != student_data.login:
        raise HTTPException(HTTPStatus.BAD_REQUEST, "Bad request data")

    try:
        async with session.begin():
            user_id = await user_repository.get_user_id_by_login(session=session, login=login)
            match student_data:
                case UpdateStudentPrimaryInfoRequest():
                    return await student_repository.update_primary_info(session, student_data, user_id)
                case UpdateStudentContactInfoRequest():
                    return await student_repository.update_contact_info(session, student_data, user_id)
                case _:
                    raise HTTPException(HTTPStatus.BAD_REQUEST, "Bad request data")
    except ValidationError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, str(e))
    except StudentNotFoundError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)
