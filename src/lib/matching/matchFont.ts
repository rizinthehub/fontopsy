import type { FontCategory, MatchResult } from '@/types';
import type { ParsedVisionResult } from '@/types';
import { ALTERNATIVES_COUNT_DEFAULT, ALTERNATIVES_COUNT_LOW_CONF, MIN_MEDIUM_CONFIDENCE } from '@/lib/constants';
import { CORPUS } from './corpus';
import { extractMetrics } from './metrics';
import { scoreFont } from './scoring';

export interface MatchFontOutput {
  identified: MatchResult;
  alternatives: MatchResult[];
}

function inferCategory(
  vision: ParsedVisionResult,
  text: string,
): FontCategory | undefined {
  if (text.length <= 4 && vision.dominantHeightPx > 80) return 'display';
  if (vision.dominantHeightPx < 24) return 'sans-serif';
  return undefined;
}

export function matchFont(
  vision: ParsedVisionResult,
  text: string,
): MatchFontOutput {
  const observed = extractMetrics(vision);
  const observedCategory = inferCategory(vision, text);

  // Score every font in corpus
  const scored = CORPUS.map((font) =>
    scoreFont(observed, observedCategory, font),
  ).sort((a, b) => b.score - a.score);

  const identified = scored[0];
  if (!identified) {
    // Corpus is empty — should never happen but satisfy TS
    throw new Error('Corpus is empty');
  }

  const isLowConfidence = identified.score < MIN_MEDIUM_CONFIDENCE;
  const altCount = isLowConfidence
    ? ALTERNATIVES_COUNT_LOW_CONF
    : ALTERNATIVES_COUNT_DEFAULT;

  // Take the next N after identified
  let alternatives = scored.slice(1, altCount + 1);

  // Prefer same-category alternatives (stable sort)
  const sameCategory = alternatives.filter(
    (m) => m.font.category === identified.font.category,
  );
  const otherCategory = alternatives.filter(
    (m) => m.font.category !== identified.font.category,
  );
  alternatives = [...sameCategory, ...otherCategory].slice(0, altCount);

  return { identified, alternatives };
}