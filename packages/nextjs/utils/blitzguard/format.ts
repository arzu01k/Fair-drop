export const formatCount = (n: number) => Math.round(n).toLocaleString("en-US");

export const formatTps = (n: number) => formatCount(n);

export const shortHash = (h: string, lead = 6, tail = 4) =>
  h.length > lead + tail + 2 ? `${h.slice(0, lead)}...${h.slice(-tail)}` : h;

export const shortAddress = (addr: string) => (addr.length > 10 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr);

export const formatSeconds = (s: number) => {
  const clamped = Math.max(0, Math.floor(s));
  const mm = Math.floor(clamped / 60);
  const ss = clamped % 60;
  return `${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
};

export const formatUsd = (n: number) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
