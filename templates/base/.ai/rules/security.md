# Security rules

- Secrets only via env vars. Never commit keys, tokens, or `.env*` files. Never log secrets or PII.
- Validate all external input at the boundary (zod or equivalent). Trust nothing from the client.
- Authn/authz checked server-side on every protected route/action. UI hiding is not access control.
- Parameterized queries only. No string-built SQL.
- Escape/sanitize before rendering user content. No `dangerouslySetInnerHTML` without sanitizer.
- Cookies: `HttpOnly`, `Secure`, `SameSite`. Keep session payloads small.
- Pin and audit dependencies; justify each new one.
