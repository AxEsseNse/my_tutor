from http import HTTPStatus

from fastapi import Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import LessonNotFoundError
from my_tutor.repositories import LessonRepository
from my_tutor.routers import lessons_router
from my_tutor.schemes import FinishLessonRequest, FinishLessonResponse, PaidLessonRequest, PaidLessonResponse
from my_tutor.session import get_db_session

lesson_repository = LessonRepository()


@lessons_router.put("/{lesson_id:int}/")
async def update_lesson(
    lesson_id: int,
    lesson_data: FinishLessonRequest | PaidLessonRequest,
    session: AsyncSession = Depends(get_db_session)
) -> FinishLessonResponse | PaidLessonResponse:
    if lesson_id != lesson_data.lesson_id:
        raise HTTPException(HTTPStatus.BAD_REQUEST, "Bad request data")

    try:
        async with session.begin():
            match lesson_data:
                case FinishLessonRequest():
                    print(FinishLessonRequest)
                    return await lesson_repository.finish_lesson(session=session, lesson_data=lesson_data)
                case PaidLessonRequest():
                    return await lesson_repository.set_paid_status_lesson(session=session, lesson_data=lesson_data)
    except ValidationError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, str(e))
    except LessonNotFoundError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)
