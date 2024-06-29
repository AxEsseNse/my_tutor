from sqlalchemy import Integer, Column, String, ForeignKey, Sequence
from my_tutor.models import Base
from sqlalchemy.dialects.postgresql import JSONB


class DemoExamModel(Base):
    __tablename__ = "demo_exams"

    demo_exam_id_seq = Sequence("demo_exams_demo_exam_id_seq")
    demo_exam_task_id_seq = Sequence("demo_exams_demo_exam_task_id_seq")

    demo_exam_id = Column(Integer, primary_key=True)
    exam_id = Column(Integer, ForeignKey(column="exams.exam_id"), nullable=False)
    title = Column(String, nullable=False)
    descr = Column(String, nullable=False)
    material = Column(JSONB, server_default="{}")
    answers = Column(JSONB, server_default="{}")
