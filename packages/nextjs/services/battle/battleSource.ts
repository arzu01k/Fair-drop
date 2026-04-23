import { startMockBattle } from "./mockEngine";
import { startWsBattle } from "./wsClient";
import { isBackendReachable } from "~~/services/api/client";
import type { AgentStatus, BattleEvent, BattleMetrics, ResultSummary } from "~~/types/blitzguard";

type Callbacks = {
  onEvent: (e: BattleEvent) => void;
  onMetrics: (m: Partial<BattleMetrics>) => void;
  onAgentStatus: (s: AgentStatus) => void;
  onComplete: (summary: ResultSummary) => void;
};

// Returns a cleanup function immediately so the caller's useEffect can tear
// down on unmount even if the backend probe is still in flight. When mode is
// "ws" but the backend is unreachable we quietly fall back to the local mock
// so the demo keeps running.
export const startBattleSource = (mode: "mock" | "ws", cbs: Callbacks): (() => void) => {
  if (mode === "mock") return startMockBattle(cbs);

  let stopFn: (() => void) | null = null;
  let cancelled = false;

  void (async () => {
    const reachable = await isBackendReachable();
    if (cancelled) return;
    if (!reachable) {
      console.warn("[battleSource] backend unreachable — using local mock engine.");
    }
    stopFn = reachable ? startWsBattle(cbs) : startMockBattle(cbs);
  })();

  return () => {
    cancelled = true;
    stopFn?.();
  };
};
