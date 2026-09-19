import { describe, expect, it } from "vitest";
import { HealthResponse } from "@__PROJECT_NAME__/contract";
import { buildApp } from "../../../app";

describe("GET /api/health", () => {
  it("returns a contract-valid body", async () => {
    const app = buildApp();
    const res = await app.inject({ method: "GET", url: "/api/health" });
    expect(res.statusCode).toBe(200);
    expect(HealthResponse.parse(res.json())).toEqual({ status: "ok" });
  });
});
