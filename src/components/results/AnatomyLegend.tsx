'use client';

import { useState } from 'react';
import { ANATOMY_TERMS, ANATOMY_TERM_ORDER } from '@/lib/fonts/anatomyTerms';
import type { AnatomyTerm } from '@/lib/fonts/anatomyTerms';
import type { FontMetrics } from '@/types';

interface AnatomyLegendProps {
  metrics: FontMetrics;
  activeTerm?: AnatomyTerm;
  onTermClick: (term: AnatomyTerm) => void;
}

export function AnatomyLegend({
  metrics,
  activeTerm,
  onTermClick,
}: AnatomyLegendProps) {
  const [expanded, setExpanded] = useState<AnatomyTerm | null>(null);

  const handleClick = (term: AnatomyTerm) => {
    setExpanded((prev) => (prev === term ? null : term));
    onTermClick(term);
  };

  return (
    <div className="bg-bg-overlay rounded-md border border-border-subtle p-5">
      <p className="font-mono text-xs uppercase tracking-widest text-text-secondary mb-4">
        ANATOMY
      </p>

      <div className="space-y-0">
        {ANATOMY_TERM_ORDER.map((term, i) => {
          const info = ANATOMY_TERMS[term];
          const color = `var(${info.color})`;
          const isExpanded = expanded === term;
          const isActive = activeTerm === term;

          // Show metric value
          const metricValue = (() => {
            switch (term) {
              case 'xHeight':   return metrics.xHeightRatio.toFixed(2);
              case 'capHeight': return metrics.capHeightRatio.toFixed(2);
              case 'ascender':  return metrics.ascenderRatio.toFixed(2);
              case 'descender': return metrics.descenderRatio.toFixed(2);
              case 'baseline':  return '0.00';
            }
          })();

          return (
            <div key={term}>
              {i > 0 && <div className="border-t border-border-subtle" />}
                            <button
                type="button"
                aria-expanded={isExpanded}
                onClick={() => handleClick(term)}
                className={`w-full flex items-center gap-3 py-2.5 text-left transition-colors duration-150 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
                  ${isActive ? 'bg-accent/5' : 'hover:bg-bg-base/50'}`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="flex-1 text-sm font-medium text-text-primary">
                  {info.label}
                </span>
                <span className="font-mono text-xs text-text-tertiary">
                  {metricValue}
                </span>
              </button>

              {isExpanded && (
                <p className="text-xs text-text-secondary pb-2.5 pl-5 pr-2 leading-relaxed">
                  {info.definition}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}