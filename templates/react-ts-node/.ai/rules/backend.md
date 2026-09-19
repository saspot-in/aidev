# Node API conventions (Fastify + TypeScript)

Read with `conventions.md`, `stack.md`, `contract.md`. Frontend rules: `frontend.md`.

## Feature layout (apps/api/src/features/<name>/)
```
index.ts            # surface: registerX(app) plus anything other features need
api/routes.ts       # HTTP glue only: parse input, call service, shape response
api/service.ts      # business logic; no Fastify types; pure where possible
api/repo.ts         # data access; the only place that talks to the database/external APIs
model/              # domain types, pure rules
tests/
_ai.md
```
- Dependency direction inside a feature: `routes` → `service` → `repo`. Never upward, never skipping. The service is a factory (`createXService({ repo, now })`) that depends on small ports it declares (see `solid.md` D); `app.ts` builds the real repo and injects it, tests inject fakes.
- `src/app.ts` builds the app and registers each feature (`registerX(app)`); `src/index.ts` only starts the server. Nothing else touches `listen`.
- Adding an endpoint: schema in `packages/contract` first, then route, then service, then tests.

## Routes
- Path: `/api/<plural-kebab-noun>`; verbs come from the HTTP method, not the path. Version only when a breaking change forces it.
- Validate params, query, body with the contract zod schema (`.parse` or Fastify type provider). Build every response through its schema.
- Status codes: 200 read, 201 create (with `Location`), 204 empty, 400 invalid input, 401 unauthenticated, 403 forbidden, 404 missing, 409 conflict. 500s are never hand-thrown.
- Handlers are `async` and return data; no `reply.send` juggling unless setting headers/status.

## Errors
- Services throw typed errors (`class NotFoundError extends AppError`) that carry a stable `code`. One error handler (`app.setErrorHandler`) maps them to `{ error: { code, message } }`. No `try/catch` in routes unless converting an error.
- Never leak stack traces, SQL or internal ids in responses.

## Config, logging, side effects
- All env reads in `src/config.ts` (create it with the first env var; zod-parsed, typed, fail fast at boot). No `process.env` elsewhere.
- Log with `app.log` / `request.log` (structured, no secrets, no PII). Never `console.log`.
- Timers, queues and external clients are created in `app.ts` or a plugin and injected; no module-level clients.

## Tests
- Service tests: pure unit tests, no Fastify. Route tests: `buildApp()` + `app.inject`, no network, fakes for `repo`.
