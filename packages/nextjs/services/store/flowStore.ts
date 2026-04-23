import { create } from "zustand";
import type { FlowStep, HumanScoreData } from "~~/types/blitzguard";

type FlowState = {
  step: FlowStep;
  direction: 1 | -1;
  humanScore: HumanScoreData | null;
  mockMode: boolean;
  goTo: (step: FlowStep) => void;
  setHumanScore: (data: HumanScoreData | null) => void;
  setMockMode: (on: boolean) => void;
  reset: () => void;
};

const STEP_ORDER: FlowStep[] = ["connect", "verify", "sale", "result"];

export const useFlowStore = create<FlowState>(set => ({
  step: "connect",
  direction: 1,
  humanScore: null,
  mockMode: process.env.NEXT_PUBLIC_BLITZGUARD_MOCK !== "false",
  goTo: next =>
    set(prev => {
      const dir: 1 | -1 = STEP_ORDER.indexOf(next) >= STEP_ORDER.indexOf(prev.step) ? 1 : -1;
      return { step: next, direction: dir };
    }),
  setHumanScore: data => set({ humanScore: data }),
  setMockMode: on => set({ mockMode: on }),
  reset: () => set({ step: "connect", direction: 1, humanScore: null }),
}));
