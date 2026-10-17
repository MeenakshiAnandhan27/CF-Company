export interface Fabric3DMaterialConfig {
  roughness: number;
  metalness: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  sheen?: number;
  sheenColor?: string;
  sheenRoughness?: number;
  baseColor: string;
  reverseColor?: string;
  drapeStiffness: number; // 0.1 (fluid silk) to 1.0 (stiff heavy canvas/denim)
  weaveType: 'plain' | 'satin' | 'linen-slub' | 'twill' | 'velvet-pile' | 'herringbone' | 'jacquard' | 'pique-knit';
  bumpScale?: number;
}

export interface FabricPackItem {
  id: string;
  name: string;
  type: string;
  composition: string;
  width: string;
  gsm: string;
  weave: string;
  sheen: string;
  desc: string;
  is4KPack: boolean;
  studioImage: string; // 3840x3840 4K Studio Image
  viewer360Image: string; // 4096x2048 4K Wide Panoramic Studio Image
  legacyImage?: string; // Fallback 50KB image for low bandwidth
  materialConfig: Fabric3DMaterialConfig;
}

/**
 * The 8 Authentic Master 4K Fabrics from CF_Company_Catalog_Fabrics_4K_Pack
 */
export const FABRIC_PACK_4K: FabricPackItem[] = [
  {
    id: '4k-organic-cotton',
    name: 'Organic Cotton',
    type: 'Combed GOTS Organic Cotton',
    composition: '100% Certified Organic Combed Cotton',
    width: '58" / 60"',
    gsm: '135 GSM',
    weave: '1/1 Balanced Plain Weave',
    sheen: 'Organic Soft Matte',
    desc: 'Pure unbleached combed organic cotton with authentic natural slub flecks, breathable open-pore matrix, and gentle tactile hand feel.',
    is4KPack: true,
    studioImage: '/assets/fabric-pack-4k/studio/01_Organic_Cotton_4K.jpg',
    viewer360Image: '/assets/fabric-pack-4k/viewer-360/01_Organic_Cotton_360_View_4K.jpg',
    legacyImage: '/assets/materials/fabrics/cotton.jpg',
    materialConfig: {
      baseColor: '#EDE6DA',
      reverseColor: '#E8E1D4',
      roughness: 0.82,
      metalness: 0.0,
      sheen: 0.15,
      sheenColor: '#FFFDF9',
      drapeStiffness: 0.38,
      weaveType: 'plain',
      bumpScale: 0.04,
    },
  },
  {
    id: '4k-emerald-silk-satin',
    name: 'Emerald Mulberry Silk Satin',
    type: 'Haute-Couture Mulberry Satin',
    composition: '100% Pure Mulberry Silk (Grade 6A)',
    width: '54" / 56"',
    gsm: '85 GSM (19 Momme)',
    weave: '8-End Floating Warp Satin',
    sheen: 'Haute-Couture Liquid Luster',
    desc: 'Exquisite 19-momme pure mulberry silk woven with continuous filament yarns for an extraordinary liquid drape, fluid ripple, and deep jewel-tone refraction.',
    is4KPack: true,
    studioImage: '/assets/fabric-pack-4k/studio/02_Emerald_Mulberry_Silk_Satin_4K.jpg',
    viewer360Image: '/assets/fabric-pack-4k/viewer-360/02_Emerald_Mulberry_Silk_Satin_360_View_4K.jpg',
    legacyImage: '/assets/materials/fabrics/satin-polyester.jpg',
    materialConfig: {
      baseColor: '#0A3B29',
      reverseColor: '#072E20',
      roughness: 0.16,
      metalness: 0.08,
      clearcoat: 0.65,
      clearcoatRoughness: 0.12,
      sheen: 0.95,
      sheenColor: '#36E08A',
      sheenRoughness: 0.22,
      drapeStiffness: 0.15, // Ultra-fluid, deep catenary ripples
      weaveType: 'satin',
      bumpScale: 0.02,
    },
  },
  {
    id: '4k-natural-belgian-linen',
    name: 'Natural Belgian Linen',
    type: 'Artisanal Slub Flax',
    composition: '100% Certified European Flax',
    width: '55" / 58"',
    gsm: '190 GSM',
    weave: 'Organic Flax Slub Weave',
    sheen: 'Dry Crisp Tactile Matte',
    desc: 'Premium European long-staple flax linen displaying natural irregular yarn slubs, exceptional thermal breathability, and structural artisanal drape.',
    is4KPack: true,
    studioImage: '/assets/fabric-pack-4k/studio/03_Natural_Belgian_Linen_4K.jpg',
    viewer360Image: '/assets/fabric-pack-4k/viewer-360/03_Natural_Belgian_Linen_360_View_4K.jpg',
    legacyImage: '/assets/materials/fabrics/linen.jpg',
    materialConfig: {
      baseColor: '#C4B49E',
      reverseColor: '#BDB09A',
      roughness: 0.88,
      metalness: 0.0,
      sheen: 0.08,
      sheenColor: '#E6DDD0',
      drapeStiffness: 0.58, // Crisp, structural folds
      weaveType: 'linen-slub',
      bumpScale: 0.07,
    },
  },
  {
    id: '4k-deep-indigo-denim',
    name: 'Deep Indigo Twill Denim',
    type: 'Raw Selvedge Twill Denim',
    composition: '100% Ring-Spun Long-Staple Cotton',
    width: '31" / 32" (Selvedge)',
    gsm: '440 GSM (13.75 oz)',
    weave: '3/1 Right-Hand Diagonal Twill',
    sheen: 'Deep Indigo Warp / Ecru Weft',
    desc: 'Heavyweight rope-dyed authentic indigo 3/1 right-hand twill featuring distinct 45-degree diagonal ridges and contrasting natural ecru weft on the reverse face.',
    is4KPack: true,
    studioImage: '/assets/fabric-pack-4k/studio/04_Deep_Indigo_Twill_Denim_4K.jpg',
    viewer360Image: '/assets/fabric-pack-4k/viewer-360/04_Deep_Indigo_Twill_Denim_360_View_4K.jpg',
    legacyImage: '/assets/materials/fabrics/denim.jpg',
    materialConfig: {
      baseColor: '#1A2944',
      reverseColor: '#DBD7CB', // Authentic contrasting ecru weft back!
      roughness: 0.65,
      metalness: 0.02,
      sheen: 0.3,
      sheenColor: '#3A527A',
      drapeStiffness: 0.88, // Stiff, broad structural folds
      weaveType: 'twill',
      bumpScale: 0.08,
    },
  },
  {
    id: '4k-royal-burgundy-velvet',
    name: 'Royal Burgundy Plush Velvet',
    type: 'Deep Cut-Pile Velvet',
    composition: 'Cotton Pile on Woven Ground',
    width: '54" / 56"',
    gsm: '340 GSM',
    weave: 'Woven Dense Cut-Pile Velvet',
    sheen: 'Deep Chiaroscuro Retroreflection',
    desc: 'Dense sheared upright cut-pile velvet that captures light with deep chiaroscuro highlights across every fold, casting rich shadows in crevices.',
    is4KPack: true,
    studioImage: '/assets/fabric-pack-4k/studio/05_Royal_Burgundy_Plush_Velvet_4K.jpg',
    viewer360Image: '/assets/fabric-pack-4k/viewer-360/05_Royal_Burgundy_Plush_Velvet_360_View_4K.jpg',
    legacyImage: '/assets/materials/fabrics/velvet.jpg',
    materialConfig: {
      baseColor: '#450914',
      reverseColor: '#2B050B',
      roughness: 0.86,
      metalness: 0.0,
      sheen: 1.0,
      sheenColor: '#BA304E', // Characteristic velvet grazing sheen
      sheenRoughness: 0.35,
      drapeStiffness: 0.46, // Plush, deep rounded rolls
      weaveType: 'velvet-pile',
      bumpScale: 0.05,
    },
  },
  {
    id: '4k-charcoal-merino-wool',
    name: 'Charcoal Herringbone Merino Wool',
    type: 'Tailoring Suiting Herringbone',
    composition: '100% Super 130s Australian Merino Wool',
    width: '58" / 60"',
    gsm: '270 GSM',
    weave: 'Chevron Herringbone Broken Twill',
    sheen: 'Muted Architectural Suiting Luster',
    desc: 'Fine worsted Super 130s merino wool woven in a signature charcoal chevron herringbone geometry with crisp recovery and subtle tailoring sheen.',
    is4KPack: true,
    studioImage: '/assets/fabric-pack-4k/studio/06_Charcoal_Herringbone_Merino_Wool_4K.jpg',
    viewer360Image: '/assets/fabric-pack-4k/viewer-360/06_Charcoal_Herringbone_Merino_Wool_360_View_4K.jpg',
    legacyImage: '/assets/materials/fabrics/plain.jpg',
    materialConfig: {
      baseColor: '#26292D',
      reverseColor: '#202226',
      roughness: 0.78,
      metalness: 0.04,
      sheen: 0.32,
      sheenColor: '#6B717B',
      drapeStiffness: 0.62, // Tailoring suit drape
      weaveType: 'herringbone',
      bumpScale: 0.06,
    },
  },
  {
    id: '4k-gold-ivory-jacquard',
    name: 'Gold Ivory Jacquard Brocade',
    type: 'Heritage Metallic Damask Brocade',
    composition: 'Silk & Metallic Lurex Blend',
    width: '54" / 56"',
    gsm: '240 GSM',
    weave: 'Multi-Weft Figured Jacquard',
    sheen: 'Burnished Gold Metallic Relief',
    desc: 'Elaborate baroque floral motifs raised above a warm ivory satin ground with dual-tone metallic gold threads catching grazing atelier light.',
    is4KPack: true,
    studioImage: '/assets/fabric-pack-4k/studio/07_Gold_Ivory_Jacquard_Brocade_4K.jpg',
    viewer360Image: '/assets/fabric-pack-4k/viewer-360/07_Gold_Ivory_Jacquard_Brocade_360_View_4K.jpg',
    legacyImage: '/assets/materials/fabrics/jacquard-tapestry.jpg',
    materialConfig: {
      baseColor: '#DFCFA8',
      reverseColor: '#C4B591',
      roughness: 0.38,
      metalness: 0.36,
      clearcoat: 0.42,
      sheen: 0.75,
      sheenColor: '#F5DC88',
      drapeStiffness: 0.68,
      weaveType: 'jacquard',
      bumpScale: 0.09,
    },
  },
  {
    id: '4k-navy-cotton-pique',
    name: 'Navy Blue Cotton Pique Knit',
    type: 'Double-Jersey Honeycomb Pique',
    composition: '95% Combed Cotton, 5% Elastane',
    width: '68" / 70" (Tubular Open)',
    gsm: '220 GSM',
    weave: 'Waffle Honeycomb Pique Knit',
    sheen: 'Subtle Sport-Luxury Matte',
    desc: 'Textured double-knit pique featuring distinct raised waffle geometric cells that elevate fabric off skin for superior airflow and polo resilience.',
    is4KPack: true,
    studioImage: '/assets/fabric-pack-4k/studio/08_Navy_Blue_Cotton_Pique_Knit_4K.jpg',
    viewer360Image: '/assets/fabric-pack-4k/viewer-360/08_Navy_Blue_Cotton_Pique_Knit_360_View_4K.jpg',
    legacyImage: '/assets/materials/fabrics/knits.jpg',
    materialConfig: {
      baseColor: '#121C2D',
      reverseColor: '#0E1724',
      roughness: 0.75,
      metalness: 0.0,
      sheen: 0.22,
      sheenColor: '#30456B',
      drapeStiffness: 0.42,
      weaveType: 'pique-knit',
      bumpScale: 0.08,
    },
  },
];

/**
 * Complete Catalogue for Backwards-Compatibility with any DiscoveryMaterial passed from pages
 */
export const ALL_VIEWER_FABRICS: FabricPackItem[] = [
  ...FABRIC_PACK_4K,
  // Retain legacy fabrics with mapped material configs
  {
    id: 'mat-seersucker',
    name: 'Seersucker',
    type: 'Puckered Crinkle',
    composition: '100% Combed Cotton',
    width: '54" / 58"',
    gsm: '125 GSM',
    weave: 'Slack-Tension Puckered',
    sheen: 'Matte Soft Crinkle',
    desc: 'Slack-tension alternating warp threads form natural crinkles that lift the fabric away from skin, facilitating air circulation.',
    is4KPack: false,
    studioImage: '/assets/materials/fabrics/seersucker.jpg',
    viewer360Image: '/assets/materials/fabrics/seersucker.jpg',
    materialConfig: {
      baseColor: '#E2E8F0',
      roughness: 0.8,
      metalness: 0.0,
      sheen: 0.1,
      drapeStiffness: 0.4,
      weaveType: 'plain',
    },
  },
  {
    id: 'mat-plain',
    name: 'Plain',
    type: 'Woven Cotton Gada',
    composition: '100% Combed Cotton',
    width: '48" – 63"',
    gsm: '115 GSM',
    weave: '1/1 Balanced Plain Weave',
    sheen: 'Natural Matte',
    desc: 'Balanced 1/1 weave structure delivering uniform surface strength for shirting, pocket bags, and base garments.',
    is4KPack: false,
    studioImage: '/assets/materials/fabrics/plain.jpg',
    viewer360Image: '/assets/materials/fabrics/plain.jpg',
    materialConfig: {
      baseColor: '#EDE4D8',
      roughness: 0.8,
      metalness: 0.0,
      sheen: 0.1,
      drapeStiffness: 0.35,
      weaveType: 'plain',
    },
  },
  {
    id: 'mat-chambray',
    name: 'Chambray',
    type: 'Lightweight Denim Weave',
    composition: '100% Combed Cotton',
    width: '54" / 58"',
    gsm: '135 GSM',
    weave: '1/1 Yarn-Dyed Plain',
    sheen: 'Heathered Soft Wash',
    desc: 'Lightweight plain-weave combining colored indigo warp with clean white weft yarns for relaxed casual shirting.',
    is4KPack: false,
    studioImage: '/assets/materials/fabrics/chambray.jpg',
    viewer360Image: '/assets/materials/fabrics/chambray.jpg',
    materialConfig: {
      baseColor: '#4A6B8A',
      roughness: 0.72,
      metalness: 0.0,
      sheen: 0.2,
      drapeStiffness: 0.4,
      weaveType: 'plain',
    },
  },
  {
    id: 'mat-checked',
    name: 'Checked',
    type: 'Buffalo Plaid Weave',
    composition: '100% Cotton Twill',
    width: '54" / 58"',
    gsm: '165 GSM',
    weave: 'Balanced Checked Twill',
    sheen: 'Rich Matte Texture',
    desc: 'Classic red, black, and white buffalo check weave with rich color saturation and balanced warp-weft intersection.',
    is4KPack: false,
    studioImage: '/assets/materials/fabrics/checked.jpg',
    viewer360Image: '/assets/materials/fabrics/checked.jpg',
    materialConfig: {
      baseColor: '#7A1C20',
      roughness: 0.75,
      metalness: 0.0,
      sheen: 0.15,
      drapeStiffness: 0.5,
      weaveType: 'twill',
    },
  },
];
