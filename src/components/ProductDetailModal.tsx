import React, { useEffect } from 'react';
import { Product } from '../types.ts';
import { TextileVisual } from './TextileVisual.tsx';
import { X, Mail, CheckCircle2, AlertCircle, Scissors, ArrowRight } from 'lucide-react';
import { businessConfig } from '../data/businessConfig.ts';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onEnquire: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onEnquire,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (product) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  const isService = product.isService || product.category === 'processing';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-[#DCD7CD] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E6E0] bg-[#FAF9F6]">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#82553E] bg-[#F3ECE4] px-2.5 py-1 rounded">
              {product.categoryLabel}
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
        <div className="overflow-y-auto p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Visual Column */}
            <div className="md:col-span-6 rounded-lg overflow-hidden border border-[#E8E6E0] shadow-sm">
              <TextileVisual
                product={product}
                patternType={product.patternType}
                category={product.categoryLabel}
                name={product.name}
                aspectRatio="4:3"
              />
              <div className="p-3 bg-[#FAF9F6] border-t border-[#EFECE6] text-center text-xs text-[#78746C]">
                Visual sample placeholder for {product.name}. Swatches and actual rolls available upon wholesale enquiry.
              </div>
            </div>

            {/* Information Column */}
            <div className="md:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-mono text-[#8C877E] uppercase tracking-wider">
                  Product Code: {product.id}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#181715] mt-1 mb-3">
                  {product.name}
                </h2>
                <p className="text-sm text-[#4A4742] leading-relaxed">
                  {product.fullDescription}
                </p>
              </div>

              {/* Specifications Block */}
              <div className="p-4 bg-[#FBFBFA] rounded-lg border border-[#E8E6E0] space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#181715]">
                  <AlertCircle className="w-4 h-4 text-[#A65D43]" />
                  <span>Product Specifications</span>
                </div>
                <p className="text-xs text-[#585550] leading-relaxed">
                  {product.specifications}
                </p>
                <div className="text-[11px] text-[#78746C] pt-1">
                  We supply commercial bolts, rolls, and spools. Exact GSM, roll width, composition, and batch quantities are provided directly based on your current production requirements.
                </div>
              </div>

              {/* Possible Applications */}
              {product.applications && product.applications.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#181715] mb-2.5">
                    Possible Applications
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.applications.map((app, i) => (
                      <span
                        key={i}
                        className="text-xs text-[#403D38] bg-[#F5F4F0] px-3 py-1.5 rounded border border-[#E8E5DD] flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3 h-3 text-[#A65D43]" />
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Customization Note */}
              {product.customizationNote && (
                <div className="text-xs text-[#585550] bg-[#FAF8F5] p-3 rounded border border-[#EFECE6]">
                  <span className="font-semibold text-[#181715]">Customization / Availability: </span>
                  {product.customizationNote}
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onEnquire(product);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#181715] hover:bg-[#302D29] rounded shadow-sm transition-all"
                >
                  <Mail className="w-4 h-4 text-[#E5D7CC]" />
                  <span>{isService ? 'Enquire About Processing' : 'Enquire About This Product'}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
                <p className="text-[11px] text-center text-[#8C877E] mt-2">
                  Direct wholesale response via phone, WhatsApp, or email from our sales desk.
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Modal Footer Bar */}
        <div className="px-6 py-3 bg-[#FAF9F6] border-t border-[#E8E6E0] flex items-center justify-between text-xs text-[#78746C]">
          <span>{businessConfig.businessName}</span>
          <button
            onClick={onClose}
            className="hover:text-[#181715] underline font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
