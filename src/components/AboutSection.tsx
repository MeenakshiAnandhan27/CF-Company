import React from 'react';
import { ArrowRight, Layers, Tag, Scissors, Sparkles, Store, Compass, Search, CheckCircle2, PackageCheck } from 'lucide-react';

interface AboutSectionProps {
  onExploreCatalogue: () => void;
  onReachUs: () => void;
  onRequestMaterial?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onExploreCatalogue,
  onReachUs,
  onRequestMaterial,
}) => {
  const offerings = [
    {
      title: 'Garment Accessories',
      description: 'Woven brand tags, custom buttons, cotton twill and grossgrain tapes, and essential garment trims.',
      icon: Tag,
    },
    {
      title: 'Fabrics',
      description: 'Woven fabric, chambray, unbleached poplin gada, twill gada, drill gada, dyed textiles, and specialty fabrics.',
      icon: Layers,
    },
    {
      title: 'Laces',
      description: 'Extensive variety of embroidery lace, soft cotton lace, Lycra stretch lace, Ric Rac wave trims, and imported laces.',
      icon: Sparkles,
    },
    {
      title: 'Denim',
      description: 'Classic denim twill, slub premium denim, and lightweight garment denim for apparel lines.',
      icon: Layers,
    },
    {
      title: 'Mesh',
      description: 'Breathable open-pore mesh and four-way elastic Lycra power mesh for sportswear linings, pocketing, and athleisure.',
      icon: Scissors,
    },
    {
      title: 'Requirement-Based Sourcing',
      description: 'Sourcing of specific compositions, weaves, colours, or custom trims from suitable manufacturing and supply partners.',
      icon: Compass,
    },
    {
      title: 'Specialized Materials',
      description: 'Diverse textile substrates and trim solutions suited for local knitwear units, boutique designers, and export garments.',
      icon: Store,
    },
    {
      title: 'Processing Coordination',
      description: 'Edge cutting and roll scalping services coordinated for precision slit borders ready for garment assembly.',
      icon: Scissors,
    },
  ];

  return (
    <div className="bg-[#FBFBFA] min-h-screen pb-20">
      
      {/* Dedicated About Header Banner */}
      <section className="py-16 md:py-24 border-b border-[#E8E6E0] bg-[#F7F5F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          {/* Location Highlight */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#82553E] bg-[#EFE8DF] px-4 py-1.5 rounded-sm border border-[#DFD6CB] font-mono">
            <span>SUPPLIER OF GARMENT ACCESSORIES &amp; FABRICS</span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181715] tracking-tight">
            About Classic Fashions
          </h1>

          <div className="max-w-3xl mx-auto space-y-4 text-base sm:text-lg text-[#4A4742] leading-relaxed text-pretty">
            <p>
              Classic Fashions is a garment accessories and fabrics supplier based in Boyampalayam, Tiruppur, Tamil Nadu.
            </p>
            <p className="text-sm sm:text-base text-[#585550]">
              Rather than limiting customers to a fixed range of materials, we work around their requirements. When a specific fabric, accessory or material is not available in our catalogue, customers can share their requirement with us and we can explore suitable sourcing options.
            </p>
            <p className="text-sm sm:text-base text-[#585550]">
              Based on the requirement, material can be sourced from appropriate manufacturing or supply sources and arranged for the customer.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            {onRequestMaterial && (
              <button
                onClick={onRequestMaterial}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#181715] rounded hover:bg-[#302D29] transition-all shadow-sm"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Request a Material</span>
              </button>
            )}
            <button
              onClick={onExploreCatalogue}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#181715] bg-white border border-[#D5D0C6] rounded hover:bg-[#EFECE6] transition-colors"
            >
              <span>Explore Catalogue</span>
            </button>
          </div>
        </div>
      </section>

      {/* HOW OUR SOURCING WORKS */}
      <section className="py-16 md:py-20 border-b border-[#E8E6E0] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#82553E] block mb-2 font-mono">
              The Sourcing Workflow
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#181715]">
              From Requirement to Supply
            </h2>
            <p className="text-sm text-[#585550] mt-2">
              How Classic Fashions partners with garment businesses to procure the right materials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-[#FAF9F6] rounded-xl border border-[#EAE6DF] space-y-3">
              <span className="text-xs font-mono font-bold text-[#82553E] uppercase block">01 / Share</span>
              <h3 className="font-serif text-lg font-bold text-[#181715]">Understand Requirement</h3>
              <p className="text-xs text-[#585550] leading-relaxed">
                We analyze your exact technical parameters: fiber composition, yarn count, GSM, weave, stretch, shade, or physical sample.
              </p>
            </div>

            <div className="p-6 bg-[#FAF9F6] rounded-xl border border-[#EAE6DF] space-y-3">
              <span className="text-xs font-mono font-bold text-[#82553E] uppercase block">02 / Source</span>
              <h3 className="font-serif text-lg font-bold text-[#181715]">Source from Partners</h3>
              <p className="text-xs text-[#585550] leading-relaxed">
                We tap into our established network of reputable fabric mills, lace makers, trim manufacturers, and supply sources.
              </p>
            </div>

            <div className="p-6 bg-[#FAF9F6] rounded-xl border border-[#EAE6DF] space-y-3">
              <span className="text-xs font-mono font-bold text-[#82553E] uppercase block">03 / Match</span>
              <h3 className="font-serif text-lg font-bold text-[#181715]">Match Specifications</h3>
              <p className="text-xs text-[#585550] leading-relaxed">
                We verify sample feel, width tolerances, and finish consistency before finalizing the supply arrangement.
              </p>
            </div>

            <div className="p-6 bg-[#FAF9F6] rounded-xl border border-[#EAE6DF] space-y-3">
              <span className="text-xs font-mono font-bold text-[#82553E] uppercase block">04 / Supply</span>
              <h3 className="font-serif text-lg font-bold text-[#181715]">Supply to Customer</h3>
              <p className="text-xs text-[#585550] leading-relaxed">
                Reliable delivery arranged for your garment production runs, boutique collections, or sampling schedules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE OFFER Section */}
      <section className="py-16 md:py-20 border-b border-[#E8E6E0] bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#82553E] block mb-2 font-mono">
              Material Range
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#181715]">
              WHAT WE OFFER
            </h2>
            <p className="text-sm text-[#585550] mt-2">
              Comprehensive garment accessories, fabrics, and custom sourcing solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offerings.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-xl border border-[#E8E4DC] hover:border-[#BFB8AC] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded bg-[#F2EDE6] text-[#82553E] flex items-center justify-center">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-mono text-[#8C877E]">0{idx + 1}</span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-[#181715]">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#585550] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Wholesale & Retail Supply Context */}
      <section className="py-16 md:py-20 border-b border-[#E8E6E0] bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FAF8F5] p-8 sm:p-10 rounded-xl border border-[#E5E0D6] shadow-sm space-y-6">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#82553E] block font-mono">
              Tiruppur Garment Ecosystem
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#181715]">
              Serving Garment Businesses, Fashion Designers &amp; Retail Buyers
            </h3>
            <p className="text-sm text-[#585550] leading-relaxed">
              Based in Boyampalayam, Tiruppur, Classic Fashions assists garment units, job-work stitching houses, fashion labels, and retail buyers in accessing the right accessories and textiles without delays. Whether you require commercial bulk roll quantities or smaller boutique batches, we arrange materials aligned with your exact needs.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white rounded-lg border border-[#EAE6DF] space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#181715] block">
                  Wholesale Procurement
                </span>
                <span className="text-xs text-[#585550]">
                  Full rolls of woven fabrics, denim bolts, mesh, and bulk accessory spools sourced for commercial apparel production.
                </span>
              </div>

              <div className="p-4 bg-white rounded-lg border border-[#EAE6DF] space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#181715] block">
                  Retail &amp; Sampling Supply
                </span>
                <span className="text-xs text-[#585550]">
                  Accessible quantities for designers, tailors, sample rooms, and regional garment buyers requiring flexible yardage.
                </span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={onExploreCatalogue}
                className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#181715] hover:bg-[#302D29] rounded transition-colors"
              >
                Browse Digital Catalogue
              </button>
              <button
                onClick={onReachUs}
                className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#181715] border border-[#BFB8AC] hover:bg-white rounded transition-colors"
              >
                Contact Our Desk
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
