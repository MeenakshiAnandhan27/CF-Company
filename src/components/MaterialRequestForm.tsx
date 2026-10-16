import React, { useState, useEffect, useRef } from 'react';
import {
  MaterialRequestCategory,
  MaterialRequestData,
  MaterialRequestSubmission,
  Product,
} from '../types.ts';
import {
  Upload,
  Check,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Send,
  X,
  Phone,
  Mail,
  Building,
  MapPin,
  Plus,
  Trash2,
  Grid,
  CircleDot,
  FileText,
  Package,
  AlertCircle,
  ExternalLink,
  User,
  Scissors,
  Pencil,
  ShoppingBag,
} from 'lucide-react';

interface MaterialRequestFormProps {
  initialData?: Partial<MaterialRequestData>;
  similarProduct?: Product | null;
  onExploreCatalogue: () => void;
  onReachUs: () => void;
}

interface UploadedFile {
  name: string;
  dataUrl: string;
  sizeKb: number;
}

interface KitItem {
  id: string;
  name: string;
  categoryLabel: string;
  image: string;
  category: MaterialRequestCategory;
  defaultSpecs?: Record<string, string | undefined>;
}

// 3 Main Material Discovery Pillars
type MainDiscoveryCategory = 'fabric' | 'accessories' | 'custom';

interface MainCategoryCard {
  id: MainDiscoveryCategory;
  title: string;
  subtitle: string;
  image: string;
  iconBg: string;
  mappedCategory: MaterialRequestCategory;
}

const MAIN_CATEGORIES: MainCategoryCard[] = [
  {
    id: 'fabric',
    title: 'Fabrics',
    subtitle: 'Explore our premium fabric selection',
    image: '/assets/materials/fabrics.jpg',
    iconBg: '#C69A59',
    mappedCategory: 'fabric',
  },
  {
    id: 'accessories',
    title: 'Garment Accessories',
    subtitle: 'Find zippers, buttons, labels and more',
    image: '/assets/materials/accessories.jpg',
    iconBg: '#10251C',
    mappedCategory: 'accessories',
  },
  {
    id: 'custom',
    title: 'Custom Development',
    subtitle: 'Develop unique materials made for you',
    image: '/assets/materials/processing.jpg',
    iconBg: '#152B22',
    mappedCategory: 'other',
  },
];

const SUB_SWATCHES: Record<
  MainDiscoveryCategory,
  {
    heading: string;
    items: KitItem[];
  }
> = {
  fabric: {
    heading: 'Choose your fabric type',
    items: [
      {
        id: 'cotton',
        name: 'Cotton',
        categoryLabel: 'Fabric',
        image: '/assets/materials/fabrics/cotton.jpg',
        category: 'fabric',
        defaultSpecs: { composition: '100% Combed Cotton', typeVariant: 'Combed Cotton / Poplin' },
      },
      {
        id: 'linen',
        name: 'Linen',
        categoryLabel: 'Fabric',
        image: '/assets/materials/fabrics/linen.jpg',
        category: 'fabric',
        defaultSpecs: { composition: '100% Pure Flax Linen', typeVariant: 'Flax Plain Weave' },
      },
      {
        id: 'denim',
        name: 'Denim',
        categoryLabel: 'Fabric',
        image: '/assets/materials/fabrics/denim.jpg',
        category: 'denim',
        defaultSpecs: { composition: 'Cotton Indigo Twill', gsmOrWeight: '11.5 Oz', typeVariant: 'Indigo Twill' },
      },
      {
        id: 'knits',
        name: 'Knits',
        categoryLabel: 'Fabric',
        image: '/assets/materials/fabrics/knits.jpg',
        category: 'fabric',
        defaultSpecs: { composition: 'Cotton / Lycra Knit', typeVariant: 'Ribbed / Single Jersey' },
      },
      {
        id: 'woven',
        name: 'Woven',
        categoryLabel: 'Fabric',
        image: '/assets/materials/fabrics/woven.jpg',
        category: 'fabric',
        defaultSpecs: { composition: 'Heavy Woven Canvas / Gada', typeVariant: 'Twill / Duck Weave' },
      },
    ],
  },
  accessories: {
    heading: 'Choose your accessory type',
    items: [
      {
        id: 'zippers',
        name: 'Zippers',
        categoryLabel: 'Accessory',
        image: '/assets/materials/accessories.jpg',
        category: 'zipper',
        defaultSpecs: { typeVariant: '#5 Metal Brass / Nylon Coil' },
      },
      {
        id: 'buttons',
        name: 'Buttons',
        categoryLabel: 'Accessory',
        image: '/assets/materials/buttons.jpg',
        category: 'button',
        defaultSpecs: { typeVariant: 'Horn / Coconut / Metal Buttons' },
      },
      {
        id: 'laces',
        name: 'Laces',
        categoryLabel: 'Accessory',
        image: '/assets/materials/laces.jpg',
        category: 'lace',
        defaultSpecs: { typeVariant: 'Guipure / Cotton Crochet Lace' },
      },
      {
        id: 'labels-tags',
        name: 'Labels & Tags',
        categoryLabel: 'Accessory',
        image: '/assets/materials/tags.jpg',
        category: 'accessories',
        defaultSpecs: { typeVariant: 'Woven Brand Labels & Hangtags' },
      },
      {
        id: 'tapes-elastics',
        name: 'Tapes & Elastics',
        categoryLabel: 'Accessory',
        image: '/assets/materials/tapes.jpg',
        category: 'accessories',
        defaultSpecs: { typeVariant: 'Cotton Twill & Herringbone Tape' },
      },
    ],
  },
  custom: {
    heading: 'Choose your development focus',
    items: [
      {
        id: 'custom-dyeing',
        name: 'Custom Dyeing & RFD',
        categoryLabel: 'Custom',
        image: '/assets/materials/fabrics/plain.jpg',
        category: 'other',
        defaultSpecs: { typeVariant: 'Pantone Reactive Dyeing / RFD' },
      },
      {
        id: 'bespoke-weave',
        name: 'Bespoke Weave',
        categoryLabel: 'Custom',
        image: '/assets/materials/fabrics/jacquard-tapestry.jpg',
        category: 'other',
        defaultSpecs: { typeVariant: 'Custom Warp & Weft Density' },
      },
      {
        id: 'special-gsm',
        name: 'Special GSM & Width',
        categoryLabel: 'Custom',
        image: '/assets/materials/fabrics/canvas-gada.jpg',
        category: 'other',
        defaultSpecs: { typeVariant: 'Extra-Wide / Heavy Canvas Specs' },
      },
      {
        id: 'branded-hardware',
        name: 'Branded Hardware',
        categoryLabel: 'Custom',
        image: '/assets/materials/tags.jpg',
        category: 'other',
        defaultSpecs: { typeVariant: 'Laser-Engraved Metal Hardware' },
      },
      {
        id: 'slitting-cutting',
        name: 'Precision Slitting',
        categoryLabel: 'Custom',
        image: '/assets/materials/processing.jpg',
        category: 'processing',
        defaultSpecs: { typeVariant: 'High-Precision Edge Slitting & Scalping' },
      },
    ],
  },
};

const INITIAL_REQUEST: MaterialRequestData = {
  category: 'fabric',
  materialName: 'Cotton',
  specifications: {
    typeVariant: '',
    composition: '',
    gsmOrWeight: '',
    widthOrSize: '',
    colourPreference: '',
    elasticity: '',
    patternOrFinish: '',
    customDetails: '',
  },
  hasPhysicalSample: false,
  sampleCourierNotes: '',
  quantity: '',
  unit: 'Metres',
  purpose: 'Bulk Garment Production',
  targetTimeline: 'Standard Production (Within 2-3 weeks)',
  testingRequirements: '',
  contactName: '',
  companyName: '',
  phone: '',
  email: '',
  cityState: '',
  additionalNotes: '',
};

const STORAGE_SUBMISSIONS_KEY = 'cf_material_submissions_v1';
const VERIFIED_PHONE = '+91 88264 15868';
const VERIFIED_PHONE_RAW = '918826415868';

export const MaterialRequestForm: React.FC<MaterialRequestFormProps> = ({
  initialData,
  similarProduct,
  onExploreCatalogue,
  onReachUs,
}) => {
  // Step 3 is the default active step matching the reference screenshot!
  const [currentStep, setCurrentStep] = useState<number>(3);
  const [activeMainCategory, setActiveMainCategory] = useState<MainDiscoveryCategory>('fabric');

  // Selected Kit items — initialized with Cotton matching reference image
  const [selectedKit, setSelectedKit] = useState<KitItem[]>(() => {
    if (similarProduct) {
      return [
        {
          id: similarProduct.id,
          name: similarProduct.name,
          categoryLabel: similarProduct.category.toUpperCase(),
          image: similarProduct.images[0] || '/assets/materials/fabrics/cotton.jpg',
          category:
            similarProduct.category === 'laces'
              ? 'lace'
              : similarProduct.category === 'denim'
              ? 'denim'
              : similarProduct.category === 'mesh'
              ? 'mesh'
              : 'fabric',
          defaultSpecs: {
            composition: similarProduct.fabric,
            typeVariant: similarProduct.subcategory,
          },
        },
      ];
    }
    return [
      {
        id: 'cotton',
        name: 'Cotton',
        categoryLabel: 'Fabric',
        image: '/assets/materials/fabrics/cotton.jpg',
        category: 'fabric',
        defaultSpecs: { composition: '100% Combed Cotton', typeVariant: 'Combed Cotton / Poplin' },
      },
    ];
  });

  const [selectedPillars, setSelectedPillars] = useState<Set<MainDiscoveryCategory>>(
    new Set(['fabric'])
  );

  // Form State
  const [formData, setFormData] = useState<MaterialRequestData>(() => ({
    ...INITIAL_REQUEST,
    ...initialData,
    materialName: similarProduct ? similarProduct.name : 'Cotton',
    similarToProductCode: similarProduct?.productCode,
    similarToProductName: similarProduct?.name,
  }));

  const [isQuantityUndecided, setIsQuantityUndecided] = useState<boolean>(true);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<MaterialRequestSubmission | null>(
    null
  );

  // 3D Mouse Parallax for Hero Artwork
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroArtworkRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!heroArtworkRef.current) return;
    const rect = heroArtworkRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Check if all Step 3 required fields are valid
  const isStep3Valid = Boolean(
    formData.contactName &&
      formData.contactName.trim().length >= 2 &&
      formData.phone &&
      formData.phone.trim().length >= 7 &&
      formData.email &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) &&
      formData.cityState &&
      formData.cityState.trim().length >= 2
  );

  // Swatch toggles
  const handleToggleSwatch = (item: KitItem) => {
    setSelectedKit((prev) => {
      const exists = prev.some((k) => k.id === item.id);
      if (exists) {
        return prev.filter((k) => k.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleRemoveFromKit = (id: string) => {
    setSelectedKit((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearKit = () => {
    setSelectedKit([]);
  };

  // Upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setUploadedFiles((prev) => [
            ...prev,
            {
              name: file.name,
              dataUrl: ev.target?.result as string,
              sizeKb: Math.round(file.size / 1024),
            },
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Submission
  const handleSubmitEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStep3Valid) {
      setErrors({ form: 'Please fill all required fields marked with * to continue.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const timestamp = Date.now();
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const referenceCode = `CF-REQ-${new Date().getFullYear()}-${randomCode}`;

      const submission: MaterialRequestSubmission = {
        ...formData,
        materialName:
          selectedKit.map((k) => k.name).join(', ') || formData.materialName || 'Cotton',
        category: selectedKit[0]?.category || 'fabric',
        quantity: isQuantityUndecided ? 'Sampling / Undecided' : formData.quantity || 'Sampling / Undecided',
        referenceImages: uploadedFiles.map((f) => ({
          name: f.name,
          dataUrl: f.dataUrl,
          sizeKb: f.sizeKb,
        })),
        id: `submission-${timestamp}`,
        referenceCode,
        submittedAt: timestamp,
      };

      try {
        const existingRaw = localStorage.getItem(STORAGE_SUBMISSIONS_KEY);
        const list = existingRaw ? JSON.parse(existingRaw) : [];
        list.unshift(submission);
        localStorage.setItem(STORAGE_SUBMISSIONS_KEY, JSON.stringify(list));
      } catch (err) {
        console.warn('Storage error:', err);
      }

      setSubmissionSuccess(submission);
    } catch (err) {
      setErrors({ form: 'Failed to process enquiry. Please WhatsApp us directly.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppEnquiryUrl = (submission: MaterialRequestSubmission) => {
    const selectedNames = selectedKit.map((k) => k.name).join(', ') || submission.materialName;
    const qtyText = isQuantityUndecided ? 'Sampling / Undecided' : `${submission.quantity} ${submission.unit}`;
    const text = encodeURIComponent(
      `Hello Classic Fashions, I submitted a Material Request on your website.\n\n` +
        `*Reference Code:* ${submission.referenceCode}\n` +
        `*Client Name:* ${submission.contactName}\n` +
        `*Company:* ${submission.companyName || 'N/A'}\n` +
        `*Materials Required:* ${selectedNames}\n` +
        `*Quantity:* ${qtyText}\n` +
        `*Delivery Location:* ${submission.cityState}\n\n` +
        `Please check availability and send pricing.`
    );
    return `https://wa.me/${VERIFIED_PHONE_RAW}?text=${text}`;
  };

  return (
    <div className="bg-[#07110D] text-[#F7F3EA] min-h-screen pb-28 relative overflow-hidden font-sans selection:bg-[#C69A59] selection:text-[#07110D]">
      {/* Deep Obsidian & Emerald Ambient Lighting Gradients */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-full sm:w-3/4 h-[750px] pointer-events-none opacity-40 mix-blend-screen"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 75% 15%, rgba(21, 43, 34, 0.95), rgba(7, 17, 13, 0.4) 60%, transparent 80%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute top-32 left-0 w-[500px] h-[500px] pointer-events-none opacity-15"
        style={{
          background:
            'radial-gradient(circle at 20% 30%, rgba(198, 154, 89, 0.2), transparent 70%)',
        }}
      />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION — EXACT PIXEL-PERFECT RECREATION OF REFERENCE IMAGE      */}
      {/* ========================================================================= */}
      <section className="relative pt-8 sm:pt-12 pb-6 sm:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-mono font-semibold uppercase tracking-[0.25em] text-[#C69A59] block">
                REQUEST MATERIAL
              </span>

              <div className="space-y-2">
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F7F3EA] leading-[1.12]">
                  Build Your <br />
                  Material <span className="text-[#C69A59]">Brief</span>
                </h1>
                {/* Thin gold accent line */}
                <div className="w-12 h-[1.5px] bg-[#C69A59] rounded-full" />
              </div>

              <p className="text-sm sm:text-base text-[#D4D0C6] leading-relaxed max-w-xl">
                Tell us what you need. Select materials, add references and our team will help you
                build the perfect solution.
              </p>
            </div>

            {/* Right Hero: 3D Luxury Textile Artwork Installation */}
            <div
              ref={heroArtworkRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="lg:col-span-6 relative flex justify-center lg:justify-end"
            >
              <div
                className="relative rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-transform duration-200 ease-out"
                style={{
                  transform: `perspective(1000px) rotateY(${mousePos.x * 4}deg) rotateX(${
                    -mousePos.y * 4
                  }deg)`,
                }}
              >
                <div className="relative aspect-[2.35/1] w-full max-w-[540px] bg-[#07110D] overflow-hidden rounded-2xl">
                  <img
                    src="/assets/materials/dark-hero-3d-textile.jpg"
                    alt="3D Luxury Textile Installation with Folded Fabrics and Gold CF Monogram"
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle edge blend overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07110D]/60 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. PROGRESS INDICATOR CAPSULE (CENTER-LEFT)                               */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <div
              className="rounded-2xl border border-[rgba(224,196,143,0.28)] bg-[rgba(225,235,223,0.04)] px-5 py-3.5 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.35)] flex items-center justify-between gap-2"
              style={{
                boxShadow:
                  'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 12px 36px rgba(0, 0, 0, 0.35)',
              }}
            >
              {/* Step 1: Choose Material (Completed ✓) */}
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-3 group text-left cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-[#C69A59] text-[#07110D] flex items-center justify-center font-bold shrink-0 shadow-xs">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div className="hidden sm:block">
                  <h4 className="font-semibold text-xs text-[#F7F3EA] leading-tight">
                    Choose Material
                  </h4>
                  <p className="text-[10px] text-[#AAA79D] leading-tight">
                    Pick fabrics, accessories or custom development
                  </p>
                </div>
              </button>

              {/* Dotted Line Separator */}
              <div
                aria-hidden="true"
                className="h-[1px] flex-1 border-t border-dashed border-[rgba(224,196,143,0.25)] mx-2 hidden sm:block"
              />

              {/* Step 2: Your Requirement (Completed ✓) */}
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-3 group text-left cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-[#C69A59] text-[#07110D] flex items-center justify-center font-bold shrink-0 shadow-xs">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div className="hidden sm:block">
                  <h4 className="font-semibold text-xs text-[#F7F3EA] leading-tight">
                    Your Requirement
                  </h4>
                  <p className="text-[10px] text-[#AAA79D] leading-tight">
                    Add details, quantity and reference
                  </p>
                </div>
              </button>

              {/* Dotted Line Separator */}
              <div
                aria-hidden="true"
                className="h-[1px] flex-1 border-t border-dashed border-[rgba(224,196,143,0.25)] mx-2 hidden sm:block"
              />

              {/* Step 3: Contact Details (Active Step 3) */}
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="flex items-center gap-3 group text-left cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-[#10251C] border border-[#C69A59] text-[#E5C58D] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ring-2 ring-[#C69A59]/20">
                  3
                </div>
                <div className="hidden sm:block">
                  <h4 className="font-semibold text-xs text-[#F7F3EA] leading-tight">
                    Contact Details
                  </h4>
                  <p className="text-[10px] text-[#AAA79D] leading-tight">
                    Share your info and submit your request
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUCCESS CONFIRMATION MODAL / SCREEN                                       */}
      {/* ========================================================================= */}
      {submissionSuccess && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 animate-in fade-in duration-300">
          <div
            className="rounded-2xl border border-[rgba(224,196,143,0.28)] bg-[rgba(225,235,223,0.055)] backdrop-blur-2xl p-8 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.5)] text-center space-y-6"
            style={{
              boxShadow:
                'inset 0 1px 0 rgba(255, 255, 255, 0.10), 0 20px 60px rgba(0, 0, 0, 0.45)',
            }}
          >
            <div className="w-16 h-16 rounded-full bg-[#C69A59]/15 text-[#C69A59] flex items-center justify-center mx-auto ring-8 ring-[#C69A59]/10">
              <CheckCircle className="w-8 h-8 text-[#C69A59]" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#C69A59] font-semibold">
                MATERIAL BRIEF LOGGED
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#F7F3EA]">
                Thank You, {submissionSuccess.contactName}
              </h2>
              <p className="text-sm text-[#D4D0C6] max-w-lg mx-auto">
                Your material request has been logged. Our textile sourcing specialists in Tiruppur
                will review your specifications and contact you with suitable swatch options and
                pricing.
              </p>
            </div>

            <div className="inline-block bg-[rgba(225,235,223,0.04)] border border-[rgba(224,196,143,0.28)] rounded-xl px-6 py-3">
              <span className="text-xs text-[#AAA79D] uppercase font-mono block">Enquiry Reference Code</span>
              <span className="font-mono text-lg font-bold text-[#E5C58D] tracking-wider">
                {submissionSuccess.referenceCode}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href={getWhatsAppEnquiryUrl(submissionSuccess)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-6 py-3.5 rounded-xl font-medium text-sm transition-all shadow-xs"
              >
                <span>Direct WhatsApp Confirmation</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={onExploreCatalogue}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C69A59] hover:bg-[#D4A866] text-[#07110D] font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-xs cursor-pointer"
              >
                <span>Explore Digital Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setSubmissionSuccess(null);
                  setCurrentStep(3);
                }}
                className="w-full sm:w-auto text-xs font-semibold uppercase tracking-wider text-[#AAA79D] hover:text-[#F7F3EA] py-2 px-4 transition-colors cursor-pointer"
              >
                Submit Another Brief
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MAIN WORKSPACE: LEFT FORM PANEL + RIGHT "YOUR MATERIAL BRIEF" PANEL    */}
      {/* ========================================================================= */}
      {!submissionSuccess && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ------------------------------------------------------------------- */}
            {/* LEFT COLUMN: ACTIVE STEP FORM PANEL (~58% WIDTH)                    */}
            {/* ------------------------------------------------------------------- */}
            <div className="lg:col-span-7 space-y-6">
              {/* STEP 3: CONTACT DETAILS (EXACT MATCH OF REFERENCE IMAGE) */}
              {currentStep === 3 && (
                <div
                  className="rounded-2xl border border-[rgba(224,196,143,0.28)] bg-[rgba(225,235,223,0.045)] p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.45)] space-y-6 relative overflow-hidden"
                  style={{
                    boxShadow:
                      'inset 0 1px 0 rgba(255, 255, 255, 0.10), inset 0 -1px 0 rgba(255, 255, 255, 0.025), 0 20px 60px rgba(0, 0, 0, 0.28)',
                  }}
                >
                  {/* Panel Header */}
                  <div className="flex items-start justify-between gap-4 border-b border-[rgba(225,210,180,0.12)] pb-4">
                    <div>
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F7F3EA] tracking-tight">
                        3. Contact Details
                      </h2>
                      <p className="text-xs sm:text-sm text-[#AAA79D] mt-1">
                        Provide your details so our team can send pricing, lead time, and swatch
                        availability.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="inline-flex items-center gap-1.5 text-xs text-[#D4D0C6] hover:text-[#C69A59] transition-colors shrink-0 pt-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Requirements</span>
                    </button>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmitEnquiry} className="space-y-4">
                    {/* Row 1: Full Name & Company */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#AAA79D] font-semibold mb-1.5">
                          FULL NAME <span className="text-[#C69A59]">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7D7A72]">
                            <User className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            required
                            value={formData.contactName}
                            onChange={(e) =>
                              setFormData({ ...formData, contactName: e.target.value })
                            }
                            placeholder="Your Name"
                            className="w-full pl-10 pr-3.5 py-3 text-xs sm:text-sm rounded-xl border border-[rgba(224,196,143,0.28)] bg-[rgba(225,235,223,0.035)] text-[#F7F3EA] placeholder-[#7D7A72] focus:outline-none focus:border-[#C69A59] focus:ring-1 focus:ring-[#C69A59] transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#AAA79D] font-semibold mb-1.5">
                          COMPANY / BRAND (OPTIONAL)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7D7A72]">
                            <Building className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            value={formData.companyName}
                            onChange={(e) =>
                              setFormData({ ...formData, companyName: e.target.value })
                            }
                            placeholder="Apparel Brand / Factory Name"
                            className="w-full pl-10 pr-3.5 py-3 text-xs sm:text-sm rounded-xl border border-[rgba(224,196,143,0.28)] bg-[rgba(225,235,223,0.035)] text-[#F7F3EA] placeholder-[#7D7A72] focus:outline-none focus:border-[#C69A59] focus:ring-1 focus:ring-[#C69A59] transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Phone & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#AAA79D] font-semibold mb-1.5">
                          PHONE / WHATSAPP <span className="text-[#C69A59]">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7D7A72]">
                            <Phone className="w-4 h-4" />
                          </div>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+91 98765 43210"
                            className="w-full pl-10 pr-3.5 py-3 text-xs sm:text-sm rounded-xl border border-[rgba(224,196,143,0.28)] bg-[rgba(225,235,223,0.035)] text-[#F7F3EA] placeholder-[#7D7A72] focus:outline-none focus:border-[#C69A59] focus:ring-1 focus:ring-[#C69A59] transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#AAA79D] font-semibold mb-1.5">
                          EMAIL ADDRESS <span className="text-[#C69A59]">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7D7A72]">
                            <Mail className="w-4 h-4" />
                          </div>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="buyer@apparel.com"
                            className="w-full pl-10 pr-3.5 py-3 text-xs sm:text-sm rounded-xl border border-[rgba(224,196,143,0.28)] bg-[rgba(225,235,223,0.035)] text-[#F7F3EA] placeholder-[#7D7A72] focus:outline-none focus:border-[#C69A59] focus:ring-1 focus:ring-[#C69A59] transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 3: Delivery Location & Additional Notes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#AAA79D] font-semibold mb-1.5">
                          DELIVERY LOCATION (CITY / STATE) <span className="text-[#C69A59]">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7D7A72]">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            required
                            value={formData.cityState}
                            onChange={(e) =>
                              setFormData({ ...formData, cityState: e.target.value })
                            }
                            placeholder="e.g. Tiruppur, Tamil Nadu"
                            className="w-full pl-10 pr-3.5 py-3 text-xs sm:text-sm rounded-xl border border-[rgba(224,196,143,0.28)] bg-[rgba(225,235,223,0.035)] text-[#F7F3EA] placeholder-[#7D7A72] focus:outline-none focus:border-[#C69A59] focus:ring-1 focus:ring-[#C69A59] transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#AAA79D] font-semibold mb-1.5">
                          ADDITIONAL NOTES (OPTIONAL)
                        </label>
                        <input
                          type="text"
                          value={formData.additionalNotes}
                          onChange={(e) =>
                            setFormData({ ...formData, additionalNotes: e.target.value })
                          }
                          placeholder="Any specific instructions or details..."
                          className="w-full px-3.5 py-3 text-xs sm:text-sm rounded-xl border border-[rgba(224,196,143,0.28)] bg-[rgba(225,235,223,0.035)] text-[#F7F3EA] placeholder-[#7D7A72] focus:outline-none focus:border-[#C69A59] focus:ring-1 focus:ring-[#C69A59] transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                        />
                      </div>
                    </div>

                    {/* Bottom Action Bar: Notice Pill on Left + Button on Right */}
                    <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                      {/* Required Fields Pill Notice */}
                      <div className="flex items-center gap-2.5 bg-[rgba(225,235,223,0.03)] border border-[rgba(224,196,143,0.2)] rounded-xl px-4 py-2.5">
                        <div className="w-4 h-4 rounded-full bg-[#C69A59]/20 text-[#E5C58D] flex items-center justify-center font-bold text-[10px] shrink-0">
                          !
                        </div>
                        <span className="text-xs text-[#AAA79D]">
                          Please fill all required fields marked with <span className="text-[#C69A59]">*</span> to continue.
                        </span>
                      </div>

                      {/* Review & Submit Button */}
                      <button
                        type="submit"
                        disabled={!isStep3Valid || isSubmitting}
                        className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                          isStep3Valid
                            ? 'bg-gradient-to-r from-[#C69A59] to-[#B88A47] hover:from-[#D4A866] hover:to-[#C69A59] text-[#07110D] font-bold shadow-[0_0_25px_rgba(198,154,89,0.35)] cursor-pointer active:scale-95'
                            : 'bg-[rgba(225,235,223,0.05)] border border-[rgba(224,196,143,0.15)] text-[#7D7A72] cursor-not-allowed'
                        }`}
                      >
                        {isSubmitting ? (
                          <span>Processing...</span>
                        ) : (
                          <>
                            <span>Review &amp; Submit</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* STEP 1: CHOOSE MATERIAL (IN DARK LUXURY THEME) */}
              {currentStep === 1 && (
                <div
                  className="rounded-2xl border border-[rgba(224,196,143,0.28)] bg-[rgba(225,235,223,0.045)] p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.45)] space-y-6"
                  style={{
                    boxShadow:
                      'inset 0 1px 0 rgba(255, 255, 255, 0.10), inset 0 -1px 0 rgba(255, 255, 255, 0.025), 0 20px 60px rgba(0, 0, 0, 0.28)',
                  }}
                >
                  <div className="flex items-center justify-between border-b border-[rgba(225,210,180,0.12)] pb-4">
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-[#F7F3EA] tracking-tight">
                        1. Choose what you need
                      </h2>
                      <p className="text-xs sm:text-sm text-[#AAA79D] mt-1">
                        Select from our material categories to build your brief.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-xs text-[#C69A59] hover:underline cursor-pointer"
                    >
                      Next Step &rarr;
                    </button>
                  </div>

                  {/* 3 Categories in Dark Glass */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {MAIN_CATEGORIES.map((cat) => {
                      const isSelected = selectedPillars.has(cat.id);
                      return (
                        <div
                          key={cat.id}
                          onClick={() => {
                            setActiveMainCategory(cat.id);
                            setSelectedPillars(new Set([cat.id]));
                          }}
                          className={`group rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col ${
                            isSelected
                              ? 'border-[#C69A59] bg-[rgba(225,235,223,0.08)] shadow-[0_0_20px_rgba(198,154,89,0.2)]'
                              : 'border-[rgba(224,196,143,0.2)] bg-[rgba(225,235,223,0.025)] hover:border-[rgba(224,196,143,0.4)]'
                          }`}
                        >
                          <div className="relative h-32 w-full overflow-hidden bg-stone-900">
                            <img
                              src={cat.image}
                              alt={cat.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#07110D]/90 via-transparent to-transparent pointer-events-none" />
                          </div>
                          <div className="p-3.5 flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="font-semibold text-sm text-[#F7F3EA]">{cat.title}</h3>
                              <p className="text-[11px] text-[#AAA79D] mt-0.5">{cat.subtitle}</p>
                            </div>
                            <div className="mt-3 pt-2 border-t border-[rgba(225,210,180,0.1)] flex items-center justify-between">
                              <span className="text-[10px] font-mono text-[#AAA79D] uppercase">
                                {activeMainCategory === cat.id ? 'Active' : 'Select'}
                              </span>
                              {isSelected ? (
                                <div className="w-4 h-4 rounded-full bg-[#C69A59] text-[#07110D] flex items-center justify-center">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </div>
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-[rgba(224,196,143,0.3)]" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Swatches Grid */}
                  <div className="pt-2">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-[#AAA79D] font-semibold mb-3">
                      {SUB_SWATCHES[activeMainCategory].heading}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {SUB_SWATCHES[activeMainCategory].items.map((item) => {
                        const isChosen = selectedKit.some((k) => k.id === item.id);
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleToggleSwatch(item)}
                            className={`rounded-xl p-2 border transition-all cursor-pointer flex flex-col items-center ${
                              isChosen
                                ? 'border-[#C69A59] bg-[rgba(198,154,89,0.15)] shadow-xs'
                                : 'border-[rgba(224,196,143,0.2)] bg-[rgba(225,235,223,0.02)] hover:border-[rgba(224,196,143,0.4)]'
                            }`}
                          >
                            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-stone-900">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                              {isChosen && (
                                <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#C69A59] text-[#07110D] flex items-center justify-center">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </div>
                              )}
                            </div>
                            <span className="text-[11px] font-medium text-center mt-1.5 truncate w-full text-[#F7F3EA]">
                              {item.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[rgba(225,210,180,0.12)] flex justify-end">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="bg-gradient-to-r from-[#C69A59] to-[#B88A47] text-[#07110D] font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Continue to Requirements &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: YOUR REQUIREMENT (IN DARK LUXURY THEME) */}
              {currentStep === 2 && (
                <div
                  className="rounded-2xl border border-[rgba(224,196,143,0.28)] bg-[rgba(225,235,223,0.045)] p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.45)] space-y-6"
                  style={{
                    boxShadow:
                      'inset 0 1px 0 rgba(255, 255, 255, 0.10), inset 0 -1px 0 rgba(255, 255, 255, 0.025), 0 20px 60px rgba(0, 0, 0, 0.28)',
                  }}
                >
                  <div className="flex items-center justify-between border-b border-[rgba(225,210,180,0.12)] pb-4">
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-[#F7F3EA] tracking-tight">
                        2. Specify Your Requirement
                      </h2>
                      <p className="text-xs sm:text-sm text-[#AAA79D] mt-1">
                        Enter quantities, specs, and details for your production.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-xs text-[#D4D0C6] hover:text-[#C69A59] cursor-pointer"
                    >
                      &larr; Back to Materials
                    </button>
                  </div>

                  {/* Quantity & Unit */}
                  <div className="space-y-3">
                    <label className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#AAA79D] font-semibold">
                      Required Quantity &amp; Unit
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-8">
                        <input
                          type="text"
                          disabled={isQuantityUndecided}
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                          placeholder={isQuantityUndecided ? 'Sampling first / Undecided' : 'e.g. 500, 2000'}
                          className={`w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-[rgba(224,196,143,0.28)] text-[#F7F3EA] placeholder-[#7D7A72] ${
                            isQuantityUndecided ? 'bg-stone-900/50 opacity-60' : 'bg-[rgba(225,235,223,0.035)]'
                          }`}
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <select
                          disabled={isQuantityUndecided}
                          value={formData.unit}
                          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                          className="w-full px-3 py-3 text-xs sm:text-sm rounded-xl border border-[rgba(224,196,143,0.28)] bg-[#0B1712] text-[#F7F3EA]"
                        >
                          <option value="Metres">Metres</option>
                          <option value="Kilograms">Kilograms (Kg)</option>
                          <option value="Pieces">Pieces</option>
                          <option value="Rolls">Rolls</option>
                          <option value="Yards">Yards</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="quantUndecided"
                        checked={isQuantityUndecided}
                        onChange={(e) => setIsQuantityUndecided(e.target.checked)}
                        className="w-4 h-4 text-[#C69A59] border-stone-600 rounded cursor-pointer"
                      />
                      <label htmlFor="quantUndecided" className="text-xs text-[#AAA79D] cursor-pointer">
                        Quantity not finalized yet (Need sampling / initial swatch quote)
                      </label>
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-wider text-[#AAA79D] font-semibold mb-1">
                        TARGET GSM / WEIGHT
                      </label>
                      <input
                        type="text"
                        value={formData.specifications.gsmOrWeight || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specifications: { ...formData.specifications, gsmOrWeight: e.target.value },
                          })
                        }
                        placeholder="e.g. 140 GSM, 11.5 Oz"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[rgba(224,196,143,0.28)] bg-[rgba(225,235,223,0.035)] text-[#F7F3EA] placeholder-[#7D7A72]"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-wider text-[#AAA79D] font-semibold mb-1">
                        WIDTH / SIZE
                      </label>
                      <input
                        type="text"
                        value={formData.specifications.widthOrSize || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specifications: { ...formData.specifications, widthOrSize: e.target.value },
                          })
                        }
                        placeholder='e.g. 58" / 60", 44"'
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[rgba(224,196,143,0.28)] bg-[rgba(225,235,223,0.035)] text-[#F7F3EA] placeholder-[#7D7A72]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[rgba(225,210,180,0.12)] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-5 py-2.5 rounded-xl border border-[rgba(224,196,143,0.28)] text-xs text-[#AAA79D] hover:text-[#F7F3EA]"
                    >
                      &larr; Previous Step
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="bg-gradient-to-r from-[#C69A59] to-[#B88A47] text-[#07110D] font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Continue to Contact Details &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ------------------------------------------------------------------- */}
            {/* RIGHT COLUMN: "YOUR MATERIAL BRIEF" PANEL (~42% WIDTH)              */}
            {/* ------------------------------------------------------------------- */}
            <div className="lg:col-span-5 space-y-6">
              <div
                className="rounded-2xl border border-[rgba(224,196,143,0.28)] bg-[rgba(225,235,223,0.045)] p-6 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.45)] space-y-5 sticky top-28"
                style={{
                  boxShadow:
                    'inset 0 1px 0 rgba(255, 255, 255, 0.10), inset 0 -1px 0 rgba(255, 255, 255, 0.025), 0 20px 60px rgba(0, 0, 0, 0.28)',
                }}
              >
                {/* Header: Golden Star + Title + Pill Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[#C69A59] text-base leading-none select-none">✦</span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#F7F3EA] tracking-tight">
                      Your Material Brief
                    </h3>
                  </div>
                  <span className="border border-[rgba(224,196,143,0.28)] text-[11px] font-mono text-[#D4D0C6] px-3 py-0.5 rounded-full bg-[rgba(225,235,223,0.04)]">
                    {selectedKit.length} {selectedKit.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {/* Selected Material Card (Cotton matching reference mockup) */}
                {selectedKit.length > 0 ? (
                  <div className="space-y-2">
                    {selectedKit.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-[rgba(224,196,143,0.2)] bg-[rgba(225,235,223,0.04)] p-3 flex items-center justify-between gap-3 shadow-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover border border-[rgba(224,196,143,0.3)] shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-semibold text-sm text-[#F7F3EA] truncate">
                              {item.name}
                            </h4>
                            <span className="text-xs text-[#AAA79D] font-mono block">
                              {item.categoryLabel}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveFromKit(item.id)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[#AAA79D] hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                          title="Remove item"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    {/* Actions under card */}
                    <div className="pt-1 flex items-center justify-between text-xs px-1">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="text-[#C69A59] hover:underline font-medium cursor-pointer"
                      >
                        + Add more
                      </button>
                      <button
                        type="button"
                        onClick={handleClearKit}
                        className="text-[#AAA79D] hover:text-white transition-colors cursor-pointer"
                      >
                        Clear all
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-[rgba(224,196,143,0.25)] p-5 text-center text-xs text-[#AAA79D]">
                    No items selected yet.{' '}
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-[#C69A59] underline"
                    >
                      Choose materials
                    </button>
                  </div>
                )}

                {/* Metrics Breakdown with Subtle Separators */}
                <div className="space-y-3 pt-2 text-xs border-t border-[rgba(225,210,180,0.14)]">
                  {/* Selected Items */}
                  <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2 text-[#D4D0C6]">
                      <Package className="w-4 h-4 text-[#C69A59]" />
                      <span>Selected Items</span>
                    </div>
                    <span className="font-mono font-semibold text-[#F7F3EA]">
                      {selectedKit.length}
                    </span>
                  </div>

                  <div className="h-[1px] bg-[rgba(225,210,180,0.14)]" />

                  {/* Total Quantity */}
                  <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2 text-[#D4D0C6]">
                      <FileText className="w-4 h-4 text-[#C69A59]" />
                      <span>Total Quantity</span>
                    </div>
                    <span className="font-mono text-[#D4D0C6]">
                      {isQuantityUndecided
                        ? 'Sampling / Undecided'
                        : formData.quantity
                        ? `${formData.quantity} ${formData.unit}`
                        : 'Sampling / Undecided'}
                    </span>
                  </div>

                  <div className="h-[1px] bg-[rgba(225,210,180,0.14)]" />

                  {/* Reference Images */}
                  <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2 text-[#D4D0C6]">
                      <Upload className="w-4 h-4 text-[#C69A59]" />
                      <span>Reference Images</span>
                    </div>
                    <span className="font-mono font-semibold text-[#F7F3EA]">
                      {uploadedFiles.length}
                    </span>
                  </div>

                  <div className="h-[1px] bg-[rgba(225,210,180,0.14)]" />

                  {/* Custom Notes */}
                  <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2 text-[#D4D0C6]">
                      <Pencil className="w-4 h-4 text-[#C69A59]" />
                      <span>Custom Notes</span>
                    </div>
                    <span className="font-mono text-[#AAA79D]">
                      {formData.additionalNotes ? 'Provided' : '—'}
                    </span>
                  </div>
                </div>

                {/* Need Help Choosing Materials? Assistance Card */}
                <div className="rounded-xl border border-[rgba(224,196,143,0.2)] bg-[rgba(225,235,223,0.035)] p-4 flex items-center gap-3.5 group hover:border-[#C69A59]/60 transition-all duration-300">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-[rgba(224,196,143,0.3)] bg-black/60 shadow-md">
                    <img
                      src="/assets/materials/assistance-headphones.jpg"
                      alt="Expert Support"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <h4 className="font-semibold text-xs text-[#F7F3EA] leading-tight">
                      Need help choosing materials?
                    </h4>
                    <p className="text-[11px] text-[#AAA79D] leading-tight">
                      Our experts are here for you.
                    </p>
                    <button
                      type="button"
                      onClick={onReachUs}
                      className="inline-flex items-center gap-1 text-xs text-[#C69A59] group-hover:text-[#E5C58D] font-medium pt-1 transition-colors cursor-pointer"
                    >
                      <span>Reach our team</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
