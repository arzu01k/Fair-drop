"use client";

import { Confetti } from "./Confetti";
import { motion } from "motion/react";
import { GLIDE } from "~~/components/blitzguard/motion/springs";
import { useReducedMotionAware } from "~~/components/blitzguard/motion/useReducedMotionAware";
import type { ResultSummary } from "~~/types/blitzguard";

type Props = {
  summary: ResultSummary;
};

export const ResultHero = ({ summary }: Props) => {
  const reduced = useReducedMotionAware();
  const won = summary.outcome === "won";

  return (
    <motion.div
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 40, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1, transition: GLIDE }}
      className="relative w-full overflow-hidden rounded-3xl border p-10 text-center"
      style={{
        borderColor: won ? "var(--bg-human)" : "var(--bg-bot)",
        backgroundColor: "var(--color-base-100)",
        boxShadow: won ? "0 0 32px var(--bg-glow-brand)" : "0 0 32px var(--bg-glow-bot)",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6, transition: { delay: reduced ? 0 : 0.08, duration: 0.4 } }}
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${
            won ? "var(--bg-glow-brand)" : "var(--bg-glow-bot)"
          }, transparent 70%)`,
        }}
        aria-hidden
      />

      <Confetti active={won} />

      <div className="relative z-10 flex flex-col items-center gap-4">
        <span
          className="font-mono text-[10px] uppercase tracking-[0.4em]"
          style={{ color: won ? "var(--bg-human)" : "var(--bg-bot)" }}
        >
          {won ? "Purchase successful" : "Sold out"}
        </span>
        <h2 className="font-display text-5xl font-bold md:text-6xl">
          {won ? "You beat the bots." : "Better luck next drop."}
        </h2>
        <p className="max-w-lg text-base-content/60">
          {won
            ? `Your verified agent cleared the fair queue at position #${summary.userQueuePosition}. Nike Air Max Limited reserved in your wallet.`
            : "The drop closed before your agent reached the front of the queue."}
        </p>
      </div>
    </motion.div>
  );
};
