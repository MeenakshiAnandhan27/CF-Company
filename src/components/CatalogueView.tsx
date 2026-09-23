import React, { useState, useMemo } from 'react';
import { Product, ProductCategory } from '../types.ts';
import { products, categories } from '../data/products.ts';
import { ProductCard } from './ProductCard.tsx';
import { Search, X, Layers, Sparkles } from 'lucide-react';

interface CatalogueViewProps {
  initialCategory?: ProductCategory | 'all';
  onViewDetails: (product: Product) => void;
  onEnquire: (product: Product) => void;
}

export const CatalogueView: React.FC<CatalogueViewProps> = ({
  initialCategory = 'all',
  onViewDetails,
  onEnquire,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 7 Filter tabs from requirements
  const filterTabs: { id: ProductCategory | 'all'; label: string; count: number }[] = useMemo(() => {
    return [
      { id: 'all', label: 'ALL', count: products.length },
      { id: 'laces', label: 'LACES', count: products.filter(p => p.category === 'laces').length },
      { id: 'fabrics', label: 'FABRICS', count: products.filter(p => p.category === 'fabrics').length },
      { id: 'denim', label: 'DENIM', count: products.filter(p => p.category === 'denim').length },
      { id: 'mesh', label: 'MESH', count: products.filter(p => p.category === 'mesh').length },
      { id: 'accessories', label: 'ACCESSORIES', count: products.filter(p => p.category === 'accessories').length },
      { id: 'processing', label: 'PROCESSING', count: products.filter(p => p.category === 'processing').length },
    ];
  }, []);

  const activeCategoryInfo = useMemo(() => {
    if (selectedCategory === 'all') return null;
    return categories.find(c => c.id === selectedCategory);
  }, [selectedCategory]);

  const handleCategoryChange = (cat: ProductCategory | 'all') => {
    setSelectedCategory(cat);
    setSelectedSubcategory('all');
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

      // Subcategory filter
      const matchesSubcategory = selectedSubcategory === 'all' || product.subcategory === selectedSubcategory;

      // Search query filter
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCategory && matchesSubcategory;

      const matchesName = product.name.toLowerCase().includes(query);
      const matchesCategoryLabel = product.categoryLabel.toLowerCase().includes(query);
      const matchesSubcatName = (product.subcategory || '').toLowerCase().includes(query);
      const matchesDesc = product.shortDescription.toLowerCase().includes(query);
      const matchesApps = product.applications?.some(app => app.toLowerCase().includes(query));

      return matchesCategory && matchesSubcategory && (matchesName || matchesCategoryLabel || matchesSubcatName || matchesDesc || matchesApps);
    });
  }, [selectedCategory, selectedSubcategory, searchQuery]);

  return (
    <div className="bg-[#FBFBFA] min-h-screen pb-24">
      
      {/* 7. CATALOGUE HEADER */}
      <section className="bg-[#F7F5F0] border-b border-[#E8E6E0] pt-12 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#82553E] bg-[#EFE8DF] px-3.5 py-1.5 rounded-sm border border-[#DFD6CB] inline-block font-mono">
            DIGITAL CATALOGUE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181715] tracking-tight">
            Explore Our Materials
          </h1>
          <p className="text-sm sm:text-base text-[#585550] max-w-2xl mx-auto leading-relaxed">
            Browse our range of garment accessories, fabrics and specialized textile materials.
          </p>
        </div>
      </section>

      {/* 14. CATALOGUE FILTERING: Sticky Filter Bar */}
      <div className="sticky top-20 z-30 bg-[#FBFBFA]/95 backdrop-blur-md border-b border-[#E8E6E0] py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none no-scrollbar">
              {filterTabs.map((tab) => {
                const isActive = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleCategoryChange(tab.id)}
                    className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-[#181715] text-white shadow-sm'
                        : 'bg-[#F0EEEA] text-[#585550] hover:bg-[#E5E2DC] hover:text-[#181715]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`ml-1.5 text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#E3DFD7] text-[#585550]'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Live Search Input */}
            <div className="relative w-full lg:w-80">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C877E]">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2 bg-white border border-[#D5D0C6] rounded text-sm text-[#181715] placeholder-[#8C877E] focus:outline-none focus:border-[#181715] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8C877E] hover:text-[#181715]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Subcategory Secondary Filters if a Category is Selected */}
          {activeCategoryInfo && activeCategoryInfo.subcategories.length > 1 && (
            <div className="pt-2 flex items-center gap-2 overflow-x-auto text-xs pb-1 border-t border-[#EFECE6]">
              <span className="text-[#8C877E] font-medium shrink-0">Subcategory:</span>
              <button
                onClick={() => setSelectedSubcategory('all')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
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

        </div>
      </div>

      {/* Main Catalogue Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Results Counter and Active Filter Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#736F68] mb-6 gap-2">
          <div>
            Showing <span className="font-semibold text-[#181715] font-mono">{filteredProducts.length}</span> items
            {selectedCategory !== 'all' && (
              <span> in <strong className="text-[#181715]">{filterTabs.find(t => t.id === selectedCategory)?.label}</strong></span>
            )}
            {selectedSubcategory !== 'all' && (
              <span> &gt; <strong className="text-[#82553E]">{selectedSubcategory}</strong></span>
            )}
            {searchQuery && (
              <span> matching "<strong className="text-[#181715]">{searchQuery}</strong>"</span>
            )}
          </div>

          {(selectedCategory !== 'all' || selectedSubcategory !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSubcategory('all');
                setSearchQuery('');
              }}
              className="text-xs text-[#82553E] hover:text-[#181715] underline font-medium text-left"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#E8E6E0] p-12 text-center max-w-lg mx-auto my-12 space-y-4">
            <div className="w-12 h-12 bg-[#F5F4F0] text-[#736F68] rounded-full flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-[#181715]">
              No materials match your criteria
            </h3>
            <p className="text-xs sm:text-sm text-[#585550]">
              We could not find any items matching your current filters. Try resetting search or select another category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSubcategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#181715] rounded hover:bg-[#302D29]"
            >
              Show All Products
            </button>
          </div>
        ) : (
          /* Responsive Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onViewDetails}
                onEnquire={onEnquire}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
