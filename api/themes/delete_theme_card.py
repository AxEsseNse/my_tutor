from http import HTTPStatus

from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import ThemeNotFoundError, DeleteImageError
from my_tutor.repositories import ThemeRepository
from my_tutor.routers import themes_router
from my_tutor.session import get_db_session
from my_tutor.schemes import DeleteThemeCardRequest, DeleteThemeCardResponse

theme_repository = ThemeRepository()


@themes_router.delete("/{theme_id:int}/cards/")
async def delete_theme_card(
        theme_id: int,
        theme_card_data: DeleteThemeCardRequest,
        session: AsyncSession = Depends(get_db_session)
) -> DeleteThemeCardResponse:

    if theme_id != theme_card_data.theme_id:
        raise HTTPException(HTTPStatus.BAD_REQUEST, "Bad request data")

    try:
        async with session.begin():

            return await theme_repository.delete_theme_card(session, theme_card_data=theme_card_data)
    except ThemeNotFoundError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)
    except DeleteImageError as e:
        raise HTTPException(HTTPStatus.INTERNAL_SERVER_ERROR, e.message)
