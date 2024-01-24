from pydantic import BaseModel
from my_tutor.constants import UserRole

class UserInfo(BaseModel):
    login: str
    name: str
    surname: str
    img_path: str
    role: str

