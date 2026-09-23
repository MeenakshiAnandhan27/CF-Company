import React, { useState } from 'react';
import { Product } from '../types.ts';

interface TextileVisualProps {
  product?: Partial<Product>;
  patternType?: Product['patternType'] | string;
  category?: string;
  name?: string;
  className?: string;
  aspectRatio?: '4:3' | '16:9' | '1:1' | 'auto';
  src?: string;
}

export const TextileVisual: React.FC<TextileVisualProps> = ({
  product,
  patternType = product?.patternType || 'woven-fabric',
  category = product?.categoryLabel || 'Textile',
  name = product?.name || 'Material Sample',
  className = '',
  aspectRatio = '4:3',
  src,
}) => {
  const [imgError, setImgError] = useState(false);

  const aspectClass = {
    '4:3': 'aspect-[4/3]',
    '16:9': 'aspect-[16/9]',
    '1:1': 'aspect-square',
    'auto': '',
  }[aspectRatio];

  if (src && !imgError) {
    return (
      <div className={`relative overflow-hidden bg-[#F2F0EB] ${aspectClass} ${className}`}>
        <img
          src={src}
          alt={product?.imageAlt || name}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
        />
      </div>
    );
  }

  // Domain-authentic tactile SVG patterns for each textile & processing type
  const renderPattern = () => {
    switch (patternType) {
      case 'embroidery-lace':
      case 'other-lace':
        return (
          <div className="absolute inset-0 bg-[#2C2926] text-[#E5DFD7] flex items-center justify-center overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="embroidery-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                  <path d="M24 0 C12 12, 12 36, 24 48 C36 36, 36 12, 24 0 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                  <path d="M0 24 C12 12, 36 12, 48 24 C36 36, 12 36, 0 24 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                  <circle cx="24" cy="24" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="24" cy="24" r="1.5" fill="currentColor" />
                  <circle cx="0" cy="0" r="2" fill="currentColor" opacity="0.6" />
                  <circle cx="48" cy="0" r="2" fill="currentColor" opacity="0.6" />
                  <circle cx="0" cy="48" r="2" fill="currentColor" opacity="0.6" />
                  <circle cx="48" cy="48" r="2" fill="currentColor" opacity="0.6" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#embroidery-grid)" />
            </svg>
            <div className="relative z-10 flex flex-col items-center text-center p-6 bg-[#211F1D]/85 backdrop-blur-[2px] rounded-lg border border-[#44403B] max-w-[80%]">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#C2B7AA] mb-1 font-medium">Fine Needlework</span>
              <span className="font-serif text-lg text-[#F9F7F4] tracking-wide">{name}</span>
            </div>
          </div>
        );

      case 'cotton-lace':
        return (
          <div className="absolute inset-0 bg-[#EFECE6] text-[#59534B] flex items-center justify-center overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="cotton-lace-mesh" width="32" height="32" patternUnits="userSpaceOnUse">
                  <circle cx="16" cy="16" r="8" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2,2" />
                  <circle cx="16" cy="16" r="3" fill="none" stroke="currentColor" strokeWidth="1" />
                  <path d="M0 16 L32 16 M16 0 L16 32" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
                  <circle cx="0" cy="0" r="4" fill="none" stroke="currentColor" strokeWidth="0.8" />
                  <circle cx="32" cy="0" r="4" fill="none" stroke="currentColor" strokeWidth="0.8" />
                  <circle cx="0" cy="32" r="4" fill="none" stroke="currentColor" strokeWidth="0.8" />
                  <circle cx="32" cy="32" r="4" fill="none" stroke="currentColor" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cotton-lace-mesh)" />
            </svg>
            <div className="relative z-10 flex flex-col items-center text-center p-5 bg-[#FAF9F5]/90 rounded-lg border border-[#D9D4CB] max-w-[80%] shadow-sm">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#8C8477] mb-1 font-medium">Soft Natural Fiber</span>
              <span className="font-serif text-lg text-[#2A2724]">{name}</span>
            </div>
          </div>
        );

      case 'lycra-lace':
        return (
          <div className="absolute inset-0 bg-[#252830] text-[#D0D6E2] flex items-center justify-center overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="lycra-stretch-pattern" width="36" height="24" patternUnits="userSpaceOnUse">
                  <path d="M0 12 Q 9 0, 18 12 T 36 12" fill="none" stroke="currentColor" strokeWidth="1" />
                  <path d="M0 24 Q 9 12, 18 24 T 36 24" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
                  <circle cx="18" cy="12" r="2" fill="currentColor" opacity="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#lycra-stretch-pattern)" />
            </svg>
            <div className="relative z-10 flex flex-col items-center text-center p-5 bg-[#1C1E24]/85 backdrop-blur-[2px] rounded-lg border border-[#3E4352] max-w-[80%]">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#9EA7BA] mb-1 font-medium">Elastic Contour Mesh</span>
              <span className="font-serif text-lg text-[#F2F4F8]">{name}</span>
            </div>
          </div>
        );

      case 'ric-rac':
        return (
          <div className="absolute inset-0 bg-[#3D2E28] text-[#E8DED8] flex items-center justify-center overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="ricrac-zig" width="40" height="24" patternUnits="userSpaceOnUse">
                  <path d="M0 6 L10 18 L20 6 L30 18 L40 6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M0 18 L10 30 L20 18 L30 30 L40 18" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#ricrac-zig)" />
            </svg>
            <div className="relative z-10 flex flex-col items-center text-center p-5 bg-[#2B201B]/90 rounded-lg border border-[#54433A] max-w-[80%]">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#C9B9B0] mb-1 font-medium">Braided Wave Trim</span>
              <span className="font-serif text-lg text-[#FBF8F5]">{name}</span>
            </div>
          </div>
        );

      case 'imported-lace':
        return (
          <div className="absolute inset-0 bg-[#1E2223] text-[#D8DEE0] flex items-center justify-center overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="imported-lace-pattern" width="56" height="56" patternUnits="userSpaceOnUse">
                  <path d="M28 4 C16 16, 8 28, 28 52 C48 28, 40 16, 28 4 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                  <circle cx="28" cy="28" r="8" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" />
                  <path d="M4 28 C16 16, 28 8, 52 28 C28 48, 16 40, 4 28 Z" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#imported-lace-pattern)" />
            </svg>
            <div className="relative z-10 flex flex-col items-center text-center p-5 bg-[#151819]/90 rounded-lg border border-[#3A4042] max-w-[80%]">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#A6B2B5] mb-1 font-medium">Global Specialty Weave</span>
              <span className="font-serif text-lg text-[#F7F9F9]">{name}</span>
            </div>
          </div>
        );

      case 'denim':
      case 'premium-denim':
      case 'garment-denim':
      case 'other-denim':
        return (
          <div className="absolute inset-0 bg-[#1A2F4C] text-[#8FAFD3] flex items-center justify-center overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="denim-twill" width="12" height="12" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="12" x2="12" y2="0" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="0" y1="6" x2="6" y2="0" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
                  <line x1="6" y1="12" x2="12" y2="6" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#denim-twill)" />
            </svg>
            <div className="relative z-10 flex flex-col items-center text-center p-5 bg-[#122137]/90 rounded-lg border border-[#2E4A74] max-w-[80%] shadow-sm">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#A7C2E4] mb-1 font-medium">Indigo Twill Weave</span>
              <span className="font-serif text-lg text-[#FFFFFF]">{name}</span>
            </div>
          </div>
        );

      case 'chambray':
        return (
          <div className="absolute inset-0 bg-[#425B74] text-[#B8CADB] flex items-center justify-center overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-45" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="chambray-grid" width="8" height="8" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="8" y2="0" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.6" />
                  <line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" strokeWidth="0.8" opacity="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#chambray-grid)" />
            </svg>
            <div className="relative z-10 flex flex-col items-center text-center p-5 bg-[#2A3E54]/90 rounded-lg border border-[#526F8D] max-w-[80%]">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#CBDCEB] mb-1 font-medium">Heathered Warp &amp; Weft</span>
              <span className="font-serif text-lg text-[#FFFFFF]">{name}</span>
            </div>
          </div>
        );

      case 'mesh':
      case 'lycra-mesh':
      case 'other-mesh':
        return (
          <div className="absolute inset-0 bg-[#212429] text-[#7A8291] flex items-center justify-center overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-50" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="mesh-dots" width="14" height="14" patternUnits="userSpaceOnUse">
                  <circle cx="7" cy="7" r="2.2" fill="none" stroke="currentColor" strokeWidth="1" />
                  <circle cx="0" cy="0" r="1.2" fill="currentColor" opacity="0.4" />
                  <circle cx="14" cy="0" r="1.2" fill="currentColor" opacity="0.4" />
                  <circle cx="0" cy="14" r="1.2" fill="currentColor" opacity="0.4" />
                  <circle cx="14" cy="14" r="1.2" fill="currentColor" opacity="0.4" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#mesh-dots)" />
            </svg>
            <div className="relative z-10 flex flex-col items-center text-center p-5 bg-[#171A1E]/90 rounded-lg border border-[#383E48] max-w-[80%]">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#9AA2B1] mb-1 font-medium">Breathable Pore Matrix</span>
              <span className="font-serif text-lg text-[#FFFFFF]">{name}</span>
            </div>
          </div>
        );

      case 'poplin-gada':
      case 'twill-gada':
      case 'drill-gada':
        return (
          <div className="absolute inset-0 bg-[#EDE7DD] text-[#696053] flex items-center justify-center overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-45" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="gada-weave" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M0 5 L10 5 M5 0 L5 10" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
                  <line x1="0" y1="10" x2="10" y2="0" stroke="currentColor" strokeWidth="0.7" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#gada-weave)" />
            </svg>
            <div className="relative z-10 flex flex-col items-center text-center p-5 bg-[#FAF7F2]/95 rounded-lg border border-[#D8CFBF] max-w-[80%] shadow-sm">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#877C6D] mb-1 font-medium">Natural Unbleached Weave</span>
              <span className="font-serif text-lg text-[#2C2720]">{name}</span>
            </div>
          </div>
        );

      case 'fur-fabric':
        return (
          <div className="absolute inset-0 bg-[#38312B] text-[#D8CCBD] flex items-center justify-center overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="fur-pile" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M2 18 Q 8 8, 14 2 M6 20 Q 12 10, 18 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                  <path d="M0 10 Q 5 4, 10 0" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#fur-pile)" />
            </svg>
            <div className="relative z-10 flex flex-col items-center text-center p-5 bg-[#26201B]/90 rounded-lg border border-[#4F443B] max-w-[80%]">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#B8A996] mb-1 font-medium">Plush Pile Surface</span>
              <span className="font-serif text-lg text-[#FAF7F2]">{name}</span>
            </div>
          </div>
        );

      case 'dyed-fabric':
      case 'woven-fabric':
      case 'other-fabric':
        return (
          <div className="absolute inset-0 bg-[#293B33] text-[#A3BFB1] flex items-center justify-center overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="fabric-weave-grid" width="12" height="12" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="12" y2="0" stroke="currentColor" strokeWidth="1" />
                  <line x1="0" y1="6" x2="12" y2="6" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
                  <line x1="0" y1="0" x2="0" y2="12" stroke="currentColor" strokeWidth="1" />
                  <line x1="6" y1="0" x2="6" y2="12" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#fabric-weave-grid)" />
            </svg>
            <div className="relative z-10 flex flex-col items-center text-center p-5 bg-[#1B2923]/90 rounded-lg border border-[#3C574B] max-w-[80%]">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#8EB0A0] mb-1 font-medium">Precision Solid Dye</span>
              <span className="font-serif text-lg text-[#F2F8F5]">{name}</span>
            </div>
          </div>
        );

      case 'tapes':
        return (
          <div className="absolute inset-0 bg-[#332B25] text-[#D8C7B8] flex items-center justify-center overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="twill-tape-herringbone" width="24" height="16" patternUnits="userSpaceOnUse">
                  <path d="M0 0 L12 8 L24 0 M0 8 L12 16 L24 8" fill="none" stroke="currentColor" strokeWidth="1.2" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#twill-tape-herringbone)" />
            </svg>
            <div className="relative z-10 flex flex-col items-center text-center p-5 bg-[#241E1A]/90 rounded-lg border border-[#4D4036] max-w-[80%]">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#BFAEA0] mb-1 font-medium">Herringbone &amp; Twill Spools</span>
              <span className="font-serif text-lg text-[#F9F6F2]">{name}</span>
            </div>
          </div>
        );

      case 'brand-tags':
        return (
          <div className="absolute inset-0 bg-[#222120] text-[#E0DDD8] flex items-center justify-center overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="tag-border-pattern" width="30" height="30" patternUnits="userSpaceOnUse">
                  <rect x="3" y="3" width="24" height="24" rx="2" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 2" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#tag-border-pattern)" />
            </svg>
            <div className="relative z-10 flex flex-col items-center text-center p-5 bg-[#171615]/90 rounded-lg border border-[#3E3C39] max-w-[80%]">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#AAA6A0] mb-1 font-medium">Woven Damask &amp; Identity</span>
              <span className="font-serif text-lg text-[#FAF9F7]">{name}</span>
            </div>
          </div>
        );

      case 'custom-buttons':
        return (
          <div className="absolute inset-0 bg-[#2E2824] text-[#E5D7CC] flex items-center justify-center overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="buttons-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="12" fill="none" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="20" cy="20" r="9" fill="none" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 2" />
                  <circle cx="17" cy="17" r="1.5" fill="currentColor" />
                  <circle cx="23" cy="17" r="1.5" fill="currentColor" />
                  <circle cx="17" cy="23" r="1.5" fill="currentColor" />
                  <circle cx="23" cy="23" r="1.5" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#buttons-pattern)" />
            </svg>
            <div className="relative z-10 flex flex-col items-center text-center p-5 bg-[#201B18]/90 rounded-lg border border-[#483F38] max-w-[80%]">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#C4B2A3] mb-1 font-medium">Fasteners &amp; Engravings</span>
              <span className="font-serif text-lg text-[#FAF6F2]">{name}</span>
            </div>
          </div>
        );

      case 'other-accessories':
      case 'edge-cutting':
      default:
        return (
          <div className="absolute inset-0 bg-[#1E252B] text-[#9FB3C8] flex items-center justify-center overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="scalping-pattern" width="30" height="30" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="15" x2="30" y2="15" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
                  <path d="M15 10 L20 15 L15 20" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#scalping-pattern)" />
            </svg>
            <div className="relative z-10 flex flex-col items-center text-center p-5 bg-[#14191D]/90 rounded-lg border border-[#2D3842] max-w-[80%]">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#869FB8] mb-1 font-medium">Precision Slitting &amp; Scalping</span>
              <span className="font-serif text-lg text-[#FFFFFF]">{name}</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`relative overflow-hidden bg-[#EFECE6] ${aspectClass} ${className} select-none transition-transform duration-500 group-hover:scale-[1.02]`}>
      {renderPattern()}
      <div className="absolute bottom-3 left-3 z-20 pointer-events-none">
        <span className="text-[10px] tracking-wider uppercase text-white/70 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded font-mono">
          {category}
        </span>
      </div>
    </div>
  );
};
