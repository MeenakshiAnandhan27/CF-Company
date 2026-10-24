import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { BrandIntroSection, MaterialsMarqueeStrip } from './components/BrandIntroSection.tsx';
import { Hero } from './components/Hero.tsx';
import { HomeIntro } from './components/HomeIntro.tsx';
import { CategoryCards } from './components/CategoryCards.tsx';
import { CatalogueView } from './components/CatalogueView.tsx';
import { CollectionView } from './components/CollectionView.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { ReachUsView } from './components/ReachUsView.tsx';
import { MaterialRequestForm } from './components/MaterialRequestForm.tsx';
import { DiamondMotif } from './components/DiamondMotif.tsx';
import { Chatbot } from './components/Chatbot.tsx';
import { Footer } from './components/Footer.tsx';
import { ProductDetailModal } from './components/ProductDetailModal.tsx';
import { EnquiryModal } from './components/EnquiryModal.tsx';
import { FireflyFabric3DViewer } from './components/catalogue/FireflyFabric3DViewer.tsx';
import { FireflyFabricItem, getProductForFireflyFabric } from './data/fireflyFabricsData.ts';
import { Product, ProductCategory, CollectionItem, NavigationTab, MaterialRequestCategory } from './types.ts';
import { products } from './data/products.ts';
import { ALL_DISCOVERY_MATERIALS, getProductForDiscoveryMaterial } from './data/catalogueDiscoveryData.ts';
import { ArrowRight, ShoppingBag, Sparkles, PhoneCall } from 'lucide-react';

const COLLECTION_STORAGE_KEY = 'cf_dealer_collection_v1';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '') as NavigationTab;
      if (['home', 'about', 'catalogue', 'material-request', 'collection', 'reach-us'].includes(hash)) {
        return hash;
      }
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as NavigationTab;
      if (['home', 'about', 'catalogue', 'material-request', 'collection', 'reach-us'].includes(tabParam)) {
        return tabParam;
      }
    }
    return 'home';
  });
  const [catalogueCategory, setCatalogueCategory] = useState<ProductCategory | 'all' | string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      if (cat) return cat;
    }
    return 'all';
  });
  const [similarProductForRequest, setSimilarProductForRequest] = useState<Product | null>(null);
  const [initialRequestCategory, setInitialRequestCategory] = useState<MaterialRequestCategory | undefined>(undefined);

  // Drawer state for refined interactive collection swatch organizer
  const [isCollectionDrawerOpen, setIsCollectionDrawerOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      return hash === '#collection' || params.get('tab') === 'collection';
    }
    return false;
  });

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
  const [reachUsContext, setReachUsContext] = useState<string | undefined>(undefined);

  // Complete list of catalogue products including all discovery materials for smooth full-view navigation
  const allCatalogueProducts = React.useMemo(() => {
    const discoveryProds = ALL_DISCOVERY_MATERIALS.map(getProductForDiscoveryMaterial);
    const combined = [...discoveryProds];
    products.forEach((p) => {
      if (!combined.some((item) => item.id === p.id || item.name.toLowerCase() === p.name.toLowerCase())) {
        combined.push(p);
      }
    });
    return combined;
  }, []);

  // Listen for hash navigation (#3d-fabric-viewer, #collection)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#3d-fabric-viewer' || hash === '#firefly-viewer' || hash === '#3d-viewer') {
        setCurrentTab('3d-fabric-viewer');
      } else if (hash === '#collection') {
        setIsCollectionDrawerOpen(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);

    const handlePopState = () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as NavigationTab;
      const catParam = params.get('category');
      if (tabParam && ['home', 'about', 'catalogue', 'material-request', 'collection', 'reach-us', '3d-fabric-viewer'].includes(tabParam)) {
        setCurrentTab(tabParam);
      } else {
        setCurrentTab('home');
      }
      if (catParam) {
        setCatalogueCategory(catParam);
      } else {
        setCatalogueCategory('all');
      }
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleFireflyEnquire = (fabric: FireflyFabricItem) => {
    const prod = getProductForFireflyFabric(fabric);
    setEnquiryProduct(prod);
    setIsCollectionEnquiry(false);
    setIsEnquiryOpen(true);
  };

  // Navigation handler
  const handleNavigate = (
    tab: NavigationTab,
    category?: ProductCategory | string
  ) => {
    if (tab === 'collection') {
      setIsCollectionDrawerOpen(true);
      return;
    }
    if (tab !== 'reach-us') {
      setIsReachUsFromCollection(false);
      try {
        sessionStorage.removeItem('cf_reach_us_source');
      } catch {
        // Ignore storage error
      }
    }
    setCurrentTab(tab);
    const catToSet = category || (tab === 'catalogue' ? 'all' : undefined);
    if (catToSet) {
      setCatalogueCategory(catToSet);
    } else if (tab === 'catalogue' && !category) {
      setCatalogueCategory('all');
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      params.set('tab', tab);
      if (tab === 'catalogue' && catToSet && catToSet !== 'all') {
        params.set('category', catToSet);
      } else {
        params.delete('category');
      }
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.pushState({ tab, category: catToSet }, '', newUrl);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (category: ProductCategory | string) => {
    handleNavigate('catalogue', category);
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
          : category === 'mesh' || category === 'lycra-mesh'
          ? 'mesh'
          : category === 'buttons'
          ? 'button'
          : category === 'accessories' || category === 'tapes' || category === 'tags'
          ? 'accessories'
          : category === 'processing'
          ? 'other'
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

  // Collection Enquiry Generation: Navigate directly to Reach Us with materials prefilled (no intermediate modal)
  const [isReachUsFromCollection, setIsReachUsFromCollection] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        return sessionStorage.getItem('cf_reach_us_source') === 'collection';
      } catch {
        return false;
      }
    }
    return false;
  });

  const handleGenerateCollectionEnquiry = () => {
    setIsCollectionDrawerOpen(false);
    setIsReachUsFromCollection(true);
    try {
      sessionStorage.setItem('cf_reach_us_source', 'collection');
    } catch {
      // Ignore storage error
    }
    handleNavigate('reach-us');
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


  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-[#181715] font-sans antialiased selection:bg-[#181715] selection:text-white">
      {/* Sticky Header */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        collectionCount={collection.length}
        isCollectionOpen={isCollectionDrawerOpen || currentTab === 'collection'}
      />

      {/* Main Content Areas based on currentTab */}
      <main className={`flex-1 pb-12 ${currentTab !== 'home' ? 'pt-20' : ''}`}>
        {currentTab === 'home' && (
          <div>
            {/* Brand Intro Section */}
            <BrandIntroSection
              onScrollToDiscover={() => {
                const el = document.getElementById('materials-strip') || document.getElementById('materials-hero');
                if (el) {
                  const navHeight = 80;
                  const targetPos = el.getBoundingClientRect().top + window.scrollY - navHeight;
                  window.scrollTo({
                    top: Math.max(0, targetPos),
                    behavior: 'smooth',
                  });
                }
              }}
            />

            {/* Slow-Moving Materials Categories Marquee Strip (Reference Image 2) */}
            <MaterialsMarqueeStrip />

            {/* 1. Hero Section: Materials for Every Requirement */}
            <Hero
              onExploreCatalogue={() => handleNavigate('catalogue')}
              onRequestMaterial={() => handleRequestMaterial()}
              onReachUs={() => handleNavigate('reach-us')}
            />

            {/* 2. Product Categories Section */}
            <CategoryCards
              onSelectCategory={handleCategorySelect}
              onExploreCatalogue={() => handleNavigate('catalogue')}
            />

            {/* Grand Golden Diamond Motif Divider */}
            <div className="relative w-full bg-[#FAF7F2] py-4 sm:py-5 flex items-center justify-center overflow-hidden border-b border-[#E6E0D2]">
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                  backgroundImage: 'radial-gradient(rgba(212, 175, 55, 0.25) 1px, transparent 1px)',
                  backgroundSize: '28px 28px',
                }}
              />
              <DiamondMotif align="center" maxWidth="max-w-2xl" />
            </div>

            {/* 4. Business Introduction, Why Classic Fashions & Sourcing Workflow */}
            <HomeIntro
              onExploreCatalogue={() => handleNavigate('catalogue')}
              onRequestMaterial={() => handleRequestMaterial()}
              onReachUs={() => handleNavigate('reach-us')}
            />

            {/* Bottom Direct Sourcing CTA — Unified Luxury obsidian tone with Header-identical Glowing Gold Catalogue Button */}
            <section className="relative py-20 md:py-24 bg-gradient-to-b from-[#1A1816] via-[#151412] to-[#100F0E] text-white border-t border-[#2C2924] overflow-hidden">
              {/* Subtle luxury radial gold ambient glow */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-25"
                style={{
                  background: 'radial-gradient(ellipse 65% 50% at 50% 0%, rgba(212,175,55,0.2), transparent 70%)'
                }}
              />

              <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FAF8F5]">
                  Your Requirements, Our Expertise
                </h3>

                <p className="text-sm sm:text-base text-[#BDB5AB] max-w-2xl mx-auto leading-relaxed">
                  We source and manufacture fabrics and garment accessories to meet your specific requirements, with a focus on quality and reliable delivery.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  {/* Primary: EXPLORE CATALOGUE — Glowing Gold Catalogue Button */}
                  <button
                    onClick={() => handleNavigate('catalogue')}
                    className="group relative inline-flex items-center justify-center gap-3 pl-6 pr-2 py-2 text-xs font-semibold uppercase tracking-[0.16em] rounded-full transition-all duration-300 text-[#FFF8EC] bg-gradient-to-r from-[#181715] via-[#2A2620] to-[#181715] hover:from-[#24211D] hover:to-[#111110] border border-[#D4AF37] hover:border-[#F2D785] shadow-[0_4px_16px_rgba(212,175,55,0.25)] hover:shadow-[0_6px_28px_rgba(212,175,55,0.45)] active:scale-[0.98] cursor-pointer whitespace-nowrap min-h-[44px]"
                  >
                    <span className="font-mono text-[11px] tracking-[0.18em] font-bold">Explore Catalogue</span>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#F2D785] to-[#B38728] text-[#181715] font-bold flex items-center justify-center transition-all duration-300 shadow-sm group-hover:scale-105 group-hover:translate-x-0.5">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>

                  {/* Secondary: REQUEST A MATERIAL — Unique Terracotta Bronze & Gold Pod Button */}
                  <button
                    onClick={() => handleRequestMaterial()}
                    className="group relative inline-flex items-center justify-center gap-3 pl-6 pr-2 py-2 text-xs font-semibold uppercase tracking-[0.16em] rounded-full transition-all duration-300 text-white bg-gradient-to-r from-[#82553E] via-[#966045] to-[#73432C] hover:from-[#966045] hover:to-[#5E3825] border border-[#E2B774] hover:border-[#F5D89F] shadow-[0_4px_18px_rgba(130,85,62,0.35)] hover:shadow-[0_6px_28px_rgba(130,85,62,0.55)] active:scale-[0.98] cursor-pointer whitespace-nowrap min-h-[44px]"
                  >
                    <span className="font-mono text-[11px] tracking-[0.18em] font-bold">Request a Material</span>
                    <div className="w-7 h-7 rounded-full bg-white/20 border border-white/30 text-white font-bold flex items-center justify-center transition-all duration-300 shadow-sm group-hover:scale-105 group-hover:bg-white group-hover:text-[#82553E]">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  </button>

                  {/* Tertiary: REACH US DIRECTLY — Unique Frosted Obsidian with Active Pulse & Phone Pod */}
                  <button
                    onClick={() => handleNavigate('reach-us')}
                    className="group relative inline-flex items-center justify-center gap-3 pl-5 pr-2 py-2 text-xs font-semibold uppercase tracking-[0.16em] rounded-full transition-all duration-300 text-[#E8E2D8] bg-[#23201C]/80 hover:bg-[#2C2823] border border-[#524B42] hover:border-[#D4AF37]/70 shadow-[0_4px_16px_rgba(0,0,0,0.35)] hover:shadow-[0_6px_24px_rgba(212,175,55,0.2)] active:scale-[0.98] cursor-pointer whitespace-nowrap min-h-[44px]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#48CAE4] animate-pulse" />
                      <span className="font-mono text-[11px] tracking-[0.18em] font-bold">Reach Us Directly</span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-white/10 border border-white/15 text-[#E8E2D8] font-bold flex items-center justify-center transition-all duration-300 shadow-sm group-hover:scale-105 group-hover:bg-[#D4AF37] group-hover:text-[#181715]">
                      <PhoneCall className="w-3.5 h-3.5" />
                    </div>
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentTab === 'about' && (
          <AboutSection
            onExploreCatalogue={(cat?: any) => handleNavigate('catalogue', cat)}
            onRequestMaterial={() => handleRequestMaterial()}
            onReachUs={() => handleNavigate('reach-us')}
          />
        )}

        {(currentTab === 'catalogue' || currentTab === 'collection') && (
          <CatalogueView
            initialCategory={catalogueCategory}
            onViewDetails={handleOpenDetails}
            onEnquire={handleOpenSingleEnquiry}
            onAddToCollection={handleAddToCollection}
            collection={collection}
            onViewCollection={() => setIsCollectionDrawerOpen(true)}
            onRequestMaterial={(cat, similarProd) => handleRequestMaterial(cat, similarProd)}
            onReachUs={(ctx) => {
              setReachUsContext(ctx);
              handleNavigate('reach-us');
            }}
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

        {currentTab === '3d-fabric-viewer' && (
          <FireflyFabric3DViewer
            onBack={() => handleNavigate('catalogue')}
            onEnquire={handleFireflyEnquire}
          />
        )}

        {currentTab === 'reach-us' && (
          <ReachUsView
            onExploreCatalogue={() => handleNavigate('catalogue')}
            initialMaterialContext={reachUsContext}
            collectionMaterials={collection}
            onRemoveCollectionMaterial={handleRemoveFromCollection}
            onClearCollection={handleClearCollection}
            isFromCollection={isReachUsFromCollection}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        isDarkLuxuryTheme={false}
      />

      {/* Interactive Personal Swatch Collection Drawer */}
      <CollectionView
        isOpen={isCollectionDrawerOpen || currentTab === 'collection'}
        onClose={() => {
          setIsCollectionDrawerOpen(false);
          if (currentTab === 'collection') {
            setCurrentTab('catalogue');
          }
        }}
        collection={collection}
        onUpdateQuantity={handleUpdateCollectionQuantity}
        onRemoveItem={handleRemoveFromCollection}
        onClearCollection={handleClearCollection}
        onGenerateEnquiry={() => {
          setIsCollectionDrawerOpen(false);
          handleGenerateCollectionEnquiry();
        }}
        onExploreCatalogue={() => {
          setIsCollectionDrawerOpen(false);
          handleNavigate('catalogue');
        }}
        onViewDetails={(product) => {
          handleOpenDetails(product);
        }}
      />

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
        allProducts={allCatalogueProducts}
        onSelectProduct={(p) => setDetailProduct(p)}
        onOpen360={() => {
          setDetailProduct(null);
          handleNavigate('3d-fabric-viewer');
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

      {/* Assistant & Quick Navigation Chatbot (Removed on 3D Home Page) */}
      {currentTab !== 'home' && (
        <Chatbot
          onNavigate={handleNavigate}
          isDarkTheme={currentTab === 'reach-us'}
        />
      )}
    </div>
  );
}
