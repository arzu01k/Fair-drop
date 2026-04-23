import type { HumanScoreData } from "../../types.js";

// Deterministic mock score used when BLITZGUARD_MOCK=true, or as a fallback
// when the GitHub API is unreachable / rate-limited.
export const mockScoreFor = (username: string): HumanScoreData => ({
  score: 92,
  github: {
    username: username || "arzu01k",
    repoCount: 47,
    contributions: 34,
    followers: 156,
    accountAgeYears: 4,
  },
  checks: [
    { label: "GitHub profile fetched (mock)", passed: true },
    { label: "Contribution velocity normal", passed: true },
    { label: "Account age > 1 year", passed: true },
    { label: "Bio / metadata present", passed: true },
  ],
  verdict: "human",
});
