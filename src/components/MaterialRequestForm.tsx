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
  Clock,
  MapPin,
  Building,
  User,
  Phone,
  Mail,
  ShieldCheck,
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

// 9 Specific Material Categories requested
const CATEGORIES: {
  id: MaterialRequestCategory;
  name: string;
  subtitle: string;
  iconName: 'Layers' | 'Package' | 'Sparkles' | 'Scissors' | 'Bookmark' | 'HelpCircle';
  specHints: string[];
}[] = [
  {
    id: 'fabric',
    name: 'Fabrics',
    subtitle: 'Woven, Poplin, Gada, Cotton, Rayon, Linen, Knits',
    iconName: 'Layers',
    specHints: ['GSM / Weight', 'Width (44", 58")', 'Composition', 'Weave & Finish'],
  },
  {
    id: 'denim',
    name: 'Denim & Chambray',
    subtitle: 'Rigid, Stretch, Twill, Indigo, Shirting Chambray',
    iconName: 'Package',
    specHints: ['Weight in Oz (8oz-14oz)', 'Indigo / Sulphur', 'Stretch %', 'Twill Weave'],
  },
  {
    id: 'mesh',
    name: 'Mesh',
    subtitle: 'Poly Mesh, Lycra Mesh, Air Mesh, Honeycomb',
    iconName: 'Layers',
    specHints: ['Pore structure', 'GSM', 'Width', '4-Way Stretch'],
  },
  {
    id: 'lace',
    name: 'Garment Laces',
    subtitle: 'Guipure, Cotton Lace, Crochet, Stretch Trims',
    iconName: 'Sparkles',
    specHints: ['Width (mm/inch)', 'Pattern type', 'Stretch / Rigid', 'Dyeable'],
  },
  {
    id: 'zipper',
    name: 'Zippers',
    subtitle: 'Metal, Nylon Coil, Visilon, Invisible, Custom Pullers',
    iconName: 'Scissors',
    specHints: ['Gauge (#3, #5, #8)', 'Open/Closed End', 'Metal Teeth Finish', 'Tape Colour'],
  },
  {
    id: 'button',
    name: 'Buttons',
    subtitle: 'Horn, Coconut, Metal Snap, Resin, Laser Engraved',
    iconName: 'Bookmark',
    specHints: ['Size (Ligne/mm)', 'Material / Type', 'Holes / Shank', 'Logo Engraving'],
  },
  {
    id: 'tipping',
    name: 'Tipping',
    subtitle: 'Drawcord Tipping, Metal Aglets, Silicone Dipped',
    iconName: 'Sparkles',
    specHints: ['Aglet Type (Metal/Silicone)', 'Cord Diameter', 'Plating / Finish', 'Custom Logo'],
  },
  {
    id: 'accessories',
    name: 'Other Accessories',
    subtitle: 'Woven Labels, Badges, Elastics, Tapes, Ribbons',
    iconName: 'Bookmark',
    specHints: ['Accessory Type', 'Dimensions', 'Material & Weave', 'Branding Spec'],
  },
  {
    id: 'other',
    name: 'Other / Custom Requirement',
    subtitle: 'Bespoke weaves or specialized custom development',
    iconName: 'HelpCircle',
    specHints: ['Custom parameters', 'Target garment use', 'Sample reference'],
  },
];

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
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<MaterialRequestData>(() => {
    const initialCat = (initialData?.category as MaterialRequestCategory) || 
      (similarProduct?.category === 'laces'
        ? 'lace'
        : similarProduct?.category === 'denim'
        ? 'denim'
        : similarProduct?.category === 'mesh'
        ? 'mesh'
        : similarProduct?.category === 'buttons'
        ? 'button'
        : similarProduct?.category === 'accessories'
        ? 'accessories'
        : 'fabric');

    return {
      ...INITIAL_REQUEST,
      ...initialData,
      category: initialCat,
      materialName: initialData?.materialName || (similarProduct ? `Similar to: ${similarProduct.name}` : ''),
      similarToProductCode: similarProduct?.productCode,
      similarToProductName: similarProduct?.name,
      specifications: {
        ...INITIAL_REQUEST.specifications,
        typeVariant: similarProduct?.subcategory || '',
        composition: similarProduct?.fabric || '',
        widthOrSize: similarProduct?.sizes?.[0] || '',
        colourPreference: similarProduct?.colours?.[0] || '',
        ...(initialData?.specifications || {}),
      },
    };
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isQuantityUndecided, setIsQuantityUndecided] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [submission, setSubmission] = useState<MaterialRequestSubmission | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // If similarProduct changed, update state
  useEffect(() => {
    if (similarProduct) {
      setFormData((prev) => ({
        ...prev,
        materialName: `Alternative for ${similarProduct.name} (${similarProduct.productCode})`,
        similarToProductCode: similarProduct.productCode,
        similarToProductName: similarProduct.name,
        category: (similarProduct.category === 'laces'
          ? 'lace'
          : similarProduct.category === 'denim'
          ? 'denim'
          : similarProduct.category === 'mesh'
          ? 'mesh'
          : similarProduct.category === 'buttons'
          ? 'button'
          : similarProduct.category === 'accessories'
          ? 'accessories'
          : 'fabric'),
        specifications: {
          ...prev.specifications,
          composition: similarProduct.fabric || prev.specifications.composition,
          typeVariant: similarProduct.subcategory || prev.specifications.typeVariant,
          widthOrSize: similarProduct.sizes?.[0] || prev.specifications.widthOrSize,
          colourPreference: similarProduct.colours?.[0] || prev.specifications.colourPreference,
        },
      }));
    }
  }, [similarProduct]);

  // Category helpers for dynamic fields
  const isFabricType = formData.category === 'fabric' || formData.category === 'denim' || formData.category === 'mesh' || formData.category === 'lace';
  const isAccessoryType = formData.category === 'zipper' || formData.category === 'button' || formData.category === 'tipping' || formData.category === 'accessories';

  // Handle multi-file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (uploadedFiles.length + files.length > 4) {
      alert('You can upload a maximum of 4 reference images.');
      return;
    }

    Array.from(files).forEach((file) => {
      if (file.size > 8 * 1024 * 1024) {
        alert(`"${file.name}" exceeds 8MB. Please select a smaller file.`);
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
          // update form data
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
      if (!formData.category) {
        errors.category = 'Please select a material category to continue.';
      }
    } else if (currentStep === 2) {
      if (!formData.materialName.trim()) {
        errors.materialName = 'Please enter the material or product name.';
      }
    } else if (currentStep === 4) {
      if (!isQuantityUndecided && !formData.quantity.trim()) {
        errors.quantity = 'Please specify the estimated quantity needed or check "Not decided yet".';
      }
    } else if (currentStep === 5) {
      if (!formData.contactName.trim()) {
        errors.contactName = 'Please provide your full name.';
      }
      if (!formData.phone.trim()) {
        errors.phone = 'Please provide a valid phone or WhatsApp number.';
      } else if (!/^[0-9+() -]{7,16}$/.test(formData.phone.trim())) {
        errors.phone = 'Please enter a valid phone number (digits only, e.g. +91 98765 43210).';
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
      window.scrollTo({ top: 140, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setValidationErrors({});
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 140, behavior: 'smooth' });
  };

  const handleJumpToStep = (stepNumber: number) => {
    setValidationErrors({});
    setCurrentStep(stepNumber);
    window.scrollTo({ top: 140, behavior: 'smooth' });
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
      // Ignore storage error
    }

    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const generateWhatsAppMessage = (sub: MaterialRequestSubmission) => {
    const text = `*CLASSIC FASHIONS — MATERIAL REQUIREMENT*
*Ref Code:* ${sub.referenceCode}
*Category:* ${CATEGORIES.find((c) => c.id === sub.category)?.name || sub.category.toUpperCase()}
*Material:* ${sub.materialName}
${sub.specifications.typeVariant ? `*Type/Variant:* ${sub.specifications.typeVariant}\n` : ''}${sub.specifications.composition ? `*Composition:* ${sub.specifications.composition}\n` : ''}${sub.specifications.widthOrSize ? `*Width/Size:* ${sub.specifications.widthOrSize}\n` : ''}${sub.specifications.gsmOrWeight ? `*GSM/Weight:* ${sub.specifications.gsmOrWeight}\n` : ''}${sub.specifications.colourPreference ? `*Colour:* ${sub.specifications.colourPreference}\n` : ''}${sub.specifications.patternOrFinish ? `*Finish:* ${sub.specifications.patternOrFinish}\n` : ''}
*Quantity:* ${sub.quantity} ${sub.quantity !== 'Not decided yet' ? sub.unit : ''}
*Timeline:* ${sub.targetTimeline || 'Standard'}
*Buyer:* ${sub.contactName} (${sub.companyName || 'Apparel Studio'})
*Phone:* ${sub.phone}
${sub.email ? `*Email:* ${sub.email}\n` : ''}${sub.cityState ? `*Location:* ${sub.cityState}\n` : ''}
_Submitted via Classic Fashions Platform. Please review and provide availability & quotation._`;

    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  const renderCategoryIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'Layers':
        return <Layers className={className} />;
      case 'Package':
        return <Package className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Scissors':
        return <Scissors className={className} />;
      case 'Bookmark':
        return <Bookmark className={className} />;
      default:
        return <HelpCircle className={className} />;
    }
  };

  // --------------------------------------------------------------------------
  // SUCCESS / CONFIRMATION SCREEN
  // --------------------------------------------------------------------------
  if (submission) {
    const selectedCategoryName = CATEGORIES.find((c) => c.id === submission.category)?.name || submission.category;

    return (
      <div className="bg-[#FAF9F6] min-h-screen py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="bg-white border border-[#E8E2D8] rounded-2xl shadow-[0_12px_40px_rgba(24,23,21,0.06)] p-6 sm:p-10 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#EFEAE2] gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EE] border border-[#ECDCCB] text-[#82553E] text-xs font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Request Received Successfully</span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181715] pt-1">
                  Thank You, {submission.contactName}
                </h1>
                <p className="text-xs sm:text-sm text-[#5C564D]">
                  Our procurement desk is reviewing your requirements against verified production lines.
                </p>
              </div>

              <div className="bg-[#FAF8F5] border border-[#E8E2D8] p-3.5 rounded-xl text-left sm:text-right shrink-0">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#8A847C] block font-semibold">
                  Reference Code
                </span>
                <span className="font-mono text-base sm:text-lg font-bold text-[#181715]">
                  {submission.referenceCode}
                </span>
              </div>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs bg-[#FAF9F6] p-5 sm:p-6 rounded-xl border border-[#ECE6DC]">
              <div className="space-y-2.5">
                <h4 className="font-serif text-sm font-bold text-[#181715] border-b border-[#E2DBD0] pb-1.5 uppercase tracking-wide">
                  Material Details
                </h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#7A7369]">Category:</span>
                    <span className="font-semibold text-[#181715]">{selectedCategoryName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A7369]">Item Name:</span>
                    <span className="font-semibold text-[#181715] text-right">{submission.materialName}</span>
                  </div>
                  {submission.specifications.typeVariant && (
                    <div className="flex justify-between">
                      <span className="text-[#7A7369]">Type / Variant:</span>
                      <span className="font-medium text-[#181715]">{submission.specifications.typeVariant}</span>
                    </div>
                  )}
                  {submission.specifications.composition && (
                    <div className="flex justify-between">
                      <span className="text-[#7A7369]">Composition:</span>
                      <span className="font-medium text-[#181715] text-right">{submission.specifications.composition}</span>
                    </div>
                  )}
                  {submission.specifications.widthOrSize && (
                    <div className="flex justify-between">
                      <span className="text-[#7A7369]">Width / Size:</span>
                      <span className="font-medium text-[#181715]">{submission.specifications.widthOrSize}</span>
                    </div>
                  )}
                  {submission.specifications.gsmOrWeight && (
                    <div className="flex justify-between">
                      <span className="text-[#7A7369]">GSM / Weight:</span>
                      <span className="font-medium text-[#181715]">{submission.specifications.gsmOrWeight}</span>
                    </div>
                  )}
                  {submission.specifications.colourPreference && (
                    <div className="flex justify-between">
                      <span className="text-[#7A7369]">Colour / Shade:</span>
                      <span className="font-medium text-[#181715]">{submission.specifications.colourPreference}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2.5">
                <h4 className="font-serif text-sm font-bold text-[#181715] border-b border-[#E2DBD0] pb-1.5 uppercase tracking-wide">
                  Scope &amp; Contact
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
                  {submission.email && (
                    <div className="flex justify-between">
                      <span className="text-[#7A7369]">Email:</span>
                      <span className="font-medium text-[#181715]">{submission.email}</span>
                    </div>
                  )}
                  {submission.cityState && (
                    <div className="flex justify-between">
                      <span className="text-[#7A7369]">Location:</span>
                      <span className="font-medium text-[#181715]">{submission.cityState}</span>
                    </div>
                  )}
                  {submission.hasPhysicalSample && (
                    <div className="flex justify-between text-[#82553E] font-medium pt-1 border-t border-[#EAE3D6]">
                      <span>Physical Swatch:</span>
                      <span>Courier to Tiruppur</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Reference Images Preview if present */}
            {submission.referenceImages && submission.referenceImages.length > 0 && (
              <div className="space-y-2.5">
                <span className="text-xs font-mono uppercase tracking-wider text-[#7A7369] font-semibold block">
                  Attached Swatches / Technical Images ({submission.referenceImages.length})
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {submission.referenceImages.map((img, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden border border-[#E0D8CD] bg-[#FAF8F5]">
                      <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white border border-[#DDD5C9] text-[#181715] hover:bg-[#FAF8F5] rounded-full text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#82553E]" />
                <span>Submit Another Request</span>
              </button>

              <button
                onClick={onExploreCatalogue}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#82553E] hover:bg-[#6D432E] text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ml-auto shadow-xs"
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

  // Step Meta for compact progress indicator
  const stepsMeta = [
    { step: 1, label: 'Category' },
    { step: 2, label: 'Specifications' },
    { step: 3, label: 'Swatch & Image' },
    { step: 4, label: 'Quantity' },
    { step: 5, label: 'Contact Details' },
  ];

  const currentCategoryObj = CATEGORIES.find((c) => c.id === formData.category) || CATEGORIES[0];

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* 1. Page Header (Exact requested headline, subtitle, and description) */}
        <div className="text-center space-y-3.5">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181715] tracking-tight">
            Can&apos;t Find the Right Material?
          </h1>

          {/* Elegant Gold Diamond Motif Divider matching Home page */}
          <div className="relative flex items-center justify-center w-full max-w-xs mx-auto pt-0.5">
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-[#D4AF37]" />
            <div className="relative mx-2.5 flex items-center justify-center">
              <div className="w-2 h-2 bg-gradient-to-tr from-[#D4AF37] via-[#F2D785] to-[#B38728] rotate-45 shadow-[0_0_8px_rgba(212,175,55,0.75)]" />
            </div>
            <div className="h-[1px] w-20 bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/50 to-transparent" />
          </div>

          <p className="font-serif text-lg sm:text-xl text-[#82553E] font-medium">
            Tell Us What You Need.
          </p>
          <p className="text-sm sm:text-base text-[#585550] max-w-2xl mx-auto leading-relaxed">
            Share your material requirements with us. We’ll review your needs and contact you with suitable options, availability, and pricing.
          </p>
        </div>

        {/* Similar Product Notice if coming from catalogue */}
        {similarProduct && (
          <div className="bg-[#F5F2EB] border border-[#DDD6C8] rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#82553E] block font-semibold">
                Sourcing Reference Product
              </span>
              <p className="text-xs font-semibold text-[#181715]">
                {similarProduct.name} <span className="font-mono text-[#736F68]">({similarProduct.productCode})</span>
              </p>
              <p className="text-[11px] text-[#585550]">
                Pre-filled initial category and baseline parameters from this catalogue item.
              </p>
            </div>
            <button
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  similarToProductCode: undefined,
                  similarToProductName: undefined,
                  materialName: '',
                }));
              }}
              className="text-xs text-[#82553E] hover:text-[#181715] underline shrink-0 font-medium cursor-pointer"
            >
              Clear link
            </button>
          </div>
        )}

        {/* 2. Main Form Container */}
        <div className="bg-white rounded-2xl border border-[#E8E2D8] shadow-[0_8px_30px_rgba(24,23,21,0.04)] overflow-hidden">
          
          {/* Compact Progress Indicator (Replaces the 4 big explanatory cards) */}
          <div className="border-b border-[#EAE4D8] bg-[#FBF9F5] px-4 sm:px-8 pt-5 pb-4">
            {/* Visual Progress Bar */}
            <div className="w-full bg-[#E8E2D8] h-1.5 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-[#181715] via-[#82553E] to-[#D4AF37] transition-all duration-400 ease-out"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>

            {/* Step Pills & Title */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
              {stepsMeta.map((s) => {
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
                    className={`flex items-center gap-2 group transition-all shrink-0 ${
                      !isCompleted && !isCurrent ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono font-bold transition-all ${
                        isCurrent
                          ? 'bg-[#181715] text-white shadow-xs scale-105'
                          : isCompleted
                          ? 'bg-[#82553E] text-white'
                          : 'bg-[#EAE4D8] text-[#736F68]'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : s.step}
                    </span>
                    <span
                      className={`text-[11px] uppercase tracking-wider font-semibold ${
                        isCurrent
                          ? 'text-[#181715] border-b border-[#181715] pb-0.5'
                          : isCompleted
                          ? 'text-[#82553E]'
                          : 'text-[#8A847C]'
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Step Body */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-7">
            
            {/* -------------------------------------------------------------- */}
            {/* STEP 1: MATERIAL CATEGORY (9 Compact Category Cards) */}
            {/* -------------------------------------------------------------- */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#82553E] font-semibold block mb-1">
                    Step 1 of 5
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#181715] tracking-tight">
                    Select Material Category
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B655C] mt-1">
                    Choose the garment material group you need sourced or custom-manufactured.
                  </p>
                </div>

                {validationErrors.category && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{validationErrors.category}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {CATEGORIES.map((cat) => {
                    const isSelected = formData.category === cat.id;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, category: cat.id }));
                          setValidationErrors({});
                        }}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 relative group flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#181715] bg-[#FAF8F5] shadow-xs ring-1.5 ring-[#181715]'
                            : 'border-[#E2DBD0] bg-white hover:border-[#82553E]/50 hover:bg-[#FAF9F6]'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                                isSelected ? 'bg-[#181715] text-white' : 'bg-[#FAF5EE] text-[#82553E] group-hover:bg-[#181715] group-hover:text-white'
                              }`}
                            >
                              {renderCategoryIcon(cat.iconName, 'w-4 h-4')}
                            </div>
                            <span
                              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                                isSelected ? 'border-[#181715] bg-[#181715]' : 'border-[#C4B7AA]'
                              }`}
                            >
                              {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                            </span>
                          </div>
                          <h4 className="font-serif text-sm sm:text-base font-bold text-[#181715]">
                            {cat.name}
                          </h4>
                          <p className="text-[11px] text-[#6E6860] mt-1 leading-snug">
                            {cat.subtitle}
                          </p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-[#EFECE6] flex flex-wrap gap-1">
                          {cat.specHints.slice(0, 2).map((hint, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-mono text-[#736F68] bg-[#F2EDE6] px-1.5 py-0.5 rounded"
                            >
                              {hint}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* STEP 2: DYNAMIC SPECIFICATIONS (Tailored to Category) */}
            {/* -------------------------------------------------------------- */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#82553E] bg-[#FAF5EE] px-2.5 py-0.5 rounded border border-[#ECDCCB] font-semibold">
                      Category: {currentCategoryObj.name}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#181715] tracking-tight">
                    Technical Specifications
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B655C] mt-1">
                    Share your requirements. Approximate parameters are completely fine if exact specs aren&apos;t known.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Primary Material / Product Name */}
                  <div>
                    <label className="block text-xs font-semibold text-[#181715] uppercase tracking-wider mb-1">
                      {isAccessoryType ? 'Accessory / Product Name' : 'Material / Fabric Name'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder={
                        isAccessoryType
                          ? 'e.g. #5 Antique Brass Zipper, 24L Horn Button, 4mm Metal Aglet, Branded Woven Tag...'
                          : 'e.g. 100% Combed Cotton Poplin, 25mm Eyelet Lace, 10.5oz Selvedge Denim, Lycra Power Mesh...'
                      }
                      value={formData.materialName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, materialName: e.target.value }))}
                      className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF9F6] border rounded-xl text-[#181715] focus:outline-none focus:border-[#181715] transition-colors ${
                        validationErrors.materialName ? 'border-red-500 bg-red-50/20' : 'border-[#D5D0C6]'
                      }`}
                    />
                    {validationErrors.materialName && (
                      <span className="text-[11px] text-red-600 mt-1 block">
                        {validationErrors.materialName}
                      </span>
                    )}
                  </div>

                  {/* Dynamic Fields for FABRIC / TEXTILE categories */}
                  {isFabricType && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Fabric Type / Weave Variant */}
                      <div>
                        <label className="block text-xs font-semibold text-[#666056] uppercase tracking-wider mb-1">
                          Fabric Type or Weave Variety
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Plain Weave, Twill, Chambray, Guipure, Air Mesh..."
                          value={formData.specifications.typeVariant || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              specifications: { ...prev.specifications, typeVariant: e.target.value },
                            }))
                          }
                          className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF9F6] border border-[#D5D0C6] rounded-xl text-[#181715] focus:outline-none focus:border-[#181715]"
                        />
                      </div>

                      {/* Composition Blend */}
                      <div>
                        <label className="block text-xs font-semibold text-[#666056] uppercase tracking-wider mb-1">
                          Composition / Fiber Blend
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 100% Cotton, 80/20 Cotton-Poly, Cotton Lycra blend..."
                          value={formData.specifications.composition || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              specifications: { ...prev.specifications, composition: e.target.value },
                            }))
                          }
                          className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF9F6] border border-[#D5D0C6] rounded-xl text-[#181715] focus:outline-none focus:border-[#181715]"
                        />
                      </div>

                      {/* Width / Dimension */}
                      <div>
                        <label className="block text-xs font-semibold text-[#666056] uppercase tracking-wider mb-1">
                          Width / Finished Dimension
                        </label>
                        <input
                          type="text"
                          placeholder='e.g. 44" inches, 58/60" inches, 25mm lace width...'
                          value={formData.specifications.widthOrSize || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              specifications: { ...prev.specifications, widthOrSize: e.target.value },
                            }))
                          }
                          className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF9F6] border border-[#D5D0C6] rounded-xl text-[#181715] focus:outline-none focus:border-[#181715]"
                        />
                      </div>

                      {/* GSM or Weight in Oz */}
                      <div>
                        <label className="block text-xs font-semibold text-[#666056] uppercase tracking-wider mb-1">
                          Weight (GSM or Oz)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 140 GSM, 180 GSM, 11 Oz denim, Heavy weight..."
                          value={formData.specifications.gsmOrWeight || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              specifications: { ...prev.specifications, gsmOrWeight: e.target.value },
                            }))
                          }
                          className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF9F6] border border-[#D5D0C6] rounded-xl text-[#181715] focus:outline-none focus:border-[#181715]"
                        />
                      </div>

                      {/* Colour / Shade */}
                      <div>
                        <label className="block text-xs font-semibold text-[#666056] uppercase tracking-wider mb-1">
                          Colour / Shade Preference
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Raw Gada / RFD, Bleached White, Indigo, Pantone 19-4010..."
                          value={formData.specifications.colourPreference || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              specifications: { ...prev.specifications, colourPreference: e.target.value },
                            }))
                          }
                          className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF9F6] border border-[#D5D0C6] rounded-xl text-[#181715] focus:outline-none focus:border-[#181715]"
                        />
                      </div>

                      {/* Weave or Finish */}
                      <div>
                        <label className="block text-xs font-semibold text-[#666056] uppercase tracking-wider mb-1">
                          Weave or Finish Requirement
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Mercerized, Peach Finish, Bio-Wash, Enzyme Treated, Scalped..."
                          value={formData.specifications.patternOrFinish || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              specifications: { ...prev.specifications, patternOrFinish: e.target.value },
                            }))
                          }
                          className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF9F6] border border-[#D5D0C6] rounded-xl text-[#181715] focus:outline-none focus:border-[#181715]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Dynamic Fields for ACCESSORY categories (Zippers, Buttons, Tipping, Accessories) */}
                  {isAccessoryType && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Accessory Type */}
                      <div>
                        <label className="block text-xs font-semibold text-[#666056] uppercase tracking-wider mb-1">
                          Accessory Subtype
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Open-End Zipper, 4-Hole Horn Button, Metal Aglet..."
                          value={formData.specifications.typeVariant || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              specifications: { ...prev.specifications, typeVariant: e.target.value },
                            }))
                          }
                          className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF9F6] border border-[#D5D0C6] rounded-xl text-[#181715] focus:outline-none focus:border-[#181715]"
                        />
                      </div>

                      {/* Material / Substrate */}
                      <div>
                        <label className="block text-xs font-semibold text-[#666056] uppercase tracking-wider mb-1">
                          Material / Base Substrate
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Brass, Natural Horn, Coconut Shell, Polyester, Silicone..."
                          value={formData.specifications.composition || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              specifications: { ...prev.specifications, composition: e.target.value },
                            }))
                          }
                          className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF9F6] border border-[#D5D0C6] rounded-xl text-[#181715] focus:outline-none focus:border-[#181715]"
                        />
                      </div>

                      {/* Size / Dimensions / Gauge */}
                      <div>
                        <label className="block text-xs font-semibold text-[#666056] uppercase tracking-wider mb-1">
                          Size / Dimensions / Gauge
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 24L / 15mm button, #5 teeth gauge, 60cm length, 4mm cord dia..."
                          value={formData.specifications.widthOrSize || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              specifications: { ...prev.specifications, widthOrSize: e.target.value },
                            }))
                          }
                          className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF9F6] border border-[#D5D0C6] rounded-xl text-[#181715] focus:outline-none focus:border-[#181715]"
                        />
                      </div>

                      {/* Colour / Plating / Finish */}
                      <div>
                        <label className="block text-xs font-semibold text-[#666056] uppercase tracking-wider mb-1">
                          Colour / Plating / Finish
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Antique Brass, Gunmetal, Matte Black, Dye-to-Match..."
                          value={formData.specifications.colourPreference || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              specifications: { ...prev.specifications, colourPreference: e.target.value },
                            }))
                          }
                          className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF9F6] border border-[#D5D0C6] rounded-xl text-[#181715] focus:outline-none focus:border-[#181715]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Dynamic Fields for OTHER / CUSTOM category */}
                  {!isFabricType && !isAccessoryType && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#666056] uppercase tracking-wider mb-1">
                          Item Classification / Subtype
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Specialized Technical Composite, Specialized Trim..."
                          value={formData.specifications.typeVariant || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              specifications: { ...prev.specifications, typeVariant: e.target.value },
                            }))
                          }
                          className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF9F6] border border-[#D5D0C6] rounded-xl text-[#181715] focus:outline-none focus:border-[#181715]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#666056] uppercase tracking-wider mb-1">
                          Base Composition
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Natural fiber blend, polymer, recycled yarn..."
                          value={formData.specifications.composition || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              specifications: { ...prev.specifications, composition: e.target.value },
                            }))
                          }
                          className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF9F6] border border-[#D5D0C6] rounded-xl text-[#181715] focus:outline-none focus:border-[#181715]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Any Additional Requirements */}
                  <div>
                    <label className="block text-xs font-semibold text-[#666056] uppercase tracking-wider mb-1">
                      Any Additional Requirements / Notes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Mention any custom design requirements, branding details, packaging guidelines, or physical sample notes..."
                      value={formData.specifications.customDetails || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          specifications: { ...prev.specifications, customDetails: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF9F6] border border-[#D5D0C6] rounded-xl text-[#181715] focus:outline-none focus:border-[#181715]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* STEP 3: SWATCH & REFERENCE IMAGE (Multiple Files Supported) */}
            {/* -------------------------------------------------------------- */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#82553E] font-semibold block mb-1">
                    Step 3 of 5
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#181715] tracking-tight">
                    Reference Swatch &amp; Image
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

                  {/* Physical Sample Checkbox & Courier note */}
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
                        <label className="block text-[11px] font-semibold text-[#6E6860] uppercase mb-1">
                          Sample Details / Tracking Info (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Swatch size 10x10cm, courier via DTDC/Professional..."
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
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* STEP 4: QUANTITY & TIMELINE */}
            {/* -------------------------------------------------------------- */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#82553E] font-semibold block mb-1">
                    Step 4 of 5
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#181715] tracking-tight">
                    Quantity &amp; Timeline
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B655C] mt-1">
                    State the volume and schedule required to assess production economics and bulk tiered pricing.
                  </p>
                </div>

                <div className="space-y-4">
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

                  {/* Target Delivery Timeline */}
                  <div>
                    <label className="block text-xs font-semibold text-[#666056] uppercase tracking-wider mb-1">
                      Expected Delivery Timeline
                    </label>
                    <select
                      value={formData.targetTimeline}
                      onChange={(e) => setFormData((prev) => ({ ...prev, targetTimeline: e.target.value }))}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF9F6] border border-[#D5D0C6] rounded-xl text-[#181715] focus:outline-none focus:border-[#181715]"
                    >
                      <option value="Immediate (Within 1-2 weeks)">Immediate (Within 1-2 weeks)</option>
                      <option value="Standard Production (Within 2-3 weeks)">Standard Production (Within 2-3 weeks)</option>
                      <option value="Upcoming Schedule (Within 1 month)">Upcoming Schedule (Within 1 month)</option>
                      <option value="Not decided yet / Planning Stage">Not decided yet / Planning Stage</option>
                    </select>
                  </div>

                  {/* Order Type / Purpose */}
                  <div>
                    <label className="block text-xs font-semibold text-[#666056] uppercase tracking-wider mb-1">
                      Intended Application / Order Type
                    </label>
                    <select
                      value={formData.purpose}
                      onChange={(e) => setFormData((prev) => ({ ...prev, purpose: e.target.value }))}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF9F6] border border-[#D5D0C6] rounded-xl text-[#181715] focus:outline-none focus:border-[#181715]"
                    >
                      <option value="Bulk Garment Production">Bulk Garment Production</option>
                      <option value="Sampling / Fit Sample Development">Sampling / Fit Sample Development</option>
                      <option value="Export Garmenting Order">Export Garmenting Order</option>
                      <option value="Domestic Retail Brand Manufacturing">Domestic Retail Brand Manufacturing</option>
                      <option value="Not decided yet / Initial Feasibility">Not decided yet / Initial Feasibility</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* STEP 5: CONTACT DETAILS & REVIEW SUMMARY */}
            {/* -------------------------------------------------------------- */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#82553E] font-semibold block mb-1">
                    Step 5 of 5
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#181715] tracking-tight">
                    Contact Details
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B655C] mt-1">
                    Provide your contact details so our sourcing desk can reach you with matching options and pricing.
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
                        className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF9F6] border rounded-xl text-[#181715] focus:outline-none focus:border-[#181715] ${
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
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF9F6] border border-[#D5D0C6] rounded-xl text-[#181715] focus:outline-none focus:border-[#181715]"
                      />
                    </div>
                  </div>

                  {/* Phone and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#181715] uppercase tracking-wider mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. +91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF9F6] border rounded-xl text-[#181715] focus:outline-none focus:border-[#181715] ${
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
                        className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF9F6] border rounded-xl text-[#181715] focus:outline-none focus:border-[#181715] ${
                          validationErrors.email ? 'border-red-500 bg-red-50/20' : 'border-[#D5D0C6]'
                        }`}
                      />
                      {validationErrors.email && (
                        <span className="text-[11px] text-red-600 mt-1 block">
                          {validationErrors.email}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Location and Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-[#666056] uppercase tracking-wider mb-1">
                      Delivery Location / City
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tiruppur, Coimbatore, Bengaluru, Surat, Mumbai..."
                      value={formData.cityState}
                      onChange={(e) => setFormData((prev) => ({ ...prev, cityState: e.target.value }))}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF9F6] border border-[#D5D0C6] rounded-xl text-[#181715] focus:outline-none focus:border-[#181715]"
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
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF9F6] border border-[#D5D0C6] rounded-xl text-[#181715] focus:outline-none focus:border-[#181715]"
                    />
                  </div>

                  {/* Interactive Review Summary before submission with direct Edit buttons */}
                  <div className="pt-4 border-t border-[#EAE3D6]">
                    <div className="p-4 sm:p-5 bg-[#FAF8F5] rounded-xl border border-[#E0D8CD] space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#ECE4D8]">
                        <span className="font-serif text-sm font-bold text-[#181715] uppercase tracking-wide">
                          Review Your Details Before Submitting
                        </span>
                        <span className="text-[10px] font-mono uppercase text-[#82553E] bg-white px-2 py-0.5 rounded border border-[#E5DACD]">
                          Summary
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {/* Section 1: Category */}
                        <div className="flex items-start justify-between p-2.5 rounded-lg bg-white border border-[#EBE4D8]">
                          <div>
                            <span className="text-[10px] uppercase font-mono text-[#8A847C] block">Category</span>
                            <span className="font-bold text-[#181715]">{currentCategoryObj.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleJumpToStep(1)}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-[#82553E] hover:underline cursor-pointer"
                          >
                            <Pencil className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                        </div>

                        {/* Section 2: Specifications */}
                        <div className="flex items-start justify-between p-2.5 rounded-lg bg-white border border-[#EBE4D8]">
                          <div className="max-w-[75%] truncate">
                            <span className="text-[10px] uppercase font-mono text-[#8A847C] block">Specifications</span>
                            <span className="font-bold text-[#181715] block truncate">
                              {formData.materialName || 'Not entered'}
                            </span>
                            <span className="text-[11px] text-[#7A7369] truncate block">
                              {[formData.specifications.composition, formData.specifications.widthOrSize, formData.specifications.gsmOrWeight].filter(Boolean).join(' • ') || 'Standard spec'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleJumpToStep(2)}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-[#82553E] hover:underline cursor-pointer shrink-0"
                          >
                            <Pencil className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                        </div>

                        {/* Section 3: Images */}
                        <div className="flex items-start justify-between p-2.5 rounded-lg bg-white border border-[#EBE4D8]">
                          <div>
                            <span className="text-[10px] uppercase font-mono text-[#8A847C] block">Reference Images</span>
                            <span className="font-bold text-[#181715]">
                              {uploadedFiles.length > 0 ? `${uploadedFiles.length} file(s) attached` : 'No images attached'}
                            </span>
                            {formData.hasPhysicalSample && (
                              <span className="text-[11px] text-[#82553E] block">✓ Courier swatch ready</span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleJumpToStep(3)}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-[#82553E] hover:underline cursor-pointer"
                          >
                            <Pencil className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                        </div>

                        {/* Section 4: Quantity */}
                        <div className="flex items-start justify-between p-2.5 rounded-lg bg-white border border-[#EBE4D8]">
                          <div>
                            <span className="text-[10px] uppercase font-mono text-[#8A847C] block">Quantity &amp; Scope</span>
                            <span className="font-bold text-[#181715]">
                              {isQuantityUndecided ? 'Not decided yet' : `${formData.quantity || '0'} ${formData.unit}`}
                            </span>
                            <span className="text-[11px] text-[#7A7369] block">{formData.targetTimeline}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleJumpToStep(4)}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-[#82553E] hover:underline cursor-pointer"
                          >
                            <Pencil className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons (Back & Continue / Submit) */}
            <div className="pt-6 border-t border-[#EAE3D6] flex items-center justify-between gap-3">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="inline-flex items-center gap-1.5 px-5 py-3 text-xs font-semibold uppercase tracking-wider bg-white border border-[#D5D0C6] text-[#4A4742] hover:text-[#181715] hover:bg-[#FAF9F6] rounded-full transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onExploreCatalogue}
                  className="inline-flex items-center gap-1.5 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#736F68] hover:text-[#181715] transition-colors cursor-pointer"
                >
                  <span>Return to Catalogue</span>
                </button>
              )}

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="inline-flex items-center gap-2 px-7 py-3 text-xs font-semibold uppercase tracking-wider bg-[#181715] text-white hover:bg-[#2C2925] rounded-full transition-all shadow-sm active:scale-[0.98] cursor-pointer ml-auto"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 text-xs font-semibold uppercase tracking-wider bg-[#82553E] hover:bg-[#6D432E] text-white rounded-full transition-all shadow-md active:scale-[0.98] cursor-pointer ml-auto"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Material Requirement</span>
                </button>
              )}
            </div>

          </form>
        </div>

        {/* Clean, Understated Footer Info */}
        <div className="text-center py-2 text-xs text-[#8A847C] space-y-1">
          <p className="font-medium text-[#5C564D]">
            Classic Fashions Material Procurement Desk • Boyampalayam, Tiruppur
          </p>
          <p className="text-[11px]">
            Direct B2B supply coordination for apparel brands, exporters, and manufacturing units.
          </p>
        </div>

      </div>
    </div>
  );
};
