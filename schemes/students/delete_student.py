from pydantic import BaseModel


class DeleteStudentRequest(BaseModel):
    phone: str


class DeleteStudentResponse(BaseModel):
    name: str
    message: str
