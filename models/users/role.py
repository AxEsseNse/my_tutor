from sqlalchemy import Integer, Column, String, Sequence

from my_tutor.models import Base


class RoleModel(Base):
    __tablename__ = 'roles'

    role_id_seq = Sequence("roles_role_id_seq")

    role_id = Column(Integer, primary_key=True)
    title = Column(String(length=13), nullable=False)
