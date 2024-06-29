from pydantic import BaseModel


class DeleteDemoExamResponse(BaseModel):
    exam: str
    title: str
    message: str
