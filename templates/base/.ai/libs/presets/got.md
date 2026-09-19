# got

**Role:** HTTP client for Node (server side only). Only one library holds the HTTP-client role.
**Version:** <verify; got is ESM-only>

## Where it lives
- Adapter, the only file importing got: `src/lib/http.ts`, exporting an `HttpClient` port plus one instance.
- Services receive the port as a dependency (see `.ai/rules/solid.md` D); they never import got.

## Conventions
- `got.extend({ prefixUrl, timeout: { request: 5000 }, retry: { limit: 2, methods: ["GET"] }, responseType: "json" })`.
- Use `.json<T>()` and then parse with the schema; never trust the generic alone.
- Map `HTTPError`, `TimeoutError`, `RequestError` to project errors (`UpstreamError`, `TimeoutError`) with a stable `code`; do not leak upstream bodies or URLs containing secrets.
- Log via the app logger with the request id; never log auth headers.
- Forbidden: got in browser code (use axios or fetch there), unbounded timeouts, retrying non-idempotent methods.

## Testing
Fake the `HttpClient` port. For adapter tests use `nock` or a local server.

## Invariants emitted
- "All outbound HTTP goes through lib/http.ts."
