'use client';

import { useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from '@/lib/hooks/useDropzone';
import { usePasteImage } from '@/lib/hooks/usePasteImage';
import { useUploadFlow } from '@/lib/hooks/useUploadFlow';
import { setResult } from '@/lib/storage/resultMap';
import { saveResult, addRecentEntry } from '@/lib/storage/recentAnalyses';
import { DropPrompt } from './DropPrompt';
import { UploadProgress } from './UploadProgress';
import { ImagePreview } from './ImagePreview';
import { ErrorState } from '@/components/feedback/ErrorState';
import { cn } from '@/lib/utils';
import { COPY } from '@/lib/copy';

export function UploadZone() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { state, dropFile, setRegion, reset, runAnalysis } = useUploadFlow();

  const handleFile = useCallback(
    (file: File) => {
      void dropFile(file);
    },
    [dropFile],
  );

  const handleReject = useCallback((reason: 'too-large' | 'bad-type') => {
    // Errors are handled via state.error; we trigger through dropFile
    const fakeFile = new File([], 'rejected', {
      type: reason === 'too-large' ? 'image/jpeg' : 'text/plain',
    });
    void dropFile(fakeFile);
  }, [dropFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFile,
    onReject: handleReject,
  });

  usePasteImage(handleFile);

  const handleBrowse = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = '';
    },
    [handleFile],
  );

  const handleAnalyze = useCallback(async () => {
    try {
      const result = await runAnalysis();
      setResult(result);
      saveResult(result);
      addRecentEntry({
        id: result.id,
        family: result.identified.family,
        category: result.identified.font.category,
        thumbnailUrl: result.imageUrl,
        createdAt: result.createdAt,
      });
      router.push(`/result/${result.id}`);
    } catch {
      // Error state is handled by useUploadFlow/useAnalyze
    }
  }, [runAnalysis, router]);

  const errorMessage = (() => {
    if (!state.error) return null;
    if (state.error === 'too-large') return COPY['upload.error.tooLarge'];
    if (state.error === 'bad-type') return COPY['upload.error.unsupportedFormat'];
    return COPY['upload.error.uploadFailed'];
  })();

  return (
    <div
            {...getRootProps()}
      role="button"
      tabIndex={0}
      aria-label="Upload image — drag, drop, paste, or click to browse"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleBrowse();
        }
      }}
      className={cn(
        'relative w-full min-h-[320px] md:min-h-[320px] rounded-lg border-2 border-dashed transition-all duration-150',
        'bg-bg-elevated',
        isDragActive
          ? 'border-accent bg-accent/5'
          : 'border-border hover:border-border-strong hover:bg-bg-overlay',
        state.status === 'ready' && 'border-solid border-border min-h-0',
      )}
    >
      {/* Hidden inputs */}
      <input {...getInputProps()} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileInput}
        aria-label="Upload image — drag, drop, paste, or click to browse"
      />

      {/* State-driven content */}
      {state.status === 'idle' && (
        <DropPrompt onBrowse={handleBrowse} isDragging={isDragActive} />
      )}

      {state.status === 'uploading' && (
        <UploadProgress progress={state.progress} />
      )}

      {state.status === 'ready' && state.upload && (
        <div className="p-4">
          <ImagePreview
            src={state.upload.url}
            onReset={reset}
            onRegionChange={setRegion}
            onAnalyze={() => void handleAnalyze()}
            analyzing={false}
          />
        </div>
      )}

      {state.status === 'analyzing' && state.upload && (
        <div className="p-4">
          <ImagePreview
            src={state.upload.url}
            onReset={reset}
            onRegionChange={setRegion}
            onAnalyze={() => void handleAnalyze()}
            analyzing={true}
          />
        </div>
      )}

      {state.status === 'error' && (
        <div className="flex items-center justify-center min-h-[320px]">
          <ErrorState
            title="Upload failed"
            message={errorMessage ?? COPY['upload.error.uploadFailed']}
            action={{ label: 'Try Again', onClick: reset }}
          />
        </div>
      )}
    </div>
  );
}