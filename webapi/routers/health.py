from fastapi import APIRouter

from webapi.auth.jwt import UserEmailDep

router = APIRouter()


@router.get("/health", tags=["health"])
async def check_token_health(user_email: UserEmailDep):
    return user_email
