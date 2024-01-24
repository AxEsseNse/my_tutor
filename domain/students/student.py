from pydantic import BaseModel

class StudentInfo(BaseModel):
    login: str
    first_name: str
    second_name: str
    gender: str
    birthday: str
    lesson_price: int
    img_path: str
    discord: str
    phone: str
    telegram: str
    whatsapp: str
