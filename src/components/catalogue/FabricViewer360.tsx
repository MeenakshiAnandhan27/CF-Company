import React from 'react';
import { DiscoveryMaterial } from '../../data/catalogueDiscoveryData.ts';
import { FireflyFabric3DViewer } from './FireflyFabric3DViewer.tsx';
import { FireflyFabricItem } from '../../data/fireflyFabricsData.ts';

interface FabricViewer360Props {
  initialMaterial?: DiscoveryMaterial | null;
  isOpen: boolean;
  onClose: () => void;
  onEnquire?: (material: DiscoveryMaterial) => void;
  onRequestSample?: (material: DiscoveryMaterial) => void;
}

export const FabricViewer360: React.FC<FabricViewer360Props> = ({
  initialMaterial,
  isOpen,
  onClose,
  onEnquire,
  onRequestSample,
}) => {
  if (!isOpen) return null;

  return (
    <FireflyFabric3DViewer
      isModal={true}
      onBack={onClose}
      onEnquire={(f: FireflyFabricItem) => {
        if (onEnquire) {
          const discMat: DiscoveryMaterial = {
            id: f.id,
            name: f.name,
            category: 'FABRICS',
            subcategory: f.category,
            section: 'WOVEN',
            image: f.imageUrl,
            description: f.description,
            composition: f.composition,
            weave: f.weave,
            gsm: f.weightGsm,
            width: '58" / 60"',
          };
          onEnquire(discMat);
        }
      }}
    />
  );
};
