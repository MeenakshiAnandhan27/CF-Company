import React, { useState, useEffect } from 'react';
import { businessConfig } from '../data/businessConfig.ts';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Copy,
  RotateCcw,
  Send,
  Edit3,
  Layers,
  Sparkles,
  Package,
  Sliders,
  HelpCircle,
  ShieldCheck,
  Award,
  Check,
} from 'lucide-react';

interface ReachUsViewProps {
  onExploreCatalogue?: () => void;
  initialMaterialContext?: string;
}

// Verified Business Contact Information
const VERIFIED_PHONE = '+91 88264 15868';
const VERIFIED_PHONE_RAW = '918826415868';
const VERIFIED_EMAIL = 'material@classicfashions.com';
const STORAGE_ENQUIRIES_KEY = 'cf_reach_us_enquiries_v1';

// Five Enquiry Categories matching reference structure
type EnquiryCategoryKey =
  | 'fabric'
  | 'accessories'
  | 'bulk'
  | 'custom'
  | 'other';

interface EnquiryCategory {
  key: EnquiryCategoryKey;
  label: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  promptHeadline: string;
  placeholder: string;
}

const ENQUIRY_CATEGORIES: EnquiryCategory[] = [
  {
    key: 'fabric',
    label: 'Fabric Request',
    tagline: 'Woven, knits, denims & custom weaves',
    icon: Layers,
    promptHeadline: 'What fabric specifications, target GSM, or meterage do you require?',
    placeholder: 'e.g. Sourcing 2,500 metres of 240 GSM combed cotton twill with bio-wash for an export order...',
  },
  {
    key: 'accessories',
    label: 'Accessories Inquiry',
    tagline: 'Laces, buttons, tags, tapes & trims',
    icon: Sparkles,
    promptHeadline: 'Which garment trims or accessories do you wish to source?',
    placeholder: 'e.g. Custom dyed cotton laces, natural corozo buttons, and woven neck labels with gold lurex...',
  },
  {
    key: 'bulk',
    label: 'Bulk Order',
    tagline: 'Export volume sourcing & mill production',
    icon: Package,
    promptHeadline: 'Tell us about your production volume, delivery deadlines, and destination',
    placeholder: 'e.g. Bulk mill booking for 15,000 meters single jersey knit with reactive dyeing scheduled for next quarter...',
  },
  {
    key: 'custom',
    label: 'Custom Development',
    tagline: 'Specialized dyes, washes & GSM specs',
    icon: Sliders,
    promptHeadline: 'Describe the unique material composition, finish, or lab-dip requirement',
    placeholder: 'e.g. Need lab-dip Pantone matching, antimicrobial coating, and custom peach finish on french terry...',
  },
  {
    key: 'other',
    label: 'Other Enquiry',
    tagline: 'General queries & showroom consultation',
    icon: HelpCircle,
    promptHeadline: 'How can our sourcing team assist you today?',
    placeholder: 'e.g. We would like to schedule a visit to your Boyampalayam office to inspect swatch catalogues...',
  },
];

export const ReachUsView: React.FC<ReachUsViewProps> = ({
  initialMaterialContext,
}) => {
  const getInitialContext = () => {
    if (initialMaterialContext) return initialMaterialContext;
    try {
      return sessionStorage.getItem('cf_reach_us_material_context') || '';
    } catch {
      return '';
    }
  };

  const storedContext = getInitialContext();

  // Enquiry Category Selection
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<EnquiryCategoryKey>(() => {
    if (storedContext.toLowerCase().includes('lace') || storedContext.toLowerCase().includes('accessor')) {
      return 'accessories';
    }
    return 'fabric';
  });
  const [isEnquiryExpanded, setIsEnquiryExpanded] = useState<boolean>(Boolean(storedContext));

  // Progressive Enquiry Stepper: 1 = Requirement/Message, 2 = Contact Details, 3 = Review & Send
  const [stepperStep, setStepperStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [formData, setFormData] = useState({
    message: storedContext
      ? `Inquiry regarding ${storedContext}: We would like to explore available specifications, custom development options, and minimum order quantities.`
      : '',
    name: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    if (initialMaterialContext) {
      setFormData((prev) => ({
        ...prev,
        message: `Inquiry regarding ${initialMaterialContext}: We would like to explore available specifications, custom development options, and minimum order quantities.`,
      }));
      setIsEnquiryExpanded(true);
      if (initialMaterialContext.toLowerCase().includes('lace') || initialMaterialContext.toLowerCase().includes('accessor')) {
        setSelectedCategoryKey('accessories');
      }
    }
  }, [initialMaterialContext]);

  // UI Feedback States
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceCode, setReferenceCode] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    '5/1475, 5th Street, Palanisamy Nagar, Boyampalayam, Tiruppur, Tamil Nadu 641602'
  )}`;

  const currentCategory =
    ENQUIRY_CATEGORIES.find((cat) => cat.key === selectedCategoryKey) || ENQUIRY_CATEGORIES[0];

  // Quick Copy
  const handleCopy = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard?.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    if (!formData.message.trim() || formData.message.trim().length < 4) {
      errors.message = 'Please provide a brief description of your requirement.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Please enter your name.';
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 7) {
      errors.phone = 'Please provide a valid phone or WhatsApp number.';
    }
    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      errors.email = 'Please provide a valid email format, or leave it blank.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form Submit Handler
  const handleSubmitEnquiry = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateStep1() || !validateStep2()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const timestamp = Date.now();
      const code = `CF-ENQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const record = {
        id: `reach-us-${timestamp}`,
        referenceCode: code,
        category: currentCategory.label,
        message: formData.message.trim(),
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        submittedAt: timestamp,
      };

      try {
        const existing = localStorage.getItem(STORAGE_ENQUIRIES_KEY);
        const list = existing ? JSON.parse(existing) : [];
        list.unshift(record);
        localStorage.setItem(STORAGE_ENQUIRIES_KEY, JSON.stringify(list));
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }

      setReferenceCode(code);
      setIsSubmitted(true);
    } catch {
      setFieldErrors({ form: 'Unable to submit enquiry. Please call or WhatsApp us directly.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset Enquiry
  const handleReset = () => {
    setIsSubmitted(false);
    setIsEnquiryExpanded(false);
    setStepperStep(1);
    setFormData({ message: '', name: '', phone: '', email: '' });
    setFieldErrors({});
    setReferenceCode('');
  };

  // Pre-formatted WhatsApp URL
  const getWhatsAppUrl = (customMsg?: string) => {
    if (customMsg) {
      return `https://wa.me/${VERIFIED_PHONE_RAW}?text=${encodeURIComponent(customMsg)}`;
    }
    const text =
      `*CLASSIC FASHIONS — REACH US ENQUIRY*\n` +
      `• *Reference:* ${referenceCode || 'Direct Sourcing Query'}\n` +
      `• *Category:* ${currentCategory.label}\n` +
      `• *Name:* ${formData.name.trim() || 'Buyer'}\n` +
      `• *Phone:* ${formData.phone.trim() || 'Direct'}\n` +
      (formData.email.trim() ? `• *Email:* ${formData.email.trim()}\n` : '') +
      `• *Message:* ${formData.message.trim() || 'Please get in touch with me.'}\n`;

    return `https://wa.me/${VERIFIED_PHONE_RAW}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="bg-[#FAF7F2] text-[#181715] min-h-screen relative overflow-hidden font-sans selection:bg-[#B8934A]/20 selection:text-[#181715]">
      {/* ========================================================================= */}
      {/* BACKGROUND DECORATIVE ELEMENTS — Fine Gold Arcs & Subtle Textile Peek     */}
      {/* ========================================================================= */}
      {/* Top Left Fine Gold Curved Line */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 -left-12 w-96 h-96 opacity-25"
        viewBox="0 0 400 400"
        fill="none"
      >
        <circle cx="100" cy="100" r="240" stroke="#B8934A" strokeWidth="1" strokeDasharray="3 4" />
        <circle cx="100" cy="100" r="180" stroke="#B8934A" strokeWidth="0.8" />
      </svg>

      {/* Bottom Right Fine Gold Arc */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -right-16 w-[420px] h-[420px] opacity-25"
        viewBox="0 0 400 400"
        fill="none"
      >
        <circle cx="300" cy="300" r="260" stroke="#B8934A" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="300" cy="300" r="190" stroke="#B8934A" strokeWidth="0.8" />
      </svg>

      {/* Right Edge Cropped Subtle Textile Image Peek */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-48 -right-20 w-80 h-[520px] hidden xl:block opacity-25 rounded-l-3xl overflow-hidden border-l border-y border-[#B8934A]/30 shadow-2xl"
      >
        <img
          src="/assets/materials/fabrics.jpg"
          alt=""
          className="w-full h-full object-cover grayscale contrast-125 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2] via-transparent to-transparent" />
      </div>

      {/* ========================================================================= */}
      {/* HERO SECTION — Consistent Website Typography & Single-Line Diamond Motif  */}
      {/* ========================================================================= */}
      <section className="pt-20 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 text-center px-4 sm:px-6 relative z-10">
        <div className="max-w-2xl mx-auto space-y-3.5">
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.22em] text-[#B8934A] font-semibold block">
            REACH US
          </span>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#142E20] leading-[1.12]">
            Let’s Get <span className="italic font-serif text-[#B8934A]">in</span> Touch
          </h1>

          {/* Subtle Single-Line Diamond Motif Divider */}
          <div className="relative flex items-center justify-center w-full max-w-xs mx-auto my-3.5">
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-[#B8934A]/50 to-[#B8934A]" />
            <div className="relative mx-3 flex items-center justify-center">
              <div className="w-2.5 h-2.5 border border-[#B8934A] rotate-45 shrink-0 shadow-[0_0_8px_rgba(184,147,74,0.3)]" />
            </div>
            <div className="h-[1px] w-20 bg-gradient-to-r from-[#B8934A] via-[#B8934A]/50 to-transparent" />
          </div>

          <p className="text-base sm:text-lg text-[#55514B] font-normal leading-relaxed max-w-lg mx-auto">
            Have a question or a business requirement? We’re here to help.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MAIN TWO-COLUMN COMPOSITION: Left Suspended Panel vs Right Interactive    */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ═══════════════════════════════════════════════════════════════════════ */}
          {/* LEFT SIDE (5 cols): Large Suspended Contact Panel Layered on Textile  */}
          {/* ═══════════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 relative pt-10">
            {/* Suspended Hanging Thread & Gold Ring with soft golden glow */}
            <div className="absolute top-0 left-12 sm:left-16 flex flex-col items-center z-20" aria-hidden="true">
              {/* Subtle gold attachment ring with gentle glow */}
              <div className="w-4 h-4 rounded-full border-2 border-[#B8934A] bg-[#FFFDF9] ring-4 ring-[#FAF7F2] shadow-[0_0_10px_rgba(184,147,74,0.35)]" />
              {/* Fine vertical hanging thread */}
              <div className="w-px h-10 bg-gradient-to-b from-[#B8934A] via-[#D4AF37] to-[#DCD5C8]" />
            </div>

            {/* Behind Layer: Real Vertical Textile Photograph providing layered fabric depth */}
            <div
              aria-hidden="true"
              className="absolute top-14 left-3 sm:left-4 right-3 sm:right-4 bottom-2 rounded-2xl rounded-b-[2.8rem] overflow-hidden border border-[#D5CBB9] shadow-md -rotate-1 hidden sm:block opacity-60"
            >
              <img
                src="/assets/materials/fabrics-collection-board.jpg"
                alt="Woven textiles preview"
                className="w-full h-full object-cover filter contrast-105"
              />
              <div className="absolute inset-0 bg-[#FAF7F2]/80 backdrop-blur-[2px]" />
            </div>

            {/* Front Panel: Tall elegant ivory panel with softly rounded lower silhouette & reference card glow */}
            <div className="relative z-10 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F7F2E8] border border-[#E2D8C3] hover:border-[#C5A059]/60 rounded-2xl rounded-b-[2.6rem] p-6 sm:p-8 shadow-[0_18px_50px_rgba(20,46,32,0.05),0_0_30px_rgba(184,147,74,0.08)] hover:shadow-[0_22px_55px_rgba(20,46,32,0.07),0_0_38px_rgba(184,147,74,0.13)] backdrop-blur-xs space-y-6 transition-all duration-300">
              
              {/* Panel Header */}
              <div className="border-b border-[#F0EBE2] pb-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 border border-[#B8934A] rotate-45 shrink-0 shadow-[0_0_6px_rgba(184,147,74,0.25)]" />
                    <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-[#B8934A] font-semibold">
                      CONTACT DESK
                    </span>
                  </div>
                  <div className="w-2 h-2 border border-[#B8934A] rotate-45 shrink-0 opacity-40" />
                </div>
                <h2 className="font-serif text-2xl sm:text-[26px] font-bold text-[#142E20] tracking-tight">
                  We’d Love to Hear from You
                </h2>
              </div>

              {/* Four Contact Sections with Minimal Circular Outline Icons and Refined Hover Glow */}
              <div className="space-y-4">
                
                {/* 1. Location */}
                <div className="group p-2.5 rounded-xl border border-transparent hover:border-[#E8DFD0] hover:bg-white/60 hover:shadow-[0_4px_16px_rgba(184,147,74,0.08)] transition-all duration-200 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full border border-[#D5C9B3] bg-gradient-to-b from-[#FFFDF9] to-[#F5EFE3] flex items-center justify-center shrink-0 text-[#B8934A] group-hover:border-[#B8934A] group-hover:scale-105 group-hover:shadow-[0_0_12px_rgba(184,147,74,0.25)] transition-all">
                    <MapPin className="w-4 h-4 stroke-[1.5]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-base font-semibold text-[#142E20]">Our Location</h3>
                      <span className="text-[9px] font-mono text-[#8C8478] uppercase">TIRUPPUR</span>
                    </div>
                    <p className="text-xs text-[#55514B] leading-relaxed mt-1 font-normal">
                      {businessConfig.addressLine1}, {businessConfig.addressLine2}, {businessConfig.city}, {businessConfig.state} – {businessConfig.pincode}
                    </p>
                    <a
                      href={mapsSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-[#B8934A] hover:text-[#142E20] transition-colors mt-1.5 group/link"
                    >
                      <span>Open in Google Maps</span>
                      <ArrowUpRight className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                    </a>
                  </div>
                </div>

                <div className="h-px bg-[#F0EBE2]" />

                {/* 2. Phone / WhatsApp */}
                <div className="group p-2.5 rounded-xl border border-transparent hover:border-[#E8DFD0] hover:bg-white/60 hover:shadow-[0_4px_16px_rgba(184,147,74,0.08)] transition-all duration-200 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full border border-[#D5C9B3] bg-gradient-to-b from-[#FFFDF9] to-[#F5EFE3] flex items-center justify-center shrink-0 text-[#B8934A] group-hover:border-[#B8934A] group-hover:scale-105 group-hover:shadow-[0_0_12px_rgba(184,147,74,0.25)] transition-all">
                    <Phone className="w-4 h-4 stroke-[1.5]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-base font-semibold text-[#142E20]">Call / WhatsApp</h3>
                      <button
                        type="button"
                        onClick={() => handleCopy(VERIFIED_PHONE, 'phone')}
                        className="text-[10px] font-mono text-[#8C8478] hover:text-[#142E20] transition-colors cursor-pointer inline-flex items-center gap-1"
                        title="Copy phone number"
                      >
                        {copiedPhone ? (
                          <span className="text-[#142E20] font-semibold inline-flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5 text-[#B8934A]" /> Copied
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5">
                            <Copy className="w-2.5 h-2.5" /> Copy
                          </span>
                        )}
                      </button>
                    </div>
                    <a
                      href={`tel:${VERIFIED_PHONE}`}
                      className="font-mono text-sm font-semibold text-[#142E20] hover:text-[#B8934A] transition-colors block mt-1"
                    >
                      {VERIFIED_PHONE}
                    </a>
                    <div className="flex items-center gap-3 text-[11px] font-mono mt-1.5">
                      <a href={`tel:${VERIFIED_PHONE}`} className="text-[#142E20] hover:text-[#B8934A] transition-colors font-medium">
                        Call Directly
                      </a>
                      <span className="text-[#DCD5C8]">•</span>
                      <a
                        href={getWhatsAppUrl('Hello Classic Fashions, I would like to enquire regarding fabric sourcing.')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#B8934A] hover:text-[#142E20] transition-colors font-medium inline-flex items-center gap-0.5"
                      >
                        <span>WhatsApp Chat</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-[#F0EBE2]" />

                {/* 3. Business Email */}
                <div className="group p-2.5 rounded-xl border border-transparent hover:border-[#E8DFD0] hover:bg-white/60 hover:shadow-[0_4px_16px_rgba(184,147,74,0.08)] transition-all duration-200 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full border border-[#D5C9B3] bg-gradient-to-b from-[#FFFDF9] to-[#F5EFE3] flex items-center justify-center shrink-0 text-[#B8934A] group-hover:border-[#B8934A] group-hover:scale-105 group-hover:shadow-[0_0_12px_rgba(184,147,74,0.25)] transition-all">
                    <Mail className="w-4 h-4 stroke-[1.5]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-base font-semibold text-[#142E20]">Business Email</h3>
                      <button
                        type="button"
                        onClick={() => handleCopy(VERIFIED_EMAIL, 'email')}
                        className="text-[10px] font-mono text-[#8C8478] hover:text-[#142E20] transition-colors cursor-pointer inline-flex items-center gap-1"
                        title="Copy email address"
                      >
                        {copiedEmail ? (
                          <span className="text-[#142E20] font-semibold inline-flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5 text-[#B8934A]" /> Copied
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5">
                            <Copy className="w-2.5 h-2.5" /> Copy
                          </span>
                        )}
                      </button>
                    </div>
                    <a
                      href={`mailto:${VERIFIED_EMAIL}`}
                      className="font-mono text-xs font-semibold text-[#142E20] hover:text-[#B8934A] transition-colors block mt-1 truncate"
                      title={VERIFIED_EMAIL}
                    >
                      {VERIFIED_EMAIL}
                    </a>
                    <a
                      href={`mailto:${VERIFIED_EMAIL}?subject=${encodeURIComponent('Sourcing Inquiry — Classic Fashions')}`}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-[#B8934A] hover:text-[#142E20] transition-colors mt-1.5"
                    >
                      <span>Send Direct Email</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="h-px bg-[#F0EBE2]" />

                {/* 4. Working Hours */}
                <div className="group p-2.5 rounded-xl border border-transparent hover:border-[#E8DFD0] hover:bg-white/60 hover:shadow-[0_4px_16px_rgba(184,147,74,0.08)] transition-all duration-200 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full border border-[#D5C9B3] bg-gradient-to-b from-[#FFFDF9] to-[#F5EFE3] flex items-center justify-center shrink-0 text-[#B8934A] group-hover:border-[#B8934A] group-hover:scale-105 group-hover:shadow-[0_0_12px_rgba(184,147,74,0.25)] transition-all">
                    <Clock className="w-4 h-4 stroke-[1.5]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-base font-semibold text-[#142E20]">Working Hours</h3>
                    <div className="text-xs text-[#55514B] space-y-1 mt-1.5">
                      <div className="flex items-center justify-between">
                        <span>Monday – Saturday</span>
                        <span className="font-mono text-[11px] font-semibold text-[#142E20]">9:30 AM – 7:30 PM IST</span>
                      </div>
                      <div className="flex items-center justify-between text-[#8C8478]">
                        <span>Sunday</span>
                        <span className="font-mono text-[11px]">Closed</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Exact Tagline with Subtle Muted-Gold Single-Line Diamond Motif & Warm Tone */}
              <div className="pt-4 border-t border-[#F0EBE2] flex items-center gap-2.5">
                <div className="w-2 h-2 border border-[#B8934A] rotate-45 shrink-0 opacity-80 shadow-[0_0_6px_rgba(184,147,74,0.3)]" />
                <p className="font-serif italic text-xs sm:text-[13px] text-[#B8934A] leading-relaxed tracking-wide">
                  “Fine textiles woven with integrity &amp; craft.”
                </p>
              </div>

            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════════ */}
          {/* RIGHT SIDE (7 cols): Interactive Enquiry Experience "Let's Work Together" */}
          {/* ═══════════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 space-y-6 pt-2">
            
            {/* Section Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 border border-[#B8934A] rotate-45 shrink-0 shadow-[0_0_6px_rgba(184,147,74,0.25)]" />
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-[#B8934A] font-semibold">
                  ENQUIRY DESK
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#142E20] tracking-tight">
                Let’s Work Together
              </h2>
              <p className="text-sm text-[#55514B] leading-relaxed max-w-xl font-normal">
                Tell us what you need — fabric, accessories, bulk orders or custom development. We’ll get back to you soon.
              </p>
            </div>

            {/* Five Elegant Interactive Enquiry Tiles Styled with Soft Gold Glow & Cream Surfaces */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {ENQUIRY_CATEGORIES.map((cat, idx) => {
                const Icon = cat.icon;
                const isSelected = selectedCategoryKey === cat.key;
                const isFullWidth = idx === 4; // 5th item spans full row cleanly

                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => {
                      setSelectedCategoryKey(cat.key);
                      setIsEnquiryExpanded(true);
                      if (isSubmitted) {
                        setIsSubmitted(false);
                        setStepperStep(1);
                      }
                    }}
                    className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer group flex items-start gap-3.5 relative overflow-hidden ${
                      isFullWidth ? 'sm:col-span-2' : ''
                    } ${
                      isSelected
                        ? 'bg-gradient-to-b from-[#FAF4E8] via-[#F7EFE0] to-[#F4E9D8] border-[#B8934A] ring-1 ring-[#B8934A]/50 shadow-[0_0_22px_rgba(184,147,74,0.16),0_6px_20px_rgba(20,46,32,0.04)]'
                        : 'bg-gradient-to-b from-white via-[#FDFBF7] to-[#FAF6EE] border-[#E5DDD0] hover:border-[#C5A059]/80 hover:bg-gradient-to-b hover:from-[#FFFDF9] hover:to-[#FAF3E6] hover:shadow-[0_8px_24px_rgba(184,147,74,0.12)] hover:-translate-y-0.5'
                    }`}
                  >
                    {/* Outline Icon */}
                    <div
                      className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? 'border-[#B8934A] bg-[#B8934A]/15 text-[#142E20] shadow-[0_0_10px_rgba(184,147,74,0.25)]'
                          : 'border-[#E2DBD0] bg-white text-[#B8934A] group-hover:border-[#B8934A]/70 group-hover:shadow-[0_0_8px_rgba(184,147,74,0.18)]'
                      }`}
                    >
                      <Icon className="w-4 h-4 stroke-[1.5]" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-serif text-sm sm:text-base font-semibold tracking-tight transition-colors ${
                            isSelected ? 'text-[#142E20]' : 'text-[#142E20] group-hover:text-[#B8934A]'
                          }`}
                        >
                          {cat.label}
                        </span>
                        <ArrowRight
                          className={`w-3.5 h-3.5 transition-all ${
                            isSelected
                              ? 'text-[#B8934A] translate-x-0.5 drop-shadow-[0_0_4px_rgba(184,147,74,0.4)]'
                              : 'text-[#C5BEB2] opacity-70 group-hover:text-[#B8934A] group-hover:translate-x-1 group-hover:opacity-100'
                          }`}
                        />
                      </div>
                      <p className="text-[11px] text-[#737068] mt-0.5 font-normal leading-snug">
                        {cat.tagline}
                      </p>
                    </div>

                    {/* Selected Indicator Edge Stripe with Gold Gradient */}
                    {isSelected && (
                      <div aria-hidden="true" className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-[#B8934A] via-[#D4AF37] to-[#B8934A] shadow-[0_0_8px_rgba(184,147,74,0.4)]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* PROGRESSIVE ENQUIRY AREA — Soft Ivory Surface with Faint Gold Edge  */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            <div className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F0] to-[#F7F2E8] border border-[#E2D8C3] hover:border-[#C5A059]/50 rounded-2xl p-6 sm:p-8 shadow-[0_16px_45px_rgba(20,46,32,0.04),0_0_30px_rgba(184,147,74,0.06)] relative overflow-hidden transition-all duration-300">
              
              {/* Corner Fine Gold Accents with Subtle Warm Glow */}
              <div aria-hidden="true" className="absolute top-3 left-3 w-2 h-2 border-t border-l border-[#B8934A]/40" />
              <div aria-hidden="true" className="absolute top-3 right-3 w-2 h-2 border-t border-r border-[#B8934A]/40" />
              <div aria-hidden="true" className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-[#B8934A]/40" />
              <div aria-hidden="true" className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-[#B8934A]/40" />

              {/* --------------------------------------------------------------- */}
              {/* STATE A: SIMPLIFIED SUBMITTED SUCCESS CONFIRMATION               */}
              {/* --------------------------------------------------------------- */}
              {isSubmitted ? (
                <div className="text-center py-6 space-y-5 animate-in fade-in duration-300">
                  <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#B8934A] shadow-[0_0_14px_rgba(184,147,74,0.25)] flex items-center justify-center mx-auto text-[#142E20]">
                    <CheckCircle2 className="w-6 h-6 text-[#142E20]" />
                  </div>

                  {/* Concise confirmation matching exact user requirement */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B8934A] font-semibold block">
                      ENQUIRY RECEIVED
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#142E20] tracking-tight">
                      Thank You!
                    </h3>
                    <p className="text-sm text-[#55514B] max-w-md mx-auto leading-relaxed">
                      We’ve received your enquiry and will be in touch soon.
                    </p>
                  </div>

                  {/* Reference code */}
                  <div className="inline-block bg-[#FAF7F2] border border-[#E2D8C3] shadow-[0_0_12px_rgba(184,147,74,0.08)] rounded-xl px-5 py-2.5">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#737068] block">
                      Reference Code
                    </span>
                    <span className="font-mono text-sm font-semibold text-[#142E20]">
                      {referenceCode}
                    </span>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={getWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#142E20] hover:bg-[#1B3B2B] text-[#FAF7F2] px-6 py-3 rounded-xl text-xs font-mono font-medium tracking-wider transition-all cursor-pointer shadow-xs border border-[#B8934A]/50 hover:shadow-[0_6px_22px_rgba(184,147,74,0.26)] active:scale-[0.99]"
                    >
                      <span>Share on WhatsApp</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#B8934A]" />
                    </a>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#DDD6C8] bg-white text-xs font-mono text-[#55514B] hover:text-[#142E20] hover:border-[#B8934A] hover:shadow-[0_4px_16px_rgba(184,147,74,0.12)] transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Submit Another Enquiry</span>
                    </button>
                  </div>
                </div>
              ) : !isEnquiryExpanded ? (
                /* ------------------------------------------------------------- */
                /* STATE B: COLLAPSED PANEL WITH "DROP US A MESSAGE" & BUTTON     */
                /* ------------------------------------------------------------- */
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#B8934A] font-semibold">
                        SELECTED:
                      </span>
                      <span className="text-xs font-mono font-semibold text-[#142E20] bg-white px-2.5 py-0.5 rounded border border-[#B8934A]/40 shadow-[0_0_8px_rgba(184,147,74,0.12)]">
                        {currentCategory.label}
                      </span>
                    </div>
                    {/* Consistent serif italic detail */}
                    <p className="font-serif italic text-base sm:text-lg text-[#524F4A] pt-0.5">
                      Drop us a message with your requirements...
                    </p>
                  </div>

                  {/* Forest-Green Open Enquiry Button with Restrained Hover Glow */}
                  <button
                    type="button"
                    onClick={() => setIsEnquiryExpanded(true)}
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#142E20] hover:bg-[#1B3B2B] text-[#FAF7F2] text-xs font-mono font-semibold uppercase tracking-[0.16em] border border-[#B8934A]/40 hover:border-[#D4AF37] hover:shadow-[0_6px_22px_rgba(184,147,74,0.26)] transition-all active:scale-[0.99] cursor-pointer shrink-0"
                  >
                    <span>Open Enquiry</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#B8934A]" />
                  </button>
                </div>
              ) : (
                /* ------------------------------------------------------------- */
                /* STATE C: PROGRESSIVE MULTI-STEP ENQUIRY INTERACTION           */
                /* ------------------------------------------------------------- */
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* Top Bar with Discreet Step Indicator & Selected Topic */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#F0EBE2]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#B8934A] font-semibold">
                          ENQUIRY FOR:
                        </span>
                        <span className="text-xs font-mono font-semibold text-[#142E20] bg-white px-2.5 py-0.5 rounded border border-[#B8934A]/40 shadow-[0_0_8px_rgba(184,147,74,0.12)]">
                          {currentCategory.label}
                        </span>
                      </div>
                      <p className="font-serif italic text-sm text-[#737068] mt-0.5">
                        Drop us a message — our coordinators reply within hours
                      </p>
                    </div>

                    {/* Step indicator */}
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="text-[11px] font-mono text-[#737068]">
                        Step {stepperStep} of 3
                      </span>
                      <div className="flex items-center gap-1.5" aria-hidden="true">
                        {[1, 2, 3].map((step) => (
                          <div
                            key={step}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              step === stepperStep
                                ? 'w-5 bg-[#B8934A] shadow-[0_0_6px_rgba(184,147,74,0.4)]'
                                : step < stepperStep
                                ? 'w-1.5 bg-[#142E20]'
                                : 'w-1.5 bg-[#E2DBD0]'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ─────────────────────────────────────────────────────────── */}
                  {/* STEP 1: Message / Requirement Specification                 */}
                  {/* ─────────────────────────────────────────────────────────── */}
                  {stepperStep === 1 && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div>
                        <h4 className="font-serif text-base font-semibold text-[#142E20]">
                          {currentCategory.promptHeadline}
                        </h4>
                        <p className="text-xs text-[#737068] mt-0.5">
                          Include target quantity, construction, lead time, or any reference codes.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <textarea
                          rows={4}
                          autoFocus
                          value={formData.message}
                          onChange={(e) => {
                            setFormData({ ...formData, message: e.target.value });
                            if (fieldErrors.message) setFieldErrors({});
                          }}
                          placeholder={currentCategory.placeholder}
                          className="w-full px-4 py-3 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E0D7C6] rounded-xl text-[#181715] placeholder-[#99948A] focus:bg-white focus:outline-none focus:border-[#B8934A] focus:ring-1 focus:ring-[#B8934A]/40 focus:shadow-[0_0_14px_rgba(184,147,74,0.12)] transition-all resize-none leading-relaxed font-sans"
                        />
                        {fieldErrors.message && (
                          <p className="text-[11px] text-[#A63624] font-mono">{fieldErrors.message}</p>
                        )}
                        <div className="flex items-center justify-between text-[11px] font-mono text-[#8C8478]">
                          <span>Feel free to be as detailed or brief as required</span>
                          <span>{formData.message.trim().length} chars</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[#F0EBE2]">
                        <button
                          type="button"
                          onClick={() => setIsEnquiryExpanded(false)}
                          className="text-xs font-mono text-[#737068] hover:text-[#142E20] transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (validateStep1()) {
                              setStepperStep(2);
                            }
                          }}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#142E20] hover:bg-[#1B3B2B] text-[#FAF7F2] text-xs font-mono font-semibold uppercase tracking-wider border border-[#B8934A]/40 hover:border-[#D4AF37] hover:shadow-[0_6px_22px_rgba(184,147,74,0.26)] transition-all active:scale-[0.99] cursor-pointer"
                        >
                          <span>Continue to Contact</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#B8934A]" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ─────────────────────────────────────────────────────────── */}
                  {/* STEP 2: Contact Details                                     */}
                  {/* ─────────────────────────────────────────────────────────── */}
                  {stepperStep === 2 && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div>
                        <h4 className="font-serif text-base font-semibold text-[#142E20]">
                          Where should we send your quotation or swatch response?
                        </h4>
                        <p className="text-xs text-[#737068] mt-0.5">
                          We do not send marketing spam. We only use your information to reply to this enquiry.
                        </p>
                      </div>

                      <div className="space-y-3.5">
                        {/* Name */}
                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#3D3D3A] font-semibold mb-1">
                            YOUR NAME <span className="text-[#B8934A]">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => {
                              setFormData({ ...formData, name: e.target.value });
                              if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: '' }));
                            }}
                            placeholder="e.g. Anandhan / Murugan"
                            className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E0D7C6] rounded-xl text-[#181715] placeholder-[#99948A] focus:bg-white focus:outline-none focus:border-[#B8934A] focus:ring-1 focus:ring-[#B8934A]/40 focus:shadow-[0_0_14px_rgba(184,147,74,0.12)] transition-all font-sans"
                          />
                          {fieldErrors.name && (
                            <p className="text-[11px] text-[#A63624] mt-1 font-mono">{fieldErrors.name}</p>
                          )}
                        </div>

                        {/* Phone / WhatsApp */}
                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#3D3D3A] font-semibold mb-1">
                            PHONE / WHATSAPP NUMBER <span className="text-[#B8934A]">*</span>
                          </label>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => {
                              setFormData({ ...formData, phone: e.target.value });
                              if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: '' }));
                            }}
                            placeholder="e.g. +91 98420 12345"
                            className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E0D7C6] rounded-xl text-[#181715] placeholder-[#99948A] focus:bg-white focus:outline-none focus:border-[#B8934A] focus:ring-1 focus:ring-[#B8934A]/40 focus:shadow-[0_0_14px_rgba(184,147,74,0.12)] transition-all font-sans"
                          />
                          {fieldErrors.phone && (
                            <p className="text-[11px] text-[#A63624] mt-1 font-mono">{fieldErrors.phone}</p>
                          )}
                        </div>

                        {/* Email (Optional) */}
                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#3D3D3A] font-semibold mb-1">
                            EMAIL ADDRESS <span className="font-normal text-[10px] text-[#737068]">(Optional)</span>
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => {
                              setFormData({ ...formData, email: e.target.value });
                              if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
                            }}
                            placeholder="e.g. sourcing@garments.com"
                            className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E0D7C6] rounded-xl text-[#181715] placeholder-[#99948A] focus:bg-white focus:outline-none focus:border-[#B8934A] focus:ring-1 focus:ring-[#B8934A]/40 focus:shadow-[0_0_14px_rgba(184,147,74,0.12)] transition-all font-sans"
                          />
                          {fieldErrors.email && (
                            <p className="text-[11px] text-[#A63624] mt-1 font-mono">{fieldErrors.email}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[#F0EBE2]">
                        <button
                          type="button"
                          onClick={() => setStepperStep(1)}
                          className="text-xs font-mono text-[#737068] hover:text-[#142E20] transition-colors cursor-pointer"
                        >
                          ← Back to Requirement
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (validateStep2()) {
                              setStepperStep(3);
                            }
                          }}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#142E20] hover:bg-[#1B3B2B] text-[#FAF7F2] text-xs font-mono font-semibold uppercase tracking-wider border border-[#B8934A]/40 hover:border-[#D4AF37] hover:shadow-[0_6px_22px_rgba(184,147,74,0.26)] transition-all active:scale-[0.99] cursor-pointer"
                        >
                          <span>Review Enquiry</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#B8934A]" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ─────────────────────────────────────────────────────────── */}
                  {/* STEP 3: Review & Send                                       */}
                  {/* ─────────────────────────────────────────────────────────── */}
                  {stepperStep === 3 && (
                    <div className="space-y-5 animate-in fade-in duration-200">
                      <div>
                        <h4 className="font-serif text-base font-semibold text-[#142E20]">
                          Confirm Your Enquiry Details
                        </h4>
                        <p className="text-xs text-[#737068] mt-0.5">
                          Review your summary before dispatching to our sourcing team.
                        </p>
                      </div>

                      {/* Concise Summary Slip with Soft Card Lighting */}
                      <div className="bg-[#FAF7F2] border border-[#E2D8C3] shadow-[0_0_14px_rgba(184,147,74,0.06)] rounded-xl p-4 sm:p-5 space-y-3.5 text-xs">
                        {/* Category */}
                        <div className="flex items-center justify-between pb-2.5 border-b border-[#ECE5D8]">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#737068] block">
                              Enquiry Topic
                            </span>
                            <span className="font-serif text-sm font-semibold text-[#142E20] mt-0.5 block">
                              {currentCategory.label}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-[#B8934A] font-medium">Preselected</span>
                        </div>

                        {/* Message */}
                        <div className="flex items-start justify-between pb-2.5 border-b border-[#ECE5D8]">
                          <div className="max-w-md">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#737068] block">
                              Requirement Details
                            </span>
                            <p className="font-normal italic text-[#33312E] mt-1 leading-relaxed">
                              "{formData.message}"
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setStepperStep(1)}
                            className="inline-flex items-center gap-1 font-mono text-[11px] text-[#B8934A] hover:text-[#142E20] transition-colors cursor-pointer shrink-0 ml-3"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                        </div>

                        {/* Contact details */}
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#737068] block">
                              Contact Person
                            </span>
                            <div className="font-mono text-[#142E20] space-y-0.5 mt-1">
                              <p><strong className="font-semibold text-neutral-800">Name:</strong> {formData.name}</p>
                              <p><strong className="font-semibold text-neutral-800">Phone:</strong> {formData.phone}</p>
                              {formData.email && (
                                <p><strong className="font-semibold text-neutral-800">Email:</strong> {formData.email}</p>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setStepperStep(2)}
                            className="inline-flex items-center gap-1 font-mono text-[11px] text-[#B8934A] hover:text-[#142E20] transition-colors cursor-pointer shrink-0 ml-3"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                        </div>
                      </div>

                      {fieldErrors.form && (
                        <p className="text-xs text-[#A63624] font-mono">{fieldErrors.form}</p>
                      )}

                      {/* Single Action: Send Enquiry with Restrained Golden Glow */}
                      <div className="pt-2">
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => handleSubmitEnquiry()}
                          className="group w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-[#142E20] hover:bg-[#1B3B2B] text-[#FAF7F2] border border-[#B8934A]/40 hover:border-[#D4AF37] hover:shadow-[0_6px_22px_rgba(184,147,74,0.26)] text-xs font-mono font-semibold uppercase tracking-[0.2em] shadow-sm transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <span>Sending Your Enquiry...</span>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5 text-[#B8934A]" />
                              <span>Send Enquiry</span>
                              <ArrowRight className="w-3.5 h-3.5 text-[#B8934A] transition-transform group-hover:translate-x-1" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* SUBTLE DIVIDER "OR" & THREE MINIMAL DIRECT CONTACT OPTIONS          */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            <div className="pt-2">
              <div className="relative my-6 text-center">
                <div className="border-t border-[#E8E1D5] absolute inset-x-0 top-1/2" />
                <span className="relative bg-[#FAF7F2] px-3 font-mono text-[11px] text-[#B8934A] tracking-widest font-semibold uppercase inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 border border-[#B8934A] rotate-45 inline-block shadow-[0_0_4px_rgba(184,147,74,0.25)]" />
                  OR
                  <span className="w-1.5 h-1.5 border border-[#B8934A] rotate-45 inline-block shadow-[0_0_4px_rgba(184,147,74,0.25)]" />
                </span>
              </div>

              {/* Three Minimal Direct Contact Options with Soft Glow on Hover */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* 1. Call / WhatsApp */}
                <a
                  href={`tel:${VERIFIED_PHONE}`}
                  className="p-3.5 rounded-xl border border-[#E2D8C3] bg-gradient-to-b from-white via-[#FDFBF7] to-[#FAF6EE] hover:from-[#FFFDF9] hover:to-[#FAF3E6] hover:border-[#B8934A]/70 hover:shadow-[0_6px_20px_rgba(184,147,74,0.12)] hover:-translate-y-0.5 transition-all text-center group block"
                >
                  <Phone className="w-4 h-4 text-[#B8934A] mx-auto mb-1.5 group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_rgba(184,147,74,0.35)] transition-all" />
                  <span className="font-serif text-xs font-semibold text-[#142E20] block">
                    Call / WhatsApp
                  </span>
                  <span className="font-mono text-[11px] text-[#737068] block mt-0.5">
                    {VERIFIED_PHONE}
                  </span>
                </a>

                {/* 2. Email Us */}
                <a
                  href={`mailto:${VERIFIED_EMAIL}?subject=${encodeURIComponent('Material Enquiry — Classic Fashions')}`}
                  className="p-3.5 rounded-xl border border-[#E2D8C3] bg-gradient-to-b from-white via-[#FDFBF7] to-[#FAF6EE] hover:from-[#FFFDF9] hover:to-[#FAF3E6] hover:border-[#B8934A]/70 hover:shadow-[0_6px_20px_rgba(184,147,74,0.12)] hover:-translate-y-0.5 transition-all text-center group block"
                >
                  <Mail className="w-4 h-4 text-[#B8934A] mx-auto mb-1.5 group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_rgba(184,147,74,0.35)] transition-all" />
                  <span className="font-serif text-xs font-semibold text-[#142E20] block">
                    Email Us
                  </span>
                  <span className="font-mono text-[11px] text-[#737068] block mt-0.5 truncate px-1">
                    {VERIFIED_EMAIL}
                  </span>
                </a>

                {/* 3. Find Us */}
                <a
                  href={mapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl border border-[#E2D8C3] bg-gradient-to-b from-white via-[#FDFBF7] to-[#FAF6EE] hover:from-[#FFFDF9] hover:to-[#FAF3E6] hover:border-[#B8934A]/70 hover:shadow-[0_6px_20px_rgba(184,147,74,0.12)] hover:-translate-y-0.5 transition-all text-center group block"
                >
                  <MapPin className="w-4 h-4 text-[#B8934A] mx-auto mb-1.5 group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_rgba(184,147,74,0.35)] transition-all" />
                  <span className="font-serif text-xs font-semibold text-[#142E20] block">
                    Find Us
                  </span>
                  <span className="font-mono text-[11px] text-[#737068] block mt-0.5">
                    Boyampalayam, Tiruppur ↗
                  </span>
                </a>

              </div>
            </div>

          </div>

        </div>
      </main>

      {/* ========================================================================= */}
      {/* 7. BOTTOM BRAND STRIP — Slim Footer Strip with Minimal Outline Icons      */}
      {/* ========================================================================= */}
      <footer className="border-t border-[#E8E1D5] bg-gradient-to-b from-[#FAF8F5]/90 to-[#F5EFE3]/80 py-8 px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center text-center md:text-left">
            
            {/* Item 1 */}
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3.5">
              <div className="w-10 h-10 rounded-full border border-[#D5C9B3] bg-white flex items-center justify-center text-[#B8934A] shrink-0 shadow-[0_2px_10px_rgba(184,147,74,0.08)]">
                <ShieldCheck className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-semibold text-[#142E20]">
                  Premium Textiles
                </h4>
                <p className="text-xs text-[#737068] font-normal mt-0.5">
                  World-class quality
                </p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3.5 border-y md:border-y-0 md:border-x border-[#EAE4D8] py-4 md:py-0 md:px-6">
              <div className="w-10 h-10 rounded-full border border-[#D5C9B3] bg-white flex items-center justify-center text-[#B8934A] shrink-0 shadow-[0_2px_10px_rgba(184,147,74,0.08)]">
                <Award className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-semibold text-[#142E20]">
                  Trusted Partner
                </h4>
                <p className="text-xs text-[#737068] font-normal mt-0.5">
                  For your business
                </p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3.5">
              <div className="w-10 h-10 rounded-full border border-[#D5C9B3] bg-white flex items-center justify-center text-[#B8934A] shrink-0 shadow-[0_2px_10px_rgba(184,147,74,0.08)]">
                <Clock className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-semibold text-[#142E20]">
                  Reliable Supply
                </h4>
                <p className="text-xs text-[#737068] font-normal mt-0.5">
                  Always on time
                </p>
              </div>
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
};
