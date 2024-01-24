from http import HTTPStatus

from fastapi import Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import ParentAlreadyExistError, StudentNotFoundError
from my_tutor.repositories import ParentRepository
from my_tutor.routers import students_router
from my_tutor.schemes import DeleteParentRequest, DeleteParentResponse
from my_tutor.session import get_db_session

parent_repository = ParentRepository()


@students_router.delete("/parents/{login:str}/")
async def delete_parent(parent_data: DeleteParentRequest, session: AsyncSession = Depends(get_db_session)) -> DeleteParentResponse:
    try:
        async with session.begin():
            return await parent_repository.delete_parent(session=session, parent_data=parent_data)
    except ValidationError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, str(e))
    except StudentNotFoundError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, e.message)
    except ParentAlreadyExistError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, e.message)
