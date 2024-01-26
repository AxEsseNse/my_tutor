from pydantic import BaseModel


class AddThemeRequest(BaseModel):
    exam_id: int
    title: str
    descr: str


class AddThemeResponse(BaseModel):
    exam: str
    title: str
    descr: str
    message: str
