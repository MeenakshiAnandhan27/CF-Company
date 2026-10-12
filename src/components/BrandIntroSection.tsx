import React from 'react';
import { ArrowDown } from 'lucide-react';

interface BrandIntroSectionProps {
  onScrollToDiscover?: () => void;
}

export const BrandIntroSection: React.FC<BrandIntroSectionProps> = ({
  onScrollToDiscover,
}) => {
  const handleScroll = () => {
    if (onScrollToDiscover) {
      onScrollToDiscover();
    } else {
      const heroEl = document.getElementById('materials-hero');
      if (heroEl) {
        heroEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const marqueeItems = [
    'FABRICS',
    'LACES',
    'DENIM',
    'ZIPPERS',
    'BUTTONS',
    'CUSTOM SOURCING',
  ];

  return (
    <section
      aria-label="Classic Fashions Brand Introduction"
      className="relative w-full min-h-[calc(100vh-5rem)] flex flex-col justify-between items-center text-[#181715] bg-[#FFFFFF] border-b border-[#E8E6E0] overflow-hidden select-none"
    >
      {/* Background Ambience: Subtle luxury warm spotlight on pure white canvas */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 75% 65% at 50% 35%, rgba(248, 246, 240, 0.8) 0%, rgba(255, 255, 255, 1) 100%)',
        }}
      />

      {/* Subtle architectural textile warp-weft weave grid watermark */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #181715 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Haute Couture Architectural Corner Brackets */}
      <div
        aria-hidden="true"
        className="absolute top-6 left-6 w-10 h-10 border-t border-l border-[#D4AF37]/50 pointer-events-none hidden sm:block"
      />
      <div
        aria-hidden="true"
        className="absolute top-6 right-6 w-10 h-10 border-t border-r border-[#D4AF37]/50 pointer-events-none hidden sm:block"
      />



      {/* Top spacing - Blank & Breathable (No top pill/badge as requested) */}
      <div className="pt-12 sm:pt-16" />

      {/* Center Hero Block: Typography, Slogan, and Subtitle */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center my-auto py-8">
        {/* Brand Name in Haute-Couture Obsidian & Burnished Gold Metallic Sweep */}
        <div className="relative my-2 sm:my-3">
          <h1 className="text-luxury-onyx-gold font-display font-extrabold text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.10em] sm:tracking-[0.16em] uppercase leading-[0.95] text-balance select-none cursor-default">
            CLASSIC FASHIONS
          </h1>
        </div>

        {/* Decorative Jeweled Gold Hairline Divider */}
        <div className="flex items-center justify-center gap-3 my-6 sm:my-8 w-full max-w-md">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-[#D4AF37]" />
          <div className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37] shadow-[0_0_6px_rgba(212,175,55,0.6)]" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#D4AF37]/40 to-[#D4AF37]" />
        </div>

        {/* Slogan with Italic Luxury Serif Accent */}
        <p className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-[#181715] font-normal tracking-wide text-center max-w-3xl leading-snug text-balance">
          Every Garment Begins With the Right Material.
        </p>

        {/* Subtitle - SUPPLIER OF GARMENT ACCESSORIES & FABRICS in Luxury Ivory-Gold Plaque */}
        <div className="mt-6 sm:mt-7 inline-flex items-center gap-2.5 px-6 py-2 rounded-full border border-[#D4AF37]/45 bg-white/95 backdrop-blur-md shadow-[0_4px_24px_rgba(212,175,55,0.12)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
          <p className="text-xs sm:text-sm font-mono font-semibold tracking-[0.22em] sm:tracking-[0.26em] text-[#8C6534] uppercase text-center leading-relaxed">
            SUPPLIER OF GARMENT ACCESSORIES &amp; FABRICS
          </p>
        </div>
      </div>

      {/* Bottom Block: Scroll to Discover + Marquee Text Strip */}
      <div className="w-full relative z-20 flex flex-col items-center mt-auto">
        {/* SCROLL TO DISCOVER Button */}
        <button
          type="button"
          onClick={handleScroll}
          className="group flex flex-col items-center gap-2 mb-6 sm:mb-8 text-[#736F68] hover:text-[#181715] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded-full p-2 cursor-pointer"
          aria-label="Scroll down to explore materials"
        >
          <span className="font-mono text-[10px] sm:text-[11px] font-semibold tracking-[0.28em] uppercase text-[#736F68] group-hover:text-[#181715] transition-colors">
            SCROLL TO DISCOVER
          </span>
          <div className="w-8 h-8 rounded-full border border-[#D5D0C6] bg-white text-[#8C6534] group-hover:bg-[#181715] group-hover:text-white group-hover:border-[#181715] flex items-center justify-center transition-all duration-300 shadow-xs">
            <ArrowDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-0.5 animate-bounce" />
          </div>
        </button>

        {/* Slow-moving text strip: FABRICS • LACES • DENIM • ZIPPERS • BUTTONS • CUSTOM SOURCING */}
        <div
          aria-hidden="true"
          className="w-full border-t border-[#E8E6E0] bg-[#FAF9F5] py-3.5 overflow-hidden shadow-xs"
        >
          <div className="animate-marquee-slow flex items-center text-xs sm:text-sm font-mono tracking-[0.24em] uppercase font-medium text-[#736F68]">
            {/* Sequence 1 */}
            <div className="flex items-center shrink-0">
              {marqueeItems.map((item, idx) => (
                <span key={`seq1-${idx}`} className="inline-flex items-center">
                  <span className="hover:text-[#8C6534] transition-colors px-4 sm:px-6">
                    {item}
                  </span>
                  <span className="text-[#C5C0B7] font-light select-none">•</span>
                </span>
              ))}
            </div>

            {/* Sequence 2 for seamless loop */}
            <div className="flex items-center shrink-0">
              {marqueeItems.map((item, idx) => (
                <span key={`seq2-${idx}`} className="inline-flex items-center">
                  <span className="hover:text-[#8C6534] transition-colors px-4 sm:px-6">
                    {item}
                  </span>
                  <span className="text-[#C5C0B7] font-light select-none">•</span>
                </span>
              ))}
            </div>

            {/* Sequence 3 for ultra-wide screen safety */}
            <div className="flex items-center shrink-0">
              {marqueeItems.map((item, idx) => (
                <span key={`seq3-${idx}`} className="inline-flex items-center">
                  <span className="hover:text-[#8C6534] transition-colors px-4 sm:px-6">
                    {item}
                  </span>
                  <span className="text-[#C5C0B7] font-light select-none">•</span>
                </span>
              ))}
            </div>

            {/* Sequence 4 for ultra-wide screen safety */}
            <div className="flex items-center shrink-0">
              {marqueeItems.map((item, idx) => (
                <span key={`seq4-${idx}`} className="inline-flex items-center">
                  <span className="hover:text-[#8C6534] transition-colors px-4 sm:px-6">
                    {item}
                  </span>
                  <span className="text-[#C5C0B7] font-light select-none">•</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
