from pydantic import BaseModel


class StudentImageResponse(BaseModel):
    img_path: str
    message: str
