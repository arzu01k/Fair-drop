import { env } from "../../env.js";
import { HttpError } from "../../middleware/errorHandler.js";

const GITHUB_API = "https://api.github.com";

export type GithubUser = {
  login: string;
  public_repos: number;
  followers: number;
  created_at: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
};

export type GithubEvent = {
  type: string;
  created_at: string;
};

const authHeaders = (): Record<string, string> => {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "blitzguard-backend",
  };
  if (env.GITHUB_TOKEN) h.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
  return h;
};

export const fetchGithubUser = async (username: string): Promise<GithubUser> => {
  const res = await fetch(`${GITHUB_API}/users/${encodeURIComponent(username)}`, {
    headers: authHeaders(),
  });
  if (res.status === 404) throw new HttpError(404, "github_user_not_found");
  if (res.status === 403) throw new HttpError(429, "github_rate_limited");
  if (!res.ok) throw new HttpError(502, "github_upstream_error", { status: res.status });
  return (await res.json()) as GithubUser;
};

export const fetchGithubEvents = async (username: string): Promise<GithubEvent[]> => {
  const res = await fetch(
    `${GITHUB_API}/users/${encodeURIComponent(username)}/events/public?per_page=100`,
    { headers: authHeaders() },
  );
  if (!res.ok) return []; // Non-fatal; contributions score falls back to 0.
  return (await res.json()) as GithubEvent[];
};
