from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.domain import ThemeStudyingStatus, StudentId
from my_tutor.repositories import StudentRepository
from my_tutor.routers import students_router
from my_tutor.session import get_db_session

student_repository = StudentRepository()


@students_router.get("/{student_id:int}/progress/{exam_id:int}/", response_model=list[ThemeStudyingStatus])
async def get_student_progress(student_id: int, exam_id: int, session: AsyncSession = Depends(get_db_session)) -> list[ThemeStudyingStatus]:

    return await student_repository.get_student_progress(session=session, student_id=student_id, exam_id=exam_id)


@students_router.get("/{user_id:int}/student-id/", response_model=StudentId)
async def get_my_student_id(user_id: int, session: AsyncSession = Depends(get_db_session)) -> StudentId:

    return await student_repository.get_my_student_id(session=session, user_id=user_id)
