const buckets = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_PER_WINDOW = 10;

export function checkIpLimit(ip: string): { ok: boolean; resetAt: number } {
  const now = Date.now();
  const existing = buckets.get(ip);

  if (!existing || now > existing.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, resetAt: now + WINDOW_MS };
  }

  if (existing.count >= MAX_PER_WINDOW) {
    return { ok: false, resetAt: existing.resetAt };
  }

  existing.count++;
  return { ok: true, resetAt: existing.resetAt };
}