'use client';

import { useDropzone as useReactDropzone } from 'react-dropzone';
import { MAX_UPLOAD_BYTES, ACCEPTED_MIME_TYPES } from '@/lib/constants';

interface UseDropzoneOptions {
  onDrop: (file: File) => void;
  onReject?: (reason: 'too-large' | 'bad-type') => void;
}

export function useDropzone({ onDrop, onReject }: UseDropzoneOptions) {
  const accept = Object.fromEntries(
    ACCEPTED_MIME_TYPES.map((mime) => [mime, []]),
  ) as Record<string, string[]>;

  return useReactDropzone({
    accept,
    maxSize: MAX_UPLOAD_BYTES,
    maxFiles: 1,
    multiple: false,
    onDropAccepted: (files) => {
      const file = files[0];
      if (file) onDrop(file);
    },
    onDropRejected: (rejections) => {
      const rejection = rejections[0];
      if (!rejection) return;
      const isTooLarge = rejection.errors.some((e) => e.code === 'file-too-large');
      onReject?.(isTooLarge ? 'too-large' : 'bad-type');
    },
    noClick: true,  // We control click ourselves via Button
    noKeyboard: true,
  });
}