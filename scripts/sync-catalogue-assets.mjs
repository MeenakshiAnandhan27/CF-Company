/**
 * sync-catalogue-assets.mjs
 * 
 * Scans D:/CF/fabric-images and D:/CF/fabric-images2,
 * synchronizes image assets to public/assets/catalogue-3d and public/assets/firefly-fabrics,
 * extracts image dimensions and formats,
 * classifies items into Fabrics, Buttons, and Accessories,
 * and generates src/data/catalogue3DData.ts and public/assets/catalogue-3d/manifest.json.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const SOURCE_DIRS = [
  { path: 'D:/CF/fabric-images3', defaultCategory: 'fabric' },
  { path: 'D:/CF/fabric-images', defaultCategory: 'fabric' },
  { path: 'D:/CF/fabric-images2', defaultCategory: 'detect' },
];

const TARGET_DIR_CATALOGUE = path.join(projectRoot, 'public', 'assets', 'catalogue-3d');
const TARGET_DIR_FIREFLY = path.join(projectRoot, 'public', 'assets', 'firefly-fabrics');
const DATA_OUTPUT_PATH = path.join(projectRoot, 'src', 'data', 'catalogue3DData.ts');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getImageDimensions(filePath) {
  try {
    const buf = fs.readFileSync(filePath);
    // PNG
    if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), format: 'PNG' };
    }
    // JPEG
    if (buf[0] === 0xff && buf[1] === 0xd8) {
      let offset = 2;
      while (offset < buf.length) {
        if (buf[offset] !== 0xff) break;
        const marker = buf[offset + 1];
        if (marker === 0xc0 || marker === 0xc2) {
          return {
            height: buf.readUInt16BE(offset + 5),
            width: buf.readUInt16BE(offset + 7),
            format: 'JPEG',
          };
        }
        const len = buf.readUInt16BE(offset + 2);
        offset += 2 + len;
      }
    }
    // WebP
    if (
      buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
      buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
    ) {
      // VP8 VP8L VP8X
      return { width: 1024, height: 1024, format: 'WEBP' };
    }
  } catch (err) {
    console.error(`Error reading dimensions for ${filePath}:`, err.message);
  }
  return { width: 1024, height: 1024, format: 'UNKNOWN' };
}

// Detect category from filename
function classifyItem(filename) {
  const lower = filename.toLowerCase();
  if (lower.includes('button') || lower.includes('buttton') || lower.includes('snap')) {
    return 'button';
  }
  if (
    lower.includes('lace') ||
    lower.includes('implace') ||
    lower.includes('tipping') ||
    lower.includes('zip') ||
    lower.includes('ricrac')
  ) {
    return 'accessory';
  }
  return 'fabric';
}

// Curated specs and PBR properties for each product
const METADATA_DICTIONARY = {
  // --- BUTTONS ---
  'glass button.jpg': {
    name: 'Faceted Crystal Glass Button',
    category: 'button',
    subcategory: 'Glass & Crystal',
    buttonType: 'glass',
    holeCount: 4,
    shank: false,
    composition: 'Borosilicate Optical Glass',
    dimensions: '20 mm / 32 Lignes',
    finish: 'Flame-Polished Faceted Rim',
    roughness: 0.12,
    metalness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    transmission: 0.75,
    description: 'High-clarity optical glass button with diamond-faceted bevel edge and 4-hole central stitch dish for eveningwear and couture tailoring.',
  },
  'metal buttton.jpg': {
    name: 'Antique Gilded Metal Blazer Button',
    category: 'button',
    subcategory: 'Metal Hardware',
    buttonType: 'metal',
    holeCount: 0,
    shank: true,
    composition: 'Die-Cast Solid Brass / Antique Gold Plating',
    dimensions: '23 mm / 36 Lignes',
    finish: 'Burnished Satin Gold with Oxidized Relief',
    roughness: 0.28,
    metalness: 0.95,
    clearcoat: 0.35,
    clearcoatRoughness: 0.15,
    description: 'Heavyweight cast metal blazer button featuring a raised regal crest, knurled perimeter rim, and solid reverse shank loop.',
  },
  'pearl button.jpg': {
    name: 'Australian Mother of Pearl Button',
    category: 'button',
    subcategory: 'Natural Shell',
    buttonType: 'pearl',
    holeCount: 4,
    shank: false,
    composition: '100% Natural Pinctada Maxima Shell',
    dimensions: '18 mm / 28 Lignes',
    finish: 'Directional Nacre Iridescent Luster',
    roughness: 0.22,
    metalness: 0.0,
    sheen: 0.85,
    sheenColor: '#FFEFE5',
    clearcoat: 0.75,
    clearcoatRoughness: 0.1,
    description: 'Authentic South Sea mother-of-pearl shirt button with organic iridescent color shifting, hand-dished center, and laser-drilled 4-hole grid.',
  },
  'plastic button.jpg': {
    name: 'Formulated Urea Resin Button',
    category: 'button',
    subcategory: 'Resin & Polymer',
    buttonType: 'plastic',
    holeCount: 4,
    shank: false,
    composition: 'Thermoset Urea-Formaldehyde Resin',
    dimensions: '20 mm / 32 Lignes',
    finish: 'Semi-Matte Molded Bevel Edge',
    roughness: 0.38,
    metalness: 0.0,
    clearcoat: 0.4,
    clearcoatRoughness: 0.2,
    description: 'Durable, heat-resistant thermoset resin button engineered for industrial garment laundering, dry-cleaning resilience, and uniform stitch pull.',
  },
  'shell button.jpg': {
    name: 'Trochus River Shell Button',
    category: 'button',
    subcategory: 'Natural Shell',
    buttonType: 'shell',
    holeCount: 4,
    shank: false,
    composition: '100% Trochus Niloticus Spiral Shell',
    dimensions: '15 mm / 24 Lignes',
    finish: 'Natural Organic Shell Luster',
    roughness: 0.25,
    metalness: 0.0,
    sheen: 0.7,
    sheenColor: '#FDF8F0',
    clearcoat: 0.6,
    clearcoatRoughness: 0.12,
    description: 'Precision turned natural trochus shell button with natural spiral back markings, beveled lip, and deep thread channel.',
  },
  'snap button.jpg': {
    name: 'Precision Metal Snap Fastener',
    category: 'button',
    subcategory: 'Metal Hardware',
    buttonType: 'snap',
    holeCount: 0,
    shank: false,
    composition: 'Spring-Temper Nickel-Plated Brass',
    dimensions: '14 mm Socket & Stud',
    finish: 'Polished Mirror Nickel Chrome',
    roughness: 0.2,
    metalness: 0.92,
    clearcoat: 0.5,
    clearcoatRoughness: 0.1,
    description: 'Four-part mechanical press snap fastener with heavy-duty retention spring for active outerwear, denim jackets, and leather goods.',
  },
  'wooden button.jpg': {
    name: 'Turned Natural Olivewood Button',
    category: 'button',
    subcategory: 'Natural Wood',
    buttonType: 'wood',
    holeCount: 4,
    shank: false,
    composition: 'Sustainably Harvested Seasoned Olive Hardwood',
    dimensions: '22 mm / 34 Lignes',
    finish: 'Natural Beeswax Matte Oil Finish',
    roughness: 0.75,
    metalness: 0.0,
    sheen: 0.2,
    sheenColor: '#D8B888',
    description: 'Artisanal lathe-turned solid hardwood button showcasing concentric radial growth rings, chamfered rim, and silky hand-oiled finish.',
  },

  // --- ACCESSORIES & TRIMS ---
  'cotton lace.jpg': {
    name: 'Heritage Cotton Bobbin Lace Trim',
    category: 'accessory',
    subcategory: 'Laces & Trims',
    accessoryType: 'lace',
    composition: '100% Carded Long-Staple Cotton',
    dimensions: '45 mm Width x Continuous Roll',
    finish: 'Natural Ecru Openwork Bobbin Guipure',
    roughness: 0.88,
    metalness: 0.0,
    sheen: 0.1,
    description: 'Intricate floral openwork lace ribbon with delicate picot loops, crafted on high-speed bobbin looms for bridal wear and heirloom garment borders.',
  },
  'emb lace.jpg': {
    name: 'Corded Scalloped Embroidery Lace',
    category: 'accessory',
    subcategory: 'Laces & Trims',
    accessoryType: 'lace',
    composition: 'Polyester Sheer Tulle with Rayon Cordonnet Thread',
    dimensions: '60 mm Width x Continuous Roll',
    finish: 'Raised Cordonnet Outline on Micro-Tulle',
    roughness: 0.7,
    metalness: 0.05,
    sheen: 0.4,
    sheenColor: '#FFF8F0',
    description: 'Architectural embroidered lace trim featuring heavy rayon cordonnet outlines over sheer hex-mesh ground, terminating in graceful scalloped edges.',
  },
  'implace.jpg': {
    name: 'Structural Insertion Guipure Lace',
    category: 'accessory',
    subcategory: 'Laces & Trims',
    accessoryType: 'lace',
    composition: '100% Mercerized Cotton Thread',
    dimensions: '35 mm Insertion Band',
    finish: 'Stiffened Chemical Guipure Open Lace',
    roughness: 0.82,
    metalness: 0.0,
    sheen: 0.2,
    description: 'Heavy chemical insertion lace band designed for inset panel seaming between garment cuts, blouse sleeves, and tailored linen shirts.',
  },
  'lycra lace.jpg': {
    name: 'Stretch Lycra Galloon Lace',
    category: 'accessory',
    subcategory: 'Laces & Trims',
    accessoryType: 'lace',
    composition: '85% Polyamide / 15% Lycra Spandex',
    dimensions: '50 mm Elastic Stretch Band',
    finish: 'Dual Scalloped Edge with High Recovery Elongation',
    roughness: 0.65,
    metalness: 0.0,
    sheen: 0.35,
    description: 'Supple bidirectional stretch lace band with elastomeric recovery, engineered for lingerie, athleisure accents, and flexible edge binding.',
  },
  'metal tipping.jpg': {
    name: 'Engraved Metal Cord Aglet / Tipping',
    category: 'accessory',
    subcategory: 'Hardware & Ends',
    accessoryType: 'tipping',
    composition: 'Precision Machined Solid Brass',
    dimensions: '22 mm Length x 4.5 mm Internal Diameter',
    finish: 'Brushed Gunmetal PVD Coat',
    roughness: 0.22,
    metalness: 0.95,
    clearcoat: 0.6,
    description: 'Cylindrical metal drawcord aglet with knurled crimping grip, preventing cord fraying while adding luxury weight to hood and waist drawstrings.',
  },
  'metal zip.jpg': {
    name: '#5 Antique Brass Metal Tooth Zipper',
    category: 'accessory',
    subcategory: 'Fasteners & Zips',
    accessoryType: 'zipper',
    composition: 'Stamping Brass Teeth on Heavy Polyester Herringbone Tape',
    dimensions: '#5 Gauge Teeth / Custom Length',
    finish: 'Antique Burnished Brass Teeth with Auto-Lock Puller',
    roughness: 0.28,
    metalness: 0.92,
    description: 'Heavy-gauge individual brass teeth crimped onto high-tensile woven tape, ideal for leather outerwear, raw denim jeans, and structured workwear.',
  },
  'plastic tipping.jpg': {
    name: 'Matte Silicone-Dipped Cord Tipping',
    category: 'accessory',
    subcategory: 'Hardware & Ends',
    accessoryType: 'tipping',
    composition: 'Soft-Touch Matte Polyurethane / Silicone',
    dimensions: '20 mm Length x 4.0 mm Inner Caliber',
    finish: 'Velvety Matte Soft-Touch Coating',
    roughness: 0.5,
    metalness: 0.0,
    description: 'Modern minimalist soft-touch silicone cord ends for technical sportswear, waterproof parka cords, and contemporary urban streetwear.',
  },
  'ricrac lace.jpg': {
    name: 'Woven Cotton Ric-Rac Braid',
    category: 'accessory',
    subcategory: 'Braids & Trims',
    accessoryType: 'braid',
    composition: '100% Ring-Spun Cotton Yarn',
    dimensions: '12 mm Wave Amplitude',
    finish: 'Zig-Zag Serpentine Balanced Braid',
    roughness: 0.85,
    metalness: 0.0,
    sheen: 0.15,
    description: 'Classic serpentine zig-zag decorative trim braid, tightly braided to maintain crisp sinusoidal wave symmetry along hemlines and collar margins.',
  },
  'visllon zip.jpg': {
    name: '#8 Vislon Molded Delrin Zipper',
    category: 'accessory',
    subcategory: 'Fasteners & Zips',
    accessoryType: 'zipper',
    composition: 'Molded Polyacetal (Delrin) Plastic Teeth',
    dimensions: '#8 Gauge Heavy Chunky Teeth',
    finish: 'Semi-Gloss Molded Teeth with Ergonomic Puller',
    roughness: 0.35,
    metalness: 0.05,
    clearcoat: 0.3,
    description: 'Chunky injection-molded plastic zipper offering ultra-smooth slide action, zero salt-corrosion, and maximum durability for marine and winter parkas.',
  },

  // --- NEW FABRICS FROM FOLDER 2 ---
  'chambray.jpg': {
    name: 'Indigo Chambray Plain Weave',
    category: 'fabric',
    subcategory: 'Natural Fibers',
    composition: '100% Combed Cotton (Indigo Warp x Bleached Weft)',
    weave: '1/1 Balanced Plain Weave',
    weightGsm: '135 GSM',
    drapeStiffness: 0.32,
    roughness: 0.78,
    metalness: 0.0,
    sheen: 0.15,
    sheenColor: '#E6EFF8',
    description: 'Classic lightweight shirting fabric woven with authentic indigo-dyed warp threads and natural ecru fill yarn, offering a frosted heathered visual depth.',
  },
  'chiffon.png': {
    name: 'Silk Georgette Chiffon',
    category: 'fabric',
    subcategory: 'Synthetics & Sheers',
    composition: '100% Micro-Filament Polyester Chiffon',
    weave: 'High-Twist Alternating S/Z Crepe Weave',
    weightGsm: '65 GSM',
    drapeStiffness: 0.15,
    roughness: 0.6,
    metalness: 0.0,
    sheen: 0.4,
    sheenColor: '#F5ECDF',
    description: 'Ethereal, semi-transparent sheer crepe with ultra-supple liquid drape, subtle pebble surface texture, and floating airborne movement.',
  },
  'denim.jpg': {
    name: 'Heavyweight Indigo Ring Denim',
    category: 'fabric',
    subcategory: 'Natural Fibers',
    composition: '100% Ring-Spun Long-Staple Cotton',
    weave: '3/1 Right-Hand Warp-Faced Twill',
    weightGsm: '420 GSM (14.5 oz)',
    drapeStiffness: 0.88,
    roughness: 0.92,
    metalness: 0.0,
    sheen: 0.1,
    sheenColor: '#284160',
    description: 'Sturdy 14.5 oz selvage-grade denim with prominent 63-degree steep twill diagonals, natural ring-spinning slubs, and rigid structural drape.',
  },
  'duck.jpg': {
    name: 'Plied-Yarn Army Duck Canvas',
    category: 'fabric',
    subcategory: 'Natural Fibers',
    composition: '100% Heavy Plied Cotton Yarn',
    weave: 'Tight Plain Weave Duck #10',
    weightGsm: '410 GSM',
    drapeStiffness: 0.9,
    roughness: 0.94,
    metalness: 0.0,
    sheen: 0.05,
    description: 'Extremely dense, wind-resistant double-fill plied cotton duck canvas, formulated for workwear jackets, heritage tote bags, and rugged upholstery.',
  },
  'gada.jpg': {
    name: 'Bleached Calico / Fine Gada',
    category: 'fabric',
    subcategory: 'Natural Fibers',
    composition: '100% Pure Indian Cotton Sheeting',
    weave: 'Medium-Count Plain Weave',
    weightGsm: '155 GSM',
    drapeStiffness: 0.38,
    roughness: 0.82,
    metalness: 0.0,
    sheen: 0.12,
    sheenColor: '#FFFDF5',
    description: 'Smooth, breathable pure cotton sheeting cloth with clean balanced yarns, widely utilized for master pattern sampling, toiles, and summer shirting.',
  },
  'satin.png': {
    name: 'Duchess Bridal Luster Satin',
    category: 'fabric',
    subcategory: 'Blends & Luxury',
    composition: 'Poly-Silk High-Density Filament Blend',
    weave: '8-End Warp-Faced Sateen / Satin Float',
    weightGsm: '220 GSM',
    drapeStiffness: 0.28,
    roughness: 0.25,
    metalness: 0.05,
    sheen: 0.85,
    sheenColor: '#FFFFFF',
    clearcoat: 0.45,
    clearcoatRoughness: 0.15,
    description: 'High-sheen duchess satin woven with continuous micro-filaments, presenting brilliant directional specular highlights and sumptuous cascading fluid folds.',
  },
  'seersucker.jpg': {
    name: 'Puckered Crinkle Seersucker',
    category: 'fabric',
    subcategory: 'Natural Fibers',
    composition: '100% Combed Yarn-Dyed Cotton',
    weave: 'Slack-Tension Woven Alternating Crinkle Weave',
    weightGsm: '130 GSM',
    drapeStiffness: 0.35,
    roughness: 0.88,
    metalness: 0.0,
    sheen: 0.15,
    description: 'Slack-tension woven textile featuring natural thermal air channels formed by alternating flat and crinkled vertical stripes, eliminating the need for ironing.',
  },
  'stripes.jpg': {
    name: 'Fine Bengal Striped Poplin',
    category: 'fabric',
    subcategory: 'Natural Fibers',
    composition: '100% Giza Long-Staple Cotton',
    weave: '2/1 Fine Compact Weft Ribbed Poplin',
    weightGsm: '120 GSM',
    drapeStiffness: 0.32,
    roughness: 0.72,
    metalness: 0.0,
    sheen: 0.22,
    sheenColor: '#EBF4FC',
    description: 'Crisp Italian-style poplin shirting fabric with razor-sharp yarn-dyed vertical stripes, silky smooth hand-feel, and structured drape.',
  },
  'taffeta.png': {
    name: 'High-Luster Crisp Taffeta',
    category: 'fabric',
    subcategory: 'Synthetics & Sheers',
    composition: '100% High-Tenacity Polyester Taffeta',
    weave: 'High-Count 190T Plain Weave',
    weightGsm: '95 GSM',
    drapeStiffness: 0.52,
    roughness: 0.35,
    metalness: 0.05,
    sheen: 0.65,
    sheenColor: '#F8EEFF',
    clearcoat: 0.3,
    description: 'Crisp, smooth woven fabric with a signature whisper hand, lustrous two-tone light interplay, and defined structural pleats.',
  },
  'twill.jpg': {
    name: 'Steep Chino Cotton Twill',
    category: 'fabric',
    subcategory: 'Natural Fibers',
    composition: '100% Combed Cotton Ring-Yarn',
    weave: '2/1 Left-Hand Directional Twill',
    weightGsm: '240 GSM',
    drapeStiffness: 0.55,
    roughness: 0.8,
    metalness: 0.0,
    sheen: 0.2,
    sheenColor: '#FAF4E8',
    description: 'Durable garment-washed chino twill with prominent diagonal ribs, balanced drape rigidity, and high resistance to abrasion.',
  },

  // --- ORIGINAL 15 FABRICS FROM FOLDER 1 ---
  'canvas gada.png': {
    name: 'Canvas / Heavy Gada Fabric',
    category: 'fabric',
    subcategory: 'Natural Fibers',
    composition: '100% Unbleached Coarse Cotton Yarn',
    weave: 'Heavy Duck / Plain Basket Weave',
    weightGsm: '340 GSM',
    drapeStiffness: 0.85,
    roughness: 0.92,
    metalness: 0.0,
    sheen: 0.05,
    sheenColor: '#FFFDF9',
    description: 'Heavyweight, rugged unbleached cotton canvas with substantial structural body, firm hand-feel, and prominent yarn intersection cross-sections.',
  },
  'checked fab.png': {
    name: 'Checked Woven Fabric',
    category: 'fabric',
    subcategory: 'Natural Fibers',
    composition: '100% Yarn-Dyed Combed Cotton',
    weave: 'Longitudinal & Latitudinal Balanced Check',
    weightGsm: '145 GSM',
    drapeStiffness: 0.35,
    roughness: 0.78,
    metalness: 0.0,
    sheen: 0.18,
    sheenColor: '#F5EBDC',
    description: 'Crisp yarn-dyed balanced check woven textile with sharp color boundaries, balanced drape flexibility, and soft skin contact hand.',
  },
  'cotton mesh.png': {
    name: 'Cotton Mesh Fabric',
    category: 'fabric',
    subcategory: 'Mesh & Knits',
    composition: '100% Porous Long-Staple Cotton',
    weave: 'Open-Cell Hexagonal Eyelet Knit',
    weightGsm: '160 GSM',
    drapeStiffness: 0.28,
    roughness: 0.85,
    metalness: 0.0,
    sheen: 0.12,
    sheenColor: '#FAF7F0',
    description: 'Open breathable cellular mesh with micro-perforations engineered for maximum ventilation, light moisture dispersion, and supple elasticity.',
  },
  'cotton.png': {
    name: 'Pure Combed Cotton',
    category: 'fabric',
    subcategory: 'Natural Fibers',
    composition: '100% Ring-Spun Combed Cotton',
    weave: '1/1 Balanced Plain Weave',
    weightGsm: '140 GSM',
    drapeStiffness: 0.36,
    roughness: 0.8,
    metalness: 0.0,
    sheen: 0.15,
    sheenColor: '#FFFFFF',
    description: 'High-purity ring-spun cotton free of impurities, exhibiting a soft matte drape, gentle tactile comfort, and uniform yarn packing.',
  },
  'Firefly_Gemini Flash.png': {
    name: 'Atelier Specimen Spec',
    category: 'fabric',
    subcategory: 'Blends & Luxury',
    composition: 'Curated Textile Specimen Studio Blend',
    weave: 'Complex Multilayer Dobby Weave',
    weightGsm: '210 GSM',
    drapeStiffness: 0.42,
    roughness: 0.65,
    metalness: 0.05,
    sheen: 0.45,
    sheenColor: '#E8D5B5',
    description: 'Designer showcase specimen woven with multifaceted yarn counts, producing intricate light-refraction characteristics and graceful cascading folds.',
  },
  'flannel.png': {
    name: 'Brushed Cotton Flannel',
    category: 'fabric',
    subcategory: 'Natural Fibers',
    composition: '100% Heavy Twill Cotton (Double Napped)',
    weave: '2/2 Broken Twill with Wire Brushed Nap',
    weightGsm: '220 GSM',
    drapeStiffness: 0.48,
    roughness: 0.95,
    metalness: 0.0,
    sheen: 0.35,
    sheenColor: '#EAE1D3',
    description: 'Warm brushed surface with dense fibrous fuzz nap, retaining thermal warmth and dampening specular glare for an ultra-cozy, matte appearance.',
  },
  'fur.png': {
    name: 'Plush Faux Fur Pile',
    category: 'fabric',
    subcategory: 'Synthetics & Sheers',
    composition: '100% Acrylic / Polyester Microfiber Tufts',
    weave: 'Tufted Deep Cut-Pile Construction',
    weightGsm: '480 GSM',
    drapeStiffness: 0.62,
    roughness: 0.98,
    metalness: 0.0,
    sheen: 0.55,
    sheenColor: '#FFFDF0',
    description: 'Voluminous plush fur-effect knit with high-loft fibrous filaments catching ambient directional rim light with natural animal-hand luxury.',
  },
  'linen.png': {
    name: 'Natural Flax Linen',
    category: 'fabric',
    subcategory: 'Natural Fibers',
    composition: '100% Long-Flax European Linen',
    weave: 'Slub-Yarn Balanced Plain Weave',
    weightGsm: '185 GSM',
    drapeStiffness: 0.44,
    roughness: 0.88,
    metalness: 0.0,
    sheen: 0.22,
    sheenColor: '#ECE5D8',
    description: 'Authentic flax fiber with natural irregular thickness slubs, exceptional moisture-wicking capillary hand, and crisp architectural drape.',
  },
  'Lycra mesh fab.png': {
    name: 'Lycra Performance Mesh',
    category: 'fabric',
    subcategory: 'Mesh & Knits',
    composition: '82% Polyamide Microfiber / 18% Spandex',
    weave: 'Four-Way Stretch Tricot Powernet',
    weightGsm: '190 GSM',
    drapeStiffness: 0.22,
    roughness: 0.68,
    metalness: 0.0,
    sheen: 0.38,
    sheenColor: '#F0F8FF',
    description: 'Dynamic 4-way stretch warp-knit mesh with high tensile recovery, body contour compression, and athletic moisture management.',
  },
  'plain.png': {
    name: 'Fine Plain Weave Fabric',
    category: 'fabric',
    subcategory: 'Natural Fibers',
    composition: '100% Fine Combed Cotton 60s Count',
    weave: 'Ultra-Fine 1/1 Plain Weave',
    weightGsm: '110 GSM',
    drapeStiffness: 0.3,
    roughness: 0.72,
    metalness: 0.0,
    sheen: 0.16,
    sheenColor: '#FFFFFF',
    description: 'Featherlight plain weave cotton shirting made from 60s yarn count, delivering silky smooth skin feel and fluid drape performance.',
  },
  'poly-cotton blended fabric.png': {
    name: 'Poly-Cotton Blended Twill',
    category: 'fabric',
    subcategory: 'Blends & Luxury',
    composition: '65% Polyester / 35% Long-Staple Cotton',
    weave: '2/1 Diagonal Workwear Twill',
    weightGsm: '215 GSM',
    drapeStiffness: 0.52,
    roughness: 0.75,
    metalness: 0.0,
    sheen: 0.28,
    sheenColor: '#F2EDE4',
    description: 'Balanced synthetic-natural blend engineered for industrial workwear uniforms with wrinkle resistance, color retention, and abrasion endurance.',
  },
  'Polyster mesh fab.png': {
    name: 'Technical Polyester Sport Mesh',
    category: 'fabric',
    subcategory: 'Mesh & Knits',
    composition: '100% Moisture-Wicking Polyester',
    weave: 'Pinhole Micro-Eyelet Athletic Knit',
    weightGsm: '150 GSM',
    drapeStiffness: 0.25,
    roughness: 0.7,
    metalness: 0.0,
    sheen: 0.32,
    sheenColor: '#E6F0FA',
    description: 'Hydrophobic athletic eyelet knit moving moisture away from skin, offering supple flex, swift drying, and dimensional stability.',
  },
  'polyster.png': {
    name: 'High-Density Polyester Gabardine',
    category: 'fabric',
    subcategory: 'Synthetics & Sheers',
    composition: '100% Continuous Filament Polyester',
    weave: 'Steep Fine-Rib Gabardine Twill',
    weightGsm: '195 GSM',
    drapeStiffness: 0.46,
    roughness: 0.58,
    metalness: 0.05,
    sheen: 0.42,
    sheenColor: '#F0ECE1',
    description: 'Smooth micro-filament gabardine with soft sheen, crisp crease-retention, and liquid drape characteristics ideal for suiting and uniforms.',
  },
  'Putta Fabric.png': {
    name: 'Putta Jacquard Brocade',
    category: 'fabric',
    subcategory: 'Blends & Luxury',
    composition: 'Cotton-Viscose Blend with Lurex Highlights',
    weave: 'Complex Figured Floral Jacquard',
    weightGsm: '260 GSM',
    drapeStiffness: 0.65,
    roughness: 0.72,
    metalness: 0.12,
    sheen: 0.55,
    sheenColor: '#F5E6CC',
    description: 'Festive jacquard brocade with embossed floral medallions (putta) and metallic highlights, holding defined architectural folds.',
  },
  'velvet.png': {
    name: 'Plush Cut-Pile Velvet',
    category: 'fabric',
    subcategory: 'Blends & Luxury',
    composition: '80% Viscose Rayon / 20% Silk Ground',
    weave: 'Woven Double-Cloth Cut Warp Pile',
    weightGsm: '320 GSM',
    drapeStiffness: 0.4,
    roughness: 0.9,
    metalness: 0.0,
    sheen: 0.75,
    sheenColor: '#FFF3E0',
    description: 'Ultra-luxurious dense vertical cut pile with intense directional luster, changing luminosity with pile direction and yielding deep, rich drape folds.',
  },
};

function generateId(filename) {
  return 'cf-' + filename.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function run() {
  console.log('=== Classic Fashions Catalogue Asset Sync ===');
  ensureDir(TARGET_DIR_CATALOGUE);
  ensureDir(TARGET_DIR_FIREFLY);

  // Clean up any excluded non-fabric files (buttons, accessories, taffeta) from served public directories
  const excludedFiles = [
    'taffeta.jpg',
    'chiffon.jpg',
    'glass button.jpg',
    'metal buttton.jpg',
    'pearl button.jpg',
    'plastic button.jpg',
    'shell button.jpg',
    'snap button.jpg',
    'wooden button.jpg',
    'cotton lace.jpg',
    'emb lace.jpg',
    'implace.jpg',
    'lycra lace.jpg',
    'metal tipping.jpg',
    'metal zip.jpg',
    'plastic tipping.jpg',
    'ricrac lace.jpg',
    'visllon zip.jpg',
  ];
  for (const f of excludedFiles) {
    const p1 = path.join(TARGET_DIR_CATALOGUE, f);
    const p2 = path.join(TARGET_DIR_FIREFLY, f);
    try {
      if (fs.existsSync(p1)) fs.unlinkSync(p1);
      if (fs.existsSync(p2)) fs.unlinkSync(p2);
    } catch {
      // Ignore
    }
  }

  const discoveredItems = [];
  const seenFilenames = new Set();

  for (const src of SOURCE_DIRS) {
    if (!fs.existsSync(src.path)) {
      console.warn(`Source folder not found: ${src.path}`);
      continue;
    }

    const files = fs.readdirSync(src.path);
    console.log(`Scanning ${src.path}: ${files.length} items found.`);

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
        continue;
      }

      const detectedCategory = classifyItem(file);
      // User explicit requirement:
      // "intha fabric ah remove panniru and accessories and buttons fulla remove panniru"
      // Remove all buttons, all accessories, and taffeta.jpg
      if (detectedCategory === 'button' || detectedCategory === 'accessory') {
        continue;
      }
      if (file.toLowerCase() === 'taffeta.jpg' || file.toLowerCase() === 'chiffon.jpg') {
        continue;
      }

      const sourceFilePath = path.join(src.path, file);
      const targetCataloguePath = path.join(TARGET_DIR_CATALOGUE, file);
      const targetFireflyPath = path.join(TARGET_DIR_FIREFLY, file);

      // Copy safely to both public folders so no path ever breaks
      try {
        fs.copyFileSync(sourceFilePath, targetCataloguePath);
        fs.copyFileSync(sourceFilePath, targetFireflyPath);
      } catch (err) {
        console.error(`Failed to copy ${file}:`, err.message);
      }

      if (seenFilenames.has(file.toLowerCase())) {
        console.log(`Skipping duplicate entry in manifest for: ${file}`);
        continue;
      }
      seenFilenames.add(file.toLowerCase());

      const dimensions = getImageDimensions(sourceFilePath);
      const stats = fs.statSync(sourceFilePath);

      const metadata = METADATA_DICTIONARY[file] || {
        name: file.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
        category: detectedCategory,
        subcategory: detectedCategory === 'button' ? 'Buttons' : detectedCategory === 'accessory' ? 'Accessories' : 'Fabrics',
        composition: 'Premium Textile Specimen',
        weave: 'Mill Standard Construction',
        weightGsm: '180 GSM',
        drapeStiffness: 0.45,
        roughness: 0.75,
        metalness: detectedCategory === 'button' ? 0.8 : 0.0,
        sheen: 0.3,
        description: `High-quality ${detectedCategory} specimen sourced and verified for Classic Fashions wholesale catalogue.`,
      };

      const itemRecord = {
        id: generateId(file),
        filename: file,
        sourceDirectory: src.path,
        format: dimensions.format,
        width: dimensions.width,
        height: dimensions.height,
        fileSizeBytes: stats.size,
        fileSizeFormatted: `${(stats.size / 1024).toFixed(1)} KB`,
        ...metadata,
      };

      discoveredItems.push(itemRecord);
    }
  }

  console.log(`Total synchronized unique assets: ${discoveredItems.length}`);
  const fabricsCount = discoveredItems.filter((i) => i.category === 'fabric').length;
  const buttonsCount = discoveredItems.filter((i) => i.category === 'button').length;
  const accessoriesCount = discoveredItems.filter((i) => i.category === 'accessory').length;
  console.log(`- Fabrics: ${fabricsCount}`);
  console.log(`- Buttons: ${buttonsCount}`);
  console.log(`- Accessories: ${accessoriesCount}`);

  // Write JSON Manifest
  const manifestData = {
    generatedAt: new Date().toISOString(),
    totalAssets: discoveredItems.length,
    counts: {
      fabrics: fabricsCount,
      buttons: buttonsCount,
      accessories: accessoriesCount,
    },
    items: discoveredItems,
  };
  fs.writeFileSync(
    path.join(TARGET_DIR_CATALOGUE, 'manifest.json'),
    JSON.stringify(manifestData, null, 2),
    'utf-8'
  );

  // Generate TypeScript code
  const tsContent = `// Auto-generated by scripts/sync-catalogue-assets.mjs
// DO NOT EDIT MANUALLY. Run 'npm run sync:assets' to regenerate.

import { Product } from '../types.ts';

/**
 * Universal asset URL resolver for local Vite dev and GitHub Pages production base paths
 */
export function getCatalogueAssetUrl(filename: string): string {
  const base = (import.meta.env.BASE_URL || '/').replace(/\\/$/, '');
  const prefix = base ? \`\${base}/\` : '/';
  // Use encodeURIComponent to handle spaces safely
  return \`\${prefix}assets/catalogue-3d/\${encodeURIComponent(filename)}\`;
}

export type CatalogueCategory = 'fabric' | 'button' | 'accessory';

export interface Catalogue3DItem {
  id: string;
  name: string;
  category: CatalogueCategory;
  subcategory: string;
  filename: string;
  sourceDirectory?: string;
  imageUrl: string;
  format: string;
  width: number;
  height: number;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  composition: string;
  description: string;
  
  // Fabric specific
  weave?: string;
  weightGsm?: string;
  drapeStiffness?: number; // 0.1 (fluid) to 1.0 (stiff)

  // Button specific
  buttonType?: 'wood' | 'metal' | 'shell' | 'pearl' | 'plastic' | 'glass' | 'snap';
  holeCount?: number;
  shank?: boolean;
  dimensions?: string;
  finish?: string;
  transmission?: number;

  // Accessory specific
  accessoryType?: 'lace' | 'zipper' | 'tipping' | 'braid';

  // Three.js PBR Material calibrations
  roughness: number;
  metalness: number;
  sheen?: number;
  sheenColor?: string;
  sheenRoughness?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  textureRepeat?: { x: number; y: number };
}

export const CATALOGUE_3D_ITEMS: Catalogue3DItem[] = ${JSON.stringify(
    discoveredItems.map((item) => ({
      ...item,
      imageUrl: `__GET_URL__${item.filename}__GET_URL__`,
      textureRepeat:
        item.category === 'button'
          ? { x: 1, y: 1 }
          : item.category === 'accessory'
          ? (item.accessoryType === 'tipping' ? { x: 1, y: 1 } : { x: 3, y: 1 })
          : { x: 2, y: 2 },
    })),
    null,
    2
  )
    .replace(/"__GET_URL__(.*?)__GET_URL__"/g, 'getCatalogueAssetUrl("$1")')};

/**
 * Helper to get item by index or ID with safe fallback
 */
export function getCatalogueItem(indexOrId: number | string): Catalogue3DItem {
  if (typeof indexOrId === 'number') {
    return CATALOGUE_3D_ITEMS[indexOrId] || CATALOGUE_3D_ITEMS[0];
  }
  const found = CATALOGUE_3D_ITEMS.find(
    (item) => item.id === indexOrId || item.filename.toLowerCase() === indexOrId.toLowerCase()
  );
  return found || CATALOGUE_3D_ITEMS[0];
}

/**
 * Intelligent query matching for deep-linking
 */
export function findMatchingCatalogueIndex(query?: string | null): number {
  if (!query) return 0;
  const q = query.toLowerCase().trim();

  // Exact ID or filename
  const exactIndex = CATALOGUE_3D_ITEMS.findIndex(
    (item) => item.id.toLowerCase() === q || item.filename.toLowerCase() === q
  );
  if (exactIndex !== -1) return exactIndex;

  // Keyword priority matching
  if (q.includes('glass button') || q.includes('crystal button')) {
    const idx = CATALOGUE_3D_ITEMS.findIndex((i) => i.id.includes('glass-button'));
    if (idx !== -1) return idx;
  }
  if (q.includes('metal button') || q.includes('blazer button')) {
    const idx = CATALOGUE_3D_ITEMS.findIndex((i) => i.id.includes('metal-buttton'));
    if (idx !== -1) return idx;
  }
  if (q.includes('pearl button')) {
    const idx = CATALOGUE_3D_ITEMS.findIndex((i) => i.id.includes('pearl-button'));
    if (idx !== -1) return idx;
  }
  if (q.includes('shell button')) {
    const idx = CATALOGUE_3D_ITEMS.findIndex((i) => i.id.includes('shell-button'));
    if (idx !== -1) return idx;
  }
  if (q.includes('wood button') || q.includes('wooden button')) {
    const idx = CATALOGUE_3D_ITEMS.findIndex((i) => i.id.includes('wooden-button'));
    if (idx !== -1) return idx;
  }
  if (q.includes('snap button')) {
    const idx = CATALOGUE_3D_ITEMS.findIndex((i) => i.id.includes('snap-button'));
    if (idx !== -1) return idx;
  }
  if (q.includes('plastic button')) {
    const idx = CATALOGUE_3D_ITEMS.findIndex((i) => i.id.includes('plastic-button'));
    if (idx !== -1) return idx;
  }
  if (q.includes('denim')) {
    const idx = CATALOGUE_3D_ITEMS.findIndex((i) => i.id.includes('denim'));
    if (idx !== -1) return idx;
  }
  if (q.includes('satin')) {
    const idx = CATALOGUE_3D_ITEMS.findIndex((i) => i.id.includes('satin'));
    if (idx !== -1) return idx;
  }
  if (q.includes('chiffon')) {
    const idx = CATALOGUE_3D_ITEMS.findIndex((i) => i.id.includes('chiffon'));
    if (idx !== -1) return idx;
  }
  if (q.includes('chambray')) {
    const idx = CATALOGUE_3D_ITEMS.findIndex((i) => i.id.includes('chambray'));
    if (idx !== -1) return idx;
  }
  if (q.includes('lace')) {
    const idx = CATALOGUE_3D_ITEMS.findIndex((i) => i.category === 'accessory' && i.name.toLowerCase().includes('lace'));
    if (idx !== -1) return idx;
  }
  if (q.includes('zip') || q.includes('zipper')) {
    const idx = CATALOGUE_3D_ITEMS.findIndex((i) => i.id.includes('zip'));
    if (idx !== -1) return idx;
  }
  if (q.includes('tipping') || q.includes('aglet')) {
    const idx = CATALOGUE_3D_ITEMS.findIndex((i) => i.id.includes('tipping'));
    if (idx !== -1) return idx;
  }

  // Substring match
  const subIdx = CATALOGUE_3D_ITEMS.findIndex(
    (item) => item.name.toLowerCase().includes(q) || q.includes(item.name.toLowerCase())
  );
  if (subIdx !== -1) return subIdx;

  return 0;
}

/**
 * Convert Catalogue3DItem to enquiry Product
 */
export function getProductForCatalogueItem(item: Catalogue3DItem): Product {
  const catLabel = item.category === 'button' ? 'BUTTONS & FASTENERS' : item.category === 'accessory' ? 'TRIMS & ACCESSORIES' : 'TEXTILES & FABRICS';
  return {
    id: item.id,
    productCode: \`CF-\${item.id.toUpperCase()}\`,
    name: item.name,
    category: (item.category === 'button' ? 'accessories' : item.category === 'accessory' ? 'accessories' : 'fabrics') as any,
    categoryLabel: catLabel,
    subcategory: item.subcategory,
    fabricWeaveType: 'PLAIN' as any,
    width: item.dimensions || '58" / 60"',
    gsm: item.weightGsm || (item.category === 'button' ? '24-36 Lignes' : 'Trim Gauge'),
    weave: item.weave || item.finish || 'Standard Construction',
    description: item.description,
    shortDescription: item.description,
    fullDescription: \`\${item.description} Sourced and manufactured by Classic Fashions.\`,
    images: [item.imageUrl],
    imageAlt: \`\${item.name} specimen\`,
    colours: ['Mill Standard / Bespoke Custom Finishes'],
    sizes: ['Sample Pack', 'Production Volume'],
    fabric: item.composition,
    price: 'Wholesale Quotation on Enquiry',
    availability: 'Sampling Available',
    active: true,
    patternType: 'woven-fabric' as any,
    specifications: \`\${item.composition} • \${item.finish || item.weave || ''} • \${item.weightGsm || item.dimensions || ''}\`,
    applications: ['Garment Manufacturing', 'Sampling', 'Apparel Export'],
    enquiryEnabled: true,
    isService: false,
    featured: false,
  };
}
`;

  fs.writeFileSync(DATA_OUTPUT_PATH, tsContent, 'utf-8');
  console.log(`Generated: ${DATA_OUTPUT_PATH}`);
  console.log('Catalogue asset synchronization complete!');
}

run().catch((err) => {
  console.error('Fatal error during asset sync:', err);
  process.exit(1);
});
