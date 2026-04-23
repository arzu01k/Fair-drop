"use client";

import { ReactNode, useRef } from "react";
import { MAGNETIC_SPRING, SNAP } from "./springs";
import { useReducedMotionAware } from "./useReducedMotionAware";
import { motion, useMotionValue, useSpring } from "motion/react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  radius?: number;
  pull?: number;
  labelPullMultiplier?: number;
  disabled?: boolean;
};

export const MagneticButton = ({
  children,
  onClick,
  className = "",
  style,
  radius = 120,
  pull = 0.22,
  labelPullMultiplier = 0.35,
  disabled = false,
}: Props) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, MAGNETIC_SPRING);
  const springY = useSpring(y, MAGNETIC_SPRING);
  const labelX = useSpring(x, MAGNETIC_SPRING);
  const labelY = useSpring(y, MAGNETIC_SPRING);
  const reduced = useReducedMotionAware();

  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (reduced || disabled || e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > radius) {
      x.set(0);
      y.set(0);
    } else {
      x.set(dx * pull);
      y.set(dy * pull);
    }
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      disabled={disabled}
      onClick={onClick}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      whileTap={reduced ? undefined : { scale: 0.96, transition: SNAP }}
      style={{ ...style, x: springX, y: springY }}
      className={className}
    >
      <motion.span
        style={{
          display: "inline-block",
          x: reduced ? 0 : labelX,
          y: reduced ? 0 : labelY,
          scale: labelPullMultiplier !== 0 ? 1 : 1,
        }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
};
