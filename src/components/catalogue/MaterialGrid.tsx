import React from 'react';
import { DiscoveryMaterial } from '../../data/catalogueDiscoveryData.ts';
import { MaterialItem } from './MaterialItem.tsx';

interface MaterialGridProps {
  title?: string;
  subtitle?: string;
  materials: DiscoveryMaterial[];
  onSelectMaterial: (material: DiscoveryMaterial) => void;
  subsections?: {
    title: string;
    description?: string;
    filterSection: DiscoveryMaterial['section'];
  }[];
  showCategoryLabel?: boolean;
}

export const MaterialGrid: React.FC<MaterialGridProps> = ({
  title,
  subtitle,
  materials,
  onSelectMaterial,
  subsections,
  showCategoryLabel = false,
}) => {
  if (materials.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-[#F7F4EE] rounded-2xl border border-[#E5DFD4]">
        <p className="font-serif text-lg text-[#181715]">No matching materials found</p>
        <p className="text-xs text-[#7A746B] mt-1">Try adjusting your search query or category filters.</p>
      </div>
    );
  }

  // If subsections are provided, group by section for an editorial presentation
  if (subsections && subsections.length > 0) {
    return (
      <div className="space-y-16">
        {title && (
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium text-[#181715] tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs sm:text-sm text-[#6C675E] leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {subsections.map((sub) => {
          const sectionMaterials = materials.filter((m) => m.section === sub.filterSection);
          if (sectionMaterials.length === 0) return null;

          return (
            <div key={sub.title} className="space-y-6">
              {/* Subsection editorial header */}
              <div className="border-b border-[#E8E2D7] pb-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div>
                  <h4 className="font-serif text-lg sm:text-xl font-medium text-[#181715]">
                    {sub.title}
                  </h4>
                  {sub.description && (
                    <p className="text-xs text-[#7B756C] mt-0.5">{sub.description}</p>
                  )}
                </div>
                <span className="text-[11px] font-mono text-[#8C877E] uppercase tracking-wider">
                  {sectionMaterials.length} {sectionMaterials.length === 1 ? 'Variety' : 'Varieties'}
                </span>
              </div>

              {/* Responsive circular material row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-8 justify-items-center">
                {sectionMaterials.map((mat) => (
                  <MaterialItem
                    key={mat.id}
                    material={mat}
                    onClick={onSelectMaterial}
                    showCategoryLabel={showCategoryLabel}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Default flat layout
  return (
    <div className="space-y-8">
      {title && (
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium text-[#181715] tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#6C675E] leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 md:gap-8 justify-items-center">
        {materials.map((mat) => (
          <MaterialItem
            key={mat.id}
            material={mat}
            onClick={onSelectMaterial}
            showCategoryLabel={showCategoryLabel}
          />
        ))}
      </div>
    </div>
  );
};
