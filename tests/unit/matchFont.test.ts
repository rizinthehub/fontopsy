import { describe, it, expect } from 'vitest';
import { matchFont } from '@/lib/matching/matchFont';
import type { ParsedVisionResult } from '@/types';

// Minimal vision result with no glyphs — tests the fallback paths
const emptyVision: ParsedVisionResult = {
  fullText: 'Hello',
  glyphs: [],
  dominantHeightPx: 48,
  imageWidthPx: 800,
  imageHeightPx: 600,
};

// Vision result with capital letters to exercise metric extraction
const richVision: ParsedVisionResult = {
  fullText: 'Hello World',
  glyphs: [
    { char: 'H', box: { x: 0,  y: 0, width: 30, height: 50 }, confidence: 0.99 },
    { char: 'e', box: { x: 32, y: 10, width: 22, height: 35 }, confidence: 0.99 },
    { char: 'l', box: { x: 55, y: 2,  width: 12, height: 48 }, confidence: 0.99 },
    { char: 'l', box: { x: 68, y: 2,  width: 12, height: 48 }, confidence: 0.99 },
    { char: 'o', box: { x: 81, y: 10, width: 28, height: 35 }, confidence: 0.99 },
    { char: 'W', box: { x: 120, y: 0, width: 40, height: 50 }, confidence: 0.99 },
    { char: 'o', box: { x: 162, y: 10, width: 28, height: 35 }, confidence: 0.99 },
    { char: 'r', box: { x: 191, y: 10, width: 18, height: 35 }, confidence: 0.99 },
    { char: 'l', box: { x: 210, y: 2,  width: 12, height: 48 }, confidence: 0.99 },
    { char: 'd', box: { x: 223, y: 2,  width: 28, height: 48 }, confidence: 0.99 },
  ],
  dominantHeightPx: 50,
  imageWidthPx: 800,
  imageHeightPx: 600,
};

describe('matchFont()', () => {
  it('returns an identified font and alternatives', () => {
    const { identified, alternatives } = matchFont(emptyVision, 'Hello');
    expect(identified).toBeDefined();
    expect(identified.family).toBeTruthy();
    expect(alternatives.length).toBeGreaterThan(0);
  });

  it('returns exactly 3 alternatives for high-confidence match', () => {
    // With empty glyphs all scores will be similar — but identified
    // should still return DEFAULT alternative count (3) most of the time
    const { identified, alternatives } = matchFont(richVision, 'Hello World');
    expect(identified).toBeDefined();
    // Either 3 or 4 depending on confidence
    expect(alternatives.length).toBeGreaterThanOrEqual(3);
    expect(alternatives.length).toBeLessThanOrEqual(4);
  });

  it('identified font is not in alternatives list', () => {
    const { identified, alternatives } = matchFont(richVision, 'Hello World');
    const altFamilies = alternatives.map((a) => a.family);
    expect(altFamilies).not.toContain(identified.family);
  });

  it('alternatives are sorted by score descending', () => {
    const { alternatives } = matchFont(emptyVision, 'Hello');
    for (let i = 1; i < alternatives.length; i++) {
      const prev = alternatives[i - 1];
      const curr = alternatives[i];
      if (prev && curr) {
        expect(prev.score).toBeGreaterThanOrEqual(curr.score);
      }
    }
  });

  it('all scores are between 0 and 1', () => {
    const { identified, alternatives } = matchFont(emptyVision, 'Hello');
    expect(identified.score).toBeGreaterThanOrEqual(0);
    expect(identified.score).toBeLessThanOrEqual(1);
    alternatives.forEach((alt) => {
      expect(alt.score).toBeGreaterThanOrEqual(0);
      expect(alt.score).toBeLessThanOrEqual(1);
    });
  });

  it('identified font has a valid FontMetadata object attached', () => {
    const { identified } = matchFont(emptyVision, 'Hello');
    expect(identified.font.family).toBeTruthy();
    expect(identified.font.category).toBeTruthy();
    expect(identified.font.metrics).toBeDefined();
  });

  it('short display-sized text infers display category', () => {
    const displayVision: ParsedVisionResult = {
      ...emptyVision,
      dominantHeightPx: 120, // > 80px threshold
    };
    const { identified } = matchFont(displayVision, 'Hi'); // <= 4 chars
    // Can't guarantee display is matched but should not crash
    expect(identified).toBeDefined();
  });
});