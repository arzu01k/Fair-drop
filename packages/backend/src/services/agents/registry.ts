import { randomUUID } from "node:crypto";
import type { AgentStatus } from "../../types.js";

export type AgentRecord = {
  id: string;
  wallet: `0x${string}`;
  saleId: string;
  status: AgentStatus;
  queuePosition: number | null;
  txHash?: `0x${string}`;
  createdAt: number;
};

const agents = new Map<string, AgentRecord>();

export const createAgent = (wallet: `0x${string}`, saleId: string): AgentRecord => {
  const rec: AgentRecord = {
    id: randomUUID(),
    wallet,
    saleId,
    status: "armed",
    queuePosition: null,
    createdAt: Date.now(),
  };
  agents.set(rec.id, rec);
  return rec;
};

export const getAgent = (id: string): AgentRecord | undefined => agents.get(id);

export const updateAgent = (id: string, patch: Partial<AgentRecord>) => {
  const rec = agents.get(id);
  if (!rec) return undefined;
  const next = { ...rec, ...patch };
  agents.set(id, next);
  return next;
};

export const markAgentPurchased = (id: string, txHash: `0x${string}`) =>
  updateAgent(id, { status: "completed", txHash });
