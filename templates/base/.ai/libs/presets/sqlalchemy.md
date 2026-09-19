# sqlalchemy

**Role:** ORM and SQL toolkit for the Python API. Pair with Alembic for migrations. Use the 2.0 style only.
**Version:** <verify against installed docs; 2.x>

## Where it lives
- Engine and session factory: `app/shared/db.py`; `get_session` dependency yields one `Session` per request.
- Per feature: `orm.py` (SQLAlchemy entities), `repo.py` (queries; the only module using `Session`), `model.py` stays Pydantic API models.
- Migrations: `apps/api/migrations/` (Alembic, committed). DB URL from `app/config.py`.

## Conventions
- Entities: `class User(Base)` with `Mapped[...]` and `mapped_column(...)`; table names snake_case plural (`__tablename__ = "user_profiles"`).
- Queries use `select()` and `session.scalars(...)`; no legacy `session.query`.
- Repo functions take the `Session` as a parameter. The transaction boundary (commit/rollback) is owned by the `get_session` dependency or the service, never scattered in repos.
- Never return ORM entities from `api.py`: map to Pydantic models. Avoid N+1 with `selectinload` / `joinedload`.
- Schema change flow: edit entities, `alembic revision --autogenerate -m "<change>"`, review the script, commit it. Never edit applied migrations.
- Forbidden: string-built SQL, sessions stored in globals, lazy loading in serialization.

## Testing
Service tests use a fake repo port. Repo tests use a real test database (or in-memory SQLite when SQL is portable), created fresh per test session.

## Invariants emitted
- "Only repo.py modules use the database session."
