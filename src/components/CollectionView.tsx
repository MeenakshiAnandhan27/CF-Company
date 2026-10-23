import React, { useState } from 'react';
import { CollectionItem, Product } from '../types.ts';
import { RAW_MATERIAL_IMAGES } from '../data/materialImages.ts';
import {
  X,
  ArrowRight,
  ArrowUpRight,
  ShoppingBag,
  Sparkles,
  Trash2,
  Plus,
} from 'lucide-react';

export interface CollectionViewProps {
  isOpen?: boolean;
  onClose?: () => void;
  collection: CollectionItem[];
  onRemoveItem: (productId: string) => void;
  onClearCollection: () => void;
  onGenerateEnquiry: () => void;
  onExploreCatalogue: () => void;
  onViewDetails: (product: Product) => void;
  onUpdateQuantity?: (productId: string, quantity: number) => void;
}

export const CollectionView: React.FC<CollectionViewProps> = ({
  isOpen = true,
  onClose,
  collection,
  onRemoveItem,
  onClearCollection,
  onGenerateEnquiry,
  onExploreCatalogue,
  onViewDetails,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Helper to resolve the highest-resolution swatch texture image
  const getProductImage = (product: Product): string => {
    const rawConfig = RAW_MATERIAL_IMAGES[product.id];
    if (rawConfig?.imagePath) return rawConfig.imagePath;
    if (product.images && product.images.length > 0) return product.images[0];
    return '/assets/catalogue-3d/plain.png';
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="collection-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop with soft blur */}
      <div
        className="fixed inset-0 bg-[#121110]/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FAF8F5] border-l border-[#E5E0D8] shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300 select-none">
          
          {/* ═══════════════════════════════════════════════════════════ */}
          {/* HEADER: Single-Line Diamond Accent, Serif Title & Counter   */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="p-5 sm:p-6 border-b border-[#EAE3D4] bg-[#FFFDF9]/90 backdrop-blur-xs shrink-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                {/* Single-line Diamond Motif Eyebrow */}
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-[#B8934A] font-semibold mb-1">
                  <div className="w-1.5 h-1.5 border border-[#B8934A] rotate-45 shrink-0" />
                  <span>Curated Swatch Space</span>
                </div>

                <h2
                  id="collection-drawer-title"
                  className="font-serif text-2xl sm:text-3xl font-bold text-[#142E20] tracking-tight leading-tight"
                >
                  Your Material Collection
                </h2>

                <div className="flex items-center gap-3 mt-1 text-xs text-[#736F68]">
                  <span className="font-mono text-[11px] text-[#8C877E]">
                    {collection.length === 0
                      ? 'No swatches saved yet'
                      : `${collection.length} ${collection.length === 1 ? 'material swatch' : 'material swatches'}`}
                  </span>

                  {collection.length > 0 && !showClearConfirm && (
                    <>
                      <span className="text-[#DDD5C7]">·</span>
                      <button
                        type="button"
                        onClick={() => setShowClearConfirm(true)}
                        className="text-[11px] font-mono text-[#8C877E] hover:text-[#A63C26] transition-colors cursor-pointer"
                      >
                        Clear all
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Close Drawer Button */}
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close collection drawer"
                  className="w-8 h-8 rounded-full bg-white hover:bg-[#F2ECE1] text-[#55514B] hover:text-[#142E20] border border-[#DDD5C7] flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Clear All Confirmation Bar */}
            {showClearConfirm && (
              <div className="mt-3 p-2.5 rounded-lg bg-[#FAF1EE] border border-[#F0CEC4] flex items-center justify-between text-xs text-[#A63C26] animate-in fade-in duration-200">
                <span className="font-medium text-[11px]">Clear all saved swatches?</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClearCollection();
                      setShowClearConfirm(false);
                    }}
                    className="font-mono text-[11px] font-bold px-2 py-0.5 bg-[#A63C26] text-white rounded hover:bg-[#8A301D] transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(false)}
                    className="font-mono text-[11px] text-[#736F68] hover:text-[#181715] px-1.5 py-0.5 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* BODY: Visual Swatches Grid OR Tasteful Empty State          */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {collection.length === 0 ? (
              /* Tasteful Empty State with exact requested messaging */
              <div className="h-full min-h-[320px] flex flex-col items-center justify-center text-center p-6 border border-dashed border-[#DDD5C7] rounded-2xl bg-white/60 space-y-4 my-auto">
                {/* Empty Swatch Frame Visual */}
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-b from-[#FAF7F2] to-[#EFE8DC] border border-[#D5CCBC] flex items-center justify-center shadow-xs">
                  <div className="w-2 h-2 border border-[#B8934A] rotate-45" />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(212,175,55,0.2),transparent_70%)] pointer-events-none"
                  />
                </div>

                <div className="space-y-1.5 max-w-xs">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#142E20]">
                    Your Material Collection
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B665E] leading-relaxed">
                    Save materials you love and keep them together for your next enquiry.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose?.();
                      onExploreCatalogue();
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider text-[#FAF7F2] bg-[#142E20] hover:bg-[#1B3B2B] border border-[#B8934A]/70 hover:border-[#D4AF37] shadow-[0_0_16px_rgba(184,147,74,0.22)] hover:shadow-[0_0_24px_rgba(184,147,74,0.42)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <span>Explore Fabrics</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </button>
                </div>
              </div>
            ) : (
              /* Compact Visual Swatches Grid */
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {collection.map((item) => {
                  const product = item.product;
                  const imgSrc = getProductImage(product);

                  return (
                    <div
                      key={product.id}
                      onClick={() => {
                        onClose?.();
                        onViewDetails(product);
                      }}
                      className="group relative rounded-xl p-2.5 bg-white border border-[#E5DFD4] hover:border-[#D4AF37] hover:shadow-[0_8px_22px_rgba(184,147,74,0.18)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col justify-between select-none"
                    >
                      {/* Swatch Image Container */}
                      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#ECE7DC] border border-[#DDD5C7] shadow-inner">
                        <img
                          src={imgSrc}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                        />

                        {/* Subtle tactile lighting sheen */}
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-black/20 via-transparent to-white/25"
                        />

                        {/* Elegant Remove Control */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveItem(product.id);
                          }}
                          className="absolute top-1.5 right-1.5 z-10 w-6 h-6 rounded-full bg-white/95 hover:bg-[#A63C26] text-[#736F68] hover:text-white border border-[#DDD5C7] hover:border-[#A63C26] flex items-center justify-center transition-all shadow-xs cursor-pointer"
                          title={`Remove ${product.name} from collection`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Swatch Details: Title, Category & Micro Action */}
                      <div className="pt-2 text-left space-y-0.5">
                        <span className="block text-[9px] font-mono uppercase tracking-widest text-[#B8934A] font-semibold truncate">
                          {product.categoryLabel || product.subcategory || 'Textile'}
                        </span>

                        <h4 className="font-serif text-xs sm:text-sm font-bold text-[#142E20] group-hover:text-[#8C6534] transition-colors leading-tight truncate">
                          {product.name}
                        </h4>

                        <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-[#8C877E]">
                          <span className="truncate max-w-[90px]">
                            {product.width || product.fabric || 'Inquiry Swatch'}
                          </span>
                          <span className="text-[#B8934A] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                            <span>Inspect</span>
                            <ArrowUpRight className="w-2.5 h-2.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* FOOTER: Enquire Action & Add More Materials                 */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {collection.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-[#EAE3D4] bg-[#FFFDF9]/95 backdrop-blur-xs space-y-3 shrink-0">
              {/* Primary Action: ENQUIRE ABOUT SELECTED MATERIALS */}
              <button
                type="button"
                onClick={() => {
                  onClose?.();
                  onGenerateEnquiry();
                }}
                className="group relative w-full py-3.5 px-6 rounded-xl font-mono text-xs font-semibold uppercase tracking-wider text-[#FAF7F2] bg-[#142E20] hover:bg-[#1B3B2B] border border-[#B8934A]/70 hover:border-[#D4AF37] shadow-[0_0_18px_rgba(184,147,74,0.28)] hover:shadow-[0_0_26px_rgba(184,147,74,0.45)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] overflow-hidden"
              >
                {/* Subtle warm shimmer */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-35 transition-opacity bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.45),transparent_70%)]"
                />

                <span className="relative">Generate Enquiry</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform relative" />
              </button>

              {/* Secondary Navigation Action */}
              <div className="flex items-center justify-between text-xs text-[#736F68] pt-1">
                <span className="text-[11px] font-mono text-[#8C877E]">
                  {collection.length} {collection.length === 1 ? 'item' : 'items'} prefilled
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose?.();
                    onExploreCatalogue();
                  }}
                  className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-[#8C6534] hover:text-[#142E20] hover:underline cursor-pointer"
                >
                  <Plus className="w-3 h-3 text-[#B8934A]" />
                  <span>Add More Fabrics</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
