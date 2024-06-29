from http import HTTPStatus

from fastapi import Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import DemoExamNotFoundError, DemoExamTaskNotFoundError, DeleteFileError
from my_tutor.repositories import DemoExamRepository, FileRepository
from my_tutor.routers import demo_exams_router
from my_tutor.schemes import UpdateDemoExamTaskRequest, UpdateDemoExamTaskResponse
from my_tutor.session import get_db_session

demo_exam_repository = DemoExamRepository()
file_repository = FileRepository()


@demo_exams_router.put("/{demo_exam_id:int}/tasks/{task_number:str}/")
async def update_demo_exam_task(
    demo_exam_id: int,
    task_number: str,
    demo_exam_task_data: UpdateDemoExamTaskRequest,
    session: AsyncSession = Depends(get_db_session)
) -> UpdateDemoExamTaskResponse:

    if demo_exam_id != demo_exam_task_data.demo_exam_id or task_number != demo_exam_task_data.task_number:
        raise HTTPException(HTTPStatus.BAD_REQUEST, "Bad request data")

    try:
        async with session.begin():

            return await demo_exam_repository.update_demo_exam_task(session, demo_exam_task_data=demo_exam_task_data, file_repository=file_repository)
    except ValidationError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, str(e))
    except DemoExamNotFoundError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)
    except DemoExamTaskNotFoundError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)
    except DeleteFileError as e:
        raise HTTPException(HTTPStatus.INTERNAL_SERVER_ERROR, e.message)
