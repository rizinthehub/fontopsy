import { FontPreview } from './FontPreview';
import { FontMeta } from './FontMeta';
import { CopyCSSButton } from './CopyCSSButton';
import type { MatchResult } from '@/types';

interface AlternativeCardProps {
  match: MatchResult;
  text: string;
  size: number;
}

export function AlternativeCard({ match, text, size }: AlternativeCardProps) {
  return (
    <div className="bg-bg-elevated border border-border rounded-lg p-5 flex flex-col gap-3 hover:border-border-strong transition-colors duration-150">
      {/* Mini meta */}
      <FontMeta font={match.font} variant="mini" />

      {/* Preview */}
      <div className="bg-bg-sunken rounded-md px-4 py-6 min-h-[120px] flex items-center">
        <FontPreview
          family={match.family}
          text={text || match.family}
          size={Math.min(size, 48)}
          minHeight={80}
        />
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between gap-2 mt-auto">
        <p className="text-lg font-semibold text-text-primary truncate">
          {match.family}
        </p>
        <CopyCSSButton family={match.family} />
      </div>
    </div>
  );
}