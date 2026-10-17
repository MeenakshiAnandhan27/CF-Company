import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Volume2,
  VolumeX,
  MessageSquare,
  Sparkles,
  ArrowRight,
  List,
  Layers,
  ZoomIn,
} from 'lucide-react';
import { ALL_DISCOVERY_MATERIALS, DiscoveryMaterial } from '../../data/catalogueDiscoveryData.ts';
import { FABRIC_PACK_4K, FabricPackItem } from '../../data/fabricPack4KData.ts';
import { flipbookAudio } from '../../utils/audio.ts';

interface DigitalCatalogueProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called when user clicks "Enquire About This Material" — goes directly to enquiry modal */
  onEnquire: (material: DiscoveryMaterial) => void;
}

interface LookbookSpread {
  id: string;
  chapterNumber: string;
  chapterTitle: string;
  material: DiscoveryMaterial;
  plateNumber: string;
  accentColor: string;
  accentBg: string;
  heritageNote: string;
  recommendedUses: string[];
}

export const DigitalCatalogue: React.FC<DigitalCatalogueProps> = ({
  isOpen,
  onClose,
  onEnquire,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [animDir, setAnimDir] = useState<'forward' | 'backward' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMuted, setIsMuted] = useState(() => flipbookAudio.getMuted());
  const [showToc, setShowToc] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Build 15 high-curation spreads from authentic 4K fabrics and catalogue materials
  const spreads: LookbookSpread[] = [
    {
      id: 'organic-cotton',
      chapterNumber: 'Chapter I',
      chapterTitle: 'Natural Fibres & Cottons',
      plateNumber: 'PLATE 01',
      accentColor: '#8C6534',
      accentBg: '#FAF5EB',
      heritageNote: 'Spun from combed GOTS-certified long-staple organic cotton. Free from chemical sizing agents, presenting genuine tactile hand feel with subtle natural slub flecks.',
      recommendedUses: ['Luxury Shirting', 'Resort Tops', 'Premium Loungewear', 'Infant Wear'],
      material: {
        id: 'cotton',
        name: 'Organic Cotton',
        category: 'FABRICS',
        subcategory: 'WOVEN FABRICS',
        section: 'WOVEN',
        image: '/assets/fabric-pack-4k/studio/01_Organic_Cotton_4K.jpg',
        description: 'Pure unbleached combed organic cotton with authentic natural slub flecks, breathable open-pore matrix, and gentle tactile hand feel.',
        composition: '100% GOTS Certified Organic Combed Cotton',
        weave: '1/1 Balanced Plain Weave',
        gsm: '135 GSM',
        width: '58" / 60"',
        productCode: 'CF-COT-4K',
        variants: ['Raw Ivory', 'Bleached White', 'Custom Reactive Dyed'],
      },
    },
    {
      id: 'mulberry-silk',
      chapterNumber: 'Chapter I',
      chapterTitle: 'Natural Fibres & Cottons',
      plateNumber: 'PLATE 02',
      accentColor: '#10523C',
      accentBg: '#EAF5F0',
      heritageNote: 'Woven from 100% Grade 6A pure mulberry silk filaments with high-density warp floats, creating a liquid draped drape and specular light refraction.',
      recommendedUses: ['Couture Eveningwear', 'Bridal Attire', 'Luxury Lining', 'Bias Slip Dresses'],
      material: {
        id: 'silk-satin',
        name: 'Emerald Mulberry Silk Satin',
        category: 'FABRICS',
        subcategory: 'SPECIALTY FABRICS',
        section: 'SPECIALTY',
        image: '/assets/fabric-pack-4k/studio/02_Emerald_Mulberry_Silk_Satin_4K.jpg',
        description: 'Ultra-fluid 8-end satin weave with high-specular sheen, supple bias drape, and cool lustrous surface touch.',
        composition: '100% Grade 6A Pure Mulberry Silk',
        weave: '8-End Floating Satin',
        gsm: '85 GSM (19 Momme)',
        width: '44" / 54"',
        productCode: 'CF-SLK-4K',
        variants: ['Emerald Forest', 'Champagne Gold', 'Midnight Obsidian'],
      },
    },
    {
      id: 'belgian-linen',
      chapterNumber: 'Chapter I',
      chapterTitle: 'Natural Fibres & Cottons',
      plateNumber: 'PLATE 03',
      accentColor: '#7A5B35',
      accentBg: '#F8F3EC',
      heritageNote: 'Crafted from European flax fibres with characteristic uneven yarn slubs. Naturally temperature-regulating with high moisture absorption and crisp body.',
      recommendedUses: ['Summer Blazers', 'Relaxed Trousers', 'Safari Overshirts', 'Home Atelier'],
      material: {
        id: 'linen',
        name: 'Natural Belgian Linen',
        category: 'FABRICS',
        subcategory: 'SPECIALTY FABRICS',
        section: 'SPECIALTY',
        image: '/assets/fabric-pack-4k/studio/03_Natural_Belgian_Linen_4K.jpg',
        description: 'Authentic flax slub yarn weave with textured earthy grain, breathable cellular structure, and airy tactile drape.',
        composition: '100% European Natural Flax Linen',
        weave: 'Plain Slub Weave',
        gsm: '185 GSM',
        width: '54" / 56"',
        productCode: 'CF-LIN-4K',
        variants: ['Natural Oatmeal', 'Washed Sand', 'Earthy Terracotta'],
      },
    },
    {
      id: 'indigo-denim',
      chapterNumber: 'Chapter II',
      chapterTitle: 'Denim & Structural Weaves',
      plateNumber: 'PLATE 04',
      accentColor: '#1E3A6E',
      accentBg: '#ECF2FA',
      heritageNote: 'Rope-dyed with authentic indigo dye on shuttle looms. The 3/1 right-hand twill construction yields distinct diagonal ridges designed to fade gracefully with wear.',
      recommendedUses: ['Heritage Jeans', 'Trucker Jackets', 'Chore Coats', 'Workwear Overalls'],
      material: {
        id: 'denim',
        name: 'Deep Indigo Twill Denim',
        category: 'DENIM & CHAMBRAY',
        subcategory: 'RAW DENIM',
        section: 'DENIM_CHAMBRAY',
        image: '/assets/fabric-pack-4k/studio/04_Deep_Indigo_Twill_Denim_4K.jpg',
        description: 'Heavyweight rope-dyed indigo warp with ecru fill yarn, showing sharp diagonal 3/1 twill ridges and robust structural hand.',
        composition: '100% Ring-Spun Combed Cotton',
        weave: '3/1 Right-Hand Diagonal Twill',
        gsm: '380 GSM (13.5 Oz)',
        width: '32" Selvedge / 58" Open',
        productCode: 'CF-DNM-4K',
        variants: ['Raw Deep Indigo', 'One-Wash Rinse', 'Vintage Tint'],
      },
    },
    {
      id: 'burgundy-velvet',
      chapterNumber: 'Chapter III',
      chapterTitle: 'Specialty Textures & Luxury Piles',
      plateNumber: 'PLATE 05',
      accentColor: '#6B1728',
      accentBg: '#F8ECF0',
      heritageNote: 'Woven on double-plush velvet looms with precision knife shearing. Dense vertical tufts yield directional pile nap and deep chromatic depth under ambient light.',
      recommendedUses: ['Formal Dinner Jackets', 'Evening Gowns', 'Theatre Costumes', 'Luxury Trims'],
      material: {
        id: 'velvet',
        name: 'Royal Burgundy Plush Velvet',
        category: 'FABRICS',
        subcategory: 'SPECIALTY FABRICS',
        section: 'SPECIALTY',
        image: '/assets/fabric-pack-4k/studio/05_Royal_Burgundy_Plush_Velvet_4K.jpg',
        description: 'Dense upright cut-pile velvet with rich directional sheen, deep chromatic absorption, and plush insulating drape.',
        composition: 'Combed Cotton / Rayon Micro-Plush Blend',
        weave: 'Cut-Pile Double Velvet',
        gsm: '320 GSM',
        width: '54"',
        productCode: 'CF-VLV-4K',
        variants: ['Royal Burgundy', 'Midnight Black', 'Imperial Emerald'],
      },
    },
    {
      id: 'herringbone-wool',
      chapterNumber: 'Chapter III',
      chapterTitle: 'Specialty Textures & Luxury Piles',
      plateNumber: 'PLATE 06',
      accentColor: '#3D4549',
      accentBg: '#EFF2F4',
      heritageNote: 'Spun from Super 130s Australian merino wool. The broken chevron twill pattern creates subtle geometric texture with exceptional natural wrinkle recovery.',
      recommendedUses: ['Bespoke Suiting', 'Winter Overcoats', 'Tailored Waistcoats', 'Caps & Lapels'],
      material: {
        id: 'merino-wool',
        name: 'Charcoal Herringbone Merino Wool',
        category: 'FABRICS',
        subcategory: 'WOVEN FABRICS',
        section: 'WOVEN',
        image: '/assets/fabric-pack-4k/studio/06_Charcoal_Herringbone_Merino_Wool_4K.jpg',
        description: 'Fine suiting worsted wool featuring balanced chevron herringbone ridges with natural elasticity, soft loft, and crisp drape.',
        composition: '100% Super 130s Australian Merino Wool',
        weave: 'Broken Chevron Herringbone Twill',
        gsm: '260 GSM',
        width: '58" / 60"',
        productCode: 'CF-WOL-4K',
        variants: ['Charcoal Heather', 'Midnight Navy', 'Muted Walnut'],
      },
    },
    {
      id: 'jacquard-brocade',
      chapterNumber: 'Chapter IV',
      chapterTitle: 'Artisanal Jacquards & Damasks',
      plateNumber: 'PLATE 07',
      accentColor: '#8C7426',
      accentBg: '#FAF6E8',
      heritageNote: 'Crafted on electronic Jacquard looms with supplementary metallic threads. The figured floral relief pattern floats gracefully above a structured twill ground.',
      recommendedUses: ['Ceremonial Robes', 'Statement Blazers', 'Corsetry', 'Architectural Cushions'],
      material: {
        id: 'jacquard',
        name: 'Gold Ivory Jacquard Brocade',
        category: 'FABRICS',
        subcategory: 'SPECIALTY FABRICS',
        section: 'SPECIALTY',
        image: '/assets/fabric-pack-4k/studio/07_Gold_Ivory_Jacquard_Brocade_4K.jpg',
        description: 'Complex figured damask motif woven with supplementary metallic yarn reliefs, high dimensional texture, and crisp body.',
        composition: 'Fine Silk Filament & Lurex Metallic Brocade',
        weave: 'Figured Jacquard Brocade',
        gsm: '290 GSM',
        width: '54"',
        productCode: 'CF-JAC-4K',
        variants: ['Gold on Warm Ivory', 'Silver on Obsidian', 'Champagne Pearl'],
      },
    },
    {
      id: 'pique-knit',
      chapterNumber: 'Chapter V',
      chapterTitle: 'Knits, Stretch & Performance',
      plateNumber: 'PLATE 08',
      accentColor: '#163152',
      accentBg: '#EDF3F9',
      heritageNote: 'Circular double-knit on fine gauge jersey cylinders. The raised waffle honeycomb geometry lifts the fabric away from the skin for optimal micro-climate airflow.',
      recommendedUses: ['Heritage Polo Shirts', 'Sporting Club Attire', 'Casual Henleys', 'Golf Apparel'],
      material: {
        id: 'pique-knit',
        name: 'Navy Blue Cotton Pique Knit',
        category: 'FABRICS',
        subcategory: 'SPECIALTY FABRICS',
        section: 'SPECIALTY',
        image: '/assets/fabric-pack-4k/studio/08_Navy_Blue_Cotton_Pique_Knit_4K.jpg',
        description: 'Double-knit honeycomb waffle structure engineered for moisture dispersion, breathability, and stable neckband recovery.',
        composition: '100% Combed Compact Cotton',
        weave: 'Double-Jersey Honeycomb Pique',
        gsm: '220 GSM',
        width: '72" Open Width',
        productCode: 'CF-PIQ-4K',
        variants: ['Nautical Deep Navy', 'Classic Optic White', 'Heather Slate'],
      },
    },
    {
      id: 'woven-poplin',
      chapterNumber: 'Chapter VI',
      chapterTitle: 'Loom-Woven Classics',
      plateNumber: 'PLATE 09',
      accentColor: '#6B4C38',
      accentBg: '#F5ECE3',
      heritageNote: 'High-density 60s combed cotton yarn woven in balanced plain interlacing. Pre-shrunk and mercerized for a crisp silky touch and clean needle penetration.',
      recommendedUses: ['Formal Dress Shirts', 'Laboratory Coats', 'Summer Dresses', 'Piped Pyjamas'],
      material: {
        id: 'poplin',
        name: 'Fine Combed Cotton Poplin',
        category: 'FABRICS',
        subcategory: 'WOVEN FABRICS',
        section: 'WOVEN',
        image: '/assets/materials/fabrics/plain.jpg',
        description: 'Crisp plain-woven cotton with smooth surface texture, clean drape, and excellent breathability for warm weather wear.',
        composition: '100% Combed Ring-Spun Cotton (60s Compact)',
        weave: 'Balanced Plain Weave',
        gsm: '115 GSM',
        width: '58"',
        productCode: 'CF-POP-101',
        variants: ['Clean White', 'Sky Blue', 'Pastel Pink', 'Grey Melange'],
      },
    },
    {
      id: 'chambray',
      chapterNumber: 'Chapter VI',
      chapterTitle: 'Loom-Woven Classics',
      plateNumber: 'PLATE 10',
      accentColor: '#284664',
      accentBg: '#ECF2F7',
      heritageNote: 'Dyed warp threads alternating with natural unbleached ecru weft yarns create the iconic frosted melange appearance. Lightweight, durable, and easily laundered.',
      recommendedUses: ['Work Shirting', 'Casual Dresses', 'Aprons & Smocks', 'Childrenswear'],
      material: {
        id: 'chambray',
        name: 'Yarn-Dyed Indigo Chambray',
        category: 'DENIM & CHAMBRAY',
        subcategory: 'CHAMBRAY',
        section: 'DENIM_CHAMBRAY',
        image: '/assets/materials/fabrics/chambray.jpg',
        description: 'Lightweight plain weave combining dyed warp and white weft threads for a distinctive speckled visual depth.',
        composition: '100% Combed Cotton',
        weave: 'Plain Weave with Frosted Slub',
        gsm: '140 GSM',
        width: '58"',
        productCode: 'CF-CHM-201',
        variants: ['Indigo Frost', 'Washed Sky', 'Charcoal Chambray'],
      },
    },
    {
      id: 'seersucker',
      chapterNumber: 'Chapter VII',
      chapterTitle: 'Textured Weaves & Corduroys',
      plateNumber: 'PLATE 11',
      accentColor: '#3A5A40',
      accentBg: '#EDF5EF',
      heritageNote: 'Created by differential warp tension during weaving (slack-tension weave). Alternating tight and slack warp yarns cause permanent puckering without chemical treatment.',
      recommendedUses: ['Summer Suits', 'Resort Shorts', 'Deck Jackets', 'Swim Trunks'],
      material: {
        id: 'seersucker',
        name: 'Slack-Tension Cotton Seersucker',
        category: 'FABRICS',
        subcategory: 'SPECIALTY FABRICS',
        section: 'SPECIALTY',
        image: '/assets/materials/fabrics/seersucker.jpg',
        description: 'Distinctive crinkled texture that sits naturally proud of the skin, promoting continuous airflow and requiring zero ironing.',
        composition: '100% Premium Long-Staple Cotton',
        weave: 'Slack-Tension Puckered Plain',
        gsm: '130 GSM',
        width: '56"',
        productCode: 'CF-SSR-301',
        variants: ['Blue & White Stripe', 'Beige Stripe', 'Solid Chalk White'],
      },
    },
    {
      id: 'needlework-laces',
      chapterNumber: 'Chapter VIII',
      chapterTitle: 'Artisanal Laces & Needlework',
      plateNumber: 'PLATE 12',
      accentColor: '#7A3858',
      accentBg: '#F8EEF3',
      heritageNote: 'Detailed embroidery needlework on soft fine-mesh ground. Intricate floral motifs with scalloped borders engineered for lingerie and delicate garment accents.',
      recommendedUses: ['Bridal Overlays', 'Cami Bodices', 'Cuff Edges', 'Heirloom Linens'],
      material: {
        id: 'cotton-lace',
        name: 'Heritage Cotton Needlework Lace',
        category: 'LACES',
        subcategory: 'EMBROIDERY LACE',
        section: 'LACES',
        image: '/assets/materials/laces/cotton.jpg',
        description: 'Fine needlework lace with raised floral cordonnet, delicate scalloped borders, and soft non-scratch skin contact.',
        composition: '100% Pure Cotton with Rayon Cordonnet',
        weave: 'Embroidered Tulle & Chemical Lace',
        gsm: '95 GSM',
        width: '18 mm – 160 mm',
        productCode: 'CF-LAC-401',
        variants: ['Ivory Chantilly', 'Antique Cream', 'Midnight Black'],
      },
    },
    {
      id: 'raschel-stretch-lace',
      chapterNumber: 'Chapter VIII',
      chapterTitle: 'Artisanal Laces & Needlework',
      plateNumber: 'PLATE 13',
      accentColor: '#5C387A',
      accentBg: '#F3EEF8',
      heritageNote: 'Warp-knitted on multi-bar Raschel knitting machines with elastomeric inlay. Exceptional two-way stretch recovery with flat bound edges.',
      recommendedUses: ['Bodywear', 'Athletic Lingerie', 'Leg Opening Trims', 'Fashion Panels'],
      material: {
        id: 'raschel-lace',
        name: 'Multi-Bar Raschel Stretch Lace',
        category: 'LACES',
        subcategory: 'LYCRA LACE',
        section: 'LACES',
        image: '/assets/materials/laces/raschel-lycra.jpg',
        description: 'Flexible stretch lace with high recovery modulus, smooth touch, and non-fray heat-stabilized edges.',
        composition: '88% Polyamide, 12% Spandex',
        weave: 'Raschel Warp Knit',
        gsm: '120 GSM',
        width: '35 mm – 220 mm',
        productCode: 'CF-LAC-402',
        variants: ['Soft Ecru', 'Onyx Black', 'Blush Nude'],
      },
    },
    {
      id: 'metal-zippers',
      chapterNumber: 'Chapter IX',
      chapterTitle: 'Garment Hardware & Precision Trims',
      plateNumber: 'PLATE 14',
      accentColor: '#4A4A4A',
      accentBg: '#F0F0F0',
      heritageNote: 'Heavy gauge stamped brass tooth chains precision-crimped onto woven herringbone cotton tape. Smooth gliding slider with automatic lock mechanism.',
      recommendedUses: ['Heavy Outerwear', 'Denim Fly Assemblies', 'Leather Goods', 'Work Jackets'],
      material: {
        id: 'metal-zipper',
        name: 'Antique Brass Interlocking Zipper',
        category: 'GARMENT ACCESSORIES',
        subcategory: 'ZIPPERS',
        section: 'ZIPPERS',
        image: '/assets/materials/accessories/metal.jpg',
        description: 'Stamped brass tooth chains on durable twill tape with high lateral burst strength and smooth antique patina.',
        composition: 'Solid Brass Teeth on 100% Polyester / Cotton Tape',
        weave: 'Woven Herringbone Tape (#5 / #8 Gauge)',
        gsm: 'Heavy Gauge Hardware',
        width: '#5 (6mm) / #8 (8mm)',
        productCode: 'CF-ZIP-501',
        variants: ['Antique Brass', 'Gunmetal Matte', 'Shiny Nickel'],
      },
    },
    {
      id: 'apparel-buttons',
      chapterNumber: 'Chapter IX',
      chapterTitle: 'Garment Hardware & Precision Trims',
      plateNumber: 'PLATE 15',
      accentColor: '#6B5838',
      accentBg: '#F7F2EA',
      heritageNote: 'Turned natural shell and horn blanks with laser-engraved edge detailing and polished dish center for clean buttonholing.',
      recommendedUses: ['Suits & Blazers', 'Luxury Shirting', 'Overcoats', 'Cardigans'],
      material: {
        id: 'horn-buttons',
        name: 'Natural Horn & Shell Apparel Buttons',
        category: 'GARMENT ACCESSORIES',
        subcategory: 'BUTTONS',
        section: 'BUTTONS',
        image: '/assets/materials/accessories/horn.jpg',
        description: 'Natural turned horn and mother-of-pearl buttons with heat-resistant resin options for industrial apparel laundering.',
        composition: 'Natural Water Buffalo Horn / Trocas Shell',
        weave: 'Precision Turned & Polished',
        gsm: 'Apparel Hardware',
        width: '14L (9mm) to 32L (20mm)',
        productCode: 'CF-BTN-601',
        variants: ['Mottled Amber Horn', 'White Mother-of-Pearl', 'Matte Charcoal'],
      },
    },
  ];

  const totalPages = spreads.length + 1; // Page 0 is Cover, Pages 1-15 are spreads

  // Navigation handlers
  const goToPage = useCallback(
    (target: number, dir: 'forward' | 'backward') => {
      if (isAnimating || target < 0 || target >= totalPages) return;
      setAnimDir(dir);
      setIsAnimating(true);
      flipbookAudio.playPageTurn();

      setTimeout(() => {
        setCurrentPage(target);
        setIsAnimating(false);
        setAnimDir(null);
      }, 380);
    },
    [isAnimating, totalPages]
  );

  const handleNext = useCallback(() => goToPage(currentPage + 1, 'forward'), [currentPage, goToPage]);
  const handlePrev = useCallback(() => goToPage(currentPage - 1, 'backward'), [currentPage, goToPage]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        if (zoomImage) setZoomImage(null);
        else if (showToc) setShowToc(false);
        else onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose, zoomImage, showToc]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const dist = touchStartX.current - touchEndX.current;
    if (dist > 50) handleNext();
    else if (dist < -50) handlePrev();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setCurrentPage(0);
      setShowToc(false);
      setZoomImage(null);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isCover = currentPage === 0;
  const currentSpread = !isCover ? spreads[currentPage - 1] : null;

  // Handle Enquire directly via existing enquiry modal — strictly NO drawer / 360 viewer
  const handleEnquireAction = (mat: DiscoveryMaterial) => {
    onEnquire(mat);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Classic Fashions Digital Lookbook"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 select-none"
      style={{
        backgroundColor: 'rgba(9, 8, 7, 0.94)',
        backdropFilter: 'blur(12px)',
        animation: 'lookbookFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── THE LUXURY PHYSICAL TEXTILE BOOK CHASSIS ── */}
      <div
        className="relative w-full max-w-6xl h-[92vh] max-h-[860px] bg-[#141210] flex flex-col rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.85)] border border-[#C5A07A]/30 overflow-hidden"
        style={{ perspective: '2000px' }}
      >
        {/* Leather spine accent with gold rivets */}
        <div className="absolute left-0 top-0 bottom-0 w-3 sm:w-4 bg-gradient-to-r from-[#0F0D0B] via-[#2A231C] to-[#141210] z-30 border-r border-[#D4AF37]/30 flex flex-col items-center justify-between py-6">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-sm" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-sm" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-sm" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-sm" />
        </div>

        {/* ── TOP LUXURY CONTROLS BAR ── */}
        <header className="pl-6 sm:pl-8 pr-4 sm:pr-6 py-3 border-b border-[#2C2721] bg-[#181512] flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#D4AF37] to-[#F3E2B8] text-[#181715] flex items-center justify-center shadow-md">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#D4AF37] font-bold">
                  CLASSIC FASHIONS
                </span>
                <span className="hidden sm:inline text-white/30">•</span>
                <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-wider text-white/70">
                  PRINTED TEXTILE ARCHIVE LOOKBOOK
                </span>
              </div>
              <span className="text-[11px] text-[#A69E92] font-serif block">
                {isCover ? 'Cover Edition' : `Plate ${currentPage} of ${totalPages - 1} — ${currentSpread?.material.name}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Table of contents button */}
            <button
              type="button"
              onClick={() => setShowToc(!showToc)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/90 border border-white/10 text-xs font-mono transition-colors"
              title="View Table of Contents"
            >
              <List className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">Index</span>
            </button>

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => setIsMuted(flipbookAudio.toggleMuted())}
              aria-label={isMuted ? 'Unmute page sound' : 'Mute page sound'}
              className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              title={isMuted ? 'Turn Sound On' : 'Turn Sound Off'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#D4AF37]" />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Lookbook"
              className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* ── MAIN BOOK SPREAD STAGE ── */}
        <main className="relative flex-1 bg-[#1A1714] overflow-hidden flex items-center justify-center p-2 sm:p-4 md:p-6">
          {/* Subtle Ambient Book Lighting */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(212, 175, 55, 0.06) 0%, rgba(15, 13, 11, 0.95) 75%)',
            }}
          />

          {/* ── THE BOOK PAGES CONTAINER ── */}
          <div
            className={`relative w-full h-full max-w-5xl rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-[#D4AF37]/20 transition-all duration-300 ${
              isAnimating
                ? animDir === 'forward'
                  ? 'animate-page-turn-forward'
                  : 'animate-page-turn-backward'
                : ''
            }`}
            style={{
              background: '#FAF7F2',
              boxShadow: '0 25px 60px -15px rgba(0,0,0,0.7), inset 0 0 40px rgba(0,0,0,0.04)',
            }}
          >
            {/* Center Book Gutter Shadow (Spine Crease) */}
            <div
              aria-hidden="true"
              className="hidden md:block absolute left-1/2 top-0 bottom-0 w-10 -translate-x-1/2 z-20 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to right, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.03) 40%, rgba(0,0,0,0.03) 60%, rgba(0,0,0,0.18) 100%)',
              }}
            />

            {/* ══════════════════════════════════════════════════════════════════════════
                CASE 1: COVER SPREAD (Hardcover Leather with Embossed Foil)
                ══════════════════════════════════════════════════════════════════════════ */}
            {isCover ? (
              <div className="w-full h-full flex flex-col md:flex-row bg-[#181614] text-[#FAF7F2] relative overflow-hidden">
                {/* Left Half: Leather Grain Texture with Brand Heraldry */}
                <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#2C2721] relative">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F5DE93] text-[10px] font-mono uppercase tracking-[0.25em]">
                      <span>★</span>
                      <span>AUTUMN / WINTER 2026 ARCHIVE</span>
                      <span>★</span>
                    </div>

                    <h1 className="font-['Cinzel',serif] text-4xl sm:text-5xl lg:text-6xl font-medium tracking-wide text-[#FAF7F2] leading-tight">
                      Classic<br />
                      <span className="text-[#D4AF37] italic font-serif">Fashions</span>
                    </h1>

                    <p className="font-serif text-sm sm:text-base text-[#C5A07A] italic leading-relaxed">
                      Compendium of Master Textile Swatches, Pure Weaves & Garment Accessories
                    </p>
                  </div>

                  {/* Golden Diamond Seal */}
                  <div className="my-6 py-6 border-y border-[#3A332A] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-[#D4AF37] to-[#F3E2B8] text-[#181715] font-bold flex items-center justify-center font-mono text-xs shadow-md">
                        CF
                      </div>
                      <div>
                        <span className="text-xs font-mono uppercase tracking-widest text-[#FAF7F2] block">
                          Tiruppur Atelier Desk
                        </span>
                        <span className="text-[11px] text-[#A69E92]">
                          Direct Mill Sourcing & Custom Fabric Weaving
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="group inline-flex items-center justify-center gap-3 w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E2B8] to-[#D4AF37] text-[#181715] font-mono text-xs font-bold uppercase tracking-[0.2em] shadow-[0_4px_20px_rgba(212,175,55,0.35)] hover:shadow-[0_6px_28px_rgba(212,175,55,0.55)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      <span>Open Lookbook</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                    <p className="text-center font-mono text-[10px] text-[#8C8479]">
                      Use ← → keys or click outer arrows to turn pages
                    </p>
                  </div>
                </div>

                {/* Right Half: Quick Chapter Index */}
                <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-between bg-[#141210] overflow-y-auto">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#2C2721] pb-3">
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
                        Table of Contents
                      </span>
                      <span className="font-mono text-[10px] text-[#8C8479]">
                        {spreads.length} Plates
                      </span>
                    </div>

                    <div className="space-y-2">
                      {spreads.map((s, idx) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => goToPage(idx + 1, 'forward')}
                          className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all text-left group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="font-mono text-[10px] text-[#D4AF37] font-bold shrink-0">
                              {s.plateNumber}
                            </span>
                            <span className="font-serif text-xs sm:text-sm text-[#FAF7F2] group-hover:text-[#D4AF37] transition-colors truncate">
                              {s.material.name}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-[#8C8479] uppercase shrink-0 ml-2">
                            {s.material.subcategory.slice(0, 10)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* ══════════════════════════════════════════════════════════════════════════
                  CASE 2: REALISTIC 2-PAGE SPREAD (Left: Fabric Plate | Right: Tech Specs)
                  ══════════════════════════════════════════════════════════════════════════ */
              currentSpread && (
                <div className="w-full h-full flex flex-col md:flex-row bg-[#FAF7F2] text-[#181715] overflow-y-auto md:overflow-hidden">
                  {/* ─────────────────────────────────────────────────────────────
                      LEFT PAGE: The Authentic High-Resolution Fabric Plate
                      ───────────────────────────────────────────────────────────── */}
                  <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E6DFD3] relative bg-[#F6F2EB]">
                    {/* Archival Plate Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-[#E0D7C8]">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.24em] font-bold text-[#82553E]">
                          {currentSpread.plateNumber}
                        </span>
                        <span className="text-[#C0B7A8]">•</span>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[#736B60]">
                          {currentSpread.chapterNumber}
                        </span>
                      </div>
                      <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-[#EAE2D5] text-[#5A5248] uppercase tracking-wider font-semibold">
                        AUTHENTIC MILL SWATCH
                      </span>
                    </div>

                    {/* The Large High-Resolution Fabric Photograph Plate */}
                    <div className="my-auto py-3">
                      <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#E8E1D5] border-2 border-[#D8CEBF] shadow-[0_10px_30px_rgba(0,0,0,0.12)] group">
                        <img
                          src={currentSpread.material.image}
                          alt={currentSpread.material.name}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />

                        {/* Tactile Paper / Fabric Border Sheen */}
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/10 shadow-inner"
                        />

                        {/* Top Fabric Specimen Clip */}
                        <div
                          aria-hidden="true"
                          className="absolute -top-1 left-1/2 -translate-x-1/2 w-10 h-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F3E2B8] shadow-xs pointer-events-none"
                        />

                        {/* Corner Zoom Button */}
                        <button
                          type="button"
                          onClick={() => setZoomImage(currentSpread.material.image)}
                          className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/75 hover:bg-black text-white backdrop-blur-xs transition-transform hover:scale-110 shadow-lg cursor-pointer"
                          title="Inspect High-Res Macro Texture"
                        >
                          <ZoomIn className="w-4 h-4 text-[#D4AF37]" />
                        </button>
                      </div>

                      {/* Swatch Caption Underneath */}
                      <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[#8C8479]">
                        <span className="truncate">Ref Code: {currentSpread.material.productCode || 'CF-TEX-SAMPLE'}</span>
                        <span className="font-bold text-[#82553E] uppercase">{currentSpread.material.gsm || 'Wholesale'}</span>
                      </div>
                    </div>

                    {/* Heritage Milling Footnote */}
                    <div className="pt-3 border-t border-[#E0D7C8] text-[11px] text-[#6E665B] italic leading-relaxed">
                      "{currentSpread.heritageNote}"
                    </div>
                  </div>

                  {/* ─────────────────────────────────────────────────────────────
                      RIGHT PAGE: Curated Specifications, Hand Feel & Enquire CTA
                      ───────────────────────────────────────────────────────────── */}
                  <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-[#FAF7F2] overflow-y-auto">
                    {/* Chapter & Page Counter */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-[#E6DFD3]">
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-[#82553E]">
                          {currentSpread.chapterTitle}
                        </span>
                        <span className="font-mono text-xs font-bold text-[#181715]">
                          PAGE {String(currentPage).padStart(2, '0')} / {String(totalPages - 1).padStart(2, '0')}
                        </span>
                      </div>

                      {/* Fabric Title */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8C8479]">
                          {currentSpread.material.subcategory}
                        </span>
                        <h2 className="font-['Cinzel',serif] text-2xl sm:text-3xl font-medium text-[#181715] tracking-tight leading-tight">
                          {currentSpread.material.name}
                        </h2>
                      </div>

                      {/* Curated Description */}
                      <p className="text-xs sm:text-sm text-[#5A534A] leading-relaxed font-sans">
                        {currentSpread.material.description}
                      </p>

                      {/* Comprehensive Physical Specifications Table */}
                      <div className="bg-[#F5F0E6] rounded-xl p-4 sm:p-5 border border-[#E6DFD3] space-y-2.5">
                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-bold text-[#82553E] block pb-1 border-b border-[#E2D8CA]">
                          Physical Yarn & Loom Specifications
                        </span>

                        <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs font-mono">
                          {currentSpread.material.composition && (
                            <div>
                              <span className="text-[#8C8479] text-[10px] block uppercase">Composition</span>
                              <span className="text-[#181715] font-semibold text-[11px] block mt-0.5 truncate">
                                {currentSpread.material.composition}
                              </span>
                            </div>
                          )}

                          {currentSpread.material.weave && (
                            <div>
                              <span className="text-[#8C8479] text-[10px] block uppercase">Weave Structure</span>
                              <span className="text-[#181715] font-semibold text-[11px] block mt-0.5 truncate">
                                {currentSpread.material.weave}
                              </span>
                            </div>
                          )}

                          {currentSpread.material.gsm && (
                            <div>
                              <span className="text-[#8C8479] text-[10px] block uppercase">Weight / GSM</span>
                              <span className="text-[#181715] font-semibold text-[11px] block mt-0.5">
                                {currentSpread.material.gsm}
                              </span>
                            </div>
                          )}

                          {currentSpread.material.width && (
                            <div>
                              <span className="text-[#8C8479] text-[10px] block uppercase">Usable Width</span>
                              <span className="text-[#181715] font-semibold text-[11px] block mt-0.5">
                                {currentSpread.material.width}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Recommended Garment Applications */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8C8479] font-semibold block">
                          Tailoring & Garment Uses:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {currentSpread.recommendedUses.map((use, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-sans px-2.5 py-0.5 rounded-full bg-white border border-[#DDD5C7] text-[#4A433A]"
                            >
                              {use}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* ─────────────────────────────────────────────────────────────
                        THE CLEAN "ENQUIRE ABOUT THIS MATERIAL" CTA
                        Strictly triggers existing enquiry modal directly
                        ───────────────────────────────────────────────────────────── */}
                    <div className="pt-6 mt-4 border-t border-[#E6DFD3] space-y-2">
                      <button
                        type="button"
                        onClick={() => handleEnquireAction(currentSpread.material)}
                        className="group w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-full bg-gradient-to-r from-[#181715] via-[#2A2318] to-[#181715] text-[#FAF7F2] border border-[#D4AF37] hover:border-[#F3E2B8] text-xs font-mono font-bold uppercase tracking-[0.18em] shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_24px_rgba(212,175,55,0.4)] transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                        <span>Enquire About This Material</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </button>

                      <div className="flex items-center justify-between text-[10px] font-mono text-[#8C8479]">
                        <span>✓ Direct Mill Sourcing</span>
                        <span>✓ Custom Laboratory Lab-Dips</span>
                        <span>✓ Export Grade</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          {/* ── LEFT & RIGHT PAGE TURN BUTTONS ON BOOK MARGINS ── */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentPage === 0 || isAnimating}
            className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#181512]/90 hover:bg-[#25201A] text-white border border-[#D4AF37]/40 flex items-center justify-center transition-all hover:scale-110 shadow-2xl z-30 cursor-pointer ${
              currentPage === 0 ? 'opacity-20 pointer-events-none' : 'opacity-100'
            }`}
            title="Previous Page (Left Arrow)"
          >
            <ChevronLeft className="w-5 h-5 text-[#D4AF37]" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentPage === totalPages - 1 || isAnimating}
            className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#181512]/90 hover:bg-[#25201A] text-white border border-[#D4AF37]/40 flex items-center justify-center transition-all hover:scale-110 shadow-2xl z-30 cursor-pointer ${
              currentPage === totalPages - 1 ? 'opacity-20 pointer-events-none' : 'opacity-100'
            }`}
            title="Next Page (Right Arrow)"
          >
            <ChevronRight className="w-5 h-5 text-[#D4AF37]" />
          </button>
        </main>

        {/* ── BOTTOM DOCK CONTROLS ── */}
        <footer className="pl-6 sm:pl-8 pr-4 sm:pr-6 py-3 border-t border-[#2C2721] bg-[#181512] flex items-center justify-between shrink-0 z-20">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentPage === 0}
            className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider border transition-colors ${
              currentPage === 0
                ? 'opacity-30 border-white/10 text-white/40 cursor-not-allowed'
                : 'border-white/20 text-white/90 hover:bg-white/10 hover:border-[#D4AF37] cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{currentPage === 1 ? 'Cover' : 'Prev Page'}</span>
          </button>

          {/* Interactive Page Progress Dots */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-[240px] sm:max-w-md no-scrollbar py-1">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goToPage(idx, idx > currentPage ? 'forward' : 'backward')}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentPage
                    ? 'w-6 h-2 bg-[#D4AF37] shadow-sm'
                    : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Jump to page ${idx}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
            className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider bg-gradient-to-r from-[#D4AF37] to-[#F3E2B8] text-[#181715] font-bold shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              currentPage === totalPages - 1 ? 'opacity-30 pointer-events-none' : ''
            }`}
          >
            <span className="hidden sm:inline">{currentPage === 0 ? 'Open Book' : 'Next Page'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </footer>

        {/* ── TABLE OF CONTENTS POPUP OVERLAY ── */}
        {showToc && (
          <div
            className="absolute inset-0 z-40 bg-[#12100E]/95 backdrop-blur-md p-6 sm:p-10 flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <List className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="font-['Cinzel',serif] text-xl font-normal text-white">
                  Lookbook Spreads Index
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowToc(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => {
                  goToPage(0, 'backward');
                  setShowToc(false);
                }}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  currentPage === 0
                    ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white'
                    : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                }`}
              >
                <span className="font-mono text-[10px] text-[#D4AF37] font-bold block uppercase">
                  COVER
                </span>
                <span className="font-serif text-sm font-medium block text-white mt-1">
                  Edition Cover & Preface
                </span>
              </button>

              {spreads.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    goToPage(idx + 1, idx + 1 > currentPage ? 'forward' : 'backward');
                    setShowToc(false);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    currentPage === idx + 1
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white'
                      : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                  }`}
                >
                  <span className="font-mono text-[10px] text-[#D4AF37] font-bold block">
                    {s.plateNumber} · {s.chapterNumber}
                  </span>
                  <span className="font-serif text-sm font-medium block text-white mt-1 truncate">
                    {s.material.name}
                  </span>
                  <span className="font-mono text-[10px] text-white/50 block mt-0.5">
                    {s.material.subcategory} · {s.material.gsm || 'Wholesale'}
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 text-center font-mono text-xs text-white/50">
              Select any plate to jump directly
            </div>
          </div>
        )}

        {/* ── FULLSCREEN TEXTURE ZOOM LIGHTBOX ── */}
        {zoomImage && (
          <div
            className="absolute inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 select-none animate-in fade-in duration-200"
            onClick={() => setZoomImage(null)}
          >
            <button
              type="button"
              onClick={() => setZoomImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative max-h-[85vh] max-w-[90vw] overflow-hidden rounded-xl border border-white/20 shadow-2xl">
              <img src={zoomImage} alt="High resolution macro texture" className="max-h-[85vh] max-w-[90vw] object-contain" />
            </div>
            <span className="mt-3 font-mono text-xs text-[#D4AF37] uppercase tracking-widest">
              High Definition Studio Texture Specimen
            </span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes lookbookFadeIn {
          from { opacity: 0; transform: scale(0.96) }
          to { opacity: 1; transform: scale(1) }
        }
        @keyframes pageTurnForward {
          0% { transform: perspective(2000px) rotateY(0deg); opacity: 1; }
          50% { transform: perspective(2000px) rotateY(-8deg) translateX(30px) scale(0.97); opacity: 0.6; }
          100% { transform: perspective(2000px) rotateY(0deg); opacity: 1; }
        }
        @keyframes pageTurnBackward {
          0% { transform: perspective(2000px) rotateY(0deg); opacity: 1; }
          50% { transform: perspective(2000px) rotateY(8deg) translateX(-30px) scale(0.97); opacity: 0.6; }
          100% { transform: perspective(2000px) rotateY(0deg); opacity: 1; }
        }
        .animate-page-turn-forward {
          animation: pageTurnForward 0.38s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-page-turn-backward {
          animation: pageTurnBackward 0.38s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};
