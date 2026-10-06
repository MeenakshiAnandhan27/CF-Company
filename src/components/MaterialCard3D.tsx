import React, { useState } from 'react';
import { Product } from '../types.ts';
import { ArrowRight, RotateCw, Eye, Mail, Info } from 'lucide-react';

interface MaterialCard3DProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onEnquire?: (product: Product) => void;
}

export const MaterialCard3D: React.FC<MaterialCard3DProps> = ({
  product,
  onViewDetails,
  onEnquire,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const imageSrc = product.images?.[0] || `/assets/materials/${product.category}.jpg`;

  const handleFlipToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className="perspective-1000 w-full select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative w-full transition-transform duration-700 ease-in-out preserve-3d cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{
          transform: isFlipped
            ? 'rotateY(180deg)'
            : isHovered
            ? 'translateY(-6px) translateZ(16px)'
            : 'none',
        }}
        onClick={() => onViewDetails(product)}
      >
        {/* ==================== FRONT OF 3D SWATCH CARD ==================== */}
        <div
          className={`backface-hidden relative bg-white rounded-xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
            isHovered
              ? 'border-[#82553E]/50 shadow-[0_18px_36px_rgba(24,23,21,0.12)]'
              : 'border-[#E0D8CC] shadow-sm'
          }`}
        >
          <div>
            {/* Raw Material Image Container */}
            <div className="relative aspect-[4/3] bg-[#EFEAE2] overflow-hidden">
              <img
                src={imageSrc}
                alt={product.imageAlt || product.name}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                style={{
                  transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                }}
              />

              {/* Reference Code Pin */}
              <div className="absolute top-3 left-3 bg-[#181715]/85 backdrop-blur-md text-[#FAF8F5] px-2.5 py-1 rounded text-[11px] font-mono tracking-wider pointer-events-none border border-white/10">
                {product.productCode}
              </div>

              {/* 3D Flip Swatch Action Button */}
              <button
                type="button"
                onClick={handleFlipToggle}
                className="absolute top-3 right-3 p-1.5 bg-white/90 hover:bg-white text-[#181715] rounded-full shadow-md backdrop-blur-xs transition-transform hover:scale-110"
                title="Flip to inspect material specifications"
                aria-label="Flip card for specifications"
              >
                <RotateCw className="w-3.5 h-3.5 text-[#82553E]" />
              </button>
            </div>

            {/* Material Card Details */}
            <div className="p-5 space-y-2 text-left">
              {/* Category */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] uppercase tracking-[0.2em] font-mono font-bold text-[#82553E]">
                  {product.categoryLabel}
                </span>
                {product.subcategory && product.subcategory !== product.categoryLabel && (
                  <>
                    <span className="text-[#C4BCB0] text-xs">•</span>
                    <span className="text-[11px] text-[#736F68] font-medium truncate">
                      {product.subcategory}
                    </span>
                  </>
                )}
              </div>

              {/* Material Name */}
              <h4 className="font-serif text-lg sm:text-xl font-bold text-[#181715] transition-colors leading-snug group-hover:text-[#82553E]">
                {product.name}
              </h4>

              {/* Technical Fabric Specs Pill (If Fabric Quality) */}
              {product.yarnConstruction && (
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="px-2 py-0.5 bg-[#F3EFE9] text-[#181715] font-mono text-[10px] rounded border border-[#E0D8CC] font-semibold">
                    {product.yarnConstruction}
                  </span>
                  {product.quality && (
                    <span className="px-1.5 py-0.5 bg-[#FAF8F5] text-[#82553E] font-mono text-[10px] rounded border border-[#E8DFD3] font-medium">
                      {product.quality}
                    </span>
                  )}
                  {product.weave && (
                    <span className="px-1.5 py-0.5 bg-[#FAF8F5] text-[#585550] font-mono text-[10px] rounded border border-[#E8DFD3]">
                      {product.weave}
                    </span>
                  )}
                  {product.width && (
                    <span className="px-1.5 py-0.5 bg-[#FAF8F5] text-[#585550] font-mono text-[10px] rounded border border-[#E8DFD3]">
                      {product.width}
                    </span>
                  )}
                </div>
              )}

              {/* One Short Description */}
              <p className="text-xs text-[#585550] line-clamp-2 leading-relaxed">
                {product.shortDescription || product.description}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="p-5 pt-0 mt-auto">
            <div className="pt-3 border-t border-[#F0EBE3] flex items-center justify-between">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(product);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#181715] hover:text-[#82553E] transition-colors"
              >
                <span>VIEW MATERIAL</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={handleFlipToggle}
                className="text-[11px] text-[#8C877E] hover:text-[#181715] flex items-center gap-1 font-mono transition-colors"
              >
                <span>Quick Specs</span>
                <RotateCw className="w-3 h-3 text-[#82553E]" />
              </button>
            </div>
          </div>
        </div>

        {/* ==================== BACK OF 3D SWATCH CARD (FLIPPED) ==================== */}
        <div
          className="backface-hidden rotate-y-180 absolute inset-0 bg-[#FAF8F4] rounded-xl border border-[#D5CCBE] p-5 shadow-lg flex flex-col justify-between text-left overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-3">
            {/* Header with Flip-Back Action */}
            <div className="flex items-center justify-between border-b border-[#EAE3D7] pb-2">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-[#82553E] block">
                  {product.categoryLabel}
                </span>
                <span className="text-xs font-mono text-[#736F68]">{product.productCode}</span>
              </div>
              <button
                type="button"
                onClick={handleFlipToggle}
                className="p-1 text-[#585550] hover:text-[#181715] hover:bg-[#EAE4D8] rounded-full transition-colors"
                title="Flip back to material photograph"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Back Title */}
            <h4 className="font-serif text-lg font-bold text-[#181715] leading-snug">
              {product.name}
            </h4>

            {/* Quick Available Specs */}
            <div className="space-y-2 text-xs">
              {product.yarnConstruction ? (
                <div className="bg-white/80 p-2.5 rounded border border-[#E5DECF] space-y-1.5 text-[11px] font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#8C877E]">Construction:</span>
                    <span className="font-semibold text-[#181715]">{product.yarnConstruction}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8C877E]">Quality:</span>
                    <span className="font-semibold text-[#82553E]">{product.quality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8C877E]">Weave:</span>
                    <span className="font-medium text-[#181715]">{product.weave}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8C877E]">Width & GSM:</span>
                    <span className="font-medium text-[#181715]">{product.width} • {product.gsm}</span>
                  </div>
                  {product.loom && (
                    <div className="flex justify-between">
                      <span className="text-[#8C877E]">Loom / Selvage:</span>
                      <span className="text-[#585550]">{product.loom} • {product.selvage}</span>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {product.fabric && (
                    <div>
                      <span className="text-[#8C877E] block text-[10px] uppercase font-mono">
                        Composition / Weave
                      </span>
                      <span className="font-medium text-[#181715] leading-tight block">
                        {product.fabric}
                      </span>
                    </div>
                  )}

                  {product.sizes && product.sizes.length > 0 && (
                    <div>
                      <span className="text-[#8C877E] block text-[10px] uppercase font-mono">
                        Standard Widths
                      </span>
                      <span className="font-medium text-[#181715] leading-tight block">
                        {product.sizes.slice(0, 2).join(' | ')}
                      </span>
                    </div>
                  )}
                </>
              )}

              {product.applications && product.applications.length > 0 && (
                <div>
                  <span className="text-[#8C877E] block text-[10px] uppercase font-mono">
                    Applications
                  </span>
                  <span className="text-[#585550] leading-tight block text-[11px]">
                    {product.applications.slice(0, 2).join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Back Action Buttons */}
          <div className="pt-3 border-t border-[#EAE3D7] space-y-2">
            <button
              type="button"
              onClick={() => onViewDetails(product)}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#181715] hover:bg-[#302D29] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[#E5D7CC]" />
              <span>VIEW FULL DETAILS →</span>
            </button>

            {onEnquire && (
              <button
                type="button"
                onClick={() => onEnquire(product)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-[#D5D0C6] hover:bg-[#F5F2EB] text-[#181715] text-xs font-semibold uppercase tracking-wider rounded transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#82553E]" />
                <span>ENQUIRE</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
