# __PROJECT_NAME__ — agent router

<!-- Canonical router for every agent/IDE (Claude Code via CLAUDE.md import, Cursor/Codex/Copilot/etc. read AGENTS.md natively). Edit here only. -->

Terse mode ON every response: follow `.ai/skills/caveman/SKILL.md` (level full). Code/commits/security: write normal. Off only on "stop caveman".

## Always load
- `README.md` — project context: what this is, goals, stack, decisions.
- `.ai/map.md` — capability → module → touches. Read before any search.

## Retrieval
1. Resolve task to modules via `map.md`.
2. Load ONLY those modules' `src/features/<name>/_ai.md` cards.
3. Check card `Invariants` and `consumed_by` for conflicts before editing.
4. Rules live in `.ai/rules/`. Before writing code ALWAYS load `conventions.md` (naming, layout, modularization) and `solid.md` (SOLID). Then by task: UI `frontend.md` + `theming.md`; framework `stack.md` + its framework file (`nextjs.md` / `backend.md` / `python.md`); API shapes `contract.md` (if present); tests `testing.md`; auth/input/secrets `security.md`. Baseline: `core.md`.
5. Skills live in `.ai/skills/<name>/`. Index: `.ai/skills-index.md` (name + one-line purpose). Open a skill's `SKILL.md` only when the task matches it. Do not load skills speculatively.
6. Libraries: `.ai/libs/index.md` lists every dependency with its role and rule file. Open a library's rule before using it.
7. **Adding, replacing or removing a dependency** (user asks, or you need one): follow `.ai/libs/README.md` in the same change: one library per role, create `.ai/libs/<lib>.md` (start from `.ai/libs/presets/`), wrap it in one adapter, register it in `index.md`, update conventions/ADR if it conflicts. `npm run check:libs` must pass.

## Map fallback rule
If `map.md` does not resolve the task to a module, or the code is not where a card says it is: fall back to grep, complete the task, and then flag the map as stale in your response. Never conclude something doesn't exist because the map omitted it.

## Commands
Commands are defined in `.ai/commands/<name>.md`. If your IDE has no slash commands, read that file and follow it.
- `/plan "<requirement>"` — read map + cards, ask questions, WRITE NO CODE, emit `.ai/plans/active/P-###-slug.md`. Split big requirements into several plans. End session after.
- `/work P-###` — fresh session. Load plan + cards it names. Nothing else. No scope expansion. Tick checklist.
- `/sync` — regenerate card frontmatter, prompt for new Invariants/Gotchas, update map, move plan to `done/`.
- `/analyze` — existing code: draft `map.md` + one card per module. Never invent Invariants.
- Pending work = files in `.ai/plans/active/`. List them when asked what is left.

## Layout
- Vertical slices: `src/features/<name>/{api,ui,model,tests,_ai.md}`.
- Unit tests colocated in `tests/`. E2E (cross-module) in root `e2e/`.
- Card format: `.ai/modules/_TEMPLATE.md`. Frontmatter = generated, do not hand-edit.
- Decisions: `.ai/decisions/ADR-###-slug.md`. Any ADR constraining code must emit an `INV-#` line into each affected card.

## Budget
`AGENTS.md` + `.ai/map.md` ≤ 2000 tokens combined. Enforced: `npm run check:budget`.
