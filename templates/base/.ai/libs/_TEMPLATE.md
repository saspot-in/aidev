# <library>

**Role:** <one role, e.g. "client state management">. Only one library holds this role (see `index.md`).
**Version:** <major.minor verified against its docs on YYYY-MM-DD>
**Why this one:** <one line; alternatives considered/rejected, ADR-### if any>

## Where it lives
- Adapter (the only file that imports the library): `<path>`
- Feature code imports: `<adapter path or feature surface>`, never `<library>` directly.
- Config / env: `<file>`, `<ENV_VAR>` (typed, read once).

## Conventions
- Naming: <files, exports, hooks/functions, e.g. `use-cart-store.ts`, `useCartStore`>
- Placement: <which folder inside a feature>
- Patterns to use: <2-4 bullets with a tiny code example if it helps>
- Forbidden: <2-4 bullets: anti-patterns for this project>

## Errors and edge cases
<how failures surface: typed errors, retries, timeouts, cancellation>

## Testing
<how to fake it: inject the adapter port, in-memory implementation, no module mocking>

## Security / performance notes
<secrets, PII, bundle size, N+1, pagination, etc. Only what matters here>

## Invariants emitted
- <INV-# lines added to cards, or "none">
