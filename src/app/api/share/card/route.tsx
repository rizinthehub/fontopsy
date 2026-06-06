import { ImageResponse } from '@vercel/og';
import { type NextRequest } from 'next/server';
import { decodePayload } from '@/lib/share/encodeResult';
import { AppError } from '@/lib/errors/AppError';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const d = searchParams.get('d');
    if (!d) throw new AppError('INVALID_PAYLOAD', 400, 'Missing d parameter');

    let payload: ReturnType<typeof decodePayload>;
    try {
      payload = decodePayload(d);
    } catch {
      throw new AppError('INVALID_PAYLOAD', 400, 'Invalid payload');
    }

    return new ImageResponse(
      (
        <div
          style={{
            width: 1200,
            height: 630,
            backgroundColor: '#0A0B0D',
            display: 'flex',
            flexDirection: 'column',
            padding: '48px 64px',
            fontFamily: 'sans-serif',
            position: 'relative',
          }}
        >
          {/* Subtle accent glow top-right */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 600,
              height: 400,
              background:
                'radial-gradient(ellipse at top right, rgba(94,234,212,0.08), transparent 60%)',
            }}
          />

          {/* Header row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 40,
            }}
          >
            <span style={{ color: '#5EEAD4', fontSize: 18, fontWeight: 700 }}>
              Fontopsy
            </span>
            <span style={{ color: '#6B7280', fontSize: 14 }}>
              fontopsy.vercel.app
            </span>
          </div>

          {/* Eyebrow */}
          <div
            style={{
              color: '#A8B0BD',
              fontSize: 14,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            FONT IDENTIFIED
          </div>

          {/* Identified font name */}
          <div
            style={{
              color: '#F5F7FA',
              fontSize: 80,
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: 16,
              letterSpacing: '-0.02em',
            }}
          >
            {payload.identifiedFamily}
          </div>

          {/* Meta line */}
          <div
            style={{
              color: '#A8B0BD',
              fontSize: 18,
              marginBottom: 40,
            }}
          >
            {payload.designer} · {payload.category} · {payload.license}
          </div>

          {/* Divider */}
          <div
            style={{
              width: '100%',
              height: 1,
              backgroundColor: '#2A2F38',
              marginBottom: 32,
            }}
          />

          {/* Alternatives section */}
          {payload.alternatives.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div
                style={{
                  color: '#6B7280',
                  fontSize: 12,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                FREE ALTERNATIVES
              </div>
              <div style={{ display: 'flex', gap: 24 }}>
                {payload.alternatives.map((alt) => (
                  <div
                    key={alt}
                    style={{
                      backgroundColor: '#1A1D24',
                      border: '1px solid #2A2F38',
                      borderRadius: 8,
                      padding: '12px 20px',
                      color: '#F5F7FA',
                      fontSize: 22,
                      fontWeight: 600,
                    }}
                  >
                    {alt}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom brand mark */}
          <div
            style={{
              position: 'absolute',
              bottom: 48,
              right: 64,
              color: '#4A5160',
              fontSize: 14,
            }}
          >
            🔬 Fontopsy
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, immutable, max-age=31536000',
        },
      },
    );
  } catch (err) {
    if (err instanceof AppError) {
      return new Response(
        JSON.stringify({ error: { code: err.code, message: err.message } }),
        { status: err.status, headers: { 'Content-Type': 'application/json' } },
      );
    }
    return new Response(
      JSON.stringify({ error: { code: 'RENDER_FAILURE', message: 'Failed to render card' } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}