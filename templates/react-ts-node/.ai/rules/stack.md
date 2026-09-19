# Stack: react-ts-node

npm workspaces monorepo, all TypeScript.

- `apps/web` is React 19 + Vite. `apps/api` is Node + Fastify. `packages/contract` holds zod schemas shared by both.
- Vertical slices live inside each app: `apps/web/src/features/<name>/` and `apps/api/src/features/<name>/`, each with its own `_ai.md` card. `src/features` paths in `AGENTS.md` are relative to the app.
- A capability that spans both sides = two cards (web + api) plus its schema file in `packages/contract/src/`. Each card lists `contract` in `depends_on`.
- Web never imports from `apps/api`; api never imports from `apps/web`. Cross-app types go through `packages/contract`.
- Dev: `npm run dev` (api :3001, web :5173; Vite proxies `/api` to :3001).
- Secrets: api env vars only. Web only gets `VITE_`-prefixed vars, which are public.
