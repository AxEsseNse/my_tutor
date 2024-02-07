from http import HTTPStatus

from fastapi import Depends, HTTPException, UploadFile, File, Request
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import TutorNotFoundError, TutorSaveImageError
from my_tutor.repositories import TutorRepository, UserRepository
from my_tutor.routers import tutors_router
from my_tutor.schemes import UpdateTutorImageResponse
from my_tutor.session import get_db_session

user_repository = UserRepository()
tutor_repository = TutorRepository()


@tutors_router.put("/tutor/image/{login}/")
async def update_tutor_image(
    login: str,
    request: Request,
    image_data: UploadFile = File(...),
    session: AsyncSession = Depends(get_db_session)
) -> UpdateTutorImageResponse:
    header_login = request.headers['Login']

    if login != header_login:
        raise HTTPException(HTTPStatus.BAD_REQUEST, "Bad request data")

    try:
        async with session.begin():
            user_id = await user_repository.get_user_id_by_login(session=session, login=login)

            return await tutor_repository.change_image(session=session, image_data=image_data, login=login, user_id=user_id)
    except ValidationError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, str(e))
    except TutorNotFoundError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)
    except TutorSaveImageError as e:
        raise HTTPException(HTTPStatus.INTERNAL_SERVER_ERROR, e.message)
