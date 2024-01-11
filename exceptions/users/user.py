__all__ = ["UserNotFoundError", "UserNotVerifyError"]


class UserNotFoundError(Exception):
    message = "Такой пользователь не зарегистрирован в системе"


class UserNotVerifyError(Exception):
    message = "Неправильная пара логин/пароль"



