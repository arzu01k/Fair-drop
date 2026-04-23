"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { hardhat } from "viem/chains";
import { Bars3Icon, CommandLineIcon } from "@heroicons/react/24/outline";
import { SwitchTheme } from "~~/components/SwitchTheme";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick, useTargetNetwork } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Dev",
    href: "/dev",
    icon: <CommandLineIcon className="h-4 w-4" />,
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "bg-secondary shadow-md" : ""
              } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

export const Header = () => {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  const burgerMenuRef = useRef<HTMLDetailsElement>(null);
  useOutsideClick(burgerMenuRef, () => {
    burgerMenuRef?.current?.removeAttribute("open");
  });

  return (
    <div
      className="sticky top-0 z-20 flex min-h-0 shrink-0 items-center justify-between border-b bg-base-100/80 px-3 py-3 backdrop-blur-md sm:px-5"
      style={{ borderColor: "var(--bg-rim)" }}
    >
      <div className="flex items-center gap-4">
        <details className="dropdown lg:hidden" ref={burgerMenuRef}>
          <summary className="btn btn-ghost btn-sm hover:bg-transparent">
            <Bars3Icon className="h-5 w-5" />
          </summary>
          <ul
            className="menu menu-compact dropdown-content mt-3 w-52 rounded-box bg-base-100 p-2 shadow-sm"
            onClick={() => burgerMenuRef?.current?.removeAttribute("open")}
          >
            <HeaderMenuLinks />
          </ul>
        </details>
        <Link href="/" passHref className="flex shrink-0 items-center gap-3">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-md"
            style={{
              backgroundColor: "var(--bg-brand)",
              boxShadow: "0 0 16px var(--bg-glow-brand)",
            }}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="white" aria-hidden>
              <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
            </svg>
          </span>
          <div className="hidden flex-col leading-none sm:flex">
            <span className="font-display text-sm font-bold tracking-wide">BLITZGUARD</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-base-content/50">Humans win.</span>
          </div>
        </Link>
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal gap-2 px-1">
          <HeaderMenuLinks />
        </ul>
      </div>
      <div className="flex items-center gap-2">
        <SwitchTheme />
        <RainbowKitCustomConnectButton />
        {isLocalNetwork && <FaucetButton />}
      </div>
    </div>
  );
};
