"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MagneticButton } from "~~/components/blitzguard/motion/MagneticButton";
import { GLIDE } from "~~/components/blitzguard/motion/springs";
import { useReducedMotionAware } from "~~/components/blitzguard/motion/useReducedMotionAware";
import { CountdownTimer } from "~~/components/blitzguard/sale/CountdownTimer";
import { LiveBattle } from "~~/components/blitzguard/sale/LiveBattle";
import { ProductCard } from "~~/components/blitzguard/sale/ProductCard";
import { useBattleStore } from "~~/services/store/battleStore";
import { COUNTDOWN_SECONDS } from "~~/utils/blitzguard/constants";

type Phase = "pre" | "live";

export const SaleStep = () => {
  const [phase, setPhase] = useState<Phase>("pre");
  const agentStatus = useBattleStore(s => s.agentStatus);
  const reduced = useReducedMotionAware();

  const activateAgent = () => {
    useBattleStore.getState().setAgentStatus("armed");
  };

  return (
    <AnimatePresence mode="wait">
      {phase === "pre" ? (
        <motion.div
          key="pre"
          initial={reduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.32 } }}
          className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-3xl flex-col items-center justify-center gap-8 px-6 py-10"
        >
          <div className="flex w-full flex-col items-center gap-2 text-center">
            <span className="font-mono text-xs uppercase tracking-[0.4em] text-base-content/50">Step 02 · Sale</span>
            <h2 className="font-display text-3xl font-bold md:text-4xl">Arm your agent. Outrun the bots.</h2>
          </div>

          <div className="w-full max-w-md">
            <ProductCard />
          </div>

          <CountdownTimer seconds={COUNTDOWN_SECONDS} onComplete={() => setPhase("live")} />

          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: GLIDE }}
            className="flex flex-col items-center gap-3"
          >
            <MagneticButton
              onClick={activateAgent}
              className="rounded-full px-10 py-5 font-display text-lg font-bold tracking-wider uppercase"
              style={{
                backgroundColor: "var(--bg-brand)",
                color: "white",
                boxShadow: "0 0 32px var(--bg-glow-brand)",
              }}
              pull={0.22}
            >
              <span className="inline-flex items-center gap-3">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: agentStatus === "armed" ? "var(--bg-human)" : "white",
                    boxShadow: `0 0 8px ${agentStatus === "armed" ? "var(--bg-human)" : "white"}`,
                  }}
                />
                {agentStatus === "armed" ? "Agent Armed" : "Activate my agent"}
              </span>
            </MagneticButton>
            <p className="max-w-md text-center text-xs text-base-content/50">
              When the drop begins, your verified agent joins the fair queue automatically.
            </p>
          </motion.div>

          <button
            type="button"
            onClick={() => setPhase("live")}
            className="font-mono text-[10px] uppercase tracking-widest text-base-content/40 underline underline-offset-4 hover:text-base-content/70"
          >
            skip countdown (demo)
          </button>
        </motion.div>
      ) : (
        <motion.div
          key="live"
          initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1, transition: GLIDE }}
        >
          <LiveBattle />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
