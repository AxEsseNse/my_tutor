from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.domain import Theme
from my_tutor.repositories import ThemeRepository
from my_tutor.routers import admin_router
from my_tutor.session import get_db_session

theme_repository = ThemeRepository()


@admin_router.get("/themes/", response_model=list[Theme])
async def get_themes(session: AsyncSession = Depends(get_db_session)) -> list[Theme]:

    return await theme_repository.get_themes(session=session)
