"""create users table

Revision ID: 2ccfc8173544
Revises: 
Create Date: 2024-01-04 20:58:23.129531

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID

# revision identifiers, used by Alembic.
revision: str = '2ccfc8173544'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

BEGIN_ADMIN_LOGIN = "admin"
BEGIN_ADMIN_SECRET = "WDxIAs1kUrFaib45e3494e3fa2038e87fbba8b0cf3c50"
BEGIN_TEST_TUTOR_LOGIN = "axessense"
BEGIN_TEST_TUTOR_SECRET = "WDxIAs1kUrFaib45e3494e3fa2038e87fbba8b0cf3c50"
BEGIN_TEST_STUDENT_LOGIN = "kira"
BEGIN_TEST_STUDENT_SECRET = "WDxIAs1kUrFaib45e3494e3fa2038e87fbba8b0cf3c50"


def upgrade() -> None:
    role_id_seq = sa.Sequence("roles_role_id_seq")
    user_id_seq = sa.Sequence("users_user_id_seq")

    op.execute(sa.schema.CreateSequence(role_id_seq))
    op.execute(sa.schema.CreateSequence(user_id_seq))

    op.create_table(
        "roles",
        sa.Column("role_id", sa.Integer(), role_id_seq, primary_key=True, server_default=role_id_seq.next_value()),
        sa.Column("title", sa.String(length=13), nullable=False),
    )
    op.create_table(
        "users",
        sa.Column("user_id", sa.Integer(), user_id_seq, primary_key=True, server_default=user_id_seq.next_value()),
        sa.Column("login", sa.String(length=25), nullable=False, unique=True),
        sa.Column("secret", sa.String(), nullable=False),
        sa.Column("role_id", sa.Integer(), sa.ForeignKey("roles.role_id", ondelete="CASCADE"), nullable=False),
        sa.Column("have_profile", sa.Boolean(), nullable=False),
    )
    op.create_table(
        "user_tokens",
        sa.Column("token", UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False),
        sa.Column("created_at", sa.DateTime(), default=datetime.utcnow, nullable=False),
        sa.Column("updated_at", sa.DateTime(), default=datetime.utcnow, onupdate=datetime.utcnow),
    )

    connection = op.get_bind()
    # Добавление роли "Администратор" и регистрация первой учетной записи администратора
    connection.execute(
        sa.text(
            """INSERT INTO "roles" (title) VALUES ('Администратор')"""
        )
    )
    admin_role_id = connection.execute(sa.text("SELECT currval('roles_role_id_seq')")).fetchone()[0]
    connection.execute(
        sa.text(
            """INSERT INTO "users" (login, secret, role_id, have_profile)
               VALUES (:login, :secret, :role_id, False)"""
        ),
        dict(login=BEGIN_ADMIN_LOGIN, secret=BEGIN_ADMIN_SECRET, role_id=admin_role_id)
    )
    # Добавление роли "Преподаватель" и регистрация первой учетной записи преподавателя
    connection.execute(
        sa.text(
            """INSERT INTO "roles" (title) VALUES ('Преподаватель')"""
        )
    )
    tutor_role_id = connection.execute(sa.text("SELECT currval('roles_role_id_seq')")).fetchone()[0]
    connection.execute(
        sa.text(
            """INSERT INTO "users" (login, secret, role_id, have_profile)
               VALUES (:login, :secret, :role_id, False)"""
        ),
        dict(login=BEGIN_TEST_TUTOR_LOGIN, secret=BEGIN_TEST_TUTOR_SECRET, role_id=tutor_role_id)
    )
    # Добавление роли "Ученик" и регистрация первой учетной записи ученика
    connection.execute(
        sa.text(
            """INSERT INTO "roles" (title) VALUES ('Ученик')"""
        )
    )
    student_role_id = connection.execute(sa.text("SELECT currval('roles_role_id_seq')")).fetchone()[0]
    connection.execute(
        sa.text(
            """INSERT INTO "users" (login, secret, role_id, have_profile)
               VALUES (:login, :secret, :role_id, False)"""
        ),
        dict(login=BEGIN_TEST_STUDENT_LOGIN, secret=BEGIN_TEST_STUDENT_SECRET, role_id=student_role_id)
    )


def downgrade() -> None:
    op.drop_table("user_tokens")
    op.drop_table("users")
    op.drop_table("roles")

    op.execute(sa.schema.DropSequence(sa.Sequence("users_user_id_seq")))
    op.execute(sa.schema.DropSequence(sa.Sequence("roles_role_id_seq")))
