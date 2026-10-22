export type ProductCategory = 
  | 'laces'
  | 'fabrics'
  | 'denim'
  | 'mesh'
  | 'lycra-mesh'
  | 'tapes'
  | 'tags'
  | 'buttons'
  | 'accessories'
  | 'processing';

export type AvailabilityStatus = 
  | 'In Stock' 
  | 'Made to Order' 
  | 'Available on Order' 
  | 'Sampling Available';

export type NavigationTab = 
  | 'home' 
  | 'about' 
  | 'catalogue' 
  | 'collection' 
  | 'material-request' 
  | 'reach-us'
  | '3d-fabric-viewer';

export type MaterialRequestCategory = 
  | 'fabric' 
  | 'denim'
  | 'mesh'
  | 'lace' 
  | 'zipper'
  | 'button'
  | 'tipping'
  | 'accessories' 
  | 'processing' 
  | 'other';

export interface MaterialRequestData {
  category: MaterialRequestCategory;
  materialName: string;
  similarToProductCode?: string;
  similarToProductName?: string;
  specifications: {
    typeVariant?: string;
    composition?: string;
    gsmOrWeight?: string;
    widthOrSize?: string;
    colourPreference?: string;
    elasticity?: string;
    patternOrFinish?: string;
    customDetails?: string;
  };
  referenceImage?: {
    name: string;
    dataUrl?: string;
    sizeKb?: number;
  };
  referenceImages?: {
    name: string;
    dataUrl?: string;
    sizeKb?: number;
  }[];
  hasPhysicalSample: boolean;
  sampleCourierNotes?: string;
  quantity: string;
  unit: string;
  purpose: string;
  targetTimeline?: string;
  testingRequirements?: string;
  contactName: string;
  companyName: string;
  phone: string;
  email: string;
  cityState: string;
  additionalNotes?: string;
}

export interface MaterialRequestSubmission extends MaterialRequestData {
  id: string;
  referenceCode: string;
  submittedAt: number;
}

export interface FabricQuality {
  id: string;
  category: 'fabrics';
  subcategory: 'PLAIN' | 'TWILL' | 'DRILL' | 'DUCK' | 'SATIN' | 'PLAIN / TWILL' | string;
  name: string;
  quality: string;
  yarnConstruction: string;
  width: string;
  gsm: string;
  weave: string;
  selvage: string;
  standard: string;
  loom: string;
  image: string;
  description: string;
  applications?: string[];
  colours?: string[];
}

export interface Product {
  id: string;
  productCode: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  subcategory?: string;
  fabricWeaveType?: 'PLAIN' | 'TWILL' | 'DRILL' | 'DUCK' | 'SATIN' | 'PLAIN / TWILL';
  quality?: string;
  yarnConstruction?: string;
  width?: string;
  gsm?: string;
  weave?: string;
  selvage?: string;
  standard?: string;
  loom?: string;
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
  image?: string;
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
