from http import HTTPStatus

from fastapi import Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import StudentAlreadyExistError, UserNotFoundError
from my_tutor.repositories import UserRepository, StudentRepository
from my_tutor.routers import admin_router
from my_tutor.schemes import AddStudentRequest, AddStudentResponse
from my_tutor.session import get_db_session


user_repository = UserRepository()
student_repository = StudentRepository()


@admin_router.post("/students/", status_code=HTTPStatus.CREATED)
async def add_student(student_data: AddStudentRequest, session: AsyncSession = Depends(get_db_session)) -> AddStudentResponse:
    try:
        async with session.begin():
            user_id = await user_repository.get_user_id_by_login(session=session, login=student_data.student_login)

            return await student_repository.add_student(session=session, student_data=student_data, user_id=user_id)
    except ValidationError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, str(e))
    except UserNotFoundError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, e.message)
    except StudentAlreadyExistError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, e.message)
