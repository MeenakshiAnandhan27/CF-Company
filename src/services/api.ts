import { Product, ProductFilters, MaterialRequestData } from '../types.ts';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

export interface SubmissionResponse {
  success: boolean;
  message: string;
  referenceCode: string;
  enquiryId: string;
  submittedAt: string;
}

export class ApiService {
  /**
   * Health check to test backend connectivity
   */
  public static async checkHealth(): Promise<{ online: boolean; database?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (!res.ok) return { online: false };
      const data = await res.json();
      return { online: true, database: data.database };
    } catch {
      return { online: false };
    }
  }

  /**
   * Fetch all categories
   */
  public static async getCategories(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return data.categories || [];
    } catch (err) {
      console.warn('API getCategories error, falling back:', err);
      throw err;
    }
  }

  /**
   * Fetch products with optional query filtering
   */
  public static async getProducts(filters?: ProductFilters): Promise<Product[]> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        if (filters.category && filters.category !== 'all') params.append('category', filters.category);
        if (filters.subcategory && filters.subcategory !== 'all') params.append('subcategory', filters.subcategory);
        if (filters.search && filters.search.trim()) params.append('search', filters.search.trim());
        if (filters.colour && filters.colour !== 'all') params.append('colour', filters.colour);
        if (filters.size && filters.size !== 'all') params.append('size', filters.size);
        if (filters.availability && filters.availability !== 'all') params.append('availability', filters.availability);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
      }

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const res = await fetch(`${API_BASE_URL}/products${queryString}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return data.products || [];
    } catch (err) {
      console.warn('API getProducts error, falling back:', err);
      throw err;
    }
  }

  /**
   * Fetch a single product by ID or Product Code
   */
  public static async getProductById(id: string): Promise<Product | undefined> {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}`);
      if (!res.ok) return undefined;
      const data = await res.json();
      return data.product;
    } catch (err) {
      console.warn('API getProductById error, falling back:', err);
      return undefined;
    }
  }

  /**
   * Submit Material Request Form to backend and save in database
   */
  public static async submitMaterialRequest(data: MaterialRequestData): Promise<SubmissionResponse> {
    const res = await fetch(`${API_BASE_URL}/enquiries/material-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.message || 'Failed to submit material request to server.');
    }

    return result as SubmissionResponse;
  }

  /**
   * Submit General or Collection Enquiry to backend and save in database
   */
  public static async submitEnquiry(payload: {
    name: string;
    phone: string;
    email?: string;
    companyName?: string;
    cityState?: string;
    message?: string;
    enquiryType?: string;
    items?: any[];
  }): Promise<SubmissionResponse> {
    const res = await fetch(`${API_BASE_URL}/enquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.message || 'Failed to submit enquiry to server.');
    }

    return result as SubmissionResponse;
  }
}
