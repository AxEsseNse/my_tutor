from http import HTTPStatus

from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import DemoExamNotFoundError, DemoExamTaskNotFoundError, DeleteFileError
from my_tutor.repositories import DemoExamRepository, FileRepository
from my_tutor.routers import demo_exams_router
from my_tutor.session import get_db_session
from my_tutor.schemes import DeleteDemoExamTaskResponse

demo_exam_repository = DemoExamRepository()
file_repository = FileRepository()


@demo_exams_router.delete("/{demo_exam_id:int}/tasks/{task_number:str}/")
async def delete_demo_exam_task(
        demo_exam_id: int,
        task_number: str,
        session: AsyncSession = Depends(get_db_session)
) -> DeleteDemoExamTaskResponse:
    try:
        async with session.begin():

            return await demo_exam_repository.delete_demo_exam_task(session, demo_exam_id=demo_exam_id, task_number=task_number, file_repository=file_repository)
    except (DemoExamNotFoundError, DemoExamTaskNotFoundError) as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)
    except DeleteFileError as e:
        raise HTTPException(HTTPStatus.INTERNAL_SERVER_ERROR, e.message)
