import React from 'react';
import { ArrowRight, Scissors, Layers, ShieldCheck, Sparkles } from 'lucide-react';
import { businessConfig } from '../data/businessConfig.ts';

interface HeroProps {
  onExploreCatalogue: () => void;
  onReachUs: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreCatalogue, onReachUs }) => {
  return (
    <section className="relative overflow-hidden bg-[#F8F6F1] border-b border-[#E8E6E0] pt-12 pb-16 md:pt-20 md:pb-24">
      {/* Subtle architectural textile weave background watermark/pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-diagonal-weave" width="40" height="40" patternUnits="userSpaceOnUse">
              <line x1="0" y1="40" x2="40" y2="0" stroke="#DDD7CE" strokeWidth="0.8" />
              <line x1="0" y1="20" x2="20" y2="0" stroke="#DDD7CE" strokeWidth="0.4" />
              <line x1="20" y1="40" x2="40" y2="20" stroke="#DDD7CE" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-diagonal-weave)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Copy (Col 1-7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Context kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#82553E] bg-[#F0EAE1] px-3.5 py-1.5 rounded-sm border border-[#E3D9CC]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Boyampalayam, Tiruppur • Wholesale &amp; Retail Supply</span>
            </div>

            {/* Mandatory Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#181715] leading-[1.12] text-balance">
              Garment Materials for Every Creation
            </h1>

            {/* Mandatory Supporting text */}
            <p className="text-base sm:text-lg text-[#585550] leading-relaxed max-w-2xl text-pretty font-normal">
              Explore garment accessories, fabrics, laces and specialized materials for manufacturers, designers and retail buyers.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onExploreCatalogue}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white bg-[#181715] rounded hover:bg-[#33302C] transition-all duration-200 shadow-sm active:scale-[0.98] group"
              >
                <span>Explore Catalogue</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onReachUs}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 text-sm font-semibold uppercase tracking-wider text-[#181715] bg-transparent border border-[#BFB8AC] rounded hover:bg-[#EDE9E0] transition-colors active:scale-[0.98]"
              >
                <span>Reach Us</span>
              </button>
            </div>

            {/* B2B Assurance Bar */}
            <div className="pt-6 border-t border-[#E5E0D8] grid grid-cols-3 gap-4 text-left">
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-[#181715]">
                  Wholesale Pricing
                </span>
                <span className="text-xs text-[#736F68] mt-0.5 block">
                  Bulk rates for manufacturing runs
                </span>
              </div>

              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-[#181715]">
                  Processing Facility
                </span>
                <span className="text-xs text-[#736F68] mt-0.5 block">
                  Edge cutting &amp; roll scalping
                </span>
              </div>

              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-[#181715]">
                  Material Variety
                </span>
                <span className="text-xs text-[#736F68] mt-0.5 block">
                  Laces, fabrics &amp; garment trims
                </span>
              </div>
            </div>

          </div>

          {/* Hero Visual Panel (Col 8-12) */}
          <div className="lg:col-span-5">
            <div className="relative p-3 bg-white rounded-xl shadow-lg border border-[#E8E4DC] overflow-hidden">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#24211E]">
                {/* Visual tactile montage representing the 4 pillars */}
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1 p-1 bg-[#1A1816]">
                  {/* Quadrant 1: Laces */}
                  <div className="relative bg-[#2D2A26] flex flex-col justify-end p-4 border border-[#3E3A35] overflow-hidden group">
                    <div className="absolute inset-0 opacity-40">
                      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <pattern id="hero-lace" width="24" height="24" patternUnits="userSpaceOnUse">
                          <circle cx="12" cy="12" r="6" fill="none" stroke="#E5DFD7" strokeWidth="0.8" />
                          <circle cx="12" cy="12" r="2" fill="#E5DFD7" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#hero-lace)" />
                      </svg>
                    </div>
                    <span className="relative z-10 text-[10px] tracking-wider uppercase text-[#C4B8A8] font-semibold">01</span>
                    <span className="relative z-10 font-serif text-sm sm:text-base text-white font-medium">Garment Laces</span>
                  </div>

                  {/* Quadrant 2: Fabrics */}
                  <div className="relative bg-[#24354A] flex flex-col justify-end p-4 border border-[#364D69] overflow-hidden group">
                    <div className="absolute inset-0 opacity-40">
                      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <pattern id="hero-twill" width="12" height="12" patternUnits="userSpaceOnUse">
                          <line x1="0" y1="12" x2="12" y2="0" stroke="#A7C2E4" strokeWidth="1.2" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#hero-twill)" />
                      </svg>
                    </div>
                    <span className="relative z-10 text-[10px] tracking-wider uppercase text-[#A7C2E4] font-semibold">02</span>
                    <span className="relative z-10 font-serif text-sm sm:text-base text-white font-medium">Fabrics &amp; Gadas</span>
                  </div>

                  {/* Quadrant 3: Accessories */}
                  <div className="relative bg-[#362B23] flex flex-col justify-end p-4 border border-[#4D3D32] overflow-hidden group">
                    <div className="absolute inset-0 opacity-40">
                      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <pattern id="hero-tape" width="20" height="14" patternUnits="userSpaceOnUse">
                          <path d="M0 0 L10 7 L20 0" fill="none" stroke="#D8C7B8" strokeWidth="1" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#hero-tape)" />
                      </svg>
                    </div>
                    <span className="relative z-10 text-[10px] tracking-wider uppercase text-[#D8C7B8] font-semibold">03</span>
                    <span className="relative z-10 font-serif text-sm sm:text-base text-white font-medium">Accessories &amp; Tags</span>
                  </div>

                  {/* Quadrant 4: Processing */}
                  <div className="relative bg-[#1F2B28] flex flex-col justify-end p-4 border border-[#2F423D] overflow-hidden group">
                    <div className="absolute inset-0 opacity-40">
                      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <pattern id="hero-proc" width="20" height="20" patternUnits="userSpaceOnUse">
                          <line x1="0" y1="10" x2="20" y2="10" stroke="#9BB8AD" strokeWidth="1" strokeDasharray="3 2" />
                          <circle cx="10" cy="10" r="2" fill="#9BB8AD" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#hero-proc)" />
                      </svg>
                    </div>
                    <span className="relative z-10 text-[10px] tracking-wider uppercase text-[#9BB8AD] font-semibold">04</span>
                    <span className="relative z-10 font-serif text-sm sm:text-base text-white font-medium">Edge Scalping</span>
                  </div>
                </div>

                {/* Central Brand Seal */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-[#181715]/90 backdrop-blur-md px-4 py-2.5 rounded border border-[#444039] text-center shadow-xl">
                    <p className="text-[10px] tracking-[0.25em] uppercase text-[#D1C9BE] font-semibold">
                      Digital Product Catalogue
                    </p>
                    <p className="text-xs text-white font-medium mt-0.5">
                      Direct Wholesale Enquiries
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Card Summary */}
              <div className="mt-3.5 pt-3 border-t border-[#EFECE6] flex items-center justify-between text-xs text-[#585550]">
                <span className="font-medium text-[#181715]">{businessConfig.businessName}</span>
                <span className="text-[#84817A] font-mono">B2B Verified</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
