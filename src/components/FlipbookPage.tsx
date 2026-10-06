import React from 'react';
import { FlipbookPageItem } from '../data/flipbookData.ts';
import { Product } from '../types.ts';
import {
  ExternalLink,
  Eye,
  Plus,
  Send,
  Check,
  Layers,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';

interface FlipbookPageProps {
  page: FlipbookPageItem;
  side: 'left' | 'right';
  onViewDetails: (product: Product) => void;
  onEnquire: (product: Product) => void;
  onAddToCollection?: (product: Product) => void;
  onRequestMaterial?: () => void;
  onJumpToChapter?: (chapterId: string) => void;
  isInCollection?: (productId: string) => boolean;
}

export const FlipbookPage: React.FC<FlipbookPageProps> = ({
  page,
  side,
  onViewDetails,
  onEnquire,
  onAddToCollection,
  onRequestMaterial,
  onJumpToChapter,
  isInCollection,
}) => {
  // ----------------------------------------------------
  // RENDER: EDITORIAL WELCOME (LEFT)
  // ----------------------------------------------------
  if (page.type === 'editorial-welcome-left') {
    return (
      <div className="h-full flex flex-col justify-between p-6 sm:p-10 select-none">
        <div>
          {/* Running Header */}
          <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-6 text-xs text-stone-500 font-mono tracking-widest uppercase">
            <span>Classic Fashions • Vol. 2026</span>
            <span>Page {page.pageNumber}</span>
          </div>

          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-amber-800 font-medium font-mono">
              Company Heritage
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
              A Legacy of Textile Precision in Tiruppur
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pt-2">
              <span className="float-left text-4xl sm:text-5xl font-serif font-bold text-stone-900 leading-none pr-3 pt-1">
                E
              </span>
              stablished in the heart of Tiruppur’s textile cluster, Classic Fashions has served apparel manufacturers, export houses, and boutique designers with premium base fabrics, precision-slit tapes, high-density tags, and engineered garment accessories.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Every quality listed in this catalogue is produced from verified mill warp and weft counts. We maintain zero tolerance for inaccurate yarn specifications, ensuring reproducible fabric density, consistent shrinkage rates, and reliable garment yield.
            </p>
          </div>

          {/* Key Milestones / Facts */}
          <div className="mt-8 border-t border-stone-200 pt-5 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-800 mt-1.5 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider font-mono">
                  100% Authentic Mill Specifications
                </h4>
                <p className="text-xs text-stone-500">
                  Every GSM, width, and construction directly matches verified laboratory test lists.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-800 mt-1.5 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider font-mono">
                  Tiruppur Ready Stock & Custom Sourcing
                </h4>
                <p className="text-xs text-stone-500">
                  Direct warehouse inventory for immediate garment sampling or bulk production roll delivery.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-800 mt-1.5 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider font-mono">
                  Physical Swatch Service
                </h4>
                <p className="text-xs text-stone-500">
                  Touch and inspect before you cut. Sample headers and yardage dispatched across India.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Running Footer */}
        <div className="border-t border-stone-200 pt-3 text-[11px] text-stone-400 flex items-center justify-between font-mono">
          <span>Tiruppur Fabric Exchange</span>
          <span>Authentic Woven Cloth</span>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER: EDITORIAL WELCOME (RIGHT)
  // ----------------------------------------------------
  if (page.type === 'editorial-welcome-right') {
    return (
      <div className="h-full flex flex-col justify-between p-6 sm:p-10 select-none">
        <div>
          {/* Running Header */}
          <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-6 text-xs text-stone-500 font-mono tracking-widest uppercase">
            <span>Catalogue Guide</span>
            <span>Page {page.pageNumber}</span>
          </div>

          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-amber-800 font-medium font-mono">
              Quality Assurance
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
              Tested Standards & Sourcing Guide
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Our digital lookbook is indexed chapter-by-chapter. Use the physical bookmark tabs on the top to navigate between weaves, laces, denims, and accessory collections.
            </p>
          </div>

          {/* Assurance Pillars */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="p-3 bg-stone-100/70 border border-stone-200/80 rounded">
              <span className="block text-[11px] font-mono font-semibold text-stone-800 uppercase tracking-wider">
                Yarn Verification
              </span>
              <p className="text-[11px] text-stone-500 mt-1">
                KCW, CCW, and CW ring-spun twist integrity checked.
              </p>
            </div>
            <div className="p-3 bg-stone-100/70 border border-stone-200/80 rounded">
              <span className="block text-[11px] font-mono font-semibold text-stone-800 uppercase tracking-wider">
                Conditioned GSM
              </span>
              <p className="text-[11px] text-stone-500 mt-1">
                Standard atmospheric weight measurement on finished grey bolts.
              </p>
            </div>
            <div className="p-3 bg-stone-100/70 border border-stone-200/80 rounded">
              <span className="block text-[11px] font-mono font-semibold text-stone-800 uppercase tracking-wider">
                Selvage Stability
              </span>
              <p className="text-[11px] text-stone-500 mt-1">
                Tuck-in and closed edges designed for automated spreaders.
              </p>
            </div>
            <div className="p-3 bg-stone-100/70 border border-stone-200/80 rounded">
              <span className="block text-[11px] font-mono font-semibold text-stone-800 uppercase tracking-wider">
                Loom Consistency
              </span>
              <p className="text-[11px] text-stone-500 mt-1">
                Airjet and Sulzer shuttleless high-sett precision.
              </p>
            </div>
          </div>

          {/* Quick chapter jump links */}
          <div className="mt-6 border-t border-stone-200 pt-4">
            <span className="block text-[11px] font-mono text-stone-500 uppercase tracking-wider mb-2">
              Fast Navigation Index:
            </span>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <button
                onClick={() => onJumpToChapter?.('laces')}
                className="px-2.5 py-1 bg-stone-200/70 hover:bg-amber-100 hover:text-amber-900 rounded text-stone-700 transition-colors"
              >
                Laces (p.4)
              </button>
              <button
                onClick={() => onJumpToChapter?.('plain')}
                className="px-2.5 py-1 bg-stone-200/70 hover:bg-amber-100 hover:text-amber-900 rounded text-stone-700 transition-colors"
              >
                Plain (p.8)
              </button>
              <button
                onClick={() => onJumpToChapter?.('twill')}
                className="px-2.5 py-1 bg-stone-200/70 hover:bg-amber-100 hover:text-amber-900 rounded text-stone-700 transition-colors"
              >
                Twill (p.10)
              </button>
              <button
                onClick={() => onJumpToChapter?.('drill')}
                className="px-2.5 py-1 bg-stone-200/70 hover:bg-amber-100 hover:text-amber-900 rounded text-stone-700 transition-colors"
              >
                Drill (p.12)
              </button>
              <button
                onClick={() => onJumpToChapter?.('duck')}
                className="px-2.5 py-1 bg-stone-200/70 hover:bg-amber-100 hover:text-amber-900 rounded text-stone-700 transition-colors"
              >
                Duck (p.14)
              </button>
              <button
                onClick={() => onJumpToChapter?.('satin')}
                className="px-2.5 py-1 bg-stone-200/70 hover:bg-amber-100 hover:text-amber-900 rounded text-stone-700 transition-colors"
              >
                Satin (p.16)
              </button>
            </div>
          </div>
        </div>

        {/* Running Footer */}
        <div className="border-t border-stone-200 pt-3 text-[11px] text-stone-400 flex items-center justify-between font-mono">
          <span>Quality Assurance Division</span>
          <span>Tiruppur Hub</span>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER: EDITORIAL FABRICS INTRO (LEFT)
  // ----------------------------------------------------
  if (page.type === 'editorial-fabrics-left') {
    return (
      <div className="h-full flex flex-col justify-between p-6 sm:p-10 select-none">
        <div>
          {/* Running Header */}
          <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-6 text-xs text-stone-500 font-mono tracking-widest uppercase">
            <span>Fabrics Introduction</span>
            <span>Page {page.pageNumber}</span>
          </div>

          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-amber-800 font-medium font-mono">
              Textile Engineering
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
              Woven Constructions & Yarn Sett
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Woven fabrics are engineered through the orthogonal interlacing of warp ends and weft picks. Every fabric in the Classic Fashions repository is classified by its authentic weave structure and yarn count:
            </p>
          </div>

          {/* Weave classifications list */}
          <div className="mt-6 space-y-3 text-xs">
            <div className="border-l-2 border-amber-800 pl-3">
              <span className="font-mono font-semibold text-stone-900 uppercase">
                Plain Weave (1/1)
              </span>
              <p className="text-stone-500 mt-0.5">
                The most fundamental interlacing. Offers highest structural firmness, uniform surface for printing, and optimal stability for pocket bags and shirting toiles.
              </p>
            </div>
            <div className="border-l-2 border-stone-400 pl-3">
              <span className="font-mono font-semibold text-stone-900 uppercase">
                Twill Weave (2/1 & 2/2)
              </span>
              <p className="text-stone-500 mt-0.5">
                Diagonal ridge (wale) structure providing superior flexibility, high tear resistance, and comfortable drape for chinos, trousers, and bottomwear.
              </p>
            </div>
            <div className="border-l-2 border-stone-400 pl-3">
              <span className="font-mono font-semibold text-stone-900 uppercase">
                Drill Weave (3/1 Heavy)
              </span>
              <p className="text-stone-500 mt-0.5">
                Dense warp-faced twill construction designed for harsh industrial workwear, cargo pockets, and durable apparel foundations.
              </p>
            </div>
            <div className="border-l-2 border-stone-400 pl-3">
              <span className="font-mono font-semibold text-stone-900 uppercase">
                Duck Canvas
              </span>
              <p className="text-stone-500 mt-0.5">
                Square, heavy-duty plain weave utilizing plied yarns. Exceptional puncture resistance for bags, luggage, and utility outerwear.
              </p>
            </div>
            <div className="border-l-2 border-stone-400 pl-3">
              <span className="font-mono font-semibold text-stone-900 uppercase">
                Satin & Sateen (4/1 & 5/1 Float)
              </span>
              <p className="text-stone-500 mt-0.5">
                Extended yarn floats creating a lustrous, silky sheen and luxurious hand-feel for executive shirting and fine apparel.
              </p>
            </div>
          </div>
        </div>

        {/* Running Footer */}
        <div className="border-t border-stone-200 pt-3 text-[11px] text-stone-400 flex items-center justify-between font-mono">
          <span>Weave Architecture Reference</span>
          <span>Classic Fashions</span>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER: EDITORIAL FABRICS INTRO (RIGHT)
  // ----------------------------------------------------
  if (page.type === 'editorial-fabrics-right') {
    return (
      <div className="h-full flex flex-col justify-between p-6 sm:p-10 select-none">
        <div>
          {/* Running Header */}
          <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-6 text-xs text-stone-500 font-mono tracking-widest uppercase">
            <span>Loom Technologies</span>
            <span>Page {page.pageNumber}</span>
          </div>

          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-amber-800 font-medium font-mono">
              Manufacturing Technology
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
              Looms & Selvage Standards
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              The production loom dictates yarn tension consistency, pick insertion uniformity, and selvedge stability.
            </p>
          </div>

          {/* Loom Grid */}
          <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-stone-100/70 border border-stone-200/80 rounded">
              <span className="font-mono font-semibold text-stone-900 uppercase block">
                Airjet Looms
              </span>
              <p className="text-stone-500 text-[11px] mt-1">
                High-pressure pneumatic insertion. Ultra-clean tuck-in selvedges, ideal for wide-width export poplins and twills.
              </p>
            </div>
            <div className="p-3 bg-stone-100/70 border border-stone-200/80 rounded">
              <span className="font-mono font-semibold text-stone-900 uppercase block">
                Sulzer Shuttleless
              </span>
              <p className="text-stone-500 text-[11px] mt-1">
                Heavy projectile insertion. High warp tension stability for medium and heavy gada and duck canvas.
              </p>
            </div>
            <div className="p-3 bg-stone-100/70 border border-stone-200/80 rounded">
              <span className="font-mono font-semibold text-stone-900 uppercase block">
                Rapier Looms
              </span>
              <p className="text-stone-500 text-[11px] mt-1">
                Flexible yarn carriers accommodating varied counts and fancy yarns with minimal friction.
              </p>
            </div>
            <div className="p-3 bg-stone-100/70 border border-stone-200/80 rounded">
              <span className="font-mono font-semibold text-stone-900 uppercase block">
                Auto Shuttle Looms
              </span>
              <p className="text-stone-500 text-[11px] mt-1">
                Traditional closed selvedges and leno weave edges for rugged utility applications.
              </p>
            </div>
          </div>

          {/* Direct CTA */}
          <div className="mt-8 p-4 bg-amber-50/50 border border-amber-200/60 rounded">
            <h4 className="text-xs font-semibold text-amber-950 font-serif">
              Begin Browsing Fabric Varieties
            </h4>
            <p className="text-[11px] text-amber-800/80 mt-1">
              Turn the page or click below to examine our authenticated Plain Weaves in 48", 50", 54", and 63" widths.
            </p>
            <button
              onClick={() => onJumpToChapter?.('plain')}
              className="mt-3 inline-flex items-center gap-2 text-xs font-mono font-medium text-amber-900 hover:text-amber-950 underline"
            >
              <span>Turn to Plain Fabrics (Pages 8–9)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Running Footer */}
        <div className="border-t border-stone-200 pt-3 text-[11px] text-stone-400 flex items-center justify-between font-mono">
          <span>Loom & Selvedge Division</span>
          <span>Tiruppur Quality Control</span>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER: EDITORIAL INQUIRY (LEFT)
  // ----------------------------------------------------
  if (page.type === 'editorial-inquiry-left') {
    return (
      <div className="h-full flex flex-col justify-between p-6 sm:p-10 select-none">
        <div>
          {/* Running Header */}
          <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-6 text-xs text-stone-500 font-mono tracking-widest uppercase">
            <span>Sampling Desk</span>
            <span>Page {page.pageNumber}</span>
          </div>

          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-amber-800 font-medium font-mono">
              Physical Swatch Service
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
              Request Fabric Swatch Box
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              We understand that tactile assessment is crucial. Classic Fashions prepares curated swatch cards, cutting toiles, and physical binder swatches for garment manufacturers and exporters.
            </p>
          </div>

          <div className="mt-6 space-y-3 text-xs">
            <div className="p-3 bg-stone-100/70 border border-stone-200/80 rounded">
              <span className="font-mono font-semibold text-stone-900 uppercase block">
                Standard Swatch Pack
              </span>
              <p className="text-stone-500 text-[11px] mt-0.5">
                Mounted 15×15 cm fabric swatches with complete technical specifications and yarn count tags.
              </p>
            </div>
            <div className="p-3 bg-stone-100/70 border border-stone-200/80 rounded">
              <span className="font-mono font-semibold text-stone-900 uppercase block">
                Sampling Yardage Toiles
              </span>
              <p className="text-stone-500 text-[11px] mt-0.5">
                1 to 5 meter test cuts dispatched for pattern cutting, fit testing, and sample garment washing.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => onRequestMaterial?.()}
              className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-mono font-medium tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Custom Material Request</span>
            </button>
          </div>
        </div>

        {/* Running Footer */}
        <div className="border-t border-stone-200 pt-3 text-[11px] text-stone-400 flex items-center justify-between font-mono">
          <span>Swatch Sourcing Protocol</span>
          <span>Tiruppur Hub</span>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER: EDITORIAL INQUIRY (RIGHT)
  // ----------------------------------------------------
  if (page.type === 'editorial-inquiry-right') {
    return (
      <div className="h-full flex flex-col justify-between p-6 sm:p-10 select-none">
        <div>
          {/* Running Header */}
          <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-6 text-xs text-stone-500 font-mono tracking-widest uppercase">
            <span>Direct Mill Contact</span>
            <span>Page {page.pageNumber}</span>
          </div>

          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-amber-800 font-medium font-mono">
              Wholesale Desk
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
              Connect with Our Mill Team
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Visit our Tiruppur facility or contact our commercial sales desk directly for bulk roll quotations, contract weaving, or custom slit tape production.
            </p>
          </div>

          {/* Contact Details */}
          <div className="mt-6 space-y-3 text-xs font-mono">
            <div className="flex items-start gap-3 p-3 bg-stone-100/70 border border-stone-200/80 rounded">
              <MapPin className="w-4 h-4 text-amber-800 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-semibold text-stone-900 block">
                  Tiruppur Facility
                </span>
                <span className="text-stone-500 text-[11px]">
                  Classic Fashions, Main Textile District, Tiruppur, Tamil Nadu – 641602, India
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-stone-100/70 border border-stone-200/80 rounded">
              <Phone className="w-4 h-4 text-amber-800 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-semibold text-stone-900 block">
                  Direct Mill Line
                </span>
                <span className="text-stone-500 text-[11px]">
                  +91 94432 00000 / +91 421 2200000
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-stone-100/70 border border-stone-200/80 rounded">
              <Mail className="w-4 h-4 text-amber-800 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-semibold text-stone-900 block">
                  Commercial Orders
                </span>
                <span className="text-stone-500 text-[11px]">
                  sales@classicfashions.in / info@classicfashions.in
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Running Footer */}
        <div className="border-t border-stone-200 pt-3 text-[11px] text-stone-400 flex items-center justify-between font-mono">
          <span>End of Volume 2026 Archive</span>
          <span>Classic Fashions</span>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER: MATERIAL VARIETIES SPREAD (1 to 3 items per page)
  // ----------------------------------------------------
  const productList = page.products || [];

  return (
    <div className="h-full flex flex-col justify-between p-4 sm:p-7 select-none overflow-y-auto">
      <div>
        {/* Running Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-2.5 mb-4 text-xs text-stone-500 font-mono tracking-widest uppercase">
          <span className="truncate pr-2">{page.section}</span>
          <span className="flex-shrink-0">Page {page.pageNumber}</span>
        </div>

        {/* Section Heading */}
        <div className="mb-4">
          <span className="text-[11px] font-mono text-amber-800 uppercase tracking-widest font-medium block">
            {page.section}
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight leading-snug">
            {page.title}
          </h3>
          {page.subtitle && (
            <p className="text-xs text-stone-500 mt-1 line-clamp-1">{page.subtitle}</p>
          )}
        </div>

        {/* Material Items List */}
        <div className="space-y-4">
          {productList.map((product) => {
            const hasTechnicalSpecs = Boolean(product.yarnConstruction || product.weave);
            const inCollection = isInCollection ? isInCollection(product.id) : false;

            return (
              <div
                key={product.id}
                className="bg-white border border-stone-200/90 rounded-md p-3 sm:p-4 shadow-sm hover:border-amber-700/40 transition-colors"
              >
                {/* Top Material Title & Yarn Construction */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 mb-2">
                  <div>
                    <h4 className="text-sm sm:text-base font-serif font-bold text-stone-900 leading-tight">
                      {product.name}
                    </h4>
                    {product.yarnConstruction && (
                      <span className="text-xs font-mono font-semibold text-amber-900 tracking-wider">
                        {product.yarnConstruction}
                      </span>
                    )}
                  </div>
                  {product.productCode && (
                    <span className="text-[10px] font-mono text-stone-400 self-start">
                      {product.productCode}
                    </span>
                  )}
                </div>

                {/* Raw Material Visual & Specs Container */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  {/* Left: Raw Fabric Image Preview */}
                  <div className="sm:col-span-4 relative group overflow-hidden rounded bg-stone-100 aspect-video sm:aspect-square flex-shrink-0">
                    <img
                      src={product.images[0] || '/assets/materials/fabrics.jpg'}
                      alt={product.imageAlt || product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => onViewDetails(product)}
                        className="px-2 py-1 bg-white/95 text-stone-900 text-[10px] font-mono rounded shadow flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </div>
                  </div>

                  {/* Right: Technical Specs Table */}
                  <div className="sm:col-span-8 text-xs font-mono">
                    {hasTechnicalSpecs ? (
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 bg-stone-50/80 p-2 rounded border border-stone-200/60 text-[11px]">
                        <div>
                          <span className="text-stone-400 block text-[9px] uppercase tracking-wider">
                            Width
                          </span>
                          <span className="font-semibold text-stone-800">
                            {product.width || '63" Standard'}
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[9px] uppercase tracking-wider">
                            GSM / Weight
                          </span>
                          <span className="font-semibold text-stone-800">
                            {product.gsm || 'Loomstate Weight'}
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[9px] uppercase tracking-wider">
                            Quality
                          </span>
                          <span className="font-semibold text-stone-800">
                            {product.quality || 'Ring × Ring'}
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[9px] uppercase tracking-wider">
                            Weave
                          </span>
                          <span className="font-semibold text-stone-800">
                            {product.weave || product.subcategory || 'Woven'}
                          </span>
                        </div>
                        {product.loom && (
                          <div className="col-span-2 pt-0.5 border-t border-stone-200/60 flex items-center justify-between text-[10px]">
                            <span className="text-stone-400">Loom Standard:</span>
                            <span className="text-stone-700 font-medium">
                              {product.loom} {product.selvage ? `• ${product.selvage}` : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-stone-600 text-xs leading-relaxed line-clamp-3">
                        {product.description}
                      </p>
                    )}

                    {/* Applications / Colours meta tags (clean unboxed text with separators) */}
                    {product.applications && product.applications.length > 0 && (
                      <div className="mt-1.5 text-[10px] text-stone-500 font-sans truncate">
                        <span className="font-mono text-stone-400 mr-1">Uses:</span>
                        {product.applications.slice(0, 2).join(' · ')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Interactive Action Controls */}
                <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onViewDetails(product)}
                      className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-[11px] font-mono transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3 text-stone-600" />
                      <span>Inspect 3D</span>
                    </button>
                    {onAddToCollection && (
                      <button
                        onClick={() => onAddToCollection(product)}
                        className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors flex items-center gap-1 ${
                          inCollection
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                        }`}
                        title={inCollection ? 'Saved in swatch collection' : 'Add to collection'}
                      >
                        {inCollection ? (
                          <>
                            <Check className="w-3 h-3 text-amber-800" />
                            <span>Saved</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3 text-stone-500" />
                            <span>+ Swatch</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => onEnquire(product)}
                    className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded text-[11px] font-mono font-medium transition-colors flex items-center gap-1"
                  >
                    <span>Enquire</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Running Footer */}
      <div className="border-t border-stone-200 pt-3 mt-4 text-[11px] text-stone-400 flex items-center justify-between font-mono">
        <span>Classic Fashions • Tiruppur</span>
        <span>Raw Material Catalogue</span>
      </div>
    </div>
  );
};
