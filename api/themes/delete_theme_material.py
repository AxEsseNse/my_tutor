from http import HTTPStatus

from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import ThemeNotFoundError
from my_tutor.repositories import ThemeRepository
from my_tutor.routers import admin_router
from my_tutor.session import get_db_session
from my_tutor.schemes import DeleteThemeMaterialRequest, DeleteThemeMaterialResponse

theme_repository = ThemeRepository()


@admin_router.delete("/themes/material/{theme_id:int}/")
async def delete_theme_material(
        theme_id: int,
        theme_material_data: DeleteThemeMaterialRequest,
        session: AsyncSession = Depends(get_db_session)
) -> DeleteThemeMaterialResponse:

    if theme_id != theme_material_data.theme_id:
        raise HTTPException(HTTPStatus.BAD_REQUEST, "Bad request data")

    try:
        async with session.begin():

            return await theme_repository.delete_theme_material(session, theme_material_data=theme_material_data)
    except ThemeNotFoundError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)