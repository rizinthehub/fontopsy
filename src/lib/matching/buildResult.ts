import { nanoid } from 'nanoid';
import { matchFont } from './matchFont';
import { getPairings } from '@/lib/fonts/pairings';
import { CORPUS } from './corpus';
import type { AnalysisResult, BoundingBox, ParsedVisionResult } from '@/types';

interface BuildResultArgs {
  imageUrl: string;
  imageKey: string;
  region: BoundingBox | null;
  text: string;
  textSource: 'ocr' | 'manual';
  vision: ParsedVisionResult;
}

export function buildAnalysisResult(args: BuildResultArgs): AnalysisResult {
  const { identified, alternatives } = matchFont(args.vision, args.text);
  const pairings = getPairings(identified.family);

  return {
    id: nanoid(10),
    imageUrl: args.imageUrl,
    imageKey: args.imageKey,
    region: args.region,
    text: args.text,
    textSource: args.textSource,
    identified,
    alternatives,
    pairings,
    vision: args.vision,
    createdAt: new Date().toISOString(),
    schemaVersion: 1,
  };
}

// Re-export CORPUS so callers don't need a separate import
export { CORPUS };