# P-### — <title>

**Status:** active | done
**Modules:** <modules from map.md this plan touches>
**Created:** <YYYY-MM-DD>

## Goal
<!-- One paragraph. What and why. -->

## Cards to load
<!-- Only these are loaded by /work. New feature with no card yet: write "none (new module <name>)" and list the rules and skills to load instead. -->
- src/features/<name>/_ai.md

## Invariants at risk
<!-- INV lines / consumed_by dependents that this change could break, and how it avoids it. -->

## Decisions (from planning Q&A)
<!-- UI/UX, theming, scope answers. -->

## Out of scope
<!-- Explicit. /work refuses to expand beyond this plan. -->

## Deviations from plan
<!-- /work fills this in when it had to differ from the plan (file names, extra files, dependency changes). -->

## Checklist
- [ ] <step>
- [ ] New/changed dependencies: rule in `.ai/libs/<lib>.md` + registry row (or "none")
- [ ] Unit tests in `tests/`
- [ ] E2E in `e2e/` if cross-module
- [ ] Run `/sync`
