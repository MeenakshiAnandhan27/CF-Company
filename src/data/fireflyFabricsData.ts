import { Product } from '../types.ts';
import {
  CATALOGUE_3D_ITEMS,
  Catalogue3DItem,
  CatalogueCategory,
  getCatalogueAssetUrl,
  findMatchingCatalogueIndex,
  getProductForCatalogueItem,
} from './catalogue3DData.ts';

export { getCatalogueAssetUrl as getFireflyAssetUrl };
export type { Catalogue3DItem as FireflyFabricItem };
export type { CatalogueCategory };

export const FIREFLY_FABRICS: Catalogue3DItem[] = CATALOGUE_3D_ITEMS;

/**
 * Intelligent query matching for deep-linking
 */
export function findMatchingFireflyIndex(query?: string | null): number {
  return findMatchingCatalogueIndex(query);
}

/**
 * Convert fabric/item to Product for enquiry modals
 */
export function getProductForFireflyFabric(fabric: Catalogue3DItem): Product {
  return getProductForCatalogueItem(fabric);
}
