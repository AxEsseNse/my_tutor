from http import HTTPStatus

from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import LessonNotFoundError
from my_tutor.repositories import LessonRepository
from my_tutor.routers import lessons_router
from my_tutor.session import get_db_session
from my_tutor.schemes import DeleteLessonRequest, DeleteLessonResponse

lesson_repository = LessonRepository()


@lessons_router.delete("/{lesson_id:int}/")
async def delete_lesson(lesson_id: int, lesson_data: DeleteLessonRequest,
                       session: AsyncSession = Depends(get_db_session)) -> DeleteLessonResponse:
    if lesson_id != lesson_data.lesson_id:
        raise HTTPException(HTTPStatus.BAD_REQUEST, "Bad request data")

    try:
        async with session.begin():

            return await lesson_repository.delete_lesson(session, lesson_data=lesson_data)
    except LessonNotFoundError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)
