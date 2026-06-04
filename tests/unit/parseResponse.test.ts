import { describe, it, expect } from 'vitest';
import { parseResponse, type RawVisionResponse } from '@/lib/vision/parseResponse';
import { AppError } from '@/lib/errors/AppError';

const validResponse: RawVisionResponse = {
  textAnnotations: [
    {
      description: 'Hello World',
      locale: 'en',
      boundingPoly: { vertices: [{ x: 0, y: 0 }, { x: 200, y: 0 }, { x: 200, y: 60 }, { x: 0, y: 60 }] },
    },
    {
      description: 'Hello',
      boundingPoly: { vertices: [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 60 }, { x: 0, y: 60 }] },
    },
    {
      description: 'World',
      boundingPoly: { vertices: [{ x: 110, y: 0 }, { x: 200, y: 0 }, { x: 200, y: 60 }, { x: 110, y: 60 }] },
    },
  ],
  fullTextAnnotation: {
    text: 'Hello World',
    pages: [
      {
        width: 800,
        height: 600,
        blocks: [
          {
            paragraphs: [
              {
                words: [
                  {
                    symbols: [
                      { text: 'H', confidence: 0.99, boundingBox: { vertices: [{ x: 0, y: 0 }, { x: 30, y: 0 }, { x: 30, y: 50 }, { x: 0, y: 50 }] } },
                      { text: 'e', confidence: 0.99, boundingBox: { vertices: [{ x: 32, y: 10 }, { x: 54, y: 10 }, { x: 54, y: 45 }, { x: 32, y: 45 }] } },
                      { text: 'l', confidence: 0.99, boundingBox: { vertices: [{ x: 56, y: 2 }, { x: 68, y: 2 }, { x: 68, y: 50 }, { x: 56, y: 50 }] } },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

const emptyResponse: RawVisionResponse = {
  textAnnotations: [],
};

const errorResponse: RawVisionResponse = {
  error: { code: 400, message: 'Vision API error' },
};

describe('parseResponse()', () => {
  it('parses a valid response and returns fullText', () => {
    const result = parseResponse(validResponse, 800, 600);
    expect(result.fullText).toBe('Hello World');
  });

  it('extracts language from first textAnnotation', () => {
    const result = parseResponse(validResponse, 800, 600);
    expect(result.language).toBe('en');
  });

  it('extracts glyphs from fullTextAnnotation symbols', () => {
    const result = parseResponse(validResponse, 800, 600);
    expect(result.glyphs.length).toBeGreaterThan(0);
    expect(result.glyphs[0]?.char).toBe('H');
  });

    it('computes dominantHeightPx from glyph heights', () => {
    const result = parseResponse(validResponse, 800, 600);
    // Only 1 capital ('H' height 50) — needs >= 3 for capital-only median.
    // Falls back to median of all glyphs: [35, 48, 50] → 48
    expect(result.dominantHeightPx).toBe(48);
  });

  it('stores source image dimensions', () => {
    const result = parseResponse(validResponse, 800, 600);
    expect(result.imageWidthPx).toBe(800);
    expect(result.imageHeightPx).toBe(600);
  });

  it('throws NO_TEXT_FOUND for empty textAnnotations', () => {
    expect(() => parseResponse(emptyResponse, 800, 600)).toThrow(AppError);
    try {
      parseResponse(emptyResponse, 800, 600);
    } catch (e) {
      expect((e as AppError).code).toBe('NO_TEXT_FOUND');
      expect((e as AppError).status).toBe(422);
    }
  });

  it('throws VISION_API_FAILURE when response has an error field', () => {
    expect(() => parseResponse(errorResponse, 800, 600)).toThrow(AppError);
    try {
      parseResponse(errorResponse, 800, 600);
    } catch (e) {
      expect((e as AppError).code).toBe('VISION_API_FAILURE');
      expect((e as AppError).status).toBe(502);
    }
  });

  it('falls back to word-level glyphs when fullTextAnnotation is missing', () => {
    const wordOnlyResponse: RawVisionResponse = {
      textAnnotations: [
        { description: 'Hi', locale: 'en', boundingPoly: { vertices: [{ x: 0, y: 0 }, { x: 60, y: 0 }, { x: 60, y: 50 }, { x: 0, y: 50 }] } },
        { description: 'Hi', boundingPoly: { vertices: [{ x: 0, y: 0 }, { x: 60, y: 0 }, { x: 60, y: 50 }, { x: 0, y: 50 }] } },
      ],
    };
    const result = parseResponse(wordOnlyResponse, 800, 600);
    expect(result.fullText).toBe('Hi');
    expect(result.glyphs.length).toBe(2); // 'H' and 'i'
  });
});