from pydantic import BaseModel
from my_tutor.constants import UserRole


class User(BaseModel):
    login: str
    role: str
