from pydantic import BaseModel, Field


class AddThemeRequest(BaseModel):
    exam_id: int = Field(alias="examId")
    exam_task_number: int = Field(alias="examTaskNumber")
    title: str
    descr: str


class AddThemeResponse(BaseModel):
    theme_id: int
    exam: str
    exam_task_number: int
    title: str
    descr: str
    message: str
