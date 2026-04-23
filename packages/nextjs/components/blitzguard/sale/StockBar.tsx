"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { PRODUCT } from "~~/utils/blitzguard/constants";

type Props = {
  stockLeft: number;
};

export const StockBar = ({ stockLeft }: Props) => {
  const mv = useMotionValue(PRODUCT.totalStock);
  const spring = useSpring(mv, { stiffness: 160, damping: 26 });
  const widthPct = useTransform(spring, v => `${(v / PRODUCT.totalStock) * 100}%`);
  const color = useTransform(
    spring,
    [0, 10, 50, 100],
    ["var(--bg-bot)", "var(--bg-bot)", "var(--bg-brand)", "var(--bg-human)"],
  );

  useEffect(() => {
    mv.set(stockLeft);
  }, [stockLeft, mv]);

  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: "var(--color-base-300)" }}>
      <motion.div className="h-full" style={{ width: widthPct, backgroundColor: color }} />
    </div>
  );
};
