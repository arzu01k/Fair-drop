import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { AgentStatus, BattleEvent, BattleMetrics } from "~~/types/blitzguard";
import { PRODUCT } from "~~/utils/blitzguard/constants";

const RING_BUFFER_CAP = 40;

const initialMetrics: BattleMetrics = {
  totalRequests: 0,
  botsBlocked: 0,
  humansProcessed: 0,
  tps: 0,
  peakTps: 0,
  stockLeft: PRODUCT.totalStock,
  queuePosition: null,
};

type BattleState = {
  agentStatus: AgentStatus;
  metrics: BattleMetrics;
  events: BattleEvent[];
  startedAt: number | null;
  pushEvent: (e: BattleEvent) => void;
  setMetrics: (patch: Partial<BattleMetrics>) => void;
  setAgentStatus: (s: AgentStatus) => void;
  start: () => void;
  reset: () => void;
};

export const useBattleStore = create<BattleState>()(
  subscribeWithSelector(set => ({
    agentStatus: "standby",
    metrics: initialMetrics,
    events: [],
    startedAt: null,
    pushEvent: e =>
      set(state => {
        const next =
          state.events.length >= RING_BUFFER_CAP
            ? [...state.events.slice(-(RING_BUFFER_CAP - 1)), e]
            : [...state.events, e];
        return { events: next };
      }),
    setMetrics: patch =>
      set(state => {
        const merged = { ...state.metrics, ...patch };
        if (patch.tps !== undefined && patch.tps > state.metrics.peakTps) {
          merged.peakTps = patch.tps;
        }
        return { metrics: merged };
      }),
    setAgentStatus: s => set({ agentStatus: s }),
    start: () => set({ startedAt: Date.now(), agentStatus: "armed" }),
    reset: () =>
      set({
        agentStatus: "standby",
        metrics: initialMetrics,
        events: [],
        startedAt: null,
      }),
  })),
);
