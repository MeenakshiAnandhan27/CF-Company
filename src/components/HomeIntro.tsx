import React, { useState } from 'react';
import { Scissors, Store, Tag, Sparkles, ArrowRight, ArrowDown, CheckCircle2, Search, Send, PackageCheck, Check, Layers } from 'lucide-react';

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
              <div className="group bg-[#FAF9F5] p-6 lg:p-7 rounded-xl border border-[#E8E4DC] hover:border-[#82553E]/50 hover:bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#E5DFD5] text-[#82553E] flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-[#82553E] group-hover:text-white transition-all duration-300 shadow-sm">
                    <Send className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#181715] mb-2 tracking-tight">
                    Your Requirement
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C5852] leading-relaxed">
                    Share what you need—fabric type, yarn count, finish, colorway, or reference sample image.
                  </p>
                </div>

                <div className="pt-4 mt-5 border-t border-[#EDE8DF]">
                  {/* Action Button */}
                  <button
                    onClick={onRequestMaterial}
                    className="w-full py-2.5 px-3 rounded-lg bg-white border border-[#DDD5C8] hover:border-[#82553E] hover:bg-[#82553E] text-[#82553E] hover:text-white text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-2xs group/btn cursor-pointer"
                  >
                    <span>Submit Spec</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>

              {/* Stage 2: WE SOURCE */}
              <div className="group bg-[#FAF9F5] p-6 lg:p-7 rounded-xl border border-[#E8E4DC] hover:border-[#82553E]/50 hover:bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#E5DFD5] text-[#82553E] flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-[#82553E] group-hover:text-white transition-all duration-300 shadow-sm">
                    <Search className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#181715] mb-2 tracking-tight">
                    We Source
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C5852] leading-relaxed">
                    We map options across verified manufacturing and supply sources to locate the exact match.
                  </p>
                </div>

                <div className="pt-4 mt-5 border-t border-[#EDE8DF]">
                  {/* Action Button */}
                  <button
                    onClick={onExploreCatalogue}
                    className="w-full py-2.5 px-3 rounded-lg bg-white border border-[#DDD5C8] hover:border-[#82553E] hover:bg-[#82553E] text-[#82553E] hover:text-white text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-2xs group/btn cursor-pointer"
                  >
                    <span>Browse Fabrics</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>

              {/* Stage 3: WE MATCH */}
              <div className="group bg-[#FAF9F5] p-6 lg:p-7 rounded-xl border border-[#E8E4DC] hover:border-[#82553E]/50 hover:bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#E5DFD5] text-[#82553E] flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-[#82553E] group-hover:text-white transition-all duration-300 shadow-sm">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#181715] mb-2 tracking-tight">
                    We Match
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C5852] leading-relaxed">
                    We review sample feel, color shade, weave density, and quality against your specifications.
                  </p>
                </div>

                <div className="pt-4 mt-5 border-t border-[#EDE8DF]">
                  {/* Action Button */}
                  <button
                    onClick={onRequestMaterial}
                    className="w-full py-2.5 px-3 rounded-lg bg-white border border-[#DDD5C8] hover:border-[#82553E] hover:bg-[#82553E] text-[#82553E] hover:text-white text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-2xs group/btn cursor-pointer"
                  >
                    <span>Request Swatch</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>

              {/* Stage 4: WE SUPPLY */}
              <div className="group bg-[#FAF9F5] p-6 lg:p-7 rounded-xl border border-[#E8E4DC] hover:border-[#82553E]/50 hover:bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#E5DFD5] text-[#82553E] flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-[#82553E] group-hover:text-white transition-all duration-300 shadow-sm">
                    <PackageCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#181715] mb-2 tracking-tight">
                    We Supply
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C5852] leading-relaxed">
                    We arrange reliable fulfillment, whether for sampling yardage or commercial production lots.
                  </p>
                </div>

                <div className="pt-4 mt-5 border-t border-[#EDE8DF]">
                  {/* Action Button */}
                  <button
                    onClick={onReachUs}
                    className="w-full py-2.5 px-3 rounded-lg bg-white border border-[#DDD5C8] hover:border-[#82553E] hover:bg-[#82553E] text-[#82553E] hover:text-white text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-2xs group/btn cursor-pointer"
                  >
                    <span>Supply Desk</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
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

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={onRequestMaterial}
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#181715] hover:bg-[#302D29] rounded-xl shadow-xs hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>Request a Material</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onExploreCatalogue}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#181715] bg-white border border-[#D5D0C6] hover:bg-[#F2EFEA] rounded-xl transition-colors cursor-pointer"
                >
                  <span>Browse Current Catalogue</span>
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
            <div className="group bg-[#FAF9F5] hover:bg-white p-6 lg:p-7 rounded-2xl border border-[#E8E4DC] hover:border-[#82553E]/50 shadow-[0_2px_12px_rgba(24,23,21,0.03)] hover:shadow-[0_12px_32px_rgba(24,23,21,0.08)] transition-all duration-300 flex flex-col justify-start">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#E5DFD5] text-[#82553E] flex items-center justify-center shadow-xs group-hover:bg-[#82553E] group-hover:text-white transition-all duration-300">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-white border border-[#E5DFD5] text-[#82553E]">
                    Direct Sourcing
                  </span>
                </div>

                <h4 className="font-serif text-lg font-bold text-[#181715] mb-2 tracking-tight group-hover:text-[#82553E] transition-colors">
                  Requirement Sourcing
                </h4>
                <p className="text-xs sm:text-sm text-[#5C5852] leading-relaxed">
                  Direct mill sourcing for exact yarn counts, GSM weights, and custom weave structures to match your tech pack.
                </p>
              </div>
            </div>

            {/* Card 2: GARMENT ACCESSORIES */}
            <div className="group bg-[#FAF9F5] hover:bg-white p-6 lg:p-7 rounded-2xl border border-[#E8E4DC] hover:border-[#82553E]/50 shadow-[0_2px_12px_rgba(24,23,21,0.03)] hover:shadow-[0_12px_32px_rgba(24,23,21,0.08)] transition-all duration-300 flex flex-col justify-start">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#E5DFD5] text-[#82553E] flex items-center justify-center shadow-xs group-hover:bg-[#82553E] group-hover:text-white transition-all duration-300">
                    <Tag className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-white border border-[#E5DFD5] text-[#82553E]">
                    Trims &amp; Tags
                  </span>
                </div>

                <h4 className="font-serif text-lg font-bold text-[#181715] mb-2 tracking-tight group-hover:text-[#82553E] transition-colors">
                  Garment Accessories
                </h4>
                <p className="text-xs sm:text-sm text-[#5C5852] leading-relaxed">
                  Laces, embroidered trims, woven damask labels, twill tapes, and essential garment hardware.
                </p>
              </div>
            </div>

            {/* Card 3: WIDE FABRIC NETWORK */}
            <div className="group bg-[#FAF9F5] hover:bg-white p-6 lg:p-7 rounded-2xl border border-[#E8E4DC] hover:border-[#82553E]/50 shadow-[0_2px_12px_rgba(24,23,21,0.03)] hover:shadow-[0_12px_32px_rgba(24,23,21,0.08)] transition-all duration-300 flex flex-col justify-start">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#E5DFD5] text-[#82553E] flex items-center justify-center shadow-xs group-hover:bg-[#82553E] group-hover:text-white transition-all duration-300">
                    <Scissors className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-white border border-[#E5DFD5] text-[#82553E]">
                    Textile Weaves
                  </span>
                </div>

                <h4 className="font-serif text-lg font-bold text-[#181715] mb-2 tracking-tight group-hover:text-[#82553E] transition-colors">
                  Wide Fabric Range
                </h4>
                <p className="text-xs sm:text-sm text-[#5C5852] leading-relaxed">
                  Extensive weave access spanning cotton poplins, twills, raw gadas, denim, and technical mesh.
                </p>
              </div>
            </div>

            {/* Card 4: WHOLESALE & RETAIL */}
            <div className="group bg-[#FAF9F5] hover:bg-white p-6 lg:p-7 rounded-2xl border border-[#E8E4DC] hover:border-[#82553E]/50 shadow-[0_2px_12px_rgba(24,23,21,0.03)] hover:shadow-[0_12px_32px_rgba(24,23,21,0.08)] transition-all duration-300 flex flex-col justify-start">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#E5DFD5] text-[#82553E] flex items-center justify-center shadow-xs group-hover:bg-[#82553E] group-hover:text-white transition-all duration-300">
                    <Store className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-white border border-[#E5DFD5] text-[#82553E]">
                    Flexible Volume
                  </span>
                </div>

                <h4 className="font-serif text-lg font-bold text-[#181715] mb-2 tracking-tight group-hover:text-[#82553E] transition-colors">
                  Wholesale &amp; Retail Supply
                </h4>
                <p className="text-xs sm:text-sm text-[#5C5852] leading-relaxed">
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
