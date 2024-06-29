from http import HTTPStatus

from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import DemoExamNotFoundError
from my_tutor.repositories import DemoExamRepository
from my_tutor.routers import demo_exams_router
from my_tutor.session import get_db_session
from my_tutor.schemes import DeleteDemoExamResponse

demo_exam_repository = DemoExamRepository()


@demo_exams_router.delete("/{demo_exam_id:int}/")
async def delete_demo_exam(demo_exam_id: int, session: AsyncSession = Depends(get_db_session)) -> DeleteDemoExamResponse:
    try:
        async with session.begin():

            return await demo_exam_repository.delete_demo_exam(session, demo_exam_id=demo_exam_id)
    except DemoExamNotFoundError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)
