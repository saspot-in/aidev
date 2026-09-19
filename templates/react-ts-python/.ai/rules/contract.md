# Contract: OpenAPI (react-ts-python)

Contract = `packages/contract/openapi.json`, exported from the FastAPI app. Web types are generated from it into `apps/web/src/lib/api/schema.d.ts`.

- Never hand-edit `openapi.json` or `schema.d.ts`. Change the Pydantic models or routes, then run `npm run contract:gen`.
- Commit both generated files in the same diff as the API change.
- Drift gate: `npm run contract:check` regenerates and runs `git diff --exit-code` on both files. Run it in CI and before finishing any task that touches the API. Needs a git repo.
- Web uses `components["schemas"][...]` types from `schema.d.ts`; do not write twin types by hand.
- Record contract-level guarantees as Invariants on the `contract` card, including who consumes each operation.
