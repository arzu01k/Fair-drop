import { Router } from "express";
import { z } from "zod";
import { HttpError } from "../middleware/errorHandler.js";
import { createAgent, getAgent, markAgentPurchased } from "../services/agents/registry.js";

export const agentRouter: Router = Router();

const activateSchema = z.object({
  wallet: z.string().regex(/^0x[0-9a-fA-F]{40}$/),
  saleId: z.string().min(1),
});

agentRouter.post("/activate", (req, res, next) => {
  try {
    const { wallet, saleId } = activateSchema.parse(req.body);
    const rec = createAgent(wallet as `0x${string}`, saleId);
    res.status(201).json(rec);
  } catch (err) {
    next(err);
  }
});

agentRouter.get("/status/:id", (req, res, next) => {
  try {
    const rec = getAgent(req.params.id);
    if (!rec) throw new HttpError(404, "agent_not_found");
    res.json(rec);
  } catch (err) {
    next(err);
  }
});

const purchaseSchema = z.object({
  agentId: z.string().uuid(),
});

agentRouter.post("/purchase", (req, res, next) => {
  try {
    const { agentId } = purchaseSchema.parse(req.body);
    const rec = getAgent(agentId);
    if (!rec) throw new HttpError(404, "agent_not_found");
    // Mock tx hash for the purchase; the real contract call will replace this
    // once BlitzGuard.sol is deployed.
    const txHash = ("0x" + agentId.replace(/-/g, "").padEnd(64, "0").slice(0, 64)) as `0x${string}`;
    const updated = markAgentPurchased(agentId, txHash);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});
