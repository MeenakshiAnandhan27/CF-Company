import React from 'react';
import { ArrowDown } from 'lucide-react';
import { HeroFabric3D } from './HeroFabric3D.tsx';
import { DiamondMotif } from './DiamondMotif.tsx';

interface BrandIntroSectionProps {
  onScrollToDiscover?: () => void;
}

export const MaterialsMarqueeStrip: React.FC = () => {
  const marqueeItems = [
    'FABRICS',
    'LACES',
    'DENIM',
    'ZIPPERS',
    'BUTTONS',
    'CUSTOM SOURCING',
  ];

  return (
    <div
      id="materials-strip"
      aria-label="Garment Materials Categories Strip"
      className="w-full border-y border-[#E8E6E0] bg-[#FAF9F5] py-3.5 overflow-hidden shadow-xs scroll-mt-20 select-none"
    >
      <div className="animate-marquee-slow flex items-center text-xs sm:text-sm font-mono tracking-[0.24em] uppercase font-medium text-[#736F68]">
        {[0, 1, 2, 3].map((seqIdx) => (
          <div key={`seq-${seqIdx}`} className="flex items-center shrink-0">
            {marqueeItems.map((item, idx) => (
              <span key={`seq-${seqIdx}-${idx}`} className="inline-flex items-center">
                <span className="hover:text-[#8C6534] transition-colors px-4 sm:px-6">
                  {item}
                </span>
                <span className="text-[#C5C0B7] font-light select-none">•</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const BrandIntroSection: React.FC<BrandIntroSectionProps> = ({
  onScrollToDiscover,
}) => {
  const handleScroll = () => {
    if (onScrollToDiscover) {
      onScrollToDiscover();
    } else {
      const targetEl = document.getElementById('materials-strip') || document.getElementById('materials-hero');
      if (targetEl) {
        const navHeight = 80;
        const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({
          top: Math.max(0, targetPos),
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <section
      aria-label="Classic Fashions Brand Introduction"
      className="relative w-full h-screen min-h-[640px] flex flex-col justify-between items-center text-[#181715] bg-[#FAF8F5] overflow-hidden select-none"
    >
      {/* Subtle luxury warm studio ambient gradient backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none bg-gradient-to-b from-[#FAF8F5] via-[#F8F5EE] to-[#F3EEE5]"
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
      <div className="pt-20 sm:pt-24 relative z-20" />

      {/* Center Hero Block: Typography, Slogan, and Subtitle */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center my-auto py-6">
        {/* Brand Name in Haute-Couture Obsidian & Burnished Gold Metallic Sweep (Big Luxury Scale) */}
        <div className="relative my-2 sm:my-3">
          <h1 className="text-luxury-onyx-gold font-display font-extrabold text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.10em] sm:tracking-[0.16em] uppercase leading-[0.95] text-balance select-none cursor-default">
            CLASSIC FASHIONS
          </h1>
        </div>

        {/* Decorative Jeweled Gold Hairline Divider */}
        <DiamondMotif align="center" maxWidth="max-w-md" className="my-6 sm:my-8" />

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

      {/* Bottom Block: Down Arrow Button Only (Click smoothly navigates to 2nd page / materials strip) */}
      <div className="w-full relative z-20 flex flex-col items-center pb-6 sm:pb-8 mt-auto">
        <button
          type="button"
          onClick={handleScroll}
          className="group flex items-center justify-center p-2 text-[#736F68] hover:text-[#181715] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded-full cursor-pointer"
          aria-label="Scroll down to explore materials"
        >
          <div className="w-10 h-10 rounded-full border border-[#D5D0C6] bg-white text-[#8C6534] group-hover:bg-[#181715] group-hover:text-[#D4AF37] group-hover:border-[#181715] flex items-center justify-center transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.06)] group-hover:shadow-[0_4px_16px_rgba(212,175,55,0.3)]">
            <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5 animate-bounce" />
          </div>
        </button>
      </div>
    </section>
  );
};
