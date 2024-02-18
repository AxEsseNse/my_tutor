import hashlib
from datetime import datetime, timedelta
from random import choices
from uuid import uuid4

from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import UserNotFoundError, UserNotVerifyError, UserAlreadyExistError
from my_tutor.models import TokenModel, UserModel, RoleModel, StudentModel, TutorModel
from my_tutor.schemes import UserAuthorizationRequest, AddUserRequest, AddUserResponse, UpdateUserPasswordRequest, UpdateUserPasswordResponse, DeleteUserRequest, DeleteUserResponse
from my_tutor.domain import User, UserInfo, UserLogin

AUTH_TOKEN_LIFETIME = 604800
TEMP_ROLES = {
    'admin': 1,
    'tutor': 2,
    'student': 3
}
RUS_ROLES = {
    1: "Администратор",
    2: "Преподаватель",
    3: "Студент"
}


class UserRepository:
    _user = User
    _user_login = UserLogin
    _add_user_response = AddUserResponse
    _update_user_password_response = UpdateUserPasswordResponse
    _delete_user_response = DeleteUserResponse
    _info_domain = UserInfo
    _user_model = UserModel
    _role_model = RoleModel
    _token_model = TokenModel
    _tutor_model = TutorModel
    _student_model = StudentModel
    _salt_len = 13
    _default_image_path = "/storage/users/no_login.png"

    def _to_user_info(self, user_model: UserModel, img_path: str, name: str) -> UserInfo:
        return self._info_domain(
            user_id=user_model.user_id,
            login=user_model.login,
            img_path=img_path,
            name=name,
            role=RUS_ROLES[user_model.role_id]
        )

    def _to_user(self, user_model: UserModel) -> User:

        return self._user(
            login=user_model.login,
            role=RUS_ROLES[user_model.role_id],
            have_profile=user_model.have_profile
        )

    def _to_user_login(self, user_model: UserModel) -> UserLogin:

        return self._user_login(
            login=user_model.login
        )

    def _to_add_user_response(self, user_model: UserModel) -> AddUserResponse:

        return self._add_user_response(
            login=user_model.login,
            role=RUS_ROLES[user_model.role_id],
            message="Пользователь успешно зарегистрирован"
        )

    def _to_update_user_password_response(self, user_model: UserModel) -> UpdateUserPasswordResponse:

        return self._update_user_password_response(
            login=user_model.login,
            message="Пароль пользователя успешно обновлен"
        )

    def _to_delete_user_response(self, user_model: UserModel) -> DeleteUserResponse:

        return self._delete_user_response(
            login=user_model.login,
            role=RUS_ROLES[user_model.role_id],
            message="Пользователь успешно удален"
        )

    async def get_users(self, session: AsyncSession) -> list[User]:
        users_models = (await session.execute(select(self._user_model).order_by(self._user_model.role_id, self._user_model.login))).scalars().all()

        return [self._to_user(user_model=user_model) for user_model in users_models]

    async def get_tutors_without_profile(self, session: AsyncSession) -> list[UserLogin]:
        users_models = (await session.execute(select(self._user_model).filter_by(role_id=2, have_profile=False).order_by(self._user_model.login))).scalars().all()

        return [self._to_user_login(user_model=user_model) for user_model in users_models]

    async def get_students_without_profile(self, session: AsyncSession) -> list[UserLogin]:
        users_models = (await session.execute(select(self._user_model).filter_by(role_id=3, have_profile=False).order_by(self._user_model.login))).scalars().all()

        return [self._to_user_login(user_model=user_model) for user_model in users_models]

    async def get_user(self, session: AsyncSession, user_id: int) -> User:
        user_model = (await session.execute(select(self._user_model).filter_by(user_id=user_id))).scalars().first()

        return self._to_user(user_model=user_model)

    async def add_user(self, session: AsyncSession, user_data: AddUserRequest) -> AddUserResponse:
        user_model = (await session.execute(select(self._user_model).filter_by(login=user_data.login))).scalars().first()

        if user_model:
            raise UserAlreadyExistError(user_model.login)

        salt = self._create_salt()
        salted_password = salt + user_data.password
        password_bytes = bytes(salted_password, encoding="utf-8")
        password_hash = hashlib.md5(password_bytes).hexdigest()
        salted_hash = salt + password_hash
        #TODO replace to ALIAS in SCHEME
        role = TEMP_ROLES[user_data.role]

        new_user = self._user_model(
            login=user_data.login,
            secret=salted_hash,
            role_id=role,
            have_profile=False
        )
        session.add(new_user)

        return self._to_add_user_response(user_model=new_user)

    async def update_user_password(self, session: AsyncSession, user_data: UpdateUserPasswordRequest) -> UpdateUserPasswordResponse:
        user_model = await self._get_user(session, login=user_data.login)

        salt = self._create_salt()
        salted_password = salt + user_data.password
        password_bytes = bytes(salted_password, encoding="utf-8")
        password_hash = hashlib.md5(password_bytes).hexdigest()
        salted_hash = salt + password_hash

        user_model.secret = salted_hash
        session.add(user_model)

        return self._to_update_user_password_response(user_model=user_model)

    async def delete_user(self, session: AsyncSession, user_data: DeleteUserRequest) -> DeleteUserResponse:
        user_model = await self._get_user(session, login=user_data.login)

        if not user_model:
            raise UserNotFoundError

        delete_user_response = self._to_delete_user_response(user_model=user_model)
        await session.delete(user_model)

        return delete_user_response

    async def _get_user(self, session: AsyncSession, login: str) -> UserModel:
        user_model = (await session.execute(select(self._user_model).filter_by(login=login))).scalars().first()

        if not user_model:
            raise UserNotFoundError

        return user_model

    async def get_user_info(self, session: AsyncSession, token: str) -> UserInfo:
        token_model = (await session.execute(select(self._token_model).filter_by(token=token))).scalars().first()

        if not token_model:
            raise UserNotFoundError

        user_model = (
            await session.execute(select(self._user_model).filter_by(user_id=token_model.user_id))).scalars().first()

        if not user_model:
            raise UserNotFoundError

        if user_model.role_id == 2:
            tutor_model = (await session.execute(
                select(self._tutor_model).filter_by(user_id=token_model.user_id))).scalars().first()

            if not tutor_model:
                img_path = self._default_image_path
                name = user_model.login
            else:
                img_path = tutor_model.img_path
                name = f"{tutor_model.second_name} {tutor_model.first_name}"

        elif user_model.role_id == 3:
            student_model = (await session.execute(
                select(self._student_model).filter_by(user_id=token_model.user_id))).scalars().first()

            if not student_model:
                img_path = self._default_image_path
                name = user_model.login
            else:
                img_path = student_model.img_path
                name = f"{student_model.second_name} {student_model.first_name}"

        else:
            img_path = self._default_image_path
            name = user_model.login

        return self._to_user_info(user_model=user_model, img_path=img_path, name=name)

    async def get_user_id(self, session: AsyncSession, token: str) -> int:
        token_model = (await session.execute(select(self._token_model).filter_by(token=token))).scalars().first()

        if not token_model:
            raise UserNotFoundError

        return token_model.user_id

    async def get_user_by_token(self, session: AsyncSession, token: str) -> UserModel:
        token_model = (await session.execute(select(self._token_model).filter_by(token=token))).scalars().first()

        if not token_model:
            raise UserNotFoundError

        user_model = (
            await session.execute(select(self._user_model).filter_by(user_id=token_model.user_id))).scalars().first()

        return user_model

    async def get_user_id_by_login(self, session: AsyncSession, login: str) -> int:
        user_model = (await session.execute(select(self._user_model).filter_by(login=login))).scalars().first()

        if not user_model:
            raise UserNotFoundError

        return user_model.user_id

    def _create_salt(self):
        salt_symbols = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
        return "".join(choices(population=salt_symbols, k=self._salt_len))

    async def authorize(self, session: AsyncSession, user_auth_data: UserAuthorizationRequest) -> str:
        user_model = await self._get_user(session, user_auth_data.login)

        salt = str(user_model.secret)[: self._salt_len]
        salted_password = salt + user_auth_data.password
        password_bytes = bytes(salted_password, encoding="utf-8")
        password_hash = hashlib.md5(password_bytes).hexdigest()

        if user_model.secret[self._salt_len:] != password_hash:
            raise UserNotVerifyError

        return await self._create_token(session=session, user_id=user_model.user_id)

    async def _create_token(self, session: AsyncSession, user_id: int) -> str:
        token = str(uuid4())
        token_model = self._token_model(token=token, user_id=user_id)
        session.add(token_model)

        return token

    async def valid_token(self, session: AsyncSession, token: str) -> bool:
        try:
            res = await session.execute(
                select(self._token_model).filter(
                    and_(
                        self._token_model.token == token,
                        (datetime.utcnow() - self._token_model.updated_at) < timedelta(seconds=AUTH_TOKEN_LIFETIME))
                )
            )
            token_model = res.scalars().first()

            if not token_model:
                return False

            token_model.updated_at = datetime.utcnow()
            await session.flush()

        except Exception:
            return False
        return True
