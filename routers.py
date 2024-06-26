from fastapi import APIRouter

api_router = APIRouter(prefix="/api")


# users_router = APIRouter(
#     prefix="/users",
#     tags=["Users"],
#     dependencies=[Depends(verify_user)],
# )

monitoring_router = APIRouter(tags=["Monitoring"])

admin_router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)
users_router = APIRouter(
    prefix="/users",
    tags=["Users"]
)
tutors_router = APIRouter(
    prefix="/tutors",
    tags=["Users"]
)
students_router = APIRouter(
    prefix="/students",
    tags=["Users"]
)
themes_router = APIRouter(
    prefix="/themes",
    tags=["Users"]
)
demo_exams_router = APIRouter(
    prefix="/demo-exams",
    tags=["Users"]
)
lessons_router = APIRouter(
    prefix="/lessons",
    tags=["Users"]
)
# TODO включить депенденси на админа
