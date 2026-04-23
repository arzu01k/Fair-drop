"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useReducedMotionAware } from "~~/components/blitzguard/motion/useReducedMotionAware";

type Props = {
  score: number;
  active: boolean;
};

export const HumanScoreBar = ({ score, active }: Props) => {
  const reduced = useReducedMotionAware();
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 80, damping: 20 });
  const width = useTransform(spring, v => `${Math.min(100, Math.max(0, v))}%`);
  const fillColor = useTransform(
    spring,
    [0, 40, 70, 100],
    ["var(--bg-bot)", "var(--bg-bot)", "var(--bg-human)", "var(--bg-human)"],
  );
  const boxShadow = useTransform(spring, v => {
    const clamped = Math.max(0, Math.min(100, v));
    const blur = clamped < 70 ? (clamped / 70) * 12 : 12 + ((clamped - 70) / 30) * 10;
    const alpha = clamped < 70 ? (clamped / 70) * 0.25 : 0.25 + ((clamped - 70) / 30) * 0.25;
    const color = clamped >= 70 ? "var(--bg-human)" : "var(--bg-bot)";
    return `0 0 ${blur}px color-mix(in srgb, ${color} ${alpha * 100}%, transparent)`;
  });

  useEffect(() => {
    if (!active) return;
    mv.set(reduced ? score : score);
    if (reduced) spring.jump(score);
  }, [active, score, reduced, mv, spring]);

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-baseline justify-between font-mono text-xs uppercase tracking-widest text-base-content/60">
        <span>Human Score</span>
        <motion.span style={{ color: fillColor }} className="font-semibold">
          <ScoreReadout spring={spring} />
        </motion.span>
      </div>
      <div
        className="relative h-3 w-full overflow-hidden rounded-full border"
        style={{ borderColor: "var(--bg-rim)", backgroundColor: "var(--color-base-200)" }}
      >
        <motion.div className="h-full rounded-full" style={{ width, backgroundColor: fillColor, boxShadow }} />
      </div>
    </div>
  );
};

const ScoreReadout = ({ spring }: { spring: ReturnType<typeof useSpring> }) => {
  const display = useTransform(spring, v => `${Math.round(v)}/100`);
  return <motion.span>{display}</motion.span>;
};
