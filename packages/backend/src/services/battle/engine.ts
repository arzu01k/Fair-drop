import type { Namespace } from "socket.io";
import { env } from "../../env.js";
import type {
  AgentStatus,
  BattleEvent,
  BattleMetrics,
  ResultSummary,
  WsBattleMessage,
} from "../../types.js";

// Deterministic scripted battle. Kept in sync with
// packages/nextjs/services/battle/mockEngine.ts — visible stream stays
// readable (~3-5 lines/sec) while dashboard counters race impressively via a
// separate per-tick inflation rate.

const PRODUCT_STOCK = 100;
const BATTLE_DURATION_MS = 60_000;
const TICK_MS = 100;
const TOTAL_TICKS = BATTLE_DURATION_MS / TICK_MS;

const YOUR_ACCEPT_TICK = 300; // 30s
const YOUR_PURCHASE_TICK = 540; // 54s
const YOUR_QUEUE_POSITION = 67;

const STOCK_DRAIN_START_TICK = 200;
const STOCK_DRAIN_INTERVAL = 3;

const MOCK_TX_HASH =
  "0xf2a19b6c8d42afef8d3a5e7c23a87fbe94deaf6c15d22e3f9c4a87b192ed84a1" as const;
const MOCK_TOTAL_REQUESTS = 5847;
const MOCK_BOTS_BLOCKED = 4203;
const MOCK_HUMANS_PROCESSED = 100;
const MOCK_PEAK_TPS = 9247;

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

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const visibleEmit = (tick: number, tMs: number): boolean => {
  if (tMs < 5000) return tick % 4 === 0;
  if (tMs < 20000) return tick % 2 === 0;
  if (tMs < 50000) return tick % 2 === 0;
  return tick % 5 === 0;
};

const displayInflation = (tMs: number, jitter: number): number => {
  if (tMs < 5000) return 3 + Math.floor(jitter * 3);
  if (tMs < 20000) return 18 + Math.floor(jitter * 10);
  if (tMs < 50000) return 7 + Math.floor(jitter * 4);
  return 1 + Math.floor(jitter * 2);
};

const botRatio = (tMs: number) => (tMs < 20000 ? 0.85 : 0.72);

type State = {
  running: boolean;
  tick: number;
  metrics: BattleMetrics;
  agentStatus: AgentStatus;
  events: BattleEvent[];
  summary: ResultSummary | null;
  totalRequests: number;
  botsBlocked: number;
  humansProcessed: number;
  stockLeft: number;
  currentTps: number;
  peakTps: number;
  queuePosition: number | null;
  yourAccepted: boolean;
  yourPurchased: boolean;
};

const initialState = (): State => ({
  running: false,
  tick: 0,
  metrics: {
    totalRequests: 0,
    botsBlocked: 0,
    humansProcessed: 0,
    tps: 0,
    peakTps: 0,
    stockLeft: PRODUCT_STOCK,
    queuePosition: null,
  },
  agentStatus: "standby",
  events: [],
  summary: null,
  totalRequests: 0,
  botsBlocked: 0,
  humansProcessed: 0,
  stockLeft: PRODUCT_STOCK,
  currentTps: 0,
  peakTps: 0,
  queuePosition: null,
  yourAccepted: false,
  yourPurchased: false,
});

type Engine = {
  start: (ns: Namespace) => void;
  stop: () => void;
  reset: () => void;
  isRunning: () => boolean;
  snapshot: () => Pick<State, "metrics" | "agentStatus" | "events" | "summary">;
};

const RING_BUFFER_CAP = 40;

export const createBattleEngine = (): Engine => {
  let state = initialState();
  let interval: NodeJS.Timeout | null = null;
  let ns: Namespace | null = null;

  const emit = (msg: WsBattleMessage) => ns?.emit("message", msg);

  const push = (e: BattleEvent) => {
    state.events =
      state.events.length >= RING_BUFFER_CAP
        ? [...state.events.slice(-(RING_BUFFER_CAP - 1)), e]
        : [...state.events, e];
    emit({ type: "event", payload: e });
  };

  const setMetrics = (patch: Partial<BattleMetrics>) => {
    const merged = { ...state.metrics, ...patch };
    if (patch.tps !== undefined && patch.tps > state.metrics.peakTps) {
      merged.peakTps = patch.tps;
    }
    state.metrics = merged;
    emit({ type: "metrics", payload: patch });
  };

  const setAgentStatus = (s: AgentStatus) => {
    state.agentStatus = s;
    emit({ type: "agent_status", payload: s });
  };

  const tickOnce = (rng: () => number) => {
    const { tick } = state;
    const tMs = tick * TICK_MS;

    if (tMs < 5000) {
      state.currentTps = lerp(state.currentTps, 400, 0.1);
    } else if (tMs < 20000) {
      const phaseT = (tMs - 5000) / 15000;
      state.currentTps = lerp(state.currentTps, lerp(800, MOCK_PEAK_TPS, phaseT), 0.12);
    } else if (tMs < 50000) {
      state.currentTps = lerp(
        state.currentTps,
        MOCK_PEAK_TPS - 400 + Math.floor(rng() * 800),
        0.2,
      );
      if (state.agentStatus !== "processing") setAgentStatus("processing");
    } else {
      state.currentTps = lerp(state.currentTps, 1200, 0.15);
    }
    if (state.currentTps > state.peakTps) state.peakTps = state.currentTps;

    const bump = displayInflation(tMs, rng());
    state.totalRequests += bump;
    state.botsBlocked += Math.round(bump * botRatio(tMs));

    if (visibleEmit(tick, tMs)) {
      const isBot = rng() < botRatio(tMs);
      const wallet = randomWallet(rng);
      const id = `${tick}-${Math.floor(rng() * 1e6)}`;

      if (isBot) {
        const reasons: Array<"pattern" | "velocity" | "signature"> = [
          "pattern",
          "velocity",
          "signature",
        ];
        push({
          kind: "bot_blocked",
          id,
          ts: Date.now(),
          wallet,
          reason: reasons[Math.floor(rng() * 3)],
        });
      } else if (state.stockLeft > 0) {
        push({
          kind: "human_accepted",
          id,
          ts: Date.now(),
          wallet,
          queuePosition: Math.min(state.humansProcessed + 1, PRODUCT_STOCK),
        });
      }
    }

    if (
      tick >= STOCK_DRAIN_START_TICK &&
      tick < STOCK_DRAIN_START_TICK + PRODUCT_STOCK * STOCK_DRAIN_INTERVAL &&
      tick % STOCK_DRAIN_INTERVAL === 0 &&
      state.stockLeft > 0
    ) {
      state.stockLeft -= 1;
      state.humansProcessed += 1;
    }

    if (!state.yourAccepted && tick >= YOUR_ACCEPT_TICK) {
      state.yourAccepted = true;
      state.queuePosition = YOUR_QUEUE_POSITION;
      push({
        kind: "human_accepted",
        id: "you-accept",
        ts: Date.now(),
        wallet: "0x7a3b7a3b7a3b7a3b7a3b7a3b7a3b7a3b7a3b7a3b",
        queuePosition: YOUR_QUEUE_POSITION,
        isYou: true,
      });
    }

    if (!state.yourPurchased && tick >= YOUR_PURCHASE_TICK) {
      state.yourPurchased = true;
      push({
        kind: "purchase_complete",
        id: "you-purchase",
        ts: Date.now(),
        wallet: "0x7a3b7a3b7a3b7a3b7a3b7a3b7a3b7a3b7a3b7a3b",
        txHash: MOCK_TX_HASH,
        isYou: true,
      });
    }

    if (state.queuePosition !== null && tick >= YOUR_ACCEPT_TICK && tick < YOUR_PURCHASE_TICK) {
      const progress = (tick - YOUR_ACCEPT_TICK) / (YOUR_PURCHASE_TICK - YOUR_ACCEPT_TICK);
      state.queuePosition = Math.max(
        1,
        YOUR_QUEUE_POSITION - Math.floor(progress * YOUR_QUEUE_POSITION),
      );
    }

    setMetrics({
      totalRequests: state.totalRequests,
      botsBlocked: state.botsBlocked,
      humansProcessed: state.humansProcessed,
      tps: Math.round(state.currentTps),
      stockLeft: state.stockLeft,
      queuePosition: state.queuePosition,
    });
  };

  return {
    start: (namespace: Namespace) => {
      if (state.running) return;
      ns = namespace;
      state = initialState();
      setAgentStatus("armed");
      state.running = true;
      const rng = makeRng(env.BLITZGUARD_BATTLE_SEED);

      interval = setInterval(() => {
        tickOnce(rng);
        state.tick++;
        if (state.tick >= TOTAL_TICKS) {
          clearInterval(interval!);
          interval = null;
          state.running = false;
          setAgentStatus("completed");
          const summary: ResultSummary = {
            outcome: "won",
            userQueuePosition: YOUR_QUEUE_POSITION,
            totalRequests: MOCK_TOTAL_REQUESTS,
            botsBlocked: MOCK_BOTS_BLOCKED,
            humansProcessed: MOCK_HUMANS_PROCESSED,
            peakTps: MOCK_PEAK_TPS,
            durationMs: BATTLE_DURATION_MS,
            txHash: MOCK_TX_HASH,
          };
          state.summary = summary;
          emit({ type: "complete", payload: summary });
        }
      }, TICK_MS);
    },
    stop: () => {
      if (interval) clearInterval(interval);
      interval = null;
      state.running = false;
    },
    reset: () => {
      if (interval) clearInterval(interval);
      interval = null;
      state = initialState();
    },
    isRunning: () => state.running,
    snapshot: () => ({
      metrics: state.metrics,
      agentStatus: state.agentStatus,
      events: state.events,
      summary: state.summary,
    }),
  };
};

export const battleEngine = createBattleEngine();
