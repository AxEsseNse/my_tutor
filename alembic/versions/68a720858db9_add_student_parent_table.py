"""add student, parent table

Revision ID: 68a720858db9
Revises: 2ccfc8173544
Create Date: 2024-01-17 02:13:06.402886

"""
from typing import Sequence, Union
from datetime import datetime

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '68a720858db9'
down_revision: Union[str, None] = '2ccfc8173544'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

TEST_TUTOR_USER_ID = 2
TEST_STUDENT_USER_ID = 3


def upgrade() -> None:
    tutor_id_seq = sa.Sequence("tutors_tutor_id_seq")
    student_id_seq = sa.Sequence("students_student_id_seq")
    parent_id_seq = sa.Sequence("parents_parent_id_seq")

    op.execute(sa.schema.CreateSequence(tutor_id_seq))
    op.execute(sa.schema.CreateSequence(student_id_seq))
    op.execute(sa.schema.CreateSequence(parent_id_seq))

    op.create_table(
        "tutors",
        sa.Column("tutor_id", sa.Integer(), tutor_id_seq, primary_key=True,
                  server_default=tutor_id_seq.next_value()),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.user_id", ondelete="CASCADE"), unique=True,
                  nullable=False),
        sa.Column("first_name", sa.String(length=15), nullable=False),
        sa.Column("second_name", sa.String(length=25), nullable=False),
        sa.Column("gender", sa.String()),
        sa.Column("img_path", sa.String()),
        sa.Column("birthday", sa.DateTime(), nullable=False),
        sa.Column("discord", sa.String(length=25), nullable=False),
        sa.Column("phone", sa.String(length=11), unique=True),
        sa.Column("telegram", sa.String(length=11), unique=True),
        sa.Column("whatsapp", sa.String(length=11), unique=True)
    )
    op.create_table(
        "students",
        sa.Column("student_id", sa.Integer(), student_id_seq, primary_key=True, server_default=student_id_seq.next_value()),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.user_id", ondelete="CASCADE"), unique=True, nullable=False),
        sa.Column("first_name", sa.String(length=15), nullable=False),
        sa.Column("second_name", sa.String(length=25), nullable=False),
        sa.Column("gender", sa.String()),
        sa.Column("lesson_price", sa.Integer()),
        sa.Column("img_path", sa.String()),
        sa.Column("birthday", sa.DateTime(), nullable=False),
        sa.Column("discord", sa.String(length=25), nullable=False),
        sa.Column("phone", sa.String(length=11), unique=True),
        sa.Column("telegram", sa.String(length=11), unique=True),
        sa.Column("whatsapp", sa.String(length=11), unique=True)
    )
    op.create_table(
        "parents",
        sa.Column("parent_id", sa.Integer(), parent_id_seq, primary_key=True, server_default=parent_id_seq.next_value()),
        sa.Column("student_id", sa.Integer(), sa.ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False),
        sa.Column("status", sa.String(length=6), nullable=False),
        sa.Column("first_name", sa.String(length=15), nullable=False),
        sa.Column("second_name", sa.String(length=25)),
        sa.Column("phone", sa.String(length=11), unique=True),
        sa.Column("telegram", sa.String(length=11), unique=True),
        sa.Column("whatsapp", sa.String(length=11), unique=True),
        sa.Column("node", sa.String())
    )

    connection = op.get_bind()
    # Добавление профиля преподавателя первой учетной записи преподавателя
    roman_birthday = datetime.utcnow()
    connection.execute(
        sa.text(
            """INSERT INTO "tutors" (user_id, first_name, second_name, gender, img_path, birthday, discord, phone, telegram, whatsapp) 
               VALUES (:user_id, 'Роман', 'Синицкий', 'парень', '/storage/users/male_default_image.jpg', :date, 'axessense', '88007777', '88005555', '8800888883')"""
        ),
        dict(user_id=TEST_TUTOR_USER_ID, date=roman_birthday)
    )
    connection.execute(
        sa.text(
            """UPDATE "users" SET have_profile = True WHERE user_id = :user_id"""
        ),
        dict(user_id=TEST_TUTOR_USER_ID)
    )
    # Добавление профиля студента первой учетной записи ученика
    kira_birthday = datetime.utcnow()
    connection.execute(
        sa.text(
            """INSERT INTO "students" (user_id, first_name, second_name, gender, lesson_price, img_path, birthday, discord, phone, telegram, whatsapp) 
               VALUES (:user_id, 'Кира', 'Фазмафобовна', 'девушка', 1200, '/storage/users/female_default_image.jpg', :date, 'ya_discord', '88008000808', '88008000808', '88008000808')"""
        ),
        dict(user_id=TEST_STUDENT_USER_ID, date=kira_birthday)
    )
    connection.execute(
        sa.text(
            """UPDATE "users" SET have_profile = True WHERE user_id = :user_id"""
        ),
        dict(user_id=TEST_STUDENT_USER_ID)
    )
    student_id = connection.execute(sa.text("SELECT currval('students_student_id_seq')")).fetchone()[0]
    connection.execute(
        sa.text(
            """INSERT INTO "parents" (student_id, status, first_name, second_name, phone, telegram, whatsapp, node) 
               VALUES (:student_id, 'Отец', 'Сергей', 'Николаевич', '78005553535', '78005553535', '78005553535', 'Батяныч Киры')"""
        ),
        dict(student_id=student_id)
    )


def downgrade() -> None:
    op.drop_table("parents")
    op.drop_table("students")
    op.drop_table("tutors")

    op.execute(sa.schema.DropSequence(sa.Sequence("parents_parent_id_seq")))
    op.execute(sa.schema.DropSequence(sa.Sequence("students_student_id_seq")))
    op.execute(sa.schema.DropSequence(sa.Sequence("tutors_tutor_id_seq")))
