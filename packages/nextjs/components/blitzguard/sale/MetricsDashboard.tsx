"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { COUNTER } from "~~/components/blitzguard/motion/springs";
import { useReducedMotionAware } from "~~/components/blitzguard/motion/useReducedMotionAware";
import { useBattleStore } from "~~/services/store/battleStore";
import { formatCount, formatTps } from "~~/utils/blitzguard/format";

type TileDef = {
  label: string;
  selector: (m: ReturnType<typeof useBattleStore.getState>["metrics"]) => number;
  format: (n: number) => string;
  accent?: "human" | "bot" | "brand";
};

const tiles: TileDef[] = [
  { label: "Total Requests", selector: m => m.totalRequests, format: formatCount },
  { label: "Bots Blocked", selector: m => m.botsBlocked, format: formatCount, accent: "bot" },
  { label: "Humans Processed", selector: m => m.humansProcessed, format: formatCount, accent: "human" },
  { label: "Monad TPS", selector: m => m.tps, format: formatTps, accent: "brand" },
  { label: "Stock Left", selector: m => m.stockLeft, format: formatCount },
];

const accentColor: Record<NonNullable<TileDef["accent"]>, string> = {
  human: "var(--bg-human)",
  bot: "var(--bg-bot)",
  brand: "var(--bg-brand)",
};

const Tile = ({ def }: { def: TileDef }) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const tileRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionAware();
  const mv = useMotionValue(0);
  const spring = useSpring(mv, COUNTER);
  const value = useBattleStore(s => def.selector(s.metrics));
  const prev = useRef<number>(0);

  useEffect(() => {
    mv.set(value);
    if (reduced) {
      if (textRef.current) textRef.current.textContent = def.format(value);
    }
    if (value !== prev.current && tileRef.current && !reduced) {
      tileRef.current.classList.remove("tile-flash");
      void tileRef.current.offsetWidth;
      tileRef.current.classList.add("tile-flash");
    }
    prev.current = value;
  }, [value, mv, def, reduced]);

  useEffect(() => {
    if (reduced) return;
    const unsub = spring.on("change", v => {
      if (textRef.current) textRef.current.textContent = def.format(v);
    });
    if (textRef.current) textRef.current.textContent = def.format(spring.get());
    return () => unsub();
  }, [spring, def, reduced]);

  return (
    <div
      ref={tileRef}
      className="flex flex-col justify-between rounded-xl border bg-base-100 p-4 transition-colors"
      style={{ borderColor: "var(--bg-rim)", minWidth: 160 }}
    >
      <span className="font-mono text-[10px] uppercase tracking-widest text-base-content/50">{def.label}</span>
      <span
        ref={textRef}
        className="mt-2 font-mono text-2xl font-bold"
        style={{ color: def.accent ? accentColor[def.accent] : "var(--color-base-content)" }}
      >
        {def.format(0)}
      </span>
    </div>
  );
};

export const MetricsDashboard = () => {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
      {tiles.map(def => (
        <Tile key={def.label} def={def} />
      ))}
    </div>
  );
};

export const TpsPulseBackground = () => {
  const tps = useBattleStore(s => s.metrics.tps);
  const reduced = useReducedMotionAware();
  const duration = Math.max(280, 1200 - (tps / 10000) * 920);

  if (reduced) {
    return (
      <div className="pointer-events-none absolute inset-0 bg-dot-grid-dense" style={{ opacity: 0.04 }} aria-hidden />
    );
  }

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-dot-grid-dense"
      animate={{ opacity: [0.04, 0.1, 0.04] }}
      transition={{ duration: duration / 1000, repeat: Infinity, ease: "easeInOut" }}
    />
  );
};
