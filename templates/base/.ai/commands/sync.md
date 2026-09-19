# /sync

Goal: bring cards + map back in line with code after `/work`.

1. For every module under `src/features/*` (and any touched this session):
   - Regenerate card frontmatter ONLY: `depends_on` (import graph), `consumed_by` (inverted graph), `surface` (exports), `key_files` (file tree), `verified_by` (test globs + `e2e/` specs referencing the module).
   - Never touch hand-written zones without approval.
2. Ask the user, per touched module: any new **Invariants** (constraint + blast radius + ADR) or **Gotchas** discovered? Add only what the user confirms. No invention.
3. Any ADR created this session must have an `INV-#` line in each affected card. Add missing ones (confirm text with user).
4. Regenerate `.ai/map.md` as union of cards, sorted by capability. Keep ≤ ~500 tokens.
5. Move the finished plan: `.ai/plans/active/P-###-*.md` → `.ai/plans/done/`; set `Status: done`.
6. Run `npm run check:libs`. Every dependency needs a registry row and rule file; remove rows and rule files of removed libraries.
7. Run `npm run check:budget`. Fail → trim map.
