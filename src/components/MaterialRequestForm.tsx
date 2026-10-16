import React, { useState, useEffect, useRef } from 'react';
import {
  MaterialRequestCategory,
  MaterialRequestData,
  MaterialRequestSubmission,
  Product,
} from '../types.ts';
import {
  Layers,
  Upload,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Send,
  HelpCircle,
  Package,
  Sparkles,
  Scissors,
  Bookmark,
  Share2,
  RefreshCw,
  X,
  Pencil,
  Check,
  AlertCircle,
  Phone,
  Mail,
  Building,
  MapPin,
  Plus,
  Trash2,
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
  defaultSpecs?: Record<string, string>;
}

// 3 Main Material Discovery Pillars
type MainDiscoveryCategory = 'fabric' | 'accessories' | 'custom';

interface MainCategoryCard {
  id: MainDiscoveryCategory;
  title: string;
  subtitle: string;
  image: string;
  icon: 'Layers' | 'Bookmark' | 'Scissors';
  mappedCategory: MaterialRequestCategory;
}

const MAIN_CATEGORIES: MainCategoryCard[] = [
  {
    id: 'fabric',
    title: 'Fabrics',
    subtitle: 'Cotton, linen, denim, mesh and more.',
    image: '/assets/materials/fabrics.jpg',
    icon: 'Layers',
    mappedCategory: 'fabric',
  },
  {
    id: 'accessories',
    title: 'Garment Accessories',
    subtitle: 'Laces, zippers, buttons, tipping and more.',
    image: '/assets/materials/accessories.jpg',
    icon: 'Bookmark',
    mappedCategory: 'accessories',
  },
  {
    id: 'custom',
    title: 'Custom Manufacturing',
    subtitle: 'Tailored fabrics and unique material solutions.',
    image: '/assets/materials/processing.jpg',
    icon: 'Scissors',
    mappedCategory: 'other',
  },
];

// Swatch items for each category
const SWATCH_CATALOG: Record<MainDiscoveryCategory, KitItem[]> = {
  fabric: [
    {
      id: 'cotton',
      name: 'Cotton',
      categoryLabel: 'Fabric',
      image: '/assets/materials/fabrics/cotton.jpg',
      category: 'fabric',
      defaultSpecs: { composition: '100% Combed Cotton', typeVariant: 'Poplin / Gada' },
    },
    {
      id: 'linen',
      name: 'Linen',
      categoryLabel: 'Fabric',
      image: '/assets/materials/fabrics/linen.jpg',
      category: 'fabric',
      defaultSpecs: { composition: '100% Pure Flax Linen', typeVariant: 'Plain Weave' },
    },
    {
      id: 'denim',
      name: 'Denim',
      categoryLabel: 'Fabric',
      image: '/assets/materials/fabrics/denim.jpg',
      category: 'denim',
      defaultSpecs: { composition: 'Cotton Twill', gsmOrWeight: '11.5 Oz', typeVariant: 'Indigo Twill' },
    },
    {
      id: 'chambray',
      name: 'Chambray',
      categoryLabel: 'Fabric',
      image: '/assets/materials/fabrics/chambray.jpg',
      category: 'fabric',
      defaultSpecs: { composition: '100% Cotton Chambray', typeVariant: 'Plain Weave' },
    },
    {
      id: 'mesh',
      name: 'Mesh',
      categoryLabel: 'Fabric',
      image: '/assets/materials/fabrics/mesh-fabrics.jpg',
      category: 'mesh',
      defaultSpecs: { composition: 'Poly / Lycra Mesh', typeVariant: 'Open-Pore Net' },
    },
    {
      id: 'others-fabric',
      name: 'Others',
      categoryLabel: 'Fabric',
      image: '/assets/materials/fabrics/plain.jpg',
      category: 'fabric',
      defaultSpecs: { typeVariant: 'Custom Woven / Knit Substrate' },
    },
  ],
  accessories: [
    {
      id: 'laces',
      name: 'Laces',
      categoryLabel: 'Accessory',
      image: '/assets/materials/laces.jpg',
      category: 'lace',
      defaultSpecs: { typeVariant: 'Guipure / Cotton Lace' },
    },
    {
      id: 'zippers',
      name: 'Zippers',
      categoryLabel: 'Accessory',
      image: '/assets/materials/accessories.jpg',
      category: 'zipper',
      defaultSpecs: { typeVariant: '#5 Metal / Nylon Coil' },
    },
    {
      id: 'buttons',
      name: 'Buttons',
      categoryLabel: 'Accessory',
      image: '/assets/materials/buttons.jpg',
      category: 'button',
      defaultSpecs: { typeVariant: 'Horn / Coconut / Snap Buttons' },
    },
    {
      id: 'tipping',
      name: 'Tipping',
      categoryLabel: 'Accessory',
      image: '/assets/materials/tags.jpg',
      category: 'tipping',
      defaultSpecs: { typeVariant: 'Metal Aglets / Silicone Dipped' },
    },
    {
      id: 'tapes',
      name: 'Tapes & Elastics',
      categoryLabel: 'Accessory',
      image: '/assets/materials/tapes.jpg',
      category: 'accessories',
      defaultSpecs: { typeVariant: 'Cotton Twill / Herringbone' },
    },
    {
      id: 'others-acc',
      name: 'Others',
      categoryLabel: 'Accessory',
      image: '/assets/materials/fabrics-collection-board.jpg',
      category: 'accessories',
      defaultSpecs: { typeVariant: 'Branded Tags / Finishing Trims' },
    },
  ],
  custom: [
    {
      id: 'custom-dyeing',
      name: 'Custom Dyeing & RFD',
      categoryLabel: 'Custom',
      image: '/assets/materials/fabrics/plain.jpg',
      category: 'other',
      defaultSpecs: { typeVariant: 'Pantone Dye-to-Match / RFD' },
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
      defaultSpecs: { typeVariant: 'Heavy Weight Canvas / Broad Width' },
    },
    {
      id: 'branded-trims',
      name: 'Branded Hardware',
      categoryLabel: 'Custom',
      image: '/assets/materials/tags.jpg',
      category: 'other',
      defaultSpecs: { typeVariant: 'Laser Engraved Brand Hardware' },
    },
    {
      id: 'slitting-cutting',
      name: 'Slitting & Scalping',
      categoryLabel: 'Custom',
      image: '/assets/materials/processing.jpg',
      category: 'processing',
      defaultSpecs: { typeVariant: 'Precision Edge Cutting & Slitting' },
    },
    {
      id: 'tech-pack-dev',
      name: 'Tech Pack Dev',
      categoryLabel: 'Custom',
      image: '/assets/materials/fabrics-collection-board.jpg',
      category: 'other',
      defaultSpecs: { typeVariant: 'Prototype & Full Tech Pack Dev' },
    },
  ],
};

const INITIAL_REQUEST: MaterialRequestData = {
  category: 'fabric',
  materialName: '',
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

export const MaterialRequestForm: React.FC<MaterialRequestFormProps> = ({
  initialData,
  similarProduct,
  onExploreCatalogue,
  onReachUs,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeMainCategory, setActiveMainCategory] = useState<MainDiscoveryCategory>('fabric');
  
  // Material Kit: stores items selected by the user
  const [selectedKit, setSelectedKit] = useState<KitItem[]>(() => {
    if (similarProduct) {
      return [
        {
          id: similarProduct.id,
          name: similarProduct.name,
          categoryLabel: similarProduct.category.toUpperCase(),
          image: similarProduct.images[0] || '/assets/materials/fabrics.jpg',
          category: (similarProduct.category === 'laces' ? 'lace' : similarProduct.category === 'denim' ? 'denim' : similarProduct.category === 'mesh' ? 'mesh' : 'fabric'),
          defaultSpecs: { composition: similarProduct.fabric, typeVariant: similarProduct.subcategory },
        },
      ];
    }
    // Default starting selection: Cotton
    return [SWATCH_CATALOG.fabric[0]];
  });

  const [formData, setFormData] = useState<MaterialRequestData>(() => ({
    ...INITIAL_REQUEST,
    ...initialData,
    materialName: initialData?.materialName || (similarProduct ? `Alternative for ${similarProduct.name}` : 'Cotton'),
    specifications: {
      ...INITIAL_REQUEST.specifications,
      composition: '100% Combed Cotton',
      typeVariant: 'Poplin / Gada',
      ...(initialData?.specifications || {}),
    },
  }));

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isQuantityUndecided, setIsQuantityUndecided] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [submission, setSubmission] = useState<MaterialRequestSubmission | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync selectedKit with formData.materialName and primary category
  useEffect(() => {
    if (selectedKit.length > 0) {
      const names = selectedKit.map((item) => item.name).join(', ');
      const primaryCat = selectedKit[0].category;
      setFormData((prev) => ({
        ...prev,
        category: primaryCat,
        materialName: names,
      }));
    }
  }, [selectedKit]);

  // Toggle swatch item in Kit
  const handleToggleSwatch = (item: KitItem) => {
    setSelectedKit((prev) => {
      const exists = prev.some((k) => k.id === item.id);
      if (exists) {
        // Don't remove if it's the only one left
        if (prev.length <= 1) return prev;
        return prev.filter((k) => k.id !== item.id);
      } else {
        // Add to kit
        const updated = [...prev, item];
        // Adopt default specs if empty
        if (item.defaultSpecs) {
          setFormData((f) => ({
            ...f,
            specifications: {
              ...f.specifications,
              composition: f.specifications.composition || item.defaultSpecs?.composition || '',
              typeVariant: f.specifications.typeVariant || item.defaultSpecs?.typeVariant || '',
              gsmOrWeight: f.specifications.gsmOrWeight || item.defaultSpecs?.gsmOrWeight || '',
            },
          }));
        }
        return updated;
      }
    });
  };

  const handleRemoveFromKit = (id: string) => {
    setSelectedKit((prev) => {
      if (prev.length <= 1) {
        alert('You need at least one material in your Material Kit.');
        return prev;
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  // Upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (uploadedFiles.length + files.length > 4) {
      alert('You can upload a maximum of 4 reference images.');
      return;
    }

    Array.from(files).forEach((file) => {
      if (file.size > 8 * 1024 * 1024) {
        alert(`"${file.name}" exceeds 8MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const newUploaded: UploadedFile = {
          name: file.name,
          dataUrl: result,
          sizeKb: Math.round(file.size / 1024),
        };

        setUploadedFiles((prev) => {
          const updated = [...prev, newUploaded];
          setFormData((f) => ({
            ...f,
            referenceImage: updated[0],
            referenceImages: updated,
          }));
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setUploadedFiles((prev) => {
      const updated = prev.filter((_, idx) => idx !== indexToRemove);
      setFormData((f) => ({
        ...f,
        referenceImage: updated[0] || undefined,
        referenceImages: updated.length > 0 ? updated : undefined,
      }));
      return updated;
    });
  };

  // Step validation
  const validateCurrentStep = (): boolean => {
    const errors: Record<string, string> = {};

    if (currentStep === 1) {
      if (selectedKit.length === 0) {
        errors.kit = 'Please select at least one material for your Kit.';
      }
    } else if (currentStep === 2) {
      if (!formData.materialName.trim()) {
        errors.materialName = 'Please enter or confirm your material description.';
      }
    } else if (currentStep === 4) {
      if (!isQuantityUndecided && !formData.quantity.trim()) {
        errors.quantity = 'Please specify required quantity or select "Not decided yet".';
      }
    } else if (currentStep === 5) {
      if (!formData.contactName.trim()) {
        errors.contactName = 'Please provide your full name.';
      }
      if (!formData.phone.trim()) {
        errors.phone = 'Please provide a valid phone or WhatsApp number.';
      } else if (!/^[0-9+() -]{7,16}$/.test(formData.phone.trim())) {
        errors.phone = 'Please enter a valid phone number.';
      }
      if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        errors.email = 'Please enter a valid email address.';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(5, prev + 1));
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setValidationErrors({});
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handleJumpToStep = (stepNumber: number) => {
    setValidationErrors({});
    setCurrentStep(stepNumber);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    const referenceCode = `CF-REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalQuantity = isQuantityUndecided ? 'Not decided yet' : formData.quantity;

    const newSubmission: MaterialRequestSubmission = {
      ...formData,
      quantity: finalQuantity,
      id: Date.now().toString(),
      referenceCode,
      submittedAt: Date.now(),
      referenceImage: uploadedFiles[0] || undefined,
      referenceImages: uploadedFiles.length > 0 ? uploadedFiles : undefined,
    };

    setSubmission(newSubmission);
    try {
      const existing = localStorage.getItem(STORAGE_SUBMISSIONS_KEY);
      const list = existing ? JSON.parse(existing) : [];
      localStorage.setItem(STORAGE_SUBMISSIONS_KEY, JSON.stringify([newSubmission, ...list]));
    } catch {
      // Ignore storage errors
    }

    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const generateWhatsAppMessage = (sub: MaterialRequestSubmission) => {
    const text = `*CLASSIC FASHIONS — MATERIAL DISCOVERY ENQUIRY*
*Ref Code:* ${sub.referenceCode}
*Selected Materials:* ${selectedKit.map((k) => k.name).join(', ') || sub.materialName}
${sub.specifications.composition ? `*Composition:* ${sub.specifications.composition}\n` : ''}${sub.specifications.widthOrSize ? `*Width/Size:* ${sub.specifications.widthOrSize}\n` : ''}${sub.specifications.gsmOrWeight ? `*GSM/Weight:* ${sub.specifications.gsmOrWeight}\n` : ''}${sub.specifications.colourPreference ? `*Colour:* ${sub.specifications.colourPreference}\n` : ''}${sub.specifications.patternOrFinish ? `*Finish:* ${sub.specifications.patternOrFinish}\n` : ''}
*Quantity:* ${sub.quantity} ${sub.quantity !== 'Not decided yet' ? sub.unit : ''}
*Timeline:* ${sub.targetTimeline || 'Standard'}
*Client:* ${sub.contactName} (${sub.companyName || 'Studio'})
*Phone:* ${sub.phone}
${sub.email ? `*Email:* ${sub.email}\n` : ''}${sub.cityState ? `*Location:* ${sub.cityState}\n` : ''}
_Submitted via Classic Fashions Material Discovery Studio._`;

    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  // --------------------------------------------------------------------------
  // SUCCESS / CONFIRMATION SCREEN
  // --------------------------------------------------------------------------
  if (submission) {
    return (
      <div className="bg-[#FAF9F6] min-h-screen py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="bg-white border border-[#E8E2D8] rounded-3xl shadow-[0_12px_40px_rgba(24,23,21,0.06)] p-6 sm:p-10 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#EFEAE2] gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EE] border border-[#ECDCCB] text-[#82553E] text-xs font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Enquiry Received Successfully</span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181715] pt-1">
                  Thank You, {submission.contactName}
                </h1>
                <p className="text-xs sm:text-sm text-[#5C564D]">
                  Our Tiruppur sourcing team has recorded your material discovery enquiry.
                </p>
              </div>

              <div className="bg-[#FAF8F5] border border-[#E8E2D8] p-3.5 rounded-2xl text-left sm:text-right shrink-0">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#8A847C] block font-semibold">
                  Reference Code
                </span>
                <span className="font-mono text-base sm:text-lg font-bold text-[#181715]">
                  {submission.referenceCode}
                </span>
              </div>
            </div>

            {/* Selected Materials in Kit Review */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[#82553E] font-semibold block">
                Materials in Your Kit ({selectedKit.length})
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {selectedKit.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF9F6] border border-[#E8E2D8]">
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-[#DDD5C9]" />
                    <div className="min-w-0">
                      <span className="block font-serif text-xs font-bold text-[#181715] truncate">{item.name}</span>
                      <span className="text-[10px] text-[#7A7369] font-mono block">{item.categoryLabel}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs bg-[#FAF9F6] p-5 sm:p-6 rounded-2xl border border-[#ECE6DC]">
              <div className="space-y-2">
                <h4 className="font-serif text-sm font-bold text-[#181715] border-b border-[#E2DBD0] pb-1.5 uppercase tracking-wide">
                  Technical Parameters
                </h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#7A7369]">Composition:</span>
                    <span className="font-medium text-[#181715] text-right">{submission.specifications.composition || 'As per sample'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A7369]">Width / Gauge:</span>
                    <span className="font-medium text-[#181715]">{submission.specifications.widthOrSize || 'Standard'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A7369]">Weight (GSM/Oz):</span>
                    <span className="font-medium text-[#181715]">{submission.specifications.gsmOrWeight || 'Standard'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A7369]">Colour Preference:</span>
                    <span className="font-medium text-[#181715]">{submission.specifications.colourPreference || 'As per swatch'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif text-sm font-bold text-[#181715] border-b border-[#E2DBD0] pb-1.5 uppercase tracking-wide">
                  Order Scope &amp; Destination
                </h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#7A7369]">Quantity:</span>
                    <span className="font-semibold text-[#181715] font-mono">
                      {submission.quantity} {submission.quantity !== 'Not decided yet' ? submission.unit : ''}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A7369]">Target Timeline:</span>
                    <span className="font-medium text-[#181715]">{submission.targetTimeline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A7369]">Phone / WhatsApp:</span>
                    <span className="font-mono font-semibold text-[#181715]">{submission.phone}</span>
                  </div>
                  {submission.cityState && (
                    <div className="flex justify-between">
                      <span className="text-[#7A7369]">Delivery Location:</span>
                      <span className="font-medium text-[#181715]">{submission.cityState}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <a
                href={generateWhatsAppMessage(submission)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#181715] hover:bg-[#2C2925] text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-sm active:scale-[0.98]"
              >
                <Share2 className="w-4 h-4 text-[#D4AF37]" />
                <span>Forward to WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  setSubmission(null);
                  setCurrentStep(1);
                  setFormData(INITIAL_REQUEST);
                  setUploadedFiles([]);
                  setIsQuantityUndecided(false);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white border border-[#DDD5C9] text-[#181715] hover:bg-[#FAF8F5] rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#82553E]" />
                <span>Start New Discovery</span>
              </button>

              <button
                onClick={onExploreCatalogue}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#82553E] hover:bg-[#6D432E] text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ml-auto shadow-xs cursor-pointer"
              >
                <span>Return to Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active swatches for current category
  const activeSwatches = SWATCH_CATALOG[activeMainCategory];

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-8 md:py-14 relative overflow-hidden">
      
      {/* Decorative vertical agency watermark along left margin (matching reference design) */}
      <div
        aria-hidden="true"
        className="hidden 2xl:flex items-center gap-3 absolute left-6 top-1/2 -translate-y-1/2 -rotate-90 origin-left text-[10px] font-mono tracking-[0.3em] uppercase text-[#A8A196] select-none pointer-events-none"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
        <span>Quality Materials For Better Creations</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* 1. PREMIUM HERO SECTION WITH REALISTIC TEXTILE BANNER (Matching Reference) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#82553E] font-bold block">
              REQUEST MATERIAL
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181715] tracking-tight leading-[1.12]">
              Can&apos;t Find the Right Material?
            </h1>
            <p className="font-serif text-lg sm:text-xl text-[#82553E] font-medium">
              Tell Us What You Need.
            </p>
            <p className="text-sm sm:text-base text-[#585550] max-w-xl leading-relaxed">
              Share your material requirements with us. We’ll help you find suitable materials or discuss custom manufacturing options.
            </p>
          </div>

          {/* Right Textile Visual Banner featuring realistic raw fabric photography & script watermark */}
          <div className="lg:col-span-5">
            <div className="relative h-44 sm:h-52 rounded-3xl overflow-hidden border border-[#E8E2D8] shadow-[0_8px_30px_rgba(24,23,21,0.06)] bg-[#181715] group">
              <img
                src="/assets/materials/fabrics.jpg"
                alt="Realistic raw fabrics rolls"
                className="w-full h-full object-cover object-center filter brightness-[0.92] group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* Elegant script watermark "Your Material Partner" */}
              <div className="absolute top-4 right-5 text-right pointer-events-none">
                <span className="font-['Marcellus',serif] italic text-2xl sm:text-3xl text-white/90 drop-shadow-md block">
                  Your Material
                </span>
                <span className="font-['Marcellus',serif] italic text-xl sm:text-2xl text-[#E8D7C2] block -mt-1">
                  Partner
                </span>
              </div>

              {/* Bottom pill tag */}
              <div className="absolute bottom-3 left-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#181715] text-[11px] font-mono uppercase tracking-wider font-semibold border border-white/20 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#82553E]" />
                  <span>Direct Mill Sourcing Desk</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. MAIN INTERACTIVE STUDIO CONTAINER + SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Discovery Studio Card (Left 8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E8E2D8] shadow-[0_8px_30px_rgba(24,23,21,0.04)] p-6 sm:p-8 space-y-7">
            
            {/* Step Progress Breadcrumb Navigation */}
            <div className="flex items-center justify-between border-b border-[#F0ECE4] pb-5 overflow-x-auto scrollbar-none gap-2">
              {[
                { step: 1, label: 'Material Choice' },
                { step: 2, label: 'Specifications' },
                { step: 3, label: 'Swatch & Image' },
                { step: 4, label: 'Quantity' },
                { step: 5, label: 'Contact' },
              ].map((s) => {
                const isCurrent = currentStep === s.step;
                const isCompleted = currentStep > s.step;
                return (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => {
                      if (isCompleted || s.step < currentStep) {
                        handleJumpToStep(s.step);
                      }
                    }}
                    className={`inline-flex items-center gap-2 shrink-0 transition-opacity ${
                      !isCompleted && !isCurrent ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono font-bold transition-all ${
                        isCurrent
                          ? 'bg-[#82553E] text-white shadow-xs scale-105'
                          : isCompleted
                          ? 'bg-[#181715] text-white'
                          : 'bg-[#EAE4D8] text-[#736F68]'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : s.step}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        isCurrent ? 'text-[#181715] border-b-2 border-[#82553E] pb-0.5' : isCompleted ? 'text-[#82553E]' : 'text-[#8A847C]'
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* STEP 1: INTERACTIVE MATERIAL DISCOVERY STUDIO (Matching Reference) */}
            {/* ---------------------------------------------------------------- */}
            {currentStep === 1 && (
              <div className="space-y-7">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#181715] tracking-tight">
                    What are you looking for?
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B655C] mt-1">
                    Choose the type of material or product you need. You can select multiple options.
                  </p>
                </div>

                {validationErrors.kit && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{validationErrors.kit}</span>
                  </div>
                )}

                {/* 3 Large Image-Based Category Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {MAIN_CATEGORIES.map((cat) => {
                    const isSelected = activeMainCategory === cat.id;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => setActiveMainCategory(cat.id)}
                        className={`rounded-2xl border p-3.5 cursor-pointer transition-all duration-300 flex flex-col justify-between group ${
                          isSelected
                            ? 'border-[#82553E] bg-[#FAF8F5] shadow-sm ring-1.5 ring-[#82553E]'
                            : 'border-[#E5DFD4] bg-white hover:border-[#82553E]/60 hover:bg-[#FAF9F6]'
                        }`}
                      >
                        {/* Top Realistic Image */}
                        <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-[#ECE6DC] mb-3">
                          <img
                            src={cat.image}
                            alt={cat.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-106"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        </div>

                        {/* Title & Icon */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {cat.icon === 'Layers' && <Layers className="w-4 h-4 text-[#82553E]" />}
                            {cat.icon === 'Bookmark' && <Bookmark className="w-4 h-4 text-[#82553E]" />}
                            {cat.icon === 'Scissors' && <Scissors className="w-4 h-4 text-[#82553E]" />}
                            <h4 className="font-serif text-base font-bold text-[#181715]">
                              {cat.title}
                            </h4>
                          </div>
                          <p className="text-[11px] text-[#6E6860] leading-snug">
                            {cat.subtitle}
                          </p>
                        </div>

                        {/* Arrow Action Indicator */}
                        <div className="pt-3 mt-2 border-t border-[#EFEAE2] flex justify-end">
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                              isSelected ? 'bg-[#82553E] text-white' : 'bg-[#F2ECE4] text-[#82553E] group-hover:bg-[#82553E] group-hover:text-white'
                            }`}
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Swatches Section Below (Dynamic to selected main category) */}
                <div className="space-y-3.5 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-base font-bold text-[#181715]">
                      {activeMainCategory === 'fabric' && 'Popular Fabric Types'}
                      {activeMainCategory === 'accessories' && 'Popular Accessory Types'}
                      {activeMainCategory === 'custom' && 'Custom Manufacturing Capabilities'}
                    </h4>
                    <span className="text-xs font-semibold text-[#82553E] hover:underline cursor-pointer">
                      View All &rarr;
                    </span>
                  </div>

                  {/* 6 Realistic Swatch Cards Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {activeSwatches.map((swatch) => {
                      const isSelected = selectedKit.some((k) => k.id === swatch.id);
                      return (
                        <div
                          key={swatch.id}
                          onClick={() => handleToggleSwatch(swatch)}
                          className={`rounded-xl border overflow-hidden cursor-pointer transition-all duration-200 group text-left ${
                            isSelected
                              ? 'border-[#82553E] ring-1.5 ring-[#82553E] shadow-xs bg-[#FAF8F5]'
                              : 'border-[#E0D8CD] bg-white hover:border-[#82553E]/50'
                          }`}
                        >
                          {/* Image Box */}
                          <div className="relative aspect-square w-full overflow-hidden bg-[#ECE6DC]">
                            <img
                              src={swatch.image}
                              alt={swatch.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                            />
                            {/* Checkmark circle on image */}
                            <div className="absolute bottom-2 right-2">
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center border shadow-xs transition-colors ${
                                  isSelected
                                    ? 'bg-[#82553E] border-[#82553E] text-white'
                                    : 'bg-white/80 border-[#C4B7AA] text-transparent'
                                }`}
                              >
                                <Check className="w-3 h-3 stroke-[3]" />
                              </span>
                            </div>
                          </div>

                          {/* Label */}
                          <div className="p-2">
                            <span className="font-serif text-xs font-bold text-[#181715] block truncate">
                              {swatch.name}
                            </span>
                            <span className="text-[10px] text-[#7A7369] font-mono block truncate">
                              {swatch.defaultSpecs?.typeVariant || swatch.categoryLabel}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Studio Footer Toolbar */}
                <div className="pt-4 border-t border-[#F0ECE4] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#5C564D]">
                    <Layers className="w-4 h-4 text-[#82553E]" />
                    <span>
                      <strong className="text-[#181715]">{selectedKit.length}</strong> {selectedKit.length === 1 ? 'material' : 'materials'} selected
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleJumpToStep(2)}
                      className="text-xs font-semibold text-[#736F68] hover:text-[#181715] underline cursor-pointer"
                    >
                      Skip
                    </button>

                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="inline-flex items-center gap-2 px-7 py-2.5 bg-[#82553E] hover:bg-[#6D432E] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-sm active:scale-[0.98] cursor-pointer"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* STEP 2: PROGRESSIVE INTERACTIVE SPECIFICATIONS (No Boring Form!) */}
            {/* ---------------------------------------------------------------- */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#82553E] bg-[#FAF5EE] px-2.5 py-0.5 rounded border border-[#ECDCCB] font-semibold">
                      Step 2 of 5
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#181715] tracking-tight">
                    Specify Material Details
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B655C] mt-1">
                    Select parameters using smart chips or type custom requirements. You can skip any unknown spec.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Primary Material Name */}
                  <div>
                    <label className="block text-xs font-semibold text-[#181715] uppercase tracking-wider mb-1">
                      Material / Product Description <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.materialName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, materialName: e.target.value }))}
                      placeholder="e.g. 100% Combed Cotton Poplin, 25mm Eyelet Lace, #5 Antique Brass Zipper..."
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF9F6] border border-[#D5D0C6] rounded-xl text-[#181715] focus:outline-none focus:border-[#181715]"
                    />
                    {validationErrors.materialName && (
                      <span className="text-[11px] text-red-600 mt-1 block">
                        {validationErrors.materialName}
                      </span>
                    )}
                  </div>

                  {/* Weave / Subtype Chips */}
                  <div>
                    <label className="block text-xs font-semibold text-[#666056] uppercase tracking-wider mb-2">
                      Popular Weaves &amp; Variants
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Plain Weave',
                        'Twill 2/1',
                        'Poplin Gada',
                        'Chambray',
                        'Single Jersey',
                        'Honeycomb',
                        'Guipure Lace',
                        'Metal Zipper',
                        'Natural Horn Button',
                      ].map((variant) => {
                        const isMatch = formData.specifications.typeVariant === variant;
                        return (
                          <button
                            key={variant}
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                specifications: { ...prev.specifications, typeVariant: isMatch ? '' : variant },
                              }))
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                              isMatch
                                ? 'bg-[#181715] text-white shadow-xs'
                                : 'bg-[#FAF8F5] text-[#5C564D] border border-[#E0D8CD] hover:border-[#181715]'
                            }`}
                          >
                            {variant}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Composition Chips */}
                  <div>
                    <label className="block text-xs font-semibold text-[#666056] uppercase tracking-wider mb-2">
                      Fiber / Material Composition
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        '100% Cotton',
                        'Pure Linen',
                        'Cotton-Lycra Blend',
                        '80/20 Cotton-Poly',
                        'Polyester Mesh',
                        'Brass Metal',
                        'Natural Coconut',
                      ].map((comp) => {
                        const isMatch = formData.specifications.composition === comp;
                        return (
                          <button
                            key={comp}
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                specifications: { ...prev.specifications, composition: isMatch ? '' : comp },
                              }))
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                              isMatch
                                ? 'bg-[#82553E] text-white shadow-xs'
                                : 'bg-[#FAF8F5] text-[#5C564D] border border-[#E0D8CD] hover:border-[#82553E]'
                            }`}
                          >
                            {comp}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Width & GSM Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#666056] uppercase tracking-wider mb-1">
                        Width or Finished Size
                      </label>
                      <input
                        type="text"
                        placeholder='e.g. 44" inches, 58/60", 25mm, 24 Ligne...'
                        value={formData.specifications.widthOrSize || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            specifications: { ...prev.specifications, widthOrSize: e.target.value },
                          }))
                        }
                        className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF9F6] border border-[#D5D0C6] rounded-xl text-[#181715] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#666056] uppercase tracking-wider mb-1">
                        Weight (GSM / Oz)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 140 GSM, 180 GSM, 11.5 Oz, Heavy duty..."
                        value={formData.specifications.gsmOrWeight || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            specifications: { ...prev.specifications, gsmOrWeight: e.target.value },
                          }))
                        }
                        className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF9F6] border border-[#D5D0C6] rounded-xl text-[#181715] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Colour Preference */}
                  <div>
                    <label className="block text-xs font-semibold text-[#666056] uppercase tracking-wider mb-2">
                      Shade / Colour
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {[
                        'Raw Gada / RFD',
                        'Bleached White',
                        'Deep Indigo',
                        'Pure Black',
                        'Natural Beige',
                        'Antique Brass',
                      ].map((col) => {
                        const isMatch = formData.specifications.colourPreference === col;
                        return (
                          <button
                            key={col}
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                specifications: { ...prev.specifications, colourPreference: isMatch ? '' : col },
                              }))
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                              isMatch
                                ? 'bg-[#181715] text-white shadow-xs'
                                : 'bg-[#FAF8F5] text-[#5C564D] border border-[#E0D8CD]'
                            }`}
                          >
                            {col}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="text"
                      placeholder="Or specify custom dye shade / Pantone reference..."
                      value={formData.specifications.colourPreference || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          specifications: { ...prev.specifications, colourPreference: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF9F6] border border-[#D5D0C6] rounded-xl text-[#181715] focus:outline-none"
                    />
                  </div>

                  {/* Additional specifications */}
                  <div>
                    <label className="block text-xs font-semibold text-[#666056] uppercase tracking-wider mb-1">
                      Additional Requirements (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Special finishes (mercerized, peach, bio-wash), custom logo files, packaging..."
                      value={formData.specifications.customDetails || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          specifications: { ...prev.specifications, customDetails: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF9F6] border border-[#D5D0C6] rounded-xl text-[#181715] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Navigation */}
                <div className="pt-4 border-t border-[#F0ECE4] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider bg-white border border-[#D5D0C6] text-[#585550] hover:text-[#181715] rounded-xl transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-2 px-7 py-2.5 bg-[#82553E] hover:bg-[#6D432E] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-sm active:scale-[0.98] cursor-pointer"
                  >
                    <span>Continue to Images</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* STEP 3: SWATCH & REFERENCE IMAGE UPLOADS */}
            {/* ---------------------------------------------------------------- */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#82553E] font-semibold block mb-1">
                    Step 3 of 5
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#181715] tracking-tight">
                    Swatch &amp; Reference Images
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B655C] mt-1">
                    Upload photos of your material swatch, artwork, or tech pack. You can also continue without uploading an image.
                  </p>
                </div>

                {/* Upload Zone */}
                <div className="space-y-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#DDD5C9] hover:border-[#181715] bg-[#FAF8F5] rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-colors"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/png, image/jpeg, image/webp"
                      multiple
                      className="hidden"
                    />

                    <div className="w-12 h-12 bg-white rounded-full border border-[#D5D0C6] flex items-center justify-center mx-auto text-[#82553E] mb-3 shadow-xs">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-[#181715]">
                      Click to upload photos or drag &amp; drop
                    </p>
                    <p className="text-[11px] text-[#7A7369] mt-1">
                      Upload up to 4 reference photos (PNG, JPEG, WebP up to 8MB each).
                    </p>
                    <span className="inline-block mt-3 text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-[#EFE9DF] text-[#696156]">
                      Optional • You can skip this step
                    </span>
                  </div>

                  {/* Uploaded Images Preview Grid */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-[#181715] block">
                        Selected Files ({uploadedFiles.length}/4):
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {uploadedFiles.map((file, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-square rounded-xl overflow-hidden border border-[#D5D0C6] bg-white group"
                          >
                            <img
                              src={file.dataUrl}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveImage(idx);
                                }}
                                className="self-end w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors shadow-xs"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-[10px] text-white font-mono truncate px-1">
                                {file.name} ({file.sizeKb} KB)
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Physical Sample Option */}
                  <div className="p-4 sm:p-5 bg-[#FAF8F5] rounded-xl border border-[#E8E2D8] space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.hasPhysicalSample}
                        onChange={(e) => setFormData((prev) => ({ ...prev, hasPhysicalSample: e.target.checked }))}
                        className="mt-1 w-4 h-4 text-[#82553E] border-[#C4B7AA] rounded focus:ring-0 cursor-pointer"
                      />
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-[#181715] block">
                          I have a physical cutting / swatch sample ready to courier to Tiruppur
                        </span>
                        <span className="text-[11px] text-[#6E6860] block mt-0.5">
                          Sending a physical swatch to our Boyampalayam unit allows exact yarn count, GSM, and weave inspection for accurate quotation.
                        </span>
                      </div>
                    </label>

                    {formData.hasPhysicalSample && (
                      <div className="pt-2 border-t border-[#EAE3D6]">
                        <input
                          type="text"
                          placeholder="Courier / tracking info (e.g. DTDC consignment #, sample 10x10cm)..."
                          value={formData.sampleCourierNotes || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, sampleCourierNotes: e.target.value }))
                          }
                          className="w-full px-3 py-2 text-xs bg-white border border-[#D5D0C6] rounded-lg text-[#181715] focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Navigation */}
                <div className="pt-4 border-t border-[#F0ECE4] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider bg-white border border-[#D5D0C6] text-[#585550] hover:text-[#181715] rounded-xl transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-2 px-7 py-2.5 bg-[#82553E] hover:bg-[#6D432E] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-sm active:scale-[0.98] cursor-pointer"
                  >
                    <span>Continue to Quantity</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* STEP 4: QUANTITY & TIMELINE */}
            {/* ---------------------------------------------------------------- */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#82553E] font-semibold block mb-1">
                    Step 4 of 5
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#181715] tracking-tight">
                    Quantity &amp; Timeline
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B655C] mt-1">
                    State the volume and schedule required to assess production economics and bulk tiered pricing.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Quantity and Unit Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-8">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-[#181715] uppercase tracking-wider">
                          Required Quantity {!isQuantityUndecided && <span className="text-red-500">*</span>}
                        </label>
                        <label className="inline-flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isQuantityUndecided}
                            onChange={(e) => {
                              setIsQuantityUndecided(e.target.checked);
                              if (e.target.checked) {
                                setFormData((prev) => ({ ...prev, quantity: 'Not decided yet' }));
                                setValidationErrors({});
                              } else {
                                setFormData((prev) => ({ ...prev, quantity: '' }));
                              }
                            }}
                            className="w-3.5 h-3.5 text-[#82553E] border-[#C4B7AA] rounded focus:ring-0 cursor-pointer"
                          />
                          <span className="text-[11px] text-[#82553E] font-medium">Not decided yet</span>
                        </label>
                      </div>

                      <input
                        type="text"
                        disabled={isQuantityUndecided}
                        placeholder={isQuantityUndecided ? 'Planning / Feasibility stage' : 'e.g. 500, 2000, 50, 10000...'}
                        value={isQuantityUndecided ? 'Not decided yet' : formData.quantity}
                        onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
                        className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border text-[#181715] focus:outline-none transition-colors ${
                          isQuantityUndecided
                            ? 'bg-[#EFE9DF] text-[#7A7368] border-[#DDD5C9] cursor-not-allowed'
                            : validationErrors.quantity
                            ? 'border-red-500 bg-red-50/20'
                            : 'bg-[#FAF9F6] border-[#D5D0C6] focus:border-[#181715]'
                        }`}
                      />
                      {validationErrors.quantity && (
                        <span className="text-[11px] text-red-600 mt-1 block">
                          {validationErrors.quantity}
                        </span>
                      )}
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block text-xs font-semibold text-[#666056] uppercase tracking-wider mb-1">
                        Unit
                      </label>
                      <select
                        value={formData.unit}
                        onChange={(e) => setFormData((prev) => ({ ...prev, unit: e.target.value }))}
                        disabled={isQuantityUndecided}
                        className="w-full px-3 py-2.5 text-xs sm:text-sm bg-[#FAF9F6] border border-[#D5D0C6] rounded-xl text-[#181715] focus:outline-none focus:border-[#181715]"
                      >
                        <option value="Metres">Metres</option>
                        <option value="Kilograms (Kg)">Kilograms (Kg)</option>
                        <option value="Pieces / Units">Pieces / Units</option>
                        <option value="Rolls / Bolts">Rolls / Bolts</option>
                        <option value="Gross (144 pcs)">Gross (144 pcs)</option>
                        <option value="Yards">Yards</option>
                        <option value="Sets / Packs">Sets / Packs</option>
                      </select>
                    </div>
                  </div>

                  {/* Delivery Timeline Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-[#666056] uppercase tracking-wider mb-2">
                      Expected Delivery Timeline
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        'Immediate (Within 1-2 weeks)',
                        'Standard Production (Within 2-3 weeks)',
                        'Upcoming Schedule (Within 1 month)',
                        'Not decided yet / Planning Stage',
                      ].map((timeline) => {
                        const isSelected = formData.targetTimeline === timeline;
                        return (
                          <button
                            key={timeline}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, targetTimeline: timeline }))}
                            className={`p-3 rounded-xl border text-left text-xs font-medium transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#82553E] text-white border-[#82553E] shadow-xs'
                                : 'bg-[#FAF8F5] text-[#4A4742] border-[#E0D8CD] hover:border-[#82553E]'
                            }`}
                          >
                            {timeline}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Type / Application */}
                  <div>
                    <label className="block text-xs font-semibold text-[#666056] uppercase tracking-wider mb-1">
                      Intended Application / Order Type
                    </label>
                    <select
                      value={formData.purpose}
                      onChange={(e) => setFormData((prev) => ({ ...prev, purpose: e.target.value }))}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF9F6] border border-[#D5D0C6] rounded-xl text-[#181715] focus:outline-none"
                    >
                      <option value="Bulk Garment Production">Bulk Garment Production</option>
                      <option value="Sampling / Fit Sample Development">Sampling / Fit Sample Development</option>
                      <option value="Export Garmenting Order">Export Garmenting Order</option>
                      <option value="Domestic Retail Brand Manufacturing">Domestic Retail Brand Manufacturing</option>
                      <option value="Not decided yet / Initial Feasibility">Not decided yet / Initial Feasibility</option>
                    </select>
                  </div>
                </div>

                {/* Navigation */}
                <div className="pt-4 border-t border-[#F0ECE4] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider bg-white border border-[#D5D0C6] text-[#585550] hover:text-[#181715] rounded-xl transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-2 px-7 py-2.5 bg-[#82553E] hover:bg-[#6D432E] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-sm active:scale-[0.98] cursor-pointer"
                  >
                    <span>Continue to Contact</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* STEP 5: CONTACT DETAILS & INTERACTIVE REVIEW ENQUIRY */}
            {/* ---------------------------------------------------------------- */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#82553E] font-semibold block mb-1">
                    Step 5 of 5
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#181715] tracking-tight">
                    Contact &amp; Enquiry Review
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B655C] mt-1">
                    Provide your contact details. You can review and edit your Material Kit before submitting.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Name and Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#181715] uppercase tracking-wider mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Your full name"
                        value={formData.contactName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, contactName: e.target.value }))}
                        className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF9F6] border rounded-xl text-[#181715] focus:outline-none ${
                          validationErrors.contactName ? 'border-red-500 bg-red-50/20' : 'border-[#D5D0C6]'
                        }`}
                      />
                      {validationErrors.contactName && (
                        <span className="text-[11px] text-red-600 mt-1 block">
                          {validationErrors.contactName}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#666056] uppercase tracking-wider mb-1">
                        Company Name (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Apex Apparels, Design Studio..."
                        value={formData.companyName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF9F6] border border-[#D5D0C6] rounded-xl text-[#181715] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Phone and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#181715] uppercase tracking-wider mb-1">
                        Phone / WhatsApp <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. +91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF9F6] border rounded-xl text-[#181715] focus:outline-none ${
                          validationErrors.phone ? 'border-red-500 bg-red-50/20' : 'border-[#D5D0C6]'
                        }`}
                      />
                      {validationErrors.phone && (
                        <span className="text-[11px] text-red-600 mt-1 block">
                          {validationErrors.phone}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#666056] uppercase tracking-wider mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF9F6] border border-[#D5D0C6] rounded-xl text-[#181715] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Location & Message */}
                  <div>
                    <label className="block text-xs font-semibold text-[#666056] uppercase tracking-wider mb-1">
                      Delivery Location / City
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tiruppur, Coimbatore, Bengaluru, Surat, Mumbai..."
                      value={formData.cityState}
                      onChange={(e) => setFormData((prev) => ({ ...prev, cityState: e.target.value }))}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF9F6] border border-[#D5D0C6] rounded-xl text-[#181715] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#666056] uppercase tracking-wider mb-1">
                      Additional Message (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Any specific questions, packaging requests, or instructions..."
                      value={formData.additionalNotes || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, additionalNotes: e.target.value }))}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF9F6] border border-[#D5D0C6] rounded-xl text-[#181715] focus:outline-none"
                    />
                  </div>

                  {/* VISUAL REVIEW SUMMARY BEFORE FINAL ENQUIRY SUBMISSION */}
                  <div className="pt-3 border-t border-[#EAE3D6]">
                    <div className="p-4 sm:p-5 bg-[#FAF8F5] rounded-2xl border border-[#E0D8CD] space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#ECE4D8]">
                        <span className="font-serif text-sm font-bold text-[#181715] uppercase tracking-wide">
                          Review Your Enquiry
                        </span>
                        <span className="text-[10px] font-mono uppercase text-[#82553E] bg-white px-2 py-0.5 rounded border border-[#E5DACD] font-bold">
                          Summary
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {/* Selected Kit Review */}
                        <div className="p-2.5 rounded-xl bg-white border border-[#EBE4D8] flex items-start justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-mono text-[#8A847C] block font-semibold">
                              Material Kit ({selectedKit.length})
                            </span>
                            <span className="font-bold text-[#181715] block">
                              {selectedKit.map((k) => k.name).join(', ')}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleJumpToStep(1)}
                            className="text-[11px] font-semibold text-[#82553E] hover:underline cursor-pointer"
                          >
                            Edit
                          </button>
                        </div>

                        {/* Specs Review */}
                        <div className="p-2.5 rounded-xl bg-white border border-[#EBE4D8] flex items-start justify-between">
                          <div className="truncate max-w-[80%]">
                            <span className="text-[10px] uppercase font-mono text-[#8A847C] block font-semibold">
                              Specifications
                            </span>
                            <span className="font-bold text-[#181715] block truncate">
                              {[formData.specifications.composition, formData.specifications.widthOrSize, formData.specifications.gsmOrWeight].filter(Boolean).join(' • ') || 'Standard specs'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleJumpToStep(2)}
                            className="text-[11px] font-semibold text-[#82553E] hover:underline cursor-pointer"
                          >
                            Edit
                          </button>
                        </div>

                        {/* Images Review */}
                        <div className="p-2.5 rounded-xl bg-white border border-[#EBE4D8] flex items-start justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-mono text-[#8A847C] block font-semibold">
                              References
                            </span>
                            <span className="font-bold text-[#181715] block">
                              {uploadedFiles.length > 0 ? `${uploadedFiles.length} photo(s)` : 'None'}
                              {formData.hasPhysicalSample ? ' • Courier sample' : ''}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleJumpToStep(3)}
                            className="text-[11px] font-semibold text-[#82553E] hover:underline cursor-pointer"
                          >
                            Edit
                          </button>
                        </div>

                        {/* Quantity Review */}
                        <div className="p-2.5 rounded-xl bg-white border border-[#EBE4D8] flex items-start justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-mono text-[#8A847C] block font-semibold">
                              Volume &amp; Timeline
                            </span>
                            <span className="font-bold text-[#181715] block">
                              {isQuantityUndecided ? 'Not decided yet' : `${formData.quantity || '0'} ${formData.unit}`}
                            </span>
                            <span className="text-[10px] text-[#7A7369] block">{formData.targetTimeline}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleJumpToStep(4)}
                            className="text-[11px] font-semibold text-[#82553E] hover:underline cursor-pointer"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final Navigation */}
                <div className="pt-4 border-t border-[#F0ECE4] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider bg-white border border-[#D5D0C6] text-[#585550] hover:text-[#181715] rounded-xl transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2.5 px-8 py-3.5 text-xs font-semibold uppercase tracking-wider bg-[#82553E] hover:bg-[#6D432E] text-white rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer ml-auto"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Material Enquiry</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* 3. PERSISTENT "YOUR MATERIAL KIT" SIDEBAR (Matching Reference Design) */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
            
            {/* Main Material Kit Card */}
            <div className="bg-white rounded-3xl border border-[#E8E2D8] shadow-[0_8px_30px_rgba(24,23,21,0.04)] p-6 space-y-5">
              
              {/* Kit Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE4]">
                <h4 className="font-serif text-lg font-bold text-[#181715]">
                  Your Material Kit
                </h4>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#FAF5EE] text-[#82553E] border border-[#ECDCCB] font-bold">
                  {selectedKit.length} {selectedKit.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Selected Material Items List */}
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {selectedKit.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D6] group hover:border-[#82553E]/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#ECE6DC] shrink-0 border border-[#DDD5C9]">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <span className="block font-serif text-xs font-bold text-[#181715] truncate">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-mono text-[#7A7369] uppercase block">
                          {item.categoryLabel}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveFromKit(item.id)}
                      className="w-6 h-6 rounded-full bg-white text-[#948B7F] hover:text-red-600 hover:bg-red-50 flex items-center justify-center border border-[#E2DBD0] transition-colors shrink-0 ml-2 cursor-pointer"
                      title="Remove from kit"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Action Links List matching Reference Design */}
              <div className="pt-2 border-t border-[#F0ECE4] space-y-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleJumpToStep(1)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF8F5] text-[#4A4742] hover:text-[#82553E] transition-colors cursor-pointer text-left"
                >
                  <span className="flex items-center gap-2">
                    <Pencil className="w-3.5 h-3.5 text-[#82553E]" />
                    <span>Edit selections anytime</span>
                  </span>
                  <ArrowRight className="w-3 h-3 text-[#A89F93]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleJumpToStep(3)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF8F5] text-[#4A4742] hover:text-[#82553E] transition-colors cursor-pointer text-left"
                >
                  <span className="flex items-center gap-2">
                    <Upload className="w-3.5 h-3.5 text-[#82553E]" />
                    <span>Upload reference images</span>
                  </span>
                  <ArrowRight className="w-3 h-3 text-[#A89F93]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleJumpToStep(1)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF8F5] text-[#4A4742] hover:text-[#82553E] transition-colors cursor-pointer text-left"
                >
                  <span className="flex items-center gap-2">
                    <Plus className="w-3.5 h-3.5 text-[#82553E]" />
                    <span>Add more materials</span>
                  </span>
                  <ArrowRight className="w-3 h-3 text-[#A89F93]" />
                </button>
              </div>

              {/* Direct Continue Button inside sidebar */}
              {currentStep === 1 && (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full py-3 bg-[#82553E] hover:bg-[#6D432E] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Continue to Requirements</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Bottom Callout Box "Need help choosing?" (Matching Reference Image) */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-[#FAF5EE] to-[#F5ECE0] border border-[#ECDCCB] relative overflow-hidden space-y-3">
              {/* Botanical leafy background watermark */}
              <svg
                className="absolute -right-4 -bottom-4 w-28 h-28 text-[#82553E]/10 pointer-events-none"
                viewBox="0 0 100 100"
                fill="currentColor"
              >
                <path d="M50 10 C30 30, 20 60, 50 90 C80 60, 70 30, 50 10 Z M50 10 L50 90 M35 40 Q50 45 65 40 M30 60 Q50 65 70 60" />
              </svg>

              <div className="relative z-10 space-y-1">
                <div className="w-8 h-8 rounded-full bg-white/90 border border-[#E5DACD] text-[#82553E] flex items-center justify-center mb-2 shadow-2xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h5 className="font-serif text-sm font-bold text-[#181715]">
                  Need help choosing?
                </h5>
                <p className="text-xs text-[#6B655C] leading-relaxed">
                  Our team is here to guide you with swatches and technical specifications.
                </p>
              </div>

              <button
                type="button"
                onClick={onReachUs}
                className="relative z-10 inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#FAF8F5] text-[#181715] rounded-xl text-xs font-semibold border border-[#D5CCBE] transition-colors cursor-pointer shadow-2xs"
              >
                <span>Contact Us</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#82553E]" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
