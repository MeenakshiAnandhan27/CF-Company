import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Compass,
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Check,
  Box,
  Image as ImageIcon,
  Sliders,
  Scan,
} from 'lucide-react';
import { DiscoveryMaterial, ALL_DISCOVERY_MATERIALS } from '../../data/catalogueDiscoveryData.ts';
import { FABRIC_PACK_4K, ALL_VIEWER_FABRICS, FabricPackItem } from '../../data/fabricPack4KData.ts';
import { Fabric3DScene } from './Fabric3DScene.tsx';
import { Fabric4KViewer } from './Fabric4KViewer.tsx';

interface FabricViewer360Props {
  initialMaterial?: DiscoveryMaterial | null;
  isOpen: boolean;
  onClose: () => void;
  onEnquire?: (material: DiscoveryMaterial) => void;
  onRequestSample?: (material: DiscoveryMaterial) => void;
}

export const FabricViewer360: React.FC<FabricViewer360Props> = ({
  initialMaterial,
  isOpen,
  onClose,
  onEnquire,
  onRequestSample,
}) => {
  // Active fabric index within ALL_VIEWER_FABRICS
  const [selectedFabricIndex, setSelectedFabricIndex] = useState<number>(0);

  // View Mode: Genuine 3D Cloth Mesh vs 4K Master Studio vs Panoramic View
  const [viewMode, setViewMode] = useState<'3d-mesh' | '4k-studio' | '4k-panoramic'>('3d-mesh');

  // 3D Surface Geometry Mode
  const [surfaceMode, setSurfaceMode] = useState<'drape' | 'curved-swatch' | 'inspection-bed'>('drape');

  // 3D Camera / Turntable States
  const [rotationY, setRotationY] = useState<number>(0);
  const [rotationX, setRotationX] = useState<number>(8);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isAutoSpinning, setIsAutoSpinning] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Initial fabric mapping if initialMaterial is provided
  useEffect(() => {
    if (initialMaterial) {
      const idx = ALL_VIEWER_FABRICS.findIndex(
        (f) =>
          f.name.toLowerCase() === initialMaterial.name.toLowerCase() ||
          f.id === initialMaterial.id ||
          initialMaterial.name.toLowerCase().includes(f.name.toLowerCase()) ||
          f.name.toLowerCase().includes(initialMaterial.name.toLowerCase())
      );
      if (idx >= 0) {
        setSelectedFabricIndex(idx);
      }
    }
  }, [initialMaterial]);

  // Keyboard navigation & escape listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        setSelectedFabricIndex((prev) => (prev + 1) % ALL_VIEWER_FABRICS.length);
      } else if (e.key === 'ArrowLeft') {
        setSelectedFabricIndex((prev) => (prev - 1 + ALL_VIEWER_FABRICS.length) % ALL_VIEWER_FABRICS.length);
      } else if (e.key === ' ' && viewMode === '3d-mesh') {
        e.preventDefault();
        setIsAutoSpinning((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, viewMode]);

  if (!isOpen) return null;

  const currentFabric: FabricPackItem = ALL_VIEWER_FABRICS[selectedFabricIndex] || ALL_VIEWER_FABRICS[0];
  const normalizedAngle = Math.round(((rotationY % 360) + 360) % 360);

  const handleQuickAngle = (degY: number, degX: number) => {
    setIsAutoSpinning(false);
    setRotationY(degY);
    setRotationX(degX);
  };

  const handleAngleChange = (newRotY: number, newRotX: number) => {
    setRotationY(newRotY);
    setRotationX(newRotX);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="3D & 360 Degree Fabric Atelier Studio"
      className="fixed inset-0 z-50 bg-[#070908]/96 backdrop-blur-2xl flex flex-col justify-between overflow-hidden select-none"
    >
      {/* ==================== TOP NAVIGATION BAR ==================== */}
      <header className="px-4 sm:px-8 py-3.5 border-b border-white/10 flex items-center justify-between bg-black/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#A67C43] to-[#6E4F28] text-white flex items-center justify-center shadow-lg border border-[#C6A66B]/30">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C6A66B] font-bold">
                CLASSIC FASHIONS ATELIER
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#16A34A]/20 text-[#86EFAC] border border-[#16A34A]/30 font-medium">
                GENUINE 3D PBR SURFACE
              </span>
            </div>
            <h2 className="font-['Cinzel',serif] text-xl sm:text-2xl font-normal text-white tracking-wide flex items-center gap-2">
              {currentFabric.name}
              {currentFabric.is4KPack && (
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm bg-[#D4AF37]/20 text-[#F5DC88] border border-[#D4AF37]/40">
                  4K MASTER PACK
                </span>
              )}
            </h2>
          </div>
        </div>

        {/* Center Mode Switcher: 3D Surface vs 4K Studio Masters */}
        <div className="hidden md:flex items-center bg-white/5 border border-white/10 p-1 rounded-full text-xs font-mono">
          <button
            onClick={() => setViewMode('3d-mesh')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              viewMode === '3d-mesh'
                ? 'bg-[#C6A66B] text-[#121415] font-bold shadow-md'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Interactive Mesh</span>
          </button>

          <button
            onClick={() => setViewMode('4k-studio')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              viewMode === '4k-studio'
                ? 'bg-[#C6A66B] text-[#121415] font-bold shadow-md'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>4K Studio Master</span>
          </button>

          <button
            onClick={() => setViewMode('4k-panoramic')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              viewMode === '4k-panoramic'
                ? 'bg-[#C6A66B] text-[#121415] font-bold shadow-md'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>Wide Atelier View</span>
          </button>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2">
          {viewMode === '3d-mesh' && (
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#DDD5C8]">
              <span>ROTATION: <strong className="text-[#C6A66B]">{normalizedAngle}°</strong></span>
              <span className="text-white/20">|</span>
              <span>TILT: <strong className="text-[#C6A66B]">{Math.round(rotationX)}°</strong></span>
            </div>
          )}

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Close 360° Studio"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ==================== MAIN 3D / 4K STAGE ==================== */}
      <main className="relative flex-1 flex items-center justify-center overflow-hidden bg-[#070908]">
        {/* Ambient Studio Lighting Glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 45%, rgba(198, 166, 107, 0.08) 0%, rgba(7, 9, 8, 0.98) 75%)',
          }}
        />

        {/* View Mode 1: Genuine 3D Cloth Mesh with PBR Physics */}
        {viewMode === '3d-mesh' ? (
          <Fabric3DScene
            fabric={currentFabric}
            rotationY={rotationY}
            rotationX={rotationX}
            zoomLevel={zoomLevel}
            isAutoSpinning={isAutoSpinning}
            surfaceMode={surfaceMode}
            onAngleChange={handleAngleChange}
            onAutoSpinToggle={() => setIsAutoSpinning((prev) => !prev)}
          />
        ) : viewMode === '4k-studio' ? (
          <Fabric4KViewer fabric={currentFabric} mode="studio-square" />
        ) : (
          <Fabric4KViewer fabric={currentFabric} mode="panoramic-wide" />
        )}

        {/* Left / Right Quick Fabric Switcher Floating Arrows */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedFabricIndex((prev) => (prev - 1 + ALL_VIEWER_FABRICS.length) % ALL_VIEWER_FABRICS.length);
          }}
          className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 hover:bg-black/95 text-white border border-white/20 flex items-center justify-center transition-all hover:scale-110 shadow-2xl cursor-pointer z-20"
          title="Previous Fabric (Left Arrow)"
        >
          <ChevronLeft className="w-6 h-6 text-[#E0D7C6]" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedFabricIndex((prev) => (prev + 1) % ALL_VIEWER_FABRICS.length);
          }}
          className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 hover:bg-black/95 text-white border border-white/20 flex items-center justify-center transition-all hover:scale-110 shadow-2xl cursor-pointer z-20"
          title="Next Fabric (Right Arrow)"
        >
          <ChevronRight className="w-6 h-6 text-[#E0D7C6]" />
        </button>

        {/* 3D Surface Geometry Selector Floating Pill (Only when in 3D Mesh Mode) */}
        {viewMode === '3d-mesh' && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 p-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-xs font-mono">
            <span className="text-[10px] text-white/50 px-2 uppercase hidden sm:inline">GEOMETRY:</span>
            <button
              onClick={() => setSurfaceMode('drape')}
              className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                surfaceMode === 'drape' ? 'bg-[#C6A66B] text-[#121415] font-bold' : 'text-white/70 hover:text-white'
              }`}
            >
              Atelier Drape
            </button>
            <button
              onClick={() => setSurfaceMode('curved-swatch')}
              className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                surfaceMode === 'curved-swatch' ? 'bg-[#C6A66B] text-[#121415] font-bold' : 'text-white/70 hover:text-white'
              }`}
            >
              Curved Plaque
            </button>
            <button
              onClick={() => setSurfaceMode('inspection-bed')}
              className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                surfaceMode === 'inspection-bed' ? 'bg-[#C6A66B] text-[#121415] font-bold' : 'text-white/70 hover:text-white'
              }`}
            >
              Macro Bed
            </button>
          </div>
        )}
      </main>

      {/* ==================== CONTROL DOCK & SPECIFICATIONS ==================== */}
      <footer className="border-t border-white/10 bg-black/75 backdrop-blur-xl px-4 sm:px-8 py-3.5 space-y-3.5">
        {/* Row 1: Turntable Controls, Angle Presets, Mobile Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Mobile Mode Switcher */}
          <div className="flex md:hidden items-center bg-white/10 border border-white/15 p-0.5 rounded-lg text-xs font-mono">
            <button
              onClick={() => setViewMode('3d-mesh')}
              className={`px-2.5 py-1 rounded-md ${viewMode === '3d-mesh' ? 'bg-[#C6A66B] text-[#121415] font-bold' : 'text-white/80'}`}
            >
              3D Mesh
            </button>
            <button
              onClick={() => setViewMode('4k-studio')}
              className={`px-2.5 py-1 rounded-md ${viewMode === '4k-studio' ? 'bg-[#C6A66B] text-[#121415] font-bold' : 'text-white/80'}`}
            >
              4K Photo
            </button>
            <button
              onClick={() => setViewMode('4k-panoramic')}
              className={`px-2.5 py-1 rounded-md ${viewMode === '4k-panoramic' ? 'bg-[#C6A66B] text-[#121415] font-bold' : 'text-white/80'}`}
            >
              Wide View
            </button>
          </div>

          {/* Quick Angle Presets (Only in 3D Mode) */}
          {viewMode === '3d-mesh' ? (
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A69B8D] mr-1 hidden sm:inline">
                ANGLES:
              </span>
              <button
                onClick={() => handleQuickAngle(0, 8)}
                className={`px-3 py-1 rounded-full text-xs font-mono uppercase transition-colors cursor-pointer ${
                  normalizedAngle === 0 ? 'bg-[#C6A66B] text-[#121415] font-bold' : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                0° Front
              </button>
              <button
                onClick={() => handleQuickAngle(45, 12)}
                className={`px-3 py-1 rounded-full text-xs font-mono uppercase transition-colors cursor-pointer ${
                  normalizedAngle === 45 ? 'bg-[#C6A66B] text-[#121415] font-bold' : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                45° Bias
              </button>
              <button
                onClick={() => handleQuickAngle(65, 15)}
                className={`px-3 py-1 rounded-full text-xs font-mono uppercase transition-colors cursor-pointer ${
                  normalizedAngle === 65 ? 'bg-[#C6A66B] text-[#121415] font-bold' : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
                title="Optimal angle to observe surface sheen and retroreflection"
              >
                65° Sheen
              </button>
              <button
                onClick={() => handleQuickAngle(90, 5)}
                className={`px-3 py-1 rounded-full text-xs font-mono uppercase transition-colors cursor-pointer ${
                  normalizedAngle === 90 ? 'bg-[#C6A66B] text-[#121415] font-bold' : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                90° Edge
              </button>
              <button
                onClick={() => handleQuickAngle(180, 8)}
                className={`px-3 py-1 rounded-full text-xs font-mono uppercase transition-colors cursor-pointer ${
                  normalizedAngle === 180 ? 'bg-[#C6A66B] text-[#121415] font-bold' : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                180° Back
              </button>
            </div>
          ) : (
            <div className="text-xs font-mono text-[#C6A66B]">
              Master Studio 4K Reference Asset
            </div>
          )}

          {/* 3D Action Controls: Auto-Spin, Zoom In/Out */}
          {viewMode === '3d-mesh' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAutoSpinning(!isAutoSpinning)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  isAutoSpinning
                    ? 'bg-[#C6A66B] text-[#181715] shadow-md font-bold'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {isAutoSpinning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isAutoSpinning ? 'PAUSE' : 'AUTO SPIN'}</span>
              </button>

              <button
                onClick={() => setZoomLevel((prev) => Math.max(0.8, prev - 0.25))}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono text-white/60 min-w-[36px] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>

              <button
                onClick={() => setZoomLevel((prev) => Math.min(2.5, prev + 0.25))}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Row 2: Fabric Technical Metadata & Swatch Carousel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Metadata Specifications (Cols 1-4) */}
          <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-xl p-3 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#C6A66B] font-bold">
                  {currentFabric.type} • {currentFabric.gsm}
                </span>
                {currentFabric.is4KPack && (
                  <span className="px-1.5 py-0.2 rounded-sm bg-[#D4AF37]/20 text-[#F5DC88] text-[9px] font-mono">
                    4K
                  </span>
                )}
              </div>
              <span className="font-medium text-white block text-sm">
                {currentFabric.composition}
              </span>
              <span className="text-[11px] text-[#A69B8D] block">
                {currentFabric.weave} ({currentFabric.width}) • {currentFabric.sheen}
              </span>
            </div>

            {onEnquire && (
              <button
                onClick={() => {
                  const matched = ALL_DISCOVERY_MATERIALS.find(
                    (m) => m.name.toLowerCase() === currentFabric.name.toLowerCase()
                  );
                  if (matched) {
                    onEnquire(matched);
                  } else {
                    onEnquire({
                      id: currentFabric.id,
                      name: currentFabric.name,
                      category: 'FABRICS',
                      subcategory: currentFabric.type,
                      section: 'WOVEN',
                      image: currentFabric.studioImage,
                      description: currentFabric.desc,
                      composition: currentFabric.composition,
                      weave: currentFabric.weave,
                      gsm: currentFabric.gsm,
                      width: currentFabric.width,
                    });
                  }
                }}
                className="shrink-0 px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B89452] hover:brightness-110 text-[#0E0D0C] font-bold rounded-lg text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                Enquire
              </button>
            )}
          </div>

          {/* Fabric Thumbnail Carousel (Cols 5-12) */}
          <div className="lg:col-span-8 overflow-x-auto flex items-center gap-2.5 py-1 scrollbar-thin">
            {ALL_VIEWER_FABRICS.map((fabric, idx) => {
              const isSelected = selectedFabricIndex === idx;

              return (
                <button
                  key={fabric.id}
                  onClick={() => {
                    setSelectedFabricIndex(idx);
                    setIsAutoSpinning(true);
                  }}
                  className={`group relative shrink-0 w-24 sm:w-28 rounded-lg overflow-hidden border transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'border-[#C6A66B] ring-2 ring-[#C6A66B]/50 scale-105 shadow-xl'
                      : 'border-white/15 opacity-65 hover:opacity-100 hover:border-white/40'
                  }`}
                >
                  <div className="aspect-[16/10] w-full bg-[#121415] relative overflow-hidden">
                    <img
                      src={fabric.studioImage}
                      alt={fabric.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    {fabric.is4KPack && (
                      <span className="absolute top-1 right-1 px-1 py-0.2 rounded-xs bg-black/80 text-[8px] font-mono text-[#D4AF37] border border-[#D4AF37]/30">
                        4K
                      </span>
                    )}
                  </div>
                  <div className="p-1.5 bg-black/85 text-[10px] text-white truncate font-medium border-t border-white/5">
                    {fabric.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </footer>
    </div>
  );
};
