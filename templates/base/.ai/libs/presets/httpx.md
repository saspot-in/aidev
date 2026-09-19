# httpx

**Role:** outbound HTTP client for Python (also the dependency behind FastAPI `TestClient`). One HTTP-client library per project.
**Version:** <verify against installed docs>

## Where it lives
- Adapter: `app/shared/http.py`. It defines an `HttpClient` `Protocol` and the httpx-based implementation. Only this module (and tests) import `httpx`.
- The client is created in the FastAPI lifespan, closed on shutdown, and provided via `Depends`. Never create a client per request.

## Conventions
- Explicit timeouts always: `httpx.Timeout(5.0, connect=2.0)`. Base URL from `app/config.py`.
- Use `httpx.Client` inside `def` routes and `httpx.AsyncClient` inside `async def` routes; do not mix.
- Call `response.raise_for_status()` in the adapter and convert `httpx.HTTPStatusError` / `httpx.TimeoutException` to domain errors (`UpstreamError`, `UpstreamTimeout`).
- Parse bodies with Pydantic: `Model.model_validate(response.json())`. Return models, not raw dicts.
- Retries only for idempotent requests (`httpx.HTTPTransport(retries=2)` covers connection errors).
- Forbidden: logging auth headers or full bodies with secrets, `verify=False`, unbounded timeouts.

## Testing
Service tests use a fake `HttpClient`. Adapter tests use `httpx.MockTransport`.

## Invariants emitted
- "All outbound HTTP goes through app/shared/http.py."
