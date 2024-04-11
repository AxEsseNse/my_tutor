from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from my_tutor.models import ParentModel
from my_tutor.domain import ParentInfo
from my_tutor.schemes import AddParentRequest, AddParentResponse, DeleteParentRequest, DeleteParentResponse, UpdateParentRequest, UpdateParentResponse
from my_tutor.exceptions import ParentAlreadyExistError, ParentNotFoundError


class ParentRepository:
    _parent_model = ParentModel
    _info_domain = ParentInfo
    _add_parent_response = AddParentResponse
    _delete_parent_response = DeleteParentResponse
    _update_parent_response = UpdateParentResponse

    async def _get_new_parent_id(self, session: AsyncSession) -> int:
        return await session.scalar(self._parent_model.id_seq.next_value())

    def _to_info_domain(self, parent_model: ParentModel) -> ParentInfo:

        return self._info_domain(
            status=parent_model.status,
            first_name=parent_model.first_name,
            second_name=parent_model.second_name,
            phone=parent_model.phone,
            telegram=parent_model.telegram,
            whatsapp=parent_model.whatsapp
        )

    def _to_add_parent_response(self, parent_model: ParentModel) -> AddParentResponse:

        return self._add_parent_response(
            status=parent_model.status,
            first_name=parent_model.first_name,
            second_name=parent_model.second_name,
            phone=parent_model.phone,
            telegram=parent_model.telegram,
            whatsapp=parent_model.whatsapp,
            message="Данные родителя успешно добавлены"
        )

    def _to_delete_parent_response(self, parent_model: ParentModel) -> DeleteParentResponse:

        return self._delete_parent_response(
            first_name=parent_model.first_name,
            second_name=parent_model.second_name,
            message="Данные родителя успешно удалены"
        )

    def _to_update_parent_response(self, parent_model: ParentModel) -> UpdateParentResponse:

        return self._update_parent_response(
            status=parent_model.status,
            first_name=parent_model.first_name,
            second_name=parent_model.second_name,
            phone=parent_model.phone,
            telegram=parent_model.telegram,
            whatsapp=parent_model.whatsapp,
            message="Данные родителя успешно обновлены"
        )

    async def get_parents(self, session: AsyncSession, student_id: int) -> list[ParentInfo]:
        parent_models = await session.execute(
            select(self._parent_model)
            .filter_by(student_id=student_id)
            .order_by(
                self._parent_model.status,
                self._parent_model.first_name,
                self._parent_model.second_name
            )
        )

        return [self._to_info_domain(parent_model) for parent_model in parent_models.scalars().all()]

    async def add_parent(self, session: AsyncSession, parent_data: AddParentRequest, student_id: int) -> AddParentResponse:
        parent_model = (
            await session.execute(select(self._parent_model).filter_by(phone=parent_data.phone))).scalars().first()

        if parent_model:
            raise ParentAlreadyExistError

        new_parent = self._parent_model(
            student_id=student_id,
            status=parent_data.status,
            first_name=parent_data.first_name,
            second_name=parent_data.second_name,
            phone=parent_data.phone,
            telegram=parent_data.telegram,
            whatsapp=parent_data.whatsapp
        )
        session.add(new_parent)

        return self._to_add_parent_response(new_parent)

    async def update_parent(self, session: AsyncSession, parent_data: UpdateParentRequest) -> UpdateParentResponse:
        parent_model = (
            await session.execute(select(self._parent_model).filter_by(phone=parent_data.phone_key))).scalars().first()

        if not parent_model:
            raise ParentNotFoundError

        parent_model.status = parent_data.status
        parent_model.first_name = parent_data.first_name
        parent_model.second_name = parent_data.second_name
        parent_model.phone = parent_data.new_phone
        parent_model.telegram = parent_data.telegram
        parent_model.whatsapp = parent_data.whatsapp

        session.add(parent_model)

        return self._to_update_parent_response(parent_model)

    async def delete_parent(self, session: AsyncSession, parent_data: DeleteParentRequest) -> DeleteParentResponse:
        parent_model = (
            await session.execute(select(self._parent_model).filter_by(phone=parent_data.phone))).scalars().first()

        if not parent_model:
            raise ParentNotFoundError

        delete_parent_response = self._to_delete_parent_response(parent_model)

        await session.delete(parent_model)

        return delete_parent_response
