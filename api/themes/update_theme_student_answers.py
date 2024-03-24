from http import HTTPStatus

from fastapi import Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import ThemeNotFoundError, LessonNotFoundError
from my_tutor.repositories import ThemeRepository
from my_tutor.routers import themes_router
from my_tutor.schemes import UpdateStudentAnswersRequest, UpdateStudentAnswersResponse
from my_tutor.session import get_db_session

theme_repository = ThemeRepository()


@themes_router.put("/{theme_id:int}/student-answers/{student_id:int}/")
async def update_theme_student_answers(
    theme_id: int,
    student_id: int,
    lesson_data: UpdateStudentAnswersRequest,
    session: AsyncSession = Depends(get_db_session)
) -> UpdateStudentAnswersResponse:
    if theme_id != lesson_data.theme_id and student_id != lesson_data.student_id:
        raise HTTPException(HTTPStatus.BAD_REQUEST, "Bad request data")

    try:
        async with session.begin():

            return await theme_repository.update_theme_student_answers(session, lesson_data=lesson_data)
    except ValidationError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, str(e))
    except (ThemeNotFoundError, LessonNotFoundError) as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)
