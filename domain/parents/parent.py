from pydantic import BaseModel

class ParentInfo(BaseModel):
    status: str
    first_name: str
    second_name: str
    phone: str
    telegram: str
    whatsapp: str
