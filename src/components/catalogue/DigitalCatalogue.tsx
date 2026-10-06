import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Volume2,
  VolumeX,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { ALL_DISCOVERY_MATERIALS, DiscoveryMaterial } from '../../data/catalogueDiscoveryData.ts';
import { flipbookAudio } from '../../utils/audio.ts';

interface DigitalCatalogueProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMaterial: (material: DiscoveryMaterial) => void;
  onEnquire: (material: DiscoveryMaterial) => void;
}

interface PageSpread {
  pageNumber: number;
  title: string;
  subtitle: string;
  description: string;
  materials: DiscoveryMaterial[];
}

export const DigitalCatalogue: React.FC<DigitalCatalogueProps> = ({
  isOpen,
  onClose,
  onSelectMaterial,
  onEnquire,
}) => {
  const [currentPage, setCurrentPage] = useState(0); // 0 to 5 for 6 pages
  const [isAnimating, setIsAnimating] = useState(false);
  const [turnDirection, setTurnDirection] = useState<'forward' | 'backward' | null>(null);
  const [isMuted, setIsMuted] = useState(() => flipbookAudio.getMuted());

  // Touch gesture state
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // The 6 pages requested:
  // Page 1: Fabrics Overview
  // Page 2: Woven Fabrics
  // Page 3: Specialty Fabrics
  // Page 4: Denim & Chambray
  // Page 5: Laces
  // Page 6: Accessories
  const pages: PageSpread[] = [
    {
      pageNumber: 1,
      title: 'Fabrics Overview',
      subtitle: 'The Foundation of Apparel Construction',
      description: 'An authoritative collection of raw textile fabrics engineered for shirting, suiting, outerwear and garment production.',
      materials: ALL_DISCOVERY_MATERIALS.filter((m) => m.category === 'FABRICS').slice(0, 6),
    },
    {
      pageNumber: 2,
      title: 'Woven Fabrics',
      subtitle: 'Plain, Twill, Satin, Drill, Canvas & Duck',
      description: 'Loom-woven base grey and processed cotton textiles with documented yarn counts, reed/pick density and balanced warp-weft construction.',
      materials: ALL_DISCOVERY_MATERIALS.filter((m) => m.subcategory === 'WOVEN FABRICS'),
    },
    {
      pageNumber: 3,
      title: 'Specialty Fabrics',
      subtitle: 'Texture, Slub & Distinct Surface Formations',
      description: 'Specialty textiles including seersucker puckers, brushed flannel, fluid chiffon, plush velvet pile and breathable pure flax linen.',
      materials: ALL_DISCOVERY_MATERIALS.filter((m) => m.subcategory === 'SPECIALTY FABRICS'),
    },
    {
      pageNumber: 4,
      title: 'Denim & Chambray',
      subtitle: 'Indigo Twills & Balanced Shirt Chambray',
      description: 'Raw indigo diagonal twill denim rolls and lightweight yarn-dyed chambray plain weaves for rugged bottom-wear and premium tops.',
      materials: ALL_DISCOVERY_MATERIALS.filter((m) => m.category === 'DENIM & CHAMBRAY'),
    },
    {
      pageNumber: 5,
      title: 'Laces & Trims',
      subtitle: 'Embroidery, Cotton, Lycra, Ric Rac & Imported',
      description: 'High-definition needlework laces, soft pure cotton crochet trims, raschel stretch ribbons and distinctive scalloped borders.',
      materials: ALL_DISCOVERY_MATERIALS.filter((m) => m.category === 'LACES'),
    },
    {
      pageNumber: 6,
      title: 'Garment Accessories',
      subtitle: 'Zippers, Buttons & Tipping Components',
      description: 'Interlocking metal and vislon zippers, natural and cast buttons (brass, pearl, wood, shell), and thermal crimped drawcord tipping.',
      materials: ALL_DISCOVERY_MATERIALS.filter((m) => m.category === 'GARMENT ACCESSORIES').slice(0, 8),
    },
  ];

  const totalPages = pages.length;

  const handleNext = useCallback(() => {
    if (currentPage >= totalPages - 1 || isAnimating) return;
    setIsAnimating(true);
    setTurnDirection('forward');
    flipbookAudio.playPageTurn();

    setTimeout(() => {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
      setIsAnimating(false);
      setTurnDirection(null);
    }, 350);
  }, [currentPage, totalPages, isAnimating]);

  const handlePrev = useCallback(() => {
    if (currentPage <= 0 || isAnimating) return;
    setIsAnimating(true);
    setTurnDirection('backward');
    flipbookAudio.playPageTurn();

    setTimeout(() => {
      setCurrentPage((prev) => Math.max(prev - 1, 0));
      setIsAnimating(false);
      setTurnDirection(null);
    }, 350);
  }, [currentPage, isAnimating]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      handleNext();
    } else if (distance < -50) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!isOpen) return null;

  const activePage = pages[currentPage];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Digital Textile Catalogue"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#141312]/85 backdrop-blur-md animate-in fade-in duration-200"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[820px] bg-[#FAF8F5] rounded-3xl shadow-2xl flex flex-col border border-[#DCD5C8] overflow-hidden">
        {/* Top bar */}
        <div className="px-6 py-4 border-b border-[#E8E2D7] bg-[#F3EFE7] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-1.5 rounded-lg bg-[#E7E0D2] text-[#82553E]">
              <BookOpen className="w-4 h-4" />
            </span>
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-[#181715] uppercase block">
                CLASSIC FASHIONS · DIGITAL CATALOGUE
              </span>
              <span className="text-[11px] text-[#78726A]">
                Page {currentPage + 1} of {totalPages} — {activePage.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMuted(flipbookAudio.toggleMuted())}
              aria-label={isMuted ? 'Unmute paper sound' : 'Mute paper sound'}
              className="p-2 rounded-full text-[#7B756C] hover:text-[#181715] hover:bg-[#E8E2D7] transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Digital Catalogue"
              className="p-2 rounded-full text-[#7B756C] hover:text-[#181715] hover:bg-[#E8E2D7] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Page Content with smooth page turn illusion */}
        <div
          className={`flex-1 overflow-y-auto p-6 sm:p-10 transition-all duration-300 ease-out ${
            isAnimating
              ? turnDirection === 'forward'
                ? 'opacity-40 translate-x-4 scale-[0.99]'
                : 'opacity-40 -translate-x-4 scale-[0.99]'
              : 'opacity-100 translate-x-0 scale-100'
          }`}
        >
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Editorial Page Header */}
            <div className="border-b border-[#EAE3D6] pb-5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#82553E] font-semibold">
                  PAGE 0{currentPage + 1}
                </span>
                <span className="text-[11px] font-mono text-[#8C877E] uppercase">
                  B2B TEXTILE SOURCING ARCHIVE
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#181715]">
                {activePage.title}
              </h2>
              <p className="text-sm font-medium text-[#82553E]">
                {activePage.subtitle}
              </p>
              <p className="text-xs sm:text-sm text-[#6C665C] max-w-2xl leading-relaxed pt-1">
                {activePage.description}
              </p>
            </div>

            {/* Circular Raw Material Grid for This Page */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
              {activePage.materials.map((mat) => (
                <div
                  key={mat.id}
                  onClick={() => onSelectMaterial(mat)}
                  className="group flex flex-col items-center text-center cursor-pointer p-3 rounded-2xl hover:bg-[#F3EFE7] transition-all"
                >
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-[#EAE5DC] border border-[#D5CDBD] shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all">
                    <img
                      src={mat.image}
                      alt={mat.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-serif text-sm sm:text-base font-medium text-[#181715] mt-2 group-hover:text-[#82553E]">
                    {mat.name}
                  </h4>
                  <span className="text-[10px] text-[#7A756D] line-clamp-1 max-w-[130px]">
                    {mat.composition || mat.weave || 'Garment Component'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEnquire(mat);
                    }}
                    className="mt-2 text-[10px] font-mono uppercase text-[#82553E] hover:underline"
                  >
                    Quick Enquire
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Page Navigation Bar */}
        <div className="px-6 py-4 border-t border-[#E8E2D7] bg-[#F7F4EE] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentPage === 0}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors ${
              currentPage === 0
                ? 'text-[#B0A99E] cursor-not-allowed'
                : 'text-[#181715] hover:bg-[#EAE4D8] bg-white border border-[#DDD5C7]'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Page</span>
          </button>

          {/* Page Indicators */}
          <div className="flex items-center gap-1.5">
            {pages.map((p, idx) => (
              <button
                key={p.pageNumber}
                type="button"
                onClick={() => {
                  flipbookAudio.playPageTurn();
                  setCurrentPage(idx);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentPage
                    ? 'w-7 bg-[#82553E]'
                    : 'bg-[#D5CEBF] hover:bg-[#A9A090]'
                }`}
                aria-label={`Jump to page ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors ${
              currentPage === totalPages - 1
                ? 'text-[#B0A99E] cursor-not-allowed'
                : 'bg-[#181715] text-white hover:bg-[#33302B]'
            }`}
          >
            <span>Next Page</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
