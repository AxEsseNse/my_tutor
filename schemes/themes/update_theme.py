from pydantic import BaseModel, Field


class UpdateThemeRequest(BaseModel):
    theme_id: int = Field(alias="themeId")
    exam_id: int = Field(alias="examId")
    title: str
    descr: str


class UpdateThemeResponse(BaseModel):
    theme_id: int
    exam: str
    title: str
    descr: str
    message: str
