# boto3

**Role:** AWS service access from Python.
**Version:** <verify against installed docs; add `boto3-stubs[<service>]` to dev requirements for mypy strict>

## Where it lives
- One adapter per AWS service: `app/shared/aws/<service>.py`. It defines a small `Protocol` port (`put_object`, `download_url`) and one implementation using boto3. Only this package imports `boto3` / `botocore`.
- Services depend on the port; `api.py` supplies the implementation through a `Depends` provider (cached with `lru_cache`). See `solid.md` D.
- Region and resource names come from `app/config.py` settings.

## Conventions
- `boto3.client("s3", region_name=..., config=Config(retries={"max_attempts": 3, "mode": "standard"}, connect_timeout=3, read_timeout=10))`.
- Credentials via the default chain only; never hardcode or log keys.
- boto3 is blocking: call it from `def` routes, or use `run_in_threadpool` from `async def`. Do not call it directly on the event loop.
- Map `botocore.exceptions.ClientError` by `error.response["Error"]["Code"]` to domain errors; do not leak raw errors.
- Use paginators (`get_paginator`) for lists. Presigned URLs get short expirations.
- Forbidden: boto3 types in service signatures, creating a client per call, bare `except`.

## Testing
Fake the port in service tests. Adapter tests use `moto`.

## Invariants emitted
- "AWS access only through app/shared/aws adapters."
