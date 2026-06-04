import { z } from 'zod';

const EnvSchema = z.object({
  GOOGLE_VISION_CREDENTIALS_B64: z.string().min(1),
  GOOGLE_FONTS_API_KEY: z.string().min(1).optional(),
  UPLOADTHING_TOKEN: z.string().min(1),
  UPLOADTHING_SECRET: z.string().min(1).optional(),
  NEXT_PUBLIC_APP_URL: z.string().min(1),
  NEXT_PUBLIC_VERCEL_ANALYTICS_ID: z.string().optional(),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

export type Env = z.infer<typeof EnvSchema>;

// Lazy singleton — only parsed on first access, not at import time
let _env: Env | null = null;

export function getEnv(): Env {
  if (_env) return _env;
  _env = EnvSchema.parse(process.env);
  return _env;
}

// Convenience proxy — keeps existing `env.VARIABLE` usage working
export const env = new Proxy({} as Env, {
  get(_target, prop: string) {
    return getEnv()[prop as keyof Env];
  },
});