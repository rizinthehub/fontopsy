import { describe, it, expect } from 'vitest';
import { AppError } from '@/lib/errors/AppError';
import { ErrorCode } from '@/lib/errors/codes';

describe('AppError', () => {
  it('constructs with code and status', () => {
    const err = new AppError('NO_TEXT_FOUND', 422);
    expect(err.code).toBe('NO_TEXT_FOUND');
    expect(err.status).toBe(422);
    expect(err.message).toBe('NO_TEXT_FOUND');
    expect(err.name).toBe('AppError');
  });

  it('uses custom message when provided', () => {
    const err = new AppError('INTERNAL', 500, 'Custom message');
    expect(err.message).toBe('Custom message');
  });

  it('is an instance of Error', () => {
    const err = new AppError('RATE_LIMIT', 429);
    expect(err instanceof Error).toBe(true);
  });

  it('is an instance of AppError', () => {
    const err = new AppError('RATE_LIMIT', 429);
    expect(err instanceof AppError).toBe(true);
  });
});

describe('ErrorCode', () => {
  it('contains all expected codes', () => {
    const expected = [
      'INVALID_REQUEST',
      'INVALID_IMAGE_URL',
      'IMAGE_TOO_LARGE',
      'UNSUPPORTED_FORMAT',
      'NO_TEXT_FOUND',
      'RATE_LIMIT',
      'VISION_API_FAILURE',
      'INVALID_PAYLOAD',
      'RENDER_FAILURE',
      'INTERNAL',
    ];
    expected.forEach((code) => {
      expect(ErrorCode).toHaveProperty(code);
    });
  });

  it('has matching key and value for each code', () => {
    Object.entries(ErrorCode).forEach(([key, value]) => {
      expect(key).toBe(value);
    });
  });
});