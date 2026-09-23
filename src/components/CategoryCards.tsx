import React from 'react';
import { categories } from '../data/products.ts';
import { ProductCategory } from '../types.ts';
import { TextileVisual } from './TextileVisual.tsx';
import { ArrowRight } from 'lucide-react';

interface CategoryCardsProps {
  onSelectCategory: (category: ProductCategory) => void;
}

export const CategoryCards: React.FC<CategoryCardsProps> = ({ onSelectCategory }) => {
  return (
    <section className="py-16 md:py-24 bg-[#FBFBFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#E8E6E0] pb-6 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#82553E] block mb-2 font-mono">
              Material Categories
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181715] tracking-tight">
              Explore Our Categories
            </h2>
          </div>
          <p className="text-sm text-[#585550] max-w-md">
            Direct supply of laces, fabrics, denim, mesh, accessories, and processing services from Boyampalayam, Tiruppur.
          </p>
        </div>

        {/* 6 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              className="group bg-white rounded-lg border border-[#E8E6E0] overflow-hidden flex flex-col justify-between hover:border-[#BFB8AC] hover:shadow-md transition-all duration-300"
            >
              <div>
                {/* Visual Header */}
                <div className="relative overflow-hidden cursor-pointer" onClick={() => onSelectCategory(cat.id)}>
                  <TextileVisual
                    patternType={cat.patternType}
                    category={cat.name}
                    name={cat.name}
                    aspectRatio="4:3"
                  />
                  <div className="absolute top-3 right-3 z-20">
                    <span className="text-[11px] font-mono font-semibold text-[#181715] bg-white/90 px-2.5 py-0.5 rounded shadow-sm border border-[#E0DCD4]">
                      0{idx + 1}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6">
                  <span className="text-[10px] tracking-wider uppercase text-[#82553E] font-semibold block mb-1 font-mono">
                    {cat.tagline}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#181715] mb-2 group-hover:text-[#82553E] transition-colors">
                    {cat.name}
                  </h3>
                  
                  {/* Varieties summary */}
                  <div className="text-xs text-[#736F68] mb-3 leading-relaxed">
                    <span className="font-semibold text-[#302D29]">Includes: </span>
                    <span>{cat.subcategories.join(', ')}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#585550] leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              {/* Card Footer CTA */}
              <div className="p-5 sm:p-6 pt-0">
                <button
                  onClick={() => onSelectCategory(cat.id)}
                  className="w-full inline-flex items-center justify-between px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#181715] bg-[#F5F4F0] hover:bg-[#181715] hover:text-white rounded transition-colors duration-200"
                >
                  <span>View in Catalogue</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
