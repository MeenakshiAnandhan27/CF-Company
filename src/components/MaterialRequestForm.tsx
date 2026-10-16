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
  Scissors,
  Bookmark,
  X,
  Pencil,
  AlertCircle,
  Phone,
  Mail,
  Building,
  MapPin,
  Plus,
  Trash2,
  Grid,
  CircleDot,
  FileText,
  Sparkles,
  ShoppingBag,
  Headphones,
  ExternalLink,
  Package,
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
    iconBg: '#A45B3E', // Terracotta
    mappedCategory: 'fabric',
  },
  {
    id: 'accessories',
    title: 'Garment Accessories',
    subtitle: 'Find zippers, buttons, labels and more',
    image: '/assets/materials/accessories.jpg',
    iconBg: '#1E352B', // Forest green
    mappedCategory: 'accessories',
  },
  {
    id: 'custom',
    title: 'Custom Development',
    subtitle: 'Develop unique materials made for you',
    image: '/assets/materials/processing.jpg',
    iconBg: '#2D4B4B', // Slate teal
    mappedCategory: 'other',
  },
];

// Sub-swatches for each primary category
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
const VERIFIED_PHONE = '+91 88264 15868';
const VERIFIED_PHONE_RAW = '918826415868';

export const MaterialRequestForm: React.FC<MaterialRequestFormProps> = ({
  initialData,
  similarProduct,
  onExploreCatalogue,
  onReachUs,
}) => {
  // 3-step navigation: 1 = Choose Material, 2 = Your Requirement, 3 = Contact Details
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeMainCategory, setActiveMainCategory] = useState<MainDiscoveryCategory>('fabric');

  // Selected Kit items (Materials chosen by user)
  const [selectedKit, setSelectedKit] = useState<KitItem[]>(() => {
    if (similarProduct) {
      return [
        {
          id: similarProduct.id,
          name: similarProduct.name,
          categoryLabel: similarProduct.category.toUpperCase(),
          image: similarProduct.images[0] || '/assets/materials/fabrics.jpg',
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
    // Default initial selection: Cotton
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

  // Selected primary categories (can select multiple or single)
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

  // Not decided yet toggle for quantity
  const [isQuantityUndecided, setIsQuantityUndecided] = useState<boolean>(false);

  // Uploaded Reference Images
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<MaterialRequestSubmission | null>(
    null
  );

  // Sync category from props if provided
  useEffect(() => {
    if (initialData?.category) {
      const cat = initialData.category;
      if (cat === 'button' || cat === 'zipper' || cat === 'lace' || cat === 'accessories' || cat === 'tipping') {
        setActiveMainCategory('accessories');
        setSelectedPillars(new Set(['accessories']));
      } else if (cat === 'other' || cat === 'processing') {
        setActiveMainCategory('custom');
        setSelectedPillars(new Set(['custom']));
      } else {
        setActiveMainCategory('fabric');
        setSelectedPillars(new Set(['fabric']));
      }
    }
  }, [initialData]);

  // Handle Pillar Selection (Card Click)
  const handlePillarClick = (category: MainDiscoveryCategory) => {
    setActiveMainCategory(category);
    setSelectedPillars((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        // Keep at least one selected
        if (next.size > 1) {
          next.delete(category);
        }
      } else {
        next.add(category);
      }
      return next;
    });

    // Auto-select first swatch if none in kit for this category
    const availableSwatches = SUB_SWATCHES[category].items;
    const hasCategoryInKit = selectedKit.some((k) =>
      availableSwatches.some((s) => s.id === k.id)
    );
    if (!hasCategoryInKit && availableSwatches.length > 0) {
      handleToggleSwatch(availableSwatches[0]);
    }
  };

  // Handle Swatch Toggle
  const handleToggleSwatch = (item: KitItem) => {
    setSelectedKit((prev) => {
      const exists = prev.some((k) => k.id === item.id);
      if (exists) {
        // If removing the item
        const filtered = prev.filter((k) => k.id !== item.id);
        return filtered;
      } else {
        // Add to kit
        const updated = [...prev, item];
        // Update form default specs if empty
        if (item.defaultSpecs) {
          setFormData((f) => ({
            ...f,
            materialName: f.materialName ? `${f.materialName}, ${item.name}` : item.name,
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

  // Remove single item from kit
  const handleRemoveFromKit = (id: string) => {
    setSelectedKit((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear all items from kit
  const handleClearKit = () => {
    setSelectedKit([]);
  };

  // Handle File Upload (Drag and Drop / File Input)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = (files: File[]) => {
    const validFiles = files.filter((file) =>
      ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
    );

    if (validFiles.length === 0) {
      alert('Please upload valid image files (JPG, PNG, or WebP).');
      return;
    }

    validFiles.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} exceeds 10MB limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setUploadedFiles((prev) => [
          ...prev,
          {
            name: file.name,
            dataUrl,
            sizeKb: Math.round(file.size / 1024),
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Validation
  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (selectedKit.length === 0) {
        newErrors.kit = 'Please select at least one material or fabric type.';
      }
    } else if (stepNumber === 2) {
      if (!isQuantityUndecided && (!formData.quantity || formData.quantity.trim() === '')) {
        newErrors.quantity = 'Please specify required quantity or select "Not decided yet".';
      }
    } else if (stepNumber === 3) {
      if (!formData.contactName || formData.contactName.trim().length < 2) {
        newErrors.contactName = 'Please enter your full name.';
      }
      if (!formData.phone || formData.phone.trim().length < 7) {
        newErrors.phone = 'Please provide a valid contact number (at least 7 digits).';
      }
      if (
        formData.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
      ) {
        newErrors.email = 'Please enter a valid business email address.';
      }
      if (!formData.cityState || formData.cityState.trim().length < 2) {
        newErrors.cityState = 'Please specify your delivery location (City / State).';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateStep(currentStep)) {
      setErrors({});
      setCurrentStep((prev) => Math.min(prev + 1, 3));
      window.scrollTo({ top: 320, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  // Submit Enquiry
  const handleSubmitEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) {
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
          selectedKit.map((k) => k.name).join(', ') || formData.materialName || 'Material Enquiry',
        category: selectedKit[0]?.category || 'fabric',
        quantity: isQuantityUndecided ? 'Not decided yet (Sampling First)' : formData.quantity,
        referenceImages: uploadedFiles.map((f) => ({
          name: f.name,
          dataUrl: f.dataUrl,
          sizeKb: f.sizeKb,
        })),
        id: `submission-${timestamp}`,
        referenceCode,
        submittedAt: timestamp,
      };

      // Save to localStorage
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
      console.error('Submission failed', err);
      setErrors({ submit: 'Failed to process enquiry. Please try again or WhatsApp us directly.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for WhatsApp Click
  const getWhatsAppEnquiryUrl = (submission: MaterialRequestSubmission) => {
    const selectedNames = selectedKit.map((k) => k.name).join(', ') || submission.materialName;
    const qtyText = isQuantityUndecided ? 'Sampling / Not decided' : `${submission.quantity} ${submission.unit}`;
    const text = encodeURIComponent(
      `Hello Classic Fashions, I submitted a Material Request on your website.\n\n` +
        `*Reference Code:* ${submission.referenceCode}\n` +
        `*Client Name:* ${submission.contactName}\n` +
        `*Company:* ${submission.companyName || 'N/A'}\n` +
        `*Materials Required:* ${selectedNames}\n` +
        `*Quantity:* ${qtyText}\n` +
        `*Location:* ${submission.cityState}\n\n` +
        `Please check availability and send pricing details.`
    );
    return `https://wa.me/${VERIFIED_PHONE_RAW}?text=${text}`;
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#181715] pb-24 font-sans selection:bg-[#1E352B] selection:text-white">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH RICH TEXTILE DRAPE & FLOATING 3-STEP INDICATOR CARD */}
      {/* ========================================================================= */}
      <section className="relative w-full overflow-hidden border-b border-[#E8E4DC] bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5] to-[#F3EDE2] pt-8 sm:pt-12 pb-14 sm:pb-16">
        {/* Soft textile background drape overlay (right half) */}
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 w-full sm:w-3/5 h-full opacity-35 sm:opacity-50 pointer-events-none bg-no-repeat bg-right-top bg-cover mix-blend-multiply"
          style={{
            backgroundImage: `url('/assets/materials/request-hero-reference.jpg')`,
            maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 60%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 60%)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Side: Editorial Heading & Context */}
            <div className="lg:col-span-6 space-y-4">
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#8C827A] font-mono block">
                REQUEST MATERIAL
              </span>

              <div className="space-y-2">
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#181715] leading-[1.12]">
                  Build Your <br className="hidden sm:inline" />
                  Material Brief
                </h1>
                {/* Terracotta horizontal bar accent */}
                <div className="w-12 h-1 bg-[#B86546] rounded-full" />
              </div>

              <p className="text-sm sm:text-base text-[#55504A] leading-relaxed max-w-xl">
                Tell us what you need. Select materials, add references and our team will help you
                build the perfect solution.
              </p>
            </div>

            {/* Right Side: Frosted Glass 3-Step Process Card */}
            <div className="lg:col-span-6">
              <div className="bg-white/70 backdrop-blur-md border border-white/80 rounded-2xl p-5 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="grid grid-cols-3 gap-2 relative">
                  {/* Connecting Line */}
                  <div
                    aria-hidden="true"
                    className="absolute top-5 left-12 right-12 h-[1px] border-t border-dashed border-[#C8C2B7] -z-0"
                  />

                  {/* Step 1 */}
                  <button
                    onClick={() => {
                      setErrors({});
                      setCurrentStep(1);
                    }}
                    className={`relative z-10 text-center flex flex-col items-center group cursor-pointer transition-all ${
                      currentStep === 1 ? 'opacity-100' : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-xs ${
                        currentStep === 1
                          ? 'bg-[#1E352B] text-white ring-4 ring-[#1E352B]/10'
                          : currentStep > 1
                          ? 'bg-[#B86546] text-white'
                          : 'bg-white border border-[#D5D0C6] text-[#736F68]'
                      }`}
                    >
                      {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
                    </div>
                    <span className="font-semibold text-xs sm:text-sm text-[#181715] mt-2.5 block leading-tight">
                      Choose Material
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-[#736F68] mt-1 hidden sm:block max-w-[130px] leading-snug">
                      Pick fabrics, accessories or custom development
                    </span>
                  </button>

                  {/* Step 2 */}
                  <button
                    onClick={() => {
                      if (validateStep(1)) {
                        setErrors({});
                        setCurrentStep(2);
                      }
                    }}
                    className={`relative z-10 text-center flex flex-col items-center group cursor-pointer transition-all ${
                      currentStep === 2 ? 'opacity-100' : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-xs ${
                        currentStep === 2
                          ? 'bg-[#1E352B] text-white ring-4 ring-[#1E352B]/10'
                          : currentStep > 2
                          ? 'bg-[#B86546] text-white'
                          : 'bg-white border border-[#D5D0C6] text-[#736F68]'
                      }`}
                    >
                      {currentStep > 2 ? <Check className="w-4 h-4" /> : '2'}
                    </div>
                    <span className="font-semibold text-xs sm:text-sm text-[#181715] mt-2.5 block leading-tight">
                      Your Requirement
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-[#736F68] mt-1 hidden sm:block max-w-[130px] leading-snug">
                      Add details, quantity and reference
                    </span>
                  </button>

                  {/* Step 3 */}
                  <button
                    onClick={() => {
                      if (validateStep(1) && validateStep(2)) {
                        setErrors({});
                        setCurrentStep(3);
                      }
                    }}
                    className={`relative z-10 text-center flex flex-col items-center group cursor-pointer transition-all ${
                      currentStep === 3 ? 'opacity-100' : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-xs ${
                        currentStep === 3
                          ? 'bg-[#1E352B] text-white ring-4 ring-[#1E352B]/10'
                          : 'bg-white border border-[#D5D0C6] text-[#736F68]'
                      }`}
                    >
                      3
                    </div>
                    <span className="font-semibold text-xs sm:text-sm text-[#181715] mt-2.5 block leading-tight">
                      Contact Details
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-[#736F68] mt-1 hidden sm:block max-w-[130px] leading-snug">
                      Share your info and submit your request
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SUCCESS CONFIRMATION MODAL / SCREEN */}
      {/* ========================================================================= */}
      {submissionSuccess && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl border border-[#E8E4DC] p-8 sm:p-12 shadow-sm text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#1E352B]/10 text-[#1E352B] flex items-center justify-center mx-auto ring-8 ring-[#1E352B]/5">
              <CheckCircle className="w-8 h-8 text-[#1E352B]" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#B86546] font-semibold">
                MATERIAL BRIEF RECEIVED
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#181715]">
                Thank You, {submissionSuccess.contactName}
              </h2>
              <p className="text-sm text-[#585550] max-w-lg mx-auto">
                Your material request has been logged. Our textile sourcing specialists in Tiruppur
                will review your specifications and contact you with suitable swatch options and
                pricing.
              </p>
            </div>

            {/* Reference Badge */}
            <div className="inline-block bg-[#F8F5EE] border border-[#E8E4DC] rounded-xl px-6 py-3">
              <span className="text-xs text-[#736F68] uppercase font-mono block">Enquiry Reference Code</span>
              <span className="font-mono text-lg font-bold text-[#181715] tracking-wider">
                {submissionSuccess.referenceCode}
              </span>
            </div>

            {/* Quick Actions */}
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
                onClick={onExploreCatalogue}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1E352B] hover:bg-[#162720] text-white px-6 py-3.5 rounded-xl font-medium text-sm transition-all shadow-xs cursor-pointer"
              >
                <span>Explore Digital Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setSubmissionSuccess(null);
                  setCurrentStep(1);
                  setFormData(INITIAL_REQUEST);
                  setSelectedKit([]);
                  setUploadedFiles([]);
                }}
                className="w-full sm:w-auto text-xs font-semibold uppercase tracking-wider text-[#736F68] hover:text-[#181715] py-2 px-4 transition-colors cursor-pointer"
              >
                Submit Another Brief
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN TWO-COLUMN WORKSPACE: LEFT SELECTION + RIGHT LIVE MATERIAL BRIEF */}
      {/* ========================================================================= */}
      {!submissionSuccess && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ------------------------------------------------------------------- */}
            {/* LEFT COLUMN: ACTIVE STEP WORKSPACE (~68% WIDTH) */}
            {/* ------------------------------------------------------------------- */}
            <div className="lg:col-span-8 space-y-6">
              {/* STEP 1: CHOOSE WHAT YOU NEED */}
              {currentStep === 1 && (
                <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-8 animate-in fade-in duration-200">
                  {/* Step Header */}
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#181715] tracking-tight">
                      1. Choose what you need
                    </h2>
                    <p className="text-sm text-[#736F68] mt-1">
                      Select from our material categories to get started.
                    </p>
                  </div>

                  {errors.kit && (
                    <div className="flex items-center gap-2 text-xs font-medium text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errors.kit}</span>
                    </div>
                  )}

                  {/* 3 Primary Category Cards (Fabrics, Garment Accessories, Custom Development) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                    {MAIN_CATEGORIES.map((cat) => {
                      const isSelected = selectedPillars.has(cat.id);
                      const isActiveCategory = activeMainCategory === cat.id;

                      return (
                        <div
                          key={cat.id}
                          onClick={() => handlePillarClick(cat.id)}
                          className={`group relative rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col ${
                            isSelected
                              ? 'border-[#B86546] ring-1 ring-[#B86546] shadow-sm bg-white'
                              : 'border-[#E8E4DC] bg-white hover:border-[#D5D0C6] hover:shadow-xs'
                          }`}
                        >
                          {/* Image Thumbnail with Floating Circular Badge */}
                          <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-stone-100">
                            <img
                              src={cat.image}
                              alt={cat.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {/* Gradient tint */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

                            {/* Floating Round Category Badge on Bottom-Left */}
                            <div
                              className="absolute bottom-3 left-3 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md border-2 border-white"
                              style={{ backgroundColor: cat.iconBg }}
                            >
                              {cat.id === 'fabric' && <Grid className="w-4 h-4" />}
                              {cat.id === 'accessories' && <CircleDot className="w-4 h-4" />}
                              {cat.id === 'custom' && <Pencil className="w-4 h-4" />}
                            </div>
                          </div>

                          {/* Card Content & Checkmark indicator */}
                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="font-semibold text-[#181715] text-sm sm:text-base leading-snug">
                                {cat.title}
                              </h3>
                              <p className="text-xs text-[#736F68] mt-1 leading-relaxed">
                                {cat.subtitle}
                              </p>
                            </div>

                            <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#F5F2EA]">
                              <span className="text-[11px] font-mono text-[#8C827A] uppercase">
                                {isActiveCategory ? 'Active View' : 'Select'}
                              </span>
                              {isSelected ? (
                                <div className="w-5 h-5 rounded-full bg-[#B86546] text-white flex items-center justify-center shadow-xs">
                                  <Check className="w-3 h-3 stroke-[2.5]" />
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full border border-[#D5D0C6] group-hover:border-[#8C827A]" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Sub-swatches section corresponding to activeMainCategory */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm sm:text-base font-semibold text-[#181715]">
                        {SUB_SWATCHES[activeMainCategory].heading}
                      </h3>
                      <span className="text-xs text-[#736F68]">Click to select multiple</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                      {SUB_SWATCHES[activeMainCategory].items.map((item) => {
                        const isChosen = selectedKit.some((k) => k.id === item.id);

                        return (
                          <div
                            key={item.id}
                            onClick={() => handleToggleSwatch(item)}
                            className={`group relative rounded-xl p-2 border transition-all duration-200 cursor-pointer flex flex-col items-center ${
                              isChosen
                                ? 'border-[#B86546] bg-[#FAF8F5] ring-1 ring-[#B86546] shadow-xs'
                                : 'border-[#E8E4DC] bg-white hover:border-[#D5D0C6] hover:bg-[#FAF9F7]'
                            }`}
                          >
                            {/* Swatch Square Image with Checkmark Pill on Bottom Right */}
                            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-stone-100">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />

                              {isChosen && (
                                <div className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full bg-[#B86546] text-white flex items-center justify-center shadow-md">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              )}
                            </div>

                            {/* Swatch Name */}
                            <span
                              className={`text-xs font-medium text-center mt-2 truncate w-full ${
                                isChosen ? 'text-[#181715] font-semibold' : 'text-[#585550]'
                              }`}
                            >
                              {item.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Upload Reference Images Box (Dashed Card) */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-4 sm:p-5 transition-all ${
                      isDragging
                        ? 'border-[#B86546] bg-[#FBF7F4]'
                        : 'border-[#DFD9CC] bg-[#FAF9F6] hover:border-[#C8C2B7]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-[#585550] shrink-0">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm text-[#181715]">
                              Upload reference images
                            </h4>
                            <span className="text-xs text-[#8C827A] font-normal">(Optional)</span>
                          </div>
                          <p className="text-xs text-[#736F68] mt-0.5 leading-relaxed">
                            Drag & drop or click to upload images of fabrics, styles, or mood boards
                          </p>
                        </div>
                      </div>

                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-[#1E352B] hover:bg-[#162720] text-white px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer whitespace-nowrap active:scale-95"
                        >
                          Upload Images
                        </button>
                      </div>
                    </div>

                    {/* Previews of uploaded images */}
                    {uploadedFiles.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-[#E8E4DC] grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {uploadedFiles.map((file, idx) => (
                          <div
                            key={idx}
                            className="relative group rounded-lg overflow-hidden border border-[#D5D0C6] bg-white p-1"
                          >
                            <img
                              src={file.dataUrl}
                              alt={file.name}
                              className="w-full h-20 object-cover rounded"
                            />
                            <div className="p-1">
                              <p className="text-[10px] text-[#181715] font-medium truncate">
                                {file.name}
                              </p>
                              <span className="text-[9px] text-[#8C827A] font-mono">
                                {file.sizeKb} KB
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(idx)}
                              className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
                              title="Remove image"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: YOUR REQUIREMENT */}
              {currentStep === 2 && (
                <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-[#F0ECE1] pb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-[#181715] tracking-tight">
                        2. Specify Your Requirement
                      </h2>
                      <p className="text-sm text-[#736F68] mt-1">
                        Enter quantities, units, dimensions, and specifications for your production.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C827A] hover:text-[#181715] transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Materials</span>
                    </button>
                  </div>

                  {/* Selected Materials Chips Recap */}
                  <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E8E4DC]">
                    <span className="text-[11px] font-mono text-[#8C827A] uppercase block mb-2 font-semibold">
                      Selected Items For Enquiry:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedKit.map((item) => (
                        <span
                          key={item.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white text-[#181715] border border-[#D5D0C6] shadow-2xs"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B86546]" />
                          {item.name}
                          <span className="text-[10px] text-[#8C827A]">({item.categoryLabel})</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quantity & Unit */}
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#585550]">
                      Required Quantity & Unit <span className="text-red-500">*</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                      <div className="sm:col-span-8">
                        <input
                          type="text"
                          disabled={isQuantityUndecided}
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                          placeholder={isQuantityUndecided ? 'Sampling first / Undecided' : 'e.g. 500, 2000'}
                          className={`w-full px-4 py-2.5 text-sm rounded-lg border transition-all ${
                            isQuantityUndecided
                              ? 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed'
                              : 'bg-white border-[#D5D0C6] text-[#181715] focus:border-[#1E352B] focus:ring-1 focus:ring-[#1E352B]'
                          }`}
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <select
                          disabled={isQuantityUndecided}
                          value={formData.unit}
                          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                          className={`w-full px-3 py-2.5 text-sm rounded-lg border transition-all ${
                            isQuantityUndecided
                              ? 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed'
                              : 'bg-white border-[#D5D0C6] text-[#181715] focus:border-[#1E352B] focus:ring-1 focus:ring-[#1E352B]'
                          }`}
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
                        id="quantityUndecided"
                        checked={isQuantityUndecided}
                        onChange={(e) => setIsQuantityUndecided(e.target.checked)}
                        className="w-4 h-4 text-[#1E352B] border-stone-300 rounded focus:ring-[#1E352B] cursor-pointer"
                      />
                      <label
                        htmlFor="quantityUndecided"
                        className="text-xs text-[#585550] cursor-pointer select-none"
                      >
                        Quantity not finalized yet (Need sampling / initial swatch quote)
                      </label>
                    </div>

                    {errors.quantity && (
                      <p className="text-xs text-red-600 mt-1">{errors.quantity}</p>
                    )}
                  </div>

                  {/* Dynamic Specifications */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#585550] mb-1.5">
                        Target GSM / Weight (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.specifications.gsmOrWeight || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specifications: {
                              ...formData.specifications,
                              gsmOrWeight: e.target.value,
                            },
                          })
                        }
                        placeholder="e.g. 140 GSM, 11.5 Oz"
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#D5D0C6] bg-white text-[#181715] focus:border-[#1E352B] focus:ring-1 focus:ring-[#1E352B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#585550] mb-1.5">
                        Width or Dimensions (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.specifications.widthOrSize || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specifications: {
                              ...formData.specifications,
                              widthOrSize: e.target.value,
                            },
                          })
                        }
                        placeholder='e.g. 58" / 60", 44", Standard'
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#D5D0C6] bg-white text-[#181715] focus:border-[#1E352B] focus:ring-1 focus:ring-[#1E352B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#585550] mb-1.5">
                        Composition / Blend (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.specifications.composition || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specifications: {
                              ...formData.specifications,
                              composition: e.target.value,
                            },
                          })
                        }
                        placeholder="e.g. 100% Cotton, Poly-Viscose"
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#D5D0C6] bg-white text-[#181715] focus:border-[#1E352B] focus:ring-1 focus:ring-[#1E352B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#585550] mb-1.5">
                        Colour Preference / Shade (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.specifications.colourPreference || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specifications: {
                              ...formData.specifications,
                              colourPreference: e.target.value,
                            },
                          })
                        }
                        placeholder="e.g. Raw Greige, Bleached White, Pantone 19-4052"
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#D5D0C6] bg-white text-[#181715] focus:border-[#1E352B] focus:ring-1 focus:ring-[#1E352B]"
                      />
                    </div>
                  </div>

                  {/* Delivery Timeline */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#585550] mb-1.5">
                      Expected Timeline
                    </label>
                    <select
                      value={formData.targetTimeline}
                      onChange={(e) => setFormData({ ...formData, targetTimeline: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#D5D0C6] bg-white text-[#181715] focus:border-[#1E352B] focus:ring-1 focus:ring-[#1E352B]"
                    >
                      <option value="Urgent Dispatch (< 7 days)">Urgent Dispatch (&lt; 7 days)</option>
                      <option value="Standard Production (Within 2-3 weeks)">
                        Standard Production (Within 2-3 weeks)
                      </option>
                      <option value="Sampling First, Bulk Later">Sampling First, Bulk Later</option>
                      <option value="Flexible / Exploring Availability">
                        Flexible / Exploring Availability
                      </option>
                    </select>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#585550] mb-1.5">
                      Custom Notes or Production Details (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.additionalNotes}
                      onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                      placeholder="Describe weave, finish, end use (e.g. shirts, trousers, exports), or special testing requirements..."
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#D5D0C6] bg-white text-[#181715] focus:border-[#1E352B] focus:ring-1 focus:ring-[#1E352B]"
                    />
                  </div>

                  {/* Step Action Buttons */}
                  <div className="pt-4 flex items-center justify-between border-t border-[#F0ECE1]">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-5 py-2.5 rounded-lg border border-[#D5D0C6] hover:bg-[#FAF8F5] text-xs font-semibold uppercase tracking-wider text-[#585550] transition-colors cursor-pointer"
                    >
                      Previous Step
                    </button>
                    <button
                      type="button"
                      onClick={handleContinue}
                      className="inline-flex items-center gap-2 bg-[#1E352B] hover:bg-[#162720] text-white px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
                    >
                      <span>Continue to Contact</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: CONTACT DETAILS & REVIEW */}
              {currentStep === 3 && (
                <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-[#F0ECE1] pb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-[#181715] tracking-tight">
                        3. Contact Details
                      </h2>
                      <p className="text-sm text-[#736F68] mt-1">
                        Provide your details so our team can send pricing, lead time, and swatch
                        availability.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C827A] hover:text-[#181715] transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Requirements</span>
                    </button>
                  </div>

                  <form onSubmit={handleSubmitEnquiry} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#585550] mb-1.5">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.contactName}
                          onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                          placeholder="Your Name"
                          className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#D5D0C6] bg-white text-[#181715] focus:border-[#1E352B] focus:ring-1 focus:ring-[#1E352B]"
                        />
                        {errors.contactName && (
                          <p className="text-xs text-red-600 mt-1">{errors.contactName}</p>
                        )}
                      </div>

                      {/* Company Name */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#585550] mb-1.5">
                          Company / Brand (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          placeholder="Apparel Brand / Factory Name"
                          className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#D5D0C6] bg-white text-[#181715] focus:border-[#1E352B] focus:ring-1 focus:ring-[#1E352B]"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#585550] mb-1.5">
                          Phone / WhatsApp <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#D5D0C6] bg-white text-[#181715] focus:border-[#1E352B] focus:ring-1 focus:ring-[#1E352B]"
                        />
                        {errors.phone && (
                          <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#585550] mb-1.5">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="buyer@apparel.com"
                          className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#D5D0C6] bg-white text-[#181715] focus:border-[#1E352B] focus:ring-1 focus:ring-[#1E352B]"
                        />
                        {errors.email && (
                          <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Delivery Location */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#585550] mb-1.5">
                        Delivery Location (City / State) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.cityState}
                        onChange={(e) => setFormData({ ...formData, cityState: e.target.value })}
                        placeholder="e.g. Tiruppur, Bengaluru, Surat, Mumbai, Dhaka"
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#D5D0C6] bg-white text-[#181715] focus:border-[#1E352B] focus:ring-1 focus:ring-[#1E352B]"
                      />
                      {errors.cityState && (
                        <p className="text-xs text-red-600 mt-1">{errors.cityState}</p>
                      )}
                    </div>

                    {/* Review Summary Container */}
                    <div className="bg-[#FAF8F5] border border-[#E8E4DC] rounded-xl p-4 sm:p-5 space-y-3 mt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase tracking-wider text-[#8C827A] font-semibold">
                          Summary Review
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="text-[11px] text-[#B86546] hover:underline font-semibold"
                        >
                          Edit Choices
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-[#8C827A] block">Materials:</span>
                          <span className="font-semibold text-[#181715]">
                            {selectedKit.map((k) => k.name).join(', ') || 'None'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#8C827A] block">Quantity:</span>
                          <span className="font-semibold text-[#181715]">
                            {isQuantityUndecided
                              ? 'Sampling / Undecided'
                              : formData.quantity
                              ? `${formData.quantity} ${formData.unit}`
                              : 'Not specified'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#8C827A] block">Timeline:</span>
                          <span className="font-semibold text-[#181715]">
                            {formData.targetTimeline}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#8C827A] block">Uploaded Images:</span>
                          <span className="font-semibold text-[#181715]">
                            {uploadedFiles.length} file(s)
                          </span>
                        </div>
                      </div>
                    </div>

                    {errors.submit && (
                      <div className="flex items-center gap-2 text-xs font-medium text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errors.submit}</span>
                      </div>
                    )}

                    {/* Final Submission Buttons */}
                    <div className="pt-4 flex items-center justify-between border-t border-[#F0ECE1]">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="px-5 py-2.5 rounded-lg border border-[#D5D0C6] hover:bg-[#FAF8F5] text-xs font-semibold uppercase tracking-wider text-[#585550] transition-colors cursor-pointer"
                      >
                        Previous Step
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 bg-[#1E352B] hover:bg-[#162720] text-white px-8 py-3.5 rounded-xl font-medium text-sm tracking-wide transition-all shadow-sm cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <span>Processing...</span>
                        ) : (
                          <>
                            <span>Submit Material Request</span>
                            <Send className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* ------------------------------------------------------------------- */}
            {/* RIGHT COLUMN: PERSISTENT "YOUR MATERIAL BRIEF" PANEL (~32% WIDTH) */}
            {/* ------------------------------------------------------------------- */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6 sticky top-28">
                {/* Brief Title & Counter Pill */}
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#181715]">
                    Your Material Brief
                  </h3>
                  <span className="bg-[#FAF8F5] border border-[#E8E4DC] text-[#736F68] font-mono text-xs px-2.5 py-1 rounded-full font-medium">
                    {selectedKit.length} items
                  </span>
                </div>

                {/* Inner Dashed State Container */}
                <div className="border border-dashed border-[#DFD9CC] rounded-xl p-5 bg-[#FAF9F6]/80 text-center">
                  {selectedKit.length === 0 ? (
                    /* Empty State: Matching Mockup with Spool / Textile Icon */
                    <div className="py-6 space-y-2.5">
                      <div className="w-10 h-10 mx-auto rounded-full bg-[#B86546]/10 text-[#B86546] flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-[#B86546]" />
                      </div>
                      <h4 className="font-semibold text-[#181715] text-sm">
                        No items selected yet
                      </h4>
                      <p className="text-xs text-[#736F68] max-w-[210px] mx-auto leading-relaxed">
                        Start adding fabrics or accessories to build your material brief.
                      </p>
                    </div>
                  ) : (
                    /* Active Selected Materials List */
                    <div className="space-y-2.5 text-left max-h-64 overflow-y-auto pr-1">
                      {selectedKit.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-3 p-2 rounded-lg bg-white border border-[#E8E4DC] shadow-2xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 rounded object-cover shrink-0 border border-stone-200"
                            />
                            <div className="min-w-0">
                              <h5 className="text-xs font-semibold text-[#181715] truncate">
                                {item.name}
                              </h5>
                              <span className="text-[10px] font-mono text-[#8C827A] uppercase">
                                {item.categoryLabel}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFromKit(item.id)}
                            className="p-1 rounded text-stone-400 hover:text-red-600 transition-colors cursor-pointer shrink-0"
                            title="Remove from brief"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      <div className="pt-2 flex justify-between items-center text-[11px]">
                        <button
                          type="button"
                          onClick={() => {
                            if (currentStep !== 1) setCurrentStep(1);
                          }}
                          className="text-[#B86546] hover:underline font-medium"
                        >
                          + Add more
                        </button>
                        <button
                          type="button"
                          onClick={handleClearKit}
                          className="text-[#8C827A] hover:text-red-600 transition-colors"
                        >
                          Clear all
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Live Metrics List matching Mockup */}
                <div className="space-y-3 pt-1 text-xs">
                  {/* Selected Items */}
                  <div className="flex items-center justify-between py-1.5 border-b border-[#F0ECE1]">
                    <div className="flex items-center gap-2 text-[#585550]">
                      <Package className="w-4 h-4 text-[#8C827A]" />
                      <span>Selected Items</span>
                    </div>
                    <span className="font-semibold text-[#181715]">
                      {selectedKit.length}
                    </span>
                  </div>

                  {/* Total Quantity */}
                  <div className="flex items-center justify-between py-1.5 border-b border-[#F0ECE1]">
                    <div className="flex items-center gap-2 text-[#585550]">
                      <FileText className="w-4 h-4 text-[#8C827A]" />
                      <span>Total Quantity</span>
                    </div>
                    <span className="font-semibold text-[#181715]">
                      {isQuantityUndecided
                        ? 'Sampling / Undecided'
                        : formData.quantity
                        ? `${formData.quantity} ${formData.unit}`
                        : '—'}
                    </span>
                  </div>

                  {/* Reference Images */}
                  <div className="flex items-center justify-between py-1.5 border-b border-[#F0ECE1]">
                    <div className="flex items-center gap-2 text-[#585550]">
                      <Upload className="w-4 h-4 text-[#8C827A]" />
                      <span>Reference Images</span>
                    </div>
                    <span className="font-semibold text-[#181715]">
                      {uploadedFiles.length}
                    </span>
                  </div>

                  {/* Custom Notes */}
                  <div className="flex items-center justify-between py-1.5 border-b border-[#F0ECE1]">
                    <div className="flex items-center gap-2 text-[#585550]">
                      <Pencil className="w-4 h-4 text-[#8C827A]" />
                      <span>Custom Notes</span>
                    </div>
                    <span className="font-semibold text-[#181715]">
                      {formData.additionalNotes ? 'Provided' : '—'}
                    </span>
                  </div>
                </div>

                {/* Primary Button */}
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleContinue}
                    className="w-full bg-[#1E352B] hover:bg-[#162720] text-white py-3.5 px-6 rounded-xl font-medium text-sm tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.98]"
                  >
                    <span>Continue to Next Step</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitEnquiry}
                    disabled={isSubmitting}
                    className="w-full bg-[#1E352B] hover:bg-[#162720] text-white py-3.5 px-6 rounded-xl font-medium text-sm tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.98] disabled:opacity-50"
                  >
                    <span>Submit Material Request</span>
                    <Send className="w-4 h-4" />
                  </button>
                )}

                {/* Official Support Card below (Matching reference mockup) */}
                <div className="bg-[#F8F5EE] border border-[#ECE6D9] rounded-xl p-4 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-[#ECE5D8] flex items-center justify-center text-[#585550] shrink-0">
                    <Headphones className="w-4 h-4 text-[#585550]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-xs text-[#181715]">
                      For more info, contact us
                    </h4>
                    <p className="text-[11px] text-[#736F68] leading-snug">
                      Our team is here to help you find the right materials for your needs.
                    </p>
                    <div className="pt-1">
                      <a
                        href={`tel:${VERIFIED_PHONE}`}
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#181715] hover:text-[#B86546] transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#B86546]" />
                        <span>{VERIFIED_PHONE}</span>
                      </a>
                    </div>
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
