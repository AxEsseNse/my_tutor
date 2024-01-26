from sqlalchemy import Integer, Column, String, ForeignKey, Sequence, Boolean
from my_tutor.models import Base
from sqlalchemy.orm import relationship


class UserModel(Base):
    __tablename__ = "users"

    id_seq = Sequence("users_user_id_seq")

    user_id = Column(Integer, primary_key=True)
    login = Column(String(length=25), nullable=False, unique=True)
    secret = Column(String, nullable=False)
    role_id = Column(Integer, ForeignKey(column="roles.role_id", ondelete="CASCADE"), nullable=False)
    have_profile = Column(Boolean, nullable=False)

    role = relationship("RoleModel")
    student = relationship("StudentModel", uselist=False)
