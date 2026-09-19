# Testing: react-ts-python

- Api: pytest, colocated in `apps/api/app/features/<name>/tests/` (FastAPI `TestClient`, no network).
- Web: Vitest, colocated in `apps/web/src/features/<name>/tests/`.
- E2E: Playwright, root `e2e/`, cross-module flows only.
- Each card `verified_by` lists its unit tests and any `e2e/` specs touching it.
- Run: `npm test` (web + api), `npm run test:e2e`, `npm run typecheck` (tsc + mypy), `npm run lint` (eslint + ruff), `npm run contract:check`. All must pass before a task is done.
