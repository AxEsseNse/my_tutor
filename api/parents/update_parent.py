from http import HTTPStatus

from fastapi import Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import ParentNotFoundError
from my_tutor.repositories import ParentRepository
from my_tutor.routers import students_router
from my_tutor.schemes import UpdateParentRequest, UpdateParentResponse
from my_tutor.session import get_db_session

parent_repository = ParentRepository()


#@users_router.put("/{login:str}/")
@students_router.put("/parents/{login:str}/")
async def update_parent(
    login: str,
    parent_data: UpdateParentRequest,
    session: AsyncSession = Depends(get_db_session)
) -> UpdateParentResponse:
    if login != parent_data.student_login:
        raise HTTPException(HTTPStatus.BAD_REQUEST, "Bad request data")

    try:
        async with session.begin():
            return await parent_repository.update_parent(session, parent_data=parent_data)
    except ValidationError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, str(e))
    except ParentNotFoundError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)
