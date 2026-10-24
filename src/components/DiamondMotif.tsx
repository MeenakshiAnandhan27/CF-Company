import React from 'react';

interface DiamondMotifProps {
  align?: 'center' | 'left';
  className?: string;
  maxWidth?: string;
}

/**
 * EXACT DIAMOND DESIGN FROM HOME PAGE
 * 
 * Reusable decorative motif extracted from directly below "Materials for Every Requirement":
 * - Shape: 45° rotated square (rotate-45)
 * - Proportions: 8px x 8px (w-2 h-2)
 * - Line thickness: 1px hairline (h-[1px])
 * - Colour: bg-gradient-to-tr from-[#D4AF37] via-[#F2D785] to-[#B38728]
 * - Glow: shadow-[0_0_8px_rgba(212,175,55,0.75)]
 * - Flanking hairlines with matching gold fade gradients
 */
export const DiamondMotif: React.FC<DiamondMotifProps> = ({
  align = 'center',
  className = '',
  maxWidth = 'max-w-xs',
}) => {
  if (align === 'left') {
    return (
      <div
        aria-hidden="true"
        className={`relative flex items-center justify-start w-full ${maxWidth} pt-0.5 ${className}`}
      >
        <div className="h-[1px] w-24 bg-gradient-to-r from-[#D4AF37] to-[#D4AF37]/50" />
        <div className="relative mx-2.5 flex items-center justify-center shrink-0">
          <div className="w-2 h-2 bg-gradient-to-tr from-[#D4AF37] via-[#F2D785] to-[#B38728] rotate-45 shadow-[0_0_8px_rgba(212,175,55,0.75)]" />
        </div>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-[#D4AF37]/50 to-transparent" />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`relative flex items-center justify-center my-3.5 w-full ${maxWidth} mx-auto ${className}`}
    >
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-[#D4AF37]" />
      <div className="relative mx-3 flex items-center justify-center shrink-0">
        <div className="w-2 h-2 bg-gradient-to-tr from-[#D4AF37] via-[#F2D785] to-[#B38728] rotate-45 shadow-[0_0_8px_rgba(212,175,55,0.75)]" />
      </div>
      <div className="h-[1px] w-full bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/50 to-transparent" />
    </div>
  );
};
