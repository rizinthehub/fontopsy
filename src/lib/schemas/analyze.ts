import { z } from 'zod';
import { BoundingBoxSchema, UploadthingUrlSchema } from './common';

export const AnalyzeRequestSchema = z.object({
  imageUrl: UploadthingUrlSchema,
  imageKey: z.string().min(1).max(200),
  region: BoundingBoxSchema.optional(),
  /** Optional manual text fallback when OCR finds nothing. */
  manualText: z.string().max(500).optional(),
});

export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;