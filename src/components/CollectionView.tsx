import React, { useState } from 'react';
import { CollectionItem, Product } from '../types.ts';
import { TextileVisual } from './TextileVisual.tsx';
import {
  Trash2,
  Plus,
  Minus,
  Send,
  ArrowRight,
  ShoppingBag,
  RotateCcw,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { businessConfig } from '../data/businessConfig.ts';

interface CollectionViewProps {
  collection: CollectionItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCollection: () => void;
  onGenerateEnquiry: () => void;
  onExploreCatalogue: () => void;
  onViewDetails: (product: Product) => void;
}

export const CollectionView: React.FC<CollectionViewProps> = ({
  collection,
  onUpdateQuantity,
  onRemoveItem,
  onClearCollection,
  onGenerateEnquiry,
  onExploreCatalogue,
  onViewDetails,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Compute summary stats
  const totalItems = collection.length;
  const totalUnits = collection.reduce((sum, item) => sum + item.quantity, 0);

  if (collection.length === 0) {
    return (
      <div className="bg-[#FBFBFA] min-h-[70vh] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center bg-white rounded-xl border border-[#E8E6E0] p-10 sm:p-14 shadow-sm space-y-6">
          <div className="w-16 h-16 bg-[#F5F4F0] text-[#736F68] rounded-full flex items-center justify-center mx-auto border border-[#E8E5DF]">
            <ShoppingBag className="w-8 h-8 text-[#82553E]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#82553E]">
              Dealer Collection
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#181715]">
              Your Collection is Empty
            </h2>
            <p className="text-sm text-[#585550] max-w-md mx-auto leading-relaxed">
              You haven't added any garment materials, fabrics, or accessories to your collection yet. Browse our catalogue to collect materials for a unified enquiry.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onExploreCatalogue}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#181715] hover:bg-[#302D29] rounded shadow-sm transition-all"
            >
              <span>Explore Digital Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-4 border-t border-[#EFECE6] text-xs text-[#8C877E]">
            Tip: Click <strong>"+ Collect"</strong> on any product card or details view to bundle items into one quotation.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FBFBFA] min-h-screen py-10 pb-24">
      {/* Header Banner */}
      <section className="bg-[#F7F5F0] border-b border-[#E8E6E0] py-10 mb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#82553E] bg-[#EFE8DF] px-3 py-1 rounded-sm border border-[#DFD6CB] inline-block font-mono mb-2">
              Dealer Quotation Basket
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#181715] tracking-tight">
              Your Material Collection
            </h1>
            <p className="text-sm text-[#585550] mt-1">
              Review selected products, configure quantities, and submit a bulk wholesale enquiry to Classic Fashions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExploreCatalogue}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#181715] bg-white border border-[#D5D0C6] hover:bg-[#F5F3ED] rounded transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add More Materials</span>
            </button>

            {showClearConfirm ? (
              <div className="flex items-center gap-1.5 bg-[#FAF1EE] border border-[#F0CEC4] px-2.5 py-1.5 rounded">
                <span className="text-[11px] text-[#A63C26] font-medium">Confirm clear?</span>
                <button
                  onClick={() => {
                    onClearCollection();
                    setShowClearConfirm(false);
                  }}
                  className="text-xs font-bold text-[#A63C26] hover:underline px-1"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="text-xs text-[#736F68] hover:underline px-1"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#8C877E] hover:text-[#A63C26] transition-colors"
                title="Clear all collected items"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content: List + Summary Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Selected Products Table / Card List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between text-xs text-[#736F68] pb-2 border-b border-[#E8E6E0]">
              <span className="font-semibold uppercase tracking-wider text-[#181715]">
                Collected Materials ({totalItems})
              </span>
              <span>All items can be adjusted before enquiry submission</span>
            </div>

            {collection.map((item) => {
              const product = item.product;
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-lg border border-[#E8E6E0] p-4 sm:p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between hover:border-[#CFCAA0] transition-colors shadow-sm"
                >
                  {/* Visual + Title info */}
                  <div className="flex items-center gap-4 flex-1">
                    {/* Visual thumbnail */}
                    <div
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden shrink-0 border border-[#E8E6E0] cursor-pointer"
                      onClick={() => onViewDetails(product)}
                    >
                      <TextileVisual
                        product={product}
                        patternType={product.patternType}
                        category={product.categoryLabel}
                        name={product.name}
                        aspectRatio="1:1"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono font-semibold text-[#82553E] bg-[#F4EDE5] px-2 py-0.5 rounded">
                          {product.productCode}
                        </span>
                        <span className="text-xs text-[#78746C] uppercase font-mono">
                          {product.categoryLabel}
                        </span>
                      </div>

                      <h3
                        onClick={() => onViewDetails(product)}
                        className="font-serif text-lg font-bold text-[#181715] hover:text-[#82553E] cursor-pointer transition-colors"
                      >
                        {product.name}
                      </h3>

                      <div className="text-xs text-[#585550]">
                        <span className="font-medium text-[#181715]">Fabric:</span> {product.fabric}
                      </div>

                      {/* Selected Attributes if any */}
                      {(item.selectedColour || item.selectedSize) && (
                        <div className="flex items-center gap-2 text-[11px] text-[#736F68] pt-0.5">
                          {item.selectedColour && (
                            <span className="bg-[#FAF8F5] border border-[#EAE6DF] px-2 py-0.5 rounded">
                              Colour: <strong>{item.selectedColour}</strong>
                            </span>
                          )}
                          {item.selectedSize && (
                            <span className="bg-[#FAF8F5] border border-[#EAE6DF] px-2 py-0.5 rounded">
                              Size/Width: <strong>{item.selectedSize}</strong>
                            </span>
                          )}
                        </div>
                      )}

                      <div className="text-[11px] text-[#82553E] font-medium font-mono pt-0.5">
                        Est. Guide: {product.price}
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Actions Controls */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#F0EEEA]">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-[#D5D0C6] rounded bg-[#FAF9F6] overflow-hidden">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(product.id, Math.max(1, item.quantity - 1))}
                        className="p-2 text-[#585550] hover:bg-[#EAE7DF] hover:text-[#181715] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          onUpdateQuantity(product.id, Math.max(1, parseInt(e.target.value) || 1))
                        }
                        className="w-12 text-center font-mono font-semibold text-xs text-[#181715] bg-transparent focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(product.id, item.quantity + 1)}
                        className="p-2 text-[#585550] hover:bg-[#EAE7DF] hover:text-[#181715] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Remove Action */}
                    <button
                      onClick={() => onRemoveItem(product.id)}
                      className="inline-flex items-center gap-1 text-xs text-[#8C877E] hover:text-[#A63C26] transition-colors"
                      title="Remove from collection"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Collection Summary & Enquiry Trigger Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-5">
            <div className="bg-white rounded-xl border border-[#E8E6E0] p-6 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#82553E] block mb-1">
                  Enquiry Summary
                </span>
                <h3 className="font-serif text-xl font-bold text-[#181715]">
                  Collection Overview
                </h3>
              </div>

              {/* Breakdown stats */}
              <div className="space-y-3 text-xs border-t border-b border-[#EFECE6] py-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#585550]">Unique Materials:</span>
                  <span className="font-mono font-semibold text-[#181715]">{totalItems} items</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#585550]">Total Quantities / Units:</span>
                  <span className="font-mono font-semibold text-[#181715]">{totalUnits} units</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#585550]">Supply Hub:</span>
                  <span className="font-medium text-[#181715]">Boyampalayam, Tiruppur</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#585550]">Dispatch Capability:</span>
                  <span className="font-medium text-emerald-700">Factory Direct Dispatch</span>
                </div>
              </div>

              {/* Items summary pill list */}
              <div className="space-y-1.5">
                <span className="text-[11px] uppercase font-semibold text-[#736F68] block">
                  Enquiry Item Codes:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {collection.map((i) => (
                    <span
                      key={i.product.id}
                      className="text-[10px] font-mono font-semibold bg-[#F5F4F0] text-[#33302B] px-2 py-0.5 rounded border border-[#E8E5DD]"
                    >
                      {i.product.productCode} (x{i.quantity})
                    </span>
                  ))}
                </div>
              </div>

              {/* PHASE 4: Generate Enquiry Button */}
              <button
                onClick={onGenerateEnquiry}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white bg-[#181715] hover:bg-[#302D29] rounded shadow transition-all active:scale-[0.99]"
              >
                <Send className="w-4 h-4 text-[#E5D7CC]" />
                <span>Generate Enquiry</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <div className="text-[11px] text-center text-[#8C877E] leading-relaxed">
                Clicking <strong>Generate Enquiry</strong> transfers these {totalItems} items directly into the dealer requisition form.
              </div>
            </div>

            {/* Assistance card */}
            <div className="bg-[#FAF9F6] rounded-lg border border-[#E8E6E0] p-4 text-xs text-[#585550] space-y-2">
              <div className="font-semibold text-[#181715] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#82553E]" />
                <span>Wholesale Buyer Support</span>
              </div>
              <p className="leading-relaxed text-[11px]">
                Need immediate mill bolts or custom dye specifications? Call our Tiruppur sales counter directly at <strong className="font-mono text-[#181715]">{businessConfig.phonePlaceholder}</strong>.
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
