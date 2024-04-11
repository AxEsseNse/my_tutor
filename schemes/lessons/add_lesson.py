from pydantic import BaseModel, Field


class AddLessonRequest(BaseModel):
    tutor_id: int = Field(alias="lessonTutorId")
    student_id: int = Field(alias="lessonStudentId")
    theme_id: int = Field(alias="lessonThemeId")
    date: str = Field(alias="lessonDate")


class AddLessonResponse(BaseModel):
    tutor: str
    student: str
    exam: str
    exam_task_number: int
    theme_title: str
    date: str
    message: str
