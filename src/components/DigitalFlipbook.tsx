import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FLIPBOOK_SPREADS,
  FLIPBOOK_BOOKMARK_TABS,
  FlipbookSpread,
} from '../data/flipbookData.ts';
import { FlipbookPage } from './FlipbookPage.tsx';
import { Product } from '../types.ts';
import { flipbookAudio } from '../utils/audio.ts';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  BookOpen,
  List,
  RotateCcw,
  Sparkles,
  Search,
  X,
  ZoomIn,
  ZoomOut,
  Info,
  Check,
} from 'lucide-react';

interface DigitalFlipbookProps {
  initialSpreadIndex?: number;
  initialCategoryKey?: string;
  onViewDetails: (product: Product) => void;
  onEnquire: (product: Product) => void;
  onAddToCollection?: (product: Product) => void;
  onRequestMaterial?: () => void;
  isInCollection?: (productId: string) => boolean;
  onSwitchToGrid?: () => void;
}

export const DigitalFlipbook: React.FC<DigitalFlipbookProps> = ({
  initialSpreadIndex = 0,
  initialCategoryKey,
  onViewDetails,
  onEnquire,
  onAddToCollection,
  onRequestMaterial,
  isInCollection,
  onSwitchToGrid,
}) => {
  // Flipbook state
  const [isOpen, setIsOpen] = useState(false);
  const [currentSpreadIndex, setCurrentSpreadIndex] = useState(1); // Default to spread 1 (pages 2-3) once opened
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'forward' | 'backward' | null>(null);
  const [isMuted, setIsMuted] = useState(() => flipbookAudio.getMuted());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const [magnifierActive, setMagnifierActive] = useState(false);

  // Drag / swipe gesture tracking
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragCurrentX, setDragCurrentX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Map initial category if provided
  useEffect(() => {
    if (initialCategoryKey) {
      const match = FLIPBOOK_BOOKMARK_TABS.find(
        (t) => t.categoryKey && t.categoryKey.toLowerCase() === initialCategoryKey.toLowerCase()
      );
      if (match) {
        setIsOpen(true);
        setCurrentSpreadIndex(match.spreadIndex);
      }
    } else if (initialSpreadIndex > 0) {
      setIsOpen(true);
      setCurrentSpreadIndex(initialSpreadIndex);
    }
  }, [initialCategoryKey, initialSpreadIndex]);

  const totalSpreads = FLIPBOOK_SPREADS.length; // Spreads 0 to 16
  const currentSpread = FLIPBOOK_SPREADS[currentSpreadIndex] || FLIPBOOK_SPREADS[1];

  // Open book handler with physical opening sequence
  const handleOpenBook = (targetSpread: number = 1) => {
    flipbookAudio.playPageTurn();
    setIsOpen(true);
    setCurrentSpreadIndex(targetSpread);
  };

  // Close book handler (return to cover)
  const handleCloseBook = () => {
    flipbookAudio.playPageTurn();
    setIsOpen(false);
    setCurrentSpreadIndex(0);
  };

  // Turn page forward
  const handleNextPage = useCallback(() => {
    if (isFlipping || currentSpreadIndex >= totalSpreads - 1) return;
    setIsFlipping(true);
    setFlipDirection('forward');
    flipbookAudio.playPageTurn();

    setTimeout(() => {
      setCurrentSpreadIndex((prev) => Math.min(prev + 1, totalSpreads - 1));
      setIsFlipping(false);
      setFlipDirection(null);
    }, 450);
  }, [isFlipping, currentSpreadIndex, totalSpreads]);

  // Turn page backward
  const handlePrevPage = useCallback(() => {
    if (isFlipping || currentSpreadIndex <= 1) {
      if (currentSpreadIndex === 1 && !isFlipping) {
        // Return to cover
        handleCloseBook();
      }
      return;
    }
    setIsFlipping(true);
    setFlipDirection('backward');
    flipbookAudio.playPageTurn();

    setTimeout(() => {
      setCurrentSpreadIndex((prev) => Math.max(prev - 1, 1));
      setIsFlipping(false);
      setFlipDirection(null);
    }, 450);
  }, [isFlipping, currentSpreadIndex]);

  // Jump directly to chapter
  const handleJumpToSpread = (index: number) => {
    if (index === currentSpreadIndex && isOpen) return;
    if (index === 0) {
      handleCloseBook();
      return;
    }
    flipbookAudio.playPageTurn();
    setIsOpen(true);
    setCurrentSpreadIndex(index);
    setShowTableOfContents(false);
  };

  const handleJumpToChapter = (chapterId: string) => {
    const tab = FLIPBOOK_BOOKMARK_TABS.find((t) => t.id === chapterId);
    if (tab) {
      handleJumpToSpread(tab.spreadIndex);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (!isOpen) {
          handleOpenBook(1);
        } else {
          handleNextPage();
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (isOpen) {
          handlePrevPage();
        }
      } else if (e.key === 'Escape') {
        setShowTableOfContents(false);
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNextPage, handlePrevPage]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {});
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => {});
    }
  };

  // Sound toggle
  const toggleSound = () => {
    const nextMuted = flipbookAudio.toggleMuted();
    setIsMuted(nextMuted);
  };

  // Pointer / Touch gestures for realistic drag-to-turn
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isOpen || isFlipping) return;
    setDragStartX(e.clientX);
    setDragCurrentX(e.clientX);
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || dragStartX === null) return;
    setDragCurrentX(e.clientX);
  };

  const handlePointerUp = () => {
    if (!isDragging || dragStartX === null || dragCurrentX === null) {
      setIsDragging(false);
      setDragStartX(null);
      setDragCurrentX(null);
      return;
    }

    const deltaX = dragCurrentX - dragStartX;
    const threshold = 60; // 60px swipe/drag threshold

    if (deltaX < -threshold) {
      // Swiped left -> Turn forward
      handleNextPage();
    } else if (deltaX > threshold) {
      // Swiped right -> Turn backward
      handlePrevPage();
    }

    setIsDragging(false);
    setDragStartX(null);
    setDragCurrentX(null);
  };

  // Calculate dynamic rotation during drag
  const dragRotation = isDragging && dragStartX !== null && dragCurrentX !== null
    ? Math.max(-45, Math.min(45, ((dragCurrentX - dragStartX) / 300) * 45))
    : 0;

  // Active Bookmark Tab calculation
  const activeTabId = FLIPBOOK_BOOKMARK_TABS.find(
    (t) => t.spreadIndex === currentSpreadIndex
  )?.id || (isOpen ? 'about' : 'cover');

  return (
    <div
      ref={containerRef}
      className={`relative w-full min-h-[780px] bg-stone-900 text-stone-100 flex flex-col items-center justify-between select-none overflow-hidden transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 p-2 sm:p-6' : 'py-6 px-2 sm:px-6 rounded-xl border border-stone-800 my-4 shadow-2xl'
      }`}
    >
      {/* ======================================================== */}
      {/* TOP CONTROLS & PHYSICAL BOOKMARK TABS */}
      {/* ======================================================== */}
      <div className="w-full max-w-6xl flex flex-col gap-2 z-20">
        {/* Upper Toolbar: Title & Utility Buttons */}
        <div className="flex items-center justify-between px-2 text-xs font-mono">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold tracking-wider uppercase">
              <BookOpen className="w-4 h-4" />
              <span>Digital Material Catalogue</span>
            </div>
            <span className="text-stone-600 hidden sm:inline">|</span>
            <span className="text-stone-400 hidden sm:inline">
              Vol. 2026 Archive
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Switch to Grid view if requested */}
            {onSwitchToGrid && (
              <button
                onClick={onSwitchToGrid}
                className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-xs transition-colors flex items-center gap-1.5 border border-stone-700"
                title="Switch to Filterable Technical Grid View"
              >
                <span>Technical Grid</span>
              </button>
            )}

            {/* Table of Contents Button */}
            <button
              onClick={() => setShowTableOfContents((prev) => !prev)}
              className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-xs transition-colors flex items-center gap-1.5 border border-stone-700"
              title="Table of Contents"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Index</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded transition-colors border border-stone-700"
              title={isMuted ? 'Sound Off (Click to unmute page flutter)' : 'Sound On'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-stone-500" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded transition-colors border border-stone-700"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Lookbook'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            {/* Return to Cover */}
            {isOpen && (
              <button
                onClick={handleCloseBook}
                className="px-2 py-1 bg-stone-800 hover:bg-amber-900/60 text-amber-300 rounded text-xs transition-colors border border-amber-800/40 flex items-center gap-1"
                title="Close catalogue and return to cover"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Cover</span>
              </button>
            )}
          </div>
        </div>

        {/* Physical Bookmark Tabs Bar (Protruding like real swatch binder tabs) */}
        <div className="w-full overflow-x-auto pb-1 pt-1 scrollbar-none flex items-end gap-1 px-1">
          {FLIPBOOK_BOOKMARK_TABS.map((tab) => {
            const isActive = tab.spreadIndex === currentSpreadIndex && isOpen;
            return (
              <button
                key={tab.id}
                onClick={() => handleJumpToSpread(tab.spreadIndex)}
                className={`relative px-2.5 py-1 text-[11px] font-mono whitespace-nowrap rounded-t transition-all flex-shrink-0 border-t border-x ${
                  isActive
                    ? 'bg-[#fcfbf9] text-stone-900 font-bold border-stone-300 -mb-px z-10 shadow-sm'
                    : 'bg-stone-800/80 text-stone-400 hover:bg-stone-700 hover:text-stone-200 border-stone-700/60'
                }`}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-800" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MAIN DIGITAL FLIPBOOK STAGE (3D PERSPECTIVE) */}
      {/* ======================================================== */}
      <div
        className="w-full max-w-6xl flex-1 flex items-center justify-center relative my-2 px-1 sm:px-4"
        style={{ perspective: '2200px' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* CLOSED BOOK COVER STATE */}
        {!isOpen ? (
          <div
            onClick={() => handleOpenBook(1)}
            className="group cursor-pointer relative w-full max-w-md sm:max-w-lg aspect-[3/4] max-h-[640px] rounded-lg transition-transform duration-500 hover:scale-[1.02] shadow-2xl flex flex-col justify-between p-8 sm:p-12 overflow-hidden border border-stone-700/80"
            style={{
              background: 'linear-gradient(135deg, #1e2229 0%, #15181d 100%)',
              boxShadow:
                '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.1), inset -5px 0 15px rgba(0, 0, 0, 0.7)',
            }}
          >
            {/* Subtle textile weave overlay */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 1px, transparent 1px)',
                backgroundSize: '4px 4px',
              }}
            />

            {/* Brass binding rivets on spine edge */}
            <div className="absolute left-3 top-6 bottom-6 flex flex-col justify-between">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-700/60 border border-amber-500/80 shadow-inner" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-700/60 border border-amber-500/80 shadow-inner" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-700/60 border border-amber-500/80 shadow-inner" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-700/60 border border-amber-500/80 shadow-inner" />
            </div>

            {/* Debossed gold border frame */}
            <div className="absolute inset-4 sm:inset-6 border border-amber-700/40 rounded pointer-events-none" />
            <div className="absolute inset-5 sm:inset-7 border border-amber-800/20 rounded pointer-events-none" />

            {/* Multi-page thickness edge (Right edge of book) */}
            <div className="absolute right-0 top-2 bottom-2 w-3 bg-gradient-to-r from-stone-400 via-stone-200 to-stone-400 rounded-r shadow-inner opacity-80" />

            {/* Cover Content */}
            <div className="relative z-10 space-y-4">
              <span className="block text-xs font-mono tracking-widest text-amber-400 uppercase">
                Est. 1994 • Tiruppur Textile Hub
              </span>
              <div className="space-y-1">
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-100 tracking-wider">
                  CLASSIC FASHIONS
                </h1>
                <p className="text-xs sm:text-sm font-mono tracking-widest text-amber-300 uppercase">
                  Digital Material Catalogue
                </p>
              </div>
              <div className="h-0.5 w-16 bg-amber-600/70 my-2" />
              <p className="text-stone-400 font-serif italic text-sm">
                "Garment Accessories & Fabrics"
              </p>
            </div>

            {/* Center Swatch Texture Stamp */}
            <div className="relative z-10 my-4 flex items-center justify-center">
              <div className="p-4 rounded-full border border-amber-600/30 bg-stone-900/60 text-center">
                <span className="block text-[10px] font-mono uppercase tracking-widest text-amber-400">
                  Woven Gada • Poplin • Twill • Drill • Duck • Satin
                </span>
                <span className="block text-[9px] font-mono text-stone-400 mt-0.5">
                  Laces • Denim • Mesh • Tapes • Tags • Buttons
                </span>
              </div>
            </div>

            {/* Bottom Call to Action */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <button
                onClick={() => handleOpenBook(1)}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-600 text-amber-50 font-mono font-semibold text-xs tracking-widest uppercase rounded shadow-lg transition-all flex items-center justify-center gap-2 group-hover:scale-105"
              >
                <span>OPEN CATALOGUE</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <span className="text-[10px] font-mono text-stone-500">
                Click cover or press Right Arrow → to open
              </span>
            </div>
          </div>
        ) : (
          /* OPEN TWO-PAGE SPREAD */
          <div
            className="relative w-full max-w-5xl min-h-[580px] sm:min-h-[620px] max-h-[720px] flex items-stretch rounded-lg shadow-2xl transition-transform duration-300 border border-stone-800"
            style={{
              transform: `rotateY(${dragRotation * 0.25}deg)`,
              boxShadow:
                '0 30px 60px -15px rgba(0, 0, 0, 0.9), 0 0 100px rgba(0,0,0,0.4)',
            }}
          >
            {/* Left Page Multi-layer Paper Depth (Simulating stacked pages to the left) */}
            <div
              className="absolute -left-2 top-1.5 bottom-1.5 w-2 bg-gradient-to-r from-stone-400 via-stone-200 to-stone-300 rounded-l shadow-inner"
              style={{
                opacity: currentSpreadIndex > 1 ? 0.9 : 0.2,
              }}
            />

            {/* Right Page Multi-layer Paper Depth (Simulating stacked pages to the right) */}
            <div
              className="absolute -right-2 top-1.5 bottom-1.5 w-2 bg-gradient-to-l from-stone-400 via-stone-200 to-stone-300 rounded-r shadow-inner"
              style={{
                opacity: currentSpreadIndex < totalSpreads - 1 ? 0.9 : 0.2,
              }}
            />

            {/* LEFT PAGE */}
            <div
              className={`w-1/2 h-full bg-[#fcfbf9] text-stone-900 rounded-l-md border-r border-stone-300 relative overflow-hidden transition-all duration-300 ${
                isFlipping && flipDirection === 'backward' ? 'brightness-95 scale-[0.99]' : ''
              }`}
              style={{
                background:
                  'linear-gradient(to right, #f8f6f0 0%, #fcfbf9 85%, #ede9df 100%)',
                boxShadow: 'inset -12px 0 15px -8px rgba(0, 0, 0, 0.15)',
              }}
            >
              <FlipbookPage
                page={currentSpread.leftPage}
                side="left"
                onViewDetails={onViewDetails}
                onEnquire={onEnquire}
                onAddToCollection={onAddToCollection}
                onRequestMaterial={onRequestMaterial}
                onJumpToChapter={handleJumpToChapter}
                isInCollection={isInCollection}
              />

              {/* Left Page Dog-Ear Corner Turn Indicator */}
              {currentSpreadIndex > 1 && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevPage();
                  }}
                  className="absolute bottom-0 left-0 w-8 h-8 group/dogear cursor-pointer"
                  title="Click to turn to previous spread (←)"
                >
                  <div className="w-full h-full bg-gradient-to-tr from-stone-300 via-stone-200 to-transparent group-hover/dogear:scale-125 transition-transform origin-bottom-left shadow-sm flex items-end justify-start p-1 text-[8px] font-mono text-stone-600">
                    ←
                  </div>
                </div>
              )}
            </div>

            {/* CENTER SPINE CREASE & SHADOW (REALISTIC BOOK BINDING) */}
            <div
              className="absolute left-1/2 top-0 bottom-0 w-8 -ml-4 z-20 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to right, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.22) 48%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.22) 52%, rgba(0,0,0,0.12) 100%)',
                boxShadow: 'inset 0 0 5px rgba(0,0,0,0.3)',
              }}
            />

            {/* RIGHT PAGE */}
            <div
              className={`w-1/2 h-full bg-[#fcfbf9] text-stone-900 rounded-r-md relative overflow-hidden transition-all duration-300 ${
                isFlipping && flipDirection === 'forward' ? 'brightness-95 scale-[0.99]' : ''
              }`}
              style={{
                background:
                  'linear-gradient(to left, #f8f6f0 0%, #fcfbf9 85%, #ede9df 100%)',
                boxShadow: 'inset 12px 0 15px -8px rgba(0, 0, 0, 0.15)',
              }}
            >
              <FlipbookPage
                page={currentSpread.rightPage}
                side="right"
                onViewDetails={onViewDetails}
                onEnquire={onEnquire}
                onAddToCollection={onAddToCollection}
                onRequestMaterial={onRequestMaterial}
                onJumpToChapter={handleJumpToChapter}
                isInCollection={isInCollection}
              />

              {/* Right Page Dog-Ear Corner Turn Indicator */}
              {currentSpreadIndex < totalSpreads - 1 && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextPage();
                  }}
                  className="absolute bottom-0 right-0 w-8 h-8 group/dogear cursor-pointer"
                  title="Click to turn to next spread (→)"
                >
                  <div className="w-full h-full bg-gradient-to-tl from-stone-300 via-stone-200 to-transparent group-hover/dogear:scale-125 transition-transform origin-bottom-right shadow-sm flex items-end justify-end p-1 text-[8px] font-mono text-stone-600">
                    →
                  </div>
                </div>
              )}
            </div>

            {/* DYNAMIC PAGE TURN ANIMATION OVERLAY */}
            {isFlipping && (
              <div
                className={`absolute top-0 bottom-0 w-1/2 z-30 pointer-events-none transition-all duration-400 ease-in-out ${
                  flipDirection === 'forward'
                    ? 'right-0 origin-left animate-page-flip-forward'
                    : 'left-0 origin-right animate-page-flip-backward'
                }`}
                style={{
                  background:
                    'linear-gradient(to right, rgba(0,0,0,0.15), rgba(255,255,255,0.4), rgba(0,0,0,0.1))',
                  boxShadow: '0 0 25px rgba(0,0,0,0.4)',
                }}
              />
            )}
          </div>
        )}

        {/* FLOATING PREVIOUS BUTTON */}
        {isOpen && (
          <button
            onClick={handlePrevPage}
            disabled={isFlipping}
            className="absolute left-0 sm:-left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-stone-900/90 hover:bg-stone-800 text-amber-200 hover:text-amber-100 flex items-center justify-center shadow-xl border border-stone-700 transition-all hover:scale-110 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
            title="Previous Page (Left Arrow ←)"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* FLOATING NEXT BUTTON */}
        {isOpen && (
          <button
            onClick={handleNextPage}
            disabled={isFlipping || currentSpreadIndex >= totalSpreads - 1}
            className="absolute right-0 sm:-right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-stone-900/90 hover:bg-stone-800 text-amber-200 hover:text-amber-100 flex items-center justify-center shadow-xl border border-stone-700 transition-all hover:scale-110 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
            title="Next Page (Right Arrow →)"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
      </div>

      {/* ======================================================== */}
      {/* BOTTOM SCRUBBER & PAGE INDICATORS */}
      {/* ======================================================== */}
      {isOpen && (
        <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-3 px-2 z-20 font-mono text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-medium">
              Spread {currentSpreadIndex} of {totalSpreads - 1}
            </span>
            <span className="text-stone-600">·</span>
            <span>
              Pages {currentSpread.leftPage.pageNumber} & {currentSpread.rightPage.pageNumber}
            </span>
          </div>

          {/* Interactive spread range scrubber slider */}
          <div className="flex-1 max-w-md w-full flex items-center gap-2">
            <span className="text-[10px] text-stone-500">2</span>
            <input
              type="range"
              min={1}
              max={totalSpreads - 1}
              value={currentSpreadIndex}
              onChange={(e) => handleJumpToSpread(Number(e.target.value))}
              className="w-full accent-amber-600 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
            <span className="text-[10px] text-stone-500">33</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-stone-400">
            <span>Use ← / → Keys or drag corners</span>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TABLE OF CONTENTS MODAL POPUP */}
      {/* ======================================================== */}
      {showTableOfContents && (
        <div
          className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowTableOfContents(false)}
        >
          <div
            className="bg-stone-900 border border-stone-800 rounded-lg max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl text-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-amber-500">
                  Classic Fashions
                </span>
                <h3 className="text-lg font-serif font-bold text-white">
                  Table of Contents
                </h3>
              </div>
              <button
                onClick={() => setShowTableOfContents(false)}
                className="p-1 rounded text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1 font-mono text-xs">
              {FLIPBOOK_BOOKMARK_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleJumpToSpread(tab.spreadIndex)}
                  className={`w-full py-2 px-3 rounded flex items-center justify-between transition-colors ${
                    tab.spreadIndex === currentSpreadIndex
                      ? 'bg-amber-950/70 text-amber-300 font-bold border border-amber-800/50'
                      : 'hover:bg-stone-800 text-stone-300'
                  }`}
                >
                  <span className="truncate">{tab.label}</span>
                  <span className="text-stone-500 text-[11px]">
                    Page {tab.pageNumber}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
