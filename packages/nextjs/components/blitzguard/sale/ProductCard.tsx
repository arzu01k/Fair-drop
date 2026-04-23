"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { FLOAT } from "~~/components/blitzguard/motion/springs";
import { useReducedMotionAware } from "~~/components/blitzguard/motion/useReducedMotionAware";
import { PRODUCT } from "~~/utils/blitzguard/constants";
import { formatUsd } from "~~/utils/blitzguard/format";

type Props = {
  compact?: boolean;
  stockLeft?: number;
};

export const ProductCard = ({ compact = false, stockLeft }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sRx = useSpring(rx, FLOAT);
  const sRy = useSpring(ry, FLOAT);
  const reduced = useReducedMotionAware();

  const onMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== "mouse" || !ref.current || compact) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 16);
    rx.set(-py * 12);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  const tiltY = useTransform(sRy, v => v);
  const tiltX = useTransform(sRx, v => v);

  return (
    <motion.div
      ref={ref}
      layoutId="product-card"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{
        rotateX: reduced ? 0 : tiltX,
        rotateY: reduced ? 0 : tiltY,
        transformStyle: "preserve-3d",
        perspective: 900,
        borderColor: "var(--bg-rim)",
      }}
      className={`relative flex w-full flex-col overflow-hidden rounded-2xl border bg-base-100 ${
        compact ? "gap-2 p-4" : "gap-4 p-6"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-base-content/50">Limited Drop</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--bg-brand)" }}>
          {PRODUCT.edition}
        </span>
      </div>

      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-xl ${compact ? "h-20" : "h-40"}`}
        style={{ backgroundColor: "var(--color-base-200)" }}
      >
        <Image src="/nike_air_max.png" alt={PRODUCT.name} fill className="object-cover" />
      </div>

      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <span className={`font-display font-bold ${compact ? "text-lg" : "text-2xl"}`}>{PRODUCT.name}</span>
          <span className="font-mono text-xs text-base-content/50">{PRODUCT.totalStock} pairs · worldwide</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-mono text-[10px] uppercase tracking-widest text-base-content/50">Price</span>
          <span className={`font-mono font-semibold ${compact ? "text-base" : "text-xl"}`}>
            {formatUsd(PRODUCT.priceUsd)}
          </span>
        </div>
      </div>

      {stockLeft !== undefined && (
        <div className="mt-1 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest">
          <span className="text-base-content/50">Stock</span>
          <span style={{ color: stockLeft < 20 ? "var(--bg-bot)" : "var(--bg-human)" }}>
            {stockLeft} / {PRODUCT.totalStock}
          </span>
        </div>
      )}
    </motion.div>
  );
};
