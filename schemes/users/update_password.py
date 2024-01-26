from pydantic import BaseModel


class UpdateUserPasswordRequest(BaseModel):
    login: str
    password: str


class UpdateUserPasswordResponse(BaseModel):
    login: str
    message: str
