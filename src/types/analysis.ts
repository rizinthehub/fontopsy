import type { FontMetadata } from './font';
import type { ParsedVisionResult } from './vision';
import type { ShortId, ISOTimestamp, BoundingBox } from './common';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface MatchResult {
  /** Google Fonts family name. */
  family: string;
  /** Composite match score 0..1. */
  score: number;
  breakdown: {
    xHeight: number;
    capHeight: number;
    ascender: number;
    descender: number;
    strokeContrast: number;
    category: number;
  };
  font: FontMetadata;
}

export interface PairingSuggestion {
  display: FontMetadata;
  body: FontMetadata;
  tone: 'editorial' | 'modern' | 'playful' | 'classic';
  rationale: string;
}

export interface AnalysisResult {
  id: ShortId;
  imageUrl: string;
  imageKey: string;
  region: BoundingBox | null;
  text: string;
  textSource: 'ocr' | 'manual';
  identified: MatchResult;
  alternatives: MatchResult[];
  pairings: PairingSuggestion[];
  vision: ParsedVisionResult;
  createdAt: ISOTimestamp;
  schemaVersion: 1;
}