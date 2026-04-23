"use client";

import { ReactNode } from "react";
import { GLIDE } from "./springs";
import { useReducedMotionAware } from "./useReducedMotionAware";
import { motion } from "motion/react";

type Props = {
  children: ReactNode;
  direction: 1 | -1;
  stepKey: string;
};

export const ScreenTransition = ({ children, direction, stepKey }: Props) => {
  const reduced = useReducedMotionAware();

  if (reduced) {
    return (
      <motion.div
        key={stepKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.12 }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      key={stepKey}
      initial={{ x: 40 * direction, scale: 0.96, opacity: 0 }}
      animate={{ x: 0, scale: 1, opacity: 1, transition: GLIDE }}
      exit={{ x: -40 * direction, scale: 0.96, opacity: 0, transition: { duration: 0.32, ease: "easeInOut" } }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
};
