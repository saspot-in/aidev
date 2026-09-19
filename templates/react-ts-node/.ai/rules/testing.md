# Testing: react-ts-node

- Unit/integration: Vitest, colocated in `<app>/src/features/<name>/tests/`. Api tests use Fastify `app.inject` (no network).
- E2E: Playwright, root `e2e/`, cross-module flows only.
- Each card's `verified_by` lists its unit tests and any `e2e/` specs touching it.
- Run: `npm test`, `npm run test:e2e`, `npm run typecheck`, `npm run lint`. All must pass before a task is done.
