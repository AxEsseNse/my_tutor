from pydantic import BaseModel


class UpdateTutorContactInfoRequest(BaseModel):
    login: str
    discord: str
    phone: str
    telegram: str
    whatsapp: str


class UpdateTutorContactInfoResponse(BaseModel):
    discord: str
    phone: str
    telegram: str
    whatsapp: str
    message: str
