import React from 'react';
import { Product } from '../types.ts';
import { MaterialCard3D } from './MaterialCard3D.tsx';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onEnquire?: (product: Product) => void;
  onAddToCollection?: (product: Product) => void;
  isInCollection?: boolean;
  collectionQuantity?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onEnquire,
}) => {
  return (
    <MaterialCard3D
      product={product}
      onViewDetails={onViewDetails}
      onEnquire={onEnquire}
    />
  );
};
