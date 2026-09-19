// Build-breaking token budget: AGENTS.md + .ai/map.md <= 2000 tokens (plan P-001 §4).
// js-tiktoken o200k_base is an approximation of Claude's tokenizer; MARGIN keeps us conservative.
import { readFileSync } from "node:fs";
import { getEncoding } from "js-tiktoken";

const BUDGET = 2000;
const MARGIN = 1.15;
const MAP_TARGET = 500;
const files = ["AGENTS.md", ".ai/map.md"];

const enc = getEncoding("o200k_base");
let total = 0;
for (const f of files) {
  const n = enc.encode(readFileSync(f, "utf8")).length;
  const adj = Math.ceil(n * MARGIN);
  total += adj;
  console.log(`${f.padEnd(12)} raw ${String(n).padStart(5)}  adj ${String(adj).padStart(5)}`);
  if (f === ".ai/map.md" && adj > MAP_TARGET) console.warn(`  warn: map.md over ~${MAP_TARGET} token target`);
}
console.log(`total adj ${total} / ${BUDGET} (margin x${MARGIN})`);
if (total > BUDGET) {
  console.error("FAIL: token budget exceeded");
  process.exit(1);
}
