"use client";

import { motion } from "motion/react";
import { shortAddress } from "~~/utils/blitzguard/format";

type Props = {
  address?: string;
  className?: string;
};

export const WalletPill = ({ address, className = "" }: Props) => {
  if (!address) return null;
  return (
    <motion.div
      layoutId="wallet-pill"
      className={`inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100 px-3 py-1.5 font-mono text-xs ${className}`}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: "var(--bg-human)", boxShadow: "0 0 8px var(--bg-human)" }}
      />
      <span>{shortAddress(address)}</span>
    </motion.div>
  );
};
