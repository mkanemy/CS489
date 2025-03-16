from pathlib import Path

import aiofiles


async def write(data: bytes, file: Path):
    async with aiofiles.open(file, "wb+") as f:
        await f.write(data)
