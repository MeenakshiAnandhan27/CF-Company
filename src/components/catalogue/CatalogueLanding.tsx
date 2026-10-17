import React, { useState, useMemo, useRef } from 'react';
import {
  ALL_DISCOVERY_MATERIALS,
  CATEGORY_PANELS,
  DiscoveryMaterial,
  getProductForDiscoveryMaterial,
} from '../../data/catalogueDiscoveryData.ts';
import { CategoryShowcase } from './CategoryShowcase.tsx';
import { MaterialGrid } from './MaterialGrid.tsx';
import { MaterialDetail } from './MaterialDetail.tsx';
import { MaterialWall } from './MaterialWall.tsx';
import { CatalogueNavigation, NavFilter } from './CatalogueNavigation.tsx';
import { DigitalCatalogue } from './DigitalCatalogue.tsx';
import { FabricViewer360 } from './FabricViewer360.tsx';
import { RequestMaterialCallout } from './RequestMaterialCallout.tsx';
import { Product, CollectionItem } from '../../types.ts';
import { Sparkles, ArrowRight, Layers, BookOpen, RotateCw } from 'lucide-react';

interface CatalogueLandingProps {
  initialCategory?: string | null;
  onViewDetails: (product: Product) => void;
  onEnquire: (product: Product) => void;
  onAddToCollection?: (product: Product, quantity?: number, colour?: string, size?: string) => void;
  collection?: CollectionItem[];
  onViewCollection?: () => void;
  onRequestMaterial?: (category?: any) => void;
}

export const CatalogueLanding: React.FC<CatalogueLandingProps> = ({
  initialCategory,
  onViewDetails,
  onEnquire,
  onAddToCollection,
  collection = [],
  onRequestMaterial,
}) => {
  // Navigation filter state
  const [activeFilter, setActiveFilter] = useState<NavFilter>(() => {
    if (!initialCategory || initialCategory === 'ALL') return 'ALL';
    const upper = initialCategory.toUpperCase();
    if (upper.includes('FABRIC')) return 'FABRICS';
    if (upper.includes('DENIM')) return 'DENIM & CHAMBRAY';
    if (upper.includes('LACE')) return 'LACES';
    if (upper.includes('ACCESS')) return 'GARMENT ACCESSORIES';
    return 'ALL';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<DiscoveryMaterial | null>(null);
  const [isDigitalBookOpen, setIsDigitalBookOpen] = useState(false);
  const [isViewer360Open, setIsViewer360Open] = useState(false);
  const [viewer360Material, setViewer360Material] = useState<DiscoveryMaterial | null>(null);

  const handleOpen360Viewer = (material?: DiscoveryMaterial) => {
    setViewer360Material(material || null);
    setIsViewer360Open(true);
  };

  // Section reference to smoothly scroll when category is selected
  const materialsSectionRef = useRef<HTMLDivElement>(null);

  // Filtered materials based on category and search query
  const filteredMaterials = useMemo(() => {
    let result = ALL_DISCOVERY_MATERIALS;

    // Filter by category
    if (activeFilter !== 'ALL') {
      result = result.filter((m) => m.category === activeFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.subcategory.toLowerCase().includes(q) ||
          (m.composition && m.composition.toLowerCase().includes(q)) ||
          (m.weave && m.weave.toLowerCase().includes(q))
      );
    }

    return result;
  }, [activeFilter, searchQuery]);

  // Handle category panel click
  const handleSelectCategoryPanel = (catId: NavFilter) => {
    setActiveFilter(catId);
    setSearchQuery('');
    // Smooth scroll down to materials section
    if (materialsSectionRef.current) {
      materialsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Convert DiscoveryMaterial to Product for parent handlers
  const handleEnquireMaterial = (material: DiscoveryMaterial) => {
    const product = getProductForDiscoveryMaterial(material);
    onEnquire(product);
  };

  const handleDeepDetailsMaterial = (material: DiscoveryMaterial) => {
    const product = getProductForDiscoveryMaterial(material);
    onViewDetails(product);
  };

  const handleAddToCollectionMaterial = (material: DiscoveryMaterial) => {
    if (!onAddToCollection) return;
    const product = getProductForDiscoveryMaterial(material);
    onAddToCollection(product, 1);
  };

  const isMaterialInCollection = (material: DiscoveryMaterial | null): boolean => {
    if (!material) return false;
    const matchedProduct = getProductForDiscoveryMaterial(material);
    return collection.some((item) => item.product.id === matchedProduct.id || item.product.name.toLowerCase() === material.name.toLowerCase());
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181715] selection:bg-[#E0D7C8] selection:text-[#181715]">
      {/* ========================================================
          1. HERO SECTION: Clean editorial typography & whitespace
          ======================================================== */}
      <section className="relative pt-12 pb-14 sm:pt-16 sm:pb-20 border-b border-[#EAE4D8] overflow-hidden">
        {/* Subtle decorative textile grid background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#181715_1px,transparent_1px)] [background-size:24px_24px]"
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.22em] text-[#82553E] font-semibold bg-[#F2EDE4] px-3.5 py-1 rounded-full border border-[#DDD5C7]">
            <span>DIGITAL MATERIAL CATALOGUE</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#181715] leading-[1.12]">
            Materials Behind Every Garment
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-[#666057] max-w-2xl mx-auto leading-relaxed font-sans">
            Explore fabrics, denim, chambray, laces and garment accessories sourced for apparel production.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={() => handleOpen360Viewer()}
              className="group relative inline-flex items-center gap-2.5 px-6 py-3 text-xs font-mono font-bold uppercase tracking-[0.18em] bg-gradient-to-r from-[#181715] via-[#2A2318] to-[#181715] text-[#FAF7F2] border-2 border-[#D4AF37] hover:border-[#F3E2B8] rounded-full shadow-[0_4px_20px_rgba(212,175,55,0.35)] hover:shadow-[0_6px_28px_rgba(212,175,55,0.6)] transition-all duration-300 hover:scale-[1.04] active:scale-[0.98] cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F5DE93] text-[#181715] flex items-center justify-center shadow-xs group-hover:rotate-180 transition-transform duration-700">
                <RotateCw className="w-3.5 h-3.5" />
              </div>
              <span className="text-[#FAF7F2]">3D & 360° Fabric Studio</span>
              <span className="text-[9px] font-sans px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#F5DE93] border border-[#D4AF37]/40 tracking-wider">
                LIVE 3D
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsDigitalBookOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 text-xs font-mono font-semibold uppercase tracking-wider bg-white hover:bg-[#F2ECE1] text-[#181715] border border-[#DDD5C7] rounded-full shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#82553E]" />
              <span>Digital Lookbook</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. STICKY CATALOGUE NAVIGATION (Slim, zero-pill bar)
          ======================================================== */}
      <CatalogueNavigation
        activeFilter={activeFilter}
        onSelectFilter={(f) => {
          setActiveFilter(f);
          setSearchQuery('');
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenDigitalBook={() => setIsDigitalBookOpen(true)}
        onOpen360={() => handleOpen360Viewer()}
        totalMaterialsCount={filteredMaterials.length}
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-20">
        {/* ========================================================
            3. CATEGORY SHOWCASE (4 Large Panels)
            Only show when in "ALL" mode or not currently searching
            ======================================================== */}
        {activeFilter === 'ALL' && !searchQuery && (
          <CategoryShowcase
            activeCategory={activeFilter}
            onSelectCategory={handleSelectCategoryPanel}
          />
        )}

        {/* ========================================================
            3B. INTERACTIVE 3D & 360° FABRIC ATELIER BANNER
            ======================================================== */}
        <section className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#181715] via-[#23201C] to-[#141311] border border-[#D4AF37]/40 shadow-xl p-6 sm:p-8 text-white">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F5DE93] text-[10px] font-mono uppercase tracking-[0.2em] font-semibold">
                <RotateCw className="w-3 h-3 text-[#D4AF37] animate-spin-slow" />
                <span>3D Cloth Physics & 360° Turntable</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#FAF7F2]">
                Interactive 360° Fabric Atelier Studio
              </h3>
              <p className="text-xs sm:text-sm text-[#DDD5C8] max-w-xl leading-relaxed">
                Inspect 8 master 4K fabric styles—Organic Cotton, Mulberry Silk, Belgian Linen, Indigo Twill Denim, Plush Velvet, Merino Wool, Jacquard Brocade, and Pique Knit—with genuine 3D cloth physics, draping modes, and 360° rotational camera.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpen360Viewer()}
              className="group inline-flex items-center gap-3 px-6 py-3.5 text-xs font-mono font-bold uppercase tracking-[0.18em] rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E2B8] to-[#D4AF37] text-[#181715] shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_28px_rgba(212,175,55,0.6)] transition-all hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
            >
              <span>Launch 360° Studio</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </section>

        {/* ========================================================
            4. DYNAMIC MATERIAL DISCOVERY (CIRCULAR SWATCHES)
            ======================================================== */}
        <div ref={materialsSectionRef} className="space-y-12">
          {/* Section Breadcrumbs / Active Context Indicator */}
          {activeFilter !== 'ALL' && (
            <div className="flex items-center justify-between border-b border-[#E8E2D7] pb-3 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveFilter('ALL')}
                  className="font-mono text-xs uppercase tracking-wider text-[#736F68] hover:text-[#181715] transition-colors"
                >
                  ALL CATEGORIES
                </button>
                <span className="text-[#A59F94]">/</span>
                <span className="font-mono text-xs uppercase tracking-wider font-bold text-[#82553E]">
                  {activeFilter}
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#8C877E]">
                {filteredMaterials.length} Raw Materials
              </span>
            </div>
          )}

          {/* RENDER BY CATEGORY / FAMILIES */}
          {activeFilter === 'ALL' && !searchQuery ? (
            /* ALL Mode: Display Structured Sections */
            <div className="space-y-20">
              {/* FABRICS */}
              <MaterialGrid
                title="Explore Fabrics"
                subtitle="Browse materials by construction, texture and application."
                materials={ALL_DISCOVERY_MATERIALS.filter((m) => m.category === 'FABRICS')}
                onSelectMaterial={setSelectedMaterial}
                onOpen360={handleOpen360Viewer}
                subsections={[
                  {
                    title: 'Woven Fabrics',
                    description: 'Plain, Twill, Satin, Drill, Canvas / Gada and Duck constructions.',
                    filterSection: 'WOVEN',
                  },
                  {
                    title: 'Specialty Fabrics',
                    description: 'Textured seersucker, traditional putta, napped flannel, taffeta, chiffon, velvet, fur and pure linen.',
                    filterSection: 'SPECIALTY',
                  },
                  {
                    title: 'Mesh & Stretch',
                    description: 'Porous cotton mesh, filament polyester athletic eyelet and 4-way lycra stretch net.',
                    filterSection: 'MESH_STRETCH',
                  },
                  {
                    title: 'Patterns',
                    description: 'Yarn-dyed longitudinal stripes and balanced intersection checks.',
                    filterSection: 'PATTERNS',
                  },
                ]}
              />

              {/* DENIM & CHAMBRAY */}
              <div className="pt-6 border-t border-[#EAE3D6]">
                <MaterialGrid
                  title="Denim & Chambray"
                  subtitle="Authentic raw indigo twill textiles and lightweight chambray weaves."
                  materials={ALL_DISCOVERY_MATERIALS.filter((m) => m.category === 'DENIM & CHAMBRAY')}
                  onSelectMaterial={setSelectedMaterial}
                  onOpen360={handleOpen360Viewer}
                />
              </div>

              {/* LACES */}
              <div className="pt-6 border-t border-[#EAE3D6]">
                <MaterialGrid
                  title="Laces & Trims"
                  subtitle="Fine embroidery needlework, pure cotton crochet, raschel lycra, ric rac and imported lace."
                  materials={ALL_DISCOVERY_MATERIALS.filter((m) => m.category === 'LACES')}
                  onSelectMaterial={setSelectedMaterial}
                  onOpen360={handleOpen360Viewer}
                />
              </div>

              {/* GARMENT ACCESSORIES */}
              <div className="pt-6 border-t border-[#EAE3D6]">
                <MaterialGrid
                  title="Garment Accessories"
                  subtitle="Precision zippers, apparel buttons and heat-sealed cord tipping components."
                  materials={ALL_DISCOVERY_MATERIALS.filter((m) => m.category === 'GARMENT ACCESSORIES')}
                  onSelectMaterial={setSelectedMaterial}
                  onOpen360={handleOpen360Viewer}
                  subsections={[
                    {
                      title: 'Zippers',
                      description: 'Heavy interlocking metal tooth chains and molded lightweight vislon zippers.',
                      filterSection: 'ZIPPERS',
                    },
                    {
                      title: 'Buttons',
                      description: 'Stamped metal, press snaps, cut crystal glass, resin plastic, turned hardwood, mother-of-pearl and natural shell.',
                      filterSection: 'BUTTONS',
                    },
                    {
                      title: 'Tipping Components',
                      description: 'Thermal acetate film tipping and solid crimped brass drawcord ends.',
                      filterSection: 'TIPPING',
                    },
                  ]}
                />
              </div>
            </div>
          ) : activeFilter === 'FABRICS' && !searchQuery ? (
            /* Specific FABRICS View */
            <MaterialGrid
              title="Explore Fabrics"
              subtitle="Browse materials by construction, texture and application."
              materials={filteredMaterials}
              onSelectMaterial={setSelectedMaterial}
              onOpen360={handleOpen360Viewer}
              subsections={[
                {
                  title: 'Woven Fabrics',
                  description: 'Plain, Twill, Satin, Drill, Canvas / Gada and Duck constructions.',
                  filterSection: 'WOVEN',
                },
                {
                  title: 'Specialty Fabrics',
                  description: 'Textured seersucker, traditional putta, napped flannel, taffeta, chiffon, velvet, fur and pure linen.',
                  filterSection: 'SPECIALTY',
                },
                {
                  title: 'Mesh & Stretch',
                  description: 'Porous cotton mesh, filament polyester athletic eyelet and 4-way lycra stretch net.',
                  filterSection: 'MESH_STRETCH',
                },
                {
                  title: 'Patterns',
                  description: 'Yarn-dyed longitudinal stripes and balanced intersection checks.',
                  filterSection: 'PATTERNS',
                },
              ]}
            />
          ) : activeFilter === 'GARMENT ACCESSORIES' && !searchQuery ? (
            /* Specific ACCESSORIES View */
            <MaterialGrid
              title="Garment Accessories"
              subtitle="Precision zippers, buttons and drawcord tipping components for apparel assembly."
              materials={filteredMaterials}
              onSelectMaterial={setSelectedMaterial}
              onOpen360={handleOpen360Viewer}
              subsections={[
                {
                  title: 'Zippers',
                  description: 'Heavy interlocking metal tooth chains and molded lightweight vislon zippers.',
                  filterSection: 'ZIPPERS',
                },
                {
                  title: 'Buttons',
                  description: 'Stamped metal, press snaps, cut crystal glass, resin plastic, turned hardwood, mother-of-pearl and natural shell.',
                  filterSection: 'BUTTONS',
                },
                {
                  title: 'Tipping Components',
                  description: 'Thermal acetate film tipping and solid crimped brass drawcord ends.',
                  filterSection: 'TIPPING',
                },
              ]}
            />
          ) : (
            /* Search results or filtered single-category */
            <MaterialGrid
              title={searchQuery ? `Search Results for "${searchQuery}"` : activeFilter}
              subtitle={
                searchQuery
                  ? `Found ${filteredMaterials.length} matching materials`
                  : 'Sourced and supplied for your production specifications.'
              }
              materials={filteredMaterials}
              onSelectMaterial={setSelectedMaterial}
              onOpen360={handleOpen360Viewer}
              showCategoryLabel={true}
            />
          )}
        </div>

        {/* ========================================================
            5. MATERIAL WALL: The Flowing Circular Swatch Gallery
            ======================================================== */}
        <MaterialWall
          onSelectMaterial={setSelectedMaterial}
          onOpen360={handleOpen360Viewer}
        />

        {/* ========================================================
            6. REQUEST A MATERIAL CALLOUT
            ======================================================== */}
        <RequestMaterialCallout
          onRequestMaterial={() => {
            if (onRequestMaterial) {
              onRequestMaterial('fabric');
            }
          }}
        />
      </div>

      {/* ========================================================
          7. SLIDE-OVER QUICK MATERIAL DETAIL DRAWER
          ======================================================== */}
      <MaterialDetail
        material={selectedMaterial}
        onClose={() => setSelectedMaterial(null)}
        onEnquire={handleEnquireMaterial}
        onOpen360={handleOpen360Viewer}
        onViewDeepDetails={handleDeepDetailsMaterial}
        onAddToCollection={handleAddToCollectionMaterial}
        isInCollection={isMaterialInCollection(selectedMaterial)}
      />

      {/* ========================================================
          8. DIGITAL CATALOGUE MODAL (Book flip experience)
          ======================================================== */}
      <DigitalCatalogue
        isOpen={isDigitalBookOpen}
        onClose={() => setIsDigitalBookOpen(false)}
        onSelectMaterial={(mat) => {
          setSelectedMaterial(mat);
          setIsDigitalBookOpen(false);
        }}
        onEnquire={(mat) => {
          setIsDigitalBookOpen(false);
          handleEnquireMaterial(mat);
        }}
      />

      {/* ========================================================
          9. 360° FABRIC STUDIO & TURNTABLE INSPECTOR
          ======================================================== */}
      <FabricViewer360
        isOpen={isViewer360Open}
        initialMaterial={viewer360Material}
        onClose={() => {
          setIsViewer360Open(false);
          setViewer360Material(null);
        }}
        onEnquire={handleEnquireMaterial}
      />
    </div>
  );
};
