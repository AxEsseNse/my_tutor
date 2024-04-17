from pydantic import BaseModel, Field


class UpdateStudentProgressRequest(BaseModel):
    theme_id: int = Field(alias="themeId")
    student_id: int = Field(alias="studentId")
    status: int | None = None
    date: str | None = None


class UpdateStudentProgressResponse(BaseModel):
    status: str
    date: str
    message: str
