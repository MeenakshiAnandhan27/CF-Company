import React from 'react';
import { ArrowRight, Tag, Layers, Scissors, Sparkles, Send, Compass, ShieldCheck, CheckCircle2, Search, ArrowUpRight } from 'lucide-react';
import { BrandLogo } from './BrandLogo.tsx';

interface AboutSectionProps {
  onExploreCatalogue: (category?: string) => void;
  onRequestMaterial?: () => void;
  onReachUs: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onExploreCatalogue,
  onRequestMaterial,
}) => {
  // Clean category offerings without numerical labels (01, 02, etc.)
  const whatWeOfferItems = [
    {
      name: 'Garment Laces',
      categoryKey: 'laces',
      description: 'Delicate embroidery lace, soft cotton lace, stretch trims, and decorative borders.',
      accent: 'border-[#D9CFC3] hover:border-[#82553E]',
      tagBg: 'bg-[#F2EDE6] text-[#82553E]',
      pattern: (
        <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
          <pattern id="offer-lace" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="5" fill="none" stroke="#82553E" strokeWidth="0.8" />
            <circle cx="0" cy="0" r="3" fill="none" stroke="#82553E" strokeWidth="0.5" />
            <circle cx="20" cy="20" r="3" fill="none" stroke="#82553E" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#offer-lace)" />
        </svg>
      ),
    },
    {
      name: 'Fabrics',
      categoryKey: 'fabrics',
      description: 'Woven fabric, chambray, unbleached poplin gada, twill gada, drill gada, and dyed textiles.',
      accent: 'border-[#D9CFC3] hover:border-[#385375]',
      tagBg: 'bg-[#EAF1F8] text-[#385375]',
      pattern: (
        <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
          <pattern id="offer-fabrics" width="12" height="12" patternUnits="userSpaceOnUse">
            <line x1="0" y1="12" x2="12" y2="0" stroke="#385375" strokeWidth="1" />
            <line x1="0" y1="6" x2="6" y2="0" stroke="#385375" strokeWidth="0.8" />
            <line x1="6" y1="12" x2="12" y2="6" stroke="#385375" strokeWidth="0.8" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#offer-fabrics)" />
        </svg>
      ),
    },
    {
      name: 'Denim',
      categoryKey: 'denim',
      description: 'Classic indigo twill, slub premium denim, and lightweight garment denim for apparel.',
      accent: 'border-[#D9CFC3] hover:border-[#223E63]',
      tagBg: 'bg-[#E6ECF5] text-[#223E63]',
      pattern: (
        <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
          <pattern id="offer-denim" width="10" height="10" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="10" y2="10" stroke="#223E63" strokeWidth="1.2" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#offer-denim)" />
        </svg>
      ),
    },
    {
      name: 'Mesh',
      categoryKey: 'mesh',
      description: 'Open-pore breathable mesh and four-way elastic Lycra power mesh for sportswear and pocketing.',
      accent: 'border-[#D9CFC3] hover:border-[#3F5A50]',
      tagBg: 'bg-[#EBF2EE] text-[#3F5A50]',
      pattern: (
        <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
          <pattern id="offer-mesh" width="12" height="12" patternUnits="userSpaceOnUse">
            <polygon points="6,1 11,4 11,8 6,11 1,8 1,4" fill="none" stroke="#3F5A50" strokeWidth="0.8" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#offer-mesh)" />
        </svg>
      ),
    },
    {
      name: 'Garment Accessories',
      categoryKey: 'accessories',
      description: 'Essential apparel assembly trims, brand tags, tapes, buttons, and finishing sundries.',
      accent: 'border-[#D9CFC3] hover:border-[#735138]',
      tagBg: 'bg-[#F2ECE6] text-[#735138]',
      pattern: (
        <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
          <pattern id="offer-acc" width="16" height="16" patternUnits="userSpaceOnUse">
            <rect x="3" y="3" width="10" height="10" rx="2" fill="none" stroke="#735138" strokeWidth="0.8" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#offer-acc)" />
        </svg>
      ),
    },
    {
      name: 'Tags',
      categoryKey: 'accessories',
      description: 'Woven damask labels, printed care tags, size indicators, and branded paper hangtags.',
      accent: 'border-[#D9CFC3] hover:border-[#6B5744]',
      tagBg: 'bg-[#F0EBE5] text-[#6B5744]',
      pattern: (
        <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
          <pattern id="offer-tags" width="20" height="14" patternUnits="userSpaceOnUse">
            <path d="M4 2 L14 2 L18 7 L14 12 L4 12 Z" fill="none" stroke="#6B5744" strokeWidth="0.8" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#offer-tags)" />
        </svg>
      ),
    },
    {
      name: 'Tapes',
      categoryKey: 'accessories',
      description: 'Cotton twill tapes, herringbone tapes, grossgrain ribbons, and seam reinforcement bindings.',
      accent: 'border-[#D9CFC3] hover:border-[#785E48]',
      tagBg: 'bg-[#F3EDE6] text-[#785E48]',
      pattern: (
        <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
          <pattern id="offer-tapes" width="20" height="10" patternUnits="userSpaceOnUse">
            <path d="M0 0 L10 5 L20 0 M0 5 L10 10 L20 5" fill="none" stroke="#785E48" strokeWidth="0.8" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#offer-tapes)" />
        </svg>
      ),
    },
    {
      name: 'Buttons',
      categoryKey: 'accessories',
      description: 'Shell, wooden, coconut, horn, resin, and customized metal snap buttons for garment lines.',
      accent: 'border-[#D9CFC3] hover:border-[#695340]',
      tagBg: 'bg-[#EFE9E2] text-[#695340]',
      pattern: (
        <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
          <pattern id="offer-buttons" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="8" r="6" fill="none" stroke="#695340" strokeWidth="0.8" />
            <circle cx="6" cy="8" r="0.8" fill="#695340" />
            <circle cx="10" cy="8" r="0.8" fill="#695340" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#offer-buttons)" />
        </svg>
      ),
    },
    {
      name: 'Other Materials',
      categoryKey: 'fabrics',
      description: 'Specialized blends, unlisted weaves, and requirement-specific textile substrates sourced upon request.',
      accent: 'border-[#D9CFC3] hover:border-[#524E48]',
      tagBg: 'bg-[#EAE8E4] text-[#524E48]',
      pattern: (
        <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
          <pattern id="offer-other" width="16" height="16" patternUnits="userSpaceOnUse">
            <line x1="0" y1="8" x2="16" y2="8" stroke="#524E48" strokeWidth="0.8" strokeDasharray="2 2" />
            <line x1="8" y1="0" x2="8" y2="16" stroke="#524E48" strokeWidth="0.8" strokeDasharray="2 2" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#offer-other)" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-[#FBFBFA] min-h-screen">
      
      {/* 1. ABOUT CLASSIC FASHIONS — HERO & INTRODUCTION */}
      <section className="py-16 md:py-24 border-b border-[#E8E6E0] bg-[#F7F5F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          {/* Brand Mark */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-xl bg-[#181715] flex items-center justify-center p-3.5 shadow-md border border-[#3A3632]">
              <BrandLogo variant="white" size="md" className="w-full h-auto" />
            </div>
          </div>

          {/* Subtitle / Category Badge */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#82553E] bg-[#EFE8DF] px-4 py-1.5 rounded-sm border border-[#DFD6CB] font-mono">
            <span>ABOUT CLASSIC FASHIONS</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181715] tracking-tight">
            Materials That Match Your Requirement.
          </h1>

          {/* Concise, Professional Narrative */}
          <div className="space-y-4 max-w-3xl mx-auto text-[#4A4742] text-base sm:text-lg leading-relaxed font-normal">
            <p>
              Classic Fashions is a garment accessories and fabrics supplier focused on helping businesses find the materials they need — from everyday requirements to specific sourcing requests.
            </p>
            <p className="text-sm sm:text-base text-[#585550]">
              With a broad range of garment accessories and fabric categories, we provide customers with a practical sourcing option for materials used across garment production and related applications.
            </p>
            <p className="text-sm sm:text-base text-[#585550]">
              When a required material is not part of our regular catalogue, customers can share their specifications or reference. We can explore suitable sourcing options and arrange the material according to the requirement.
            </p>
          </div>

          {/* Sourcing Quick Action */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onExploreCatalogue()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#181715] hover:bg-[#302D29] rounded transition-all shadow-sm"
            >
              <span>Explore Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {onRequestMaterial && (
              <button
                onClick={onRequestMaterial}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#82553E] bg-white border border-[#D5C6B5] hover:bg-[#F2ECE4] rounded transition-colors"
              >
                <Compass className="w-4 h-4" />
                <span>Request a Material</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. WHAT WE DO */}
      <section className="py-16 md:py-20 border-b border-[#E8E6E0] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#82553E] block font-mono">
              Core Sourcing Competencies
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#181715]">
              WHAT WE DO
            </h2>
            <p className="text-sm sm:text-base text-[#585550] leading-relaxed">
              We supply garment accessories and fabrics across a wide range of material requirements, helping customers source the right material for their application.
            </p>
          </div>

          {/* 4 Clean Visual Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Point 1: GARMENT ACCESSORIES */}
            <div className="bg-[#FAF9F6] p-6 rounded-xl border border-[#E8E4DC] hover:border-[#82553E] transition-all flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-lg bg-[#F2EDE6] text-[#82553E] flex items-center justify-center mb-4">
                  <Tag className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#181715] mb-2 uppercase tracking-wide">
                  GARMENT ACCESSORIES
                </h3>
                <p className="text-xs sm:text-sm text-[#585550] leading-relaxed">
                  Laces, tags, tapes, buttons and related materials.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#EDE7DE] text-[11px] font-mono text-[#8C877E]">
                Trims &amp; Apparel Accessories
              </div>
            </div>

            {/* Point 2: FABRICS */}
            <div className="bg-[#FAF9F6] p-6 rounded-xl border border-[#E8E4DC] hover:border-[#385375] transition-all flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-lg bg-[#EAF1F8] text-[#385375] flex items-center justify-center mb-4">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#181715] mb-2 uppercase tracking-wide">
                  FABRICS
                </h3>
                <p className="text-xs sm:text-sm text-[#585550] leading-relaxed">
                  A diverse range of fabrics and specialized textile materials.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#EDE7DE] text-[11px] font-mono text-[#8C877E]">
                Woven, Gadas, Denim &amp; Mesh
              </div>
            </div>

            {/* Point 3: REQUIREMENT-BASED SOURCING */}
            <div className="bg-[#FAF9F6] p-6 rounded-xl border border-[#E8E4DC] hover:border-[#82553E] transition-all flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-lg bg-[#F2EDE6] text-[#82553E] flex items-center justify-center mb-4">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#181715] mb-2 uppercase tracking-wide">
                  REQUIREMENT-BASED SOURCING
                </h3>
                <p className="text-xs sm:text-sm text-[#585550] leading-relaxed">
                  Specific material requirements can be shared with our team for sourcing.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#EDE7DE] text-[11px] font-mono text-[#8C877E]">
                Tailored Specifications
              </div>
            </div>

            {/* Point 4: SUPPLY SUPPORT */}
            <div className="bg-[#FAF9F6] p-6 rounded-xl border border-[#E8E4DC] hover:border-[#3F5A50] transition-all flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-lg bg-[#EBF2EE] text-[#3F5A50] flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#181715] mb-2 uppercase tracking-wide">
                  SUPPLY SUPPORT
                </h3>
                <p className="text-xs sm:text-sm text-[#585550] leading-relaxed">
                  We coordinate suitable sourcing options based on the customer&apos;s requirement.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#EDE7DE] text-[11px] font-mono text-[#8C877E]">
                End-to-End Coordination
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. WHAT WE OFFER — NO NUMERICAL LABELS (01, 02...) */}
      <section className="py-16 md:py-22 border-b border-[#E8E6E0] bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#82553E] block font-mono">
              Material Categories
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#181715]">
              What We Offer
            </h2>
            <p className="text-sm sm:text-base text-[#585550] leading-relaxed">
              Explore a range of garment accessories and fabric materials, with sourcing support for requirements beyond the regular catalogue.
            </p>
          </div>

          {/* Clean 9-Item Grid Without Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whatWeOfferItems.map((item, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-xl border ${item.accent} shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between`}
              >
                {/* Visual texture banner */}
                <div className="relative h-28 bg-[#F4F1EA] overflow-hidden border-b border-[#EAE6DF] flex items-center justify-center">
                  <div className="absolute inset-0">
                    {item.pattern}
                  </div>
                  <span className={`relative z-10 text-[11px] font-mono uppercase tracking-wider font-semibold px-3 py-1 rounded-sm border border-black/5 ${item.tagBg}`}>
                    {item.name}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl font-bold text-[#181715] tracking-tight">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#585550] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Explore Link */}
                  <div className="pt-3 border-t border-[#F0ECE4] flex items-center justify-between">
                    <button
                      onClick={() => onExploreCatalogue(item.categoryKey)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#181715] hover:text-[#82553E] transition-colors"
                    >
                      <span>Explore in Catalogue</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    {onRequestMaterial && (
                      <button
                        onClick={onRequestMaterial}
                        className="text-[11px] font-medium text-[#736F68] hover:text-[#181715] transition-colors underline"
                      >
                        Source Similar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. BEYOND THE CATALOGUE (Heroic Sourcing Showcase) */}
      <section className="py-16 md:py-20 border-b border-[#E8E6E0] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#181715] text-white p-8 sm:p-12 rounded-2xl shadow-xl relative overflow-hidden space-y-6">
            
            {/* Subtle background weave design */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <pattern id="beyond-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="24" y2="24" stroke="#FFF" strokeWidth="0.8" />
                  <line x1="24" y1="0" x2="0" y2="24" stroke="#FFF" strokeWidth="0.8" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#beyond-grid)" />
              </svg>
            </div>

            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C4B7AA] font-mono">
                <Sparkles className="w-3.5 h-3.5 text-[#E5D7CC]" />
                <span>BEYOND THE CATALOGUE</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                Not every requirement fits into a catalogue.
              </h2>

              <p className="text-sm sm:text-base text-[#D1C9BE] leading-relaxed max-w-2xl">
                Tell us what you are looking for. If the exact material is not listed, share the details, specifications or a reference image and our team can explore suitable sourcing options.
              </p>
            </div>

            <div className="relative z-10 pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {onRequestMaterial && (
                <button
                  onClick={onRequestMaterial}
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-xs font-semibold uppercase tracking-wider text-[#181715] bg-white hover:bg-[#EAE6DF] rounded transition-all font-sans shadow-sm"
                >
                  <Send className="w-4 h-4 text-[#82553E]" />
                  <span>REQUEST A MATERIAL</span>
                </button>
              )}
              <button
                onClick={() => onExploreCatalogue()}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white border border-[#444039] hover:bg-[#25221F] rounded transition-colors"
              >
                <span>View Current Catalogue</span>
              </button>
            </div>

            {/* Sourcing workflow steps */}
            <div className="relative z-10 pt-6 border-t border-[#33302C] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#B3ACA3]">
              <div>
                <span className="font-semibold text-white block uppercase tracking-wider text-[11px]">1. Share Reference</span>
                <span className="text-[11px] text-[#8C877E] mt-0.5 block">Swatch, photo, yarn count, or weave specs</span>
              </div>
              <div>
                <span className="font-semibold text-white block uppercase tracking-wider text-[11px]">2. Source &amp; Match</span>
                <span className="text-[11px] text-[#8C877E] mt-0.5 block">Explored through verified supply partners</span>
              </div>
              <div>
                <span className="font-semibold text-white block uppercase tracking-wider text-[11px]">3. Reliable Delivery</span>
                <span className="text-[11px] text-[#8C877E] mt-0.5 block">Wholesale supply or sample quantities</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. ABOUT PAGE FINAL CTA: LOOKING FOR SOMETHING SPECIFIC? */}
      {/* NO physical address anywhere here */}
      <section className="py-16 md:py-20 bg-[#F7F5F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#82553E] block font-mono">
            Get In Touch
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#181715]">
            Looking for Something Specific?
          </h2>

          <p className="text-sm sm:text-base text-[#585550] max-w-xl mx-auto leading-relaxed">
            If you don&apos;t find the material you need in our catalogue, share your requirement with us. We&apos;ll review the details and explore suitable sourcing options.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            {onRequestMaterial && (
              <button
                onClick={onRequestMaterial}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#181715] hover:bg-[#302D29] rounded transition-all shadow-sm"
              >
                <span>REQUEST A MATERIAL</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onExploreCatalogue()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#181715] bg-white border border-[#D5D0C6] hover:bg-[#F2EFEA] rounded transition-colors"
            >
              <span>EXPLORE CATALOGUE</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
