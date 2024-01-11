from sqlalchemy import Integer, Column, String

from my_tutor.models import Base


class RoleModel(Base):
    __tablename__ = 'roles'

    role_id = Column(Integer, primary_key=True)
    title = Column(String(length=7), nullable=False)
