import type { AnalysisResult } from '@/types';
import { encodePayload } from './encodeResult';

export function buildCardUrl(result: AnalysisResult): string {
  const payload = {
    id: result.id,
    identifiedFamily: result.identified.family,
    designer: result.identified.font.designer,
    category: result.identified.font.category,
    license: result.identified.font.license,
    alternatives: result.alternatives.slice(0, 3).map((a) => a.family),
    v: 1 as const,
  };
  const encoded = encodePayload(payload);
  const base = process.env['NEXT_PUBLIC_APP_URL'] ?? 'http://localhost:3000';
  return `${base}/api/share/card?d=${encoded}`;
}