import React from 'react';
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
      {/* 1. SUPPLIER & SOURCING PARTNER — BUSINESS MODEL WITH MINIMAL VISUAL FLOW */}
      {/* Zero physical address, zero location badges, zero numbers (01/02/03/04)   */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E8E4DC] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#82553E] bg-[#F4EFEB] px-4 py-1.5 rounded-full border border-[#E3D9CC] inline-block font-mono">
              Business Model
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181715] tracking-tight">
              Supplier &amp; Sourcing Partner
            </h2>

            <p className="text-base sm:text-lg text-[#55514B] leading-relaxed font-normal text-pretty">
              From regular catalogue materials to specific requirements, we help you source and arrange garment fabrics and accessories suited to your needs.
            </p>
          </div>

          {/* Minimal Visual Progression Flow:
              YOUR REQUIREMENT -> WE SOURCE -> WE MATCH -> WE SUPPLY
              (No 01, 02, 03, 04 numbers; clean visual progression with icons and connectors) */}
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
                <div className="pt-4 mt-5 border-t border-[#EDE8DF] flex items-center justify-between text-xs text-[#82553E] font-medium">
                  <span>Specification Intake</span>
                  <ArrowRight className="w-3.5 h-3.5 hidden md:block opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <ArrowDown className="w-3.5 h-3.5 md:hidden opacity-60" />
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
                <div className="pt-4 mt-5 border-t border-[#EDE8DF] flex items-center justify-between text-xs text-[#82553E] font-medium">
                  <span>Partner Sourcing</span>
                  <ArrowRight className="w-3.5 h-3.5 hidden md:block opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <ArrowDown className="w-3.5 h-3.5 md:hidden opacity-60" />
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
                <div className="pt-4 mt-5 border-t border-[#EDE8DF] flex items-center justify-between text-xs text-[#82553E] font-medium">
                  <span>Quality Matching</span>
                  <ArrowRight className="w-3.5 h-3.5 hidden md:block opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <ArrowDown className="w-3.5 h-3.5 md:hidden opacity-60" />
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
                <div className="pt-4 mt-5 border-t border-[#EDE8DF] flex items-center justify-between text-xs text-[#82553E] font-medium">
                  <span>Reliable Supply</span>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                </div>
              </div>

            </div>
          </div>

          {/* Clean Material Highlights Pills / Tags */}
          <div className="mt-12 pt-8 border-t border-[#EDE8DF] flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs text-[#4A4742]">
            <span className="font-medium text-[#181715]">Core Supply Areas:</span>
            {[
              'Garment Accessories',
              'Fabrics & Gadas',
              'Laces & Trims',
              'Denim & Mesh',
              'Requirement-Based Sourcing',
              'Wholesale & Retail Supply',
            ].map((tag) => (
              <span
                key={tag}
                className="bg-[#F6F4EE] px-3.5 py-1.5 rounded-full border border-[#E6E1D6] font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. BEYOND THE CATALOGUE / NEED SOMETHING SPECIFIC?                         */}
      {/* Zero serial numbers (no 01/02/03/04), strong action CTA                  */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E8E4DC] bg-[#FAF8F4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column Copy */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#82553E] font-mono block">
                Beyond the Catalogue
              </span>

              <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181715] tracking-tight">
                Not Every Requirement Fits Into a Catalogue.
              </h3>

              <p className="text-base sm:text-lg text-[#55514B] leading-relaxed">
                Tell us what you are looking for. If the exact material is not listed in our standard catalogue, share the details, specifications, or a reference image and our team will explore suitable sourcing options.
              </p>

              {/* Feature Points without numbers */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#EAE2D5] text-[#82553E] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-sm text-[#403C37]">
                    <strong>Custom Specifications:</strong> Yarn count, weave structure, GSM, widths, finishes, and specialized treatments.
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#EAE2D5] text-[#82553E] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-sm text-[#403C37]">
                    <strong>Physical or Digital Samples:</strong> Share photos, tech packs, or send physical fabric swatches for counter-matching.
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#EAE2D5] text-[#82553E] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-sm text-[#403C37]">
                    <strong>Wholesale &amp; Sampling:</strong> Sourcing options tailored for sample development as well as bulk production lots.
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={onRequestMaterial}
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#181715] hover:bg-[#302D29] rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
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

            {/* Right Column Visual Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-6 lg:p-8 border border-[#E5E0D6] shadow-[0_10px_35px_rgba(24,23,21,0.06)] space-y-6">
                <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-4">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#82553E] font-semibold">
                      Sourcing Desk
                    </span>
                    <h4 className="font-serif text-lg font-bold text-[#181715]">
                      Material Intake Form
                    </h4>
                  </div>
                  <span className="text-xs bg-[#F4EFEB] text-[#635E56] px-3 py-1 rounded-full border border-[#DFDAD0]">
                    Direct Support
                  </span>
                </div>

                <div className="space-y-3.5 text-xs text-[#55514B]">
                  <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#EDE8DF]">
                    <span className="font-semibold text-[#181715] block mb-0.5">1. Material Details</span>
                    <span>Enter fabric composition, lace pattern, trim specs, or accessory type.</span>
                  </div>
                  <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#EDE8DF]">
                    <span className="font-semibold text-[#181715] block mb-0.5">2. Reference Image or Swatch</span>
                    <span>Upload a photo or indicate if you can courier a physical sample piece.</span>
                  </div>
                  <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#EDE8DF]">
                    <span className="font-semibold text-[#181715] block mb-0.5">3. Sourcing Coordination</span>
                    <span>Our team reviews possibilities and shares suitable sourcing options.</span>
                  </div>
                </div>

                <button
                  onClick={onRequestMaterial}
                  className="w-full py-3.5 bg-[#82553E] hover:bg-[#6E4430] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-sm hover:shadow text-center flex items-center justify-center gap-2 cursor-pointer"
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
      {/* 3. WHY CLASSIC FASHIONS — CORE CAPABILITIES (Clean Editorial Cards)      */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-20 border-b border-[#E8E4DC] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#82553E] block mb-2 font-mono">
              Core Capabilities
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#181715]">
              Why Classic Fashions
            </h3>
            <p className="text-sm text-[#585550] mt-2 font-normal">
              Serving garment manufacturers, apparel exporters, fashion labels, and retail buyers with dependable material solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: REQUIREMENT-BASED SOURCING */}
            <div className="bg-[#FAF9F5] p-6 lg:p-7 rounded-xl border border-[#E8E4DC] hover:border-[#82553E]/50 hover:bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-lg bg-white border border-[#E5DFD5] text-[#82553E] flex items-center justify-center mb-4 shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-base font-bold text-[#181715] mb-2 uppercase tracking-wide">
                  Requirement-Based Sourcing
                </h4>
                <p className="text-xs sm:text-sm text-[#585550] leading-relaxed">
                  Materials sourced according to your specific requirement from suitable supply partners.
                </p>
              </div>
              <div className="pt-4 text-xs font-medium text-[#82553E] border-t border-[#EDE8DF] mt-4">
                Tailored sourcing solutions
              </div>
            </div>

            {/* Card 2: GARMENT ACCESSORIES */}
            <div className="bg-[#FAF9F5] p-6 lg:p-7 rounded-xl border border-[#E8E4DC] hover:border-[#82553E]/50 hover:bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-lg bg-white border border-[#E5DFD5] text-[#82553E] flex items-center justify-center mb-4 shadow-sm">
                  <Tag className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-base font-bold text-[#181715] mb-2 uppercase tracking-wide">
                  Garment Accessories
                </h4>
                <p className="text-xs sm:text-sm text-[#585550] leading-relaxed">
                  Laces, tags, tapes, buttons and essential garment-related accessories.
                </p>
              </div>
              <div className="pt-4 text-xs font-medium text-[#82553E] border-t border-[#EDE8DF] mt-4">
                Woven tags, twill tapes &amp; buttons
              </div>
            </div>

            {/* Card 3: WIDE FABRIC RANGE */}
            <div className="bg-[#FAF9F5] p-6 lg:p-7 rounded-xl border border-[#E8E4DC] hover:border-[#82553E]/50 hover:bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-lg bg-white border border-[#E5DFD5] text-[#82553E] flex items-center justify-center mb-4 shadow-sm">
                  <Scissors className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-base font-bold text-[#181715] mb-2 uppercase tracking-wide">
                  Wide Fabric Range
                </h4>
                <p className="text-xs sm:text-sm text-[#585550] leading-relaxed">
                  Woven fabrics, denim, mesh, and specialized textiles available through our network.
                </p>
              </div>
              <div className="pt-4 text-xs font-medium text-[#82553E] border-t border-[#EDE8DF] mt-4">
                Woven, poplin, twill, drill, denim &amp; mesh
              </div>
            </div>

            {/* Card 4: WHOLESALE & RETAIL */}
            <div className="bg-[#FAF9F5] p-6 lg:p-7 rounded-xl border border-[#E8E4DC] hover:border-[#82553E]/50 hover:bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-lg bg-white border border-[#E5DFD5] text-[#82553E] flex items-center justify-center mb-4 shadow-sm">
                  <Store className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-base font-bold text-[#181715] mb-2 uppercase tracking-wide">
                  Wholesale &amp; Retail Supply
                </h4>
                <p className="text-xs sm:text-sm text-[#585550] leading-relaxed">
                  Flexible supply solutions for commercial orders, sample runs, and retail buyers.
                </p>
              </div>
              <div className="pt-4 text-xs font-medium text-[#82553E] border-t border-[#EDE8DF] mt-4">
                Commercial rolls &amp; sampling batches
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
