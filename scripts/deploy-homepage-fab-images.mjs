import fs from 'fs';
import path from 'path';

const sourceDir = 'C:\\Users\\K Manikandan\\.gemini\\antigravity\\brain\\fdf9ca2a-30a5-429e-8402-769e263d2461\\scratch\\homepage_fab_extracted\\Home page Fab';
const targetDir = path.resolve('public/assets/materials/homepage');
const rawTargetDir = path.join(targetDir, 'raw');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}
if (!fs.existsSync(rawTargetDir)) {
  fs.mkdirSync(rawTargetDir, { recursive: true });
}

const mapping = [
  {
    originalFilename: '1.jpg',
    targetFilename: 'fabrics.jpg',
    categoryKey: 'fabrics',
    name: 'FABRICS',
    shortDescriptor: 'Woven cotton & gada cloth',
    description: 'Swirled spiral drape of fine woven/knitted cream-beige fabric showing soft texture and folded ripples.',
    confidence: '100%',
    width: 1024,
    height: 1024,
    format: 'JPEG'
  },
  {
    originalFilename: '2.jpg',
    targetFilename: 'laces.jpg',
    categoryKey: 'laces',
    name: 'LACES',
    shortDescriptor: 'Garment lace varieties',
    description: 'Delicate ivory and champagne embroidered floral lace ribbons with scalloped guipure edges and sheer net.',
    confidence: '100%',
    width: 1024,
    height: 1024,
    format: 'JPEG'
  },
  {
    originalFilename: '3.jpg',
    targetFilename: 'denim.jpg',
    categoryKey: 'denim',
    name: 'DENIM',
    shortDescriptor: 'Raw denim materials',
    description: 'Deep indigo blue diagonal twill raw denim rolled swatch with crisp visible weft/warp cotton yarn structure.',
    confidence: '100%',
    width: 1024,
    height: 1024,
    format: 'JPEG'
  },
  {
    originalFilename: '4.jpg',
    targetFilename: 'mesh.jpg',
    categoryKey: 'mesh',
    name: 'MESH',
    shortDescriptor: 'Breathable athletic mesh',
    description: 'Black open-pore athletic spacer/eyelet mesh netting draped over deep navy performance fabric backing.',
    confidence: '100%',
    width: 1024,
    height: 1024,
    format: 'JPEG'
  },
  {
    originalFilename: '5.jpg',
    targetFilename: 'lycra-mesh.jpg',
    categoryKey: 'lycra-mesh',
    name: 'LYCRA / LYCRA MESH',
    shortDescriptor: '4-way power stretch textiles',
    description: 'Deep navy blue 4-way stretch activewear knit jersey with elastic sleeve/cuff showing recovery and knit grain.',
    confidence: '100%',
    width: 1024,
    height: 1024,
    format: 'JPEG'
  },
  {
    originalFilename: '6.jpg',
    targetFilename: 'tapes.jpg',
    categoryKey: 'tapes',
    name: 'TAPES',
    shortDescriptor: 'Cotton twill & binding reels',
    description: 'Stack of premium woven twill tapes, edge binding ribbons, and bias reels in earth tones (cream, rust, olive, tan).',
    confidence: '100%',
    width: 1024,
    height: 1024,
    format: 'JPEG'
  },
  {
    originalFilename: '7.jpg',
    targetFilename: 'zippers.jpg',
    categoryKey: 'zippers',
    name: 'ZIPPERS',
    shortDescriptor: 'Continuous coils & metal teeth',
    description: 'Four heavy metal teeth zippers with antique brass, polished gold, and gunmetal pulls mounted on black tape.',
    confidence: '100%',
    width: 1024,
    height: 1024,
    format: 'JPEG'
  },
  {
    originalFilename: '8.jpg',
    targetFilename: 'buttons.jpg',
    categoryKey: 'buttons',
    name: 'BUTTONS',
    shortDescriptor: 'Loose resin, horn & shank',
    description: '3x3 grid of natural horn, turned wood, ivory corozo, and dark resin buttons with 4 holes on coarse linen.',
    confidence: '100%',
    width: 1024,
    height: 1024,
    format: 'JPEG'
  },
  {
    originalFilename: '9.jpg',
    targetFilename: 'brand-tags.jpg',
    categoryKey: 'tags',
    name: 'BRAND TAGS',
    shortDescriptor: 'Woven damask & printed tags',
    description: 'Natural kraft paper apparel hang tag with brass grommet and cord, paired with a black woven damask brand label.',
    confidence: '100%',
    width: 1024,
    height: 1024,
    format: 'JPEG'
  },
  {
    originalFilename: '10.jpg',
    targetFilename: 'garment-accessories.jpg',
    categoryKey: 'accessories',
    name: 'GARMENT ACCESSORIES',
    shortDescriptor: 'Physical trims, cords & sundries',
    description: 'Arrangement of metal drawcord tipping, cord locks, eyelets, grommets, rings, and snap fasteners on fabric swatches.',
    confidence: '100%',
    width: 1024,
    height: 1024,
    format: 'JPEG'
  }
];

console.log('--- Copying and Registering Homepage Category Assets ---');
const manifestEntries = [];

for (const entry of mapping) {
  const src = path.join(sourceDir, entry.originalFilename);
  const destSemantic = path.join(targetDir, entry.targetFilename);
  const destRaw = path.join(rawTargetDir, entry.originalFilename);

  if (!fs.existsSync(src)) {
    throw new Error(`Source file missing: ${src}`);
  }

  fs.copyFileSync(src, destSemantic);
  fs.copyFileSync(src, destRaw);

  const stats = fs.statSync(destSemantic);
  console.log(`✓ ${entry.originalFilename} -> ${entry.targetFilename} (${(stats.size / 1024).toFixed(1)} KB)`);

  manifestEntries.push({
    ...entry,
    servedPath: `/assets/materials/homepage/${entry.targetFilename}`,
    rawServedPath: `/assets/materials/homepage/raw/${entry.originalFilename}`,
    fileSizeBytes: stats.size,
    fileSizeKB: `${(stats.size / 1024).toFixed(1)} KB`,
  });
}

const manifestPath = path.join(targetDir, 'manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify({
  version: '1.0.0',
  updatedAt: new Date().toISOString(),
  sourceArchive: 'Home page Fab.zip',
  categoriesCount: manifestEntries.length,
  mapping: manifestEntries,
}, null, 2), 'utf-8');

console.log(`\nSaved manifest to: ${manifestPath}`);
console.log('All 10 category assets copied and verified successfully!');
