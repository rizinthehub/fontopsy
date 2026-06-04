import { ImageAnnotatorClient } from '@google-cloud/vision';
import { env } from '@/lib/env';

let client: ImageAnnotatorClient | null = null;

export function getVisionClient(): ImageAnnotatorClient {
  if (client) return client;

  const creds = JSON.parse(
    Buffer.from(env.GOOGLE_VISION_CREDENTIALS_B64, 'base64').toString('utf-8'),
  ) as Record<string, unknown>;

  client = new ImageAnnotatorClient({ credentials: creds });
  return client;
}