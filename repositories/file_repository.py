import hashlib
import os
from random import choice
import aiofiles
from fastapi import UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from my_tutor.models import FileModel
from my_tutor.exceptions import (
    FileDataNotFoundError,
    FileDataAlreadyExistError,
    SaveFileError
)
from my_tutor.schemes import UploadFileResponse


VARIABLE_SYMBOLS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
                    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
                    'u', 'v', 'w', 'x', 'y', 'z',
                    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
                    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
                    'U', 'V', 'W', 'X', 'Y', 'Z',
                    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
CURRENT_DIRECTORY = os.getcwd()


class FileRepository:
    _file_model = FileModel
    _upload_file_response = UploadFileResponse
    _default_image_directory = os.path.join("storage", "themes", "default_image")

    def _to_upload_file_response(self, file_path) -> UploadFileResponse:

        return self._upload_file_response(
            file_path=file_path
        )

    async def get_file_model(self, session: AsyncSession, file_path: str) -> FileModel:

        file_model = (await session.execute(select(self._file_model).filter_by(file_path=file_path))).scalars().first()

        if not file_model:
            raise FileDataNotFoundError

        return file_model

    async def add_file(self, session: AsyncSession, file_path: str) -> bool:
        """
        Создает запись в БД о файле. Записывает туда в поле file_path и ставит счетчик ссылок равным 1

        :return: Возвращает булево значение - создалась ли запись
        Если возвращает ошибку FileDataAlreadyExistError - значит запись о файле по указанному file_path уже существует
        """
        file_model = (await session.execute(select(self._file_model).filter_by(file_path=file_path))).scalars().first()

        if file_model:
            raise FileDataAlreadyExistError

        new_file_data = self._file_model(
            file_path=file_path,
            ref_count=1
        )
        session.add(new_file_data)

        return True

    async def update_file_reference_count(self, session: AsyncSession, file_path: str, change_value: int) -> bool:
        """
        Изменяет счетчик ссылок на значение change_value. Если после изменения счетчик ссылок становится равным 0, то запись из БД удаляется
        В противном случае поле ref_count обновляется на новое значение

        :return: Возвращает булево значение - осталась ли запись об этом файле в БД (ссылается ли что-то на него)
        """
        file_model = await self.get_file_model(session=session, file_path=file_path)
        current_reference_count = file_model.ref_count + change_value

        if current_reference_count == 0:
            await session.delete(file_model)
            return False

        file_model.ref_count = current_reference_count
        session.add(file_model)

        return True

    @staticmethod
    def create_random_name(amount_symbols, extension):
        return "".join([choice(VARIABLE_SYMBOLS) for _ in range(amount_symbols)]) + extension

    @staticmethod
    async def calculate_file_hash(file_data):
        sha256_hash = hashlib.sha256()
        await file_data.seek(0)
        while True:
            data = await file_data.read(1024)
            if not data:
                break
            sha256_hash.update(data)
        await file_data.seek(0)

        return sha256_hash.hexdigest()

    async def save_file_to_storage(self, session: AsyncSession, path: str, file_data: UploadFile) -> UploadFileResponse:
        exam_task_number_folder = os.path.join("storage", "themes", *path.split('/'))
        extension = os.path.splitext(file_data.filename)[1]

        try:
            if not os.path.exists(exam_task_number_folder):
                os.makedirs(exam_task_number_folder)

            file_size = file_data.file.seek(0, os.SEEK_END)
            file_data.file.seek(0)

            possible_matches = [file for file in os.listdir(exam_task_number_folder)
                                if os.path.getsize(os.path.join(exam_task_number_folder, file)) == file_size]

            uploaded_file_hash = await self.calculate_file_hash(file_data)

            for filename in possible_matches:
                existing_file_path = os.path.join(exam_task_number_folder, filename)
                with open(existing_file_path, 'rb') as existing_file:
                    if uploaded_file_hash == hashlib.sha256(existing_file.read()).hexdigest():
                        await self.update_file_reference_count(session=session, file_path=f"{os.sep}{existing_file_path}", change_value=1)

                        return self._to_upload_file_response(file_path=f"{os.sep}{existing_file_path}")

            file_path = os.path.join(exam_task_number_folder,
                                     self.create_random_name(amount_symbols=10, extension=extension))

            async with aiofiles.open(file_path, 'wb') as file:
                while True:
                    file_part = file_data.file.read(1024)
                    if not file_part:
                        break
                    await file.write(file_part)

            await self.add_file(session=session, file_path=f"{os.sep}{file_path}")

            return self._to_upload_file_response(file_path=f"{os.sep}{file_path}")
        except Exception as e:
            print(e)
            raise SaveFileError

    async def delete_file_from_storage(self, session: AsyncSession, file_path: str) -> bool:
        full_path = os.path.join(CURRENT_DIRECTORY, file_path[1:])
        default_image_directory = self._default_image_directory
        try:
            if os.path.exists(full_path):
                if file_path[1:].startswith(default_image_directory):
                    return False

                file_usage = await self.update_file_reference_count(session=session, file_path=file_path, change_value=-1)
                if file_usage:
                    return False

                os.remove(file_path[1:])
            return False
        except Exception as e:
            return True
