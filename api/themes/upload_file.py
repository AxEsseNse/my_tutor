from http import HTTPStatus

from fastapi import HTTPException, UploadFile, File, Request
from pydantic import ValidationError

from my_tutor.exceptions import SaveFileError
from my_tutor.repositories import ThemeRepository
from my_tutor.routers import themes_router
from my_tutor.schemes import UploadFileResponse

theme_repository = ThemeRepository()


@themes_router.post("/file/upload/")
async def theme_upload_file(request: Request, file_data: UploadFile = File(...)) -> UploadFileResponse:
    header_path = request.headers['Path']
    try:

        return await theme_repository.save_file_to_storage(path=header_path, file_data=file_data)
    except ValidationError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, str(e))
    except SaveFileError as e:
        raise HTTPException(HTTPStatus.INTERNAL_SERVER_ERROR, e.message)
