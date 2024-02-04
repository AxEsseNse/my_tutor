from http import HTTPStatus

from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import UserNotFoundError, TutorNotFoundError
from my_tutor.domain import TutorInfo
from my_tutor.repositories import UserRepository, TutorRepository
from my_tutor.routers import students_router
from my_tutor.session import get_db_session

user_repository = UserRepository()
tutor_repository = TutorRepository()


@students_router.get("/tutor/{login:str}/", response_model=TutorInfo)
async def get_tutor_info(login: str, session: AsyncSession = Depends(get_db_session)):
    try:
        user_id = await user_repository.get_user_id_by_login(session=session, login=login)

        return await tutor_repository.get_tutor_info(session=session, user_id=user_id, login=login)
    except UserNotFoundError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)
    except TutorNotFoundError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)
