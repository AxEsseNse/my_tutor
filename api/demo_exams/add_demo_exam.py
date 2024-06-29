from http import HTTPStatus

from fastapi import Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import DemoExamAlreadyExistError
from my_tutor.repositories import DemoExamRepository
from my_tutor.routers import demo_exams_router
from my_tutor.schemes import AddDemoExamRequest, AddDemoExamResponse
from my_tutor.session import get_db_session


demo_exam_repository = DemoExamRepository()


@demo_exams_router.post("/", status_code=HTTPStatus.CREATED)
async def add_demo_exam(demo_exam_data: AddDemoExamRequest, session: AsyncSession = Depends(get_db_session)) -> AddDemoExamResponse:
    try:
        async with session.begin():

            return await demo_exam_repository.add_demo_exam(session=session, demo_exam_data=demo_exam_data)
    except ValidationError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, str(e))
    except DemoExamAlreadyExistError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, e.message)
