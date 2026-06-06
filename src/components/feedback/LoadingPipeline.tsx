'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { COPY } from '@/lib/copy';

type Stage = 'upload' | 'ocr' | 'match' | 'render';

interface LoadingPipelineProps {
  stage?: Stage;
}

const STAGES: { id: Stage; label: string }[] = [
  { id: 'upload', label: COPY['loading.stage.upload'] },
  { id: 'ocr',    label: COPY['loading.stage.ocr'] },
  { id: 'match',  label: COPY['loading.stage.match'] },
  { id: 'render', label: COPY['loading.stage.render'] },
];

const STAGE_TIMELINE: Stage[] = ['upload', 'ocr', 'match', 'render'];

export function LoadingPipeline({ stage: externalStage }: LoadingPipelineProps) {
  const [stage, setStage] = useState<Stage>('ocr');

  // Auto-advance stages based on timing estimate
  useEffect(() => {
    if (externalStage) {
      setStage(externalStage);
      return;
    }
    const timings: [Stage, number][] = [
      ['ocr',    0],
      ['match',  1500],
      ['render', 2500],
    ];
    const timers = timings.map(([s, delay]) =>
      setTimeout(() => setStage(s), delay),
    );
    return () => timers.forEach(clearTimeout);
  }, [externalStage]);

  const currentIndex = STAGE_TIMELINE.indexOf(stage);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Analyzing image, stage ${currentIndex + 1} of 4: ${stage}`}
      className="flex flex-col items-center justify-center gap-10 py-12 px-6 max-w-lg mx-auto"
    >
      <h2 className="text-xl font-semibold text-text-primary text-center">
        {COPY['loading.title']}
      </h2>

      {/* Stage indicators */}
      <div className="flex items-center gap-0 w-full max-w-sm">
        {STAGES.map((s, i) => {
          const isDone    = STAGE_TIMELINE.indexOf(s.id) < currentIndex;
          const isActive  = s.id === stage;
          const isUpload  = s.id === 'upload';
          const alwaysDone = isUpload; // upload is always done by this point

          return (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              {/* Circle */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-medium transition-all duration-300',
                    (isDone || alwaysDone)
                      ? 'bg-accent text-text-inverse'
                      : isActive
                        ? 'bg-accent/20 border border-accent text-accent'
                        : 'bg-surface border border-border text-text-tertiary',
                  )}
                >
                  {(isDone || alwaysDone) ? '✓' : i + 1}
                </div>
                <span
                  className={cn(
                    'font-mono text-[10px] uppercase tracking-widest',
                    isActive ? 'text-accent' : 'text-text-tertiary',
                  )}
                >
                  {s.label}
                </span>
              </div>

              {/* Connector line */}
              {i < STAGES.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-px mx-1 mb-5 transition-colors duration-300',
                    isDone || alwaysDone ? 'bg-accent' : 'bg-border',
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Pulsing dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-accent"
            style={{
              animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}