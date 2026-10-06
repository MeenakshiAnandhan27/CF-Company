import React, { useEffect, useState } from 'react';
import { Product } from '../types.ts';
import { RAW_MATERIAL_IMAGES } from '../data/materialImages.ts';
import {
  X,
  ArrowRight,
  Maximize2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Info,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onEnquire: (product: Product) => void;
  onAddToCollection?: (product: Product, quantity: number, colour?: string, size?: string) => void;
  isInCollection?: boolean;
  currentQuantityInCollection?: number;
  onRequestSimilar?: (product: Product) => void;
  allProducts?: Product[];
  onSelectProduct?: (product: Product) => void;
}

interface KeyDetail {
  label: string;
  value: string;
}

/**
 * Extracts a maximum of 3–4 category-relevant specifications
 * to keep the initial view clean, minimal, and scannable within 3–5 seconds.
 */
function getKeyDetails(product: Product): KeyDetail[] {
  const details: KeyDetail[] = [];
  const cat = product.category;

  if (cat === 'fabrics') {
    if (product.width) details.push({ label: 'WIDTH', value: product.width });
    if (product.gsm) details.push({ label: 'GSM / WEIGHT', value: product.gsm });
    if (product.yarnConstruction) details.push({ label: 'CONSTRUCTION', value: product.yarnConstruction });
    if (product.weave || product.subcategory) {
      details.push({ label: 'WEAVE', value: product.weave || product.subcategory || 'Woven' });
    }
  } else if (cat === 'denim') {
    if (product.width) details.push({ label: 'WIDTH', value: product.width });
    if (product.fabric) {
      details.push({ label: 'COMPOSITION', value: product.fabric.split(';')[0].slice(0, 24) });
    }
    details.push({ label: 'WEAVE', value: '3/1 Twill' });
    details.push({ label: 'AVAILABILITY', value: product.availability || 'In Stock' });
  } else if (cat === 'mesh' || cat === 'lycra-mesh') {
    if (product.width || product.sizes?.[0]) {
      details.push({ label: 'WIDTH', value: product.width || product.sizes?.[0] || '58"' });
    }
    if (product.fabric) {
      details.push({ label: 'STRUCTURE', value: product.fabric.split(';')[0].slice(0, 24) });
    }
    if (product.gsm) details.push({ label: 'WEIGHT', value: product.gsm });
    details.push({ label: 'AVAILABILITY', value: product.availability || 'In Stock' });
  } else if (cat === 'laces') {
    const size = product.sizes?.[0] || '25 mm – 100 mm';
    details.push({ label: 'WIDTH', value: size });
    if (product.fabric) {
      details.push({ label: 'MATERIAL', value: product.fabric.split(';')[0].slice(0, 24) });
    }
    if (product.subcategory) details.push({ label: 'TYPE', value: product.subcategory });
    details.push({ label: 'AVAILABILITY', value: product.availability || 'In Stock' });
  } else if (cat === 'buttons') {
    const sizes = product.sizes ? product.sizes.slice(0, 2).join(', ') : '14L – 24L';
    details.push({ label: 'SIZES', value: sizes });
    if (product.fabric) details.push({ label: 'MATERIAL', value: product.fabric.slice(0, 24) });
    if (product.subcategory) details.push({ label: 'TYPE', value: product.subcategory });
    details.push({ label: 'AVAILABILITY', value: product.availability || 'In Stock' });
  } else if (cat === 'tapes') {
    const sizes = product.sizes ? product.sizes.slice(0, 2).join(', ') : '10mm – 40mm';
    details.push({ label: 'WIDTHS', value: sizes });
    if (product.fabric) details.push({ label: 'MATERIAL', value: product.fabric.slice(0, 24) });
    details.push({ label: 'WEAVE', value: 'Woven Twill' });
    details.push({ label: 'AVAILABILITY', value: product.availability || 'In Stock' });
  } else if (cat === 'tags') {
    const sizes = product.sizes?.[0] || 'Standard & Custom';
    details.push({ label: 'SIZES', value: sizes });
    if (product.fabric) details.push({ label: 'MATERIAL', value: product.fabric.slice(0, 24) });
    details.push({ label: 'EDGE', value: 'Ultrasonic Soft Cut' });
    details.push({ label: 'AVAILABILITY', value: product.availability || 'In Stock' });
  } else {
    // Default accessories / processing
    if (product.sizes?.[0]) details.push({ label: 'SPECIFICATION', value: product.sizes[0] });
    if (product.fabric) details.push({ label: 'MATERIAL', value: product.fabric.slice(0, 24) });
    if (product.subcategory) details.push({ label: 'TYPE', value: product.subcategory });
    details.push({ label: 'AVAILABILITY', value: product.availability || 'In Stock' });
  }

  // Strictly maximum 4 key specifications
  return details.slice(0, 4);
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onEnquire,
  onRequestSimilar,
  allProducts,
  onSelectProduct,
}) => {
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [isFullscreenViewerOpen, setIsFullscreenViewerOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreenViewerOpen) {
          setIsFullscreenViewerOpen(false);
        } else {
          onClose();
        }
      }
    };

    if (product) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setShowFullDetails(false);
      setIsFullscreenViewerOpen(false);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, onClose, isFullscreenViewerOpen]);

  if (!product) return null;

  // Strict Raw Material Image mapping: Always authentic raw material close-up
  const rawConfig = RAW_MATERIAL_IMAGES[product.category];
  const imageSrc = rawConfig?.imagePath || product.images?.[0] || `/assets/materials/${product.category}.jpg`;
  const altText = rawConfig?.altText || `Raw material view of ${product.name}`;

  // Short 1-2 line description (What it is + Where it can be used)
  const shortDescription = product.shortDescription || product.description;

  // Category-aware 3-4 key specifications
  const keyDetails = getKeyDetails(product);

  // Previous & Next navigation
  const currentIndex = allProducts ? allProducts.findIndex((p) => p.id === product.id) : -1;
  const hasPrev = allProducts && currentIndex > 0;
  const hasNext = allProducts && currentIndex < allProducts.length - 1;

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

  return (
    <>
      {/* ======================================================== */}
      {/* MAIN MATERIAL DETAIL MODAL BACKDROP */}
      {/* ======================================================== */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 select-none"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200/80 overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[640px]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button (top-right) */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* ======================================================== */}
          {/* LEFT COLUMN (~58%): HERO RAW MATERIAL IMAGE */}
          {/* ======================================================== */}
          <div
            className="w-full md:w-[58%] relative bg-stone-100 min-h-[300px] sm:min-h-[360px] md:min-h-full overflow-hidden group cursor-pointer"
            onClick={() => setIsFullscreenViewerOpen(true)}
            title="Click to view full-resolution raw material"
          >
            <img
              src={imageSrc}
              alt={altText}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              style={{ objectPosition: rawConfig?.objectPosition || 'center' }}
            />

            {/* Subtle corner zoom icon button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsFullscreenViewerOpen(true);
              }}
              className="absolute bottom-4 right-4 p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors flex items-center gap-1.5 text-xs font-mono"
              title="Expand raw material view"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Inspect Fullscreen</span>
            </button>

            {/* Subtle Raw Textile Badge */}
            <div className="absolute top-4 left-4 bg-stone-950/70 backdrop-blur-xs text-stone-200 px-2.5 py-1 rounded text-[10px] font-mono tracking-widest uppercase pointer-events-none">
              Raw Material View
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN (~42%): CLEAN, VISUAL-FIRST INFORMATION */}
          {/* ======================================================== */}
          <div className="w-full md:w-[42%] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-white">
            <div className="space-y-4">
              {/* 1. Header: Small Category Label & Breadcrumb */}
              <div>
                <div className="text-[11px] font-mono text-[#82553E] uppercase tracking-[0.2em] font-semibold flex items-center gap-1.5">
                  <span>{product.categoryLabel}</span>
                  {product.subcategory && (
                    <>
                      <span className="text-stone-300">•</span>
                      <span className="text-stone-600">{product.subcategory}</span>
                    </>
                  )}
                </div>

                {/* 2. Large Elegant Material Title */}
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181715] tracking-tight leading-tight mt-1">
                  {product.name}
                </h2>

                {/* Subtle Material Reference Code */}
                {product.productCode && (
                  <span className="text-[11px] font-mono text-[#8C877E] block mt-0.5">
                    Ref. {product.productCode}
                  </span>
                )}
              </div>

              {/* 3. Short 1–2 Line Description */}
              <p className="text-xs sm:text-sm text-[#585550] leading-relaxed">
                {shortDescription}
              </p>

              {/* 4. Category-Aware Key Specifications (Max 3–4 items) */}
              <div className="pt-3 pb-3 border-t border-b border-[#F0ECE4] my-2">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {keyDetails.map((detail, idx) => (
                    <div key={idx}>
                      <span className="text-[10px] font-mono text-[#8C877E] uppercase tracking-wider block">
                        {detail.label}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-[#181715] leading-snug">
                        {detail.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Primary Action: ENQUIRE ABOUT THIS MATERIAL → */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => onEnquire(product)}
                  className="w-full py-3.5 px-6 bg-[#181715] hover:bg-[#82553E] text-white font-mono text-xs font-semibold uppercase tracking-widest rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>ENQUIRE ABOUT THIS MATERIAL</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Secondary Action: REQUEST SIMILAR MATERIAL */}
                {onRequestSimilar && (
                  <button
                    type="button"
                    onClick={() => onRequestSimilar(product)}
                    className="w-full py-2.5 px-4 bg-transparent hover:bg-stone-50 border border-stone-300 text-stone-700 hover:text-stone-900 font-mono text-xs tracking-wider uppercase rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#82553E]" />
                    <span>REQUEST SIMILAR MATERIAL</span>
                  </button>
                )}
              </div>

              {/* 6. Technical Details Accordion (Collapsed by Default) */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowFullDetails(!showFullDetails)}
                  className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#82553E] hover:text-[#181715] uppercase tracking-wider transition-colors"
                >
                  <span>{showFullDetails ? 'HIDE TECHNICAL DETAILS –' : 'VIEW TECHNICAL DETAILS +'}</span>
                </button>

                {showFullDetails && (
                  <div className="mt-3 p-3.5 bg-stone-50 rounded-lg border border-stone-200 text-xs font-mono space-y-2 animate-in fade-in duration-200">
                    {product.yarnConstruction && (
                      <div className="flex justify-between border-b border-stone-200 pb-1">
                        <span className="text-stone-500">Yarn Count:</span>
                        <span className="text-stone-800 font-semibold">{product.yarnConstruction}</span>
                      </div>
                    )}
                    {product.quality && (
                      <div className="flex justify-between border-b border-stone-200 pb-1">
                        <span className="text-stone-500">Quality:</span>
                        <span className="text-stone-800 font-semibold">{product.quality}</span>
                      </div>
                    )}
                    {product.loom && (
                      <div className="flex justify-between border-b border-stone-200 pb-1">
                        <span className="text-stone-500">Manufacturing Loom:</span>
                        <span className="text-stone-800 font-semibold">{product.loom}</span>
                      </div>
                    )}
                    {product.selvage && (
                      <div className="flex justify-between border-b border-stone-200 pb-1">
                        <span className="text-stone-500">Selvage Standard:</span>
                        <span className="text-stone-800 font-semibold">{product.selvage}</span>
                      </div>
                    )}
                    {product.standard && (
                      <div className="flex justify-between border-b border-stone-200 pb-1">
                        <span className="text-stone-500">Standard Grade:</span>
                        <span className="text-stone-800 font-semibold">{product.standard}</span>
                      </div>
                    )}
                    {product.applications && product.applications.length > 0 && (
                      <div className="pt-1">
                        <span className="text-stone-500 block text-[10px] uppercase">Common Uses:</span>
                        <span className="text-stone-700 font-sans text-xs">
                          {product.applications.join(' · ')}
                        </span>
                      </div>
                    )}
                    {product.colours && product.colours.length > 0 && (
                      <div className="pt-1">
                        <span className="text-stone-500 block text-[10px] uppercase">Available States / Shades:</span>
                        <span className="text-stone-700 font-sans text-xs">
                          {product.colours.join(' · ')}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 7. Subtle Previous / Next Material Navigation */}
            {allProducts && allProducts.length > 1 && (
              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-[11px] font-mono text-[#8C877E]">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={!hasPrev}
                  className="hover:text-[#181715] disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>PREV</span>
                </button>

                <span className="text-[10px] text-stone-400">
                  {currentIndex + 1} / {allProducts.length}
                </span>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!hasNext}
                  className="hover:text-[#181715] disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1"
                >
                  <span>NEXT</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* FULLSCREEN RAW MATERIAL LIGHTBOX VIEWER */}
      {/* ======================================================== */}
      {isFullscreenViewerOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200 select-none"
          onClick={() => setIsFullscreenViewerOpen(false)}
        >
          {/* Close button in top-right */}
          <button
            onClick={() => setIsFullscreenViewerOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close fullscreen view"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Centered High-Resolution Image */}
          <div
            className="relative max-h-[82vh] max-w-[90vw] overflow-hidden rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageSrc}
              alt={altText}
              referrerPolicy="no-referrer"
              className="max-h-[82vh] max-w-[90vw] object-contain rounded-lg"
            />
          </div>

          {/* Bottom Caption */}
          <div className="mt-4 text-center text-xs font-mono text-stone-300">
            <span className="font-semibold text-white">{product.name}</span>
            {product.productCode && <span> • Ref. {product.productCode}</span>}
            <span className="text-stone-500"> • Raw Material Texture Close-Up</span>
          </div>
        </div>
      )}
    </>
  );
};
