from http import HTTPStatus

from fastapi import HTTPException, UploadFile, File, Request, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import ValidationError

from my_tutor.exceptions import SaveFileError
from my_tutor.repositories import FileRepository
from my_tutor.routers import themes_router
from my_tutor.schemes import UploadFileResponse
from my_tutor.session import get_db_session

file_repository = FileRepository()


@themes_router.post("/file/upload/")
async def theme_upload_file(request: Request, session: AsyncSession = Depends(get_db_session), file_data: UploadFile = File(...)) -> UploadFileResponse:
    header_path = request.headers['Path']
    try:
        async with session.begin():
            return await file_repository.save_file_to_storage(session=session, path=header_path, file_data=file_data)
    except ValidationError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, str(e))
    except SaveFileError as e:
        raise HTTPException(HTTPStatus.INTERNAL_SERVER_ERROR, e.message)
