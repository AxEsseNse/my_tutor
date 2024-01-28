from pydantic import BaseModel, Field


class AddThemeRequest(BaseModel):
    exam_id: int = Field(alias="examId")
    title: str
    descr: str


class AddThemeResponse(BaseModel):
    theme_id: int
    exam: str
    title: str
    descr: str
    message: str
