from pydantic import BaseModel


class UploadImageResponse(BaseModel):
    image_path: str
