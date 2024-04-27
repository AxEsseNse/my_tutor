from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.domain import ThemeInfo, ThemeOption
from my_tutor.repositories import ThemeRepository
from my_tutor.routers import themes_router
from my_tutor.session import get_db_session

theme_repository = ThemeRepository()


@themes_router.get("/exam/{exam_id:int}/", response_model=list[ThemeInfo])
async def get_exam_themes(exam_id: int, session: AsyncSession = Depends(get_db_session)) -> list[ThemeInfo]:

    return await theme_repository.get_exam_themes(session=session, exam_id=exam_id)


@themes_router.get("/exam/{exam_id:int}/options/", response_model=list[ThemeOption])
async def get_exam_themes_options(exam_id: int, session: AsyncSession = Depends(get_db_session)) -> list[ThemeOption]:

    return await theme_repository.get_exam_themes_options(session=session, exam_id=exam_id)
