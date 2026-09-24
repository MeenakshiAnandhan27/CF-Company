import React, { useState, useEffect } from 'react';
import { businessConfig } from '../data/businessConfig.ts';
import { ProductCategory, NavigationTab } from '../types.ts';
import { Menu, X, ArrowRight, Phone, ShoppingBag, Sparkles } from 'lucide-react';

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

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FBFBFA]/95 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.06)] border-b border-[#E8E6E0]'
          : 'bg-[#FBFBFA] border-b border-[#E8E6E0]'
      }`}
    >
      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Zone 1: Wordmark / Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B2824] rounded-sm shrink-0"
        >
          <span className="w-10 h-10 rounded-sm bg-[#1E1C1A] text-[#F9F7F4] flex items-center justify-center font-serif text-base font-bold tracking-wider transition-transform group-hover:scale-105 border border-[#3E3A34] shrink-0 shadow-xs">
            CF
          </span>
          <div className="flex flex-col justify-center">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#181715] block leading-snug whitespace-nowrap pt-0.5">
              {businessConfig.businessName}
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.14em] uppercase text-[#736F68] font-semibold block whitespace-nowrap leading-none mt-0.5">
              {businessConfig.subtitle}
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Clean, non-wrapping, perfectly aligned) */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-7 text-xs font-semibold uppercase tracking-wider text-[#585550]">
          <button
            onClick={() => handleNavClick('home')}
            className={`whitespace-nowrap transition-colors hover:text-[#181715] relative py-2 ${
              currentTab === 'home'
                ? 'text-[#181715] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#181715]'
                : ''
            }`}
          >
            HOME
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`whitespace-nowrap transition-colors hover:text-[#181715] relative py-2 ${
              currentTab === 'about'
                ? 'text-[#181715] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#181715]'
                : ''
            }`}
          >
            ABOUT
          </button>
          <button
            onClick={() => handleNavClick('catalogue')}
            className={`whitespace-nowrap transition-colors hover:text-[#181715] relative py-2 ${
              currentTab === 'catalogue'
                ? 'text-[#181715] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#181715]'
                : ''
            }`}
          >
            CATALOGUE
          </button>
          <button
            onClick={() => handleNavClick('material-request')}
            className={`whitespace-nowrap transition-colors hover:text-[#181715] relative py-2 flex items-center gap-1 ${
              currentTab === 'material-request'
                ? 'text-[#181715] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#181715]'
                : 'text-[#82553E]'
            }`}
          >
            <span>REQUEST MATERIAL</span>
          </button>
          <button
            onClick={() => handleNavClick('reach-us')}
            className={`whitespace-nowrap transition-colors hover:text-[#181715] relative py-2 ${
              currentTab === 'reach-us'
                ? 'text-[#181715] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#181715]'
                : ''
            }`}
          >
            REACH US
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Collection Utility + Quick CTA) */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          {/* Collection Shortcut */}
          <button
            onClick={() => handleNavClick('collection')}
            className={`whitespace-nowrap inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded border transition-all ${
              currentTab === 'collection'
                ? 'bg-[#181715] text-white border-[#181715]'
                : collectionCount > 0
                ? 'bg-[#EFE9E2] text-[#633F2E] border-[#D9C8B9] hover:bg-[#E7DDCE]'
                : 'bg-white text-[#585550] border-[#D5D0C6] hover:bg-[#F5F4F0]'
            }`}
            title="View selected wholesale materials"
          >
            <ShoppingBag className={`w-3.5 h-3.5 shrink-0 ${currentTab === 'collection' ? 'text-white' : 'text-[#82553E]'}`} />
            <span>Collection</span>
            <span
              className={`font-mono text-[11px] px-1.5 py-0.5 rounded leading-none ${
                currentTab === 'collection'
                  ? 'bg-white text-[#181715] font-bold'
                  : collectionCount > 0
                  ? 'bg-[#181715] text-white font-bold'
                  : 'bg-[#E8E4DC] text-[#403D38]'
              }`}
            >
              {collectionCount}
            </span>
          </button>

          <button
            onClick={() => handleNavClick('catalogue')}
            className="whitespace-nowrap inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-[#FFFFFF] bg-[#181715] rounded hover:bg-[#302D29] transition-all duration-200 shadow-sm active:scale-[0.98]"
          >
            <span>Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>

        {/* Mobile Buttons */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Collection shortcut */}
          <button
            onClick={() => handleNavClick('collection')}
            className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider bg-[#FAF7F2] border border-[#D5D0C6] text-[#181715] rounded"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#82553E]" />
            <span>{collectionCount}</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#2B2824] hover:bg-[#EFECE6] rounded-md transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E8E6E0] bg-[#FBFBFA] px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left py-2.5 px-3 rounded text-sm font-medium ${
              currentTab === 'home' ? 'bg-[#EFECE6] text-[#181715] font-semibold' : 'text-[#585550]'
            }`}
          >
            HOME
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`w-full text-left py-2.5 px-3 rounded text-sm font-medium ${
              currentTab === 'about' ? 'bg-[#EFECE6] text-[#181715] font-semibold' : 'text-[#585550]'
            }`}
          >
            ABOUT
          </button>
          <button
            onClick={() => handleNavClick('catalogue')}
            className={`w-full text-left py-2.5 px-3 rounded text-sm font-medium ${
              currentTab === 'catalogue'
                ? 'bg-[#EFECE6] text-[#181715] font-semibold'
                : 'text-[#585550]'
            }`}
          >
            CATALOGUE
          </button>
          <button
            onClick={() => handleNavClick('material-request')}
            className={`w-full text-left py-2.5 px-3 rounded text-sm font-medium ${
              currentTab === 'material-request'
                ? 'bg-[#EFECE6] text-[#181715] font-semibold'
                : 'text-[#82553E]'
            }`}
          >
            REQUEST A MATERIAL
          </button>
          <button
            onClick={() => handleNavClick('collection')}
            className={`w-full text-left py-2.5 px-3 rounded text-sm font-medium flex items-center justify-between ${
              currentTab === 'collection'
                ? 'bg-[#EFECE6] text-[#181715] font-semibold'
                : 'text-[#585550]'
            }`}
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#82553E]" />
              <span>COLLECTION</span>
            </span>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#181715] text-white">
              {collectionCount} items
            </span>
          </button>
          <button
            onClick={() => handleNavClick('reach-us')}
            className={`w-full text-left py-2.5 px-3 rounded text-sm font-medium ${
              currentTab === 'reach-us'
                ? 'bg-[#EFECE6] text-[#181715] font-semibold'
                : 'text-[#585550]'
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
              <span>Boyampalayam, Tiruppur</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
