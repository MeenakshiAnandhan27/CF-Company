import React from 'react';
import { Product } from '../types.ts';
import { TextileVisual } from './TextileVisual.tsx';
import { Eye, Mail, Scissors } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onEnquire: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onEnquire,
}) => {
  const isService = product.isService || product.category === 'processing';

  return (
    <div className="group bg-white rounded-lg border border-[#E8E6E0] overflow-hidden flex flex-col justify-between hover:border-[#BFB8AC] hover:shadow-md transition-all duration-300">
      <div>
        {/* Product Visual */}
        <div
          className="cursor-pointer relative overflow-hidden"
          onClick={() => onViewDetails(product)}
        >
          <TextileVisual
            product={product}
            patternType={product.patternType}
            category={product.categoryLabel}
            name={product.name}
            aspectRatio="4:3"
          />
          {isService && (
            <div className="absolute top-3 right-3 z-20">
              <span className="text-[10px] uppercase tracking-wider font-semibold bg-[#181715] text-white px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                <Scissors className="w-3 h-3 text-[#A65D43]" />
                Service
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-5">
          <div className="flex items-center justify-between text-xs text-[#78746C] mb-1.5 font-mono">
            <span className="uppercase tracking-wider font-semibold text-[#82553E]">{product.categoryLabel}</span>
            {product.subcategory && (
              <span className="text-[11px] truncate max-w-[150px] text-[#736F68]">
                {product.subcategory}
              </span>
            )}
          </div>

          <h3
            onClick={() => onViewDetails(product)}
            className="font-serif text-xl font-bold text-[#181715] mb-2 cursor-pointer group-hover:text-[#82553E] transition-colors leading-snug"
          >
            {product.name}
          </h3>

          <p className="text-xs sm:text-sm text-[#585550] line-clamp-3 leading-relaxed mb-4">
            {product.shortDescription}
          </p>

          {/* Quick specs notice placeholder */}
          <div className="text-[11px] text-[#8C877E] bg-[#FAF9F6] border border-[#EFECE6] p-2.5 rounded text-left">
            <span className="font-medium text-[#403D38]">Specifications: </span>
            {product.specifications}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-5 pt-0 grid grid-cols-2 gap-2 mt-2">
        <button
          onClick={() => onViewDetails(product)}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#181715] bg-[#F5F4F0] hover:bg-[#EAE7DF] rounded transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Details</span>
        </button>

        <button
          onClick={() => onEnquire(product)}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#181715] hover:bg-[#302D29] rounded transition-colors"
        >
          <Mail className="w-3.5 h-3.5 text-[#E5D7CC]" />
          <span>{isService ? 'Enquire Processing' : 'Enquire Now'}</span>
        </button>
      </div>
    </div>
  );
};
