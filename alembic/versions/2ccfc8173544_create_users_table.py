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
BEGIN_ADMIN_SECRET = "admin"


def upgrade() -> None:
    op.create_table(
        "roles",
        sa.Column("role_id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(length=7), nullable=False),
    )

    op.create_table(
        "users",
        sa.Column("user_id", sa.Integer(), primary_key=True),
        sa.Column("login", sa.String(length=25), nullable=False, unique=True),
        sa.Column("secret", sa.String(), nullable=False),
        sa.Column("role_id", sa.Integer(), sa.ForeignKey("roles.role_id", ondelete="CASCADE"), nullable=False),
    )

    op.create_table(
        "user_tokens",
        sa.Column("token", UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False),
        sa.Column("created_at", sa.DateTime(), default=datetime.utcnow, nullable=False),
        sa.Column("updated_at", sa.DateTime(), onupdate=datetime.utcnow),
    )

    connection = op.get_bind()
    connection.execute(
        sa.text(
            """INSERT INTO "roles" values (1, 'admin'), (2, 'tutor'), (3, 'student')"""
        )
    )
    connection.execute(
        sa.text(
            f"""INSERT INTO "users" values (1, '{BEGIN_ADMIN_LOGIN}', '{BEGIN_ADMIN_SECRET}', 1)"""
        )
    )


def downgrade() -> None:
    op.drop_table("user_tokens")
    op.drop_table("users")
    op.drop_table("roles")
