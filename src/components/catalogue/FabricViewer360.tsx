import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  ArrowRight,
  Info,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { DiscoveryMaterial, ALL_DISCOVERY_MATERIALS } from '../../data/catalogueDiscoveryData.ts';

interface FabricViewer360Props {
  initialMaterial?: DiscoveryMaterial | null;
  isOpen: boolean;
  onClose: () => void;
  onEnquire?: (material: DiscoveryMaterial) => void;
  onRequestSample?: (material: DiscoveryMaterial) => void;
}

// 20 Authentic Studio Fabrics
export const STUDIO_360_FABRICS = [
  {
    id: 'mat-seersucker',
    name: 'Seersucker',
    type: 'Puckered Crinkle',
    composition: '100% Combed Cotton',
    width: '54" / 58"',
    gsm: '125 GSM',
    weave: 'Slack-Tension Puckered',
    image: '/assets/materials/fabrics/seersucker.jpg',
    sheen: 'Matte Soft Crinkle',
    desc: 'Slack-tension alternating warp threads form natural crinkles that lift the fabric away from skin, facilitating air circulation.',
  },
  {
    id: 'mat-putta',
    name: 'Putta fabric',
    type: 'Traditional Butta',
    composition: 'Cotton with Zari Motifs',
    width: '44" / 48"',
    gsm: '110 GSM',
    weave: 'Crisp Plain Traditional',
    image: '/assets/materials/fabrics/putta-fabric.jpg',
    sheen: 'Warm Gold Metallic Accent',
    desc: 'Traditional high-count plain cotton woven with intricate golden butta motifs for ethnic wear and heritage designer collections.',
  },
  {
    id: 'mat-plain',
    name: 'Plain',
    type: 'Woven Cotton Gada',
    composition: '100% Combed Cotton',
    width: '48" – 63"',
    gsm: '115 GSM',
    weave: '1/1 Balanced Plain Weave',
    image: '/assets/materials/fabrics/plain.jpg',
    sheen: 'Natural Matte',
    desc: 'Balanced 1/1 weave structure delivering uniform surface strength for shirting, pocket bags, and base garments.',
  },
  {
    id: 'mat-denim',
    name: 'Denim',
    type: 'Indigo Twill Weave',
    composition: '100% Ring-Spun Cotton',
    width: '56" – 62"',
    gsm: '380 GSM (13.5 oz)',
    weave: '3/1 Right-Hand Diagonal Twill',
    image: '/assets/materials/fabrics/denim.jpg',
    sheen: 'Deep Indigo Lustre',
    desc: 'Authentic 3/1 right-hand diagonal twill with genuine red-line selvedge edge, rich rope-dyed indigo warp and natural ecru weft.',
  },
  {
    id: 'mat-chambray',
    name: 'Chambray',
    type: 'Lightweight Denim Weave',
    composition: '100% Combed Cotton',
    width: '54" / 58"',
    gsm: '135 GSM',
    weave: '1/1 Yarn-Dyed Plain',
    image: '/assets/materials/fabrics/chambray.jpg',
    sheen: 'Heathered Soft Wash',
    desc: 'Lightweight plain-weave combining colored indigo warp with clean white weft yarns for relaxed casual shirting.',
  },
  {
    id: 'mat-stripes',
    name: 'Stripes',
    type: 'Yarn-Dyed Poplin',
    composition: '100% Combed Cotton',
    width: '54" / 58"',
    gsm: '130 GSM',
    weave: 'Yarn-Dyed Striped Plain',
    image: '/assets/materials/fabrics/stripes.jpg',
    sheen: 'Crisp Poplin Finish',
    desc: 'Precision yarn-dyed navy and white vertical stripes woven directly on high-speed airjet looms with sharp edge definition.',
  },
  {
    id: 'mat-checked',
    name: 'Checked',
    type: 'Buffalo Plaid Weave',
    composition: '100% Cotton Twill',
    width: '54" / 58"',
    gsm: '165 GSM',
    weave: 'Balanced Checked Twill',
    image: '/assets/materials/fabrics/checked.jpg',
    sheen: 'Rich Matte Texture',
    desc: 'Classic red, black, and white buffalo check weave with rich color saturation and balanced warp-weft intersection.',
  },
  {
    id: 'mat-flannel',
    name: 'Flannel fabrics',
    type: 'Brushed Thermal Cotton',
    composition: '100% Brushed Cotton',
    width: '54" / 58"',
    gsm: '185 GSM',
    weave: 'Napped Thermal Weave',
    image: '/assets/materials/fabrics/flannel-fabrics.jpg',
    sheen: 'Soft Velvety Nap',
    desc: 'Double-brushed surface textile featuring raised nap fibers that trap ambient air for insulating thermal warmth.',
  },
  {
    id: 'mat-taffeta',
    name: 'Taffeta',
    type: 'Couture Structure',
    composition: 'Polyester Silk Blend',
    width: '58" / 60"',
    gsm: '95 GSM',
    weave: 'Fine Crisp Ribbed Plain',
    image: '/assets/materials/fabrics/taffeta.jpg',
    sheen: 'Radiant Metallic Sheen',
    desc: 'High-density crisp weave with brilliant magenta luster, characteristic acoustic rustle, and architectural drape.',
  },
  {
    id: 'mat-satin',
    name: 'Satin fabrics (pc)polyster',
    type: 'Liquid Drape Satin',
    composition: 'Polyester / PC Satin',
    width: '48" / 58"',
    gsm: '145 GSM',
    weave: '5-End Floating Warp Satin',
    image: '/assets/materials/fabrics/satin-polyester.jpg',
    sheen: 'High-Gloss Liquid Wine',
    desc: 'Long floating warp threads produce a fluid, liquid-like deep wine red reflection and ultra-smooth hand feel.',
  },
  {
    id: 'mat-mesh',
    name: 'Mesh fabrics (cotton & polys & lycra)',
    type: 'Open-Pore Athletic Knit',
    composition: 'Cotton, Polyester & Lycra',
    width: '54" / 60"',
    gsm: '140 GSM',
    weave: 'Hexagonal Open-Cell Knit',
    image: '/assets/materials/fabrics/mesh-fabrics.jpg',
    sheen: 'Technical Matte',
    desc: 'Engineered hexagonal open-cell breathability combined with 4-way elastic stretch for activewear and lining inserts.',
  },
  {
    id: 'mat-canvas-gada',
    name: 'Canvas gada',
    type: 'Heavy Unbleached Gada',
    composition: '100% Natural Cotton',
    width: '48" / 60"',
    gsm: '280 GSM',
    weave: 'Coarse Plied Plain Canvas',
    image: '/assets/materials/fabrics/canvas-gada.jpg',
    sheen: 'Loomstate Raw Texture',
    desc: 'Heavyweight unbleached plain canvas gada featuring visible cotton seed flecks and high tensile puncture resistance.',
  },
  {
    id: 'mat-fur',
    name: 'Fur',
    type: 'Leopard Plush Fur',
    composition: 'Microfiber Acrylic Plush',
    width: '58" / 62"',
    gsm: '420 GSM',
    weave: 'Knitted Long-Pile Faux Fur',
    image: '/assets/materials/fabrics/fur.jpg',
    sheen: 'Deep Soft Fur Glow',
    desc: 'Plush high-pile leopard faux fur with multidirectional silky hair texture for collars, outerwear, and statement trims.',
  },
  {
    id: 'mat-chiffon',
    name: 'Chiffon fabrics',
    type: 'Embroidered Sheer',
    composition: 'Polyester Viscose Chiffon',
    width: '44" / 58"',
    gsm: '65 GSM',
    weave: 'Alternating Crepe Twist',
    image: '/assets/materials/fabrics/chiffon-fabrics.jpg',
    sheen: 'Translucent Ethereal',
    desc: 'Ultra-lightweight sheer crepe weave with delicate tone-on-tone embroidered floral motifs and floating drape.',
  },
  {
    id: 'mat-velvet',
    name: 'Velvet',
    type: 'Crushed Emerald Velvet',
    composition: 'Cotton / Poly-Spandex Pile',
    width: '54" / 58"',
    gsm: '320 GSM',
    weave: 'Woven Dense Cut Pile',
    image: '/assets/materials/fabrics/velvet.jpg',
    sheen: 'Jewel-Tone Deep Refraction',
    desc: 'Sumptuous emerald green cut-pile velvet that captures light with deep chiaroscuro highlights across every fold.',
  },
  {
    id: 'mat-linen',
    name: 'Linen',
    type: 'Natural Slub Flax',
    composition: '100% Pure Flax Linen',
    width: '54" / 58"',
    gsm: '160 GSM',
    weave: 'Natural Slub Plain Weave',
    image: '/assets/materials/fabrics/linen.jpg',
    sheen: 'Organic Flax Luster',
    desc: 'Characteristic irregular flax slub yarns offering natural breathability, cool touch, and organic rustic elegance.',
  },
  {
    id: 'mat-cotton',
    name: 'Cotton',
    type: 'Combed White Poplin',
    composition: '100% Combed Cotton',
    width: '44" – 63"',
    gsm: '120 GSM',
    weave: '60s Fine Poplin Weave',
    image: '/assets/materials/fabrics/cotton.jpg',
    sheen: 'Clean Optical White',
    desc: 'Pristine optic white combed cotton shirting with balanced density, smooth printing face, and gentle skin feel.',
  },
  {
    id: 'mat-polyester',
    name: 'Polyster',
    type: 'High-Tenacity Poly',
    composition: '100% Filament Polyester',
    width: '58" / 60"',
    gsm: '150 GSM',
    weave: 'Fine Plain Poly Weave',
    image: '/assets/materials/fabrics/polyester.jpg',
    sheen: 'Smooth Steel Grey',
    desc: 'Wrinkle-free slate grey smooth polyester engineered for corporate workwear, uniforms, and abrasion-resistant linings.',
  },
  {
    id: 'mat-poly-cotton',
    name: 'Poly-cotton',
    type: 'Blended Shirting Cloth',
    composition: '65% Poly / 35% Cotton',
    width: '48" / 58"',
    gsm: '130 GSM',
    weave: 'Fine Blended Weave',
    image: '/assets/materials/fabrics/poly-cotton.jpg',
    sheen: 'Soft Sky Blue Sheen',
    desc: 'Even pastel sky blue blend pairing cotton breathability with polyester durability and easy-care wash resistance.',
  },
  {
    id: 'mat-additional-sample',
    name: 'Additional Sample (to fill grid)',
    type: 'Ornate Jacquard Tapestry',
    composition: 'Cotton / Metallic Rayon Blend',
    width: '54" / 58"',
    gsm: '290 GSM',
    weave: 'Multi-Color Jacquard Brocade',
    image: '/assets/materials/fabrics/jacquard-tapestry.jpg',
    sheen: 'Antique Tapestry Glow',
    desc: 'Intricate multi-color paisley floral brocade weave suitable for decorative vests, heritage borders, and couture accents.',
  },
];

export const FabricViewer360: React.FC<FabricViewer360Props> = ({
  initialMaterial,
  isOpen,
  onClose,
  onEnquire,
  onRequestSample,
}) => {
  // Find current active fabric
  const [selectedFabricIndex, setSelectedFabricIndex] = useState<number>(0);
  const [rotationY, setRotationY] = useState<number>(0);
  const [rotationX, setRotationX] = useState<number>(10);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isAutoSpinning, setIsAutoSpinning] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Set initial fabric if passed
  useEffect(() => {
    if (initialMaterial) {
      const idx = STUDIO_360_FABRICS.findIndex(
        (f) =>
          f.name.toLowerCase() === initialMaterial.name.toLowerCase() ||
          f.id === initialMaterial.id ||
          initialMaterial.name.toLowerCase().includes(f.name.toLowerCase())
      );
      if (idx >= 0) {
        setSelectedFabricIndex(idx);
      }
    }
  }, [initialMaterial]);

  // Auto-spin turntable physics loop
  useEffect(() => {
    if (!isOpen || !isAutoSpinning || isDragging) return;

    const interval = setInterval(() => {
      setRotationY((prev) => (prev + 0.6) % 360);
    }, 24);

    return () => clearInterval(interval);
  }, [isOpen, isAutoSpinning, isDragging]);

  // Keyboard navigation & escape listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        setSelectedFabricIndex((prev) => (prev + 1) % STUDIO_360_FABRICS.length);
      } else if (e.key === 'ArrowLeft') {
        setSelectedFabricIndex((prev) => (prev - 1 + STUDIO_360_FABRICS.length) % STUDIO_360_FABRICS.length);
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsAutoSpinning((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Mouse drag handlers for 360 rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsAutoSpinning(false);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      setRotationY((prev) => (prev + deltaX * 0.7 + 360) % 360);
      setRotationX((prev) => Math.max(-35, Math.min(35, prev - deltaY * 0.4)));

      setDragStart({ x: e.clientX, y: e.clientY });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setIsAutoSpinning(false);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;

    const deltaX = e.touches[0].clientX - dragStart.x;
    const deltaY = e.touches[0].clientY - dragStart.y;

    setRotationY((prev) => (prev + deltaX * 0.8 + 360) % 360);
    setRotationX((prev) => Math.max(-35, Math.min(35, prev - deltaY * 0.4)));

    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  if (!isOpen) return null;

  const currentFabric = STUDIO_360_FABRICS[selectedFabricIndex];

  // Dynamic specular highlight based on rotation angle (simulates physical light sheen)
  const normalizedAngle = Math.round(rotationY) % 360;
  const lightIntensity = Math.abs(Math.sin((normalizedAngle * Math.PI) / 180));
  const lightPositionX = 50 + Math.cos((normalizedAngle * Math.PI) / 180) * 45;
  const lightPositionY = 40 + Math.sin((rotationX * Math.PI) / 180) * 20;

  // Check if back face is visible (when Y rotation is between 90° and 270°)
  const isBackFace = normalizedAngle > 90 && normalizedAngle < 270;

  const handleQuickAngle = (degY: number, degX: number) => {
    setIsAutoSpinning(false);
    setRotationY(degY);
    setRotationX(degX);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="360 Degree Fabric Studio Inspection"
      className="fixed inset-0 z-50 bg-[#0E0D0C]/95 backdrop-blur-xl flex flex-col justify-between overflow-hidden select-none"
    >
      {/* ==================== TOP NAVIGATION BAR ==================== */}
      <header className="px-4 sm:px-8 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#82553E] text-white flex items-center justify-center shadow-xs">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C89D6B] font-bold">
                CLASSIC FASHIONS ATELIER
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/90 border border-white/10">
                360° TEXTILE TURNTABLE
              </span>
            </div>
            <h2 className="font-['Marcellus',serif] text-xl sm:text-2xl font-normal text-white tracking-wide">
              {currentFabric.name}
            </h2>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2">
          {/* Angle Indicator Pill */}
          <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#DDD5C8]">
            <span>ROTATION: <strong className="text-[#C89D6B]">{normalizedAngle}°</strong></span>
            <span className="text-white/20">|</span>
            <span>TILT: <strong className="text-[#C89D6B]">{Math.round(rotationX)}°</strong></span>
          </div>

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

      {/* ==================== MAIN 360° 3D STAGE ==================== */}
      <main
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        className="relative flex-1 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ perspective: '1400px' }}
      >
        {/* Subtle Ambient Radial Lighting in Center Stage */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(200, 157, 107, 0.12) 0%, rgba(14, 13, 12, 0.95) 75%)',
          }}
        />

        {/* Turntable Floor Disc with Grid Circles */}
        <div
          aria-hidden="true"
          className="absolute bottom-16 sm:bottom-20 w-[420px] sm:w-[560px] h-[180px] sm:h-[220px] rounded-full border border-white/15 pointer-events-none transition-transform"
          style={{
            transform: `rotateX(75deg) rotateZ(${rotationY * 0.5}deg)`,
            background:
              'radial-gradient(ellipse at center, rgba(200, 157, 107, 0.15) 0%, transparent 70%)',
          }}
        />

        {/* ==================== 3D FLOATING SWATCH ==================== */}
        <div
          className="relative transition-transform ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `scale(${zoomLevel}) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
            transitionDuration: isDragging ? '0ms' : '120ms',
            willChange: 'transform',
          }}
        >
          {/* Physical Swatch Chassis */}
          <div
            className="relative w-[280px] sm:w-[420px] md:w-[480px] aspect-[16/10] rounded-2xl p-2.5 bg-[#FAF7F2] border border-[#DDD5C7] shadow-[0_35px_70px_rgba(0,0,0,0.65)]"
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Top Swatch Hanger / Brass Tag Clip */}
            <div
              aria-hidden="true"
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-4 rounded-full bg-gradient-to-r from-[#C2AA76] via-[#F4E8CE] to-[#8C7A52] border border-[#B89F6B] shadow-md z-30 pointer-events-none flex items-center justify-center"
            >
              <div className="w-2.5 h-1.5 rounded-full bg-[#181715]/40" />
            </div>

            {/* Front & Back Faces */}
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#ECE6DC] border border-[#DDD5C7]">
              {/* Actual HD Swatch Texture */}
              <img
                src={currentFabric.image}
                alt={currentFabric.name}
                draggable={false}
                className="w-full h-full object-cover transition-opacity duration-300"
                style={{
                  filter: isBackFace ? 'brightness(0.85) contrast(0.95)' : 'brightness(1.02) contrast(1.02)',
                  transform: isBackFace ? 'scaleX(-1)' : 'none',
                }}
              />

              {/* Dynamic Real-Time Specular Lighting Sheen Reflection */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none transition-opacity duration-75"
                style={{
                  background: `radial-gradient(circle at ${lightPositionX}% ${lightPositionY}%, rgba(255, 255, 255, ${
                    0.25 + lightIntensity * 0.35
                  }) 0%, transparent 65%)`,
                  mixBlendMode: 'overlay',
                }}
              />

              {/* Reverse Face Indicator Label when turned around */}
              {isBackFace && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] pointer-events-none">
                  <span className="text-xs font-mono uppercase tracking-[0.25em] text-white/95 px-3 py-1.5 rounded-full bg-black/80 border border-white/20 shadow-md">
                    REVERSE WEFT FACE (180°)
                  </span>
                </div>
              )}

              {/* Tactile Edge Fringe / Selvage indicator */}
              <div
                aria-hidden="true"
                className="absolute right-0 inset-y-0 w-2.5 bg-gradient-to-l from-white/30 to-transparent pointer-events-none border-l border-white/10"
              />
            </div>
          </div>
        </div>

        {/* Drag To Spin Helper Prompt (Fades out when interacting) */}
        {!isDragging && (
          <div
            aria-hidden="true"
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-black/70 border border-white/15 text-xs text-white/80 backdrop-blur-md pointer-events-none shadow-lg"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#C89D6B] animate-spin-slow" />
            <span className="font-['Outfit',sans-serif]">Click &amp; Drag freely to rotate 360°</span>
          </div>
        )}

        {/* Left / Right Quick Fabric Switcher Floating Arrows */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedFabricIndex((prev) => (prev - 1 + STUDIO_360_FABRICS.length) % STUDIO_360_FABRICS.length);
          }}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center transition-all hover:scale-110 shadow-lg cursor-pointer"
          title="Previous Fabric (Left Arrow)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedFabricIndex((prev) => (prev + 1) % STUDIO_360_FABRICS.length);
          }}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center transition-all hover:scale-110 shadow-lg cursor-pointer"
          title="Next Fabric (Right Arrow)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </main>

      {/* ==================== CONTROL DOCK & SPECIFICATIONS ==================== */}
      <footer className="border-t border-white/10 bg-black/60 backdrop-blur-md px-4 sm:px-8 py-4 space-y-4">
        {/* Row 1: Turntable Controls & Angle Presets */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Quick Angle Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#A69B8D] mr-1 hidden sm:inline">
              PRESETS:
            </span>
            <button
              onClick={() => handleQuickAngle(0, 10)}
              className={`px-3 py-1 rounded-full text-xs font-mono uppercase transition-colors cursor-pointer ${
                normalizedAngle === 0 ? 'bg-[#82553E] text-white font-bold' : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              0° Front
            </button>
            <button
              onClick={() => handleQuickAngle(45, 15)}
              className={`px-3 py-1 rounded-full text-xs font-mono uppercase transition-colors cursor-pointer ${
                normalizedAngle === 45 ? 'bg-[#82553E] text-white font-bold' : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              45° Bias
            </button>
            <button
              onClick={() => handleQuickAngle(90, 5)}
              className={`px-3 py-1 rounded-full text-xs font-mono uppercase transition-colors cursor-pointer ${
                normalizedAngle === 90 ? 'bg-[#82553E] text-white font-bold' : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              90° Selvage
            </button>
            <button
              onClick={() => handleQuickAngle(180, 10)}
              className={`px-3 py-1 rounded-full text-xs font-mono uppercase transition-colors cursor-pointer ${
                normalizedAngle === 180 ? 'bg-[#82553E] text-white font-bold' : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              180° Back
            </button>
            <button
              onClick={() => handleQuickAngle(315, 20)}
              className={`px-3 py-1 rounded-full text-xs font-mono uppercase transition-colors cursor-pointer ${
                normalizedAngle === 315 ? 'bg-[#82553E] text-white font-bold' : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              315° Drape
            </button>
          </div>

          {/* Turntable Action Controls: Auto-Spin, Zoom In/Out */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoSpinning(!isAutoSpinning)}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                isAutoSpinning
                  ? 'bg-[#C89D6B] text-[#181715] shadow-xs font-bold'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {isAutoSpinning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoSpinning ? 'PAUSE SPIN' : 'AUTO SPIN 360°'}</span>
            </button>

            <button
              onClick={() => setZoomLevel((prev) => Math.max(0.8, prev - 0.2))}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono text-white/60">{Math.round(zoomLevel * 100)}%</span>

            <button
              onClick={() => setZoomLevel((prev) => Math.min(2.5, prev + 0.2))}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Row 2: Fabric Technical Metadata & Swatch Carousel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Metadata Specifications (Cols 1-4) */}
          <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-xl p-3 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#C89D6B] block">
                {currentFabric.type} • {currentFabric.gsm}
              </span>
              <span className="font-medium text-white block text-sm">
                {currentFabric.composition}
              </span>
              <span className="text-[11px] text-[#A69B8D] block">
                {currentFabric.weave} ({currentFabric.width})
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
                  }
                }}
                className="shrink-0 px-4 py-2 bg-white text-[#181715] hover:bg-[#EAE6DF] rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Enquire Now
              </button>
            )}
          </div>

          {/* 20 Fabric Thumbnail Carousel (Cols 5-12) */}
          <div className="lg:col-span-8 overflow-x-auto flex items-center gap-2.5 py-1 scrollbar-thin">
            {STUDIO_360_FABRICS.map((fabric, idx) => {
              const isSelected = selectedFabricIndex === idx;

              return (
                <button
                  key={fabric.id}
                  onClick={() => {
                    setSelectedFabricIndex(idx);
                    setIsAutoSpinning(true);
                  }}
                  className={`group relative shrink-0 w-20 sm:w-24 rounded-lg overflow-hidden border transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'border-[#C89D6B] ring-2 ring-[#C89D6B]/50 scale-105'
                      : 'border-white/15 opacity-65 hover:opacity-100 hover:border-white/40'
                  }`}
                >
                  <div className="aspect-[16/10] w-full bg-[#181715]">
                    <img
                      src={fabric.image}
                      alt={fabric.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-1 bg-black/80 text-[10px] text-white truncate font-medium">
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
