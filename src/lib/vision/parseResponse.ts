import { AppError } from '@/lib/errors/AppError';
import { median } from '@/lib/utils';
import type { ParsedVisionResult, GlyphBox } from '@/types';
import type { PixelBox } from '@/types/common';

// Matches the subset of the Vision API response shape we use
interface RawVertex { x?: number; y?: number }
interface RawBoundingPoly { vertices?: RawVertex[] }

interface RawSymbol {
  text?: string;
  confidence?: number;
  boundingBox?: RawBoundingPoly;
}

interface RawWord {
  symbols?: RawSymbol[];
  boundingBox?: RawBoundingPoly;
  description?: string;
}

interface RawParagraph { words?: RawWord[] }
interface RawBlock { paragraphs?: RawParagraph[] }
interface RawPage { width?: number; height?: number; blocks?: RawBlock[] }

interface RawTextAnnotation {
  description?: string;
  boundingPoly?: RawBoundingPoly;
  locale?: string;
}

interface RawFullTextAnnotation {
  text?: string;
  pages?: RawPage[];
}

export interface RawVisionResponse {
  textAnnotations?: RawTextAnnotation[];
  fullTextAnnotation?: RawFullTextAnnotation;
  error?: { code?: number; message?: string };
}

function polygonToPixelBox(vertices: RawVertex[]): PixelBox {
  const xs = vertices.map((v) => v.x ?? 0);
  const ys = vertices.map((v) => v.y ?? 0);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

export function parseResponse(
  raw: RawVisionResponse,
  sourceWidth: number,
  sourceHeight: number,
): ParsedVisionResult {
  // 1. API-level error
  if (raw.error?.message) {
    throw new AppError('VISION_API_FAILURE', 502, raw.error.message);
  }

  // 2. No text found at all
  const hasFullText = !!raw.fullTextAnnotation?.text?.trim();
  const hasAnnotations = (raw.textAnnotations?.length ?? 0) > 0;
  if (!hasFullText && !hasAnnotations) {
    throw new AppError('NO_TEXT_FOUND', 422);
  }

  // 3. Extract fullText
  let fullText =
    raw.fullTextAnnotation?.text ??
    raw.textAnnotations?.[0]?.description ??
    '';
  fullText = fullText.replace(/[ \t]+/g, ' ').trim();
  if (!fullText) throw new AppError('NO_TEXT_FOUND', 422);

  // 4. Language
  const language = raw.textAnnotations?.[0]?.locale ?? undefined;

  // 5. Glyphs
  const glyphs: GlyphBox[] = [];

  if (raw.fullTextAnnotation?.pages) {
    for (const page of raw.fullTextAnnotation.pages) {
      for (const block of page.blocks ?? []) {
        for (const para of block.paragraphs ?? []) {
          for (const word of para.words ?? []) {
            for (const sym of word.symbols ?? []) {
              const char = sym.text ?? '';
              if (char.length !== 1 || /\s/.test(char)) continue;
              const verts = sym.boundingBox?.vertices ?? [];
              if (verts.length < 4) continue;
              glyphs.push({
                char,
                box: polygonToPixelBox(verts),
                confidence: sym.confidence ?? 0,
              });
            }
          }
        }
      }
    }
  } else {
    // Word-level fallback from textAnnotations[1..]
    const wordAnnotations = raw.textAnnotations?.slice(1) ?? [];
    for (const ann of wordAnnotations) {
      const word = ann.description ?? '';
      const verts = ann.boundingPoly?.vertices ?? [];
      if (!word || verts.length < 4) continue;
      const box = polygonToPixelBox(verts);
      const charWidth = box.width / Math.max(word.length, 1);
      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        if (!char || /\s/.test(char)) continue;
        glyphs.push({
          char,
          box: { x: box.x + i * charWidth, y: box.y, width: charWidth, height: box.height },
          confidence: 0.5,
        });
      }
    }
  }

  // 6. dominantHeightPx
  const capitalHeights = glyphs
    .filter((g) => /[A-Z]/.test(g.char))
    .map((g) => g.box.height);

  let dominantHeightPx: number;
  if (capitalHeights.length >= 3) {
    dominantHeightPx = median(capitalHeights);
  } else if (glyphs.length >= 3) {
    dominantHeightPx = median(glyphs.map((g) => g.box.height));
  } else {
    dominantHeightPx = Math.max(...glyphs.map((g) => g.box.height), 24);
  }

    return {
    fullText,
    ...(language !== undefined ? { language } : {}),
    glyphs,
    dominantHeightPx,
    imageWidthPx: sourceWidth,
    imageHeightPx: sourceHeight,
  };
}