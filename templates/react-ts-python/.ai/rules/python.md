# Python API conventions (FastAPI)

Read with `conventions.md`, `stack.md`, `contract.md`. Frontend rules: `frontend.md`. Tooling: `ruff` (lint + import order + naming) and `mypy --strict` must pass.

## Naming
- Modules and packages `snake_case`; classes `PascalCase`; functions, variables `snake_case`; constants `UPPER_SNAKE`; private helpers prefixed `_`.
- Pydantic models `PascalCase` without `Schema`/`DTO` suffix. Request/response models describe API shapes: name them for what they are (`CreateOrderRequest`, `OrderResponse`).
- JSON is camelCase on the wire: models inherit `CamelModel` from `app/shared/schemas.py` (alias generator + `populate_by_name`), so Python stays snake_case.

## Feature layout (apps/api/app/features/<name>/)
```
__init__.py         # surface: re-export router and whatever other features need
api.py              # APIRouter: thin HTTP glue only
service.py          # business logic; plain Python, no FastAPI imports
repo.py             # data access; the only module that touches the database/external APIs
model.py            # Pydantic models (API shapes) and domain types
tests/test_*.py
_ai.md
```
- Direction: `api` -> `service` -> `repo`. Never upward, never skipping. `service.py` declares the small `Protocol` ports it needs and receives implementations as arguments; `api.py` supplies them through `Depends` providers (composition root), tests pass fakes (see `solid.md` D). `service.py` raises domain exceptions (`class OrderNotFound(DomainError)`); only `api.py` converts them to `HTTPException`.
- Other features import only what `__init__.py` exports; never `app.features.x.repo`.
- `app/main.py` builds the app and includes routers; nothing else creates `FastAPI()`.

## Routes
- Prefix `/api`, plural kebab-case nouns, verbs from the HTTP method. Always set `response_model`, `status_code` when not 200, and a unique `operation_id` (it becomes the generated client name).
- Use `Depends` for auth, DB sessions and settings; no globals.
- Route functions are `def` unless they await IO; do not make CPU or blocking code `async`.

## Code style
- Type hints on every function and attribute; no `Any` without a comment. Use `X | None`, `list[str]` (modern syntax), `Literal` for closed sets, `Enum` only when values need behavior.
- Public functions get a one-line docstring stating purpose; no docstrings that restate the signature.
- No wildcard imports, no mutable default arguments, no bare `except`. Catch specific exceptions; re-raise with context (`raise ... from err`).
- `pathlib.Path` over string paths; f-strings over `%`/`format`; comprehensions only when they stay readable on one line.
- Settings in `app/config.py` (create it with the first env var; read env once, typed, fail fast). No `os.environ` elsewhere.
- Logging via `logging.getLogger(__name__)`; never `print`.

## Tests
- Service tests: plain pytest, no HTTP. Route tests: `TestClient(app)`; override dependencies with `app.dependency_overrides`. Files `test_<subject>.py`, functions `test_<behavior>`.
- After changing models or routes run `npm run contract:gen` and commit the generated files.
