import React from 'react';
import { businessConfig } from '../data/businessConfig.ts';
import { MapPin, ArrowRight, Layers, Tag, Scissors, Sparkles, Store, Check, ExternalLink } from 'lucide-react';
import { BrandLogo } from './BrandLogo.tsx';

interface AboutSectionProps {
  onExploreCatalogue: () => void;
  onReachUs: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onExploreCatalogue,
  onReachUs,
}) => {
  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    '5/1475, 5th Street, Palanisamy Nagar, Boyampalayam, Tiruppur, Tamil Nadu 641602'
  )}`;

  const offerings = [
    {
      title: 'Garment Accessories',
      description: 'Woven brand tags, custom buttons, cotton twill and grossgrain tapes, and essential manufacturing trims.',
      icon: Tag,
    },
    {
      title: 'Fabrics',
      description: 'Woven fabric, chambray, unbleached poplin gada, twill gada, drill gada, dyed textiles, and specialty fur fabrics.',
      icon: Layers,
    },
    {
      title: 'Laces',
      description: 'Extensive variety of embroidery lace, soft cotton lace, Lycra stretch lace, Ric Rac wave trims, and imported laces.',
      icon: Sparkles,
    },
    {
      title: 'Denim',
      description: 'Dedicated collection of classic denim twill, slub premium denim, and lightweight garment denim for apparel lines.',
      icon: Layers,
    },
    {
      title: 'Mesh',
      description: 'Breathable open-pore mesh and four-way elastic Lycra power mesh for sportswear linings, pocketing, and athleisure.',
      icon: Scissors,
    },
    {
      title: 'Specialized Materials',
      description: 'Diverse textile substrates and trim solutions suited for local knitwear units, boutique designers, and export garments.',
      icon: Store,
    },
    {
      title: 'Processing',
      description: 'In-house edge cutting and roll scalping services providing clean, precision slit borders ready for production lines.',
      icon: Scissors,
    },
  ];

  return (
    <div className="bg-[#FBFBFA] min-h-screen pb-20">
      
      {/* 17. Dedicated About Header Banner */}
      <section className="py-16 md:py-24 border-b border-[#E8E6E0] bg-[#F7F5F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          {/* Official Emblem Mark */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-xl bg-[#181715] flex items-center justify-center p-3 shadow-md border border-[#3A3632]">
              <BrandLogo variant="white" size="md" className="w-full h-auto" />
            </div>
          </div>

          {/* Location Highlight */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#82553E] bg-[#EFE8DF] px-4 py-1.5 rounded-sm border border-[#DFD6CB] font-mono">
            <MapPin className="w-3.5 h-3.5" />
            <span>BOYAMPALAYAM, TIRUPPUR</span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181715] tracking-tight">
            About Classic Fashions
          </h1>

          <p className="text-base sm:text-lg text-[#4A4742] max-w-3xl mx-auto leading-relaxed text-pretty">
            CLASSIC FASHIONS is a specialized garment accessories and fabric business located in Boyampalayam, Tiruppur, Tamil Nadu. The business focuses on woven fabric manufacturing, wholesale and retail supply, and a wide selection of garment accessories and specialized fabrics.
          </p>

          <p className="text-sm text-[#585550] max-w-2xl mx-auto leading-relaxed">
            Situated within the renowned textile and knitwear cluster of Tiruppur, Classic Fashions serves local apparel manufacturers, job-work stitching units, fashion designers, and retail buyers seeking dependable materials, consistent supply, and tailored fabric processing.
          </p>
        </div>
      </section>

      {/* WHAT WE OFFER Section */}
      <section className="py-16 md:py-20 border-b border-[#E8E6E0] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#82553E] block mb-2 font-mono">
              Product &amp; Service Spectrum
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#181715]">
              WHAT WE OFFER
            </h2>
            <p className="text-sm text-[#585550] mt-2">
              Comprehensive material sourcing and finishing solutions under one roof.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offerings.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#FAF9F6] p-6 rounded-xl border border-[#E8E4DC] hover:border-[#BFB8AC] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded bg-[#F2EDE6] text-[#82553E] flex items-center justify-center">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-mono text-[#8C877E]">0{idx + 1}</span>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-[#181715]">
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
      <section className="py-16 md:py-20 border-b border-[#E8E6E0] bg-[#F8F6F1]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 sm:p-10 rounded-xl border border-[#E5E0D6] shadow-sm space-y-6">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#82553E] block font-mono">
              Tiruppur Textile Ecosystem
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#181715]">
              Serving Local Garment Makers &amp; Retail Clients
            </h3>
            <p className="text-sm text-[#585550] leading-relaxed">
              Tiruppur’s garment industry relies heavily on prompt availability of raw materials, trims, and specialized fabric widths. Classic Fashions bridges the requirement by catering to both commercial wholesale quantities (full bolts, case packs, spools) and smaller retail batches for boutique creators and custom sampling.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-[#FAF9F6] rounded-lg border border-[#EAE6DF] space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#181715] block">
                  Wholesale Procurement
                </span>
                <span className="text-xs text-[#585550]">
                  Full rolls of woven fabrics, denim bolts, mesh, and bulk accessory spools priced for commercial production.
                </span>
              </div>

              <div className="p-4 bg-[#FAF9F6] rounded-lg border border-[#EAE6DF] space-y-1">
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
                className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#181715] border border-[#BFB8AC] hover:bg-[#FAF9F6] rounded transition-colors"
              >
                Contact Our Desk
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#82553E] block font-mono">
            Visit Our Business
          </span>
          <h3 className="font-serif text-3xl font-bold text-[#181715]">
            Visit Classic Fashions in Boyampalayam
          </h3>
          <p className="text-sm text-[#585550] max-w-xl mx-auto leading-relaxed">
            {businessConfig.fullAddress}
          </p>

          <div>
            <a
              href={mapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#181715] hover:bg-[#302D29] rounded transition-colors"
            >
              <MapPin className="w-4 h-4 text-[#E5D7CC]" />
              <span>GET DIRECTIONS</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
