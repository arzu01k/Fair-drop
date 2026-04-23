"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFetchNativeCurrencyPrice } from "@scaffold-ui/hooks";
import { hardhat } from "viem/chains";
import { CurrencyDollarIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Faucet } from "~~/components/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

export const Footer = () => {
  const pathname = usePathname();
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;
  const { price: nativeCurrencyPrice } = useFetchNativeCurrencyPrice();

  // Hide the scaffold footer on the BlitzGuard flow; dev/debug pages keep it.
  if (pathname === "/") return null;

  return (
    <div className="min-h-0 py-5 px-1 mb-4 lg:mb-0">
      <div className="fixed bottom-0 left-0 z-10 flex w-full items-center justify-between p-4 pointer-events-none">
        <div className="flex flex-col gap-2 pointer-events-auto md:flex-row">
          {nativeCurrencyPrice > 0 && (
            <div className="btn btn-primary btn-sm cursor-auto gap-1 font-normal">
              <CurrencyDollarIcon className="h-4 w-4" />
              <span>{nativeCurrencyPrice.toFixed(2)}</span>
            </div>
          )}
          {isLocalNetwork && (
            <>
              <Faucet />
              <Link href="/blockexplorer" passHref className="btn btn-primary btn-sm gap-1 font-normal">
                <MagnifyingGlassIcon className="h-4 w-4" />
                <span>Block Explorer</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
