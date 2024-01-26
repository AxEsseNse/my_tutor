from pydantic import BaseModel


class AddUserRequest(BaseModel):
    login: str
    password: str
    role: str


class AddUserResponse(BaseModel):
    login: str
    role: str
    message: str
