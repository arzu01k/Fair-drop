import { create } from "zustand";
import type { ResultSummary } from "~~/types/blitzguard";

type ResultState = {
  summary: ResultSummary | null;
  setSummary: (s: ResultSummary | null) => void;
  reset: () => void;
};

export const useResultStore = create<ResultState>(set => ({
  summary: null,
  setSummary: s => set({ summary: s }),
  reset: () => set({ summary: null }),
}));
