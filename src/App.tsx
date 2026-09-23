import React, { useState } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { HomeIntro } from './components/HomeIntro.tsx';
import { CategoryCards } from './components/CategoryCards.tsx';
import { CatalogueView } from './components/CatalogueView.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { ReachUsView } from './components/ReachUsView.tsx';
import { Footer } from './components/Footer.tsx';
import { Chatbot } from './components/Chatbot.tsx';
import { ProductDetailModal } from './components/ProductDetailModal.tsx';
import { EnquiryModal } from './components/EnquiryModal.tsx';
import { Product, ProductCategory } from './types.ts';
import { products } from './data/products.ts';
import { ProductCard } from './components/ProductCard.tsx';
import { ArrowRight } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'about' | 'catalogue' | 'reach-us'>('home');
  const [catalogueCategory, setCatalogueCategory] = useState<ProductCategory | 'all'>('all');
  
  // Modal states
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [enquiryProduct, setEnquiryProduct] = useState<Product | null>(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  // Navigation handler
  const handleNavigate = (tab: 'home' | 'about' | 'catalogue' | 'reach-us', category?: ProductCategory) => {
    setCurrentTab(tab);
    if (category) {
      setCatalogueCategory(category);
    } else if (tab === 'catalogue' && !category) {
      setCatalogueCategory('all');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (category: ProductCategory) => {
    setCatalogueCategory(category);
    setCurrentTab('catalogue');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDetails = (product: Product) => {
    setDetailProduct(product);
  };

  const handleOpenEnquiry = (product: Product) => {
    setEnquiryProduct(product);
    setIsEnquiryOpen(true);
  };

  // Featured sample items for Home Page preview
  const featuredProducts = products.filter(p => p.featured).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-[#181715] font-sans antialiased selection:bg-[#181715] selection:text-white">
      {/* Sticky Header */}
      <Navbar currentTab={currentTab} onNavigate={handleNavigate} />

      {/* Main Content Areas based on currentTab */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <div>
            {/* 1. Hero Section */}
            <Hero
              onExploreCatalogue={() => handleNavigate('catalogue')}
              onReachUs={() => handleNavigate('reach-us')}
            />

            {/* 2. Product Categories Section */}
            <CategoryCards onSelectCategory={handleCategorySelect} />

            {/* 3. Featured Materials Spotlight */}
            <section className="py-16 md:py-20 bg-[#F7F5F0] border-t border-b border-[#E8E6E0]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#82553E] block mb-1 font-mono">
                      Catalogue Highlights
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#181715]">
                      Featured Wholesale Materials
                    </h2>
                  </div>
                  <button
                    onClick={() => handleNavigate('catalogue')}
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#181715] hover:text-[#82553E] transition-colors"
                  >
                    <span>View All {products.length} Products</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onViewDetails={handleOpenDetails}
                      onEnquire={handleOpenEnquiry}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* 4. Business Introduction, 5. Why Classic Fashions & 18. Visit Classic Fashions */}
            <HomeIntro
              onExploreCatalogue={() => handleNavigate('catalogue')}
              onReachUs={() => handleNavigate('reach-us')}
            />

            {/* Bottom Direct Wholesale CTA */}
            <section className="py-16 bg-[#181715] text-white">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                <span className="text-xs font-mono uppercase tracking-widest text-[#C4B7AA]">
                  Boyampalayam, Tiruppur
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
                  Connect Directly With Our Wholesale Sales Desk
                </h3>
                <p className="text-sm sm:text-base text-[#B3ACA3] max-w-2xl mx-auto leading-relaxed">
                  Whether you need bulk fabric bolts, customized garment buttons, or edge scalping processing, our team provides prompt quotations and dependable delivery.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => handleNavigate('catalogue')}
                    className="w-full sm:w-auto px-8 py-3.5 text-xs font-semibold uppercase tracking-wider bg-white text-[#181715] hover:bg-[#EAE6DF] rounded transition-colors"
                  >
                    Explore Digital Catalogue
                  </button>
                  <button
                    onClick={() => handleNavigate('reach-us')}
                    className="w-full sm:w-auto px-8 py-3.5 text-xs font-semibold uppercase tracking-wider bg-transparent border border-[#59554F] text-white hover:bg-[#2B2824] rounded transition-colors"
                  >
                    Reach Us Directly
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentTab === 'about' && (
          <AboutSection
            onExploreCatalogue={() => handleNavigate('catalogue')}
            onReachUs={() => handleNavigate('reach-us')}
          />
        )}

        {currentTab === 'catalogue' && (
          <CatalogueView
            initialCategory={catalogueCategory}
            onViewDetails={handleOpenDetails}
            onEnquire={handleOpenEnquiry}
          />
        )}

        {currentTab === 'reach-us' && (
          <ReachUsView />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating Chatbot Assistant */}
      <Chatbot onNavigate={handleNavigate} />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onEnquire={(p) => {
          setDetailProduct(null);
          handleOpenEnquiry(p);
        }}
      />

      {/* Product Enquiry Modal */}
      <EnquiryModal
        product={enquiryProduct}
        isOpen={isEnquiryOpen}
        onClose={() => {
          setIsEnquiryOpen(false);
          setEnquiryProduct(null);
        }}
      />
    </div>
  );
}
