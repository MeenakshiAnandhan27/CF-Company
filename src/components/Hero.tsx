import React from 'react';
import { ArrowRight, ArrowUpRight, Compass, PhoneCall } from 'lucide-react';
import { ProductCategory } from '../types.ts';
import { RAW_MATERIAL_IMAGES } from '../data/materialImages.ts';
import { DiamondMotif } from './DiamondMotif.tsx';

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
      image: RAW_MATERIAL_IMAGES.laces?.imagePath || '/assets/materials/homepage/laces.jpg',
      alt: RAW_MATERIAL_IMAGES.laces?.altText || 'Close-up macro of raw cotton lace rolls and embroidery needlework',
    },
    {
      category: 'fabrics',
      num: '02',
      title: 'Fabrics & Gadas',
      subtitle: 'Pure Cotton, Gadas & Knits',
      image: RAW_MATERIAL_IMAGES.fabrics?.imagePath || '/assets/materials/homepage/fabrics.jpg',
      alt: RAW_MATERIAL_IMAGES.fabrics?.altText || 'Raw folded cotton twill and woven fabric rolls showing textile weave structure',
    },
    {
      category: 'denim',
      num: '03',
      title: 'Denim Materials',
      subtitle: 'Raw Indigo Selvedge & Twill',
      image: RAW_MATERIAL_IMAGES.denim?.imagePath || '/assets/materials/homepage/denim.jpg',
      alt: RAW_MATERIAL_IMAGES.denim?.altText || 'Close-up texture of raw denim textile weave with visible twill cotton threads',
    },
    {
      category: 'accessories',
      num: '04',
      title: 'Trims & Accessories',
      subtitle: 'Buttons, Tags, Tapes & Zips',
      image: RAW_MATERIAL_IMAGES.accessories?.imagePath || '/assets/materials/homepage/garment-accessories.jpg',
      alt: RAW_MATERIAL_IMAGES.accessories?.altText || 'Collection of physical garment accessories: loose buttons, twill tape, and brand tags',
    },
  ];

  return (
    <section
      id="materials-hero"
      className="relative overflow-hidden bg-[#FAF9F6] border-b border-[#E8E6E0] min-h-[calc(100vh-8rem)] flex flex-col justify-center py-6 sm:py-8 lg:py-10 scroll-mt-20"
    >
      {/* Background Ambience: Warm luxury canvas with micro-dot texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(rgba(212, 175, 55, 0.2) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(248, 246, 240, 0.7) 0%, rgba(250, 247, 242, 1) 100%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-stretch">
          {/* Main Hero Copy (Col 1-7) — Flex column with bottom alignment matching the showcase matrix */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="space-y-5 lg:space-y-6">
              {/* Concise, Premium Headline without trailing dot */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#181715] leading-[1.12] text-balance">
                Materials for Every Requirement
              </h1>

              {/* Elegant Gold Diamond Motif Divider */}
              <DiamondMotif align="left" maxWidth="max-w-sm" />

              {/* Concise Supporting Text with Professional Grammar & Title Capitalization */}
              <p className="text-base sm:text-lg text-[#55514B] leading-relaxed max-w-2xl text-pretty font-medium">
                Garment Accessories and Fabrics — Sourced, Manufactured, and Supplied to Match Your Exact Requirements.
              </p>

              {/* HERO CTA BUTTONS — UNIQUE LUXURY CONTROLS */}
              <div className="pt-1 sm:pt-2">
                <div className="inline-flex flex-col sm:flex-row items-stretch sm:items-center p-1.5 sm:p-2 bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-full border border-[#D4AF37]/35 shadow-[0_8px_30px_rgba(24,23,21,0.06)] hover:shadow-[0_12px_40px_rgba(212,175,55,0.16)] transition-all duration-300 gap-2 sm:gap-2 max-w-full">
                  {/* Primary: EXPLORE CATALOGUE — Identical in glow, color & circle badge to Header Catalogue Button */}
                  <button
                    onClick={() => onExploreCatalogue()}
                    className="group relative inline-flex items-center justify-center gap-3 pl-5 pr-1.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] rounded-full transition-all duration-300 text-[#FFF8EC] bg-gradient-to-r from-[#181715] via-[#2A2620] to-[#181715] hover:from-[#24211D] hover:to-[#111110] border border-[#D4AF37] hover:border-[#F2D785] shadow-[0_4px_16px_rgba(212,175,55,0.25)] hover:shadow-[0_6px_28px_rgba(212,175,55,0.45)] active:scale-[0.98] cursor-pointer whitespace-nowrap"
                  >
                    <span className="font-mono text-[11px] tracking-[0.18em] font-bold">Explore Catalogue</span>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#F2D785] to-[#B38728] text-[#181715] font-bold flex items-center justify-center transition-all duration-300 shadow-sm group-hover:scale-105 group-hover:translate-x-0.5">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>

                  {/* Secondary: REQUEST A MATERIAL */}
                  <button
                    onClick={onRequestMaterial}
                    className="group inline-flex items-center justify-center gap-2 px-5 py-3.5 sm:py-3 text-xs font-semibold uppercase tracking-wider text-[#68412E] bg-[#FAF6F0] border border-[#D4AF37]/35 hover:border-[#D4AF37] rounded-xl sm:rounded-full hover:bg-white hover:text-[#82553E] shadow-none hover:shadow-xs transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] whitespace-nowrap cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-45 text-[#8C6534]" />
                    <span className="font-mono text-[11px] tracking-[0.14em]">Request a Material</span>
                  </button>

                  {/* Tertiary: REACH US */}
                  <button
                    onClick={onReachUs}
                    className="group inline-flex items-center justify-center gap-2 px-5 py-3.5 sm:py-3 text-xs font-semibold uppercase tracking-wider text-[#4A4742] bg-transparent hover:bg-[#F4EFEB] rounded-xl sm:rounded-full border border-transparent hover:border-[#DCD5C9] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] whitespace-nowrap cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110 text-[#8C6534]" />
                    <span className="font-mono text-[11px] tracking-[0.14em]">Reach Us</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Information Strip — Simple, Clean & Executive, Anchored to bottom line matching the 4-box bottom edge */}
            <div className="pt-6 mt-8 lg:mt-0 border-t border-[#E8E4DC] flex flex-wrap items-center gap-2.5 sm:gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#E0DAD0] shadow-xs text-xs font-semibold text-[#181715]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <span>Requirement-Based Sourcing</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#E0DAD0] shadow-xs text-xs font-semibold text-[#181715]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <span>Laces, Fabrics &amp; Trims</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#E0DAD0] shadow-xs text-xs font-semibold text-[#181715]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <span>Wholesale &amp; Sampling Supply</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Showcase Panel (Col 8-12) — 4-Box Textile Showcase Matrix with Titles Only */}
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
                >
                  {/* Real Textile Photography */}
                  <img
                    src={box.image}
                    alt={box.alt}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110 filter brightness-[0.92] group-hover:brightness-100"
                  />

                  {/* Gradient Scrim for crystal clear readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300" />

                  {/* Top-Right Action Indicator Only (No Badge) */}
                  <div className="absolute top-2.5 right-2.5">
                    <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 group-hover:bg-[#D4AF37] group-hover:text-[#181715] shadow-xs group-hover:scale-110">
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>

                  {/* Bottom: Title Only (No Subtitle) */}
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <span className="block font-serif text-sm sm:text-base md:text-lg font-bold text-white tracking-wide leading-tight drop-shadow-md group-hover:text-[#F8EED7] transition-colors">
                      {box.title}
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
