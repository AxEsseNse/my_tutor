from http import HTTPStatus

from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import UserNotFoundError
from my_tutor.repositories import UserRepository
from my_tutor.routers import admin_router
from my_tutor.session import get_db_session
from my_tutor.schemes import DeleteUserRequest, DeleteUserResponse

user_repository = UserRepository()


@admin_router.delete("/users/{login:str}/")
async def delete_user(login: str, user_data: DeleteUserRequest, session: AsyncSession = Depends(get_db_session)) -> DeleteUserResponse:
    if login != user_data.login:
        raise HTTPException(HTTPStatus.BAD_REQUEST, "Bad request data")

    try:
        async with session.begin():
            return await user_repository.delete_user(session, user_data=user_data)
    except UserNotFoundError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)