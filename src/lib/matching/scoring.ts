import type { FontMetadata, FontCategory, MatchResult } from '@/types';
import type { ObservedMetrics } from './metrics';

const WEIGHTS = {
  xHeight:        0.30,
  capHeight:      0.20,
  ascender:       0.15,
  descender:      0.10,
  strokeContrast: 0.10,
  category:       0.15,
} as const;

function similarity(observed: number | undefined, target: number): number {
  if (observed === undefined) return 0.5; // neutral when no data
  const diff = Math.abs(observed - target);
  if (diff <= 0.08) return 1;
  if (diff >= 0.30) return 0;
  return 1 - (diff - 0.08) / 0.22;
}

function categoryScore(
  observed: FontCategory | undefined,
  target: FontCategory,
): number {
  if (!observed) return 0.7;
  if (observed === target) return 1.0;
  const sansish = (c: FontCategory) => c === 'sans-serif' || c === 'display';
  if (sansish(observed) && sansish(target)) return 0.6;
  return 0.3;
}

export function scoreFont(
  observed: ObservedMetrics,
  observedCategory: FontCategory | undefined,
  font: FontMetadata,
): MatchResult {
  const breakdown = {
    xHeight:        similarity(observed.xHeightRatio,   font.metrics.xHeightRatio),
    capHeight:      similarity(observed.capHeightRatio, font.metrics.capHeightRatio),
    ascender:       similarity(observed.ascenderRatio,  font.metrics.ascenderRatio),
    descender:      similarity(observed.descenderRatio, font.metrics.descenderRatio),
    strokeContrast: 0.5, // MVP: neutral
    category:       categoryScore(observedCategory, font.category),
  };

  const total =
    breakdown.xHeight        * WEIGHTS.xHeight +
    breakdown.capHeight      * WEIGHTS.capHeight +
    breakdown.ascender       * WEIGHTS.ascender +
    breakdown.descender      * WEIGHTS.descender +
    breakdown.strokeContrast * WEIGHTS.strokeContrast +
    breakdown.category       * WEIGHTS.category;

  return {
    family: font.family,
    score: Math.min(1, Math.max(0, total)),
    breakdown,
    font,
  };
}