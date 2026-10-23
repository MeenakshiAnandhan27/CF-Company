import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  X,
  Search,
  SlidersHorizontal,
  ZoomIn,
  ZoomOut,
  Layers,
  RotateCw,
  Plus,
  Minus,
  Check,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  Grid2X2,
  Maximize2,
  Minimize2,
  Scale,
  MessageSquare,
  Package,
  Filter,
  Image as ImageIcon,
} from 'lucide-react';
import {
  ALL_DISCOVERY_MATERIALS,
  MATERIAL_WALL_ITEMS,
  DiscoveryMaterial,
} from '../../data/catalogueDiscoveryData.ts';
import { FABRIC_PACK_4K } from '../../data/fabricPack4KData.ts';

type WallCategory = 'ALL' | 'FABRICS' | 'DENIM & CHAMBRAY' | 'LACES' | 'GARMENT ACCESSORIES';
type GridSize = 'large' | 'medium' | 'small';

interface MaterialWallStudioProps {
  isOpen: boolean;
  initialMaterial?: DiscoveryMaterial | null;
  onClose: () => void;
  onEnquire: (material: DiscoveryMaterial) => void;
  onAddToSwatchInquiry?: (material: DiscoveryMaterial) => void;
  onOpen360?: (material: DiscoveryMaterial) => void;
}

const CATEGORY_FILTERS: { id: WallCategory; label: string; emoji: string }[] = [
  { id: 'ALL', label: 'All Materials', emoji: '✦' },
  { id: 'FABRICS', label: 'Fabrics', emoji: '🧵' },
  { id: 'DENIM & CHAMBRAY', label: 'Denim & Chambray', emoji: '👖' },
  { id: 'LACES', label: 'Laces & Trims', emoji: '🎀' },
];

/* ── Texture Close-Up Panel with Image Switching & Material Cycling ── */
const TextureCloseUp: React.FC<{
  material: DiscoveryMaterial;
  allMaterials: DiscoveryMaterial[];
  onSelectMaterial: (m: DiscoveryMaterial) => void;
  onClose: () => void;
  onEnquire: (m: DiscoveryMaterial) => void;
  onOpen360?: (m: DiscoveryMaterial) => void;
  onAddToSwatch?: (m: DiscoveryMaterial) => void;
  isInCompare: boolean;
  onToggleCompare: (m: DiscoveryMaterial) => void;
}> = ({
  material,
  allMaterials,
  onSelectMaterial,
  onClose,
  onEnquire,
  onOpen360,
  onAddToSwatch,
  isInCompare,
  onToggleCompare,
}) => {
  const [zoom, setZoom] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  // Find 4K pack match if available for studio / 360 photography
  const fabric4k = useMemo(() => {
    return FABRIC_PACK_4K.find(
      (f) =>
        f.name.toLowerCase() === material.name.toLowerCase() ||
        material.name.toLowerCase().includes(f.name.toLowerCase()) ||
        f.name.toLowerCase().includes(material.name.toLowerCase())
    );
  }, [material]);

  // Aggregate all available material images (Macro Swatch, Texture Surface, 4K Studio, Panoramic View)
  const availableImages = useMemo(() => {
    const list: { label: string; url: string }[] = [
      { label: 'Macro Swatch', url: material.image },
    ];
    if (material.fallbackTexture && material.fallbackTexture !== material.image) {
      list.push({ label: 'Surface Texture', url: material.fallbackTexture });
    }
    if (fabric4k) {
      if (fabric4k.studioImage && fabric4k.studioImage !== material.image) {
        list.push({ label: '4K Studio Master', url: fabric4k.studioImage });
      }
      if (fabric4k.viewer360Image) {
        list.push({ label: 'Wide Atelier Angle', url: fabric4k.viewer360Image });
      }
    }
    return list;
  }, [material, fabric4k]);

  useEffect(() => {
    setZoom(1);
    setActiveImageIndex(0);
  }, [material]);

  // Current material index in list for Previous/Next cycling
  const currentIndex = allMaterials.findIndex((m) => m.id === material.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allMaterials.length - 1;

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (hasPrev) {
      onSelectMaterial(allMaterials[currentIndex - 1]);
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (hasNext) {
      onSelectMaterial(allMaterials[currentIndex + 1]);
    }
  };

  const currentActiveImageUrl = availableImages[activeImageIndex]?.url || material.image;

  return (
    <div
      className="absolute inset-0 z-30 flex flex-col md:flex-row bg-[#FAF8F5]"
      style={{ animation: 'slideUpIn 0.25s ease-out' }}
    >
      {/* ── LEFT: High-Resolution Image Canvas & Zoom Stage ── */}
      <div className="relative flex-1 bg-[#0F0E0C] overflow-hidden min-h-[45vh] md:min-h-0 flex items-center justify-center">
        {/* The Scalable Canvas */}
        <div
          style={{
            transform: `scale(${zoom})`,
            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            cursor: zoom > 1 ? 'zoom-out' : 'zoom-in',
          }}
          onClick={() => setZoom((z) => (z > 1 ? 1 : 2))}
          className="w-full h-full flex items-center justify-center p-4 sm:p-8"
        >
          <img
            ref={imgRef}
            src={currentActiveImageUrl}
            alt={material.name}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-all"
            style={{ maxHeight: '72vh' }}
          />
        </div>

        {/* Previous / Next Material Floating Cycle Arrows */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={!hasPrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-xs flex items-center justify-center border border-white/20 transition-all hover:scale-110 disabled:opacity-20 disabled:pointer-events-none shadow-xl cursor-pointer"
          title="Previous Material"
        >
          <ChevronLeft className="w-5 h-5 text-[#D4AF37]" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={!hasNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-xs flex items-center justify-center border border-white/20 transition-all hover:scale-110 disabled:opacity-20 disabled:pointer-events-none shadow-xl cursor-pointer"
          title="Next Material"
        >
          <ChevronRight className="w-5 h-5 text-[#D4AF37]" />
        </button>

        {/* Top Floating Info Bar */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-full bg-black/70 hover:bg-black text-white text-xs font-mono flex items-center gap-1.5 border border-white/20 shadow-md backdrop-blur-xs transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-[#D4AF37]" />
            <span>Back to Grid</span>
          </button>
          <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-black/60 text-white/70 text-[10px] font-mono border border-white/10">
            {currentIndex + 1} of {allMaterials.length}
          </span>
        </div>

        {/* Top Right Zoom Status Indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <div className="px-3 py-1 bg-black/70 backdrop-blur-xs rounded-full text-[10px] font-mono text-[#D4AF37] border border-white/15">
            {zoom > 1 ? `${zoom}× MACRO ZOOM` : 'CLICK IMAGE TO ZOOM'}
          </div>
        </div>

        {/* Floating Image Angle / View Switcher Bar */}
        {availableImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/75 backdrop-blur-md p-1.5 rounded-full border border-white/20 shadow-2xl z-20">
            <span className="text-[10px] font-mono text-white/50 px-2 uppercase hidden sm:inline">
              VIEWS:
            </span>
            {availableImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setActiveImageIndex(idx);
                  setZoom(1);
                }}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  activeImageIndex === idx
                    ? 'bg-[#D4AF37] text-[#181715] font-bold shadow-md'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {img.label}
              </button>
            ))}
          </div>
        )}

        {/* Zoom In / Out Floating Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 z-20">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(z + 0.5, 3))}
            className="w-9 h-9 bg-black/75 hover:bg-black text-white backdrop-blur-xs rounded-full flex items-center justify-center shadow-lg border border-white/20 transition-all hover:scale-105 cursor-pointer"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4 text-[#D4AF37]" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(z - 0.5, 1))}
            className="w-9 h-9 bg-black/75 hover:bg-black text-white backdrop-blur-xs rounded-full flex items-center justify-center shadow-lg border border-white/20 transition-all hover:scale-105 cursor-pointer"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4 text-[#D4AF37]" />
          </button>
        </div>
      </div>

      {/* ── RIGHT: Technical Specifications, Swatch Inquiry & Direct Actions ── */}
      <div className="w-full md:w-80 lg:w-96 border-l border-[#EAE4D8] bg-[#FAF8F5] flex flex-col overflow-y-auto shrink-0">
        {/* Header */}
        <div className="p-6 border-b border-[#EAE4D8] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#82553E] font-bold">
              {material.category}
            </span>
            {material.productCode && (
              <span className="text-[10px] font-mono text-[#8C877E] px-2 py-0.5 rounded-full bg-[#EFECE5]">
                {material.productCode}
              </span>
            )}
          </div>
          <h3 className="font-serif text-2xl font-medium text-[#181715] leading-snug">
            {material.name}
          </h3>
          <span className="text-xs text-[#736B60] font-sans block">
            {material.subcategory}
          </span>
        </div>

        {/* Body Specifications */}
        <div className="p-6 space-y-5 flex-1">
          <p className="text-xs sm:text-sm text-[#4A4540] leading-relaxed">
            {material.description}
          </p>

          {/* Specifications Table */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#82553E] font-bold">
              Raw Textile Parameters
            </h4>
            <div className="bg-[#F4F0E8] rounded-xl p-4 space-y-2 border border-[#E6DFD3] text-xs">
              {material.composition && (
                <div className="flex justify-between">
                  <span className="text-[#6C665C]">Composition</span>
                  <span className="text-[#181715] font-mono font-medium truncate max-w-[180px]">
                    {material.composition}
                  </span>
                </div>
              )}
              {material.weave && (
                <div className="flex justify-between">
                  <span className="text-[#6C665C]">Weave</span>
                  <span className="text-[#181715] font-mono font-medium truncate max-w-[180px]">
                    {material.weave}
                  </span>
                </div>
              )}
              {material.gsm && (
                <div className="flex justify-between">
                  <span className="text-[#6C665C]">Weight / GSM</span>
                  <span className="text-[#181715] font-mono font-medium">{material.gsm}</span>
                </div>
              )}
              {material.width && (
                <div className="flex justify-between">
                  <span className="text-[#6C665C]">Usable Width</span>
                  <span className="text-[#181715] font-mono font-medium">{material.width}</span>
                </div>
              )}
              {material.pattern && (
                <div className="flex justify-between">
                  <span className="text-[#6C665C]">Pattern</span>
                  <span className="text-[#181715] font-mono font-medium">{material.pattern}</span>
                </div>
              )}
            </div>
          </div>

          {/* Available Variants */}
          {material.variants && material.variants.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#82553E] font-bold">
                Available Variations & Lab-Dips
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {material.variants.map((v, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono px-2.5 py-1 bg-white border border-[#DDD5C7] rounded-full text-[#4A4540]"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Actions Footer ── */}
        <div className="p-5 border-t border-[#EAE4D8] space-y-2.5 bg-[#FAF7F2]">
          {/* Primary: Enquire About This Material */}
          <button
            type="button"
            onClick={() => onEnquire(material)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#181715] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl hover:bg-[#2E2B26] transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
            <span>Enquire About This Material</span>
          </button>

          {/* Secondary: Add to Swatch Inquiry */}
          {onAddToSwatch && (
            <button
              type="button"
              onClick={() => onAddToSwatch(material)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F4F0E8] text-[#181715] text-xs font-mono font-semibold uppercase tracking-wider rounded-xl hover:bg-[#EAE4D8] transition-colors border border-[#DDD5C7] cursor-pointer"
            >
              <Package className="w-4 h-4 text-[#82553E]" />
              <span>Add to Swatch Inquiry</span>
            </button>
          )}

          {/* Tertiary: Compare Material (up to 3) */}
          <button
            type="button"
            onClick={() => onToggleCompare(material)}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-mono font-semibold uppercase tracking-wider rounded-xl transition-colors border cursor-pointer ${
              isInCompare
                ? 'bg-[#82553E] text-white border-[#82553E]'
                : 'bg-white text-[#4A4540] border-[#DDD5C7] hover:border-[#82553E]'
            }`}
          >
            {isInCompare ? <Check className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />}
            <span>{isInCompare ? 'Added to Compare' : 'Compare Material'}</span>
          </button>

          {/* 360° Studio inspection trigger */}
          {onOpen360 && (material.category === 'FABRICS' || material.category === 'DENIM & CHAMBRAY') && (
            <button
              type="button"
              onClick={() => onOpen360(material)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-xl bg-gradient-to-r from-[#181715] to-[#2E2519] text-[#FAF8F5] border border-[#D4AF37] hover:border-[#F2D785] transition-all shadow-xs cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Inspect in 360° Turntable</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Compare Side-by-Side Panel (Max 3 Materials) ── */
const ComparePanel: React.FC<{
  materials: DiscoveryMaterial[];
  onRemove: (id: string) => void;
  onEnquire: (m: DiscoveryMaterial) => void;
  onClose: () => void;
}> = ({ materials, onRemove, onEnquire, onClose }) => {
  const specs = ['composition', 'weave', 'gsm', 'width', 'pattern'] as const;
  const specLabels: Record<string, string> = {
    composition: 'Composition',
    weave: 'Weave Structure',
    gsm: 'GSM / Weight',
    width: 'Usable Width',
    pattern: 'Pattern / Motif',
  };

  return (
    <div
      className="absolute inset-0 z-30 bg-[#FAF8F5] flex flex-col overflow-hidden"
      style={{ animation: 'slideUpIn 0.25s ease-out' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE4D8] bg-[#F4F0E8] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#82553E] text-white flex items-center justify-center shadow-xs">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <span className="font-serif text-lg font-medium text-[#181715]">
              Side-by-Side Material Comparison
            </span>
            <span className="text-xs text-[#6C665C] ml-2 font-mono">
              ({materials.length} of 3 selected)
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full hover:bg-[#EAE4D8] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 text-[#181715]" />
        </button>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-auto">
        <div className="min-w-[640px] p-6 sm:p-8">
          {/* Material columns */}
          <div
            className="grid gap-4 sm:gap-6"
            style={{ gridTemplateColumns: `140px repeat(${materials.length}, 1fr)` }}
          >
            {/* Row 1: Images & Titles */}
            <div />
            {materials.map((m) => (
              <div key={m.id} className="text-center space-y-3 bg-white p-4 rounded-2xl border border-[#DDD5C7] shadow-xs">
                <div className="relative inline-block">
                  <div className="w-28 h-28 rounded-xl overflow-hidden border border-[#DDD5C7] mx-auto shadow-sm">
                    <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(m.id)}
                    className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-[#181715] rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
                    title="Remove from compare"
                  >
                    <X className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
                <div>
                  <p className="font-serif text-base font-medium text-[#181715] leading-tight">{m.name}</p>
                  <p className="text-[10px] font-mono text-[#8C877E] uppercase mt-0.5">{m.subcategory}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onEnquire(m)}
                  className="text-[10px] font-mono uppercase tracking-wider text-white bg-[#181715] hover:bg-[#82553E] px-4 py-2 rounded-full transition-colors w-full font-bold shadow-xs cursor-pointer"
                >
                  Enquire Material
                </button>
              </div>
            ))}

            {/* Spec rows */}
            {specs.map((spec) => {
              const hasAnyValue = materials.some((m) => m[spec]);
              if (!hasAnyValue) return null;
              return (
                <React.Fragment key={spec}>
                  <div className="flex items-center">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#6C665C] font-semibold">
                      {specLabels[spec]}
                    </span>
                  </div>
                  {materials.map((m) => (
                    <div
                      key={m.id}
                      className="bg-[#F4F0E8] rounded-xl px-4 py-3 text-center border border-[#E6DFD3]"
                    >
                      <span className="text-xs font-mono text-[#181715] font-medium">
                        {m[spec] || <span className="text-[#B0A99E]">—</span>}
                      </span>
                    </div>
                  ))}
                </React.Fragment>
              );
            })}

            {/* Category row */}
            <div className="flex items-center">
              <span className="text-xs font-mono uppercase tracking-wider text-[#6C665C] font-semibold">
                Category
              </span>
            </div>
            {materials.map((m) => (
              <div key={m.id} className="bg-[#F4F0E8] rounded-xl px-4 py-3 text-center border border-[#E6DFD3]">
                <span className="text-[11px] font-mono uppercase text-[#82553E] font-bold">{m.category}</span>
              </div>
            ))}

            {/* Description row */}
            <div className="flex items-start pt-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#6C665C] font-semibold">
                Description
              </span>
            </div>
            {materials.map((m) => (
              <div key={m.id} className="bg-[#F4F0E8] rounded-xl p-4 border border-[#E6DFD3]">
                <p className="text-xs text-[#4A4540] leading-relaxed line-clamp-4">{m.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main Material Wall Studio ── */
export const MaterialWallStudio: React.FC<MaterialWallStudioProps> = ({
  isOpen,
  initialMaterial,
  onClose,
  onEnquire,
  onAddToSwatchInquiry,
  onOpen360,
}) => {
  const [activeCategory, setActiveCategory] = useState<WallCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [gridSize, setGridSize] = useState<GridSize>('medium');
  const [selectedMaterial, setSelectedMaterial] = useState<DiscoveryMaterial | null>(null);
  const [compareMaterials, setCompareMaterials] = useState<DiscoveryMaterial[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [swatchAdded, setSwatchAdded] = useState<string | null>(null);

  // Combine MATERIAL_WALL_ITEMS + ALL_DISCOVERY_MATERIALS, deduplicated
  const allMaterials = useMemo(() => {
    const seen = new Set<string>();
    const combined: DiscoveryMaterial[] = [];
    [...MATERIAL_WALL_ITEMS, ...ALL_DISCOVERY_MATERIALS].forEach((m) => {
      if (!seen.has(m.id)) {
        seen.add(m.id);
        combined.push(m);
      }
    });
    return combined;
  }, []);

  // Filtered materials
  const filteredMaterials = useMemo(() => {
    let result = allMaterials;

    if (activeCategory !== 'ALL') {
      result = result.filter(
        (m) => m.category === activeCategory || m.category === activeCategory.replace('&', '&')
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.subcategory.toLowerCase().includes(q) ||
          (m.composition && m.composition.toLowerCase().includes(q)) ||
          (m.weave && m.weave.toLowerCase().includes(q)) ||
          (m.productCode && m.productCode.toLowerCase().includes(q))
      );
    }

    return result;
  }, [allMaterials, activeCategory, searchQuery]);

  // Sync initialMaterial when opened
  useEffect(() => {
    if (isOpen) {
      if (initialMaterial) {
        setSelectedMaterial(initialMaterial);
      }
    } else {
      setSelectedMaterial(null);
      setShowCompare(false);
    }
  }, [isOpen, initialMaterial]);

  const handleToggleCompare = useCallback(
    (material: DiscoveryMaterial) => {
      setCompareMaterials((prev) => {
        const exists = prev.find((m) => m.id === material.id);
        if (exists) return prev.filter((m) => m.id !== material.id);
        if (prev.length >= 3) return prev; // max 3
        return [...prev, material];
      });
    },
    []
  );

  const handleAddToSwatch = useCallback(
    (material: DiscoveryMaterial) => {
      if (onAddToSwatchInquiry) {
        onAddToSwatchInquiry(material);
      }
      setSwatchAdded(material.id);
      setTimeout(() => setSwatchAdded(null), 2000);
    },
    [onAddToSwatchInquiry]
  );

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showCompare) setShowCompare(false);
        else if (selectedMaterial) setSelectedMaterial(null);
        else onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, showCompare, selectedMaterial, onClose]);

  // Lock scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const gridColsClass =
    gridSize === 'large'
      ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4'
      : gridSize === 'medium'
      ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'
      : 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10';

  const imageSize =
    gridSize === 'large'
      ? 'h-48 sm:h-56'
      : gridSize === 'medium'
      ? 'h-32 sm:h-36'
      : 'h-20 sm:h-24';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Material Wall Studio"
      className="fixed inset-0 z-50 bg-[#0F0E0C]/90 backdrop-blur-sm flex items-stretch justify-stretch select-none"
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      <div className="relative flex-1 flex flex-col bg-[#FAF8F5] overflow-hidden">
        {/* ── TOP HEADER ── */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#EAE4D8] bg-[#F4F0E8] shrink-0 gap-3">
          {/* Left: Brand Heraldry */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#181715] flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <span className="font-serif text-base font-semibold text-[#181715] block leading-tight">
                The Material Wall
              </span>
              <span className="text-[10px] font-mono text-[#82553E] uppercase tracking-wider font-semibold">
                Visual Material Exploration Studio
              </span>
            </div>
            <span className="hidden sm:flex items-center px-2.5 py-0.5 bg-[#EAE4D8] rounded-full text-[10px] font-mono text-[#6C665C] uppercase tracking-wider shrink-0">
              {filteredMaterials.length} Materials
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Compare trigger button */}
            {compareMaterials.length > 0 && (
              <button
                type="button"
                onClick={() => setShowCompare(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#82553E] text-white rounded-full text-xs font-mono font-semibold hover:bg-[#6e4632] transition-colors cursor-pointer shadow-xs"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare ({compareMaterials.length})</span>
              </button>
            )}

            {/* Grid density toggles */}
            <div className="hidden md:flex items-center gap-1 bg-white border border-[#DDD5C7] rounded-full p-0.5">
              {(['large', 'medium', 'small'] as GridSize[]).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setGridSize(size)}
                  title={`${size} grid`}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                    gridSize === size ? 'bg-[#181715] text-white' : 'text-[#6C665C] hover:text-[#181715]'
                  }`}
                >
                  {size === 'large' ? (
                    <Grid2X2 className="w-3.5 h-3.5" />
                  ) : size === 'medium' ? (
                    <Grid3X3 className="w-3.5 h-3.5" />
                  ) : (
                    <Filter className="w-3.5 h-3.5" />
                  )}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#EAE4D8] transition-colors cursor-pointer"
              aria-label="Close Material Wall"
            >
              <X className="w-5 h-5 text-[#181715]" />
            </button>
          </div>
        </header>

        {/* ── FILTER & SEARCH BAR ── */}
        <div className="border-b border-[#EAE4D8] bg-[#FAF8F5] px-4 sm:px-6 py-2.5 flex items-center gap-3 shrink-0 overflow-x-auto no-scrollbar">
          {/* Quick Search */}
          <div className="relative shrink-0 w-52 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C877E] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search raw textures, yarns..."
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-[#DDD5C7] rounded-full text-[#181715] placeholder-[#A39C91] focus:outline-none focus:border-[#82553E] focus:ring-1 focus:ring-[#82553E] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C877E] hover:text-[#181715]"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id as WallCategory)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#181715] text-white shadow-xs'
                    : 'bg-white border border-[#DDD5C7] text-[#6A645A] hover:text-[#181715] hover:bg-[#EFECE5]'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── COMPARE ACTIVE TRAY ── */}
        {compareMaterials.length > 0 && (
          <div className="bg-[#FDF9F2] border-b border-[#E8E0CE] px-4 sm:px-6 py-2 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <Scale className="w-3.5 h-3.5 text-[#82553E]" />
              <span className="text-xs text-[#4A4540]">
                Comparing <strong className="text-[#181715]">{compareMaterials.length}/3</strong> materials:
              </span>
              <div className="flex items-center gap-1.5">
                {compareMaterials.map((m) => (
                  <div key={m.id} className="flex items-center gap-1 bg-white border border-[#DDD5C7] rounded-full px-2 py-0.5">
                    <span className="text-[10px] text-[#181715] font-medium">{m.name}</span>
                    <button
                      type="button"
                      onClick={() => handleToggleCompare(m)}
                      className="text-[#8C877E] hover:text-red-500 transition-colors ml-0.5"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowCompare(true)}
              className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#82553E] hover:text-[#6e4632] transition-colors whitespace-nowrap cursor-pointer"
            >
              <span>View Side by Side</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ── MAIN MATERIAL GRID ── */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 relative">
          {filteredMaterials.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Search className="w-10 h-10 text-[#C5BDB2] mb-3" />
              <p className="font-serif text-lg text-[#181715]">No materials found</p>
              <p className="text-xs text-[#7A746B] mt-1">Try adjusting your search query or category filter.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('ALL');
                }}
                className="mt-4 text-xs font-semibold text-[#82553E] hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className={`grid ${gridColsClass} gap-3 sm:gap-4`}>
              {filteredMaterials.map((material) => {
                const isCompared = compareMaterials.some((m) => m.id === material.id);
                const isSwatchJustAdded = swatchAdded === material.id;

                return (
                  <div
                    key={material.id}
                    className="group relative bg-white border border-[#EAE4D8] rounded-2xl overflow-hidden hover:border-[#C5A07A] hover:shadow-lg transition-all duration-200"
                  >
                    {/* Material Image Tile */}
                    <button
                      type="button"
                      className={`block w-full ${imageSize} relative overflow-hidden cursor-zoom-in`}
                      onClick={() => setSelectedMaterial(material)}
                      title={`Inspect ${material.name} Texture Close-Up`}
                    >
                      <img
                        src={material.image}
                        alt={material.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-[#181715]/0 group-hover:bg-[#181715]/30 transition-colors duration-300 flex items-center justify-center">
                        <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      {/* Category Tag */}
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-[9px] font-mono uppercase tracking-wider text-[#82553E] font-semibold">
                        {material.category === 'GARMENT ACCESSORIES'
                          ? 'ACCESSORIES'
                          : material.category === 'DENIM & CHAMBRAY'
                          ? 'DENIM'
                          : material.category}
                      </div>
                    </button>

                    {/* Quick Compare Plus Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleCompare(material)}
                      title={isCompared ? 'Remove from compare' : 'Add to compare (max 3)'}
                      disabled={!isCompared && compareMaterials.length >= 3}
                      className={`absolute top-2 right-2 w-6 h-6 rounded-full border flex items-center justify-center text-[10px] transition-all cursor-pointer ${
                        isCompared
                          ? 'bg-[#82553E] border-[#82553E] text-white opacity-100'
                          : 'bg-white border-[#DDD5C7] text-[#6C665C] opacity-0 group-hover:opacity-100 hover:border-[#82553E] hover:text-[#82553E] disabled:opacity-30 disabled:cursor-not-allowed'
                      }`}
                    >
                      {isCompared ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    </button>

                    {/* Material Info Footer */}
                    <div className="p-2.5 space-y-2">
                      <div>
                        <p
                          className={`font-serif font-medium text-[#181715] leading-tight ${
                            gridSize === 'small' ? 'text-[10px]' : 'text-xs sm:text-sm'
                          }`}
                        >
                          {material.name}
                        </p>
                        {gridSize !== 'small' && (
                          <p className="text-[10px] font-mono text-[#8C877E] uppercase mt-0.5 line-clamp-1">
                            {material.subcategory}
                          </p>
                        )}
                      </div>

                      {gridSize === 'large' && (
                        <p className="text-[11px] text-[#6C665C] line-clamp-2 leading-relaxed">
                          {material.description}
                        </p>
                      )}

                      {/* Action Buttons */}
                      <div className={`flex gap-1.5 ${gridSize === 'small' ? 'hidden' : ''}`}>
                        <button
                          type="button"
                          onClick={() => handleAddToSwatch(material)}
                          title="Add to Swatch Inquiry"
                          className={`flex-1 py-1 text-[9px] font-mono uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                            isSwatchJustAdded
                              ? 'bg-green-600 text-white'
                              : 'bg-[#F4F0E8] text-[#6C665C] hover:bg-[#EAE4D8] hover:text-[#181715]'
                          }`}
                        >
                          {isSwatchJustAdded ? '✓ Added' : 'Swatch'}
                        </button>
                        <button
                          type="button"
                          onClick={() => onEnquire(material)}
                          title="Enquire about this material"
                          className="flex-1 py-1 text-[9px] font-mono uppercase tracking-wider rounded-full bg-[#181715] text-white hover:bg-[#82553E] transition-colors cursor-pointer"
                        >
                          Enquire
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Texture Close-Up Overlay */}
          {selectedMaterial && (
            <TextureCloseUp
              material={selectedMaterial}
              allMaterials={filteredMaterials}
              onSelectMaterial={(m) => setSelectedMaterial(m)}
              onClose={() => setSelectedMaterial(null)}
              onEnquire={(m) => {
                onEnquire(m);
                setSelectedMaterial(null);
              }}
              onOpen360={onOpen360}
              onAddToSwatch={handleAddToSwatch}
              isInCompare={compareMaterials.some((m) => m.id === selectedMaterial.id)}
              onToggleCompare={handleToggleCompare}
            />
          )}

          {/* Compare Panel Overlay */}
          {showCompare && (
            <ComparePanel
              materials={compareMaterials}
              onRemove={(id) => setCompareMaterials((prev) => prev.filter((m) => m.id !== id))}
              onEnquire={(m) => {
                onEnquire(m);
                setShowCompare(false);
              }}
              onClose={() => setShowCompare(false)}
            />
          )}
        </div>

        {/* ── FOOTER STATUS BAR ── */}
        <footer className="border-t border-[#EAE4D8] bg-[#F4F0E8] px-4 sm:px-6 py-2 flex items-center justify-between shrink-0">
          <span className="text-[10px] font-mono text-[#6C665C] uppercase tracking-wider">
            {filteredMaterials.length} materials · Select any tile to inspect texture · Compare up to 3 side-by-side
          </span>
          {compareMaterials.length > 0 && (
            <button
              type="button"
              onClick={() => setCompareMaterials([])}
              className="text-[10px] font-mono text-[#8C877E] hover:text-red-500 transition-colors uppercase tracking-wider cursor-pointer"
            >
              Clear comparison
            </button>
          )}
        </footer>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUpIn { from { transform: translateY(12px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
    </div>
  );
};
