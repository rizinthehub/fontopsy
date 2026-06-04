import { LRUCache } from 'lru-cache';
import crypto from 'node:crypto';
import { AppError } from '@/lib/errors/AppError';
import { getVisionClient } from './client';
import { parseResponse, type RawVisionResponse } from './parseResponse';
import { isAtCap, increment } from './usageCounter';
import { VISION_REQUEST_TIMEOUT_MS } from '@/lib/constants';
import type { ParsedVisionResult } from '@/types';
import type { BoundingBox } from '@/types/common';

const cache = new LRUCache<string, ParsedVisionResult>({
  max: 200,
  ttl: 1000 * 60 * 60 * 24, // 24h
});

export function hashImage(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function getImageDimensions(buffer: Buffer): { width: number; height: number } {
  // Read PNG or JPEG dimensions from raw bytes without a heavy dep
  // PNG: bytes 16-24 contain width/height as big-endian uint32
  if (buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    // PNG magic: \x89PNG
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    return { width, height };
  }
  // JPEG / WebP / fallback — return a safe default
  return { width: 1000, height: 1000 };
}

export async function detectText(
  imageBuffer: Buffer,
  region?: BoundingBox,
): Promise<ParsedVisionResult> {
  if (isAtCap()) throw new AppError('RATE_LIMIT', 429);

  const key = hashImage(imageBuffer);
  const cached = cache.get(key);
  if (cached) return cached;

  const dims = getImageDimensions(imageBuffer);

  const imageContext =
    region
      ? {
          cropHintsParams: {
            aspectRatios: [region.width / Math.max(region.height, 0.001)],
          },
        }
      : undefined;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), VISION_REQUEST_TIMEOUT_MS);

  try {
    const [res] = await getVisionClient().textDetection({
      image: { content: imageBuffer.toString('base64') },
      imageContext: { languageHints: ['en'], ...imageContext },
    });

    clearTimeout(timer);

    const parsed = parseResponse(res as RawVisionResponse, dims.width, dims.height);
    cache.set(key, parsed);
    increment();
    return parsed;
  } catch (err) {
    clearTimeout(timer);
    if (err instanceof AppError) throw err;
    throw new AppError('VISION_API_FAILURE', 502, (err as Error).message);
  }
}