import { z } from 'zod';

export const BoundingBoxSchema = z
  .object({
    x: z.number().min(0).max(1),
    y: z.number().min(0).max(1),
    width: z.number().min(0).max(1),
    height: z.number().min(0).max(1),
  })
  .refine((b) => b.x + b.width <= 1.0001, {
    message: 'x + width must be <= 1',
  })
  .refine((b) => b.y + b.height <= 1.0001, {
    message: 'y + height must be <= 1',
  });

export const ShortIdSchema = z.string().regex(/^[A-Za-z0-9_-]{10}$/);

/** Uploadthing URL allowlist — prevents SSRF attacks. */
export const UploadthingUrlSchema = z
  .string()
  .regex(
    /^https:\/\/([a-z0-9]+\.ufs\.sh|utfs\.io)\/f\/[A-Za-z0-9._-]+$/,
    'Must be a valid uploadthing URL',
  );