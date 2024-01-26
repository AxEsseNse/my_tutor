from pydantic import BaseModel


class DeleteUserRequest(BaseModel):
    login: str


class DeleteUserResponse(BaseModel):
    login: str
    role: str
    message: str
