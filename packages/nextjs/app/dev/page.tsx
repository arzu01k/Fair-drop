"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { BugAntIcon, MagnifyingGlassIcon, PlayCircleIcon } from "@heroicons/react/24/outline";
import { useFlowStore } from "~~/services/store/flowStore";

const DevIndex: NextPage = () => {
  const mockMode = useFlowStore(s => s.mockMode);
  const setMockMode = useFlowStore(s => s.setMockMode);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-12">
      <div>
        <h1 className="font-display text-3xl font-bold">Dev Tools</h1>
        <p className="mt-1 text-sm text-base-content/60">
          Scaffold-ETH developer utilities. Not shown in the demo flow.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Link
          href="/debug"
          className="flex items-center gap-3 rounded-xl border p-4 transition-colors hover:border-primary"
          style={{ borderColor: "var(--bg-rim)" }}
        >
          <BugAntIcon className="h-6 w-6" style={{ color: "var(--bg-brand)" }} />
          <div className="flex flex-col">
            <span className="font-semibold">Debug Contracts</span>
            <span className="font-mono text-xs text-base-content/50">/debug</span>
          </div>
        </Link>
        <Link
          href="/blockexplorer"
          className="flex items-center gap-3 rounded-xl border p-4 transition-colors hover:border-primary"
          style={{ borderColor: "var(--bg-rim)" }}
        >
          <MagnifyingGlassIcon className="h-6 w-6" style={{ color: "var(--bg-brand)" }} />
          <div className="flex flex-col">
            <span className="font-semibold">Block Explorer</span>
            <span className="font-mono text-xs text-base-content/50">/blockexplorer</span>
          </div>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl border p-4 transition-colors hover:border-primary"
          style={{ borderColor: "var(--bg-rim)" }}
        >
          <PlayCircleIcon className="h-6 w-6" style={{ color: "var(--bg-brand)" }} />
          <div className="flex flex-col">
            <span className="font-semibold">Run BlitzGuard flow</span>
            <span className="font-mono text-xs text-base-content/50">/</span>
          </div>
        </Link>
      </div>

      <div className="rounded-xl border p-4" style={{ borderColor: "var(--bg-rim)" }}>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-semibold">Mock battle mode</span>
            <span className="text-xs text-base-content/50">
              When on, the sale screen plays a deterministic 60s scripted battle.
            </span>
          </div>
          <label className="swap swap-rotate">
            <input type="checkbox" checked={mockMode} onChange={e => setMockMode(e.target.checked)} />
            <span className="swap-on font-mono text-xs uppercase tracking-widest" style={{ color: "var(--bg-human)" }}>
              ON
            </span>
            <span className="swap-off font-mono text-xs uppercase tracking-widest text-base-content/50">OFF</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default DevIndex;
