import React, { useState } from 'react';

export type SelectorCategory =
  | 'ALL'
  | 'LACES'
  | 'FABRICS'
  | 'DENIM'
  | 'MESH'
  | 'LYCRA / LYCRA MESH'
  | 'TAPES'
  | 'TAGS'
  | 'BUTTONS'
  | 'GARMENT ACCESSORIES';

interface CategoryItem {
  id: SelectorCategory;
  name: string;
  image: string;
  rotation: number;
}

const CATEGORIES: CategoryItem[] = [
  { id: 'ALL', name: 'ALL MATERIALS', image: '/assets/materials/homepage/fabrics.jpg', rotation: 0 },
  { id: 'LACES', name: 'LACES', image: '/assets/materials/homepage/laces.jpg', rotation: -2 },
  { id: 'FABRICS', name: 'FABRICS', image: '/assets/materials/homepage/fabrics.jpg', rotation: 1.5 },
  { id: 'DENIM', name: 'DENIM', image: '/assets/materials/homepage/denim.jpg', rotation: -1.8 },
  { id: 'MESH', name: 'MESH', image: '/assets/materials/homepage/mesh.jpg', rotation: 2 },
  { id: 'LYCRA / LYCRA MESH', name: 'LYCRA / LYCRA MESH', image: '/assets/materials/homepage/lycra-mesh.jpg', rotation: -1.4 },
  { id: 'TAPES', name: 'TAPES', image: '/assets/materials/homepage/tapes.jpg', rotation: -2.2 },
  { id: 'TAGS', name: 'TAGS', image: '/assets/materials/homepage/brand-tags.jpg', rotation: 1.8 },
  { id: 'BUTTONS', name: 'BUTTONS', image: '/assets/materials/homepage/buttons.jpg', rotation: 1.6 },
  { id: 'GARMENT ACCESSORIES', name: 'GARMENT ACCESSORIES', image: '/assets/materials/homepage/garment-accessories.jpg', rotation: -1.2 },
];

interface CategorySelector3DProps {
  activeCategory: SelectorCategory;
  onSelectCategory: (category: SelectorCategory) => void;
}

export const CategorySelector3D: React.FC<CategorySelector3DProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<SelectorCategory | null>(null);

  return (
    <div className="w-full py-4 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Subtle Section Header */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[#82553E]">
            3D CATEGORY SELECTOR
          </span>
          <span className="text-[11px] text-[#8C877E] hidden sm:inline">
            Select a material tile to filter the showroom
          </span>
        </div>

        {/* 3D Perspective Tile Carousel / Grid */}
        <div className="perspective-1000 flex items-center gap-3 sm:gap-4 overflow-x-auto pb-4 pt-3 scrollbar-none no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const isHovered = hoveredCategory === cat.id;
            const isOtherHovered = hoveredCategory !== null && !isHovered;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                onMouseEnter={() => setHoveredCategory(cat.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                className="group relative shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#181715] rounded-xl transition-all duration-300 ease-out"
                style={{
                  transform: isHovered
                    ? `translateY(-8px) scale(1.06) rotate(${cat.rotation * 0.4}deg) translateZ(28px)`
                    : isActive
                    ? `translateY(-4px) scale(1.02) rotate(${cat.rotation * 0.5}deg) translateZ(14px)`
                    : isOtherHovered
                    ? `scale(0.96) rotate(${cat.rotation}deg) translateZ(-10px)`
                    : `rotate(${cat.rotation}deg)`,
                  opacity: isOtherHovered ? 0.8 : 1,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* 3D Depth Floor Shadow */}
                <div
                  className={`absolute -inset-1 rounded-xl transition-all duration-300 pointer-events-none -z-10 ${
                    isHovered
                      ? 'bg-[#181715]/25 blur-lg translate-y-3'
                      : isActive
                      ? 'bg-[#82553E]/20 blur-md translate-y-2'
                      : 'bg-black/10 blur-xs translate-y-1'
                  }`}
                />

                {/* Physical Floating Tile Container */}
                <div
                  className={`relative w-28 sm:w-32 md:w-36 h-28 sm:h-32 rounded-xl overflow-hidden border transition-all duration-300 ${
                    isActive
                      ? 'border-[#82553E] ring-2 ring-[#82553E]/40 shadow-lg'
                      : 'border-[#DDD4C5] bg-[#F3EFE9] hover:border-[#181715]/50 shadow-sm'
                  }`}
                >
                  {/* Raw Material Background Texture Image */}
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 brightness-[0.92]"
                  />

                  {/* Gradient Scrim for Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181715]/90 via-[#181715]/30 to-transparent" />

                  {/* Tile Label */}
                  <div className="absolute inset-x-0 bottom-0 p-2 sm:p-2.5 text-center">
                    <span
                      className={`block font-serif text-xs sm:text-sm font-bold tracking-wide transition-colors ${
                        isActive ? 'text-[#FAF5EE]' : 'text-white group-hover:text-[#F2E5D8]'
                      }`}
                    >
                      {cat.name}
                    </span>
                    {isActive && (
                      <span className="inline-block w-4 h-0.5 bg-[#C99A75] rounded-full mt-0.5" />
                    )}
                  </div>

                  {/* Active Indicator Top Tag */}
                  {isActive && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#C99A75] shadow-xs" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
