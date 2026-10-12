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
      className="relative w-full min-h-[calc(100vh-4.5rem)] sm:min-h-[calc(100vh-5rem)] flex flex-col justify-between items-center bg-[#FAF8F5] border-b border-[#E8E4DC] overflow-hidden select-none"
    >
      {/* Background Ambience: Subtle radial glow & tactile textile warp-weft weave */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 46%, rgba(201, 169, 110, 0.12) 0%, rgba(130, 85, 62, 0.04) 45%, transparent 75%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #181715 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Decorative hairline corner brackets */}
      <div
        aria-hidden="true"
        className="absolute top-6 left-6 w-8 h-8 border-t border-l border-[#D8D0C2] pointer-events-none hidden sm:block opacity-60"
      />
      <div
        aria-hidden="true"
        className="absolute top-6 right-6 w-8 h-8 border-t border-r border-[#D8D0C2] pointer-events-none hidden sm:block opacity-60"
      />

      {/* Top spacing spacer */}
      <div className="pt-8 sm:pt-12" />

      {/* Center Hero Block: Typography, Slogan, and Subtitle */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center my-auto py-8">
        {/* Subtle Brand Tag */}
        <div className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.3em] text-[#82553E] bg-[#F3ECE1] px-4 py-1.5 rounded-full border border-[#DFD5C5] mb-6 sm:mb-8 shadow-2xs">
          <span>TIRUPPUR • WHOLESALE &amp; SOURCING</span>
        </div>

        {/* Brand Name in Large Premium Serif Typography with subtle glow */}
        <h1 className="font-serif font-bold text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.06em] sm:tracking-[0.1em] text-[#181715] uppercase leading-[0.95] text-balance animate-brand-glow drop-shadow-sm">
          CLASSIC FASHIONS
        </h1>

        {/* Decorative Divider */}
        <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-[#82553E]/60 to-transparent my-6 sm:my-8" />

        {/* Slogan */}
        <p className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#2F2B26] font-normal tracking-tight text-center max-w-3xl leading-snug text-balance">
          Every Garment Begins With the Right Material.
        </p>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-[#6B655C] font-sans font-normal tracking-wide text-center max-w-xl mx-auto mt-3 sm:mt-4 leading-relaxed text-pretty">
          Your sourcing partner for fabrics, laces and garment accessories.
        </p>
      </div>

      {/* Bottom Block: Scroll to Discover + Marquee Text Strip */}
      <div className="w-full relative z-10 flex flex-col items-center mt-auto">
        {/* SCROLL TO DISCOVER Button */}
        <button
          type="button"
          onClick={handleScroll}
          className="group flex flex-col items-center gap-2 mb-6 sm:mb-8 text-[#5E5951] hover:text-[#181715] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#82553E] rounded-full p-2 cursor-pointer"
          aria-label="Scroll down to explore materials"
        >
          <span className="font-mono text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] uppercase text-[#736E66] group-hover:text-[#181715] transition-colors">
            SCROLL TO DISCOVER
          </span>
          <div className="w-8 h-8 rounded-full border border-[#D5CDBC] bg-white/80 group-hover:bg-[#181715] group-hover:text-white group-hover:border-[#181715] flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:shadow-xs">
            <ArrowDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-0.5 animate-bounce" />
          </div>
        </button>

        {/* Slow-moving text strip: FABRICS • LACES • DENIM • ZIPPERS • BUTTONS • CUSTOM SOURCING */}
        <div
          aria-hidden="true"
          className="w-full border-t border-[#E8E2D6] bg-[#F5F0E6]/90 backdrop-blur-xs py-3 overflow-hidden shadow-inner"
        >
          <div className="animate-marquee-slow flex items-center text-xs sm:text-sm font-mono tracking-[0.22em] uppercase font-medium text-[#5C564D]">
            {/* Sequence 1 */}
            <div className="flex items-center shrink-0">
              {marqueeItems.map((item, idx) => (
                <span key={`seq1-${idx}`} className="inline-flex items-center">
                  <span className="hover:text-[#181715] transition-colors px-4 sm:px-6">
                    {item}
                  </span>
                  <span className="text-[#C2B7A5] font-light select-none">•</span>
                </span>
              ))}
            </div>

            {/* Sequence 2 for seamless loop */}
            <div className="flex items-center shrink-0">
              {marqueeItems.map((item, idx) => (
                <span key={`seq2-${idx}`} className="inline-flex items-center">
                  <span className="hover:text-[#181715] transition-colors px-4 sm:px-6">
                    {item}
                  </span>
                  <span className="text-[#C2B7A5] font-light select-none">•</span>
                </span>
              ))}
            </div>

            {/* Sequence 3 for ultra-wide screen safety */}
            <div className="flex items-center shrink-0">
              {marqueeItems.map((item, idx) => (
                <span key={`seq3-${idx}`} className="inline-flex items-center">
                  <span className="hover:text-[#181715] transition-colors px-4 sm:px-6">
                    {item}
                  </span>
                  <span className="text-[#C2B7A5] font-light select-none">•</span>
                </span>
              ))}
            </div>

            {/* Sequence 4 for ultra-wide screen safety */}
            <div className="flex items-center shrink-0">
              {marqueeItems.map((item, idx) => (
                <span key={`seq4-${idx}`} className="inline-flex items-center">
                  <span className="hover:text-[#181715] transition-colors px-4 sm:px-6">
                    {item}
                  </span>
                  <span className="text-[#C2B7A5] font-light select-none">•</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
