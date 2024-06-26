from pydantic import BaseModel, Field


class UpdateThemeRequest(BaseModel):
    demo_exam_id: int = Field(alias="demoExamId")
    exam_id: int = Field(alias="examId")
    title: str
    descr: str


class UpdateThemeResponse(BaseModel):
    theme_id: int
    exam: str
    title: str
    descr: str
    message: str
