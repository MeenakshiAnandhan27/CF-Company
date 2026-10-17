import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Volume2,
  VolumeX,
  MessageSquare,
  CornerDownRight,
} from 'lucide-react';
import { ALL_DISCOVERY_MATERIALS, DiscoveryMaterial } from '../../data/catalogueDiscoveryData.ts';
import { flipbookAudio } from '../../utils/audio.ts';

interface DigitalCatalogueProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called when user clicks "Enquire About This Material" — goes directly to enquiry modal */
  onEnquire: (material: DiscoveryMaterial) => void;
}

interface CatalogPage {
  pageNumber: number;
  chapterLabel: string;
  title: string;
  subtitle: string;
  description: string;
  materials: DiscoveryMaterial[];
  accentColor: string;
  accentBg: string;
}

/** Cover page special flag */
const IS_COVER = 'COVER';

export const DigitalCatalogue: React.FC<DigitalCatalogueProps> = ({
  isOpen,
  onClose,
  onEnquire,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [prevPage, setPrevPage] = useState<number | null>(null);
  const [animDir, setAnimDir] = useState<'forward' | 'backward' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMuted, setIsMuted] = useState(() => flipbookAudio.getMuted());
  const [enquiredId, setEnquiredId] = useState<string | null>(null);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  /* ─── Page Data ─── */
  const pages: (CatalogPage | { type: typeof IS_COVER })[] = [
    // Cover Page
    { type: IS_COVER },

    // Page 1 — Fabrics Overview
    {
      pageNumber: 1,
      chapterLabel: 'Chapter I',
      title: 'Fabrics Overview',
      subtitle: 'The Foundation of Apparel Construction',
      description:
        'An authoritative collection of raw textile fabrics engineered for shirting, suiting, outerwear and garment production across woven, specialty, mesh and pattern families.',
      materials: ALL_DISCOVERY_MATERIALS.filter((m) => m.category === 'FABRICS').slice(0, 6),
      accentColor: '#82553E',
      accentBg: '#F7F2EB',
    },

    // Page 2 — Woven Fabrics
    {
      pageNumber: 2,
      chapterLabel: 'Chapter I · Section A',
      title: 'Woven Fabrics',
      subtitle: 'Plain, Twill, Satin, Drill, Canvas & Duck',
      description:
        'Loom-woven base grey and processed cotton textiles with documented yarn counts, reed/pick density and balanced warp-weft construction.',
      materials: ALL_DISCOVERY_MATERIALS.filter((m) => m.subcategory === 'WOVEN FABRICS'),
      accentColor: '#5E4A32',
      accentBg: '#F3EDE4',
    },

    // Page 3 — Specialty Fabrics
    {
      pageNumber: 3,
      chapterLabel: 'Chapter I · Section B',
      title: 'Specialty Fabrics',
      subtitle: 'Texture, Slub & Distinct Surface Formations',
      description:
        'Specialty textiles including seersucker puckers, brushed flannel, fluid chiffon, plush velvet pile and breathable pure flax linen.',
      materials: ALL_DISCOVERY_MATERIALS.filter((m) => m.subcategory === 'SPECIALTY FABRICS'),
      accentColor: '#6B4C38',
      accentBg: '#F4EDE6',
    },

    // Page 4 — Denim & Chambray
    {
      pageNumber: 4,
      chapterLabel: 'Chapter II',
      title: 'Denim & Chambray',
      subtitle: 'Indigo Twills & Balanced Shirt Chambray',
      description:
        'Raw indigo diagonal twill denim rolls and lightweight yarn-dyed chambray plain weaves for rugged bottom-wear and premium tops.',
      materials: ALL_DISCOVERY_MATERIALS.filter((m) => m.category === 'DENIM & CHAMBRAY'),
      accentColor: '#2C4A6E',
      accentBg: '#EBF0F7',
    },

    // Page 5 — Laces & Trims
    {
      pageNumber: 5,
      chapterLabel: 'Chapter III',
      title: 'Laces & Trims',
      subtitle: 'Embroidery, Cotton, Lycra, Ric Rac & Imported',
      description:
        'High-definition needlework laces, soft pure cotton crochet trims, raschel stretch ribbons and distinctive scalloped borders for garment finishing.',
      materials: ALL_DISCOVERY_MATERIALS.filter((m) => m.category === 'LACES'),
      accentColor: '#7A4A5E',
      accentBg: '#F5EDF2',
    },

    // Page 6 — Accessories
    {
      pageNumber: 6,
      chapterLabel: 'Chapter IV',
      title: 'Garment Accessories',
      subtitle: 'Zippers, Buttons & Tipping Components',
      description:
        'Interlocking metal and vislon zippers, natural and cast buttons (brass, pearl, wood, shell), and thermal crimped drawcord tipping for assembly.',
      materials: ALL_DISCOVERY_MATERIALS.filter((m) => m.category === 'GARMENT ACCESSORIES').slice(0, 8),
      accentColor: '#3A4A3E',
      accentBg: '#ECF2EE',
    },
  ];

  const totalPages = pages.length; // includes cover

  /* ─── Navigation ─── */
  const goToPage = useCallback(
    (target: number, dir: 'forward' | 'backward') => {
      if (isAnimating || target < 0 || target >= totalPages) return;
      setAnimDir(dir);
      setIsAnimating(true);
      setPrevPage(currentPage);
      flipbookAudio.playPageTurn();

      setTimeout(() => {
        setCurrentPage(target);
        setIsAnimating(false);
        setPrevPage(null);
        setAnimDir(null);
      }, 400);
    },
    [currentPage, isAnimating, totalPages]
  );

  const handleNext = useCallback(() => goToPage(currentPage + 1, 'forward'), [currentPage, goToPage]);
  const handlePrev = useCallback(() => goToPage(currentPage - 1, 'backward'), [currentPage, goToPage]);

  /* ─── Keyboard ─── */
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') handleNext();
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') handlePrev();
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  /* ─── Touch Swipe ─── */
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const dist = touchStartX.current - touchEndX.current;
    if (dist > 50) handleNext();
    else if (dist < -50) handlePrev();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  /* ─── Scroll lock ─── */
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  /* ─── Reset on open ─── */
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(0);
      setEnquiredId(null);
    }
  }, [isOpen]);

  const handleEnquire = (mat: DiscoveryMaterial) => {
    setEnquiredId(mat.id);
    setTimeout(() => setEnquiredId(null), 2500);
    onEnquire(mat);
    // Close the lookbook so the enquiry modal can appear cleanly
    setTimeout(() => onClose(), 200);
  };

  if (!isOpen) return null;

  const activePage = pages[currentPage];
  const isCover = 'type' in activePage && activePage.type === IS_COVER;
  const isLastPage = currentPage === totalPages - 1;

  /* ─── Page animation styles ─── */
  const pageStyle: React.CSSProperties = isAnimating
    ? {
        opacity: 0,
        transform:
          animDir === 'forward'
            ? 'perspective(1200px) rotateY(-8deg) translateX(40px) scale(0.97)'
            : 'perspective(1200px) rotateY(8deg) translateX(-40px) scale(0.97)',
        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
      }
    : {
        opacity: 1,
        transform: 'perspective(1200px) rotateY(0deg) translateX(0) scale(1)',
        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
      };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Digital Textile Lookbook"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6"
      style={{ backgroundColor: 'rgba(8,7,6,0.88)', backdropFilter: 'blur(10px)', animation: 'lookbookFadeIn 0.25s ease-out' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Book Container ── */}
      <div
        className="relative w-full max-w-5xl h-[92vh] max-h-[860px] bg-[#FAF8F5] flex flex-col overflow-hidden"
        style={{
          borderRadius: '4px 16px 16px 4px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.65), -8px 0 20px rgba(0,0,0,0.25), inset -2px 0 4px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Book spine accent */}
        <div
          className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[#C5A07A] via-[#82553E] to-[#4A2E1A] z-10"
          style={{ borderRadius: '4px 0 0 4px' }}
        />

        {/* ── TOP BAR ── */}
        <div className="pl-4 pr-4 sm:pr-6 py-3.5 border-b border-[#E8E2D7] bg-[#F3EFE7] flex items-center justify-between shrink-0 ml-2">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-[#E7E0D2]">
              <BookOpen className="w-4 h-4 text-[#82553E]" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-[#181715] uppercase block">
                Classic Fashions · Digital Lookbook
              </span>
              <span className="text-[11px] text-[#78726A]">
                {isCover ? 'Cover' : `Page ${currentPage} of ${totalPages - 1}`}
                {!isCover && ' — ' + (activePage as CatalogPage).title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsMuted(flipbookAudio.toggleMuted())}
              aria-label={isMuted ? 'Unmute page sound' : 'Mute page sound'}
              className="p-2 rounded-full text-[#7B756C] hover:text-[#181715] hover:bg-[#E8E2D7] transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Digital Lookbook"
              className="p-2 rounded-full text-[#7B756C] hover:text-[#181715] hover:bg-[#E8E2D7] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── PAGE CONTENT ── */}
        <div className="flex-1 overflow-y-auto ml-2 relative" style={pageStyle}>
          {/* Shadow crease (binding effect) */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/8 to-transparent pointer-events-none z-10" />

          {isCover ? (
            /* ── COVER PAGE ── */
            <div className="h-full min-h-[400px] bg-gradient-to-br from-[#181715] via-[#2A1F15] to-[#0F0E0C] flex flex-col items-center justify-center text-center px-8 relative overflow-hidden">
              {/* Decorative background texture */}
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#C5A07A 1px, transparent 1px)', backgroundSize: '24px 24px' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F0E0C]/60 to-transparent pointer-events-none" />

              <div className="relative z-10 space-y-6 max-w-lg">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#D4AF37]/15 border border-[#D4AF37]/30 rounded-full text-[10px] font-mono uppercase tracking-[0.25em] text-[#F5DE93]">
                  <span>★</span>
                  <span>Textile Sourcing Archive · 2024</span>
                  <span>★</span>
                </div>

                <div className="space-y-2">
                  <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#FAF7F2] tracking-tight leading-none">
                    Classic<br />Fashions
                  </h1>
                  <div className="w-16 h-px bg-[#C5A07A] mx-auto" />
                  <p className="font-serif text-base sm:text-xl text-[#C5A07A] font-light tracking-wide italic">
                    Digital Material Lookbook
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-[#9A9189] leading-relaxed max-w-sm mx-auto">
                  A curated collection of raw fabrics, denim, laces and garment accessories
                  for apparel production. Browse and enquire directly.
                </p>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="group inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-[#C5A07A] to-[#82553E] text-white text-xs font-bold uppercase tracking-[0.18em] rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                  >
                    <BookOpen className="w-4 h-4" />
                    Open Lookbook
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <p className="text-[10px] text-[#5C5650] font-mono">
                    ← → Arrow keys · Swipe on mobile
                  </p>
                </div>

                {/* Chapter list */}
                <div className="grid grid-cols-2 gap-2 text-left mt-4">
                  {(pages.slice(1) as CatalogPage[]).map((p, i) => (
                    <button
                      key={p.pageNumber}
                      type="button"
                      onClick={() => goToPage(i + 1, 'forward')}
                      className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition-colors group"
                    >
                      <span className="text-[10px] font-mono text-[#C5A07A] shrink-0">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-[10px] text-[#B0A89E] group-hover:text-white transition-colors line-clamp-1">{p.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ── INNER PAGES ── */
            (() => {
              const page = activePage as CatalogPage;
              return (
                <div className="p-6 sm:p-8 md:p-10 space-y-8 min-h-full">
                  {/* Page header */}
                  <div
                    className="border-b pb-6 space-y-2"
                    style={{ borderColor: `${page.accentColor}25` }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[10px] font-mono uppercase tracking-[0.22em] font-semibold px-2.5 py-1 rounded-full"
                        style={{ color: page.accentColor, background: page.accentBg }}
                      >
                        {page.chapterLabel}
                      </span>
                      <span className="text-[11px] font-mono text-[#8C877E] uppercase tracking-wider">
                        PAGE {String(page.pageNumber).padStart(2, '0')} / {String(totalPages - 1).padStart(2, '0')}
                      </span>
                    </div>

                    <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#181715] tracking-tight">
                      {page.title}
                    </h2>
                    <p className="text-sm font-medium" style={{ color: page.accentColor }}>
                      {page.subtitle}
                    </p>
                    <p className="text-xs sm:text-sm text-[#6C665C] max-w-2xl leading-relaxed">
                      {page.description}
                    </p>
                  </div>

                  {/* Material grid — book layout */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
                    {page.materials.map((mat) => (
                      <div
                        key={mat.id}
                        className="group flex flex-col rounded-2xl overflow-hidden border border-[#EAE4D8] bg-white hover:border-[#C5A07A] hover:shadow-md transition-all duration-200"
                      >
                        {/* Fabric photograph */}
                        <div className="relative h-36 sm:h-44 overflow-hidden bg-[#F0EBE1]">
                          <img
                            src={mat.image}
                            alt={mat.name}
                            className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105"
                          />
                          {/* Subtle page-like border effect */}
                          <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.07)] pointer-events-none" />

                          {/* Corner tag */}
                          <div
                            className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider font-semibold text-white"
                            style={{ backgroundColor: page.accentColor }}
                          >
                            {mat.productCode || mat.subcategory.slice(0, 6)}
                          </div>
                        </div>

                        {/* Material card body */}
                        <div className="p-3 flex flex-col gap-2 flex-1">
                          <div>
                            <h4 className="font-serif text-sm font-medium text-[#181715] group-hover:text-[#82553E] transition-colors leading-tight">
                              {mat.name}
                            </h4>
                            <p className="text-[10px] font-mono text-[#8C877E] uppercase mt-0.5">
                              {mat.subcategory}
                            </p>
                          </div>

                          {/* Spec chips */}
                          <div className="flex flex-wrap gap-1">
                            {mat.composition && (
                              <span className="text-[9px] bg-[#F4F0E8] text-[#6C665C] px-1.5 py-0.5 rounded font-mono">
                                {mat.composition.slice(0, 18)}
                              </span>
                            )}
                            {mat.gsm && (
                              <span className="text-[9px] bg-[#F4F0E8] text-[#6C665C] px-1.5 py-0.5 rounded font-mono">
                                {mat.gsm}
                              </span>
                            )}
                          </div>

                          {/* Enquire CTA — goes directly to enquiry, no drawer */}
                          <button
                            type="button"
                            onClick={() => handleEnquire(mat)}
                            className="mt-auto flex items-center justify-center gap-1.5 w-full py-2 text-[10px] font-semibold uppercase tracking-wider rounded-xl transition-all"
                            style={{
                              backgroundColor: `${page.accentColor}15`,
                              color: page.accentColor,
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.backgroundColor = page.accentColor;
                              (e.currentTarget as HTMLButtonElement).style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${page.accentColor}15`;
                              (e.currentTarget as HTMLButtonElement).style.color = page.accentColor;
                            }}
                          >
                            <MessageSquare className="w-3 h-3" />
                            Enquire About This Material
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Page footer watermark */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#EAE4D8] text-[10px] font-mono text-[#B0A89E] uppercase tracking-wider">
                    <span>Classic Fashions B2B Textile Catalogue</span>
                    <span>{page.chapterLabel} · {page.title}</span>
                  </div>
                </div>
              );
            })()
          )}
        </div>

        {/* ── BOTTOM NAVIGATION ── */}
        <div className="ml-2 px-4 sm:px-6 py-3.5 border-t border-[#E8E2D7] bg-[#F7F4EE] flex items-center justify-between shrink-0">
          {/* Prev */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentPage === 0}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all ${
              currentPage === 0
                ? 'text-[#C0BAB2] cursor-not-allowed'
                : 'text-[#181715] hover:bg-[#EAE4D8] bg-white border border-[#DDD5C7]'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{currentPage === 1 ? 'Cover' : 'Previous'}</span>
          </button>

          {/* Page dots */}
          <div className="flex items-center gap-1.5">
            {pages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  const dir = idx > currentPage ? 'forward' : 'backward';
                  goToPage(idx, dir);
                }}
                className={`rounded-full transition-all duration-300 ${
                  idx === currentPage
                    ? 'w-6 h-2.5 bg-[#82553E]'
                    : 'w-2.5 h-2.5 bg-[#D5CEBF] hover:bg-[#A9A090]'
                }`}
                aria-label={idx === 0 ? 'Cover' : `Jump to page ${idx}`}
              />
            ))}
          </div>

          {/* Next */}
          <button
            type="button"
            onClick={handleNext}
            disabled={isLastPage}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all ${
              isLastPage
                ? 'text-[#C0BAB2] cursor-not-allowed'
                : 'bg-[#181715] text-white hover:bg-[#33302B]'
            }`}
          >
            <span className="hidden sm:inline">{currentPage === 0 ? 'Open Book' : 'Next Page'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Subtle right-edge book shadow */}
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-r from-transparent to-black/12 pointer-events-none" />
      </div>

      <style>{`
        @keyframes lookbookFadeIn {
          from { opacity: 0; transform: scale(0.97) }
          to { opacity: 1; transform: scale(1) }
        }
      `}</style>
    </div>
  );
};
