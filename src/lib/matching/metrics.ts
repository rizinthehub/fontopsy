import { median } from '@/lib/utils';
import type { ParsedVisionResult } from '@/types';

export interface ObservedMetrics {
  xHeightRatio?: number;
  capHeightRatio?: number;
  ascenderRatio?: number;
  descenderRatio?: number;
  strokeContrast?: number; // Always undefined in MVP
}

export function extractMetrics(vision: ParsedVisionResult): ObservedMetrics {
  const { glyphs, dominantHeightPx } = vision;
  if (glyphs.length === 0) return {};

  // Reference height — use dominantHeightPx (median capital height)
  const ref = dominantHeightPx;
  if (ref <= 0) return {};

  // Heights of specific glyph groups
  const capHeights = glyphs
    .filter((g) => /[A-Z]/.test(g.char))
    .map((g) => g.box.height);

  const xHeights = glyphs
    .filter((g) => /[acemnorsuvwxz]/.test(g.char))
    .map((g) => g.box.height);

  const ascHeights = glyphs
    .filter((g) => /[bdfhklt]/.test(g.char))
    .map((g) => g.box.height);

  // Descender depth: distance below the assumed baseline
  // Baseline ≈ top of glyph + xHeight for lowercase
  const xRef = xHeights.length >= 2 ? median(xHeights) : ref * 0.52;
  const dscDepths = glyphs
    .filter((g) => /[gjpqy]/.test(g.char))
    .map((g) => {
      const bottom = g.box.y + g.box.height;
      const baseline = g.box.y + xRef;
      return Math.max(bottom - baseline, 0);
    });

  const result: ObservedMetrics = {};

    if (capHeights.length >= 2) {
    const capMedian = median(capHeights);
    result.capHeightRatio = 1.0;

    const xRatio = xHeights.length >= 2 ? median(xHeights) / capMedian : undefined;
    if (xRatio !== undefined) result.xHeightRatio = xRatio;

    const ascRatio = ascHeights.length >= 2 ? median(ascHeights) / capMedian : undefined;
    if (ascRatio !== undefined) result.ascenderRatio = ascRatio;

    const dscRatio = dscDepths.length >= 2 ? median(dscDepths) / capMedian : undefined;
    if (dscRatio !== undefined) result.descenderRatio = dscRatio;
  } else {
    const xRatio = xHeights.length >= 2 ? median(xHeights) / ref : undefined;
    if (xRatio !== undefined) result.xHeightRatio = xRatio;

    const ascRatio = ascHeights.length >= 2 ? median(ascHeights) / ref : undefined;
    if (ascRatio !== undefined) result.ascenderRatio = ascRatio;

    const dscRatio = dscDepths.length >= 2 ? median(dscDepths) / ref : undefined;
    if (dscRatio !== undefined) result.descenderRatio = dscRatio;
  }

  return result;
}