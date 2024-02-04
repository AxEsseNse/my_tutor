from http import HTTPStatus

from fastapi import Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import TutorAlreadyExistError, UserNotFoundError
from my_tutor.repositories import UserRepository, TutorRepository
from my_tutor.routers import admin_router
from my_tutor.schemes import AddTutorRequest, AddTutorResponse
from my_tutor.session import get_db_session


user_repository = UserRepository()
tutor_repository = TutorRepository()


@admin_router.post("/tutors/", status_code=HTTPStatus.CREATED)
async def add_tutor(tutor_data: AddTutorRequest, session: AsyncSession = Depends(get_db_session)) -> AddTutorResponse:
    try:
        async with session.begin():
            user_id = await user_repository.get_user_id_by_login(session=session, login=tutor_data.tutor_login)

            return await tutor_repository.add_tutor(session=session, tutor_data=tutor_data, user_id=user_id)
    except ValidationError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, str(e))
    except UserNotFoundError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, e.message)
    except TutorAlreadyExistError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, e.message)
