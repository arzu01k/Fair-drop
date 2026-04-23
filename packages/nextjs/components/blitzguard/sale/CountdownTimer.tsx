"use client";

import { useEffect, useState } from "react";
import { FlipDigit } from "~~/components/blitzguard/motion/FlipDigit";

type Props = {
  seconds: number;
  onComplete?: () => void;
};

export const CountdownTimer = ({ seconds, onComplete }: Props) => {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) {
      onComplete?.();
      return;
    }
    const t = window.setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => window.clearTimeout(t);
  }, [remaining, onComplete]);

  const mm = Math.floor(remaining / 60)
    .toString()
    .padStart(2, "0");
  const ss = (remaining % 60).toString().padStart(2, "0");
  const urgent = remaining <= 10;

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="font-mono text-xs uppercase tracking-[0.4em] text-base-content/50">Sale starts in</span>
      <div className="flex items-center gap-2">
        <FlipDigit value={mm[0]} urgent={urgent} />
        <FlipDigit value={mm[1]} urgent={urgent} />
        <span className="mx-1 font-mono text-4xl font-bold text-base-content/40">:</span>
        <FlipDigit value={ss[0]} urgent={urgent} />
        <FlipDigit value={ss[1]} urgent={urgent} />
      </div>
    </div>
  );
};
