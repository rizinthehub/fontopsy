import type { AnalysisResult } from '@/types';

/**
 * In-memory result map for the current SPA session.
 * Populated by useAnalyze on success; read by ResultsView on mount.
 * Cleared on page refresh — localStorage is the persistence fallback.
 */
const map = new Map<string, AnalysisResult>();

export function setResult(result: AnalysisResult): void {
  map.set(result.id, result);
}

export function getResult(id: string): AnalysisResult | undefined {
  return map.get(id);
}

export function hasResult(id: string): boolean {
  return map.has(id);
}