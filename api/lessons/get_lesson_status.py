from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.repositories import LessonRepository
from my_tutor.routers import lessons_router
from my_tutor.session import get_db_session
from my_tutor.schemes import GetLessonStatusResponse

lesson_repository = LessonRepository()


@lessons_router.get("/{lesson_id:int}/status/")
async def get_lesson_status(lesson_id: int, session: AsyncSession = Depends(get_db_session)) -> GetLessonStatusResponse:

    return await lesson_repository.get_lesson_status(session=session, lesson_id=lesson_id)
