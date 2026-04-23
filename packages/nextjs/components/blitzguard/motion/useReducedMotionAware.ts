"use client";

import { useReducedMotion } from "motion/react";

export const useReducedMotionAware = () => {
  const reduced = useReducedMotion();
  return reduced === true;
};
