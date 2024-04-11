from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.domain import User, UserLogin
from my_tutor.repositories import UserRepository
from my_tutor.routers import admin_router
from my_tutor.session import get_db_session

user_repository = UserRepository()


@admin_router.get("/users/", response_model=list[User])
async def get_users(session: AsyncSession = Depends(get_db_session)) -> list[User]:

    return await user_repository.get_users(session=session)


@admin_router.get("/users/tutors_without_profile/", response_model=list[UserLogin])
async def get_tutors_without_profile(session: AsyncSession = Depends(get_db_session)) -> list[UserLogin]:
    return await user_repository.get_tutors_without_profile(session=session)


@admin_router.get("/users/students_without_profile/", response_model=list[UserLogin])
async def get_students_without_profile(session: AsyncSession = Depends(get_db_session)) -> list[UserLogin]:

    return await user_repository.get_students_without_profile(session=session)
