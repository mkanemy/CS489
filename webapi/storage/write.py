from functools import singledispatch
from pathlib import Path
from typing import Union

import aiofiles


@singledispatch
async def write(data: Union[str, bytes], file: Path):
    pass


@write.register(bytes)
async def _(data: bytes, file: Path):
    async with aiofiles.open(file, "wb+") as f:
        await f.write(data)


@write.register(str)
async def _(data: str, file: Path):
    async with aiofiles.open(file, "w+", encoding='utf-8') as f:
        await f.write(data)
