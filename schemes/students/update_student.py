from pydantic import BaseModel, Field


class UpdateStudentRequest(BaseModel):
    student_id: int = Field(alias="studentId")
    first_name: str = Field(alias="firstName")
    second_name: str = Field(alias="secondName")
    gender: str
    lesson_price: int = Field(alias="lessonPrice")
    birthday: str
    discord: str
    phone: str
    telegram: str
    whatsapp: str


class UpdateStudentResponse(BaseModel):
    student_id: int
    img_path: str
    first_name: str
    second_name: str
    gender: str
    lesson_price: int
    birthday: str
    discord: str
    phone: str
    telegram: str
    whatsapp: str
    message: str
