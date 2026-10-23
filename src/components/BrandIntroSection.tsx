import React from 'react';
import { ArrowDown } from 'lucide-react';
import { HeroFabric3D } from './HeroFabric3D.tsx';

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
      const targetEl = document.getElementById('materials-strip') || document.getElementById('materials-hero');
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
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
      className="relative w-full min-h-[calc(100vh-5rem)] flex flex-col justify-between items-center text-[#181715] bg-[#FAF8F5] border-b border-[#E8E6E0] overflow-hidden select-none"
    >
      {/* Background Ambience: Warm luxury ivory spotlight */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 50% 38%, rgba(255, 253, 249, 0.95) 0%, rgba(248, 245, 238, 0.85) 60%, rgba(244, 239, 230, 0.95) 100%)',
        }}
      />

      {/* Subtle architectural textile warp-weft weave grid watermark */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.025] pointer-events-none z-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #181715 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Real-time 3D Interactive Fabric Hero powered by Three.js */}
      <HeroFabric3D />

      {/* Top spacing */}
      <div className="pt-8 sm:pt-12 relative z-20" />

      {/* Center Hero Block: Typography, Slogan, and Subtitle */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center my-auto py-6">
        {/* Brand Name in Haute-Couture Obsidian & Burnished Gold Metallic Sweep (Big Luxury Scale) */}
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

        {/* Slogan in Exact Image Font Family & Size, but Straight Upright (Not-Italic / No Slant) */}
        <p className="font-serif not-italic text-2xl sm:text-3xl md:text-4xl text-[#181715] font-normal tracking-wide text-center max-w-3xl leading-snug text-balance">
          Every Garment Begins With the Right Material.
        </p>

        {/* Subtitle - SUPPLIER OF GARMENT ACCESSORIES & FABRICS (Without Bling / Ping Dot) */}
        <div className="mt-6 sm:mt-7 inline-flex items-center px-6 py-2 rounded-full border border-[#D4AF37]/45 bg-white/95 backdrop-blur-md shadow-[0_2px_14px_rgba(212,175,55,0.08)]">
          <p className="text-xs sm:text-sm font-mono font-semibold tracking-[0.22em] sm:tracking-[0.26em] text-[#8C6534] uppercase text-center leading-relaxed">
            SUPPLIER OF GARMENT ACCESSORIES &amp; FABRICS
          </p>
        </div>
      </div>

      {/* Bottom Block: Scroll Symbol Only (No Letters/Text) + Marquee Text Strip */}
      <div className="w-full relative z-20 flex flex-col items-center mt-auto">
        {/* Scroll Symbol Button Only - No Letters */}
        <button
          type="button"
          onClick={handleScroll}
          className="group flex items-center justify-center p-2 mb-6 sm:mb-8 text-[#736F68] hover:text-[#181715] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded-full cursor-pointer"
          aria-label="Scroll down to explore materials"
        >
          <div className="w-9 h-9 rounded-full border border-[#D5D0C6] bg-white text-[#8C6534] group-hover:bg-[#181715] group-hover:text-white group-hover:border-[#181715] flex items-center justify-center transition-all duration-300 shadow-xs">
            <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5 animate-bounce" />
          </div>
        </button>

        {/* Slow-moving text strip: FABRICS • LACES • DENIM • ZIPPERS • BUTTONS • CUSTOM SOURCING */}
        <div
          id="materials-strip"
          aria-hidden="true"
          className="w-full border-t border-[#E8E6E0] bg-[#FAF9F5] py-3.5 overflow-hidden shadow-xs scroll-mt-20"
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
