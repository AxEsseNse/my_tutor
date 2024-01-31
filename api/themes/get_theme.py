from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.domain import Lesson
from my_tutor.repositories import ThemeRepository
from my_tutor.routers import lessons_router
from my_tutor.session import get_db_session

theme_repository = ThemeRepository()


@lessons_router.get("/{theme_id:int}/", response_model=Lesson)
async def get_theme(theme_id: int, session: AsyncSession = Depends(get_db_session)) -> Lesson:

    return await theme_repository.get_theme(session=session, theme_id=theme_id)
