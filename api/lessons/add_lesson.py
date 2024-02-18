from http import HTTPStatus

from fastapi import Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import LessonAlreadyExistError
from my_tutor.repositories import LessonRepository
from my_tutor.routers import lessons_router
from my_tutor.schemes import AddLessonRequest, AddLessonResponse
from my_tutor.session import get_db_session


lesson_repository = LessonRepository()


@lessons_router.post("/", status_code=HTTPStatus.CREATED)
async def add_lesson(lesson_data: AddLessonRequest, session: AsyncSession = Depends(get_db_session)) -> AddLessonResponse:
    try:
        async with session.begin():

            return await lesson_repository.add_lesson(session=session, lesson_data=lesson_data)
    except ValidationError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, str(e))
    except LessonAlreadyExistError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, e.message)
