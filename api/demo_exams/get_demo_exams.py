from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.domain import DemoExamInfo
from my_tutor.repositories import DemoExamRepository
from my_tutor.routers import demo_exams_router
from my_tutor.session import get_db_session

demo_exams_repository = DemoExamRepository()


@demo_exams_router.get("/", response_model=list[DemoExamInfo])
async def get_demo_exams(session: AsyncSession = Depends(get_db_session)) -> list[DemoExamInfo]:

    return await demo_exams_repository.get_demo_exams(session=session)
