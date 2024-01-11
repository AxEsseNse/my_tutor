from pydantic import BaseModel


class UserAuthorizationRequest(BaseModel):
    login: str
    password: str
