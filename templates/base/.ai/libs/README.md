# Libraries: how each dependency is used in this project

Every runtime library gets a project rule that says how it is used HERE: where it lives, how it is wrapped, what is forbidden. Registry: `index.md` (one row per library: role and rule file). Active rules: `.ai/libs/<lib>.md`. Ready-made starting points: `.ai/libs/presets/`.

## When this applies
- The user asks to add a library, or you add one yourself (`npm install`, `pip install`, editing `package.json` / `requirements.txt`).
- A library is removed or replaced.
- `npm run check:libs` (or the post-edit hook) reports an undocumented dependency.

## Procedure (do it in the same change as the install; do not defer)
1. **Role check.** Read `index.md`. One library per role (state management, HTTP client, forms, ORM, cloud SDK, validation, routing, ...). If the role is taken, do not add a second: stop and ask the user whether to replace it, and if yes plan the migration.
2. **Read the source of truth.** Read the installed version's README/docs (`node_modules/<lib>/README.md`, official docs, `pip show`). Do not rely on memory for APIs; versions change.
3. **Start from a preset** if `.ai/libs/presets/<lib>.md` exists (copy to `.ai/libs/<lib>.md`), otherwise from `_TEMPLATE.md`. Then tailor it to this project: real folder paths, real naming, this stack's conventions.
4. **Wrap it (Dependency Inversion, see `.ai/rules/solid.md`).** Third-party code is used through one project-owned adapter module (`lib/http.ts`, `lib/store.ts`, `app/shared/aws.py`, ...). Features import the adapter, never the library directly. Swapping the library then touches one file. Exception: libraries that are the framework itself or pure UI/utility primitives (React, Tailwind, `clsx`, `zod` at the boundary) are used directly.
5. **Reconcile conventions.** If the library's idioms conflict with existing rules (e.g. a global store vs "state local first" in `frontend.md`), do not silently pick one: update the relevant rule minimally, and write an ADR in `.ai/decisions/`. Ask the user when the choice is not obvious.
6. **Emit invariants.** Constraints that other code must respect (e.g. "all HTTP goes through `lib/http`", "no library import outside its adapter") become `INV-#` lines on the affected cards, and lint rules where possible, e.g. restrict the library to its adapter:
   ```js
   { files: ["**/*.{ts,tsx}"], ignores: ["**/lib/http.ts"], rules: { "no-restricted-imports": ["error", { paths: [{ name: "axios", message: "Use lib/http.ts" }] }] } }
   ```
   Merge with the existing `no-restricted-imports` patterns in `eslint.config.mjs` (one rule entry per file scope).
7. **Register.** Add the row to `index.md`: `| package | role | rule |` where rule is `libs/<lib>.md`, or an existing rule file (`rules/theming.md`), or `-` for trivial helpers. Run `npm run check:libs`; it must pass.
8. **Tell the user** in one line: which rule file was created/updated and any convention it changed.

## Removing or replacing a library
Delete `.ai/libs/<lib>.md` and its `index.md` row in the same change, update ADR/INV lines that referenced it, and grep for leftover direct imports.

## Quality bar for a library rule
Short (under ~60 lines), specific to this repo, and actionable: a reader can place a new file and write a call correctly without opening the library docs. Include Do/Don't, error handling, and how to fake it in tests.

## Presets available
zustand, redux-toolkit, tanstack-query, react-router, react-hook-form, axios, got, express, prisma, aws-sdk-v3, boto3, httpx, sqlalchemy, pydantic-settings. For anything else use `_TEMPLATE.md`.
