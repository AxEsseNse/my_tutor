from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from my_tutor.api import *
from my_tutor.app_pages import main_page, login, users_list, tutors_list, students_list, themes_list, tutor_profile, student_profile, get_lesson, lesson_history
from my_tutor.routers import api_router, admin_router, users_router, tutors_router, students_router, themes_router, lessons_router, monitoring_router


app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/storage", StaticFiles(directory="storage"), name="storage")

app.add_api_route(path="/", endpoint=main_page)
app.add_api_route(path="/login", endpoint=login)
app.add_api_route(path="/admin/users", endpoint=users_list)
app.add_api_route(path="/admin/tutors", endpoint=tutors_list)
app.add_api_route(path="/admin/students", endpoint=students_list)
app.add_api_route(path="/admin/themes", endpoint=themes_list)
app.add_api_route(path="/lesson/{lesson_id}", endpoint=get_lesson)
app.add_api_route(path="/tutor-profile", endpoint=tutor_profile)
app.add_api_route(path="/student-profile", endpoint=student_profile)
app.add_api_route(path="/lesson-history", endpoint=lesson_history)

api_router.include_router(admin_router)
api_router.include_router(users_router)
api_router.include_router(tutors_router)
api_router.include_router(students_router)
api_router.include_router(themes_router)
api_router.include_router(lessons_router)
app.include_router(api_router)
app.include_router(monitoring_router)
