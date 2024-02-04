from pydantic import BaseModel


class DeleteTutorRequest(BaseModel):
    phone: str


class DeleteTutorResponse(BaseModel):
    name: str
    message: str
