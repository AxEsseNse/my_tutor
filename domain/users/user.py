from pydantic import BaseModel


class User(BaseModel):
    login: str
    role: str
    have_profile: bool


class UserLogin(BaseModel):
    login: str


class UserInfo(BaseModel):
    login: str
    img_path: str
    name: str
    role: str
