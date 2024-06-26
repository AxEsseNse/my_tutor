from http import HTTPStatus

from fastapi import Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import ThemeNotFoundError
from my_tutor.repositories import ThemeRepository
from my_tutor.routers import admin_router
from my_tutor.schemes import UpdateThemeRequest, UpdateThemeResponse
from my_tutor.session import get_db_session

theme_repository = ThemeRepository()


@admin_router.put("/themes/{theme_id:int}/")
async def update_theme(
    theme_id: int,
    theme_data: UpdateThemeRequest,
    session: AsyncSession = Depends(get_db_session)
) -> UpdateThemeResponse:
    if theme_id != theme_data.theme_id:
        raise HTTPException(HTTPStatus.BAD_REQUEST, "Bad request data")

    try:
        async with session.begin():

            return await theme_repository.update_theme(session=session, theme_data=theme_data)
    except ValidationError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, str(e))
    except ThemeNotFoundError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)
