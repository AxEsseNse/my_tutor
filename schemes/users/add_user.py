from pydantic import BaseModel


class AddUserRequest(BaseModel):
    login: str
    password: str
    role: str


class AddUserResponse(BaseModel):
    login: str
    have_profile: bool = False
    role: str
    message: str
