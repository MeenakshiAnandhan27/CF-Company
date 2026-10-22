import React, { useState } from 'react';
import { businessConfig } from '../data/businessConfig.ts';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
} from 'lucide-react';

interface ReachUsViewProps {
  onExploreCatalogue?: () => void;
}

// Verified Business Contact Information
const VERIFIED_PHONE = '+91 88264 15868';
const VERIFIED_PHONE_RAW = '918826415868';
const VERIFIED_EMAIL = 'material@classicfashions.com';
const STORAGE_ENQUIRIES_KEY = 'cf_reach_us_enquiries_v1';

export const ReachUsView: React.FC<ReachUsViewProps> = () => {
  // Enquiry form fields: Name, Phone/WhatsApp, optional Email, Message
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceCode, setReferenceCode] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    '5/1475, 5th Street, Palanisamy Nagar, Boyampalayam, Tiruppur, Tamil Nadu 641602'
  )}`;

  // Quick copy utility
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

  // Form validation: Name, Phone/WhatsApp, and Message are required
  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Please enter your name.';
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 7) {
      errs.phone = 'Please enter your phone or WhatsApp number.';
    }
    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      errs.email = 'Please enter a valid email address, or leave it blank.';
    }
    if (!formData.message.trim() || formData.message.trim().length < 4) {
      errs.message = 'Please provide details about your requirements.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Form submission
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
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        message: formData.message.trim(),
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
      setErrors({ form: 'Unable to send enquiry. Please contact us directly via phone or WhatsApp.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp link for success state
  const getWhatsAppEnquiryUrl = () => {
    const text =
      `*New Requirement — Classic Fashions*\n` +
      `• *Name:* ${formData.name.trim()}\n` +
      `• *Phone/WhatsApp:* ${formData.phone.trim()}\n` +
      (formData.email.trim() ? `• *Email:* ${formData.email.trim()}\n` : '') +
      `• *Requirement:* ${formData.message.trim()}\n` +
      (referenceCode ? `• *Reference:* ${referenceCode}\n` : '');

    return `https://wa.me/${VERIFIED_PHONE_RAW}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="bg-[#FAF7F2] text-[#242422] min-h-screen pb-28 font-sans selection:bg-[#C5A059]/25 selection:text-[#142E20]">
      {/* ========================================================================= */}
      {/* 2. HERO SECTION: Spacious, Centered with Italic Accent                     */}
      {/* ========================================================================= */}
      <section className="pt-20 sm:pt-24 lg:pt-32 pb-14 sm:pb-20 text-center px-4 sm:px-6">
        <div className="max-w-2xl mx-auto space-y-3.5">
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.28em] text-[#B8934A] font-semibold block">
            CLASSIC FASHIONS · REACH US
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#142E20] leading-[1.15]">
            Let’s Get <span className="italic font-serif text-[#C5A059]">in</span> Touch
          </h1>

          <div className="w-10 h-px bg-[#C5A059]/60 mx-auto" />

          <p className="text-sm sm:text-base text-[#52524E] font-normal leading-relaxed max-w-lg mx-auto pt-1">
            Have a question or a business requirement? We’re here to help.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MAIN LAYOUT: Balanced Two-Column (Contact Details & Enquiry Form)       */}
      {/* ========================================================================= */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ─────────────────────────────────────────────────────────────────────── */}
          {/* LEFT — CONTACT DETAILS (4 Clean Rows with Outline Icons & Dividers)      */}
          {/* ─────────────────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-7 sm:p-9 lg:p-10 shadow-[0_2px_16px_rgba(20,46,32,0.02)] space-y-7">
              
              <div className="pb-4 border-b border-[#EFEBE3]">
                <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#B8934A] font-semibold block mb-1">
                  OFFICIAL CONTACTS
                </span>
                <h2 className="font-serif text-2xl font-normal text-[#142E20] tracking-tight">
                  Tiruppur Mill &amp; Atelier Desk
                </h2>
              </div>

              <div className="space-y-6">
                
                {/* 1. Business Address with Google Maps link */}
                <div className="flex items-start gap-4 pb-6 border-b border-[#EFEBE3]">
                  <div className="w-9 h-9 rounded-lg border border-[#E5DFD4] bg-[#FAF8F5] flex items-center justify-center shrink-0 text-[#142E20] mt-0.5">
                    <MapPin className="w-4 h-4 text-[#B8934A] stroke-[1.5]" />
                  </div>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#73736E] font-semibold block">
                      BUSINESS ADDRESS
                    </span>
                    <p className="text-sm text-[#242422] leading-relaxed">
                      {businessConfig.addressLine1},<br />
                      {businessConfig.addressLine2},<br />
                      {businessConfig.city}, {businessConfig.state} – {businessConfig.pincode}, India
                    </p>
                    <a
                      href={mapsSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-mono text-[#B8934A] hover:text-[#142E20] transition-colors pt-1 group"
                    >
                      <span>View on Google Maps</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </div>
                </div>

                {/* 2. Phone / WhatsApp with working contact links */}
                <div className="flex items-start gap-4 pb-6 border-b border-[#EFEBE3]">
                  <div className="w-9 h-9 rounded-lg border border-[#E5DFD4] bg-[#FAF8F5] flex items-center justify-center shrink-0 text-[#142E20] mt-0.5">
                    <Phone className="w-4 h-4 text-[#B8934A] stroke-[1.5]" />
                  </div>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#73736E] font-semibold">
                        PHONE / WHATSAPP
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(VERIFIED_PHONE, 'phone')}
                        className="inline-flex items-center gap-1 text-[10px] font-mono text-[#B8934A] hover:text-[#142E20] transition-colors cursor-pointer"
                        title="Copy phone number"
                      >
                        {copiedPhone ? (
                          <>
                            <Check className="w-3 h-3 text-[#142E20]" />
                            <span className="text-[#142E20]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <a
                      href={`tel:${VERIFIED_PHONE}`}
                      className="font-mono text-base font-semibold text-[#142E20] hover:text-[#B8934A] transition-colors block"
                    >
                      {VERIFIED_PHONE}
                    </a>

                    <div className="flex items-center gap-3 pt-1">
                      <a
                        href={`tel:${VERIFIED_PHONE}`}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-[#FAF8F5] hover:bg-[#F2ECE2] border border-[#E2DBD0] text-xs font-mono text-[#142E20] transition-colors"
                      >
                        <Phone className="w-3 h-3 text-[#B8934A]" />
                        <span>Call</span>
                      </a>
                      <a
                        href={`https://wa.me/${VERIFIED_PHONE_RAW}?text=${encodeURIComponent(
                          'Hello Classic Fashions, I would like to inquire about fabrics and accessories.'
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-[#FAF8F5] hover:bg-[#F2ECE2] border border-[#E2DBD0] text-xs font-mono text-[#142E20] transition-colors"
                      >
                        <span>WhatsApp</span>
                        <ExternalLink className="w-3 h-3 text-[#B8934A]" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* 3. Business Email with working email link */}
                <div className="flex items-start gap-4 pb-6 border-b border-[#EFEBE3]">
                  <div className="w-9 h-9 rounded-lg border border-[#E5DFD4] bg-[#FAF8F5] flex items-center justify-center shrink-0 text-[#142E20] mt-0.5">
                    <Mail className="w-4 h-4 text-[#B8934A] stroke-[1.5]" />
                  </div>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#73736E] font-semibold">
                        BUSINESS EMAIL
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(VERIFIED_EMAIL, 'email')}
                        className="inline-flex items-center gap-1 text-[10px] font-mono text-[#B8934A] hover:text-[#142E20] transition-colors cursor-pointer"
                        title="Copy email address"
                      >
                        {copiedEmail ? (
                          <>
                            <Check className="w-3 h-3 text-[#142E20]" />
                            <span className="text-[#142E20]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <a
                      href={`mailto:${VERIFIED_EMAIL}`}
                      className="font-mono text-sm sm:text-[15px] font-medium text-[#142E20] hover:text-[#B8934A] transition-colors block truncate"
                    >
                      {VERIFIED_EMAIL}
                    </a>

                    <div className="pt-0.5">
                      <a
                        href={`mailto:${VERIFIED_EMAIL}?subject=${encodeURIComponent(
                          'Sourcing Inquiry — Classic Fashions'
                        )}`}
                        className="inline-flex items-center gap-1 text-xs font-mono text-[#B8934A] hover:text-[#142E20] transition-colors group"
                      >
                        <span>Send Direct Email</span>
                        <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* 4. Working Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg border border-[#E5DFD4] bg-[#FAF8F5] flex items-center justify-center shrink-0 text-[#142E20] mt-0.5">
                    <Clock className="w-4 h-4 text-[#B8934A] stroke-[1.5]" />
                  </div>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#73736E] font-semibold block">
                      WORKING HOURS
                    </span>
                    <div className="text-sm text-[#242422] space-y-1">
                      <div className="flex items-center justify-between">
                        <span>Monday – Saturday</span>
                        <span className="font-mono text-xs font-medium text-[#142E20]">9:30 AM – 7:30 PM IST</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-[#73736E]">
                        <span>Sunday</span>
                        <span className="font-mono text-[11px]">Closed</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────────────── */}
          {/* RIGHT — ENQUIRY FORM: Clean, Lightly Bordered Panel                     */}
          {/* ─────────────────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-7 sm:p-9 lg:p-10 shadow-[0_2px_16px_rgba(20,46,32,0.02)] space-y-6">
              
              {/* Header */}
              <div className="space-y-1 pb-4 border-b border-[#EFEBE3]">
                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#142E20] tracking-tight">
                  Share Your Requirements
                </h3>
                <p className="text-xs sm:text-sm text-[#5C5C57] leading-relaxed">
                  Tell us what you need, and our team will get back to you.
                </p>
              </div>

              {isSubmitted ? (
                /* Success Confirmation State */
                <div className="py-8 text-center space-y-5 animate-in fade-in duration-300">
                  <div className="w-12 h-12 rounded-full bg-[#FAF8F5] text-[#142E20] border border-[#C5A059]/40 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6 text-[#142E20]" />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B8934A] font-semibold block">
                      REQUIREMENT RECEIVED
                    </span>
                    <h4 className="font-serif text-2xl font-normal text-[#142E20]">
                      Thank you, {formData.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#5C5C57] max-w-md mx-auto leading-relaxed">
                      We have received your requirement. Our Tiruppur sourcing desk will contact you via {formData.phone}.
                    </p>
                  </div>

                  <div className="inline-block bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl px-5 py-2.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#73736E] block">
                      Enquiry Reference ID
                    </span>
                    <span className="font-mono text-base font-semibold text-[#142E20]">
                      {referenceCode}
                    </span>
                  </div>

                  <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={getWhatsAppEnquiryUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#142E20] hover:bg-[#1A3828] text-[#FAF8F5] px-6 py-2.5 rounded-xl text-xs font-mono font-medium tracking-wider transition-colors cursor-pointer"
                    >
                      <span>Share on WhatsApp</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#C5A059]" />
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
                        setReferenceCode('');
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl border border-[#DDD6C8] bg-white text-xs font-mono text-[#5C5C57] hover:text-[#142E20] hover:border-[#142E20] transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Send Another Requirement</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Clean Functional Enquiry Form */
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Name — Required */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#3D3D3A] font-semibold mb-1.5">
                      Name <span className="text-[#C5A059]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#E2DBD0] rounded-xl text-[#142E20] placeholder-[#8F8F8A] focus:bg-white focus:outline-none focus:border-[#142E20] focus:ring-1 focus:ring-[#142E20] transition-all"
                    />
                    {errors.name && (
                      <p className="text-[11px] text-[#A63624] mt-1 font-mono">{errors.name}</p>
                    )}
                  </div>

                  {/* Phone / WhatsApp — Required */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#3D3D3A] font-semibold mb-1.5">
                      Phone / WhatsApp <span className="text-[#C5A059]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98420 12345"
                      className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#E2DBD0] rounded-xl text-[#142E20] placeholder-[#8F8F8A] focus:bg-white focus:outline-none focus:border-[#142E20] focus:ring-1 focus:ring-[#142E20] transition-all"
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-[#A63624] mt-1 font-mono">{errors.phone}</p>
                    )}
                  </div>

                  {/* Email — Optional */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#3D3D3A] font-semibold mb-1.5">
                      Email <span className="font-normal text-[10px] text-[#73736E]">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@company.com"
                      className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#E2DBD0] rounded-xl text-[#142E20] placeholder-[#8F8F8A] focus:bg-white focus:outline-none focus:border-[#142E20] focus:ring-1 focus:ring-[#142E20] transition-all"
                    />
                    {errors.email && (
                      <p className="text-[11px] text-[#A63624] mt-1 font-mono">{errors.email}</p>
                    )}
                  </div>

                  {/* Message — Required */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#3D3D3A] font-semibold mb-1.5">
                      Message <span className="text-[#C5A059]">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your fabric type, accessory specifications, volume, or sample requirements..."
                      className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#E2DBD0] rounded-xl text-[#142E20] placeholder-[#8F8F8A] focus:bg-white focus:outline-none focus:border-[#142E20] focus:ring-1 focus:ring-[#142E20] transition-all resize-none"
                    />
                    {errors.message && (
                      <p className="text-[11px] text-[#A63624] mt-1 font-mono">{errors.message}</p>
                    )}
                  </div>

                  {errors.form && (
                    <p className="text-xs text-[#A63624] font-mono">{errors.form}</p>
                  )}

                  {/* One Clear "Send Enquiry" Button (Dark forest-green button with a subtle gold arrow) */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-8 rounded-xl bg-[#142E20] hover:bg-[#1A3828] text-[#FAF8F5] border border-[#C5A059]/40 text-xs font-mono font-semibold uppercase tracking-[0.2em] shadow-xs hover:shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Sending Enquiry...</span>
                      ) : (
                        <>
                          <span>Send Enquiry</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#C5A059] transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-center pt-1">
                    <span className="text-[11px] text-[#73736E] font-light">
                      We respect your privacy. Details are used solely to respond to your requirement.
                    </span>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
