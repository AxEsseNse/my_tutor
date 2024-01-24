__all__ = ["StudentNotFoundError", "StudentSaveImageError"]


class StudentNotFoundError(Exception):
    message = "Такой студент не зарегистрирован в системе"


class StudentSaveImageError(Exception):
    message = "Ошибка сохранения изображения"
