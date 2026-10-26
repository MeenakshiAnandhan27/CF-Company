import React from 'react';
import { Search, X, RotateCw } from 'lucide-react';

export type NavFilter = 'ALL' | 'FABRICS' | 'DENIM & CHAMBRAY' | 'LACES' | 'GARMENT ACCESSORIES';

interface CatalogueNavigationProps {
  activeFilter: NavFilter;
  onSelectFilter: (filter: NavFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpen360?: () => void;
  totalMaterialsCount: number;
}

export const CatalogueNavigation: React.FC<CatalogueNavigationProps> = ({
  activeFilter,
  onSelectFilter,
  searchQuery,
  onSearchChange,
  onOpen360,
  totalMaterialsCount,
}) => {
  const filterTabs: { id: NavFilter; label: string }[] = [
    { id: 'ALL', label: 'All Materials' },
    { id: 'FABRICS', label: 'Fabrics' },
    { id: 'DENIM & CHAMBRAY', label: 'Denim & Chambray' },
    { id: 'LACES', label: 'Laces' },
    { id: 'GARMENT ACCESSORIES', label: 'Accessories' },
  ];

  return (
    <nav
      aria-label="Catalogue Filtering"
      className="sticky top-20 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-y border-[#E6E0D4] py-3 shadow-xs transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Filter Navigation Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar w-full md:w-auto py-1">
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectFilter(tab.id)}
                  className={`px-3 sm:px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#82553E] cursor-pointer ${
                    isActive
                      ? 'bg-[#181715] text-white shadow-xs'
                      : 'text-[#6A645A] hover:text-[#181715] hover:bg-[#EFECE5]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Right Tools: Search & 360° Studio */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end overflow-x-auto no-scrollbar py-0.5">
            {/* Quick Search Bar */}
            <div className="relative flex-1 md:w-48 lg:w-56 shrink-0">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C877E] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search raw weaves..."
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-[#DDD5C7] rounded-full placeholder-[#A39C91] text-[#181715] focus:outline-none focus:border-[#82553E] focus:ring-1 focus:ring-[#82553E] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C877E] hover:text-[#181715]"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* 360° Studio */}
            {onOpen360 && (
              <button
                type="button"
                onClick={onOpen360}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-[#181715] to-[#2E2519] text-[#FAF8F5] border border-[#D4AF37] hover:border-[#F2D785] rounded-full shadow-[0_2px_8px_rgba(212,175,55,0.2)] transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                title="Launch 360° 3D Fabric Atelier Studio"
              >
                <RotateCw className="w-3.5 h-3.5 text-[#D4AF37] animate-spin-slow" />
                <span className="hidden sm:inline">360° Studio</span>
                <span className="sm:hidden font-mono">360°</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
