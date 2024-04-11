import aiofiles
import os

from fastapi import UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from my_tutor.repositories import UserRepository
from my_tutor.exceptions import TutorAlreadyExistError, TutorNotFoundError, TutorSaveImageError
from my_tutor.models import TutorModel, UserModel
from my_tutor.schemes import (
    AddTutorRequest,
    AddTutorResponse,
    DeleteTutorRequest,
    DeleteTutorResponse,
    UpdateTutorPrimaryInfoRequest,
    UpdateTutorPrimaryInfoResponse,
    UpdateTutorContactInfoRequest,
    UpdateTutorContactInfoResponse,
    UpdateTutorImageResponse
)
from my_tutor.domain import Tutor, TutorInfo, TutorOption


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


class TutorRepository:
    _tutor = Tutor
    _info_domain = TutorInfo
    _tutor_option = TutorOption
    _tutor_model = TutorModel
    _user_model = UserModel
    _add_tutor_response = AddTutorResponse
    _delete_tutor_response = DeleteTutorResponse
    _update_tutor_primary_info_response = UpdateTutorPrimaryInfoResponse
    _update_tutor_contact_info_response = UpdateTutorContactInfoResponse
    _update_tutor_image_response = UpdateTutorImageResponse
    _default_male_image_path = "/storage/users/male_default_image.jpg"
    _default_female_image_path = "/storage/users/female_default_image.jpg"

    def _to_tutor(self, tutor_model: TutorModel) -> Tutor:

        return self._tutor(
            img_path=tutor_model.img_path,
            second_name=tutor_model.second_name,
            first_name=tutor_model.first_name,
            gender=tutor_model.gender,
            age=18,
            discord=tutor_model.discord,
            phone=tutor_model.phone,
            telegram=tutor_model.telegram,
            whatsapp=tutor_model.whatsapp
        )

    def _to_tutor_info(self, tutor_model: TutorModel, login: str) -> TutorInfo:

        return self._info_domain(
            login=login,
            first_name=tutor_model.first_name,
            second_name=tutor_model.second_name,
            gender=tutor_model.gender,
            birthday=tutor_model.birthday.strftime(f"%d {MONTHS[tutor_model.birthday.month - 1]} %Y года"),
            img_path=tutor_model.img_path,
            discord=tutor_model.discord,
            phone=tutor_model.phone,
            telegram=tutor_model.telegram,
            whatsapp=tutor_model.whatsapp
        )

    def _to_tutor_option(self, tutor_model: TutorModel) -> TutorOption:

        return self._tutor_option(
            id=tutor_model.tutor_id,
            name=f"{tutor_model.second_name} {tutor_model.first_name}"
        )

    def _to_add_tutor_response(self, tutor_model: TutorModel, tutor_login: str) -> AddTutorResponse:

        return self._add_tutor_response(
            tutor_login=tutor_login,
            img_path=tutor_model.img_path,
            second_name=tutor_model.second_name,
            first_name=tutor_model.first_name,
            gender=tutor_model.gender,
            age=18,
            discord=tutor_model.discord,
            phone=tutor_model.phone,
            telegram=tutor_model.telegram,
            whatsapp=tutor_model.whatsapp,
            message="Профиль преподавателя успешно создан"
        )

    def _to_delete_tutor_response(self, tutor_model: TutorModel) -> DeleteTutorResponse:

        return self._delete_tutor_response(
            name=f"{tutor_model.second_name} {tutor_model.first_name}",
            message="Профиль преподавателя успешно удален"
        )

    def _to_update_tutor_primary_info_response(self, tutor_model: TutorModel) -> UpdateTutorPrimaryInfoResponse:
        return self._update_tutor_primary_info_response(
            first_name=tutor_model.first_name,
            second_name=tutor_model.second_name,
            gender=tutor_model.gender,
            birthday=tutor_model.birthday.strftime(f"%d {MONTHS[tutor_model.birthday.month - 1]} %Y года"),
            message="Личные данные преподавателя успешно изменены"
        )

    def _to_update_tutor_contact_info_response(self, tutor_model: TutorModel) -> UpdateTutorContactInfoResponse:
        return self._update_tutor_contact_info_response(
            discord=tutor_model.discord,
            phone=tutor_model.phone,
            telegram=tutor_model.telegram,
            whatsapp=tutor_model.whatsapp,
            message="Контактные данные преподавателя успешно изменены"
        )

    def _to_update_tutor_image_response(self, tutor_model: TutorModel) -> UpdateTutorImageResponse:
        return self._update_tutor_image_response(
            img_path=tutor_model.img_path,
            message="Изображение успешно изменено"
        )

    async def get_tutor_id(self, session: AsyncSession, user_id: int) -> int:
        tutor_model = (await session.execute(select(self._tutor_model).filter_by(user_id=user_id))).scalars().first()

        if not tutor_model:
            raise TutorNotFoundError

        return tutor_model.tutor_id

    async def get_tutors(self, session: AsyncSession) -> list[Tutor]:
        tutors_models = (await session.execute(select(self._tutor_model).order_by(self._tutor_model.second_name, self._tutor_model.first_name))).scalars().all()

        return [self._to_tutor(tutor_model=tutor_model) for tutor_model in tutors_models]

    async def get_tutor_info(self, session: AsyncSession, user_id: int, login: str) -> TutorInfo:
        tutor_model = (await session.execute(select(self._tutor_model).filter_by(user_id=user_id))).scalars().first()

        if not tutor_model:
            raise TutorNotFoundError

        return self._to_tutor_info(tutor_model=tutor_model, login=login)

    async def get_tutor_options(self, session: AsyncSession, user_id: int = None) -> list[TutorOption]:
        if user_id:
            tutors_models = (await session.execute(select(self._tutor_model).filter_by(user_id=user_id))).scalars().all()
        else:
            tutors_models = (await session.execute(select(self._tutor_model).order_by(self._tutor_model.second_name,
                                                                                      self._tutor_model.first_name))).scalars().all()

        return [self._to_tutor_option(tutor_model=tutor_model) for tutor_model in tutors_models]

    async def add_tutor(self, session: AsyncSession, tutor_data: AddTutorRequest, user_id: int) -> AddTutorResponse:
        tutor_model = (
            await session.execute(select(self._tutor_model).filter_by(user_id=user_id))).scalars().first()

        if tutor_model:
            raise TutorAlreadyExistError

        user_model = (
            await session.execute(select(self._user_model).filter_by(user_id=user_id))).scalars().first()

        user_model.have_profile = True
        new_tutor = self._tutor_model(
            user_id=user_id,
            first_name=tutor_data.first_name,
            second_name=tutor_data.second_name,
            gender=tutor_data.gender,
            img_path=self._default_male_image_path if tutor_data.gender == "парень" else self._default_female_image_path,
            birthday=datetime.strptime(tutor_data.birthday, "%Y-%m-%d"),
            discord=tutor_data.discord,
            phone=tutor_data.phone,
            telegram=tutor_data.telegram,
            whatsapp=tutor_data.whatsapp
        )
        session.add(new_tutor)

        return self._to_add_tutor_response(tutor_model=new_tutor, tutor_login=tutor_data.tutor_login)

    async def delete_tutor(self, session: AsyncSession, tutor_data: DeleteTutorRequest) -> DeleteTutorResponse:
        tutor_model = (
            await session.execute(select(self._tutor_model).filter_by(phone=tutor_data.phone))).scalars().first()

        if not tutor_model:
            raise TutorNotFoundError

        user_model = (
            await session.execute(select(self._user_model).filter_by(user_id=tutor_model.user_id))).scalars().first()

        user_model.have_profile = False
        delete_tutor_response = self._to_delete_tutor_response(tutor_model=tutor_model)
        session.add(user_model)
        await session.delete(tutor_model)

        return delete_tutor_response

    async def update_primary_info(self, session: AsyncSession, tutor_data: UpdateTutorPrimaryInfoRequest, user_id: int) -> UpdateTutorPrimaryInfoResponse:
        tutor_model = (
            await session.execute(select(self._tutor_model).filter_by(user_id=user_id))).scalars().first()

        if not tutor_model:
            raise TutorNotFoundError

        tutor_model.first_name = tutor_data.first_name
        tutor_model.second_name = tutor_data.second_name
        tutor_model.gender = tutor_data.gender
        tutor_model.birthday = datetime.strptime(tutor_data.birthday, "%Y-%m-%d")
        session.add(tutor_model)

        return self._to_update_tutor_primary_info_response(tutor_model=tutor_model)

    async def update_contact_info(self, session: AsyncSession, tutor_data: UpdateTutorContactInfoRequest, user_id: int) -> UpdateTutorContactInfoResponse:
        tutor_model = (
            await session.execute(select(self._tutor_model).filter_by(user_id=user_id))).scalars().first()

        if not tutor_model:
            raise TutorNotFoundError

        tutor_model.discord = tutor_data.discord
        tutor_model.phone = tutor_data.phone
        tutor_model.telegram = tutor_data.telegram
        tutor_model.whatsapp = tutor_data.whatsapp
        session.add(tutor_model)

        return self._to_update_tutor_contact_info_response(tutor_model=tutor_model)

    @staticmethod
    async def _save_image_to_file(login: str, image_data: UploadFile):
        user_folder = "storage/users/" + login
        try:
            if not os.path.exists(user_folder):
                os.makedirs(user_folder)

            image_path = user_folder + "/tutor_image.jpg"

            async with aiofiles.open(image_path, 'wb') as file:
                while True:
                    image_part = image_data.file.read(1024)
                    if not image_part:
                        break
                    await file.write(image_part)
            return "/" + image_path
        except Exception:
            #TODO применить кастомный класс ошибки
            return False

    async def change_image(self, session: AsyncSession, image_data: UploadFile, login: str, user_id: int) -> UpdateTutorImageResponse:
        tutor_model = (await session.execute(select(self._tutor_model).filter_by(user_id=user_id))).scalars().first()

        if not tutor_model:
            raise TutorNotFoundError

        new_image_path = await self._save_image_to_file(login=login, image_data=image_data)
        print(new_image_path)
        if not new_image_path:
            raise TutorSaveImageError

        tutor_model.img_path = new_image_path
        session.add(tutor_model)

        return self._to_update_tutor_image_response(tutor_model=tutor_model)
