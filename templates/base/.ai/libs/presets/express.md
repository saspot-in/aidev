# express

**Role:** HTTP server for a Node API. In `react-ts-node` this role belongs to Fastify: use this preset only in a project that replaces Fastify (needs an ADR and a migration plan) or a Node project with no server yet.
**Version:** <verify; use Express 5, which forwards async errors natively>

## Where it lives
- `src/app.ts`: `createApp(deps)` builds and returns the Express app (never calls `listen`). `src/index.ts` only starts it.
- Per feature: `api/routes.ts` exports a `Router`, registered in `app.ts`. Layers stay `routes` -> `service` -> `repo` (see `backend.md`, `solid.md`).

## Conventions
- Handlers are thin: validate with the contract schema through a `validate(schema)` middleware, call the service, send the result. No business logic in handlers.
- One error-handling middleware, registered last, mapping typed errors to `{ error: { code, message } }`. Never leak stack traces.
- Middleware order: request id/logging, `helmet`, `cors` (origins from typed config), body parser with size limit, routes, not-found, error handler.
- Config read once in `src/config.ts`; the app never reads `process.env`.
- Forbidden: `res.send` after an error path without returning, global mutable state on `app.locals` for business data, catching errors only to log them.

## Testing
`supertest(createApp(fakeDeps))`; fakes for repo ports; no network.

## Invariants emitted
- "HTTP server is Express; routes only in feature api/routes.ts."
