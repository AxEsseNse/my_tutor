from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.domain import Tutor
from my_tutor.repositories import TutorRepository
from my_tutor.routers import admin_router
from my_tutor.session import get_db_session

tutor_repository = TutorRepository()


@admin_router.get("/tutors/", response_model=list[Tutor])
async def get_tutors(session: AsyncSession = Depends(get_db_session)) -> list[Tutor]:

    return await tutor_repository.get_tutors(session=session)
