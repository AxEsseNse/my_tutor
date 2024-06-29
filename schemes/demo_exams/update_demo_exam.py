from pydantic import BaseModel, Field


class UpdateDemoExamRequest(BaseModel):
    demo_exam_id: int = Field(alias="demoExamId")
    exam_id: int = Field(alias="examId")
    title: str
    descr: str


class UpdateDemoExamResponse(BaseModel):
    exam: str
    title: str
    descr: str
    message: str
