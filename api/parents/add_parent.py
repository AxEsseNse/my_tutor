from http import HTTPStatus

from fastapi import Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import ParentAlreadyExistError, StudentNotFoundError
from my_tutor.repositories import UserRepository, ParentRepository, StudentRepository
from my_tutor.routers import students_router
from my_tutor.schemes import AddParentRequest, AddParentResponse
from my_tutor.session import get_db_session


user_repository = UserRepository()
student_repository = StudentRepository()
parent_repository = ParentRepository()


@students_router.post("/parents", status_code=HTTPStatus.CREATED)
async def add_parent(parent_data: AddParentRequest, session: AsyncSession = Depends(get_db_session)) -> AddParentResponse:
    try:
        async with session.begin():
            user_id = await user_repository.get_user_id_by_login(session=session, login=parent_data.student_login)
            student_id = await student_repository.get_student_id(session=session, user_id=user_id)

            return await parent_repository.add_parent(session=session, parent_data=parent_data, student_id=student_id)
    except ValidationError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, str(e))
    except StudentNotFoundError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, e.message)
    except ParentAlreadyExistError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, e.message)
