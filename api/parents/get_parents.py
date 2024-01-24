from http import HTTPStatus


from fastapi import Depends, Cookie, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated
from my_tutor.domain import ParentInfo
from my_tutor.repositories import ParentRepository, UserRepository, StudentRepository
from my_tutor.routers import students_router
from my_tutor.session import get_db_session


user_repository = UserRepository()
student_repository = StudentRepository()
parent_repository = ParentRepository()
AUTH_TOKEN_NAME = "My-Tutor-Auth-Token"


@students_router.get("/parents", response_model=list[ParentInfo])
async def get_parents(
        token: Annotated[str | None, Cookie(alias=AUTH_TOKEN_NAME)] = None,
        session: AsyncSession = Depends(get_db_session)
):
    if token is None:
        raise HTTPException(HTTPStatus.UNAUTHORIZED, "Недостаточно прав для выполнения операции")
    async with session.begin():
        is_valid_token = await user_repository.valid_token(session=session, token=token)

        if not is_valid_token:
            raise HTTPException(HTTPStatus.UNAUTHORIZED, "Недостаточно прав для выполнения операции")
        try:
            user_id = await user_repository.get_user_id(session=session, token=token)
            student_id = await student_repository.get_student_id(session=session, user_id=user_id)
            parents = await parent_repository.get_parents(session=session, student_id=student_id)
        except Exception as error:
            print(error)
            raise HTTPException(HTTPStatus.REQUEST_TIMEOUT, f"Ошибка при работе с БД, {error}")
    print(parents)
    return parents
