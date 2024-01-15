from pydantic import BaseModel


class ChangeUserPasswordRequest(BaseModel):
    login: str
    password: str