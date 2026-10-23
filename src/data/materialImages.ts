/**
 * RAW MATERIAL IMAGERY CONFIGURATION — CLASSIC FASHIONS
 *
 * Rules:
 * - RAW MATERIAL / MATERIAL CLOSE-UP only
 * - Shows the actual physical material (rolls, swatches, textures, physical trims)
 * - NO finished garments, NO models, NO fashion photoshoots, NO factories
 *
 * High-resolution 1024x1024 photographs sourced from "Home page Fab.zip":
 * 1.jpg  -> fabrics.jpg (FABRICS)
 * 2.jpg  -> laces.jpg (LACES)
 * 3.jpg  -> denim.jpg (DENIM)
 * 4.jpg  -> mesh.jpg (MESH)
 * 5.jpg  -> lycra-mesh.jpg (LYCRA / LYCRA MESH)
 * 6.jpg  -> tapes.jpg (TAPES)
 * 7.jpg  -> zippers.jpg (ZIPPERS)
 * 8.jpg  -> buttons.jpg (BUTTONS)
 * 9.jpg  -> brand-tags.jpg (BRAND TAGS)
 * 10.jpg -> garment-accessories.jpg (GARMENT ACCESSORIES)
 */

export interface RawMaterialImageEntry {
  category: string;
  label: string;
  rawMaterialType: string;
  imagePath: string;
  altText: string;
  objectPosition?: string;
  description: string;
}

export const RAW_MATERIAL_IMAGES: Record<string, RawMaterialImageEntry> = {
  laces: {
    category: 'laces',
    label: 'Garment Laces',
    rawMaterialType: 'Raw lace strip & embroidery needlework texture',
    imagePath: '/assets/materials/homepage/laces.jpg',
    altText: 'Close-up macro of raw cotton lace material and embroidery needlework',
    objectPosition: 'center',
    description: 'Actual raw embroidery lace and cotton lace trim texture',
  },
  fabrics: {
    category: 'fabrics',
    label: 'Fabrics & Base Textiles',
    rawMaterialType: 'Folded raw woven fabric & textile rolls',
    imagePath: '/assets/materials/homepage/fabrics.jpg',
    altText: 'Raw folded cotton twill and woven fabric rolls showing textile weave structure',
    objectPosition: 'center',
    description: 'Folded raw fabric bolts with visible thread structure',
  },
  denim: {
    category: 'denim',
    label: 'Denim Textiles',
    rawMaterialType: 'Raw indigo denim fabric with diagonal twill weave',
    imagePath: '/assets/materials/homepage/denim.jpg',
    altText: 'Close-up texture of raw denim textile weave with visible twill cotton threads',
    objectPosition: 'center',
    description: 'Pure raw denim fabric showing authentic twill weave structure',
  },
  mesh: {
    category: 'mesh',
    label: 'Mesh & Knit Structure',
    rawMaterialType: 'Raw breathable athletic mesh fabric',
    imagePath: '/assets/materials/homepage/mesh.jpg',
    altText: 'Close-up showing the open-pore structure of raw athletic mesh fabric',
    objectPosition: 'center',
    description: 'Raw mesh textile highlighting cell structure and porosity',
  },
  'lycra-mesh': {
    category: 'lycra-mesh',
    label: 'Lycra / Lycra Mesh',
    rawMaterialType: 'High elasticity 4-way stretch power mesh',
    imagePath: '/assets/materials/homepage/lycra-mesh.jpg',
    altText: 'Close-up of elastic 4-way stretch power lycra mesh fabric',
    objectPosition: 'center',
    description: 'High recovery stretch lycra power mesh textile',
  },
  accessories: {
    category: 'accessories',
    label: 'Garment Accessories',
    rawMaterialType: 'Raw loose garment buttons, twill tapes & woven brand tags',
    imagePath: '/assets/materials/homepage/garment-accessories.jpg',
    altText: 'Collection of physical garment accessories: loose buttons, twill tape, and brand tags',
    objectPosition: 'center',
    description: 'Physical apparel accessories, loose buttons, and raw trims',
  },
  processing: {
    category: 'processing',
    label: 'Fabric Edge Finishing & Slitting',
    rawMaterialType: 'Raw slit fabric rolls and precision cut edge tape reels',
    imagePath: '/assets/materials/processing.jpg',
    altText: 'Raw slit fabric tape rolls and edge finishing reels on neutral surface',
    objectPosition: 'center',
    description: 'Precision slit fabric rolls and edge-finished ribbon tape',
  },
  // Sub-material specific raw imagery (for quick access & specialized views)
  buttons: {
    category: 'accessories',
    label: 'Garment Buttons',
    rawMaterialType: 'Loose garment buttons collection',
    imagePath: '/assets/materials/homepage/buttons.jpg',
    altText: 'Collection of loose natural and apparel buttons',
    objectPosition: 'center',
    description: 'Physical loose buttons for garment manufacturing',
  },
  tapes: {
    category: 'accessories',
    label: 'Garment Tapes & Ribbons',
    rawMaterialType: 'Rolls of woven cotton twill tape',
    imagePath: '/assets/materials/homepage/tapes.jpg',
    altText: 'Rolls of physical garment twill tape and woven ribbon reels',
    objectPosition: 'center',
    description: 'Raw rolls of garment tape and edge binding ribbon',
  },
  tags: {
    category: 'accessories',
    label: 'Garment Tags & Labels',
    rawMaterialType: 'Stack of physical brand tags and woven labels',
    imagePath: '/assets/materials/homepage/brand-tags.jpg',
    altText: 'Physical stack of garment hang tags and woven brand labels',
    objectPosition: 'center',
    description: 'Physical garment tags and apparel identification trims',
  },
  zippers: {
    category: 'accessories',
    label: 'Garment Zippers & Fasteners',
    rawMaterialType: 'Continuous zipper coils, brass teeth & loose sliders',
    imagePath: '/assets/materials/homepage/zippers.jpg',
    altText: 'Close-up of raw zipper components, brass teeth, and continuous zipper tape',
    objectPosition: 'center 40%',
    description: 'Raw zipper reels, metallic teeth, and apparel sliders',
  },
};
