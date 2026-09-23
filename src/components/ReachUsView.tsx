import React, { useState } from 'react';
import { businessConfig } from '../data/businessConfig.ts';
import { ContactFormState } from '../types.ts';
import { Phone, MessageSquare, Mail, MapPin, Clock, Send, CheckCircle2, Map, ExternalLink } from 'lucide-react';

export const ReachUsView: React.FC = () => {
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

  const [isSubmitted, setIsSubmitted] = useState(false);

  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    '5/1475, 5th Street, Palanisamy Nagar, Boyampalayam, Tiruppur, Tamil Nadu 641602'
  )}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="bg-[#FBFBFA] min-h-screen pb-24">
      
      {/* 19. Header Banner */}
      <section className="bg-[#F7F5F0] border-b border-[#E8E6E0] pt-12 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#82553E] bg-[#EFE8DF] px-3.5 py-1.5 rounded-sm border border-[#DFD6CB] inline-block font-mono">
            GET IN TOUCH
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181715] tracking-tight">
            Reach Us
          </h1>
          <p className="text-sm sm:text-base text-[#585550] max-w-2xl mx-auto leading-relaxed">
            Contact Classic Fashions for material availability, sample swatches, wholesale fabric orders, and custom edge processing in Tiruppur.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Col 1: Business Information & Placeholders (Col 1-5) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8E6E0] shadow-sm space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#82553E] font-semibold block">
                  Official Details
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#181715] mt-1">
                  CLASSIC FASHIONS
                </h2>
                <p className="text-xs text-[#736F68] mt-1">
                  Garment Accessories &amp; Fabric Manufacturing
                </p>
              </div>

              <div className="space-y-4 text-sm">
                
                {/* Address */}
                <div className="flex items-start gap-3.5 p-3.5 bg-[#FAF9F6] rounded-lg border border-[#EFECE6]">
                  <div className="w-8 h-8 rounded bg-[#F0EEEA] text-[#82553E] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#78746C] block font-mono">
                      Address
                    </span>
                    <div className="font-medium text-[#181715] leading-relaxed mt-0.5">
                      {businessConfig.addressLine1},<br />
                      {businessConfig.addressLine2},<br />
                      {businessConfig.city},<br />
                      {businessConfig.state} – {businessConfig.pincode}
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3.5 p-3.5 bg-[#FAF9F6] rounded-lg border border-[#EFECE6]">
                  <div className="w-8 h-8 rounded bg-[#F0EEEA] text-[#82553E] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#78746C] block font-mono">
                      Phone
                    </span>
                    <span className="font-mono text-sm font-semibold text-[#181715] block mt-0.5">
                      {businessConfig.phonePlaceholder}
                    </span>
                    <span className="text-[11px] text-[#8C877E] block">
                      Direct Wholesale Desk
                    </span>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3.5 p-3.5 bg-[#FAF9F6] rounded-lg border border-[#EFECE6]">
                  <div className="w-8 h-8 rounded bg-[#EAF5EC] text-[#2E7D32] flex items-center justify-center shrink-0 mt-0.5">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#78746C] block font-mono">
                      WhatsApp
                    </span>
                    <span className="font-mono text-sm font-semibold text-[#181715] block mt-0.5">
                      {businessConfig.whatsappPlaceholder}
                    </span>
                    <span className="text-[11px] text-[#8C877E] block">
                      Instant Query &amp; Swatches
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5 p-3.5 bg-[#FAF9F6] rounded-lg border border-[#EFECE6]">
                  <div className="w-8 h-8 rounded bg-[#EBF2FA] text-[#1E56A0] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#78746C] block font-mono">
                      Email
                    </span>
                    <span className="font-mono text-sm font-semibold text-[#181715] truncate block mt-0.5">
                      {businessConfig.emailPlaceholder}
                    </span>
                    <span className="text-[11px] text-[#8C877E] block">
                      Formal Quotations &amp; POs
                    </span>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-3.5 p-3.5 bg-[#FAF9F6] rounded-lg border border-[#EFECE6]">
                  <div className="w-8 h-8 rounded bg-[#F0EEEA] text-[#585550] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#78746C] block font-mono">
                      Working Hours
                    </span>
                    <span className="font-mono text-sm font-semibold text-[#181715] block mt-0.5">
                      {businessConfig.workingHoursPlaceholder}
                    </span>
                    <span className="text-[11px] text-[#8C877E] block">
                      Store &amp; processing unit hours
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Google Maps Location Section */}
            <div className="bg-white p-6 rounded-xl border border-[#E8E6E0] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-[#181715] flex items-center gap-2">
                  <Map className="w-4 h-4 text-[#82553E]" />
                  <span>Google Maps Location</span>
                </h3>
                <span className="text-[11px] font-mono text-[#8C877E] bg-[#F5F4F0] px-2 py-0.5 rounded">
                  Boyampalayam
                </span>
              </div>

              {/* Styled Map Graphic Placeholder */}
              <div className="relative aspect-[16/9] bg-[#EFECE6] rounded-lg overflow-hidden border border-[#DDD8CE] flex items-center justify-center text-center p-6 group">
                <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="reach-map-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <line x1="0" y1="0" x2="30" y2="0" stroke="#B8B2A6" strokeWidth="0.8" />
                      <line x1="0" y1="0" x2="0" y2="30" stroke="#B8B2A6" strokeWidth="0.8" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#reach-map-grid)" />
                  <path d="M0 60 Q 150 90, 300 40 T 600 120" fill="none" stroke="#D1C8BA" strokeWidth="6" />
                  <path d="M120 0 L 160 200" fill="none" stroke="#DDD5C7" strokeWidth="8" />
                </svg>

                <div className="relative z-10 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-[#DDD8CE] max-w-xs space-y-1.5">
                  <div className="w-8 h-8 rounded-full bg-[#181715] text-white flex items-center justify-center mx-auto mb-1">
                    <MapPin className="w-4 h-4 text-[#E5D7CC]" />
                  </div>
                  <p className="font-serif font-bold text-sm text-[#181715]">
                    Classic Fashions
                  </p>
                  <p className="text-xs text-[#736F68] leading-tight">
                    5/1475, 5th Street, Palanisamy Nagar, Boyampalayam, Tiruppur
                  </p>
                  <div className="pt-1.5">
                    <a
                      href={mapsSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#82553E] hover:underline"
                    >
                      <span>Open Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Col 2: 20. CONTACT FORM: "Send Us an Enquiry" (Col 6-12) */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-10 rounded-xl border border-[#E8E6E0] shadow-sm">
              <div className="mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#82553E] block font-mono">
                  Enquiry Desk
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181715] mt-1">
                  Send Us an Enquiry
                </h2>
                <p className="text-xs sm:text-sm text-[#585550] mt-1">
                  Submit your material or processing inquiry below. Our team will review specifications and respond promptly.
                </p>
              </div>

              {isSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 bg-[#F2ECE4] text-[#82553E] rounded-full flex items-center justify-center mx-auto border border-[#E5D7CC]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#181715]">
                    Enquiry Submitted Successfully
                  </h3>
                  <p className="text-sm text-[#585550] max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="font-semibold text-[#181715]">{formState.name}</span>. Your enquiry for <span className="font-semibold text-[#181715]">{formState.product || formState.interestedCategory}</span> has been logged for Classic Fashions.
                  </p>
                  <button
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
                    }}
                    className="mt-4 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#181715] rounded hover:bg-[#302D29]"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Name & Company Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#585550] mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. S. Murugan"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#D5D0C6] rounded text-sm text-[#181715] focus:outline-none focus:border-[#181715]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#585550] mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Tiruppur Apparel Unit"
                        value={formState.companyName}
                        onChange={(e) => setFormState({ ...formState, companyName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#D5D0C6] rounded text-sm text-[#181715] focus:outline-none focus:border-[#181715]"
                      />
                    </div>
                  </div>

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#585550] mb-1">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 98420 12345"
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#D5D0C6] rounded text-sm text-[#181715] focus:outline-none focus:border-[#181715]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#585550] mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="buyer@domain.com"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#D5D0C6] rounded text-sm text-[#181715] focus:outline-none focus:border-[#181715]"
                      />
                    </div>
                  </div>

                  {/* Interested Category & Product */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#585550] mb-1">
                        Interested Category *
                      </label>
                      <select
                        value={formState.interestedCategory}
                        onChange={(e) => setFormState({ ...formState, interestedCategory: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#D5D0C6] rounded text-sm text-[#181715] focus:outline-none focus:border-[#181715]"
                      >
                        <option value="Laces">Laces</option>
                        <option value="Fabrics">Fabrics</option>
                        <option value="Denim">Denim</option>
                        <option value="Mesh">Mesh</option>
                        <option value="Garment Accessories">Garment Accessories</option>
                        <option value="Processing & Services">Processing &amp; Services (Edge Cutting / Scalping)</option>
                        <option value="Other Materials">Other Materials</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#585550] mb-1">
                        Product
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Poplin Gada / Cotton Lace / Lycra Mesh"
                        value={formState.product}
                        onChange={(e) => setFormState({ ...formState, product: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#D5D0C6] rounded text-sm text-[#181715] focus:outline-none focus:border-[#181715]"
                      />
                    </div>
                  </div>

                  {/* Required Quantity */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#585550] mb-1">
                      Required Quantity
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 500 meters / 25 rolls / Sample piece"
                      value={formState.quantity}
                      onChange={(e) => setFormState({ ...formState, quantity: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#D5D0C6] rounded text-sm text-[#181715] focus:outline-none focus:border-[#181715]"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#585550] mb-1">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Detail your requirements, roll width, shade references, or processing instructions..."
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#D5D0C6] rounded text-sm text-[#181715] focus:outline-none focus:border-[#181715]"
                    />
                  </div>

                  {/* Send Enquiry CTA */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#181715] hover:bg-[#302D29] rounded shadow-sm transition-all"
                    >
                      <Send className="w-4 h-4 text-[#E5D7CC]" />
                      <span>SEND ENQUIRY</span>
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
