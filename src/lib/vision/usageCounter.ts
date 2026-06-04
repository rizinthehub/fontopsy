const HARD_CAP = 900;
const counter = new Map<string, number>();

function monthKey(d = new Date()): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

export function getUsage(): { used: number; limit: number; resetAt: string } {
  const key = monthKey();
  const used = counter.get(key) ?? 0;
  const now = new Date();
  const reset = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  return { used, limit: HARD_CAP, resetAt: reset.toISOString() };
}

export function increment(): void {
  const key = monthKey();
  counter.set(key, (counter.get(key) ?? 0) + 1);
}

export function isAtCap(): boolean {
  return (counter.get(monthKey()) ?? 0) >= HARD_CAP;
}