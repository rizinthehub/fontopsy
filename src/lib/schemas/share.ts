import { z } from 'zod';

export const ShareCardPayloadSchema = z.object({
  id: z.string(),
  identifiedFamily: z.string().min(1).max(60),
  designer: z.string().max(120),
  category: z.enum([
    'serif',
    'sans-serif',
    'display',
    'handwriting',
    'monospace',
  ]),
  license: z.enum(['OFL', 'Apache-2.0', 'UFL', 'MIT']),
  alternatives: z.array(z.string().min(1).max(60)).max(3),
  v: z.literal(1),
});

export type ShareCardPayload = z.infer<typeof ShareCardPayloadSchema>;