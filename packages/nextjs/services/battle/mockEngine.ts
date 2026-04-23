import type { AgentStatus, BattleEvent, BattleMetrics, ResultSummary } from "~~/types/blitzguard";
import {
  MOCK_BATTLE_DURATION_MS,
  MOCK_RESULT_BOTS_BLOCKED,
  MOCK_RESULT_HUMANS_PROCESSED,
  MOCK_RESULT_PEAK_TPS,
  MOCK_RESULT_TOTAL_REQUESTS,
  MOCK_TX_HASH,
  MOCK_USER_QUEUE_POSITION,
  PRODUCT,
} from "~~/utils/blitzguard/constants";

type Callbacks = {
  onEvent: (e: BattleEvent) => void;
  onMetrics: (m: Partial<BattleMetrics>) => void;
  onAgentStatus: (s: AgentStatus) => void;
  onComplete: (summary: ResultSummary) => void;
};

// mulberry32 PRNG — deterministic for repeatable demo runs.
const makeRng = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const randomWallet = (rng: () => number): `0x${string}` => {
  const hex = "0123456789abcdef";
  let s = "0x";
  for (let i = 0; i < 40; i++) s += hex[Math.floor(rng() * 16)];
  return s as `0x${string}`;
};

const TICK_MS = 100;
const TOTAL_TICKS = MOCK_BATTLE_DURATION_MS / TICK_MS;

// Two separate rates so the dashboard counters can race impressively while the
// visible stream stays readable (~3-5 lines/sec):
//
//   visibleEmit(tick)    → should we push a bot/human line to the stream this tick?
//   displayInflation(ms) → how many synthetic requests to add to the dashboard
//
// Visible lines are a sample; the counters tell the full story. At sale end
// we still show ~5000 total requests blocked by the scripted summary card.

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const YOUR_ACCEPT_TICK = 300; // 30s
const YOUR_PURCHASE_TICK = 540; // 54s
const STOCK_DRAIN_START_TICK = 200; // start depleting stock at 20s
const STOCK_DRAIN_INTERVAL = 3; // every 3 ticks → 100 drains over 30s

const visibleEmit = (tick: number, tMs: number): boolean => {
  if (tMs < 5000) return tick % 4 === 0; // ~2.5/s warm-up
  if (tMs < 20000) return tick % 2 === 0; // ~5/s attack peak
  if (tMs < 50000) return tick % 2 === 0; // ~5/s processing
  return tick % 5 === 0; // ~2/s drain
};

const displayInflation = (tMs: number, rngJitter: number): number => {
  // Per-tick bump for `totalRequests` on the dashboard. Uses small jitter so
  // the counter does not tick in perfect lockstep.
  if (tMs < 5000) return 3 + Math.floor(rngJitter * 3);
  if (tMs < 20000) return 18 + Math.floor(rngJitter * 10);
  if (tMs < 50000) return 7 + Math.floor(rngJitter * 4);
  return 1 + Math.floor(rngJitter * 2);
};

const botRatio = (tMs: number) => (tMs < 20000 ? 0.85 : 0.72);

export const startMockBattle = ({ onEvent, onMetrics, onAgentStatus, onComplete }: Callbacks) => {
  const rng = makeRng(0xb117ad);
  let tick = 0;
  let totalRequests = 0;
  let botsBlocked = 0;
  let humansProcessed = 0;
  let stockLeft = PRODUCT.totalStock;
  let currentTps = 0;
  let peakTps = 0;
  let queuePosition: number | null = null;
  let yourAccepted = false;
  let yourPurchased = false;
  let agentStatus: AgentStatus = "armed";

  onAgentStatus("armed");

  const interval = setInterval(() => {
    const tMs = tick * TICK_MS;

    // TPS shape (unchanged) so the background pulse still tracks load.
    if (tMs < 5000) {
      currentTps = lerp(currentTps, 400, 0.1);
    } else if (tMs < 20000) {
      const phaseT = (tMs - 5000) / 15000;
      currentTps = lerp(currentTps, lerp(800, MOCK_RESULT_PEAK_TPS, phaseT), 0.12);
    } else if (tMs < 50000) {
      currentTps = lerp(currentTps, MOCK_RESULT_PEAK_TPS - 400 + Math.floor(rng() * 800), 0.2);
      if (agentStatus !== "processing") {
        agentStatus = "processing";
        onAgentStatus("processing");
      }
    } else {
      currentTps = lerp(currentTps, 1200, 0.15);
    }
    if (currentTps > peakTps) peakTps = currentTps;

    // Inflate dashboard counters every tick for the "Monad is hot" feel.
    const bump = displayInflation(tMs, rng());
    totalRequests += bump;
    botsBlocked += Math.round(bump * botRatio(tMs));

    // Visible stream event — max one per emit-tick.
    if (visibleEmit(tick, tMs)) {
      const isBot = rng() < botRatio(tMs);
      const wallet = randomWallet(rng);
      const id = `${tick}-${Math.floor(rng() * 1e6)}`;

      if (isBot) {
        const reasons: Array<"pattern" | "velocity" | "signature"> = ["pattern", "velocity", "signature"];
        onEvent({
          kind: "bot_blocked",
          id,
          ts: Date.now(),
          wallet,
          reason: reasons[Math.floor(rng() * 3)],
        });
      } else if (stockLeft > 0) {
        onEvent({
          kind: "human_accepted",
          id,
          ts: Date.now(),
          wallet,
          queuePosition: Math.min(humansProcessed + 1, PRODUCT.totalStock),
        });
      }
    }

    // Deterministic stock drain during processing so humansProcessed reaches
    // the scripted 100 by the time the sale closes.
    if (
      tick >= STOCK_DRAIN_START_TICK &&
      tick < STOCK_DRAIN_START_TICK + PRODUCT.totalStock * STOCK_DRAIN_INTERVAL &&
      tick % STOCK_DRAIN_INTERVAL === 0 &&
      stockLeft > 0
    ) {
      stockLeft -= 1;
      humansProcessed += 1;
    }

    // Your agent milestones.
    if (!yourAccepted && tick >= YOUR_ACCEPT_TICK) {
      yourAccepted = true;
      queuePosition = MOCK_USER_QUEUE_POSITION;
      onEvent({
        kind: "human_accepted",
        id: "you-accept",
        ts: Date.now(),
        wallet: "0x7a3b7a3b7a3b7a3b7a3b7a3b7a3b7a3b7a3b7a3b",
        queuePosition: MOCK_USER_QUEUE_POSITION,
        isYou: true,
      });
    }

    if (!yourPurchased && tick >= YOUR_PURCHASE_TICK) {
      yourPurchased = true;
      onEvent({
        kind: "purchase_complete",
        id: "you-purchase",
        ts: Date.now(),
        wallet: "0x7a3b7a3b7a3b7a3b7a3b7a3b7a3b7a3b7a3b7a3b",
        txHash: MOCK_TX_HASH,
        isYou: true,
      });
    }

    if (queuePosition !== null && tick >= YOUR_ACCEPT_TICK && tick < YOUR_PURCHASE_TICK) {
      const progress = (tick - YOUR_ACCEPT_TICK) / (YOUR_PURCHASE_TICK - YOUR_ACCEPT_TICK);
      queuePosition = Math.max(1, MOCK_USER_QUEUE_POSITION - Math.floor(progress * MOCK_USER_QUEUE_POSITION));
    }

    onMetrics({
      totalRequests,
      botsBlocked,
      humansProcessed,
      tps: Math.round(currentTps),
      peakTps: Math.round(peakTps),
      stockLeft,
      queuePosition,
    });

    tick++;

    if (tick >= TOTAL_TICKS) {
      clearInterval(interval);
      agentStatus = "completed";
      onAgentStatus("completed");
      onComplete({
        outcome: "won",
        userQueuePosition: MOCK_USER_QUEUE_POSITION,
        totalRequests: MOCK_RESULT_TOTAL_REQUESTS,
        botsBlocked: MOCK_RESULT_BOTS_BLOCKED,
        humansProcessed: MOCK_RESULT_HUMANS_PROCESSED,
        peakTps: MOCK_RESULT_PEAK_TPS,
        durationMs: MOCK_BATTLE_DURATION_MS,
        txHash: MOCK_TX_HASH,
      });
    }
  }, TICK_MS);

  return () => clearInterval(interval);
};
