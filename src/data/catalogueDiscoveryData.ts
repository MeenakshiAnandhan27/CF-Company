import { Product } from '../types.ts';
import { products } from './products.ts';
import { fabricQualities } from './fabricQualities.ts';

export interface DiscoveryMaterial {
  id: string;
  name: string;
  category: 'FABRICS' | 'DENIM & CHAMBRAY' | 'LACES' | 'GARMENT ACCESSORIES';
  subcategory: string;
  section: 'WOVEN' | 'SPECIALTY' | 'MESH_STRETCH' | 'PATTERNS' | 'DENIM_CHAMBRAY' | 'LACES' | 'ZIPPERS' | 'BUTTONS' | 'TIPPING';
  image: string;
  fallbackTexture?: string;
  description: string;
  composition?: string;
  weave?: string;
  pattern?: string;
  width?: string;
  gsm?: string;
  variants?: string[];
  productCode?: string;
  matchedProductId?: string;
}

export interface CategoryPanel {
  id: 'FABRICS' | 'DENIM & CHAMBRAY' | 'LACES' | 'GARMENT ACCESSORIES';
  index: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  materialCount: number;
}

/**
 * 4 Primary Category Panels for the Landing Page
 */
export const CATEGORY_PANELS: CategoryPanel[] = [
  {
    id: 'FABRICS',
    index: '01',
    title: 'FABRICS',
    tagline: 'Woven, Specialty & Stretch Materials',
    description: 'Woven, specialty and stretch materials sourced for apparel production.',
    image: '/assets/materials/fabrics/plain.jpg',
    materialCount: 20,
  },
  {
    id: 'DENIM & CHAMBRAY',
    index: '02',
    title: 'DENIM & CHAMBRAY',
    tagline: 'Raw Denim & Lightweight Chambray',
    description: 'Raw denim and lightweight chambray textiles for shirting and bottoms.',
    image: '/assets/materials/fabrics/denim.jpg',
    materialCount: 2,
  },
  {
    id: 'LACES',
    index: '03',
    title: 'LACES',
    tagline: 'Trims & Decorative Garment Materials',
    description: 'Trims, needlework and decorative garment laces for apparel finishing.',
    image: '/assets/materials/laces.jpg',
    materialCount: 5,
  },
  {
    id: 'GARMENT ACCESSORIES',
    index: '04',
    title: 'GARMENT ACCESSORIES',
    tagline: 'Zippers, Buttons & Finishing Components',
    description: 'Zippers, buttons and tipping components for garment assembly.',
    image: '/assets/materials/accessories.jpg',
    materialCount: 12,
  },
];

/**
 * High-definition SVG raw textile texture generators
 * Ensuring every single raw material has a distinct, authentic raw macro texture.
 */
function createRawTextileSvg(bg: string, patternSvg: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect width="400" height="400" fill="${bg}"/>
    ${patternSvg}
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Plain woven texture (warp and weft balanced grid)
const PLAIN_WEAVE_TEXTURE = createRawTextileSvg('#ECE7DE', `
  <defs>
    <pattern id="plain" width="16" height="16" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="8" height="8" fill="#DFD9CE" />
      <rect x="8" y="8" width="8" height="8" fill="#DFD9CE" />
      <line x1="0" y1="4" x2="16" y2="4" stroke="#CEC6B8" stroke-width="1.2" />
      <line x1="0" y1="12" x2="16" y2="12" stroke="#CEC6B8" stroke-width="1.2" />
      <line x1="4" y1="0" x2="4" y2="16" stroke="#CEC6B8" stroke-width="1.2" />
      <line x1="12" y1="0" x2="12" y2="16" stroke="#CEC6B8" stroke-width="1.2" />
    </pattern>
  </defs>
  <rect width="400" height="400" fill="url(#plain)" />
  <circle cx="200" cy="200" r="190" fill="none" stroke="#D3CBC0" stroke-width="2" opacity="0.4" />
`);

// Twill weave texture (distinct diagonal ridge)
const TWILL_WEAVE_TEXTURE = createRawTextileSvg('#E6E0D4', `
  <defs>
    <pattern id="twill" width="20" height="20" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="20" stroke="#C9C1B2" stroke-width="4.5" />
      <line x1="10" y1="0" x2="10" y2="20" stroke="#DFD7C9" stroke-width="3" />
      <line x1="0" y1="0" x2="20" y2="0" stroke="#B8AF9F" stroke-width="1" stroke-dasharray="2,2" opacity="0.6" />
    </pattern>
  </defs>
  <rect width="400" height="400" fill="url(#twill)" />
`);

// Satin weave texture (lustrous smooth floats)
const SATIN_WEAVE_TEXTURE = createRawTextileSvg('#F3EFE8', `
  <defs>
    <linearGradient id="satinSheen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.7"/>
      <stop offset="35%" stop-color="#EBE3D5" stop-opacity="0.3"/>
      <stop offset="70%" stop-color="#FFFFFF" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#DFD5C4" stop-opacity="0.4"/>
    </linearGradient>
    <pattern id="satin" width="12" height="12" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.5" fill="#C5BBAA" opacity="0.5"/>
      <circle cx="8" cy="8" r="1.5" fill="#C5BBAA" opacity="0.5"/>
    </pattern>
  </defs>
  <rect width="400" height="400" fill="url(#satin)" />
  <rect width="400" height="400" fill="url(#satinSheen)" />
`);

// Drill weave texture (heavy diagonal ridge)
const DRILL_WEAVE_TEXTURE = createRawTextileSvg('#DDD5C5', `
  <defs>
    <pattern id="drill" width="24" height="24" patternTransform="rotate(55 0 0)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="24" stroke="#B7AC9B" stroke-width="7" />
      <line x1="12" y1="0" x2="12" y2="24" stroke="#D3C9B8" stroke-width="3" />
    </pattern>
  </defs>
  <rect width="400" height="400" fill="url(#drill)" />
`);

// Canvas / Gada weave texture (heavy coarse unbleached plain weave)
const CANVAS_WEAVE_TEXTURE = createRawTextileSvg('#E3DCce', `
  <defs>
    <pattern id="canvas" width="24" height="24" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="12" height="12" fill="#D3C9B7" />
      <rect x="12" y="12" width="12" height="12" fill="#D3C9B7" />
      <circle cx="6" cy="6" r="1.2" fill="#998F7E" opacity="0.6"/>
      <circle cx="18" cy="18" r="1.2" fill="#998F7E" opacity="0.6"/>
    </pattern>
  </defs>
  <rect width="400" height="400" fill="url(#canvas)" />
`);

// Duck fabric texture (tight, heavyweight plain canvas)
const DUCK_WEAVE_TEXTURE = createRawTextileSvg('#DFD7C7', `
  <defs>
    <pattern id="duck" width="18" height="18" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="9" height="9" fill="#CDC3B1" />
      <rect x="9" y="9" width="9" height="9" fill="#CDC3B1" />
      <line x1="0" y1="9" x2="18" y2="9" stroke="#AFA38F" stroke-width="1.5" />
      <line x1="9" y1="0" x2="9" y2="18" stroke="#AFA38F" stroke-width="1.5" />
    </pattern>
  </defs>
  <rect width="400" height="400" fill="url(#duck)" />
`);

// Seersucker puckered texture
const SEERSUCKER_TEXTURE = createRawTextileSvg('#ECE9E2', `
  <defs>
    <pattern id="seersucker" width="30" height="30" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="15" height="30" fill="#E2DDD2" />
      <path d="M7 0 Q 3 7, 7 15 T 7 30" fill="none" stroke="#C4BBAA" stroke-width="2.5" />
      <path d="M22 0 Q 25 7, 22 15 T 22 30" fill="none" stroke="#CDC6B8" stroke-width="1" />
    </pattern>
  </defs>
  <rect width="400" height="400" fill="url(#seersucker)" />
`);

// Velvet pile texture (dense soft plush pile)
const VELVET_TEXTURE = createRawTextileSvg('#22201E', `
  <defs>
    <radialGradient id="velvetGlow" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#4B453E"/>
      <stop offset="60%" stop-color="#262320"/>
      <stop offset="100%" stop-color="#141312"/>
    </radialGradient>
    <pattern id="velvetDots" width="8" height="8" patternUnits="userSpaceOnUse">
      <circle cx="4" cy="4" r="1" fill="#6A6258" opacity="0.4"/>
    </pattern>
  </defs>
  <rect width="400" height="400" fill="url(#velvetGlow)" />
  <rect width="400" height="400" fill="url(#velvetDots)" />
`);

// Linen texture (characteristic natural slub threads)
const LINEN_TEXTURE = createRawTextileSvg('#EAE4D7', `
  <defs>
    <pattern id="linenSlub" width="40" height="40" patternUnits="userSpaceOnUse">
      <line x1="0" y1="8" x2="40" y2="8" stroke="#CFC5B4" stroke-width="2" />
      <line x1="0" y1="22" x2="40" y2="22" stroke="#B8AC98" stroke-width="3.5" />
      <line x1="0" y1="34" x2="40" y2="34" stroke="#CFC5B4" stroke-width="1.8" />
      <line x1="12" y1="0" x2="12" y2="40" stroke="#CFC5B4" stroke-width="1.8" />
      <line x1="28" y1="0" x2="28" y2="40" stroke="#BEB29F" stroke-width="3" />
    </pattern>
  </defs>
  <rect width="400" height="400" fill="url(#linenSlub)" />
`);

// Raw Indigo Denim texture
const DENIM_TEXTURE = createRawTextileSvg('#1C2B3A', `
  <defs>
    <pattern id="denimWeave" width="16" height="16" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="16" stroke="#2D4660" stroke-width="4" />
      <line x1="8" y1="0" x2="8" y2="16" stroke="#D7E0EB" stroke-width="1.8" />
    </pattern>
  </defs>
  <rect width="400" height="400" fill="url(#denimWeave)" />
`);

// Raw Chambray texture (blue warp, white weft plain weave)
const CHAMBRAY_TEXTURE = createRawTextileSvg('#4F6B88', `
  <defs>
    <pattern id="chambray" width="10" height="10" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="5" height="5" fill="#3D536B" />
      <rect x="5" y="5" width="5" height="5" fill="#DFE6EE" />
      <line x1="0" y1="2.5" x2="10" y2="2.5" stroke="#FFFFFF" stroke-width="1" opacity="0.6"/>
    </pattern>
  </defs>
  <rect width="400" height="400" fill="url(#chambray)" />
`);

// Cotton / Polyester Mesh open cell texture
const MESH_TEXTURE = createRawTextileSvg('#2A2928', `
  <defs>
    <pattern id="meshHex" width="24" height="24" patternUnits="userSpaceOnUse">
      <polygon points="12,2 22,7 22,17 12,22 2,17 2,7" fill="none" stroke="#878177" stroke-width="2"/>
      <circle cx="12" cy="12" r="3" fill="#141312"/>
    </pattern>
  </defs>
  <rect width="400" height="400" fill="url(#meshHex)" />
`);

// Lace needlework texture
const LACE_TEXTURE = createRawTextileSvg('#FAF7F2', `
  <defs>
    <pattern id="laceFloral" width="48" height="48" patternUnits="userSpaceOnUse">
      <circle cx="24" cy="24" r="14" fill="none" stroke="#D3C8B7" stroke-width="1.8"/>
      <circle cx="24" cy="24" r="6" fill="none" stroke="#C5B7A2" stroke-width="1.2"/>
      <circle cx="0" cy="0" r="10" fill="none" stroke="#D3C8B7" stroke-width="1.5"/>
      <circle cx="48" cy="0" r="10" fill="none" stroke="#D3C8B7" stroke-width="1.5"/>
      <circle cx="0" cy="48" r="10" fill="none" stroke="#D3C8B7" stroke-width="1.5"/>
      <circle cx="48" cy="48" r="10" fill="none" stroke="#D3C8B7" stroke-width="1.5"/>
      <path d="M10 24 Q 24 10, 38 24 T 10 24" fill="none" stroke="#C5B7A2" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="400" height="400" fill="url(#laceFloral)" />
`);

// Metal Zipper raw components texture
const ZIPPER_TEXTURE = createRawTextileSvg('#2E2D2B', `
  <defs>
    <pattern id="zipperTeeth" width="30" height="16" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="30" height="16" fill="#201F1E"/>
      <rect x="7" y="1" width="7" height="6" fill="#C2AA76" rx="1"/>
      <rect x="16" y="9" width="7" height="6" fill="#C2AA76" rx="1"/>
      <line x1="15" y1="0" x2="15" y2="16" stroke="#48443F" stroke-width="1.5"/>
    </pattern>
  </defs>
  <rect width="400" height="400" fill="url(#zipperTeeth)" />
`);

// Loose Buttons raw texture
const BUTTONS_TEXTURE = createRawTextileSvg('#EFECE5', `
  <defs>
    <pattern id="buttonsArrangement" width="60" height="60" patternUnits="userSpaceOnUse">
      <circle cx="30" cy="30" r="16" fill="#DDD5C7" stroke="#998E7D" stroke-width="1.5"/>
      <circle cx="30" cy="30" r="10" fill="none" stroke="#B8AD9C" stroke-width="1"/>
      <circle cx="26" cy="26" r="1.5" fill="#5E5649"/>
      <circle cx="34" cy="26" r="1.5" fill="#5E5649"/>
      <circle cx="26" cy="34" r="1.5" fill="#5E5649"/>
      <circle cx="34" cy="34" r="1.5" fill="#5E5649"/>
    </pattern>
  </defs>
  <rect width="400" height="400" fill="url(#buttonsArrangement)" />
`);

// Tipping raw component texture
const TIPPING_TEXTURE = createRawTextileSvg('#22211F', `
  <defs>
    <linearGradient id="tippingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E5D8B8"/>
      <stop offset="50%" stop-color="#B09C6D"/>
      <stop offset="100%" stop-color="#54482E"/>
    </linearGradient>
  </defs>
  <rect x="80" y="50" width="240" height="40" rx="6" fill="url(#tippingGrad)" stroke="#3B3423" stroke-width="2"/>
  <rect x="80" y="140" width="240" height="40" rx="6" fill="url(#tippingGrad)" stroke="#3B3423" stroke-width="2"/>
  <rect x="80" y="230" width="240" height="40" rx="6" fill="url(#tippingGrad)" stroke="#3B3423" stroke-width="2"/>
  <rect x="80" y="320" width="240" height="40" rx="6" fill="url(#tippingGrad)" stroke="#3B3423" stroke-width="2"/>
`);

/**
 * COMPLETE CATALOGUE RAW MATERIAL ITEMS
 * Following the EXACT hierarchy requested:
 * FABRICS:
 *   - Woven Fabrics: Plain, Twill, Satin, Drill, Canvas / Gada, Duck
 *   - Specialty Fabrics: Seersucker, Putta, Flannel, Taffeta, Chiffon, Velvet, Fur, Linen
 *   - Mesh & Stretch: Cotton Mesh, Polyester Mesh, Lycra Mesh
 *   - Patterns: Stripes, Checked
 * DENIM & CHAMBRAY:
 *   - Denim, Chambray
 * LACES:
 *   - Embroidery Lace, Cotton Lace, Lycra Lace, Ric Rac, Imported Lace
 * GARMENT ACCESSORIES:
 *   - Zippers: Metal Zipper (Silver, Gun, Antique), Vislon Zipper
 *   - Buttons: Metal, Snap, Glass, Plastic, Wood, Pearl, Shell
 *   - Tipping: Plastic, Metal
 */
export const ALL_DISCOVERY_MATERIALS: DiscoveryMaterial[] = [
  // -------------------------------------------------------------
  // 1. FABRICS -> WOVEN FABRICS
  // -------------------------------------------------------------
  {
    id: 'mat-plain',
    name: 'Plain',
    category: 'FABRICS',
    subcategory: 'WOVEN FABRICS',
    section: 'WOVEN',
    image: '/assets/materials/fabrics/plain.jpg',
    fallbackTexture: PLAIN_WEAVE_TEXTURE,
    description: 'Even 1/1 weave structure delivering uniform surface strength and balance for shirting and base garments.',
    composition: '100% Cotton / Poly-Cotton / Polyester',
    weave: '1/1 Plain Balanced Weave',
    width: '48" – 63"',
    gsm: '110 – 180 GSM',
    variants: ['Cotton Plain', 'Poly-Cotton Plain', 'Poplin Plain', 'Grey Loom Plain'],
    matchedProductId: 'plain-01',
    productCode: 'CF-PLN-01',
  },
  {
    id: 'mat-cotton',
    name: 'Cotton',
    category: 'FABRICS',
    subcategory: 'WOVEN FABRICS',
    section: 'WOVEN',
    image: '/assets/materials/fabrics/cotton.jpg',
    fallbackTexture: PLAIN_WEAVE_TEXTURE,
    description: 'Pure combed cotton plain and poplin weave offering natural breathability, soft hand touch, and smooth printing base.',
    composition: '100% Pure Combed Cotton',
    weave: '1/1 Combed Plain Weave',
    width: '44" – 63"',
    gsm: '105 – 145 GSM',
    variants: ['40s Combed Cotton', '60s Superfine Cotton', 'Bleached White Cotton', 'RFD Prepared Cotton'],
    matchedProductId: 'plain-01',
    productCode: 'CF-CTN-01',
  },
  {
    id: 'mat-polyester',
    name: 'Polyster',
    category: 'FABRICS',
    subcategory: 'WOVEN FABRICS',
    section: 'WOVEN',
    image: '/assets/materials/fabrics/polyester.jpg',
    fallbackTexture: PLAIN_WEAVE_TEXTURE,
    description: 'High-durability smooth polyester fabric with wrinkle resistance, fast drying, and high colorfastness for workwear and linings.',
    composition: '100% Filament Polyester',
    weave: 'Balanced Plain Poly Weave',
    width: '58" – 60"',
    gsm: '120 – 190 GSM',
    variants: ['Micro Polyester', 'Dobby Poly', 'Matte Finish Poly'],
    matchedProductId: 'plain-02',
    productCode: 'CF-PLY-01',
  },
  {
    id: 'mat-poly-cotton',
    name: 'Poly-cotton',
    category: 'FABRICS',
    subcategory: 'WOVEN FABRICS',
    section: 'WOVEN',
    image: '/assets/materials/fabrics/poly-cotton.jpg',
    fallbackTexture: PLAIN_WEAVE_TEXTURE,
    description: 'Balanced blend combining the breathability of cotton with the dimensional strength and tear resistance of polyester.',
    composition: '65/35 & 80/20 Poly-Cotton Blend',
    weave: 'Fine Poly-Cotton Plain Weave',
    width: '48" – 58"',
    gsm: '115 – 165 GSM',
    variants: ['65/35 Poplin', '80/20 Shirting', 'Dyed Poly-Cotton'],
    matchedProductId: 'plain-03',
    productCode: 'CF-PCT-01',
  },
  {
    id: 'mat-satin',
    name: 'Satin fabrics (pc)polyster',
    category: 'FABRICS',
    subcategory: 'WOVEN FABRICS',
    section: 'WOVEN',
    image: '/assets/materials/fabrics/satin-polyester.jpg',
    fallbackTexture: SATIN_WEAVE_TEXTURE,
    description: 'Smooth floating warp threads producing a lustrous, silky sheen with supple hand feel and drape for premium apparel.',
    composition: 'Polyester / Poly-Cotton (PC) Satin',
    weave: '4/1 & 5-End Satin Weave',
    width: '48" – 58"',
    gsm: '120 – 190 GSM',
    variants: ['PC Satin', 'Poly Silk Satin', 'Dull Bridal Satin', 'Lining Satin'],
    matchedProductId: 'satin-01',
    productCode: 'CF-STN-01',
  },
  {
    id: 'mat-canvas-gada',
    name: 'Canvas gada',
    category: 'FABRICS',
    subcategory: 'WOVEN FABRICS',
    section: 'WOVEN',
    image: '/assets/materials/fabrics/canvas-gada.jpg',
    fallbackTexture: CANVAS_WEAVE_TEXTURE,
    description: 'Sturdy, coarse plain-woven unbleached cotton textile used for structural apparel support, pocketing, and tote bodies.',
    composition: '100% Unbleached Cotton Gada',
    weave: 'Plain Coarse Heavy Canvas',
    width: '48" – 60"',
    gsm: '200 – 350 GSM',
    variants: ['Grey Loom Gada', 'Washed Gada', 'Heavy Tote Canvas', 'Pocketing Canvas'],
    matchedProductId: 'drill-02',
    productCode: 'CF-CNV-01',
  },
  {
    id: 'mat-twill',
    name: 'Twill',
    category: 'FABRICS',
    subcategory: 'WOVEN FABRICS',
    section: 'WOVEN',
    image: '/assets/materials/fabrics/stripes.jpg',
    fallbackTexture: TWILL_WEAVE_TEXTURE,
    description: 'Diagonal ribbed construction with enhanced drape, tear resistance and soil masking properties.',
    composition: '100% Cotton / Poly-Cotton',
    weave: '2/1 & 3/1 Diagonal Twill',
    width: '50" – 63"',
    gsm: '160 – 260 GSM',
    variants: ['Fine Twill', 'Medium Twill', 'Heavy 3/1 Twill', 'Chino Twill'],
    matchedProductId: 'twill-01',
    productCode: 'CF-TWL-01',
  },
  {
    id: 'mat-drill',
    name: 'Drill',
    category: 'FABRICS',
    subcategory: 'WOVEN FABRICS',
    section: 'WOVEN',
    image: '/assets/materials/fabrics/canvas-gada.jpg',
    fallbackTexture: DRILL_WEAVE_TEXTURE,
    description: 'Heavyweight twill weave with visible diagonal diagonal ribs engineered for workwear, trousers, and uniforms.',
    composition: '100% Cotton CCW / KCW',
    weave: '3/1 Heavy Diagonal Drill',
    width: '48" – 63"',
    gsm: '220 – 310 GSM',
    variants: ['20×20 / 108×56', '16×12 / 108×56', '2/20×10 / 108×56', 'Heavy Khaki Drill'],
    matchedProductId: 'drill-01',
    productCode: 'CF-DRL-01',
  },
  {
    id: 'mat-duck',
    name: 'Duck',
    category: 'FABRICS',
    subcategory: 'WOVEN FABRICS',
    section: 'WOVEN',
    image: '/assets/materials/fabrics/plain.jpg',
    fallbackTexture: DUCK_WEAVE_TEXTURE,
    description: 'Tightly woven heavy plain canvas with paired yarns in the warp, offering exceptional puncture and wind resistance.',
    composition: '100% Plied Cotton',
    weave: 'Tight Plied Plain Weave',
    width: '54" – 60"',
    gsm: '280 – 420 GSM',
    variants: ['Number Duck', 'Army Duck', 'Single-Fill Duck', 'Overdye Duck'],
    matchedProductId: 'duck-01',
    productCode: 'CF-DCK-01',
  },

  // -------------------------------------------------------------
  // 1. FABRICS -> SPECIALTY FABRICS
  // -------------------------------------------------------------
  {
    id: 'mat-seersucker',
    name: 'Seersucker',
    category: 'FABRICS',
    subcategory: 'SPECIALTY FABRICS',
    section: 'SPECIALTY',
    image: '/assets/materials/fabrics/seersucker.jpg',
    fallbackTexture: SEERSUCKER_TEXTURE,
    description: 'Slack-tension weave creating natural puckered crinkles that hold the textile away from skin for hot-weather comfort.',
    composition: '100% Cotton / Cotton-Poly Blend',
    weave: 'Slack-Tension Puckered Weave',
    width: '54" – 58"',
    gsm: '115 – 150 GSM',
    variants: ['Classic White Crinkle', 'Blue Micro-Stripe Crinkle', 'Solid Dyed Puckered'],
    matchedProductId: 'fabrics-poplin',
    productCode: 'CF-SSR-01',
  },
  {
    id: 'mat-putta',
    name: 'Putta fabric',
    category: 'FABRICS',
    subcategory: 'SPECIALTY FABRICS',
    section: 'SPECIALTY',
    image: '/assets/materials/fabrics/putta-fabric.jpg',
    fallbackTexture: PLAIN_WEAVE_TEXTURE,
    description: 'Traditional fine-structured woven textile with delicate butta / zari motifs, refined body and crisp finish for apparel.',
    composition: '100% Cotton / Combed Cotton with Woven Motifs',
    weave: 'Crisp Plain Traditional Weave',
    width: '44" – 48"',
    gsm: '95 – 135 GSM',
    variants: ['Standard Putta', 'Fine Mercerised Putta', 'Zari Butta Accent'],
    matchedProductId: 'plain-02',
    productCode: 'CF-PTA-01',
  },
  {
    id: 'mat-flannel',
    name: 'Flannel fabrics',
    category: 'FABRICS',
    subcategory: 'SPECIALTY FABRICS',
    section: 'SPECIALTY',
    image: '/assets/materials/fabrics/flannel-fabrics.jpg',
    fallbackTexture: TWILL_WEAVE_TEXTURE,
    description: 'Brushed surface textile featuring raised nap fibers that trap air for comforting thermal warmth and soft touch.',
    composition: '100% Cotton / Brushed Poly-Cotton',
    weave: 'Napped Plain / Twill Weave',
    width: '54" – 58"',
    gsm: '160 – 210 GSM',
    variants: ['Red & Black Buffalo Plaid', 'Single-Sided Brushed', 'Double-Brushed Cotton'],
    matchedProductId: 'twill-02',
    productCode: 'CF-FLN-01',
  },
  {
    id: 'mat-taffeta',
    name: 'Taffeta',
    category: 'FABRICS',
    subcategory: 'SPECIALTY FABRICS',
    section: 'SPECIALTY',
    image: '/assets/materials/fabrics/taffeta.jpg',
    fallbackTexture: SATIN_WEAVE_TEXTURE,
    description: 'Crisp, smooth plain-woven textile with fine horizontal ribbing, brilliant sheen, and structural rustle for couture silhouettes.',
    composition: 'Polyester / Nylon / Silk Blend',
    weave: 'Fine Crisp Plain Weave',
    width: '58" – 60"',
    gsm: '70 – 110 GSM',
    variants: ['Magenta Shimmer Taffeta', 'Polyester Lining Taffeta', 'Water-Repellent Taffeta'],
    matchedProductId: 'satin-02',
    productCode: 'CF-TFT-01',
  },
  {
    id: 'mat-chiffon',
    name: 'Chiffon fabrics',
    category: 'FABRICS',
    subcategory: 'SPECIALTY FABRICS',
    section: 'SPECIALTY',
    image: '/assets/materials/fabrics/chiffon-fabrics.jpg',
    fallbackTexture: LACE_TEXTURE,
    description: 'Sheer, lightweight textile with delicate drape, fluid transparency, and fine surface texture for overlays and scarves.',
    composition: '100% Polyester / Viscose',
    weave: 'Crepe Twist Plain Weave',
    width: '44" – 58"',
    gsm: '45 – 75 GSM',
    variants: ['Embroidered Floral Chiffon', 'Georgette Chiffon', 'Heavy Crepe Chiffon'],
    matchedProductId: 'plain-03',
    productCode: 'CF-CHF-01',
  },
  {
    id: 'mat-velvet',
    name: 'Velvet',
    category: 'FABRICS',
    subcategory: 'SPECIALTY FABRICS',
    section: 'SPECIALTY',
    image: '/assets/materials/fabrics/velvet.jpg',
    fallbackTexture: VELVET_TEXTURE,
    description: 'Plush tufted pile textile with uniformly distributed dense cut threads that produce a luxurious deep hand and rich light refraction.',
    composition: 'Emerald Cotton / Poly-Spandex / Viscose Pile',
    weave: 'Woven Cut-Pile Construction',
    width: '54" – 58"',
    gsm: '240 – 380 GSM',
    variants: ['Emerald Green Velvet', 'Stretch Micro-Velvet', 'Crushed Velvet', 'Velveteen'],
    matchedProductId: 'fur-fabric',
    productCode: 'CF-VLV-01',
  },
  {
    id: 'mat-fur',
    name: 'Fur',
    category: 'FABRICS',
    subcategory: 'SPECIALTY FABRICS',
    section: 'SPECIALTY',
    image: '/assets/materials/fabrics/fur.jpg',
    fallbackTexture: VELVET_TEXTURE,
    description: 'High-pile patterned faux shearling and plush synthetic fur textile engineered for outerwear collars, linings and accents.',
    composition: '100% Acrylic / Polyester Plush Fur',
    weave: 'Knitted Long-Pile Fur',
    width: '58" – 62"',
    gsm: '320 – 520 GSM',
    variants: ['Leopard Pattern Fur', 'Short Shearling Fur', 'Teddy Sherpa Pile'],
    matchedProductId: 'fur-fabric',
    productCode: 'CF-FUR-01',
  },
  {
    id: 'mat-linen',
    name: 'Linen',
    category: 'FABRICS',
    subcategory: 'SPECIALTY FABRICS',
    section: 'SPECIALTY',
    image: '/assets/materials/fabrics/linen.jpg',
    fallbackTexture: LINEN_TEXTURE,
    description: 'Flax fiber weave characterized by natural slubs, high tensile strength, exceptional breathability and cooling touch.',
    composition: '100% Pure Flax / Linen-Cotton Blend',
    weave: 'Natural Slub Plain Weave',
    width: '54" – 58"',
    gsm: '130 – 210 GSM',
    variants: ['Natural Oat Slub Linen', 'Pure Flax Linen', 'Pre-Washed Apparel Linen'],
    matchedProductId: 'plain-01',
    productCode: 'CF-LNN-01',
  },
  {
    id: 'mat-additional-sample',
    name: 'Additional Sample (to fill grid)',
    category: 'FABRICS',
    subcategory: 'SPECIALTY FABRICS',
    section: 'SPECIALTY',
    image: '/assets/materials/fabrics/jacquard-tapestry.jpg',
    fallbackTexture: LACE_TEXTURE,
    description: 'Ornate paisley floral tapestry and jacquard weave textile for heritage borders, decorative vests, and artistic fashion accents.',
    composition: 'Cotton / Metallic Rayon Jacquard Weave',
    weave: 'Intricate Floral Jacquard Weave',
    width: '54" – 58"',
    gsm: '220 – 340 GSM',
    variants: ['Vintage Floral Jacquard', 'Brocade Tapestry', 'Heritage Multi-Color Weave'],
    matchedProductId: 'plain-02',
    productCode: 'CF-JQD-01',
  },

  // -------------------------------------------------------------
  // 1. FABRICS -> MESH & STRETCH
  // -------------------------------------------------------------
  {
    id: 'mat-mesh',
    name: 'Mesh fabrics (cotton & polys & lycra)',
    category: 'FABRICS',
    subcategory: 'MESH & STRETCH',
    section: 'MESH_STRETCH',
    image: '/assets/materials/fabrics/mesh-fabrics.jpg',
    fallbackTexture: MESH_TEXTURE,
    description: 'Open-pore breathable mesh textile and four-way elastic power stretch mesh engineered for sportswear, pockets, and linings.',
    composition: 'Cotton, Polyester & Lycra Blends',
    weave: 'Open-Cell Hexagonal Knit',
    width: '54" – 60"',
    gsm: '110 – 190 GSM',
    variants: ['Cotton Eyelet Mesh', 'Polyester Athletic Mesh', 'Power Lycra Mesh'],
    matchedProductId: 'mesh-01',
    productCode: 'CF-MSH-01',
  },
  {
    id: 'mat-cotton-mesh',
    name: 'Cotton Mesh',
    category: 'FABRICS',
    subcategory: 'MESH & STRETCH',
    section: 'MESH_STRETCH',
    image: '/assets/materials/fabrics/mesh-fabrics.jpg',
    fallbackTexture: MESH_TEXTURE,
    description: 'Natural cotton open-cell knit structure providing gentle ventilation and skin-friendly breathability for inner linings.',
    composition: '100% Combed Cotton Knit',
    weave: 'Porous Eyelet Mesh Knit',
    width: '54" – 58"',
    gsm: '120 – 160 GSM',
    variants: ['Micro Eyelet Cotton', 'Air-Cell Cotton Knit', 'Sports Lining Mesh'],
    matchedProductId: 'mesh-01',
    productCode: 'CF-MSH-02',
  },
  {
    id: 'mat-lycra-mesh',
    name: 'Lycra Mesh',
    category: 'FABRICS',
    subcategory: 'MESH & STRETCH',
    section: 'MESH_STRETCH',
    image: '/assets/materials/fabrics/mesh-fabrics.jpg',
    fallbackTexture: MESH_TEXTURE,
    description: 'Four-way elastic power stretch mesh designed for active compression inserts, swimwear panels, and contouring trims.',
    composition: '82% Nylon / 18% Lycra Spandex',
    weave: '4-Way Power Stretch Knit',
    width: '58" – 60"',
    gsm: '130 – 210 GSM',
    variants: ['Power Mesh', '4-Way Stretch Net', 'Micro-Elastic Tulle'],
    matchedProductId: 'lycra-mesh-01',
    productCode: 'CF-LYC-01',
  },

  // -------------------------------------------------------------
  // 1. FABRICS -> PATTERNS
  // -------------------------------------------------------------
  {
    id: 'mat-stripes',
    name: 'Stripes',
    category: 'FABRICS',
    subcategory: 'PATTERNS',
    section: 'PATTERNS',
    image: '/assets/materials/fabrics/stripes.jpg',
    fallbackTexture: TWILL_WEAVE_TEXTURE,
    description: 'Precision yarn-dyed longitudinal stripes woven directly on rapier and airjet looms with crisp edge definition.',
    composition: '100% Cotton / Poly-Cotton',
    weave: 'Yarn-Dyed Striped Plain / Twill',
    pattern: 'Pin Stripe / Bengal Stripe / Awning Stripe',
    width: '54" – 58"',
    gsm: '120 – 175 GSM',
    variants: ['Navy & White Vertical Stripe', 'Bengal Oxford Stripe', 'Club Twill Stripe'],
    matchedProductId: 'plain-02',
    productCode: 'CF-PAT-01',
  },
  {
    id: 'mat-checked',
    name: 'Checked',
    category: 'FABRICS',
    subcategory: 'PATTERNS',
    section: 'PATTERNS',
    image: '/assets/materials/fabrics/checked.jpg',
    fallbackTexture: CANVAS_WEAVE_TEXTURE,
    description: 'Balanced warp and weft intersection patterns forming classic tartans, buffalo checks, and micro-grid designs.',
    composition: '100% Cotton / Poly-Cotton',
    weave: 'Yarn-Dyed Checked Construction',
    pattern: 'Buffalo Check / Gingham / Windowpane / Tartan',
    width: '54" – 58"',
    gsm: '125 – 185 GSM',
    variants: ['Red, Black & White Check', 'Buffalo Plaid', 'Micro Gingham Check'],
    matchedProductId: 'plain-03',
    productCode: 'CF-PAT-02',
  },

  // -------------------------------------------------------------
  // 2. DENIM & CHAMBRAY
  // -------------------------------------------------------------
  {
    id: 'mat-denim',
    name: 'Denim',
    category: 'DENIM & CHAMBRAY',
    subcategory: 'DENIM',
    section: 'DENIM_CHAMBRAY',
    image: '/assets/materials/fabrics/denim.jpg',
    fallbackTexture: DENIM_TEXTURE,
    description: 'Authentic 3/1 right-hand twill textile with indigo dyed warp and unbleached ecru weft yarns showing distinct diagonal weave.',
    composition: '100% Cotton / Cotton-Elastane Stretch',
    weave: '3/1 Right-Hand Diagonal Twill',
    width: '56" – 62"',
    gsm: '280 – 430 GSM (10 oz – 14.5 oz)',
    variants: ['Rigid Raw Indigo', 'Comfort Stretch Denim', 'Overdye Black Denim', 'Selvedge Mill Denim'],
    matchedProductId: 'denim-01',
    productCode: 'CF-DNM-01',
  },
  {
    id: 'mat-chambray',
    name: 'Chambray',
    category: 'DENIM & CHAMBRAY',
    subcategory: 'CHAMBRAY',
    section: 'DENIM_CHAMBRAY',
    image: '/assets/materials/fabrics/chambray.jpg',
    fallbackTexture: CHAMBRAY_TEXTURE,
    description: 'Lightweight plain-weave textile combining colored indigo warp with clean white weft yarns for casual shirting texture.',
    composition: '100% Combed Cotton',
    weave: '1/1 Yarn-Dyed Plain Chambray Weave',
    width: '54" – 58"',
    gsm: '120 – 160 GSM (4.5 oz – 5.5 oz)',
    variants: ['Classic Indigo Chambray', 'Light Bleach Chambray', 'Slub Yarn Chambray'],
    matchedProductId: 'chambray-01',
    productCode: 'CF-CHM-01',
  },

  // -------------------------------------------------------------
  // 3. LACES
  // -------------------------------------------------------------
  {
    id: 'mat-embroidery-lace',
    name: 'Embroidery Lace',
    category: 'LACES',
    subcategory: 'LACES',
    section: 'LACES',
    image: '/assets/materials/laces.jpg',
    fallbackTexture: LACE_TEXTURE,
    description: 'Detailed embroidery lace rolls and strips suitable for garment trims, necklines, hem borders and decorative finishing.',
    composition: 'Cotton Needlework on Organza / Mesh',
    weave: 'Schiffli / Multi-Head Embroidery Needlework',
    width: '25 mm – 150 mm',
    variants: ['Scalloped Border Lace', 'Floral Eyelet Embroidery', 'Corded Guipure Lace'],
    matchedProductId: 'lace-01',
    productCode: 'CF-LAC-01',
  },
  {
    id: 'mat-cotton-lace',
    name: 'Cotton Lace',
    category: 'LACES',
    subcategory: 'LACES',
    section: 'LACES',
    image: '/assets/materials/laces.jpg',
    fallbackTexture: LACE_TEXTURE,
    description: 'Soft pure cotton crochet and bobbin-style lace strips with matte natural hand feel for childrenswear and bohemian garments.',
    composition: '100% Natural Combed Cotton',
    weave: 'Bobbin / Crochet Cotton Trim',
    width: '15 mm – 90 mm',
    variants: ['Bleached White Cotton Lace', 'Unbleached Natural Cream', 'Dyed Custom Shade'],
    matchedProductId: 'lace-02',
    productCode: 'CF-LAC-02',
  },
  {
    id: 'mat-lycra-lace',
    name: 'Lycra Lace',
    category: 'LACES',
    subcategory: 'LACES',
    section: 'LACES',
    image: '/assets/materials/laces.jpg',
    fallbackTexture: LACE_TEXTURE,
    description: 'Elastic stretch lace ribbons engineered with high recovery elastane for bodycon apparel, intimates and lingerie bands.',
    composition: '88% Polyamide / 12% Spandex',
    weave: 'Raschel Stretch Lace Knit',
    width: '20 mm – 120 mm',
    variants: ['Stretch Floral Ribbon', 'Scalloped Waistband Lace', 'Soft Underwire Binding Lace'],
    matchedProductId: 'lace-03',
    productCode: 'CF-LAC-03',
  },
  {
    id: 'mat-ric-rac',
    name: 'Ric Rac',
    category: 'LACES',
    subcategory: 'LACES',
    section: 'LACES',
    image: '/assets/materials/laces.jpg',
    fallbackTexture: LACE_TEXTURE,
    description: 'Classic zig-zag woven braid trim offering crisp geometric waves for retro edging, plackets, pockets and collar piping.',
    composition: '100% Cotton / Polyester Braid',
    weave: 'Woven Zig-Zag Wave Braid',
    width: '6 mm, 10 mm, 15 mm, 20 mm',
    variants: ['Miniature 6mm Ric Rac', 'Medium 12mm Wave', 'Jumbo 20mm Ric Rac'],
    matchedProductId: 'lace-04',
    productCode: 'CF-LAC-04',
  },
  {
    id: 'mat-imported-lace',
    name: 'Imported Lace',
    category: 'LACES',
    subcategory: 'LACES',
    section: 'LACES',
    image: '/assets/materials/laces.jpg',
    fallbackTexture: LACE_TEXTURE,
    description: 'Premium international couture lace textiles featuring high-definition guipure cords, metallic accents and luxury hand work.',
    composition: 'Nylon / Rayon / Metallic Thread',
    weave: 'Fine European-Standard Schiffli & Guipure',
    width: '30 mm – 220 mm',
    variants: ['French Floral Guipure', 'Metallic Lurex Lace', 'Eyelash Chantilly Lace'],
    matchedProductId: 'lace-05',
    productCode: 'CF-LAC-05',
  },

  // -------------------------------------------------------------
  // 4. GARMENT ACCESSORIES -> ZIPPERS
  // -------------------------------------------------------------
  {
    id: 'mat-metal-zipper',
    name: 'Metal Zipper',
    category: 'GARMENT ACCESSORIES',
    subcategory: 'ZIPPERS',
    section: 'ZIPPERS',
    image: '/assets/materials/accessories.jpg',
    fallbackTexture: ZIPPER_TEXTURE,
    description: 'Heavy-duty precision interlocking metallic teeth on woven polyester/cotton tape for jeans, leather and outerwear.',
    composition: 'Solid Brass / Zinc Alloy on Poly Tape',
    weave: 'Heavy Interlocking Teeth Element',
    width: '#3, #5, #8, #10 Gauge',
    variants: ['Silver Teeth Finish', 'Gunmetal Finish', 'Antique Brass Finish'],
    matchedProductId: 'zipper-metal',
    productCode: 'CF-ZIP-01',
  },
  {
    id: 'mat-vislon-zipper',
    name: 'Vislon Zipper',
    category: 'GARMENT ACCESSORIES',
    subcategory: 'ZIPPERS',
    section: 'ZIPPERS',
    image: '/assets/materials/accessories.jpg',
    fallbackTexture: ZIPPER_TEXTURE,
    description: 'Molded polyacetal plastic teeth fused directly to continuous textile tape for lightweight corrosion-free activewear closures.',
    composition: 'Delrin / Polyacetal Resin & Tape',
    weave: 'Injection-Molded Tooth Chain',
    width: '#3, #5, #8 Gauge',
    variants: ['Open-End Jacket Zipper', 'Closed-End Pocket Zipper', 'Two-Way Reversible Slider'],
    matchedProductId: 'zipper-vislon',
    productCode: 'CF-ZIP-02',
  },

  // -------------------------------------------------------------
  // 4. GARMENT ACCESSORIES -> BUTTONS
  // -------------------------------------------------------------
  {
    id: 'mat-metal-button',
    name: 'Metal Button',
    category: 'GARMENT ACCESSORIES',
    subcategory: 'BUTTONS',
    section: 'BUTTONS',
    image: '/assets/materials/buttons.jpg',
    fallbackTexture: BUTTONS_TEXTURE,
    description: 'Stamped and cast brass or zinc alloy shank and sew-through buttons for denim jackets, blazers and military outerwear.',
    composition: 'Brass / Zinc Alloy / Zamak',
    variants: ['14L – 32L', 'Antique Brass Shank', 'Matte Black Sew-Through'],
    matchedProductId: 'btn-metal',
    productCode: 'CF-BTN-01',
  },
  {
    id: 'mat-snap-button',
    name: 'Snap Button',
    category: 'GARMENT ACCESSORIES',
    subcategory: 'BUTTONS',
    section: 'BUTTONS',
    image: '/assets/materials/buttons.jpg',
    fallbackTexture: BUTTONS_TEXTURE,
    description: 'Four-part spring and ring-socket snap fastener components designed for rapid automated press-machine attachment.',
    composition: 'Stainless Steel / Brass Cap',
    variants: ['Ring Snap (Baby/Activewear)', 'S-Spring Snap', 'Prong Snap'],
    matchedProductId: 'btn-snap',
    productCode: 'CF-BTN-02',
  },
  {
    id: 'mat-glass-button',
    name: 'Glass Button',
    category: 'GARMENT ACCESSORIES',
    subcategory: 'BUTTONS',
    section: 'BUTTONS',
    image: '/assets/materials/buttons.jpg',
    fallbackTexture: BUTTONS_TEXTURE,
    description: 'Faceted, hand-cut and molded crystal glass buttons delivering jewel-like light refraction for couture collections.',
    composition: 'Lead-Free Optical Crystal Glass',
    variants: ['Clear Faceted Round', 'Opal Finish', 'Smoky Glass Shank'],
    matchedProductId: 'btn-glass',
    productCode: 'CF-BTN-03',
  },
  {
    id: 'mat-plastic-button',
    name: 'Plastic Button',
    category: 'GARMENT ACCESSORIES',
    subcategory: 'BUTTONS',
    section: 'BUTTONS',
    image: '/assets/materials/buttons.jpg',
    fallbackTexture: BUTTONS_TEXTURE,
    description: 'Polyester resin and nylon injection-molded buttons with excellent chemical and laundry resistance for mass apparel.',
    composition: 'High-Grade Polyester Resin',
    variants: ['4-Hole Shirt Button 14L–18L', 'Chalk Finish', 'Mock Tortoise Resin'],
    matchedProductId: 'btn-plastic',
    productCode: 'CF-BTN-04',
  },
  {
    id: 'mat-wood-button',
    name: 'Wood Button',
    category: 'GARMENT ACCESSORIES',
    subcategory: 'BUTTONS',
    section: 'BUTTONS',
    image: '/assets/materials/buttons.jpg',
    fallbackTexture: BUTTONS_TEXTURE,
    description: 'Sustainably turned natural hardwood buttons with visible organic grain patterns and polished matte protective seal.',
    composition: 'Natural Olive / Cedar / Coconut Shell',
    variants: ['Natural Olivewood', 'Laser-Engraved Wooden', 'Burnt Edge Wood'],
    matchedProductId: 'btn-wood',
    productCode: 'CF-BTN-05',
  },
  {
    id: 'mat-pearl-button',
    name: 'Pearl Button',
    category: 'GARMENT ACCESSORIES',
    subcategory: 'BUTTONS',
    section: 'BUTTONS',
    image: '/assets/materials/buttons.jpg',
    fallbackTexture: BUTTONS_TEXTURE,
    description: 'Iridescent simulated and natural mother-of-pearl buttons providing elegant organic luster for dress shirts.',
    composition: 'Trocas / Acrylic Mother-of-Pearl',
    variants: ['16L Shirt Pearl', 'Smoky MOP Button', 'Agoya Pearl Round'],
    matchedProductId: 'btn-pearl',
    productCode: 'CF-BTN-06',
  },
  {
    id: 'mat-shell-button',
    name: 'Shell Button',
    category: 'GARMENT ACCESSORIES',
    subcategory: 'BUTTONS',
    section: 'BUTTONS',
    image: '/assets/materials/buttons.jpg',
    fallbackTexture: BUTTONS_TEXTURE,
    description: 'Authentic river and marine mollusc shell buttons with unique organic backings and luxury high-sheen facets.',
    composition: 'Genuine Marine Shell',
    variants: ['River Shell 18L', 'Black Lip Shell', 'White Mother of Shell'],
    matchedProductId: 'btn-shell',
    productCode: 'CF-BTN-07',
  },

  // -------------------------------------------------------------
  // 4. GARMENT ACCESSORIES -> TIPPING
  // -------------------------------------------------------------
  {
    id: 'mat-tipping-plastic',
    name: 'Plastic Tipping',
    category: 'GARMENT ACCESSORIES',
    subcategory: 'TIPPING',
    section: 'TIPPING',
    image: '/assets/materials/accessories.jpg',
    fallbackTexture: TIPPING_TEXTURE,
    description: 'Acetate film and molded silicone cord ends sealed under thermal heat to prevent drawcord and tape fraying.',
    composition: 'Cellulose Acetate / Thermoplastic',
    variants: ['Clear Transparent Aglet', 'Matte Black Plastic Tip', 'Logo-Embossed Silicone'],
    matchedProductId: 'tipping-plastic',
    productCode: 'CF-TIP-01',
  },
  {
    id: 'mat-tipping-metal',
    name: 'Metal Tipping',
    category: 'GARMENT ACCESSORIES',
    subcategory: 'TIPPING',
    section: 'TIPPING',
    image: '/assets/materials/accessories.jpg',
    fallbackTexture: TIPPING_TEXTURE,
    description: 'Crimp-on brass and zinc alloy aglets providing weighted drape and metallic accent on hoodie strings and drawcords.',
    composition: 'Electroplated Solid Brass / Zinc',
    variants: ['Matte Gunmetal Aglet', 'Polished Silver Crimp', 'Brushed Antique Brass Cylinder'],
    matchedProductId: 'tipping-metal',
    productCode: 'CF-TIP-02',
  },
];

/**
 * Curated list for the "MATERIAL WALL" section:
 * Flowing tactile circular arrangement of raw textile materials
 */
export const MATERIAL_WALL_ITEMS: DiscoveryMaterial[] = [
  ALL_DISCOVERY_MATERIALS.find((m) => m.name === 'Seersucker')!,
  ALL_DISCOVERY_MATERIALS.find((m) => m.name === 'Putta fabric')!,
  ALL_DISCOVERY_MATERIALS.find((m) => m.name === 'Plain')!,
  ALL_DISCOVERY_MATERIALS.find((m) => m.name === 'Denim')!,
  ALL_DISCOVERY_MATERIALS.find((m) => m.name === 'Chambray')!,
  ALL_DISCOVERY_MATERIALS.find((m) => m.name === 'Stripes')!,
  ALL_DISCOVERY_MATERIALS.find((m) => m.name === 'Checked')!,
  ALL_DISCOVERY_MATERIALS.find((m) => m.name === 'Flannel fabrics')!,
  ALL_DISCOVERY_MATERIALS.find((m) => m.name === 'Taffeta')!,
  ALL_DISCOVERY_MATERIALS.find((m) => m.name === 'Satin fabrics (pc)polyster')!,
  ALL_DISCOVERY_MATERIALS.find((m) => m.name === 'Mesh fabrics (cotton & polys & lycra)')!,
  ALL_DISCOVERY_MATERIALS.find((m) => m.name === 'Canvas gada')!,
  ALL_DISCOVERY_MATERIALS.find((m) => m.name === 'Fur')!,
  ALL_DISCOVERY_MATERIALS.find((m) => m.name === 'Chiffon fabrics')!,
  ALL_DISCOVERY_MATERIALS.find((m) => m.name === 'Velvet')!,
  ALL_DISCOVERY_MATERIALS.find((m) => m.name === 'Linen')!,
  ALL_DISCOVERY_MATERIALS.find((m) => m.name === 'Cotton')!,
  ALL_DISCOVERY_MATERIALS.find((m) => m.name === 'Polyster')!,
  ALL_DISCOVERY_MATERIALS.find((m) => m.name === 'Poly-cotton')!,
  ALL_DISCOVERY_MATERIALS.find((m) => m.name === 'Additional Sample (to fill grid)')!,
].filter(Boolean);

/**
 * Utility to find a matched Product object for integration with the rest of the application
 */
export function getProductForDiscoveryMaterial(mat: DiscoveryMaterial): Product {
  // Check products list by matched id or code
  const found = products.find(
    (p) => p.id === mat.matchedProductId || p.productCode === mat.productCode || p.name.toLowerCase().includes(mat.name.toLowerCase())
  );
  if (found) {
    return found;
  }

  // Create a compliant Product object representing this raw material
  return {
    id: mat.id,
    productCode: mat.productCode || `CF-${mat.id.toUpperCase()}`,
    name: mat.name,
    category: mat.category === 'FABRICS' ? 'fabrics' : mat.category === 'DENIM & CHAMBRAY' ? 'denim' : mat.category === 'LACES' ? 'laces' : 'accessories',
    categoryLabel: mat.category,
    subcategory: mat.subcategory,
    fabricWeaveType: (mat.weave && mat.weave.includes('Twill') ? 'TWILL' : mat.weave && mat.weave.includes('Satin') ? 'SATIN' : mat.weave && mat.weave.includes('Drill') ? 'DRILL' : 'PLAIN') as any,
    width: mat.width,
    gsm: mat.gsm,
    weave: mat.weave,
    description: mat.description,
    shortDescription: mat.description,
    fullDescription: `${mat.description} Sourced and supplied by Classic Fashions for garment makers and export units.`,
    images: [mat.image, mat.fallbackTexture || mat.image],
    imageAlt: `Raw ${mat.name} textile material sample`,
    colours: ['Natural Ecru', 'Optical White', 'Custom Mill Dyeing'],
    sizes: mat.variants || ['Sample Bolt', 'Production Roll'],
    fabric: mat.composition || '100% Textile Material',
    price: 'Wholesale Quotation on Enquiry',
    availability: 'In Stock',
    active: true,
    patternType: mat.category === 'LACES' ? 'embroidery-lace' : mat.category === 'DENIM & CHAMBRAY' ? 'denim' : 'woven-fabric',
    specifications: mat.composition || mat.weave || 'Standard Mill Specification',
    applications: ['Garment Manufacturing', 'Sampling', 'Apparel Export'],
    enquiryEnabled: true,
    isService: false,
    featured: false,
  };
}
