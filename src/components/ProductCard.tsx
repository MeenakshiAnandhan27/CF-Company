import React from 'react';
import { Product } from '../types.ts';
import { TextileVisual } from './TextileVisual.tsx';
import { Eye, Mail, Scissors, BookmarkPlus, Check, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onEnquire: (product: Product) => void;
  onAddToCollection?: (product: Product) => void;
  isInCollection?: boolean;
  collectionQuantity?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onEnquire,
  onAddToCollection,
  isInCollection = false,
  collectionQuantity = 0,
}) => {
  const isService = product.isService || product.category === 'processing';

  // Availability badge style
  const getAvailabilityBadge = (status: Product['availability']) => {
    switch (status) {
      case 'In Stock':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Made to Order':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Sampling Available':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'Available on Order':
      default:
        return 'bg-[#F2EFEA] text-[#635E56] border-[#DFDAD0]';
    }
  };

  return (
    <div className="group bg-white rounded-lg border border-[#E8E6E0] overflow-hidden flex flex-col justify-between hover:border-[#BFB8AC] hover:shadow-md transition-all duration-300">
      <div>
        {/* Product Visual Container */}
        <div
          className="cursor-pointer relative overflow-hidden bg-[#F5F4F0]"
          onClick={() => onViewDetails(product)}
        >
          <TextileVisual
            product={product}
            patternType={product.patternType}
            category={product.categoryLabel}
            name={product.name}
            aspectRatio="4:3"
          />

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-20 pointer-events-none">
            {/* Product Code Badge */}
            <span className="text-[10px] font-mono font-semibold tracking-wider bg-[#181715]/90 text-white px-2 py-0.5 rounded shadow-sm">
              {product.productCode}
            </span>

            <div className="flex items-center gap-1.5">
              {isService && (
                <span className="text-[10px] uppercase tracking-wider font-semibold bg-[#82553E] text-white px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                  <Scissors className="w-3 h-3" />
                  Service
                </span>
              )}
              {product.featured && !isService && (
                <span className="text-[10px] uppercase tracking-wider font-semibold bg-[#181715] text-[#F3EFE9] px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-[#C9A96E]" />
                  Featured
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Product Details Body */}
        <div className="p-4 sm:p-5 space-y-3">
          {/* Header row: Category & Availability */}
          <div className="flex items-center justify-between text-xs gap-2">
            <span className="uppercase tracking-wider font-mono font-semibold text-[#82553E] text-[11px]">
              {product.categoryLabel}
              {product.subcategory && (
                <span className="text-[#8C877E] font-normal"> / {product.subcategory}</span>
              )}
            </span>

            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded border ${getAvailabilityBadge(
                product.availability
              )}`}
            >
              {product.availability}
            </span>
          </div>

          {/* Product Title */}
          <div>
            <h3
              onClick={() => onViewDetails(product)}
              className="font-serif text-lg sm:text-xl font-bold text-[#181715] cursor-pointer group-hover:text-[#82553E] transition-colors leading-snug"
            >
              {product.name}
            </h3>
            <p className="text-xs text-[#585550] line-clamp-2 leading-relaxed mt-1">
              {product.shortDescription}
            </p>
          </div>

          {/* Fabric & Technical Attribute */}
          <div className="text-[11px] text-[#585550] bg-[#FAF9F6] border border-[#EFECE6] p-2.5 rounded space-y-1">
            <div className="flex items-start gap-1">
              <span className="font-semibold text-[#181715] shrink-0">Fabric:</span>
              <span className="truncate text-[#484540]">{product.fabric}</span>
            </div>

            {/* Price Indicator */}
            <div className="flex items-center justify-between pt-0.5 border-t border-[#EAE7DF] text-[11px]">
              <span className="font-semibold text-[#181715]">Wholesale:</span>
              <span className="font-mono font-semibold text-[#82553E]">{product.price}</span>
            </div>
          </div>

          {/* Available Colours & Sizes previews */}
          <div className="space-y-1.5 text-[11px]">
            {/* Colours summary */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[#8C877E] font-medium">Colours:</span>
              <span className="text-[#403D38] truncate">
                {product.colours.slice(0, 3).join(', ')}
                {product.colours.length > 3 && (
                  <span className="text-[#82553E] font-medium ml-1">
                    +{product.colours.length - 3} more
                  </span>
                )}
              </span>
            </div>

            {/* Sizes / Widths summary */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[#8C877E] font-medium">Sizes:</span>
              <span className="text-[#403D38] truncate">
                {product.sizes.slice(0, 2).join(' | ')}
                {product.sizes.length > 2 && (
                  <span className="text-[#82553E] font-medium ml-1">
                    +{product.sizes.length - 2}
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="p-4 sm:p-5 pt-0 space-y-2 mt-1">
        {/* Primary Action Row: View Details + Enquire */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onViewDetails(product)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#181715] bg-[#F5F4F0] hover:bg-[#EAE7DF] rounded transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#585550]" />
            <span>View Details</span>
          </button>

          <button
            onClick={() => onEnquire(product)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#181715] hover:bg-[#302D29] rounded transition-all shadow-xs"
          >
            <Mail className="w-3.5 h-3.5 text-[#D8C7B8]" />
            <span>Enquire</span>
          </button>
        </div>

        {/* Sourcing note link */}
        <button
          onClick={() => onViewDetails(product)}
          className="w-full inline-flex items-center justify-center gap-1 py-1 text-[11px] font-medium text-[#736F68] hover:text-[#181715] transition-colors"
        >
          <span>Ask About This Material</span>
        </button>
      </div>
    </div>
  );
};
