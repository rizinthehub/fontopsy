import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { AppError } from './AppError';
import { ErrorCode } from './codes';

export function handleApiError(err: unknown): NextResponse {
  // Known application error
  if (err instanceof AppError) {
    return NextResponse.json(
      {
        error: {
          code: err.code,
          message: err.message,
        },
      },
      { status: err.status },
    );
  }

  // Zod validation error
  if (err instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          code: ErrorCode.INVALID_REQUEST,
          message: 'Invalid request data.',
          details: process.env.NODE_ENV !== 'production' ? err.flatten() : undefined,
        },
      },
      { status: 400 },
    );
  }

  // Unknown error — log server-side, return generic response
  console.error('[Fontopsy] Unhandled API error:', err);
  return NextResponse.json(
    {
      error: {
        code: ErrorCode.INTERNAL,
        message: 'An unexpected error occurred.',
      },
    },
    { status: 500 },
  );
}