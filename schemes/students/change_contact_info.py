from pydantic import BaseModel


class ChangeStudentContactInfoRequest(BaseModel):
    login: str
    discord: str
    phone: str
    telegram: str
    whatsapp: str


class StudentContactInfoResponse(BaseModel):
    discord: str
    phone: str
    telegram: str
    whatsapp: str
    message: str
