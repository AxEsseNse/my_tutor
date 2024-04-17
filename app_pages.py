from fastapi import Request, Depends, HTTPException
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse

from my_tutor.depends import get_authorized_user, check_access
from my_tutor.constants import LessonAccess

templates = Jinja2Templates(directory="templates")
LOGIN_URL = "/login"


async def login(request: Request, authorized_user=Depends(get_authorized_user)):
    if authorized_user is not None:
        return RedirectResponse("/")
    return templates.TemplateResponse(
        "login.html",
        {
            "request": request,
            "title": "Авторизация"
        }
    )


async def main_page(request: Request, authorized_user=Depends(get_authorized_user)):
    return templates.TemplateResponse(
        "main_page.html",
        {
            "request": request,
            "title": "Мой репетитор",
            "user": authorized_user
        }
    )


async def price_list(request: Request, authorized_user=Depends(get_authorized_user)):
    return templates.TemplateResponse(
        "price_list.html",
        {
            "request": request,
            "title": "Мой репетитор",
            "user": authorized_user
        }
    )


async def presentation(request: Request, authorized_user=Depends(get_authorized_user)):
    return templates.TemplateResponse(
        "presentation.html",
        {
            "request": request,
            "title": "Мой репетитор",
            "user": authorized_user
        }
    )


async def reviews(request: Request, authorized_user=Depends(get_authorized_user)):
    return templates.TemplateResponse(
        "reviews.html",
        {
            "request": request,
            "title": "Мой репетитор",
            "user": authorized_user
        }
    )


async def users_list(request: Request, authorized_user=Depends(get_authorized_user)):
    if authorized_user is None or authorized_user.role != "Администратор":
        return templates.TemplateResponse(
            "not_authorized.html",
            {
                "request": request,
                "title": "Ошибка авторизации",
                "user": authorized_user
            }
        )
    return templates.TemplateResponse(
        "users_list.html",
        {
            "request": request,
            "title": "Панель администрирования",
            "user": authorized_user
        }
    )


async def tutors_list(request: Request, authorized_user=Depends(get_authorized_user)):
    if authorized_user is None or authorized_user.role != "Администратор":
        return templates.TemplateResponse(
            "not_authorized.html",
            {
                "request": request,
                "title": "Ошибка авторизации",
                "user": authorized_user
            }
        )
    return templates.TemplateResponse(
        "tutors_list.html",
        {
            "request": request,
            "title": "Панель администрирования",
            "user": authorized_user
        }
    )


async def students_list(request: Request, authorized_user=Depends(get_authorized_user)):
    if authorized_user is None or authorized_user.role != "Администратор":
        return templates.TemplateResponse(
            "not_authorized.html",
            {
                "request": request,
                "title": "Ошибка авторизации",
                "user": authorized_user
            }
        )
    return templates.TemplateResponse(
        "students_list.html",
        {
            "request": request,
            "title": "Панель администрирования",
            "user": authorized_user
        }
    )


async def themes_list(request: Request, authorized_user=Depends(get_authorized_user)):
    if authorized_user is None or authorized_user.role != "Администратор":
        return templates.TemplateResponse(
            "not_authorized.html",
            {
                "request": request,
                "title": "Ошибка авторизации",
                "user": authorized_user
            }
        )
    return templates.TemplateResponse(
        "themes_list.html",
        {
            "request": request,
            "title": "Панель администрирования",
            "user": authorized_user
        }
    )


async def theme_cards(request: Request, authorized_user=Depends(get_authorized_user)):
    if authorized_user is None or authorized_user.role != "Администратор":
        return templates.TemplateResponse(
            "not_authorized.html",
            {
                "request": request,
                "title": "Ошибка авторизации",
                "user": authorized_user
            }
        )
    return templates.TemplateResponse(
        "theme_card.html",
        {
            "request": request,
            "title": "Панель администрирования",
            "user": authorized_user
        }
    )


async def join_lesson(request: Request, lesson_id: int, access: LessonAccess = Depends(check_access), authorized_user=Depends(get_authorized_user)):
    if authorized_user is None:
        return templates.TemplateResponse(
            "not_authorized.html",
            {
                "request": request,
                "title": "Ошибка авторизации",
                "user": authorized_user
            }
        )
    match access:
        case LessonAccess.AVAILABLE:
            return templates.TemplateResponse(
                "lesson.html",
                {
                    "request": request,
                    "title": "Урок",
                    "user": authorized_user,
                    "lesson_id": lesson_id
                }
            )
        case LessonAccess.NOT_AUTHORIZED:
            return templates.TemplateResponse(
                "not_authorized.html",
                {
                    "request": request,
                    "title": "Ошибка авторизации",
                    "user": authorized_user
                }
            )
        case LessonAccess.NOT_AVAILABLE:
            raise HTTPException(status_code=403, detail="В данный момент ресурс не доступен")
        case LessonAccess.ERROR:
            raise HTTPException(status_code=403, detail="В данный момент ресурс не доступен")


async def tutor_profile(request: Request, authorized_user=Depends(get_authorized_user)):
    if authorized_user is None or authorized_user.role == "Студент":
        return templates.TemplateResponse(
            "not_authorized.html",
            {
                "request": request,
                "title": "Ошибка авторизации",
                "user": authorized_user
            }
        )
    return templates.TemplateResponse(
        "tutor_profile.html",
        {
            "request": request,
            "title": "Профиль",
            "user": authorized_user
        }
    )


async def student_profile(request: Request, authorized_user=Depends(get_authorized_user)):
    if authorized_user is None:
        return templates.TemplateResponse(
            "not_authorized.html",
            {
                "request": request,
                "title": "Ошибка авторизации",
                "user": authorized_user
            }
        )
    return templates.TemplateResponse(
        "student_profile.html",
        {
            "request": request,
            "title": "Профиль",
            "user": authorized_user
        }
    )


async def studying_progress(request: Request, authorized_user=Depends(get_authorized_user)):
    if authorized_user is None:
        return templates.TemplateResponse(
            "not_authorized.html",
            {
                "request": request,
                "title": "Ошибка авторизации",
                "user": authorized_user
            }
        )
    return templates.TemplateResponse(
        "studying_progress.html",
        {
            "request": request,
            "title": "Мое обучение",
            "user": authorized_user
        }
    )


async def lesson_history(request: Request, authorized_user=Depends(get_authorized_user)):
    if authorized_user is None:
        return templates.TemplateResponse(
            "not_authorized.html",
            {
                "request": request,
                "title": "Ошибка авторизации",
                "user": authorized_user
            }
        )
    return templates.TemplateResponse(
        "lesson_history.html",
        {
            "request": request,
            "title": "История занятий",
            "user": authorized_user
        }
    )
