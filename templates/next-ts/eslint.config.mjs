import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";


// Conventions enforced mechanically (see .ai/rules/conventions.md)
const conventions = {
  files: ["**/*.{ts,tsx}"],
  rules: {
    "no-console": "warn",
    complexity: ["warn", 10],
    "max-params": ["warn", 4],
    "max-classes-per-file": ["warn", 1],
    eqeqeq: ["error", "always"],
    "max-lines": ["warn", { max: 300, skipBlankLines: true, skipComments: true }],
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/naming-convention": [
      "error",
      { selector: "typeLike", format: ["PascalCase"] },
      { selector: "variable", format: ["camelCase", "PascalCase", "UPPER_CASE"], leadingUnderscore: "allow" },
      { selector: "function", format: ["camelCase", "PascalCase"] },
    ],
  },
};

// Cross-feature imports must go through the feature surface (@/features/<name>)
const featureSurface = {
  files: ["**/*.{ts,tsx}"],
  rules: {
    "no-restricted-imports": [
      "error",
      { patterns: [{ group: ["@/features/*/*"], message: "Import a feature only through its surface: @/features/<name>." }] },
    ],
  },
};

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  conventions,
  featureSurface,
  globalIgnores([".next/**", "out/**", "node_modules/**", "next-env.d.ts"]),
]);
