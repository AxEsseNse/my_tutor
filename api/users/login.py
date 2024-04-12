from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import UserNotFoundError, UserNotVerifyError
from my_tutor.repositories import UserRepository
from my_tutor.routers import api_router
from my_tutor.schemes import UserAuthorizationRequest
from my_tutor.session import get_db_session

user_repository = UserRepository()


@api_router.post("/login")
async def login(user: UserAuthorizationRequest, session: AsyncSession = Depends(get_db_session)):
    try:
        async with session.begin():
            return await user_repository.authorize(session, user_auth_data=user)
    except (UserNotFoundError, UserNotVerifyError) as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=e.message)
