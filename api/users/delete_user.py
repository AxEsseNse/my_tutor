from http import HTTPStatus

from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import UserNotFoundError
from my_tutor.repositories import UserRepository
from my_tutor.routers import admin_router
from my_tutor.session import get_db_session

user_repository = UserRepository()


@admin_router.delete("/users/{login:str}/")
async def delete_user(login: str, session: AsyncSession = Depends(get_db_session)):
    try:
        async with session.begin():
            return await user_repository.delete_user(session, login)
    except UserNotFoundError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)