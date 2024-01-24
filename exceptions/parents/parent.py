__all__ = ["ParentAlreadyExistError", "ParentNotFoundError"]


class ParentAlreadyExistError(Exception):
    message = "Родитель с такими данными уже зарегистрирован"


class ParentNotFoundError(Exception):
    message = "Данных по этому родителю нет в системе"
