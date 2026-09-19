# Contract: zod (react-ts-node)

Contract = zod schemas in `packages/contract/src/`. Single source of truth for request/response shapes.

- Change an endpoint: change its schema first. Types come from `z.infer`, never hand-written twins.
- Api validates input with the schema (`.parse`) and builds responses through it. Web parses responses through it.
- Breaking a schema breaks both apps at typecheck time: run `npm run typecheck` (covers all workspaces).
- Contract package has no runtime deps besides zod. No app code in it.
- Record contract-level guarantees as Invariants on the `contract` card, including who consumes each schema.
