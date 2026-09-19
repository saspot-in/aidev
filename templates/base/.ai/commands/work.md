# /work P-###

Goal: implement exactly one plan. Runs in the same session as `/plan` (or any session: the plan file is the source of truth, not the chat).

1. Re-read `.ai/plans/active/P-###-*.md` (authoritative; do not rely on the planning conversation), plus `AGENTS.md` and `.ai/map.md` if not already loaded. Load the cards the plan names. Nothing else up front.
2. Refuse scope expansion: if the task needs a module/card the plan does not name, stop and tell the user to amend the plan (or `/plan` again). Do not silently widen.
3. Respect every listed Invariant. If an implementation step would violate one, stop and ask.
4. Load `.ai/rules/conventions.md`, `.ai/rules/solid.md` and the rules for the task (see `AGENTS.md` step 4) before writing code. Implement per checklist order, following them. Write colocated unit tests in `<module>/tests/`; cross-module flows in `e2e/`.
5. Tick each checklist item in the plan file as it completes. If you had to differ from the plan (names, extra files), record it under "Deviations from plan" in the plan file.
6. If the work adds, replaces or removes a dependency, do the library steps in `.ai/libs/README.md` in the same change (`npm run check:libs` must pass). Self-review against the checklist at the end of `.ai/rules/solid.md`. Run typecheck + lint + tests. Report failures with exact output.
7. Finish: when all checks pass, continue with `/sync` in the same session. Do not move the plan yourself; `/sync` does.

Map fallback rule applies (see `AGENTS.md`): grep is allowed if a card is wrong, but flag the map/card as stale.
