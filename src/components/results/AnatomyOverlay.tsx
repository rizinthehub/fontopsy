'use client';

import { useRef, useEffect, useState, memo } from 'react';
import { ANATOMY_TERMS, ANATOMY_TERM_ORDER } from '@/lib/fonts/anatomyTerms';
import type { AnatomyTerm } from '@/lib/fonts/anatomyTerms';
import type { FontMetrics } from '@/types';

interface AnatomyOverlayProps {
  metrics: FontMetrics;
  fontSize: number;
  visible: boolean;
  activeTerm?: AnatomyTerm;
  onHoverTerm?: (term: AnatomyTerm | null) => void;
  onClickTerm?: (term: AnatomyTerm) => void;
}

interface LinePositions {
  ascender: number;
  capHeight: number;
  xHeight: number;
  baseline: number;
  descender: number;
  containerHeight: number;
}

function computePositions(
  metrics: FontMetrics,
  fontSize: number,
  containerHeight: number,
): LinePositions {
  const scaleFactor = fontSize * 0.85;
  const baselineY = containerHeight * 0.72;

  return {
    ascender:    baselineY - metrics.ascenderRatio    * scaleFactor,
    capHeight:   baselineY - metrics.capHeightRatio   * scaleFactor,
    xHeight:     baselineY - metrics.xHeightRatio     * scaleFactor,
    baseline:    baselineY,
    descender:   baselineY + metrics.descenderRatio   * scaleFactor,
    containerHeight,
  };
}

export const AnatomyOverlay = memo(function AnatomyOverlay({
  metrics,
  fontSize,
  visible,
  activeTerm,
  onHoverTerm,
  onClickTerm,
}: AnatomyOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<LinePositions | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const h = el.offsetHeight;
      const w = el.offsetWidth;
      setPositions(computePositions(metrics, fontSize, h));
      setWidth(w);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [metrics, fontSize]);

  const termKeys = ANATOMY_TERM_ORDER;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden={!visible}
    >
      {visible && positions && width > 0 && (
        <svg
          className="absolute inset-0 w-full h-full overflow-visible"
          viewBox={`0 0 ${width} ${positions.containerHeight}`}
          preserveAspectRatio="none"
          role="img"
          aria-label="Typographic anatomy diagram with 5 reference lines"
        >
          {termKeys.map((term, i) => {
            const info = ANATOMY_TERMS[term];
            const y = positions[term];
            const color = `var(${info.color})`;
            const isDashed = term === 'descender';
            const isActive = activeTerm === term;

            return (
              <g
                key={term}
                style={{
                  opacity: 0,
                  animation: `fadeIn 300ms ease-out ${i * 60}ms forwards`,
                }}
              >
                {/* The metric line */}
                <line
                  x1={16}
                  y1={y}
                  x2={width - 16}
                  y2={y}
                  stroke={color}
                  strokeWidth={isActive ? 1.5 : 1}
                  strokeDasharray={isDashed ? '4 2' : undefined}
                  opacity={isActive ? 1 : 0.7}
                />
              </g>
            );
          })}
        </svg>
      )}

      {/* Label chips — HTML overlaid for keyboard accessibility */}
      {visible && positions && width > 0 && termKeys.map((term) => {
        const info = ANATOMY_TERMS[term];
        const y = positions[term];
        const color = `var(${info.color})`;
        const isActive = activeTerm === term;

        return (
          <button
            key={term}
            type="button"
            aria-label={`Highlight ${info.label} definition`}
            aria-pressed={isActive}
            onClick={() => onClickTerm?.(term)}
            onMouseEnter={() => onHoverTerm?.(term)}
            onMouseLeave={() => onHoverTerm?.(null)}
            className="pointer-events-auto absolute right-4 flex items-center gap-1.5 px-1.5 py-0.5 rounded-xs border border-border-subtle bg-bg-sunken/90 hover:bg-bg-overlay cursor-pointer transition-colors"
            style={{ top: y - 10 }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: color }}
            />
            <span
              className="font-mono text-[10px] font-medium uppercase tracking-wide"
              style={{ color }}
            >
              {info.label}
            </span>
          </button>
        );
      })}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
});