"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { DROP } from "~~/components/blitzguard/motion/springs";
import { useReducedMotionAware } from "~~/components/blitzguard/motion/useReducedMotionAware";
import { useBattleStore } from "~~/services/store/battleStore";

const statusCopy = {
  standby: { label: "Standby", color: "var(--color-base-content)" },
  armed: { label: "Armed & Ready", color: "var(--bg-brand)" },
  processing: { label: "Processing", color: "var(--bg-brand)" },
  completed: { label: "Completed", color: "var(--bg-human)" },
  failed: { label: "Failed", color: "var(--bg-bot)" },
} as const;

export const AgentCard = () => {
  const agentStatus = useBattleStore(s => s.agentStatus);
  const queuePosition = useBattleStore(s => s.metrics.queuePosition);
  const stockLeft = useBattleStore(s => s.metrics.stockLeft);
  const reduced = useReducedMotionAware();

  const mv = useMotionValue(0);
  const spring = useSpring(mv, DROP);
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (queuePosition === null) return;
    if (prev.current !== null && queuePosition < prev.current && cardRef.current && !reduced) {
      cardRef.current.animate([{ transform: "scale(1)" }, { transform: "scale(1.04)" }, { transform: "scale(1)" }], {
        duration: 320,
        easing: "cubic-bezier(0.2, 0.9, 0.3, 1.2)",
      });
    }
    prev.current = queuePosition;
    mv.set(queuePosition);
  }, [queuePosition, reduced, mv]);

  useEffect(() => {
    const unsub = spring.on("change", v => {
      if (ref.current) ref.current.textContent = `#${Math.round(v)}`;
    });
    return () => unsub();
  }, [spring]);

  const display = useTransform(spring, v => `#${Math.round(v)}`);

  const lowStockPulse = stockLeft > 0 && stockLeft < 50 && queuePosition !== null && queuePosition < stockLeft * 1.5;

  return (
    <motion.div
      ref={cardRef}
      className={`relative flex flex-col gap-3 rounded-2xl border p-5 ${lowStockPulse ? "rim-pulse" : ""}`}
      style={{ borderColor: "var(--bg-rim)", backgroundColor: "var(--color-base-100)" }}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-base-content/50">Your Agent</span>
        <span
          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest"
          style={{ color: statusCopy[agentStatus].color }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: statusCopy[agentStatus].color,
              boxShadow: `0 0 6px ${statusCopy[agentStatus].color}`,
            }}
          />
          {statusCopy[agentStatus].label}
        </span>
      </div>

      <div className="flex items-end gap-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-base-content/50">Queue Position</span>
      </div>
      <div className="flex items-baseline gap-4">
        {queuePosition === null ? (
          <motion.span
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="font-mono text-5xl font-bold"
            style={{ color: "var(--color-base-content)" }}
          >
            #---
          </motion.span>
        ) : reduced ? (
          <span className="font-mono text-5xl font-bold" style={{ color: "var(--bg-brand)" }}>
            {`#${queuePosition}`}
          </span>
        ) : (
          <motion.span className="font-mono text-5xl font-bold" style={{ color: "var(--bg-brand)" }}>
            <motion.span ref={ref}>#{queuePosition}</motion.span>
            <motion.span style={{ display: "none" }}>{display}</motion.span>
          </motion.span>
        )}
        {queuePosition !== null && stockLeft > 0 && (
          <span className="font-mono text-xs text-base-content/50">of {stockLeft} left</span>
        )}
      </div>

      {agentStatus === "processing" && (
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-base-content/50">
          <span
            className="pulse-dot inline-block h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: "var(--bg-brand)" }}
          />
          Sequencing on-chain
        </div>
      )}
    </motion.div>
  );
};
