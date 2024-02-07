from pydantic import BaseModel


class UpdateStudentImageResponse(BaseModel):
    img_path: str
    message: str
