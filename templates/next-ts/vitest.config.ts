import { defineConfig } from "vitest/config";

// Unit tests live in src/**/tests; e2e/ belongs to Playwright and must not be picked up by vitest.
export default defineConfig({
  test: { include: ["src/**/*.test.{ts,tsx}"] },
});
