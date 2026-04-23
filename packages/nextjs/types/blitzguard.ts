export type AgentStatus = "standby" | "armed" | "processing" | "completed" | "failed";

export type BattleEvent =
  | {
      kind: "new_request";
      id: string;
      ts: number;
      wallet: `0x${string}`;
      suspectedBot: boolean;
    }
  | {
      kind: "bot_blocked";
      id: string;
      ts: number;
      wallet: `0x${string}`;
      reason: "pattern" | "velocity" | "signature";
    }
  | {
      kind: "human_accepted";
      id: string;
      ts: number;
      wallet: `0x${string}`;
      queuePosition: number;
      isYou?: boolean;
    }
  | {
      kind: "purchase_complete";
      id: string;
      ts: number;
      wallet: `0x${string}`;
      txHash?: `0x${string}`;
      isYou?: boolean;
    };

export type BattleEventKind = BattleEvent["kind"];

export type BattleMetrics = {
  totalRequests: number;
  botsBlocked: number;
  humansProcessed: number;
  tps: number;
  peakTps: number;
  stockLeft: number;
  queuePosition: number | null;
};

export type HumanScoreData = {
  score: number;
  github: {
    username: string;
    repoCount: number;
    contributions: number;
    followers: number;
    accountAgeYears: number;
  };
  checks: { label: string; passed: boolean }[];
  verdict: "human" | "suspicious" | "bot";
  txHash?: `0x${string}`;
};

export type SaleInfo = {
  productId: "nike-air-max-limited";
  name: string;
  edition: string;
  priceUsd: number;
  totalStock: number;
  saleStart: number;
};

export type ResultSummary = {
  outcome: "won" | "lost";
  userQueuePosition?: number;
  totalRequests: number;
  botsBlocked: number;
  humansProcessed: number;
  peakTps: number;
  durationMs: number;
  txHash?: `0x${string}`;
};

export type FlowStep = "connect" | "verify" | "sale" | "result";
