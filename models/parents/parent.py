from sqlalchemy import Integer, Column, String, Sequence, ForeignKey
from my_tutor.models import Base


class ParentModel(Base):
    __tablename__ = "parents"

    parent_id_seq = Sequence("parents_parent_id_seq")

    parent_id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey(column="students.student_id", ondelete="CASCADE"), nullable=False)
    status = Column(String(length=6), nullable=False)
    first_name = Column(String(length=15), nullable=False)
    second_name = Column(String(length=25))
    phone = Column(String(length=11), unique=True)
    telegram = Column(String(length=11), unique=True)
    whatsapp = Column(String(length=11), unique=True)
    node = Column(String)
