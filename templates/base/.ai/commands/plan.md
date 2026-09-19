# /plan "<requirement>"

Goal: turn a requirement into a plan file. **Write NO code.**

1. Read `.ai/map.md`. Identify candidate modules for the requirement.
2. Load ONLY those modules' cards (`src/features/<name>/_ai.md`). No broad grep. If map fails to resolve, apply the fallback rule in `AGENTS.md`.
3. Check each card's `Invariants` and `consumed_by`. List any the change could break.
4. Ask clarifying questions: UI/UX, theming (`.ai/rules/theming.md`), scope, edge cases. Wait for answers.
5. Pick next id `P-###` (highest in `.ai/plans/{active,done}/` + 1). Write `.ai/plans/active/P-###-slug.md` from `.ai/plans/_TEMPLATE.md`:
   - Cards to load (exact paths) — `/work` loads nothing else.
   - Invariants at risk + how plan avoids them.
   - Decisions from Q&A. Explicit out-of-scope. Checklist.
6. If the requirement needs a new library, check `.ai/libs/index.md` for an existing library with that role first (one per role; ask the user before replacing). List the library and "add `.ai/libs/<lib>.md` + registry row" in the plan checklist. If planning surfaces a constraint that should bind future code, draft an ADR in `.ai/decisions/` and list the `INV-#` line for each affected card. ADR with no INV = narrative only.
7. Show the user the plan path and a short summary, and ask for approval or changes. On approval continue directly with `/work P-###` in this same session. Do not ask the user to start a new session.

Never edit source files in this command.
