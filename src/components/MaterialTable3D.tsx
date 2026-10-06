import React, { useState } from 'react';
import { Product } from '../types.ts';
import { Eye, Move3d, Sparkles, Layers } from 'lucide-react';

interface MaterialTable3DProps {
  products: Product[];
  onViewDetails: (product: Product) => void;
  onEnquire?: (product: Product) => void;
}

export const MaterialTable3D: React.FC<MaterialTable3DProps> = ({
  products,
  onViewDetails,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Take a curated selection of up to 8 materials across categories for the table display
  const tableSwatches = products.slice(0, 8);

  // Organic rotations and offsets simulating real swatches on an inspection table
  const swatchLayouts = [
    { rotation: -3.5, scale: 1.02, offset: 'translate-y-0' },
    { rotation: 4.2, scale: 0.98, offset: 'translate-y-2' },
    { rotation: -2.0, scale: 1.04, offset: 'translate-y-1' },
    { rotation: 3.8, scale: 1.0, offset: 'translate-y-3' },
    { rotation: -4.5, scale: 0.97, offset: 'translate-y-1' },
    { rotation: 2.8, scale: 1.03, offset: 'translate-y-0' },
    { rotation: -3.0, scale: 1.0, offset: 'translate-y-2' },
    { rotation: 4.0, scale: 0.99, offset: 'translate-y-1' },
  ];

  return (
    <div className="relative py-12 bg-gradient-to-b from-[#F5F2EB] to-[#ECE7DE] rounded-2xl border border-[#DFD8CC] p-6 sm:p-10 my-10 overflow-hidden shadow-inner">
      {/* Studio Inspection Table Felt Grid */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #181715 1px, transparent 1px), linear-gradient(to bottom, #181715 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#DDD5C7] pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Layers className="w-4 h-4 text-[#82553E]" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] font-bold text-[#82553E]">
                MATERIAL TABLE EXPERIENCE
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#181715]">
              Physical Swatches on Inspection Table
            </h3>
            <p className="text-xs sm:text-sm text-[#585550]">
              Explore samples arranged as physical textile swatches. Hover to lift a swatch from the table.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#736F68] font-mono">
            <Move3d className="w-3.5 h-3.5 text-[#82553E]" />
            <span>Click any swatch to open sample inspector</span>
          </div>
        </div>

        {/* Swatches Table Layout */}
        <div className="perspective-1400 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pt-4">
          {tableSwatches.map((product, index) => {
            const layout = swatchLayouts[index % swatchLayouts.length];
            const isHovered = hoveredId === product.id;
            const imageSrc = product.images?.[0] || `/assets/materials/${product.category}.jpg`;

            return (
              <div
                key={product.id}
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onViewDetails(product)}
                className={`relative preserve-3d cursor-pointer transition-all duration-300 ease-out ${layout.offset}`}
                style={{
                  transform: isHovered
                    ? `translateY(-14px) scale(1.08) rotate(0deg) translateZ(36px)`
                    : `rotate(${layout.rotation}deg) scale(${layout.scale})`,
                  zIndex: isHovered ? 30 : 10,
                }}
              >
                {/* 3D Cast Shadow */}
                <div
                  className={`absolute -inset-2 rounded-xl transition-all duration-300 pointer-events-none -z-10 ${
                    isHovered
                      ? 'bg-[#181715]/30 blur-xl translate-y-6 scale-105'
                      : 'bg-black/15 blur-md translate-y-2'
                  }`}
                />

                {/* Swatch Paper/Textile Mount */}
                <div className="relative bg-white rounded-xl p-3 border border-[#D5CCBD] shadow-sm overflow-hidden flex flex-col justify-between">
                  {/* Physical Swatch Metallic Clip / Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-[#EFECE5] text-[10px] font-mono text-[#736F68]">
                    <span className="uppercase font-semibold tracking-wider text-[#82553E]">
                      {product.categoryLabel}
                    </span>
                    <span className="bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#E5DFD5]">
                      {product.productCode}
                    </span>
                  </div>

                  {/* Raw Material Texture Image */}
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden my-2 bg-[#EDE8DF]">
                    <img
                      src={imageSrc}
                      alt={product.imageAlt || product.name}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-105"
                    />

                    {isHovered && (
                      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center text-white text-xs font-semibold uppercase tracking-wider animate-in fade-in duration-200">
                        <span className="bg-[#181715]/90 px-3 py-1.5 rounded flex items-center gap-1.5 shadow-md">
                          <Eye className="w-3.5 h-3.5 text-[#E5D7CC]" />
                          Inspect Swatch
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Swatch Bottom Label */}
                  <div className="text-left pt-1">
                    <h4 className="font-serif text-sm font-bold text-[#181715] truncate">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-[#736F68] truncate">
                      {product.fabric || product.shortDescription}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
