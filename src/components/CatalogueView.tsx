import React, { useState, useMemo } from 'react';
import { Product, ProductCategory, AvailabilityStatus, CollectionItem } from '../types.ts';
import { products, categories } from '../data/products.ts';
import { ProductService } from '../services/productService.ts';
import { ProductCard } from './ProductCard.tsx';
import {
  Search,
  X,
  SlidersHorizontal,
  RotateCcw,
  Palette,
  Ruler,
  Clock,
  ArrowUpDown,
  ShoppingBag,
  Sparkles,
  Filter,
  ArrowRight,
} from 'lucide-react';

interface CatalogueViewProps {
  initialCategory?: ProductCategory | 'all';
  onViewDetails: (product: Product) => void;
  onEnquire: (product: Product) => void;
  onAddToCollection?: (product: Product) => void;
  collection?: CollectionItem[];
  onViewCollection?: () => void;
  onRequestMaterial?: (category?: ProductCategory) => void;
}

export const CatalogueView: React.FC<CatalogueViewProps> = ({
  initialCategory = 'all',
  onViewDetails,
  onEnquire,
  onAddToCollection,
  collection = [],
  onViewCollection,
  onRequestMaterial,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColour, setSelectedColour] = useState<string | 'all'>('all');
  const [selectedSize, setSelectedSize] = useState<string | 'all'>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<AvailabilityStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'name-asc' | 'name-desc' | 'code'>('featured');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Category Filter tabs with live counts
  const filterTabs: { id: ProductCategory | 'all'; label: string; count: number }[] = useMemo(() => {
    return [
      { id: 'all', label: 'ALL MATERIALS', count: products.length },
      { id: 'laces', label: 'LACES', count: products.filter((p) => p.category === 'laces').length },
      { id: 'fabrics', label: 'FABRICS', count: products.filter((p) => p.category === 'fabrics').length },
      { id: 'denim', label: 'DENIM', count: products.filter((p) => p.category === 'denim').length },
      { id: 'mesh', label: 'MESH', count: products.filter((p) => p.category === 'mesh').length },
      { id: 'accessories', label: 'ACCESSORIES', count: products.filter((p) => p.category === 'accessories').length },
      { id: 'processing', label: 'PROCESSING', count: products.filter((p) => p.category === 'processing').length },
    ];
  }, []);

  const activeCategoryInfo = useMemo(() => {
    if (selectedCategory === 'all') return null;
    return categories.find((c) => c.id === selectedCategory);
  }, [selectedCategory]);

  // Dynamic filter options based on the current category context
  const currentCategoryProducts = useMemo(() => {
    if (selectedCategory === 'all') return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const distinctColours = useMemo(() => {
    return ProductService.getDistinctColours(currentCategoryProducts);
  }, [currentCategoryProducts]);

  const distinctSizes = useMemo(() => {
    return ProductService.getDistinctSizes(currentCategoryProducts);
  }, [currentCategoryProducts]);

  const availabilityOptions: AvailabilityStatus[] = useMemo(() => {
    return ['In Stock', 'Made to Order', 'Available on Order', 'Sampling Available'];
  }, []);

  const handleCategoryChange = (cat: ProductCategory | 'all') => {
    setSelectedCategory(cat);
    setSelectedSubcategory('all');
    setSelectedColour('all');
    setSelectedSize('all');
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setSearchQuery('');
    setSelectedColour('all');
    setSelectedSize('all');
    setSelectedAvailability('all');
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedSubcategory !== 'all' ||
    searchQuery.trim() !== '' ||
    selectedColour !== 'all' ||
    selectedSize !== 'all' ||
    selectedAvailability !== 'all' ||
    sortBy !== 'featured';

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return ProductService.filterProducts(products, {
      category: selectedCategory,
      subcategory: selectedSubcategory,
      search: searchQuery,
      colour: selectedColour,
      size: selectedSize,
      availability: selectedAvailability,
      sortBy: sortBy,
    });
  }, [selectedCategory, selectedSubcategory, searchQuery, selectedColour, selectedSize, selectedAvailability, sortBy]);

  // Quick lookup for items already in collection
  const collectionLookup = useMemo(() => {
    const map = new Map<string, number>();
    collection.forEach((item) => {
      map.set(item.product.id, item.quantity);
    });
    return map;
  }, [collection]);

  return (
    <div className="bg-[#FBFBFA] min-h-screen pb-24">
      {/* 1. Header Banner */}
      <section className="bg-[#F7F5F0] border-b border-[#E8E6E0] pt-12 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#82553E] bg-[#EFE8DF] px-3.5 py-1.5 rounded-sm border border-[#DFD6CB] inline-block font-mono">
            DIGITAL CATALOGUE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181715] tracking-tight">
            Materials We Commonly Supply
          </h1>
          <p className="text-sm sm:text-base text-[#585550] max-w-2xl mx-auto leading-relaxed">
            A selection of materials we commonly supply across garment laces, fabrics, denim, mesh, and trims.
          </p>

          {/* Sourcing Callout Card on Catalogue */}
          <div className="pt-3 max-w-2xl mx-auto">
            <div className="bg-white border border-[#E0D9CE] p-4 sm:p-5 rounded-lg shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#181715] uppercase tracking-wider block">
                  Can&apos;t find the exact material you&apos;re looking for?
                </span>
                <p className="text-xs text-[#585550] leading-relaxed">
                  Not every available material is listed in our digital catalogue. If you have a specific requirement, send us the details and we will review suitable sourcing options.
                </p>
              </div>
              {onRequestMaterial && (
                <button
                  onClick={() => onRequestMaterial(selectedCategory === 'all' ? undefined : selectedCategory)}
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#181715] text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#302D29] transition-colors"
                >
                  <span>Request a Material</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Sticky Filter & Search Bar */}
      <div className="sticky top-20 z-30 bg-[#FBFBFA]/95 backdrop-blur-md border-b border-[#E8E6E0] py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          {/* Top Row: Category Tabs + Search Input */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none no-scrollbar">
              {filterTabs.map((tab) => {
                const isActive = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleCategoryChange(tab.id)}
                    className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-[#181715] text-white shadow-sm'
                        : 'bg-[#F0EEEA] text-[#585550] hover:bg-[#E5E2DC] hover:text-[#181715]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`ml-1.5 text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-white/20 text-white' : 'bg-[#E3DFD7] text-[#585550]'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Live Search Input & Filter Toggle */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 lg:w-72">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C877E]">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search code, name, fabric..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 bg-white border border-[#D5D0C6] rounded text-xs sm:text-sm text-[#181715] placeholder-[#8C877E] focus:outline-none focus:border-[#181715] transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8C877E] hover:text-[#181715]"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Mobile Filter Toggle Button */}
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className={`lg:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border rounded transition-colors ${
                  showMobileFilters || hasActiveFilters
                    ? 'bg-[#181715] text-white border-[#181715]'
                    : 'bg-white text-[#585550] border-[#D5D0C6]'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Subcategory Filter Tabs (If a category with multiple subcategories is selected) */}
          {activeCategoryInfo && activeCategoryInfo.subcategories.length > 1 && (
            <div className="pt-2 flex items-center gap-1.5 overflow-x-auto text-xs pb-1 border-t border-[#EFECE6] no-scrollbar">
              <span className="text-[#8C877E] font-medium shrink-0 text-[11px] uppercase tracking-wider">
                Subcategory:
              </span>
              <button
                onClick={() => setSelectedSubcategory('all')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors whitespace-nowrap ${
                  selectedSubcategory === 'all'
                    ? 'bg-[#82553E] text-white'
                    : 'bg-[#F2EFEA] text-[#585550] hover:bg-[#EAE5DC]'
                }`}
              >
                All {activeCategoryInfo.name}
              </button>
              {activeCategoryInfo.subcategories.map((subcat) => (
                <button
                  key={subcat}
                  onClick={() => setSelectedSubcategory(subcat)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap transition-colors ${
                    selectedSubcategory === subcat
                      ? 'bg-[#82553E] text-white'
                      : 'bg-[#F2EFEA] text-[#585550] hover:bg-[#EAE5DC]'
                  }`}
                >
                  {subcat}
                </button>
              ))}
            </div>
          )}

          {/* Secondary Filters Bar: Size, Colour, Availability & Sort (Desktop + Mobile expandable) */}
          <div
            className={`grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2 pt-2 border-t border-[#EFECE6] ${
              showMobileFilters ? 'block' : 'hidden lg:grid'
            }`}
          >
            {/* 1. Size / Width Filter */}
            <div className="flex items-center gap-1.5 bg-white border border-[#DCD7CD] rounded px-2.5 py-1.5 text-xs">
              <Ruler className="w-3.5 h-3.5 text-[#82553E] shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="text-[9px] uppercase tracking-wider text-[#8C877E] block font-mono">
                  Size / Width
                </label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full bg-transparent font-medium text-[#181715] focus:outline-none cursor-pointer truncate text-xs"
                >
                  <option value="all">All Sizes ({distinctSizes.length})</option>
                  {distinctSizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. Colour Filter */}
            <div className="flex items-center gap-1.5 bg-white border border-[#DCD7CD] rounded px-2.5 py-1.5 text-xs">
              <Palette className="w-3.5 h-3.5 text-[#82553E] shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="text-[9px] uppercase tracking-wider text-[#8C877E] block font-mono">
                  Colour / Shade
                </label>
                <select
                  value={selectedColour}
                  onChange={(e) => setSelectedColour(e.target.value)}
                  className="w-full bg-transparent font-medium text-[#181715] focus:outline-none cursor-pointer truncate text-xs"
                >
                  <option value="all">All Colours ({distinctColours.length})</option>
                  {distinctColours.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Availability Filter */}
            <div className="flex items-center gap-1.5 bg-white border border-[#DCD7CD] rounded px-2.5 py-1.5 text-xs">
              <Clock className="w-3.5 h-3.5 text-[#82553E] shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="text-[9px] uppercase tracking-wider text-[#8C877E] block font-mono">
                  Availability
                </label>
                <select
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value as AvailabilityStatus | 'all')}
                  className="w-full bg-transparent font-medium text-[#181715] focus:outline-none cursor-pointer truncate text-xs"
                >
                  <option value="all">All Statuses</option>
                  {availabilityOptions.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 4. Sort Filter */}
            <div className="flex items-center gap-1.5 bg-white border border-[#DCD7CD] rounded px-2.5 py-1.5 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#82553E] shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="text-[9px] uppercase tracking-wider text-[#8C877E] block font-mono">
                  Sort Order
                </label>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as 'featured' | 'name-asc' | 'name-desc' | 'code')
                  }
                  className="w-full bg-transparent font-medium text-[#181715] focus:outline-none cursor-pointer truncate text-xs"
                >
                  <option value="featured">Featured First</option>
                  <option value="code">Product Code</option>
                  <option value="name-asc">Name (A to Z)</option>
                  <option value="name-desc">Name (Z to A)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Results Summary & Active Filter Tags Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#736F68] gap-3 pb-3 border-b border-[#EFECE6]">
          <div className="flex items-center gap-2 flex-wrap">
            <span>
              Showing <strong className="text-[#181715] font-mono">{filteredProducts.length}</strong> of{' '}
              <strong className="text-[#181715] font-mono">{products.length}</strong> materials
            </span>

            {/* Active filter chips */}
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-[#F2EDE6] text-[#633F2E] px-2 py-0.5 rounded text-[11px]">
                <span>Category: {selectedCategory}</span>
                <button
                  onClick={() => handleCategoryChange('all')}
                  className="hover:text-black ml-0.5"
                >
                  ×
                </button>
              </span>
            )}

            {selectedSubcategory !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-[#F2EDE6] text-[#633F2E] px-2 py-0.5 rounded text-[11px]">
                <span>{selectedSubcategory}</span>
                <button
                  onClick={() => setSelectedSubcategory('all')}
                  className="hover:text-black ml-0.5"
                >
                  ×
                </button>
              </span>
            )}

            {selectedSize !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-[#F2EDE6] text-[#633F2E] px-2 py-0.5 rounded text-[11px]">
                <span>Size: {selectedSize}</span>
                <button onClick={() => setSelectedSize('all')} className="hover:text-black ml-0.5">
                  ×
                </button>
              </span>
            )}

            {selectedColour !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-[#F2EDE6] text-[#633F2E] px-2 py-0.5 rounded text-[11px]">
                <span>Colour: {selectedColour}</span>
                <button onClick={() => setSelectedColour('all')} className="hover:text-black ml-0.5">
                  ×
                </button>
              </span>
            )}

            {selectedAvailability !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-[#F2EDE6] text-[#633F2E] px-2 py-0.5 rounded text-[11px]">
                <span>Status: {selectedAvailability}</span>
                <button
                  onClick={() => setSelectedAvailability('all')}
                  className="hover:text-black ml-0.5"
                >
                  ×
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-[#F2EDE6] text-[#633F2E] px-2 py-0.5 rounded text-[11px]">
                <span>Search: "{searchQuery}"</span>
                <button onClick={() => setSearchQuery('')} className="hover:text-black ml-0.5">
                  ×
                </button>
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs text-[#82553E] hover:text-[#181715] font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset all filters</span>
            </button>
          )}
        </div>

        {/* 4. Products Grid or Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#E8E6E0] p-10 sm:p-14 text-center max-w-lg mx-auto my-12 space-y-4 shadow-sm">
            <div className="w-14 h-14 bg-[#F5F4F0] text-[#736F68] rounded-full flex items-center justify-center mx-auto border border-[#E8E5DF]">
              <Search className="w-6 h-6 text-[#82553E]" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#181715]">
              No Materials Found
            </h3>
            <p className="text-xs sm:text-sm text-[#585550] leading-relaxed">
              No product items matched your active search query and filter criteria. Try clearing some filters or searching for terms like "cotton", "denim", "lace", or product codes like "CF-LAC-101".
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#181715] rounded hover:bg-[#302D29] transition-colors"
              >
                Reset Filters &amp; View All
              </button>
              {onRequestMaterial && (
                <button
                  onClick={() => onRequestMaterial(selectedCategory === 'all' ? undefined : selectedCategory)}
                  className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#82553E] bg-[#F2EDE6] hover:bg-[#EAE2D6] rounded transition-colors"
                >
                  Request A Material
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onViewDetails}
                onEnquire={onEnquire}
                onAddToCollection={onAddToCollection}
                isInCollection={collectionLookup.has(product.id)}
                collectionQuantity={collectionLookup.get(product.id) || 0}
              />
            ))}
          </div>
        )}

        {/* 5. Can't Find Your Material? Prominent Sourcing CTA Section */}
        <section className="mt-16 bg-[#F5F2EB] border border-[#DDD6C8] rounded-xl p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-xs">
          <div className="space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-[#82553E] bg-[#EAE2D6] px-3 py-1 rounded inline-block">
              CUSTOM B2B SOURCING
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#181715]">
              CAN'T FIND YOUR MATERIAL?
            </h3>
            <p className="text-sm sm:text-base text-[#585550] leading-relaxed">
              Looking for a fabric, lace, denim, mesh or garment material that isn't listed in our catalogue? Tell us what you need and our team will review your requirement.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onRequestMaterial && onRequestMaterial(selectedCategory === 'all' ? undefined : selectedCategory)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#181715] hover:bg-[#302D29] text-white text-xs font-semibold uppercase tracking-wider rounded transition-all shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-[#E5D7CC]" />
                <span>REQUEST A MATERIAL</span>
              </button>
              <button
                onClick={() => onRequestMaterial && onRequestMaterial()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-[#D5D0C6] hover:bg-[#FAF9F6] text-[#181715] text-xs font-semibold uppercase tracking-wider rounded transition-colors"
              >
                <span>Can't Find What You Need?</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
