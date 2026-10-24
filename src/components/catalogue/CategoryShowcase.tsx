import React from 'react';
import { CATEGORY_PANELS, CategoryPanel } from '../../data/catalogueDiscoveryData.ts';
import { ArrowRight } from 'lucide-react';

interface CategoryShowcaseProps {
  activeCategory: string;
  onSelectCategory: (category: CategoryPanel['id']) => void;
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <section aria-label="Core Material Divisions" className="space-y-6">
      {/* Clean Section Header without "Category Families" and "4 Core Classifications" */}
      <div className="border-b border-[#E8E2D7] pb-3.5 flex items-center justify-between">
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#181715] tracking-tight">
          Core Material Divisions
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 items-stretch">
        {CATEGORY_PANELS.map((panel) => {
          const isCurrent = activeCategory === panel.id;

          return (
            <div
              key={panel.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectCategory(panel.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectCategory(panel.id);
                }
              }}
              className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 text-left cursor-pointer flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-[#82553E] focus-visible:ring-offset-2 ${
                isCurrent
                  ? 'border-[#82553E] bg-[#F3EDE4] shadow-md ring-1 ring-[#82553E]/20'
                  : 'border-[#DDD6C8] bg-white hover:border-[#82553E]/50 hover:shadow-md'
              }`}
            >
              {/* Image Frame */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EFECE5]">
                <img
                  src={panel.image}
                  alt={`Raw ${panel.title} materials`}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none"
                />

                {/* Subtle editorial index number */}
                <div className="absolute top-3 left-3 text-[11px] font-mono font-medium text-white/90 bg-[#181715]/70 backdrop-blur-xs px-2 py-0.5 rounded tracking-widest">
                  {panel.index}
                </div>

                {/* Subtle variety count */}
                <div className="absolute top-3 right-3 text-[10px] font-mono text-white/90 bg-[#181715]/70 backdrop-blur-xs px-2 py-0.5 rounded">
                  {panel.materialCount} Types
                </div>
              </div>

              {/* Text Information */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <h4 className="font-serif text-lg sm:text-xl font-bold text-[#181715] tracking-tight group-hover:text-[#82553E] transition-colors">
                    {panel.title}
                  </h4>
                  <p className="text-xs text-[#6B655B] line-clamp-2 leading-relaxed">
                    {panel.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F2EDE4] flex items-center justify-between text-xs font-semibold text-[#82553E] group-hover:translate-x-0.5 transition-transform">
                  <span className="uppercase tracking-wider text-[11px] font-mono font-bold">Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
