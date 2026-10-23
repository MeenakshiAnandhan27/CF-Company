import React from 'react';
import { Product, ProductCategory, CollectionItem } from '../types.ts';
import { CatalogueLanding } from './catalogue/CatalogueLanding.tsx';

interface CatalogueViewProps {
  initialCategory?: ProductCategory | 'all' | string;
  onViewDetails: (product: Product) => void;
  onEnquire: (product: Product) => void;
  onAddToCollection?: (product: Product) => void;
  collection?: CollectionItem[];
  onViewCollection?: () => void;
  onRequestMaterial?: (category?: ProductCategory, similarProduct?: Product) => void;
  onReachUs?: (materialContext?: string) => void;
}

/**
 * RE-DESIGNED CATALOGUE SECTION — CLASSIC FASHIONS
 *
 * Built as a premium textile material discovery experience:
 * - Editorial headline: "Materials Behind Every Garment"
 * - 4 major category panels: Fabrics, Denim & Chambray, Laces, Garment Accessories
 * - Large circular / softly masked raw material items
 * - Interactive tactile hover with subtle magnification
 * - Slide-over quick material inspection drawer
 * - Flowing tactile "Material Wall"
 * - Slim sticky navigation with "Open Digital Catalogue" book mode
 * - Custom sourcing request callout at the bottom
 * - 100% focused on authentic RAW MATERIALS (zero finished garments or models)
 */
export const CatalogueView: React.FC<CatalogueViewProps> = ({
  initialCategory = 'ALL',
  onViewDetails,
  onEnquire,
  onAddToCollection,
  collection = [],
  onViewCollection,
  onRequestMaterial,
  onReachUs,
}) => {
  return (
    <CatalogueLanding
      initialCategory={initialCategory}
      onViewDetails={onViewDetails}
      onEnquire={onEnquire}
      onAddToCollection={onAddToCollection}
      collection={collection}
      onViewCollection={onViewCollection}
      onRequestMaterial={onRequestMaterial}
      onReachUs={onReachUs}
    />
  );
};
