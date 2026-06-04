import pairingsData from './pairings.json';
import { CORPUS } from '@/lib/matching/corpus';
import type { PairingSuggestion, FontMetadata } from '@/types';

type PairingEntry = {
  displayFamily: string;
  bodyFamily: string;
  tone: 'editorial' | 'modern' | 'playful' | 'classic';
  rationale: string;
};

type PairingsFile = {
  v: 1;
  pairings: Record<string, PairingEntry[]>;
};

const data = pairingsData as PairingsFile;

const corpusMap = new Map<string, FontMetadata>(
  CORPUS.map((f) => [f.family, f]),
);

export function getPairings(family: string): PairingSuggestion[] {
  const entries = data.pairings[family] ?? [];
  const results: PairingSuggestion[] = [];

  for (const entry of entries) {
    const display = corpusMap.get(entry.displayFamily);
    const body = corpusMap.get(entry.bodyFamily);
    if (!display || !body) continue;
    results.push({
      display,
      body,
      tone: entry.tone,
      rationale: entry.rationale,
    });
  }

  return results.slice(0, 2);
}