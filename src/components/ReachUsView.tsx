import React, { useState } from 'react';
import { businessConfig } from '../data/businessConfig.ts';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
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

  // Form validation: Name & Phone/WhatsApp are required
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
        message: formData.message.trim() || undefined,
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
      `*New Enquiry — Classic Fashions*\n` +
      `• *Name:* ${formData.name.trim()}\n` +
      `• *Phone/WhatsApp:* ${formData.phone.trim()}\n` +
      (formData.email.trim() ? `• *Email:* ${formData.email.trim()}\n` : '') +
      (formData.message.trim() ? `• *Message:* ${formData.message.trim()}\n` : '') +
      (referenceCode ? `• *Reference:* ${referenceCode}\n` : '');

    return `https://wa.me/${VERIFIED_PHONE_RAW}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="bg-[#FAF7F2] text-[#183626] min-h-screen pb-24 font-sans selection:bg-[#C5A059]/30 selection:text-[#183626]">
      {/* ========================================================================= */}
      {/* 1. SPACIOUS, CENTERED HEADER: “Let’s Get in Touch”                        */}
      {/* ========================================================================= */}
      <section className="pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 text-center border-b border-[#E8E2D6]/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-4">
          <span className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.28em] text-[#B8934A] font-semibold">
            CLASSIC FASHIONS · TIRUPPUR
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#142E20] leading-[1.15]">
            Let’s Get in Touch
          </h1>

          <div className="w-12 h-px bg-[#C5A059] mx-auto opacity-70" />

          <p className="text-sm sm:text-base text-[#3A5344] max-w-xl mx-auto leading-relaxed font-light">
            We are here to assist with your fabric sourcing, garment trims, wholesale material inquiries, and sample requirements. Reach out to our team in Tiruppur.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CLEAN TWO-COLUMN LAYOUT: CONTACT DETAILS (LEFT) & ENQUIRY FORM (RIGHT)  */}
      {/* ========================================================================= */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ─────────────────────────────────────────────────────────────────────── */}
          {/* LEFT COLUMN: CONTACT DETAILS (~42% width)                               */}
          {/* ─────────────────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#FFFFFF] border border-[#E6DFD3] rounded-2xl p-6 sm:p-8 lg:p-9 shadow-[0_4px_24px_rgba(24,54,38,0.03)] space-y-8">
              
              <div className="space-y-1.5 pb-4 border-b border-[#EFEBE1]">
                <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#B8934A] font-bold block">
                  CONTACT DETAILS
                </span>
                <h2 className="font-serif text-2xl font-medium text-[#142E20]">
                  Classic Fashions
                </h2>
                <p className="text-xs text-[#526B5C]">
                  Supplier of Garment Accessories &amp; Fabrics · Tiruppur
                </p>
              </div>

              {/* 1. Business Address */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#183626]">
                    <MapPin className="w-4 h-4 text-[#C5A059]" />
                    <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[#142E20]">
                      Business Address
                    </span>
                  </div>
                  <a
                    href={mapsSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-[#B8934A] hover:text-[#142E20] transition-colors"
                  >
                    <span>View Map</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="pl-6 space-y-1">
                  <p className="text-sm text-[#274232] leading-relaxed">
                    {businessConfig.addressLine1},<br />
                    {businessConfig.addressLine2},<br />
                    {businessConfig.city}, {businessConfig.state} – {businessConfig.pincode}, India
                  </p>
                </div>
              </div>

              {/* 2. Phone / WhatsApp */}
              <div className="space-y-2 pt-2 border-t border-[#F2ECE2]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#183626]">
                    <Phone className="w-4 h-4 text-[#C5A059]" />
                    <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[#142E20]">
                      Phone / WhatsApp
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(VERIFIED_PHONE, 'phone')}
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-[#B8934A] hover:text-[#142E20] transition-colors cursor-pointer"
                  >
                    {copiedPhone ? (
                      <>
                        <Check className="w-3 h-3 text-[#183626]" />
                        <span className="text-[#183626]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pl-6 space-y-2">
                  <a
                    href={`tel:${VERIFIED_PHONE}`}
                    className="font-mono text-base sm:text-lg font-semibold text-[#142E20] hover:text-[#C5A059] transition-colors block"
                  >
                    {VERIFIED_PHONE}
                  </a>

                  <div className="flex items-center gap-3 pt-1">
                    <a
                      href={`tel:${VERIFIED_PHONE}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F2ECE2] border border-[#DDD5C7] text-xs font-mono text-[#142E20] transition-colors"
                    >
                      <Phone className="w-3 h-3 text-[#C5A059]" />
                      <span>Call Now</span>
                    </a>
                    <a
                      href={`https://wa.me/${VERIFIED_PHONE_RAW}?text=${encodeURIComponent(
                        'Hello Classic Fashions, I would like to inquire about fabrics and accessories.'
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F2ECE2] border border-[#DDD5C7] text-xs font-mono text-[#183626] font-medium transition-colors"
                    >
                      <span>WhatsApp Chat</span>
                      <ExternalLink className="w-3 h-3 text-[#C5A059]" />
                    </a>
                  </div>
                </div>
              </div>

              {/* 3. Email */}
              <div className="space-y-2 pt-2 border-t border-[#F2ECE2]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#183626]">
                    <Mail className="w-4 h-4 text-[#C5A059]" />
                    <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[#142E20]">
                      Email
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(VERIFIED_EMAIL, 'email')}
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-[#B8934A] hover:text-[#142E20] transition-colors cursor-pointer"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3 h-3 text-[#183626]" />
                        <span className="text-[#183626]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pl-6 space-y-1">
                  <a
                    href={`mailto:${VERIFIED_EMAIL}`}
                    className="font-mono text-sm sm:text-base font-medium text-[#142E20] hover:text-[#C5A059] transition-colors block truncate"
                  >
                    {VERIFIED_EMAIL}
                  </a>
                  <span className="text-xs text-[#526B5C] block">
                    For sample requests, purchase orders &amp; inquiries
                  </span>
                </div>
              </div>

              {/* 4. Working Hours */}
              <div className="space-y-2 pt-2 border-t border-[#F2ECE2]">
                <div className="flex items-center gap-2 text-[#183626]">
                  <Clock className="w-4 h-4 text-[#C5A059]" />
                  <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[#142E20]">
                    Working Hours
                  </span>
                </div>

                <div className="pl-6 space-y-1 text-sm text-[#274232]">
                  <div className="flex items-center justify-between">
                    <span>Monday – Saturday</span>
                    <span className="font-mono text-xs font-semibold text-[#142E20]">9:30 AM – 7:30 PM IST</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#6B8274] pt-0.5">
                    <span>Sunday</span>
                    <span className="font-mono text-[11px]">Closed</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────────────── */}
          {/* RIGHT COLUMN: SIMPLE ENQUIRY FORM (~58% width)                          */}
          {/* ─────────────────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-7">
            <div className="bg-[#FFFFFF] border border-[#E6DFD3] rounded-2xl p-6 sm:p-9 lg:p-10 shadow-[0_4px_24px_rgba(24,54,38,0.03)] space-y-6">
              
              <div className="space-y-1 pb-4 border-b border-[#EFEBE1]">
                <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#B8934A] font-bold block">
                  DIRECT ENQUIRY
                </span>
                <h3 className="font-serif text-2xl font-medium text-[#142E20]">
                  Send Us a Message
                </h3>
                <p className="text-xs text-[#526B5C]">
                  Fill out the form below and our sourcing desk will respond promptly.
                </p>
              </div>

              {isSubmitted ? (
                /* Success State */
                <div className="py-8 text-center space-y-5 animate-in fade-in duration-300">
                  <div className="w-14 h-14 rounded-full bg-[#FAF7F2] text-[#142E20] border border-[#C5A059]/40 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7 text-[#183626]" />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B8934A] font-bold block">
                      ENQUIRY RECEIVED
                    </span>
                    <h4 className="font-serif text-2xl font-medium text-[#142E20]">
                      Thank you, {formData.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#3A5344] max-w-md mx-auto leading-relaxed">
                      Your inquiry has been registered. Our team will reach out via {formData.phone}.
                    </p>
                  </div>

                  <div className="inline-block bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl px-5 py-2.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B8274] block">
                      Reference Number
                    </span>
                    <span className="font-mono text-base font-bold text-[#142E20]">
                      {referenceCode}
                    </span>
                  </div>

                  <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={getWhatsAppEnquiryUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#183626] hover:bg-[#142E20] text-[#FAF7F2] px-6 py-2.5 rounded-xl text-xs font-mono font-medium tracking-wider transition-colors cursor-pointer"
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
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl border border-[#DDD5C7] bg-[#FAF7F2] text-xs font-mono text-[#3A5344] hover:text-[#142E20] hover:border-[#142E20] transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Send Another Enquiry</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Simple Enquiry Form */
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* 1. Name (Required) */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#142E20] font-semibold mb-1.5">
                      Name <span className="text-[#C5A059]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your Full Name"
                      className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#DDD5C7] rounded-xl text-[#142E20] placeholder-[#8A9E92] focus:bg-white focus:outline-none focus:border-[#183626] focus:ring-1 focus:ring-[#183626] transition-all"
                    />
                    {errors.name && (
                      <p className="text-[11px] text-[#A63624] mt-1 font-mono">{errors.name}</p>
                    )}
                  </div>

                  {/* 2. Phone / WhatsApp (Required) */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#142E20] font-semibold mb-1.5">
                      Phone / WhatsApp <span className="text-[#C5A059]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98420 12345"
                      className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#DDD5C7] rounded-xl text-[#142E20] placeholder-[#8A9E92] focus:bg-white focus:outline-none focus:border-[#183626] focus:ring-1 focus:ring-[#183626] transition-all"
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-[#A63624] mt-1 font-mono">{errors.phone}</p>
                    )}
                  </div>

                  {/* 3. Email (Optional) */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#142E20] font-semibold mb-1.5">
                      Email <span className="font-normal text-[10px] text-[#6B8274]">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@company.com"
                      className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#DDD5C7] rounded-xl text-[#142E20] placeholder-[#8A9E92] focus:bg-white focus:outline-none focus:border-[#183626] focus:ring-1 focus:ring-[#183626] transition-all"
                    />
                    {errors.email && (
                      <p className="text-[11px] text-[#A63624] mt-1 font-mono">{errors.email}</p>
                    )}
                  </div>

                  {/* 4. Message */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#142E20] font-semibold mb-1.5">
                      Message <span className="font-normal text-[10px] text-[#6B8274]">(Optional)</span>
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please specify fabric type, count, quantity, accessories, or sample requirements..."
                      className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#DDD5C7] rounded-xl text-[#142E20] placeholder-[#8A9E92] focus:bg-white focus:outline-none focus:border-[#183626] focus:ring-1 focus:ring-[#183626] transition-all resize-none"
                    />
                  </div>

                  {errors.form && (
                    <p className="text-xs text-[#A63624] font-mono">{errors.form}</p>
                  )}

                  {/* 5. One Send Enquiry Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#183626] hover:bg-[#142E20] text-[#FAF7F2] border border-[#C5A059]/30 text-xs font-mono font-bold uppercase tracking-[0.2em] shadow-[0_4px_16px_rgba(24,54,38,0.15)] hover:shadow-[0_6px_20px_rgba(24,54,38,0.25)] transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Sending Enquiry...</span>
                      ) : (
                        <>
                          <span>Send Enquiry</span>
                          <Send className="w-3.5 h-3.5 text-[#C5A059]" />
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-center pt-1">
                    <span className="text-[11px] text-[#6B8274] font-light">
                      We respect your privacy. Details are used solely to reply to your inquiry.
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
