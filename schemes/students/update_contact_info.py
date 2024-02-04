from pydantic import BaseModel


class UpdateStudentContactInfoRequest(BaseModel):
    login: str
    discord: str
    phone: str
    telegram: str
    whatsapp: str


class UpdateStudentContactInfoResponse(BaseModel):
    discord: str
    phone: str
    telegram: str
    whatsapp: str
    message: str
