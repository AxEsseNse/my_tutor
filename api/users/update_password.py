from http import HTTPStatus

from fastapi import Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import UserNotFoundError
from my_tutor.repositories import UserRepository
from my_tutor.routers import admin_router
from my_tutor.schemes import UpdateUserPasswordRequest, UpdateUserPasswordResponse
from my_tutor.session import get_db_session

user_repository = UserRepository()


#@users_router.put("/{login:str}/")
@admin_router.put("/users/{login:str}/")
async def update_password(login: str, user_data: UpdateUserPasswordRequest, session: AsyncSession = Depends(get_db_session)) -> UpdateUserPasswordResponse:
    if login != user_data.login:
        raise HTTPException(HTTPStatus.BAD_REQUEST, "Bad request data")

    try:
        async with session.begin():
            return await user_repository.update_user_password(session, user_data)
    except ValidationError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, str(e))
    except UserNotFoundError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)