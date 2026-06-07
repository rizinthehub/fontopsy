import { type NextRequest, NextResponse } from 'next/server';
import { AnalyzeRequestSchema } from '@/lib/schemas/analyze';
import { AppError } from '@/lib/errors/AppError';
import { handleApiError } from '@/lib/errors/handle';
import { checkIpLimit } from '@/lib/errors/rateLimit';
import { detectText } from '@/lib/vision/detectText';
import { buildAnalysisResult } from '@/lib/matching/buildResult';
import { fetchImageBytes } from '@/lib/utils';

export const runtime = 'nodejs';
export const maxDuration = 10;

export async function POST(req: NextRequest) {
  try {
    // IP rate limit
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anon';
    const limit = checkIpLimit(ip);
    if (!limit.ok) {
      throw new AppError('RATE_LIMIT', 429, 'Too many requests. Please wait a minute.');
    }

    // Validate request body
    const body = AnalyzeRequestSchema.parse(await req.json());

    // Fetch image bytes (validates URL domain, MIME type, size)
    const imageBuffer = await fetchImageBytes(body.imageUrl);

    // OCR
        // OCR
    let vision;
    try {
      vision = await detectText(imageBuffer, body.region);
    } catch (visionErr) {
      console.error('[Vision Error]', JSON.stringify(visionErr, Object.getOwnPropertyNames(visionErr as object)));
      throw visionErr;
    }

    // Determine text to match against
    const text = (body.manualText ?? vision.fullText).trim();
    if (!text) {
      throw new AppError('NO_TEXT_FOUND', 422, 'No text could be extracted from this image.');
    }

    // Build full result
    const result = buildAnalysisResult({
      imageUrl: body.imageUrl,
      imageKey: body.imageKey,
      region: body.region ?? null,
      text,
      textSource: body.manualText ? 'manual' : 'ocr',
      vision,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    return handleApiError(err);
  }
}