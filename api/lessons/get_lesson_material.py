from http import HTTPStatus
from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from my_tutor.repositories import ThemeRepository, LessonRepository
from my_tutor.routers import lessons_router
from my_tutor.session import get_db_session
from my_tutor.exceptions import ThemeNotFoundError
from my_tutor.domain import Theme, Lesson

theme_repository = ThemeRepository()
lesson_repository = LessonRepository()


def _to_lesson(theme: Theme, student_id: int, progress_cards: dict) -> Lesson:
    return Lesson(
        student_id=student_id,
        progress_cards=progress_cards,
        theme=theme
    )


@lessons_router.get("/{lesson_id:int}/material/", response_model=Lesson)
async def get_lesson_material(lesson_id: int, session: AsyncSession = Depends(get_db_session)) -> Lesson:
    try:
        theme_id, student_id = await lesson_repository.get_lesson_theme_id(session=session, lesson_id=lesson_id)
        theme = await theme_repository.get_theme(session=session, theme_id=theme_id)
        progress_cards = await theme_repository.get_theme_student_progress(session=session, theme_id=theme_id, student_id=student_id)
        return _to_lesson(student_id=student_id, theme=theme, progress_cards=progress_cards)
    except ThemeNotFoundError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)
