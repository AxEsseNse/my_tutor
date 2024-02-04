from http import HTTPStatus

from fastapi import Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import ThemeNotFoundError
from my_tutor.repositories import ThemeRepository
from my_tutor.routers import admin_router
from my_tutor.schemes import (
    AddThemeMaterialTheoryRequest,
    AddThemeMaterialPracticeRequest,
    AddThemeMaterialResponse
)
from my_tutor.session import get_db_session


theme_repository = ThemeRepository()


@admin_router.post("/themes/material/{theme_id: int}/", status_code=HTTPStatus.CREATED)
async def add_theme_material(
    theme_id: int,
    theme_material_data: AddThemeMaterialPracticeRequest | AddThemeMaterialTheoryRequest,
    session: AsyncSession = Depends(get_db_session)
) -> AddThemeMaterialResponse:

    if theme_id != theme_material_data.theme_id:
        raise HTTPException(HTTPStatus.BAD_REQUEST, "Bad request data")

    try:
        async with session.begin():
            return await theme_repository.add_theme_material(session=session, theme_material_data=theme_material_data)
    except ValidationError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, str(e))
    except ThemeNotFoundError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, e.message)
