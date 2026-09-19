// The API contract: zod schemas shared by apps/api (validate) and apps/web (parse).
// Add one file per capability and re-export here. Types come from z.infer.
import { z } from "zod";

export const HealthResponse = z.object({ status: z.literal("ok") });
export type HealthResponse = z.infer<typeof HealthResponse>;
