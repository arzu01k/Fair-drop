"use client";

import { BattleSummary } from "~~/components/blitzguard/result/BattleSummary";
import { ResultHero } from "~~/components/blitzguard/result/ResultHero";
import { ShareRow } from "~~/components/blitzguard/result/ShareRow";
import { useResultStore } from "~~/services/store/resultStore";

export const ResultStep = () => {
  const summary = useResultStore(s => s.summary);

  if (!summary) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center font-mono text-sm text-base-content/50">
        Awaiting result…
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-3xl flex-col items-center justify-center gap-8 px-6 py-10">
      <ResultHero summary={summary} />
      <BattleSummary summary={summary} />
      <ShareRow summary={summary} />
    </div>
  );
};
