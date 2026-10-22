import { Product } from '../types.ts';

/**
 * Robust asset URL resolver for local Vite dev server and GitHub Pages / production base paths
 */
export function getFireflyAssetUrl(filename: string): string {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const prefix = base ? `${base}/` : '/';
  return `${prefix}assets/firefly-fabrics/${filename}`;
}

export interface FireflyFabricItem {
  id: string;
  name: string;
  category: 'Natural Fibers' | 'Blends' | 'Synthetics' | 'Mesh & Knits';
  filename: string;
  imageUrl: string;
  composition: string;
  weave: string;
  weightGsm: string;
  drapeStiffness: number; // 0.1 (fluid) to 1.0 (stiff)
  roughness: number;
  metalness: number;
  sheen: number;
  sheenColor: string;
  sheenRoughness: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  textureRepeat: { x: number; y: number };
  description: string;
}

export const FIREFLY_FABRICS: FireflyFabricItem[] = [
  {
    id: 'ff-canvas-gada',
    name: 'Canvas / Gada Fabric',
    category: 'Natural Fibers',
    filename: 'canvas gada.png',
    imageUrl: getFireflyAssetUrl('canvas gada.png'),
    composition: '100% Unbleached Coarse Cotton Yarn',
    weave: 'Heavy Duck / Plain Basket Weave',
    weightGsm: '340 GSM',
    drapeStiffness: 0.85,
    roughness: 0.92,
    metalness: 0.0,
    sheen: 0.05,
    sheenColor: '#FFFDF9',
    sheenRoughness: 0.5,
    textureRepeat: { x: 2, y: 2 },
    description: 'Heavyweight, rugged unbleached cotton canvas with substantial structural body, firm hand-feel, and prominent yarn intersection cross-sections.',
  },
  {
    id: 'ff-checked',
    name: 'Checked Woven Fabric',
    category: 'Natural Fibers',
    filename: 'checked fab.png',
    imageUrl: getFireflyAssetUrl('checked fab.png'),
    composition: '100% Yarn-Dyed Combed Cotton',
    weave: 'Longitudinal & Latitudinal Balanced Check',
    weightGsm: '145 GSM',
    drapeStiffness: 0.35,
    roughness: 0.78,
    metalness: 0.0,
    sheen: 0.18,
    sheenColor: '#F5EBDC',
    sheenRoughness: 0.35,
    textureRepeat: { x: 2, y: 2 },
    description: 'Crisp yarn-dyed balanced check woven textile with sharp color boundaries, balanced drape flexibility, and soft skin contact hand.',
  },
  {
    id: 'ff-cotton-mesh',
    name: 'Cotton Mesh Fabric',
    category: 'Mesh & Knits',
    filename: 'cotton mesh.png',
    imageUrl: getFireflyAssetUrl('cotton mesh.png'),
    composition: '100% Porous Long-Staple Cotton',
    weave: 'Open-Cell Hexagonal Eyelet Knit',
    weightGsm: '160 GSM',
    drapeStiffness: 0.28,
    roughness: 0.85,
    metalness: 0.0,
    sheen: 0.12,
    sheenColor: '#FAF7F0',
    sheenRoughness: 0.4,
    textureRepeat: { x: 2, y: 2 },
    description: 'Open breathable cellular mesh with micro-perforations engineered for maximum ventilation, light moisture dispersion, and supple elasticity.',
  },
  {
    id: 'ff-cotton-combed',
    name: 'Pure Combed Cotton',
    category: 'Natural Fibers',
    filename: 'cotton.png',
    imageUrl: getFireflyAssetUrl('cotton.png'),
    composition: '100% Ring-Spun Combed Cotton',
    weave: '1/1 Balanced Plain Weave',
    weightGsm: '140 GSM',
    drapeStiffness: 0.36,
    roughness: 0.80,
    metalness: 0.0,
    sheen: 0.15,
    sheenColor: '#FFFFFF',
    sheenRoughness: 0.3,
    textureRepeat: { x: 2, y: 2 },
    description: 'High-purity ring-spun cotton free of impurities, exhibiting a soft matte drape, gentle tactile comfort, and uniform yarn packing.',
  },
  {
    id: 'ff-showcase',
    name: 'Atelier Specimen Spec',
    category: 'Blends',
    filename: 'Firefly_Gemini Flash.png',
    imageUrl: getFireflyAssetUrl('Firefly_Gemini Flash.png'),
    composition: 'Curated Textile Specimen Studio Blend',
    weave: 'Complex Multilayer Dobby Weave',
    weightGsm: '210 GSM',
    drapeStiffness: 0.42,
    roughness: 0.65,
    metalness: 0.05,
    sheen: 0.45,
    sheenColor: '#E8D5B5',
    sheenRoughness: 0.25,
    textureRepeat: { x: 2, y: 2 },
    description: 'Designer showcase specimen woven with multifaceted yarn counts, producing intricate light-refraction characteristics and graceful cascading folds.',
  },
  {
    id: 'ff-flannel',
    name: 'Brushed Cotton Flannel',
    category: 'Natural Fibers',
    filename: 'flannel.png',
    imageUrl: getFireflyAssetUrl('flannel.png'),
    composition: '100% Heavy Twill Cotton (Double Napped)',
    weave: '2/2 Broken Twill with Wire Brushed Nap',
    weightGsm: '220 GSM',
    drapeStiffness: 0.48,
    roughness: 0.95,
    metalness: 0.0,
    sheen: 0.35,
    sheenColor: '#EAE1D3',
    sheenRoughness: 0.6,
    textureRepeat: { x: 2, y: 2 },
    description: 'Warm brushed surface with dense fibrous fuzz nap, retaining thermal warmth and dampening specular glare for an ultra-cozy, matte appearance.',
  },
  {
    id: 'ff-fur',
    name: 'Plush Faux Fur Pile',
    category: 'Synthetics',
    filename: 'fur.png',
    imageUrl: getFireflyAssetUrl('fur.png'),
    composition: '100% Acrylic / Polyester Microfiber Tufts',
    weave: 'Tufted Deep Cut-Pile Construction',
    weightGsm: '480 GSM',
    drapeStiffness: 0.65,
    roughness: 0.88,
    metalness: 0.02,
    sheen: 0.75,
    sheenColor: '#FFFFFF',
    sheenRoughness: 0.45,
    textureRepeat: { x: 2, y: 2 },
    description: 'Deep high-density upright pile tufts with high light scattering, rich shadow crevices, and a luxurious tactile volume.',
  },
  {
    id: 'ff-linen',
    name: 'Natural Belgian Linen',
    category: 'Natural Fibers',
    filename: 'linen.png',
    imageUrl: getFireflyAssetUrl('linen.png'),
    composition: '100% Long-Flax European Linen',
    weave: 'Organic Slub Plain Weave',
    weightGsm: '195 GSM',
    drapeStiffness: 0.52,
    roughness: 0.86,
    metalness: 0.0,
    sheen: 0.22,
    sheenColor: '#EDE5D6',
    sheenRoughness: 0.38,
    textureRepeat: { x: 2, y: 2 },
    description: 'Natural flax fibers displaying authentic irregular slubs, cool tactile crispness, dry hand-feel, and characteristic architectural folds.',
  },
  {
    id: 'ff-lycra-mesh',
    name: 'Lycra 4-Way Stretch Mesh',
    category: 'Mesh & Knits',
    filename: 'Lycra mesh fab.png',
    imageUrl: getFireflyAssetUrl('Lycra mesh fab.png'),
    composition: '82% Polyamide Microfiber, 18% Elastane',
    weave: '4-Way Stretch Warp-Knit Tricot Net',
    weightGsm: '175 GSM',
    drapeStiffness: 0.18,
    roughness: 0.45,
    metalness: 0.08,
    sheen: 0.60,
    sheenColor: '#C4E5FF',
    sheenRoughness: 0.25,
    textureRepeat: { x: 2, y: 2 },
    description: 'High-recovery athletic stretch net with micro-filament sheen, fluid omnidirectional elasticity, and rapid shape memory.',
  },
  {
    id: 'ff-plain',
    name: 'Classic Plain Weave',
    category: 'Natural Fibers',
    filename: 'plain.png',
    imageUrl: getFireflyAssetUrl('plain.png'),
    composition: '100% Pure Carded & Combed Cotton',
    weave: '1/1 Balanced Interlaced Plain Weave',
    weightGsm: '130 GSM',
    drapeStiffness: 0.34,
    roughness: 0.82,
    metalness: 0.0,
    sheen: 0.12,
    sheenColor: '#F7F4EE',
    sheenRoughness: 0.35,
    textureRepeat: { x: 2, y: 2 },
    description: 'The fundamental balanced textile construction with equidistant warp and weft interlacing, providing clean uniform drape and versatile utility.',
  },
  {
    id: 'ff-poly-cotton',
    name: 'Poly-Cotton Blended Fabric',
    category: 'Blends',
    filename: 'poly-cotton blended fabric.png',
    imageUrl: getFireflyAssetUrl('poly-cotton blended fabric.png'),
    composition: '65% Polyester, 35% Combed Cotton',
    weave: 'Fine Combed Blended Twill',
    weightGsm: '185 GSM',
    drapeStiffness: 0.44,
    roughness: 0.70,
    metalness: 0.04,
    sheen: 0.30,
    sheenColor: '#F2ECE1',
    sheenRoughness: 0.3,
    textureRepeat: { x: 2, y: 2 },
    description: 'Engineered commercial uniform blend uniting cotton breathability with polyester tensile strength, wrinkle recovery, and lasting dimensional stability.',
  },
  {
    id: 'ff-polyester-mesh',
    name: 'Athletic Polyester Mesh',
    category: 'Mesh & Knits',
    filename: 'Polyster mesh fab.png',
    imageUrl: getFireflyAssetUrl('Polyster mesh fab.png'),
    composition: '100% High-Tenacity Polyester Filament',
    weave: 'Honeycomb Perforated Sports Eyelet',
    weightGsm: '150 GSM',
    drapeStiffness: 0.26,
    roughness: 0.52,
    metalness: 0.06,
    sheen: 0.55,
    sheenColor: '#DCE8F5',
    sheenRoughness: 0.28,
    textureRepeat: { x: 2, y: 2 },
    description: 'Technical athletic mesh with engineered air channels for moisture capillary wicking, rapid drying, and durable mechanical resilience.',
  },
  {
    id: 'ff-polyester',
    name: 'High-Tenacity Polyester',
    category: 'Synthetics',
    filename: 'polyster.png',
    imageUrl: getFireflyAssetUrl('polyster.png'),
    composition: '100% Continuous Filament Polyester',
    weave: 'Tightly Packed Filament Plain Weave',
    weightGsm: '165 GSM',
    drapeStiffness: 0.40,
    roughness: 0.38,
    metalness: 0.08,
    sheen: 0.65,
    sheenColor: '#E6EFFB',
    sheenRoughness: 0.20,
    clearcoat: 0.25,
    clearcoatRoughness: 0.15,
    textureRepeat: { x: 2, y: 2 },
    description: 'Smooth continuous synthetic weave with clean specular highlights, low moisture absorption, high abrasion resistance, and crisp crease retention.',
  },
  {
    id: 'ff-putta',
    name: 'Traditional Putta Fabric',
    category: 'Natural Fibers',
    filename: 'Putta Fabric.png',
    imageUrl: getFireflyAssetUrl('Putta Fabric.png'),
    composition: '100% Traditional Handloom Cotton Yarn',
    weave: 'Artisanal Raised Rib & Corded Texture Weave',
    weightGsm: '235 GSM',
    drapeStiffness: 0.58,
    roughness: 0.88,
    metalness: 0.0,
    sheen: 0.16,
    sheenColor: '#FAF3E3',
    sheenRoughness: 0.45,
    textureRepeat: { x: 2, y: 2 },
    description: 'Heritage artisanal textile featuring corded longitudinal ribs and raised texture bands, bringing rich dimensional depth and firm drape.',
  },
  {
    id: 'ff-velvet',
    name: 'Royal Plush Velvet',
    category: 'Synthetics',
    filename: 'velvet.png',
    imageUrl: getFireflyAssetUrl('velvet.png'),
    composition: '92% Polyester Microfiber, 8% Spandex Backing',
    weave: 'Warp Cut-Pile Sheared Velvet',
    weightGsm: '320 GSM',
    drapeStiffness: 0.32,
    roughness: 0.28,
    metalness: 0.04,
    sheen: 0.96,
    sheenColor: '#FBE8B5',
    sheenRoughness: 0.18,
    textureRepeat: { x: 2, y: 2 },
    description: 'Extravagant sheared cut-pile textile with anisotropic light play, deep color absorption when viewed directly, and luminous golden glow under grazing angles.',
  },
];

/**
 * Intelligent matcher from any Catalogue material (name or id) to the most accurate Firefly fabric index (0 to 14)
 */
export function findMatchingFireflyIndex(query?: string | null): number {
  if (!query) return 0;
  const q = query.toLowerCase().trim();

  // 1. Direct ID match
  const idIdx = FIREFLY_FABRICS.findIndex((f) => f.id.toLowerCase() === q);
  if (idIdx !== -1) return idIdx;

  // 2. Specific exact keywords
  if (q.includes('cotton mesh')) {
    const idx = FIREFLY_FABRICS.findIndex((f) => f.id === 'ff-cotton-mesh');
    if (idx !== -1) return idx;
  }
  if (q.includes('lycra mesh')) {
    const idx = FIREFLY_FABRICS.findIndex((f) => f.id === 'ff-lycra-mesh');
    if (idx !== -1) return idx;
  }
  if (q.includes('poly-cotton') || q.includes('poly cotton') || q.includes('blended')) {
    const idx = FIREFLY_FABRICS.findIndex((f) => f.id === 'ff-poly-cotton');
    if (idx !== -1) return idx;
  }
  if (q.includes('canvas') || q.includes('gada') || q.includes('twill') || q.includes('drill') || q.includes('duck')) {
    const idx = FIREFLY_FABRICS.findIndex((f) => f.id === 'ff-canvas-gada');
    if (idx !== -1) return idx;
  }
  if (q.includes('check')) {
    const idx = FIREFLY_FABRICS.findIndex((f) => f.id === 'ff-checked');
    if (idx !== -1) return idx;
  }
  if (q.includes('cotton')) {
    const idx = FIREFLY_FABRICS.findIndex((f) => f.id === 'ff-cotton-combed');
    if (idx !== -1) return idx;
  }
  if (q.includes('velvet')) {
    const idx = FIREFLY_FABRICS.findIndex((f) => f.id === 'ff-velvet');
    if (idx !== -1) return idx;
  }
  if (q.includes('linen') || q.includes('chambray')) {
    const idx = FIREFLY_FABRICS.findIndex((f) => f.id === 'ff-linen');
    if (idx !== -1) return idx;
  }
  if (q.includes('flannel')) {
    const idx = FIREFLY_FABRICS.findIndex((f) => f.id === 'ff-flannel');
    if (idx !== -1) return idx;
  }
  if (q.includes('fur')) {
    const idx = FIREFLY_FABRICS.findIndex((f) => f.id === 'ff-fur');
    if (idx !== -1) return idx;
  }
  if (q.includes('putta')) {
    const idx = FIREFLY_FABRICS.findIndex((f) => f.id === 'ff-putta');
    if (idx !== -1) return idx;
  }
  if (q.includes('mesh')) {
    const idx = FIREFLY_FABRICS.findIndex((f) => f.id === 'ff-polyester-mesh');
    if (idx !== -1) return idx;
  }
  if (q.includes('poly') || q.includes('satin') || q.includes('taffeta') || q.includes('chiffon')) {
    const idx = FIREFLY_FABRICS.findIndex((f) => f.id === 'ff-polyester');
    if (idx !== -1) return idx;
  }
  if (q.includes('plain') || q.includes('stripes') || q.includes('seersucker')) {
    const idx = FIREFLY_FABRICS.findIndex((f) => f.id === 'ff-plain');
    if (idx !== -1) return idx;
  }
  if (q.includes('gemini') || q.includes('atelier')) {
    const idx = FIREFLY_FABRICS.findIndex((f) => f.id === 'ff-showcase');
    if (idx !== -1) return idx;
  }

  // 3. Substring matching
  const nameIdx = FIREFLY_FABRICS.findIndex(
    (f) => f.name.toLowerCase().includes(q) || q.includes(f.name.toLowerCase())
  );
  if (nameIdx !== -1) return nameIdx;

  return 0;
}

/**
 * Convert FireflyFabricItem to compliant Product object for enquiry
 */
export function getProductForFireflyFabric(fabric: FireflyFabricItem): Product {
  return {
    id: fabric.id,
    productCode: `CF-${fabric.id.toUpperCase()}`,
    name: fabric.name,
    category: 'fabrics',
    categoryLabel: 'FABRICS',
    subcategory: fabric.category,
    fabricWeaveType: 'PLAIN',
    width: '58" / 60"',
    gsm: fabric.weightGsm,
    weave: fabric.weave,
    description: fabric.description,
    shortDescription: fabric.description,
    fullDescription: `${fabric.description} Sourced and manufactured by Classic Fashions.`,
    images: [fabric.imageUrl],
    imageAlt: `${fabric.name} fabric specimen`,
    colours: ['Natural Ecru', 'Custom Mill Dyeing'],
    sizes: ['Sample Swatch', 'Production Bolt'],
    fabric: fabric.composition,
    price: 'Wholesale Quotation on Enquiry',
    availability: 'Sampling Available',
    active: true,
    patternType: 'woven-fabric',
    specifications: `${fabric.composition} • ${fabric.weave} • ${fabric.weightGsm}`,
    applications: ['Garment Manufacturing', 'Sampling', 'Apparel Export'],
    enquiryEnabled: true,
    isService: false,
    featured: false,
  };
}
