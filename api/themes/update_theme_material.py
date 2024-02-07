from http import HTTPStatus

from fastapi import Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import ThemeNotFoundError, ThemeMaterialNotFoundError
from my_tutor.repositories import ThemeRepository
from my_tutor.routers import admin_router
from my_tutor.schemes import UpdateThemeMaterialTheoryRequest, UpdateThemeMaterialPracticeRequest, UpdateThemeMaterialResponse
from my_tutor.session import get_db_session

theme_repository = ThemeRepository()


@admin_router.put("/themes/material/{theme_id:int}/")
async def update_theme_material(
    theme_id: int,
    theme_material_data: UpdateThemeMaterialTheoryRequest | UpdateThemeMaterialPracticeRequest,
    session: AsyncSession = Depends(get_db_session)
) -> UpdateThemeMaterialResponse:

    if theme_id != theme_material_data.theme_id:
        raise HTTPException(HTTPStatus.BAD_REQUEST, "Bad request data")

    try:
        async with session.begin():

            return await theme_repository.update_theme_material(session, theme_material_data=theme_material_data)
    except ValidationError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, str(e))
    except ThemeNotFoundError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)
    except ThemeMaterialNotFoundError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)
