import React, { useState } from 'react';
import { DiscoveryMaterial } from '../../data/catalogueDiscoveryData.ts';
import { Eye, ArrowUpRight, Sparkles, RotateCw } from 'lucide-react';

interface MaterialItemProps {
  material: DiscoveryMaterial;
  onClick: (material: DiscoveryMaterial) => void;
  onOpen360?: (material: DiscoveryMaterial) => void;
  size?: 'normal' | 'large' | 'compact';
  showCategoryLabel?: boolean;
}

export const MaterialItem: React.FC<MaterialItemProps> = ({
  material,
  onClick,
  onOpen360,
  showCategoryLabel = true,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const displayImage = imageError && material.fallbackTexture
    ? material.fallbackTexture
    : material.image;

  const is360Available = material.category === 'FABRICS' || material.category === 'DENIM & CHAMBRAY';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(material)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(material);
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group w-full select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#82553E] focus-visible:ring-offset-4 rounded-2xl"
      style={{ perspective: '1000px' }}
      aria-label={`View ${material.name} material details`}
    >
      {/* 3D Physical Swatch Card Container */}
      <div
        className="relative w-full rounded-2xl p-2 bg-[#FAF7F2] border border-[#E6DFD3] ring-1 ring-black/5 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
        style={{
          transformStyle: 'preserve-3d',
          transform: isHovered
            ? 'translateY(-8px) rotateX(4deg) rotateY(-2deg) translateZ(8px)'
            : 'translateY(0) rotateX(0deg) rotateY(0deg) translateZ(0px)',
          boxShadow: isHovered
            ? '0 22px 42px -10px rgba(24, 23, 21, 0.22), 0 8px 18px -4px rgba(24, 23, 21, 0.1)'
            : '0 4px 14px rgba(24, 23, 21, 0.05)',
        }}
      >
        {/* Top Metallic Studio Swatch Pin / Clip */}
        <div
          aria-hidden="true"
          className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-2 rounded-full bg-gradient-to-r from-[#DDD3C4] via-[#F5EFE6] to-[#C9BAA5] border border-[#B8A68F]/50 shadow-xs z-20 pointer-events-none"
        />

        {/* Authentic Full Clear HD Raw Material Swatch Tile */}
        <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-[#ECE6DC] border border-[#DDD5C7] shadow-inner">
          <img
            src={displayImage}
            alt={`Raw ${material.name} fabric swatch`}
            loading="lazy"
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
              isHovered ? 'scale-108' : 'scale-100'
            }`}
          />

          {/* 3D Lighting & Sheen Reflection Overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-black/25 via-transparent to-white/30"
          />

          {/* Subtle Fabric selvage line */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#82553E]/40 to-transparent"
          />

          {/* Quick 360° Turntable Launcher Button - Only for Fabrics */}
          {is360Available && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpen360) {
                  onOpen360(material);
                } else {
                  onClick(material);
                }
              }}
              title={`Spin ${material.name} in 360° studio turntable`}
              className="absolute top-2 left-2 z-20 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#181715]/90 hover:bg-[#82553E] text-white text-[10px] font-mono tracking-wider backdrop-blur-xs border border-white/20 shadow-xs transition-all hover:scale-105 cursor-pointer"
            >
              <RotateCw className="w-2.5 h-2.5 text-[#C89D6B]" />
              <span>360°</span>
            </button>
          )}

          {/* Micro hover indicator */}
          <div
            aria-hidden="true"
            className={`absolute inset-0 flex items-center justify-center bg-[#181715]/40 backdrop-blur-[1px] transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className="text-[10px] tracking-[0.2em] font-semibold uppercase text-white flex items-center gap-1.5 bg-[#181715]/90 px-3 py-1.5 rounded-full border border-white/20 shadow-sm">
              {is360Available ? (
                <>
                  <RotateCw className="w-3 h-3 text-[#C89D6B]" />
                  <span>360° TURNTABLE</span>
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3 text-[#D4AF37]" />
                  <span>VIEW DETAILS</span>
                </>
              )}
            </span>
          </div>

          {/* Floating corner indicator icon */}
          <div
            className={`absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 backdrop-blur-xs border border-[#DDD5C7] text-[#181715] flex items-center justify-center shadow-xs transition-transform duration-300 ${
              isHovered ? 'scale-110 bg-[#82553E] text-white border-[#82553E]' : 'scale-90 text-[#7D766C]'
            }`}
          >
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* Swatch Details & Typography */}
        <div className="p-3 text-left space-y-1">
          {/* Subcategory metadata badge */}
          {showCategoryLabel && (
            <span className="block text-[9px] font-mono uppercase tracking-[0.22em] text-[#82553E] font-bold truncate">
              {material.subcategory}
            </span>
          )}

          {/* Exact Unique Fabric Name */}
          <h4 className="font-['Outfit',sans-serif] text-sm sm:text-base font-bold text-[#181715] leading-snug group-hover:text-[#82553E] transition-colors duration-200 truncate">
            {material.name}
          </h4>

          {/* Material Composition / Weave info */}
          <p className="text-[11px] text-[#6E685F] line-clamp-1 font-['Plus_Jakarta_Sans',sans-serif]">
            {material.composition || material.weave || 'Garment Fabric'}
          </p>
        </div>
      </div>
    </div>
  );
};
