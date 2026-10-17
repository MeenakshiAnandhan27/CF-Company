import React, { useState, useEffect } from 'react';
import { businessConfig } from '../data/businessConfig.ts';
import { ProductCategory, NavigationTab } from '../types.ts';
import { Menu, X, ArrowRight, Phone, ShoppingBag } from 'lucide-react';
import { BrandLogo } from './BrandLogo.tsx';
import { SlideToCatalogueButton } from './SlideToCatalogueButton.tsx';

interface NavbarProps {
  currentTab: NavigationTab;
  onNavigate: (
    tab: NavigationTab,
    category?: ProductCategory
  ) => void;
  collectionCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  collectionCount = 0,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (tab: NavigationTab) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isReachUs = false;
  const isDarkNav = false;

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
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
        <nav className={`hidden md:flex items-center gap-6 lg:gap-8 xl:gap-10 text-xs font-semibold uppercase tracking-wider ${
          isDarkNav ? 'text-[#F3EBDD]/80' : 'text-[#585550]'
        }`}>
          <button
            onClick={() => handleNavClick('home')}
            className={`whitespace-nowrap transition-colors relative py-2 ${
              currentTab === 'home'
                ? isDarkNav
                  ? 'text-[#F3EBDD] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#C49A55]'
                  : 'text-[#181715] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#181715]'
                : isDarkNav
                ? 'hover:text-[#E6C995]'
                : 'hover:text-[#181715]'
            }`}
          >
            HOME
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`whitespace-nowrap transition-colors relative py-2 ${
              currentTab === 'about'
                ? isDarkNav
                  ? 'text-[#F3EBDD] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#C49A55]'
                  : 'text-[#181715] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#181715]'
                : isDarkNav
                ? 'hover:text-[#E6C995]'
                : 'hover:text-[#181715]'
            }`}
          >
            ABOUT
          </button>
          <button
            onClick={() => handleNavClick('catalogue')}
            className={`whitespace-nowrap transition-colors relative py-2 ${
              currentTab === 'catalogue'
                ? isDarkNav
                  ? 'text-[#F3EBDD] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#C49A55]'
                  : 'text-[#181715] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#181715]'
                : isDarkNav
                ? 'hover:text-[#E6C995]'
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
                : isDarkNav
                ? 'text-[#F3EBDD]/80 hover:text-[#E6C995]'
                : 'text-[#82553E] hover:text-[#181715]'
            }`}
          >
            <span>REQUEST MATERIAL</span>
          </button>
          <button
            onClick={() => handleNavClick('reach-us')}
            className={`whitespace-nowrap transition-colors relative py-2 ${
              currentTab === 'reach-us'
                ? 'text-[#E6C995] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#C49A55]'
                : isDarkNav
                ? 'hover:text-[#E6C995]'
                : 'hover:text-[#181715]'
            }`}
          >
            REACH US
          </button>
        </nav>

        {/* Zone 3: Primary Actions - Right Edge Aligned Unique Magnetic Buttons */}
        <div className="hidden sm:flex items-center gap-3.5 shrink-0">
          {/* Unique Collection Capsule */}
          <button
            onClick={() => handleNavClick('collection')}
            className={`group relative inline-flex items-center gap-2 pl-4 pr-2.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-full border transition-all duration-300 cursor-pointer shadow-xs active:scale-[0.98] ${
              isDarkNav
                ? 'bg-[#102C22] text-[#F3EBDD] border-[#2A5243] hover:border-[#C49A55]'
                : currentTab === 'collection'
                ? 'bg-[#181715] text-white border-[#181715] shadow-md'
                : 'bg-gradient-to-b from-[#FFFFFF] to-[#FAF8F5] hover:bg-white text-[#181715] border-[#D5D0C6] hover:border-[#D4AF37] hover:shadow-[0_4px_16px_rgba(212,175,55,0.18)]'
            }`}
            title="View selected wholesale materials"
          >
            <ShoppingBag className={`w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110 ${
              isDarkNav ? 'text-[#C49A55]' : currentTab === 'collection' ? 'text-[#D4AF37]' : 'text-[#8C6534]'
            }`} />
            <span className="font-mono text-[11px] tracking-[0.14em] font-bold">Collection</span>
            <span
              className={`font-mono text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-extrabold transition-colors ${
                isDarkNav
                  ? 'bg-[#C49A55] text-[#071B15]'
                  : currentTab === 'collection'
                  ? 'bg-[#D4AF37] text-[#181715]'
                  : collectionCount > 0
                  ? 'bg-[#181715] text-[#D4AF37] border border-[#D4AF37]/50 shadow-xs'
                  : 'bg-[#ECE7DC] text-[#736F68]'
              }`}
            >
              {collectionCount}
            </span>
          </button>

          {/* Interactive Slide Left-to-Right Catalogue Button */}
          <SlideToCatalogueButton onSlideComplete={() => handleNavClick('catalogue')} />
        </div>

        {/* Mobile Buttons */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Collection shortcut */}
          <button
            onClick={() => handleNavClick('collection')}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider rounded border ${
              isReachUs ? 'bg-[#102C22] border-[#2A5243] text-[#F3EBDD]' : 'bg-[#FAF7F2] border-[#D5D0C6] text-[#181715]'
            }`}
          >
            <ShoppingBag className={`w-3.5 h-3.5 ${isReachUs ? 'text-[#C49A55]' : 'text-[#82553E]'}`} />
            <span>{collectionCount}</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-md transition-colors ${
              isReachUs ? 'text-[#F3EBDD] hover:bg-[#102C22]' : 'text-[#2B2824] hover:bg-[#EFECE6]'
            }`}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-b px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200 ${
          isReachUs ? 'border-[#1A382C] bg-[#071B15]' : 'border-[#E8E6E0] bg-[#FBFBFA]'
        }`}>
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left py-2.5 px-3 rounded text-sm font-medium ${
              currentTab === 'home'
                ? isReachUs ? 'bg-[#102C22] text-[#E6C995] font-semibold' : 'bg-[#EFECE6] text-[#181715] font-semibold'
                : isReachUs ? 'text-[#F3EBDD]/80' : 'text-[#585550]'
            }`}
          >
            HOME
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`w-full text-left py-2.5 px-3 rounded text-sm font-medium ${
              currentTab === 'about'
                ? isReachUs ? 'bg-[#102C22] text-[#E6C995] font-semibold' : 'bg-[#EFECE6] text-[#181715] font-semibold'
                : isReachUs ? 'text-[#F3EBDD]/80' : 'text-[#585550]'
            }`}
          >
            ABOUT
          </button>
          <button
            onClick={() => handleNavClick('catalogue')}
            className={`w-full text-left py-2.5 px-3 rounded text-sm font-medium ${
              currentTab === 'catalogue'
                ? isReachUs ? 'bg-[#102C22] text-[#E6C995] font-semibold' : 'bg-[#EFECE6] text-[#181715] font-semibold'
                : isReachUs ? 'text-[#F3EBDD]/80' : 'text-[#585550]'
            }`}
          >
            CATALOGUE
          </button>
          <button
            onClick={() => handleNavClick('material-request')}
            className={`w-full text-left py-2.5 px-3 rounded text-sm font-medium ${
              currentTab === 'material-request'
                ? isReachUs ? 'bg-[#102C22] text-[#E6C995] font-semibold' : 'bg-[#EFECE6] text-[#181715] font-semibold'
                : isReachUs ? 'text-[#C49A55]' : 'text-[#82553E]'
            }`}
          >
            REQUEST A MATERIAL
          </button>
          <button
            onClick={() => handleNavClick('collection')}
            className={`w-full text-left py-2.5 px-3 rounded text-sm font-medium flex items-center justify-between ${
              currentTab === 'collection'
                ? isReachUs ? 'bg-[#102C22] text-[#E6C995] font-semibold' : 'bg-[#EFECE6] text-[#181715] font-semibold'
                : isReachUs ? 'text-[#F3EBDD]/80' : 'text-[#585550]'
            }`}
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className={`w-4 h-4 ${isReachUs ? 'text-[#C49A55]' : 'text-[#82553E]'}`} />
              <span>COLLECTION</span>
            </span>
            <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
              isReachUs ? 'bg-[#C49A55] text-[#071B15]' : 'bg-[#181715] text-white'
            }`}>
              {collectionCount} items
            </span>
          </button>
          <button
            onClick={() => handleNavClick('reach-us')}
            className={`w-full text-left py-2.5 px-3 rounded text-sm font-medium ${
              currentTab === 'reach-us'
                ? isReachUs ? 'bg-[#102C22] text-[#E6C995] font-semibold' : 'bg-[#EFECE6] text-[#181715] font-semibold'
                : isReachUs ? 'text-[#F3EBDD]/80' : 'text-[#585550]'
            }`}
          >
            REACH US
          </button>

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
