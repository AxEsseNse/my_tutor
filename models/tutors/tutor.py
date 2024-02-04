from sqlalchemy import Integer, Column, String, ForeignKey, Sequence, DateTime
from my_tutor.models import Base


class TutorModel(Base):
    __tablename__ = "tutors"

    tutor_id_seq = Sequence("tutors_tutor_id_seq")

    student_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey(column="users.user_id", ondelete="CASCADE"), unique=True, nullable=False)
    first_name = Column(String(length=15), nullable=False)
    second_name = Column(String(length=25), nullable=False)
    gender = Column(String)
    img_path = Column(String)
    birthday = Column(DateTime, nullable=False)
    discord = Column(String(length=25), nullable=False)
    phone = Column(String(length=11), unique=True)
    telegram = Column(String(length=11), unique=True)
    whatsapp = Column(String(length=11), unique=True)
