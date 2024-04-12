from http import HTTPStatus

from fastapi import HTTPException, UploadFile, File, Request
from pydantic import ValidationError

from my_tutor.exceptions import SaveImageError
from my_tutor.repositories import ThemeRepository
from my_tutor.routers import themes_router
from my_tutor.schemes import UploadImageResponse

theme_repository = ThemeRepository()


@themes_router.post("/image/upload/")
async def theme_upload_image(request: Request, image_data: UploadFile = File(...)) -> UploadImageResponse:
    header_path = request.headers['Path']
    try:

        return await theme_repository.save_image_to_file(path=header_path, image_data=image_data)
    except ValidationError as e:
        raise HTTPException(HTTPStatus.BAD_REQUEST, str(e))
    except SaveImageError as e:
        raise HTTPException(HTTPStatus.INTERNAL_SERVER_ERROR, e.message)
