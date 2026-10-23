import React, { useEffect, useState, useRef } from 'react';
import { DiscoveryMaterial } from '../../data/catalogueDiscoveryData.ts';
import {
  X,
  ArrowRight,
  ExternalLink,
  Plus,
  Check,
  RotateCw,
  Eye,
  Maximize2,
  ZoomIn,
} from 'lucide-react';

export interface MaterialDetailProps {
  material: DiscoveryMaterial | null;
  onClose: () => void;
  onEnquire: (material: DiscoveryMaterial, selectedVariant?: string) => void;
  onRequestMaterial?: (material: DiscoveryMaterial, selectedVariant?: string) => void;
  onReachUs?: (material: DiscoveryMaterial, selectedVariant?: string) => void;
  onOpen360?: (material: DiscoveryMaterial) => void;
  onViewDeepDetails?: (material: DiscoveryMaterial) => void;
  onAddToCollection?: (material: DiscoveryMaterial, selectedVariant?: string) => void;
  isInCollection?: boolean;
}

type CloserLookView = 'swatch' | 'macro' | 'angle';

export const MaterialDetail: React.FC<MaterialDetailProps> = ({
  material,
  onClose,
  onEnquire,
  onRequestMaterial,
  onReachUs,
  onOpen360,
  onViewDeepDetails,
  onAddToCollection,
  isInCollection = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [activeView, setActiveView] = useState<CloserLookView>('swatch');
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  
  // Interactive 3D Perspective Tilt on Mouse/Touch Drag
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHoveringSwatch, setIsHoveringSwatch] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const swatchRef = useRef<HTMLDivElement>(null);

  // Sync state when material changes
  useEffect(() => {
    if (material) {
      setImageError(false);
      setActiveView('swatch');
      setSelectedVariant(material.variants && material.variants.length > 0 ? material.variants[0] : '');
      setTilt({ x: 0, y: 0 });
      document.body.style.overflow = 'hidden';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [material, onClose]);

  if (!material) return null;

  const displayImage = imageError && material.fallbackTexture
    ? material.fallbackTexture
    : material.image;

  const secondaryTextureImage = material.fallbackTexture && material.fallbackTexture !== material.image
    ? material.fallbackTexture
    : material.image;

  // Handlers for mouse/touch 3D perspective tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!swatchRef.current) return;
    const rect = swatchRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Calculate tilt normalized between -15 and +15 deg
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
    // Constrain tilt
    const rotateY = Math.max(-20, Math.min(20, (deltaX / 120) * 16));
    const rotateX = Math.max(-20, Math.min(20, (-deltaY / 120) * 16));
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleMouseLeave = () => {
    setIsHoveringSwatch(false);
    setIsDragging(false);
    setTilt({ x: 0, y: 0 });
  };

  // Primary action: navigate to Request Material with material prefilled
  const handlePrimaryEnquire = () => {
    if (onRequestMaterial) {
      onRequestMaterial(material, selectedVariant);
    } else {
      onEnquire(material, selectedVariant);
    }
  };

  // Secondary action: "Need a Specific Variation?" navigates to Reach Us with context
  const handleReachUsClick = () => {
    if (onReachUs) {
      onReachUs(material, selectedVariant);
    } else {
      try {
        const ctx = `${material.name}${selectedVariant ? ` (${selectedVariant})` : ''} [${material.category}]`;
        sessionStorage.setItem('cf_reach_us_material_context', ctx);
      } catch {
        // ignore storage error
      }
      window.location.hash = '#reach-us';
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="material-detail-title"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop with quiet obsidian tint and subtle blur */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#121110]/65 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-md md:max-w-xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F0] to-[#F7F2E8] shadow-2xl flex flex-col border-l border-[#E2D8C3] animate-in slide-in-from-right duration-300">
          
          {/* ═══════════════════════════════════════════════════════════ */}
          {/* HEADER: Refined Editorial Kicker & Close Control            */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="px-6 py-4 border-b border-[#E8E0D1] flex items-center justify-between bg-gradient-to-r from-[#FFFDF9] via-[#F9F5EC] to-[#F5EFE4]">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 border border-[#B8934A] rotate-45 shrink-0 shadow-[0_0_6px_rgba(184,147,74,0.3)]" />
              <span className="text-[10px] font-mono uppercase tracking-[0.22em] font-semibold text-[#B8934A]">
                {material.category}
              </span>
              <span className="text-xs text-[#C5BEB2]">·</span>
              <span className="text-xs font-mono text-[#737068] tracking-wider">
                {material.subcategory}
              </span>
            </div>
            
            <button
              type="button"
              onClick={onClose}
              aria-label="Close panel"
              className="p-1.5 rounded-full text-[#737068] hover:text-[#142E20] hover:bg-[#EAE2D2] transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* SCROLLABLE MAIN CONTENT: Textile Showroom Swatch Display   */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-6">
            
            {/* ───────────────────────────────────────────────────────── */}
            {/* 1. ENGAGING MATERIAL PRESENTATION: Spotlight & Tactile Swatch */}
            {/* ───────────────────────────────────────────────────────── */}
            <div className="flex flex-col items-center relative">
              
              {/* Subtle Warm Spotlight / Radial Glow behind Material Swatch */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none -m-10 rounded-full opacity-80"
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, rgba(184, 147, 74, 0.20) 0%, rgba(20, 46, 32, 0.04) 55%, transparent 75%)',
                }}
              />

              {/* Physical Swatch Card with 3D Perspective Tilt on Hover/Drag */}
              <div
                ref={swatchRef}
                onMouseEnter={() => setIsHoveringSwatch(true)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                  transform: `perspective(750px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHoveringSwatch ? 1.02 : 1})`,
                  transition: isHoveringSwatch ? 'transform 0.08s ease-out' : 'transform 0.4s ease-out',
                }}
                className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#EFE8DC] border border-[#DDD5C7] shadow-[0_18px_45px_rgba(20,46,32,0.08),0_0_24px_rgba(184,147,74,0.12)] cursor-grab active:cursor-grabbing select-none group"
              >
                {/* Genuine Textile Swatch Image with Dynamic Closer Look Transformations */}
                <div className="w-full h-full relative overflow-hidden">
                  <img
                    src={activeView === 'angle' ? secondaryTextureImage : displayImage}
                    alt={`Authentic raw material textile visual of ${material.name}`}
                    onError={() => setImageError(true)}
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      activeView === 'macro'
                        ? 'scale-[2.4] object-center'
                        : activeView === 'angle'
                        ? 'scale-110 rotate-3 object-center'
                        : 'scale-100 object-cover'
                    }`}
                  />

                  {/* Surface Sheen & Ambient Light Gradient Overlay */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-black/15 via-transparent to-white/20 transition-opacity"
                    style={{
                      transform: `translateX(${tilt.y * 1.5}px) translateY(${tilt.x * 1.5}px)`,
                    }}
                  />

                  {/* Macro View Reticle Badge */}
                  {activeView === 'macro' && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="w-28 h-28 rounded-full border border-[#B8934A]/80 shadow-[0_0_16px_rgba(184,147,74,0.4)] flex items-center justify-center bg-[#B8934A]/10 backdrop-blur-[1px]">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-[#FAF7F2] bg-[#142E20]/90 px-2 py-0.5 rounded shadow-xs">
                          2.4× Macro
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Fine Gold Inset Border Ring */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-2xl pointer-events-none ring-1 ring-inset ring-[#B8934A]/30"
                  />
                </div>

                {/* Subtle Swatch Top-Left Corner Fabric Label */}
                <div className="absolute top-2.5 left-2.5 bg-[#142E20]/85 backdrop-blur-xs text-[#FAF7F2] px-2 py-0.5 rounded text-[9px] font-mono tracking-widest uppercase flex items-center gap-1.5 border border-[#B8934A]/40">
                  <span className="w-1 h-1 rounded-full bg-[#D4AF37]" />
                  <span>Showroom Swatch</span>
                </div>

                {/* Subtle Interactive Drag Hint (Fades out when interacting) */}
                {!isHoveringSwatch && (
                  <div className="absolute bottom-2.5 right-2.5 bg-[#FAF7F2]/90 backdrop-blur-xs text-[#142E20] px-2 py-0.5 rounded text-[9px] font-mono tracking-wider uppercase border border-[#DDD5C7] shadow-xs opacity-85">
                    Drag Swatch
                  </div>
                )}
              </div>

              {/* Authentic Material Label */}
              <div className="mt-3 flex items-center gap-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#737068]">
                <div className="w-1.5 h-1.5 border border-[#B8934A] rotate-45 shrink-0" />
                <span>Actual Raw Material Visual</span>
              </div>

              {/* ─────────────────────────────────────────────────────── */}
              {/* 2. MAKE THE 360° INTERACTION STAND OUT: Breathing Gold Halo */}
              {/* ─────────────────────────────────────────────────────── */}
              {onOpen360 && (
                <div className="mt-3 w-full max-w-sm">
                  <button
                    type="button"
                    onClick={() => onOpen360(material)}
                    className="w-full relative group p-3 rounded-xl bg-gradient-to-r from-[#142E20] via-[#1B3B2B] to-[#142E20] hover:from-[#1A3827] hover:to-[#173223] text-[#FAF7F2] border border-[#B8934A]/60 hover:border-[#D4AF37] shadow-[0_0_20px_rgba(184,147,74,0.28)] hover:shadow-[0_0_30px_rgba(184,147,74,0.50)] transition-all duration-300 cursor-pointer active:scale-[0.99] overflow-hidden"
                  >
                    {/* Breathing Gold Ambient Background Shimmer */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 pointer-events-none opacity-30 group-hover:opacity-50 transition-opacity bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.4),transparent_70%)]"
                    />

                    <div className="relative flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {/* Rotating Arrow Icon Container with Gold Ring */}
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-b from-[#244733] to-[#142E20] border border-[#B8934A]/60 flex items-center justify-center shrink-0 text-[#D4AF37] group-hover:border-[#D4AF37] group-hover:scale-105 shadow-[0_0_10px_rgba(184,147,74,0.3)] transition-all">
                          <RotateCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700 stroke-[1.8]" />
                        </div>

                        <div className="text-left">
                          <div className="font-serif text-sm font-semibold tracking-wide text-[#FAF7F2] flex items-center gap-1.5">
                            <span>Interactive 360° Turntable</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                          </div>
                          <span className="text-[11px] font-mono text-[#D4AF37]/90 tracking-wide block mt-0.5">
                            Drag to explore the texture
                          </span>
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform shrink-0" />
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* ───────────────────────────────────────────────────────── */}
            {/* 3. A CLOSER LOOK: Visual Storytelling & Angle Switching   */}
            {/* ───────────────────────────────────────────────────────── */}
            <div className="bg-gradient-to-b from-[#FFFDF9] to-[#FAF7F0] border border-[#E2D8C3] rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 border border-[#B8934A] rotate-45 shrink-0 shadow-[0_0_6px_rgba(184,147,74,0.25)]" />
                  <h4 className="font-serif text-base font-semibold text-[#142E20]">
                    A Closer Look
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-[#737068] uppercase tracking-wider">
                  Select Perspective
                </span>
              </div>

              {/* Perspective Selector Controls */}
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                
                {/* 1. Full Swatch */}
                <button
                  type="button"
                  onClick={() => setActiveView('swatch')}
                  className={`text-left p-2 rounded-xl border transition-all cursor-pointer group flex flex-col items-center ${
                    activeView === 'swatch'
                      ? 'bg-[#FAF4E8] border-[#B8934A] ring-1 ring-[#B8934A]/50 shadow-[0_0_12px_rgba(184,147,74,0.18)]'
                      : 'bg-white border-[#E2DBD0] hover:border-[#B8934A]/70 hover:bg-[#FAF7F2]'
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#DDD5C7] relative mb-1.5 shrink-0 bg-[#ECE7DE]">
                    <img
                      src={displayImage}
                      alt="Full swatch view"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {activeView === 'swatch' && (
                      <div className="absolute inset-0 bg-[#B8934A]/15 ring-1 ring-inset ring-[#B8934A]" />
                    )}
                  </div>
                  <span className={`text-xs font-serif font-semibold block text-center ${activeView === 'swatch' ? 'text-[#142E20]' : 'text-[#55514B]'}`}>
                    Full Swatch
                  </span>
                  <span className="text-[9px] font-mono text-[#737068] text-center block mt-0.5">
                    Drape &amp; color
                  </span>
                </button>

                {/* 2. Weave Macro */}
                <button
                  type="button"
                  onClick={() => setActiveView('macro')}
                  className={`text-left p-2 rounded-xl border transition-all cursor-pointer group flex flex-col items-center ${
                    activeView === 'macro'
                      ? 'bg-[#FAF4E8] border-[#B8934A] ring-1 ring-[#B8934A]/50 shadow-[0_0_12px_rgba(184,147,74,0.18)]'
                      : 'bg-white border-[#E2DBD0] hover:border-[#B8934A]/70 hover:bg-[#FAF7F2]'
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#DDD5C7] relative mb-1.5 shrink-0 bg-[#ECE7DE]">
                    <img
                      src={displayImage}
                      alt="Weave macro close-up"
                      className="w-full h-full object-cover scale-[2.4] group-hover:scale-[2.6] transition-transform"
                    />
                    {activeView === 'macro' && (
                      <div className="absolute inset-0 bg-[#B8934A]/15 ring-1 ring-inset ring-[#B8934A]" />
                    )}
                  </div>
                  <span className={`text-xs font-serif font-semibold block text-center ${activeView === 'macro' ? 'text-[#142E20]' : 'text-[#55514B]'}`}>
                    Weave Macro
                  </span>
                  <span className="text-[9px] font-mono text-[#737068] text-center block mt-0.5">
                    Yarn structure
                  </span>
                </button>

                {/* 3. Tactile Angle */}
                <button
                  type="button"
                  onClick={() => setActiveView('angle')}
                  className={`text-left p-2 rounded-xl border transition-all cursor-pointer group flex flex-col items-center ${
                    activeView === 'angle'
                      ? 'bg-[#FAF4E8] border-[#B8934A] ring-1 ring-[#B8934A]/50 shadow-[0_0_12px_rgba(184,147,74,0.18)]'
                      : 'bg-white border-[#E2DBD0] hover:border-[#B8934A]/70 hover:bg-[#FAF7F2]'
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#DDD5C7] relative mb-1.5 shrink-0 bg-[#ECE7DE]">
                    <img
                      src={secondaryTextureImage}
                      alt="Tactile angle and fold"
                      className="w-full h-full object-cover scale-110 rotate-6 group-hover:scale-115 transition-transform"
                    />
                    {activeView === 'angle' && (
                      <div className="absolute inset-0 bg-[#B8934A]/15 ring-1 ring-inset ring-[#B8934A]" />
                    )}
                  </div>
                  <span className={`text-xs font-serif font-semibold block text-center ${activeView === 'angle' ? 'text-[#142E20]' : 'text-[#55514B]'}`}>
                    Tactile Angle
                  </span>
                  <span className="text-[9px] font-mono text-[#737068] text-center block mt-0.5">
                    Sheen &amp; fold
                  </span>
                </button>

              </div>
            </div>

            {/* ───────────────────────────────────────────────────────── */}
            {/* 4. MATERIAL HEADING & CONCISE DESCRIPTION                 */}
            {/* ───────────────────────────────────────────────────────── */}
            <div className="space-y-1.5">
              <h3 id="material-detail-title" className="font-serif text-2xl sm:text-3xl font-bold text-[#142E20] tracking-tight">
                {material.name}
              </h3>
              <p className="text-sm text-[#55514B] leading-relaxed">
                {material.description}
              </p>
            </div>

            {/* ───────────────────────────────────────────────────────── */}
            {/* 5. SIMPLIFIED SPECIFICATIONS (Clean 2-Column Layout)      */}
            {/* ───────────────────────────────────────────────────────── */}
            <div className="bg-gradient-to-b from-[#FFFDF9] to-[#FAF7F0] border border-[#E2D8C3] rounded-2xl p-5 space-y-4 shadow-xs">
              
              <div className="grid grid-cols-2 gap-4 text-left">
                {material.composition && (
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8C877E]">
                      COMPOSITION
                    </span>
                    <span className="text-xs sm:text-sm font-serif font-semibold text-[#142E20] mt-0.5 block">
                      {material.composition}
                    </span>
                  </div>
                )}

                {(material.weave || material.pattern) && (
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8C877E]">
                      {material.pattern ? 'PATTERN' : 'WEAVE / TYPE'}
                    </span>
                    <span className="text-xs sm:text-sm font-serif font-semibold text-[#142E20] mt-0.5 block">
                      {material.pattern || material.weave}
                    </span>
                  </div>
                )}

                {material.width && (
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8C877E]">
                      WIDTH / GAUGE
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-medium text-[#142E20] mt-0.5 block">
                      {material.width}
                    </span>
                  </div>
                )}

                {material.gsm && (
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8C877E]">
                      WEIGHT / GSM
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-medium text-[#142E20] mt-0.5 block">
                      {material.gsm}
                    </span>
                  </div>
                )}
              </div>

              {/* Selectable Variant Chips (Clean and Elegant) */}
              {material.variants && material.variants.length > 0 && (
                <div className="pt-3.5 border-t border-[#EFECE5] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C877E]">
                      AVAILABLE QUALITIES &amp; VARIANTS
                    </span>
                    <span className="text-[10px] font-mono text-[#B8934A]">
                      Select preferred
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {material.variants.map((variant) => {
                      const isSelected = selectedVariant === variant;
                      return (
                        <button
                          key={variant}
                          type="button"
                          onClick={() => setSelectedVariant(variant)}
                          className={`text-xs font-sans px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-[#FAF4E8] border-[#B8934A] text-[#142E20] font-semibold ring-1 ring-[#B8934A]/50 shadow-[0_0_8px_rgba(184,147,74,0.18)]'
                              : 'bg-white border-[#DDD6C8] text-[#55514B] hover:border-[#B8934A]/60 hover:text-[#142E20]'
                          }`}
                        >
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#B8934A]" />
                          )}
                          <span>{variant}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ───────────────────────────────────────────────────────── */}
            {/* 6. REFINED SOURCING NOTE: "Looking for a specific variation?" */}
            {/* ───────────────────────────────────────────────────────── */}
            <div className="bg-gradient-to-r from-[#FAF6EE] via-[#F8F3EA] to-[#F5EFE3] border border-[#E2D8C3] rounded-2xl p-4 sm:p-4.5 flex items-start gap-3 shadow-xs">
              <div className="w-2 h-2 border border-[#B8934A] rotate-45 shrink-0 mt-1 shadow-[0_0_6px_rgba(184,147,74,0.3)]" />
              <div className="flex-1 min-w-0">
                <span className="font-serif text-sm font-semibold text-[#142E20] block">
                  Looking for a specific variation?
                </span>
                <p className="text-xs text-[#55514B] mt-0.5 leading-relaxed">
                  Tell us what you need, and we’ll help you explore the available options.
                </p>
                <button
                  type="button"
                  onClick={handleReachUsClick}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#B8934A] hover:text-[#9A7632] mt-2 group cursor-pointer"
                >
                  <span>Need a Specific Variation?</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform text-[#B8934A]" />
                </button>
              </div>
            </div>

          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* BOTTOM ACTION AREA: Clear, Elegant Action Hierarchy         */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="p-5 border-t border-[#E8E0D1] bg-gradient-to-r from-[#FAF7F0] via-[#F7F2E8] to-[#F5EFE4] space-y-3">
            
            {/* Primary Action: Enquire About Material (Forest Green with subtle gold glow) */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={handlePrimaryEnquire}
                className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-xs font-mono font-semibold uppercase tracking-[0.16em] bg-[#142E20] hover:bg-[#1B3B2B] text-[#FAF7F2] rounded-xl border border-[#B8934A]/50 hover:border-[#D4AF37] shadow-[0_4px_16px_rgba(20,46,32,0.12)] hover:shadow-[0_6px_22px_rgba(184,147,74,0.26)] transition-all cursor-pointer active:scale-[0.99]"
              >
                <span>Enquire About Material</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </button>

              {/* Full View (if supported) */}
              {onViewDeepDetails && (
                <button
                  type="button"
                  onClick={() => onViewDeepDetails(material)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3.5 text-xs font-mono font-semibold uppercase tracking-wider bg-white hover:bg-[#FAF7F2] text-[#142E20] border border-[#DDD5C7] hover:border-[#B8934A] rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#B8934A]" />
                  <span>Full View</span>
                </button>
              )}
            </div>

            {/* Secondary Controls: "Need a Specific Variation?" link + "Add to Swatch Inquiry" */}
            <div className="flex items-center justify-between pt-1 text-xs">
              
              {/* Swatch Collection Action */}
              {onAddToCollection && (
                <button
                  type="button"
                  onClick={() => onAddToCollection(material, selectedVariant)}
                  className={`inline-flex items-center gap-1.5 font-mono text-xs font-medium transition-all cursor-pointer px-2 py-1 rounded-md ${
                    isInCollection
                      ? 'text-[#142E20] bg-[#E8F0EC] border border-[#142E20]/20'
                      : 'text-[#55514B] hover:text-[#142E20] hover:bg-white border border-transparent hover:border-[#DDD5C7]'
                  }`}
                >
                  {isInCollection ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#142E20]" />
                      <span>In Swatch Collection</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 text-[#B8934A]" />
                      <span>Add to Swatch Inquiry</span>
                    </>
                  )}
                </button>
              )}

              {/* Secondary Link: Need a Specific Variation? */}
              <button
                type="button"
                onClick={handleReachUsClick}
                className="font-mono text-xs text-[#B8934A] hover:text-[#9A7632] hover:underline transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Need a Specific Variation?</span>
                <ArrowRight className="w-3 h-3 text-[#B8934A]" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
