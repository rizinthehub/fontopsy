import { z } from 'zod';

const EnvSchema = z.object({
  GOOGLE_VISION_CREDENTIALS_B64: z.string().min(1),
  GOOGLE_FONTS_API_KEY: z.string().min(1).optional(),
  UPLOADTHING_TOKEN: z.string().min(1),
  UPLOADTHING_SECRET: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_VERCEL_ANALYTICS_ID: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export const env = EnvSchema.parse(process.env);