from http import HTTPStatus

from fastapi import Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import DemoExamNotFoundError, DemoExamTaskAlreadyExistError
from my_tutor.repositories import DemoExamRepository
from my_tutor.routers import demo_exams_router
from my_tutor.schemes import (
    AddDemoExamTaskRequest,
    AddDemoExamTaskResponse
)
from my_tutor.session import get_db_session


demo_exam_repository = DemoExamRepository()


@demo_exams_router.post("/{demo_exam_id:int}/", status_code=HTTPStatus.CREATED)
async def add_demo_exam_task(
    demo_exam_id: int,
    demo_exam_task_data: AddDemoExamTaskRequest,
    session: AsyncSession = Depends(get_db_session)
) -> AddDemoExamTaskResponse:

    if demo_exam_id != demo_exam_task_data.demo_exam_id:
        raise HTTPException(HTTPStatus.BAD_REQUEST, "Bad request data")

    try:
        async with session.begin():

            return await demo_exam_repository.add_demo_exam_task(session=session, demo_exam_task_data=demo_exam_task_data)
    except ValidationError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, str(e))
    except (DemoExamNotFoundError, DemoExamTaskAlreadyExistError) as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, e.message)
