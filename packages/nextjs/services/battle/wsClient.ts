import { Socket, io } from "socket.io-client";
import { API_BASE } from "~~/services/api/client";
import type { AgentStatus, BattleEvent, BattleMetrics, ResultSummary } from "~~/types/blitzguard";

type Callbacks = {
  onEvent: (e: BattleEvent) => void;
  onMetrics: (m: Partial<BattleMetrics>) => void;
  onAgentStatus: (s: AgentStatus) => void;
  onComplete: (summary: ResultSummary) => void;
};

type WsBattleMessage =
  | { type: "event"; payload: BattleEvent }
  | { type: "metrics"; payload: Partial<BattleMetrics> }
  | { type: "agent_status"; payload: AgentStatus }
  | { type: "complete"; payload: ResultSummary };

type BattleSnapshot = {
  metrics: BattleMetrics;
  agentStatus: AgentStatus;
  events: BattleEvent[];
  summary: ResultSummary | null;
};

export const startWsBattle = ({ onEvent, onMetrics, onAgentStatus, onComplete }: Callbacks): (() => void) => {
  const socket: Socket = io(`${API_BASE}/battle`, {
    path: "/ws",
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 3,
    timeout: 4000,
  });

  socket.on("connect", () => {
    socket.emit("start");
  });

  socket.on("snapshot", (snap: BattleSnapshot) => {
    onMetrics(snap.metrics);
    onAgentStatus(snap.agentStatus);
    snap.events.forEach(onEvent);
    if (snap.summary) onComplete(snap.summary);
  });

  socket.on("message", (msg: WsBattleMessage) => {
    switch (msg.type) {
      case "event":
        onEvent(msg.payload);
        break;
      case "metrics":
        onMetrics(msg.payload);
        break;
      case "agent_status":
        onAgentStatus(msg.payload);
        break;
      case "complete":
        onComplete(msg.payload);
        break;
    }
  });

  return () => {
    socket.disconnect();
  };
};
