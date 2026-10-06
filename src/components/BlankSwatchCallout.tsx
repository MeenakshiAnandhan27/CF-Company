import React, { useState } from 'react';
import { ArrowRight, Sparkles, Scissors, Plus } from 'lucide-react';
import { ProductCategory } from '../types.ts';

interface BlankSwatchCalloutProps {
  onRequestMaterial?: (category?: ProductCategory) => void;
  selectedCategory?: string;
}

export const BlankSwatchCallout: React.FC<BlankSwatchCalloutProps> = ({
  onRequestMaterial,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="mt-20 mb-8 max-w-4xl mx-auto px-4 sm:px-6">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="perspective-1000 relative rounded-2xl bg-gradient-to-b from-[#F5F1E9] to-[#EAE4D8] border border-[#DDD3C4] p-8 sm:p-12 md:p-14 text-center overflow-hidden shadow-sm transition-all duration-300"
      >
        {/* Subtle Background Pattern */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #82553E 1px, transparent 0)`,
            backgroundSize: '20px 20px',
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6 flex flex-col items-center">
          {/* 3D FLOATING BLANK MATERIAL SWATCH */}
          <div
            className="preserve-3d transition-transform duration-300 ease-out cursor-pointer"
            style={{
              transform: isHovered
                ? 'translateY(-8px) scale(1.04) rotateX(6deg) translateZ(20px)'
                : 'rotate(-1.5deg)',
            }}
            onClick={() => onRequestMaterial && onRequestMaterial()}
          >
            {/* 3D Swatch Cast Shadow */}
            <div
              className={`absolute -inset-2 rounded-xl transition-all duration-300 pointer-events-none -z-10 ${
                isHovered
                  ? 'bg-[#181715]/20 blur-xl translate-y-6'
                  : 'bg-black/10 blur-md translate-y-3'
              }`}
            />

            {/* The Neutral Canvas Swatch */}
            <div className="w-56 sm:w-64 h-36 sm:h-40 rounded-xl bg-[#FBF9F5] border-2 border-dashed border-[#C5BBAE] p-4 flex flex-col items-center justify-center relative shadow-sm text-center">
              {/* Stitched Perimeter Accent */}
              <div className="absolute inset-2 border border-[#E3DACD] rounded-lg pointer-events-none" />

              {/* Blank Swatch Clip Tag */}
              <div className="absolute -top-3 px-3 py-0.5 bg-[#181715] text-[#FAF8F5] text-[10px] font-mono tracking-widest uppercase rounded shadow-xs">
                CUSTOM SWATCH
              </div>

              <div className="w-9 h-9 rounded-full bg-[#EFE8DD] text-[#82553E] flex items-center justify-center mb-2 shadow-xs">
                <Plus className="w-5 h-5" />
              </div>

              <span className="font-serif text-sm font-bold text-[#181715] tracking-wide block">
                Your Custom Specification
              </span>
              <span className="text-[11px] text-[#736F68] font-mono mt-0.5">
                Fabric • Lace • Denim • Mesh • Trims
              </span>
            </div>
          </div>

          {/* Heading & Supporting Copy */}
          <div className="space-y-2.5 pt-2">
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#181715] tracking-tight">
              Can&apos;t Find the Material?
            </h3>

            <p className="font-serif text-lg text-[#82553E] font-medium">
              Your requirement doesn&apos;t have to fit our catalogue.
            </p>

            <p className="text-xs sm:text-sm text-[#585550] max-w-lg mx-auto leading-relaxed">
              Tell us what you are looking for, even if it isn&apos;t listed here. We work directly with specialized mills and garment units to source, match, and supply custom materials.
            </p>
          </div>

          {/* CTA Action */}
          <div className="pt-2">
            {onRequestMaterial && (
              <button
                type="button"
                onClick={() => onRequestMaterial()}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#181715] hover:bg-[#302D29] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-all shadow-sm font-mono hover:gap-3"
              >
                <Sparkles className="w-4 h-4 text-[#E5D7CC]" />
                <span>REQUEST A MATERIAL →</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
