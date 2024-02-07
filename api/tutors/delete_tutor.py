from http import HTTPStatus

from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import TutorNotFoundError
from my_tutor.repositories import TutorRepository
from my_tutor.routers import admin_router
from my_tutor.session import get_db_session
from my_tutor.schemes import DeleteTutorRequest, DeleteTutorResponse

tutor_repository = TutorRepository()


@admin_router.delete("/tutors/{phone:str}/")
async def delete_tutor(phone: str, tutor_data: DeleteTutorRequest, session: AsyncSession = Depends(get_db_session)) -> DeleteTutorResponse:
    if phone != tutor_data.phone:
        raise HTTPException(HTTPStatus.BAD_REQUEST, "Bad request data")

    try:
        async with session.begin():
            return await tutor_repository.delete_tutor(session, tutor_data=tutor_data)
    except TutorNotFoundError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)
