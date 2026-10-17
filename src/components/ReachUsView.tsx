import React, { useState, useRef } from 'react';
import { businessConfig } from '../data/businessConfig.ts';
import {
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  ExternalLink,
  User,
  Paperclip,
  Check,
  Scissors,
  Sparkles,
  ArrowRight,
  X,
  MessageSquare,
  Headphones,
  Package,
  Clock,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

interface ReachUsViewProps {
  onExploreCatalogue?: () => void;
}

// Verified Business Contact Data (Preserved Exactly)
const VERIFIED_PHONE = '+91 88264 15868';
const VERIFIED_PHONE_RAW = '918826415868';
const VERIFIED_EMAIL = 'material@classicfashions.com';
const STORAGE_ENQUIRIES_KEY = 'cf_reach_us_enquiries_v1';

type HubOption = 'talk' | 'business' | 'manufacturing';
type ChannelOption = 'message' | 'whatsapp' | 'call' | 'email';

interface HubDetail {
  id: HubOption;
  label: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  description: string;
  placeholderMessage: string;
  whatsappMessage: string;
  emailSubject: string;
}

const HUB_OPTIONS: Record<HubOption, HubDetail> = {
  talk: {
    id: 'talk',
    label: 'Talk to Our Team',
    badge: 'General & Support',
    icon: Headphones,
    tagline: 'General questions & immediate sourcing assistance',
    description:
      'Connect with our Tiruppur textile coordinators for general inquiries, quick catalog questions, or immediate guidance on product availability.',
    placeholderMessage:
      'Hello Classic Fashions team, I would like to ask about...',
    whatsappMessage:
      'Hello Classic Fashions, I am reaching out from your website to speak with your team regarding general inquiries and material assistance.',
    emailSubject: 'General Inquiry — Classic Fashions Assistance Desk',
  },
  business: {
    id: 'business',
    label: 'Business Enquiry',
    badge: 'Wholesale & B2B',
    icon: Package,
    tagline: 'Wholesale orders, bulk fabrics & garment accessories',
    description:
      'Specialized for garment manufacturers, export houses, and buying agents. Discuss volume tier pricing, bulk roll allocations, and trims procurement.',
    placeholderMessage:
      'Hello, we are sourcing fabrics/accessories in volume. Our target quantities and requirements are...',
    whatsappMessage:
      'Hello Classic Fashions, I am reaching out regarding a Business Enquiry for wholesale fabrics and garment accessories.',
    emailSubject: 'Business Enquiry — Wholesale Order & Trims Sourcing',
  },
  manufacturing: {
    id: 'manufacturing',
    label: 'Manufacturing Enquiry',
    badge: 'Custom & Mills',
    icon: Scissors,
    tagline: 'Custom textile development & manufacturing discussions',
    description:
      'Dedicated technical channel for custom yarn counts, GOTS certified organic weaves, proprietary knit constructions, lab-dip color matching, and special finishes.',
    placeholderMessage:
      'Hello, we require custom textile development with the following specifications (GSM, weave, finish)...',
    whatsappMessage:
      'Hello Classic Fashions, I am reaching out regarding a Manufacturing Enquiry for custom textile development and technical mill specifications.',
    emailSubject: 'Manufacturing Enquiry — Custom Textile Development',
  },
};

export const ReachUsView: React.FC<ReachUsViewProps> = ({ onExploreCatalogue }) => {
  // Contact Hub state
  const [activeHub, setActiveHub] = useState<HubOption>('talk');
  const [activeChannel, setActiveChannel] = useState<ChannelOption>('message');

  // Form State: 3 primary fields (Name, Phone, Message) + Optional Email
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  // Attached files
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; sizeKb: number }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceCode, setReferenceCode] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    '5/1475, 5th Street, Palanisamy Nagar, Boyampalayam, Tiruppur, Tamil Nadu 641602'
  )}`;

  // File selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newFiles = files.slice(0, 5 - attachedFiles.length).map((f) => ({
        name: f.name,
        sizeKb: Math.round(f.size / 1024),
      }));
      setAttachedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Validation: Name + Phone are required, Email is optional
  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.name || formData.name.trim().length < 2) {
      errs.name = 'Please enter your name.';
    }
    if (!formData.phone || formData.phone.trim().length < 7) {
      errs.phone = 'Please enter a valid phone or WhatsApp number.';
    }
    if (
      formData.email &&
      formData.email.trim().length > 0 &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      errs.email = 'Please enter a valid email address, or leave it blank.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit Enquiry Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const timestamp = Date.now();
      const code = `CF-ENQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const currentHubInfo = HUB_OPTIONS[activeHub];
      const record = {
        id: `enquiry-${timestamp}`,
        referenceCode: code,
        category: currentHubInfo.label,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        message: formData.message.trim() || currentHubInfo.tagline,
        attachedFiles,
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
      setErrors({ form: 'Unable to send enquiry. Please contact us via WhatsApp.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentHub = HUB_OPTIONS[activeHub];

  const getCustomWhatsAppUrl = () => {
    const msg = encodeURIComponent(
      `${currentHub.whatsappMessage}\n\n` +
        `• Inquiry Type: ${currentHub.label}\n` +
        `• Reference Code: ${referenceCode || 'Direct Web Inquiry'}\n` +
        (formData.name ? `• Name: ${formData.name}\n` : '') +
        (formData.message ? `• Note: ${formData.message}` : '')
    );
    return `https://wa.me/${VERIFIED_PHONE_RAW}?text=${msg}`;
  };

  const getCustomMailtoUrl = () => {
    const subject = encodeURIComponent(`${currentHub.emailSubject} [${referenceCode || 'Classic Fashions'}]`);
    const body = encodeURIComponent(
      `Hello Classic Fashions Team,\n\n` +
        `I am writing regarding: ${currentHub.label}\n\n` +
        (formData.message ? `${formData.message}\n\n` : `Please share information on:\n\n`) +
        `Contact Information:\n` +
        `Name: ${formData.name || ''}\n` +
        `Phone/WhatsApp: ${formData.phone || ''}\n`
    );
    return `mailto:${VERIFIED_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="bg-[#070B09] text-[#F7F3EA] min-h-screen pb-24 relative overflow-hidden font-sans selection:bg-[#C49A55] selection:text-[#070B09]">
      {/* Ambient Deep Forest Green & Warm Gold Glows */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-full sm:w-2/3 h-[600px] pointer-events-none opacity-40 mix-blend-screen"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 70% 15%, rgba(16, 44, 34, 0.9), rgba(7, 24, 18, 0.3) 50%, transparent 80%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute top-28 left-1/4 w-[500px] h-[500px] pointer-events-none opacity-20"
        style={{
          background:
            'radial-gradient(circle at 40% 40%, rgba(196, 154, 85, 0.16), transparent 70%)',
        }}
      />

      {/* ========================================================================= */}
      {/* 1. TYPOGRAPHY-FOCUSED HERO SECTION (NO HERO IMAGE)                        */}
      {/* ========================================================================= */}
      <section className="relative pt-12 sm:pt-16 lg:pt-20 pb-12 sm:pb-16 border-b border-[#16382C]/60 text-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Subtle Top Pill Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0D241C] border border-[#214738] shadow-[0_0_20px_rgba(196,154,85,0.08)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C49A55] animate-pulse" />
            <span className="font-mono text-[11px] font-semibold tracking-[0.2em] text-[#E5C58D] uppercase">
              TIRUPPUR TEXTILE DESK • B2B SOURCING
            </span>
          </div>

          {/* Clean Typography-Focused Heading with Animated Gold Accent */}
          <div className="space-y-3">
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#F7F3EA] leading-[1.08]">
              Let’s Connect &amp;{' '}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#F7F3EA] via-[#E5C58D] to-[#C49A55] font-serif italic font-normal tracking-normal drop-shadow-[0_2px_15px_rgba(196,154,85,0.25)]">
                Create.
                {/* Subtle animated underline gold accent */}
                <span className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent rounded-full shadow-[0_0_12px_#D4AF37]" />
              </span>
            </h1>
          </div>

          {/* Supporting Copy */}
          <p className="text-sm sm:text-base lg:text-lg text-[#A3B8B0] leading-relaxed max-w-2xl mx-auto">
            Have a question or a business requirement? We’re here to help with fabrics, garment
            accessories, manufacturing, and bulk orders.
          </p>

          {/* Quick Credibility / Response Guarantee Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-[#E5C58D]">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1E17] border border-[#1A382C]">
              <Clock className="w-3.5 h-3.5 text-[#C49A55]" />
              <span>Direct Desk: Mon – Sat • Rapid Response</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1E17] border border-[#1A382C]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C49A55]" />
              <span>Certified Mill &amp; Trims Sourcing Partner</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MAIN INTERACTIVE LAYOUT: BUSINESS INFO + INTERACTIVE CONTACT HUB        */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* --------------------------------------------------------------------- */}
          {/* LEFT COLUMN: COMPACT INTERACTIVE BUSINESS INFORMATION (~40% WIDTH)    */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-b from-[#0B1E17] to-[#071712] border border-[#1A382C] rounded-3xl p-6 sm:p-7 shadow-[0_15px_45px_rgba(0,0,0,0.6)] space-y-5 relative overflow-hidden">
              {/* Header */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C49A55] font-semibold">
                  OFFICIAL CONTACTS
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#F7F3EA] tracking-tight">
                  Let’s Connect
                </h2>
                <div className="w-10 h-0.5 bg-[#C49A55] rounded-full" />
              </div>

              {/* 3 Compact Business Information Cards */}
              <div className="space-y-3.5">
                {/* 1. Atelier & Studio Address */}
                <div className="bg-[#0E261E]/80 border border-[#214738] hover:border-[#C49A55]/60 rounded-2xl p-4 sm:p-5 transition-all duration-300 group shadow-md hover:shadow-lg">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#16382C] text-[#C49A55] border border-[#2C5E4B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#A3B8B0] font-semibold">
                        OUR ATELIER &amp; STUDIO
                      </span>
                    </div>

                    <a
                      href={mapsSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-[#C49A55] hover:text-[#E5C58D] bg-[#16382C]/70 hover:bg-[#16382C] border border-[#2C5E4B] px-3 py-1 rounded-lg transition-colors shrink-0"
                    >
                      <span>Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="mt-3 pl-10">
                    <p className="text-xs sm:text-sm text-[#F7F3EA] leading-relaxed font-medium">
                      {businessConfig.addressLine1},<br />
                      {businessConfig.addressLine2},<br />
                      {businessConfig.city}, {businessConfig.state} – {businessConfig.pincode}
                    </p>
                    <span className="text-[11px] text-[#A3B8B0] block mt-1.5 font-sans">
                      Fabric &amp; Trims Sourcing District • Tiruppur
                    </span>
                  </div>
                </div>

                {/* 2. Call Our Team */}
                <div className="bg-[#0E261E]/80 border border-[#214738] hover:border-[#C49A55]/60 rounded-2xl p-4 sm:p-5 transition-all duration-300 group shadow-md hover:shadow-lg">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#16382C] text-[#C49A55] border border-[#2C5E4B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Phone className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#A3B8B0] font-semibold">
                        CALL OUR TEAM
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold text-[#E5C58D] bg-[#16382C]/70 border border-[#2C5E4B] px-2.5 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                      <span>DIRECT DESK</span>
                    </span>
                  </div>

                  <div className="mt-3 pl-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <a
                        href={`tel:${VERIFIED_PHONE}`}
                        className="font-mono text-base sm:text-lg font-bold text-[#F7F3EA] hover:text-[#E5C58D] transition-colors block leading-tight"
                      >
                        {VERIFIED_PHONE}
                      </a>
                      <span className="text-[11px] text-[#A3B8B0] block mt-0.5">
                        Direct Wholesale &amp; Sampling Line
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${VERIFIED_PHONE}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16382C] hover:bg-[#1f4a3b] border border-[#2C5E4B] text-[11px] font-mono text-[#E5C58D] transition-colors"
                      >
                        <Phone className="w-3 h-3 text-[#C49A55]" />
                        <span>Call</span>
                      </a>
                      <a
                        href={`https://wa.me/${VERIFIED_PHONE_RAW}?text=${encodeURIComponent(
                          'Hello Classic Fashions, I would like to enquire about your textile sourcing.'
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[11px] font-mono text-[#25D366] transition-colors"
                      >
                        <span>WhatsApp</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* 3. Business Enquiries Email */}
                <div className="bg-[#0E261E]/80 border border-[#214738] hover:border-[#C49A55]/60 rounded-2xl p-4 sm:p-5 transition-all duration-300 group shadow-md hover:shadow-lg">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#16382C] text-[#C49A55] border border-[#2C5E4B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#A3B8B0] font-semibold">
                        BUSINESS ENQUIRIES
                      </span>
                    </div>

                    <a
                      href={`mailto:${VERIFIED_EMAIL}`}
                      className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-[#C49A55] hover:text-[#E5C58D] bg-[#16382C]/70 hover:bg-[#16382C] border border-[#2C5E4B] px-3 py-1 rounded-lg transition-colors shrink-0"
                    >
                      <Mail className="w-3 h-3" />
                      <span>Send Mail</span>
                    </a>
                  </div>

                  <div className="mt-3 pl-10">
                    <a
                      href={`mailto:${VERIFIED_EMAIL}`}
                      className="font-mono text-sm sm:text-base font-bold text-[#F7F3EA] hover:text-[#E5C58D] transition-colors block truncate leading-tight"
                    >
                      {VERIFIED_EMAIL}
                    </a>
                    <span className="text-[11px] text-[#A3B8B0] block mt-1">
                      Guaranteed response within 24 business hours
                    </span>
                  </div>
                </div>
              </div>

              {/* Dedicated Catalogue Helper */}
              {onExploreCatalogue && (
                <div className="pt-2 border-t border-[#16382C]/70 flex items-center justify-between">
                  <span className="text-xs text-[#A3B8B0]">Need to view our fabric archive?</span>
                  <button
                    type="button"
                    onClick={onExploreCatalogue}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#E5C58D] hover:text-[#F7F3EA] transition-colors cursor-pointer"
                  >
                    <span>Digital Catalogue</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C49A55]" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* RIGHT COLUMN: UNIQUE INTERACTIVE CONTACT HUB (~60% WIDTH)             */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-7">
            <div className="bg-gradient-to-b from-[#0B1E17] via-[#091B14] to-[#071610] text-[#F7F3EA] border border-[#1A382C] rounded-3xl p-6 sm:p-9 shadow-[0_20px_60px_rgba(0,0,0,0.7)] relative space-y-7">
              {/* Luxury Annotation Badge Top Right */}
              <div
                aria-hidden="true"
                className="absolute -top-3.5 right-6 sm:right-8 flex items-center gap-2 bg-[#102C22] border border-[#C49A55]/60 text-[#E5C58D] px-3.5 py-1 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.7)] select-none pointer-events-none z-10"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C49A55] animate-pulse" />
                <span className="font-serif italic font-medium text-xs tracking-wide">
                  We are here to help you!
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#C49A55]" />
              </div>

              {/* Section Heading */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C49A55] font-semibold block mb-1">
                  INTERACTIVE CONTACT HUB
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#F7F3EA] tracking-tight">
                  Choose Your Enquiry Type
                </h3>
                <p className="text-xs sm:text-sm text-[#A3B8B0] mt-1">
                  Select an option to reveal tailored details and quick direct contact channels.
                </p>
              </div>

              {/* 1. Three Clickable Hub Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(Object.keys(HUB_OPTIONS) as HubOption[]).map((key) => {
                  const item = HUB_OPTIONS[key];
                  const Icon = item.icon;
                  const isSelected = activeHub === key;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setActiveHub(key);
                        if (errors.form) setErrors({});
                      }}
                      className={`relative text-left p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-3 group ${
                        isSelected
                          ? 'bg-[#14352A] border-[#C49A55] shadow-[0_0_25px_rgba(196,154,85,0.18)] ring-1 ring-[#C49A55]'
                          : 'bg-[#0E261E]/70 border-[#214738] hover:border-[#C49A55]/50 hover:bg-[#102C22]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-[#C49A55] text-[#071B15]'
                              : 'bg-[#16382C] text-[#C49A55] group-hover:scale-105'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-[#C49A55] text-[#071B15] flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono text-[#7A998D] uppercase tracking-wider">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      <div>
                        <h4
                          className={`font-serif text-sm sm:text-base font-bold transition-colors ${
                            isSelected ? 'text-[#F7F3EA]' : 'text-[#D8D2C5] group-hover:text-[#F7F3EA]'
                          }`}
                        >
                          {item.label}
                        </h4>
                        <p className="text-[11px] text-[#A3B8B0] mt-0.5 leading-snug line-clamp-2">
                          {item.tagline}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Context Banner: Explaining Selected Hub Option */}
              <div className="bg-[#0E261E]/80 border border-[#214738] rounded-2xl p-4 flex items-start gap-3 text-xs sm:text-sm text-[#D8D2C5] animate-in fade-in duration-200">
                <Sparkles className="w-4 h-4 text-[#C49A55] shrink-0 mt-0.5" />
                <p className="leading-relaxed">{currentHub.description}</p>
              </div>

              {/* 2. Quick Contact Interaction ("How would you like to connect?") */}
              <div className="space-y-4 pt-1 border-t border-[#16382C]/70">
                <div>
                  <h4 className="font-serif text-lg sm:text-xl font-bold text-[#F7F3EA] tracking-tight">
                    How would you like to connect?
                  </h4>
                  <p className="text-xs text-[#A3B8B0] mt-0.5">
                    Connect instantly via WhatsApp, direct phone call, email, or send a brief through our website.
                  </p>
                </div>

                {/* Interactive Channel Selector Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    {
                      id: 'message' as ChannelOption,
                      label: 'Send Message',
                      sub: 'Website Brief',
                      icon: MessageSquare,
                    },
                    {
                      id: 'whatsapp' as ChannelOption,
                      label: 'WhatsApp',
                      sub: 'Instant Chat',
                      icon: ExternalLink,
                    },
                    {
                      id: 'call' as ChannelOption,
                      label: 'Phone Call',
                      sub: 'Direct Line',
                      icon: Phone,
                    },
                    {
                      id: 'email' as ChannelOption,
                      label: 'Email',
                      sub: 'Official Desk',
                      icon: Mail,
                    },
                  ].map((ch) => {
                    const Icon = ch.icon;
                    const isSelected = activeChannel === ch.id;

                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => setActiveChannel(ch.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#16382C] border-[#C49A55] text-[#F7F3EA] shadow-[0_0_15px_rgba(196,154,85,0.15)] ring-1 ring-[#C49A55]'
                            : 'bg-[#0E261E]/60 border-[#214738] text-[#A3B8B0] hover:border-[#C49A55]/40 hover:bg-[#0E261E]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Icon
                            className={`w-3.5 h-3.5 ${
                              isSelected ? 'text-[#C49A55]' : 'text-[#7A998D]'
                            }`}
                          />
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C49A55]" />
                          )}
                        </div>
                        <span className="text-xs font-semibold block leading-tight">{ch.label}</span>
                        <span className="text-[10px] text-[#7A998D] block">{ch.sub}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Channel Option Details & Compact Forms */}
                <div className="mt-4">
                  {/* CHANNEL: WHATSAPP DIRECT */}
                  {activeChannel === 'whatsapp' && (
                    <div className="bg-[#0E261E]/90 border border-[#214738] rounded-2xl p-6 sm:p-7 space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] flex items-center justify-center shrink-0">
                          <ExternalLink className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="font-serif text-lg font-bold text-[#F7F3EA]">
                            Chat on WhatsApp
                          </h5>
                          <p className="text-xs text-[#A3B8B0]">
                            Direct Line: <span className="font-mono text-[#E5C58D] font-bold">{VERIFIED_PHONE}</span>
                          </p>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-[#D8D2C5] leading-relaxed">
                        Click below to open WhatsApp with a pre-formatted message tailored for your{' '}
                        <strong className="text-[#E5C58D]">{currentHub.label}</strong> inquiry.
                      </p>

                      <div className="p-3 bg-[#071B15] border border-[#1A382C] rounded-xl text-xs font-mono text-[#A3B8B0] line-clamp-3">
                        {currentHub.whatsappMessage}
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <a
                          href={getCustomWhatsAppUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[0_4px_15px_rgba(37,211,102,0.3)] active:scale-95"
                        >
                          <span>Open WhatsApp Chat</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          type="button"
                          onClick={() => setActiveChannel('message')}
                          className="px-4 py-3 rounded-xl border border-[#214738] bg-[#0E261E] text-xs font-mono text-[#A3B8B0] hover:text-[#F7F3EA] transition-colors"
                        >
                          Or send via website form
                        </button>
                      </div>
                    </div>
                  )}

                  {/* CHANNEL: PHONE CALL */}
                  {activeChannel === 'call' && (
                    <div className="bg-[#0E261E]/90 border border-[#214738] rounded-2xl p-6 sm:p-7 space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#16382C] border border-[#2C5E4B] text-[#C49A55] flex items-center justify-center shrink-0">
                          <Phone className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="font-serif text-lg font-bold text-[#F7F3EA]">
                            Direct Phone Call
                          </h5>
                          <p className="text-xs text-[#A3B8B0]">
                            Tiruppur Sampling &amp; Sourcing Desk
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-[#071B15] border border-[#1A382C] rounded-2xl flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-[#A3B8B0] uppercase block">
                            TELEPHONE NUMBER
                          </span>
                          <span className="font-mono text-xl sm:text-2xl font-bold text-[#E5C58D]">
                            {VERIFIED_PHONE}
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#25D366] bg-[#25D366]/15 border border-[#25D366]/30 px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                          <span>AVAILABLE</span>
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-[#D8D2C5] leading-relaxed">
                        Speak directly with our senior material coordinators regarding wholesale supply,
                        fabric lots, or manufacturing feasibility.
                      </p>

                      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <a
                          href={`tel:${VERIFIED_PHONE}`}
                          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#C49A55] to-[#B38744] hover:from-[#D4AF37] hover:to-[#C49A55] text-[#071B15] font-bold px-6 py-3 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[0_4px_15px_rgba(196,154,85,0.3)] active:scale-95"
                        >
                          <Phone className="w-4 h-4" />
                          <span>Call {VERIFIED_PHONE}</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => setActiveChannel('message')}
                          className="px-4 py-3 rounded-xl border border-[#214738] bg-[#0E261E] text-xs font-mono text-[#A3B8B0] hover:text-[#F7F3EA] transition-colors"
                        >
                          Or write to us online
                        </button>
                      </div>
                    </div>
                  )}

                  {/* CHANNEL: EMAIL */}
                  {activeChannel === 'email' && (
                    <div className="bg-[#0E261E]/90 border border-[#214738] rounded-2xl p-6 sm:p-7 space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#16382C] border border-[#2C5E4B] text-[#C49A55] flex items-center justify-center shrink-0">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="font-serif text-lg font-bold text-[#F7F3EA]">
                            Business Email
                          </h5>
                          <p className="text-xs text-[#A3B8B0]">
                            Guaranteed response within 24 business hours
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-[#071B15] border border-[#1A382C] rounded-2xl">
                        <span className="text-[10px] font-mono text-[#A3B8B0] uppercase block">
                          OFFICIAL EMAIL DESK
                        </span>
                        <a
                          href={`mailto:${VERIFIED_EMAIL}`}
                          className="font-mono text-lg sm:text-xl font-bold text-[#E5C58D] hover:underline"
                        >
                          {VERIFIED_EMAIL}
                        </a>
                      </div>

                      <p className="text-xs sm:text-sm text-[#D8D2C5] leading-relaxed">
                        Best suited for formal RFQs, purchase orders, technical spec sheets, and high-resolution design packages.
                      </p>

                      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <a
                          href={getCustomMailtoUrl()}
                          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#C49A55] to-[#B38744] hover:from-[#D4AF37] hover:to-[#C49A55] text-[#071B15] font-bold px-6 py-3 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[0_4px_15px_rgba(196,154,85,0.3)] active:scale-95"
                        >
                          <Mail className="w-4 h-4" />
                          <span>Compose Email</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => setActiveChannel('message')}
                          className="px-4 py-3 rounded-xl border border-[#214738] bg-[#0E261E] text-xs font-mono text-[#A3B8B0] hover:text-[#F7F3EA] transition-colors"
                        >
                          Or use the website form
                        </button>
                      </div>
                    </div>
                  )}

                  {/* CHANNEL: SEND WEBSITE ENQUIRY (COMPACT 3 REQUIRED FIELDS + OPTIONAL EMAIL) */}
                  {activeChannel === 'message' && (
                    <div>
                      {isSubmitted ? (
                        /* Submission Success Screen */
                        <div className="bg-[#0E261E]/95 border border-[#214738] rounded-2xl p-7 sm:p-9 text-center space-y-5 animate-in fade-in duration-300">
                          <div className="w-14 h-14 rounded-full bg-[#C49A55]/15 text-[#C49A55] flex items-center justify-center mx-auto ring-6 ring-[#C49A55]/10">
                            <CheckCircle2 className="w-7 h-7 text-[#C49A55]" />
                          </div>

                          <div className="space-y-1.5">
                            <span className="text-[11px] font-mono text-[#C49A55] uppercase font-bold tracking-wider">
                              ENQUIRY DISPATCHED • {currentHub.label}
                            </span>
                            <h4 className="font-serif text-2xl font-bold text-[#F7F3EA]">
                              Thank You, {formData.name}
                            </h4>
                            <p className="text-xs sm:text-sm text-[#A3B8B0] max-w-md mx-auto">
                              Your requirement has been logged with our Tiruppur sourcing desk. We will review
                              availability and contact you shortly.
                            </p>
                          </div>

                          <div className="inline-block bg-[#071B15] border border-[#214738] rounded-xl px-5 py-2.5">
                            <span className="text-[10px] font-mono text-[#A3B8B0] uppercase block">
                              Enquiry Reference Code
                            </span>
                            <span className="font-mono text-base font-bold text-[#E5C58D]">
                              {referenceCode}
                            </span>
                          </div>

                          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <a
                              href={getCustomWhatsAppUrl()}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-xs"
                            >
                              <span>Forward Reference via WhatsApp</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>

                            <button
                              type="button"
                              onClick={() => {
                                setIsSubmitted(false);
                                setFormData({
                                  name: '',
                                  phone: '',
                                  email: '',
                                  message: '',
                                });
                                setAttachedFiles([]);
                              }}
                              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#214738] bg-[#071B15] text-xs font-semibold text-[#A3B8B0] hover:text-[#F7F3EA] hover:border-[#C49A55] transition-colors cursor-pointer"
                            >
                              Send Another Message
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Compact 3-Field Form */
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="bg-[#0E261E]/80 border border-[#214738] rounded-2xl p-5 sm:p-6 space-y-4">
                            {/* Row 1: Name & Phone (Required) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {/* 1. Name */}
                              <div>
                                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A3B8B0] font-semibold mb-1">
                                  YOUR NAME <span className="text-[#C49A55]">*</span>
                                </label>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5A7C6E]">
                                    <User className="w-4 h-4" />
                                  </div>
                                  <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) =>
                                      setFormData({ ...formData, name: e.target.value })
                                    }
                                    placeholder="e.g. S. Murugan"
                                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-[#071B15] border border-[#214738] rounded-xl text-[#F7F3EA] placeholder-[#5A7C6E] focus:outline-none focus:border-[#C49A55] focus:ring-1 focus:ring-[#C49A55] transition-all"
                                  />
                                </div>
                                {errors.name && (
                                  <p className="text-[10px] text-[#F87171] mt-1">{errors.name}</p>
                                )}
                              </div>

                              {/* 2. Phone / WhatsApp */}
                              <div>
                                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A3B8B0] font-semibold mb-1">
                                  PHONE / WHATSAPP <span className="text-[#C49A55]">*</span>
                                </label>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5A7C6E]">
                                    <Phone className="w-4 h-4" />
                                  </div>
                                  <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) =>
                                      setFormData({ ...formData, phone: e.target.value })
                                    }
                                    placeholder="e.g. 98420 12345"
                                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-[#071B15] border border-[#214738] rounded-xl text-[#F7F3EA] placeholder-[#5A7C6E] focus:outline-none focus:border-[#C49A55] focus:ring-1 focus:ring-[#C49A55] transition-all"
                                  />
                                </div>
                                {errors.phone && (
                                  <p className="text-[10px] text-[#F87171] mt-1">{errors.phone}</p>
                                )}
                              </div>
                            </div>

                            {/* Row 2: Message (Required) */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A3B8B0] font-semibold">
                                  MESSAGE / REQUIREMENT <span className="text-[#C49A55]">*</span>
                                </label>
                                <span className="text-[10px] font-mono text-[#7A998D]">
                                  Targeting: {currentHub.label}
                                </span>
                              </div>
                              <textarea
                                rows={3}
                                required
                                value={formData.message}
                                onChange={(e) =>
                                  setFormData({ ...formData, message: e.target.value })
                                }
                                placeholder={currentHub.placeholderMessage}
                                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#071B15] border border-[#214738] rounded-xl text-[#F7F3EA] placeholder-[#5A7C6E] focus:outline-none focus:border-[#C49A55] focus:ring-1 focus:ring-[#C49A55] transition-all resize-none"
                              />
                            </div>

                            {/* Row 3: Email (Optional) */}
                            <div>
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A3B8B0] font-semibold mb-1">
                                EMAIL ADDRESS <span className="font-normal text-[10px] text-[#7A998D]">(Optional)</span>
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5A7C6E]">
                                  <Mail className="w-4 h-4" />
                                </div>
                                <input
                                  type="email"
                                  value={formData.email}
                                  onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                  }
                                  placeholder="buyer@domain.com (if you prefer email reply)"
                                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-[#071B15] border border-[#214738] rounded-xl text-[#F7F3EA] placeholder-[#5A7C6E] focus:outline-none focus:border-[#C49A55] focus:ring-1 focus:ring-[#C49A55] transition-all"
                                />
                              </div>
                              {errors.email && (
                                <p className="text-[10px] text-[#F87171] mt-1">{errors.email}</p>
                              )}
                            </div>
                          </div>

                          {/* Row 4: Attach Files & Send Enquiry Button */}
                          <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                            {/* Optional File Attachment */}
                            <div>
                              <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/jpeg,image/png,application/pdf"
                                className="hidden"
                                onChange={handleFileChange}
                              />
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 px-3 py-2 bg-[#0E261E]/80 hover:bg-[#123026] text-[#A3B8B0] border border-[#214738] rounded-xl text-xs cursor-pointer transition-colors text-left"
                              >
                                <Paperclip className="w-3.5 h-3.5 text-[#C49A55]" />
                                <div>
                                  <span className="font-semibold block leading-tight text-[#F7F3EA]">
                                    Attach Swatch / Specs <span className="font-normal text-[10px] text-[#7A998D]">(Optional)</span>
                                  </span>
                                  <span className="text-[10px] text-[#5A7C6E] block">
                                    Max 5 files, up to 10MB each
                                  </span>
                                </div>
                              </button>

                              {attachedFiles.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {attachedFiles.map((file, i) => (
                                    <span
                                      key={i}
                                      className="inline-flex items-center gap-1 bg-[#102C22] border border-[#214738] rounded px-2 py-0.5 text-[10px] text-[#E5C58D]"
                                    >
                                      <span className="truncate max-w-[130px]">{file.name}</span>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveFile(i)}
                                        className="text-[#A3B8B0] hover:text-[#F87171] cursor-pointer"
                                      >
                                        <X className="w-2.5 h-2.5" />
                                      </button>
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Clear "Send Enquiry" Button */}
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#C49A55] to-[#B38744] hover:from-[#D4AF37] hover:to-[#C49A55] text-[#071B15] font-bold px-8 py-3.5 rounded-xl font-medium text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[0_4px_20px_rgba(196,154,85,0.3)] hover:shadow-[0_0_25px_rgba(196,154,85,0.5)] active:scale-95 cursor-pointer disabled:opacity-50 shrink-0"
                            >
                              {isSubmitting ? (
                                <span>Sending Brief...</span>
                              ) : (
                                <>
                                  <span>Send Enquiry</span>
                                  <Send className="w-4 h-4 text-[#071B15]" />
                                </>
                              )}
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
