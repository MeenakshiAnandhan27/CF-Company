import React, { useState, useEffect } from 'react';
import { businessConfig } from '../data/businessConfig.ts';
import { ProductCategory } from '../types.ts';
import { Menu, X, ArrowRight, Phone } from 'lucide-react';

interface NavbarProps {
  currentTab: 'home' | 'about' | 'catalogue' | 'reach-us';
  onNavigate: (tab: 'home' | 'about' | 'catalogue' | 'reach-us', category?: ProductCategory) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (tab: 'home' | 'about' | 'catalogue' | 'reach-us') => {
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
      {/* Top Bar Contract: Zone 1 (Brand) - Zone 2 (4 Links) - Zone 3 (Action) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Zone 1: Single text wordmark with subtle textile icon */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B2824] rounded-sm"
        >
          <span className="w-9 h-9 rounded-sm bg-[#1E1C1A] text-[#F9F7F4] flex items-center justify-center font-serif text-base font-bold tracking-wider transition-transform group-hover:scale-105 border border-[#3E3A34]">
            CF
          </span>
          <div>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#181715] block leading-none">
              {businessConfig.businessName}
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.16em] uppercase text-[#736F68] font-semibold block mt-1">
              {businessConfig.subtitle}
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#585550]">
          <button
            onClick={() => handleNavClick('home')}
            className={`transition-colors hover:text-[#181715] relative py-1 ${
              currentTab === 'home'
                ? 'text-[#181715] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#181715]'
                : ''
            }`}
          >
            HOME
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`transition-colors hover:text-[#181715] relative py-1 ${
              currentTab === 'about'
                ? 'text-[#181715] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#181715]'
                : ''
            }`}
          >
            ABOUT
          </button>
          <button
            onClick={() => handleNavClick('catalogue')}
            className={`transition-colors hover:text-[#181715] relative py-1 ${
              currentTab === 'catalogue'
                ? 'text-[#181715] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#181715]'
                : ''
            }`}
          >
            CATALOGUE
          </button>
          <button
            onClick={() => handleNavClick('reach-us')}
            className={`transition-colors hover:text-[#181715] relative py-1 ${
              currentTab === 'reach-us'
                ? 'text-[#181715] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#181715]'
                : ''
            }`}
          >
            REACH US
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => handleNavClick('catalogue')}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#FFFFFF] bg-[#181715] rounded hover:bg-[#302D29] transition-all duration-200 shadow-sm active:scale-[0.98]"
          >
            <span>Explore Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => handleNavClick('catalogue')}
            className="sm:hidden px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white bg-[#181715] rounded"
          >
            Catalogue
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
              currentTab === 'catalogue' ? 'bg-[#EFECE6] text-[#181715] font-semibold' : 'text-[#585550]'
            }`}
          >
            CATALOGUE
          </button>
          <button
            onClick={() => handleNavClick('reach-us')}
            className={`w-full text-left py-2.5 px-3 rounded text-sm font-medium ${
              currentTab === 'reach-us' ? 'bg-[#EFECE6] text-[#181715] font-semibold' : 'text-[#585550]'
            }`}
          >
            REACH US
          </button>

          <div className="pt-3 border-t border-[#E8E6E0] flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('catalogue')}
              className="w-full flex items-center justify-center gap-2 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#181715] rounded hover:bg-[#302D29]"
            >
              <span>Explore Digital Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center justify-between text-xs text-[#736F68] pt-2 px-1">
              <span className="flex items-center gap-1 font-mono text-[11px]">
                <Phone className="w-3.5 h-3.5 text-[#82553E]" />
                {businessConfig.phonePlaceholder}
              </span>
              <span>Wholesale &amp; Retail</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
