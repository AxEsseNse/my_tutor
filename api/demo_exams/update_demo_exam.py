from http import HTTPStatus

from fastapi import Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import DemoExamNotFoundError
from my_tutor.repositories import DemoExamRepository
from my_tutor.routers import demo_exams_router
from my_tutor.schemes import UpdateDemoExamRequest, UpdateDemoExamResponse
from my_tutor.session import get_db_session

demo_exam_repository = DemoExamRepository()


@demo_exams_router.put("/{demo_exam_id:int}/")
async def update_demo_exam(
    demo_exam_id: int,
    demo_exam_data: UpdateDemoExamRequest,
    session: AsyncSession = Depends(get_db_session)
) -> UpdateDemoExamResponse:
    if demo_exam_id != demo_exam_data.demo_exam_id:
        raise HTTPException(HTTPStatus.BAD_REQUEST, "Bad request data")

    try:
        async with session.begin():

            return await demo_exam_repository.update_demo_exam(session=session, demo_exam_data=demo_exam_data)
    except ValidationError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, str(e))
    except DemoExamNotFoundError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)
