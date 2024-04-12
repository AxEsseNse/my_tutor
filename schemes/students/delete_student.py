from pydantic import BaseModel, Field


class DeleteStudentRequest(BaseModel):
    student_id: int = Field(alias="studentId")


class DeleteStudentResponse(BaseModel):
    name: str
    message: str
