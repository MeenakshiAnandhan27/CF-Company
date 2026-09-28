import React from 'react';
import { ArrowRight, Sparkles, Compass, PhoneCall } from 'lucide-react';
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
    <section className="relative overflow-hidden bg-[#FBF9F5] border-b border-[#E8E4DC] pt-12 pb-16 md:pt-20 md:pb-24">
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Main Hero Copy (Col 1-7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Context kicker — Clean brand positioning */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#82553E] bg-[#F0EAE1] px-3.5 py-1.5 rounded-full border border-[#DFCFC0]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Supplier of Garment Accessories &amp; Fabrics</span>
            </div>

            {/* Concise, Premium Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#181715] leading-[1.14] text-balance">
              Materials for Every Requirement.
            </h1>

            {/* Concise Supporting Text — No physical location in hero */}
            <p className="text-base sm:text-lg text-[#55514B] leading-relaxed max-w-2xl text-pretty font-normal">
              Garment accessories and fabrics, sourced and supplied to match your requirement.
            </p>

            {/* 1. HERO CTA BUTTONS — FLOATING PILL / FLOATING CONTROLS DESIGN */}
            <div className="pt-2">
              {/* Floating controls container: visually connected, soft rounded, subtle depth and light shadow */}
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

            {/* Information Strip — Core Business Capabilities without location claims */}
            <div className="pt-6 border-t border-[#E8E4DC] grid grid-cols-1 sm:grid-cols-3 gap-5 text-left">
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

          {/* Hero Visual Showcase Panel (Col 8-12) — Interactive real photography preview */}
          <div className="lg:col-span-5">
            <div
              onClick={() => onExploreCatalogue()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onExploreCatalogue();
                }
              }}
              className="group cursor-pointer relative p-3 bg-white rounded-2xl shadow-[0_10px_35px_rgba(24,23,21,0.07)] hover:shadow-[0_16px_48px_rgba(24,23,21,0.12)] border border-[#E8E4DC] hover:border-[#82553E]/50 transition-all duration-300 transform hover:-translate-y-1 block focus:outline-none focus:ring-2 focus:ring-[#82553E]"
              title="Click to explore the Digital Product Catalogue"
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#181715]">
                {/* 4 Quadrants featuring real material photographs */}
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1 p-1 bg-[#1A1816]">
                  
                  {/* Quadrant 1: Laces */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onExploreCatalogue('laces');
                    }}
                    className="relative overflow-hidden group/q1 bg-[#23201D]"
                  >
                    <img
                      src="/assets/materials/laces.jpg"
                      alt="Raw lace material close-up texture"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover/q1:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2.5 right-2 text-white">
                      <span className="block text-[11px] font-serif font-medium tracking-wide drop-shadow-sm group-hover/q1:text-[#F3EFEA]">
                        Garment Laces
                      </span>
                    </div>
                  </div>

                  {/* Quadrant 2: Fabrics */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onExploreCatalogue('fabrics');
                    }}
                    className="relative overflow-hidden group/q2 bg-[#23201D]"
                  >
                    <img
                      src="/assets/materials/fabrics.jpg"
                      alt="Raw woven fabric rolls and textile texture"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover/q2:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2.5 right-2 text-white">
                      <span className="block text-[11px] font-serif font-medium tracking-wide drop-shadow-sm group-hover/q2:text-[#F3EFEA]">
                        Fabrics &amp; Gadas
                      </span>
                    </div>
                  </div>

                  {/* Quadrant 3: Denim */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onExploreCatalogue('denim');
                    }}
                    className="relative overflow-hidden group/q3 bg-[#23201D]"
                  >
                    <img
                      src="/assets/materials/denim.jpg"
                      alt="Raw denim twill fabric texture"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover/q3:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2.5 right-2 text-white">
                      <span className="block text-[11px] font-serif font-medium tracking-wide drop-shadow-sm group-hover/q3:text-[#F3EFEA]">
                        Denim Materials
                      </span>
                    </div>
                  </div>

                  {/* Quadrant 4: Garment Accessories */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onExploreCatalogue('accessories');
                    }}
                    className="relative overflow-hidden group/q4 bg-[#23201D]"
                  >
                    <img
                      src="/assets/materials/accessories.jpg"
                      alt="Raw garment accessories, buttons and trims"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover/q4:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2.5 right-2 text-white">
                      <span className="block text-[11px] font-serif font-medium tracking-wide drop-shadow-sm group-hover/q4:text-[#F3EFEA]">
                        Accessories &amp; Tags
                      </span>
                    </div>
                  </div>

                </div>

                {/* Central Brand Seal with Hover Indicator */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
                  <div className="bg-[#181715]/95 backdrop-blur-md px-5 py-3 rounded-xl border border-[#444039] text-center shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:border-[#C9A96E]">
                    <p className="text-[10px] tracking-[0.25em] uppercase text-[#D1C9BE] font-semibold">
                      Digital Product Catalogue
                    </p>
                    <p className="text-xs text-white font-medium mt-0.5">
                      Direct Wholesale Enquiries
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#C9A96E] mt-1.5 opacity-90 group-hover:opacity-100">
                      <span>Click to Explore</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Summary */}
              <div className="mt-3.5 pt-3 border-t border-[#EFECE6] flex items-center justify-between text-xs text-[#585550]">
                <span className="font-medium text-[#181715]">CLASSIC FASHIONS</span>
                <span className="text-[#82553E] font-semibold inline-flex items-center gap-1 group-hover:underline">
                  <span>Browse All Categories</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
