import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../types.ts';
import { Eye, Mail, Sparkles, Move3d, Layers } from 'lucide-react';

interface MaterialStage3DProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onEnquire: (product: Product) => void;
  onRequestSimilar?: (product: Product) => void;
}

export const MaterialStage3D: React.FC<MaterialStage3DProps> = ({
  product,
  onViewDetails,
  onEnquire,
}) => {
  const [rotate, setRotate] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [lightPos, setLightPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalised coords between -1 and 1
    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;

    // Subtle, elegant 3D tilt: max 9 degrees
    const rotX = -normY * 8.5;
    const rotY = normX * 9.5;

    setRotate({ x: rotX, y: rotY });
    setLightPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setLightPos({ x: 50, y: 50 });
  };

  const imageSrc = product.images?.[0] || `/assets/materials/${product.category}.jpg`;

  return (
    <div className="relative py-4 md:py-6">
      {/* Stage Backdrop & Subtle Shadow Ring */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        <div
          ref={stageRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="perspective-1400 relative rounded-2xl bg-gradient-to-b from-[#F2ECE4]/70 to-[#EAE3D8]/50 p-4 sm:p-8 md:p-10 border border-[#DFD7CB] shadow-[0_20px_50px_rgba(24,23,21,0.06)] overflow-hidden"
        >
          {/* Subtle Studio Table Reflection Grid */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #181715 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Interactive 3D Floating Textile Sample */}
            <div className="lg:col-span-7 flex justify-center">
              <div
                className="relative preserve-3d transition-transform duration-150 ease-out will-change-transform cursor-pointer"
                style={{
                  transform: prefersReducedMotion
                    ? 'none'
                    : `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateZ(${
                        isHovered ? '24px' : '0px'
                      })`,
                }}
                onClick={() => onViewDetails(product)}
              >
                {/* 3D Depth Shadow on Floor */}
                <div
                  className="absolute -inset-4 bg-[#181715]/15 blur-xl rounded-2xl transition-all duration-200 pointer-events-none -z-10"
                  style={{
                    transform: `translateY(${isHovered ? '28px' : '16px'}) scale(${
                      isHovered ? 1.05 : 0.98
                    }) rotateX(60deg)`,
                    opacity: isHovered ? 0.35 : 0.2,
                  }}
                />

                {/* Physical Textile Swatch Card with Real Weave Texture */}
                <div className="relative w-full max-w-[460px] aspect-[4/3] rounded-xl overflow-hidden border-2 border-white/80 shadow-[0_16px_40px_rgba(24,23,21,0.14)] bg-[#EDE8DF]">
                  <img
                    src={imageSrc}
                    alt={product.imageAlt || product.name}
                    className="w-full h-full object-cover select-none transition-transform duration-700 ease-out hover:scale-105"
                  />

                  {/* Dynamic Specular Sheen (Moves with cursor in 3D) */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at ${lightPos.x}% ${lightPos.y}%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 35%, transparent 70%)`,
                      opacity: isHovered ? 1 : 0.3,
                    }}
                  />

                  {/* Physical Textile Tag Clip */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#181715]/85 backdrop-blur-md text-[#FAF8F5] px-3 py-1 rounded shadow-md pointer-events-none border border-white/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E5D7CC]" />
                    <span className="text-[11px] font-mono tracking-wider font-semibold">
                      {product.productCode}
                    </span>
                  </div>

                  {/* Tactile Texture Zoom Cue */}
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md text-[#181715] px-2.5 py-1 rounded text-[10px] font-mono font-semibold tracking-wider shadow-sm flex items-center gap-1 pointer-events-none">
                    <Move3d className="w-3 h-3 text-[#82553E]" />
                    <span>3D STAGE SAMPLE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage Material Information & Actions */}
            <div className="lg:col-span-5 space-y-4 text-left">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#82553E] bg-[#EAE2D4] px-2.5 py-0.5 rounded border border-[#DFD6C7]">
                    {product.categoryLabel}
                  </span>
                  {product.subcategory && (
                    <span className="text-xs text-[#736F68] font-medium font-mono">
                      / {product.subcategory}
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#181715] tracking-tight">
                  {product.name}
                </h3>

                <p className="text-xs sm:text-sm text-[#585550] leading-relaxed">
                  {product.shortDescription || product.description}
                </p>
              </div>

              {/* Physical Material Traits */}
              <div className="space-y-2 bg-white/90 backdrop-blur-xs p-3.5 sm:p-4 rounded-lg border border-[#DDD5C7] text-xs">
                {product.fabric && (
                  <div className="flex items-start justify-between gap-3 pb-1.5 border-b border-[#EFECE5]">
                    <span className="text-[#736F68] font-medium shrink-0">Material / Weave:</span>
                    <span className="font-semibold text-[#181715] text-right">{product.fabric}</span>
                  </div>
                )}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="flex items-start justify-between gap-3 pb-1.5 border-b border-[#EFECE5]">
                    <span className="text-[#736F68] font-medium shrink-0">Standard Widths:</span>
                    <span className="font-medium text-[#181715] text-right">
                      {product.sizes.slice(0, 2).join(', ')}
                    </span>
                  </div>
                )}
                {product.colours && product.colours.length > 0 && (
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[#736F68] font-medium shrink-0">Available Shades:</span>
                    <span className="font-medium text-[#181715] text-right truncate max-w-[200px]">
                      {product.colours.slice(0, 3).join(', ')}
                      {product.colours.length > 3 && ` +${product.colours.length - 3}`}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onViewDetails(product)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#181715] hover:bg-[#302D29] text-white text-xs font-semibold uppercase tracking-wider rounded transition-all shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5 text-[#E5D7CC]" />
                  <span>Inspect In Detail</span>
                </button>

                <button
                  type="button"
                  onClick={() => onEnquire(product)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-[#D5D0C6] hover:bg-[#F7F5F0] text-[#181715] text-xs font-semibold uppercase tracking-wider rounded transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#82553E]" />
                  <span>Enquire Sample</span>
                </button>
              </div>

              <p className="text-[11px] text-[#8C877E] italic flex items-center gap-1.5">
                <Move3d className="w-3 h-3 text-[#82553E] shrink-0" />
                <span>Move cursor over the sample to tilt and inspect the texture in 3D space</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
