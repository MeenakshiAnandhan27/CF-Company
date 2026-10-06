import React, { useEffect, useState } from 'react';
import { DiscoveryMaterial } from '../../data/catalogueDiscoveryData.ts';
import {
  X,
  ArrowRight,
  ExternalLink,
  Plus,
  Check,
  Sparkles,
  Info,
  Layers,
  ShieldCheck,
} from 'lucide-react';

interface MaterialDetailProps {
  material: DiscoveryMaterial | null;
  onClose: () => void;
  onEnquire: (material: DiscoveryMaterial) => void;
  onViewDeepDetails?: (material: DiscoveryMaterial) => void;
  onAddToCollection?: (material: DiscoveryMaterial) => void;
  isInCollection?: boolean;
}

export const MaterialDetail: React.FC<MaterialDetailProps> = ({
  material,
  onClose,
  onEnquire,
  onViewDeepDetails,
  onAddToCollection,
  isInCollection = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [showTechnicalDrawer, setShowTechnicalDrawer] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (material) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setShowTechnicalDrawer(false);
      setImageError(false);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [material, onClose]);

  if (!material) return null;

  const displayImage = imageError && material.fallbackTexture
    ? material.fallbackTexture
    : material.image;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="material-detail-title"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#181715]/60 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md md:max-w-xl bg-[#FAF8F5] shadow-2xl flex flex-col border-l border-[#E2DDD3] animate-in slide-in-from-right duration-300">
          {/* Header bar */}
          <div className="px-6 py-4 border-b border-[#E8E2D7] flex items-center justify-between bg-[#F4EFE6]/70">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-semibold text-[#82553E] bg-[#EBE4D8] px-2.5 py-0.5 rounded">
                {material.category}
              </span>
              <span className="text-xs text-[#7B756C]">·</span>
              <span className="text-xs font-mono text-[#7B756C]">{material.subcategory}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close panel"
              className="p-1.5 rounded-full text-[#6E685F] hover:text-[#181715] hover:bg-[#E8E2D7] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
            {/* Hero Raw Material Visual: Large circular or softly rounded focus */}
            <div className="flex flex-col items-center">
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden bg-[#ECE7DE] border-2 border-[#DDD5C7] shadow-md group">
                <img
                  src={displayImage}
                  alt={`Close up raw material view of ${material.name}`}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full pointer-events-none ring-1 ring-inset ring-black/10 bg-gradient-to-t from-black/15 via-transparent to-transparent"
                />
              </div>
              <span className="mt-3 text-[11px] font-mono uppercase tracking-widest text-[#8C877E] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#82553E]" />
                Actual Raw Material Visual
              </span>
            </div>

            {/* Material Heading & 1-line description */}
            <div className="text-center space-y-2">
              <h3 id="material-detail-title" className="font-serif text-2xl sm:text-3xl font-medium text-[#181715]">
                {material.name}
              </h3>
              <p className="text-sm text-[#5C564D] leading-relaxed max-w-md mx-auto">
                {material.description}
              </p>
            </div>

            {/* Clean Key Specifications (3-4 essential items, minimal layout) */}
            <div className="bg-white border border-[#E2DDD3] rounded-xl p-4 sm:p-5 space-y-3.5 shadow-xs">
              <div className="grid grid-cols-2 gap-3 text-left">
                {material.composition && (
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8C877E]">
                      COMPOSITION
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-[#181715] mt-0.5 block">
                      {material.composition}
                    </span>
                  </div>
                )}

                {(material.weave || material.pattern) && (
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8C877E]">
                      {material.pattern ? 'PATTERN' : 'WEAVE / TYPE'}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-[#181715] mt-0.5 block">
                      {material.pattern || material.weave}
                    </span>
                  </div>
                )}

                {material.width && (
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8C877E]">
                      WIDTH / GAUGE
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-[#181715] mt-0.5 block">
                      {material.width}
                    </span>
                  </div>
                )}

                {material.gsm && (
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8C877E]">
                      WEIGHT / GSM
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-[#181715] mt-0.5 block">
                      {material.gsm}
                    </span>
                  </div>
                )}
              </div>

              {/* Available Variants (if data exists) */}
              {material.variants && material.variants.length > 0 && (
                <div className="pt-3 border-t border-[#EFECE5]">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8C877E] mb-1.5">
                    AVAILABLE VARIANTS &amp; QUALITIES
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {material.variants.map((variant) => (
                      <span
                        key={variant}
                        className="text-xs font-sans text-[#2C2926] bg-[#F5F2EB] border border-[#DDD6C8] px-2.5 py-1 rounded-md"
                      >
                        {variant}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sourcing & Supply Guarantee Note */}
            <div className="flex items-start gap-3 p-3.5 bg-[#F3EFE7] rounded-lg border border-[#DDD5C7] text-xs text-[#6B645A]">
              <ShieldCheck className="w-4 h-4 text-[#82553E] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-semibold text-[#181715] block">
                  Sourced for Your Production
                </span>
                <p className="leading-normal">
                  Supplied in sampling bolts or full production mill rolls. Custom shades, counts, and weaves arranged on order.
                </p>
              </div>
            </div>

            {/* Optional Collapsible Technical Details (only if requested) */}
            {showTechnicalDrawer && (
              <div className="p-4 bg-white border border-[#DDD5C7] rounded-xl text-xs space-y-2 animate-in fade-in duration-200">
                <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[#181715]">
                  Detailed Supply Data
                </h4>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-[#8C877E] block text-[10px]">SUPPLIER ID</span>
                    <span className="font-mono font-medium">{material.productCode || material.id}</span>
                  </div>
                  <div>
                    <span className="text-[#8C877E] block text-[10px]">MINIMUM ORDER</span>
                    <span>100 Meters / Units</span>
                  </div>
                  <div>
                    <span className="text-[#8C877E] block text-[10px]">PACKAGING</span>
                    <span>Rolls / Tubes with Moisture Barrier</span>
                  </div>
                  <div>
                    <span className="text-[#8C877E] block text-[10px]">DISPATCH LOCATION</span>
                    <span>Tiruppur Hub / Mill Direct</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons footer */}
          <div className="p-5 border-t border-[#E8E2D7] bg-[#F7F4EE] space-y-2.5">
            <div className="flex flex-col sm:flex-row gap-2.5">
              {/* Enquire CTA */}
              <button
                type="button"
                onClick={() => onEnquire(material)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider bg-[#82553E] hover:bg-[#6e4632] text-white rounded-lg shadow-xs transition-colors"
              >
                <span>Enquire About Material</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* View Deep Details CTA */}
              {onViewDeepDetails && (
                <button
                  type="button"
                  onClick={() => onViewDeepDetails(material)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-semibold uppercase tracking-wider bg-white hover:bg-[#EDE8DE] text-[#181715] border border-[#DDD5C7] rounded-lg transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#736F68]" />
                  <span>Full View</span>
                </button>
              )}
            </div>

            {/* Quick Add to Swatch Collection / Secondary actions */}
            <div className="flex items-center justify-between pt-1">
              {onAddToCollection && (
                <button
                  type="button"
                  onClick={() => onAddToCollection(material)}
                  className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${
                    isInCollection
                      ? 'text-[#2D6A4F] hover:text-[#1B4332]'
                      : 'text-[#6A655D] hover:text-[#181715]'
                  }`}
                >
                  {isInCollection ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#2D6A4F]" />
                      <span>In Swatch Collection</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Swatch Inquiry</span>
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowTechnicalDrawer(!showTechnicalDrawer)}
                className="text-[11px] text-[#82553E] hover:underline font-medium"
              >
                {showTechnicalDrawer ? 'Hide specs' : 'More specs'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
