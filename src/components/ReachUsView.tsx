import React, { useState, useRef, useEffect } from 'react';
import { businessConfig } from '../data/businessConfig.ts';
import { ContactFormState } from '../types.ts';
import {
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  ExternalLink,
  User,
  Building,
  Box,
  Package,
  Paperclip,
  Check,
  Grid,
  CircleDot,
  Scissors,
  Sparkles,
  ArrowRight,
  X,
  AlertCircle,
} from 'lucide-react';

interface ReachUsViewProps {
  onExploreCatalogue?: () => void;
}

const Atelier3D = React.lazy(() => import('./Atelier3D.tsx'));
const VERIFIED_PHONE = '+91 88264 15868';
const VERIFIED_PHONE_RAW = '918826415868';
const VERIFIED_EMAIL = 'material@classicfashions.com';
const STORAGE_ENQUIRIES_KEY = 'cf_reach_us_enquiries_v1';

export const ReachUsView: React.FC<ReachUsViewProps> = ({ onExploreCatalogue }) => {
  // Form State
  const [formState, setFormState] = useState<ContactFormState>({
    name: '',
    companyName: '',
    phone: '',
    email: '',
    interestedCategory: 'Fabrics',
    product: '',
    quantity: '',
    message: '',
  });

  // Attached files
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; sizeKb: number }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceCode, setReferenceCode] = useState('');
  // true only when a configured endpoint confirmed receipt (res.ok)
  const [delivered, setDelivered] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 3D Parallax state for Hero Atelier
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  // Parallax mouse move handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

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

  // Validation
  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formState.name || formState.name.trim().length < 2) {
      errs.name = 'Please enter your name.';
    }
    if (!formState.phone || formState.phone.trim().length < 7) {
      errs.phone = 'Please enter a valid phone number.';
    }
    if (
      formState.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email.trim())
    ) {
      errs.email = 'Please enter a valid email address.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // block duplicate submissions
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});
    const timestamp = Date.now();
    const code = `CF-ENQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const record = {
      ...formState,
      id: `enquiry-${timestamp}`,
      referenceCode: code,
      attachedFiles, // file names only: files are not uploaded (no storage endpoint)
      submittedAt: timestamp,
    };

    // INTEGRATION BOUNDARY: set VITE_ENQUIRY_ENDPOINT to a URL that accepts JSON POST.
    const endpoint = import.meta.env.VITE_ENQUIRY_ENDPOINT as string | undefined;
    let ok = false;
    if (endpoint) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record),
        });
        ok = res.ok;
      } catch {
        ok = false;
      }
      if (!ok) {
        // keep the user's values; show error, no success screen
        setErrors({ form: 'We could not send your enquiry. Please try again, or contact us via WhatsApp / email.' });
        setIsSubmitting(false);
        return;
      }
    }

    // Local copy for reference (device only)
    try {
      const existing = localStorage.getItem(STORAGE_ENQUIRIES_KEY);
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(record);
      localStorage.setItem(STORAGE_ENQUIRIES_KEY, JSON.stringify(list));
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }

    setDelivered(ok);
    setReferenceCode(code);
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const getWhatsAppEnquiryUrl = () => {
    const msg = encodeURIComponent(
      `Hello Classic Fashions, I am reaching out from your website.\n\n` +
        `*Reference:* ${referenceCode || 'General Enquiry'}\n` +
        `*Name:* ${formState.name}\n` +
        `*Company:* ${formState.companyName || 'N/A'}\n` +
        `*Interested In:* ${formState.interestedCategory}\n` +
        `*Product:* ${formState.product || 'Standard Sourcing'}\n` +
        `*Quantity:* ${formState.quantity || 'Flexible'}\n` +
        `*Message:* ${formState.message || 'Please send pricing and swatch availability.'}`
    );
    return `https://wa.me/${VERIFIED_PHONE_RAW}?text=${msg}`;
  };

  return (
    <div className="bg-[#080A08] text-[#F3EBDD] min-h-screen pb-28 relative overflow-hidden font-sans selection:bg-[#C49A55] selection:text-[#080A08]">
      {/* Ambient Dark Forest Green & Gold Background Lighting */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-full sm:w-3/4 h-[700px] pointer-events-none opacity-45 mix-blend-screen"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 75% 20%, rgba(16, 44, 34, 0.95), rgba(7, 27, 21, 0.4) 50%, transparent 80%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute top-40 left-0 w-[500px] h-[500px] pointer-events-none opacity-20"
        style={{
          background:
            'radial-gradient(circle at 20% 40%, rgba(196, 154, 85, 0.15), transparent 70%)',
        }}
      />

      {/* ========================================================================= */}
      {/* HERO SECTION — 3D LUXURY TEXTILE ATELIER (NO "GET IN TOUCH" LABEL)       */}
      {/* ========================================================================= */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative pt-10 sm:pt-16 pb-12 sm:pb-16 border-b border-[#1A382C]/60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Direct Editorial Heading & Subtitle */}
            <div className="lg:col-span-6 space-y-6">
              {/* Heading starts directly without "GET IN TOUCH" */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-[#F3EBDD] leading-[1.12]">
                Let's Create <br />
                Something{' '}
                <span className="text-[#C49A55] font-serif italic font-normal tracking-normal drop-shadow-[0_2px_12px_rgba(196,154,85,0.25)]">
                  Exceptional
                </span>
              </h1>

              {/* Supporting Copy */}
              <p className="text-sm sm:text-base text-[#A3B8B0] leading-relaxed max-w-xl">
                Talk to our team about fabrics, garment accessories, wholesale orders and custom
                edge processing in Tiruppur.
              </p>

              {/* Gold Thread Spool Line Art & Promise */}
              <div className="pt-2 flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full border border-[#C49A55]/40 flex items-center justify-center text-[#C49A55] bg-[#071B15] shadow-[0_0_15px_rgba(196,154,85,0.15)] shrink-0">
                  {/* Spool SVG Line Art */}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                  >
                    <path
                      d="M6 3h12M6 21h12M8 3v18M16 3v18M8 7h8M8 12h8M8 17h8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-serif italic text-sm sm:text-base text-[#E6C995] tracking-wide leading-tight">
                    Fabric is our passion. Quality is our promise.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Haute Couture Architectural Textile Installation Showcase */}
            <div className="lg:col-span-6 relative">
              {/* Ambient Glow */}
              <div
                aria-hidden="true"
                className="absolute -inset-4 bg-gradient-to-tr from-[#16382C]/50 via-[#C49A55]/15 to-transparent rounded-3xl blur-2xl opacity-60 pointer-events-none"
              />
              <div
                className="relative rounded-2xl overflow-hidden border border-[#214738] shadow-[0_20px_50px_rgba(0,0,0,0.65)] bg-[#071B15] transition-transform duration-200 ease-out"
                style={{
                  transform: `perspective(1000px) rotateY(${mousePos.x * 4}deg) rotateX(${
                    -mousePos.y * 4
                  }deg)`,
                }}
              >
                {/* Unique Architectural Textile Scene */}
                <div className="relative aspect-[16/9] sm:aspect-[2/1] w-full bg-[#071B15] overflow-hidden">
                  <React.Suspense
                    fallback={<img src="/assets/reach-us/hero-atelier-3d-hd.jpg" alt="Classic Fashions textile atelier" className="w-full h-full object-cover" />}
                  >
                    <Atelier3D />
                  </React.Suspense>

                  {/* Soft Subtle Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071B15]/40 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MAIN TWO-COLUMN SECTION: "LET'S CONNECT" 3D CARDS + "SEND US AN ENQUIRY"  */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* --------------------------------------------------------------------- */}
          {/* LEFT COLUMN: "LET'S CONNECT" CONTACT SECTION (~42% WIDTH)             */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-b from-[#0B1E17] to-[#071712] border border-[#1A382C] rounded-2xl p-6 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.55)] space-y-6 relative overflow-hidden">
              {/* Gold Top Light Line */}
              <div className="space-y-1.5">
                <h2 className="font-serif text-2xl font-bold text-[#F3EBDD] tracking-tight">
                  Let's Connect
                </h2>
                <div className="w-10 h-0.5 bg-[#C49A55] rounded-full" />
              </div>

              {/* 3 Contact Cards (Clean, Luxury, No Thumbnail Images) */}
              <div className="space-y-4">
                {/* 1. OUR STUDIO */}
                <div className="bg-[#0E261E]/80 border border-[#214738] hover:border-[#C49A55]/60 rounded-xl p-5 transition-all duration-300 group shadow-md hover:shadow-lg">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#16382C] text-[#C49A55] border border-[#2C5E4B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-mono uppercase tracking-widest text-[#A3B8B0] font-semibold">
                        OUR ATELIER &amp; STUDIO
                      </span>
                    </div>

                    <a
                      href={mapsSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-[#C49A55] hover:text-[#E6C995] bg-[#16382C]/70 hover:bg-[#16382C] border border-[#2C5E4B] px-3 py-1 rounded-lg transition-colors shrink-0"
                    >
                      <span>Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="mt-3 pl-10">
                    <p className="text-xs sm:text-sm text-[#F3EBDD] leading-relaxed font-medium">
                      {businessConfig.addressLine1},<br />
                      {businessConfig.addressLine2},<br />
                      {businessConfig.city}, {businessConfig.state} – {businessConfig.pincode}
                    </p>
                    <span className="text-[11px] text-[#A3B8B0] block mt-1.5">
                      Fabric &amp; Trims Sourcing District • Tiruppur
                    </span>
                  </div>
                </div>

                {/* 2. CALL OUR TEAM */}
                <div className="bg-[#0E261E]/80 border border-[#214738] hover:border-[#C49A55]/60 rounded-xl p-5 transition-all duration-300 group shadow-md hover:shadow-lg">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#16382C] text-[#C49A55] border border-[#2C5E4B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Phone className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-mono uppercase tracking-widest text-[#A3B8B0] font-semibold">
                        CALL OUR TEAM
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold text-[#E6C995] bg-[#16382C]/70 border border-[#2C5E4B] px-2.5 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                      <span>DIRECT DESK</span>
                    </span>
                  </div>

                  <div className="mt-3 pl-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <a
                        href={`tel:${VERIFIED_PHONE}`}
                        className="font-mono text-base sm:text-lg font-bold text-[#F3EBDD] hover:text-[#E6C995] transition-colors block leading-tight"
                      >
                        {VERIFIED_PHONE}
                      </a>
                      <span className="text-[11px] text-[#A3B8B0] block mt-0.5">
                        Direct Wholesale &amp; Sampling Desk
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${VERIFIED_PHONE}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16382C] hover:bg-[#1f4a3b] border border-[#2C5E4B] text-[11px] font-mono text-[#E6C995] transition-colors"
                      >
                        <Phone className="w-3 h-3 text-[#C49A55]" />
                        <span>Call</span>
                      </a>
                      <a
                        href={`https://wa.me/${VERIFIED_PHONE_RAW}?text=${encodeURIComponent('Hello Classic Fashions, I would like to enquire about your textile sourcing.')}`}
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

                {/* 3. BUSINESS ENQUIRIES */}
                <div className="bg-[#0E261E]/80 border border-[#214738] hover:border-[#C49A55]/60 rounded-xl p-5 transition-all duration-300 group shadow-md hover:shadow-lg">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#16382C] text-[#C49A55] border border-[#2C5E4B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-mono uppercase tracking-widest text-[#A3B8B0] font-semibold">
                        BUSINESS ENQUIRIES
                      </span>
                    </div>

                    <a
                      href={`mailto:${VERIFIED_EMAIL}`}
                      className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-[#C49A55] hover:text-[#E6C995] bg-[#16382C]/70 hover:bg-[#16382C] border border-[#2C5E4B] px-3 py-1 rounded-lg transition-colors shrink-0"
                    >
                      <Mail className="w-3 h-3" />
                      <span>Send Mail</span>
                    </a>
                  </div>

                  <div className="mt-3 pl-10">
                    <a
                      href={`mailto:${VERIFIED_EMAIL}`}
                      className="font-mono text-sm sm:text-base font-bold text-[#F3EBDD] hover:text-[#E6C995] transition-colors block truncate leading-tight"
                    >
                      {VERIFIED_EMAIL}
                    </a>
                    <span className="text-[11px] text-[#A3B8B0] block mt-1">
                      Guaranteed response within 24 business hours
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* RIGHT COLUMN: "SEND US AN ENQUIRY" DARK LUXURY EMERALD PANEL (~58%)   */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-7">
            <div className="bg-gradient-to-b from-[#0B1E17] via-[#091B14] to-[#071610] text-[#F3EBDD] border border-[#1A382C] rounded-2xl p-7 sm:p-9 shadow-[0_20px_60px_rgba(0,0,0,0.7)] relative space-y-6">
              {/* Handwritten Note / Luxury Badge Annotation on Top Right */}
              <div
                aria-hidden="true"
                className="absolute -top-3.5 right-6 flex items-center gap-2 bg-[#102C22] border border-[#C49A55]/60 text-[#E6C995] px-3.5 py-1 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.7)] select-none pointer-events-none z-10"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C49A55] animate-pulse" />
                <span className="font-serif italic font-medium text-xs tracking-wide">
                  We are here to help you!
                </span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-[#C49A55] transform rotate-45"
                >
                  <path
                    d="M5 12h14M12 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#F3EBDD] tracking-tight">
                  Send Us an Enquiry
                </h3>
                <p className="text-xs sm:text-sm text-[#A3B8B0] mt-1">
                  Share your requirements and our sourcing desk will prepare custom options and
                  pricing.
                </p>
              </div>

              {/* Success Confirmation Screen if submitted */}
              {isSubmitted ? (
                <div className="bg-[#0E261E]/90 border border-[#214738] rounded-xl p-8 text-center space-y-5 animate-in fade-in duration-300">
                  <div className="w-14 h-14 rounded-full bg-[#C49A55]/15 text-[#C49A55] flex items-center justify-center mx-auto ring-6 ring-[#C49A55]/10">
                    <CheckCircle2 className="w-7 h-7 text-[#C49A55]" />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono text-[#C49A55] uppercase font-bold tracking-wider">
                      {delivered ? 'ENQUIRY RECEIVED' : 'ENQUIRY PREPARED — NOT YET SENT'}
                    </span>
                    <h4 className="font-serif text-2xl font-bold text-[#F3EBDD]">
                      Thank You, {formState.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#A3B8B0] max-w-md mx-auto">
                      {delivered
                        ? 'Your enquiry has reached our Tiruppur sourcing office. We will review availability and contact you promptly.'
                        : 'Your enquiry is saved on this device only. To deliver it to our team, please send it via WhatsApp or email using the buttons below.'}
                    </p>
                  </div>

                  <div className="inline-block bg-[#071B15] border border-[#214738] rounded-lg px-4 py-2">
                    <span className="text-[10px] font-mono text-[#A3B8B0] uppercase block">
                      Enquiry Reference
                    </span>
                    <span className="font-mono text-sm font-bold text-[#E6C995]">
                      {referenceCode}
                    </span>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={getWhatsAppEnquiryUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all shadow-xs"
                    >
                      <span>{delivered ? 'Connect via WhatsApp' : 'Send via WhatsApp'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {!delivered && (
                      <a
                        href={`mailto:${VERIFIED_EMAIL}?subject=${encodeURIComponent(`Enquiry ${referenceCode}`)}&body=${encodeURIComponent(`Name: ${formState.name}\nCompany: ${formState.companyName || 'N/A'}\nPhone: ${formState.phone}\nInterested in: ${formState.interestedCategory}\nProduct: ${formState.product || 'N/A'}\nQuantity: ${formState.quantity || 'N/A'}\n\n${formState.message}`)}`}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#C49A55]/60 text-[#E6C995] hover:bg-[#C49A55]/10 px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all"
                      >
                        Send via Email
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setIsSubmitted(false);
                        setDelivered(false);
                        setFormState({
                          name: '',
                          companyName: '',
                          phone: '',
                          email: '',
                          interestedCategory: 'Fabrics',
                          product: '',
                          quantity: '',
                          message: '',
                        });
                        setAttachedFiles([]);
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-[#214738] bg-[#071B15] text-xs font-semibold text-[#A3B8B0] hover:text-[#F3EBDD] hover:border-[#C49A55] transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                /* Main Enquiry Form */
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Row 1: Name & Company Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A3B8B0] font-semibold mb-1">
                        NAME <span className="text-[#C49A55]">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5A7C6E]">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          placeholder="e.g. S. Murugan"
                          className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-[#0E261E]/80 border border-[#214738] rounded-xl text-[#F3EBDD] placeholder-[#5A7C6E] focus:outline-none focus:border-[#C49A55] focus:ring-1 focus:ring-[#C49A55] transition-all"
                        />
                      </div>
                      {errors.name && <p className="text-[10px] text-[#F87171] mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A3B8B0] font-semibold mb-1">
                        COMPANY NAME
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5A7C6E]">
                          <Building className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={formState.companyName}
                          onChange={(e) =>
                            setFormState({ ...formState, companyName: e.target.value })
                          }
                          placeholder="e.g. Tiruppur Apparel Unit"
                          className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-[#0E261E]/80 border border-[#214738] rounded-xl text-[#F3EBDD] placeholder-[#5A7C6E] focus:outline-none focus:border-[#C49A55] focus:ring-1 focus:ring-[#C49A55] transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A3B8B0] font-semibold mb-1">
                        PHONE <span className="text-[#C49A55]">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5A7C6E]">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          required
                          value={formState.phone}
                          onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                          placeholder="e.g. 98420 12345"
                          className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-[#0E261E]/80 border border-[#214738] rounded-xl text-[#F3EBDD] placeholder-[#5A7C6E] focus:outline-none focus:border-[#C49A55] focus:ring-1 focus:ring-[#C49A55] transition-all"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-[10px] text-[#F87171] mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A3B8B0] font-semibold mb-1">
                        EMAIL <span className="text-[#C49A55]">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5A7C6E]">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          required
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          placeholder="buyer@domain.com"
                          className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-[#0E261E]/80 border border-[#214738] rounded-xl text-[#F3EBDD] placeholder-[#5A7C6E] focus:outline-none focus:border-[#C49A55] focus:ring-1 focus:ring-[#C49A55] transition-all"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-[10px] text-[#F87171] mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Row 3: I AM INTERESTED IN (3 Selectable Pill Options matching Mockup) */}
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A3B8B0] font-semibold">
                      I AM INTERESTED IN <span className="text-[#C49A55]">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        { label: 'Fabrics', icon: Grid },
                        { label: 'Garment Accessories', icon: CircleDot },
                        { label: 'Custom Processing', icon: Scissors },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isSelected = formState.interestedCategory === item.label;

                        return (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() =>
                              setFormState({ ...formState, interestedCategory: item.label })
                            }
                            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#16382C] text-[#E6C995] border-[#C49A55] shadow-xs'
                                : 'bg-[#0E261E]/80 text-[#A3B8B0] border-[#214738] hover:border-[#C49A55]/50'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <Icon className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{item.label}</span>
                            </div>
                            {isSelected && (
                              <div className="w-4 h-4 rounded-full bg-[#C49A55] text-[#071B15] flex items-center justify-center shrink-0">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Row 4: Product / Material & Quantity */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A3B8B0] font-semibold mb-1">
                        PRODUCT / MATERIAL
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5A7C6E]">
                          <Box className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={formState.product}
                          onChange={(e) => setFormState({ ...formState, product: e.target.value })}
                          placeholder="e.g. Poplin Gada / Cotton Lace / Lycra Mesh"
                          className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-[#0E261E]/80 border border-[#214738] rounded-xl text-[#F3EBDD] placeholder-[#5A7C6E] focus:outline-none focus:border-[#C49A55] focus:ring-1 focus:ring-[#C49A55] transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A3B8B0] font-semibold mb-1">
                        QUANTITY (Approx.)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5A7C6E]">
                          <Package className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={formState.quantity}
                          onChange={(e) => setFormState({ ...formState, quantity: e.target.value })}
                          placeholder="e.g. 500 Meters / 1000 pcs"
                          className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-[#0E261E]/80 border border-[#214738] rounded-xl text-[#F3EBDD] placeholder-[#5A7C6E] focus:outline-none focus:border-[#C49A55] focus:ring-1 focus:ring-[#C49A55] transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 5: Message */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A3B8B0] font-semibold mb-1">
                      MESSAGE
                    </label>
                    <textarea
                      rows={3}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Tell us about your material needs, specification or any other details..."
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#0E261E]/80 border border-[#214738] rounded-xl text-[#F3EBDD] placeholder-[#5A7C6E] focus:outline-none focus:border-[#C49A55] focus:ring-1 focus:ring-[#C49A55] transition-all resize-none"
                    />
                  </div>

                  {/* Row 6: Attach Files & Send Enquiry Button */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    {/* Attach Files (Optional) */}
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
                          <span className="font-semibold block leading-tight text-[#F3EBDD]">
                            Attach Files <span className="font-normal text-[10px] text-[#A3B8B0]">(Optional)</span>
                          </span>
                          <span className="text-[10px] text-[#5A7C6E] block">
                            Max 5 files, upto 10MB each (JPG, PNG, PDF)
                          </span>
                        </div>
                      </button>

                      {/* Display attached file chips */}
                      {attachedFiles.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {attachedFiles.map((file, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 bg-[#102C22] border border-[#214738] rounded px-2 py-0.5 text-[10px] text-[#E6C995]"
                            >
                              <span className="truncate max-w-[120px]">{file.name}</span>
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

                    {/* Submit Primary Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#C49A55] to-[#B38744] hover:from-[#D4AF37] hover:to-[#C49A55] text-[#071B15] font-bold px-8 py-3.5 rounded-xl font-medium text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[0_4px_20px_rgba(196,154,85,0.3)] hover:shadow-[0_0_25px_rgba(196,154,85,0.5)] active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Sending...</span>
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
          </div>
        </div>
      </div>
    </div>
  );
};
