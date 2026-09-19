# aidev

**A project starter for working with AI coding agents.** One command creates a new project (or adds to an existing repo) with the files an agent needs to find its way around, follow your conventions, and remember why the code looks the way it does. It works with Claude Code, Cursor and other agents that read `AGENTS.md`.

```bash
npx github:saspot-in/aidev create my-site
```

## Why

An agent opening an unfamiliar repo usually greps around blindly, spends tens of thousands of tokens getting oriented, and has no memory of decisions made in earlier sessions. So it re-proposes rejected designs and breaks constraints nobody wrote down.

aidev generates a small context layer to fix that:

- a short **map** of what lives where (always loaded, about 1k tokens with the router),
- a **card per module** with its purpose, invariants and gotchas (loaded only when a task touches that module),
- **plans as files**, so intent survives between sessions,
- **rules** for naming, layout, SOLID and each framework, with lint enforcing the mechanical ones,
- a **library registry**: when you add a dependency, the agent documents how it is used in your project.

The design and reasoning are in [.ai/plans/active/P-001-aidev-bootstrap.md](.ai/plans/active/P-001-aidev-bootstrap.md).

## How to use it

**Requirements:** Node 20+, npm, git. The Python stack also needs Python 3.11+.

### 1. Create a project

```bash
# interactive: choose a stack, tick the skills you want
npx github:saspot-in/aidev create my-site

# non-interactive
npx github:saspot-in/aidev create my-site --stack next-ts --skills all --yes
```

| Option | Meaning |
|---|---|
| `--stack` | `next-ts`, `react-ts-node` or `react-ts-python` (see below) |
| `--skills` | `all`, `none`, or a list such as `gsap-core,shadcn` (`caveman` is always installed) |
| `--dir <path>` | create in that folder instead of `./<name>` |
| `--existing` | add into a non-empty folder; files that already exist are never overwritten and are listed at the end |
| `--yes` | no prompts |

Add aidev to a repo you already cloned (run inside it):

```bash
npx github:saspot-in/aidev create my-site --dir . --existing --stack next-ts --skills all --yes
```

Then follow the printed steps:

```bash
cd my-site
npm install
npm run setup:api          # react-ts-python only: creates the Python virtualenv
npm run check:budget       # verifies the always-loaded context stays small
npx playwright install chromium   # once, for e2e tests
npm run dev
```

### 2. Work with your agent

Open the folder in Claude Code, Cursor or a similar tool. It reads `AGENTS.md` automatically. Describe what you want; the whole flow runs in one session:

| Step | What happens |
|---|---|
| `/plan "<requirement>"` | The agent reads the map and the affected module cards, checks for conflicts, asks you clarifying questions (UI, theming, scope), writes **no code**, and saves `.ai/plans/active/P-001-....md`. You approve or adjust. |
| `/work P-001` | It implements exactly that plan, following the rules, and writes tests. It stops if the plan needs something outside its scope or would break an invariant. |
| `/sync` | It refreshes the module cards and the map, asks you which new invariants and gotchas to record (it never invents them), and archives the plan to `.ai/plans/done/`. |
| `/analyze` | For code that already exists: drafts the map and a card per module. Written but not yet validated on a real repo. |

Tools without slash commands: `AGENTS.md` tells the agent to read `.ai/commands/<name>.md` and follow it.

### 3. Add skills and libraries later

```bash
npx github:saspot-in/aidev skills                    # list the skill catalog
npx github:saspot-in/aidev add-skill gsap-core       # inside a project
```

Add a library the normal way (`npm install zustand`, `pip install httpx`). The agent follows `.ai/libs/README.md`: it checks that no other library already fills that role, reads the installed docs, writes `.ai/libs/<lib>.md` (from one of 14 presets or a template), wraps the library behind one adapter module, and registers it. `npm run check:libs` fails if a dependency has no rule.

## Stacks

| Stack | Shape | API contract |
|---|---|---|
| `next-ts` | One Next.js App Router app | none: Server Components and Actions, types shared in the repo |
| `react-ts-node` | npm workspaces: `apps/web` (Vite + React), `apps/api` (Fastify), `packages/contract` | zod schemas in `packages/contract` |
| `react-ts-python` | `apps/web` (Vite + React), `apps/api` (FastAPI, own virtualenv) | OpenAPI file turned into TS types; `npm run contract:check` fails on drift |

All three use TypeScript in strict mode, Tailwind CSS, shadcn/ui with Radix and Magic UI, a single `theme.css` for all design tokens, Vitest for unit tests next to the code, and Playwright in `e2e/`.

## What a generated project contains

```
AGENTS.md            router for every agent: retrieval steps, commands, rules index (CLAUDE.md imports it)
README.md            your project context, always loaded
.ai/
  map.md             capability -> module -> dependencies (always loaded)
  rules/             conventions, solid, frontend, theming, security, testing, per-framework files
  libs/              library registry, template, 14 presets (zustand, redux-toolkit, tanstack-query,
                     react-router, react-hook-form, axios, got, express, prisma, aws-sdk-v3, boto3,
                     httpx, sqlalchemy, pydantic-settings)
  plans/             active/ and done/
  decisions/         ADRs
  commands/          plan, work, sync, analyze
  skills/            the skills you chose, plus skills-index.md (auto-regenerated)
src/features/<name>/ one folder per capability: index.ts (public surface), api/, ui/, model/, tests/, _ai.md (card)
e2e/                 cross-module tests
```

The `.claude/` and `.cursor/` folders only hold thin pointers and hooks; the real content lives in `.ai/` so it is not tied to one tool.

## Skills

The catalog in [`skills/`](skills) has 21 skills: `caveman` (terse replies, always installed), `shadcn`, `ui-ux-pro-max`, 8 `gsap-*` and 10 `threejs-*`. Skills are copied into the project, so nothing depends on plugins installed on your machine. They are not loaded automatically: the agent reads a skill only when the task matches its entry in `.ai/skills-index.md`, so unused skills cost no tokens.

To add your own, drop a folder with a `SKILL.md` (frontmatter: `name`, `description`) into `skills/`. See [skills/README.md](skills/README.md).

## What is enforced, and what is not

- **By tooling:** naming, `import type`, no `console`, `===`, file size, complexity, parameter count, feature imports only through `@/features/<name>`, GSAP/other libraries only through their adapter (when you add the lint rule), undocumented dependencies (`check:libs`), API contract drift (Python stack), and the token budget for the always-loaded files (`check:budget`, under 2000 tokens).
- **By instruction only:** SOLID, layer direction, one-library-per-role. Agents are told to follow them; nothing checks it automatically.
- **Claude Code only:** hooks that refresh the skills index and run `check:libs` after installs. Other tools rely on the `AGENTS.md` instructions plus running `npm run check:libs` yourself or in CI.

## Repo layout

```
src/cli.mjs          the scaffolder (plain Node, no build step)
templates/base/      files every project gets
templates/_web/      React + Vite part shared by the two split stacks
templates/<stack>/   stack-specific files, copied over base
skills/              the skill catalog
```

To add a stack: create `templates/<stack>/` and add an entry to `STACKS` in `src/cli.mjs`. To check a change, scaffold a project into a temp folder and run `npm install`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`.

## Status

Early. Each stack has been scaffolded, installed and run through typecheck, lint, tests and build, and the plan, work, sync flow has been run once on a real small feature. Not yet done:

- The token savings target (1-2k tokens instead of 30-80k of exploration) has not been measured against a baseline. Measured so far: the always-loaded files are about 1.1k tokens; one real task loaded about 8.6k tokens of rules, plan and skills before any code.
- `/analyze` has not been tried on an existing codebase.
- The sample projects have one `health` example feature and no end-to-end (Playwright) specs; there is no CI workflow yet.
- The card and map are refreshed by the agent following `/sync`, not by a script, so they can drift on large projects.
- It is not published to npm; use the `npx github:...` form.
- No license file yet. Some bundled skills are third-party content: the `gsap-*` skills declare an MIT license in their frontmatter; the others do not declare one, so check their upstream terms before reusing them elsewhere.
