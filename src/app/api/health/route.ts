import { getUsage } from '@/lib/vision/usageCounter';

export const runtime = 'nodejs';

export async function GET() {
  const usage = getUsage();
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    visionUsage: usage,
  });
}