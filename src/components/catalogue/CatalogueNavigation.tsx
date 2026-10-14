import React from 'react';
import { Search, X, BookOpen, Sparkles, Filter, RotateCw } from 'lucide-react';

export type NavFilter = 'ALL' | 'FABRICS' | 'DENIM & CHAMBRAY' | 'LACES' | 'GARMENT ACCESSORIES';

interface CatalogueNavigationProps {
  activeFilter: NavFilter;
  onSelectFilter: (filter: NavFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenDigitalBook: () => void;
  onOpen360?: () => void;
  totalMaterialsCount: number;
}

export const CatalogueNavigation: React.FC<CatalogueNavigationProps> = ({
  activeFilter,
  onSelectFilter,
  searchQuery,
  onSearchChange,
  onOpenDigitalBook,
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
      className="sticky top-16 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-y border-[#E6E0D4] py-3 shadow-xs transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Filter Navigation Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar w-full md:w-auto py-1">
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectFilter(tab.id)}
                  className={`px-3 sm:px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#82553E] ${
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

          {/* Right Tools: Search & Digital Book Launcher */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Quick Search Bar */}
            <div className="relative flex-1 md:w-56 lg:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C877E] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search raw weaves, laces..."
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

            {/* 360° FABRIC STUDIO (Turntable Experience) */}
            {onOpen360 && (
              <button
                type="button"
                onClick={onOpen360}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-[#181715] text-[#FAF8F5] hover:bg-[#82553E] rounded-full shadow-xs transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5 text-[#C89D6B]" />
                <span className="hidden sm:inline">360° Studio</span>
                <span className="sm:hidden">360°</span>
              </button>
            )}

            {/* OPEN DIGITAL CATALOGUE (Book Experience) */}
            <button
              type="button"
              onClick={onOpenDigitalBook}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider bg-[#82553E] text-white hover:bg-[#6e4632] rounded-full shadow-xs transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Open Digital Catalogue</span>
              <span className="sm:hidden">Lookbook</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
