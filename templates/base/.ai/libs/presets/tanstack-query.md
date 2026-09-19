# tanstack-query (React Query)

**Role:** server-state fetching, caching and mutation in React client code. In Next.js prefer Server Components for initial data; use this for interactive client-side data.
**Version:** <verify against installed docs>

## Where it lives
- `src/lib/query-client.ts`: one `QueryClient` with explicit defaults (`staleTime`, `retry`). Provider mounted once at the app root.
- Per feature: `model/<name>-keys.ts` (key factory), `model/use-<resource>.ts` (hooks wrapping `useQuery` / `useMutation`).
- Fetchers call the project HTTP adapter (`lib/http.ts`), never `fetch` or axios directly.

## Conventions
- Query keys come from the key factory: `keys.list(filters)`, `keys.detail(id)`. No inline array keys.
- Set `staleTime` deliberately per query; do not rely on the default of 0.
- Mutations invalidate by key in `onSuccess` (or update the cache when the response contains the entity). Optimistic updates must roll back in `onError`.
- Never copy query data into `useState`. Derive with `select`.
- Components use the feature hooks, not `useQuery` directly. Handle pending, error, empty and success states.
- Validate/parse responses in the fetcher (schema) so cached data is typed and trusted.

## Testing
Wrap in a fresh `QueryClientProvider` per test with `retry: false`. Fake the HTTP port; do not mock the library.

## Invariants emitted
- "Server data is read via query hooks; no `useEffect` fetching."
