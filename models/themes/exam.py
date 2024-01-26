from sqlalchemy import Integer, Column, String, Sequence
from my_tutor.models import Base


class ExamModel(Base):
    __tablename__ = "exams"

    id_seq = Sequence("exams_exam_id_seq")

    exam_id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
