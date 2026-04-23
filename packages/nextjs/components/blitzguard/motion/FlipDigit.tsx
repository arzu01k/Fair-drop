"use client";

import { useReducedMotionAware } from "./useReducedMotionAware";
import { AnimatePresence, motion } from "motion/react";

type Props = {
  value: string;
  urgent?: boolean;
};

export const FlipDigit = ({ value, urgent = false }: Props) => {
  const reduced = useReducedMotionAware();

  if (reduced) {
    return (
      <span
        className="inline-flex h-16 w-12 items-center justify-center rounded-md bg-base-300 font-mono text-5xl font-semibold"
        style={urgent ? { color: "var(--bg-bot)" } : undefined}
      >
        {value}
      </span>
    );
  }

  return (
    <span
      className="relative inline-flex h-16 w-12 items-center justify-center overflow-hidden rounded-md bg-base-300 font-mono text-5xl font-semibold"
      style={{ perspective: 600, transformStyle: "preserve-3d", color: urgent ? "var(--bg-bot)" : undefined }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: -90, opacity: 0 }}
          transition={{ duration: 0.24, ease: [0.45, 0, 0.55, 1] }}
          style={{ position: "absolute", transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};
