import React, { useState, useRef } from 'react';
import { FabricPackItem } from '../../data/fabricPack4KData.ts';
import { ZoomIn, ZoomOut, RotateCcw, Maximize, Sparkles } from 'lucide-react';

interface Fabric4KViewerProps {
  fabric: FabricPackItem;
  mode: 'studio-square' | 'panoramic-wide';
}

export const Fabric4KViewer: React.FC<Fabric4KViewerProps> = ({ fabric, mode }) => {
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const activeImage = mode === 'studio-square' ? fabric.studioImage : fabric.viewer360Image;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsPanning(true);
    dragStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * -0.002;
    setScale((prev) => Math.max(1, Math.min(4.5, prev + zoomDelta)));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-[#0A0D0C] select-none ${
        scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
      }`}
    >
      {/* Background Subtle Atelier Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.04)_0%,_transparent_75%)]" />

      {/* High-Resolution Master 4K Image Container */}
      <div
        className="transition-transform duration-75 ease-out flex items-center justify-center max-w-full max-h-full p-4"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        <img
          src={activeImage}
          alt={`${fabric.name} ${mode === 'studio-square' ? '4K Studio Master' : 'Panoramic Atelier 360 View'}`}
          draggable={false}
          className={`max-h-[75vh] object-contain rounded-lg shadow-2xl border border-white/10 ${
            mode === 'panoramic-wide' ? 'w-auto max-w-[90vw]' : 'aspect-square'
          }`}
        />
      </div>

      {/* Inspection Controls Floating Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-white shadow-xl">
        <button
          onClick={() => setScale((prev) => Math.max(1, prev - 0.5))}
          className="p-1.5 rounded-full hover:bg-white/15 transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <span className="font-mono text-xs px-2 text-[#C6A66B] font-bold">
          {Math.round(scale * 100)}%
        </span>

        <button
          onClick={() => setScale((prev) => Math.min(4.5, prev + 0.5))}
          className="p-1.5 rounded-full hover:bg-white/15 transition-colors cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-white/20 mx-1" />

        <button
          onClick={handleReset}
          className="p-1.5 rounded-full hover:bg-white/15 transition-colors cursor-pointer"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <span className="text-[11px] font-mono text-white/50 hidden sm:inline ml-1">
          {mode === 'studio-square' ? '3840×3840 Studio Master' : '4096×2048 Panoramic View'}
        </span>
      </div>

      {/* Reference Notice Header */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
        <div className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[11px] font-mono text-white/90 flex items-center gap-2 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-[#C6A66B]" />
          <span>REFERENCE: <strong className="text-[#C6A66B]">{mode === 'studio-square' ? '4K STUDIO PHOTOGRAPHY' : '4K WIDE ATELIER VIEW'}</strong></span>
          <span className="text-white/30">|</span>
          <span className="text-white/60">Authentic Fabric Reference</span>
        </div>
      </div>
    </div>
  );
};
