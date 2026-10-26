import React, { useState } from 'react';
import { Scissors, Store, Tag, Sparkles, ArrowRight, ArrowDown, CheckCircle2, Search, Send, PackageCheck, Check, Layers, BookOpen } from 'lucide-react';

interface HomeIntroProps {
  onExploreCatalogue: () => void;
  onReachUs: () => void;
  onRequestMaterial: () => void;
}

export const HomeIntro: React.FC<HomeIntroProps> = ({
  onExploreCatalogue,
  onReachUs,
  onRequestMaterial,
}) => {
  return (
    <div className="bg-[#FBFBFA]">
      
      {/* ========================================================================= */}
      {/* 1. SUPPLIER & MANUFACTURING — CLEAN B2B WORKFLOW & ACTION CONTROLS       */}
      {/* ========================================================================= */}
      <section className="relative py-16 md:py-24 border-b border-[#E6E0D2] bg-[#FAF7F2] overflow-hidden">
        {/* Subtle Luxury Golden Micro-Dot Atmosphere Pattern */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-45"
          style={{
            backgroundImage: 'radial-gradient(rgba(212, 175, 55, 0.22) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Soft Warm Golden Ambient Light */}
        <div 
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: 'radial-gradient(ellipse 65% 50% at 50% 15%, rgba(212,175,55,0.14), transparent 70%)'
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181715] tracking-tight">
              Supplier &amp; Manufacturing
            </h2>

            {/* Luxury Gold Diamond Motif Divider */}
            <div className="relative flex items-center justify-center my-6 w-full max-w-md mx-auto">
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-[#D4AF37]" />
              <div className="relative mx-3.5 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-gradient-to-tr from-[#D4AF37] via-[#F2D785] to-[#B38728] rotate-45 shadow-[0_0_12px_rgba(212,175,55,0.75)] ring-2 ring-[#FAF7F2]" />
              </div>
              <div className="h-[1px] w-full bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/50 to-transparent" />
            </div>

            <p className="text-base sm:text-lg text-[#55514B] leading-relaxed font-normal text-pretty">
              From regular catalogue materials to specific manufacturing requirements, we source, manufacture, and supply garment fabrics and accessories suited to your needs.
            </p>
          </div>

          {/* Minimal Visual Progression Flow:
              YOUR REQUIREMENT -> WE SOURCE -> WE MATCH -> WE SUPPLY
              (Clean Cards with Dedicated Action Buttons) */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6 relative z-10">
              
              {/* Stage 1: YOUR REQUIREMENT */}
              <div className="group relative bg-gradient-to-b from-[#1F1C18] via-[#181715] to-[#121110] p-6 lg:p-7 rounded-2xl border border-[#D4AF37]/50 hover:border-[#F2D785] shadow-[0_8px_28px_rgba(0,0,0,0.22)] hover:shadow-[0_16px_36px_rgba(212,175,55,0.22)] transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1.5">
                <div>
                  {/* Luxury Brushed Gold Icon Medallion */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#D4AF37] via-[#F2D785] to-[#B38728] text-[#181715] flex items-center justify-center mb-5 shadow-[0_4px_16px_rgba(212,175,55,0.35)] group-hover:scale-105 group-hover:shadow-[0_6px_22px_rgba(212,175,55,0.5)] transition-all duration-300">
                    <Send className="w-5 h-5 text-[#181715] stroke-[2.2]" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#FFF8EC] group-hover:text-[#F2D785] mb-2 tracking-tight transition-colors duration-300">
                    Your Requirement
                  </h3>
                  <p className="text-xs sm:text-sm text-[#BCB6AA] group-hover:text-[#D5D0C5] leading-relaxed transition-colors duration-300">
                    Share what you need—fabric type, yarn count, finish, colorway, or reference sample image.
                  </p>
                </div>

                <div className="pt-4 mt-5 border-t border-[#D4AF37]/25">
                  {/* Action Button - Matte Catalogue Pill */}
                  <button
                    onClick={onRequestMaterial}
                    className="w-full py-2 pl-4 pr-1.5 rounded-full bg-gradient-to-r from-[#24211D] via-[#2A2621] to-[#1C1A17] hover:from-[#2E2A23] hover:to-[#221F1B] border border-[#D4AF37]/60 hover:border-[#F2D785] text-[#FFF8EC] transition-all duration-300 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.35)] hover:shadow-[0_4px_18px_rgba(212,175,55,0.3)] active:scale-[0.98] group/btn cursor-pointer"
                  >
                    <span className="font-mono text-[11px] tracking-[0.16em] font-bold uppercase">Submit Spec</span>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#F2D785] to-[#B38728] text-[#181715] font-bold flex items-center justify-center transition-all duration-300 shadow-xs group-hover/btn:scale-105 group-hover/btn:translate-x-0.5">
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Stage 2: WE SOURCE */}
              <div className="group relative bg-gradient-to-b from-[#1F1C18] via-[#181715] to-[#121110] p-6 lg:p-7 rounded-2xl border border-[#D4AF37]/50 hover:border-[#F2D785] shadow-[0_8px_28px_rgba(0,0,0,0.22)] hover:shadow-[0_16px_36px_rgba(212,175,55,0.22)] transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1.5">
                <div>
                  {/* Luxury Brushed Gold Icon Medallion */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#D4AF37] via-[#F2D785] to-[#B38728] text-[#181715] flex items-center justify-center mb-5 shadow-[0_4px_16px_rgba(212,175,55,0.35)] group-hover:scale-105 group-hover:shadow-[0_6px_22px_rgba(212,175,55,0.5)] transition-all duration-300">
                    <Search className="w-5 h-5 text-[#181715] stroke-[2.2]" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#FFF8EC] group-hover:text-[#F2D785] mb-2 tracking-tight transition-colors duration-300">
                    We Source
                  </h3>
                  <p className="text-xs sm:text-sm text-[#BCB6AA] group-hover:text-[#D5D0C5] leading-relaxed transition-colors duration-300">
                    We map options across verified manufacturing and supply sources to locate the exact match.
                  </p>
                </div>

                <div className="pt-4 mt-5 border-t border-[#D4AF37]/25">
                  {/* Action Button - Matte Catalogue Pill */}
                  <button
                    onClick={onExploreCatalogue}
                    className="w-full py-2 pl-4 pr-1.5 rounded-full bg-gradient-to-r from-[#24211D] via-[#2A2621] to-[#1C1A17] hover:from-[#2E2A23] hover:to-[#221F1B] border border-[#D4AF37]/60 hover:border-[#F2D785] text-[#FFF8EC] transition-all duration-300 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.35)] hover:shadow-[0_4px_18px_rgba(212,175,55,0.3)] active:scale-[0.98] group/btn cursor-pointer"
                  >
                    <span className="font-mono text-[11px] tracking-[0.16em] font-bold uppercase">Browse Fabrics</span>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#F2D785] to-[#B38728] text-[#181715] font-bold flex items-center justify-center transition-all duration-300 shadow-xs group-hover/btn:scale-105 group-hover/btn:translate-x-0.5">
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Stage 3: WE MATCH */}
              <div className="group relative bg-gradient-to-b from-[#1F1C18] via-[#181715] to-[#121110] p-6 lg:p-7 rounded-2xl border border-[#D4AF37]/50 hover:border-[#F2D785] shadow-[0_8px_28px_rgba(0,0,0,0.22)] hover:shadow-[0_16px_36px_rgba(212,175,55,0.22)] transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1.5">
                <div>
                  {/* Luxury Brushed Gold Icon Medallion */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#D4AF37] via-[#F2D785] to-[#B38728] text-[#181715] flex items-center justify-center mb-5 shadow-[0_4px_16px_rgba(212,175,55,0.35)] group-hover:scale-105 group-hover:shadow-[0_6px_22px_rgba(212,175,55,0.5)] transition-all duration-300">
                    <CheckCircle2 className="w-5 h-5 text-[#181715] stroke-[2.2]" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#FFF8EC] group-hover:text-[#F2D785] mb-2 tracking-tight transition-colors duration-300">
                    We Match
                  </h3>
                  <p className="text-xs sm:text-sm text-[#BCB6AA] group-hover:text-[#D5D0C5] leading-relaxed transition-colors duration-300">
                    We review sample feel, color shade, weave density, and quality against your specifications.
                  </p>
                </div>

                <div className="pt-4 mt-5 border-t border-[#D4AF37]/25">
                  {/* Action Button - Matte Catalogue Pill */}
                  <button
                    onClick={onRequestMaterial}
                    className="w-full py-2 pl-4 pr-1.5 rounded-full bg-gradient-to-r from-[#24211D] via-[#2A2621] to-[#1C1A17] hover:from-[#2E2A23] hover:to-[#221F1B] border border-[#D4AF37]/60 hover:border-[#F2D785] text-[#FFF8EC] transition-all duration-300 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.35)] hover:shadow-[0_4px_18px_rgba(212,175,55,0.3)] active:scale-[0.98] group/btn cursor-pointer"
                  >
                    <span className="font-mono text-[11px] tracking-[0.16em] font-bold uppercase">Request Swatch</span>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#F2D785] to-[#B38728] text-[#181715] font-bold flex items-center justify-center transition-all duration-300 shadow-xs group-hover/btn:scale-105 group-hover/btn:translate-x-0.5">
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Stage 4: WE SUPPLY */}
              <div className="group relative bg-gradient-to-b from-[#1F1C18] via-[#181715] to-[#121110] p-6 lg:p-7 rounded-2xl border border-[#D4AF37]/50 hover:border-[#F2D785] shadow-[0_8px_28px_rgba(0,0,0,0.22)] hover:shadow-[0_16px_36px_rgba(212,175,55,0.22)] transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1.5">
                <div>
                  {/* Luxury Brushed Gold Icon Medallion */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#D4AF37] via-[#F2D785] to-[#B38728] text-[#181715] flex items-center justify-center mb-5 shadow-[0_4px_16px_rgba(212,175,55,0.35)] group-hover:scale-105 group-hover:shadow-[0_6px_22px_rgba(212,175,55,0.5)] transition-all duration-300">
                    <PackageCheck className="w-5 h-5 text-[#181715] stroke-[2.2]" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#FFF8EC] group-hover:text-[#F2D785] mb-2 tracking-tight transition-colors duration-300">
                    We Supply
                  </h3>
                  <p className="text-xs sm:text-sm text-[#BCB6AA] group-hover:text-[#D5D0C5] leading-relaxed transition-colors duration-300">
                    We arrange reliable fulfillment, whether for sampling yardage or commercial production lots.
                  </p>
                </div>

                <div className="pt-4 mt-5 border-t border-[#D4AF37]/25">
                  {/* Action Button - Matte Catalogue Pill */}
                  <button
                    onClick={onReachUs}
                    className="w-full py-2 pl-4 pr-1.5 rounded-full bg-gradient-to-r from-[#24211D] via-[#2A2621] to-[#1C1A17] hover:from-[#2E2A23] hover:to-[#221F1B] border border-[#D4AF37]/60 hover:border-[#F2D785] text-[#FFF8EC] transition-all duration-300 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.35)] hover:shadow-[0_4px_18px_rgba(212,175,55,0.3)] active:scale-[0.98] group/btn cursor-pointer"
                  >
                    <span className="font-mono text-[11px] tracking-[0.16em] font-bold uppercase">Supply Desk</span>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#F2D785] to-[#B38728] text-[#181715] font-bold flex items-center justify-center transition-all duration-300 shadow-xs group-hover/btn:scale-105 group-hover/btn:translate-x-0.5">
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. BEYOND THE CATALOGUE / NEED SOMETHING SPECIFIC?                         */}
      {/* Clean, simple & uncluttered (anti-kasakasa)                                */}
      {/* ========================================================================= */}
      <section className="relative py-16 md:py-24 border-b border-[#E6E0D2] bg-[#F5F1E8] overflow-hidden">
        {/* Soft Warm Golden Ambient Light */}
        <div 
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 20% 40%, rgba(212,175,55,0.14), transparent 70%)'
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column Copy - Simple & Uncluttered */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181715] tracking-tight">
                Not Every Requirement Fits Into a Catalogue.
              </h3>

              {/* Gold Diamond Motif Line */}
              <div className="relative flex items-center justify-start w-full max-w-sm pt-0.5">
                <div className="h-[1px] w-28 bg-gradient-to-r from-[#D4AF37] to-[#D4AF37]/50" />
                <div className="relative mx-2.5 flex items-center justify-center">
                  <div className="w-2 h-2 bg-gradient-to-tr from-[#D4AF37] via-[#F2D785] to-[#B38728] rotate-45 shadow-[0_0_8px_rgba(212,175,55,0.75)]" />
                </div>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-[#D4AF37]/50 to-transparent" />
              </div>

              <p className="text-base sm:text-lg text-[#55514B] leading-relaxed">
                Dedicated sourcing and manufacturing solutions tailored to your technical specifications, custom weaves, and physical reference samples.
              </p>

              {/* Simplified 3 Quick Spec Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white border border-[#E6E0D5] text-xs font-medium text-[#2E2B27] shadow-2xs">
                  <div className="w-5 h-5 rounded-full bg-[#F3EDE3] text-[#82553E] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>Custom Weave &amp; GSM</span>
                </div>

                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white border border-[#E6E0D5] text-xs font-medium text-[#2E2B27] shadow-2xs">
                  <div className="w-5 h-5 rounded-full bg-[#F3EDE3] text-[#82553E] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>Swatch Counter-Match</span>
                </div>

                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white border border-[#E6E0D5] text-xs font-medium text-[#2E2B27] shadow-2xs">
                  <div className="w-5 h-5 rounded-full bg-[#F3EDE3] text-[#82553E] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>Sampling &amp; Bulk Lots</span>
                </div>
              </div>

              {/* Unique Luxury CTAs */}
              <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                {/* Primary: REQUEST A MATERIAL — Unique Obsidian & Metallic Gold Capsule */}
                <button
                  onClick={onRequestMaterial}
                  className="group relative inline-flex items-center justify-between gap-3 pl-6 pr-2 py-2 text-xs font-semibold uppercase tracking-[0.16em] rounded-full transition-all duration-300 text-[#FFF8EC] bg-gradient-to-r from-[#181715] via-[#24211D] to-[#181715] hover:from-[#24211D] hover:to-[#111110] border border-[#D4AF37] hover:border-[#F2D785] shadow-[0_4px_16px_rgba(212,175,55,0.25)] hover:shadow-[0_6px_28px_rgba(212,175,55,0.45)] active:scale-[0.98] cursor-pointer whitespace-nowrap min-h-[46px]"
                >
                  <span className="font-mono text-[11px] tracking-[0.18em] font-bold">Request a Material</span>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#F2D785] to-[#B38728] text-[#181715] font-bold flex items-center justify-center transition-all duration-300 shadow-sm group-hover:scale-105 group-hover:translate-x-0.5">
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                </button>

                {/* Secondary: BROWSE CURRENT CATALOGUE — Luxury Ivory Satin Pill with Gold Accents */}
                <button
                  onClick={onExploreCatalogue}
                  className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] rounded-full transition-all duration-300 text-[#181715] hover:text-[#82553E] bg-gradient-to-b from-white via-[#FAF7F2] to-[#F3EDE3] hover:from-white hover:to-[#FAF6EE] border border-[#D4AF37]/50 hover:border-[#D4AF37] shadow-[0_2px_12px_rgba(212,175,55,0.12)] hover:shadow-[0_4px_20px_rgba(212,175,55,0.25)] active:scale-[0.98] cursor-pointer whitespace-nowrap min-h-[46px]"
                >
                  <BookOpen className="w-4 h-4 text-[#8C6534] transition-transform duration-300 group-hover:scale-110" />
                  <span className="font-mono text-[11px] tracking-[0.16em] font-bold">Browse Current Catalogue</span>
                </button>
              </div>

            </div>

            {/* Right Column Visual Card - Minimalist Sourcing Intake */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E5E0D6] shadow-[0_10px_35px_rgba(24,23,21,0.05)] space-y-6">
                
                <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-4">
                  <h4 className="font-serif text-lg font-bold text-[#181715]">
                    Material Intake
                  </h4>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EBF5EE] border border-[#CDE5D5] text-[11px] font-medium text-[#1E7039]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1E7039] animate-pulse" />
                    <span>Direct Support</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center gap-3.5 p-3 bg-[#FAF8F5] rounded-xl border border-[#EDE8DF]">
                    <div className="w-7 h-7 rounded-lg bg-white border border-[#DCD5C9] text-[#82553E] font-mono font-bold flex items-center justify-center shrink-0 shadow-2xs">
                      1
                    </div>
                    <div>
                      <span className="font-semibold text-[#181715] block">Submit Specifications</span>
                      <span className="text-[#69645E]">Yarn count, weave, composition, or photo</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-3 bg-[#FAF8F5] rounded-xl border border-[#EDE8DF]">
                    <div className="w-7 h-7 rounded-lg bg-white border border-[#DCD5C9] text-[#82553E] font-mono font-bold flex items-center justify-center shrink-0 shadow-2xs">
                      2
                    </div>
                    <div>
                      <span className="font-semibold text-[#181715] block">Counter-Swatch Match</span>
                      <span className="text-[#69645E]">Physical swatch matching via verified mills</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-3 bg-[#FAF8F5] rounded-xl border border-[#EDE8DF]">
                    <div className="w-7 h-7 rounded-lg bg-white border border-[#DCD5C9] text-[#82553E] font-mono font-bold flex items-center justify-center shrink-0 shadow-2xs">
                      3
                    </div>
                    <div>
                      <span className="font-semibold text-[#181715] block">Sample Yardage &amp; Bulk</span>
                      <span className="text-[#69645E]">Approved quality dispatched to production</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onRequestMaterial}
                  className="w-full py-3.5 bg-[#82553E] hover:bg-[#6E4430] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-sm hover:shadow text-center flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <span>Open Sourcing Request Form</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WHY CLASSIC FASHIONS — VISUALIZED UNIQUE STYLE                          */}
      {/* ========================================================================= */}
      <section className="relative py-16 md:py-24 border-b border-[#E6E0D2] bg-[#FAF7F2] overflow-hidden">
        {/* Subtle Luxury Golden Micro-Dot Atmosphere Pattern */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-45"
          style={{
            backgroundImage: 'radial-gradient(rgba(212, 175, 55, 0.22) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Soft Warm Golden Ambient Light */}
        <div 
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: 'radial-gradient(ellipse 65% 50% at 50% 20%, rgba(212,175,55,0.14), transparent 70%)'
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181715] tracking-tight">
              Why Classic Fashions
            </h3>

            {/* Luxury Gold Diamond Motif Divider */}
            <div className="relative flex items-center justify-center mt-5 w-full max-w-md mx-auto">
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-[#D4AF37]" />
              <div className="relative mx-3.5 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-gradient-to-tr from-[#D4AF37] via-[#F2D785] to-[#B38728] rotate-45 shadow-[0_0_12px_rgba(212,175,55,0.75)] ring-2 ring-[#FAF7F2]" />
              </div>
              <div className="h-[1px] w-full bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/50 to-transparent" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: REQUIREMENT-BASED SOURCING */}
            <div className="group relative bg-gradient-to-b from-[#FFFFFF] via-[#FFFDF7] to-[#F5EAD4] p-6 lg:p-7 rounded-2xl border border-[#DEC599] hover:border-[#D4AF37] shadow-[0_4px_20px_rgba(212,175,55,0.12)] hover:shadow-[0_12px_32px_rgba(212,175,55,0.25)] transition-all duration-300 flex flex-col justify-start transform hover:-translate-y-1.5">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#D4AF37] via-[#F2D785] to-[#B38728] text-[#181715] flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                    <Sparkles className="w-5 h-5 text-[#181715] stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-white/95 border border-[#DEC599] text-[#8C6228] shadow-2xs">
                    Direct Sourcing
                  </span>
                </div>

                <h4 className="font-serif text-lg font-bold text-[#181715] mb-2 tracking-tight group-hover:text-[#8C6228] transition-colors">
                  Requirement Sourcing
                </h4>
                <p className="text-xs sm:text-sm text-[#55514B] leading-relaxed">
                  Direct mill sourcing for exact yarn counts, GSM weights, and custom weave structures to match your tech pack.
                </p>
              </div>
            </div>

            {/* Card 2: GARMENT ACCESSORIES */}
            <div className="group relative bg-gradient-to-b from-[#FFFFFF] via-[#FFFDF7] to-[#F5EAD4] p-6 lg:p-7 rounded-2xl border border-[#DEC599] hover:border-[#D4AF37] shadow-[0_4px_20px_rgba(212,175,55,0.12)] hover:shadow-[0_12px_32px_rgba(212,175,55,0.25)] transition-all duration-300 flex flex-col justify-start transform hover:-translate-y-1.5">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#D4AF37] via-[#F2D785] to-[#B38728] text-[#181715] flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                    <Tag className="w-5 h-5 text-[#181715] stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-white/95 border border-[#DEC599] text-[#8C6228] shadow-2xs">
                    Trims &amp; Tags
                  </span>
                </div>

                <h4 className="font-serif text-lg font-bold text-[#181715] mb-2 tracking-tight group-hover:text-[#8C6228] transition-colors">
                  Garment Accessories
                </h4>
                <p className="text-xs sm:text-sm text-[#55514B] leading-relaxed">
                  Laces, embroidered trims, woven damask labels, twill tapes, and essential garment hardware.
                </p>
              </div>
            </div>

            {/* Card 3: WIDE FABRIC NETWORK */}
            <div className="group relative bg-gradient-to-b from-[#FFFFFF] via-[#FFFDF7] to-[#F5EAD4] p-6 lg:p-7 rounded-2xl border border-[#DEC599] hover:border-[#D4AF37] shadow-[0_4px_20px_rgba(212,175,55,0.12)] hover:shadow-[0_12px_32px_rgba(212,175,55,0.25)] transition-all duration-300 flex flex-col justify-start transform hover:-translate-y-1.5">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#D4AF37] via-[#F2D785] to-[#B38728] text-[#181715] flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                    <Scissors className="w-5 h-5 text-[#181715] stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-white/95 border border-[#DEC599] text-[#8C6228] shadow-2xs">
                    Textile Weaves
                  </span>
                </div>

                <h4 className="font-serif text-lg font-bold text-[#181715] mb-2 tracking-tight group-hover:text-[#8C6228] transition-colors">
                  Wide Fabric Range
                </h4>
                <p className="text-xs sm:text-sm text-[#55514B] leading-relaxed">
                  Extensive weave access spanning cotton poplins, twills, raw gadas, denim, and technical mesh.
                </p>
              </div>
            </div>

            {/* Card 4: WHOLESALE & RETAIL */}
            <div className="group relative bg-gradient-to-b from-[#FFFFFF] via-[#FFFDF7] to-[#F5EAD4] p-6 lg:p-7 rounded-2xl border border-[#DEC599] hover:border-[#D4AF37] shadow-[0_4px_20px_rgba(212,175,55,0.12)] hover:shadow-[0_12px_32px_rgba(212,175,55,0.25)] transition-all duration-300 flex flex-col justify-start transform hover:-translate-y-1.5">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#D4AF37] via-[#F2D785] to-[#B38728] text-[#181715] flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                    <Store className="w-5 h-5 text-[#181715] stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-white/95 border border-[#DEC599] text-[#8C6228] shadow-2xs">
                    Flexible Volume
                  </span>
                </div>

                <h4 className="font-serif text-lg font-bold text-[#181715] mb-2 tracking-tight group-hover:text-[#8C6228] transition-colors">
                  Wholesale &amp; Retail Supply
                </h4>
                <p className="text-xs sm:text-sm text-[#55514B] leading-relaxed">
                  Flexible supply model supporting sample yardage for designers and commercial container lots for factories.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
