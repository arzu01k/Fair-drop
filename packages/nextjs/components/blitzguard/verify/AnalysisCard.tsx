"use client";

import { motion } from "motion/react";
import { AnimatedNumber } from "~~/components/blitzguard/motion/AnimatedNumber";
import { GLIDE } from "~~/components/blitzguard/motion/springs";
import { useReducedMotionAware } from "~~/components/blitzguard/motion/useReducedMotionAware";
import type { HumanScoreData } from "~~/types/blitzguard";

type Props = {
  data: HumanScoreData | null;
  loading: boolean;
};

const rowMeta: { key: keyof HumanScoreData["github"]; label: string; suffix?: string }[] = [
  { key: "repoCount", label: "Public Repos" },
  { key: "contributions", label: "Contributions (12mo)" },
  { key: "followers", label: "Followers" },
  { key: "accountAgeYears", label: "Account Age", suffix: " yrs" },
];

export const AnalysisCard = ({ data, loading }: Props) => {
  const reduced = useReducedMotionAware();

  return (
    <div
      className="w-full rounded-2xl border p-6 backdrop-blur-sm"
      style={{
        borderColor: "var(--bg-rim)",
        backgroundColor: "color-mix(in srgb, var(--color-base-100) 78%, transparent)",
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-widest text-base-content/60">AI Profile Analysis</span>
        <span
          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest"
          style={{ color: loading ? "var(--bg-brand)" : "var(--bg-human)" }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: loading ? "var(--bg-brand)" : "var(--bg-human)",
              boxShadow: loading ? "0 0 6px var(--bg-brand)" : "0 0 6px var(--bg-human)",
            }}
          />
          {loading ? "Analyzing" : "Complete"}
        </span>
      </div>

      {data ? (
        <>
          <div className="mb-4 flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full font-mono text-sm font-semibold"
              style={{
                backgroundColor: "var(--bg-glow-brand)",
                color: "var(--bg-brand)",
              }}
            >
              {data.github.username.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-sm">{data.github.username}</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-base-content/50">github.com</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {rowMeta.map((row, i) => (
              <motion.div
                key={row.key}
                initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, transition: { ...GLIDE, delay: reduced ? 0 : i * 0.06 } }}
                className="rounded-lg border p-3"
                style={{ borderColor: "var(--bg-rim)" }}
              >
                <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-base-content/50">
                  {row.label}
                </div>
                <div className="font-mono text-xl font-semibold">
                  <AnimatedNumber value={data.github[row.key] as number} delay={reduced ? 0 : 200 + i * 80} />
                  {row.suffix ?? ""}
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-3">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className="h-8 w-full rounded-md"
              style={{
                backgroundColor: "var(--color-base-200)",
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
