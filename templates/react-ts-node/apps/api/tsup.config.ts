import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node20",
  clean: true,
  // the contract package ships TS source, so bundle it instead of resolving it at runtime
  noExternal: [/\/contract$/],
});
