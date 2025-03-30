import pathlib
import uuid
from datetime import datetime
from http import HTTPStatus
from pathlib import Path
from typing import List, Optional, Annotated

from fastapi import APIRouter, UploadFile, HTTPException, Query, Body, status
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, Field
from sqlmodel import select

from webapi.auth.jwt import UserEmailDep
from webapi.db.database import SessionDep
from webapi.db.models import SecretMetadata, SecretType, SecretMetadataPublic, SecretString, SecretFile
from webapi.storage.common import syspath
from webapi.storage.write import write


class SecretCreateUpdateModel(BaseModel):
    name: Optional[str]
    expires_at: Optional[datetime] = Field(gt=datetime.now(), default=None)


router = APIRouter()


def sanity_check(secret_metadata: SecretMetadata, user_email: str):
    if not secret_metadata:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND)
    elif secret_metadata.owner_email != user_email:
        raise HTTPException(status_code=HTTPStatus.UNAUTHORIZED)


@router.get("/vault", tags=["vault"], response_model=List[SecretMetadataPublic])
async def list_secret_metadata(user_email: UserEmailDep, session: SessionDep):
    return session.exec(select(SecretMetadata).where(SecretMetadata.owner_email == user_email)).all()


@router.get("/vault/secret/{secret_id}", tags=["vault"])
async def get_secret_value(user_email: UserEmailDep, secret_id: int, session: SessionDep):
    secret_metadata = session.get(SecretMetadata, secret_id)

    if not secret_metadata:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND)

    sanity_check(secret_metadata, user_email)

    if secret_metadata.type == SecretType.FILE:
        secret_file = session.get(SecretFile, secret_id)
        path = syspath(file_name=secret_file.secret_storage_name)
        file_name = secret_file.secret_file_name

        with open(path, "r", encoding="utf-8") as f:
            encrypted_content = f.read()

        return JSONResponse(content={
            "encrypted_file_name": file_name,
            "encrypted_file_content": encrypted_content,
        })

    else:
        secret_string = session.get(SecretString, secret_id)
        return secret_string.secret_string


@router.post("/vault/secret/{secret_id}", tags=["vault"])
async def update_secret_metadata(user_email: UserEmailDep, secret_id: int,
                                 update: Annotated[SecretCreateUpdateModel, Query()], session: SessionDep):
    secret_metadata = session.get(SecretMetadata, secret_id)

    if not secret_metadata:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND)

    sanity_check(secret_metadata, user_email)

    if update.expires_at:
        secret_metadata.expires_at = update.expires_at
    if update.name:
        secret_metadata.name = update.name

    session.commit()
    session.refresh(secret_metadata)

    return secret_metadata


@router.post("/vault/add/string", tags=["vault"])
async def add_secret_string(user_email: UserEmailDep, add: Annotated[SecretCreateUpdateModel, Query()],
                            secret_string: Annotated[bytes, Body(max_length=4096)], session: SessionDep):
    secret_metadata = SecretMetadata(name=add.name, expires_at=add.expires_at, owner_email=user_email,
                                     type=SecretType.STRING)
    session.add(secret_metadata)

    session.commit()
    session.refresh(secret_metadata)

    secret = SecretString(secret_id=secret_metadata.id, secret_string=secret_string)
    session.add(secret)

    session.commit()
    session.refresh(secret_metadata)

    return secret_metadata


@router.post("/vault/add/file", tags=["vault"])
async def add_secret_file(user_email: UserEmailDep, add: Annotated[SecretCreateUpdateModel, Query()],
                          secret_file: UploadFile, session: SessionDep):
    file_content: bytes = await secret_file.read()
    file_name: str = secret_file.filename
    storage_name: str = uuid.uuid4().hex
    storage_path: Path = syspath(storage_name)

    secret_metadata = SecretMetadata(name=add.name, expires_at=add.expires_at, owner_email=user_email,
                                     type=SecretType.FILE)
    session.add(secret_metadata)

    storage_path.parent.mkdir(parents=True, exist_ok=True)
    await write(file_content, storage_path)

    session.commit()
    session.refresh(secret_metadata)

    secret = SecretFile(secret_id=secret_metadata.id, secret_storage_name=storage_name, secret_file_name=file_name, secret_metadata=secret_metadata)
    session.add(secret)

    session.commit()
    session.refresh(secret)

    return secret_metadata


@router.delete("/vault/secret/{secret_id}", tags=["vault"], status_code=status.HTTP_204_NO_CONTENT)
async def delete_secret(user_email: UserEmailDep, secret_id: int, session: SessionDep):
    secret_metadata = session.get(SecretMetadata, secret_id)

    if not secret_metadata:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND)

    sanity_check(secret_metadata, user_email)

    if secret_metadata.type == SecretType.FILE:
        secret_file = session.get(SecretFile, secret_id)
        storage_path: Path = syspath(file_name=secret_file.secret_storage_name)

        try:
            pathlib.Path.unlink(storage_path)
        except FileNotFoundError:
            raise HTTPException(status_code=HTTPStatus.NOT_FOUND)
        except OSError:
            raise HTTPException(status_code=HTTPStatus.PRECONDITION_FAILED)

    session.delete(secret_metadata)
    session.commit()
