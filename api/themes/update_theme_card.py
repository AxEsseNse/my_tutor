from http import HTTPStatus

from fastapi import Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import ThemeNotFoundError, ThemeCardNotFoundError, DeleteImageError
from my_tutor.repositories import ThemeRepository
from my_tutor.routers import themes_router
from my_tutor.schemes import UpdateThemeTheoryCardRequest, UpdateThemePracticeCardRequest, UpdateThemeCardResponse
from my_tutor.session import get_db_session

theme_repository = ThemeRepository()


@themes_router.put("/{theme_id:int}/cards/")
async def update_theme_card(
    theme_id: int,
    theme_card_data: UpdateThemePracticeCardRequest | UpdateThemeTheoryCardRequest,
    session: AsyncSession = Depends(get_db_session)
) -> UpdateThemeCardResponse:

    if theme_id != theme_card_data.theme_id:
        raise HTTPException(HTTPStatus.BAD_REQUEST, "Bad request data")

    try:
        async with session.begin():

            return await theme_repository.update_theme_card(session, theme_card_data=theme_card_data)
    except ValidationError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, str(e))
    except ThemeNotFoundError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)
    except ThemeCardNotFoundError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)
    except DeleteImageError as e:
        print(e)
        print('XUY')
        raise HTTPException(HTTPStatus.INTERNAL_SERVER_ERROR, e.message)
