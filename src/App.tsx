import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { HomeIntro } from './components/HomeIntro.tsx';
import { CategoryCards } from './components/CategoryCards.tsx';
import { CatalogueView } from './components/CatalogueView.tsx';
import { CollectionView } from './components/CollectionView.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { ReachUsView } from './components/ReachUsView.tsx';
import { MaterialRequestForm } from './components/MaterialRequestForm.tsx';
import { Chatbot } from './components/Chatbot.tsx';
import { Footer } from './components/Footer.tsx';
import { ProductDetailModal } from './components/ProductDetailModal.tsx';
import { EnquiryModal } from './components/EnquiryModal.tsx';
import { Product, ProductCategory, CollectionItem, NavigationTab, MaterialRequestCategory } from './types.ts';
import { products } from './data/products.ts';
import { ProductCard } from './components/ProductCard.tsx';
import { ArrowRight, ShoppingBag } from 'lucide-react';

const COLLECTION_STORAGE_KEY = 'cf_dealer_collection_v1';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [catalogueCategory, setCatalogueCategory] = useState<ProductCategory | 'all'>('all');
  const [similarProductForRequest, setSimilarProductForRequest] = useState<Product | null>(null);
  const [initialRequestCategory, setInitialRequestCategory] = useState<MaterialRequestCategory | undefined>(undefined);

  // Collection State (Stored in localStorage for dealer convenience)
  const [collection, setCollection] = useState<CollectionItem[]>(() => {
    try {
      const saved = localStorage.getItem(COLLECTION_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback if localStorage unavailable
    }
    return [];
  });

  // Sync collection to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(COLLECTION_STORAGE_KEY, JSON.stringify(collection));
    } catch {
      // Ignore storage errors
    }
  }, [collection]);

  // Modal states
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [enquiryProduct, setEnquiryProduct] = useState<Product | null>(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isCollectionEnquiry, setIsCollectionEnquiry] = useState(false);

  // Navigation handler
  const handleNavigate = (
    tab: NavigationTab,
    category?: ProductCategory
  ) => {
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

  const handleRequestMaterial = (category?: ProductCategory, similarProduct?: Product) => {
    if (similarProduct) {
      setSimilarProductForRequest(similarProduct);
    } else {
      setSimilarProductForRequest(null);
    }

    if (category) {
      const mapped: MaterialRequestCategory =
        category === 'laces'
          ? 'lace'
          : category === 'denim'
          ? 'denim'
          : category === 'mesh'
          ? 'mesh'
          : category === 'accessories'
          ? 'accessories'
          : category === 'processing'
          ? 'processing'
          : 'fabric';
      setInitialRequestCategory(mapped);
    } else {
      setInitialRequestCategory(undefined);
    }

    setCurrentTab('material-request');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDetails = (product: Product) => {
    setDetailProduct(product);
  };

  // Direct single product enquiry
  const handleOpenSingleEnquiry = (product: Product) => {
    setEnquiryProduct(product);
    setIsCollectionEnquiry(false);
    setIsEnquiryOpen(true);
  };

  // Collection Enquiry Generation
  const handleGenerateCollectionEnquiry = () => {
    setEnquiryProduct(null);
    setIsCollectionEnquiry(true);
    setIsEnquiryOpen(true);
  };

  // Collection Management Methods
  const handleAddToCollection = (
    product: Product,
    quantity = 1,
    selectedColour?: string,
    selectedSize?: string
  ) => {
    setCollection((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex >= 0) {
        // Update existing item
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: quantity > 1 ? quantity : updated[existingIndex].quantity + 1,
          selectedColour: selectedColour || updated[existingIndex].selectedColour,
          selectedSize: selectedSize || updated[existingIndex].selectedSize,
        };
        return updated;
      } else {
        // Add new item to collection
        return [
          ...prev,
          {
            product,
            quantity: Math.max(1, quantity),
            selectedColour: selectedColour || product.colours[0],
            selectedSize: selectedSize || product.sizes[0],
            addedAt: Date.now(),
          },
        ];
      }
    });
  };

  const handleUpdateCollectionQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCollection(productId);
      return;
    }
    setCollection((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const handleRemoveFromCollection = (productId: string) => {
    setCollection((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCollection = () => {
    setCollection([]);
  };

  // Helper to check if item is in collection
  const getCollectionItem = (productId: string) => {
    return collection.find((item) => item.product.id === productId);
  };

  // Featured sample items for Home Page preview
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-[#181715] font-sans antialiased selection:bg-[#181715] selection:text-white">
      {/* Sticky Header */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        collectionCount={collection.length}
      />

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
                  <div className="flex items-center gap-4">
                    {collection.length > 0 && (
                      <button
                        onClick={() => handleNavigate('collection')}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#82553E] hover:text-[#181715] transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>View Collection ({collection.length})</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleNavigate('catalogue')}
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#181715] hover:text-[#82553E] transition-colors"
                    >
                      <span>View All {products.length} Products</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredProducts.map((product) => {
                    const itemInCollection = getCollectionItem(product.id);
                    return (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onViewDetails={handleOpenDetails}
                        onEnquire={handleOpenSingleEnquiry}
                        onAddToCollection={handleAddToCollection}
                        isInCollection={Boolean(itemInCollection)}
                        collectionQuantity={itemInCollection?.quantity || 0}
                      />
                    );
                  })}
                </div>
              </div>
            </section>

            {/* 4. Business Introduction, Why Classic Fashions & Visit Section */}
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
                  {collection.length > 0 && (
                    <button
                      onClick={() => handleNavigate('collection')}
                      className="w-full sm:w-auto px-8 py-3.5 text-xs font-semibold uppercase tracking-wider bg-[#82553E] text-white hover:bg-[#6e4632] rounded transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Review Collection ({collection.length})</span>
                    </button>
                  )}
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
            onEnquire={handleOpenSingleEnquiry}
            onAddToCollection={handleAddToCollection}
            collection={collection}
            onViewCollection={() => handleNavigate('collection')}
            onRequestMaterial={(cat) => handleRequestMaterial(cat)}
          />
        )}

        {currentTab === 'material-request' && (
          <MaterialRequestForm
            similarProduct={similarProductForRequest}
            initialData={initialRequestCategory ? { category: initialRequestCategory } : undefined}
            onExploreCatalogue={() => handleNavigate('catalogue')}
            onReachUs={() => handleNavigate('reach-us')}
          />
        )}

        {currentTab === 'collection' && (
          <CollectionView
            collection={collection}
            onUpdateQuantity={handleUpdateCollectionQuantity}
            onRemoveItem={handleRemoveFromCollection}
            onClearCollection={handleClearCollection}
            onGenerateEnquiry={handleGenerateCollectionEnquiry}
            onExploreCatalogue={() => handleNavigate('catalogue')}
            onViewDetails={handleOpenDetails}
          />
        )}

        {currentTab === 'reach-us' && <ReachUsView />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onEnquire={(p) => {
          setDetailProduct(null);
          handleOpenSingleEnquiry(p);
        }}
        onAddToCollection={handleAddToCollection}
        isInCollection={detailProduct ? Boolean(getCollectionItem(detailProduct.id)) : false}
        currentQuantityInCollection={
          detailProduct ? getCollectionItem(detailProduct.id)?.quantity || 0 : 0
        }
        onRequestSimilar={(p) => {
          setDetailProduct(null);
          handleRequestMaterial(undefined, p);
        }}
      />

      {/* Product / Collection Enquiry Modal */}
      <EnquiryModal
        product={isCollectionEnquiry ? null : enquiryProduct}
        collection={isCollectionEnquiry ? collection : []}
        isOpen={isEnquiryOpen}
        onClose={() => {
          setIsEnquiryOpen(false);
          setEnquiryProduct(null);
          setIsCollectionEnquiry(false);
        }}
      />

      {/* Assistant & Quick Navigation Chatbot */}
      <Chatbot onNavigate={handleNavigate} />
    </div>
  );
}
