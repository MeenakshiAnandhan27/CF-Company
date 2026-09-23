export type ProductCategory = 
  | 'laces'
  | 'fabrics'
  | 'denim'
  | 'mesh'
  | 'accessories'
  | 'processing';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  subcategory?: string;
  shortDescription: string;
  fullDescription: string;
  imageAlt: string;
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
  productName: string;
  quantity: string;
  message: string;
}

export interface ContactFormState {
  name: string;
  companyName: string;
  phone: string;
  email: string;
  interestedCategory: string;
  product: string;
  quantity: string;
  message: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  actionType?: 'call' | 'enquire' | 'catalogue' | 'category' | 'reach-us';
  actionPayload?: string;
  timestamp: string;
}
