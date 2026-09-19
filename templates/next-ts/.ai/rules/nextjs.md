# Next.js conventions (App Router)

Read with `conventions.md`, `frontend.md`, `stack.md`.

## Routing glue vs features
- `src/app/**` holds only routing files: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `route.ts`. Each is a thin shell that imports from `@/features/<name>` and returns it. No business logic, no data shaping.
- Route folders: kebab-case, plural nouns for collections (`app/blog-posts/[slug]/page.tsx`). Route groups `(marketing)` / `(app)` to split layouts without changing URLs. Private folders `_components` are not allowed: components belong to a feature.
- Default exports are required in `page`/`layout`/`error`/`loading`/`not-found`; nowhere else.

## Server vs client
- Default to Server Components. Add `"use client"` only on the smallest leaf that needs state, effects or browser APIs; pass server-fetched data down as props.
- A client file never imports server-only code. Server-only modules start with `import "server-only"`.
- Rules stay in pure `model/` functions or a service that receives its IO ports as arguments (see `solid.md` D); `queries.ts` / `actions.ts` are the composition point that builds the concrete deps.
- Data reads: `features/<name>/api/queries.ts` (server, async functions). Writes: `features/<name>/api/actions.ts` beginning with `"use server"`. Both are re-exported through the feature `index.ts` only if other modules need them.
- Every Server Action and Route Handler validates its input (zod) and checks authorization itself, then returns a plain serializable result or a typed error.
- Route Handlers (`route.ts`) only for webhooks, third-party callbacks and non-form clients. Prefer Server Actions for app mutations.

## Data and caching
- Fetch in the Server Component that renders the data; pass results down. No `useEffect` fetching for initial data.
- Be explicit about caching (`revalidate`, `cache: "no-store"`, tags) on every fetch that is not fully static; comment why.
- Revalidate with `revalidateTag`/`revalidatePath` from the action that mutated the data.

## Metadata, media, links
- Export `metadata` / `generateMetadata` per route. One `<h1>` per page.
- Images through `next/image` with dimensions, links through `next/link`, fonts through `next/font`.
- Environment: server vars read only in server modules through `src/lib/env.ts` (create it with the first env var; zod-parsed, typed). `NEXT_PUBLIC_` only for values safe to expose.

## Loading and errors
- Provide `loading.tsx` for slow segments and `error.tsx` for segments that can fail; use `notFound()` for missing resources.
