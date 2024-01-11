from sqlalchemy import Integer, Column, String, ForeignKey
from my_tutor.models import Base


class UserModel(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True)
    login = Column(String(length=25), nullable=False, unique=True)
    secret = Column(String(), nullable=False)
    role_id = Column(Integer, ForeignKey(column="roles.role_id", ondelete="CASCADE"), nullable=False)
