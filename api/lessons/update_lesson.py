from http import HTTPStatus

from fastapi import Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import (
    LessonNotFoundError,
    TutorAlreadyHasLesson,
    StudentAlreadyHasLesson,
    LessonAlreadyStarted
)
from my_tutor.repositories import LessonRepository
from my_tutor.routers import lessons_router
from my_tutor.schemes import (
    FinishLessonRequest,
    FinishLessonResponse,
    ChangeLessonPaidStatusRequest,
    ChangeLessonPaidStatusResponse,
    CancelLessonRequest,
    CancelLessonResponse,
    RescheduleLessonRequest,
    RescheduleLessonResponse,
    UpdateNoteLessonRequest,
    UpdateNoteLessonResponse,
    UpdateThemeLessonRequest,
    UpdateThemeLessonResponse
)
from my_tutor.session import get_db_session

lesson_repository = LessonRepository()


@lessons_router.put("/{lesson_id:int}/")
async def update_lesson(
    lesson_id: int,
    lesson_data: FinishLessonRequest | UpdateNoteLessonRequest | UpdateThemeLessonRequest | ChangeLessonPaidStatusRequest | CancelLessonRequest | RescheduleLessonRequest,
    session: AsyncSession = Depends(get_db_session)
) -> FinishLessonResponse | UpdateNoteLessonResponse | UpdateThemeLessonResponse | CancelLessonResponse | RescheduleLessonResponse | ChangeLessonPaidStatusResponse:
    if lesson_id != lesson_data.lesson_id:
        raise HTTPException(HTTPStatus.BAD_REQUEST, "Bad request data")

    try:
        async with session.begin():
            match lesson_data:
                case FinishLessonRequest():
                    return await lesson_repository.finish_lesson(session=session, lesson_data=lesson_data)
                case UpdateNoteLessonRequest():
                    return await lesson_repository.update_lesson_note(session=session, lesson_data=lesson_data)
                case UpdateThemeLessonRequest():
                    return await lesson_repository.update_lesson_theme(session=session, lesson_data=lesson_data)
                case CancelLessonRequest():
                    return await lesson_repository.cancel_lesson(session=session, lesson_data=lesson_data)
                case RescheduleLessonRequest():
                    return await lesson_repository.reschedule_lesson(session=session, lesson_data=lesson_data)
                case ChangeLessonPaidStatusRequest():
                    return await lesson_repository.change_paid_status_lesson(session=session, lesson_data=lesson_data)

    except ValidationError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, str(e))
    except LessonNotFoundError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)
    except (TutorAlreadyHasLesson, StudentAlreadyHasLesson, LessonAlreadyStarted) as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, e.message)
