import React, { useState } from 'react';
import { categories } from '../data/products.ts';
import { ProductCategory } from '../types.ts';
import { RAW_MATERIAL_IMAGES } from '../data/materialImages.ts';
import { ArrowRight, Sparkles, Filter } from 'lucide-react';

interface CategoryCardsProps {
  onSelectCategory: (category: ProductCategory) => void;
}

export const CategoryCards: React.FC<CategoryCardsProps> = ({ onSelectCategory }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'textiles' | 'trims'>('all');

  // Filter categories based on material family
  const filteredCategories = categories.filter((cat) => {
    if (activeFilter === 'textiles') {
      return ['fabrics', 'denim', 'mesh'].includes(cat.id);
    }
    if (activeFilter === 'trims') {
      return ['laces', 'accessories', 'processing'].includes(cat.id);
    }
    return true;
  });

  return (
    <section className="py-16 md:py-24 bg-[#FBFBFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-[#E8E4DC] pb-6 gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#82553E] font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Raw Material Supply &amp; Sourcing</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181715] tracking-tight">
              Explore Our Categories
            </h2>
            <p className="text-sm text-[#585550] max-w-xl font-normal leading-relaxed pt-1">
              Direct wholesale supply of authentic raw materials—laces, woven fabrics, denim textiles, mesh, tapes, buttons, and apparel accessories. No finished garments; we supply the physical materials for your production lines.
            </p>
          </div>

          {/* Interactive Material Filter Tabs (Anti-pill segmented control) */}
          <div className="inline-flex items-center p-1 bg-[#F0ECE4] rounded-xl border border-[#E0D9CE] self-start md:self-end">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-white text-[#181715] shadow-sm'
                  : 'text-[#6B665E] hover:text-[#181715]'
              }`}
            >
              All Materials ({categories.length})
            </button>
            <button
              onClick={() => setActiveFilter('textiles')}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer ${
                activeFilter === 'textiles'
                  ? 'bg-white text-[#181715] shadow-sm'
                  : 'text-[#6B665E] hover:text-[#181715]'
              }`}
            >
              Base Fabrics &amp; Denim
            </button>
            <button
              onClick={() => setActiveFilter('trims')}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer ${
                activeFilter === 'trims'
                  ? 'bg-white text-[#181715] shadow-sm'
                  : 'text-[#6B665E] hover:text-[#181715]'
              }`}
            >
              Laces &amp; Accessories
            </button>
          </div>
        </div>

        {/* 6 Category Cards Grid — PURE RAW MATERIAL IMAGERY ONLY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredCategories.map((cat) => {
            const rawConfig = RAW_MATERIAL_IMAGES[cat.id];
            const imageSrc = rawConfig?.imagePath || cat.image || `/assets/materials/${cat.id}.jpg`;
            const altText = rawConfig?.altText || `Raw material close-up of ${cat.name}`;

            return (
              <div
                key={cat.id}
                className="group bg-white rounded-xl border border-[#E8E4DC] overflow-hidden flex flex-col justify-between hover:border-[#82553E]/60 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] transition-all duration-300 transform hover:-translate-y-1"
              >
                <div>
                  {/* Visual Container: Material fills most of frame, texture clearly visible, object-fit cover */}
                  <div
                    className="relative overflow-hidden cursor-pointer aspect-[4/3] bg-[#EBE7E0]"
                    onClick={() => onSelectCategory(cat.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectCategory(cat.id);
                      }
                    }}
                    title={`View raw ${cat.name} material range`}
                  >
                    <img
                      src={imageSrc}
                      alt={altText}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Subtle hairline gradient at bottom to ground the material title */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Material Specifier Tag over bottom of image */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white pointer-events-none">
                      <div>
                        <span className="block text-[11px] font-mono uppercase tracking-widest text-[#E8DCCF]">
                          Raw Material
                        </span>
                        <span className="font-serif text-xl font-bold tracking-wide drop-shadow-sm">
                          {cat.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-white/90 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20">
                        View Samples
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <span className="text-[10px] tracking-wider uppercase text-[#82553E] font-semibold block mb-1 font-mono">
                      {cat.tagline}
                    </span>
                    <h3
                      onClick={() => onSelectCategory(cat.id)}
                      className="font-serif text-xl sm:text-2xl font-bold text-[#181715] mb-2 group-hover:text-[#82553E] transition-colors cursor-pointer"
                    >
                      {cat.name}
                    </h3>
                    
                    {/* Subcategories list */}
                    <div className="text-xs text-[#736F68] mb-3 leading-relaxed">
                      <span className="font-semibold text-[#302D29]">Material Types: </span>
                      <span>{cat.subcategories.join(', ')}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#585550] leading-relaxed line-clamp-3">
                      {cat.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer CTA */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => onSelectCategory(cat.id)}
                    className="w-full inline-flex items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#181715] bg-[#FAF8F5] hover:bg-[#181715] hover:text-white rounded-lg transition-all duration-200 border border-[#E8E4DC] hover:border-[#181715] group/btn cursor-pointer"
                  >
                    <span>Explore {cat.name} Sourcing</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Specialized Sub-Material Strip (Tapes, Buttons, Tags, Lycra) */}
        <div className="mt-12 p-6 rounded-2xl bg-[#F7F5F0] border border-[#E8E4DC]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#E8E4DC]">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#82553E] font-semibold">
                Specialized Garment Accessories
              </span>
              <h3 className="font-serif text-lg font-bold text-[#181715]">
                Physical Trims, Tapes &amp; Apparel Hardware
              </h3>
            </div>
            <p className="text-xs text-[#585550] max-w-md">
              Order loose buttons, twill tapes, woven labels, and specialized trims by specifications, count, or sample match.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Buttons Raw Material Card */}
            <div
              onClick={() => onSelectCategory('accessories')}
              className="cursor-pointer group/sub flex items-center gap-3.5 p-3.5 bg-white rounded-xl border border-[#E5E0D6] hover:border-[#82553E] transition-all"
            >
              <img
                src={RAW_MATERIAL_IMAGES.buttons.imagePath}
                alt={RAW_MATERIAL_IMAGES.buttons.altText}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-lg object-cover object-center shrink-0 border border-[#E8E4DC] group-hover/sub:scale-105 transition-transform"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#82553E] font-semibold block">
                  Raw Trim
                </span>
                <span className="font-serif text-sm font-bold text-[#181715] group-hover/sub:text-[#82553E] transition-colors block truncate">
                  Garment Buttons
                </span>
                <span className="text-[11px] text-[#736F68] block truncate">
                  Corozo, resin, wood &amp; metal
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#82553E] opacity-60 group-hover/sub:opacity-100 group-hover/sub:translate-x-0.5 transition-all shrink-0" />
            </div>

            {/* Tapes Raw Material Card */}
            <div
              onClick={() => onSelectCategory('accessories')}
              className="cursor-pointer group/sub flex items-center gap-3.5 p-3.5 bg-white rounded-xl border border-[#E5E0D6] hover:border-[#82553E] transition-all"
            >
              <img
                src={RAW_MATERIAL_IMAGES.tapes.imagePath}
                alt={RAW_MATERIAL_IMAGES.tapes.altText}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-lg object-cover object-center shrink-0 border border-[#E8E4DC] group-hover/sub:scale-105 transition-transform"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#82553E] font-semibold block">
                  Raw Trim
                </span>
                <span className="font-serif text-sm font-bold text-[#181715] group-hover/sub:text-[#82553E] transition-colors block truncate">
                  Garment Tapes
                </span>
                <span className="text-[11px] text-[#736F68] block truncate">
                  Cotton twill rolls &amp; bias tape
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#82553E] opacity-60 group-hover/sub:opacity-100 group-hover/sub:translate-x-0.5 transition-all shrink-0" />
            </div>

            {/* Tags Raw Material Card */}
            <div
              onClick={() => onSelectCategory('accessories')}
              className="cursor-pointer group/sub flex items-center gap-3.5 p-3.5 bg-white rounded-xl border border-[#E5E0D6] hover:border-[#82553E] transition-all"
            >
              <img
                src={RAW_MATERIAL_IMAGES.tags.imagePath}
                alt={RAW_MATERIAL_IMAGES.tags.altText}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-lg object-cover object-center shrink-0 border border-[#E8E4DC] group-hover/sub:scale-105 transition-transform"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#82553E] font-semibold block">
                  Raw Trim
                </span>
                <span className="font-serif text-sm font-bold text-[#181715] group-hover/sub:text-[#82553E] transition-colors block truncate">
                  Tags &amp; Labels
                </span>
                <span className="text-[11px] text-[#736F68] block truncate">
                  Woven brand labels &amp; hang tags
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#82553E] opacity-60 group-hover/sub:opacity-100 group-hover/sub:translate-x-0.5 transition-all shrink-0" />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
