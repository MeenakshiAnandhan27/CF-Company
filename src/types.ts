export type ProductCategory = 
  | 'laces'
  | 'fabrics'
  | 'denim'
  | 'mesh'
  | 'accessories'
  | 'processing';

export type AvailabilityStatus = 
  | 'In Stock' 
  | 'Made to Order' 
  | 'Available on Order' 
  | 'Sampling Available';

export interface Product {
  id: string;
  productCode: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  subcategory?: string;
  description: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  imageAlt: string;
  colours: string[];
  sizes: string[];
  fabric: string;
  price: string;
  availability: AvailabilityStatus;
  active: boolean;
  patternType: 
    | 'embroidery-lace'
    | 'cotton-lace'
    | 'lycra-lace'
    | 'ric-rac'
    | 'imported-lace'
    | 'other-lace'
    | 'woven-fabric'
    | 'chambray'
    | 'poplin-gada'
    | 'twill-gada'
    | 'drill-gada'
    | 'dyed-fabric'
    | 'fur-fabric'
    | 'other-fabric'
    | 'denim'
    | 'premium-denim'
    | 'garment-denim'
    | 'other-denim'
    | 'mesh'
    | 'lycra-mesh'
    | 'other-mesh'
    | 'brand-tags'
    | 'custom-buttons'
    | 'tapes'
    | 'other-accessories'
    | 'edge-cutting';
  specifications: string;
  applications: string[];
  customizationNote?: string;
  enquiryEnabled: boolean;
  isService?: boolean;
  featured?: boolean;
}

export interface CollectionItem {
  product: Product;
  quantity: number;
  selectedColour?: string;
  selectedSize?: string;
  customNote?: string;
  addedAt: number;
}

export interface CategoryInfo {
  id: ProductCategory;
  name: string;
  tagline: string;
  description: string;
  subcategories: string[];
  patternType: string;
}

export interface BusinessConfig {
  businessName: string;
  subtitle: string;
  businessType: string;
  tagline: string;
  subheadline: string;
  locationName: string;
  addressLine1: string;
  addressLine2: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  fullAddress: string;
  phonePlaceholder: string;
  whatsappPlaceholder: string;
  emailPlaceholder: string;
  workingHoursPlaceholder: string;
}

export interface EnquiryFormState {
  name: string;
  companyName: string;
  phone: string;
  email: string;
  address: string;
  productName: string;
  quantity: string;
  message: string;
  items?: {
    productCode: string;
    productName: string;
    quantity: number;
    colour?: string;
    size?: string;
  }[];
}

export interface ContactFormState {
  name: string;
  companyName: string;
  phone: string;
  email: string;
  address?: string;
  interestedCategory: string;
  product: string;
  quantity: string;
  message: string;
}

export interface ProductFilters {
  category: ProductCategory | 'all';
  subcategory: string | 'all';
  search: string;
  colour: string | 'all';
  size: string | 'all';
  availability: AvailabilityStatus | 'all';
  sortBy?: 'featured' | 'name-asc' | 'name-desc' | 'code';
}
