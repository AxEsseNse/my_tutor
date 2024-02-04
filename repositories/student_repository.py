import aiofiles
import os

from fastapi import UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from my_tutor.repositories import UserRepository
from my_tutor.exceptions import StudentNotFoundError, StudentSaveImageError, StudentAlreadyExistError
from my_tutor.models import UserModel, StudentModel
from my_tutor.schemes import (
    AddStudentRequest,
    AddStudentResponse,
    DeleteStudentRequest,
    DeleteStudentResponse,
    UpdateStudentPrimaryInfoRequest,
    UpdateStudentContactInfoRequest,
    UpdateStudentPrimaryInfoResponse,
    UpdateStudentContactInfoResponse,
    UpdateStudentImageResponse
)
from my_tutor.domain import StudentInfo, Student


user_repository = UserRepository()
MONTHS = (
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря"
)


class StudentRepository:
    _student = Student
    _user_model = UserModel
    _student_model = StudentModel
    _info_domain = StudentInfo
    _add_student_response = AddStudentResponse
    _delete_student_response = DeleteStudentResponse
    _update_student_primary_info_response = UpdateStudentPrimaryInfoResponse
    _update_student_contact_info_response = UpdateStudentContactInfoResponse
    _update_student_image_response = UpdateStudentImageResponse
    _default_male_image_path = "/storage/users/male_default_image.jpg"
    _default_female_image_path = "/storage/users/female_default_image.jpg"

    def _to_student(self, student_model: StudentModel) -> Student:

        return self._student(
            img_path=student_model.img_path,
            second_name=student_model.second_name,
            first_name=student_model.first_name,
            gender=student_model.gender,
            age=18,
            lesson_price=student_model.lesson_price,
            discord=student_model.discord,
            phone=student_model.phone,
            telegram=student_model.telegram,
            whatsapp=student_model.whatsapp
        )


    def _to_student_info(self, student_model: StudentModel, login: str) -> StudentInfo:

        return self._info_domain(
            login=login,
            first_name=student_model.first_name,
            second_name=student_model.second_name,
            gender=student_model.gender,
            birthday=student_model.birthday.strftime(f"%d {MONTHS[student_model.birthday.month - 1]} %Y года"),
            lesson_price=student_model.lesson_price,
            img_path=student_model.img_path,
            discord=student_model.discord,
            phone=student_model.phone,
            telegram=student_model.telegram,
            whatsapp=student_model.whatsapp
        )

    def _to_add_student_response(self, student_model: StudentModel, student_login: str) -> AddStudentResponse:

        return self._add_student_response(
            student_login=student_login,
            img_path=student_model.img_path,
            second_name=student_model.second_name,
            first_name=student_model.first_name,
            gender=student_model.gender,
            age=18,
            lesson_price=student_model.lesson_price,
            discord=student_model.discord,
            phone=student_model.phone,
            telegram=student_model.telegram,
            whatsapp=student_model.whatsapp,
            message="Профиль студента успешно создан"
        )

    def _to_delete_student_response(self, student_model: StudentModel) -> DeleteStudentResponse:

        return self._delete_student_response(
            name=f"{student_model.second_name} {student_model.first_name}",
            message="Профиль студента успешно удален"
        )

    def _to_update_student_primary_info_response(self, student_model: StudentModel) -> UpdateStudentPrimaryInfoResponse:
        return self._update_student_primary_info_response(
            first_name=student_model.first_name,
            second_name=student_model.second_name,
            gender=student_model.gender,
            birthday=student_model.birthday.strftime(f"%d {MONTHS[student_model.birthday.month - 1]} %Y года"),
            message="Личные данные студента успешно изменены"
        )

    def _to_update_student_contact_info_response(self, student_model: StudentModel) -> UpdateStudentContactInfoResponse:
        return self._update_student_contact_info_response(
            discord=student_model.discord,
            phone=student_model.phone,
            telegram=student_model.telegram,
            whatsapp=student_model.whatsapp,
            message="Контактные данные студента успешно изменены"
        )

    def _to_update_student_image_response(self, student_model: StudentModel) -> UpdateStudentImageResponse:
        return self._update_student_image_response(
            img_path=student_model.img_path,
            message="Изображение успешно изменено"
        )

    async def _get_new_student_id(self, session: AsyncSession) -> int:
        return await session.scalar(self._student_model.id_seq.next_value())

    async def _get_student(self, session: AsyncSession, student_id: int):
        student_model = (await session.execute(select(self._student_model).filter_by(student_id=student_id))).scalars().first()

        if not student_model:
            raise StudentNotFoundError

        return student_model

    async def get_students(self, session: AsyncSession) -> list[Student]:
        students_models = (await session.execute(select(self._student_model).order_by(self._student_model.second_name, self._student_model.first_name))).scalars().all()

        return [self._to_student(student_model=student_model) for student_model in students_models]

    async def get_student_info(self, session: AsyncSession, user_id: int, login: str) -> StudentInfo:
        student_model = (await session.execute(select(self._student_model).filter_by(user_id=user_id))).scalars().first()

        if not student_model:
            raise StudentNotFoundError

        return self._to_student_info(student_model=student_model, login=login)

    async def add_student(self, session: AsyncSession, student_data: AddStudentRequest, user_id: int) -> AddStudentResponse:
        student_model = (
            await session.execute(select(self._student_model).filter_by(user_id=user_id))).scalars().first()

        if student_model:
            raise StudentAlreadyExistError

        user_model = (
            await session.execute(select(self._user_model).filter_by(user_id=user_id))).scalars().first()

        user_model.have_profile = True
        new_student = self._student_model(
            student_id=await self._get_new_student_id(session),
            user_id=user_id,
            first_name=student_data.first_name,
            second_name=student_data.second_name,
            gender=student_data.gender,
            lesson_price=student_data.lesson_price,
            img_path=self._default_male_image_path if student_data.gender == "парень" else self._default_female_image_path,
            birthday=datetime.strptime(student_data.birthday, "%Y-%m-%d"),
            discord=student_data.discord,
            phone=student_data.phone,
            telegram=student_data.telegram,
            whatsapp=student_data.whatsapp
        )
        session.add(new_student)

        return self._to_add_student_response(student_model=new_student, student_login=student_data.student_login)

    async def delete_student(self, session: AsyncSession, student_data: DeleteStudentRequest) -> DeleteStudentResponse:
        student_model = (
            await session.execute(select(self._student_model).filter_by(phone=student_data.phone))).scalars().first()

        if not student_model:
            raise StudentNotFoundError

        user_model = (
            await session.execute(select(self._user_model).filter_by(user_id=student_model.user_id))).scalars().first()

        user_model.have_profile = False
        delete_student_response = self._to_delete_student_response(student_model=student_model)
        session.add(user_model)
        await session.delete(student_model)

        return delete_student_response

    async def update_primary_info(self, session: AsyncSession, student_data: UpdateStudentPrimaryInfoRequest, user_id: int) -> UpdateStudentPrimaryInfoResponse:
        student_model = (
            await session.execute(select(self._student_model).filter_by(user_id=user_id))).scalars().first()

        if not student_model:
            raise StudentNotFoundError

        student_model.first_name = student_data.first_name
        student_model.second_name = student_data.second_name
        student_model.gender = student_data.gender
        student_model.birthday = datetime.strptime(student_data.birthday, "%Y-%m-%d")
        session.add(student_model)

        return self._to_update_student_primary_info_response(student_model=student_model)

    async def update_contact_info(self, session: AsyncSession, student_data: UpdateStudentContactInfoRequest, user_id: int) -> UpdateStudentContactInfoResponse:
        student_model = (
            await session.execute(select(self._student_model).filter_by(user_id=user_id))).scalars().first()

        if not student_model:
            raise StudentNotFoundError

        student_model.discord = student_data.discord
        student_model.phone = student_data.phone
        student_model.telegram = student_data.telegram
        student_model.whatsapp = student_data.whatsapp
        session.add(student_model)

        return self._to_update_student_contact_info_response(student_model=student_model)

    @staticmethod
    async def _save_image_to_file(login: str, image_data: UploadFile):
        user_folder = os.path.join('storage', 'users', login)
        try:
            if not os.path.exists(user_folder):
                os.makedirs(user_folder)

            image_path = os.path.join(user_folder, 'student_image.jpg')

            async with aiofiles.open(image_path, 'wb') as file:
                while True:
                    image_part = image_data.file.read(1024)
                    if not image_part:
                        break
                    await file.write(image_part)
            return image_path
        except Exception as e:
            print(e)
            return False

    async def update_image(self, session: AsyncSession, image_data: UploadFile, login: str, user_id: int) -> UpdateStudentImageResponse:
        student_model = (await session.execute(select(self._student_model).filter_by(user_id=user_id))).scalars().first()

        if not student_model:
            raise StudentNotFoundError

        new_image_path = await self._save_image_to_file(login, image_data)

        if not new_image_path:
            raise StudentSaveImageError

        student_model.img_path = new_image_path
        session.add(student_model)

        return self._to_update_student_image_response(student_model=student_model)


    async def get_student_id(self, session: AsyncSession, user_id: int) -> int:
        student_model = (await session.execute(select(self._student_model).filter_by(user_id=user_id))).scalars().first()

        if not student_model:
            raise StudentNotFoundError

        return student_model.student_id
