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
  CheckCircle2,
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
  Package,
  AlertCircle,
  ExternalLink,
  User,
  Scissors,
  Pencil,
  ShoppingBag,
  Sparkles,
  Headphones,
  Layers,
  FileCheck,
  CheckCircle,
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
  mappedCategory: MaterialRequestCategory;
}

const MAIN_CATEGORIES: MainCategoryCard[] = [
  {
    id: 'fabric',
    title: 'Fabrics',
    subtitle: 'Explore our premium fabric selection',
    image: '/assets/materials/fabrics.jpg',
    mappedCategory: 'fabric',
  },
  {
    id: 'accessories',
    title: 'Garment Accessories',
    subtitle: 'Find zippers, buttons, labels and trims',
    image: '/assets/materials/accessories.jpg',
    mappedCategory: 'accessories',
  },
  {
    id: 'custom',
    title: 'Custom Development',
    subtitle: 'Develop unique materials made for you',
    image: '/assets/reach-us/hero-atelier-3d.jpg',
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
      {
        id: 'chambray',
        name: 'Chambray',
        categoryLabel: 'Fabric',
        image: '/assets/materials/fabrics/chambray.jpg',
        category: 'fabric',
        defaultSpecs: { composition: 'Yarn Dyed Chambray', typeVariant: 'Plain Weave' },
      },
      {
        id: 'mesh',
        name: 'Mesh',
        categoryLabel: 'Fabric',
        image: '/assets/materials/fabrics/mesh-fabrics.jpg',
        category: 'mesh',
        defaultSpecs: { composition: 'Polyester Athletic Mesh', typeVariant: 'Hexagonal Eyelet' },
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
        defaultSpecs: { typeVariant: 'Pantone Specific Lab Dips & Bio-wash' },
      },
      {
        id: 'specialty-weave',
        name: 'Specialty Weave',
        categoryLabel: 'Custom',
        image: '/assets/materials/fabrics/jacquard-tapestry.jpg',
        category: 'other',
        defaultSpecs: { typeVariant: 'Jacquard / Dobby Custom Patterns' },
      },
      {
        id: 'custom-hardware',
        name: 'Custom Hardware Casting',
        categoryLabel: 'Custom',
        image: '/assets/materials/accessories.jpg',
        category: 'other',
        defaultSpecs: { typeVariant: 'Engraved Logo Buttons & Sliders' },
      },
      {
        id: 'eco-sustainable',
        name: 'Sustainable / Organic',
        categoryLabel: 'Custom',
        image: '/assets/materials/fabrics/canvas-gada.jpg',
        category: 'other',
        defaultSpecs: { typeVariant: 'GOTS Certified Organic Cotton' },
      },
    ],
  },
};

const INITIAL_REQUEST: MaterialRequestData = {
  category: 'fabric',
  materialName: '',
  quantity: '1,200',
  unit: 'Metres',
  urgency: 'flexible',
  targetDate: 'May 2026',
  width: '58 / 60 inches',
  gsmOrWeight: '180 - 220 GSM',
  composition: '100% Ring-Spun Combed Cotton',
  weaveOrFinish: 'Enzyme Washed, Mercerized',
  colorOrShade: 'Natural Off-White / Lab Dip',
  contactName: '',
  companyName: '',
  phone: '',
  email: '',
  cityState: '',
  preferredContactMethod: 'whatsapp',
  additionalNotes: '',
};

const VERIFIED_PHONE_RAW = '919443223150';
const VERIFIED_PHONE_DISPLAY = '+91 94432 23150';

export const MaterialRequestForm: React.FC<MaterialRequestFormProps> = ({
  initialData,
  similarProduct,
  onExploreCatalogue,
  onReachUs,
}) => {
  // Step indicator starts at 1 (NO auto-ticks!)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Active Category Pillar
  const [activeMainCategory, setActiveMainCategory] = useState<MainDiscoveryCategory>('fabric');

  // Selected Material Swatches (User selects item)
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

  // Form State
  const [formData, setFormData] = useState<MaterialRequestData>(() => ({
    ...INITIAL_REQUEST,
    ...initialData,
    materialName: similarProduct ? similarProduct.name : 'Cotton Fabric',
    similarToProductCode: similarProduct?.productCode,
    similarToProductName: similarProduct?.name,
  }));

  const [isQuantityUndecided, setIsQuantityUndecided] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation States
  const [step1Error, setStep1Error] = useState<string>('');
  const [step2Error, setStep2Error] = useState<string>('');
  const [step3Error, setStep3Error] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<MaterialRequestSubmission | null>(null);

  // Mouse Parallax / 3D Tilt for Hero Showcase
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroCardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!heroCardRef.current) return;
    const rect = heroCardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Swatch Toggle Handler
  const handleToggleSwatch = (item: KitItem) => {
    setStep1Error('');
    setSelectedKit((prev) => {
      const exists = prev.some((k) => k.id === item.id);
      if (exists) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((k) => k.id !== item.id);
      } else {
        return [...prev, item];
      }
    });

    // Update material name and specs dynamically
    setFormData((prev) => ({
      ...prev,
      category: item.category,
      materialName: item.name,
      composition: item.defaultSpecs?.composition || prev.composition,
      weaveOrFinish: item.defaultSpecs?.typeVariant || prev.weaveOrFinish,
    }));
  };

  // Step 1 Validation & Proceed
  const handleProceedToStep2 = () => {
    if (selectedKit.length === 0) {
      setStep1Error('Please select at least one material type to proceed *');
      return;
    }
    setStep1Error('');
    setCurrentStep(2);
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  // Step 2 Validation & Proceed
  const handleProceedToStep3 = () => {
    if (!formData.materialName || formData.materialName.trim().length === 0) {
      setStep2Error('Please enter the Material / Fabric name *');
      return;
    }
    if (!isQuantityUndecided && (!formData.quantity || formData.quantity.trim().length === 0)) {
      setStep2Error('Please specify the required quantity or check undecided *');
      return;
    }
    setStep2Error('');
    setCurrentStep(3);
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  // File Upload Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.size > 8 * 1024 * 1024) {
        alert(`File ${file.name} is larger than 8MB limit.`);
        return;
      }
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
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Step 3 Submit Handler
  const handleSubmitEnquiry = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.contactName || formData.contactName.trim().length < 2) {
      setStep3Error('Please provide your full name *');
      return;
    }
    if (!formData.phone || formData.phone.trim().length < 7) {
      setStep3Error('Please provide a valid Phone / WhatsApp number *');
      return;
    }
    if (
      !formData.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      setStep3Error('Please provide a valid email address *');
      return;
    }
    if (!formData.cityState || formData.cityState.trim().length < 2) {
      setStep3Error('Please specify your delivery location / city *');
      return;
    }

    setStep3Error('');
    setIsSubmitting(true);

    setTimeout(() => {
      const code = `CF-REQ-${Math.floor(100000 + Math.random() * 900000)}`;
      const submission: MaterialRequestSubmission = {
        ...formData,
        id: `submission_${Date.now()}`,
        referenceCode: code,
        submittedAt: new Date().toISOString(),
        status: 'received',
      };

      setSubmissionSuccess(submission);
      setIsSubmitting(false);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }, 700);
  };

  // WhatsApp Enquiry Link Builder
  const getWhatsAppEnquiryUrl = (submission: MaterialRequestSubmission) => {
    const lines = [
      `*CLASSIC FASHIONS — MATERIAL BRIEF [${submission.referenceCode}]*`,
      ``,
      `*Selected Material:* ${submission.materialName} (${submission.category})`,
      `*Quantity:* ${isQuantityUndecided ? 'Sampling First / Undecided' : `${submission.quantity} ${submission.unit}`}`,
      `*Target Timeline:* ${submission.targetDate || 'Flexible'}`,
      `*Width & GSM:* ${submission.width || 'Standard'} | ${submission.gsmOrWeight || 'Standard'}`,
      `*Composition:* ${submission.composition || 'As per sample'}`,
      `*Finish:* ${submission.weaveOrFinish || 'Standard'}`,
      ``,
      `*Contact:* ${submission.contactName}`,
      `*Company:* ${submission.companyName || 'Not specified'}`,
      `*Phone:* ${submission.phone}`,
      `*Email:* ${submission.email}`,
      `*Delivery Location:* ${submission.cityState}`,
      submission.additionalNotes ? `*Notes:* ${submission.additionalNotes}` : '',
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join('\n'));
    return `https://wa.me/${VERIFIED_PHONE_RAW}?text=${text}`;
  };

  return (
    <div className="bg-[#FAF8F5] text-[#181715] min-h-screen pb-24 relative overflow-hidden font-sans selection:bg-[#D4AF37] selection:text-[#181715]">
      {/* Refined Luxury Ambient Backdrop Atmosphere */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-full sm:w-2/3 h-[600px] pointer-events-none opacity-60"
        style={{
          background:
            'radial-gradient(ellipse 65% 50% at 80% 20%, rgba(212, 175, 55, 0.08), rgba(245, 240, 230, 0.4) 60%, transparent 80%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute top-48 left-0 w-[550px] h-[550px] pointer-events-none opacity-40"
        style={{
          background:
            'radial-gradient(circle at 10% 20%, rgba(140, 101, 52, 0.05), transparent 70%)',
        }}
      />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION — ELEGANT LIGHT LUXURY TEXTILE SHOWCASE                    */}
      {/* ========================================================================= */}
      <section className="relative pt-8 sm:pt-12 pb-8 sm:pb-10 border-b border-[#ECE7DE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 bg-[#F3EFE6] border border-[#DDD6C8] px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8C6534]" />
                <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-[#8C6534]">
                  REQUEST MATERIAL
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#181715] leading-[1.12]">
                  Build Your <br />
                  Material <span className="text-[#8C6534]">Brief</span>
                </h1>
                {/* Thin gold accent line */}
                <div className="w-14 h-[2px] bg-gradient-to-r from-[#8C6534] to-[#D4AF37] rounded-full" />
              </div>

              <p className="text-sm sm:text-base text-[#6B665E] leading-relaxed max-w-xl">
                Tell us what you need. Select materials, add references and our team will help you
                build the perfect solution.
              </p>
            </div>

            {/* Right Hero: High-Definition Textile Installation with Wide Spread Shadow & Soft Blur */}
            <div
              ref={heroCardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="lg:col-span-6 relative flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-[540px] group">
                {/* Ambient Backlight Spread Glow */}
                <div
                  aria-hidden="true"
                  className="absolute -inset-4 bg-gradient-to-tr from-[#D4AF37]/25 via-[#C49A55]/20 to-[#8C6534]/15 rounded-3xl blur-3xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                />

                {/* HD Image Showcase Container with Soft Diffuse Spread Shadow */}
                <div
                  className="relative rounded-3xl overflow-hidden bg-white border border-[#E5E0D8] transition-transform duration-300 ease-out"
                  style={{
                    boxShadow:
                      '0 25px 60px -12px rgba(24, 23, 21, 0.12), 0 10px 25px -5px rgba(24, 23, 21, 0.06), 0 0 35px rgba(212, 175, 55, 0.14)',
                    transform: `perspective(1000px) rotateY(${mousePos.x * 3}deg) rotateX(${
                      -mousePos.y * 3
                    }deg)`,
                  }}
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#ECE7DC]">
                    <img
                      src="/assets/materials/fabrics.jpg"
                      alt="High-Definition Studio Fabric Rolls and Combed Linens"
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Soft gradient blend */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                    {/* Floating Frosted Glass Overlay Badges */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                      <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/80 shadow-md flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#8C6534] animate-pulse" />
                        <span className="font-mono text-[10px] tracking-wider font-semibold uppercase text-[#181715]">
                          STUDIO TEXTILE ARCHIVE
                        </span>
                      </div>
                      <div className="bg-[#181715]/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#D4AF37]/50 shadow-md">
                        <span className="font-mono text-[10px] tracking-wider font-semibold uppercase text-[#E5C58D]">
                          CERTIFIED MILLS
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. DYNAMIC PROGRESS CAPSULE (Starts at Step 1, NO auto-ticks!)             */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <div
              className="rounded-2xl border border-[#E5E0D8] bg-white/90 backdrop-blur-xl px-5 py-3.5 flex items-center justify-between gap-2"
              style={{
                boxShadow:
                  '0 10px 30px -5px rgba(24, 23, 21, 0.05), 0 4px 12px rgba(24, 23, 21, 0.02)',
              }}
            >
              {/* Step 1: Choose Material */}
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className={`flex items-center gap-3 text-left transition-all cursor-pointer ${
                  currentStep === 1
                    ? 'opacity-100'
                    : currentStep > 1
                    ? 'opacity-90 hover:opacity-100'
                    : 'opacity-60'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                    currentStep > 1
                      ? 'bg-[#181715] text-[#D4AF37] shadow-xs'
                      : currentStep === 1
                      ? 'bg-[#8C6534] text-white ring-4 ring-[#8C6534]/20 shadow-xs'
                      : 'border border-[#D1CCC2] text-[#8C877E] bg-[#FAF8F5]'
                  }`}
                >
                  {currentStep > 1 ? <Check className="w-4 h-4 stroke-[3]" /> : '1'}
                </div>
                <div className="hidden sm:block">
                  <h4 className="font-semibold text-xs text-[#181715] leading-tight flex items-center gap-1">
                    Choose Material
                    <span className="text-[#C4432B] font-bold text-[13px]">*</span>
                  </h4>
                  <p className="text-[10px] text-[#78736B] leading-tight">
                    Pick fabrics, accessories or custom
                  </p>
                </div>
              </button>

              {/* Dotted Line Separator */}
              <div
                aria-hidden="true"
                className={`h-[1px] flex-1 border-t border-dashed mx-2 hidden sm:block ${
                  currentStep > 1 ? 'border-[#8C6534]' : 'border-[#DDD7CD]'
                }`}
              />

              {/* Step 2: Your Requirement */}
              <button
                type="button"
                onClick={() => {
                  if (selectedKit.length > 0) setCurrentStep(2);
                }}
                className={`flex items-center gap-3 text-left transition-all ${
                  selectedKit.length > 0 ? 'cursor-pointer' : 'cursor-not-allowed'
                } ${
                  currentStep === 2
                    ? 'opacity-100'
                    : currentStep > 2
                    ? 'opacity-90 hover:opacity-100'
                    : 'opacity-60'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                    currentStep > 2
                      ? 'bg-[#181715] text-[#D4AF37] shadow-xs'
                      : currentStep === 2
                      ? 'bg-[#8C6534] text-white ring-4 ring-[#8C6534]/20 shadow-xs'
                      : 'border border-[#D1CCC2] text-[#8C877E] bg-[#FAF8F5]'
                  }`}
                >
                  {currentStep > 2 ? <Check className="w-4 h-4 stroke-[3]" /> : '2'}
                </div>
                <div className="hidden sm:block">
                  <h4 className="font-semibold text-xs text-[#181715] leading-tight flex items-center gap-1">
                    Your Requirement
                    <span className="text-[#C4432B] font-bold text-[13px]">*</span>
                  </h4>
                  <p className="text-[10px] text-[#78736B] leading-tight">
                    Add details, quantity and reference
                  </p>
                </div>
              </button>

              {/* Dotted Line Separator */}
              <div
                aria-hidden="true"
                className={`h-[1px] flex-1 border-t border-dashed mx-2 hidden sm:block ${
                  currentStep > 2 ? 'border-[#8C6534]' : 'border-[#DDD7CD]'
                }`}
              />

              {/* Step 3: Contact Details */}
              <button
                type="button"
                onClick={() => {
                  if (selectedKit.length > 0 && formData.materialName) setCurrentStep(3);
                }}
                className={`flex items-center gap-3 text-left transition-all ${
                  currentStep === 3
                    ? 'opacity-100'
                    : 'opacity-60 cursor-pointer'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                    currentStep === 3
                      ? 'bg-[#8C6534] text-white ring-4 ring-[#8C6534]/20 shadow-xs'
                      : 'border border-[#D1CCC2] text-[#8C877E] bg-[#FAF8F5]'
                  }`}
                >
                  3
                </div>
                <div className="hidden sm:block">
                  <h4 className="font-semibold text-xs text-[#181715] leading-tight flex items-center gap-1">
                    Contact Details
                    <span className="text-[#C4432B] font-bold text-[13px]">*</span>
                  </h4>
                  <p className="text-[10px] text-[#78736B] leading-tight">
                    Share your info and submit brief
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
            className="rounded-3xl border border-[#E5E0D8] bg-white p-8 sm:p-12 text-center space-y-6"
            style={{
              boxShadow:
                '0 25px 65px -12px rgba(24, 23, 21, 0.12), 0 0 30px rgba(212, 175, 55, 0.10)',
            }}
          >
            <div className="w-16 h-16 rounded-full bg-[#F3EFE6] text-[#8C6534] flex items-center justify-center mx-auto ring-8 ring-[#8C6534]/10">
              <CheckCircle className="w-8 h-8 text-[#8C6534]" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#8C6534] font-semibold">
                MATERIAL BRIEF LOGGED
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#181715]">
                Thank You, {submissionSuccess.contactName}
              </h2>
              <p className="text-sm text-[#6B665E] max-w-lg mx-auto">
                Your material request has been logged. Our textile sourcing specialists in Tiruppur
                will review your specifications and contact you with suitable swatch options and
                pricing.
              </p>
            </div>

            <div className="inline-block bg-[#FAF8F5] border border-[#DDD7CD] rounded-2xl px-6 py-3 shadow-xs">
              <span className="text-xs text-[#8C877E] uppercase font-mono block">Enquiry Reference Code</span>
              <span className="font-mono text-xl font-bold text-[#8C6534] tracking-wider">
                {submissionSuccess.referenceCode}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href={getWhatsAppEnquiryUrl(submissionSuccess)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-6 py-3.5 rounded-xl font-medium text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>Direct WhatsApp Confirmation</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={onExploreCatalogue}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#181715] hover:bg-[#2B2824] text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-md cursor-pointer"
              >
                <span>Explore Digital Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setSubmissionSuccess(null);
                  setCurrentStep(1);
                }}
                className="w-full sm:w-auto text-xs font-semibold uppercase tracking-wider text-[#8C877E] hover:text-[#181715] py-2 px-4 transition-colors cursor-pointer"
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
              {/* ================================================================= */}
              {/* STEP 1: CHOOSE MATERIAL                                           */}
              {/* ================================================================= */}
              {currentStep === 1 && (
                <div
                  className="rounded-3xl border border-[#E5E0D8] bg-white p-6 sm:p-8 space-y-6 relative overflow-hidden"
                  style={{
                    boxShadow:
                      '0 20px 50px -10px rgba(24, 23, 21, 0.08), 0 5px 15px rgba(24, 23, 21, 0.03)',
                  }}
                >
                  {/* Step Header */}
                  <div className="border-b border-[#ECE7DE] pb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#181715] text-[#D4AF37] flex items-center justify-center font-bold text-xs">
                        1
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181715] tracking-tight">
                        Choose what you need
                      </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-[#6B665E] mt-1 ml-8">
                      Select from our material categories to get started.{' '}
                      <span className="text-[#C4432B] font-semibold">* Required</span>
                    </p>
                  </div>

                  {/* 3 Large Category Cards */}
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-[#78736B] font-semibold mb-3">
                      MATERIAL CATEGORY <span className="text-[#C4432B] font-bold">*</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {MAIN_CATEGORIES.map((cat) => {
                        const isSelected = activeMainCategory === cat.id;
                        return (
                          <div
                            key={cat.id}
                            onClick={() => {
                              setActiveMainCategory(cat.id);
                              // Auto-select first swatch of the category
                              const firstSwatch = SUB_SWATCHES[cat.id].items[0];
                              if (firstSwatch) {
                                setSelectedKit([firstSwatch]);
                                setFormData((prev) => ({
                                  ...prev,
                                  category: firstSwatch.category,
                                  materialName: firstSwatch.name,
                                  composition: firstSwatch.defaultSpecs?.composition || prev.composition,
                                  weaveOrFinish: firstSwatch.defaultSpecs?.typeVariant || prev.weaveOrFinish,
                                }));
                              }
                            }}
                            className={`group rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col ${
                              isSelected
                                ? 'border-[#8C6534] bg-[#FAF8F5] ring-2 ring-[#8C6534]/20 shadow-[0_10px_25px_rgba(140,101,52,0.12)]'
                                : 'border-[#E5E0D8] bg-white hover:border-[#C4BAA9] hover:shadow-md'
                            }`}
                          >
                            <div className="relative h-32 w-full overflow-hidden bg-[#ECE7DC]">
                              <img
                                src={cat.image}
                                alt={cat.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                            </div>

                            <div className="p-3.5 flex-1 flex flex-col justify-between">
                              <div>
                                <h3 className="font-semibold text-sm text-[#181715]">{cat.title}</h3>
                                <p className="text-[11px] text-[#78736B] mt-0.5 line-clamp-2">
                                  {cat.subtitle}
                                </p>
                              </div>

                              <div className="mt-3 pt-2 border-t border-[#ECE7DE] flex items-center justify-between">
                                <span className="text-[10px] font-mono text-[#8C877E] uppercase">
                                  {isSelected ? 'Selected' : 'Select'}
                                </span>
                                {isSelected ? (
                                  <div className="w-4 h-4 rounded-full bg-[#8C6534] text-white flex items-center justify-center">
                                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                                  </div>
                                ) : (
                                  <div className="w-4 h-4 rounded-full border border-[#D1CCC2]" />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Swatches Grid */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-3">
                      <label className="font-mono text-[11px] uppercase tracking-wider text-[#78736B] font-semibold">
                        {SUB_SWATCHES[activeMainCategory].heading}{' '}
                        <span className="text-[#C4432B] font-bold">*</span>
                      </label>
                      <span className="text-[11px] text-[#8C6534]">Click to pick</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {SUB_SWATCHES[activeMainCategory].items.map((item) => {
                        const isChosen = selectedKit.some((k) => k.id === item.id);
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleToggleSwatch(item)}
                            className={`rounded-2xl p-2.5 border transition-all cursor-pointer flex flex-col items-center ${
                              isChosen
                                ? 'border-[#8C6534] bg-[#FAF8F5] ring-2 ring-[#8C6534]/20 shadow-md'
                                : 'border-[#E5E0D8] bg-white hover:border-[#C4BAA9] hover:shadow-xs'
                            }`}
                          >
                            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#ECE7DC]">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
                              />
                              {isChosen && (
                                <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#8C6534] text-white flex items-center justify-center shadow-xs">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </div>
                              )}
                            </div>
                            <span className="text-[11px] font-semibold text-center mt-2 truncate w-full text-[#181715]">
                              {item.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Drag & Drop Upload Section (Optional) */}
                  <div className="pt-3">
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-[#78736B] font-semibold mb-2">
                      Upload reference images (Optional)
                    </label>

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[#DDD7CD] hover:border-[#8C6534] rounded-2xl p-5 text-center cursor-pointer transition-colors bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] flex flex-col items-center justify-center gap-2 group"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <div className="w-10 h-10 rounded-full bg-white border border-[#E5E0D8] flex items-center justify-center text-[#8C6534] group-hover:scale-110 transition-transform shadow-xs">
                        <Upload className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#181715]">
                          Drag &amp; drop or click to upload reference images
                        </p>
                        <p className="text-[11px] text-[#78736B] mt-0.5">
                          Photos of fabrics, accessories, styles or technical sheets (PNG, JPG up to 8MB)
                        </p>
                      </div>
                    </div>

                    {/* Uploaded File Pills */}
                    {uploadedFiles.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {uploadedFiles.map((file, idx) => (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-2 bg-[#F3EFE6] border border-[#DDD6C8] px-3 py-1.5 rounded-full text-xs"
                          >
                            <span className="truncate max-w-[140px] text-[#181715] font-medium">
                              {file.name}
                            </span>
                            <span className="text-[10px] text-[#8C877E] font-mono">
                              ({file.sizeKb} KB)
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFile(idx);
                              }}
                              className="text-[#8C877E] hover:text-[#C4432B] transition-colors cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Step 1 Error Notice */}
                  {step1Error && (
                    <div className="p-3 bg-[#FDF2F0] border border-[#F5C2B8] rounded-xl flex items-center gap-2 text-xs text-[#C4432B] font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{step1Error}</span>
                    </div>
                  )}

                  {/* Step 1 Action Bar */}
                  <div className="pt-4 border-t border-[#ECE7DE] flex items-center justify-between">
                    <span className="text-xs text-[#78736B]">
                      {selectedKit.length} material(s) chosen
                    </span>
                    <button
                      type="button"
                      onClick={handleProceedToStep2}
                      className="inline-flex items-center gap-2 bg-[#181715] hover:bg-[#2B2824] text-white font-bold px-7 py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer"
                    >
                      <span>Continue to Requirements</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ================================================================= */}
              {/* STEP 2: YOUR REQUIREMENT                                          */}
              {/* ================================================================= */}
              {currentStep === 2 && (
                <div
                  className="rounded-3xl border border-[#E5E0D8] bg-white p-6 sm:p-8 space-y-6"
                  style={{
                    boxShadow:
                      '0 20px 50px -10px rgba(24, 23, 21, 0.08), 0 5px 15px rgba(24, 23, 21, 0.03)',
                  }}
                >
                  <div className="flex items-center justify-between border-b border-[#ECE7DE] pb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#181715] text-[#D4AF37] flex items-center justify-center font-bold text-xs">
                        2
                      </span>
                      <div>
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181715] tracking-tight">
                          Specify Your Requirement
                        </h2>
                        <p className="text-xs text-[#6B665E] mt-0.5">
                          Quantities, specifications, and delivery target.{' '}
                          <span className="text-[#C4432B] font-semibold">* Required</span>
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="inline-flex items-center gap-1.5 text-xs text-[#78736B] hover:text-[#181715] transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Materials</span>
                    </button>
                  </div>

                  {/* Material / Product Name */}
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-[#78736B] font-semibold mb-1.5">
                      MATERIAL / FABRIC TITLE <span className="text-[#C4432B] font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.materialName}
                      onChange={(e) => setFormData({ ...formData, materialName: e.target.value })}
                      placeholder="e.g. 100% Combed Cotton Single Jersey / Heavy Indigo Twill"
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-[#DDD7CD] bg-white text-[#181715] placeholder-[#9E988E] focus:outline-none focus:border-[#8C6534] focus:ring-1 focus:ring-[#8C6534] transition-all"
                    />
                  </div>

                  {/* Quantity & Unit */}
                  <div className="space-y-2">
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-[#78736B] font-semibold">
                      REQUIRED TARGET QUANTITY <span className="text-[#C4432B] font-bold">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-8">
                        <input
                          type="text"
                          disabled={isQuantityUndecided}
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                          placeholder={isQuantityUndecided ? 'Sampling first / Undecided' : 'e.g. 1,200'}
                          className={`w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-[#DDD7CD] text-[#181715] placeholder-[#9E988E] focus:outline-none focus:border-[#8C6534] ${
                            isQuantityUndecided ? 'bg-[#F5F2EB] opacity-60' : 'bg-white'
                          }`}
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <select
                          disabled={isQuantityUndecided}
                          value={formData.unit}
                          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                          className="w-full px-3 py-3 text-xs sm:text-sm rounded-xl border border-[#DDD7CD] bg-white text-[#181715] focus:outline-none focus:border-[#8C6534]"
                        >
                          <option value="Metres">Metres</option>
                          <option value="Yards">Yards</option>
                          <option value="Kilograms">Kilograms (Kg)</option>
                          <option value="Pieces">Pieces</option>
                          <option value="Rolls">Rolls</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="qty-undecided"
                        checked={isQuantityUndecided}
                        onChange={(e) => {
                          setIsQuantityUndecided(e.target.checked);
                          if (e.target.checked) {
                            setFormData((prev) => ({ ...prev, quantity: 'Undecided' }));
                          } else {
                            setFormData((prev) => ({ ...prev, quantity: '1,200' }));
                          }
                        }}
                        className="rounded border-[#DDD7CD] text-[#8C6534] focus:ring-[#8C6534]"
                      />
                      <label htmlFor="qty-undecided" className="text-xs text-[#78736B] cursor-pointer">
                        Quantity undecided / Need physical swatch sampling first
                      </label>
                    </div>
                  </div>

                  {/* Specifications Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#78736B] font-semibold mb-1">
                        FABRIC WIDTH (OPTIONAL)
                      </label>
                      <input
                        type="text"
                        value={formData.width || ''}
                        onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                        placeholder="e.g. 58 / 60 inches"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#DDD7CD] bg-white text-[#181715] placeholder-[#9E988E] focus:outline-none focus:border-[#8C6534]"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#78736B] font-semibold mb-1">
                        GSM / WEIGHT (OPTIONAL)
                      </label>
                      <input
                        type="text"
                        value={formData.gsmOrWeight || ''}
                        onChange={(e) => setFormData({ ...formData, gsmOrWeight: e.target.value })}
                        placeholder="e.g. 180 - 220 GSM"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#DDD7CD] bg-white text-[#181715] placeholder-[#9E988E] focus:outline-none focus:border-[#8C6534]"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#78736B] font-semibold mb-1">
                        COMPOSITION (OPTIONAL)
                      </label>
                      <input
                        type="text"
                        value={formData.composition || ''}
                        onChange={(e) => setFormData({ ...formData, composition: e.target.value })}
                        placeholder="e.g. 100% Combed Cotton, 95/5 Cotton Lycra"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#DDD7CD] bg-white text-[#181715] placeholder-[#9E988E] focus:outline-none focus:border-[#8C6534]"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#78736B] font-semibold mb-1">
                        WEAVE / FINISH (OPTIONAL)
                      </label>
                      <input
                        type="text"
                        value={formData.weaveOrFinish || ''}
                        onChange={(e) => setFormData({ ...formData, weaveOrFinish: e.target.value })}
                        placeholder="e.g. Enzyme Washed, Mercerized, Bio-polish"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#DDD7CD] bg-white text-[#181715] placeholder-[#9E988E] focus:outline-none focus:border-[#8C6534]"
                      />
                    </div>
                  </div>

                  {/* Delivery Timeline */}
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-[#78736B] font-semibold mb-1.5">
                      TARGET DELIVERY TIMELINE
                    </label>
                    <input
                      type="text"
                      value={formData.targetDate || ''}
                      onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                      placeholder="e.g. May 2026 / Within 3 Weeks"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#DDD7CD] bg-white text-[#181715] placeholder-[#9E988E] focus:outline-none focus:border-[#8C6534]"
                    />
                  </div>

                  {/* Step 2 Error Notice */}
                  {step2Error && (
                    <div className="p-3 bg-[#FDF2F0] border border-[#F5C2B8] rounded-xl flex items-center gap-2 text-xs text-[#C4432B] font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{step2Error}</span>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="pt-4 border-t border-[#ECE7DE] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-xs text-[#78736B] hover:text-[#181715] font-semibold uppercase tracking-wider cursor-pointer"
                    >
                      &larr; Back
                    </button>
                    <button
                      type="button"
                      onClick={handleProceedToStep3}
                      className="inline-flex items-center gap-2 bg-[#181715] hover:bg-[#2B2824] text-white font-bold px-7 py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer"
                    >
                      <span>Continue to Contact Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ================================================================= */}
              {/* STEP 3: CONTACT DETAILS                                           */}
              {/* ================================================================= */}
              {currentStep === 3 && (
                <div
                  className="rounded-3xl border border-[#E5E0D8] bg-white p-6 sm:p-8 space-y-6"
                  style={{
                    boxShadow:
                      '0 20px 50px -10px rgba(24, 23, 21, 0.08), 0 5px 15px rgba(24, 23, 21, 0.03)',
                  }}
                >
                  <div className="flex items-center justify-between border-b border-[#ECE7DE] pb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#181715] text-[#D4AF37] flex items-center justify-center font-bold text-xs">
                        3
                      </span>
                      <div>
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181715] tracking-tight">
                          3. Contact Details
                        </h2>
                        <p className="text-xs text-[#6B665E] mt-0.5">
                          Where should we send your quotation and material samples?{' '}
                          <span className="text-[#C4432B] font-semibold">* Required</span>
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="inline-flex items-center gap-1.5 text-xs text-[#78736B] hover:text-[#181715] transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Requirements</span>
                    </button>
                  </div>

                  <form onSubmit={handleSubmitEnquiry} className="space-y-4">
                    {/* Full Name & Company */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#78736B] font-semibold mb-1.5">
                          FULL NAME <span className="text-[#C4432B] font-bold">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E988E]">
                            <User className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            required
                            value={formData.contactName}
                            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                            placeholder="Your Name"
                            className="w-full pl-10 pr-3.5 py-3 text-xs sm:text-sm rounded-xl border border-[#DDD7CD] bg-white text-[#181715] placeholder-[#9E988E] focus:outline-none focus:border-[#8C6534] focus:ring-1 focus:ring-[#8C6534] transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#78736B] font-semibold mb-1.5">
                          COMPANY / BRAND (OPTIONAL)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E988E]">
                            <Building className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            value={formData.companyName || ''}
                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                            placeholder="Apparel Brand / Factory Name"
                            className="w-full pl-10 pr-3.5 py-3 text-xs sm:text-sm rounded-xl border border-[#DDD7CD] bg-white text-[#181715] placeholder-[#9E988E] focus:outline-none focus:border-[#8C6534] focus:ring-1 focus:ring-[#8C6534] transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Phone & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#78736B] font-semibold mb-1.5">
                          PHONE / WHATSAPP NUMBER <span className="text-[#C4432B] font-bold">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E988E]">
                            <Phone className="w-4 h-4" />
                          </div>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+91 94432 23150"
                            className="w-full pl-10 pr-3.5 py-3 text-xs sm:text-sm rounded-xl border border-[#DDD7CD] bg-white text-[#181715] placeholder-[#9E988E] focus:outline-none focus:border-[#8C6534] focus:ring-1 focus:ring-[#8C6534] transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#78736B] font-semibold mb-1.5">
                          EMAIL ADDRESS <span className="text-[#C4432B] font-bold">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E988E]">
                            <Mail className="w-4 h-4" />
                          </div>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="buyer@brand.com"
                            className="w-full pl-10 pr-3.5 py-3 text-xs sm:text-sm rounded-xl border border-[#DDD7CD] bg-white text-[#181715] placeholder-[#9E988E] focus:outline-none focus:border-[#8C6534] focus:ring-1 focus:ring-[#8C6534] transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Delivery Location */}
                    <div>
                      <label className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#78736B] font-semibold mb-1.5">
                        DELIVERY LOCATION / CITY <span className="text-[#C4432B] font-bold">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E988E]">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={formData.cityState}
                          onChange={(e) => setFormData({ ...formData, cityState: e.target.value })}
                          placeholder="e.g. Tiruppur, Bengaluru, Mumbai, or International"
                          className="w-full pl-10 pr-3.5 py-3 text-xs sm:text-sm rounded-xl border border-[#DDD7CD] bg-white text-[#181715] placeholder-[#9E988E] focus:outline-none focus:border-[#8C6534] focus:ring-1 focus:ring-[#8C6534] transition-all"
                        />
                      </div>
                    </div>

                    {/* Additional Notes */}
                    <div>
                      <label className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#78736B] font-semibold mb-1.5">
                        ADDITIONAL NOTES / TESTING REQUIREMENTS (OPTIONAL)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.additionalNotes || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, additionalNotes: e.target.value })
                        }
                        placeholder="Specify color fastness, Oeko-Tex certification, shrinkage limits, or any special production requests..."
                        className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-[#DDD7CD] bg-white text-[#181715] placeholder-[#9E988E] focus:outline-none focus:border-[#8C6534] focus:ring-1 focus:ring-[#8C6534] transition-all resize-none"
                      />
                    </div>

                    {/* Notice Box */}
                    <div className="p-3.5 bg-[#FAF8F5] border border-[#DDD7CD] rounded-xl flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#8C6534]/15 text-[#8C6534] flex items-center justify-center shrink-0 mt-0.5">
                        <FileCheck className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-[11px] sm:text-xs text-[#78736B] leading-relaxed">
                        We prioritize inquiries with accurate company details and estimated order
                        volumes. Standard turnaround time is 24 business hours.
                      </p>
                    </div>

                    {/* Step 3 Error Notice */}
                    {step3Error && (
                      <div className="p-3 bg-[#FDF2F0] border border-[#F5C2B8] rounded-xl flex items-center gap-2 text-xs text-[#C4432B] font-medium">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{step3Error}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2.5 bg-[#181715] hover:bg-[#2B2824] text-white font-bold py-3.5 px-6 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <span>Processing Brief...</span>
                        ) : (
                          <>
                            <span>Review &amp; Submit Brief</span>
                            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* ------------------------------------------------------------------- */}
            {/* RIGHT COLUMN: "YOUR MATERIAL BRIEF" SIDEBAR (~42% WIDTH)            */}
            {/* ------------------------------------------------------------------- */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              <div
                className="rounded-3xl border border-[#E5E0D8] bg-white p-6 space-y-5"
                style={{
                  boxShadow:
                    '0 20px 50px -10px rgba(24, 23, 21, 0.08), 0 5px 15px rgba(24, 23, 21, 0.03)',
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#ECE7DE] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[#8C6534] font-serif text-lg">✦</span>
                    <h3 className="font-serif text-xl font-bold text-[#181715]">
                      Your Material Brief
                    </h3>
                  </div>

                  <span className="bg-[#FAF8F5] border border-[#DDD7CD] text-[#78736B] font-mono text-[11px] px-2.5 py-0.5 rounded-full font-semibold">
                    {selectedKit.length} {selectedKit.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {/* Swatch List Card */}
                {selectedKit.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-[#DDD7CD] rounded-2xl bg-[#FAF8F5]/60">
                    <Package className="w-8 h-8 text-[#9E988E] mx-auto mb-2" />
                    <p className="text-xs font-semibold text-[#181715]">No items selected yet</p>
                    <p className="text-[11px] text-[#78736B] mt-1">
                      Pick fabrics or accessories to start building your brief.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedKit.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-[#E5E0D8] bg-[#FAF8F5] p-3 flex items-center justify-between gap-3 shadow-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-[#DDD7CD] shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="text-[9px] font-mono uppercase tracking-wider text-[#8C6534] font-bold">
                              {item.categoryLabel}
                            </span>
                            <h4 className="font-serif font-bold text-sm text-[#181715] leading-tight">
                              {item.name}
                            </h4>
                            <p className="text-[10px] text-[#78736B] leading-tight mt-0.5">
                              {item.defaultSpecs?.composition || item.defaultSpecs?.typeVariant || 'Premium Sourcing'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setCurrentStep(1)}
                            className="text-[11px] text-[#8C6534] hover:underline font-semibold cursor-pointer"
                          >
                            Change
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Summary Metrics */}
                <div className="space-y-2.5 pt-2 text-xs border-t border-[#ECE7DE]">
                  <div className="flex items-center justify-between text-[#78736B]">
                    <span>Selected Items</span>
                    <span className="font-semibold text-[#181715]">{selectedKit.length}</span>
                  </div>

                  <div className="flex items-center justify-between text-[#78736B]">
                    <span>Target Quantity</span>
                    <span className="font-semibold text-[#181715]">
                      {isQuantityUndecided
                        ? 'Sampling / Undecided'
                        : `${formData.quantity || '1,200'} ${formData.unit || 'Metres'}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[#78736B]">
                    <span>Reference Images</span>
                    <span className="font-semibold text-[#181715]">
                      {uploadedFiles.length > 0
                        ? `${uploadedFiles.length} file(s) attached`
                        : '0'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[#78736B]">
                    <span>Delivery Target</span>
                    <span className="font-semibold text-[#181715]">
                      {formData.targetDate || 'Flexible'}
                    </span>
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="pt-2">
                  {currentStep === 1 && (
                    <button
                      type="button"
                      onClick={handleProceedToStep2}
                      className="w-full flex items-center justify-center gap-2 bg-[#181715] hover:bg-[#2B2824] text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer"
                    >
                      <span>Continue to Next Step</span>
                      <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                    </button>
                  )}

                  {currentStep === 2 && (
                    <button
                      type="button"
                      onClick={handleProceedToStep3}
                      className="w-full flex items-center justify-center gap-2 bg-[#181715] hover:bg-[#2B2824] text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer"
                    >
                      <span>Continue to Contact Details</span>
                      <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                    </button>
                  )}

                  {currentStep === 3 && (
                    <button
                      type="button"
                      onClick={handleSubmitEnquiry}
                      className="w-full flex items-center justify-center gap-2 bg-[#181715] hover:bg-[#2B2824] text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer"
                    >
                      <span>Submit Material Brief</span>
                      <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                    </button>
                  )}
                </div>

                {/* Assistance Card */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#181715]">
                    <div className="w-6 h-6 rounded-full bg-[#F3EFE6] text-[#8C6534] flex items-center justify-center">
                      <Headphones className="w-3.5 h-3.5" />
                    </div>
                    <span>For more info, contact us</span>
                  </div>
                  <p className="text-[11px] text-[#78736B] leading-relaxed">
                    Our textile sourcing team is here to assist with physical swatches, lab dips, and bulk manufacturing.
                  </p>
                  <a
                    href={`tel:${VERIFIED_PHONE_RAW}`}
                    className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#8C6534] hover:text-[#181715] transition-colors pt-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{VERIFIED_PHONE_DISPLAY}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
