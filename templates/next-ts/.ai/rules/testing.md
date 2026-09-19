# Testing: next-ts

- Unit/integration: Vitest, colocated in `src/features/<name>/tests/`.
- E2E: Playwright, root `e2e/`, cross-module flows only.
- Each card's `verified_by` lists its unit tests and any `e2e/` specs touching it.
- Run: `npm test` (unit), `npm run test:e2e`, `npm run typecheck`, `npm run lint`. All must pass before a task is done.
