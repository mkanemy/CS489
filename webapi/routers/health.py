from fastapi import APIRouter, status

from webapi.auth.jwt import UserEmailDep

router = APIRouter()


@router.get("/health", tags=["health"], status_code=status.HTTP_200_OK)
async def check_token_health(_: UserEmailDep):
    return
