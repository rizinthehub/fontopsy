'use client';

import { useState, useRef, useCallback } from 'react';
import { IconButton } from '@/components/ui/IconButton';
import { Icon } from '@/components/ui/Icon';
import type { BoundingBox } from '@/types/common';

interface RegionSelectorProps {
  onChange: (region: BoundingBox | null) => void;
}

interface DragState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

export function RegionSelector({ onChange }: RegionSelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [region, setRegion] = useState<BoundingBox | null>(null);

  const getRelative = useCallback(
    (clientX: number, clientY: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      return {
        x: Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1),
        y: Math.min(Math.max((clientY - rect.top) / rect.height, 0), 1),
      };
    },
    [],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      const { x, y } = getRelative(e.clientX, e.clientY);
      setDragging(true);
      setDrag({ startX: x, startY: y, currentX: x, currentY: y });
      setRegion(null);
      onChange(null);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [getRelative, onChange],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging || !drag) return;
      const { x, y } = getRelative(e.clientX, e.clientY);
      setDrag((d) => (d ? { ...d, currentX: x, currentY: y } : null));
    },
    [dragging, drag, getRelative],
  );

  const onPointerUp = useCallback(() => {
    if (!drag) return;
    setDragging(false);
    const x = Math.min(drag.startX, drag.currentX);
    const y = Math.min(drag.startY, drag.currentY);
    const width = Math.abs(drag.currentX - drag.startX);
    const height = Math.abs(drag.currentY - drag.startY);
    if (width < 0.02 || height < 0.02) {
      setDrag(null);
      return;
    }
    const box: BoundingBox = { x, y, width, height };
    setRegion(box);
    onChange(box);
    setDrag(null);
  }, [drag, onChange]);

  const clearRegion = useCallback(() => {
    setRegion(null);
    setDrag(null);
    onChange(null);
  }, [onChange]);

  // Compute pixel rect for the selection overlay
  const selectionStyle = (() => {
    const d = drag ?? (region ? { startX: region.x, startY: region.y, currentX: region.x + region.width, currentY: region.y + region.height } : null);
    if (!d) return null;
    const x = Math.min(d.startX, d.currentX) * 100;
    const y = Math.min(d.startY, d.currentY) * 100;
    const w = Math.abs(d.currentX - d.startX) * 100;
    const h = Math.abs(d.currentY - d.startY) * 100;
    return { left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` };
  })();

  const displayRegion = region ?? (drag ? {
    x: Math.min(drag.startX, drag.currentX),
    y: Math.min(drag.startY, drag.currentY),
    width: Math.abs(drag.currentX - drag.startX),
    height: Math.abs(drag.currentY - drag.startY),
  } : null);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 cursor-crosshair z-10"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      role="application"
      aria-label="Drag to select text region. Optional."
    >
      {/* Dark mask outside selection */}
      {selectionStyle && (
        <>
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />
          <div
            className="absolute border border-accent bg-accent/10 pointer-events-none"
            style={selectionStyle}
          >
            {/* Corner handles */}
            {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos) => (
              <div
                key={pos}
                className={`absolute w-2 h-2 bg-accent ${pos}`}
              />
            ))}
            {/* Dimensions readout */}
            {displayRegion && (
              <div className="absolute -top-6 right-0 font-mono text-[10px] text-text-primary bg-bg-overlay/90 px-1.5 py-0.5 rounded-xs whitespace-nowrap">
                {Math.round(displayRegion.width * 100)}% × {Math.round(displayRegion.height * 100)}%
              </div>
            )}
          </div>
          {/* Clear button */}
          {region && (
            <div
              className="absolute bottom-2 right-2 pointer-events-auto"
              onClick={(e) => { e.stopPropagation(); clearRegion(); }}
            >
              <IconButton
                icon={<Icon name="x" size={14} />}
                label="Clear region selection"
                variant="solid"
                size="sm"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}