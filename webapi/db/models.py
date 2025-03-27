from datetime import datetime
from enum import Enum
from typing import Optional

from sqlmodel import Field, SQLModel, Relationship


class SecretType(str, Enum):
    STRING = "string"
    FILE = "file"


class SecretMetadataBase(SQLModel):
    name: str = Field()
    type: SecretType = Field(index=True)
    expires_at: Optional[datetime] = Field(default=None)


class SecretMetadata(SecretMetadataBase, table=True):
    id: Optional[int] = Field(index=True, primary_key=True, default=None)
    owner_email: str = Field(index=True)
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
    secret_file_name: str = Field()

    secret_metadata: Optional[SecretMetadata] = Relationship()
