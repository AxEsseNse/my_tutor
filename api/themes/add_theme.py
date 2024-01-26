from http import HTTPStatus

from fastapi import Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import ThemeAlreadyExistError
from my_tutor.repositories import ThemeRepository
from my_tutor.routers import admin_router
from my_tutor.schemes import AddThemeRequest, AddThemeResponse
from my_tutor.session import get_db_session


theme_repository = ThemeRepository()


@admin_router.post("/themes/", status_code=HTTPStatus.CREATED)
async def add_theme(theme_data: AddThemeRequest, session: AsyncSession = Depends(get_db_session)) -> AddThemeResponse:
    try:
        async with session.begin():

            return await theme_repository.add_theme(session=session, theme_data=theme_data)
    except ValidationError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, str(e))
    except ThemeAlreadyExistError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, e.message)
