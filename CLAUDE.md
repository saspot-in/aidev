# aidev — repo guide (this repo builds the scaffolder)

Terse mode: no filler. Code/commits: write normal.

- Design + decisions: `.ai/plans/active/P-001-aidev-bootstrap.md`. Do not relitigate §2/§3.
- `templates/base/` = files copied into every generated project. `templates/<stack>/` = overlay (`templates/_web/` = shared by the two split stacks). Edit those, not generated output.
- CLI: `src/cli.mjs` (plain ESM, no build). Stack registry: `STACKS` in that file.
- Skill catalog: `skills/`. Index helper: `templates/base/scripts/build-skills-index.mjs`.
- Stacks verified by scaffolding to a temp dir, `npm install`, then `typecheck`, `lint`, `test`, `build` (python stack also `npm run setup:api`, `contract:check`).
- Verify a change: scaffold to a temp dir, then `npm install && npm run typecheck && npm run lint && npm run build && npm run check:budget`.
- Budget: generated `AGENTS.md` + `.ai/map.md` ≤ 2000 tokens.
