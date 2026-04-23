"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useAccount } from "wagmi";
import { GLIDE, SNAP } from "~~/components/blitzguard/motion/springs";
import { useReducedMotionAware } from "~~/components/blitzguard/motion/useReducedMotionAware";
import { AnalysisCard } from "~~/components/blitzguard/verify/AnalysisCard";
import { HumanScoreBar } from "~~/components/blitzguard/verify/HumanScoreBar";
import { VerdictBadge } from "~~/components/blitzguard/verify/VerdictBadge";
import { ApiError, apiAnalyzeGithub, apiRegisterVerification } from "~~/services/api/client";
import { useFlowStore } from "~~/services/store/flowStore";
import type { HumanScoreData } from "~~/types/blitzguard";
import { MOCK_TX_HASH, MONAD_EXPLORER_BASE } from "~~/utils/blitzguard/constants";
import { shortHash } from "~~/utils/blitzguard/format";

const LOCAL_MOCK_SCORE: HumanScoreData = {
  score: 92,
  github: {
    username: "arzu01k",
    repoCount: 47,
    contributions: 34,
    followers: 156,
    accountAgeYears: 4,
  },
  checks: [
    { label: "GitHub profile fetched (offline mock)", passed: true },
    { label: "Contribution velocity normal", passed: true },
    { label: "Account age > 1 year", passed: true },
    { label: "Bio / metadata present", passed: true },
  ],
  verdict: "human",
  txHash: MOCK_TX_HASH,
};

type Phase = "idle" | "analyzing" | "scoring" | "verified" | "not_found";

export const VerifyStep = () => {
  const { address } = useAccount();
  const goTo = useFlowStore(s => s.goTo);
  const setHumanScore = useFlowStore(s => s.setHumanScore);
  const mockMode = useFlowStore(s => s.mockMode);
  const reduced = useReducedMotionAware();

  const [username, setUsername] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [data, setData] = useState<HumanScoreData | null>(null);

  const runVerify = async () => {
    const handle = username.trim();
    if (!handle && !mockMode) return;
    setPhase("analyzing");
    setData(null);

    // Mock mode: use the local scripted score without touching the network.
    if (mockMode) {
      window.setTimeout(
        () => {
          setData(LOCAL_MOCK_SCORE);
          setPhase("scoring");
          window.setTimeout(
            () => {
              const withTx = { ...LOCAL_MOCK_SCORE, txHash: MOCK_TX_HASH };
              setData(withTx);
              setPhase("verified");
              setHumanScore(withTx);
            },
            reduced ? 200 : 1200,
          );
        },
        reduced ? 200 : 700,
      );
      return;
    }

    try {
      const result = await apiAnalyzeGithub(handle, address);
      setData(result);
      setPhase("scoring");

      // Fire and forget: register on-chain record. Result tx hash updates UI.
      try {
        const reg = await apiRegisterVerification({
          wallet: address ?? "0x0000000000000000000000000000000000000000",
          score: result.score,
          github: handle,
        });
        const withTx = { ...result, txHash: reg.txHash };
        window.setTimeout(
          () => {
            setData(withTx);
            setPhase("verified");
            setHumanScore(withTx);
          },
          reduced ? 200 : 900,
        );
      } catch {
        window.setTimeout(
          () => {
            setPhase("verified");
            setHumanScore(result);
          },
          reduced ? 200 : 900,
        );
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setPhase("not_found");
        return;
      }
      // Network / upstream failure — drop to local mock so the demo keeps moving.
      console.warn("[verify] falling back to local mock:", err);
      setData(LOCAL_MOCK_SCORE);
      setPhase("verified");
      setHumanScore(LOCAL_MOCK_SCORE);
    }
  };

  const canSubmit = mockMode || username.trim().length > 0;
  const busy = phase === "analyzing" || phase === "scoring";

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-2xl flex-col items-center justify-center gap-8 px-6 py-10">
      <div className="flex w-full flex-col items-center gap-2 text-center">
        <span className="font-mono text-xs uppercase tracking-[0.4em] text-base-content/50">
          Step 01 · Human Verification
        </span>
        <h2 className="font-display text-3xl font-bold md:text-4xl">Prove you are human.</h2>
        <p className="max-w-md text-sm text-base-content/60">
          Enter your GitHub handle. The agent scores the account and records the verdict on-chain.
        </p>
      </div>

      {phase === "idle" && (
        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: GLIDE }}
          className="flex w-full max-w-md flex-col gap-3"
        >
          <label className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-base-content/50">
              GitHub username
            </span>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder={mockMode ? "(mock mode — any value works)" : "e.g. vitalik"}
              autoComplete="off"
              spellCheck={false}
              className="rounded-lg border bg-base-100 px-4 py-3 font-mono text-sm outline-none transition-colors"
              style={{ borderColor: "var(--bg-rim)" }}
              onFocus={e => (e.currentTarget.style.borderColor = "var(--bg-brand)")}
              onBlur={e => (e.currentTarget.style.borderColor = "var(--bg-rim)")}
              onKeyDown={e => {
                if (e.key === "Enter" && canSubmit) runVerify();
              }}
            />
          </label>
        </motion.div>
      )}

      {phase !== "idle" && phase !== "not_found" && (
        <div className="w-full">
          <AnalysisCard data={data} loading={phase === "analyzing"} />
        </div>
      )}

      {(phase === "scoring" || phase === "verified") && data && (
        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: GLIDE }}
          className="flex w-full flex-col items-center gap-5"
        >
          <HumanScoreBar score={data.score} active />
          <VerdictBadge verdict={phase === "verified" ? data.verdict : null} />
          {phase === "verified" && data.txHash && (
            <a
              href={`${MONAD_EXPLORER_BASE}/tx/${data.txHash}`}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs text-base-content/60 underline underline-offset-4 hover:text-base-content"
            >
              tx {shortHash(data.txHash)}
            </a>
          )}
        </motion.div>
      )}

      {phase === "not_found" && (
        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: GLIDE }}
          className="flex flex-col items-center gap-3"
        >
          <span className="font-mono text-sm" style={{ color: "var(--bg-bot)" }}>
            GitHub user &ldquo;{username}&rdquo; not found.
          </span>
          <button
            type="button"
            onClick={() => setPhase("idle")}
            className="font-mono text-xs text-base-content/60 underline underline-offset-4 hover:text-base-content"
          >
            try again
          </button>
        </motion.div>
      )}

      <div className="flex items-center gap-3 font-mono text-xs text-base-content/50">
        {address && (
          <span>
            wallet {address.slice(0, 6)}…{address.slice(-4)}
          </span>
        )}
        <span>·</span>
        <span>{phase === "verified" ? "ready for sale" : "awaiting verification"}</span>
      </div>

      <div className="flex gap-3">
        {(phase === "idle" || phase === "not_found") && (
          <motion.button
            type="button"
            onClick={runVerify}
            disabled={!canSubmit}
            whileTap={reduced ? undefined : { scale: 0.97, transition: SNAP }}
            className="rounded-full px-6 py-3 text-sm font-medium transition-colors disabled:opacity-50"
            style={{
              backgroundColor: "var(--bg-brand)",
              color: "white",
              boxShadow: "0 0 24px var(--bg-glow-brand)",
            }}
          >
            Verify with GitHub
          </motion.button>
        )}
        {busy && (
          <span
            className="rounded-full border px-6 py-3 font-mono text-xs uppercase tracking-widest"
            style={{ borderColor: "var(--bg-rim)", color: "var(--bg-brand)" }}
          >
            Analyzing…
          </span>
        )}
        {phase === "verified" && (
          <motion.button
            type="button"
            onClick={() => goTo("sale")}
            whileTap={reduced ? undefined : { scale: 0.97, transition: SNAP }}
            className="rounded-full px-6 py-3 text-sm font-medium transition-colors"
            style={{
              backgroundColor: "var(--bg-brand)",
              color: "white",
              boxShadow: "0 0 24px var(--bg-glow-brand)",
            }}
          >
            Continue to sale →
          </motion.button>
        )}
      </div>
    </div>
  );
};
