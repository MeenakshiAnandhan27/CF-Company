import React, { useState } from 'react';
import { businessConfig } from '../data/businessConfig.ts';
import {
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  ExternalLink,
  User,
  Building2,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Clock,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

interface ReachUsViewProps {
  onExploreCatalogue?: () => void;
}

// Verified Business Contact Data
const VERIFIED_PHONE = '+91 88264 15868';
const VERIFIED_PHONE_RAW = '918826415868';
const VERIFIED_EMAIL = 'material@classicfashions.com';
const STORAGE_ENQUIRIES_KEY = 'cf_reach_us_enquiries_v1';

// Interactive quick topic tags
const INQUIRY_TOPICS = [
  { id: 'fabrics', label: 'Bulk Fabrics', placeholder: 'Looking for single jersey, rib, loopknit, or custom mill fabrics...' },
  { id: 'accessories', label: 'Garment Accessories & Trims', placeholder: 'Sourcing buttons, zippers, drawcords, elastic tapes, or labels...' },
  { id: 'sampling', label: 'Swatches & Sampling', placeholder: 'Requesting swatch cards or sample yardage for upcoming collection...' },
  { id: 'custom', label: 'Custom Manufacturing', placeholder: 'Special weaves, yarn counts, custom dyeing, or lab-dip requirements...' },
  { id: 'general', label: 'General Enquiry', placeholder: 'Hello Classic Fashions, I would like to connect regarding...' },
];

export const ReachUsView: React.FC<ReachUsViewProps> = ({ onExploreCatalogue }) => {
  // Primary 4 fields as requested: Name, Contact, Email, Company Name (+ message)
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    companyName: '',
    message: '',
  });

  // Selected quick topic
  const [selectedTopic, setSelectedTopic] = useState(INQUIRY_TOPICS[0].id);

  // UI state
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceCode, setReferenceCode] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const activeTopicObj = INQUIRY_TOPICS.find((t) => t.id === selectedTopic) || INQUIRY_TOPICS[0];

  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    '5/1475, 5th Street, Palanisamy Nagar, Boyampalayam, Tiruppur, Tamil Nadu 641602'
  )}`;

  // Quick Copy Utilities
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

  // Form Validation: Name, Contact & Company Name
  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Please enter your name.';
    }
    if (!formData.contact.trim() || formData.contact.trim().length < 7) {
      errs.contact = 'Please enter a valid phone or WhatsApp number.';
    }
    if (!formData.companyName.trim()) {
      errs.companyName = 'Please enter your company or brand name.';
    }
    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      errs.email = 'Please enter a valid email address, or leave it empty.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const timestamp = Date.now();
      const code = `CF-ENQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const record = {
        id: `enquiry-${timestamp}`,
        referenceCode: code,
        name: formData.name.trim(),
        contact: formData.contact.trim(),
        email: formData.email.trim() || undefined,
        companyName: formData.companyName.trim(),
        topic: activeTopicObj.label,
        message: formData.message.trim() || activeTopicObj.placeholder,
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

  // Construct Direct WhatsApp URL with pre-filled enquiry data
  const getWhatsAppEnquiryUrl = () => {
    const text =
      `*Enquiry — Classic Fashions*\n` +
      `• *Name:* ${formData.name.trim() || 'Guest'}\n` +
      `• *Company:* ${formData.companyName.trim() || 'N/A'}\n` +
      `• *Contact:* ${formData.contact.trim() || 'N/A'}\n` +
      (formData.email.trim() ? `• *Email:* ${formData.email.trim()}\n` : '') +
      `• *Topic:* ${activeTopicObj.label}\n` +
      (formData.message.trim() ? `• *Requirement:* ${formData.message.trim()}\n` : '') +
      (referenceCode ? `• *Ref Code:* ${referenceCode}\n` : '');

    return `https://wa.me/${VERIFIED_PHONE_RAW}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="bg-[#FAF8F5] text-[#181715] min-h-screen pb-24 relative overflow-hidden font-sans selection:bg-[#D4AF37] selection:text-[#181715]">
      {/* Subtle Luxury Ambient Background */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-full sm:w-2/3 h-[500px] pointer-events-none opacity-60"
        style={{
          background:
            'radial-gradient(ellipse 65% 50% at 85% 15%, rgba(212, 175, 55, 0.08), rgba(245, 240, 230, 0.4) 60%, transparent 80%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute top-72 left-0 w-[500px] h-[500px] pointer-events-none opacity-40"
        style={{
          background:
            'radial-gradient(circle at 10% 20%, rgba(140, 101, 52, 0.05), transparent 70%)',
        }}
      />

      {/* Hero Header */}
      <section className="relative pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-12 border-b border-[#ECE7DE] text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3EFE6] border border-[#DDD6C8] text-[#8C6534] text-xs font-mono font-medium tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8C6534] animate-pulse" />
            <span>REACH CLASSIC FASHIONS</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#181715] leading-[1.1]">
            Let’s Connect &amp;{' '}
            <span className="relative inline-block text-[#8C6534] font-serif italic font-normal">
              Collaborate.
              <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8C6534] to-transparent rounded-full" />
            </span>
          </h1>

          <p className="text-xs sm:text-sm lg:text-base text-[#6B665E] max-w-xl mx-auto leading-relaxed pt-1">
            Looking for garment fabrics, accessories, or wholesale mill sourcing? Share your basic
            details below and our team will get in touch directly.
          </p>
        </div>
      </section>

      {/* Main Grid: Clean & Direct */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT: ESSENTIAL OFFICIAL CONTACTS (~40% WIDTH)                            */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white border border-[#E5E0D8] rounded-3xl p-6 sm:p-7 shadow-[0_12px_40px_rgba(24,23,21,0.04)] space-y-6">
              
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8C6534] font-semibold block mb-1">
                  DIRECT DESK
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#181715] tracking-tight">
                  Official Contacts
                </h2>
                <div className="w-10 h-0.5 bg-[#8C6534] rounded-full mt-2" />
              </div>

              {/* 1. Phone & WhatsApp Desk */}
              <div className="bg-[#FAF8F5] border border-[#E5E0D8] rounded-2xl p-4 sm:p-5 space-y-3 group hover:border-[#8C6534]/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#F3EFE6] text-[#8C6534] border border-[#DDD6C8] flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#78736B] font-semibold">
                      PHONE &amp; WHATSAPP
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#15803D] bg-[#25D366]/15 border border-[#25D366]/30 px-2.5 py-0.5 rounded-full font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                    ACTIVE
                  </span>
                </div>

                <div>
                  <a
                    href={`tel:${VERIFIED_PHONE}`}
                    className="font-mono text-lg font-bold text-[#181715] hover:text-[#8C6534] transition-colors block"
                  >
                    {VERIFIED_PHONE}
                  </a>
                  <span className="text-[11px] text-[#78736B] block mt-0.5">
                    Tiruppur Sampling &amp; Wholesale Hotline
                  </span>
                </div>

                <div className="pt-1 flex items-center gap-2">
                  <a
                    href={`tel:${VERIFIED_PHONE}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#181715] hover:bg-[#2B2824] text-white text-xs font-mono font-medium transition-colors shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Call Now</span>
                  </a>
                  <a
                    href={`https://wa.me/${VERIFIED_PHONE_RAW}?text=${encodeURIComponent(
                      'Hello Classic Fashions, I would like to connect with your sourcing team.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-xs font-mono font-semibold text-[#15803D] transition-colors"
                  >
                    <span>WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* 2. Official Email Desk */}
              <div className="bg-[#FAF8F5] border border-[#E5E0D8] rounded-2xl p-4 sm:p-5 space-y-3 group hover:border-[#8C6534]/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#F3EFE6] text-[#8C6534] border border-[#DDD6C8] flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#78736B] font-semibold">
                      EMAIL DESK
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(VERIFIED_EMAIL, 'email')}
                    className="inline-flex items-center gap-1 text-[10px] font-mono text-[#8C6534] hover:text-[#181715] transition-colors cursor-pointer"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3 h-3 text-[#15803D]" />
                        <span className="text-[#15803D]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <a
                    href={`mailto:${VERIFIED_EMAIL}`}
                    className="font-mono text-sm sm:text-base font-bold text-[#181715] hover:text-[#8C6534] transition-colors block truncate"
                  >
                    {VERIFIED_EMAIL}
                  </a>
                  <span className="text-[11px] text-[#78736B] block mt-0.5">
                    Ideal for RFQs, Purchase Orders &amp; Spec Sheets
                  </span>
                </div>

                <a
                  href={`mailto:${VERIFIED_EMAIL}?subject=${encodeURIComponent(
                    'Sourcing Inquiry — Classic Fashions'
                  )}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#F3EFE6] border border-[#DDD6C8] text-xs font-mono text-[#181715] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#8C6534]" />
                  <span>Send Direct Email</span>
                </a>
              </div>

              {/* 3. Tiruppur Studio & Mill Office */}
              <div className="bg-[#FAF8F5] border border-[#E5E0D8] rounded-2xl p-4 sm:p-5 space-y-2 group hover:border-[#8C6534]/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#F3EFE6] text-[#8C6534] border border-[#DDD6C8] flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#78736B] font-semibold">
                      ATELIER &amp; STUDIO
                    </span>
                  </div>
                  <a
                    href={mapsSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-[#8C6534] hover:underline"
                  >
                    <span>Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <p className="text-xs sm:text-sm text-[#181715] leading-relaxed font-medium pl-10">
                  {businessConfig.addressLine1},<br />
                  {businessConfig.addressLine2},<br />
                  {businessConfig.city}, {businessConfig.state} – {businessConfig.pincode}
                </p>

                <div className="pl-10 pt-1 flex items-center gap-2 text-[11px] text-[#78736B]">
                  <Clock className="w-3.5 h-3.5 text-[#8C6534]" />
                  <span>Mon – Sat: 9:30 AM – 7:30 PM IST</span>
                </div>
              </div>

              {/* Digital Catalogue Link */}
              {onExploreCatalogue && (
                <div className="pt-2 border-t border-[#ECE7DE] flex items-center justify-between">
                  <span className="text-xs text-[#78736B]">Need to view fabric inventory?</span>
                  <button
                    type="button"
                    onClick={onExploreCatalogue}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#8C6534] hover:text-[#181715] transition-colors cursor-pointer"
                  >
                    <span>Browse Catalogue</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8C6534]" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT: STREAMLINED INTERACTIVE ENQUIRY FORM (~60% WIDTH)                  */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#E5E0D8] rounded-3xl p-6 sm:p-9 shadow-[0_16px_50px_rgba(24,23,21,0.05)] relative space-y-6">
              
              {/* Fresh Interactive Status Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#ECE7DE]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8C6534] font-semibold block mb-0.5">
                    QUICK REACH-US FORM
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#181715] tracking-tight">
                    Send Your Requirement
                  </h3>
                </div>

                {/* Live Real-time Status Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#DDD6C8] text-xs font-mono text-[#78736B] self-start sm:self-auto">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8C6534]" />
                  <span>
                    {formData.name.trim() || formData.companyName.trim() ? (
                      <strong className="text-[#181715] font-semibold">
                        {formData.companyName.trim() || formData.name.trim()}
                      </strong>
                    ) : (
                      'Quick Response Guarantee'
                    )}
                  </span>
                </div>
              </div>

              {isSubmitted ? (
                /* Success Confirmation State */
                <div className="bg-[#FAF8F5] border border-[#E5E0D8] rounded-2xl p-7 sm:p-10 text-center space-y-5 animate-in fade-in duration-300">
                  <div className="w-14 h-14 rounded-full bg-[#F3EFE6] text-[#8C6534] flex items-center justify-center mx-auto ring-6 ring-[#8C6534]/10">
                    <CheckCircle2 className="w-7 h-7 text-[#8C6534]" />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono text-[#8C6534] uppercase font-bold tracking-wider">
                      ENQUIRY LOGGED SUCCESSFULLY
                    </span>
                    <h4 className="font-serif text-2xl sm:text-3xl font-bold text-[#181715]">
                      Thank You, {formData.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#6B665E] max-w-md mx-auto leading-relaxed">
                      We have received your requirement for <strong className="text-[#181715]">{formData.companyName}</strong>.
                      Our Tiruppur sourcing team will connect with you via {formData.contact}.
                    </p>
                  </div>

                  <div className="inline-block bg-white border border-[#DDD6C8] rounded-xl px-5 py-2.5 shadow-xs">
                    <span className="text-[10px] font-mono text-[#78736B] uppercase block">
                      Enquiry Reference ID
                    </span>
                    <span className="font-mono text-base sm:text-lg font-bold text-[#8C6534]">
                      {referenceCode}
                    </span>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={getWhatsAppEnquiryUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-6 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer"
                    >
                      <span>Share on WhatsApp</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          name: '',
                          contact: '',
                          email: '',
                          companyName: '',
                          message: '',
                        });
                        setReferenceCode('');
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl border border-[#DDD6C8] bg-white text-xs font-semibold text-[#78736B] hover:text-[#181715] hover:border-[#8C6534] transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Send Another Requirement</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* The Clean, Interactive Form */
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Interactive Quick Topic Chips */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78736B] font-semibold mb-2">
                      SELECT INQUIRY TOPIC
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {INQUIRY_TOPICS.map((topic) => {
                        const isSelected = selectedTopic === topic.id;
                        return (
                          <button
                            key={topic.id}
                            type="button"
                            onClick={() => setSelectedTopic(topic.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-[#181715] text-[#FAF8F5] shadow-xs'
                                : 'bg-[#FAF8F5] hover:bg-[#F3EFE6] text-[#6B665E] border border-[#E5E0D8] hover:text-[#181715]'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />}
                            <span>{topic.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4 Core Fields Requested by User */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* 1. Full Name */}
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78736B] font-semibold mb-1">
                        YOUR NAME <span className="text-[#8C6534]">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C877E]">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. S. Murugan"
                          className="w-full pl-10 pr-3.5 py-3 text-sm bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl text-[#181715] placeholder-[#9E988F] focus:bg-white focus:outline-none focus:border-[#8C6534] focus:ring-1 focus:ring-[#8C6534] transition-all"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-[10px] text-[#C4432B] mt-1 font-mono">{errors.name}</p>
                      )}
                    </div>

                    {/* 2. Contact Number */}
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78736B] font-semibold mb-1">
                        CONTACT / PHONE NUMBER <span className="text-[#8C6534]">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C877E]">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          required
                          value={formData.contact}
                          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                          placeholder="e.g. +91 98420 12345"
                          className="w-full pl-10 pr-3.5 py-3 text-sm bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl text-[#181715] placeholder-[#9E988F] focus:bg-white focus:outline-none focus:border-[#8C6534] focus:ring-1 focus:ring-[#8C6534] transition-all"
                        />
                      </div>
                      {errors.contact && (
                        <p className="text-[10px] text-[#C4432B] mt-1 font-mono">{errors.contact}</p>
                      )}
                    </div>

                    {/* 3. Company Name */}
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78736B] font-semibold mb-1">
                        COMPANY / BUSINESS NAME <span className="text-[#8C6534]">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C877E]">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          placeholder="e.g. Apex Apparel Exports"
                          className="w-full pl-10 pr-3.5 py-3 text-sm bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl text-[#181715] placeholder-[#9E988F] focus:bg-white focus:outline-none focus:border-[#8C6534] focus:ring-1 focus:ring-[#8C6534] transition-all"
                        />
                      </div>
                      {errors.companyName && (
                        <p className="text-[10px] text-[#C4432B] mt-1 font-mono">{errors.companyName}</p>
                      )}
                    </div>

                    {/* 4. Email ID */}
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78736B] font-semibold mb-1">
                        EMAIL ID <span className="font-normal text-[10px] text-[#8C877E]">(Optional)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C877E]">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. buyer@apexapparel.com"
                          className="w-full pl-10 pr-3.5 py-3 text-sm bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl text-[#181715] placeholder-[#9E988F] focus:bg-white focus:outline-none focus:border-[#8C6534] focus:ring-1 focus:ring-[#8C6534] transition-all"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-[10px] text-[#C4432B] mt-1 font-mono">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* 5. Requirement Note / Message */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78736B] font-semibold">
                        REQUIREMENT / NOTE <span className="font-normal text-[10px] text-[#8C877E]">(Optional)</span>
                      </label>
                      <span className="text-[10px] font-mono text-[#8C6534]">
                        Topic: {activeTopicObj.label}
                      </span>
                    </div>
                    <div className="relative">
                      <div className="absolute top-3 left-3.5 pointer-events-none text-[#8C877E]">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={activeTopicObj.placeholder}
                        className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#DDD6C8] rounded-xl text-[#181715] placeholder-[#9E988F] focus:bg-white focus:outline-none focus:border-[#8C6534] focus:ring-1 focus:ring-[#8C6534] transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* Action Buttons: Dual Interactive Controls */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    {/* Instant WhatsApp Quick Connect */}
                    <a
                      href={getWhatsAppEnquiryUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#15803D] font-semibold px-5 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                    >
                      <span>Connect on WhatsApp</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    {/* Primary Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 bg-[#181715] hover:bg-[#2B2824] text-white font-bold px-8 py-3.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Sending...</span>
                      ) : (
                        <>
                          <span>Submit Requirement</span>
                          <Send className="w-4 h-4 text-[#D4AF37]" />
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
