from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.domain import Student
from my_tutor.repositories import StudentRepository
from my_tutor.routers import admin_router
from my_tutor.session import get_db_session

student_repository = StudentRepository()


@admin_router.get("/students/", response_model=list[Student])
async def get_students(session: AsyncSession = Depends(get_db_session)) -> list[Student]:

    return await student_repository.get_students(session=session)
