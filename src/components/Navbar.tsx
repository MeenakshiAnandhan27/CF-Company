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

  // The new custom navbar is active ONLY on the homepage 3D fabric hero before scrolling down
  const isHeroNavbar = currentTab === 'home' && scrollY < 220;

  const isReachUs = currentTab === 'reach-us';
  const isDarkNav = isReachUs;

  return (
    <>
      {/* =========================================================================
          1. NEW CUSTOM NAVBAR (ONLY for Homepage 1st 3D Fabric Hero Section)
          ========================================================================= */}
      {isHeroNavbar && (
        <header
          aria-label="Homepage Hero Navigation Bar"
          className="fixed top-0 left-0 right-0 z-40 bg-transparent border-b border-transparent transition-all duration-300"
        >
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 h-20 flex items-center justify-between gap-3 lg:gap-6 select-none">
            {/* Zone 1 (LEFT): CF Logo & "CLASSIC FASHIONS" directly over fabric background */}
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9C702E] rounded-xl shrink-0 cursor-pointer"
              aria-label="Classic Fashions Home"
            >
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center p-2 bg-[#181715] border border-[#D4AF37]/50 shadow-[0_2px_10px_rgba(212,175,55,0.25)] group-hover:scale-105 group-hover:border-[#F2D785] transition-all duration-300 shrink-0">
                <BrandLogo variant="white" size="xs" className="w-full h-auto transition-transform duration-300 group-hover:scale-105" />
              </div>
              <span className="font-serif text-sm sm:text-base lg:text-lg font-bold tracking-[0.14em] text-[#181715] uppercase whitespace-nowrap">
                {businessConfig.businessName}
              </span>
            </button>

            {/* Zone 2 (CENTRE): Translucent Ivory / Glass Pill-Shaped Navigation Bar */}
            <nav
              aria-label="Primary Navigation Pill"
              className="hidden md:flex items-center gap-1 lg:gap-2 px-4 lg:px-6 py-2 rounded-full bg-white/80 sm:bg-[#FAF8F5]/85 backdrop-blur-md border border-[#E8E2D5]/90 shadow-[0_4px_24px_rgba(24,23,21,0.06),0_1px_4px_rgba(212,175,55,0.04)]"
            >
              {navLinks.map((link) => {
                const isActive = currentTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`px-3 lg:px-4 py-1.5 rounded-full text-[11px] lg:text-xs font-semibold tracking-[0.12em] lg:tracking-[0.14em] uppercase transition-all duration-200 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'text-[#8C6226] font-bold bg-white shadow-2xs'
                        : 'text-[#635E55] hover:text-[#181715] hover:bg-white/60'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Zone 3 (RIGHT): Two Separate Controls Matched in Height */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* 1. Collection Button: Same height as Catalogue, Bag Icon with badge on TOP (not on right side) */}
              <button
                onClick={() => handleNavClick('collection')}
                className={`group relative inline-flex items-center justify-center h-10 sm:h-11 px-3.5 sm:px-4 rounded-full border transition-all duration-200 cursor-pointer shadow-2xs active:scale-[0.98] ${
                  isCollectionOpen
                    ? 'bg-[#181715] text-[#D4AF37] border-[#181715] shadow-xs'
                    : 'bg-white/85 hover:bg-white text-[#181715] border-[#E8E2D5] hover:border-[#9C702E] backdrop-blur-md'
                }`}
                aria-label={`View collection (${collectionCount} items)`}
                title="View selected swatches"
              >
                <div className="relative flex items-center justify-center">
                  <ShoppingBag
                    className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-200 group-hover:scale-110 ${
                      isCollectionOpen
                        ? 'text-[#D4AF37]'
                        : 'text-[#8C6226]'
                    }`}
                  />
                  {/* Count badge positioned ABOVE / ON TOP of the collection bag */}
                  {collectionCount > 0 && (
                    <span className="absolute -top-2.5 -right-2.5 min-w-[17px] h-[17px] px-1 rounded-full bg-[#8C6226] text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-xs border border-white">
                      {collectionCount}
                    </span>
                  )}
                </div>
              </button>

              {/* 2. Catalogue Button: Same height as Collection (h-10 sm:h-11), Gold/Cream Pill */}
              <button
                onClick={() => handleNavClick('catalogue')}
                className="group relative inline-flex items-center gap-2 sm:gap-2.5 h-10 sm:h-11 pl-2 pr-4 sm:pr-5 rounded-full text-white bg-gradient-to-r from-[#A77B33] via-[#B88B42] to-[#966C28] hover:from-[#B58739] hover:to-[#A37329] border border-[#F0D59D]/60 shadow-[0_3px_14px_rgba(156,112,46,0.30)] hover:shadow-[0_6px_22px_rgba(156,112,46,0.45)] hover:brightness-105 active:scale-[0.98] transition-all duration-200 cursor-pointer whitespace-nowrap"
                title="Explore product catalogue"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#F3E3C4] text-[#4A3210] flex items-center justify-center font-bold shadow-xs transition-transform duration-200 group-hover:scale-105 group-hover:translate-x-0.5">
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span className="font-mono text-[11px] sm:text-xs font-bold tracking-[0.16em] uppercase text-white drop-shadow-xs">
                  CATALOGUE
                </span>
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-[#5A554D] hover:text-[#181715] hover:bg-white/80 rounded-full transition-colors cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer for Hero mode */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-[#E8E2D5] bg-[#FAF8F5]/98 backdrop-blur-xl px-4 py-4 flex flex-col gap-1.5 shadow-[0_16px_30px_rgba(24,23,21,0.12)] animate-in fade-in slide-in-from-top-2 duration-200">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full text-left py-2.5 px-4 rounded-xl text-xs font-semibold tracking-[0.14em] uppercase transition-colors cursor-pointer ${
                    currentTab === link.id
                      ? 'bg-white text-[#8C6226] font-bold shadow-xs border border-[#E8E2D5]'
                      : 'text-[#5A554D] hover:bg-white/70 hover:text-[#181715]'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          )}
        </header>
      )}

      {/* =========================================================================
          2. ORIGINAL STANDARD NAVBAR (Active for all other options and scrolled mode)
          ========================================================================= */}
      {!isHeroNavbar && (
        <header
          className={`sticky top-0 z-40 transition-all duration-300 ${
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

            {/* Zone 3: Primary Actions - Right Edge Aligned */}
            <div className="hidden sm:flex items-center gap-3.5 shrink-0">
              {/* Original Collection Capsule */}
              <button
                onClick={() => handleNavClick('collection')}
                className={`group relative inline-flex items-center gap-2 pl-4 pr-2.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-full border transition-all duration-300 cursor-pointer shadow-xs active:scale-[0.98] ${
                  isDarkNav
                    ? 'bg-[#102C22] text-[#F3EBDD] border-[#2A5243] hover:border-[#C49A55]'
                    : (currentTab === 'collection' || isCollectionOpen)
                    ? 'bg-[#181715] text-white border-[#181715] shadow-md'
                    : 'bg-gradient-to-b from-[#FFFFFF] to-[#FAF8F5] hover:bg-white text-[#181715] border-[#D5D0C6] hover:border-[#D4AF37] hover:shadow-[0_4px_16px_rgba(212,175,55,0.18)]'
                }`}
                title="View selected material swatches"
              >
                <ShoppingBag className={`w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110 ${
                  isDarkNav ? 'text-[#C49A55]' : (currentTab === 'collection' || isCollectionOpen) ? 'text-[#D4AF37]' : 'text-[#8C6534]'
                }`} />
                <span className="font-mono text-[11px] tracking-[0.14em] font-bold">Collection</span>
                <span
                  className={`font-mono text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-extrabold transition-colors ${
                    isDarkNav
                      ? 'bg-[#C49A55] text-[#071B15]'
                      : (currentTab === 'collection' || isCollectionOpen)
                      ? 'bg-[#D4AF37] text-[#181715]'
                      : 'bg-[#181715] text-white group-hover:bg-[#8C6534]'
                  }`}
                >
                  {collectionCount}
                </span>
              </button>

              {/* Original Catalogue CTA Button */}
              <button
                onClick={() => handleNavClick('catalogue')}
                className="group relative inline-flex items-center gap-2.5 pl-5 pr-2 py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition-all duration-300 cursor-pointer shadow-xs active:scale-[0.98] text-[#181715] bg-[#EFECE6] hover:bg-[#E5E0D8] border border-[#D5D0C6]"
                title="Explore our full materials catalogue"
              >
                <span className="font-mono text-[11px] tracking-[0.14em] font-bold">Catalogue</span>
                <div className="w-6 h-6 rounded-full bg-[#181715] text-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:translate-x-0.5">
                  <ArrowRight className="w-3.5 h-3.5" />
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
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#181715] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {collectionCount}
                  </span>
                )}
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

          {/* Original Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div className={`md:hidden border-b px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200 ${
              isReachUs ? 'border-[#1A382C] bg-[#071B15]' : 'border-[#E8E6E0] bg-[#FBFBFA]'
            }`}>
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full text-left py-2.5 px-3 rounded text-sm font-medium ${
                    currentTab === link.id
                      ? isReachUs ? 'bg-[#102C22] text-[#E6C995] font-semibold' : 'bg-[#EFECE6] text-[#181715] font-semibold'
                      : isReachUs ? 'text-[#F3EBDD]/80' : 'text-[#585550]'
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
      )}
    </>
  );
};
