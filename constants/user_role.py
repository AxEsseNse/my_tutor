from enum import Enum


class UserRole(int, Enum):
    ADMIN = 1
    TUTOR = 2
    STUDENT = 3