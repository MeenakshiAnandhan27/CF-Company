import { FabricQuality, Product } from '../types.ts';

/**
 * FABRIC QUALITY MASTER CATALOGUE — CLASSIC FASHIONS
 *
 * Source of truth built directly from the fabric quality/price-list documents:
 * - Yarn construction
 * - Quality (e.g. KCW × KCW, CCW × CCW, CW × CW, Ring × Ring)
 * - Width (e.g. 48", 50", 54", 58", 63")
 * - GSM / weight
 * - Weave (PLAIN, 2/1 TWILL, 3/1 DRILL, DUCK, SATIN, PLAIN / TWILL)
 * - Selvage (Tuck-in, Closed, Leno)
 * - Loom (Airjet, Sulzer Shuttleless, Rapier, Auto Loom)
 * - Standard / Quality specification
 *
 * Each distinct construction/quality/width combination is preserved as a separate variant.
 */

export const fabricQualities: FabricQuality[] = [
  // ========================================================
  // PLAIN WEAVE VARIETIES
  // ========================================================
  {
    id: 'fab-plain-4040-9288-48',
    category: 'fabrics',
    subcategory: 'PLAIN',
    name: '40X40 / 92X88 – 48" Plain Gada',
    quality: 'CCW × CCW',
    yarnConstruction: '40X40 / 92X88',
    width: '48"',
    gsm: '105 GSM',
    weave: 'PLAIN',
    selvage: 'Closed Selvage',
    standard: 'Garment Grade Grey Gada',
    loom: 'Airjet Loom',
    image: '/assets/materials/fabrics.jpg',
    description: 'Unbleached 100% combed cotton plain weave cloth in 48" width. Standard pocketing, sampling toiles, and shirting interlinings.',
    applications: ['Trouser Pocket Bags', 'Sample Garment Mockups', 'Lightweight Shirting Interlinings', 'Printing Base Fabric'],
    colours: ['Loomstate Grey / Kora', 'RFD (Ready For Dyeing)'],
  },
  {
    id: 'fab-plain-4040-9288-50',
    category: 'fabrics',
    subcategory: 'PLAIN',
    name: '40X40 / 92X88 – 50" Plain Gada',
    quality: 'CCW × CCW',
    yarnConstruction: '40X40 / 92X88',
    width: '50"',
    gsm: '105 GSM',
    weave: 'PLAIN',
    selvage: 'Closed Selvage',
    standard: 'Garment Grade Grey Gada',
    loom: 'Airjet Loom',
    image: '/assets/materials/fabrics.jpg',
    description: '50" width combed cotton plain weave gada. Consistent count and clean selvedge for efficient garment cutting markers.',
    applications: ['Apparel Pocketing', 'Facing & Waistband Linings', 'Toile Development', 'Garment Printing Ground'],
    colours: ['Loomstate Grey / Kora', 'RFD'],
  },
  {
    id: 'fab-plain-4040-9288-54',
    category: 'fabrics',
    subcategory: 'PLAIN',
    name: '40X40 / 92X88 – 54" Plain Gada',
    quality: 'CCW × CCW',
    yarnConstruction: '40X40 / 92X88',
    width: '54"',
    gsm: '108 GSM',
    weave: 'PLAIN',
    selvage: 'Tuck-in Selvage',
    standard: 'Export Quality Poplin Base',
    loom: 'Airjet Loom',
    image: '/assets/materials/fabrics.jpg',
    description: '54" width combed cotton plain cloth. Uniform weave density with tuck-in selvage for high-speed cutting tables.',
    applications: ['Export Bottomwear Pocketing', 'Printed Casual Tops', 'Shirting Facings', 'Embroidery Backing'],
    colours: ['Loomstate Grey / Kora', 'RFD', 'Semi-Bleached'],
  },
  {
    id: 'fab-plain-4040-9288-63',
    category: 'fabrics',
    subcategory: 'PLAIN',
    name: '40X40 / 92X88 – 63" Plain Gada',
    quality: 'CCW × CCW',
    yarnConstruction: '40X40 / 92X88',
    width: '63"',
    gsm: '110 GSM',
    weave: 'PLAIN',
    selvage: 'Tuck-in Selvage',
    standard: 'Wide-Width Export Grade A',
    loom: 'Airjet Loom',
    image: '/assets/materials/fabrics.jpg',
    description: 'Wide 63" combed cotton plain cloth giving maximum marker efficiency. Clean airjet finish with minimal sizing residue.',
    applications: ['Industrial Garment Cutting Units', 'Full Width Pocket Markers', 'Home Textile Sheeting', 'Export Casualwear Linings'],
    colours: ['Loomstate Grey / Kora', 'RFD', 'Bleached White'],
  },
  {
    id: 'fab-plain-4141-13268-63',
    category: 'fabrics',
    subcategory: 'PLAIN',
    name: '41X41 / 132X68 – 63" Plain High-Density Poplin',
    quality: 'KCW × KCW',
    yarnConstruction: '41X41 / 132X68',
    width: '63"',
    gsm: '115 GSM',
    weave: 'PLAIN',
    selvage: 'Tuck-in Selvage',
    standard: 'High-Density Sheeting & Shirting',
    loom: 'Airjet Loom',
    image: '/assets/materials/fabrics.jpg',
    description: 'High-density carded combed warp and weft plain fabric in 63" width. Superior tensile strength and smooth surface finish.',
    applications: ['Men’s & Women’s Casual Shirting', 'Fine Pocket Bags', 'Apparel Linings', 'Digital & Screen Printing Ground'],
    colours: ['Loomstate Kora', 'RFD', 'Optical White'],
  },
  {
    id: 'fab-plain-3030-6868-63',
    category: 'fabrics',
    subcategory: 'PLAIN',
    name: '30X30 / 68X68 – 63" Plain Sheeting Gada',
    quality: 'KCW × KCW',
    yarnConstruction: '30X30 / 68X68',
    width: '63"',
    gsm: '132 GSM',
    weave: 'PLAIN',
    selvage: 'Closed Selvage',
    standard: 'Medium Sheeting / Heavy Gada',
    loom: 'Sulzer Shuttleless Loom',
    image: '/assets/materials/fabrics.jpg',
    description: 'Medium 30s count cotton plain cloth with substantial hand-feel and durability. Standard for workwear and robust apparel linings.',
    applications: ['Workwear Linings', 'Heavy Duty Pocketing', 'Garment Interlining Backers', 'Canvas Utility Bags'],
    colours: ['Loomstate Natural', 'RFD'],
  },
  {
    id: 'fab-plain-2020-6060-63',
    category: 'fabrics',
    subcategory: 'PLAIN',
    name: '20X20 / 60X60 – 63" Plain Coarse Gada',
    quality: 'CW × CW',
    yarnConstruction: '20X20 / 60X60',
    width: '63"',
    gsm: '145 GSM',
    weave: 'PLAIN',
    selvage: 'Leno Selvage',
    standard: 'Coarse Heavy Gada',
    loom: 'Auto Loom',
    image: '/assets/materials/fabrics.jpg',
    description: 'Heavy 20s cotton plain cloth. Rugged texture for industrial garment components, sample mockups, and heavy pocketing.',
    applications: ['Industrial Uniform Pockets', 'Heavy Sample Toiles', 'Shoe Linings & Interlinings', 'Tool Bags'],
    colours: ['Loomstate Natural Kora'],
  },
  {
    id: 'fab-plain-5050-13272-63',
    category: 'fabrics',
    subcategory: 'PLAIN',
    name: '50X50 / 132X72 – 63" Superfine Plain Poplin',
    quality: 'CCW × CCW',
    yarnConstruction: '50X50 / 132X72',
    width: '63"',
    gsm: '95 GSM',
    weave: 'PLAIN',
    selvage: 'Tuck-in Selvage',
    standard: 'Superfine Poplin Shirting',
    loom: 'Airjet Loom',
    image: '/assets/materials/fabrics.jpg',
    description: 'Fine combed yarn plain weave. Lightweight, smooth handle for premium lightweight shirting, kurtis, and delicate linings.',
    applications: ['Premium Shirting', 'Ladies Kurti Bases', 'Fine Garment Underlays', 'Nightwear'],
    colours: ['Loomstate Grey', 'RFD', 'Bleached White'],
  },

  // ========================================================
  // TWILL WEAVE VARIETIES
  // ========================================================
  {
    id: 'fab-twill-3030-12464-63',
    category: 'fabrics',
    subcategory: 'TWILL',
    name: '30X30 / 124X64 – 63" 2/1 Twill Gada',
    quality: 'KCW × KCW',
    yarnConstruction: '30X30 / 124X64',
    width: '63"',
    gsm: '158 GSM',
    weave: '2/1 TWILL',
    selvage: 'Tuck-in Selvage',
    standard: 'Export Standard Twill Gada',
    loom: 'Airjet Loom',
    image: '/assets/materials/fabrics.jpg',
    description: 'Clear 2/1 diagonal twill weave in 63" width. High abrasion resistance, uniform yarn lay for bottomwear and heavy trouser pockets.',
    applications: ['Bottomwear Pocket Bags', 'Chino Trouser Linings', 'Casual Shorts Foundations', 'Workwear Bases'],
    colours: ['Loomstate Kora', 'RFD', 'Bleached Off-White'],
  },
  {
    id: 'fab-twill-4040-12464-63',
    category: 'fabrics',
    subcategory: 'TWILL',
    name: '40X40 / 124X64 – 63" 2/1 Fine Twill',
    quality: 'CCW × CCW',
    yarnConstruction: '40X40 / 124X64',
    width: '63"',
    gsm: '130 GSM',
    weave: '2/1 TWILL',
    selvage: 'Tuck-in Selvage',
    standard: 'Fine Garment Twill',
    loom: 'Airjet Loom',
    image: '/assets/materials/fabrics.jpg',
    description: 'Fine count 2/1 twill cotton cloth in 63" width. Balanced drape and subtle diagonal ridge texture for shirting and trousers.',
    applications: ['Casual Shirting', 'Light Bottomwear', 'Designer Pocket Bags', 'Garment Outer Accents'],
    colours: ['Loomstate Grey', 'RFD', 'Dyed Assorted'],
  },
  {
    id: 'fab-twill-2020-10856-63',
    category: 'fabrics',
    subcategory: 'TWILL',
    name: '20X20 / 108X56 – 63" 2/1 Heavy Chino Twill',
    quality: 'CW × CW',
    yarnConstruction: '20X20 / 108X56',
    width: '63"',
    gsm: '192 GSM',
    weave: '2/1 TWILL',
    selvage: 'Closed Selvage',
    standard: 'Heavy Utility Chino Twill',
    loom: 'Sulzer Shuttleless Loom',
    image: '/assets/materials/fabrics.jpg',
    description: 'Heavyweight 2/1 twill fabric. Rugged structural stability for cargo trousers, industrial uniform pants, and waistbands.',
    applications: ['Cargo Pants & Shorts', 'Uniform Trousers', 'Heavy Pocket Linings', 'Aprons & Work Aprons'],
    colours: ['Natural Kora', 'RFD Heavy'],
  },
  {
    id: 'fab-twill-24020-10856-63',
    category: 'fabrics',
    subcategory: 'TWILL',
    name: '2/40X20 / 108X56 – 63" 2/1 Two-Ply Chino Twill',
    quality: 'CCW × CW',
    yarnConstruction: '2/40X20 / 108X56',
    width: '63"',
    gsm: '205 GSM',
    weave: '2/1 TWILL',
    selvage: 'Tuck-in Selvage',
    standard: 'Two-Ply Warp Premium Chino',
    loom: 'Airjet Loom',
    image: '/assets/materials/fabrics.jpg',
    description: 'Two-ply combed warp twill with outstanding dimensional stability, smooth face, and crisp diagonal twill definition.',
    applications: ['Export Chinos & Trousers', 'Premium Uniforms', 'Structured Casual Jackets', 'Boutique Apparel'],
    colours: ['Loomstate Kora', 'RFD Premium'],
  },

  // ========================================================
  // DRILL WEAVE VARIETIES
  // ========================================================
  {
    id: 'fab-drill-1612-9648-63',
    category: 'fabrics',
    subcategory: 'DRILL',
    name: '16X12 / 96X48 – 63" 3/1 Drill Gada',
    quality: 'CW × CW',
    yarnConstruction: '16X12 / 96X48',
    width: '63"',
    gsm: '235 GSM',
    weave: '3/1 DRILL',
    selvage: 'Tuck-in Selvage',
    standard: 'Heavy Industrial Drill Gada',
    loom: 'Sulzer Shuttleless Loom',
    image: '/assets/materials/fabrics.jpg',
    description: 'Dense 3/1 warp-face drill cloth. Rugged strength for industrial workwear, cargo bottom pockets, and utility garments.',
    applications: ['Industrial Workwear Pants', 'Cargo Utility Pockets', 'Apparel Reinforcements', 'Tool Bags'],
    colours: ['Raw Cotton Kora', 'RFD Heavy', 'Khaki'],
  },
  {
    id: 'fab-drill-1612-10856-63',
    category: 'fabrics',
    subcategory: 'DRILL',
    name: '16X12 / 108X56 – 63" 3/1 High-Sett Drill',
    quality: 'CW × CW',
    yarnConstruction: '16X12 / 108X56',
    width: '63"',
    gsm: '250 GSM',
    weave: '3/1 DRILL',
    selvage: 'Tuck-in Selvage',
    standard: 'Uniform & Workwear Grade A',
    loom: 'Airjet Loom',
    image: '/assets/materials/fabrics.jpg',
    description: 'High-sett 3/1 drill fabric in 63" width. Exceptional burst and tear durability under continuous commercial laundering.',
    applications: ['Security & Factory Uniforms', 'Heavy Duty Pocket Bags', 'Carpenter Pants', 'Protective Overalls'],
    colours: ['Loomstate Kora', 'RFD'],
  },
  {
    id: 'fab-drill-2020-10856-58',
    category: 'fabrics',
    subcategory: 'DRILL',
    name: '20X20 / 108X56 – 58" 3/1 Bottomwear Drill',
    quality: 'CCW × CCW',
    yarnConstruction: '20X20 / 108X56',
    width: '58"',
    gsm: '210 GSM',
    weave: '3/1 DRILL',
    selvage: 'Closed Selvage',
    standard: 'Garment Bottomwear Drill',
    loom: 'Rapier Loom',
    image: '/assets/materials/fabrics.jpg',
    description: '58" medium-heavy combed drill cloth. Ideal for casual bottomwear, reinforced work trouser foundations, and durable pockets.',
    applications: ['Bottomwear Trousers', 'Waistband Foundations', 'Pocket Facing & Bags', 'Casual Jackets'],
    colours: ['Natural Kora', 'RFD', 'Bleached Off-White'],
  },
  {
    id: 'fab-drill-1010-7244-63',
    category: 'fabrics',
    subcategory: 'DRILL',
    name: '10X10 / 72X44 – 63" 3/1 Heavy Drill Canvas',
    quality: 'CW × CW',
    yarnConstruction: '10X10 / 72X44',
    width: '63"',
    gsm: '285 GSM',
    weave: '3/1 DRILL',
    selvage: 'Leno Selvage',
    standard: 'Heavy Utility Drill Canvas',
    loom: 'Auto Loom',
    image: '/assets/materials/fabrics.jpg',
    description: 'Heavy 10s count drill. Maximum tensile endurance for industrial covers, tool gear, heavy bags, and apparel reinforcements.',
    applications: ['Heavy Duty Equipment Bags', 'Industrial Reinforcements', 'Rugged Aprons', 'Outdoor Gear'],
    colours: ['Loomstate Natural Kora'],
  },

  // ========================================================
  // DUCK WEAVE VARIETIES
  // ========================================================
  {
    id: 'fab-duck-1010-4836-63',
    category: 'fabrics',
    subcategory: 'DUCK',
    name: '10X10 / 48X36 – 63" Single Yarn Army Duck',
    quality: 'CW × CW',
    yarnConstruction: '10X10 / 48X36',
    width: '63"',
    gsm: '275 GSM',
    weave: 'DUCK',
    selvage: 'Closed Selvage',
    standard: 'Single Yarn Army Duck Canvas',
    loom: 'Sulzer Shuttleless Loom',
    image: '/assets/materials/fabrics.jpg',
    description: 'Tight square-weave cotton duck. Smooth flat surface, water-repellent receptive, heavy utility and bag canvas.',
    applications: ['Tote Bags & Canvas Backpacks', 'Utility Outerwear', 'Heavy Garment Accents', 'Footwear Uppers'],
    colours: ['Raw Natural Kora', 'RFD Heavy'],
  },
  {
    id: 'fab-duck-220220-4844-63',
    category: 'fabrics',
    subcategory: 'DUCK',
    name: '2/20X2/20 / 48X44 – 63" Plied Army Duck',
    quality: 'Ring × Ring',
    yarnConstruction: '2/20X2/20 / 48X44',
    width: '63"',
    gsm: '310 GSM',
    weave: 'DUCK',
    selvage: 'Tuck-in Selvage',
    standard: 'Double Yarn Plied Army Duck',
    loom: 'Airjet Loom',
    image: '/assets/materials/fabrics.jpg',
    description: 'Two-ply warp and weft duck cloth. Outstanding burst strength and uniform flat texture for premium rugged garments and accessories.',
    applications: ['Export Utility Jackets', 'Premium Canvas Totes', 'Heavy Chino Workwear', 'Equipment Sheaths'],
    colours: ['Loomstate Natural Kora', 'RFD Canvas'],
  },
  {
    id: 'fab-duck-1616-5446-63',
    category: 'fabrics',
    subcategory: 'DUCK',
    name: '16X16 / 54X46 – 63" Oxford Duck Canvas',
    quality: 'CW × CW',
    yarnConstruction: '16X16 / 54X46',
    width: '63"',
    gsm: '220 GSM',
    weave: 'DUCK',
    selvage: 'Closed Selvage',
    standard: 'Lightweight Oxford Duck',
    loom: 'Rapier Loom',
    image: '/assets/materials/fabrics.jpg',
    description: 'Medium-weight duck canvas. Excellent for apparel accents, casual caps, tote bags, and summer jackets.',
    applications: ['Summer Canvas Jackets', 'Casual Headwear & Caps', 'Tote Bags', 'Decorative Home Accents'],
    colours: ['Loomstate Kora', 'RFD', 'Bleached White'],
  },
  {
    id: 'fab-duck-77-4232-63',
    category: 'fabrics',
    subcategory: 'DUCK',
    name: '7X7 / 42X32 – 63" Heavy Number 10 Duck Canvas',
    quality: 'CW × CW',
    yarnConstruction: '7X7 / 42X32',
    width: '63"',
    gsm: '360 GSM',
    weave: 'DUCK',
    selvage: 'Leno Selvage',
    standard: 'Heavy Number Duck Canvas',
    loom: 'Shuttle Loom',
    image: '/assets/materials/fabrics.jpg',
    description: 'Heavyweight #10 equivalent cotton duck canvas for rugged industrial and outdoor utility specifications.',
    applications: ['Industrial Tarpaulins', 'Heavy Tool Belts', 'Luggage & Duffle Bags', 'Rugged Canvas Aprons'],
    colours: ['Natural Raw Kora'],
  },

  // ========================================================
  // SATIN WEAVE VARIETIES
  // ========================================================
  {
    id: 'fab-satin-6060-165104-63',
    category: 'fabrics',
    subcategory: 'SATIN',
    name: '60X60 / 165X104 – 63" Super Combed Luxury Satin',
    quality: 'CCW × CCW',
    yarnConstruction: '60X60 / 165X104',
    width: '63"',
    gsm: '125 GSM',
    weave: 'SATIN',
    selvage: 'Tuck-in Selvage',
    standard: 'Super Combed Luxury Satin',
    loom: 'Airjet Loom',
    image: '/assets/materials/fabrics.jpg',
    description: 'High-sett 4/1 cotton satin weave with lustrous face and silky drape. Premium shirting, luxury bed linen, and boutique apparel base.',
    applications: ['Executive Shirting', 'Luxury Boutique Garments', 'Silk-Touch Linings', 'Designer Tops & Kurtis'],
    colours: ['Loomstate Grey', 'RFD Lustre', 'Optical White'],
  },
  {
    id: 'fab-satin-4040-14090-63',
    category: 'fabrics',
    subcategory: 'SATIN',
    name: '40X40 / 140X90 – 63" Combed Cotton Sateen',
    quality: 'CCW × CCW',
    yarnConstruction: '40X40 / 140X90',
    width: '63"',
    gsm: '135 GSM',
    weave: 'SATIN',
    selvage: 'Tuck-in Selvage',
    standard: 'Combed Cotton Sateen',
    loom: 'Airjet Loom',
    image: '/assets/materials/fabrics.jpg',
    description: 'Smooth cotton sateen shirting. Subtle natural sheen, soft handle for ladies tops, blouses, and refined shirting.',
    applications: ['Ladies Blouses & Tunics', 'Soft Tailored Shirts', 'Smooth Jacket Linings', 'Printed Sateen Base'],
    colours: ['Loomstate Kora', 'RFD', 'Bleached White'],
  },
  {
    id: 'fab-satin-5050-150100-63',
    category: 'fabrics',
    subcategory: 'SATIN',
    name: '50X50 / 150X100 – 63" Fine Sateen Export Grade',
    quality: 'CCW × CCW',
    yarnConstruction: '50X50 / 150X100',
    width: '63"',
    gsm: '118 GSM',
    weave: 'SATIN',
    selvage: 'Tuck-in Selvage',
    standard: 'Fine Sateen Export Grade',
    loom: 'Airjet Loom',
    image: '/assets/materials/fabrics.jpg',
    description: 'Fine-sett satin weave offering smooth yarn float, luxurious finish, and responsive reactive dyeing uptake.',
    applications: ['Premium Export Shirting', 'Designer Collection Bases', 'Luxury Linings', 'Soft Touch Dresses'],
    colours: ['Loomstate Grey', 'RFD Lustre'],
  },

  // ========================================================
  // PLAIN / TWILL (Combined Weave Variety)
  // ========================================================
  {
    id: 'fab-plaintwill-4040-12464-63',
    category: 'fabrics',
    subcategory: 'PLAIN / TWILL',
    name: '40X40 / 124X64 – 63" Plain / Twill Dual Specification',
    quality: 'CCW × CCW',
    yarnConstruction: '40X40 / 124X64',
    width: '63"',
    gsm: '130 GSM',
    weave: 'PLAIN / TWILL',
    selvage: 'Tuck-in Selvage',
    standard: 'Dual Specification Export Gada',
    loom: 'Airjet Loom',
    image: '/assets/materials/fabrics.jpg',
    description: 'Dual-compatible combed cotton weave convertible for structured plain shirting or micro-twill diagonal applications.',
    applications: ['Structured Plain Shirting', 'Micro-Twill Pants', 'High-Density Pocket Bags', 'Garment Printing Ground'],
    colours: ['Loomstate Grey', 'RFD', 'Bleached Off-White'],
  },
];

/**
 * Dynamically extract available Weave / Type categories from the actual dataset
 * Ensures categories are strictly generated from source data without inventing types
 */
export const getFabricWeaveCategories = (): string[] => {
  const weaves = new Set<string>();
  fabricQualities.forEach((fq) => {
    if (fq.subcategory) weaves.add(fq.subcategory);
  });
  return Array.from(weaves);
};

/**
 * Filter fabric qualities by specific weave type
 */
export const getFabricQualitiesByWeave = (weaveType: string): FabricQuality[] => {
  if (!weaveType || weaveType === 'ALL') return fabricQualities;
  return fabricQualities.filter(
    (fq) => fq.subcategory.toLowerCase() === weaveType.toLowerCase()
  );
};

/**
 * Convert a FabricQuality record into a Product object
 * Ensures full backwards-compatibility with all existing modals, collection items, and inquiry forms
 */
const getFabricQualityImage = (quality: FabricQuality): string => {
  const sub = quality.subcategory?.toUpperCase() || '';
  if (sub === 'PLAIN') return '/assets/materials/fabrics/plain.jpg';
  if (sub === 'SATIN') return '/assets/materials/fabrics/satin-polyester.jpg';
  if (sub === 'DRILL' || sub === 'DUCK') return '/assets/materials/fabrics/canvas-gada.jpg';
  if (sub === 'TWILL') return '/assets/materials/fabrics/stripes.jpg';
  return '/assets/materials/fabrics/cotton.jpg';
};

export const fabricQualityToProduct = (quality: FabricQuality): Product => {
  const resolvedImage = getFabricQualityImage(quality);
  return {
    id: quality.id,
    productCode: `CF-FAB-${quality.id.replace('fab-', '').toUpperCase()}`,
    name: quality.name,
    category: 'fabrics',
    categoryLabel: 'Fabrics',
    subcategory: quality.subcategory,
    fabricWeaveType: quality.subcategory as any,
    quality: quality.quality,
    yarnConstruction: quality.yarnConstruction,
    width: quality.width,
    gsm: quality.gsm,
    weave: quality.weave,
    selvage: quality.selvage,
    standard: quality.standard,
    loom: quality.loom,
    description: quality.description,
    shortDescription: `${quality.yarnConstruction} | ${quality.quality} | ${quality.width} | ${quality.gsm} | ${quality.weave}`,
    fullDescription: `${quality.description} Built to ${quality.standard} standards on ${quality.loom} with ${quality.selvage}. Quality yarn construction: ${quality.yarnConstruction} (${quality.quality}) in ${quality.width} finished roll width.`,
    images: [resolvedImage],
    imageAlt: `${quality.name} raw fabric swatch texture`,
    colours: quality.colours || ['Loomstate Grey / Kora', 'RFD'],
    sizes: [quality.width, 'Continuous Roll 100m+'],
    fabric: `${quality.quality} 100% Cotton (${quality.gsm})`,
    price: 'Wholesale Quote on Request',
    availability: 'In Stock',
    active: true,
    patternType: 'woven-fabric',
    specifications: `Yarn Construction: ${quality.yarnConstruction}; Quality: ${quality.quality}; Width: ${quality.width}; Weight: ${quality.gsm}; Weave: ${quality.weave}; Selvage: ${quality.selvage}; Loom: ${quality.loom}; Standard: ${quality.standard}`,
    applications: quality.applications || ['Garment Linings', 'Pocket Bags', 'Shirting', 'Uniforms'],
    customizationNote: `Supplied in ${quality.width} industrial rolls. Custom mill finishing, bleaching, and reactive dyeing available.`,
    enquiryEnabled: true,
  };
};

/**
 * Pre-converted list of all fabric qualities as Product objects
 */
export const fabricQualityProducts: Product[] = fabricQualities.map(fabricQualityToProduct);
