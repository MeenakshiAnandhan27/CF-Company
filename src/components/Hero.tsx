import React from 'react';
import { ArrowRight, ArrowUpRight, Compass, PhoneCall } from 'lucide-react';
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
  const showcaseBoxes: {
    category: ProductCategory;
    num: string;
    title: string;
    subtitle: string;
    image: string;
    alt: string;
  }[] = [
    {
      category: 'laces',
      num: '01',
      title: 'Garment Laces',
      subtitle: 'Guipure & Embroidered Trims',
      image: '/assets/materials/laces.jpg',
      alt: 'Raw lace material texture',
    },
    {
      category: 'fabrics',
      num: '02',
      title: 'Fabrics & Gadas',
      subtitle: 'Pure Cotton, Gadas & Knits',
      image: '/assets/materials/fabrics.jpg',
      alt: 'Raw woven fabric rolls texture',
    },
    {
      category: 'denim',
      num: '03',
      title: 'Denim Materials',
      subtitle: 'Raw Indigo Selvedge & Twill',
      image: '/assets/materials/denim.jpg',
      alt: 'Raw denim twill fabric texture',
    },
    {
      category: 'accessories',
      num: '04',
      title: 'Trims & Accessories',
      subtitle: 'Buttons, Tags, Tapes & Zips',
      image: '/assets/materials/accessories.jpg',
      alt: 'Raw garment accessories and buttons',
    },
  ];

  return (
    <section
      id="materials-hero"
      className="relative overflow-hidden bg-[#FBF9F5] border-b border-[#E8E4DC] pt-12 pb-16 md:pt-18 md:pb-22 scroll-mt-20"
    >
      {/* Subtle organic textile warp and weft background texture */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
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
            {/* Concise, Premium Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#181715] leading-[1.14] text-balance">
              Materials for Every Requirement.
            </h1>

            {/* Concise Supporting Text */}
            <p className="text-base sm:text-lg text-[#55514B] leading-relaxed max-w-2xl text-pretty font-normal">
              Garment accessories and fabrics, sourced and supplied to match your requirement.
            </p>

            {/* HERO CTA BUTTONS — FLOATING CONTROLS DESIGN */}
            <div className="pt-2">
              <div className="inline-flex flex-col sm:flex-row items-stretch sm:items-center p-1.5 sm:p-2 bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-full border border-[#E5E0D6] shadow-[0_8px_30px_rgba(24,23,21,0.06)] hover:shadow-[0_12px_40px_rgba(24,23,21,0.09)] transition-all duration-300 gap-2 sm:gap-1.5 max-w-full">
                {/* Primary: EXPLORE CATALOGUE */}
                <button
                  onClick={() => onExploreCatalogue()}
                  className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 sm:py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#181715] rounded-xl sm:rounded-full hover:bg-[#2C2925] shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] whitespace-nowrap cursor-pointer"
                >
                  <span>Explore Catalogue</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-1.5" />
                </button>

                {/* Secondary: REQUEST A MATERIAL */}
                <button
                  onClick={onRequestMaterial}
                  className="group inline-flex items-center justify-center gap-2 px-5 py-3.5 sm:py-3 text-xs font-semibold uppercase tracking-wider text-[#68412E] bg-[#FAF6F0] border border-transparent hover:border-[#82553E]/50 rounded-xl sm:rounded-full hover:bg-white hover:text-[#82553E] shadow-none hover:shadow-xs transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] whitespace-nowrap cursor-pointer"
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

          {/* Hero Visual Showcase Panel (Col 8-12) — Unique 4-Box Textile Showcase Matrix */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
              {showcaseBoxes.map((box) => (
                <div
                  key={box.category}
                  onClick={() => onExploreCatalogue(box.category)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onExploreCatalogue(box.category);
                    }
                  }}
                  className="group relative aspect-[1.15/1] sm:aspect-[1.18/1] rounded-2xl overflow-hidden bg-[#181715] border border-[#E8E4DC] hover:border-[#D4AF37]/70 shadow-[0_6px_22px_rgba(24,23,21,0.06)] hover:shadow-[0_16px_36px_rgba(24,23,21,0.14)] transition-all duration-400 transform hover:-translate-y-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  title={`Explore ${box.title}`}
                >
                  {/* Real Textile Photography */}
                  <img
                    src={box.image}
                    alt={box.alt}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110 filter brightness-[0.92] group-hover:brightness-100"
                  />

                  {/* Gradient Scrim for crystal clear readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10 transition-opacity duration-300" />

                  {/* Top Floating Badge & Action Indicator */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[9px] font-mono tracking-widest text-[#F5DEB3] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                      {box.num}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 group-hover:bg-[#D4AF37] group-hover:text-[#181715] shadow-xs group-hover:scale-110">
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>

                  {/* Bottom Title & Subtitle */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left">
                    <span className="block font-serif text-sm sm:text-base font-semibold text-white tracking-wide leading-tight drop-shadow-sm group-hover:text-[#F8EED7] transition-colors">
                      {box.title}
                    </span>
                    <span className="block text-[10px] sm:text-[11px] text-[#D8D2C6] font-normal leading-tight mt-0.5 truncate">
                      {box.subtitle}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
