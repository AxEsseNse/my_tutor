from typing import Annotated

from http import HTTPStatus
from fastapi import Depends, HTTPException, Cookie
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.domain import Theme, ThemeDemo
from my_tutor.repositories import ThemeRepository, UserRepository, StudentRepository
from my_tutor.routers import themes_router
from my_tutor.session import get_db_session
from my_tutor.exceptions import ThemeNotFoundError

theme_repository = ThemeRepository()
user_repository = UserRepository()
student_repository = StudentRepository()

AUTH_TOKEN_NAME = "My-Tutor-Auth-Token"


def _to_theme_demo(theme: Theme, progress_cards: dict) -> ThemeDemo:
    return ThemeDemo(
        theme=theme,
        progress_cards=progress_cards
    )


@themes_router.get("/{theme_id:int}/{user_id:int}/", response_model=ThemeDemo)
async def get_theme(
    theme_id: int,
    user_id: int,
    token: Annotated[str | None, Cookie(alias=AUTH_TOKEN_NAME)] = None,
    session: AsyncSession = Depends(get_db_session)
) -> ThemeDemo:
    try:
        user = await user_repository.get_user_info(session=session, token=token)
        theme = await theme_repository.get_theme(session=session, theme_id=theme_id)

        if user.role == "Студент":
            student_id = await student_repository.get_student_id(session=session, user_id=user_id)
            progress_cards = await theme_repository.get_theme_student_progress(session=session, theme_id=theme_id, student_id=student_id)
        else:
            progress_cards = dict()

        return _to_theme_demo(theme=theme, progress_cards=progress_cards)
    except ThemeNotFoundError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)
