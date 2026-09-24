import React, { useState, useEffect, useRef } from 'react';
import {
  MaterialRequestCategory,
  MaterialRequestData,
  MaterialRequestSubmission,
  Product,
} from '../types.ts';
import { businessConfig } from '../data/businessConfig.ts';
import {
  Layers,
  FileText,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Send,
  HelpCircle,
  Package,
  Phone,
  Mail,
  Building,
  MapPin,
  Check,
  AlertCircle,
  Sparkles,
  Scissors,
  Bookmark,
  Share2,
  RefreshCw,
  X,
} from 'lucide-react';

interface MaterialRequestFormProps {
  initialData?: Partial<MaterialRequestData>;
  similarProduct?: Product | null;
  onExploreCatalogue: () => void;
  onReachUs: () => void;
}

const CATEGORIES: {
  id: MaterialRequestCategory;
  name: string;
  subtitle: string;
  iconName: string;
  specHints: string[];
}[] = [
  {
    id: 'fabric',
    name: 'Fabrics',
    subtitle: 'Woven, Gada, Chambray, Dyed, Poplin, Drill, Fur',
    iconName: 'Layers',
    specHints: ['GSM / Weight', 'Width (e.g. 44", 58")', 'Composition (100% Cotton, Poly-Blend)', 'Weave & Finish'],
  },
  {
    id: 'lace',
    name: 'Garment Laces',
    subtitle: 'Embroidery, Cotton, Lycra, Ric Rac, Imported',
    iconName: 'Sparkles',
    specHints: ['Width (mm or inches)', 'Pattern description', 'Stretch or Rigid', 'Dyeable / Color'],
  },
  {
    id: 'denim',
    name: 'Denim Fabrics',
    subtitle: 'Rigid, Stretch, Cotton Poly Lycra, Raw, Washed',
    iconName: 'Package',
    specHints: ['Weight in Oz (e.g. 8oz, 12oz)', 'Indigo / Black / Sulphur', 'Stretch percentage', 'Weave twill'],
  },
  {
    id: 'mesh',
    name: 'Mesh & Net',
    subtitle: 'Poly Mesh, Lycra Mesh, Air Mesh, Honeycomb',
    iconName: 'Layers',
    specHints: ['Hole gauge / structure', 'GSM', 'Width', 'Elasticity'],
  },
  {
    id: 'accessories',
    name: 'Garment Accessories',
    subtitle: 'Brand Tags, Custom Buttons, Tapes, Labels',
    iconName: 'Bookmark',
    specHints: ['Item type', 'Dimensions / Ligne', 'Material (Metal, Plastic, Fabric)', 'Branding specifications'],
  },
  {
    id: 'processing',
    name: 'Processing & Cutting',
    subtitle: 'Edge Cutting / Scalping, Slitting, Custom Prep',
    iconName: 'Scissors',
    specHints: ['Base fabric supplied', 'Scallop / cut pattern', 'Output width', 'Volume / meterage'],
  },
  {
    id: 'other',
    name: 'Other Specialized Material',
    subtitle: 'Custom developed or unclassified textile requirement',
    iconName: 'HelpCircle',
    specHints: ['General description', 'Intended garment type', 'Target parameters'],
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
  unit: 'Meters',
  purpose: 'Bulk Production',
  targetTimeline: 'Within 2-3 weeks',
  testingRequirements: '',
  contactName: '',
  companyName: '',
  phone: '',
  email: '',
  cityState: 'Tiruppur, Tamil Nadu',
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
  const [formData, setFormData] = useState<MaterialRequestData>(() => {
    return {
      ...INITIAL_REQUEST,
      ...initialData,
      category: (initialData?.category as MaterialRequestCategory) || (similarProduct?.category === 'laces' ? 'lace' : similarProduct?.category === 'denim' ? 'denim' : similarProduct?.category === 'mesh' ? 'mesh' : similarProduct?.category === 'accessories' ? 'accessories' : similarProduct?.category === 'processing' ? 'processing' : 'fabric'),
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

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [submission, setSubmission] = useState<MaterialRequestSubmission | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // If similarProduct changed, update state
  useEffect(() => {
    if (similarProduct) {
      setFormData((prev) => ({
        ...prev,
        materialName: `Alternative for ${similarProduct.name} (${similarProduct.productCode})`,
        similarToProductCode: similarProduct.productCode,
        similarToProductName: similarProduct.name,
        category: (similarProduct.category === 'laces' ? 'lace' : similarProduct.category === 'denim' ? 'denim' : similarProduct.category === 'mesh' ? 'mesh' : similarProduct.category === 'accessories' ? 'accessories' : similarProduct.category === 'processing' ? 'processing' : 'fabric'),
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

  // Handle local image upload preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('File size exceeds 8MB. Please select a smaller photo or spec sheet.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreviewUrl(result);
        setFormData((prev) => ({
          ...prev,
          referenceImage: {
            name: file.name,
            dataUrl: result,
            sizeKb: Math.round(file.size / 1024),
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreviewUrl(null);
    setFormData((prev) => ({
      ...prev,
      referenceImage: undefined,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Step validation
  const validateCurrentStep = (): boolean => {
    const errors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.category) {
        errors.category = 'Please select a material category.';
      }
    } else if (currentStep === 2) {
      if (!formData.materialName.trim()) {
        errors.materialName = 'Please provide a material or fabric name/description.';
      }
    } else if (currentStep === 4) {
      if (!formData.quantity.trim()) {
        errors.quantity = 'Please specify the approximate quantity required.';
      }
    } else if (currentStep === 5) {
      if (!formData.contactName.trim()) {
        errors.contactName = 'Please provide contact person name.';
      }
      if (!formData.phone.trim()) {
        errors.phone = 'Please provide contact phone number.';
      } else if (!/^[0-9+() -]{7,15}$/.test(formData.phone.trim())) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    const referenceCode = `CF-REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newSubmission: MaterialRequestSubmission = {
      ...formData,
      id: Date.now().toString(),
      referenceCode,
      submittedAt: Date.now(),
    };

    // Save submission to state and localStorage
    setSubmission(newSubmission);
    try {
      const existing = localStorage.getItem(STORAGE_SUBMISSIONS_KEY);
      const list = existing ? JSON.parse(existing) : [];
      localStorage.setItem(STORAGE_SUBMISSIONS_KEY, JSON.stringify([newSubmission, ...list]));
    } catch {
      // Ignore storage errors
    }

    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const generateWhatsAppMessage = (sub: MaterialRequestSubmission) => {
    const text = `*CLASSIC FASHIONS - SOURCING REQUEST*
*Ref Code:* ${sub.referenceCode}
*Material:* ${sub.materialName}
*Category:* ${sub.category.toUpperCase()}
*Quantity:* ${sub.quantity} ${sub.unit}
*Purpose:* ${sub.purpose}
${sub.specifications.composition ? `*Composition:* ${sub.specifications.composition}\n` : ''}${sub.specifications.widthOrSize ? `*Width/Size:* ${sub.specifications.widthOrSize}\n` : ''}${sub.specifications.gsmOrWeight ? `*GSM/Weight:* ${sub.specifications.gsmOrWeight}\n` : ''}${sub.specifications.colourPreference ? `*Colour:* ${sub.specifications.colourPreference}\n` : ''}
*Contact:* ${sub.contactName} (${sub.companyName || 'Buyer'})
*Location:* ${sub.cityState}
*Phone:* ${sub.phone}

_Request submitted via Classic Fashions Digital Platform. Please review sourcing feasibility and advise quotation._`;

    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  // --------------------------------------------------------------------------
  // SUCCESS / CONFIRMATION SCREEN
  // --------------------------------------------------------------------------
  if (submission) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white border border-[#D5D0C6] rounded-xl shadow-lg p-6 sm:p-10 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8E6E0] gap-4">
            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#82553E] block mb-1">
                Sourcing Request Received
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181715]">
                Requirement Submitted for Review
              </h1>
            </div>
            <div className="bg-[#FAF7F2] border border-[#E3DCD1] p-3 rounded text-left sm:text-right">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#7A746B] block">
                Reference Code
              </span>
              <span className="font-mono text-lg font-bold text-[#181715]">
                {submission.referenceCode}
              </span>
            </div>
          </div>

          {/* Acknowledgement Notice */}
          <div className="p-4 bg-[#F7F5F0] rounded-lg border border-[#E5E0D5] flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-[#82553E] shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-[#484540] leading-relaxed space-y-1">
              <p className="font-semibold text-[#181715]">
                Thank you, {submission.contactName}. Our Boyampalayam wholesale desk has recorded your request.
              </p>
              <p>
                Our team will review your specifications, check mill availability, yarn count, and production capacity. A representative will contact you at{' '}
                <strong className="font-mono text-[#181715]">{submission.phone}</strong> regarding feasibility and wholesale commercial terms.
              </p>
              <p className="text-[11px] text-[#78736B] pt-1">
                * Note: Feasibility and turnaround depend on yarn sourcing, weaving/knitting lead time, and current mill runs.
              </p>
            </div>
          </div>

          {/* Summary Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs bg-[#FAF9F6] p-6 rounded-lg border border-[#E8E6E0]">
            <div className="space-y-3">
              <h4 className="font-serif text-sm font-bold text-[#181715] border-b border-[#E3DCD1] pb-1.5">
                Material Specifications
              </h4>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#736F68]">Requested Item:</span>
                  <span className="font-semibold text-[#181715] text-right">{submission.materialName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#736F68]">Category:</span>
                  <span className="font-semibold text-[#181715] uppercase font-mono">{submission.category}</span>
                </div>
                {submission.specifications.composition && (
                  <div className="flex justify-between">
                    <span className="text-[#736F68]">Composition:</span>
                    <span className="font-semibold text-[#181715] text-right">{submission.specifications.composition}</span>
                  </div>
                )}
                {submission.specifications.widthOrSize && (
                  <div className="flex justify-between">
                    <span className="text-[#736F68]">Width / Size:</span>
                    <span className="font-semibold text-[#181715]">{submission.specifications.widthOrSize}</span>
                  </div>
                )}
                {submission.specifications.gsmOrWeight && (
                  <div className="flex justify-between">
                    <span className="text-[#736F68]">GSM / Weight:</span>
                    <span className="font-semibold text-[#181715]">{submission.specifications.gsmOrWeight}</span>
                  </div>
                )}
                {submission.specifications.colourPreference && (
                  <div className="flex justify-between">
                    <span className="text-[#736F68]">Shade / Colour:</span>
                    <span className="font-semibold text-[#181715]">{submission.specifications.colourPreference}</span>
                  </div>
                )}
                {submission.hasPhysicalSample && (
                  <div className="flex justify-between text-[#82553E] font-medium pt-1 border-t border-[#ECE8E0]">
                    <span>Physical Swatch:</span>
                    <span>Ready to Courier</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-serif text-sm font-bold text-[#181715] border-b border-[#E3DCD1] pb-1.5">
                Commercial &amp; Buyer Details
              </h4>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#736F68]">Quantity Required:</span>
                  <span className="font-semibold text-[#181715] font-mono">
                    {submission.quantity} {submission.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#736F68]">Application Purpose:</span>
                  <span className="font-semibold text-[#181715]">{submission.purpose}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#736F68]">Target Schedule:</span>
                  <span className="font-semibold text-[#181715]">{submission.targetTimeline}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#ECE8E0]">
                  <span className="text-[#736F68]">Contact Unit:</span>
                  <span className="font-semibold text-[#181715] text-right">
                    {submission.companyName || submission.contactName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#736F68]">Location:</span>
                  <span className="font-semibold text-[#181715]">{submission.cityState}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reference Image Preview if present */}
          {submission.referenceImage?.dataUrl && (
            <div className="p-4 bg-[#FAF9F6] rounded-lg border border-[#E8E6E0] space-y-2">
              <span className="text-xs font-semibold text-[#736F68] uppercase tracking-wider block">
                Attached Swatch Reference: {submission.referenceImage.name}
              </span>
              <img
                src={submission.referenceImage.dataUrl}
                alt="Reference Swatch"
                className="max-h-48 rounded border border-[#D5D0C6] object-cover"
              />
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <a
              href={generateWhatsAppMessage(submission)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#181715] text-white hover:bg-[#302D29] text-xs font-semibold uppercase tracking-wider rounded transition-colors shadow-sm"
            >
              <Share2 className="w-4 h-4 text-[#E5D7CC]" />
              <span>Forward Request to WhatsApp</span>
            </a>

            <button
              onClick={() => {
                setSubmission(null);
                setCurrentStep(1);
                setFormData(INITIAL_REQUEST);
                setImagePreviewUrl(null);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white border border-[#D5D0C6] text-[#181715] hover:bg-[#FAF9F6] text-xs font-semibold uppercase tracking-wider rounded transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Submit Another Request</span>
            </button>

            <button
              onClick={onExploreCatalogue}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#82553E] text-white hover:bg-[#6D432E] text-xs font-semibold uppercase tracking-wider rounded transition-colors ml-auto"
            >
              <span>Return to Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // MAIN MULTI-STEP BUILDER
  // --------------------------------------------------------------------------
  return (
    <div className="bg-[#FBFBFA] min-h-screen py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Hero & Process Banner */}
        <div className="text-center space-y-4">
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.25em] text-[#82553E] bg-[#EFE8DF] px-3.5 py-1.5 rounded-sm border border-[#DFD6CB] inline-block">
            B2B MATERIAL SOURCING
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181715] tracking-tight">
            Can't Find the Right Material?
          </h1>
          <p className="font-serif text-lg sm:text-xl text-[#6D432E] font-medium">
            Tell Us What You Need.
          </p>
          <p className="text-sm text-[#585550] max-w-2xl mx-auto leading-relaxed">
            Share your specific fabric, garment lace, denim, mesh, or accessory requirement. Our Boyampalayam textile team reviews custom specs, checks mill availability, and reaches out regarding feasibility and wholesale quotation.
          </p>
        </div>

        {/* 4-Step Process Explanation Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-5 rounded-xl border border-[#E8E6E0] shadow-xs">
          <div className="p-3 bg-[#FAF9F6] rounded border border-[#EFECE6] space-y-1">
            <span className="font-mono text-xs font-bold text-[#82553E] block">01</span>
            <h4 className="text-xs font-semibold text-[#181715]">Tell Us Your Requirement</h4>
            <p className="text-[11px] text-[#736F68] leading-tight">Specify weave, width, GSM, and sample details.</p>
          </div>
          <div className="p-3 bg-[#FAF9F6] rounded border border-[#EFECE6] space-y-1">
            <span className="font-mono text-xs font-bold text-[#82553E] block">02</span>
            <h4 className="text-xs font-semibold text-[#181715]">Our Team Reviews It</h4>
            <p className="text-[11px] text-[#736F68] leading-tight">Technical review against Tiruppur mill capabilities.</p>
          </div>
          <div className="p-3 bg-[#FAF9F6] rounded border border-[#EFECE6] space-y-1">
            <span className="font-mono text-xs font-bold text-[#82553E] block">03</span>
            <h4 className="text-xs font-semibold text-[#181715]">Check Availability</h4>
            <p className="text-[11px] text-[#736F68] leading-tight">Verify yarn supply, production slots &amp; MOQ.</p>
          </div>
          <div className="p-3 bg-[#FAF9F6] rounded border border-[#EFECE6] space-y-1">
            <span className="font-mono text-xs font-bold text-[#82553E] block">04</span>
            <h4 className="text-xs font-semibold text-[#181715]">Quotation &amp; Contact</h4>
            <p className="text-[11px] text-[#736F68] leading-tight">We contact you directly with quotation details.</p>
          </div>
        </div>

        {/* Sourcing Context Banner if coming from a similar product */}
        {similarProduct && (
          <div className="bg-[#F5F2EB] border border-[#DDD6C8] rounded-lg p-4 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#82553E] block">
                Sourcing Alternative For
              </span>
              <p className="text-xs font-semibold text-[#181715]">
                {similarProduct.name} <span className="font-mono text-[#736F68]">({similarProduct.productCode})</span>
              </p>
              <p className="text-[11px] text-[#585550]">
                We have pre-filled matching categories and baseline specifications for this inquiry.
              </p>
            </div>
            <button
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  similarToProductCode: undefined,
                  similarToProductName: undefined,
                }));
              }}
              className="text-xs text-[#82553E] hover:text-[#181715] underline shrink-0 font-medium"
            >
              Clear link
            </button>
          </div>
        )}

        {/* Main Card with Form Steps */}
        <div className="bg-white rounded-xl border border-[#D5D0C6] shadow-sm overflow-hidden">
          {/* Step Progress Tracker */}
          <div className="border-b border-[#E8E6E0] bg-[#FAF9F6] px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between text-xs">
              {[
                { step: 1, label: 'Category' },
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
                        setCurrentStep(s.step);
                      }
                    }}
                    className={`flex items-center gap-2 group transition-opacity ${
                      !isCompleted && !isCurrent ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded flex items-center justify-center text-xs font-mono font-bold transition-colors ${
                        isCurrent
                          ? 'bg-[#181715] text-white'
                          : isCompleted
                          ? 'bg-[#82553E] text-white'
                          : 'bg-[#EAE6DF] text-[#736F68]'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : s.step}
                    </span>
                    <span
                      className={`hidden sm:inline font-medium uppercase tracking-wider text-[11px] ${
                        isCurrent ? 'text-[#181715] font-bold' : isCompleted ? 'text-[#82553E]' : 'text-[#736F68]'
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* -------------------------------------------------------------- */}
            {/* STEP 1: CATEGORY SELECTION */}
            {/* -------------------------------------------------------------- */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#181715]">
                    Step 1: Select Material Category
                  </h3>
                  <p className="text-xs text-[#736F68] mt-1">
                    Select the garment material group you need sourced or manufactured.
                  </p>
                </div>

                {validationErrors.category && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
                    {validationErrors.category}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {CATEGORIES.map((cat) => {
                    const isSelected = formData.category === cat.id;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, category: cat.id }));
                          setValidationErrors({});
                        }}
                        className={`p-4 rounded-lg border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#181715] bg-[#FAF8F5] shadow-xs ring-1 ring-[#181715]'
                            : 'border-[#E0DBD0] bg-white hover:border-[#181715] hover:bg-[#FAF9F6]'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="font-serif text-base font-bold text-[#181715]">{cat.name}</h4>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-[#181715] bg-[#181715]' : 'border-[#C4B7AA]'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </span>
                        </div>
                        <p className="text-xs text-[#585550] mt-1 leading-relaxed">{cat.subtitle}</p>

                        <div className="mt-3 pt-2.5 border-t border-[#EFECE6] flex flex-wrap gap-1">
                          {cat.specHints.slice(0, 3).map((hint, i) => (
                            <span
                              key={i}
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
            {/* STEP 2: DYNAMIC SPECIFICATIONS */}
            {/* -------------------------------------------------------------- */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#82553E] bg-[#F2ECE4] px-2 py-0.5 rounded font-semibold">
                      Category: {formData.category.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#181715]">
                    Step 2: Technical Specifications
                  </h3>
                  <p className="text-xs text-[#736F68] mt-1">
                    Provide as much technical detail as known. Approximate parameters are acceptable.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Primary Material Name */}
                  <div>
                    <label className="block text-xs font-semibold text-[#181715] uppercase tracking-wider mb-1">
                      Material Name / Brief Description <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 100% Combed Cotton Poplin, 25mm Heavy Cotton Eyelet Lace, 10oz Ring Denim..."
                      value={formData.materialName}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, materialName: e.target.value }))
                      }
                      className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF9F6] border rounded text-[#181715] focus:outline-none focus:border-[#181715] ${
                        validationErrors.materialName ? 'border-red-500 bg-red-50/20' : 'border-[#D5D0C6]'
                      }`}
                    />
                    {validationErrors.materialName && (
                      <span className="text-[11px] text-red-600 mt-1 block">
                        {validationErrors.materialName}
                      </span>
                    )}
                  </div>

                  {/* Grid of Dynamic Specific Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* 1. Variety / Subtype */}
                    <div>
                      <label className="block text-xs font-semibold text-[#736F68] uppercase tracking-wider mb-1">
                        Type / Weave Variety
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Plain Weave, Twill, Ric Rac, Cotton Lycra..."
                        value={formData.specifications.typeVariant || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            specifications: { ...prev.specifications, typeVariant: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#D5D0C6] rounded text-[#181715] focus:outline-none focus:border-[#181715]"
                      />
                    </div>

                    {/* 2. Composition / Yarn */}
                    <div>
                      <label className="block text-xs font-semibold text-[#736F68] uppercase tracking-wider mb-1">
                        Fiber / Composition Blend
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 100% Cotton, 80/20 Cotton-Poly, Lycra Elastane..."
                        value={formData.specifications.composition || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            specifications: { ...prev.specifications, composition: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#D5D0C6] rounded text-[#181715] focus:outline-none focus:border-[#181715]"
                      />
                    </div>

                    {/* 3. Width or Size */}
                    <div>
                      <label className="block text-xs font-semibold text-[#736F68] uppercase tracking-wider mb-1">
                        Width or Finished Size
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 44 inches, 58/60 inches, 18mm, 2-inch tape..."
                        value={formData.specifications.widthOrSize || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            specifications: { ...prev.specifications, widthOrSize: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#D5D0C6] rounded text-[#181715] focus:outline-none focus:border-[#181715]"
                      />
                    </div>

                    {/* 4. GSM / Weight in Oz */}
                    <div>
                      <label className="block text-xs font-semibold text-[#736F68] uppercase tracking-wider mb-1">
                        Weight (GSM or Oz)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 140 GSM, 180 GSM, 10.5 Oz, Heavy duty..."
                        value={formData.specifications.gsmOrWeight || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            specifications: { ...prev.specifications, gsmOrWeight: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#D5D0C6] rounded text-[#181715] focus:outline-none focus:border-[#181715]"
                      />
                    </div>

                    {/* 5. Colour / Shade */}
                    <div>
                      <label className="block text-xs font-semibold text-[#736F68] uppercase tracking-wider mb-1">
                        Colour / Shade Preference
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Raw Gada / RFD, Bleached White, Navy 19-4010, Black..."
                        value={formData.specifications.colourPreference || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            specifications: { ...prev.specifications, colourPreference: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#D5D0C6] rounded text-[#181715] focus:outline-none focus:border-[#181715]"
                      />
                    </div>

                    {/* 6. Elasticity / Stretch */}
                    <div>
                      <label className="block text-xs font-semibold text-[#736F68] uppercase tracking-wider mb-1">
                        Elasticity / Stretch
                      </label>
                      <select
                        value={formData.specifications.elasticity || 'Rigid / Non-Stretch'}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            specifications: { ...prev.specifications, elasticity: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#D5D0C6] rounded text-[#181715] focus:outline-none focus:border-[#181715]"
                      >
                        <option value="Rigid / Non-Stretch">Rigid / Non-Stretch</option>
                        <option value="2-Way Mechanical Stretch">2-Way Mechanical Stretch</option>
                        <option value="4-Way Lycra / Spandex Stretch">4-Way Lycra / Spandex Stretch</option>
                        <option value="Soft Rib Stretch">Soft Rib Stretch</option>
                      </select>
                    </div>
                  </div>

                  {/* Additional Technical Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-[#736F68] uppercase tracking-wider mb-1">
                      Pattern Details or Finishing Requirements
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Mercerized finish, enzyme washed, peach finish, continuous scallop edge, heat-set mesh..."
                      value={formData.specifications.customDetails || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          specifications: { ...prev.specifications, customDetails: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#D5D0C6] rounded text-[#181715] focus:outline-none focus:border-[#181715]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* STEP 3: REFERENCE SWATCH / IMAGE */}
            {/* -------------------------------------------------------------- */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#181715]">
                    Step 3: Reference Swatch or Technical Image
                  </h3>
                  <p className="text-xs text-[#736F68] mt-1">
                    Upload a photo of your required material swatch, technical spec sheet, or advise if you have a physical piece to courier.
                  </p>
                </div>

                {/* Upload Area */}
                <div className="space-y-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#D5D0C6] hover:border-[#181715] bg-[#FAF9F6] rounded-xl p-6 text-center cursor-pointer transition-colors"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/png, image/jpeg, image/webp"
                      className="hidden"
                    />

                    {imagePreviewUrl ? (
                      <div className="space-y-3">
                        <img
                          src={imagePreviewUrl}
                          alt="Swatch Preview"
                          className="max-h-48 mx-auto rounded border border-[#D5D0C6] object-cover"
                        />
                        <div className="flex items-center justify-center gap-3">
                          <span className="text-xs font-mono text-[#585550]">
                            {formData.referenceImage?.name} ({formData.referenceImage?.sizeKb} KB)
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage();
                            }}
                            className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Remove Image</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 py-4">
                        <div className="w-12 h-12 bg-white rounded-full border border-[#D5D0C6] flex items-center justify-center mx-auto text-[#82553E]">
                          <Upload className="w-5 h-5" />
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-[#181715]">
                          Click to upload sample image or drag &amp; drop
                        </p>
                        <p className="text-[11px] text-[#78736B]">
                          Supports JPEG, PNG or WebP format up to 8MB.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Physical Sample Checkbox & Courier note */}
                  <div className="p-4 bg-[#F7F5F0] rounded-lg border border-[#E5E0D5] space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.hasPhysicalSample}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, hasPhysicalSample: e.target.checked }))
                        }
                        className="mt-1 w-4 h-4 text-[#82553E] border-[#C4B7AA] rounded focus:ring-0 cursor-pointer"
                      />
                      <div>
                        <span className="text-xs font-semibold text-[#181715] block">
                          I have a physical cutting/swatch sample ready to courier to Tiruppur
                        </span>
                        <span className="text-[11px] text-[#736F68] block mt-0.5">
                          Sending a physical swatch to our Boyampalayam unit allows exact yarn count, GSM, and weave inspection for accurate quotation.
                        </span>
                      </div>
                    </label>

                    {formData.hasPhysicalSample && (
                      <div className="pt-2 border-t border-[#EAE5DC]">
                        <label className="block text-[11px] font-semibold text-[#736F68] uppercase mb-1">
                          Sample Details / Tracking Info
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Swatch size 10x10cm, courier via DTDC/Professional..."
                          value={formData.sampleCourierNotes || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, sampleCourierNotes: e.target.value }))
                          }
                          className="w-full px-3 py-2 text-xs bg-white border border-[#D5D0C6] rounded text-[#181715] focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* STEP 4: QUANTITY & COMMERCIALS */}
            {/* -------------------------------------------------------------- */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#181715]">
                    Step 4: Quantity &amp; Commercial Scope
                  </h3>
                  <p className="text-xs text-[#736F68] mt-1">
                    State the volume needed so we can calculate realistic mill run economics and pricing tiers.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Quantity and Units */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-8">
                      <label className="block text-xs font-semibold text-[#181715] uppercase tracking-wider mb-1">
                        Estimated Required Quantity <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 500, 2000, 50, 10..."
                        value={formData.quantity}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, quantity: e.target.value }))
                        }
                        className={`w-full px-3 py-2.5 text-xs sm:text-sm bg-[#FAF9F6] border rounded text-[#181715] focus:outline-none focus:border-[#181715] ${
                          validationErrors.quantity ? 'border-red-500 bg-red-50/20' : 'border-[#D5D0C6]'
                        }`}
                      />
                      {validationErrors.quantity && (
                        <span className="text-[11px] text-red-600 mt-1 block">
                          {validationErrors.quantity}
                        </span>
                      )}
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block text-xs font-semibold text-[#736F68] uppercase tracking-wider mb-1">
                        Unit of Measure
                      </label>
                      <select
                        value={formData.unit}
                        onChange={(e) => setFormData((prev) => ({ ...prev, unit: e.target.value }))}
                        className="w-full px-3 py-2.5 text-xs sm:text-sm bg-[#FAF9F6] border border-[#D5D0C6] rounded text-[#181715] focus:outline-none focus:border-[#181715]"
                      >
                        <option value="Meters">Meters</option>
                        <option value="Rolls / Bolts">Rolls / Bolts</option>
                        <option value="Kilograms (Kg)">Kilograms (Kg)</option>
                        <option value="Pieces / Units">Pieces / Units</option>
                        <option value="Gross (144 pcs)">Gross (144 pcs)</option>
                        <option value="Thousand Units (k)">Thousand Units (k)</option>
                      </select>
                    </div>
                  </div>

                  {/* Purpose */}
                  <div>
                    <label className="block text-xs font-semibold text-[#736F68] uppercase tracking-wider mb-1">
                      Intended Application / Order Type
                    </label>
                    <select
                      value={formData.purpose}
                      onChange={(e) => setFormData((prev) => ({ ...prev, purpose: e.target.value }))}
                      className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#D5D0C6] rounded text-[#181715] focus:outline-none focus:border-[#181715]"
                    >
                      <option value="Bulk Production">Bulk Garment Production</option>
                      <option value="Sampling / Prototyping">Sampling / Fit Sample Development</option>
                      <option value="Export Garmenting Order">Export Garmenting Order</option>
                      <option value="Domestic Retail Brand">Domestic Retail Brand Manufacturing</option>
                      <option value="Dealer / Wholesale Stocking">Textile Dealer / Wholesale Stocking</option>
                    </select>
                  </div>

                  {/* Target Timeline */}
                  <div>
                    <label className="block text-xs font-semibold text-[#736F68] uppercase tracking-wider mb-1">
                      Target Production Timeline
                    </label>
                    <select
                      value={formData.targetTimeline}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, targetTimeline: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#D5D0C6] rounded text-[#181715] focus:outline-none focus:border-[#181715]"
                    >
                      <option value="Within 1-2 weeks">Immediate (Within 1-2 weeks)</option>
                      <option value="Within 2-3 weeks">Standard Production (Within 2-3 weeks)</option>
                      <option value="Within 1 month">Upcoming Schedule (Within 1 month)</option>
                      <option value="Flexible / Planning Stage">Flexible / Sourcing Feasibility Stage</option>
                    </select>
                    <p className="text-[11px] text-[#78736B] mt-1">
                      * Timelines subject to yarn availability and weaving queue. No guaranteed dispatch time is promised prior to sample review.
                    </p>
                  </div>

                  {/* Compliance / Testing */}
                  <div>
                    <label className="block text-xs font-semibold text-[#736F68] uppercase tracking-wider mb-1">
                      Quality or Testing Standards (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Color fastness to washing Grade 4, Shrinkage under 4%, AZO-free dyes..."
                      value={formData.testingRequirements || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, testingRequirements: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#D5D0C6] rounded text-[#181715] focus:outline-none focus:border-[#181715]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* STEP 5: CONTACT INFORMATION */}
            {/* -------------------------------------------------------------- */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#181715]">
                    Step 5: Buyer Details &amp; Mill Review
                  </h3>
                  <p className="text-xs text-[#736F68] mt-1">
                    Provide your contact information so our wholesale sales desk in Boyampalayam can reach you with quotation details.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#181715] uppercase tracking-wider mb-1">
                        Contact Person Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Your full name"
                        value={formData.contactName}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, contactName: e.target.value }))
                        }
                        className={`w-full px-3 py-2 text-xs bg-[#FAF9F6] border rounded text-[#181715] focus:outline-none focus:border-[#181715] ${
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
                      <label className="block text-xs font-semibold text-[#736F68] uppercase tracking-wider mb-1">
                        Company / Garment Unit Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Apex Apparels Tiruppur, Fashion Studio..."
                        value={formData.companyName}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, companyName: e.target.value }))
                        }
                        className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#D5D0C6] rounded text-[#181715] focus:outline-none focus:border-[#181715]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#181715] uppercase tracking-wider mb-1">
                        Phone / WhatsApp Mobile <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. +91 98765 43210"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, phone: e.target.value }))
                        }
                        className={`w-full px-3 py-2 text-xs bg-[#FAF9F6] border rounded text-[#181715] focus:outline-none focus:border-[#181715] ${
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
                      <label className="block text-xs font-semibold text-[#736F68] uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="buyer@garmentunit.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, email: e.target.value }))
                        }
                        className={`w-full px-3 py-2 text-xs bg-[#FAF9F6] border rounded text-[#181715] focus:outline-none focus:border-[#181715] ${
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

                  <div>
                    <label className="block text-xs font-semibold text-[#736F68] uppercase tracking-wider mb-1">
                      City / State / Delivery Destination
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tiruppur, Coimbatore, Bengaluru, Surat, Mumbai..."
                      value={formData.cityState}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, cityState: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#D5D0C6] rounded text-[#181715] focus:outline-none focus:border-[#181715]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#736F68] uppercase tracking-wider mb-1">
                      Additional Comments / Sourcing Instructions
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Mention any specific dyeing requirements, urgent timelines, or sample dispatch questions..."
                      value={formData.additionalNotes || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, additionalNotes: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#D5D0C6] rounded text-[#181715] focus:outline-none focus:border-[#181715]"
                    />
                  </div>

                  {/* Summary of request prior to submission */}
                  <div className="p-4 bg-[#FAF9F6] rounded-lg border border-[#E8E6E0] space-y-1.5 text-xs text-[#585550]">
                    <span className="font-semibold text-[#181715] block">
                      Request Summary:
                    </span>
                    <p>
                      <strong>Material:</strong> {formData.materialName || 'Not specified'} ({formData.category.toUpperCase()})
                    </p>
                    <p>
                      <strong>Volume:</strong> {formData.quantity || '0'} {formData.unit} • {formData.purpose}
                    </p>
                    {formData.hasPhysicalSample && (
                      <p className="text-[#82553E] font-medium">
                        ✓ Physical swatch ready to courier to Classic Fashions, Tiruppur.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step Navigation Bar */}
            <div className="pt-6 border-t border-[#E8E6E0] flex items-center justify-between gap-3">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider bg-white border border-[#D5D0C6] text-[#585550] hover:text-[#181715] hover:bg-[#FAF9F6] rounded transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onExploreCatalogue}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#736F68] hover:text-[#181715] transition-colors"
                >
                  <span>Return to Catalogue</span>
                </button>
              )}

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#181715] text-white hover:bg-[#302D29] rounded transition-colors shadow-sm"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-7 py-3 text-xs font-semibold uppercase tracking-wider bg-[#82553E] text-white hover:bg-[#6D432E] rounded transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Sourcing Requirement</span>
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-[#F7F5F0] rounded-lg border border-[#E8E6E0] text-center text-xs text-[#736F68] leading-relaxed">
          <p>
            <strong>Classic Fashions Material Sourcing Desk</strong> • Boyampalayam, Tiruppur.
          </p>
          <p className="text-[11px] text-[#8C877E] mt-0.5">
            Every submission is reviewed by our sourcing team to identify suitable manufacturing and supply sources matching your exact requirements.
          </p>
        </div>
      </div>
    </div>
  );
};
