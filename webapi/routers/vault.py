import pathlib
import uuid
from http import HTTPStatus
from pathlib import Path
from typing import List

from fastapi import APIRouter, UploadFile, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel

from webapi.db.database import SessionDep
from webapi.db.models import SecretMetadata, SecretType, SecretMetadataPublic, SecretString, SecretFile
from webapi.storage.common import syspath
from webapi.storage.write import write


class UploadSecretStringRequest(BaseModel):
    name: str
    secret_string: bytes


class UploadSecretFileRequest(BaseModel):
    name: str


class RenameSecretRequest(BaseModel):
    name: str


router = APIRouter()


def sanity_check(secret_metadata: SecretMetadata, user_id: int):
    if not secret_metadata:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND)
    elif secret_metadata.owner_id != user_id:
        raise HTTPException(status_code=HTTPStatus.UNAUTHORIZED)


@router.get("/vault/{user_id}", tags=["vault"], response_model=List[SecretMetadataPublic])
async def get_secret_metadata(user_id: int, session: SessionDep):
    return session.get(SecretMetadata, owner_id=user_id)


@router.get("/vault/{user_id}/{secret_id}", tags=["vault"])
async def get_secret(user_id: int, secret_id: int, session: SessionDep):
    secret_metadata = session.get(SecretMetadata, id=secret_id)

    sanity_check(secret_metadata, user_id)

    if secret_metadata.type == SecretType.FILE:
        secret_file = session.get(SecretFile, secret_id=secret_id)

        return FileResponse(secret_file.secret_file_path)
    else:
        secret_string = session.get(SecretString, secret_id=secret_id)

        return secret_string.secret_string


@router.post("/vault/{user_id}/{secret_id}", tags=["vault"])
async def post_rename_secret(user_id: int, secret_id: int, request: RenameSecretRequest, session: SessionDep):
    secret_metadata = session.get(SecretMetadata, id=secret_id)

    sanity_check(secret_metadata, user_id)

    secret_metadata.name = request.name
    session.commit()


@router.post("/vault/{user_id}/string", tags=["vault"])
async def post_secret_string(user_id: int, request: UploadSecretStringRequest, session: SessionDep):
    secret_metadata = SecretMetadata(name=request.name, owner_id=user_id, type=SecretType.STRING)
    session.add(secret_metadata)

    session.commit()
    session.refresh(secret_metadata)

    secret = SecretString(secret_id=secret_metadata.id, secret_string=request.secret_string)
    session.add(secret)

    return secret_metadata


@router.post("/vault/{user_id}/file", tags=["vault"])
async def post_secret_file(user_id: int, request: UploadSecretFileRequest, secret_file: UploadFile,
                           session: SessionDep):
    file_content: bytes = await secret_file.read()
    file_name: str = uuid.uuid4().hex
    storage_path: Path = syspath(file_name=file_name)

    secret_metadata = SecretMetadata(name=request.name, owner_id=user_id, type=SecretType.FILE)
    session.add(secret_metadata)

    await write(file_content, storage_path)

    session.commit()
    session.refresh(secret_metadata)

    secret = SecretFile(secret_id=secret_metadata.id, secret_file_path=storage_path)
    session.add(secret)

    return secret_metadata


@router.delete("/vault/{user_id}/{secret_id}", tags=["vault"])
async def delete_secret_string(user_id: int, secret_id: int, session: SessionDep):
    secret_metadata = session.get(SecretMetadata, secret_id=secret_id)

    sanity_check(secret_metadata, user_id)

    if secret_metadata.type == SecretType.FILE:
        secret_file = session.get(SecretFile, secret_id=secret_id)

        try:
            pathlib.Path.unlink(secret_file.secret_file_path)
        except FileNotFoundError:
            raise HTTPException(status_code=HTTPStatus.NOT_FOUND)
        except OSError:
            raise HTTPException(status_code=HTTPStatus.PRECONDITION_FAILED)

    session.delete(SecretMetadata, id=secret_id)
