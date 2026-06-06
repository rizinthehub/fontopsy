'use client';

import { useCallback, useRef } from 'react';
import { Input } from '@/components/ui/Input';
import { Slider } from '@/components/ui/Slider';
import { COPY } from '@/lib/copy';
import {
  TYPE_TESTER_MIN_SIZE,
  TYPE_TESTER_MAX_SIZE,
  TYPE_TESTER_STEP,
  TYPE_TESTER_DEBOUNCE_MS,
} from '@/lib/constants';

interface TypeTesterProps {
  value: string;
  onChange: (v: string) => void;
  size: number;
  onSizeChange: (n: number) => void;
}

export function TypeTester({
  value,
  onChange,
  size,
  onSizeChange,
}: TypeTesterProps) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (v: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onChange(v);
      }, TYPE_TESTER_DEBOUNCE_MS);
    },
    [onChange],
  );

  return (
    <div
      className="sticky top-14 z-30 bg-bg-base/90 backdrop-blur-md border-y border-border-subtle py-4"
    >
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
        {/* Text input */}
        <div className="flex-1">
          <Input
            value={value}
            onChange={handleChange}
            placeholder={COPY['result.tester.placeholder']}
            ariaLabel="Type text to preview in all fonts"
            size="lg"
          />
        </div>

        {/* Size control */}
        <div className="flex items-center gap-3 md:w-64 shrink-0">
          <span className="font-mono text-xs text-text-secondary uppercase tracking-widest shrink-0">
            {COPY['result.tester.sizeLabel']}
          </span>
          <div className="flex-1">
            <Slider
              value={size}
              onChange={onSizeChange}
              min={TYPE_TESTER_MIN_SIZE}
              max={TYPE_TESTER_MAX_SIZE}
              step={TYPE_TESTER_STEP}
              label="Preview font size in pixels"
            />
          </div>
          <span className="font-mono text-xs text-text-secondary w-10 text-right shrink-0">
            {size}PX
          </span>
        </div>
      </div>
    </div>
  );
}