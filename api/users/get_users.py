from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.domain import UserInfo
from my_tutor.repositories import UserRepository
from my_tutor.routers import admin_router
from my_tutor.session import get_db_session

user_repository = UserRepository()


@admin_router.get("/users", response_model=list[UserInfo])
async def get_users(session: AsyncSession = Depends(get_db_session)):
    return await user_repository.get_user_id(session)
