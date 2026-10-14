import React, { useState } from 'react';
import { ArrowRight, ArrowUpRight, Tag, Layers, Compass, CheckCircle2, ShieldCheck, Sparkles, SlidersHorizontal, Package, Check } from 'lucide-react';
import { BrandLogo } from './BrandLogo.tsx';

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
  const [activeSpecimen, setActiveSpecimen] = useState<number>(0);

  // Curated interactive material specimens for the Atelier interactive showcase
  const specimens = [
    {
      title: 'Embroidered Guipure Lace',
      type: 'Garment Trims',
      image: '/assets/materials/laces.jpg',
      composition: 'Pure Cotton & Silk Blend',
      width: '18 mm – 120 mm',
      finish: 'Matte Soft Wash',
      desc: 'Architectural floral relief with reinforced picot edges for designer necklines, hemlines, and sleeve cuffs.',
      tag: 'Couture Grade',
      categoryKey: 'laces',
    },
    {
      title: 'High-Density Poplin Gada',
      type: 'Apparel Fabric',
      image: '/assets/materials/fabrics/plain.jpg',
      composition: '100% Combed Cotton',
      width: '44” / 58” Width',
      finish: 'Unbleached / Natural Mercerized',
      desc: 'Uniform plain-weave base substrate with balanced warp-weft tension, ideal for premium shirts and pocketing.',
      tag: 'Raw Textile',
      categoryKey: 'fabrics',
    },
    {
      title: 'Indigo Selvedge Denim',
      type: 'Twill Weave',
      image: '/assets/materials/fabrics/denim.jpg',
      composition: 'Ring-Spun Cotton Twill (12.5 oz)',
      width: '32” Shuttle Loom Width',
      finish: 'Rigid Deep Indigo Dye',
      desc: 'Authentic red-line selvedge edge with pronounced diagonal twill texture for premium denim outerwear.',
      tag: 'Heritage Weave',
      categoryKey: 'denim',
    },
    {
      title: 'Custom Brand Trims & Tags',
      type: 'Finishing Accessories',
      image: '/assets/materials/tags.jpg',
      composition: 'Damask Woven / Horn / Coconut',
      width: 'Bespoke Dimensions',
      finish: 'Laser Engraved & Hot Cut',
      desc: 'High-density micro-yarn damask labels and natural horn buttons crafted to client design files.',
      tag: 'Custom Spec',
      categoryKey: 'accessories',
    },
  ];

  // What We Offer items with high-definition bespoke weave patterns
  const whatWeOfferItems = [
    {
      name: 'Garment Laces',
      type: 'trims',
      categoryKey: 'laces',
      description: 'Delicate embroidery lace, soft cotton lace, stretch trims, and decorative borders.',
      accent: 'border-[#D9CFC3] hover:border-[#82553E]',
      tagBg: 'bg-[#F2EDE6] text-[#82553E]',
      pattern: (
        <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
          <pattern id="unique-offer-lace" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="6" fill="none" stroke="#82553E" strokeWidth="0.9" />
            <circle cx="12" cy="12" r="2" fill="#82553E" fillOpacity="0.2" />
            <path d="M0 12 Q6 6 12 12 T24 12" fill="none" stroke="#82553E" strokeWidth="0.6" />
            <path d="M12 0 Q6 6 12 12 T12 24" fill="none" stroke="#82553E" strokeWidth="0.6" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#unique-offer-lace)" />
        </svg>
      ),
    },
    {
      name: 'Fabrics',
      type: 'fabrics',
      categoryKey: 'fabrics',
      description: 'Woven fabric, chambray, unbleached poplin gada, twill gada, drill gada, and dyed textiles.',
      accent: 'border-[#D9CFC3] hover:border-[#385375]',
      tagBg: 'bg-[#EAF1F8] text-[#385375]',
      pattern: (
        <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
          <pattern id="unique-offer-fabrics" width="16" height="16" patternUnits="userSpaceOnUse">
            <line x1="0" y1="16" x2="16" y2="0" stroke="#385375" strokeWidth="1.2" />
            <line x1="0" y1="8" x2="8" y2="0" stroke="#385375" strokeWidth="0.8" />
            <line x1="8" y1="16" x2="16" y2="8" stroke="#385375" strokeWidth="0.8" />
            <circle cx="8" cy="8" r="1.2" fill="#385375" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#unique-offer-fabrics)" />
        </svg>
      ),
    },
    {
      name: 'Denim',
      type: 'fabrics',
      categoryKey: 'denim',
      description: 'Classic indigo twill, slub premium denim, and lightweight garment denim for apparel.',
      accent: 'border-[#D9CFC3] hover:border-[#223E63]',
      tagBg: 'bg-[#E6ECF5] text-[#223E63]',
      pattern: (
        <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
          <pattern id="unique-offer-denim" width="12" height="12" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="12" y2="12" stroke="#223E63" strokeWidth="1.4" />
            <line x1="0" y1="6" x2="6" y2="12" stroke="#223E63" strokeWidth="0.7" strokeDasharray="1 2" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#unique-offer-denim)" />
        </svg>
      ),
    },
    {
      name: 'Mesh',
      type: 'fabrics',
      categoryKey: 'mesh',
      description: 'Open-pore breathable mesh and four-way elastic Lycra power mesh for sportswear and pocketing.',
      accent: 'border-[#D9CFC3] hover:border-[#3F5A50]',
      tagBg: 'bg-[#EBF2EE] text-[#3F5A50]',
      pattern: (
        <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
          <pattern id="unique-offer-mesh" width="14" height="14" patternUnits="userSpaceOnUse">
            <polygon points="7,1 13,4.5 13,11 7,13.5 1,11 1,4.5" fill="none" stroke="#3F5A50" strokeWidth="0.9" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#unique-offer-mesh)" />
        </svg>
      ),
    },
    {
      name: 'Garment Accessories',
      type: 'trims',
      categoryKey: 'accessories',
      description: 'Essential apparel assembly trims, brand tags, tapes, buttons, and finishing sundries.',
      accent: 'border-[#D9CFC3] hover:border-[#735138]',
      tagBg: 'bg-[#F2ECE6] text-[#735138]',
      pattern: (
        <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
          <pattern id="unique-offer-acc" width="18" height="18" patternUnits="userSpaceOnUse">
            <rect x="3" y="3" width="12" height="12" rx="3" fill="none" stroke="#735138" strokeWidth="0.9" />
            <circle cx="9" cy="9" r="2.5" fill="none" stroke="#735138" strokeWidth="0.7" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#unique-offer-acc)" />
        </svg>
      ),
    },
    {
      name: 'Tags',
      type: 'trims',
      categoryKey: 'accessories',
      description: 'Woven damask labels, printed care tags, size indicators, and branded paper hangtags.',
      accent: 'border-[#D9CFC3] hover:border-[#6B5744]',
      tagBg: 'bg-[#F0EBE5] text-[#6B5744]',
      pattern: (
        <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
          <pattern id="unique-offer-tags" width="22" height="16" patternUnits="userSpaceOnUse">
            <path d="M4 2 L15 2 L20 8 L15 14 L4 14 Z" fill="none" stroke="#6B5744" strokeWidth="0.9" />
            <circle cx="8" cy="8" r="1.5" fill="#6B5744" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#unique-offer-tags)" />
        </svg>
      ),
    },
    {
      name: 'Tapes',
      type: 'trims',
      categoryKey: 'accessories',
      description: 'Cotton twill tapes, herringbone tapes, grossgrain ribbons, and seam reinforcement bindings.',
      accent: 'border-[#D9CFC3] hover:border-[#785E48]',
      tagBg: 'bg-[#F3EDE6] text-[#785E48]',
      pattern: (
        <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
          <pattern id="unique-offer-tapes" width="24" height="12" patternUnits="userSpaceOnUse">
            <path d="M0 0 L12 6 L24 0 M0 6 L12 12 L24 6" fill="none" stroke="#785E48" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#unique-offer-tapes)" />
        </svg>
      ),
    },
    {
      name: 'Buttons',
      type: 'trims',
      categoryKey: 'accessories',
      description: 'Shell, wooden, coconut, horn, resin, and customized metal snap buttons for garment lines.',
      accent: 'border-[#D9CFC3] hover:border-[#695340]',
      tagBg: 'bg-[#EFE9E2] text-[#695340]',
      pattern: (
        <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
          <pattern id="unique-offer-buttons" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="9" cy="9" r="7" fill="none" stroke="#695340" strokeWidth="0.9" />
            <circle cx="7" cy="7" r="1" fill="#695340" />
            <circle cx="11" cy="7" r="1" fill="#695340" />
            <circle cx="7" cy="11" r="1" fill="#695340" />
            <circle cx="11" cy="11" r="1" fill="#695340" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#unique-offer-buttons)" />
        </svg>
      ),
    },
    {
      name: 'Other Materials',
      type: 'fabrics',
      categoryKey: 'fabrics',
      description: 'Specialized blends, unlisted weaves, and requirement-specific textile substrates supplied upon request.',
      accent: 'border-[#D9CFC3] hover:border-[#524E48]',
      tagBg: 'bg-[#EAE8E4] text-[#524E48]',
      pattern: (
        <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
          <pattern id="unique-offer-other" width="18" height="18" patternUnits="userSpaceOnUse">
            <line x1="0" y1="9" x2="18" y2="9" stroke="#524E48" strokeWidth="0.9" strokeDasharray="2 3" />
            <line x1="9" y1="0" x2="9" y2="18" stroke="#524E48" strokeWidth="0.9" strokeDasharray="2 3" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#unique-offer-other)" />
        </svg>
      ),
    },
  ];

  const filteredOfferings = whatWeOfferItems.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.type === activeFilter;
  });

  return (
    <div className="bg-[#FAF8F5] text-[#181715] min-h-screen selection:bg-[#181715] selection:text-white">
      
      {/* 1. ASYMMETRICAL ATELIER EDITORIAL HERO */}
      <section className="relative pt-12 pb-20 md:pt-18 md:pb-28 border-b border-[#E8E2D8] bg-[#F7F4EE] overflow-hidden">
        {/* Subtle architectural textile warp-weft weave grid watermark */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #181715 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Brand Statement & Narrative (Cols 1-7) */}
            <div className="lg:col-span-7 space-y-7">
              
              {/* Brand Logo Anchor (No 'about classic fashions' badge underneath) */}
              <div className="flex items-center gap-4">
                <div className="p-1 rounded-2xl bg-black/5 ring-1 ring-black/5 inline-block">
                  <div className="w-14 h-14 rounded-xl bg-[#181715] flex items-center justify-center p-3 shadow-md border border-[#3A3632]">
                    <BrandLogo variant="white" size="md" className="w-full h-auto" />
                  </div>
                </div>
                <div>
                  <span className="font-['Marcellus',serif] text-lg font-bold tracking-[0.08em] text-[#181715] block uppercase">
                    Classic Fashions
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#8C7A6B]">
                    Garment Accessories &amp; Textiles
                  </span>
                </div>
              </div>

              {/* Unique Massive Editorial Headline */}
              <h1 className="font-['Marcellus',serif] text-4xl sm:text-5xl lg:text-6xl font-normal text-[#181715] tracking-tight leading-[1.12]">
                Materials That Match <br className="hidden sm:inline" />
                <span className="italic text-[#82553E]">Your Requirement.</span>
              </h1>

              {/* High-End Professional Narrative (Completely free of 'sourcing' words) */}
              <div className="space-y-4 max-w-2xl text-[#4A4742] text-base sm:text-lg leading-relaxed font-['Plus_Jakarta_Sans',sans-serif]">
                <p>
                  Classic Fashions is a dedicated supplier of garment accessories and fabrics, providing apparel makers, fashion labels, and design studios with the precise materials required for garment lines.
                </p>
                <p className="text-sm sm:text-base text-[#615C54]">
                  With an expansive collection spanning trims, laces, buttons, and specialized textiles, we serve as a dependable, single-window supply partner for apparel manufacturing and custom design collections.
                </p>
                <p className="text-sm sm:text-base text-[#615C54]">
                  When a required material is not part of our regular catalogue, simply share your reference, sample, or specifications. Our team will coordinate and supply the exact materials to fulfill your requirement.
                </p>
              </div>

              {/* Double-Bezel Island Action Buttons with Button-in-Button Trailing Icons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => onExploreCatalogue()}
                  className="group relative inline-flex items-center justify-between gap-4 px-6 py-3.5 bg-[#181715] hover:bg-[#2C2925] text-white rounded-full shadow-sm hover:shadow-md transition-all duration-300 active:scale-[0.98] cursor-pointer"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider font-['Outfit',sans-serif]">
                    Explore Catalogue
                  </span>
                  <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </span>
                </button>

                {onRequestMaterial && (
                  <button
                    onClick={onRequestMaterial}
                    className="group relative inline-flex items-center justify-between gap-4 px-6 py-3.5 bg-white hover:bg-[#F2ECE4] border border-[#DDD5C9] text-[#82553E] rounded-full shadow-xs hover:shadow-sm transition-all duration-300 active:scale-[0.98] cursor-pointer"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider font-['Outfit',sans-serif]">
                      Request a Material
                    </span>
                    <span className="w-7 h-7 rounded-full bg-[#82553E]/10 flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
                      <Compass className="w-3.5 h-3.5 text-[#82553E]" />
                    </span>
                  </button>
                )}
              </div>

              {/* 3 Physical Atelier Quality Indicators */}
              <div className="pt-6 border-t border-[#E8E2D8] grid grid-cols-3 gap-4 max-w-lg">
                <div>
                  <span className="font-['Marcellus',serif] text-xl font-bold text-[#181715] block">
                    100%
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#8A847C] block mt-0.5">
                    Spec Matching
                  </span>
                </div>
                <div>
                  <span className="font-['Marcellus',serif] text-xl font-bold text-[#181715] block">
                    Single
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#8A847C] block mt-0.5">
                    Supply Desk
                  </span>
                </div>
                <div>
                  <span className="font-['Marcellus',serif] text-xl font-bold text-[#181715] block">
                    Verified
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#8A847C] block mt-0.5">
                    Material Grade
                  </span>
                </div>
              </div>

            </div>

            {/* Right Column: Unique Interactive "Atelier Material Specimen" Card (Cols 8-12) */}
            <div className="lg:col-span-5">
              <div className="p-2 bg-[#EFE9DF] rounded-3xl ring-1 ring-black/5 shadow-[0_20px_50px_rgba(24,23,21,0.08)]">
                <div className="bg-white rounded-[calc(1.5rem-2px)] p-6 sm:p-7 space-y-6 border border-[#E8E2D8]">
                  
                  {/* Swatch Dossier Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE4]">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#82553E] block font-bold">
                        MATERIAL DOSSIER
                      </span>
                      <h3 className="font-['Marcellus',serif] text-lg font-bold text-[#181715]">
                        Atelier Specifications
                      </h3>
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#F4F0E8] text-[#7A6F62] border border-[#E6DFD3]">
                      0{activeSpecimen + 1} / 04
                    </span>
                  </div>

                  {/* Specimen Selector Tabs */}
                  <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#FAF8F5] rounded-xl border border-[#ECE7DE]">
                    {specimens.map((spec, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveSpecimen(index)}
                        className={`py-2 px-1 text-center rounded-lg text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                          activeSpecimen === index
                            ? 'bg-[#181715] text-white shadow-xs font-bold'
                            : 'text-[#7A7368] hover:text-[#181715] hover:bg-white'
                        }`}
                      >
                        SPEC 0{index + 1}
                      </button>
                    ))}
                  </div>

                  {/* Dynamic Specimen Details Card */}
                  <div className="bg-[#FBF9F5] rounded-2xl p-5 border border-[#EAE4D8] space-y-4">
                    {/* Real Physical Textile Swatch Visual */}
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#ECE6DC] border border-[#DDD5C7] shadow-inner">
                      <img
                        src={specimens[activeSpecimen].image}
                        alt={specimens[activeSpecimen].title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-106"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-white/20 pointer-events-none" />
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#82553E] font-semibold">
                          {specimens[activeSpecimen].type}
                        </span>
                        <h4 className="font-['Marcellus',serif] text-xl font-bold text-[#181715] mt-0.5">
                          {specimens[activeSpecimen].title}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EFE8DF] text-[#6E4F39] border border-[#DFD3C3] whitespace-nowrap">
                        {specimens[activeSpecimen].tag}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#5C564D] leading-relaxed font-['Plus_Jakarta_Sans',sans-serif]">
                      {specimens[activeSpecimen].desc}
                    </p>

                    {/* Technical Specification Matrix */}
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#EAE4D8] text-xs">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#91897F] block">
                          Composition
                        </span>
                        <span className="font-medium text-[#292723] block text-[11px] mt-0.5">
                          {specimens[activeSpecimen].composition}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#91897F] block">
                          Format / Width
                        </span>
                        <span className="font-medium text-[#292723] block text-[11px] mt-0.5">
                          {specimens[activeSpecimen].width}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Specimen Direct Action */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => onExploreCatalogue(specimens[activeSpecimen].categoryKey)}
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#181715] hover:text-[#82553E] transition-colors cursor-pointer"
                    >
                      <span>Explore this material</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    {onRequestMaterial && (
                      <button
                        onClick={onRequestMaterial}
                        className="text-xs font-semibold text-[#82553E] hover:underline cursor-pointer"
                      >
                        Submit custom spec &rarr;
                      </button>
                    )}
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. WHAT WE DO — BESPOKE ARCHITECTURAL BENTO GRID */}
      <section className="py-20 md:py-28 border-b border-[#E8E2D8] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header with refined Marcellus typography */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="font-['Marcellus',serif] text-3xl sm:text-4xl lg:text-5xl font-normal text-[#181715] tracking-[0.08em] uppercase">
              WHAT WE DO
            </h2>
            <p className="text-sm sm:text-base text-[#5C564D] leading-relaxed font-['Plus_Jakarta_Sans',sans-serif]">
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
                  <h3 className="font-['Marcellus',serif] text-xl font-bold text-[#181715] tracking-wide uppercase">
                    GARMENT ACCESSORIES
                  </h3>
                  <p className="text-xs sm:text-sm text-[#58534C] leading-relaxed font-['Plus_Jakarta_Sans',sans-serif]">
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
                  <h3 className="font-['Marcellus',serif] text-xl font-bold text-[#181715] tracking-wide uppercase">
                    FABRICS
                  </h3>
                  <p className="text-xs sm:text-sm text-[#58534C] leading-relaxed font-['Plus_Jakarta_Sans',sans-serif]">
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
                  <h3 className="font-['Marcellus',serif] text-xl font-bold text-[#181715] tracking-wide uppercase">
                    TAILORED MATERIAL SUPPLY
                  </h3>
                  <p className="text-xs sm:text-sm text-[#58534C] leading-relaxed font-['Plus_Jakarta_Sans',sans-serif]">
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
                  <h3 className="font-['Marcellus',serif] text-xl font-bold text-[#181715] tracking-wide uppercase">
                    END-TO-END SUPPLY
                  </h3>
                  <p className="text-xs sm:text-sm text-[#58534C] leading-relaxed font-['Plus_Jakarta_Sans',sans-serif]">
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
              <h2 className="font-['Marcellus',serif] text-3xl sm:text-4xl lg:text-5xl font-normal text-[#181715] tracking-[0.05em]">
                What We Offer
              </h2>
              <p className="text-sm sm:text-base text-[#5C564D] leading-relaxed font-['Plus_Jakarta_Sans',sans-serif]">
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
                {/* Visual texture banner with high-definition weave art */}
                <div className="relative h-32 bg-[#F4F0E8] overflow-hidden border-b border-[#EAE4D8] flex items-center justify-center">
                  <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                    {item.pattern}
                  </div>
                  <span className={`relative z-10 text-[11px] font-mono uppercase tracking-wider font-semibold px-3 py-1 rounded-sm border border-black/5 shadow-xs ${item.tagBg}`}>
                    {item.name}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-['Marcellus',serif] text-xl font-bold text-[#181715] tracking-tight">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5C564D] leading-relaxed font-['Plus_Jakarta_Sans',sans-serif]">
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
                <h4 className="font-['Marcellus',serif] text-base font-bold text-[#181715] uppercase tracking-wide">
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
                <h4 className="font-['Marcellus',serif] text-base font-bold text-[#181715] uppercase tracking-wide">
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
                <h4 className="font-['Marcellus',serif] text-base font-bold text-[#181715] uppercase tracking-wide">
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

          <h2 className="font-['Marcellus',serif] text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[0.04em] text-white">
            Looking for Something Specific?
          </h2>

          <p className="text-sm sm:text-base text-[#BDB5AB] max-w-xl mx-auto leading-relaxed font-['Plus_Jakarta_Sans',sans-serif]">
            If you don&apos;t find the exact material you need in our catalogue, share your specifications with us. We will review your request and arrange the right materials.
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
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-xs font-semibold uppercase tracking-wider text-white border border-[#48443E] hover:bg-[#282622] rounded-full transition-colors active:scale-[0.98] cursor-pointer"
            >
              <span>EXPLORE CATALOGUE</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
