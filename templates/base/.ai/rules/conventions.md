# Conventions: naming, layout, modularization

Load before writing or moving any code. Goal: any file findable by name, any module readable in isolation.
Mechanical rules are enforced by lint (`npm run lint`); the rest is on you.

## 1. Naming

| Thing | Convention | Example |
|---|---|---|
| Files and folders (TS/JS/CSS/MD) | kebab-case | `login-form.tsx`, `use-session.ts`, `session-store.ts` |
| Python files and folders | snake_case | `session_service.py` |
| Feature folder | singular-or-domain noun, kebab-case | `auth`, `billing`, `user-profile` |
| React component, class, type, interface, enum-like const object | PascalCase | `LoginForm`, `SessionPayload` |
| Function, variable, method | camelCase (Python: snake_case) | `getSession`, `get_session` |
| Boolean | `is` / `has` / `can` / `should` prefix | `isLoading`, `hasAccess` |
| Hook | `use` prefix, file `use-<name>.ts` | `useSession` in `use-session.ts` |
| Event handler (defined) / prop (passed) | `handleX` / `onX` | `handleSubmit` / `onSubmit` |
| Module-level constant | UPPER_SNAKE only for true constants | `MAX_SESSION_BYTES` |
| Schema and its inferred type | same PascalCase name, no `Schema` suffix | `HealthResponse` |
| Props type | `<Component>Props` | `LoginFormProps` |
| Generic type parameter | `T`, or `TItem` when meaningful | `TItem` |
| Test file | `<subject>.test.ts(x)` (Python: `test_<subject>.py`) | `session.test.ts` |
| Env var | UPPER_SNAKE; public web vars prefixed (`NEXT_PUBLIC_`, `VITE_`) | `DATABASE_URL` |
| HTTP route | plural noun, kebab-case, no verbs | `/api/user-profiles/:id` |
| JSON field (all stacks) | camelCase | `createdAt` |
| Git branch / commit | `feat/…`, `fix/…`, `chore/…` / Conventional Commits | `feat(auth): add session refresh` |

Names say what a thing is, not how it works. No abbreviations except universally known (`id`, `url`, `api`, `db`). No `I` prefix on interfaces, no `Manager`/`Helper`/`Util` suffix catch-alls.

## 2. Folder layout

```
src/
  app/ or routes glue      # framework routing only; imports from features, holds no business logic
  features/<name>/         # vertical slice: one capability = one folder = one card
    index.ts               # PUBLIC SURFACE. the only file other modules may import
    api/                   # server side: handlers, actions, queries, services, data access
    ui/                    # components for this feature
    model/                 # types, schemas, pure logic, hooks, state
    tests/                 # unit tests for this feature
    _ai.md                 # module card
  components/ui/           # shadcn/Radix primitives (generated; do not fork)
  lib/                     # generic helpers with zero domain knowledge (`cn`, formatters, env parsing)
e2e/                       # cross-module specs only
```

- A folder appears only when it has content. No empty `api/` or `model/` placeholders.
- Depth: at most 2 levels inside a feature subfolder. Deeper means split the feature.
- Split stacks: the same layout applies inside each app (`apps/web/src/`, `apps/api/src/` or `apps/api/app/`).

## 3. Modularization rules

1. **One capability per feature.** If describing it needs "and", split it.
2. **Import only through the surface.** Cross-feature imports go to `@/features/<name>` (its `index.ts`), never to `@/features/<name>/api/...`. Enforced by lint in TS stacks.
3. **`index.ts` exports the surface and nothing else**: the functions, components and types other modules need. It equals the card's `surface`. No other barrel files anywhere.
4. **Dependency direction**: `app` → `features` → `components`/`lib`. Never upward. Features may depend on other features only through surfaces, and the feature graph must stay acyclic (`depends_on` in cards). A cycle means extract a third feature or move the shared piece down to `lib`.
5. **Promote late.** Code starts inside the feature that needs it. Move to `lib/` or `components/` only when a second feature needs it AND it has no domain knowledge. Duplicating 10 lines beats a wrong abstraction.
6. **Pure core, thin edges.** Business rules live in pure functions in `model/` (or `service`); handlers, components and data access stay thin and call into them. Pure code is what unit tests target.
7. **No shared mutable module state.** Pass dependencies in; no hidden singletons except framework-required ones.
8. **Feature deleted = one folder deleted** plus its route wiring. If more is needed, coupling leaked; fix it.

## 4. Code writing (all stacks)

Design principles (SOLID) live in `solid.md`; follow them alongside this section.

- **Size**: function ≤ ~40 lines, file ≤ 300 lines (lint warns). Over the limit means split by responsibility, not by line count.
- **Shape**: early returns over nesting (max 3 levels). One level of abstraction per function.
- **Exports**: named exports only. Default export only where the framework requires it (Next `page.tsx`/`layout.tsx`/`route.ts` conventions, config files).
- **Types**: explicit return types on exported functions. `type` by default; `interface` only for extendable object shapes. No `enum`: use union literals or `as const` objects. No `any`; use `unknown` and narrow. Derive types from schemas (`z.infer`), never write twins.
- **Imports**: order external, then `@/…` aliases, then relative; `import type` for type-only. No deep relative climbs (`../../..`): use the alias.
- **Errors**: never swallow. Throw or return typed errors; convert to HTTP/UI messages only at the edge. No empty `catch`. Log once, where handled.
- **Validation**: parse untrusted input at the boundary, trust typed data inside.
- **Async**: no floating promises; `await` or return them. No `.then` chains mixed with `await`.
- **Comments**: explain why, constraints and non-obvious decisions; never restate the code. Link ADR/INV ids where a rule shapes the code. No commented-out code; git remembers.
- **No dead code, no TODO without an owner or plan id** (`TODO(P-012): …`).
- **Config and magic values**: read env in one module (`lib/env`), export typed values. No inline literals for limits, URLs, timeouts; name them.
- **Logging**: use the framework logger, not `console.log` (lint warns).
- **Tests**: name by behavior (`returns 401 when token expired`). Arrange/act/assert, one behavior per test, no logic in tests.
- **Formatting** is the tool's job (formatter/linter). Do not hand-format or argue about style.

## 5. Change hygiene

- Touching a module's behavior or surface: update its card in the same change. New constraint discovered: add an `INV-#`.
- Keep diffs single-purpose. Refactor and feature in separate commits.
- New folder or naming pattern not covered here: add the rule here before repeating it.
