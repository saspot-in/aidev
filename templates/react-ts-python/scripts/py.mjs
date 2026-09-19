// Runs the virtualenv Python of apps/api from that directory: node scripts/py.mjs <python args>
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";

const api = resolve(import.meta.dirname, "..", "apps", "api");
const python = join(api, ".venv", process.platform === "win32" ? "Scripts/python.exe" : "bin/python");

if (!existsSync(python)) {
  console.error("apps/api/.venv not found. Run: npm run setup:api");
  process.exit(1);
}
const env = { ...process.env, PYTHONPATH: api }; // lets scripts/*.py import the app package
const res = spawnSync(python, process.argv.slice(2), { cwd: api, stdio: "inherit", env });
process.exit(res.status ?? 1);
