from pydantic import BaseModel, Field


class UpdateStudentAnswersRequest(BaseModel):
    lesson_id: int = Field(alias="lessonId")
    theme_id: int = Field(alias="themeId")
    student_id: int = Field(alias="studentId")
    student_answers: dict = Field(alias="studentAnswers")


class UpdateStudentAnswersResponse(BaseModel):
    message: str
