__all__ = ["UserNotFoundError", "UserNotVerifyError"]


class UserNotFoundError(Exception):
    message = "Такой пользователь не зарегистрирован в системе"


class UserNotVerifyError(Exception):
    message = "Неправильная пара логин/пароль"


class UserAlreadyExistError(Exception):
    message = "Пользователь с таким логином уже зарегистрирован: {}"

    def __init__(self, msg: str):
        self.message = self.message.format(msg)
