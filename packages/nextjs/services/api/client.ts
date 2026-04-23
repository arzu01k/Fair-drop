import type { HumanScoreData, SaleInfo } from "~~/types/blitzguard";

export const API_BASE = process.env.NEXT_PUBLIC_BLITZGUARD_API_URL?.replace(/\/$/, "") || "http://localhost:3001";

const parseJson = async <T>(res: Response): Promise<T> => {
  const text = await res.text();
  if (!res.ok) {
    let body: unknown = text;
    try {
      body = JSON.parse(text);
    } catch {
      /* keep raw */
    }
    throw new ApiError(res.status, body);
  }
  return text ? (JSON.parse(text) as T) : (undefined as T);
};

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
  ) {
    super(`api_error_${status}`);
  }
}

export const apiHealth = async () => {
  const res = await fetch(`${API_BASE}/health`);
  return parseJson<{ status: string; mock: boolean; hasGithubToken: boolean; time: string }>(res);
};

export const apiAnalyzeGithub = async (github: string, wallet?: string) => {
  const res = await fetch(`${API_BASE}/verify/analyze`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ github, wallet }),
  });
  return parseJson<HumanScoreData>(res);
};

export const apiRegisterVerification = async (payload: { wallet: string; score: number; github: string }) => {
  const res = await fetch(`${API_BASE}/verify/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJson<{ txHash: `0x${string}`; status: string }>(res);
};

export const apiActiveSales = async () => {
  const res = await fetch(`${API_BASE}/sale/active`);
  return parseJson<SaleInfo[]>(res);
};

export const apiActivateAgent = async (wallet: string, saleId: string) => {
  const res = await fetch(`${API_BASE}/agent/activate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ wallet, saleId }),
  });
  return parseJson<{ id: string; wallet: string; saleId: string; status: string }>(res);
};

export const apiPurchase = async (agentId: string) => {
  const res = await fetch(`${API_BASE}/agent/purchase`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ agentId }),
  });
  return parseJson<{ txHash: `0x${string}`; status: string }>(res);
};

export const isBackendReachable = async (timeoutMs = 1000): Promise<boolean> => {
  const ctrl = new AbortController();
  const t = window.setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: ctrl.signal });
    return res.ok;
  } catch {
    return false;
  } finally {
    window.clearTimeout(t);
  }
};
