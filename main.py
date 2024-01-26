from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from my_tutor.api import *
from my_tutor.app_pages import main_page, login, users_list, students_list, student_profile
from my_tutor.routers import api_router, admin_router, users_router, students_router




from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from starlette.requests import Request
from starlette.responses import JSONResponse

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/storage", StaticFiles(directory="storage"), name="storage")

app.add_api_route(path="/", endpoint=main_page)
app.add_api_route(path="/login", endpoint=login)
app.add_api_route(path="/admin/users", endpoint=users_list)
app.add_api_route(path="/admin/students", endpoint=students_list)
app.add_api_route(path="/student-profile", endpoint=student_profile)

api_router.include_router(admin_router)
api_router.include_router(users_router)
api_router.include_router(students_router)
app.include_router(api_router)
