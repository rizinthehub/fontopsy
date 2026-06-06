import { Spinner } from '@/components/ui/Spinner';
import { COPY } from '@/lib/copy';

interface UploadProgressProps {
  progress: number;
}

export function UploadProgress({ progress }: UploadProgressProps) {
  const label = COPY['upload.uploading'].replace(
    '{progress}',
    String(Math.round(progress)),
  );

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12 px-6">
      <Spinner size="lg" />
      <div className="w-full max-w-xs space-y-2">
        <p className="text-sm text-text-secondary text-center">{label}</p>
        <div className="w-full h-1 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>
    </div>
  );
}