"use client";

import { motion } from "motion/react";
import { AnimatedNumber } from "~~/components/blitzguard/motion/AnimatedNumber";
import { GLIDE } from "~~/components/blitzguard/motion/springs";
import { useReducedMotionAware } from "~~/components/blitzguard/motion/useReducedMotionAware";
import type { ResultSummary } from "~~/types/blitzguard";
import { formatCount } from "~~/utils/blitzguard/format";

type Props = {
  summary: ResultSummary;
};

export const BattleSummary = ({ summary }: Props) => {
  const reduced = useReducedMotionAware();
  const tiles = [
    { label: "Total Requests", value: summary.totalRequests, accent: "var(--color-base-content)" },
    { label: "Bots Blocked", value: summary.botsBlocked, accent: "var(--bg-bot)" },
    { label: "Humans Served", value: summary.humansProcessed, accent: "var(--bg-human)" },
    { label: "Peak TPS", value: summary.peakTps, accent: "var(--bg-brand)" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {tiles.map((t, i) => (
        <motion.div
          key={t.label}
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { ...GLIDE, delay: reduced ? 0 : 0.22 + i * 0.08 },
          }}
          className="flex flex-col gap-2 rounded-xl border p-4"
          style={{ borderColor: "var(--bg-rim)", backgroundColor: "var(--color-base-100)" }}
        >
          <span className="font-mono text-[10px] uppercase tracking-widest text-base-content/50">{t.label}</span>
          <span className="font-mono text-2xl font-bold" style={{ color: t.accent }}>
            <AnimatedNumber value={t.value} format={formatCount} delay={reduced ? 0 : 240 + i * 80} />
          </span>
        </motion.div>
      ))}
    </div>
  );
};
