from http import HTTPStatus

from fastapi import Depends, HTTPException, UploadFile, File, Form, Request
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import StudentNotFoundError, StudentSaveImageError
from my_tutor.repositories import StudentRepository, UserRepository
from my_tutor.routers import students_router
from my_tutor.schemes import StudentImageResponse
from my_tutor.session import get_db_session

student_repository = StudentRepository()
user_repository = UserRepository()

@students_router.put("/student/{login}/image")
async def update_student_image(
    login: str,
    request: Request,
    student_data: UploadFile = File(...),
    session: AsyncSession = Depends(get_db_session)
) -> StudentImageResponse:
    header_login = request.headers['Login']
    if login != header_login:
        raise HTTPException(HTTPStatus.BAD_REQUEST, "Bad request data")

    try:
        async with session.begin():
            user_id = await user_repository.get_user_id_by_login(session=session, login=login)
            return await student_repository.change_image(session, student_data, login, user_id)
    except ValidationError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, str(e))
    except StudentNotFoundError as e:
        raise HTTPException(HTTPStatus.NOT_FOUND, e.message)
    except StudentSaveImageError as e:
        raise HTTPException(HTTPStatus.INTERNAL_SERVER_ERROR, e.message)
