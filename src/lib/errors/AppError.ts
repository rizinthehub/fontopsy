import type { ErrorCode } from './codes';

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly status: number;

  constructor(code: ErrorCode, status: number, message?: string) {
    super(message ?? code);
    this.code = code;
    this.status = status;
    this.name = 'AppError';
  }
}