from http import HTTPStatus

from fastapi import Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import StudentNotFoundError
from my_tutor.repositories import StudentRepository, UserRepository
from my_tutor.routers import students_router
from my_tutor.schemes import (
    ChangeStudentPrimaryInfoRequest,
    ChangeStudentContactInfoRequest,
    StudentPrimaryInfoResponse,
    StudentContactInfoResponse
)
from my_tutor.session import get_db_session

student_repository = StudentRepository()
user_repository = UserRepository()


#@users_router.put("/{login:str}/")
@students_router.put("/student/{login:str}/")
async def update_student(
    login: str,
    student_data: ChangeStudentPrimaryInfoRequest | ChangeStudentContactInfoRequest,
    session: AsyncSession = Depends(get_db_session)
) -> StudentPrimaryInfoResponse | StudentContactInfoResponse:
    if login != student_data.login:
        raise HTTPException(HTTPStatus.BAD_REQUEST, "Bad request data")

    try:
        async with session.begin():
            user_id = await user_repository.get_user_id_by_login(session=session, login=login)
            match student_data:
                case ChangeStudentPrimaryInfoRequest():
                    return await student_repository.change_primary_info(session, student_data, user_id)
                case ChangeStudentContactInfoRequest():
                    return await student_repository.change_contact_info(session, student_data, user_id)
                case _:
                    raise HTTPException(HTTPStatus.BAD_REQUEST, "Bad request data")
    except ValidationError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, str(e))
    except StudentNotFoundError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)
