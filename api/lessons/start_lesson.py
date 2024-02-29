from http import HTTPStatus

from fastapi import Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import LessonNotFoundError
from my_tutor.repositories import LessonRepository
from my_tutor.routers import lessons_router
from my_tutor.session import get_db_session
from my_tutor.schemes import StartLessonResponse
from my_tutor.celery_app import auto_finish_lesson

lesson_repository = LessonRepository()


@lessons_router.put("/{lesson_id:int}/start/")
async def start_lesson(
    lesson_id: int,
    session: AsyncSession = Depends(get_db_session)
) -> StartLessonResponse:
    try:
        async with session.begin():
            response = await lesson_repository.start_lesson(session, lesson_id=lesson_id)
            auto_finish_lesson.apply_async((lesson_id,), countdown=7200)

            return response
    except ValidationError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, str(e))
    except LessonNotFoundError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)
