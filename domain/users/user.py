from pydantic import BaseModel

#from monas.constants import UserRole

#TODO заменить роль на константу
class User(BaseModel):
    login: str
    role: str