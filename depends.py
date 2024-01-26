from typing import Annotated

from fastapi import Cookie, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from .domain import UserInfo
from .repositories import UserRepository
from .session import get_db_session

user_repository = UserRepository()

AUTH_TOKEN_NAME = "My-Tutor-Auth-Token"


async def get_authorized_user(
    token: Annotated[str | None, Cookie(alias=AUTH_TOKEN_NAME)] = None,
    session: AsyncSession = Depends(get_db_session),
) -> UserInfo | None:

    if token is None:
        #print('DEPEND tokena net')
        return None
    async with session.begin():
        is_valid_token = await user_repository.valid_token(session=session, token=token)

        if not is_valid_token:
            #print('DEPEND token ne validniy')
            return None
        try:
            user = await user_repository.get_user_info(session=session, token=token)
            #TODO После того как достали юзера - по его роли залазим в БД и достаем имя, аватарку и роль для меню наверху справа
        except Exception as e:
            print('DEPEND oshibka get user info?', e)
            return None

    return user
