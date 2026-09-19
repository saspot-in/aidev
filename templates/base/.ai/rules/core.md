# Core rules (stack-independent)

Naming, layout and code style are in `conventions.md`; SOLID design principles in `solid.md`. This file is the non-negotiable baseline.

- TypeScript strict (Python: mypy strict). No `any` without a comment saying why. Lint + typecheck + tests must pass before a task is done.
- Vertical slices: one capability = one feature folder = one card. Cross-feature imports go through the feature surface only.
- Colocate unit tests in the feature `tests/` folder. Cross-module flows go in root `e2e/`.
- Changing code a card describes: update the card in the same diff if intent or surface changed.
- Do not add dependencies, files or abstractions the plan does not name. Prefer editing existing files.
- Never fabricate an Invariant or Gotcha. Unknown: write `TODO` and ask.
