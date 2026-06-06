import { DownloadPNGButton } from './DownloadPNGButton';
import { CopyLinkButton } from './CopyLinkButton';
import type { AnalysisResult } from '@/types';

interface ShareBarProps {
  result: AnalysisResult;
}

export function ShareBar({ result }: ShareBarProps) {
  return (
    <>
      {/* Desktop: inline */}
      <div className="hidden md:flex items-center justify-end gap-3">
        <CopyLinkButton />
        <DownloadPNGButton result={result} />
      </div>

      {/* Mobile: fixed bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-bg-base/95 backdrop-blur-md border-t border-border-subtle px-4 py-3 flex gap-3">
        <div className="flex-1">
          <CopyLinkButton />
        </div>
        <div className="flex-1">
          <DownloadPNGButton result={result} />
        </div>
      </div>
    </>
  );
}