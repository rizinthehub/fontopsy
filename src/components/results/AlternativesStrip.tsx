import { AlternativeCard } from './AlternativeCard';
import { EmptyState } from '@/components/feedback/EmptyState';
import { COPY } from '@/lib/copy';
import type { MatchResult } from '@/types';

interface AlternativesStripProps {
  alternatives: MatchResult[];
  text: string;
  size: number;
}

export function AlternativesStrip({
  alternatives,
  text,
  size,
}: AlternativesStripProps) {
  return (
    <section aria-label="Free font alternatives">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-text-primary">
          {COPY['result.alternatives.heading']}{' '}
          <span className="font-mono text-base text-text-tertiary">
            ({alternatives.length})
          </span>
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          {COPY['result.alternatives.subheading']}
        </p>
      </div>

      {alternatives.length === 0 ? (
        <EmptyState
          title="No close matches found"
          message="Not enough similar fonts in our library for this image."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {alternatives.slice(0, 3).map((match) => (
            <AlternativeCard
              key={match.family}
              match={match}
              text={text}
              size={size}
            />
          ))}
        </div>
      )}
    </section>
  );
}