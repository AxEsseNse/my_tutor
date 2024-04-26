"""create file ref table

Revision ID: 75128f99037f
Revises: 57e58c030de9
Create Date: 2024-04-25 03:10:51.867875

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '75128f99037f'
down_revision: Union[str, None] = '57e58c030de9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    file_id_seq = sa.Sequence("files_file_id_seq")
    op.execute(sa.schema.CreateSequence(file_id_seq))

    op.create_table(
        "files",
        sa.Column("file_id", sa.Integer(), file_id_seq, primary_key=True, server_default=file_id_seq.next_value()),
        sa.Column("file_path", sa.String(), nullable=False, unique=True),
        sa.Column("ref_count", sa.Integer(), nullable=False)
    )


def downgrade() -> None:
    op.drop_table("files")

    op.execute(sa.schema.DropSequence(sa.Sequence("files_file_id_seq")))
