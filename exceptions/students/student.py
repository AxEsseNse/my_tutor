__all__ = [
    "StudentNotFoundError",
    "StudentSaveImageError",
    "StudentAlreadyExistError",
    "StudentPhoneAlreadyExistError",
    "StudentAlreadyHasLesson"
]


class StudentNotFoundError(Exception):
    message = "Такой студент не зарегистрирован в системе"


class StudentSaveImageError(Exception):
    message = "Ошибка сохранения изображения"


class StudentAlreadyExistError(Exception):
    message = "Данный пользователь уже имеет профиль студента"


class StudentPhoneAlreadyExistError(Exception):
    message = "Данный номер телефона студента уже зарегистрирован в системе"


class StudentAlreadyHasLesson(Exception):
    message = "У студента уже есть урок в заданное время"
