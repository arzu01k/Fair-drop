"use client";

import { AnimatePresence, motion } from "motion/react";
import { useReducedMotionAware } from "~~/components/blitzguard/motion/useReducedMotionAware";
import { useBattleStore } from "~~/services/store/battleStore";
import type { BattleEvent } from "~~/types/blitzguard";
import { shortAddress } from "~~/utils/blitzguard/format";

const MAX_VISIBLE = 12;

const line = (e: BattleEvent) => {
  switch (e.kind) {
    case "bot_blocked":
      return { wallet: e.wallet, label: `BOT · ${e.reason.toUpperCase()}`, tag: "REJECTED" as const };
    case "human_accepted":
      return {
        wallet: e.wallet,
        label: e.isYou ? "YOU · HUMAN" : `HUMAN · #${e.queuePosition}`,
        tag: "ACCEPTED" as const,
        isYou: e.isYou,
      };
    case "purchase_complete":
      return {
        wallet: e.wallet,
        label: e.isYou ? "YOU · PURCHASED" : "HUMAN · PURCHASED",
        tag: "COMPLETE" as const,
        isYou: e.isYou,
      };
    default:
      return null;
  }
};

export const LiveTxStream = () => {
  const events = useBattleStore(s => s.events);
  const reduced = useReducedMotionAware();

  const rendered = events
    .filter(e => e.kind !== "new_request")
    .slice(-MAX_VISIBLE)
    .reverse();

  return (
    <div
      className="relative flex h-[360px] w-full flex-col gap-1 overflow-hidden rounded-2xl border p-3"
      style={{ borderColor: "var(--bg-rim)", backgroundColor: "var(--color-base-100)" }}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-base-content/50">Live TX Stream</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-base-content/30">
          {events.length} events
        </span>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          {rendered.map(e => {
            const meta = line(e);
            if (!meta) return null;
            const isBot = e.kind === "bot_blocked";
            const color = isBot ? "var(--bg-bot)" : meta.isYou ? "var(--bg-brand)" : "var(--bg-human)";
            return (
              <motion.div
                key={e.id}
                layout
                initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
                animate={
                  isBot
                    ? reduced
                      ? { opacity: 1 }
                      : {
                          opacity: [1, 1, 0],
                          x: [0, 8, -4, 360],
                          transition: { duration: 0.52, times: [0, 0.2, 0.4, 1], ease: "easeIn" },
                        }
                    : {
                        opacity: 1,
                        y: 0,
                        x: 0,
                        boxShadow: meta.isYou
                          ? `0 0 0 1px ${color}, 0 0 18px var(--bg-glow-brand)`
                          : reduced
                            ? "none"
                            : [`0 0 0 transparent`, `0 0 12px ${color}`, `0 0 0 transparent`],
                        transition: { duration: reduced ? 0 : 0.52 },
                      }
                }
                exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
                className={`flex items-center justify-between rounded-md border px-3 py-1.5 font-mono text-xs ${
                  meta.isYou ? "breathe" : ""
                }`}
                style={{
                  borderColor: meta.isYou ? color : "transparent",
                  color,
                  backgroundColor: meta.isYou ? "var(--bg-glow-brand)" : "transparent",
                }}
              >
                <span className="truncate">
                  {shortAddress(meta.wallet)} <span className="text-base-content/40">·</span> {meta.label}
                </span>
                <span className="ml-3 shrink-0 text-[10px] uppercase tracking-widest">{meta.tag}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
