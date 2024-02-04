from pydantic import BaseModel


class UpdateTutorImageResponse(BaseModel):
    img_path: str
    message: str
