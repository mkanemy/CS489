from datetime import datetime
from enum import Enum
from typing import Optional

from sqlmodel import Field, SQLModel, Relationship


class SecretType(str, Enum):
    STRING = "Text"
    FILE = "File"


class SecretMetadataBase(SQLModel):
    name: str = Field()
    type: SecretType = Field(index=True)
    expires_at: Optional[datetime] = Field(default=None)


class SecretMetadata(SecretMetadataBase, table=True):
    id: Optional[int] = Field(index=True, primary_key=True, default=None)
    owner_email: str = Field(index=True, foreign_key="user.email", ondelete="CASCADE")
    created_at: datetime = Field(default_factory=datetime.now)


class SecretMetadataPublic(SecretMetadataBase):
    id: int
    created_at: datetime


class SecretString(SQLModel, table=True):
    secret_id: int = Field(index=True, primary_key=True, foreign_key="secretmetadata.id", ondelete="CASCADE")
    secret_string: bytes = Field()

    secret_metadata: Optional[SecretMetadata] = Relationship()


class SecretFile(SQLModel, table=True):
    secret_id: int = Field(index=True, primary_key=True, foreign_key="secretmetadata.id", ondelete="CASCADE")
    secret_storage_name: str = Field()
    secret_file_name: str = Field()

    secret_metadata: Optional[SecretMetadata] = Relationship()


class User(SQLModel, table=True):
    email: str = Field(primary_key=True)
    master_key_hash: bytes = Field(nullable=False)

    secret_metadata_list: list[SecretMetadata] = Relationship(cascade_delete=True)
