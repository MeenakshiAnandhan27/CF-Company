import React, { useState } from 'react';
import { DiscoveryMaterial } from '../../data/catalogueDiscoveryData.ts';
import { Eye, ArrowUpRight } from 'lucide-react';

interface MaterialItemProps {
  material: DiscoveryMaterial;
  onClick: (material: DiscoveryMaterial) => void;
  size?: 'normal' | 'large' | 'compact';
  showCategoryLabel?: boolean;
}

export const MaterialItem: React.FC<MaterialItemProps> = ({
  material,
  onClick,
  size = 'normal',
  showCategoryLabel = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Size dimensions
  const circleSizeClass = {
    normal: 'w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44',
    large: 'w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52',
    compact: 'w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32',
  }[size];

  const displayImage = imageError && material.fallbackTexture
    ? material.fallbackTexture
    : material.image;

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
      className="group flex flex-col items-center text-center cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#82553E] focus-visible:ring-offset-4 rounded-2xl p-2 sm:p-3 transition-all duration-300"
      aria-label={`View ${material.name} material details`}
    >
      {/* Circular softly-masked raw material crop */}
      <div className="relative mb-3.5">
        <div
          className={`relative ${circleSizeClass} rounded-full overflow-hidden bg-[#EFECE6] border border-[#DDD5C7] shadow-xs transition-all duration-500 ease-out group-hover:shadow-md group-hover:border-[#82553E]/50 group-hover:scale-[1.03]`}
        >
          {/* Authentic Raw Material Image */}
          <img
            src={displayImage}
            alt={`Raw ${material.name} textile material`}
            loading="lazy"
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />

          {/* Soft natural radial vignette to create depth like physical textile lighting */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full pointer-events-none ring-1 ring-inset ring-black/5 bg-gradient-to-b from-transparent via-transparent to-black/10"
          />

          {/* Micro hover indicator: subtle "VIEW MATERIAL" badge */}
          <div
            aria-hidden="true"
            className={`absolute inset-0 rounded-full flex flex-col items-center justify-center bg-[#181715]/40 backdrop-blur-[1.5px] transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className="text-[10px] tracking-[0.2em] font-medium uppercase text-white/95 flex items-center gap-1 bg-[#181715]/80 px-2.5 py-1 rounded-full border border-white/20 shadow-xs">
              <Eye className="w-2.5 h-2.5" />
              <span>VIEW</span>
            </span>
          </div>
        </div>

        {/* Small floating action prompt on corner */}
        <div
          className={`absolute bottom-0 right-1 w-7 h-7 rounded-full bg-white border border-[#DDD5C7] text-[#181715] flex items-center justify-center shadow-xs transition-all duration-300 ${
            isHovered ? 'scale-110 bg-[#82553E] text-white border-[#82553E]' : 'scale-90 text-[#8C877E]'
          }`}
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Material name underneath with premium typography */}
      <div className="space-y-0.5 max-w-[180px]">
        {showCategoryLabel && (
          <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-[#8C877E]">
            {material.subcategory}
          </span>
        )}
        <h4 className="font-serif text-base sm:text-lg font-medium text-[#181715] tracking-tight group-hover:text-[#82553E] transition-colors duration-200">
          {material.name}
        </h4>
        <span className="block text-[11px] text-[#78736B] line-clamp-1 font-sans">
          {material.composition || material.weave || 'Garment Component'}
        </span>
      </div>
    </div>
  );
};
