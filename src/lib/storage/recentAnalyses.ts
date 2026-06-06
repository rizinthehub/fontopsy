import { RECENT_STORAGE_KEY, RESULTS_STORAGE_KEY, MAX_RECENT } from '@/lib/constants';
import type { AnalysisResult } from '@/types';
import type { FontCategory } from '@/types/font';
import type { ISOTimestamp, ShortId } from '@/types/common';

export interface RecentEntry {
  id: ShortId;
  family: string;
  category: FontCategory;
  thumbnailUrl: string;
  createdAt: ISOTimestamp;
}

type RecentStorage = {
  v: 1;
  entries: RecentEntry[];
};

type ResultsStorage = {
  v: 1;
  results: Record<ShortId, AnalysisResult>;
};

// ─── Safe JSON helpers ────────────────────────────────────────────────────────

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // QuotaExceededError or localStorage unavailable — silently swallow
  }
}

// ─── Recent entries ───────────────────────────────────────────────────────────

function getRecentStorage(): RecentStorage {
  const data = safeRead<RecentStorage>(RECENT_STORAGE_KEY, { v: 1, entries: [] });
  if (data.v !== 1) return { v: 1, entries: [] };
  return data;
}

export function getRecentEntries(): RecentEntry[] {
  return getRecentStorage().entries;
}

export function addRecentEntry(entry: RecentEntry): void {
  const storage = getRecentStorage();
  // Remove duplicate if exists
  const filtered = storage.entries.filter((e) => e.id !== entry.id);
  // Add to front, cap at MAX_RECENT
  const updated: RecentStorage = {
    v: 1,
    entries: [entry, ...filtered].slice(0, MAX_RECENT),
  };
  safeWrite(RECENT_STORAGE_KEY, updated);
}

// ─── Full result persistence ──────────────────────────────────────────────────

function getResultsStorage(): ResultsStorage {
  const data = safeRead<ResultsStorage>(RESULTS_STORAGE_KEY, { v: 1, results: {} });
  if (data.v !== 1) return { v: 1, results: {} };
  return data;
}

export function saveResult(result: AnalysisResult): void {
  const storage = getResultsStorage();
  storage.results[result.id] = result;

  // Evict entries not in recent list to cap storage
  const recent = getRecentStorage().entries.map((e) => e.id);
  const allowedIds = new Set([...recent, result.id]);
  for (const key of Object.keys(storage.results)) {
    if (!allowedIds.has(key)) {
      delete storage.results[key];
    }
  }

  safeWrite(RESULTS_STORAGE_KEY, storage);
}

export function loadResult(id: string): AnalysisResult | undefined {
  const storage = getResultsStorage();
  return storage.results[id];
}