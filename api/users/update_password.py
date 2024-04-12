from http import HTTPStatus

from fastapi import Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import UserNotFoundError, UserNotVerifyError
from my_tutor.repositories import UserRepository
from my_tutor.routers import admin_router, users_router
from my_tutor.schemes import (
    UpdateUserPasswordRequest,
    UpdateUserPasswordByAdminRequest,
    UpdateUserPasswordResponse
)
from my_tutor.session import get_db_session

user_repository = UserRepository()


@admin_router.put("/users/{user_id:int}/password/")
@users_router.put("/{user_id:int}/password/")
async def update_password(user_id: int, user_data: UpdateUserPasswordRequest | UpdateUserPasswordByAdminRequest, session: AsyncSession = Depends(get_db_session)) -> UpdateUserPasswordResponse:
    if user_id != user_data.user_id:
        raise HTTPException(HTTPStatus.BAD_REQUEST, "Bad request data")

    try:
        async with session.begin():

            return await user_repository.update_user_password(session=session, user_data=user_data)
    except ValidationError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, str(e))
    except UserNotFoundError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)
    except UserNotVerifyError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)
