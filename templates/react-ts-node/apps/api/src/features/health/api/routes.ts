import type { FastifyInstance } from "fastify";
import { HealthResponse } from "@__PROJECT_NAME__/contract";

export function registerHealth(app: FastifyInstance) {
  app.get("/api/health", async () => HealthResponse.parse({ status: "ok" }));
}
