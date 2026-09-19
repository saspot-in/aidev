import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// API dev server runs on :3001 in every stack; /api is proxied there.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  server: { port: 5173, proxy: { "/api": "http://localhost:3001" }, fs: { allow: ["../.."] } },
  test: { environment: "node", include: ["src/**/*.test.{ts,tsx}"] },
});
