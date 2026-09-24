import React, { useEffect, useState } from 'react';
import { Product } from '../types.ts';
import { TextileVisual } from './TextileVisual.tsx';
import {
  X,
  Mail,
  CheckCircle2,
  AlertCircle,
  Scissors,
  BookmarkPlus,
  Check,
  Plus,
  Minus,
  Sparkles,
  Layers,
  Palette,
  Ruler,
} from 'lucide-react';
import { businessConfig } from '../data/businessConfig.ts';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onEnquire: (product: Product) => void;
  onAddToCollection?: (product: Product, quantity: number, colour?: string, size?: string) => void;
  isInCollection?: boolean;
  currentQuantityInCollection?: number;
  onRequestSimilar?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onEnquire,
  onAddToCollection,
  isInCollection = false,
  currentQuantityInCollection = 0,
  onRequestSimilar,
}) => {
  const [selectedColour, setSelectedColour] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedJustNow, setAddedJustNow] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (product) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      // Initialize defaults
      setSelectedColour(product.colours?.[0] || '');
      setSelectedSize(product.sizes?.[0] || '');
      setQuantity(currentQuantityInCollection > 0 ? currentQuantityInCollection : 1);
      setAddedJustNow(false);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, currentQuantityInCollection, onClose]);

  if (!product) return null;

  const isService = product.isService || product.category === 'processing';

  const handleAddCollection = () => {
    if (onAddToCollection) {
      onAddToCollection(product, quantity, selectedColour, selectedSize);
      setAddedJustNow(true);
      setTimeout(() => setAddedJustNow(false), 2200);
    }
  };

  const getAvailabilityBadge = (status: Product['availability']) => {
    switch (status) {
      case 'In Stock':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Made to Order':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Sampling Available':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'Available on Order':
      default:
        return 'bg-[#F2EFEA] text-[#635E56] border-[#DFDAD0]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-[#DCD7CD] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E6E0] bg-[#FAF9F6]">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#82553E] bg-[#F3ECE4] px-2.5 py-1 rounded">
              {product.categoryLabel}
            </span>
            <span className="text-xs font-mono font-semibold text-[#181715] bg-[#EAE7E1] px-2.5 py-1 rounded">
              Code: {product.productCode}
            </span>
            <span
              className={`text-xs font-medium px-2.5 py-0.5 rounded border ${getAvailabilityBadge(
                product.availability
              )}`}
            >
              {product.availability}
            </span>
            {isService && (
              <span className="text-xs uppercase tracking-wider font-semibold text-[#2D453E] bg-[#E3EFEA] px-2.5 py-1 rounded flex items-center gap-1">
                <Scissors className="w-3 h-3" />
                Custom Processing
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#585550] hover:text-[#181715] hover:bg-[#EFECE6] rounded-full transition-colors"
            aria-label="Close Product Details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-5 sm:p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Visual Column: Large product image */}
            <div className="md:col-span-6 space-y-4">
              <div className="rounded-lg overflow-hidden border border-[#E8E6E0] shadow-sm relative bg-[#F5F4F0]">
                <TextileVisual
                  product={product}
                  patternType={product.patternType}
                  category={product.categoryLabel}
                  name={product.name}
                  aspectRatio="4:3"
                />

                <div className="absolute top-3 left-3 bg-[#181715]/85 backdrop-blur-sm text-white px-2.5 py-1 rounded text-xs font-mono">
                  {product.productCode}
                </div>
              </div>

              {/* Sample swatch callout */}
              <div className="p-3.5 bg-[#FAF9F6] border border-[#EFECE6] rounded-md text-xs text-[#78746C] leading-relaxed">
                <span className="font-semibold text-[#181715] block mb-0.5">
                  Physical Swatches &amp; Mill Bolts:
                </span>
                Inspection swatches, roll bolts, and physical shade cards can be requested for your cutting room sampling in Boyampalayam, Tiruppur.
              </div>

              {/* Pricing & Commercial Terms Highlight */}
              <div className="p-4 bg-[#F7F5F0] rounded-lg border border-[#E5E1D8] flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#736F68] block font-mono">
                    Wholesale Price Guide
                  </span>
                  <span className="font-serif text-2xl font-bold text-[#82553E]">
                    {product.price}
                  </span>
                </div>
                <div className="text-right text-[11px] text-[#736F68]">
                  <span className="block font-medium text-[#181715]">Bulk Tier Available</span>
                  <span>GST &amp; transport as applicable</span>
                </div>
              </div>
            </div>

            {/* Information Column */}
            <div className="md:col-span-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#8C877E] uppercase mb-1">
                  <span>{product.categoryLabel}</span>
                  {product.subcategory && <span>• {product.subcategory}</span>}
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181715] leading-tight">
                  {product.name}
                </h2>
                <p className="text-sm text-[#4A4742] leading-relaxed mt-2.5">
                  {product.fullDescription}
                </p>
              </div>

              {/* Technical Specifications */}
              <div className="p-4 bg-[#FBFBFA] rounded-lg border border-[#E8E6E0] space-y-2.5 text-xs">
                <div className="flex items-center justify-between border-b border-[#EFECE6] pb-2">
                  <span className="text-[#736F68] font-medium">Fabric Composition:</span>
                  <span className="font-semibold text-[#181715] text-right max-w-[240px]">
                    {product.fabric}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#EFECE6] pb-2">
                  <span className="text-[#736F68] font-medium">Availability Status:</span>
                  <span className="font-semibold text-[#181715]">{product.availability}</span>
                </div>

                <div className="flex items-start justify-between pt-1">
                  <span className="text-[#736F68] font-medium shrink-0">Specifications:</span>
                  <span className="text-[#484540] text-right ml-3">{product.specifications}</span>
                </div>
              </div>

              {/* Colour Selection */}
              {product.colours && product.colours.length > 0 && (
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#181715]">
                    <Palette className="w-3.5 h-3.5 text-[#82553E]" />
                    <span>Available Colours ({product.colours.length})</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colours.map((colour) => {
                      const isSelected = selectedColour === colour;
                      return (
                        <button
                          key={colour}
                          type="button"
                          onClick={() => setSelectedColour(colour)}
                          className={`text-xs px-3 py-1.5 rounded border transition-all ${
                            isSelected
                              ? 'bg-[#181715] text-white border-[#181715] shadow-sm font-semibold'
                              : 'bg-[#FAF9F6] text-[#403D38] border-[#DCD7CD] hover:border-[#181715]'
                          }`}
                        >
                          {colour}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sizes / Widths Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#181715]">
                    <Ruler className="w-3.5 h-3.5 text-[#82553E]" />
                    <span>Available Sizes / Widths ({product.sizes.length})</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`text-xs px-3 py-1.5 rounded border transition-all ${
                            isSelected
                              ? 'bg-[#181715] text-white border-[#181715] shadow-sm font-semibold'
                              : 'bg-[#FAF9F6] text-[#403D38] border-[#DCD7CD] hover:border-[#181715]'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Possible Applications */}
              {product.applications && product.applications.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#736F68] mb-2">
                    Recommended Applications
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {product.applications.map((app, i) => (
                      <span
                        key={i}
                        className="text-[11px] text-[#403D38] bg-[#F5F4F0] px-2.5 py-1 rounded border border-[#E8E5DD] flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3 h-3 text-[#82553E]" />
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Collection & Enquiry Action Area */}
              <div className="p-4 bg-[#FAF9F6] rounded-lg border border-[#E8E6E0] space-y-3 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#181715]">
                    Select Order / Sample Quantity:
                  </span>

                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-[#D5D0C6] rounded bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      className="p-2 text-[#585550] hover:bg-[#F2EFEA] hover:text-[#181715] transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-14 text-center font-mono font-semibold text-xs text-[#181715] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="p-2 text-[#585550] hover:bg-[#F2EFEA] hover:text-[#181715] transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Primary Button: Add to Collection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={handleAddCollection}
                    className={`inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider rounded transition-all shadow-sm ${
                      addedJustNow
                        ? 'bg-emerald-700 text-white'
                        : isInCollection
                        ? 'bg-[#EAE4DC] text-[#40281E] hover:bg-[#E0D7CC] border border-[#D0C2B5]'
                        : 'bg-[#181715] text-white hover:bg-[#302D29]'
                    }`}
                  >
                    {addedJustNow ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Added To Collection!</span>
                      </>
                    ) : isInCollection ? (
                      <>
                        <Check className="w-4 h-4 text-[#82553E]" />
                        <span>Update In Collection ({quantity})</span>
                      </>
                    ) : (
                      <>
                        <BookmarkPlus className="w-4 h-4 text-[#D8C7B8]" />
                        <span>Add To Collection</span>
                      </>
                    )}
                  </button>

                  {/* Direct Enquiry Button */}
                  <button
                    onClick={() => {
                      onClose();
                      onEnquire(product);
                    }}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#181715] bg-white border border-[#D0CBC0] hover:bg-[#F5F3ED] rounded transition-colors"
                  >
                    <Mail className="w-4 h-4 text-[#82553E]" />
                    <span>Direct Enquiry</span>
                  </button>
                </div>

                {/* Sourcing Alternative / Request Similar Material */}
                {onRequestSimilar && (
                  <div className="pt-2 border-t border-[#EAE6DF] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                    <span className="text-[#736F68] text-[11px]">
                      Need a different GSM, custom width, or weave variation?
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onRequestSimilar(product);
                      }}
                      className="text-[#82553E] hover:text-[#181715] font-semibold uppercase tracking-wider text-[11px] underline flex items-center gap-1 shrink-0"
                    >
                      <Sparkles className="w-3 h-3 text-[#82553E]" />
                      <span>Request Similar Material</span>
                    </button>
                  </div>
                )}

                <p className="text-[11px] text-center text-[#8C877E]">
                  Add multiple materials to your collection to generate a unified dealer quotation.
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Modal Footer Bar */}
        <div className="px-6 py-3 bg-[#FAF9F6] border-t border-[#E8E6E0] flex items-center justify-between text-xs text-[#78746C]">
          <span>Classic Fashions • Boyampalayam, Tiruppur</span>
          <button
            onClick={onClose}
            className="hover:text-[#181715] underline font-medium"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
