// Creates apps/api/.venv and installs Python deps. Needs Python 3.11+ on PATH.
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";

const api = resolve(import.meta.dirname, "..", "apps", "api");
const run = (cmd, args) => spawnSync(cmd, args, { cwd: api, stdio: "inherit" });

const venv = join(api, ".venv");
if (!existsSync(venv)) {
  const base = ["python3", "python"].find((c) => spawnSync(c, ["--version"]).status === 0);
  if (!base) {
    console.error("Python not found on PATH (need 3.11+).");
    process.exit(1);
  }
  if (run(base, ["-m", "venv", ".venv"]).status !== 0) process.exit(1);
}
const python = join(venv, process.platform === "win32" ? "Scripts/python.exe" : "bin/python");
const res = run(python, ["-m", "pip", "install", "-r", "requirements-dev.txt"]);
process.exit(res.status ?? 1);
