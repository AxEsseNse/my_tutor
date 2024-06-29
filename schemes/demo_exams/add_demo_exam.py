from pydantic import BaseModel, Field


class AddDemoExamRequest(BaseModel):
    exam_id: int = Field(alias="examId")
    title: str
    descr: str


class AddDemoExamResponse(BaseModel):
    demo_exam_id: int
    exam: str
    title: str
    descr: str
    message: str
