import { FontPreview } from './FontPreview';
import { PairingLabel } from './PairingLabel';
import { Divider } from '@/components/ui/Divider';
import type { PairingSuggestion } from '@/types';

interface PairingCardProps {
  pairing: PairingSuggestion;
}

export function PairingCard({ pairing }: PairingCardProps) {
  return (
    <div className="bg-bg-elevated border border-border rounded-lg p-6 flex flex-col gap-0">
      {/* Tone label */}
      <div className="mb-4">
        <PairingLabel tone={pairing.tone} />
      </div>

      {/* Display font preview */}
      <div className="bg-bg-sunken rounded-md px-4 py-5">
        <FontPreview
          family={pairing.display.family}
          text="Aa Bb Cc 123"
          size={40}
          weight={700}
          minHeight={56}
        />
      </div>

      <Divider className="my-4" />

      {/* Body font preview */}
      <div className="bg-bg-sunken rounded-md px-4 py-4">
        <FontPreview
          family={pairing.body.family}
          text="The quick brown fox jumps over the lazy dog."
          size={16}
          weight={400}
          minHeight={48}
        />
      </div>

      {/* Attribution */}
      <div className="mt-4 space-y-1">
        <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-widest">
          Display: {pairing.display.family}
        </p>
        <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-widest">
          Body: {pairing.body.family}
        </p>
        {pairing.rationale && (
          <p className="text-xs text-text-secondary mt-2 leading-relaxed">
            {pairing.rationale}
          </p>
        )}
      </div>
    </div>
  );
}