import type { ShareCardPayload } from '@/types';
import { ShareCardPayloadSchema } from '@/lib/schemas/share';

export function encodePayload(payload: ShareCardPayload): string {
  const json = JSON.stringify(payload);
  const b64 = Buffer.from(json, 'utf-8').toString('base64');
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodePayload(s: string): ShareCardPayload {
  let b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  const json = Buffer.from(b64, 'base64').toString('utf-8');
  return ShareCardPayloadSchema.parse(JSON.parse(json));
}