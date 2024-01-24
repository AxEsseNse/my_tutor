from pydantic import BaseModel, Field


class DeleteParentRequest(BaseModel):
    student_login: str = Field(alias="studentLogin")
    phone: str


class DeleteParentResponse(BaseModel):
    first_name: str
    second_name: str
    message: str
