import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merges Tailwind classes safely without conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format bytes into a human-readable string (e.g. "4.2 MB"). */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = sizes[i];
  if (!size) return `${bytes} B`;
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${size}`;
}

/** Returns the median of a number array. Returns 0 for empty arrays. */
export function median(nums: number[]): number {
  if (nums.length === 0) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 !== 0) {
    return sorted[mid] ?? 0;
  }
  const lo = sorted[mid - 1] ?? 0;
  const hi = sorted[mid] ?? 0;
  return (lo + hi) / 2;
}

/** Converts a font family name to kebab-case for filenames. */
export function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/** Validates that a URL is from Uploadthing's CDN. */
export function assertUploadthingUrl(url: string): void {
  if (!/^https:\/\/utfs\.io\/f\/[A-Za-z0-9._-]+$/.test(url)) {
    throw new Error('INVALID_IMAGE_URL');
  }
}

/**
 * Fetches image bytes from a URL with a size cap.
 * Throws AppError if too large or wrong MIME type.
 */
export async function fetchImageBytes(url: string): Promise<Buffer> {
  const { MAX_UPLOAD_BYTES, ACCEPTED_MIME_TYPES } = await import('@/lib/constants');
  const { AppError } = await import('@/lib/errors/AppError');

  const res = await fetch(url);
  if (!res.ok) {
    throw new AppError('INVALID_IMAGE_URL', 400, `Failed to fetch image: ${res.status}`);
  }

  const contentType = res.headers.get('content-type') ?? '';
  const mimeType = contentType.split(';')[0]?.trim() ?? '';
  if (!ACCEPTED_MIME_TYPES.includes(mimeType as (typeof ACCEPTED_MIME_TYPES)[number])) {
    throw new AppError('UNSUPPORTED_FORMAT', 415, `Unsupported MIME type: ${mimeType}`);
  }

  const chunks: Uint8Array[] = [];
  let totalSize = 0;
  const reader = res.body?.getReader();
  if (!reader) throw new AppError('INTERNAL', 500, 'No response body');

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      totalSize += value.length;
      if (totalSize > MAX_UPLOAD_BYTES) {
        await reader.cancel();
        throw new AppError('IMAGE_TOO_LARGE', 413, 'Image exceeds 4MB limit');
      }
      chunks.push(value);
    }
  }

  return Buffer.concat(chunks.map((c) => Buffer.from(c)));
}