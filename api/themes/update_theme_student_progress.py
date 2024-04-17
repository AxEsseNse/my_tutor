from http import HTTPStatus

from fastapi import Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import ThemeNotFoundError, LessonNotFoundError, ThemeProgressFoundError
from my_tutor.repositories import ThemeRepository
from my_tutor.routers import themes_router
from my_tutor.schemes import UpdateStudentProgressRequest, UpdateStudentProgressResponse
from my_tutor.session import get_db_session

theme_repository = ThemeRepository()


@themes_router.put("/{theme_id:int}/student-progress/{student_id:int}/")
async def update_theme_student_progress(
    theme_id: int,
    student_id: int,
    theme_data: UpdateStudentProgressRequest,
    session: AsyncSession = Depends(get_db_session)
) -> UpdateStudentProgressResponse:
    if theme_id != theme_data.theme_id or student_id != theme_data.student_id:
        raise HTTPException(HTTPStatus.BAD_REQUEST, "Bad request data")

    try:
        async with session.begin():

            return await theme_repository.update_theme_student_progress(session, theme_data=theme_data)
    except ValidationError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, str(e))
    except (ThemeNotFoundError, LessonNotFoundError, ThemeProgressFoundError) as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)
