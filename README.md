# aidev

Project scaffolder. Generates a project with an agent-friendly context layer, so any coding agent (Claude Code, Cursor, …) knows where things live and why, without burning 30–80k tokens on grep exploration.

Goal metric: **tokens-to-context** — 1–2k instead of 30–80k. Full design: [.ai/plans/active/P-001-aidev-bootstrap.md](.ai/plans/active/P-001-aidev-bootstrap.md).

## Use

```bash
node src/cli.mjs create my-site            # interactive: stack + skill checkboxes
node src/cli.mjs create my-site --stack next-ts --skills all --yes
node src/cli.mjs create my-site --dir path/to/repo --existing ...   # add into a non-empty repo; existing files are kept
node src/cli.mjs add-skill <name>          # inside a project, later
node src/cli.mjs skills                    # list catalog
```

(After publishing / `npm link`: `aidev create …`.)

## What a generated project gets

- `AGENTS.md` — canonical router (terse mode, retrieval steps, commands, map-fallback rule). Read natively by Cursor, Codex, Copilot, etc. `CLAUDE.md` is a one-line `@AGENTS.md` import for Claude Code.
- `README.md` — per-project context, always loaded.
- `.ai/map.md` — capability → module map (always loaded, ~500 tokens).
- `src/features/<name>/_ai.md` — per-module cards, loaded on demand (generated frontmatter + hand-written Invariants/Gotchas).
- `.ai/plans/{active,done}/` — plans are files. Flow, all in one session: `/plan` → user approves → `/work P-###` → `/sync`.
- `.ai/skills-index.md` — auto-regenerated index of installed skills (hooks on session start + file writes).
- `.ai/rules/` — `core` (baseline), `conventions` (naming, folder layout, modularization, code style; always loaded before writing code), `frontend` (React), `theming`, `security`, `stack` + framework file (`nextjs` / `backend` / `python`), `testing`, `contract` (split stacks).
- Lint enforces the mechanical conventions: naming, `import type`, no `console`, `===`, file size, and feature imports only through `@/features/<name>` (surface).
- Stack files: see Stacks below. All: Tailwind v4 + shadcn/Radix/Magic UI on one root `theme.css`, Vitest colocated, Playwright in `e2e/`.

## Libraries: rules that follow your dependencies

Adding a library should update the conventions automatically. Standing instruction in `AGENTS.md`:

- `.ai/libs/index.md` is the registry: one row per runtime dependency (package, role, rule file). One library per role (state, HTTP client, forms, ORM, cloud SDK, ...).
- When an agent adds, replaces or removes a dependency it follows `.ai/libs/README.md`: check the role, read the installed docs, create `.ai/libs/<lib>.md` (from a preset or the template), wrap the library in one adapter module (Dependency Inversion), register it, reconcile conflicting conventions with an ADR, emit invariants.
- Presets shipped in `.ai/libs/presets/`: zustand, redux-toolkit, tanstack-query, react-router, react-hook-form, axios, got, express, prisma, aws-sdk-v3, boto3, httpx, sqlalchemy, pydantic-settings. Anything else uses `_TEMPLATE.md`.
- Enforcement: `npm run check:libs` fails on any undocumented dependency (`/sync` runs it). In Claude Code a post-edit/post-install hook runs it automatically and tells the agent immediately (exit 2). Other IDEs rely on the `AGENTS.md` instruction plus `npm run check:libs` in CI.

## Stacks

| Stack | Shape | Contract (API boundary) |
|---|---|---|
| `next-ts` | Single Next.js App Router app, `src/features/<name>` | none: Server Components/Actions, types shared in-repo |
| `react-ts-node` | npm workspaces: `apps/web` (Vite React) + `apps/api` (Fastify) + `packages/contract` | zod schemas in `packages/contract` |
| `react-ts-python` | `apps/web` (Vite React) + `apps/api` (FastAPI, own venv) | OpenAPI `packages/contract/openapi.json` to generated TS types; `npm run contract:check` is the drift gate (`git diff --exit-code`) |

Split stacks put feature cards inside each app (`apps/web/src/features/<name>/_ai.md`, `apps/api/.../<name>/_ai.md`). Python stack first run: `npm install` then `npm run setup:api`.

## Layout of this repo

```
templates/base/      # stack-independent files (copied first)
templates/_web/       # shared React+Vite part used by both split stacks
templates/<stack>/   # overlay (copied after base, overwrites)
skills/              # your skill catalog — drop folders with SKILL.md
src/cli.mjs          # the scaffolder
```

Add a stack = add `templates/<stack>/` + an entry in `STACKS` in `src/cli.mjs` (`overlays` lists the template dirs to copy, in order).

## Any IDE

- Source of truth is vendor-neutral `.ai/` (rules, skills, plans, commands, map). No copies per tool.
- Router: `AGENTS.md` (Cursor, Codex, Copilot, Windsurf, … read it natively; Claude Code via `CLAUDE.md` → `@AGENTS.md`).
- Commands: `.ai/commands/*.md`, with thin pointers in `.claude/commands/` and `.cursor/commands/`. IDEs without slash commands: the router tells the agent to read the file.
- Skills: `.ai/skills/`, discovered through `.ai/skills-index.md` and loaded on demand — not auto-injected, so unused skills cost no tokens.
- Index refresh: Claude Code hooks (`.claude/settings.json`) plus `predev`/`prebuild` npm scripts and `npm run skills:index` for everyone else.
