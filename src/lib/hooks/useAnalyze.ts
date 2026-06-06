'use client';

import { useState, useCallback } from 'react';
import { AppError } from '@/lib/errors/AppError';
import type { ErrorCode } from '@/lib/errors/codes';
import type { AnalysisResult } from '@/types';
import type { AnalyzeRequest } from '@/lib/schemas/analyze';

type Status = 'idle' | 'pending' | 'success' | 'error';

export function useAnalyze() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<AppError | null>(null);

  const mutate = useCallback(
    async (body: AnalyzeRequest): Promise<AnalysisResult> => {
      if (status === 'pending') {
        throw new AppError('INTERNAL', 500, 'Analysis already in progress');
      }
      setStatus('pending');
      setError(null);

      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const data = (await res.json()) as {
            error: { code: string; message: string };
          };
          const err = new AppError(
                        data.error.code as ErrorCode,
            res.status,
            data.error.message,
          );
          setError(err);
          setStatus('error');
          throw err;
        }

        const result = (await res.json()) as AnalysisResult;
        setStatus('success');
        return result;
      } catch (err) {
        if (err instanceof AppError) throw err;
        const wrapped = new AppError('INTERNAL', 500, (err as Error).message);
        setError(wrapped);
        setStatus('error');
        throw wrapped;
      }
    },
    [status],
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
  }, []);

  return { mutate, status, error, reset };
}