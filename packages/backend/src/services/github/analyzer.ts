import type { HumanScoreData } from "../../types.js";
import { fetchGithubEvents, fetchGithubUser } from "./client.js";

// Scoring rubric (max 100):
//   repoCount          25   (20+ repos → 25)
//   accountAgeYears    25   (3+ years → 25)
//   contributions      25   (30+ active days in last 90 → 25)
//   followers          15   (50+ → 15)
//   profileCompleteness 10  (bio/company/location/blog, 2.5 each)

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const scoreRepos = (n: number) => clamp((n / 20) * 25, 0, 25);
const scoreAge = (years: number) => clamp((years / 3) * 25, 0, 25);
const scoreFollowers = (n: number) => clamp((n / 50) * 15, 0, 15);

const scoreContributions = (uniqueActiveDays: number) =>
  clamp((uniqueActiveDays / 30) * 25, 0, 25);

const verdict = (score: number): HumanScoreData["verdict"] => {
  if (score >= 70) return "human";
  if (score >= 40) return "suspicious";
  return "bot";
};

export const analyzeGithubUser = async (username: string): Promise<HumanScoreData> => {
  const user = await fetchGithubUser(username);
  const events = await fetchGithubEvents(username);

  const uniqueDays = new Set(events.map(e => e.created_at.slice(0, 10))).size;
  const createdAt = new Date(user.created_at);
  const ageYears = (Date.now() - createdAt.getTime()) / (365.25 * 24 * 3600 * 1000);

  const profileFields: Array<string | null> = [user.bio, user.company, user.location, user.blog];
  const completeness = profileFields.filter(v => v && v.trim().length > 0).length;
  const completenessScore = (completeness / 4) * 10;

  const parts = {
    repos: scoreRepos(user.public_repos),
    age: scoreAge(ageYears),
    contributions: scoreContributions(uniqueDays),
    followers: scoreFollowers(user.followers),
    completeness: completenessScore,
  };

  const score = Math.round(
    parts.repos + parts.age + parts.contributions + parts.followers + parts.completeness,
  );

  const checks: HumanScoreData["checks"] = [
    { label: "GitHub profile fetched", passed: true },
    { label: "Account age > 1 year", passed: ageYears >= 1 },
    { label: "Public repos > 5", passed: user.public_repos > 5 },
    { label: "Recent activity present", passed: uniqueDays >= 3 },
    { label: "Profile metadata present", passed: completeness >= 2 },
  ];

  return {
    score,
    github: {
      username: user.login,
      repoCount: user.public_repos,
      contributions: uniqueDays,
      followers: user.followers,
      accountAgeYears: Math.round(ageYears * 10) / 10,
    },
    checks,
    verdict: verdict(score),
  };
};
