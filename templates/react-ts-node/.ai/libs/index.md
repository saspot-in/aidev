# Library registry

One row per runtime dependency: `| package | role | rule |`. `rule` is `libs/<lib>.md`, an existing rule file, or `-` for trivial helpers.
One library per role. Process: `README.md`. Checked by `npm run check:libs`.

| package | role | rule |
|---|---|---|
| fastify | HTTP server (api) | rules/backend.md |
| zod | schema validation, API contract | rules/contract.md |
| class-variance-authority | component variants | rules/theming.md |
| clsx | class name joining | rules/theming.md |
| lucide-react | icons | rules/theming.md |
| react | UI library | rules/frontend.md |
| react-dom | React DOM renderer | rules/frontend.md |
| tailwind-merge | Tailwind class merging (`cn`) | rules/theming.md |
| tw-animate-css | animation utilities | rules/theming.md |
