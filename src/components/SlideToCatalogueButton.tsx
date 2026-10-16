import React, { useState, useRef, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';

interface SlideToCatalogueButtonProps {
  onSlideComplete: () => void;
  label?: string;
  className?: string;
}

export const SlideToCatalogueButton: React.FC<SlideToCatalogueButtonProps> = ({
  onSlideComplete,
  label = 'Catalogue',
  className = '',
}) => {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const currentDragRef = useRef(0);
  const pointerIdRef = useRef<number | null>(null);

  const getMaxDrag = useCallback(() => {
    if (!trackRef.current) return 130;
    // 28px knob width + 8px total horizontal padding (4px each side)
    return Math.max(70, trackRef.current.clientWidth - 28 - 8);
  }, []);

  const triggerComplete = useCallback(() => {
    const max = getMaxDrag();
    setIsCompleted(true);
    setDragX(max);
    currentDragRef.current = max;

    // Call navigation callback
    onSlideComplete();

    // Reset back after navigation
    setTimeout(() => {
      setDragX(0);
      currentDragRef.current = 0;
      setIsCompleted(false);
      setIsAnimating(false);
    }, 650);
  }, [getMaxDrag, onSlideComplete]);

  // Click-to-slide fallback for immediate accessibility
  const handleAutoSlide = useCallback(() => {
    if (isCompleted || isAnimating) return;
    const max = getMaxDrag();
    setIsAnimating(true);
    setDragX(max);
    currentDragRef.current = max;

    setTimeout(() => {
      triggerComplete();
    }, 240);
  }, [isCompleted, isAnimating, getMaxDrag, triggerComplete]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isCompleted || isAnimating) return;
    
    // Primary mouse button or touch
    if (e.button !== 0) return;

    pointerIdRef.current = e.pointerId;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Fallback if pointer capture not supported
    }

    setIsDragging(true);
    startXRef.current = e.clientX - currentDragRef.current;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || pointerIdRef.current !== e.pointerId) return;

    const max = getMaxDrag();
    const rawX = e.clientX - startXRef.current;
    const clampedX = Math.max(0, Math.min(max, rawX));

    currentDragRef.current = clampedX;
    setDragX(clampedX);

    // Auto-trigger if dragged past 88%
    if (clampedX >= max * 0.88) {
      setIsDragging(false);
      triggerComplete();
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || pointerIdRef.current !== e.pointerId) return;

    setIsDragging(false);
    pointerIdRef.current = null;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    const max = getMaxDrag();
    const draggedDistance = currentDragRef.current;

    if (draggedDistance >= max * 0.7) {
      // Dragged far enough: complete
      triggerComplete();
    } else if (draggedDistance < 6) {
      // Was a click or tap without drag: auto-slide smoothly
      handleAutoSlide();
    } else {
      // Released too early: spring back to left
      setDragX(0);
      currentDragRef.current = 0;
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || pointerIdRef.current !== e.pointerId) return;
    setIsDragging(false);
    pointerIdRef.current = null;
    setDragX(0);
    currentDragRef.current = 0;
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
      e.preventDefault();
      handleAutoSlide();
    }
  };

  const max = getMaxDrag();
  const progressRatio = max > 0 ? Math.min(1, dragX / max) : 0;

  return (
    <div
      ref={trackRef}
      role="button"
      tabIndex={0}
      aria-label="Slide to open Catalogue"
      title="Slide left to right to open Catalogue"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onKeyDown={handleKeyDown}
      className={`group relative h-[38px] w-[164px] sm:w-[176px] rounded-full bg-gradient-to-r from-[#181715] via-[#24211D] to-[#181715] hover:from-[#221F1B] hover:to-[#121110] border border-[#D4AF37] hover:border-[#F2D785] shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.4)] select-none overflow-hidden cursor-grab active:cursor-grabbing flex items-center px-1 transition-all duration-300 touch-none focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60 ${className}`}
    >
      {/* Track Label: Clean "CATALOGUE" text only */}
      <div
        className="absolute inset-0 flex items-center justify-center pl-7 pr-2 pointer-events-none"
        style={{
          opacity: Math.max(0, 1 - progressRatio * 1.4),
          transition: isDragging ? 'none' : 'opacity 0.25s ease-out',
        }}
      >
        <span className="font-mono text-[11px] font-bold tracking-[0.18em] uppercase text-[#FFF8EC]">
          {label}
        </span>
      </div>

      {/* Sliding Knob (starts on left, moves to right - ring & arrow only) */}
      <div
        className="relative z-10 w-7 h-7 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#F2D785] to-[#B38728] text-[#181715] font-bold flex items-center justify-center shadow-md transform-gpu"
        style={{
          transform: `translateX(${dragX}px) scale(${isDragging ? 1.05 : 1})`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      >
        <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
      </div>
    </div>
  );
};
