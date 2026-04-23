import type { SaleInfo } from "~~/types/blitzguard";

export const BRAND = {
  name: "BLITZ-GUARD",
  tagline: "Humans win, not bots.",
  subline: "Bot-resistant agentic commerce on Monad.",
} as const;

export const PRODUCT: SaleInfo = {
  productId: "nike-air-max-limited",
  name: "Nike Air Max Limited",
  edition: "Blitz Special",
  priceUsd: 220,
  totalStock: 100,
  saleStart: 0,
};

export const COUNTDOWN_SECONDS = 15;

export const MOCK_BATTLE_DURATION_MS = 60_000;

export const MOCK_USER_QUEUE_POSITION = 67;

export const MOCK_RESULT_TOTAL_REQUESTS = 5847;
export const MOCK_RESULT_BOTS_BLOCKED = 4203;
export const MOCK_RESULT_HUMANS_PROCESSED = 100;
export const MOCK_RESULT_PEAK_TPS = 9247;
export const MOCK_TX_HASH = "0xf2a19b6c8d42afef8d3a5e7c23a87fbe94deaf6c15d22e3f9c4a87b192ed84a1" as const;

export const MONAD_EXPLORER_BASE = "https://testnet.monadexplorer.com";
