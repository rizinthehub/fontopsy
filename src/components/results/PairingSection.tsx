import { PairingCard } from './PairingCard';
import { COPY } from '@/lib/copy';
import type { PairingSuggestion } from '@/types';

interface PairingSectionProps {
  pairings: PairingSuggestion[];
}

export function PairingSection({ pairings }: PairingSectionProps) {
  if (pairings.length === 0) return null;

  return (
    <section aria-label="Font pairing suggestions">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-text-primary">
          {COPY['result.pairings.heading']}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pairings.map((pairing) => (
          <PairingCard
            key={`${pairing.display.family}-${pairing.body.family}`}
            pairing={pairing}
          />
        ))}
      </div>
    </section>
  );
}