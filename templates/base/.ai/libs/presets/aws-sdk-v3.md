# aws-sdk-v3 (@aws-sdk/client-*)

**Role:** AWS service access from TypeScript. Modular v3 clients only; never the monolithic `aws-sdk` v2.
**Version:** <verify against installed docs>

## Where it lives
- One adapter per AWS service: `src/lib/aws/<service>.ts` (e.g. `s3.ts`). It creates the client once and exports a narrow port (`putObject`, `getDownloadUrl`), not the SDK client or commands.
- Services depend on that port (see `solid.md` D). Only `lib/aws/*` imports `@aws-sdk/*`.
- Region and resource names (bucket, queue URL) come from typed config, never inline.

## Conventions
- Credentials: default provider chain only (env, SSO, IAM role). Never hardcode or log keys.
- One client per service and region, created at the composition root, reused across requests.
- Set timeouts and retry behavior explicitly on the client (`requestHandler`, `maxAttempts`).
- Map SDK errors by `name` (`NoSuchKey`, `AccessDenied`, `ThrottlingException`) to project errors; do not leak raw SDK errors.
- Use paginators for list operations; presign with `@aws-sdk/s3-request-presigner` and short expirations.
- Least privilege: document the IAM actions the adapter needs at the top of its file.
- Forbidden: SDK types in service signatures, credentials in code or env files committed to git, unbounded list loops.

## Testing
Fake the port. For adapter tests use `aws-sdk-client-mock`.

## Invariants emitted
- "AWS access only through lib/aws adapters."
