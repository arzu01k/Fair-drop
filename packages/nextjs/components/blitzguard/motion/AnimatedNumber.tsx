"use client";

import { useEffect, useRef } from "react";
import { COUNTER } from "./springs";
import { useReducedMotionAware } from "./useReducedMotionAware";
import { useMotionValue, useSpring } from "motion/react";
import { formatCount } from "~~/utils/blitzguard/format";

type Props = {
  value: number;
  format?: (v: number) => string;
  className?: string;
  delay?: number;
};

export const AnimatedNumber = ({ value, format = formatCount, className, delay = 0 }: Props) => {
  const ref = useRef<HTMLSpanElement>(null);
  const mv = useMotionValue(0);
  const spring = useSpring(mv, COUNTER);
  const reduced = useReducedMotionAware();

  useEffect(() => {
    const tid = window.setTimeout(() => {
      if (reduced) {
        mv.set(value);
        spring.set(value);
      } else {
        mv.set(value);
      }
    }, delay);
    return () => window.clearTimeout(tid);
  }, [value, delay, reduced, mv, spring]);

  useEffect(() => {
    const target = reduced ? mv : spring;
    const unsub = target.on("change", v => {
      if (ref.current) ref.current.textContent = format(v);
    });
    if (ref.current) ref.current.textContent = format(target.get());
    return () => unsub();
  }, [spring, mv, format, reduced]);

  return (
    <span ref={ref} className={className}>
      {format(0)}
    </span>
  );
};
