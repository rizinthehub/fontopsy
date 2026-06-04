export type FontCategory =
  | 'serif'
  | 'sans-serif'
  | 'display'
  | 'handwriting'
  | 'monospace';

export type LicenseId = 'OFL' | 'Apache-2.0' | 'UFL' | 'MIT';

export type FontTrait =
  | 'geometric'
  | 'humanist'
  | 'grotesque'
  | 'transitional'
  | 'modern'
  | 'old-style'
  | 'slab'
  | 'high-contrast'
  | 'low-contrast'
  | 'monospaced'
  | 'rounded'
  | 'condensed'
  | 'wide';

export interface FontMetrics {
  /** Height of lowercase 'x' as fraction of em (typical 0.45–0.55). */
  xHeightRatio: number;
  /** Height of uppercase 'H' as fraction of em (typical 0.65–0.75). */
  capHeightRatio: number;
  /** Top of 'h' above baseline as fraction of em (typical 0.70–0.82). */
  ascenderRatio: number;
  /** Depth of 'g' below baseline as fraction of em (typical 0.15–0.25). */
  descenderRatio: number;
  /** Stroke contrast ratio. 1.0 = uniform, 5.0 = high contrast. */
  strokeContrast: number;
}

export interface FontMetadata {
  /** Exact Google Fonts family name. */
  family: string;
  category: FontCategory;
  designer: string;
  license: LicenseId;
  licenseUrl: string;
  weights: number[];
  variable: boolean;
  subsets: string[];
  metrics: FontMetrics;
  traits: FontTrait[];
  /** Google Fonts CSS2 URL for this family at weight 400. */
  cssUrl: string;
}