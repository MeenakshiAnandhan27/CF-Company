import React from 'react';
import { Layers, Scissors, Store, Tag, Sparkles, ArrowRight, CheckCircle2, Search, Send, PackageCheck } from 'lucide-react';

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
      
      {/* 1. BUSINESS INTRODUCTION */}
      <section className="py-16 md:py-20 border-b border-[#E8E6E0] bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#82553E] bg-[#F2EDE6] px-3.5 py-1.5 rounded-sm border border-[#E3D9CC] inline-block font-mono">
            SUPPLIER &amp; SOURCING PARTNER
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181715] tracking-tight">
            Classic Fashions
          </h2>

          <p className="text-base sm:text-lg text-[#4A4742] max-w-3xl mx-auto leading-relaxed text-pretty font-normal">
            Classic Fashions is a garment accessories and fabrics supplier based in Boyampalayam, Tiruppur, Tamil Nadu. Rather than limiting customers to a fixed range of materials, we work around your requirements—sourcing materials from suitable manufacturing and supply sources.
          </p>

          {/* 5 Highlights */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {[
              'Garment Accessories',
              'Fabrics & Gadas',
              'Laces & Trims',
              'Requirement-Based Sourcing',
              'Wholesale & Retail Supply',
            ].map((item) => (
              <span
                key={item}
                className="text-xs font-medium text-[#2C2926] bg-[#F5F3ED] px-4 py-2 rounded border border-[#E5E0D6] shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 2. HOW WE SOURCE (NEED SOMETHING SPECIFIC?) */}
      <section className="py-16 md:py-22 border-b border-[#E8E6E0] bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#82553E] block mb-2 font-mono">
              Not Just a Catalogue — We Source to Your Requirement
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181715] tracking-tight">
              Need Something Specific?
            </h3>
            <p className="text-base text-[#585550] mt-3 leading-relaxed">
              Can&apos;t find the exact material you need in our catalogue? Tell us your requirement. We can explore suitable sourcing options and arrange the material according to your requirement.
            </p>
          </div>

          {/* 4-Step Visual Process */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            
            {/* Step 1 */}
            <div className="bg-white p-7 rounded-xl border border-[#E5E0D6] shadow-sm relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-lg bg-[#F2EDE6] text-[#82553E] flex items-center justify-center">
                    <Send className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xl font-bold text-[#C8BFB2]">01</span>
                </div>
                <h4 className="font-serif text-lg font-bold text-[#181715] mb-2 uppercase tracking-wide">
                  Share Your Requirement
                </h4>
                <p className="text-xs sm:text-sm text-[#585550] leading-relaxed">
                  Tell us what material you need—yarn count, weave, finish, colour, or reference photo.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#F0ECE4] text-[11px] font-mono text-[#8C877E]">
                Step 1: Specification Intake
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-7 rounded-xl border border-[#E5E0D6] shadow-sm relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-lg bg-[#F2EDE6] text-[#82553E] flex items-center justify-center">
                    <Search className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xl font-bold text-[#C8BFB2]">02</span>
                </div>
                <h4 className="font-serif text-lg font-bold text-[#181715] mb-2 uppercase tracking-wide">
                  We Source
                </h4>
                <p className="text-xs sm:text-sm text-[#585550] leading-relaxed">
                  We identify suitable manufacturing or supply sources across our textile partner network.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#F0ECE4] text-[11px] font-mono text-[#8C877E]">
                Step 2: Partner Sourcing
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-7 rounded-xl border border-[#E5E0D6] shadow-sm relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-lg bg-[#F2EDE6] text-[#82553E] flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xl font-bold text-[#C8BFB2]">03</span>
                </div>
                <h4 className="font-serif text-lg font-bold text-[#181715] mb-2 uppercase tracking-wide">
                  We Match
                </h4>
                <p className="text-xs sm:text-sm text-[#585550] leading-relaxed">
                  We verify quality, sample feel, and review options that match your requirement.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#F0ECE4] text-[11px] font-mono text-[#8C877E]">
                Step 3: Quality Matching
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-7 rounded-xl border border-[#E5E0D6] shadow-sm relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-lg bg-[#F2EDE6] text-[#82553E] flex items-center justify-center">
                    <PackageCheck className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xl font-bold text-[#C8BFB2]">04</span>
                </div>
                <h4 className="font-serif text-lg font-bold text-[#181715] mb-2 uppercase tracking-wide">
                  We Supply
                </h4>
                <p className="text-xs sm:text-sm text-[#585550] leading-relaxed">
                  We arrange the material and provide it to you with wholesale dispatch or local pick up.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#F0ECE4] text-[11px] font-mono text-[#8C877E]">
                Step 4: Reliable Supply
              </div>
            </div>

          </div>

          {/* Sourcing Call to Action */}
          <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onRequestMaterial}
              className="inline-flex items-center gap-2.5 px-8 py-4 text-xs font-semibold uppercase tracking-wider text-white bg-[#181715] rounded hover:bg-[#302D29] transition-all duration-200 shadow-sm active:scale-[0.98]"
            >
              <span>Request a Material</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreCatalogue}
              className="inline-flex items-center gap-2 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#181715] bg-white border border-[#D5D0C6] rounded hover:bg-[#F2EFEA] transition-colors"
            >
              <span>Browse Current Catalogue</span>
            </button>
          </div>

        </div>
      </section>

      {/* 3. WHY CLASSIC FASHIONS */}
      <section className="py-16 md:py-20 border-b border-[#E8E6E0] bg-[#F8F6F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#736F68] block mb-2 font-mono">
              Core Capabilities
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#181715]">
              Why Classic Fashions
            </h3>
            <p className="text-sm text-[#585550] mt-2">
              Serving garment businesses, fashion labels, and retail buyers with requirement-driven supply.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: REQUIREMENT-BASED SOURCING */}
            <div className="bg-white p-6 sm:p-7 rounded-lg border border-[#E5E0D6] shadow-sm hover:border-[#BFB8AC] transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded bg-[#F2EDE6] text-[#82553E] flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-xl font-semibold text-[#181715] mb-2 uppercase tracking-wide text-sm">
                  REQUIREMENT-BASED SOURCING
                </h4>
                <p className="text-sm text-[#585550] leading-relaxed">
                  Materials sourced according to your specific requirement from suitable supply partners.
                </p>
              </div>
              <div className="pt-4 text-xs font-mono text-[#8C877E] border-t border-[#F0ECE4] mt-4">
                Tailored sourcing solutions
              </div>
            </div>

            {/* Card 2: GARMENT ACCESSORIES */}
            <div className="bg-white p-6 sm:p-7 rounded-lg border border-[#E5E0D6] shadow-sm hover:border-[#BFB8AC] transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded bg-[#F2EDE6] text-[#82553E] flex items-center justify-center mb-4">
                  <Tag className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-xl font-semibold text-[#181715] mb-2 uppercase tracking-wide text-sm">
                  GARMENT ACCESSORIES
                </h4>
                <p className="text-sm text-[#585550] leading-relaxed">
                  Laces, tags, tapes, buttons and essential garment-related accessories.
                </p>
              </div>
              <div className="pt-4 text-xs font-mono text-[#8C877E] border-t border-[#F0ECE4] mt-4">
                Woven tags, twill tapes &amp; buttons
              </div>
            </div>

            {/* Card 3: FABRIC RANGE */}
            <div className="bg-white p-6 sm:p-7 rounded-lg border border-[#E5E0D6] shadow-sm hover:border-[#BFB8AC] transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded bg-[#F2EDE6] text-[#82553E] flex items-center justify-center mb-4">
                  <Scissors className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-xl font-semibold text-[#181715] mb-2 uppercase tracking-wide text-sm">
                  WIDE FABRIC RANGE
                </h4>
                <p className="text-sm text-[#585550] leading-relaxed">
                  Woven fabrics, denim, mesh, and specialized textiles available through our network.
                </p>
              </div>
              <div className="pt-4 text-xs font-mono text-[#8C877E] border-t border-[#F0ECE4] mt-4">
                Woven, poplin, twill, drill, denim &amp; mesh
              </div>
            </div>

            {/* Card 4: WHOLESALE & RETAIL */}
            <div className="bg-white p-6 sm:p-7 rounded-lg border border-[#E5E0D6] shadow-sm hover:border-[#BFB8AC] transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded bg-[#F2EDE6] text-[#82553E] flex items-center justify-center mb-4">
                  <Store className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-xl font-semibold text-[#181715] mb-2 uppercase tracking-wide text-sm">
                  WHOLESALE &amp; RETAIL SUPPLY
                </h4>
                <p className="text-sm text-[#585550] leading-relaxed">
                  Flexible supply solutions for commercial orders, sample runs, and retail buyers.
                </p>
              </div>
              <div className="pt-4 text-xs font-mono text-[#8C877E] border-t border-[#F0ECE4] mt-4">
                Commercial rolls &amp; sampling batches
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
