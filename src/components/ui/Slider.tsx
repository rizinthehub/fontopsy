'use client';

import * as RadixSlider from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  label: string;
  className?: string;
}

export function Slider({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
  className,
}: SliderProps) {
  return (
    <RadixSlider.Root
      value={[value]}
      onValueChange={([v]) => v !== undefined && onChange(v)}
      min={min}
      max={max}
      step={step}
      aria-label={label}
      className={cn('relative flex items-center select-none touch-none w-full h-5', className)}
    >
      <RadixSlider.Track className="bg-surface relative grow rounded-full h-1">
        <RadixSlider.Range className="absolute bg-accent rounded-full h-full" />
      </RadixSlider.Track>
      <RadixSlider.Thumb
        className={cn(
          'block w-[18px] h-[18px] bg-text-primary rounded-full border-2 border-accent',
          'hover:shadow-[0_0_0_4px_var(--color-accent-glow)]',
          'focus:outline-none focus:shadow-[0_0_0_4px_var(--color-accent-glow)]',
          'active:scale-110 transition-all duration-100',
        )}
      />
    </RadixSlider.Root>
  );
}