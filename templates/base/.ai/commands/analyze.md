# /analyze [path]

Goal: cold-start an existing repo. Produce `.ai/map.md` + a draft card per module. A human should correct the cards, not rewrite them.

1. Detect module boundaries: `src/features/*`, `apps/*`, `packages/*`. Else cluster by import density and state the clusters you chose.
2. Parse import graph → `depends_on`; invert → `consumed_by`. Ignore type-only and test imports for `consumed_by`.
3. Parse exports → `surface`. File tree → `key_files` (entry points + most-imported files, not everything). Test globs → `verified_by`.
4. Read each module; draft `Purpose` in 1–2 sentences.
5. **Stub `Invariants` and `Gotchas` as explicit `TODO` prompts. Do not invent them.** Fabricated constraints get trusted; absent ones get asked.
6. Write each card next to its code as `<module>/_ai.md` using `.ai/modules/_TEMPLATE.md`.
7. Emit `.ai/map.md` as union, sorted by capability. Verify `npm run check:budget`.

Stretch — git history mining for Gotcha candidates (`git log`): files that repeatedly change together, revert commits, clusters of "fix" commits on the same lines. Output as **questions for the human**, never assertions, listed at the end of the run.

Report: modules found, cards written, TODOs left, questions for human.
