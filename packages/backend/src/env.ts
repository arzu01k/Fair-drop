import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  BLITZGUARD_PORT: z.coerce.number().int().positive().default(3001),
  BLITZGUARD_CORS_ORIGIN: z.string().default("http://localhost:3000"),
  GITHUB_TOKEN: z.string().optional(),
  BLITZGUARD_MOCK: z
    .enum(["true", "false"])
    .default("false")
    .transform(v => v === "true"),
  BLITZGUARD_BATTLE_SEED: z.coerce.number().int().default(0xb117ad),
});

export const env = envSchema.parse(process.env);
