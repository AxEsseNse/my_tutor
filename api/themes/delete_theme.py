from http import HTTPStatus

from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import ThemeNotFoundError
from my_tutor.repositories import ThemeRepository
from my_tutor.routers import admin_router
from my_tutor.session import get_db_session
from my_tutor.schemes import DeleteThemeRequest, DeleteThemeResponse

theme_repository = ThemeRepository()


@admin_router.delete("/themes/{title:str}/")
async def delete_theme(title: str, theme_data: DeleteThemeRequest, session: AsyncSession = Depends(get_db_session)) -> DeleteThemeResponse:
    if title != theme_data.title:
        raise HTTPException(HTTPStatus.BAD_REQUEST, "Bad request data")

    try:
        async with session.begin():

            return await theme_repository.delete_theme(session, theme_data=theme_data)
    except ThemeNotFoundError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)