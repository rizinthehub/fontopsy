import type { PixelBox } from './common';

export interface GlyphBox {
  /** Single character. */
  char: string;
  /** Bounding box in source-image pixel coordinates. */
  box: PixelBox;
  /** Vision confidence for this glyph (0..1). */
  confidence: number;
}

export interface ParsedVisionResult {
  /** Full text extracted by Vision. */
  fullText: string;
  /** Detected language code (ISO 639-1). */
  language?: string;
  /** Per-glyph bounding boxes. */
  glyphs: GlyphBox[];
  /** Median height of capital glyphs in px. */
  dominantHeightPx: number;
  /** Source image dimensions. */
  imageWidthPx: number;
  imageHeightPx: number;
}