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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const timestamp = Date.now();
      const code = `CF-ENQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const record = {
        ...formState,
        id: `enquiry-${timestamp}`,
        referenceCode: code,
        attachedFiles,
        submittedAt: timestamp,
      };

      // Save locally
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
    } catch (err) {
      setErrors({ form: 'Failed to process enquiry. Please WhatsApp us directly.' });
    } finally {
      setIsSubmitting(false);
    }
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

            {/* Right Column: 3D Textile Atelier Showcase Vignette */}
            <div className="lg:col-span-6 relative">
              <div
                className="relative rounded-2xl overflow-hidden border border-[#214738] shadow-[0_20px_50px_rgba(0,0,0,0.65)] bg-[#071B15] transition-transform duration-200 ease-out"
                style={{
                  transform: `perspective(1000px) rotateY(${mousePos.x * 4}deg) rotateX(${
                    -mousePos.y * 4
                  }deg)`,
                }}
              >
                {/* 3D Atelier Realistic Scene Crop */}
                <div className="relative aspect-[16/9] sm:aspect-[2.05/1] w-full bg-[#071B15] overflow-hidden">
                  <img
                    src="/assets/reach-us/hero-atelier-3d.jpg"
                    alt="Classic Fashions 3D Textile Atelier with Vintage Sewing Machine and Fabrics"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />

                  {/* Soft Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071B15]/90 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#071B15]/40 via-transparent to-[#071B15]/40 pointer-events-none" />

                  {/* Interactive Hotspot Badges floating on the scene */}
                  <div className="absolute bottom-3 left-4 hidden sm:flex items-center gap-2 bg-[#071B15]/85 backdrop-blur-md border border-[#C49A55]/40 px-3 py-1.5 rounded-full text-[11px] font-mono text-[#E6C995] shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-[#C49A55] animate-pulse" />
                    <span>3D Textile Atelier • Tiruppur</span>
                  </div>
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
          {/* LEFT COLUMN: "LET'S CONNECT" 3D CONTACT SECTION (~42% WIDTH)          */}
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

              {/* 3 Contact Cards with 3D Models on the Right */}
              <div className="space-y-4">
                {/* 1. OUR STUDIO */}
                <div className="bg-[#0E261E]/80 border border-[#214738] hover:border-[#C49A55]/60 rounded-xl p-4 transition-all duration-300 group flex items-center justify-between gap-3 shadow-md">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#16382C] text-[#C49A55] border border-[#2C5E4B] flex items-center justify-center shrink-0">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#A3B8B0] font-semibold">
                        OUR STUDIO
                      </span>
                    </div>

                    <p className="text-xs text-[#F3EBDD] leading-relaxed pl-9">
                      {businessConfig.addressLine1},<br />
                      {businessConfig.addressLine2},<br />
                      {businessConfig.city}, {businessConfig.state} – {businessConfig.pincode}
                    </p>

                    <div className="pl-9 pt-0.5">
                      <a
                        href={mapsSearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-[#C49A55] hover:text-[#E6C995] transition-colors"
                      >
                        <span>Open in Google Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* 3D Miniature Studio Building on Right */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden shrink-0 border border-[#214738] bg-black/40 group-hover:scale-105 transition-transform duration-300">
                    <img
                      src="/assets/reach-us/card-studio-building.jpg"
                      alt="Classic Fashions Studio Building in Tiruppur"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* 2. CALL OUR TEAM */}
                <div className="bg-[#0E261E]/80 border border-[#214738] hover:border-[#C49A55]/60 rounded-xl p-4 transition-all duration-300 group flex items-center justify-between gap-3 shadow-md">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#16382C] text-[#C49A55] border border-[#2C5E4B] flex items-center justify-center shrink-0">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#A3B8B0] font-semibold">
                        CALL OUR TEAM
                      </span>
                    </div>

                    <div className="pl-9">
                      <a
                        href={`tel:${VERIFIED_PHONE}`}
                        className="font-mono text-sm sm:text-base font-bold text-[#F3EBDD] hover:text-[#E6C995] transition-colors block leading-tight"
                      >
                        {VERIFIED_PHONE}
                      </a>
                      <span className="text-[11px] text-[#A3B8B0] block mt-0.5">
                        Direct Wholesale Desk
                      </span>
                    </div>
                  </div>

                  {/* 3D Vintage Rotary Telephone on Right */}
                  <div className="w-20 h-16 sm:w-24 sm:h-18 rounded-lg overflow-hidden shrink-0 border border-[#214738] bg-black/40 group-hover:scale-105 transition-transform duration-300">
                    <img
                      src="/assets/reach-us/card-vintage-phone.jpg"
                      alt="Direct Wholesale Desk Phone"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* 3. BUSINESS ENQUIRIES */}
                <div className="bg-[#0E261E]/80 border border-[#214738] hover:border-[#C49A55]/60 rounded-xl p-4 transition-all duration-300 group flex items-center justify-between gap-3 shadow-md">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#16382C] text-[#C49A55] border border-[#2C5E4B] flex items-center justify-center shrink-0">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#A3B8B0] font-semibold">
                        BUSINESS ENQUIRIES
                      </span>
                    </div>

                    <div className="pl-9">
                      <a
                        href={`mailto:${VERIFIED_EMAIL}`}
                        className="font-mono text-xs sm:text-sm font-bold text-[#F3EBDD] hover:text-[#E6C995] transition-colors block truncate leading-tight"
                      >
                        {VERIFIED_EMAIL}
                      </a>
                      <span className="text-[11px] text-[#A3B8B0] block mt-0.5">
                        We reply within 24 hours
                      </span>
                    </div>
                  </div>

                  {/* 3D Wax-Sealed CF Envelope on Right */}
                  <div className="w-20 h-16 sm:w-24 sm:h-18 rounded-lg overflow-hidden shrink-0 border border-[#214738] bg-black/40 group-hover:scale-105 transition-transform duration-300">
                    <img
                      src="/assets/reach-us/card-wax-envelope.jpg"
                      alt="Classic Fashions Business Enquiries Wax Sealed Envelope"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* RIGHT COLUMN: "SEND US AN ENQUIRY" FLOATING WARM-IVORY PANEL (~58%)    */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-7">
            <div className="bg-[#F7F4EC] text-[#181715] border border-[#E3DCCE] rounded-2xl p-7 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.65)] relative space-y-6">
              {/* Handwritten Note Annotation on Top Right */}
              <div
                aria-hidden="true"
                className="absolute -top-3 right-6 hidden sm:flex items-center gap-1.5 text-[#A45B3E] select-none pointer-events-none transform rotate-3"
              >
                <span className="font-serif italic font-medium text-xs tracking-wide">
                  We are here to help you!
                </span>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-[#A45B3E]"
                >
                  <path
                    d="M4 4 C12 6, 16 14, 18 20 M14 18 L18 21 L21 16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#181715] tracking-tight">
                  Send Us an Enquiry
                </h3>
                <p className="text-xs sm:text-sm text-[#736F68] mt-1">
                  Share your requirements and our sourcing desk will prepare custom options and
                  pricing.
                </p>
              </div>

              {/* Success Confirmation Screen if submitted */}
              {isSubmitted ? (
                <div className="bg-white border border-[#E3DCCE] rounded-xl p-8 text-center space-y-5 animate-in fade-in duration-300">
                  <div className="w-14 h-14 rounded-full bg-[#102C22]/10 text-[#102C22] flex items-center justify-center mx-auto ring-6 ring-[#102C22]/5">
                    <CheckCircle2 className="w-7 h-7 text-[#102C22]" />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono text-[#C49A55] uppercase font-bold tracking-wider">
                      ENQUIRY DISPATCHED
                    </span>
                    <h4 className="font-serif text-2xl font-bold text-[#181715]">
                      Thank You, {formState.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#585550] max-w-md mx-auto">
                      Your enquiry has been logged successfully with our Tiruppur sourcing office.
                      We will review availability and contact you promptly.
                    </p>
                  </div>

                  <div className="inline-block bg-[#FAF8F5] border border-[#E3DCCE] rounded-lg px-4 py-2">
                    <span className="text-[10px] font-mono text-[#8C877E] uppercase block">
                      Enquiry Reference
                    </span>
                    <span className="font-mono text-sm font-bold text-[#181715]">
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
                      <span>Connect via WhatsApp</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setIsSubmitted(false);
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
                      className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-[#D5D0C6] text-xs font-semibold text-[#585550] hover:text-[#181715] hover:bg-stone-50 transition-colors"
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
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-[#585550] font-semibold mb-1">
                        NAME *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          placeholder="e.g. S. Murugan"
                          className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-white border border-[#D5D0C6] rounded-lg text-[#181715] placeholder-stone-400 focus:outline-none focus:border-[#102C22] focus:ring-1 focus:ring-[#102C22]"
                        />
                      </div>
                      {errors.name && <p className="text-[10px] text-red-600 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-[#585550] font-semibold mb-1">
                        COMPANY NAME
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                          <Building className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={formState.companyName}
                          onChange={(e) =>
                            setFormState({ ...formState, companyName: e.target.value })
                          }
                          placeholder="e.g. Tiruppur Apparel Unit"
                          className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-white border border-[#D5D0C6] rounded-lg text-[#181715] placeholder-stone-400 focus:outline-none focus:border-[#102C22] focus:ring-1 focus:ring-[#102C22]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-[#585550] font-semibold mb-1">
                        PHONE *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          required
                          value={formState.phone}
                          onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                          placeholder="e.g. 98420 12345"
                          className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-white border border-[#D5D0C6] rounded-lg text-[#181715] placeholder-stone-400 focus:outline-none focus:border-[#102C22] focus:ring-1 focus:ring-[#102C22]"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-[10px] text-red-600 mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-[#585550] font-semibold mb-1">
                        EMAIL *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          required
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          placeholder="buyer@domain.com"
                          className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-white border border-[#D5D0C6] rounded-lg text-[#181715] placeholder-stone-400 focus:outline-none focus:border-[#102C22] focus:ring-1 focus:ring-[#102C22]"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-[10px] text-red-600 mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Row 3: I AM INTERESTED IN (3 Selectable Pill Options matching Mockup) */}
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#585550] font-semibold">
                      I AM INTERESTED IN *
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
                            className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#102C22] text-white border-[#102C22] shadow-sm'
                                : 'bg-white text-[#4A4742] border-[#D5D0C6] hover:border-[#102C22]'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <Icon className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{item.label}</span>
                            </div>
                            {isSelected && (
                              <div className="w-4 h-4 rounded-full bg-[#C49A55] text-[#080A08] flex items-center justify-center shrink-0">
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
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-[#585550] font-semibold mb-1">
                        PRODUCT / MATERIAL
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                          <Box className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={formState.product}
                          onChange={(e) => setFormState({ ...formState, product: e.target.value })}
                          placeholder="e.g. Poplin Gada / Cotton Lace / Lycra Mesh"
                          className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-white border border-[#D5D0C6] rounded-lg text-[#181715] placeholder-stone-400 focus:outline-none focus:border-[#102C22] focus:ring-1 focus:ring-[#102C22]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-[#585550] font-semibold mb-1">
                        QUANTITY (Approx.)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                          <Package className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={formState.quantity}
                          onChange={(e) => setFormState({ ...formState, quantity: e.target.value })}
                          placeholder="e.g. 500 Meters / 1000 pcs"
                          className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-white border border-[#D5D0C6] rounded-lg text-[#181715] placeholder-stone-400 focus:outline-none focus:border-[#102C22] focus:ring-1 focus:ring-[#102C22]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 5: Message */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#585550] font-semibold mb-1">
                      MESSAGE
                    </label>
                    <textarea
                      rows={3}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Tell us about your material needs, specification or any other details..."
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#D5D0C6] rounded-lg text-[#181715] placeholder-stone-400 focus:outline-none focus:border-[#102C22] focus:ring-1 focus:ring-[#102C22]"
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
                        className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-stone-50 text-[#585550] border border-[#D5D0C6] rounded-lg text-xs cursor-pointer transition-colors text-left"
                      >
                        <Paperclip className="w-3.5 h-3.5 text-stone-500" />
                        <div>
                          <span className="font-semibold block leading-tight text-[#181715]">
                            Attach Files <span className="font-normal text-[10px] text-stone-400">(Optional)</span>
                          </span>
                          <span className="text-[10px] text-stone-500 block">
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
                              className="inline-flex items-center gap-1 bg-white border border-stone-300 rounded px-2 py-0.5 text-[10px] text-stone-700"
                            >
                              <span className="truncate max-w-[120px]">{file.name}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveFile(i)}
                                className="text-stone-400 hover:text-red-600"
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
                      className="inline-flex items-center justify-center gap-2 bg-[#102C22] hover:bg-[#071B15] text-white px-8 py-3.5 rounded-xl font-medium text-xs sm:text-sm tracking-wide transition-all border border-[#C49A55]/30 shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Sending...</span>
                      ) : (
                        <>
                          <span>Send Enquiry</span>
                          <Send className="w-4 h-4 text-[#C49A55]" />
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
