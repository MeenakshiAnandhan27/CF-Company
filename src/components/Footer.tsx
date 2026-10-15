import React from 'react';
import { businessConfig } from '../data/businessConfig.ts';
import { ProductCategory, NavigationTab } from '../types.ts';
import { Phone, Mail, MapPin, Clock, Sparkles } from 'lucide-react';
import { BrandLogo } from './BrandLogo.tsx';

interface FooterProps {
  onNavigate: (
    tab: NavigationTab,
    category?: ProductCategory
  ) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (
    tab: NavigationTab,
    cat?: ProductCategory
  ) => {
    onNavigate(tab, cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#100F0E] text-[#E5E0D8] border-t border-[#24211D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Business Bio (Col 1-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3 h-10">
              <div className="w-10 h-10 rounded-md bg-[#25221F] border border-[#3A3632] flex items-center justify-center p-1.5 shrink-0">
                <BrandLogo variant="white" size="sm" className="w-full h-auto" />
              </div>
              <span className="font-serif text-2xl font-bold text-white tracking-tight">
                {businessConfig.businessName}
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-[#A8A29A] leading-relaxed max-w-sm">
              Supplier of Garment Accessories &amp; Fabrics
              <br />
              Tiruppur, Tamil Nadu, India
            </p>
          </div>

          {/* Quick Links (Col 5-6) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="h-10 flex items-center">
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C4B7AA]">
                Quick Links
              </h4>
            </div>
            <ul className="space-y-2 text-xs text-[#A8A29A]">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-white transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('catalogue')}
                  className="hover:text-white transition-colors"
                >
                  Catalogue
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('material-request')}
                  className="hover:text-white transition-colors flex items-center gap-1 text-[#C4B7AA]"
                >
                  <span>Request a Material</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('collection')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>Dealer Collection</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('reach-us')}
                  className="hover:text-white transition-colors"
                >
                  Reach Us
                </button>
              </li>
            </ul>
          </div>

          {/* Categories (Col 7-9) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="h-10 flex items-center">
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C4B7AA]">
                Categories
              </h4>
            </div>
            <ul className="space-y-2 text-xs text-[#A8A29A]">
              <li>
                <button
                  onClick={() => handleNav('catalogue', 'laces')}
                  className="hover:text-white transition-colors text-left"
                >
                  Laces
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('catalogue', 'fabrics')}
                  className="hover:text-white transition-colors text-left"
                >
                  Fabrics
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('catalogue', 'denim')}
                  className="hover:text-white transition-colors text-left"
                >
                  Denim
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('catalogue', 'mesh')}
                  className="hover:text-white transition-colors text-left"
                >
                  Mesh
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('catalogue', 'accessories')}
                  className="hover:text-white transition-colors text-left"
                >
                  Accessories
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('catalogue', 'processing')}
                  className="hover:text-white transition-colors text-left"
                >
                  Processing
                </button>
              </li>
            </ul>
          </div>

          {/* Contact (Col 10-12) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="h-10 flex items-center">
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C4B7AA]">
                Contact Details
              </h4>
            </div>
            <div className="space-y-2.5 text-xs text-[#A8A29A]">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C4B7AA] shrink-0 mt-0.5" />
                <span>
                  Tiruppur, Tamil Nadu (View address on{' '}
                  <button
                    onClick={() => handleNav('reach-us')}
                    className="text-[#E0D5C7] underline hover:text-white"
                  >
                    Reach Us
                  </button>
                  )
                </span>
              </div>
              <div className="flex items-start gap-2 font-mono">
                <Phone className="w-3.5 h-3.5 text-[#C4B7AA] shrink-0 mt-0.5" />
                <span>{businessConfig.phonePlaceholder}</span>
              </div>
              <div className="flex items-start gap-2 font-mono">
                <Mail className="w-3.5 h-3.5 text-[#C4B7AA] shrink-0 mt-0.5" />
                <span className="truncate">{businessConfig.emailPlaceholder}</span>
              </div>
              <div className="flex items-start gap-2 font-mono">
                <Clock className="w-3.5 h-3.5 text-[#C4B7AA] shrink-0 mt-0.5" />
                <span>{businessConfig.workingHoursPlaceholder}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Copyright Centered */}
        <div className="mt-12 pt-8 border-t border-[#292622] flex items-center justify-center text-xs text-[#78736B]">
          <p className="text-center">© 2026 {businessConfig.businessName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
