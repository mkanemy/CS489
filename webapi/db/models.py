from datetime import datetime
from enum import Enum
from typing import Optional

from sqlmodel import Field, SQLModel, Relationship


class SecretType(str, Enum):
    STRING = "string"
    FILE = "file"


class SecretMetadataBase(SQLModel):
    name: str = Field(unique=True)
    type: SecretType = Field(index=True)


class SecretMetadata(SecretMetadataBase, table=True):
    id: Optional[int] = Field(index=True, primary_key=True, default=None)
    owner_id: int = Field(index=True, foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.now)


class SecretMetadataPublic(SecretMetadataBase):
    id: int
    owner_id: int


class SecretString(SQLModel, table=True):
    secret_id: int = Field(index=True, primary_key=True, foreign_key="secretMetadata.id", ondelete="CASCADE")
    secret_string: bytes = Field()

    secret_metadata: Optional[SecretMetadata] = Relationship(back_populates="secretMetadata")


class SecretFile(SQLModel, table=True):
    secret_id: int = Field(index=True, primary_key=True, foreign_key="secretMetadata.id", ondelete="CASCADE")
    secret_file_path: str = Field()

    secret_metadata: Optional[SecretMetadata] = Relationship(back_populates="secretMetadata")
