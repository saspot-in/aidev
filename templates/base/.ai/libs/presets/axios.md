# axios

**Role:** HTTP client. Only one library holds this role (axios OR got OR a native `fetch` wrapper).
**Version:** <verify against installed docs>

## Where it lives
- Adapter, the only file importing axios: `src/lib/http.ts`. It exports a small `HttpClient` port (`get`, `post`, `put`, `delete`) typed with generics, and one configured instance.
- Resource functions live in the feature (`api/<resource>.ts` or `model/`) and call the port.

## Conventions
- `axios.create({ baseURL, timeout })`. A timeout is mandatory. Base URL from typed env, never inline.
- Interceptors do cross-cutting work only (auth header, request id, error normalization). Business rules never go in interceptors.
- Normalize every failure to a project `HttpError { status, code, message }`; callers never see `AxiosError`.
- Parse every response with a schema before returning it (`Schema.parse(res.data)`); return domain types.
- Support cancellation with `AbortSignal`. Retry only idempotent GETs, explicitly.
- Forbidden: `axios` imports outside `lib/http.ts`, `any` response types, swallowing errors, hardcoded URLs.

## Testing
Inject a fake `HttpClient` into the code under test. No axios mocking.

## Invariants emitted
- "All HTTP goes through lib/http.ts."
