import { Router } from "express";
import { z } from "zod";
import { env } from "../env.js";
import { HttpError } from "../middleware/errorHandler.js";
import { analyzeGithubUser } from "../services/github/analyzer.js";
import { mockScoreFor } from "../services/github/mock.js";

export const verifyRouter: Router = Router();

const analyzeSchema = z.object({
  github: z.string().min(1).max(60),
  wallet: z
    .string()
    .regex(/^0x[0-9a-fA-F]{40}$/, "wallet must be a 0x-prefixed 20-byte hex")
    .optional(),
});

verifyRouter.post("/analyze", async (req, res, next) => {
  try {
    const { github } = analyzeSchema.parse(req.body);

    if (env.BLITZGUARD_MOCK) {
      res.json(mockScoreFor(github));
      return;
    }

    try {
      const data = await analyzeGithubUser(github);
      res.json(data);
    } catch (err) {
      // If the upstream API is down or rate-limited, fall back to mock so the
      // demo does not break. 404s propagate so UI can show "user not found".
      if (err instanceof HttpError && err.status === 404) throw err;
      // eslint-disable-next-line no-console
      console.warn("[verify] falling back to mock:", err);
      res.json(mockScoreFor(github));
    }
  } catch (err) {
    next(err);
  }
});

const registerSchema = z.object({
  wallet: z.string().regex(/^0x[0-9a-fA-F]{40}$/),
  score: z.number().int().min(0).max(100),
  github: z.string().min(1),
});

verifyRouter.post("/register", async (req, res, next) => {
  try {
    const body = registerSchema.parse(req.body);
    // Until the contracts are deployed we return a deterministic mock tx hash
    // so the frontend can render an explorer link.
    const mockHash =
      "0x" +
      Buffer.from(`${body.wallet}${body.github}${body.score}`)
        .toString("hex")
        .padEnd(64, "0")
        .slice(0, 64);
    res.json({ txHash: mockHash, status: "recorded" });
  } catch (err) {
    next(err);
  }
});
