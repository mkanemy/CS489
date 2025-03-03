from pathlib import Path

bucket_path = Path("__file__").parent.joinpath("bucket")


def syspath(file_name: str) -> Path:
    return bucket_path / Path(file_name)
