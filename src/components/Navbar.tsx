import React, { useState, useEffect } from 'react';
import { businessConfig } from '../data/businessConfig.ts';
import { ProductCategory, NavigationTab } from '../types.ts';
import { Menu, X, ArrowRight, Phone, ShoppingBag } from 'lucide-react';
import { BrandLogo } from './BrandLogo.tsx';

interface NavbarProps {
  currentTab: NavigationTab;
  onNavigate: (
    tab: NavigationTab,
    category?: ProductCategory
  ) => void;
  collectionCount?: number;
  isCollectionOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  collectionCount = 0,
  isCollectionOpen = false,
}) => {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (tab: NavigationTab) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks: { id: NavigationTab; label: string }[] = [
    { id: 'home', label: 'HOME' },
    { id: 'about', label: 'ABOUT' },
    { id: 'catalogue', label: 'CATALOGUE' },
    { id: 'material-request', label: 'REQUEST MATERIAL' },
    { id: 'reach-us', label: 'REACH US' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrollY > 20
          ? 'bg-white/95 backdrop-blur-md shadow-[0_1px_4px_rgba(0,0,0,0.06)] border-b border-[#E8E6E0]'
          : 'bg-white border-b border-[#E8E6E0]'
      }`}
    >
      {/* Main Top Bar - Full Width Edge-to-Edge with Balanced Alignment */}
      <div className="w-full px-4 sm:px-8 md:px-10 lg:px-12 xl:px-14 h-20 flex items-center justify-between">
        {/* Zone 1: Wordmark / Logo - Left Edge Aligned */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded-lg shrink-0 cursor-pointer"
        >
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center p-2 transition-all duration-300 group-hover:scale-110 shrink-0 bg-[#181715] border border-[#D4AF37]/60 group-hover:border-[#F2D785] shadow-[0_2px_10px_rgba(212,175,55,0.25)] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.85),0_0_50px_rgba(212,175,55,0.45)] group-active:scale-95 group-active:shadow-[0_0_35px_rgba(212,175,55,1),0_0_65px_rgba(212,175,55,0.6)]">
            <BrandLogo variant="white" size="sm" className="w-full h-auto transition-transform duration-300 group-hover:scale-105" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-display text-lg sm:text-xl font-bold tracking-[0.12em] block leading-none whitespace-nowrap uppercase transition-colors text-[#181715] group-hover:text-[#8C6534]">
              {businessConfig.businessName}
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links - Spaced & Balanced */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 xl:gap-10 text-xs font-semibold uppercase tracking-wider text-[#585550]">
          <button
            onClick={() => handleNavClick('home')}
            className={`whitespace-nowrap transition-colors relative py-2 ${
              currentTab === 'home'
                ? 'text-[#181715] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#181715]'
                : 'hover:text-[#181715]'
            }`}
          >
            HOME
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`whitespace-nowrap transition-colors relative py-2 ${
              currentTab === 'about'
                ? 'text-[#181715] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#181715]'
                : 'hover:text-[#181715]'
            }`}
          >
            ABOUT
          </button>
          <button
            onClick={() => handleNavClick('catalogue')}
            className={`whitespace-nowrap transition-colors relative py-2 ${
              currentTab === 'catalogue'
                ? 'text-[#181715] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#181715]'
                : 'hover:text-[#181715]'
            }`}
          >
            CATALOGUE
          </button>
          <button
            onClick={() => handleNavClick('material-request')}
            className={`whitespace-nowrap transition-colors relative py-2 flex items-center gap-1 ${
              currentTab === 'material-request'
                ? 'text-[#C69A59] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#C69A59]'
                : 'text-[#82553E] hover:text-[#181715]'
            }`}
          >
            <span>REQUEST MATERIAL</span>
          </button>
          <button
            onClick={() => handleNavClick('reach-us')}
            className={`whitespace-nowrap transition-colors relative py-2 ${
              currentTab === 'reach-us'
                ? 'text-[#181715] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#181715]'
                : 'hover:text-[#181715]'
            }`}
          >
            REACH US
          </button>
        </nav>

        {/* Zone 3: Primary Actions - Right Edge Aligned */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {/* Collection Capsule Button */}
          <button
            onClick={() => handleNavClick('collection')}
            className={`group relative inline-flex items-center gap-2.5 h-10 px-4 text-xs font-semibold uppercase tracking-wider rounded-full border transition-all duration-300 cursor-pointer shadow-xs active:scale-[0.98] ${
              (currentTab === 'collection' || isCollectionOpen)
                ? 'bg-[#181715] text-[#D4AF37] border-[#D4AF37]/80 shadow-[0_2px_12px_rgba(212,175,55,0.25)]'
                : 'bg-white hover:bg-[#FAF8F5] text-[#181715] border-[#D5D0C6] hover:border-[#D4AF37] hover:shadow-[0_3px_12px_rgba(212,175,55,0.18)]'
            }`}
            title="View selected material swatches"
          >
            <div className="relative flex items-center justify-center">
              <ShoppingBag className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
                (currentTab === 'collection' || isCollectionOpen) ? 'text-[#D4AF37]' : 'text-[#8C6534]'
              }`} />
              {collectionCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 min-w-[17px] h-[17px] px-1 rounded-full bg-[#8C6534] text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-xs border border-white">
                  {collectionCount}
                </span>
              )}
            </div>
            <span className="font-mono text-[11px] tracking-[0.14em] font-bold">Collection</span>
          </button>

          {/* Glowing Luxury Gold Catalogue CTA Button */}
          <button
            onClick={() => handleNavClick('catalogue')}
            className="group relative inline-flex items-center justify-center gap-2.5 h-10 pl-5 pr-1.5 text-xs font-semibold uppercase tracking-[0.16em] rounded-full transition-all duration-300 text-[#FFF8EC] bg-gradient-to-r from-[#181715] via-[#2A2620] to-[#181715] hover:from-[#24211D] hover:to-[#111110] border border-[#D4AF37] hover:border-[#F2D785] shadow-[0_4px_16px_rgba(212,175,55,0.30)] hover:shadow-[0_6px_28px_rgba(212,175,55,0.60)] active:scale-[0.98] cursor-pointer whitespace-nowrap"
            title="Explore our full materials catalogue"
          >
            <span className="font-mono text-[11px] tracking-[0.18em] font-bold text-[#FAF8F5]">
              Catalogue
            </span>
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#F2D785] to-[#B38728] text-[#181715] font-bold flex items-center justify-center transition-all duration-300 shadow-sm group-hover:scale-105 group-hover:translate-x-0.5">
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => handleNavClick('collection')}
            className="p-2 relative rounded-md text-[#2B2824] hover:bg-[#EFECE6]"
            aria-label="View collection"
          >
            <ShoppingBag className="w-5 h-5" />
            {collectionCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-[#8C6534] text-white text-[9px] rounded-full flex items-center justify-center font-bold px-0.5">
                {collectionCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md transition-colors text-[#2B2824] hover:bg-[#EFECE6]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200 border-[#E8E6E0] bg-[#FBFBFA]">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-left py-2.5 px-3 rounded text-sm font-medium ${
                currentTab === link.id
                  ? 'bg-[#EFECE6] text-[#181715] font-semibold'
                  : 'text-[#585550]'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="pt-3 border-t border-[#E8E6E0] flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('collection')}
              className="w-full flex items-center justify-center gap-2 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#181715] rounded hover:bg-[#302D29]"
            >
              <ShoppingBag className="w-4 h-4 text-[#E5D7CC]" />
              <span>View Selected Collection ({collectionCount})</span>
            </button>
            <div className="flex items-center justify-between text-xs text-[#736F68] pt-2 px-1">
              <span className="flex items-center gap-1 font-mono text-[11px]">
                <Phone className="w-3.5 h-3.5 text-[#82553E]" />
                {businessConfig.phonePlaceholder}
              </span>
              <span>Wholesale &amp; Retail Supply</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
