"""create exams and themes tables

Revision ID: f73374f24848
Revises: 68a720858db9
Create Date: 2024-01-26 06:07:58.900818

"""
import json
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB


# revision identifiers, used by Alembic.
revision: str = 'f73374f24848'
down_revision: Union[str, None] = '68a720858db9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    exam_id_seq = sa.Sequence("exams_exam_id_seq")
    theme_id_seq = sa.Sequence("themes_theme_id_seq")
    theme_practice_material_id_seq = sa.Sequence("themes_theme_practice_material_id_seq")

    op.execute(sa.schema.CreateSequence(exam_id_seq))
    op.execute(sa.schema.CreateSequence(theme_id_seq))
    op.execute(sa.schema.CreateSequence(theme_practice_material_id_seq))

    op.create_table(
        "exams",
        sa.Column("exam_id", sa.Integer(), exam_id_seq, primary_key=True, server_default=exam_id_seq.next_value()),
        sa.Column("title", sa.String(length=3), nullable=False)
    )
    op.create_table(
        "themes",
        sa.Column("theme_id", sa.Integer(), theme_id_seq, primary_key=True, server_default=theme_id_seq.next_value()),
        sa.Column("exam_id", sa.Integer(), sa.ForeignKey("exams.exam_id"), nullable=False),
        sa.Column("exam_task_number", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("descr", sa.String(), nullable=False),
        sa.Column("material", JSONB(), server_default="{}")
    )

    connection = op.get_bind()
    # Добавление экзамена "ЕГЭ" и создание первой темы этого экзамена
    connection.execute(
        sa.text(
            """INSERT INTO "exams" (title) VALUES ('ЕГЭ')"""
        )
    )
    ege_exam_id = connection.execute(sa.text("SELECT currval('exams_exam_id_seq')")).fetchone()[0]
    ege_first_theme_practice_material_id = connection.execute(sa.text("SELECT nextval('themes_theme_practice_material_id_seq')")).fetchone()[0]
    test_material_ege = [
        {
            "type": "theory",
            "title": "Вызов исполнителя Черепаха",
            "image_path": "/storage/lessons/ege/6/theory1.jpg",
            "descr": "Чтобы команды для работы с черепахой работали - необходимо импортировать сам модуль Черепаха"
        },
        {
            "id": ege_first_theme_practice_material_id,
            "type": "practice",
            "title": "Знание синтаксиса исполнителя",
            "image_path": "/storage/lessons/ege/6/practice1.jpg",
            "descr": "Введите в поле ниже команду для импорта модуля Черепаха в программу",
            "answer": "исполнитель Черепаха",
            "tip": {"image_path": "/storage/lessons/ege/6/practice1tip.jpg",
                    "descr": "Если на экзамене вдруг забыл как импортировать модуль - зайди в справочный центр"
                    }
        }
    ]
    test_material_ege_json = json.dumps(test_material_ege)
    connection.execute(
        sa.text(
            """INSERT INTO "themes" (exam_id, exam_task_number, title, descr, material)
               VALUES (:exam_id, 6, 'Исполнитель Черепаха', 'Работа в среде КУМИР.', :material)"""
        ),
        dict(exam_id=ege_exam_id, material=test_material_ege_json)
    )

    # Добавление экзамена "ОГЭ" и создание первой темы этого экзамена
    connection.execute(
        sa.text(
            """INSERT INTO "exams" (title) VALUES ('ОГЭ')"""
        )
    )
    oge_exam_id = connection.execute(sa.text("SELECT currval('exams_exam_id_seq')")).fetchone()[0]
    oge_first_theme_practice_material_id = connection.execute(sa.text("SELECT nextval('themes_theme_practice_material_id_seq')")).fetchone()[0]
    test_material_oge = [
        {
            "type": "theory",
            "title": "Матрица. Симметричная и несимметричная. Понятие главной диагонали",
            "image_path": "/storage/lessons/oge/4/theory1.jpg",
            "descr": "Матрицы бывают двух видов. Симметричные и несимметричные."
        },
        {
            "id": oge_first_theme_practice_material_id,
            "type": "practice",
            "title": "Определение симметричности матрицы",
            "image_path": "/storage/lessons/oge/4/practice1.jpg",
            "descr": "Введите в поле ниже какая на картинке представлена матрица",
            "answer": "несимметричная",
            "tip": {"image_path": "/storage/lessons/ege/6/practice1tip.jpg",
                    "descr": "Сравнивай значения, находящиеся напротив друг друга относительно главной диагонали"
                    }
            }
    ]
    test_material_oge_json = json.dumps(test_material_oge)
    connection.execute(
        sa.text(
            """INSERT INTO "themes" (exam_id, exam_task_number, title, descr, material)
               VALUES (:exam_id, 4, 'Поиск путей по таблице', 'Матрица симметричная и не симметричная. Понятие главной диагонали. Графы и Деревья', :material)"""
        ),
        dict(exam_id=oge_exam_id, material=test_material_oge_json)
    )


def downgrade() -> None:
    op.drop_table("themes")
    op.drop_table("exams")

    op.execute(sa.schema.DropSequence(sa.Sequence("themes_theme_practice_material_id_seq")))
    op.execute(sa.schema.DropSequence(sa.Sequence("themes_theme_id_seq")))
    op.execute(sa.schema.DropSequence(sa.Sequence("exams_exam_id_seq")))
