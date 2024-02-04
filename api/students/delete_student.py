from http import HTTPStatus

from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import StudentNotFoundError
from my_tutor.repositories import StudentRepository
from my_tutor.routers import admin_router
from my_tutor.session import get_db_session
from my_tutor.schemes import DeleteStudentRequest, DeleteStudentResponse

student_repository = StudentRepository()


@admin_router.delete("/students/{phone:str}/")
async def delete_student(phone: str, student_data: DeleteStudentRequest, session: AsyncSession = Depends(get_db_session)) -> DeleteStudentResponse:
    if phone != student_data.phone:
        raise HTTPException(HTTPStatus.BAD_REQUEST, "Bad request data")

    try:
        async with session.begin():
            return await student_repository.delete_student(session, student_data=student_data)
    except StudentNotFoundError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)
