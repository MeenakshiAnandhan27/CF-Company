import React from 'react';
import { businessConfig } from '../data/businessConfig.ts';
import { Layers, Scissors, Sparkles, Store, MapPin, ExternalLink, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

interface HomeIntroProps {
  onExploreCatalogue: () => void;
  onReachUs: () => void;
}

export const HomeIntro: React.FC<HomeIntroProps> = ({ onExploreCatalogue, onReachUs }) => {
  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    '5/1475, 5th Street, Palanisamy Nagar, Boyampalayam, Tiruppur, Tamil Nadu 641602'
  )}`;

  return (
    <div className="bg-[#FBFBFA]">
      
      {/* 4. BUSINESS INTRODUCTION */}
      <section className="py-16 md:py-20 border-b border-[#E8E6E0] bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#82553E] bg-[#F2EDE6] px-3.5 py-1.5 rounded-sm border border-[#E3D9CC] inline-block font-mono">
            Tiruppur Textile District
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181715] tracking-tight">
            Classic Fashions
          </h2>

          <p className="text-base sm:text-lg text-[#4A4742] max-w-3xl mx-auto leading-relaxed text-pretty font-normal">
            CLASSIC FASHIONS is a specialized garment accessories and fabric business located in Boyampalayam, Tiruppur, Tamil Nadu. The business focuses on woven fabric manufacturing, wholesale and retail supply, and a wide selection of garment accessories and specialized fabrics.
          </p>

          {/* 5 Highlights */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {[
              'Garment Accessories',
              'Fabrics',
              'Laces',
              'Wholesale & Retail',
              'Specialized Materials',
            ].map((item) => (
              <span
                key={item}
                className="text-xs font-medium text-[#2C2926] bg-[#F5F3ED] px-4 py-2 rounded border border-[#E5E0D6] shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY CLASSIC FASHIONS */}
      <section className="py-16 md:py-20 border-b border-[#E8E6E0] bg-[#F8F6F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#736F68] block mb-2 font-mono">
              Core Capabilities
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#181715]">
              Why Classic Fashions
            </h3>
            <p className="text-sm text-[#585550] mt-2">
              Serving local manufacturers, job-work units, fashion labels, and retail buyers in Tiruppur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: WIDE MATERIAL SELECTION */}
            <div className="bg-white p-6 sm:p-7 rounded-lg border border-[#E5E0D6] shadow-sm hover:border-[#BFB8AC] transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded bg-[#F2EDE6] text-[#82553E] flex items-center justify-center mb-4">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-xl font-semibold text-[#181715] mb-2 uppercase tracking-wide text-sm">
                  WIDE MATERIAL SELECTION
                </h4>
                <p className="text-sm text-[#585550] leading-relaxed">
                  Explore a broad range of garment accessories and fabrics.
                </p>
              </div>
              <div className="pt-4 text-xs font-mono text-[#8C877E] border-t border-[#F0ECE4] mt-4">
                Laces, gadas, denim, mesh &amp; trims
              </div>
            </div>

            {/* Card 2: GARMENT ACCESSORIES */}
            <div className="bg-white p-6 sm:p-7 rounded-lg border border-[#E5E0D6] shadow-sm hover:border-[#BFB8AC] transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded bg-[#F2EDE6] text-[#82553E] flex items-center justify-center mb-4">
                  <Tag className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-xl font-semibold text-[#181715] mb-2 uppercase tracking-wide text-sm">
                  GARMENT ACCESSORIES
                </h4>
                <p className="text-sm text-[#585550] leading-relaxed">
                  Laces, tags, tapes, buttons and other garment-related accessories.
                </p>
              </div>
              <div className="pt-4 text-xs font-mono text-[#8C877E] border-t border-[#F0ECE4] mt-4">
                Woven tags, twill tapes &amp; buttons
              </div>
            </div>

            {/* Card 3: FABRIC RANGE */}
            <div className="bg-white p-6 sm:p-7 rounded-lg border border-[#E5E0D6] shadow-sm hover:border-[#BFB8AC] transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded bg-[#F2EDE6] text-[#82553E] flex items-center justify-center mb-4">
                  <Scissors className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-xl font-semibold text-[#181715] mb-2 uppercase tracking-wide text-sm">
                  FABRIC RANGE
                </h4>
                <p className="text-sm text-[#585550] leading-relaxed">
                  Woven fabrics and specialized materials including denim and mesh.
                </p>
              </div>
              <div className="pt-4 text-xs font-mono text-[#8C877E] border-t border-[#F0ECE4] mt-4">
                Woven, poplin, twill, drill, denim &amp; mesh
              </div>
            </div>

            {/* Card 4: WHOLESALE & RETAIL */}
            <div className="bg-white p-6 sm:p-7 rounded-lg border border-[#E5E0D6] shadow-sm hover:border-[#BFB8AC] transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded bg-[#F2EDE6] text-[#82553E] flex items-center justify-center mb-4">
                  <Store className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-xl font-semibold text-[#181715] mb-2 uppercase tracking-wide text-sm">
                  WHOLESALE &amp; RETAIL
                </h4>
                <p className="text-sm text-[#585550] leading-relaxed">
                  Materials available for garment businesses and buyers.
                </p>
              </div>
              <div className="pt-4 text-xs font-mono text-[#8C877E] border-t border-[#F0ECE4] mt-4">
                Bulk factory bolts &amp; retail supply
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 18. LOCATION SECTION: "Visit Classic Fashions" */}
      <section className="py-16 md:py-20 bg-white border-b border-[#E8E6E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Address Details */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#82553E] font-mono block">
                Local Presence in Tiruppur
              </span>

              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#181715]">
                Visit Classic Fashions
              </h3>

              <p className="text-sm text-[#585550] leading-relaxed">
                We welcome garment manufacturers, merchandisers, sampling masters, and retail clients to our premises in Boyampalayam for material inspection and order discussions.
              </p>

              {/* Exact Address Block */}
              <div className="p-5 bg-[#FAF9F6] rounded-lg border border-[#EAE6DF] space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#181715]">
                  <MapPin className="w-4 h-4 text-[#82553E]" />
                  <span>Physical Address</span>
                </div>
                <div className="font-medium text-[#181715] text-base leading-relaxed pl-6">
                  {businessConfig.addressLine1},<br />
                  {businessConfig.addressLine2},<br />
                  {businessConfig.city},<br />
                  {businessConfig.state} – {businessConfig.pincode}, India
                </div>
                <div className="text-xs text-[#736F68] pl-6 pt-1">
                  Location area: Boyampalayam / Poyampalayam, Tiruppur
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href={mapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#181715] hover:bg-[#302D29] rounded transition-colors shadow-sm"
                >
                  <MapPin className="w-4 h-4 text-[#E5D7CC]" />
                  <span>GET DIRECTIONS</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>

                <button
                  onClick={onReachUs}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#181715] border border-[#BFB8AC] hover:bg-[#F5F4F0] rounded transition-colors"
                >
                  <span>View All Contact Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Map Placeholder Graphic */}
            <div className="lg:col-span-6">
              <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E5E0D6] shadow-sm">
                <div className="relative aspect-[16/10] bg-[#EDE9E1] rounded-lg overflow-hidden border border-[#DCD6C9] flex items-center justify-center text-center p-6">
                  
                  {/* Subtle map grid vector */}
                  <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="home-map-grid" width="36" height="36" patternUnits="userSpaceOnUse">
                        <line x1="0" y1="0" x2="36" y2="0" stroke="#BBB4A6" strokeWidth="0.8" />
                        <line x1="0" y1="0" x2="0" y2="36" stroke="#BBB4A6" strokeWidth="0.8" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#home-map-grid)" />
                    {/* Roads */}
                    <path d="M-20 80 Q 200 120, 500 50" fill="none" stroke="#D3CABE" strokeWidth="10" />
                    <path d="M180 -10 L 220 280" fill="none" stroke="#D8D0C3" strokeWidth="8" />
                  </svg>

                  {/* Marker Card */}
                  <div className="relative z-10 bg-white/95 backdrop-blur-sm p-5 rounded-lg border border-[#DCD6C9] shadow-md max-w-sm space-y-2">
                    <div className="w-9 h-9 rounded-full bg-[#181715] text-[#F9F7F4] flex items-center justify-center mx-auto shadow-sm">
                      <MapPin className="w-5 h-5 text-[#E5D7CC]" />
                    </div>
                    <div className="font-serif font-bold text-base text-[#181715]">
                      Classic Fashions
                    </div>
                    <p className="text-xs text-[#585550] leading-snug">
                      5/1475, 5th Street, Palanisamy Nagar, Boyampalayam, Tiruppur – 641602
                    </p>
                    <div className="pt-2">
                      <a
                        href={mapsSearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#82553E] hover:underline"
                      >
                        <span>Open in Google Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-[#78746C] px-1 font-mono">
                  <span>Boyampalayam, Tiruppur</span>
                  <span>Tamil Nadu – 641602</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
