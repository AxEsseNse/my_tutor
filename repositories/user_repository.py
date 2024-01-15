import hashlib
from datetime import datetime, timedelta
from random import choices
from uuid import uuid4

from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from my_tutor.exceptions import UserNotFoundError, UserNotVerifyError, UserAlreadyExistError
from my_tutor.models import TokenModel, UserModel, RoleModel
from my_tutor.schemes import UserAuthorizationRequest, CreateUserRequest, ChangeUserPasswordRequest
from my_tutor.domain import User
from my_tutor.constants import UserRole

from sqlalchemy.orm import joinedload
AUTH_TOKEN_LIFETIME = 604800
TEMP_ROLES = {
    'admin': 1,
    'tutor': 2,
    'student': 3
}


class UserRepository:
    _domain = User
    _user_model = UserModel
    _role_model = RoleModel
    _token_model = TokenModel
    _salt_len = 13

    async def _get_new_user_id(self, session: AsyncSession) -> int:
        return await session.scalar(self._user_model.id_seq.next_value())

    def _to_domain(self, user_model: UserModel) -> User:
        return self._domain(
            login=user_model.login,
            role=user_model.role.title
        )

    async def _get_user(self, session: AsyncSession, login: str) -> UserModel:
        user_model = (await session.execute(select(self._user_model).filter_by(login=login))).scalars().first()

        if not user_model:
            raise UserNotFoundError

        return user_model

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
            token_model: TokenModel | None = res.scalars().first()

            if not token_model:
                return False

            token_model.updated_at = datetime.utcnow()
            await session.flush()

        except Exception:
            return False
        return True

    async def get_user_by_token(self, session: AsyncSession, token: str) -> User:
        token_model = (await session.execute(select(self._token_model).filter_by(token=token))).scalars().first()

        if not token_model:
            raise UserNotFoundError

        user_model = (
            (await session.execute(select(self._user_model).filter_by(user_id=token_model.user_id))).scalars().first()
        )

        if not user_model:
            raise UserNotFoundError

        return self._to_domain(user_model)

    async def get_users(self, session: AsyncSession) -> list[User]:
        query = select(UserModel, RoleModel).options(joinedload(UserModel.role)).where(UserModel.role_id == RoleModel.role_id).order_by(UserModel.login.asc())
        user_models = await session.execute(query)

        return [self._to_domain(user_model) for user_model in user_models.scalars().all()]

    async def add_user(self, session: AsyncSession, user_data: CreateUserRequest) -> User:
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
            user_id=await self._get_new_user_id(session),
            login=user_data.login,
            secret=salted_hash,
            role_id=role
        )
        session.add(new_user)
        return "Пользователь успешно зарегистрирован"

    async def delete_user(self, session: AsyncSession, login: str) -> dict:
        user_model = await self._get_user(session, login=login)
        await session.delete(user_model)
        return {'success': 'Пользователь успешно удален'}

    async def change_user_password(self, session: AsyncSession, user_data: ChangeUserPasswordRequest) -> str:
        user_model = await self._get_user(session, login=user_data.login)

        salt = self._create_salt()
        salted_password = salt + user_data.password
        password_bytes = bytes(salted_password, encoding="utf-8")
        password_hash = hashlib.md5(password_bytes).hexdigest()
        salted_hash = salt + password_hash

        user_model.secret = salted_hash
        session.add(user_model)
        return {'success': 'Пароль успешно изменен'}
