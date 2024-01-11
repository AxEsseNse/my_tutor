from typing import Annotated, Callable

from fastapi import Cookie, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.status import HTTP_401_UNAUTHORIZED, HTTP_403_FORBIDDEN

from .constants import UserRole
from .domain import User
from .repositories import UserRepository
from .session import get_db_session

user_repository = UserRepository()

AUTH_TOKEN_NAME = "X-Monas-Auth-Token"


async def get_authorized_user(
    token: Annotated[str | None, Cookie(alias=AUTH_TOKEN_NAME)] = None,
    session: AsyncSession = Depends(get_db_session),
) -> User | None:
    if token is None:
        return None

    async with session.begin():
        is_valid_token = await user_repository.valid_token(session=session, token=token)

        if not is_valid_token:
            return None

        user = await user_repository.get_user_by_token(session=session, token=token)

    return user


def verify_user_roles(*required_user_roles: UserRole) -> Callable[..., None]:
    def _dependency(request: Request, user: User | None = Depends(get_authorized_user)):
        if not user:
            raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Не авторизован")

        if request.method == "GET":
            return

        if user.role in required_user_roles:
            return

        else:
            raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Недостаточно прав")

    return _dependency


async def verify_user(user: User | None = Depends(get_authorized_user)) -> None:
    if not user:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Не авторизован")