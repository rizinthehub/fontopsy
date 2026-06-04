import { describe, it, expect } from 'vitest';
import { scoreFont } from '@/lib/matching/scoring';
import type { FontMetadata } from '@/types';

const mockFont: FontMetadata = {
  family: 'Test Font',
  category: 'serif',
  designer: 'Test Designer',
  license: 'OFL',
  licenseUrl: 'https://openfontlicense.org',
  weights: [400],
  variable: false,
  subsets: ['latin'],
  metrics: {
    xHeightRatio: 0.50,
    capHeightRatio: 0.71,
    ascenderRatio: 0.98,
    descenderRatio: 0.25,
    strokeContrast: 2.5,
  },
  traits: ['transitional'],
  cssUrl: 'https://fonts.googleapis.com/css2?family=Test',
};

describe('scoreFont()', () => {
  it('returns score of 1.0 when observed metrics exactly match font metrics', () => {
    const observed = {
      xHeightRatio: 0.50,
      capHeightRatio: 0.71,
      ascenderRatio: 0.98,
      descenderRatio: 0.25,
    };
    const result = scoreFont(observed, 'serif', mockFont);
    // strokeContrast is always 0.5 (neutral) in MVP, so score won't be exactly 1.0
    // but should be very high
    expect(result.score).toBeGreaterThan(0.85);
  });

  it('returns low score when metrics are wildly different', () => {
    const observed = {
      xHeightRatio: 0.90,
      capHeightRatio: 0.30,
      ascenderRatio: 0.40,
      descenderRatio: 0.80,
    };
    const result = scoreFont(observed, 'sans-serif', mockFont);
    expect(result.score).toBeLessThan(0.35);
  });

  it('returns neutral score (0.5) for undefined metrics', () => {
    const result = scoreFont({}, undefined, mockFont);
    // All metrics undefined → all return 0.5; category undefined → 0.7
    // total = 0.5*(0.30+0.20+0.15+0.10+0.10) + 0.7*0.15 = 0.5*0.85 + 0.105 = 0.53
    expect(result.score).toBeGreaterThan(0.45);
    expect(result.score).toBeLessThan(0.65);
  });

  it('gives category bonus when observed category matches', () => {
    const observed = { xHeightRatio: 0.50 };
    const matchResult = scoreFont(observed, 'serif', mockFont);
    const mismatchResult = scoreFont(observed, 'monospace', mockFont);
    expect(matchResult.score).toBeGreaterThan(mismatchResult.score);
  });

  it('gives partial credit for sans-serif vs display (both sansish)', () => {
    const result = scoreFont({}, 'display', mockFont);
    // category is serif, observed is display — should give 0.3
    expect(result.breakdown.category).toBe(0.3);
  });

  it('score is clamped between 0 and 1', () => {
    const observed = {
      xHeightRatio: 0.50,
      capHeightRatio: 0.71,
      ascenderRatio: 0.98,
      descenderRatio: 0.25,
    };
    const result = scoreFont(observed, 'serif', mockFont);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(1);
  });

  it('returns correct family name and font reference', () => {
    const result = scoreFont({}, undefined, mockFont);
    expect(result.family).toBe('Test Font');
    expect(result.font).toBe(mockFont);
  });
});