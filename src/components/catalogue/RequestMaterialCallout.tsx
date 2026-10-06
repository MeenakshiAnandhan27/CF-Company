import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Search } from 'lucide-react';

interface RequestMaterialCalloutProps {
  onRequestMaterial: () => void;
}

export const RequestMaterialCallout: React.FC<RequestMaterialCalloutProps> = ({
  onRequestMaterial,
}) => {
  return (
    <section
      aria-label="Custom Sourcing Requirement"
      className="mt-16 sm:mt-24 relative overflow-hidden rounded-3xl bg-[#181715] text-white border border-[#302D29] p-8 sm:p-12 md:p-16 shadow-xl"
    >
      {/* Subtle background radial gradient & accent */}
      <div
        aria-hidden="true"
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#82553E]/20 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#524B42]/30 blur-3xl pointer-events-none"
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.22em] text-[#C2B5A5] bg-[#2B2723] px-3.5 py-1 rounded-full border border-[#443F38]">
          <Search className="w-3.5 h-3.5 text-[#C2AA76]" />
          <span>Requirement-Based Sourcing &amp; Supply</span>
        </div>

        <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#FAF8F5]">
          Looking for Something Specific?
        </h3>

        <p className="text-sm sm:text-base text-[#B3ACA2] leading-relaxed max-w-xl mx-auto">
          Not every weave, yarn count or trim variation needs to be in our catalogue. Tell us what you need. We'll source the right material based on your production requirement.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={onRequestMaterial}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-semibold uppercase tracking-wider bg-[#82553E] hover:bg-[#6e4632] text-white rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Request a Material</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Positioning Footnote */}
        <div className="pt-6 border-t border-[#2F2C28] flex flex-wrap items-center justify-center gap-6 text-xs text-[#8F887E]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C2AA76]" />
            Garment materials, sourced and supplied
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C2AA76]" />
            Sampling bolts &amp; container-load production
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C2AA76]" />
            Direct mill liaison in Tiruppur
          </span>
        </div>
      </div>
    </section>
  );
};
