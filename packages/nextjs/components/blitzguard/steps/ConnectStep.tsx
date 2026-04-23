"use client";

import { useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "motion/react";
import { useAccount } from "wagmi";
import { WalletPill } from "~~/components/blitzguard/motion/WalletPill";
import { GLIDE, SNAP } from "~~/components/blitzguard/motion/springs";
import { useReducedMotionAware } from "~~/components/blitzguard/motion/useReducedMotionAware";
import { useFlowStore } from "~~/services/store/flowStore";
import { BRAND } from "~~/utils/blitzguard/constants";

const WORD = BRAND.name.split("");

export const ConnectStep = () => {
  const { address, isConnected } = useAccount();
  const goTo = useFlowStore(s => s.goTo);
  const reduced = useReducedMotionAware();

  useEffect(() => {
    if (!isConnected) return;
    const tid = window.setTimeout(() => goTo("verify"), 900);
    return () => window.clearTimeout(tid);
  }, [isConnected, goTo]);

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center overflow-hidden px-6">
      <div className="pointer-events-none absolute inset-0 bg-pixel-grid opacity-70" />
      {!reduced && <span className="pointer-events-none scanline" aria-hidden />}

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center gap-10 text-center">
        <div className="flex flex-col items-center gap-3">
          <span className="font-mono text-xs tracking-[0.4em] uppercase" style={{ color: "var(--bg-brand)" }}>
            Monad Testnet · Chain 10143
          </span>
          <h1
            className="flex flex-wrap justify-center font-display text-5xl font-bold tracking-tight md:text-7xl"
            aria-label={BRAND.name}
          >
            {WORD.map((ch, i) => (
              <motion.span
                key={`${ch}-${i}`}
                initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...GLIDE, delay: reduced ? 0 : i * 0.022 }}
                style={{ display: "inline-block", whiteSpace: "pre" }}
              >
                {ch === " " ? " " : ch}
              </motion.span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduced ? 0 : 0.55, duration: 0.3 }}
            className="max-w-md text-lg text-base-content/70"
          >
            {BRAND.tagline}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduced ? 0 : 0.7, duration: 0.3 }}
            className="max-w-md text-sm text-base-content/50"
          >
            {BRAND.subline}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduced ? 0 : 0.9, ...GLIDE }}
          className="flex flex-col items-center gap-4"
        >
          {isConnected && address ? (
            <div className="flex flex-col items-center gap-3">
              <WalletPill address={address} />
              <span className="font-mono text-xs text-base-content/60">Verifying connection…</span>
            </div>
          ) : (
            <ConnectButton.Custom>
              {({ openConnectModal, mounted }) => (
                <motion.button
                  type="button"
                  onClick={openConnectModal}
                  disabled={!mounted}
                  whileTap={reduced ? undefined : { scale: 0.97, transition: SNAP }}
                  className="group relative inline-flex items-center gap-3 rounded-full border px-8 py-4 text-base font-medium transition-colors"
                  style={{
                    borderColor: "var(--bg-rim)",
                    backgroundColor: "var(--color-base-100)",
                    color: "var(--color-base-content)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "var(--bg-brand)";
                    e.currentTarget.style.boxShadow = "0 0 0 1px var(--bg-brand), 0 0 24px var(--bg-glow-brand)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "var(--bg-rim)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: "var(--bg-brand)", boxShadow: "0 0 8px var(--bg-brand)" }}
                  />
                  Connect Wallet
                </motion.button>
              )}
            </ConnectButton.Custom>
          )}
          <span className="font-mono text-xs text-base-content/40">Powered by Monad · 10,000+ TPS</span>
        </motion.div>
      </div>
    </div>
  );
};
