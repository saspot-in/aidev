# Stack: next-ts

Next.js (App Router) + TypeScript strict. No separate backend.

- Server logic lives in Server Components, Server Actions, and Route Handlers inside the owning feature (`src/features/<name>/api/`). Expose via the module `surface` only.
- Default to Server Components. Add `"use client"` only for interactivity, and keep client islands small.
- Validate every Server Action / Route Handler input at the boundary. No API contract package needed: types are shared in-repo.
- Secrets: server-only env vars, never `NEXT_PUBLIC_` unless truly public.
- `src/app/` is routing glue: pages import from `src/features/*`; no business logic in `app/`.
- Path alias `@/*` → `src/*`.
