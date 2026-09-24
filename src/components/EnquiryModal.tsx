import React, { useState, useEffect } from 'react';
import { Product, CollectionItem, EnquiryFormState } from '../types.ts';
import { businessConfig } from '../data/businessConfig.ts';
import {
  X,
  Send,
  CheckCircle2,
  Phone,
  MessageSquare,
  Mail,
  Copy,
  Check,
  Building2,
  MapPin,
  AlertCircle,
  Package,
} from 'lucide-react';

interface EnquiryModalProps {
  product: Product | null;
  collection?: CollectionItem[];
  isOpen: boolean;
  onClose: () => void;
  onClearCollectionAfterSubmit?: () => void;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  product,
  collection = [],
  isOpen,
  onClose,
  onClearCollectionAfterSubmit,
}) => {
  // Determine if this is a collection enquiry or a single-product enquiry
  const isCollectionMode = !product && collection.length > 0;

  const [formState, setFormState] = useState<EnquiryFormState>({
    name: '',
    companyName: '',
    phone: '',
    email: '',
    address: '',
    productName: '',
    quantity: '',
    message: '',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Initialize or re-populate form whenever product or collection changes
  useEffect(() => {
    if (product) {
      setFormState((prev) => ({
        ...prev,
        productName: `${product.name} (${product.productCode})`,
        quantity: prev.quantity || '500 meters / 20 rolls',
        message:
          prev.message ||
          (product.isService
            ? `We require edge cutting / processing services for ${product.name} (${product.productCode}). Please share rate card and processing timeline.`
            : `We would like to enquire regarding bulk pricing and availability for ${product.name} (${product.productCode}).`),
      }));
    } else if (collection.length > 0) {
      const summaryList = collection
        .map((item) => `${item.product.name} [${item.product.productCode}] (Qty: ${item.quantity})`)
        .join(', ');
      const totalUnits = collection.reduce((sum, item) => sum + item.quantity, 0);

      setFormState((prev) => ({
        ...prev,
        productName: summaryList,
        quantity: `${totalUnits} total units across ${collection.length} materials`,
        message:
          prev.message ||
          `Please provide a consolidated wholesale quotation and lead time for our selected collection of ${collection.length} materials.`,
      }));
    }
    setIsSubmitted(false);
    setErrors({});
    setTouched({});
  }, [product, collection, isOpen]);

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

  // Form Validation
  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formState.name.trim()) {
      errs.name = 'Full name is required';
    }

    if (!formState.companyName.trim()) {
      errs.companyName = 'Company or shop name is required';
    }

    if (!formState.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (formState.phone.trim().length < 8) {
      errs.phone = 'Please enter a valid phone number';
    }

    if (!formState.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (!formState.address.trim()) {
      errs.address = 'Business or delivery address is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched: Record<string, boolean> = {
      name: true,
      companyName: true,
      phone: true,
      email: true,
      address: true,
    };
    setTouched(allTouched);

    if (validate()) {
      setIsSubmitted(true);
      if (isCollectionMode && onClearCollectionAfterSubmit) {
        // Option to retain or clean up
      }
    }
  };

  const generateEnquiryText = () => {
    let itemsText = '';
    if (isCollectionMode && collection.length > 0) {
      itemsText = collection
        .map(
          (i, idx) =>
            `${idx + 1}. ${i.product.name} (Code: ${i.product.productCode}) - Qty: ${
              i.quantity
            }${i.selectedColour ? ` | Colour: ${i.selectedColour}` : ''}${
              i.selectedSize ? ` | Size: ${i.selectedSize}` : ''
            }`
        )
        .join('\n');
    } else if (product) {
      itemsText = `${product.name} (Code: ${product.productCode}) - Qty: ${
        formState.quantity || 'Wholesale inquiry'
      }`;
    }

    return `*Dealer Wholesale Enquiry - Classic Fashions*\n\n` +
      `*Client / Company Details:*\n` +
      `Name: ${formState.name}\n` +
      `Company / Shop: ${formState.companyName}\n` +
      `Phone: ${formState.phone}\n` +
      `Email: ${formState.email}\n` +
      `Address: ${formState.address}\n\n` +
      `*Selected Products:*\n` +
      `${itemsText}\n\n` +
      `*Estimated Quantity / Scale:*\n` +
      `${formState.quantity}\n\n` +
      `*Additional Message / Notes:*\n` +
      `${formState.message || 'Please provide quotation and delivery schedule.'}`;
  };

  const handleCopyEnquiry = () => {
    navigator.clipboard.writeText(generateEnquiryText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-[#DCD7CD] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E6E0] bg-[#FAF9F6]">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#82553E] block font-mono">
              {isCollectionMode ? 'Dealer Collection Quotation' : 'Wholesale Product Sourcing'}
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#181715]">
              {isCollectionMode
                ? `Enquiry for ${collection.length} Selected Material${
                    collection.length > 1 ? 's' : ''
                  }`
                : product
                ? product.name
                : 'Dealer Requisition Form'}
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
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          {isSubmitted ? (
            /* PHASE 5: Professional Success Screen */
            <div className="py-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-[#E8F5E9] text-emerald-800 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <h4 className="font-serif text-2xl sm:text-3xl font-bold text-[#181715]">
                  Enquiry Submitted Successfully
                </h4>
                <p className="text-sm text-[#585550] max-w-md mx-auto leading-relaxed">
                  Your enquiry has been submitted successfully. Classic Fashions will contact you shortly.
                </p>
                <p className="text-xs font-mono text-[#8C877E] pt-1">
                  Representative: <strong className="text-[#181715]">{formState.name}</strong> •{' '}
                  <strong className="text-[#181715]">{formState.companyName}</strong>
                </p>
              </div>

              {/* Direct Action Options */}
              <div className="max-w-md mx-auto bg-[#FAF9F6] p-4 rounded-lg border border-[#E8E6E0] text-left space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#181715] flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-[#82553E]" />
                  <span>Immediate Communication Shortcuts:</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleCopyEnquiry}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-[#181715] bg-white border border-[#D5D0C6] hover:bg-[#F5F3ED] rounded transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied to Clipboard' : 'Copy Requisition'}</span>
                  </button>

                  <a
                    href={`mailto:${businessConfig.emailPlaceholder}?subject=${encodeURIComponent(
                      `Dealer Wholesale Enquiry: ${formState.companyName} (${formState.name})`
                    )}&body=${encodeURIComponent(generateEnquiryText())}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-white bg-[#181715] hover:bg-[#302D29] rounded transition-colors text-center"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email Sales Desk</span>
                  </a>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-center gap-4">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs text-[#585550] hover:text-[#181715] underline"
                >
                  Edit enquiry details
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#181715] rounded hover:bg-[#302D29]"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* PHASE 5: Dealer Enquiry Form */
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              
              {/* Selected Products Summary Card */}
              <div className="bg-[#FAF9F6] border border-[#EAE7DF] rounded-lg p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-[#181715] flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-[#82553E]" />
                    <span>Selected Materials ({isCollectionMode ? collection.length : 1})</span>
                  </span>
                  <span className="font-mono text-[11px] text-[#8C877E]">Wholesale Catalog</span>
                </div>

                {isCollectionMode ? (
                  <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1 divide-y divide-[#EFECE6]">
                    {collection.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center justify-between text-xs pt-1.5"
                      >
                        <div>
                          <span className="font-medium text-[#181715]">{item.product.name}</span>
                          <span className="text-[10px] font-mono text-[#82553E] ml-1.5">
                            [{item.product.productCode}]
                          </span>
                          {item.selectedColour && (
                            <span className="text-[10px] text-[#736F68] block">
                              Colour: {item.selectedColour}
                              {item.selectedSize ? ` • Size: ${item.selectedSize}` : ''}
                            </span>
                          )}
                        </div>
                        <span className="font-mono font-semibold text-[#181715] text-xs bg-white px-2 py-0.5 rounded border border-[#E5E1D8]">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : product ? (
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div>
                      <span className="font-medium text-[#181715]">{product.name}</span>
                      <span className="text-[10px] font-mono text-[#82553E] ml-1.5">
                        [{product.productCode}]
                      </span>
                      <span className="text-[10px] text-[#736F68] block">
                        Fabric: {product.fabric} • {product.price}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-semibold text-[#82553E] bg-white px-2 py-0.5 rounded border border-[#E5E1D8]">
                      {product.availability}
                    </span>
                  </div>
                ) : null}
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#585550] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Krishnan"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    onBlur={() => handleBlur('name')}
                    className={`w-full px-3.5 py-2.5 bg-white border rounded text-sm text-[#181715] focus:outline-none transition-colors ${
                      touched.name && errors.name
                        ? 'border-red-500 focus:border-red-600 bg-red-50/20'
                        : 'border-[#DCD7CD] focus:border-[#181715]'
                    }`}
                  />
                  {touched.name && errors.name && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* 2. Company / Shop Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#585550] mb-1">
                    Company / Shop Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tiruppur Knits & Garments"
                    value={formState.companyName}
                    onChange={(e) => setFormState({ ...formState, companyName: e.target.value })}
                    onBlur={() => handleBlur('companyName')}
                    className={`w-full px-3.5 py-2.5 bg-white border rounded text-sm text-[#181715] focus:outline-none transition-colors ${
                      touched.companyName && errors.companyName
                        ? 'border-red-500 focus:border-red-600 bg-red-50/20'
                        : 'border-[#DCD7CD] focus:border-[#181715]'
                    }`}
                  />
                  {touched.companyName && errors.companyName && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.companyName}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 3. Phone Number */}
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
                    onBlur={() => handleBlur('phone')}
                    className={`w-full px-3.5 py-2.5 bg-white border rounded text-sm text-[#181715] focus:outline-none transition-colors ${
                      touched.phone && errors.phone
                        ? 'border-red-500 focus:border-red-600 bg-red-50/20'
                        : 'border-[#DCD7CD] focus:border-[#181715]'
                    }`}
                  />
                  {touched.phone && errors.phone && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* 4. Email */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#585550] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="purchase@garments.com"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    onBlur={() => handleBlur('email')}
                    className={`w-full px-3.5 py-2.5 bg-white border rounded text-sm text-[#181715] focus:outline-none transition-colors ${
                      touched.email && errors.email
                        ? 'border-red-500 focus:border-red-600 bg-red-50/20'
                        : 'border-[#DCD7CD] focus:border-[#181715]'
                    }`}
                  />
                  {touched.email && errors.email && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* 5. Address (Required by Phase 5) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#585550] mb-1">
                  Business / Factory Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 14/B, Avinashi Main Road, Tiruppur, Tamil Nadu"
                  value={formState.address}
                  onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                  onBlur={() => handleBlur('address')}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded text-sm text-[#181715] focus:outline-none transition-colors ${
                    touched.address && errors.address
                      ? 'border-red-500 focus:border-red-600 bg-red-50/20'
                      : 'border-[#DCD7CD] focus:border-[#181715]'
                  }`}
                />
                {touched.address && errors.address && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.address}
                  </p>
                )}
              </div>

              {/* 6. Quantity (Editable / Specified) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#585550] mb-1">
                  Required Quantity / Order Volume
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1,000 meters / 20 commercial rolls / 500 gross buttons"
                  value={formState.quantity}
                  onChange={(e) => setFormState({ ...formState, quantity: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#DCD7CD] rounded text-sm text-[#181715] focus:outline-none focus:border-[#181715]"
                />
              </div>

              {/* 7. Additional Message */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#585550] mb-1">
                  Additional Notes / Specific Requirements
                </label>
                <textarea
                  rows={2}
                  placeholder="Mention delivery target dates, custom shades, sample yardage requests, or scalping specifications..."
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
                <span>Submit Dealer Enquiry</span>
              </button>
            </form>
          )}

          {/* Contact Directly Footer Block */}
          <div className="pt-4 border-t border-[#E8E6E0]">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#736F68] mb-3">
              Direct Contact Desk:
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#FAF9F6] rounded border border-[#E8E6E0] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#82553E] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#8C877E] uppercase block font-mono">
                      DIRECT DESK
                    </span>
                    <span className="font-semibold text-[#181715] font-mono text-[11px]">
                      {businessConfig.phonePlaceholder}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-semibold text-[#82553E] bg-[#F2EDE6] px-2 py-0.5 rounded">
                  Boyampalayam
                </span>
              </div>

              <div className="p-3 bg-[#FAF9F6] rounded border border-[#E8E6E0] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-[#2E7D32] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#8C877E] uppercase block font-mono">
                      WHATSAPP DESK
                    </span>
                    <span className="font-semibold text-[#181715] font-mono text-[11px]">
                      {businessConfig.whatsappPlaceholder}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-semibold text-[#2E7D32] bg-[#EAF5EC] px-2 py-0.5 rounded">
                  Active
                </span>
              </div>
            </div>
            <p className="text-[11px] text-[#8C877E] mt-2 font-mono text-center">
              Classic Fashions • Boyampalayam, Tiruppur, Tamil Nadu
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
