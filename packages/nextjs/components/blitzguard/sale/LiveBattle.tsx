"use client";

import { useEffect } from "react";
import { AgentCard } from "./AgentCard";
import { LiveTxStream } from "./LiveTxStream";
import { MetricsDashboard, TpsPulseBackground } from "./MetricsDashboard";
import { ProductCard } from "./ProductCard";
import { StockBar } from "./StockBar";
import { motion } from "motion/react";
import { startBattleSource } from "~~/services/battle/battleSource";
import { useBattleStore } from "~~/services/store/battleStore";
import { useFlowStore } from "~~/services/store/flowStore";
import { useResultStore } from "~~/services/store/resultStore";

export const LiveBattle = () => {
  const mockMode = useFlowStore(s => s.mockMode);
  const goTo = useFlowStore(s => s.goTo);
  const { setMetrics, setAgentStatus, pushEvent } = useBattleStore.getState();
  const setSummary = useResultStore(s => s.setSummary);
  const stockLeft = useBattleStore(s => s.metrics.stockLeft);

  useEffect(() => {
    useBattleStore.getState().start();
    const stop = startBattleSource(mockMode ? "mock" : "ws", {
      onEvent: pushEvent,
      onMetrics: setMetrics,
      onAgentStatus: setAgentStatus,
      onComplete: summary => {
        setSummary(summary);
        window.setTimeout(() => goTo("result"), 1200);
      },
    });
    return () => stop();
  }, [mockMode, pushEvent, setMetrics, setAgentStatus, setSummary, goTo]);

  return (
    <div className="relative mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-5xl flex-col gap-5 px-6 py-8">
      <TpsPulseBackground />
      <div className="relative z-10 flex flex-col gap-5">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-base-content/50">Sale Live</span>
            <h2 className="font-display text-2xl font-bold md:text-3xl">Bots vs humans, fair queue.</h2>
          </div>
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest"
            style={{ borderColor: "var(--bg-brand)", color: "var(--bg-brand)" }}
          >
            <span className="h-1.5 w-1.5 rounded-full pulse-dot" style={{ backgroundColor: "var(--bg-brand)" }} />
            Monad Testnet
          </span>
        </motion.div>

        <MetricsDashboard />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr,1fr]">
          <LiveTxStream />
          <div className="flex flex-col gap-4">
            <AgentCard />
            <div className="flex flex-col gap-3">
              <ProductCard compact stockLeft={stockLeft} />
              <StockBar stockLeft={stockLeft} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
