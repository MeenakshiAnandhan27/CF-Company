import { Product } from '../types.ts';
import { products } from './products.ts';
import { fabricQualities, fabricQualityToProduct } from './fabricQualities.ts';

export type FlipbookPageType =
  | 'cover'
  | 'editorial-welcome-left'
  | 'editorial-welcome-right'
  | 'editorial-fabrics-left'
  | 'editorial-fabrics-right'
  | 'material-variety-spread'
  | 'material-variety-single'
  | 'category-showcase'
  | 'editorial-inquiry-left'
  | 'editorial-inquiry-right';

export interface FlipbookChapter {
  id: string;
  label: string;
  shortLabel: string;
  spreadIndex: number;
  pageNumber: number;
  categoryKey?: string;
}

export interface FlipbookPageItem {
  pageNumber: number;
  type: FlipbookPageType;
  title: string;
  subtitle?: string;
  section: string;
  chapterId: string;
  products?: Product[];
  contentData?: Record<string, unknown>;
}

export interface FlipbookSpread {
  spreadIndex: number;
  leftPage: FlipbookPageItem;
  rightPage: FlipbookPageItem;
  chapterId: string;
  title: string;
}

// Convert fabric qualities to product items with full specifications
const plainFabricProducts = fabricQualities
  .filter((f) => f.subcategory === 'PLAIN')
  .map(fabricQualityToProduct);

const twillFabricProducts = fabricQualities
  .filter((f) => f.subcategory === 'TWILL')
  .map(fabricQualityToProduct);

const drillFabricProducts = fabricQualities
  .filter((f) => f.subcategory === 'DRILL')
  .map(fabricQualityToProduct);

const duckFabricProducts = fabricQualities
  .filter((f) => f.subcategory === 'DUCK')
  .map(fabricQualityToProduct);

const satinFabricProducts = fabricQualities
  .filter((f) => f.subcategory === 'SATIN' || f.subcategory === 'PLAIN / TWILL')
  .map(fabricQualityToProduct);

const laceProducts = products.filter((p) => p.category === 'laces');
const denimProducts = products.filter((p) => p.category === 'denim');
const meshProducts = products.filter(
  (p) => p.category === 'mesh' && p.subcategory !== 'Lycra Mesh'
);
const lycraProducts = products.filter(
  (p) =>
    p.category === 'lycra-mesh' ||
    p.subcategory === 'Lycra Mesh' ||
    p.id === 'mesh-lycra'
);
const tapeProducts = products.filter(
  (p) => p.id === 'acc-tapes' || p.category === 'tapes'
);
const tagProducts = products.filter(
  (p) => p.id === 'acc-tags' || p.category === 'tags'
);
const buttonProducts = products.filter(
  (p) => p.id === 'acc-buttons' || p.category === 'buttons'
);
const otherAccessoryProducts = products.filter(
  (p) =>
    p.id === 'acc-other' ||
    p.id === 'proc-edge-cutting' ||
    (p.category === 'accessories' &&
      p.id !== 'acc-tags' &&
      p.id !== 'acc-buttons' &&
      p.id !== 'acc-tapes')
);

/**
 * GENERATE FLIPBOOK PAGES
 * Strictly matching the user's requested page flow:
 * PAGE 1: Cover
 * PAGE 2–3: Welcome / About Classic Fashions
 * PAGE 4–5: LACES
 * PAGE 6–7: FABRICS — INTRODUCTION
 * PAGE 8–9: PLAIN FABRICS
 * PAGE 10–11: TWILL FABRICS
 * PAGE 12–13: DRILL FABRICS
 * PAGE 14–15: DUCK FABRICS
 * PAGE 16–17: SATIN FABRICS
 * PAGE 18–19: DENIM
 * PAGE 20–21: MESH
 * PAGE 22–23: LYCRA / LYCRA MESH
 * PAGE 24–25: TAPES
 * PAGE 26–27: TAGS
 * PAGE 28–29: BUTTONS
 * PAGE 30–31: OTHER GARMENT ACCESSORIES & PROCESSING
 * PAGE 32–33: REQUEST A MATERIAL / SAMPLES & ENQUIRIES
 */

export const FLIPBOOK_SPREADS: FlipbookSpread[] = [
  // SPREAD 0: COVER (Single view or Closed Book)
  {
    spreadIndex: 0,
    chapterId: 'cover',
    title: 'Cover',
    leftPage: {
      pageNumber: 0,
      type: 'cover',
      title: 'Back Cover',
      section: 'COVER',
      chapterId: 'cover',
    },
    rightPage: {
      pageNumber: 1,
      type: 'cover',
      title: 'Classic Fashions — Digital Material Catalogue',
      subtitle: 'Garment Accessories & Fabrics',
      section: 'COVER',
      chapterId: 'cover',
    },
  },

  // SPREAD 1: PAGES 2–3 (Welcome / About Classic Fashions)
  {
    spreadIndex: 1,
    chapterId: 'about',
    title: 'Welcome & Heritage',
    leftPage: {
      pageNumber: 2,
      type: 'editorial-welcome-left',
      title: 'Classic Fashions',
      subtitle: 'Tiruppur Textile Hub • Established Heritage',
      section: 'COMPANY PROFILE',
      chapterId: 'about',
    },
    rightPage: {
      pageNumber: 3,
      type: 'editorial-welcome-right',
      title: 'Quality Standards & Swatch Sourcing',
      subtitle: 'Mill-Direct Consistency • Laboratory Verified',
      section: 'ASSURANCE & METHODOLOGY',
      chapterId: 'about',
    },
  },

  // SPREAD 2: PAGES 4–5 (LACES)
  {
    spreadIndex: 2,
    chapterId: 'laces',
    title: 'Laces Collection',
    leftPage: {
      pageNumber: 4,
      type: 'material-variety-spread',
      title: 'Embroidery & Cotton Laces',
      subtitle: 'High-Definition Needlework & Soft Natural Eyelets',
      section: 'LACES',
      chapterId: 'laces',
      products: laceProducts.slice(0, 3), // Embroidery, Cotton, Lycra
    },
    rightPage: {
      pageNumber: 5,
      type: 'material-variety-spread',
      title: 'Ric-Rac & Imported Trims',
      subtitle: 'Geometric Piping, Raschel & Specialty Borders',
      section: 'LACES',
      chapterId: 'laces',
      products: laceProducts.slice(3, 6), // Ric Rac, Imported, Other
    },
  },

  // SPREAD 3: PAGES 6–7 (FABRICS — INTRODUCTION)
  {
    spreadIndex: 3,
    chapterId: 'fabrics-intro',
    title: 'Fabrics Overview',
    leftPage: {
      pageNumber: 6,
      type: 'editorial-fabrics-left',
      title: 'Woven Textiles & Yarn Counts',
      subtitle: 'The Engineering of Pure Cotton Gada & Loomstate Cloth',
      section: 'FABRICS — INTRO',
      chapterId: 'fabrics-intro',
    },
    rightPage: {
      pageNumber: 7,
      type: 'editorial-fabrics-right',
      title: 'Loom Technologies & Selvedges',
      subtitle: 'Airjet, Sulzer Shuttleless, Rapier & Leno Specifications',
      section: 'FABRICS — INTRO',
      chapterId: 'fabrics-intro',
    },
  },

  // SPREAD 4: PAGES 8–9 (PLAIN FABRICS)
  {
    spreadIndex: 4,
    chapterId: 'plain',
    title: 'Plain Fabrics',
    leftPage: {
      pageNumber: 8,
      type: 'material-variety-spread',
      title: 'Plain Weave — 40X40 Poplin & Gada',
      subtitle: 'Combed Cotton Warp & Weft in 48", 50" and 54" Widths',
      section: 'FABRICS / PLAIN',
      chapterId: 'plain',
      products: plainFabricProducts.slice(0, 3),
    },
    rightPage: {
      pageNumber: 9,
      type: 'material-variety-spread',
      title: 'Plain Weave — Wide & Heavy Gada',
      subtitle: '63" Export Grade, High-Density Poplin, 30s & 20s Constructions',
      section: 'FABRICS / PLAIN',
      chapterId: 'plain',
      products: plainFabricProducts.slice(3, 7),
    },
  },

  // SPREAD 5: PAGES 10–11 (TWILL FABRICS)
  {
    spreadIndex: 5,
    chapterId: 'twill',
    title: 'Twill Fabrics',
    leftPage: {
      pageNumber: 10,
      type: 'material-variety-spread',
      title: '2/1 Twill — 30X30 & 40X40 Qualities',
      subtitle: 'Clear Diagonal Ridge, High Abrasion Resistance in 63" Width',
      section: 'FABRICS / TWILL',
      chapterId: 'twill',
      products: twillFabricProducts.slice(0, 2),
    },
    rightPage: {
      pageNumber: 11,
      type: 'material-variety-spread',
      title: '2/1 Twill — Heavy Chino & Two-Ply Warp',
      subtitle: '20X20 & 2/40X20 Constructions for Bottomwear & Workwear',
      section: 'FABRICS / TWILL',
      chapterId: 'twill',
      products: twillFabricProducts.slice(2, 4),
    },
  },

  // SPREAD 6: PAGES 12–13 (DRILL FABRICS)
  {
    spreadIndex: 6,
    chapterId: 'drill',
    title: 'Drill Fabrics',
    leftPage: {
      pageNumber: 12,
      type: 'material-variety-spread',
      title: '3/1 Drill — 16X12 Heavy Gada',
      subtitle: '96X48 & 108X56 Constructions in 63" Width for Cargo & Pockets',
      section: 'FABRICS / DRILL',
      chapterId: 'drill',
      products: drillFabricProducts.slice(0, 2),
    },
    rightPage: {
      pageNumber: 13,
      type: 'material-variety-spread',
      title: '3/1 Drill — 20X20 & 10X10 Canvas Drill',
      subtitle: 'Combed Bottomwear Drill & Heavy 10s Utility Canvas',
      section: 'FABRICS / DRILL',
      chapterId: 'drill',
      products: drillFabricProducts.slice(2, 4),
    },
  },

  // SPREAD 7: PAGES 14–15 (DUCK FABRICS)
  {
    spreadIndex: 7,
    chapterId: 'duck',
    title: 'Duck Fabrics',
    leftPage: {
      pageNumber: 14,
      type: 'material-variety-spread',
      title: 'Duck Canvas — Single & Plied Army Duck',
      subtitle: '10X10 / 48X36 & 2/20X2/20 / 48X44 in 63" Width',
      section: 'FABRICS / DUCK',
      chapterId: 'duck',
      products: duckFabricProducts.slice(0, 2),
    },
    rightPage: {
      pageNumber: 15,
      type: 'material-variety-spread',
      title: 'Duck Canvas — Oxford & Number 10 Heavy',
      subtitle: '16X16 Oxford Duck & 7X7 Heavy Canvas for Bags & Industrial Gear',
      section: 'FABRICS / DUCK',
      chapterId: 'duck',
      products: duckFabricProducts.slice(2, 4),
    },
  },

  // SPREAD 8: PAGES 16–17 (SATIN FABRICS)
  {
    spreadIndex: 8,
    chapterId: 'satin',
    title: 'Satin & Combined Weaves',
    leftPage: {
      pageNumber: 16,
      type: 'material-variety-spread',
      title: 'Super Combed Luxury Satin — 60X60',
      subtitle: '165X104 High-Sett 4/1 Lustrous Sateen in 63" Width',
      section: 'FABRICS / SATIN',
      chapterId: 'satin',
      products: satinFabricProducts.slice(0, 2),
    },
    rightPage: {
      pageNumber: 17,
      type: 'material-variety-spread',
      title: 'Sateen & Plain / Twill Dual Specification',
      subtitle: '50X50 Export Sateen & 40X40 / 124X64 Dual Specification Gada',
      section: 'FABRICS / SATIN & COMBINED',
      chapterId: 'satin',
      products: satinFabricProducts.slice(2, 4),
    },
  },

  // SPREAD 9: PAGES 18–19 (DENIM)
  {
    spreadIndex: 9,
    chapterId: 'denim',
    title: 'Denim Textiles',
    leftPage: {
      pageNumber: 18,
      type: 'material-variety-spread',
      title: 'Classic Indigo & Premium Slub Denim',
      subtitle: '11.5 Oz to 14.0 Oz Pure Ring-Spun Twill for Jeans & Jackets',
      section: 'DENIM',
      chapterId: 'denim',
      products: denimProducts.slice(0, 2),
    },
    rightPage: {
      pageNumber: 19,
      type: 'material-variety-spread',
      title: 'Lightweight Garment & Specialty Denim',
      subtitle: '5.5 Oz Shirting Denim, Black Sulphur & Stretch Weaves',
      section: 'DENIM',
      chapterId: 'denim',
      products: denimProducts.slice(2, 4),
    },
  },

  // SPREAD 10: PAGES 20–21 (MESH)
  {
    spreadIndex: 10,
    chapterId: 'mesh',
    title: 'Mesh Textiles',
    leftPage: {
      pageNumber: 20,
      type: 'material-variety-spread',
      title: 'Athletic Open-Pore Mesh',
      subtitle: 'Polyester Micro-Mesh (90 & 120 GSM) for Sportswear Linings',
      section: 'MESH',
      chapterId: 'mesh',
      products: meshProducts.slice(0, 1),
    },
    rightPage: {
      pageNumber: 21,
      type: 'material-variety-spread',
      title: 'Technical 3D Spacer & Structural Mesh',
      subtitle: 'Cushioning 3D Air Chambers (320 GSM) for Footwear & Gear',
      section: 'MESH',
      chapterId: 'mesh',
      products: meshProducts.slice(1, 2),
    },
  },

  // SPREAD 11: PAGES 22–23 (LYCRA / LYCRA MESH)
  {
    spreadIndex: 11,
    chapterId: 'lycra',
    title: 'Lycra & Power Mesh',
    leftPage: {
      pageNumber: 22,
      type: 'material-variety-spread',
      title: '4-Way Elastic Power Lycra Mesh',
      subtitle: '82/18 Polyamide/Spandex Contour Stretch (180 GSM)',
      section: 'LYCRA / LYCRA MESH',
      chapterId: 'lycra',
      products: lycraProducts.slice(0, 1),
    },
    rightPage: {
      pageNumber: 23,
      type: 'material-variety-spread',
      title: 'High-Modulus Performance Elastane',
      subtitle: '220 GSM Heavy Power Mesh for Activewear, Inserts & Dancewear',
      section: 'LYCRA / LYCRA MESH',
      chapterId: 'lycra',
      products: lycraProducts.slice(0, 1), // highlighted secondary variant
    },
  },

  // SPREAD 12: PAGES 24–25 (TAPES)
  {
    spreadIndex: 12,
    chapterId: 'tapes',
    title: 'Garment Tapes',
    leftPage: {
      pageNumber: 24,
      type: 'material-variety-spread',
      title: 'Compact Cotton Twill & Herringbone Tapes',
      subtitle: '10mm to 40mm Woven Spools for Neck Finishing & Drawcords',
      section: 'TAPES',
      chapterId: 'tapes',
      products: tapeProducts.slice(0, 1),
    },
    rightPage: {
      pageNumber: 25,
      type: 'material-variety-spread',
      title: 'Polyester Grossgrain & Seam Stabilization',
      subtitle: 'High-Tensile Edge Binding & Contrast Ribbon Reels',
      section: 'TAPES',
      chapterId: 'tapes',
      products: tapeProducts.slice(0, 1),
    },
  },

  // SPREAD 13: PAGES 26–27 (TAGS)
  {
    spreadIndex: 13,
    chapterId: 'tags',
    title: 'Brand Tags & Labels',
    leftPage: {
      pageNumber: 26,
      type: 'material-variety-spread',
      title: 'High-Density Woven Damask Labels',
      subtitle: 'Ultrasonic Soft-Cut Edge Trims for Zero Neck Irritation',
      section: 'TAGS',
      chapterId: 'tags',
      products: tagProducts.slice(0, 1),
    },
    rightPage: {
      pageNumber: 27,
      type: 'material-variety-spread',
      title: 'Printed Care Labels & Retail Hangtags',
      subtitle: 'Taffeta Size Tabs, Organic Cotton Weaves & Craft Packaging',
      section: 'TAGS',
      chapterId: 'tags',
      products: tagProducts.slice(0, 1),
    },
  },

  // SPREAD 14: PAGES 28–29 (BUTTONS)
  {
    spreadIndex: 14,
    chapterId: 'buttons',
    title: 'Garment Buttons',
    leftPage: {
      pageNumber: 28,
      type: 'material-variety-spread',
      title: 'Polyester Resin & Chalk Buttons',
      subtitle: '14L to 24L Precision Fasteners for Shirting & Trousers',
      section: 'BUTTONS',
      chapterId: 'buttons',
      products: buttonProducts.slice(0, 1),
    },
    rightPage: {
      pageNumber: 29,
      type: 'material-variety-spread',
      title: 'Natural Horn, Corozo & Metal Shank Buttons',
      subtitle: 'Dry Clean & High-Heat Press Proof Fasteners for Blazers & Coats',
      section: 'BUTTONS',
      chapterId: 'buttons',
      products: buttonProducts.slice(0, 1),
    },
  },

  // SPREAD 15: PAGES 30–31 (OTHER ACCESSORIES & PROCESSING)
  {
    spreadIndex: 15,
    chapterId: 'accessories',
    title: 'Accessories & Services',
    leftPage: {
      pageNumber: 30,
      type: 'material-variety-spread',
      title: 'Garment Sundries, Elastics & Cords',
      subtitle: 'Waistband Elastics, Toggles, Hooks & Manufacturing Sundries',
      section: 'GARMENT ACCESSORIES',
      chapterId: 'accessories',
      products: otherAccessoryProducts.filter((p) => p.category === 'accessories'),
    },
    rightPage: {
      pageNumber: 31,
      type: 'material-variety-spread',
      title: 'Industrial Edge Cutting & Scalping Services',
      subtitle: 'High-Speed Rotary Slitting to Custom Widths (10mm to 1600mm)',
      section: 'PROCESSING & SERVICES',
      chapterId: 'accessories',
      products: otherAccessoryProducts.filter((p) => p.category === 'processing'),
    },
  },

  // SPREAD 16: PAGES 32–33 (REQUEST A MATERIAL / SAMPLES & ENQUIRIES)
  {
    spreadIndex: 16,
    chapterId: 'inquiry',
    title: 'Request Samples & Contact',
    leftPage: {
      pageNumber: 32,
      type: 'editorial-inquiry-left',
      title: 'Physical Swatch Box Sourcing',
      subtitle: 'Order Mill Swatch Packs, Hanger Books & Cutting Toiles',
      section: 'SAMPLING DESK',
      chapterId: 'inquiry',
    },
    rightPage: {
      pageNumber: 33,
      type: 'editorial-inquiry-right',
      title: 'Direct Wholesale Order Desk',
      subtitle: 'Classic Fashions • Tiruppur Textile District • Tamil Nadu',
      section: 'MILL CONTACT',
      chapterId: 'inquiry',
    },
  },
];

/**
 * Physical Bookmark Tabs along the top / side of the book binder
 */
export const FLIPBOOK_BOOKMARK_TABS: FlipbookChapter[] = [
  { id: 'cover', label: 'Cover', shortLabel: 'Cover', spreadIndex: 0, pageNumber: 1 },
  { id: 'about', label: 'About', shortLabel: 'About', spreadIndex: 1, pageNumber: 2 },
  { id: 'laces', label: 'Laces', shortLabel: 'Laces', spreadIndex: 2, pageNumber: 4, categoryKey: 'laces' },
  { id: 'fabrics-intro', label: 'Fabrics Overview', shortLabel: 'Intro', spreadIndex: 3, pageNumber: 6, categoryKey: 'fabrics' },
  { id: 'plain', label: 'Plain Fabrics', shortLabel: 'Plain', spreadIndex: 4, pageNumber: 8, categoryKey: 'fabrics' },
  { id: 'twill', label: 'Twill Fabrics', shortLabel: 'Twill', spreadIndex: 5, pageNumber: 10, categoryKey: 'fabrics' },
  { id: 'drill', label: 'Drill Fabrics', shortLabel: 'Drill', spreadIndex: 6, pageNumber: 12, categoryKey: 'fabrics' },
  { id: 'duck', label: 'Duck Fabrics', shortLabel: 'Duck', spreadIndex: 7, pageNumber: 14, categoryKey: 'fabrics' },
  { id: 'satin', label: 'Satin Fabrics', shortLabel: 'Satin', spreadIndex: 8, pageNumber: 16, categoryKey: 'fabrics' },
  { id: 'denim', label: 'Denim', shortLabel: 'Denim', spreadIndex: 9, pageNumber: 18, categoryKey: 'denim' },
  { id: 'mesh', label: 'Mesh', shortLabel: 'Mesh', spreadIndex: 10, pageNumber: 20, categoryKey: 'mesh' },
  { id: 'lycra', label: 'Lycra / Lycra Mesh', shortLabel: 'Lycra', spreadIndex: 11, pageNumber: 22, categoryKey: 'lycra-mesh' },
  { id: 'tapes', label: 'Tapes', shortLabel: 'Tapes', spreadIndex: 12, pageNumber: 24, categoryKey: 'tapes' },
  { id: 'tags', label: 'Tags', shortLabel: 'Tags', spreadIndex: 13, pageNumber: 26, categoryKey: 'tags' },
  { id: 'buttons', label: 'Buttons', shortLabel: 'Buttons', spreadIndex: 14, pageNumber: 28, categoryKey: 'buttons' },
  { id: 'accessories', label: 'Accessories', shortLabel: 'Trims', spreadIndex: 15, pageNumber: 30, categoryKey: 'accessories' },
  { id: 'inquiry', label: 'Request Swatch', shortLabel: 'Enquire', spreadIndex: 16, pageNumber: 32 },
];
