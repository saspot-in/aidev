# Stack: react-ts-python

React (TypeScript) frontend, Python (FastAPI) backend. npm workspace for web only; Python in `apps/api` with its own venv.

- `apps/web` is React 19 + Vite. `apps/api` is FastAPI. `packages/contract/openapi.json` is generated from the API and is the contract.
- Vertical slices live inside each app: `apps/web/src/features/<name>/` and `apps/api/app/features/<name>/{api.py,model.py,tests/}`, each with its own `_ai.md` card. `src/features` paths in `AGENTS.md` are relative to the app.
- A capability spanning both sides = two cards (web + api). The web card lists `contract` in `depends_on`.
- Web never imports Python; api never imports web. Cross-app types go through the generated contract only.
- Python: type hints everywhere, `mypy --strict` and `ruff` must pass. Pydantic models for every request and response body; set `operation_id` on each route (it becomes the generated client name).
- Setup once: `npm run setup:api` (creates `apps/api/.venv`). Dev: `npm run dev` (api :3001, web :5173; Vite proxies `/api` to :3001).
- Secrets: api env vars only. Web only gets `VITE_`-prefixed vars, which are public.
