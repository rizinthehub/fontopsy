'use client';

import { useState, useCallback } from 'react';
import { useUploadThing } from '@/lib/upload/uploadthing';
import { useAnalyze } from './useAnalyze';
import { MAX_UPLOAD_BYTES, ACCEPTED_MIME_TYPES } from '@/lib/constants';
import type { BoundingBox } from '@/types/common';
import type { AnalysisResult } from '@/types';

export type UploadStatus =
  | 'idle'
  | 'uploading'
  | 'ready'
  | 'analyzing'
  | 'error';

export interface UploadResult {
  url: string;
  key: string;
}

export interface UploadFlowState {
  status: UploadStatus;
  progress: number;
  upload?: UploadResult;
  region?: BoundingBox;
  error?: string;
}

export function useUploadFlow() {
  const [state, setState] = useState<UploadFlowState>({
    status: 'idle',
    progress: 0,
  });

  const { mutate: analyze } = useAnalyze();

  const { startUpload } = useUploadThing('imageUploader', {
    onUploadProgress: (p) => {
      setState((s) => ({ ...s, progress: p }));
    },
    onClientUploadComplete: (res) => {
      const file = res?.[0];
      if (!file) {
        setState((s) => ({
          ...s,
          status: 'error',
          error: 'Upload completed but no file returned.',
        }));
        return;
      }
      setState((s) => ({
        ...s,
        status: 'ready',
        progress: 100,
        upload: { url: file.url, key: file.key },
      }));
    },
    onUploadError: (err) => {
      setState((s) => ({
        ...s,
        status: 'error',
        error: err.message ?? 'Upload failed.',
      }));
    },
  });

  const dropFile = useCallback(
    async (file: File) => {
      // Validate
      if (file.size > MAX_UPLOAD_BYTES) {
        setState((s) => ({
          ...s,
          status: 'error',
          error: 'too-large',
        }));
        return;
      }
      if (!ACCEPTED_MIME_TYPES.includes(file.type as (typeof ACCEPTED_MIME_TYPES)[number])) {
        setState((s) => ({
          ...s,
          status: 'error',
          error: 'bad-type',
        }));
        return;
      }

      setState({ status: 'uploading', progress: 0 });
      await startUpload([file]);
    },
    [startUpload],
  );

      const setRegion = useCallback((region: BoundingBox | null) => {
    if (region) {
      setState((s) => ({ ...s, region }));
    } else {
      setState((s) => {
        const next: UploadFlowState = {
          status: s.status,
          progress: s.progress,
          ...(s.upload ? { upload: s.upload } : {}),
          ...(s.error ? { error: s.error } : {}),
        };
        return next;
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ status: 'idle', progress: 0 });
  }, []);

  const runAnalysis = useCallback(
    async (manualText?: string): Promise<AnalysisResult> => {
      const { upload, region } = state;
      if (!upload) throw new Error('No upload available');

      setState((s) => ({ ...s, status: 'analyzing' }));
      try {
        const result = await analyze({
          imageUrl: upload.url,
          imageKey: upload.key,
          ...(region ? { region } : {}),
          ...(manualText ? { manualText } : {}),
        });
        return result;
      } catch (err) {
        setState((s) => ({ ...s, status: 'error', error: (err as Error).message }));
        throw err;
      }
    },
    [state, analyze],
  );

  return { state, dropFile, setRegion, reset, runAnalysis };
}