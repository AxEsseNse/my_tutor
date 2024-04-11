from http import HTTPStatus

from fastapi import Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import ThemeNotFoundError
from my_tutor.repositories import ThemeRepository
from my_tutor.routers import themes_router
from my_tutor.schemes import (
    AddThemeTheoryCardRequest,
    AddThemePracticeCardRequest,
    AddThemeCardResponse
)
from my_tutor.session import get_db_session


theme_repository = ThemeRepository()


@themes_router.post("/{theme_id:int}/cards/", status_code=HTTPStatus.CREATED)
async def add_theme_card(
    theme_id: int,
    theme_card_data: AddThemePracticeCardRequest | AddThemeTheoryCardRequest,
    session: AsyncSession = Depends(get_db_session)
) -> AddThemeCardResponse:

    if theme_id != theme_card_data.theme_id:
        raise HTTPException(HTTPStatus.BAD_REQUEST, "Bad request data")

    try:
        async with session.begin():

            return await theme_repository.add_theme_card(session=session, theme_card_data=theme_card_data)
    except ValidationError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, str(e))
    except ThemeNotFoundError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, e.message)
