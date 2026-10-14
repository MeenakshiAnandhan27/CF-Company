import React, { useState } from 'react';
import { MATERIAL_WALL_ITEMS, DiscoveryMaterial } from '../../data/catalogueDiscoveryData.ts';
import { Sparkles, Eye, Layers, RotateCw } from 'lucide-react';

interface MaterialWallProps {
  onSelectMaterial: (material: DiscoveryMaterial) => void;
  onOpen360?: (material: DiscoveryMaterial) => void;
}

export const MaterialWall: React.FC<MaterialWallProps> = ({ onSelectMaterial, onOpen360 }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section aria-label="Tactile Material Wall" className="py-12 sm:py-16">
      {/* Editorial Section Introduction */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.22em] text-[#82553E] font-semibold bg-[#F0EBE1] px-3 py-1 rounded-full border border-[#DDD5C7]">
          <Layers className="w-3.5 h-3.5" />
          <span>Interactive Swatch Archive</span>
        </div>
        <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#181715] tracking-tight">
          The Material Wall
        </h3>
        <p className="text-xs sm:text-sm md:text-base text-[#6E685F] leading-relaxed max-w-xl mx-auto">
          A tactile gallery of raw textiles, trims and garment hardware. Hover to inspect weaves and select any material to examine sourcing specifications.
        </p>
      </div>

      {/* Wall Swatch Grid / Flowing Arrangement */}
      <div className="relative bg-gradient-to-b from-[#F5F1E8]/70 via-[#EDE7DC]/90 to-[#F5F1E8]/70 border border-[#DDD5C7] rounded-3xl p-6 sm:p-10 md:p-12 shadow-inner overflow-hidden">
        {/* Subtle grid backdrop pattern */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#181715_1px,transparent_1px)] [background-size:20px_20px]"
        />

        <div className="relative z-10 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-6 sm:gap-8 md:gap-10 justify-items-center items-center">
          {MATERIAL_WALL_ITEMS.map((item, idx) => {
            const isHovered = hoveredId === item.id;
            // Slight organic scale variance based on index for a natural tactile lookbook feel
            const isHeroSwatch = idx % 5 === 0;

            return (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onSelectMaterial(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectMaterial(item);
                  }
                }}
                className="group flex flex-col items-center text-center cursor-pointer select-none transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#82553E] focus-visible:ring-offset-2 rounded-2xl"
                style={{
                  transform: isHovered ? 'translateY(-6px) scale(1.08)' : 'translateY(0) scale(1)',
                  zIndex: isHovered ? 20 : 1,
                }}
              >
                {/* Circular Swatch Item */}
                <div className="relative">
                  <div
                    className={`relative ${
                      isHeroSwatch
                        ? 'w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 ring-2 ring-[#82553E]/30'
                        : 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28'
                    } rounded-full overflow-hidden bg-white border border-[#DDD5C7] shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:border-[#82553E]`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-115"
                    />

                    {/* Tactile Edge Highlight */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/10 pointer-events-none"
                    />

                    {/* Centered micro hover prompt */}
                    <div
                      aria-hidden="true"
                      className={`absolute inset-0 rounded-full bg-[#181715]/40 backdrop-blur-[1px] flex items-center justify-center transition-opacity duration-300 ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Quick 360° launcher button */}
                  {onOpen360 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpen360(item);
                      }}
                      title={`Spin ${item.name} in 360°`}
                      className="absolute -top-1 -right-1 z-20 w-6 h-6 rounded-full bg-[#181715] hover:bg-[#82553E] text-white flex items-center justify-center border border-white/20 shadow-xs transition-transform hover:scale-110 cursor-pointer"
                    >
                      <RotateCw className="w-2.5 h-2.5 text-[#C89D6B]" />
                    </button>
                  )}

                  {/* Micro Category Pill Indicator */}
                  {isHeroSwatch && !onOpen360 && (
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#82553E] rounded-full border-2 border-white shadow-xs" />
                  )}
                </div>

                {/* Name Label Underneath */}
                <div className="mt-2.5 max-w-[110px] space-y-0.5">
                  <span className="font-serif text-xs sm:text-sm font-medium text-[#181715] block group-hover:text-[#82553E] transition-colors line-clamp-1">
                    {item.name}
                  </span>
                  <span className="text-[10px] font-mono text-[#8C877E] uppercase tracking-wider block">
                    {item.subcategory.slice(0, 14)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating helper at bottom */}
        <div className="mt-10 pt-4 border-t border-[#DDD5C7]/70 text-center">
          <p className="text-xs text-[#7B756C] font-mono tracking-wide">
            CLICK ANY SWATCH TO INSPECT SPECS · SOURCED AND SUPPLIED FOR APPAREL CREATION
          </p>
        </div>
      </div>
    </section>
  );
};
