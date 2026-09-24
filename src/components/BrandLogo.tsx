import React from 'react';

export interface BrandLogoProps {
  /**
   * Visual color variant:
   * - 'dark': #181715 (Primary rich black)
   * - 'white': #FFFFFF (Crisp white for dark containers)
   * - 'accent': #82553E (Warm terracotta)
   * - 'current': inherits CSS text color (currentColor)
   */
  variant?: 'dark' | 'white' | 'accent' | 'current';
  /**
   * Preset sizes:
   * - 'xs': 20px height
   * - 'sm': 28px height
   * - 'md': 36px height (Default)
   * - 'lg': 48px height
   * - 'xl': 64px height
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Optional custom className for sizing, shadows, or transforms
   */
  className?: string;
  /**
   * Optional accessible label
   */
  alt?: string;
}

const SIZE_MAP = {
  xs: 'h-5 w-auto',
  sm: 'h-7 w-auto',
  md: 'h-9 w-auto',
  lg: 'h-12 w-auto',
  xl: 'h-16 w-auto',
};

const COLOR_MAP = {
  dark: '#181715',
  white: '#FFFFFF',
  accent: '#82553E',
  current: 'currentColor',
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'dark',
  size = 'md',
  className = '',
  alt = 'Classic Fashions Monogram',
}) => {
  const fillColor = COLOR_MAP[variant];
  const sizeClass = SIZE_MAP[size];

  return (
    <svg
      viewBox="0 0 240 160"
      className={`${sizeClass} ${className} shrink-0 select-none transition-transform duration-200`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={alt}
    >
      <title>{alt}</title>
      <g fill={fillColor}>
        {/* C Monogram with Extended Top Bar & Slanted Cut */}
        <path
          d="
            M 74 24
            L 218 24
            L 194 52
            L 88 52
            C 66 52 52 64 52 80
            C 52 96 66 108 88 108
            L 108 108
            L 108 136
            L 74 136
            C 38 136 18 112 18 80
            C 18 48 38 24 74 24
            Z
          "
        />

        {/* F Monogram with Middle Arm & Vertical Stem */}
        <path
          d="
            M 118 66
            L 208 66
            L 184 94
            L 152 94
            L 152 136
            L 118 136
            Z
          "
        />
      </g>
    </svg>
  );
};

export default BrandLogo;
