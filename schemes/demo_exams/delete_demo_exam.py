from pydantic import BaseModel


class DeleteDemoExamResponse(BaseModel):
    exam: str
    title: str
    descr: str
    message: str
