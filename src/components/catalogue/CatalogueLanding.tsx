import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ALL_DISCOVERY_MATERIALS,
  CATEGORY_PANELS,
  DiscoveryMaterial,
  getProductForDiscoveryMaterial,
} from '../../data/catalogueDiscoveryData.ts';
import { CategoryShowcase } from './CategoryShowcase.tsx';
import { MaterialGrid } from './MaterialGrid.tsx';
import { CatalogueNavigation, NavFilter } from './CatalogueNavigation.tsx';
import { FabricViewer360 } from './FabricViewer360.tsx';
import { FireflyFabric3DViewer } from './FireflyFabric3DViewer.tsx';
import { getProductForFireflyFabric } from '../../data/fireflyFabricsData.ts';
import { RequestMaterialCallout } from './RequestMaterialCallout.tsx';
import { Product, CollectionItem } from '../../types.ts';
import { Sparkles, ArrowRight, RotateCw } from 'lucide-react';
import { DiamondMotif } from '../DiamondMotif.tsx';

interface CatalogueLandingProps {
  initialCategory?: string | null;
  onViewDetails: (product: Product) => void;
  onEnquire: (product: Product) => void;
  onAddToCollection?: (product: Product, quantity?: number, colour?: string, size?: string) => void;
  collection?: CollectionItem[];
  onViewCollection?: () => void;
  onRequestMaterial?: (category?: any, similarProduct?: Product) => void;
  onReachUs?: (materialContext?: string) => void;
}

function parseCategoryParam(cat?: string | null): { nav: NavFilter; sub: string } {
  if (!cat || cat.toLowerCase() === 'all') {
    return { nav: 'ALL', sub: 'ALL' };
  }
  const lower = cat.toLowerCase().trim();
  if (lower === 'denim') {
    return { nav: 'DENIM & CHAMBRAY', sub: 'DENIM' };
  }
  if (lower === 'chambray') {
    return { nav: 'DENIM & CHAMBRAY', sub: 'CHAMBRAY' };
  }
  if (lower.includes('denim') || lower.includes('chambray')) {
    return { nav: 'DENIM & CHAMBRAY', sub: 'ALL' };
  }
  if (lower === 'zippers' || lower === 'zipper') {
    return { nav: 'GARMENT ACCESSORIES', sub: 'ZIPPERS' };
  }
  if (lower === 'buttons' || lower === 'button') {
    return { nav: 'GARMENT ACCESSORIES', sub: 'BUTTONS' };
  }
  if (lower === 'tipping') {
    return { nav: 'GARMENT ACCESSORIES', sub: 'TIPPING' };
  }
  if (lower === 'accessories' || lower.includes('access')) {
    return { nav: 'GARMENT ACCESSORIES', sub: 'ALL' };
  }
  if (lower === 'laces' || lower === 'lace') {
    return { nav: 'LACES', sub: 'ALL' };
  }
  if (lower === 'mesh' || lower === 'lycra-mesh' || lower === 'lycra') {
    return { nav: 'FABRICS', sub: 'MESH_STRETCH' };
  }
  if (lower === 'woven') {
    return { nav: 'FABRICS', sub: 'WOVEN' };
  }
  if (lower === 'specialty') {
    return { nav: 'FABRICS', sub: 'SPECIALTY' };
  }
  if (lower === 'patterns') {
    return { nav: 'FABRICS', sub: 'PATTERNS' };
  }
  if (lower === 'tapes' || lower === 'tags') {
    return { nav: 'GARMENT ACCESSORIES', sub: 'ALL' };
  }
  if (lower.includes('fabric')) {
    return { nav: 'FABRICS', sub: 'ALL' };
  }
  return { nav: 'ALL', sub: 'ALL' };
}

export const CatalogueLanding: React.FC<CatalogueLandingProps> = ({
  initialCategory,
  onViewDetails,
  onEnquire,
  onAddToCollection,
  collection = [],
  onRequestMaterial,
  onReachUs,
}) => {
  const initialParsed = useMemo(() => parseCategoryParam(initialCategory), [initialCategory]);
  // Navigation filter state
  const [activeFilter, setActiveFilter] = useState<NavFilter>(initialParsed.nav);
  const [activeSubFilter, setActiveSubFilter] = useState<string>(initialParsed.sub);
  const [searchQuery, setSearchQuery] = useState('');

  // ── 360° Viewer
  const [isViewer360Open, setIsViewer360Open] = useState(false);
  const [isFireflyViewerOpen, setIsFireflyViewerOpen] = useState(false);
  const [viewer360Material, setViewer360Material] = useState<DiscoveryMaterial | null>(null);

  const handleOpen360Viewer = (material?: DiscoveryMaterial) => {
    setViewer360Material(material || null);
    setIsViewer360Open(true);
  };

  // Section reference to smoothly scroll when category is selected
  const materialsSectionRef = useRef<HTMLDivElement>(null);

  // Sync with initialCategory prop changes (from URL or home page clicks)
  useEffect(() => {
    const parsed = parseCategoryParam(initialCategory);
    setActiveFilter(parsed.nav);
    setActiveSubFilter(parsed.sub);
    setSearchQuery('');
    if (initialCategory && initialCategory.toLowerCase() !== 'all') {
      const timer = setTimeout(() => {
        if (materialsSectionRef.current) {
          materialsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [initialCategory]);

  // Filtered materials based on category, sub-filter and search query
  const filteredMaterials = useMemo(() => {
    let result = ALL_DISCOVERY_MATERIALS;

    // Filter by main category
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

  // Handle category panel click from Core Material Divisions
  const handleSelectCategoryPanel = (catId: NavFilter) => {
    setActiveFilter(catId);
    setActiveSubFilter('ALL');
    setSearchQuery('');
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      params.set('tab', 'catalogue');
      const slug = catId === 'GARMENT ACCESSORIES' ? 'accessories' : catId === 'DENIM & CHAMBRAY' ? 'denim' : catId.toLowerCase();
      params.set('category', slug);
      window.history.pushState(null, '', `${window.location.pathname}?${params.toString()}`);
    }
    // Smooth scroll down to materials section
    if (materialsSectionRef.current) {
      materialsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle filter selection from sticky nav
  const handleSelectNavFilter = (filter: NavFilter) => {
    setActiveFilter(filter);
    setActiveSubFilter('ALL');
    setSearchQuery('');
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      params.set('tab', 'catalogue');
      if (filter === 'ALL') {
        params.delete('category');
      } else {
        const slug = filter === 'GARMENT ACCESSORIES' ? 'accessories' : filter === 'DENIM & CHAMBRAY' ? 'denim' : filter.toLowerCase();
        params.set('category', slug);
      }
      window.history.pushState(null, '', `${window.location.pathname}?${params.toString()}`);
    }
  };

  // Handle sub-filter pill selection
  const handleSelectSubFilter = (sub: string) => {
    setActiveSubFilter(sub);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      params.set('tab', 'catalogue');
      if (sub === 'ALL') {
        if (activeFilter === 'GARMENT ACCESSORIES') params.set('category', 'accessories');
        else if (activeFilter === 'DENIM & CHAMBRAY') params.set('category', 'denim');
        else if (activeFilter === 'FABRICS') params.set('category', 'fabrics');
        else if (activeFilter === 'LACES') params.set('category', 'laces');
      } else {
        params.set('category', sub.toLowerCase());
      }
      window.history.pushState(null, '', `${window.location.pathname}?${params.toString()}`);
    }
  };

  const handleDeepDetailsMaterial = (material: DiscoveryMaterial) => {
    const product = getProductForDiscoveryMaterial(material);
    onViewDetails(product);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#FAF8F5] text-[#181715] selection:bg-[#E0D7C8] selection:text-[#181715]">
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
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#181715] leading-[1.12]">
            Materials Behind Every Garment
          </h1>

          <DiamondMotif align="center" maxWidth="max-w-xs" />

          <p className="text-sm sm:text-base md:text-lg text-[#666057] max-w-2xl mx-auto leading-relaxed font-sans">
            Explore fabrics, denim, chambray, laces and garment accessories sourced for apparel production.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {/* 1. Explore Fabrics (Scroll to category browsing) */}
            <button
              type="button"
              onClick={() => {
                if (materialsSectionRef.current) {
                  materialsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider bg-[#181715] hover:bg-[#2E2B26] text-white rounded-full shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Explore Fabrics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* 2. 3D & 360° Fabric Studio */}
            <button
              type="button"
              onClick={() => handleOpen360Viewer()}
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-[#181715] via-[#2A2318] to-[#181715] text-[#FAF7F2] border border-[#D4AF37] hover:border-[#F3E2B8] rounded-full shadow-[0_2px_12px_rgba(212,175,55,0.25)] transition-all hover:scale-[1.02] cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5 text-[#D4AF37] animate-spin-slow" />
              <span>360° Studio</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. STICKY CATALOGUE NAVIGATION (Slim, zero-pill bar)
          ======================================================== */}
      <CatalogueNavigation
        activeFilter={activeFilter}
        onSelectFilter={handleSelectNavFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpen360={() => handleOpen360Viewer()}
        totalMaterialsCount={filteredMaterials.length}
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:pt-10 sm:pb-20 space-y-12 sm:space-y-16">
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
            — FEATURE 1: EXPLORE FABRICS (UNCHANGED)
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
                onSelectMaterial={handleDeepDetailsMaterial}
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
                  onSelectMaterial={handleDeepDetailsMaterial}
                  onOpen360={handleOpen360Viewer}
                />
              </div>

              {/* LACES */}
              <div className="pt-6 border-t border-[#EAE3D6]">
                <MaterialGrid
                  title="Laces & Trims"
                  subtitle="Fine embroidery needlework, pure cotton crochet, raschel lycra, ric rac and imported lace."
                  materials={ALL_DISCOVERY_MATERIALS.filter((m) => m.category === 'LACES')}
                  onSelectMaterial={handleDeepDetailsMaterial}
                  onOpen360={handleOpen360Viewer}
                />
              </div>

              {/* GARMENT ACCESSORIES — SEPARATE PRODUCTS AS REQUESTED */}
              <div className="pt-6 border-t border-[#EAE3D6]">
                <MaterialGrid
                  title="Garment Accessories"
                  subtitle="Continuous zipper coils, natural and horn buttons, tipping, and apparel sundries."
                  materials={ALL_DISCOVERY_MATERIALS.filter((m) => m.category === 'GARMENT ACCESSORIES')}
                  onSelectMaterial={handleDeepDetailsMaterial}
                  onOpen360={handleOpen360Viewer}
                  subsections={[
                    {
                      title: 'Zippers',
                      description: 'Heavy-duty precision interlocking metallic teeth and lightweight molded vislon closures.',
                      filterSection: 'ZIPPERS',
                    },
                    {
                      title: 'Buttons',
                      description: 'Stamped brass, snap fasteners, lead-free crystal glass, durable polyester resin, organic wood, pearl, and natural mollusc shell buttons.',
                      filterSection: 'BUTTONS',
                    },
                    {
                      title: 'Tipping',
                      description: 'Clear heat-sealed cellulose acetate film and electroplated solid brass / zinc aglets for drawstrings and hoodie cords.',
                      filterSection: 'TIPPING',
                    },
                  ]}
                />
              </div>
            </div>
          ) : activeFilter === 'GARMENT ACCESSORIES' && !searchQuery ? (
            /* Specific GARMENT ACCESSORIES View */
            <div className="space-y-8">
              {/* Sub-category Quick Filters */}
              <div className="flex flex-wrap items-center gap-2 border-b border-[#E8E2D7] pb-4">
                <span className="text-xs font-mono font-medium text-[#7A746B] uppercase mr-2">Filter By:</span>
                {[
                  { id: 'ALL', label: 'All Accessories (11)' },
                  { id: 'ZIPPERS', label: 'Zippers (2)' },
                  { id: 'BUTTONS', label: 'Buttons (7)' },
                  { id: 'TIPPING', label: 'Tipping (2)' },
                ].map((pill) => {
                  const isActive = activeSubFilter === pill.id;
                  return (
                    <button
                      key={pill.id}
                      type="button"
                      onClick={() => handleSelectSubFilter(pill.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#181715] text-white shadow-xs font-semibold'
                          : 'bg-white border border-[#DDD5C7] text-[#6A645A] hover:text-[#181715] hover:bg-[#EFECE5]'
                      }`}
                    >
                      {pill.label}
                    </button>
                  );
                })}
              </div>

              {activeSubFilter === 'ALL' ? (
                <MaterialGrid
                  title="Garment Accessories"
                  subtitle="Continuous zipper coils, natural and horn buttons, tipping, and apparel sundries."
                  materials={filteredMaterials}
                  onSelectMaterial={handleDeepDetailsMaterial}
                  onOpen360={handleOpen360Viewer}
                  subsections={[
                    {
                      title: 'Zippers',
                      description: 'Heavy-duty precision interlocking metallic teeth and lightweight molded vislon closures for outerwear and activewear.',
                      filterSection: 'ZIPPERS',
                    },
                    {
                      title: 'Buttons',
                      description: 'Stamped brass, snap fasteners, lead-free crystal glass, durable polyester resin, organic wood, pearl, and natural mollusc shell buttons.',
                      filterSection: 'BUTTONS',
                    },
                    {
                      title: 'Tipping',
                      description: 'Clear heat-sealed cellulose acetate film and electroplated solid brass / zinc aglets for drawstrings and hoodie cords.',
                      filterSection: 'TIPPING',
                    },
                  ]}
                />
              ) : (
                <MaterialGrid
                  title={activeSubFilter === 'ZIPPERS' ? 'Zippers' : activeSubFilter === 'BUTTONS' ? 'Buttons' : 'Tipping'}
                  subtitle={
                    activeSubFilter === 'ZIPPERS'
                      ? 'Heavy-duty interlocking metallic teeth and lightweight molded vislon closures.'
                      : activeSubFilter === 'BUTTONS'
                      ? 'Stamped brass, snap fasteners, crystal glass, resilient resin, natural wood, pearl, and marine shell buttons.'
                      : 'Clear heat-sealed acetate film and electroplated solid metal aglets for cords and drawstrings.'
                  }
                  materials={filteredMaterials.filter((m) => m.section === activeSubFilter)}
                  onSelectMaterial={handleDeepDetailsMaterial}
                  onOpen360={handleOpen360Viewer}
                  showCategoryLabel={true}
                />
              )}
            </div>
          ) : activeFilter === 'DENIM & CHAMBRAY' && !searchQuery ? (
            /* Specific DENIM & CHAMBRAY View */
            <div className="space-y-8">
              {/* Sub-category Quick Filters */}
              <div className="flex flex-wrap items-center gap-2 border-b border-[#E8E2D7] pb-4">
                <span className="text-xs font-mono font-medium text-[#7A746B] uppercase mr-2">Filter By:</span>
                {[
                  { id: 'ALL', label: 'All (2)' },
                  { id: 'DENIM', label: 'Denim (1)' },
                  { id: 'CHAMBRAY', label: 'Chambray (1)' },
                ].map((pill) => {
                  const isActive = activeSubFilter === pill.id;
                  return (
                    <button
                      key={pill.id}
                      type="button"
                      onClick={() => handleSelectSubFilter(pill.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#181715] text-white shadow-xs font-semibold'
                          : 'bg-white border border-[#DDD5C7] text-[#6A645A] hover:text-[#181715] hover:bg-[#EFECE5]'
                      }`}
                    >
                      {pill.label}
                    </button>
                  );
                })}
              </div>

              <MaterialGrid
                title={activeSubFilter === 'DENIM' ? 'Denim Fabric' : activeSubFilter === 'CHAMBRAY' ? 'Chambray Fabric' : 'Denim & Chambray'}
                subtitle={
                  activeSubFilter === 'DENIM'
                    ? 'Authentic 3/1 right-hand twill textile with indigo dyed warp and unbleached ecru weft.'
                    : activeSubFilter === 'CHAMBRAY'
                    ? 'Lightweight plain-weave textile with coloured indigo warp and clean white weft yarns.'
                    : 'Authentic raw indigo twill textiles and lightweight chambray weaves.'
                }
                materials={
                  activeSubFilter === 'ALL'
                    ? filteredMaterials
                    : filteredMaterials.filter((m) => m.subcategory === activeSubFilter)
                }
                onSelectMaterial={handleDeepDetailsMaterial}
                onOpen360={handleOpen360Viewer}
                showCategoryLabel={true}
              />
            </div>
          ) : activeFilter === 'FABRICS' && !searchQuery ? (
            /* Specific FABRICS View */
            <div className="space-y-8">
              {/* Sub-category Quick Filters */}
              <div className="flex flex-wrap items-center gap-2 border-b border-[#E8E2D7] pb-4">
                <span className="text-xs font-mono font-medium text-[#7A746B] uppercase mr-2">Filter By:</span>
                {[
                  { id: 'ALL', label: 'All Fabrics (23)' },
                  { id: 'WOVEN', label: 'Woven (6)' },
                  { id: 'SPECIALTY', label: 'Specialty (8)' },
                  { id: 'MESH_STRETCH', label: 'Mesh & Stretch (3)' },
                  { id: 'PATTERNS', label: 'Patterns (2)' },
                ].map((pill) => {
                  const isActive = activeSubFilter === pill.id;
                  return (
                    <button
                      key={pill.id}
                      type="button"
                      onClick={() => handleSelectSubFilter(pill.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#181715] text-white shadow-xs font-semibold'
                          : 'bg-white border border-[#DDD5C7] text-[#6A645A] hover:text-[#181715] hover:bg-[#EFECE5]'
                      }`}
                    >
                      {pill.label}
                    </button>
                  );
                })}
              </div>

              {activeSubFilter === 'ALL' ? (
                <MaterialGrid
                  title="Explore Fabrics"
                  subtitle="Browse materials by construction, texture and application."
                  materials={filteredMaterials}
                  onSelectMaterial={handleDeepDetailsMaterial}
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
              ) : (
                <MaterialGrid
                  title={
                    activeSubFilter === 'WOVEN'
                      ? 'Woven Fabrics'
                      : activeSubFilter === 'SPECIALTY'
                      ? 'Specialty Fabrics'
                      : activeSubFilter === 'MESH_STRETCH'
                      ? 'Mesh & Stretch'
                      : 'Patterned Fabrics'
                  }
                  subtitle="Sourced and manufactured for high-performance apparel construction."
                  materials={filteredMaterials.filter((m) => m.section === activeSubFilter)}
                  onSelectMaterial={handleDeepDetailsMaterial}
                  onOpen360={handleOpen360Viewer}
                  showCategoryLabel={true}
                />
              )}
            </div>
          ) : activeFilter === 'LACES' && !searchQuery ? (
            /* Specific LACES View */
            <MaterialGrid
              title="Laces & Trims"
              subtitle="Fine embroidery needlework, pure cotton crochet, raschel lycra, ric rac and imported lace."
              materials={filteredMaterials}
              onSelectMaterial={handleDeepDetailsMaterial}
              onOpen360={handleOpen360Viewer}
              showCategoryLabel={true}
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
              onSelectMaterial={handleDeepDetailsMaterial}
              onOpen360={handleOpen360Viewer}
              showCategoryLabel={true}
            />
          )}
        </div>

        {/* ========================================================
            5. REQUEST A MATERIAL CALLOUT
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
          10. 360° FABRIC ATELIER STUDIO (15 REAL FABRIC TEXTURES)
          ======================================================== */}
      {isViewer360Open && (
        <FireflyFabric3DViewer
          isModal={true}
          initialMaterial={viewer360Material}
          onBack={() => {
            setIsViewer360Open(false);
            setViewer360Material(null);
          }}
          onEnquire={(f) => {
            setIsViewer360Open(false);
            setViewer360Material(null);
            onEnquire(getProductForFireflyFabric(f));
          }}
        />
      )}
    </div>
  );
};
