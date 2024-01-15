from http import HTTPStatus

from fastapi import Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import UserAlreadyExistError
from my_tutor.repositories import UserRepository
from my_tutor.routers import admin_router
from my_tutor.schemes import CreateUserRequest
from my_tutor.session import get_db_session


user_repository = UserRepository()


@admin_router.post("/users", status_code=HTTPStatus.CREATED)
async def add_user(user: CreateUserRequest, session: AsyncSession = Depends(get_db_session)):
    try:
        async with session.begin():
            return await user_repository.add_user(session, user)
    except ValidationError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, str(e))
    except UserAlreadyExistError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, e.message)
