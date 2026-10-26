import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ProductCategory } from '../types.ts';
import { RAW_MATERIAL_IMAGES } from '../data/materialImages.ts';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { DiamondMotif } from './DiamondMotif.tsx';

interface ShowcaseCategoryItem {
  id: string;
  name: string;
  shortDescriptor: string;
  categoryKey: ProductCategory;
  image: string;
  altText: string;
  objectPosition?: string;
}

const MATERIAL_SHOWCASE_ITEMS: ShowcaseCategoryItem[] = [
  {
    id: 'fabrics',
    name: 'FABRICS',
    shortDescriptor: 'Woven cotton & gada cloth',
    categoryKey: 'fabrics',
    image: RAW_MATERIAL_IMAGES.fabrics?.imagePath || '/assets/materials/homepage/fabrics.jpg',
    altText: 'Raw folded cotton twill and woven fabric rolls showing textile weave structure',
    objectPosition: 'center',
  },
  {
    id: 'laces',
    name: 'LACES',
    shortDescriptor: 'Garment lace varieties',
    categoryKey: 'laces',
    image: RAW_MATERIAL_IMAGES.laces?.imagePath || '/assets/materials/homepage/laces.jpg',
    altText: 'Close-up macro of raw cotton lace rolls and embroidery needlework',
    objectPosition: 'center',
  },
  {
    id: 'denim',
    name: 'DENIM',
    shortDescriptor: 'Raw denim materials',
    categoryKey: 'denim',
    image: RAW_MATERIAL_IMAGES.denim?.imagePath || '/assets/materials/homepage/denim.jpg',
    altText: 'Close-up texture of raw indigo denim fabric with diagonal twill weave',
    objectPosition: 'center',
  },
  {
    id: 'chambray',
    name: 'CHAMBRAY',
    shortDescriptor: 'Lightweight indigo plain weave',
    categoryKey: 'chambray',
    image: RAW_MATERIAL_IMAGES.chambray?.imagePath || '/assets/catalogue-3d/chambray.jpg',
    altText: 'Close-up texture of yarn-dyed plain weave chambray shirting fabric',
    objectPosition: 'center',
  },
  {
    id: 'mesh',
    name: 'MESH',
    shortDescriptor: 'Breathable athletic mesh',
    categoryKey: 'mesh',
    image: RAW_MATERIAL_IMAGES.mesh?.imagePath || '/assets/materials/homepage/mesh.jpg',
    altText: 'Close-up showing the open-pore cell structure of raw athletic mesh fabric',
    objectPosition: 'center',
  },
  {
    id: 'lycra-mesh',
    name: 'LYCRA / LYCRA MESH',
    shortDescriptor: '4-way power stretch textiles',
    categoryKey: 'lycra-mesh',
    image: RAW_MATERIAL_IMAGES['lycra-mesh']?.imagePath || '/assets/materials/homepage/lycra-mesh.jpg',
    altText: 'Close-up of elastic 4-way stretch power lycra mesh fabric',
    objectPosition: 'center',
  },
  {
    id: 'tapes',
    name: 'TAPES',
    shortDescriptor: 'Cotton twill & binding reels',
    categoryKey: 'tapes',
    image: RAW_MATERIAL_IMAGES.tapes?.imagePath || '/assets/materials/homepage/tapes.jpg',
    altText: 'Rolls of physical garment twill tape and woven ribbon reels',
    objectPosition: 'center',
  },
  {
    id: 'zippers',
    name: 'ZIPPERS',
    shortDescriptor: 'Continuous coils & metal teeth',
    categoryKey: 'zippers',
    image: RAW_MATERIAL_IMAGES.zippers?.imagePath || '/assets/materials/homepage/zippers.jpg',
    altText: 'Close-up of raw zipper components, brass teeth, and continuous zipper tape',
    objectPosition: 'center 40%',
  },
  {
    id: 'buttons',
    name: 'BUTTONS',
    shortDescriptor: 'Loose resin, horn & shank',
    categoryKey: 'buttons',
    image: RAW_MATERIAL_IMAGES.buttons?.imagePath || '/assets/materials/homepage/buttons.jpg',
    altText: 'Collection of loose natural and apparel buttons for garment manufacturing',
    objectPosition: 'center',
  },
  {
    id: 'tags',
    name: 'BRAND TAGS',
    shortDescriptor: 'Woven damask & printed tags',
    categoryKey: 'tags',
    image: RAW_MATERIAL_IMAGES.tags?.imagePath || '/assets/materials/homepage/brand-tags.jpg',
    altText: 'Physical stack of garment hang tags and woven brand labels',
    objectPosition: 'center',
  },
  {
    id: 'accessories',
    name: 'GARMENT ACCESSORIES',
    shortDescriptor: 'Physical trims, cords & sundries',
    categoryKey: 'accessories',
    image: RAW_MATERIAL_IMAGES.accessories?.imagePath || '/assets/materials/homepage/garment-accessories.jpg',
    altText: 'Neat arrangement of physical garment accessories, loose trims, and sundries',
    objectPosition: 'center',
  },
];

interface CategoryCardsProps {
  onSelectCategory: (category: ProductCategory | string) => void;
  onExploreCatalogue?: () => void;
}

export const CategoryCards: React.FC<CategoryCardsProps> = ({
  onSelectCategory,
  onExploreCatalogue,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Mouse drag-to-scroll state
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Check scroll position to enable/disable arrow buttons
  const checkScrollBounds = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScrollBounds();
    el.addEventListener('scroll', checkScrollBounds, { passive: true });
    window.addEventListener('resize', checkScrollBounds);
    return () => {
      el.removeEventListener('scroll', checkScrollBounds);
      window.removeEventListener('resize', checkScrollBounds);
    };
  }, [checkScrollBounds]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = Math.max(280, Math.floor(el.clientWidth * 0.65));
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Drag handlers for desktop mouse interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setIsMouseDown(true);
    setIsDragging(false);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeftState(el.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown) return;
    const el = scrollContainerRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.4; // Scroll multiplier
    if (Math.abs(walk) > 5) {
      setIsDragging(true);
    }
    el.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setTimeout(() => setIsDragging(false), 50);
  };

  const handleItemClick = (cat: ShowcaseCategoryItem) => {
    if (isDragging) return;
    onSelectCategory(cat.categoryKey);
  };

  const scrollShelf = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-8 sm:py-10 md:py-12 bg-[#FAF7F2] border-b border-[#E6E0D2] select-none scroll-mt-20 overflow-hidden">
      {/* Subtle Warm Micro-Dot Atmosphere */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-35"
        style={{
          backgroundImage: 'radial-gradient(rgba(212, 175, 55, 0.2) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative w-full px-3 sm:px-4 md:px-6 lg:px-8">
        
        {/* ======================================================== */}
        {/* SECTION HEADER — REFINED COMPACT EDITORIAL */}
        {/* ======================================================== */}
        <div className="relative mb-6 sm:mb-8 pb-4 border-b border-[#E6E0D2] flex flex-col items-center text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#181715] tracking-tight">
              MATERIALS FOR EVERY CREATION
            </h2>
            {/* Elegant Golden Motif Line Centered */}
            <DiamondMotif align="center" maxWidth="max-w-sm" />
            <p className="text-xs sm:text-sm md:text-base text-[#585550] max-w-2xl mx-auto font-normal leading-relaxed pt-1 text-pretty">
              Explore fabrics, laces, and garment accessories — sourced and manufactured to match your exact requirements.
            </p>
          </div>
          {/* Shelf Scroll Navigation Buttons (Absolute Right on Desktop for Balance) */}
          <div className="hidden sm:flex absolute right-0 bottom-4 items-center gap-2 shrink-0">
            <button
              onClick={() => scrollShelf('left')}
              className="w-9 h-9 rounded-full border border-[#D5D0C6] hover:border-[#181715] bg-white hover:bg-[#181715] text-[#181715] hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
              disabled={!canScrollLeft}
              aria-label="Scroll materials left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollShelf('right')}
              className="w-9 h-9 rounded-full border border-[#D5D0C6] hover:border-[#181715] bg-white hover:bg-[#181715] text-[#181715] hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
              disabled={!canScrollRight}
              aria-label="Scroll materials right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* HORIZONTAL MATERIAL SHOWCASE SHELF */}
        {/* No white gradient shades — 100% clear edge-to-edge view */}
        {/* ======================================================== */}
        <div className="relative w-full">
          <div
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`flex items-start gap-4 sm:gap-6 md:gap-7 lg:gap-8 overflow-x-auto pb-4 pt-1 px-1 scroll-smooth scrollbar-none no-scrollbar ${
              isMouseDown ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {MATERIAL_SHOWCASE_ITEMS.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectCategory(item.categoryKey);
                  }
                }}
                role="button"
                tabIndex={0}
                className="group flex flex-col items-center text-center flex-shrink-0 w-32 sm:w-36 md:w-40 lg:w-44 cursor-pointer focus:outline-none"
              >
                {/* 1. REFINED CIRCULAR RAW MATERIAL CONTAINER (Compact & Balanced) */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full p-1 bg-white border border-[#E0D9CE] group-hover:border-[#82553E] shadow-[0_4px_16px_rgba(0,0,0,0.04)] group-hover:shadow-[0_12px_28px_rgba(130,85,62,0.18)] group-hover:ring-4 group-hover:ring-[#82553E]/15 transition-all duration-500 ease-out mb-3">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#ECE8E1] relative">
                    <img
                      src={item.image}
                      alt={item.altText}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      style={{ objectPosition: item.objectPosition || 'center' }}
                      loading="lazy"
                    />

                    {/* Subtle internal ring gradient for tangible depth */}
                    <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/10 pointer-events-none" />

                    {/* Soft hover illumination sheen */}
                    <div className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                </div>

                {/* 2. CATEGORY NAME UNDERNEATH */}
                <h3 className="font-serif font-bold text-xs sm:text-sm md:text-base text-[#181715] tracking-tight group-hover:text-[#82553E] transition-colors leading-snug">
                  {item.name}
                </h3>

                {/* 3. VERY SHORT DESCRIPTOR */}
                <p className="text-[10px] sm:text-xs text-[#736F68] mt-0.5 line-clamp-1 max-w-[150px]">
                  {item.shortDescriptor}
                </p>

                {/* 4. HOVER INTERACTIVE CUE ("VIEW SPEC →") */}
                <div className="mt-1.5 flex items-center gap-1 font-mono text-[10px] sm:text-[11px] font-semibold text-[#82553E] opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                  <span>VIEW SPEC</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            ))}
          </div>
        </div>



      </div>
    </section>
  );
};
