from pydantic import BaseModel, Field


class AddStudentRequest(BaseModel):
    student_login: str = Field(alias="studentLogin")
    first_name: str = Field(alias="firstName")
    second_name: str = Field(alias="secondName")
    gender: str
    lesson_price: int = Field(alias="lessonPrice")
    birthday: str
    discord: str
    phone: str
    telegram: str
    whatsapp: str = Field(alias="whatsApp")


class AddStudentResponse(BaseModel):
    student_login: str
    img_path: str
    second_name: str
    first_name: str
    gender: str
    birthday: str
    lesson_price: int
    discord: str
    phone: str
    telegram: str
    whatsapp: str
    message: str
