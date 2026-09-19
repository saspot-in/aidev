# Skill catalog

Drop skills here, one folder each:

```
skills/<skill-name>/SKILL.md      # frontmatter: name, description (one line = when to use it)
skills/<skill-name>/...           # any supporting files
```

- `aidev create` lists every folder here as a checkbox and copies chosen ones to `<project>/.ai/skills/` (vendor-neutral; no per-IDE copies). Everything is copied from this local catalog; nothing depends on system-installed plugins or skills.
- `caveman` is a core skill: always installed, not a checkbox. `AGENTS.md` points at it.
- `skills/<name>/` paths inside skill docs are rewritten to `.ai/skills/<name>/` on install (and `python3` becomes `python` when scaffolding on Windows).
- `aidev add-skill <name>` (inside a project) copies one later.
- The project's `.ai/skills-index.md` is regenerated automatically (Claude Code hooks: session start + file writes; any IDE: `npm run dev`/`build` and `npm run skills:index`), so `AGENTS.md` always points at a current index.
- Folders starting with `_` are ignored.
- Regenerate this catalog's own index: `npm run skills:index` → `skills/INDEX.md`.
