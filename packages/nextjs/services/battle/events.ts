import type { BattleEvent } from "~~/types/blitzguard";

export const isBattleEvent = (x: unknown): x is BattleEvent => {
  if (!x || typeof x !== "object") return false;
  const kind = (x as { kind?: unknown }).kind;
  return kind === "new_request" || kind === "bot_blocked" || kind === "human_accepted" || kind === "purchase_complete";
};
