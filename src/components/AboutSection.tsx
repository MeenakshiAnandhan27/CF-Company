import React, { useState } from 'react';
import { ArrowRight, ArrowUpRight, Tag, Layers, Compass, CheckCircle2, ShieldCheck, Package, Check } from 'lucide-react';
import { DiamondMotif } from './DiamondMotif.tsx';

interface AboutSectionProps {
  onExploreCatalogue: (category?: string) => void;
  onRequestMaterial?: () => void;
  onReachUs: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onExploreCatalogue,
  onRequestMaterial,
  onReachUs,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'trims' | 'fabrics'>('all');

  // What We Offer items with authentic material photography
  const whatWeOfferItems = [
    {
      name: 'Fabrics',
      type: 'fabrics',
      categoryKey: 'fabrics',
      description: 'Woven cotton, poplin gada, twill, drill, satin, and specialized apparel textiles.',
      accent: 'border-[#D9CFC3] hover:border-[#385375]',
      tagBg: 'bg-[#EAF1F8] text-[#385375]',
      image: '/assets/materials/homepage/fabrics.jpg',
    },
    {
      name: 'Garment Laces',
      type: 'trims',
      categoryKey: 'laces',
      description: 'Delicate embroidery needlework, cotton bobbin crochet, stretch raschel, and decorative guipure borders.',
      accent: 'border-[#D9CFC3] hover:border-[#82553E]',
      tagBg: 'bg-[#F2EDE6] text-[#82553E]',
      image: '/assets/materials/homepage/laces.jpg',
    },
    {
      name: 'Denim',
      type: 'fabrics',
      categoryKey: 'denim',
      description: 'Classic raw indigo twill, slub character denim, and lightweight garment denim for apparel.',
      accent: 'border-[#D9CFC3] hover:border-[#223E63]',
      tagBg: 'bg-[#E6ECF5] text-[#223E63]',
      image: '/assets/materials/homepage/denim.jpg',
    },
    {
      name: 'Mesh',
      type: 'fabrics',
      categoryKey: 'mesh',
      description: 'Open-pore breathable athletic spacer mesh, technical sportswear lining, and eyelet netting.',
      accent: 'border-[#D9CFC3] hover:border-[#3F5A50]',
      tagBg: 'bg-[#EBF2EE] text-[#3F5A50]',
      image: '/assets/materials/homepage/mesh.jpg',
    },
    {
      name: 'Lycra / Lycra Mesh',
      type: 'fabrics',
      categoryKey: 'lycra-mesh',
      description: 'High-recovery 4-way power stretch knit and performance activewear jersey with superior shape retention.',
      accent: 'border-[#D9CFC3] hover:border-[#1E3A5F]',
      tagBg: 'bg-[#E9F0F8] text-[#1E3A5F]',
      image: '/assets/materials/homepage/lycra-mesh.jpg',
    },
    {
      name: 'Tapes & Ribbons',
      type: 'trims',
      categoryKey: 'tapes',
      description: 'Cotton twill tapes, herringbone bias reels, grossgrain ribbons, and seam reinforcement bindings.',
      accent: 'border-[#D9CFC3] hover:border-[#785E48]',
      tagBg: 'bg-[#F3EDE6] text-[#785E48]',
      image: '/assets/materials/homepage/tapes.jpg',
    },
    {
      name: 'Zippers',
      type: 'trims',
      categoryKey: 'accessories',
      description: 'Heavy metal tooth zippers, molded vislon sliders, and continuous zipper tape for outerwear and bottoms.',
      accent: 'border-[#D9CFC3] hover:border-[#8C6D3B]',
      tagBg: 'bg-[#F5EFE6] text-[#8C6D3B]',
      image: '/assets/materials/homepage/zippers.jpg',
    },
    {
      name: 'Buttons',
      type: 'trims',
      categoryKey: 'buttons',
      description: 'Natural horn, turned wood, corozo, resin, and customized metal snap buttons for garment lines.',
      accent: 'border-[#D9CFC3] hover:border-[#695340]',
      tagBg: 'bg-[#EFE9E2] text-[#695340]',
      image: '/assets/materials/homepage/buttons.jpg',
    },
    {
      name: 'Brand Tags & Labels',
      type: 'trims',
      categoryKey: 'tags',
      description: 'Woven damask labels, printed care tags, size indicators, and branded paper hangtags with eyelets.',
      accent: 'border-[#D9CFC3] hover:border-[#6B5744]',
      tagBg: 'bg-[#F0EBE5] text-[#6B5744]',
      image: '/assets/materials/homepage/brand-tags.jpg',
    },
    {
      name: 'Garment Accessories',
      type: 'trims',
      categoryKey: 'accessories',
      description: 'Metal drawcord tipping, cord locks, eyelets, grommets, rings, and precision assembly hardware.',
      accent: 'border-[#D9CFC3] hover:border-[#735138]',
      tagBg: 'bg-[#F2ECE6] text-[#735138]',
      image: '/assets/materials/homepage/garment-accessories.jpg',
    },
    {
      name: 'Other Materials',
      type: 'fabrics',
      categoryKey: 'fabrics',
      description: 'Specialized blends, unlisted weaves, and requirement-specific textile substrates supplied upon request.',
      accent: 'border-[#D9CFC3] hover:border-[#524E48]',
      tagBg: 'bg-[#EAE8E4] text-[#524E48]',
      image: '/assets/materials/accessories.jpg',
    },
  ];

  const filteredOfferings = whatWeOfferItems.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.type === activeFilter;
  });

  return (
    <div className="bg-[#FAF8F5] text-[#181715] min-h-screen selection:bg-[#181715] selection:text-white">
      
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-[#E8E2D8] bg-[#F7F4EE] overflow-hidden">
        {/* Subtle architectural textile warp-weft weave grid watermark */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #181715 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7">
          {/* Headline matching Home page font, without trailing dot */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#181715] leading-[1.12]">
            Materials That Match <br className="hidden sm:inline" />
            <span className="text-[#82553E]">Your Requirement</span>
          </h1>

          {/* Elegant Gold Diamond Motif Divider matching Home page */}
          <DiamondMotif align="center" maxWidth="max-w-xs" />

          {/* Simple, Professional, Concise Narrative */}
          <p className="text-base sm:text-lg text-[#55514B] max-w-2xl mx-auto leading-relaxed">
            A trusted supplier of garment accessories and fabrics for apparel manufacturers and clothing brands. From essential trims to custom textile solutions, we support your production needs with quality materials and reliable supply.
          </p>

          {/* Quality Feature Figure Badges */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {/* Figure 1: 100% Spec Matching */}
            <div className="group p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E8E2D8] hover:border-[#D4AF37]/60 shadow-[0_4px_18px_rgba(24,23,21,0.04)] hover:shadow-[0_10px_28px_rgba(212,175,55,0.12)] transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-[#FAF5EE] text-[#82553E] border border-[#ECDCCB] flex items-center justify-center mb-3 shadow-xs group-hover:scale-108 transition-transform duration-300">
                <ShieldCheck className="w-6 h-6 text-[#82553E]" />
              </div>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#181715] tracking-tight block">
                100%
              </span>
              <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#8A847C] font-semibold mt-1">
                Spec Matching
              </span>
              <p className="text-xs text-[#6B655C] mt-1.5 leading-snug">
                Strict GSM, weave &amp; finish fidelity
              </p>
            </div>

            {/* Figure 2: Single Supply Desk */}
            <div className="group p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E8E2D8] hover:border-[#D4AF37]/60 shadow-[0_4px_18px_rgba(24,23,21,0.04)] hover:shadow-[0_10px_28px_rgba(212,175,55,0.12)] transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-[#EEF3F8] text-[#385375] border border-[#D5E1ED] flex items-center justify-center mb-3 shadow-xs group-hover:scale-108 transition-transform duration-300">
                <Package className="w-6 h-6 text-[#385375]" />
              </div>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#181715] tracking-tight block">
                Single
              </span>
              <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#8A847C] font-semibold mt-1">
                Supply Desk
              </span>
              <p className="text-xs text-[#6B655C] mt-1.5 leading-snug">
                Unified fabrics &amp; trims coordination
              </p>
            </div>

            {/* Figure 3: Verified Material Grade */}
            <div className="group p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E8E2D8] hover:border-[#D4AF37]/60 shadow-[0_4px_18px_rgba(24,23,21,0.04)] hover:shadow-[0_10px_28px_rgba(212,175,55,0.12)] transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-[#EFF5F1] text-[#3F5A50] border border-[#D3E5DA] flex items-center justify-center mb-3 shadow-xs group-hover:scale-108 transition-transform duration-300">
                <CheckCircle2 className="w-6 h-6 text-[#3F5A50]" />
              </div>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#181715] tracking-tight block">
                Verified
              </span>
              <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#8A847C] font-semibold mt-1">
                Material Grade
              </span>
              <p className="text-xs text-[#6B655C] mt-1.5 leading-snug">
                Vetted for apparel production durability
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. WHAT WE DO — BESPOKE ARCHITECTURAL BENTO GRID */}
      <section className="py-20 md:py-28 border-b border-[#E8E2D8] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header with refined typography matching Home page */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181715] tracking-tight uppercase">
              WHAT WE DO
            </h2>
            <DiamondMotif align="center" maxWidth="max-w-xs" />
            <p className="text-sm sm:text-base text-[#5C564D] leading-relaxed">
              We supply garment accessories and fabrics across a wide spectrum of requirements, delivering dependable materials tailored to your apparel production.
            </p>
          </div>

          {/* Asymmetrical Double-Bezel Bento Grid — Completely free of bottom footer lines */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Bento Card 1: GARMENT ACCESSORIES */}
            <div className="p-1.5 bg-[#FAF7F2] rounded-2xl ring-1 ring-black/5 hover:ring-[#82553E]/30 transition-all duration-300 group">
              <div className="bg-white rounded-xl p-7 h-full flex flex-col justify-between border border-[#EAE3D6] group-hover:border-[#DFD4C4] transition-colors">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F4EFE8] text-[#82553E] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                    <Tag className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#181715] tracking-tight uppercase">
                    GARMENT ACCESSORIES
                  </h3>
                  <p className="text-xs sm:text-sm text-[#58534C] leading-relaxed">
                    Laces, tags, tapes, buttons and essential finishing trims coordinated for garment production lines.
                  </p>
                </div>
              </div>
            </div>

            {/* Bento Card 2: FABRICS */}
            <div className="p-1.5 bg-[#F4F7FB] rounded-2xl ring-1 ring-black/5 hover:ring-[#385375]/30 transition-all duration-300 group">
              <div className="bg-white rounded-xl p-7 h-full flex flex-col justify-between border border-[#DCE4EC] group-hover:border-[#CCD8E4] transition-colors">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#EAF1F8] text-[#385375] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#181715] tracking-tight uppercase">
                    FABRICS
                  </h3>
                  <p className="text-xs sm:text-sm text-[#58534C] leading-relaxed">
                    A diverse range of woven textiles, unbleached and dyed gadas, denim twills, and specialized mesh.
                  </p>
                </div>
              </div>
            </div>

            {/* Bento Card 3: TAILORED MATERIAL SUPPLY */}
            <div className="p-1.5 bg-[#FAF7F2] rounded-2xl ring-1 ring-black/5 hover:ring-[#82553E]/30 transition-all duration-300 group">
              <div className="bg-white rounded-xl p-7 h-full flex flex-col justify-between border border-[#EAE3D6] group-hover:border-[#DFD4C4] transition-colors">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F4EFE8] text-[#82553E] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#181715] tracking-tight uppercase">
                    TAILORED MATERIAL SUPPLY
                  </h3>
                  <p className="text-xs sm:text-sm text-[#58534C] leading-relaxed">
                    Share your unique material specifications, swatches, or samples to fulfill your exact production needs.
                  </p>
                </div>
              </div>
            </div>

            {/* Bento Card 4: END-TO-END SUPPLY */}
            <div className="p-1.5 bg-[#F2F7F4] rounded-2xl ring-1 ring-black/5 hover:ring-[#3F5A50]/30 transition-all duration-300 group">
              <div className="bg-white rounded-xl p-7 h-full flex flex-col justify-between border border-[#D8E6DF] group-hover:border-[#C8DDD3] transition-colors">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#EBF4EF] text-[#3F5A50] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#181715] tracking-tight uppercase">
                    END-TO-END SUPPLY
                  </h3>
                  <p className="text-xs sm:text-sm text-[#58534C] leading-relaxed">
                    We coordinate dependable production and wholesale distribution aligned with your project timelines.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. WHAT WE OFFER — REFINED GALLERY WITH INTERACTIVE FILTER PILLS */}
      <section className="py-20 md:py-28 border-b border-[#E8E2D8] bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header (No 'Material Categories' badge) */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-3 max-w-xl">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181715] tracking-tight">
                What We Offer
              </h2>
              <p className="text-sm sm:text-base text-[#5C564D] leading-relaxed">
                Explore our diverse selection of garment accessories and fabrics, backed by customized fulfillment for specialized requirements.
              </p>
            </div>

            {/* Interactive Filter Pills */}
            <div className="inline-flex p-1 bg-[#EFE9DF] rounded-full ring-1 ring-black/5 self-start md:self-auto">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-[#181715] text-white shadow-xs'
                    : 'text-[#696156] hover:text-[#181715]'
                }`}
              >
                All Materials
              </button>
              <button
                onClick={() => setActiveFilter('trims')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeFilter === 'trims'
                    ? 'bg-[#181715] text-white shadow-xs'
                    : 'text-[#696156] hover:text-[#181715]'
                }`}
              >
                Trims &amp; Accessories
              </button>
              <button
                onClick={() => setActiveFilter('fabrics')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeFilter === 'fabrics'
                    ? 'bg-[#181715] text-white shadow-xs'
                    : 'text-[#696156] hover:text-[#181715]'
                }`}
              >
                Fabrics &amp; Textiles
              </button>
            </div>
          </div>

          {/* Clean Offering Grid — No 'Source Similar' buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOfferings.map((item, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-2xl border ${item.accent} shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group`}
              >
                {/* Real material photo banner */}
                <div className="relative h-48 bg-[#F4F0E8] overflow-hidden border-b border-[#EAE4D8]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                  <span className="absolute bottom-3 left-3 z-10 text-[11px] font-mono uppercase tracking-wider font-semibold px-3 py-1 rounded-md bg-white/95 text-[#181715] backdrop-blur-xs border border-white/20 shadow-xs">
                    {item.name}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl font-bold text-[#181715] tracking-tight">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5C564D] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Clean Explore Link with Button-in-Button Arrow */}
                  <div className="pt-4 border-t border-[#F2EDE4] flex items-center justify-between">
                    <button
                      onClick={() => onExploreCatalogue(item.categoryKey)}
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#181715] hover:text-[#82553E] transition-colors cursor-pointer group/link"
                    >
                      <span>Explore in Catalogue</span>
                      <span className="w-5 h-5 rounded-full bg-[#FAF7F2] flex items-center justify-center transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5">
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#82553E]" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. THE CLASSIC FASHIONS STANDARD — LUXURY ATELIER QUALITY STRIP */}
      <section className="py-16 md:py-20 border-b border-[#E8E2D8] bg-[#F4F0E8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#181715] text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#C89D6B]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-base font-bold text-[#181715] uppercase tracking-wide">
                  Specification Fidelity
                </h4>
                <p className="text-xs text-[#5C564D] leading-relaxed">
                  Every fabric weight, thread count, button gauge, and trim finish is strictly vetted to match your reference.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#181715] text-white flex items-center justify-center shrink-0">
                <Package className="w-5 h-5 text-[#C89D6B]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-base font-bold text-[#181715] uppercase tracking-wide">
                  Single-Window Supply
                </h4>
                <p className="text-xs text-[#5C564D] leading-relaxed">
                  Consolidate your garment trims and fabrics under one reliable partner, eliminating fragmented vendor coordination.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#181715] text-white flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 text-[#C89D6B]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-base font-bold text-[#181715] uppercase tracking-wide">
                  Production Dependability
                </h4>
                <p className="text-xs text-[#5C564D] leading-relaxed">
                  From development sample yardages to bulk manufacturing volumes, we ensure steady supply on your timelines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ABOUT PAGE FINAL CTA: ARCHITECTURAL SUPPLY DESK INVITATION */}
      {/* 'Beyond the Catalogue' section was completely removed as requested */}
      <section className="py-20 md:py-28 bg-[#181715] text-white relative overflow-hidden">
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <pattern id="unique-cta-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="32" y2="32" stroke="#FFF" strokeWidth="0.8" />
              <line x1="32" y1="0" x2="0" y2="32" stroke="#FFF" strokeWidth="0.8" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#unique-cta-grid)" />
          </svg>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7">
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#C4B7AA] block">
            Direct Supply Coordination
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Looking for Something Specific?
          </h2>

          <p className="text-sm sm:text-base text-[#D4C8BC] max-w-2xl mx-auto leading-relaxed">
            Need a specialized weave, custom GSM, distinct dye lot, or bespoke branded trim? Share your tech pack specifications or physical swatches with our procurement desk. We source, develop, and deliver the precise materials to fulfill your exact production standards.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            {onRequestMaterial && (
              <button
                onClick={onRequestMaterial}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-xs font-semibold uppercase tracking-wider text-[#181715] bg-white hover:bg-[#EAE4DC] rounded-full transition-all shadow-md active:scale-[0.98] cursor-pointer"
              >
                <span>REQUEST A MATERIAL</span>
                <ArrowRight className="w-4 h-4 text-[#82553E]" />
              </button>
            )}
            <button
              onClick={() => onExploreCatalogue()}
              className="group relative inline-flex items-center justify-center gap-3 pl-6 pr-2 py-2 text-xs font-semibold uppercase tracking-[0.16em] rounded-full transition-all duration-300 text-[#FFF8EC] bg-gradient-to-r from-[#181715] via-[#2A2620] to-[#181715] hover:from-[#24211D] hover:to-[#111110] border border-[#D4AF37] hover:border-[#F2D785] shadow-[0_4px_16px_rgba(212,175,55,0.25)] hover:shadow-[0_6px_28px_rgba(212,175,55,0.45)] active:scale-[0.98] cursor-pointer whitespace-nowrap"
            >
              <span className="font-mono text-[11px] tracking-[0.18em] font-bold">Explore Catalogue</span>
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#F2D785] to-[#B38728] text-[#181715] font-bold flex items-center justify-center transition-all duration-300 shadow-sm group-hover:scale-105 group-hover:translate-x-0.5">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
