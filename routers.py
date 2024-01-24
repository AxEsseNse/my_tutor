from fastapi import APIRouter

api_router = APIRouter(prefix="/api")


# users_router = APIRouter(
#     prefix="/users",
#     tags=["Users"],
#     dependencies=[Depends(verify_user)],
# )
admin_router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)
users_router = APIRouter(
    prefix="/users",
    tags=["Users"]
)
students_router = APIRouter(
    prefix="/students",
    tags=["Users"]
)
# TODO включить депенденси на админа