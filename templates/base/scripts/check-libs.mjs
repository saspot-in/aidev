// Verifies every runtime dependency has a row in .ai/libs/index.md.
//   node scripts/check-libs.mjs           report; exit 1 when a dependency is undocumented
//   node scripts/check-libs.mjs --dev     also check devDependencies
//   node scripts/check-libs.mjs --hook    Claude Code PostToolUse mode: reads the tool call from stdin,
//                                         only acts after a dependency-changing edit/command, exit 2 = tell the agent
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const argv = process.argv.slice(2);
const hookMode = argv.includes("--hook");
const includeDev = argv.includes("--dev");

if (hookMode) {
  let input = {};
  try {
    input = JSON.parse(readFileSync(0, "utf8") || "{}");
  } catch {
    process.exit(0);
  }
  const file = input.tool_input?.file_path ?? "";
  const cmd = input.tool_input?.command ?? "";
  const manifestEdit = /(^|[\\/])(package\.json|requirements[^\\/]*\.txt|pyproject\.toml)$/.test(file);
  const installCmd = /\b(npm|pnpm|yarn|bun)\s+(i|install|add|remove|rm|uninstall)\b|\b(pip3?|uv)\s+(install|add|uninstall|remove)\b|-m\s+pip\s+(install|uninstall)/.test(cmd);
  if (!manifestEdit && !installCmd) process.exit(0);
}

const norm = (name) => name.trim().toLowerCase().replace(/[_.]/g, "-");
const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const subdirs = (dir) =>
  existsSync(dir) ? readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory() && d.name !== "node_modules").map((d) => join(dir, d.name)) : [];

const roots = [".", ...subdirs("apps"), ...subdirs("packages")];
const deps = new Map(); // normalized name -> where it is declared
const own = new Set(); // workspace packages are not libraries

for (const root of roots) {
  const pkg = join(root, "package.json");
  if (existsSync(pkg)) {
    const json = readJson(pkg);
    if (root !== "." && json.name) own.add(norm(json.name));
    const sections = includeDev ? ["dependencies", "devDependencies"] : ["dependencies"];
    for (const section of sections) for (const name of Object.keys(json[section] ?? {})) if (!deps.has(norm(name))) deps.set(norm(name), pkg);
  }
  const req = join(root, "requirements.txt");
  if (existsSync(req)) {
    for (const raw of readFileSync(req, "utf8").split(/\r?\n/)) {
      const line = raw.split("#")[0].trim();
      if (!line || line.startsWith("-")) continue;
      const name = line.match(/^[A-Za-z0-9][A-Za-z0-9._-]*/)?.[0];
      if (name && !deps.has(norm(name))) deps.set(norm(name), req);
    }
  }
}

const registry = new Set();
const indexPath = join(".ai", "libs", "index.md");
if (existsSync(indexPath)) {
  for (const line of readFileSync(indexPath, "utf8").split(/\r?\n/)) {
    if (!line.trim().startsWith("|")) continue;
    const first = line.split("|")[1]?.replace(/[`\s]/g, "") ?? "";
    if (!first || first === "package" || /^-+$/.test(first)) continue;
    registry.add(norm(first));
  }
}

// dev tooling never needs a registry row unless --dev is passed
const missing = [...deps.keys()].filter((n) => !registry.has(n) && !own.has(n) && !n.startsWith("@types/"));
const allDeclared = new Set(deps.keys());
if (!includeDev) {
  // registry rows may legitimately point at devDependencies; do not flag those as stale
  for (const root of roots) {
    const pkg = join(root, "package.json");
    if (existsSync(pkg)) for (const name of Object.keys(readJson(pkg).devDependencies ?? {})) allDeclared.add(norm(name));
  }
}
const stale = [...registry].filter((n) => !allDeclared.has(n));

if (stale.length) console.warn(`Stale registry rows (not in any manifest): ${stale.join(", ")}. If removed on purpose, delete the row and .ai/libs/<lib>.md.`);

if (missing.length) {
  const list = missing.map((n) => `${n} (${deps.get(n)})`).join(", ");
  const msg =
    `Undocumented dependencies: ${list}\n` +
    "Follow .ai/libs/README.md now, in this same change: check the role in .ai/libs/index.md (one library per role), " +
    "create .ai/libs/<lib>.md (copy .ai/libs/presets/<lib>.md if it exists, else _TEMPLATE.md), wrap the library in one adapter module, " +
    "add the row to index.md, and record an ADR/INV if it constrains code. Then run: npm run check:libs";
  console.error(msg);
  process.exit(hookMode ? 2 : 1);
}
if (!hookMode) console.log(`libs ok: ${deps.size} dependenc${deps.size === 1 ? "y" : "ies"} checked, all registered`);
