import Fastify from "fastify";
import { registerHealth } from "./features/health";

export function buildApp() {
  const app = Fastify({ logger: process.env.NODE_ENV !== "test" });
  registerHealth(app);
  return app;
}
