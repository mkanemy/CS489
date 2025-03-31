import os
from typing import Annotated

import bcrypt
from fastapi import APIRouter, Body, HTTPException, status

from webapi.auth.jwt import UserEmailDep
from webapi.db.database import SessionDep
from webapi.db.models import User

router = APIRouter()


@router.post("/user/register_master_key", tags=["user"], status_code=status.HTTP_201_CREATED)
async def register_master_key_hash(user_email: UserEmailDep, master_key_hash: Annotated[bytes, Body()],
                                   session: SessionDep):
    SALT = os.getenv("SALT").encode("utf8")
    
    user = session.get(User, user_email)
    if user:
        session.delete(user)

    user = User(email=user_email, master_key_hash=bcrypt.hashpw(master_key_hash, SALT))
    session.add(user)

    session.commit()


@router.get("/user/check_master_key", tags=["user"], status_code=status.HTTP_202_ACCEPTED)
async def check_master_key_hash(user_email: UserEmailDep, master_key_hash: bytes, session: SessionDep):
    user = session.get(User, user_email)

    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User hasn't registered master key yet.")

    if not bcrypt.checkpw(master_key_hash, user.master_key_hash):
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="Master key hash doesn't match.")


@router.get("/user/check_registration", tags=["user"], status_code=status.HTTP_200_OK)
async def check_registration(user_email: UserEmailDep, session: SessionDep):
    user = session.get(User, user_email)

    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User hasn't registered master key yet.")
