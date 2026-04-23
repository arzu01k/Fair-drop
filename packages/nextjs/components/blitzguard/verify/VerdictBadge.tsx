"use client";

import { AnimatePresence, motion } from "motion/react";
import { STAMP } from "~~/components/blitzguard/motion/springs";
import { useReducedMotionAware } from "~~/components/blitzguard/motion/useReducedMotionAware";

type Props = {
  verdict: "human" | "suspicious" | "bot" | null;
};

const copy = {
  human: { label: "HUMAN VERIFIED", color: "var(--bg-human)", glow: "var(--bg-glow-human)" },
  suspicious: { label: "SUSPICIOUS", color: "var(--bg-bot)", glow: "var(--bg-glow-bot)" },
  bot: { label: "LIKELY BOT", color: "var(--bg-bot)", glow: "var(--bg-glow-bot)" },
} as const;

export const VerdictBadge = ({ verdict }: Props) => {
  const reduced = useReducedMotionAware();

  return (
    <AnimatePresence>
      {verdict && (
        <motion.div
          key={verdict}
          initial={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6, rotate: -4 }}
          animate={{ opacity: 1, scale: 1, rotate: 0, transition: reduced ? { duration: 0.1 } : STAMP }}
          exit={{ opacity: 0 }}
          className="relative inline-flex items-center gap-2 rounded-full border px-5 py-2 font-mono text-sm font-semibold tracking-widest uppercase"
          style={{
            borderColor: copy[verdict].color,
            color: copy[verdict].color,
            boxShadow: `0 0 24px ${copy[verdict].glow}`,
          }}
        >
          <motion.span
            initial={reduced ? { opacity: 0 } : { opacity: 0.12 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 rounded-full bg-white"
            aria-hidden
          />
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: copy[verdict].color, boxShadow: `0 0 6px ${copy[verdict].color}` }}
          />
          {copy[verdict].label}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
