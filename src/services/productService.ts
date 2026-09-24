import { Product, ProductCategory, ProductFilters, AvailabilityStatus } from '../types.ts';
import { products } from '../data/products.ts';

/**
 * Product Service Architecture (Preparation for Admin and Database APIs)
 * Encapsulates all data access and filtering logic so that local static data
 * can be swapped seamlessly with an Express API, Supabase, Firestore, or Cloud SQL later.
 */
export class ProductService {
  /**
   * Returns all active products available for catalogue browsing.
   */
  public static async getProducts(): Promise<Product[]> {
    return products.filter((p) => p.active !== false);
  }

  /**
   * Synchronous retrieval for initial rendering and state.
   */
  public static getAllSync(): Product[] {
    return products.filter((p) => p.active !== false);
  }

  /**
   * Retrieve a single product by its unique internal ID.
   */
  public static async getProductById(id: string): Promise<Product | undefined> {
    return products.find((p) => p.id === id);
  }

  /**
   * Retrieve a product by its standardized wholesale Product Code (e.g. CF-LAC-101).
   */
  public static async getProductByCode(code: string): Promise<Product | undefined> {
    const normalized = code.trim().toLowerCase();
    return products.find((p) => p.productCode.toLowerCase() === normalized);
  }

  /**
   * Filter a product list using comprehensive search and filter parameters.
   */
  public static filterProducts(items: Product[], filters: ProductFilters): Product[] {
    const {
      category = 'all',
      subcategory = 'all',
      search = '',
      colour = 'all',
      size = 'all',
      availability = 'all',
      sortBy = 'featured',
    } = filters;

    const normalizedQuery = search.trim().toLowerCase();

    let result = items.filter((product) => {
      // 1. Category Filter
      if (category !== 'all' && product.category !== category) {
        return false;
      }

      // 2. Subcategory Filter
      if (subcategory !== 'all' && product.subcategory !== subcategory) {
        return false;
      }

      // 3. Availability Filter
      if (availability !== 'all' && product.availability !== availability) {
        return false;
      }

      // 4. Colour Filter
      if (colour !== 'all') {
        const matchesColour = product.colours.some((c) =>
          c.toLowerCase().includes(colour.toLowerCase())
        );
        if (!matchesColour) return false;
      }

      // 5. Size Filter
      if (size !== 'all') {
        const matchesSize = product.sizes.some((s) =>
          s.toLowerCase().includes(size.toLowerCase())
        );
        if (!matchesSize) return false;
      }

      // 6. Search Filter: Name, Product Code, Category, Fabric, Subcategory, Specifications
      if (normalizedQuery) {
        const matchName = product.name.toLowerCase().includes(normalizedQuery);
        const matchCode = product.productCode.toLowerCase().includes(normalizedQuery);
        const matchCategory = product.categoryLabel.toLowerCase().includes(normalizedQuery);
        const matchFabric = product.fabric.toLowerCase().includes(normalizedQuery);
        const matchSubcat = (product.subcategory || '').toLowerCase().includes(normalizedQuery);
        const matchDesc = product.description.toLowerCase().includes(normalizedQuery);
        const matchApps = product.applications?.some((app) =>
          app.toLowerCase().includes(normalizedQuery)
        );
        const matchColours = product.colours.some((c) =>
          c.toLowerCase().includes(normalizedQuery)
        );

        if (
          !matchName &&
          !matchCode &&
          !matchCategory &&
          !matchFabric &&
          !matchSubcat &&
          !matchDesc &&
          !matchApps &&
          !matchColours
        ) {
          return false;
        }
      }

      return true;
    });

    // Sort order
    if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'code') {
      result.sort((a, b) => a.productCode.localeCompare(b.productCode));
    } else {
      // 'featured' default: featured first, then preserve order
      result.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
    }

    return result;
  }

  /**
   * Extracts all unique available colours across the product set or a given category.
   */
  public static getDistinctColours(items: Product[] = products): string[] {
    const set = new Set<string>();
    items.forEach((p) => {
      p.colours.forEach((c) => set.add(c));
    });
    return Array.from(set).sort();
  }

  /**
   * Extracts all unique sizes/widths across the product set or a given category.
   */
  public static getDistinctSizes(items: Product[] = products): string[] {
    const set = new Set<string>();
    items.forEach((p) => {
      p.sizes.forEach((s) => set.add(s));
    });
    return Array.from(set).sort();
  }

  /**
   * Extracts unique availability statuses present in the data.
   */
  public static getDistinctAvailabilities(items: Product[] = products): AvailabilityStatus[] {
    const set = new Set<AvailabilityStatus>();
    items.forEach((p) => {
      if (p.availability) set.add(p.availability);
    });
    return Array.from(set);
  }
}
