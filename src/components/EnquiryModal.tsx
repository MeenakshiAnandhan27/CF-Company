import React, { useState, useEffect } from 'react';
import { Product, EnquiryFormState } from '../types.ts';
import { businessConfig } from '../data/businessConfig.ts';
import { X, Send, CheckCircle2, Phone, MessageSquare, Mail, Copy, Check } from 'lucide-react';

interface EnquiryModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [formState, setFormState] = useState<EnquiryFormState>({
    name: '',
    companyName: '',
    phone: '',
    email: '',
    productName: product?.name || '',
    quantity: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (product) {
      setFormState((prev) => ({
        ...prev,
        productName: product.name,
        message: prev.message || (product.isService 
          ? `We are interested in processing services for ${product.name}. Please share processing capabilities, lead time, and quotation.`
          : `We would like to enquire about wholesale availability and pricing for ${product.name}.`),
      }));
    }
    setIsSubmitted(false);
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Honest frontend flow (no fake backend API call)
    setIsSubmitted(true);
  };

  const handleCopyEnquiry = () => {
    const enquiryText = `*Wholesale Enquiry - ${businessConfig.businessName}*\nProduct: ${formState.productName}\nQuantity: ${formState.quantity || 'Not specified'}\nName: ${formState.name}\nCompany: ${formState.companyName}\nPhone: ${formState.phone}\nEmail: ${formState.email}\nMessage: ${formState.message}`;
    navigator.clipboard.writeText(enquiryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-[#DCD7CD] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E6E0] bg-[#FAF9F6]">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#82553E] block">
              Wholesale Sourcing Enquiry
            </span>
            <h3 className="font-serif text-xl font-semibold text-[#181715]">
              {product ? product.name : 'Product Enquiry'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#585550] hover:text-[#181715] hover:bg-[#EFECE6] rounded-full transition-colors"
            aria-label="Close Enquiry Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 bg-[#F2ECE4] text-[#82553E] rounded-full flex items-center justify-center mx-auto border border-[#E5D7CC]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="font-serif text-2xl font-semibold text-[#181715]">
                  Enquiry Prepared Successfully
                </h4>
                <p className="text-sm text-[#585550] max-w-md mx-auto mt-2 leading-relaxed">
                  Thank you, <span className="font-semibold text-[#181715]">{formState.name || 'Valued Buyer'}</span>. Your wholesale enquiry for <span className="font-semibold text-[#181715]">{formState.productName}</span> has been structured for our sales team.
                </p>
              </div>

              {/* Direct Action Options */}
              <div className="max-w-md mx-auto bg-[#FAF9F6] p-4 rounded-lg border border-[#E8E6E0] text-left space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#181715]">
                  Direct Connection Options:
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleCopyEnquiry}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-[#181715] bg-white border border-[#D5D0C6] hover:bg-[#F5F3ED] rounded transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied to Clipboard' : 'Copy Enquiry Details'}</span>
                  </button>

                  <a
                    href={`mailto:${businessConfig.emailPlaceholder}?subject=${encodeURIComponent(`Wholesale Enquiry: ${formState.productName} - ${formState.companyName || formState.name}`)}&body=${encodeURIComponent(
                      `Product: ${formState.productName}\nRequired Quantity: ${formState.quantity}\nContact Name: ${formState.name}\nCompany: ${formState.companyName}\nPhone: ${formState.phone}\nMessage:\n${formState.message}`
                    )}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-white bg-[#181715] hover:bg-[#302D29] rounded transition-colors text-center"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email Sales Desk</span>
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs text-[#585550] hover:text-[#181715] underline"
                >
                  Edit or send another enquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Product Name (Read-only / Auto-filled) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#585550] mb-1">
                  Interested Product / Service
                </label>
                <input
                  type="text"
                  required
                  value={formState.productName}
                  onChange={(e) => setFormState({ ...formState, productName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F5F4F0] border border-[#DCD7CD] rounded text-sm text-[#181715] font-medium focus:outline-none focus:border-[#181715]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#585550] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Sharma"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DCD7CD] rounded text-sm text-[#181715] focus:outline-none focus:border-[#181715]"
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#585550] mb-1">
                    Company / Brand Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Apparel Studio"
                    value={formState.companyName}
                    onChange={(e) => setFormState({ ...formState, companyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DCD7CD] rounded text-sm text-[#181715] focus:outline-none focus:border-[#181715]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#585550] mb-1">
                    Phone / Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DCD7CD] rounded text-sm text-[#181715] focus:outline-none focus:border-[#181715]"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#585550] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="contact@company.com"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DCD7CD] rounded text-sm text-[#181715] focus:outline-none focus:border-[#181715]"
                  />
                </div>
              </div>

              {/* Required Quantity */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#585550] mb-1">
                  Estimated Quantity / Requirement
                </label>
                <input
                  type="text"
                  placeholder="e.g. 500 meters / 20 rolls / Sample yardage"
                  value={formState.quantity}
                  onChange={(e) => setFormState({ ...formState, quantity: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#DCD7CD] rounded text-sm text-[#181715] focus:outline-none focus:border-[#181715]"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#585550] mb-1">
                  Message / Custom Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Mention desired colorways, roll widths, or specific processing instructions..."
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#DCD7CD] rounded text-sm text-[#181715] focus:outline-none focus:border-[#181715]"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#181715] hover:bg-[#302D29] rounded shadow-sm transition-all"
              >
                <Send className="w-4 h-4 text-[#E5D7CC]" />
                <span>Send Enquiry</span>
              </button>
            </form>
          )}

          {/* Contact Directly Box */}
          <div className="pt-4 border-t border-[#E8E6E0]">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#736F68] mb-3">
              Direct Contact Options:
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#FAF9F6] rounded border border-[#E8E6E0] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#82553E] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#8C877E] uppercase block font-mono">CALL US</span>
                    <span className="font-semibold text-[#181715] font-mono text-[11px]">{businessConfig.phonePlaceholder}</span>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-semibold text-[#82553E] bg-[#F2EDE6] px-2 py-0.5 rounded">
                  Direct Line
                </span>
              </div>

              <div className="p-3 bg-[#FAF9F6] rounded border border-[#E8E6E0] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-[#2E7D32] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#8C877E] uppercase block font-mono">WHATSAPP US</span>
                    <span className="font-semibold text-[#181715] font-mono text-[11px]">{businessConfig.whatsappPlaceholder}</span>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-semibold text-[#2E7D32] bg-[#EAF5EC] px-2 py-0.5 rounded">
                  Instant Query
                </span>
              </div>
            </div>
            <p className="text-[11px] text-[#8C877E] mt-2 font-mono text-center">
              Classic Fashions • Boyampalayam, Tiruppur
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
