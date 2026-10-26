import React, { useEffect, useState, useRef } from 'react';
import { Product } from '../types.ts';
import { RAW_MATERIAL_IMAGES } from '../data/materialImages.ts';
import {
  X,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Bookmark,
} from 'lucide-react';
import { DiamondMotif } from './DiamondMotif.tsx';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onEnquire: (product: Product) => void;
  onRequestSimilar?: (product: Product) => void;
  onOpen360?: (product: Product) => void;
  allProducts?: Product[];
  onSelectProduct?: (product: Product) => void;
  onAddToCollection?: (product: Product, quantity?: number, colour?: string, size?: string) => void;
  onToggleCollection?: (product: Product) => void;
  isInCollection?: boolean;
  currentQuantityInCollection?: number;
}

interface KeyDetail {
  label: string;
  value: string;
}

/**
 * Extracts essential specifications: Width, Composition, Weave/Type (and Weight/GSM if present).
 * Excludes Availability, In Stock, and reference codes as requested.
 */
function getKeyDetails(product: Product): KeyDetail[] {
  const details: KeyDetail[] = [];

  // 1. Width
  const widthVal = product.width || (product.sizes && product.sizes.length > 0 && product.category !== 'buttons' && product.category !== 'tags' ? product.sizes[0] : undefined);
  if (widthVal) {
    details.push({
      label: product.category === 'buttons' || product.category === 'tags' ? 'SIZE / GAUGE' : 'WIDTH',
      value: widthVal,
    });
  } else if (product.category === 'buttons' && product.sizes && product.sizes.length > 0) {
    details.push({
      label: 'SIZES',
      value: product.sizes.slice(0, 2).join(', '),
    });
  }

  // 2. Composition
  const comp = product.fabric || product.quality;
  if (comp) {
    const cleanComp = comp.split(';')[0].trim();
    details.push({
      label: 'COMPOSITION',
      value: cleanComp,
    });
  }

  // 3. Weave / Type
  let weave = product.weave || product.fabricWeaveType;
  if (!weave) {
    if (product.name.toLowerCase() === 'chambray') {
      weave = '1/1 Plain Chambray Weave';
    } else if (product.subcategory) {
      weave = product.subcategory;
    }
  }
  if (weave) {
    details.push({
      label: 'WEAVE / TYPE',
      value: weave,
    });
  }

  // 4. Weight / GSM (if present)
  if (product.gsm) {
    details.push({
      label: 'WEIGHT / GSM',
      value: product.gsm,
    });
  }

  return details;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onEnquire,
  onRequestSimilar,
  onOpen360,
  allProducts,
  onSelectProduct,
  onAddToCollection,
  onToggleCollection,
  isInCollection,
}) => {
  // Interactive 3D Perspective Tilt on Mouse and Touch Drag
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (product) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setTilt({ x: 0, y: 0 });
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  // Strict Material Image mapping: Selected product's actual image -> Category asset fallback
  const rawConfig = RAW_MATERIAL_IMAGES[product.category];
  const imageSrc = (product.images && product.images.length > 0 && product.images[0])
    ? product.images[0]
    : (rawConfig?.imagePath || `/assets/materials/${product.category}.jpg`);
  const altText = product.imageAlt || rawConfig?.altText || `Raw material visual of ${product.name}`;

  // Description: Cleaned without "for casual shirting texture"
  let description = product.shortDescription || product.description;
  if (product.name.toLowerCase() === 'chambray') {
    description = 'Lightweight plain-weave textile with coloured indigo warp and clean white weft yarns.';
  } else if (description) {
    description = description.replace(/ for casual shirting texture\.?/gi, '.').trim();
  }

  // Category-aware clean specifications (Max 3-4 items, NO availability)
  const keyDetails = getKeyDetails(product);

  // Previous & Next navigation across catalogue items
  const currentIndex = allProducts ? allProducts.findIndex((p) => p.id === product.id || p.name.toLowerCase() === product.name.toLowerCase()) : -1;
  const hasPrev = allProducts && currentIndex > 0;
  const hasNext = allProducts && currentIndex >= 0 && currentIndex < allProducts.length - 1;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (allProducts && currentIndex > 0 && onSelectProduct) {
      onSelectProduct(allProducts[currentIndex - 1]);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (allProducts && currentIndex < allProducts.length - 1 && onSelectProduct) {
      onSelectProduct(allProducts[currentIndex + 1]);
    }
  };

  // Mouse & Touch Drag Gestures for tactile 3D perspective exploration
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 14;
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 14;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - dragStartRef.current.x;
    const deltaY = e.touches[0].clientY - dragStartRef.current.y;
    const rotateY = Math.max(-18, Math.min(18, (deltaX / 120) * 16));
    const rotateX = Math.max(-18, Math.min(18, (-deltaY / 120) * 16));
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleMouseLeave = () => {
    setIsHoveringImage(false);
    setIsDragging(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="full-view-material-title"
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-[#121110]/70 backdrop-blur-xs animate-in fade-in duration-200 select-none overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F0] to-[#F7F2E8] rounded-2xl shadow-2xl border border-[#E2D8C3] overflow-hidden flex flex-col md:flex-row max-h-[92vh] md:max-h-[640px] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button (top-right) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-white/90 hover:bg-[#EAE2D2] text-[#55514B] hover:text-[#181715] border border-[#DDD5C7] flex items-center justify-center transition-all cursor-pointer shadow-xs"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* LEFT COLUMN (~58%): LARGE RAW FABRIC IMAGE & 360° CONTROL   */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div
          ref={imageContainerRef}
          onMouseEnter={() => setIsHoveringImage(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="w-full md:w-[58%] relative bg-gradient-to-b from-[#FAF6EE] to-[#EFE8DC] min-h-[320px] sm:min-h-[380px] md:min-h-full overflow-hidden group cursor-grab active:cursor-grabbing border-b md:border-b-0 md:border-r border-[#E2D8C3]"
        >
          {/* Subtle Ambient Radial Spotlight behind fabric texture */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-60"
            style={{
              background:
                'radial-gradient(circle at 50% 45%, rgba(184, 147, 74, 0.22) 0%, rgba(24, 23, 21, 0.04) 60%, transparent 80%)',
            }}
          />

          {/* Large Raw Fabric Image with Interactive 3D Perspective Tilt */}
          <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
            <img
              src={imageSrc}
              alt={altText}
              referrerPolicy="no-referrer"
              style={{
                transform: `perspective(850px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHoveringImage ? 1.03 : 1})`,
                transition: isHoveringImage ? 'transform 0.08s ease-out' : 'transform 0.4s ease-out',
                objectPosition: rawConfig?.objectPosition || 'center',
              }}
              className="w-full h-full object-cover transition-transform duration-500 ease-out select-none"
            />

            {/* Dynamic Light Sheen Gradient Overlay shifting with angle */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-black/15 via-transparent to-white/20 transition-opacity"
              style={{
                transform: `translateX(${tilt.y * 1.5}px) translateY(${tilt.x * 1.5}px)`,
              }}
            />
          </div>

          {/* Subtle Corner Raw Textile Badge */}
          <div className="absolute top-4 left-4 z-20 bg-[#181715]/85 backdrop-blur-xs text-[#FAF7F2] px-2.5 py-1 rounded-md text-[9px] font-mono tracking-widest uppercase pointer-events-none border border-[#B8934A]/40 flex items-center gap-1.5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span>Raw Material Visual</span>
          </div>

          {/* Prominent, Elegant Interactive 360° Turntable Control */}
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <button
              type="button"
              onClick={() => {
                if (onOpen360) {
                  onOpen360(product);
                }
              }}
              className="w-full relative group p-3 rounded-xl bg-gradient-to-r from-[#181715]/95 via-[#2A2621]/95 to-[#181715]/95 hover:from-[#23201C] hover:to-[#1C1A17] text-[#FAF7F2] border border-[#B8934A]/60 hover:border-[#D4AF37] shadow-[0_0_18px_rgba(184,147,74,0.32)] hover:shadow-[0_0_28px_rgba(184,147,74,0.52)] transition-all duration-300 cursor-pointer active:scale-[0.99] backdrop-blur-xs flex items-center justify-between gap-3 overflow-hidden"
            >
              {/* Animated highlight shimmer */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none opacity-25 group-hover:opacity-40 transition-opacity bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.45),transparent_70%)]"
              />

              <div className="relative flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#2A2621] border border-[#B8934A]/70 flex items-center justify-center shrink-0 text-[#D4AF37] shadow-[0_0_8px_rgba(184,147,74,0.3)] group-hover:scale-105 transition-transform">
                  <RotateCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700 stroke-[1.8]" />
                </div>
                <div className="text-left">
                  <div className="font-serif text-xs sm:text-sm font-semibold tracking-wide text-[#FAF7F2] flex items-center gap-1.5">
                    <span>Interactive 360° Turntable</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-mono text-[#D4AF37]/90 tracking-wide block mt-0.5">
                    Drag to explore the texture
                  </span>
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform shrink-0" />
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* RIGHT COLUMN (~42%): CLEAN, VISUAL-FIRST INFORMATION        */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div className="w-full md:w-[42%] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-gradient-to-b from-[#FFFDF9] to-[#FAF7F0]">
          <div className="space-y-4">
            
            {/* 1. Header: Small Category Eyebrow with Single-Line Diamond Accent */}
            <div>
              <div className="text-[10px] sm:text-[11px] font-mono text-[#B8934A] uppercase tracking-[0.2em] font-semibold flex items-center gap-2">
                <div className="w-1.5 h-1.5 border border-[#B8934A] rotate-45 shrink-0" />
                <span>{product.categoryLabel}</span>
                {product.subcategory && (
                  <>
                    <span className="text-[#C5BEB2]">·</span>
                    <span className="text-[#737068]">{product.subcategory}</span>
                  </>
                )}
              </div>

              {/* 2. Large Elegant Material Title */}
              <h2 id="full-view-material-title" className="font-serif text-2xl sm:text-3xl font-bold text-[#181715] tracking-tight leading-tight mt-1.5">
                {product.name}
              </h2>
              <DiamondMotif align="left" maxWidth="max-w-[200px]" className="my-1.5" />
            </div>

            {/* 3. Concise Description (Clean & Free of "casual shirting texture") */}
            <p className="text-xs sm:text-sm text-[#55514B] leading-relaxed pt-0.5">
              {description}
            </p>

            {/* 4. Category-Aware Key Specifications (Clean 2-Column Layout, NO Availability) */}
            {keyDetails.length > 0 && (
              <div className="bg-[#FAF7F0] border border-[#E2D8C3] rounded-xl p-4 my-2 shadow-2xs">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {keyDetails.map((detail, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <span className="text-[10px] font-mono text-[#8C877E] uppercase tracking-wider block">
                        {detail.label}
                      </span>
                      <span className="text-xs sm:text-sm font-serif font-semibold text-[#181715] leading-snug block">
                        {detail.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Working Enquiry Actions Styled for Full-View */}
            <div className="space-y-2.5 pt-2">
              {/* Primary Action: ENQUIRE ABOUT THIS MATERIAL */}
              <button
                type="button"
                onClick={() => onEnquire(product)}
                className="w-full py-3.5 px-6 bg-[#181715] hover:bg-[#2A2621] text-[#FAF7F2] font-mono text-xs font-semibold uppercase tracking-widest rounded-xl shadow-xs hover:shadow-[0_6px_22px_rgba(184,147,74,0.26)] border border-[#B8934A]/50 hover:border-[#D4AF37] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <span>ENQUIRE ABOUT THIS MATERIAL</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </button>

              {/* Secondary Action: REQUEST SIMILAR MATERIAL */}
              {onRequestSimilar && (
                <button
                  type="button"
                  onClick={() => onRequestSimilar(product)}
                  className="w-full py-3 px-4 bg-[#FAF7F2] hover:bg-[#F3EDE2] text-[#181715] border border-[#DDD5C7] hover:border-[#B8934A] font-mono text-xs font-semibold tracking-wider uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#B8934A]" />
                  <span>REQUEST SIMILAR MATERIAL</span>
                </button>
              )}

              {/* Swatch Collection Toggle Action: ADD TO SWATCH / INQUIRY or REMOVE */}
              {(onToggleCollection || onAddToCollection) && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onToggleCollection) {
                      onToggleCollection(product);
                    } else if (onAddToCollection) {
                      onAddToCollection(product, 1);
                    }
                  }}
                  className={`w-full py-2.5 px-4 font-mono text-xs font-semibold tracking-wider uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border ${
                    isInCollection
                      ? 'bg-[#EAE2D2] text-[#181715] border-[#B8934A] shadow-xs hover:bg-[#E2D8C3]'
                      : 'bg-white hover:bg-[#FAF7F2] text-[#55514B] hover:text-[#181715] border-[#DDD5C7] hover:border-[#B8934A]'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isInCollection ? 'text-[#B8934A] fill-[#B8934A]' : 'text-[#B8934A]'}`} />
                  <span>{isInCollection ? 'IN SWATCH COLLECTION — CLICK TO REMOVE' : 'ADD TO SWATCH / INQUIRY'}</span>
                </button>
              )}
            </div>

          </div>

          {/* 6. Subtle Previous / Next Material Navigation */}
          {allProducts && allProducts.length > 1 && (
            <div className="pt-4 mt-4 border-t border-[#EAE3D4] flex items-center justify-between text-[11px] font-mono text-[#737068]">
              <button
                type="button"
                onClick={handlePrev}
                disabled={!hasPrev}
                className="hover:text-[#181715] disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-[#B8934A]" />
                <span>PREV</span>
              </button>

              <span className="text-[10px] text-[#8C877E] font-mono">
                {currentIndex >= 0 ? currentIndex + 1 : 1} / {allProducts.length}
              </span>

              <button
                type="button"
                onClick={handleNext}
                disabled={!hasNext}
                className="hover:text-[#181715] disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>NEXT</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#B8934A]" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
