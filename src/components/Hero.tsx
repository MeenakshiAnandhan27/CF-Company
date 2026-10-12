import React from 'react';
import { ArrowRight, Compass, PhoneCall } from 'lucide-react';
import { ProductCategory } from '../types.ts';

interface HeroProps {
  onExploreCatalogue: (category?: ProductCategory) => void;
  onReachUs: () => void;
  onRequestMaterial: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreCatalogue,
  onReachUs,
  onRequestMaterial,
}) => {
  return (
    <section id="materials-hero" className="relative overflow-hidden bg-[#FBF9F5] border-b border-[#E8E4DC] pt-14 pb-16 md:pt-20 md:pb-24 scroll-mt-20">
      {/* Subtle organic textile warp and weft background texture */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-diagonal-weave" width="48" height="48" patternUnits="userSpaceOnUse">
              <line x1="0" y1="48" x2="48" y2="0" stroke="#DDD7CE" strokeWidth="0.6" />
              <line x1="0" y1="24" x2="24" y2="0" stroke="#DDD7CE" strokeWidth="0.3" />
              <line x1="24" y1="48" x2="48" y2="24" stroke="#DDD7CE" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-diagonal-weave)" />
        </svg>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-7">
          
          {/* Concise, Premium Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#181715] leading-[1.14] text-balance">
            Materials for Every Requirement.
          </h1>

          {/* Concise Supporting Text */}
          <p className="text-base sm:text-lg text-[#55514B] leading-relaxed max-w-2xl text-pretty font-normal">
            Garment accessories and fabrics, sourced and supplied to match your requirement.
          </p>

          {/* HERO CTA BUTTONS — FLOATING PILL / FLOATING CONTROLS DESIGN */}
          <div className="pt-2">
            <div className="inline-flex flex-col sm:flex-row items-stretch sm:items-center p-1.5 sm:p-2 bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-full border border-[#E5E0D6] shadow-[0_8px_30px_rgba(24,23,21,0.06)] hover:shadow-[0_12px_40px_rgba(24,23,21,0.1)] transition-all duration-300 gap-2 sm:gap-1.5 max-w-full">
              
              {/* Primary: EXPLORE CATALOGUE */}
              <button
                onClick={() => onExploreCatalogue()}
                className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 sm:py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#181715] rounded-xl sm:rounded-full hover:bg-[#2C2925] shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] whitespace-nowrap cursor-pointer"
              >
                <span>Explore Catalogue</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-1.5" />
              </button>

              {/* Secondary: REQUEST A MATERIAL */}
              <button
                onClick={onRequestMaterial}
                className="group inline-flex items-center justify-center gap-2 px-5 py-3.5 sm:py-3 text-xs font-semibold uppercase tracking-wider text-[#68412E] bg-[#FAF6F0] border border-transparent hover:border-[#82553E]/50 rounded-xl sm:rounded-full hover:bg-white hover:text-[#82553E] shadow-none hover:shadow-sm transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] whitespace-nowrap cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-45" />
                <span>Request a Material</span>
              </button>

              {/* Tertiary: REACH US */}
              <button
                onClick={onReachUs}
                className="group inline-flex items-center justify-center gap-2 px-5 py-3.5 sm:py-3 text-xs font-semibold uppercase tracking-wider text-[#4A4742] bg-transparent hover:bg-[#F4EFEB] rounded-xl sm:rounded-full border border-transparent hover:border-[#DCD5C9] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] whitespace-nowrap cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" />
                <span>Reach Us</span>
              </button>

            </div>
          </div>

          {/* Information Strip — Core Business Capabilities */}
          <div className="pt-8 border-t border-[#E8E4DC] grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-left">
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-[#181715]">
                Requirement-Based Sourcing
              </span>
              <span className="text-xs text-[#736F68] mt-1 block leading-relaxed">
                Materials arranged according to your specific specifications
              </span>
            </div>

            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-[#181715]">
                Material Variety
              </span>
              <span className="text-xs text-[#736F68] mt-1 block leading-relaxed">
                Laces, fabrics, denim, mesh, tags, tapes &amp; accessories
              </span>
            </div>

            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-[#181715]">
                Wholesale &amp; Retail Supply
              </span>
              <span className="text-xs text-[#736F68] mt-1 block leading-relaxed">
                Flexible options for commercial batches, designers &amp; sampling
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
