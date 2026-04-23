"use client";

import { motion } from "motion/react";
import { MagneticButton } from "~~/components/blitzguard/motion/MagneticButton";
import { GLIDE } from "~~/components/blitzguard/motion/springs";
import { useReducedMotionAware } from "~~/components/blitzguard/motion/useReducedMotionAware";
import { useBattleStore } from "~~/services/store/battleStore";
import { useFlowStore } from "~~/services/store/flowStore";
import { useResultStore } from "~~/services/store/resultStore";
import type { ResultSummary } from "~~/types/blitzguard";
import { MONAD_EXPLORER_BASE } from "~~/utils/blitzguard/constants";
import { shortHash } from "~~/utils/blitzguard/format";

type Props = {
  summary: ResultSummary;
};

export const ShareRow = ({ summary }: Props) => {
  const reduced = useReducedMotionAware();
  const reset = useFlowStore(s => s.reset);
  const resetBattle = useBattleStore(s => s.reset);
  const resetResult = useResultStore(s => s.reset);

  const tweet = encodeURIComponent(
    `I beat the bots with BlitzGuard on @monad_xyz.\n${summary.botsBlocked.toLocaleString()} bots blocked. Humans win, not bots.`,
  );

  const replay = () => {
    resetBattle();
    resetResult();
    reset();
  };

  return (
    <motion.div
      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0, transition: { ...GLIDE, delay: reduced ? 0 : 0.4 } }}
      className="flex flex-col items-center gap-3 md:flex-row md:justify-center"
    >
      {summary.txHash && (
        <MagneticButton
          radius={80}
          pull={0.18}
          onClick={() => window.open(`${MONAD_EXPLORER_BASE}/tx/${summary.txHash}`, "_blank")}
          className="rounded-full border px-5 py-2.5 font-mono text-xs uppercase tracking-widest"
          style={{ borderColor: "var(--bg-rim)", color: "var(--color-base-content)" }}
        >
          View tx {shortHash(summary.txHash)}
        </MagneticButton>
      )}

      <motion.a
        initial={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1, transition: { delay: reduced ? 0 : 0.6, duration: 0.2 } }}
        href={`https://twitter.com/intent/tweet?text=${tweet}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-xs uppercase tracking-widest"
        style={{
          backgroundColor: "var(--bg-brand)",
          color: "white",
          boxShadow: "0 0 24px var(--bg-glow-brand)",
        }}
      >
        Share the win
      </motion.a>

      <button
        type="button"
        onClick={replay}
        className="font-mono text-[10px] uppercase tracking-widest text-base-content/40 underline underline-offset-4 hover:text-base-content/70"
      >
        run demo again
      </button>
    </motion.div>
  );
};
