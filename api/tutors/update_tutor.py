from http import HTTPStatus

from fastapi import Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import TutorNotFoundError
from my_tutor.repositories import TutorRepository, UserRepository
from my_tutor.routers import tutors_router
from my_tutor.schemes import (
    UpdateTutorPrimaryInfoRequest,
    UpdateTutorPrimaryInfoResponse,
    UpdateTutorContactInfoRequest,
    UpdateTutorContactInfoResponse
)
from my_tutor.session import get_db_session

user_repository = UserRepository()
tutor_repository = TutorRepository()


@tutors_router.put("/tutor/{login:str}/")
async def update_tutor(
    login: str,
    tutor_data: UpdateTutorPrimaryInfoRequest | UpdateTutorContactInfoRequest,
    session: AsyncSession = Depends(get_db_session)
) -> UpdateTutorPrimaryInfoResponse | UpdateTutorContactInfoResponse:

    if login != tutor_data.login:
        raise HTTPException(HTTPStatus.BAD_REQUEST, "Bad request data")

    try:
        async with session.begin():
            user_id = await user_repository.get_user_id_by_login(session=session, login=login)
            match tutor_data:
                case UpdateTutorPrimaryInfoRequest():
                    return await tutor_repository.update_primary_info(session=session, tutor_data=tutor_data, user_id=user_id)
                case UpdateTutorContactInfoRequest():
                    return await tutor_repository.update_contact_info(session=session, tutor_data=tutor_data, user_id=user_id)
                case _:
                    raise HTTPException(HTTPStatus.BAD_REQUEST, "Bad request data")
    except ValidationError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, str(e))
    except TutorNotFoundError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)
