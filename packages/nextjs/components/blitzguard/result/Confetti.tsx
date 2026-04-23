"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { useReducedMotionAware } from "~~/components/blitzguard/motion/useReducedMotionAware";

const COLORS = ["#836ef9", "#22e584"] as const;

const makePieces = (count: number) => {
  const pieces = [] as Array<{
    id: number;
    color: string;
    angle: number;
    velocity: number;
    size: number;
    rotate: number;
    duration: number;
    shape: "square" | "circle";
  }>;
  for (let i = 0; i < count; i++) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * (Math.PI * 0.7);
    const velocity = 200 + Math.random() * 280;
    pieces.push({
      id: i,
      color: COLORS[i % 2],
      angle,
      velocity,
      size: 6 + Math.random() * 6,
      rotate: Math.random() * 360,
      duration: 1.6 + Math.random() * 1.2,
      shape: Math.random() > 0.5 ? "square" : "circle",
    });
  }
  return pieces;
};

export const Confetti = ({ active, count = 80 }: { active: boolean; count?: number }) => {
  const reduced = useReducedMotionAware();
  const pieces = useMemo(() => makePieces(count), [count]);

  if (!active) return null;

  if (reduced) {
    return (
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
        <svg width="180" height="180" viewBox="0 0 180 180" style={{ opacity: 0.4 }}>
          {[...Array(12)].map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const x = 90 + Math.cos(a) * 60;
            const y = 90 + Math.sin(a) * 60;
            return (
              <line
                key={i}
                x1={90}
                y1={90}
                x2={x}
                y2={y}
                stroke={COLORS[i % 2]}
                strokeWidth={3}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden" aria-hidden>
      <div className="relative h-0 w-0">
        {pieces.map(p => {
          const targetX = Math.cos(p.angle) * p.velocity;
          const targetY = Math.sin(p.angle) * p.velocity + 260;
          return (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
              animate={{
                x: targetX,
                y: targetY,
                opacity: 0,
                rotate: p.rotate + 360,
              }}
              transition={{
                duration: p.duration,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                position: "absolute",
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: p.shape === "circle" ? "50%" : 2,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
