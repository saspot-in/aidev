#!/usr/bin/env node
// aidev — scaffold a project with the agent context layer.
//   aidev create [name] [--stack next-ts] [--skills a,b|all|none] [--yes]
//   aidev add-skill <name...>        (run inside a project)
//   aidev skills                     (list catalog)
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as p from "@clack/prompts";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TEMPLATES = join(ROOT, "templates");
const CATALOG = join(ROOT, "skills");

// overlays: template dirs copied over `base` in order. Dirs starting with "_" are shared parts, not stacks.
const STACKS = {
  "next-ts": {
    label: "Next.js (App Router) + TypeScript",
    overlays: ["next-ts"],
    summary:
      "Next.js (App Router) · TypeScript strict · Tailwind CSS · shadcn/ui + Radix + Magic UI · single theme in `theme.css`. Backend via Server Components/Actions/Route Handlers.",
  },
  "react-ts-node": {
    label: "React (Vite) + Node API (Fastify), all TypeScript",
    overlays: ["_web", "react-ts-node"],
    summary:
      "npm workspaces: `apps/web` (React 19 + Vite + Tailwind + shadcn/Radix/Magic UI, theme in root `theme.css`), `apps/api` (Node + Fastify + zod), `packages/contract` (shared zod schemas = API contract).",
  },
  "react-ts-python": {
    label: "React (Vite) + Python API (FastAPI)",
    overlays: ["_web", "react-ts-python"],
    setup: "npm run setup:api   # creates apps/api/.venv and installs Python deps",
    summary:
      "`apps/web` (React 19 + Vite + Tailwind + shadcn/Radix/Magic UI, theme in root `theme.css`) + `apps/api` (Python + FastAPI). Contract = OpenAPI (`packages/contract/openapi.json`) → generated TS types; drift gated by `npm run contract:check`.",
  },
};

const slug = (s) => s.trim().toLowerCase().replace(/[^a-z0-9-_.]+/g, "-").replace(/^-+|-+$/g, "");

function parseArgs(argv) {
  const flags = {};
  const pos = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("--")) {
        flags[key] = next;
        i++;
      } else flags[key] = true;
    } else pos.push(a);
  }
  return { flags, pos };
}

function readSkillMeta(dir) {
  const file = join(CATALOG, dir, "SKILL.md");
  const text = readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const fm = text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  const get = (k) => fm.match(new RegExp(`^${k}:\\s*(.+)$`, "m"))?.[1]?.trim().replace(/^["']|["']$/g, "") ?? "";
  return { dir, name: get("name") || dir, description: get("description") };
}

function catalog() {
  if (!existsSync(CATALOG)) return [];
  return readdirSync(CATALOG, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("_") && !d.name.startsWith(".") && existsSync(join(CATALOG, d.name, "SKILL.md")))
    .map((d) => readSkillMeta(d.name));
}

function replaceTokens(dir, tokens) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      replaceTokens(full, tokens);
    } else if (/\.(md|json|ts|tsx|mjs|css|txt|py|toml|html|yml|yaml)$/.test(entry.name) || entry.name === ".gitignore") {
      let text = readFileSync(full, "utf8");
      const next = Object.entries(tokens).reduce((t, [k, v]) => t.split(k).join(v), text);
      if (next !== text) writeFileSync(full, next);
    }
  }
}

// Skills that every project gets (AGENTS.md depends on them). Installed from the local catalog only.
const CORE_SKILLS = ["caveman"];

// Skill docs reference their own files as `skills/<name>/...`; in a project they live under `.ai/skills/`
// (vendor-neutral, works in any agent/IDE). Also normalize the python launcher for the OS doing the scaffold.
function rewriteSkillPaths(dir, name) {
  const re = new RegExp(String.raw`(?<![\w./-])(?:\.claude/)?skills/${name}/`, "g");
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) rewriteSkillPaths(full, name);
    else if (entry.name.endsWith(".md")) {
      const text = readFileSync(full, "utf8");
      let next = text.replace(re, `.ai/skills/${name}/`);
      if (process.platform === "win32") next = next.replace(/\bpython3\b/g, "python");
      if (next !== text) writeFileSync(full, next);
    }
  }
}

function installSkills(targetDir, names) {
  for (const name of names) {
    const src = join(CATALOG, name);
    if (!existsSync(join(src, "SKILL.md"))) throw new Error(`skill not in catalog: ${name}`);
    const dest = join(targetDir, ".ai", "skills", name);
    cpSync(src, dest, { recursive: true });
    rewriteSkillPaths(dest, name);
  }
  spawnSync(process.execPath, [join("scripts", "build-skills-index.mjs"), "--quiet"], { cwd: targetDir, stdio: "inherit" });
}

async function create({ flags, pos }) {
  const interactive = !flags.yes && process.stdin.isTTY;
  if (interactive) p.intro("aidev create");

  let name = pos[0];
  if (!name) {
    if (!interactive) throw new Error("project name required");
    name = await p.text({ message: "Project name", placeholder: "my-site", validate: (v) => (slug(v ?? "") ? undefined : "required") });
    if (p.isCancel(name)) return p.cancel("cancelled");
  }

  let stack = flags.stack;
  if (!stack) {
    const keys = Object.keys(STACKS);
    if (keys.length === 1 || !interactive) stack = keys[0];
    else {
      stack = await p.select({ message: "Stack", options: keys.map((k) => ({ value: k, label: STACKS[k].label })) });
      if (p.isCancel(stack)) return p.cancel("cancelled");
    }
  }
  if (!STACKS[stack] || !STACKS[stack].overlays.every((o) => existsSync(join(TEMPLATES, o)))) throw new Error(`unknown stack "${stack}". available: ${Object.keys(STACKS).join(", ")}`);

  const cat = catalog();
  const optional = cat.filter((s) => !CORE_SKILLS.includes(s.dir));
  let skills = [];
  if (flags.skills === "all") skills = optional.map((s) => s.dir);
  else if (typeof flags.skills === "string" && flags.skills !== "none") skills = flags.skills.split(",").map((s) => s.trim()).filter(Boolean);
  else if (interactive && optional.length && flags.skills === undefined) {
    const picked = await p.multiselect({
      message: "Skills to install (space to toggle)",
      options: optional.map((s) => ({ value: s.dir, label: s.name, hint: s.description.slice(0, 70) })),
      required: false,
    });
    if (p.isCancel(picked)) return p.cancel("cancelled");
    skills = picked;
  }
  const missingCore = CORE_SKILLS.filter((s) => !cat.some((c) => c.dir === s));
  if (missingCore.length) throw new Error(`core skill(s) missing from catalog (${CATALOG}): ${missingCore.join(", ")}`);
  skills = [...new Set([...CORE_SKILLS, ...skills])];
  const known = new Set(cat.map((s) => s.dir));
  const missing = skills.filter((s) => !known.has(s));
  if (missing.length) throw new Error(`skill(s) not in catalog: ${missing.join(", ")}`);

  const target = resolve(process.cwd(), flags.dir ?? name);
  if (existsSync(target) && readdirSync(target).length) throw new Error(`target not empty: ${target}`);
  mkdirSync(target, { recursive: true });

  cpSync(join(TEMPLATES, "base"), target, { recursive: true });
  for (const overlay of STACKS[stack].overlays) cpSync(join(TEMPLATES, overlay), target, { recursive: true });
  for (const f of ["gitignore", "gitattributes"]) if (existsSync(join(target, f))) renameSync(join(target, f), join(target, `.${f}`));
  replaceTokens(target, { __PROJECT_NAME__: slug(basename(name)), __STACK_SUMMARY__: STACKS[stack].summary });
  installSkills(target, skills);

  const done = `Created ${target}\n  stack:  ${stack}\n  skills: ${skills.length ? skills.join(", ") : "none"}`;
  const setup = STACKS[stack].setup ? `\n${STACKS[stack].setup}` : "";
  const next = `cd ${basename(target)}\nnpm install${setup}\nnpm run check:budget\nnpm run dev`;
  if (interactive) {
    p.note(next, "Next");
    p.outro(done);
  } else console.log(`${done}\n\nNext:\n${next}`);
}

function addSkill({ pos }) {
  if (!pos.length) throw new Error("usage: aidev add-skill <name...>");
  if (!existsSync(join(process.cwd(), "AGENTS.md"))) throw new Error("run inside a project root (AGENTS.md not found)");
  installSkills(process.cwd(), pos);
  console.log(`installed: ${pos.join(", ")}; skills index updated`);
}

function listSkills() {
  const cat = catalog();
  if (!cat.length) return console.log(`catalog empty. add skills to ${CATALOG}`);
  for (const s of cat) console.log(`${s.name.padEnd(28)} ${s.description}`);
}

const [cmd, ...rest] = process.argv.slice(2);
const args = parseArgs(rest);
try {
  if (cmd === "create") await create(args);
  else if (cmd === "add-skill") addSkill(args);
  else if (cmd === "skills") listSkills();
  else console.log("usage:\n  aidev create [name] [--stack next-ts] [--skills a,b|all|none] [--yes]\n  aidev add-skill <name...>\n  aidev skills");
} catch (e) {
  console.error(`error: ${e.message}`);
  process.exit(1);
}
