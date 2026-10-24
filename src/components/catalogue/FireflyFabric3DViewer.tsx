import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import {
  RotateCw,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Search,
  ChevronLeft,
  Info,
  AlertCircle,
  X,
  Send,
  Wind,
  CheckCircle2,
  Layers,
  Repeat,
  Eye,
} from 'lucide-react';
import { BrandLogo } from '../BrandLogo.tsx';
import {
  CATALOGUE_3D_ITEMS,
  Catalogue3DItem,
  findMatchingCatalogueIndex,
} from '../../data/catalogue3DData.ts';
import { createClothGeometry } from './Catalogue3DGeometries.ts';

/**
 * Concise, short fabric names for the selection bar (e.g. "Denim", "Chambray", "Linen")
 */
export function getSimpleFabricName(item: Catalogue3DItem): string {
  const id = item.id.toLowerCase();
  const name = item.name.toLowerCase();

  if (id.includes('chambray') || name.includes('chambray')) return 'Chambray';
  if (id.includes('denim') || name.includes('denim')) return 'Denim';
  if (id.includes('seersucker') || name.includes('seersucker')) return 'Seersucker';
  if (id.includes('stripes') || name.includes('poplin')) return 'Poplin';
  if (id.includes('twill') || name.includes('twill')) return 'Twill';
  if (id.includes('canvas') || id.includes('canvas-gada')) return 'Canvas';
  if (id.includes('duck')) return 'Duck Canvas';
  if (id.includes('gada') || name.includes('gada') || name.includes('calico')) return 'Gada';
  if (id.includes('checked') || name.includes('checked')) return 'Checked';
  if (id.includes('flannel') || name.includes('flannel')) return 'Flannel';
  if (id.includes('fur') || name.includes('fur')) return 'Faux Fur';
  if (id.includes('linen') || name.includes('flax') || name.includes('linen')) return 'Linen';
  if (id.includes('satin') || name.includes('satin')) return 'Satin';
  if (id.includes('chiffon') || name.includes('chiffon')) return 'Chiffon';
  if (id.includes('velvet') || name.includes('velvet')) return 'Velvet';
  if (id.includes('taffeta') || name.includes('taffeta')) return 'Taffeta';
  if (id.includes('lycra') || name.includes('lycra')) return 'Lycra Mesh';
  if (id.includes('cotton-mesh') || name.includes('cotton mesh')) return 'Cotton Mesh';
  if (id.includes('polyster-mesh') || name.includes('sport mesh')) return 'Poly Mesh';
  if (id.includes('poly-cotton') || name.includes('poly-cotton')) return 'Poly-Cotton';
  if (id.includes('polyster') || name.includes('polyester') || name.includes('gabardine')) return 'Polyester';
  if (id.includes('putta') || name.includes('jacquard') || name.includes('brocade')) return 'Jacquard';
  if (id.includes('plain') || name.includes('plain weave')) return 'Plain Weave';
  if (id.includes('flash') || name.includes('dobby') || name.includes('specimen')) return 'Dobby';
  if (id.includes('cotton') || name.includes('cotton')) return 'Cotton';

  // Fallback: primary word
  return item.name.split(' ')[0] || item.name;
}

/**
 * Creates an authentic, procedural woven canvas textile texture
 * Used as a zero-latency, fail-safe fallback if any network or asset path fails
 */
function createProceduralFabricTexture(baseColor = '#FAF4EA', weaveColor = '#EADECF'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = weaveColor;
    ctx.lineWidth = 1;
    for (let i = 0; i < 512; i += 4) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }

    for (let x = 0; x < 512; x += 8) {
      for (let y = 0; y < 512; y += 8) {
        if ((x + y) % 16 === 0) {
          ctx.fillStyle = 'rgba(0,0,0,0.03)';
          ctx.fillRect(x, y, 4, 4);
        }
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

interface FireflyFabric3DViewerProps {
  onBack?: () => void;
  onEnquire?: (item: Catalogue3DItem) => void;
  isModal?: boolean;
  initialMaterial?: { id?: string; name?: string; subcategory?: string } | null;
  initialFabricId?: string;
}

export const FireflyFabric3DViewer: React.FC<FireflyFabric3DViewerProps> = ({
  onBack,
  onEnquire,
  isModal = false,
  initialMaterial,
  initialFabricId,
}) => {
  // Active Fabric Selection (from curated 24-fabric collection)
  const [selectedIndex, setSelectedIndex] = useState<number>(() => {
    const query = initialFabricId || initialMaterial?.name || initialMaterial?.id;
    return findMatchingCatalogueIndex(query);
  });

  // Keep selected item in sync if initialMaterial or initialFabricId changes
  useEffect(() => {
    const query = initialFabricId || initialMaterial?.name || initialMaterial?.id;
    if (query) {
      setSelectedIndex(findMatchingCatalogueIndex(query));
    }
  }, [initialMaterial, initialFabricId]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');

  // Surface Geometry Mode for Fabrics
  const [surfaceMode, setSurfaceMode] = useState<'drape' | 'curved-swatch' | 'inspection-bed'>('drape');

  // Camera & Turntable State
  const [rotationY, setRotationY] = useState<number>(0);
  const [rotationX, setRotationX] = useState<number>(10);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isAutoSpinning, setIsAutoSpinning] = useState<boolean>(true);
  const [isBreezeActive, setIsBreezeActive] = useState<boolean>(true);

  // Loading & Error States
  const [webGLSupported, setWebGLSupported] = useState<boolean>(true);
  const [isTextureLoading, setIsTextureLoading] = useState<boolean>(true);
  const [textureError, setTextureError] = useState<string | null>(null);

  // References for Three.js state
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const turntableRef = useRef<THREE.Group | null>(null);
  const clothMeshRef = useRef<THREE.Mesh | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const currentTextureRef = useRef<THREE.Texture | null>(null);

  // Cloth mesh reference for dynamic breeze wave
  const basePositionsRef = useRef<Float32Array | null>(null);
  const breezeTimeRef = useRef<number>(0);

  // Drag interaction tracking
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchDistanceRef = useRef<number | null>(null);

  // Interactive targets for smooth lerping
  const targetRotYRef = useRef<number>(rotationY);
  const targetRotXRef = useRef<number>(rotationX);
  const currentRotYRef = useRef<number>(rotationY);
  const currentRotXRef = useRef<number>(rotationX);
  const targetZoomRef = useRef<number>(zoomLevel);
  const currentZoomRef = useRef<number>(zoomLevel);

  // Refs for animation loop state
  const isAutoSpinningRef = useRef<boolean>(isAutoSpinning);
  const isBreezeActiveRef = useRef<boolean>(isBreezeActive);
  const surfaceModeRef = useRef<'drape' | 'curved-swatch' | 'inspection-bed'>(surfaceMode);

  useEffect(() => {
    isAutoSpinningRef.current = isAutoSpinning;
  }, [isAutoSpinning]);

  useEffect(() => {
    isBreezeActiveRef.current = isBreezeActive;
  }, [isBreezeActive]);

  useEffect(() => {
    surfaceModeRef.current = surfaceMode;
  }, [surfaceMode]);

  const currentItem: Catalogue3DItem = CATALOGUE_3D_ITEMS[selectedIndex] || CATALOGUE_3D_ITEMS[0];

  // Filtered fabric list for selector
  const filteredItems = CATALOGUE_3D_ITEMS.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.composition.toLowerCase().includes(q) ||
      (item.weave && item.weave.toLowerCase().includes(q)) ||
      item.subcategory.toLowerCase().includes(q);

    const matchesCategory =
      activeCategoryFilter === 'All' || item.subcategory === activeCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  const categoryCounts: Record<string, number> = {
    All: CATALOGUE_3D_ITEMS.length,
    'Natural Fibers': CATALOGUE_3D_ITEMS.filter((i) => i.subcategory === 'Natural Fibers').length,
    'Blends & Luxury': CATALOGUE_3D_ITEMS.filter((i) => i.subcategory === 'Blends & Luxury').length,
    'Mesh & Knits': CATALOGUE_3D_ITEMS.filter((i) => i.subcategory === 'Mesh & Knits').length,
    'Synthetics & Sheers': CATALOGUE_3D_ITEMS.filter((i) => i.subcategory === 'Synthetics & Sheers').length,
  };

  // Check WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) {
        setWebGLSupported(false);
      }
    } catch {
      setWebGLSupported(false);
    }
  }, []);

  // Update or mount the active 3D cloth model whenever texture, mode, or item changes
  const update3DClothModel = useCallback(
    (texture: THREE.Texture, item: Catalogue3DItem, mode: 'drape' | 'curved-swatch' | 'inspection-bed') => {
      if (!turntableRef.current) return;

      // Remove existing model from turntable
      if (clothMeshRef.current) {
        turntableRef.current.remove(clothMeshRef.current);
        clothMeshRef.current.geometry.dispose();
        if (Array.isArray(clothMeshRef.current.material)) {
          clothMeshRef.current.material.forEach((m) => m.dispose());
        } else {
          clothMeshRef.current.material.dispose();
        }
        clothMeshRef.current = null;
        basePositionsRef.current = null;
      }

      const stiffness = item.drapeStiffness ?? 0.4;
      const geometry = createClothGeometry(mode, stiffness);

      // Store base positions for dynamic breeze wave
      const pos = geometry.attributes.position;
      const count = pos.count;
      const basePos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        basePos[i * 3] = pos.getX(i);
        basePos[i * 3 + 1] = pos.getY(i);
        basePos[i * 3 + 2] = pos.getZ(i);
      }
      basePositionsRef.current = basePos;

      const fabricMaterial = new THREE.MeshPhysicalMaterial({
        map: texture,
        roughness: item.roughness ?? 0.8,
        metalness: item.metalness ?? 0.0,
        clearcoat: item.clearcoat ?? 0.0,
        clearcoatRoughness: item.clearcoatRoughness ?? 0.1,
        sheen: item.sheen ?? 0.2,
        sheenColor: new THREE.Color(item.sheenColor || '#FFFFFF'),
        sheenRoughness: item.sheenRoughness ?? 0.3,
        side: THREE.DoubleSide,
        shadowSide: THREE.DoubleSide,
      });

      const clothMesh = new THREE.Mesh(geometry, fabricMaterial);
      clothMesh.position.set(0, 0.05, 0);
      clothMesh.castShadow = true;
      clothMesh.receiveShadow = true;

      turntableRef.current.add(clothMesh);
      clothMeshRef.current = clothMesh;
    },
    []
  );

  // Initialize Three.js Scene ONCE on mount
  useEffect(() => {
    if (!webGLSupported || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0.2, 4.6);
    cameraRef.current = camera;

    // 3. Renderer with ACES Filmic tone mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Studio Lighting Rig
    const keyLight = new THREE.DirectionalLight('#FFF8ED', 2.3);
    keyLight.position.set(4, 5, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight('#D8ECFF', 0.85);
    fillLight.position.set(-4, 3, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight('#FFE6B8', 1.85);
    rimLight.position.set(0, 3.2, -4.5);
    scene.add(rimLight);

    const ambientLight = new THREE.AmbientLight('#FFFFFF', 0.65);
    scene.add(ambientLight);

    // 5. Atelier Turntable Group
    const turntableGroup = new THREE.Group();
    scene.add(turntableGroup);
    turntableRef.current = turntableGroup;

    // Soft Contact Shadow Plane underneath the active model
    const shadowGeo = new THREE.PlaneGeometry(5.5, 5.5);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.32 });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.5;
    shadowMesh.receiveShadow = true;
    scene.add(shadowMesh);

    // 6. Animation Loop
    let lastTime = performance.now();

    const animate = (time: number) => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const delta = (time - lastTime) * 0.001;
      lastTime = time;

      // Auto-spin turntable
      if (isAutoSpinningRef.current && !isDraggingRef.current) {
        targetRotYRef.current = (targetRotYRef.current + delta * 18) % 360;
      }

      // Smooth camera interpolation
      currentRotYRef.current += (targetRotYRef.current - currentRotYRef.current) * 0.12;
      currentRotXRef.current += (targetRotXRef.current - currentRotXRef.current) * 0.12;
      currentZoomRef.current += (targetZoomRef.current - currentZoomRef.current) * 0.15;

      setRotationY(currentRotYRef.current);
      setRotationX(currentRotXRef.current);

      if (turntableRef.current) {
        turntableRef.current.rotation.y = (currentRotYRef.current * Math.PI) / 180;
        turntableRef.current.rotation.x = (currentRotXRef.current * Math.PI) / 180;
      }

      if (cameraRef.current) {
        const baseDist = 4.6;
        cameraRef.current.position.z = baseDist / currentZoomRef.current;
      }

      // Dynamic Cloth Breathing / Airflow Wave in Drape Mode
      if (
        clothMeshRef.current &&
        basePositionsRef.current &&
        surfaceModeRef.current === 'drape' &&
        isBreezeActiveRef.current
      ) {
        breezeTimeRef.current += delta;
        const bTime = breezeTimeRef.current;
        const meshGeo = clothMeshRef.current.geometry;
        const posAttr = meshGeo.attributes.position;
        const base = basePositionsRef.current;
        const count = posAttr.count;
        const height = 2.5;

        for (let i = 0; i < count; i++) {
          const bx = base[i * 3];
          const by = base[i * 3 + 1];
          const bz = base[i * 3 + 2];
          const normY = Math.max(0, Math.min(1, (by + height / 2) / height));
          const invertNormY = 1 - normY;

          const waveZ = Math.sin(bTime * 1.5 + bx * 2.1 + by * 1.2) * 0.025 * Math.pow(invertNormY, 1.4);
          const waveY = Math.cos(bTime * 1.1 + bx * 1.4) * 0.006 * invertNormY;

          posAttr.setZ(i, bz + waveZ);
          posAttr.setY(i, by + waveY);
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // 7. Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 600;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      if (rendererRef.current && rendererRef.current.domElement && container.contains(rendererRef.current.domElement)) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [webGLSupported]);

  // Load Real High-Definition Texture Map whenever selected fabric changes with resilient fallback
  useEffect(() => {
    let isCancelled = false;
    setIsTextureLoading(true);
    setTextureError(null);

    const loader = new THREE.TextureLoader();
    const candidateUrls: string[] = [];

    // 1. Primary configured URL
    if (currentItem.imageUrl) {
      candidateUrls.push(currentItem.imageUrl);
    }

    // 2. Candidate asset paths across served directories
    const filename = currentItem.filename;
    if (filename) {
      candidateUrls.push(`/assets/catalogue-3d/${encodeURIComponent(filename)}`);
      candidateUrls.push(`/assets/firefly-fabrics/${encodeURIComponent(filename)}`);
      candidateUrls.push(`/assets/materials/fabrics/${encodeURIComponent(filename)}`);
      if (filename.endsWith('.png')) {
        candidateUrls.push(`/assets/materials/fabrics/${encodeURIComponent(filename.replace(/\.png$/, '.jpg'))}`);
      }
      if (filename.includes(' ')) {
        candidateUrls.push(`/assets/catalogue-3d/${filename}`);
        candidateUrls.push(`/assets/firefly-fabrics/${filename}`);
      }
    }

    // 3. Fallback to universally available verified fabric swatch
    candidateUrls.push('/assets/catalogue-3d/plain.png');
    candidateUrls.push('/assets/firefly-fabrics/plain.png');

    const uniqueUrls = Array.from(new Set(candidateUrls.filter(Boolean)));

    const applyTexture = (texture: THREE.Texture) => {
      if (isCancelled) {
        texture.dispose();
        return;
      }

      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;

      const repeat = currentItem.textureRepeat || { x: 2, y: 2 };
      texture.center.set(0, 0);
      texture.repeat.set(repeat.x, repeat.y);
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;

      if (rendererRef.current) {
        texture.anisotropy = rendererRef.current.capabilities.getMaxAnisotropy();
      }

      if (currentTextureRef.current) {
        currentTextureRef.current.dispose();
      }
      currentTextureRef.current = texture;

      // Mount updated 3D cloth model
      update3DClothModel(texture, currentItem, surfaceMode);
      setIsTextureLoading(false);
      setTextureError(null);
    };

    let urlIndex = 0;
    const tryNextUrl = () => {
      if (isCancelled) return;

      if (urlIndex >= uniqueUrls.length) {
        // Fallback to in-memory procedural cloth texture (guaranteed to render seamlessly)
        try {
          const proceduralTexture = createProceduralFabricTexture(
            currentItem.sheenColor || '#FAF4EA',
            '#E4D9C8'
          );
          applyTexture(proceduralTexture);
        } catch {
          setIsTextureLoading(false);
        }
        return;
      }

      const nextUrl = uniqueUrls[urlIndex++];
      loader.load(
        nextUrl,
        (texture) => {
          applyTexture(texture);
        },
        undefined,
        () => {
          // Quietly advance to next fallback candidate
          tryNextUrl();
        }
      );
    };

    tryNextUrl();

    return () => {
      isCancelled = true;
    };
  }, [currentItem, update3DClothModel, surfaceMode]);

  // Update model when surfaceMode changes
  useEffect(() => {
    if (currentTextureRef.current) {
      update3DClothModel(currentTextureRef.current, currentItem, surfaceMode);
    }
  }, [surfaceMode, currentItem, update3DClothModel]);

  // Sync zoom changes to ref
  useEffect(() => {
    targetZoomRef.current = zoomLevel;
  }, [zoomLevel]);

  // Pointer Drag Handlers for 360 degree rotation
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    const newRotY = (targetRotYRef.current + dx * 0.65 + 360) % 360;
    const newRotX = Math.max(-65, Math.min(65, targetRotXRef.current - dy * 0.45));

    targetRotYRef.current = newRotY;
    targetRotXRef.current = newRotX;

    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture was already released
    }
  };

  // Mouse Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = -e.deltaY * 0.0015;
    const newZoom = Math.max(0.6, Math.min(3.5, targetZoomRef.current + zoomDelta));
    targetZoomRef.current = newZoom;
    setZoomLevel(newZoom);
  };

  // Touch Handlers for Pinch Zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      isDraggingRef.current = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchDistanceRef.current = Math.sqrt(dx * dx + dy * dy);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchDistanceRef.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDist = Math.sqrt(dx * dx + dy * dy);
      const ratio = newDist / touchDistanceRef.current;
      const newZoom = Math.max(0.6, Math.min(3.5, targetZoomRef.current * (1 + (ratio - 1) * 0.6)));
      targetZoomRef.current = newZoom;
      setZoomLevel(newZoom);
      touchDistanceRef.current = newDist;
    }
  };

  const handleTouchEnd = () => {
    touchDistanceRef.current = null;
  };

  // Camera Reset
  const handleResetCamera = () => {
    targetRotYRef.current = 0;
    targetRotXRef.current = 10;
    targetZoomRef.current = 1.0;
    setRotationY(0);
    setRotationX(10);
    setZoomLevel(1.0);
  };

  // Flip 180 degrees (inspect reverse side of fabric)
  const handleFlip180 = () => {
    targetRotYRef.current = (targetRotYRef.current + 180) % 360;
  };

  // Macro zoom shortcut
  const handleMacroZoom = () => {
    targetZoomRef.current = 2.2;
    setZoomLevel(2.2);
  };

  // Mode select with smooth angle adjustment
  const handleSelectMode = (mode: 'drape' | 'curved-swatch' | 'inspection-bed') => {
    setSurfaceMode(mode);
    if (mode === 'inspection-bed') {
      targetRotXRef.current = 5;
      targetRotYRef.current = 0;
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) => (prev + 1) % CATALOGUE_3D_ITEMS.length);
      } else if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) => (prev - 1 + CATALOGUE_3D_ITEMS.length) % CATALOGUE_3D_ITEMS.length);
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsAutoSpinning((prev) => !prev);
      } else if (e.key === 'r' || e.key === 'R') {
        handleResetCamera();
      } else if (e.key === 'f' || e.key === 'F') {
        handleFlip180();
      } else if (e.key === 'b' || e.key === 'B') {
        setIsBreezeActive((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      role="region"
      aria-label="Interactive 3D Textile Atelier Studio"
      style={isModal ? { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 } : undefined}
      className={`${isModal ? 'fixed inset-0 z-[9999] w-screen h-screen bg-[#0B0A09]/98 backdrop-blur-2xl' : 'relative w-full h-[calc(100vh-80px)] min-h-[650px] bg-[#0D0C0B]'} text-white flex flex-col overflow-hidden select-none`}
    >
      {/* Top Header Bar */}
      <header className="relative z-20 flex items-center justify-between px-4 sm:px-6 py-2.5 border-b border-[#262420] bg-[#141311]/95 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3 shrink-0">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-full hover:bg-white/10 text-[#C6A66B] transition-colors cursor-pointer shrink-0"
              title="Return to catalogue"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center p-1.5 shrink-0 bg-[#181715] border border-[#D4AF37]/60 shadow-[0_2px_10px_rgba(212,175,55,0.25)]">
            <BrandLogo variant="white" size="sm" className="w-full h-auto" />
          </div>
        </div>

        {/* Surface Geometry Mode Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center bg-[#1D1B17] p-1 rounded-xl border border-[#332F28]">
            <button
              onClick={() => handleSelectMode('drape')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                surfaceMode === 'drape'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38728] text-[#121110] font-semibold shadow-sm'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              Draped Cloth
            </button>
            <button
              onClick={() => handleSelectMode('curved-swatch')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                surfaceMode === 'curved-swatch'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38728] text-[#121110] font-semibold shadow-sm'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              Curved Swatch
            </button>
            <button
              onClick={() => handleSelectMode('inspection-bed')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                surfaceMode === 'inspection-bed'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38728] text-[#121110] font-semibold shadow-sm'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              Flat Bed
            </button>
          </div>

          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Close viewer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* Main 3D Canvas & Spec Area */}
      <div className="relative flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
        {/* Left Control Column: Details & Calibrated PBR Specs (Moved to the left) */}
        <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-[#262420] bg-[#12110F] flex flex-col overflow-y-auto shrink-0 order-2 md:order-1 max-h-[35vh] md:max-h-none">
          <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
            {/* Title & Category Badge */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-[#C6A66B]">
                  <Layers className="w-3 h-3 text-[#E6C687]" />
                  {currentItem.subcategory}
                </span>
                <span className="text-xs font-mono text-neutral-400">
                  {selectedIndex + 1} of {CATALOGUE_3D_ITEMS.length}
                </span>
              </div>
              <h2 className="font-serif text-lg sm:text-2xl font-bold text-[#F8F5EE] leading-tight">
                {currentItem.name}
              </h2>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {currentItem.description}
              </p>
            </div>

            {/* Specifications Card */}
            <div className="space-y-2 pt-3 border-t border-[#262420]">
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                Textile Specifications
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-[#181715] border border-[#262420]">
                  <span className="text-[10px] text-neutral-400 block font-mono">Composition</span>
                  <span className="text-[#FAF7F0] font-medium leading-tight block mt-0.5">
                    {currentItem.composition}
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-[#181715] border border-[#262420]">
                  <span className="text-[10px] text-neutral-400 block font-mono">Weave / Construction</span>
                  <span className="text-[#FAF7F0] font-medium leading-tight block mt-0.5">
                    {currentItem.weave || 'Mill Standard'}
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-[#181715] border border-[#262420]">
                  <span className="text-[10px] text-neutral-400 block font-mono">Weight / Density</span>
                  <span className="text-[#FAF7F0] font-medium leading-tight block mt-0.5">
                    {currentItem.weightGsm || 'Standard Production Weight'}
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-[#181715] border border-[#262420]">
                  <span className="text-[10px] text-neutral-400 block font-mono">Texture Resolution</span>
                  <span className="text-[#FAF7F0] font-medium leading-tight block mt-0.5 font-mono">
                    {currentItem.width}×{currentItem.height} {currentItem.format}
                  </span>
                </div>
              </div>
            </div>

            {/* Physical Shader Configuration */}
            <div className="space-y-2.5 pt-3 border-t border-[#262420]">
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                PBR Surface Physics
              </h4>
              <div className="space-y-2 text-xs font-mono">
                <div>
                  <div className="flex justify-between text-neutral-400 mb-1">
                    <span>Roughness (Matte vs Specular)</span>
                    <span className="text-[#E6C687]">{currentItem.roughness}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#201E1A] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B38728]"
                      style={{ width: `${currentItem.roughness * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-neutral-400 mb-1">
                    <span>Sheen & Grazing Fiber Luster</span>
                    <span className="text-[#E6C687]">{currentItem.sheen ?? 0.2}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#201E1A] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B38728]"
                      style={{ width: `${(currentItem.sheen ?? 0.2) * 100}%` }}
                    />
                  </div>
                </div>

                {currentItem.drapeStiffness !== undefined && (
                  <div>
                    <div className="flex justify-between text-neutral-400 mb-1">
                      <span>Drape Structural Stiffness</span>
                      <span className="text-[#E6C687]">{currentItem.drapeStiffness}</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#201E1A] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B38728]"
                        style={{ width: `${currentItem.drapeStiffness * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#262420]">
              <button
                onClick={() => onEnquire && onEnquire(currentItem)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F2D785] to-[#B38728] text-[#121110] font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-lg cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enquire About This Fabric</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Section: Fabric Viewing Area with Full Edge-to-Edge Control Bar */}
        <div className="relative flex-1 flex flex-col overflow-hidden h-full order-1 md:order-2 min-h-0">
          {/* Interactive Viewport Area */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative flex-1 w-full h-full bg-radial from-[#1A1815] via-[#100F0E] to-[#080707] cursor-grab active:cursor-grabbing touch-none select-none overflow-hidden"
          >
            {/* Three.js canvas container */}
            <div ref={mountRef} className="absolute inset-0 pointer-events-none" />

            {/* WebGL Not Supported Fallback */}
            {!webGLSupported && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#141210]">
                <AlertCircle className="w-12 h-12 text-[#D4AF37] mb-3" />
                <h3 className="font-serif text-xl font-bold">WebGL Acceleration Required</h3>
                <p className="text-neutral-400 text-sm max-w-md mt-2">
                  Your browser does not currently support WebGL hardware rendering. Below is the authentic 2D high-resolution specimen preview.
                </p>
                <img
                  src={currentItem.imageUrl}
                  alt={currentItem.name}
                  className="mt-4 max-h-64 rounded-xl border border-[#D4AF37]/30 shadow-2xl object-cover"
                />
              </div>
            )}

            {/* Texture Streaming Indicator */}
            {isTextureLoading && (
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#181715]/85 backdrop-blur-md border border-[#D4AF37]/40 text-xs font-mono text-[#F5DE93]">
                <div className="w-3.5 h-3.5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                <span>Streaming 1024×1024 High-Res Texture...</span>
              </div>
            )}

            {/* Texture Error Display */}
            {textureError && (
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/85 border border-red-500/50 text-xs text-red-200">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span>{textureError}</span>
              </div>
            )}
          </div>

          {/* Fabric Viewer Bar - Full Edge-to-Edge Width Directly Beneath the Fabric Viewer */}
          <div className="w-full border-t border-[#262420] bg-[#141311]/95 backdrop-blur-md px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0 z-10">
            {/* 3D Turntable Angle & Zoom Indicator */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1916] border border-[#332F26] text-xs font-mono text-neutral-300">
                <RotateCw className="w-3 h-3 text-[#D4AF37]" />
                <span>{Math.round(((rotationY % 360) + 360) % 360)}° Azimuth</span>
                <span className="text-neutral-500">•</span>
                <span>{zoomLevel.toFixed(1)}x Zoom</span>
              </div>
            </div>

            {/* Viewport Action Controls */}
            <div className="flex items-center gap-1 sm:gap-1.5 bg-[#1A1916] p-1 rounded-xl border border-[#332F26]">
              {/* Auto-spin Toggle */}
              <button
                onClick={() => setIsAutoSpinning(!isAutoSpinning)}
                className={`p-1.5 sm:p-2 rounded-lg transition-all cursor-pointer ${
                  isAutoSpinning
                    ? 'bg-[#D4AF37]/20 text-[#F5DE93] border border-[#D4AF37]/40'
                    : 'text-neutral-400 hover:text-white hover:bg-white/10'
                }`}
                title={isAutoSpinning ? 'Pause auto-rotation (Space)' : 'Start auto-rotation (Space)'}
              >
                {isAutoSpinning ? <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </button>

              {/* Quick 180 Flip */}
              <button
                onClick={handleFlip180}
                className="p-1.5 sm:p-2 rounded-lg text-neutral-400 hover:text-[#F5DE93] hover:bg-white/10 transition-colors cursor-pointer"
                title="Flip 180° to inspect reverse side (F)"
              >
                <Repeat className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Macro View Zoom */}
              <button
                onClick={handleMacroZoom}
                className="p-1.5 sm:p-2 rounded-lg text-neutral-400 hover:text-[#F5DE93] hover:bg-white/10 transition-colors cursor-pointer"
                title="Macro close-up inspection"
              >
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Breeze Airflow Toggle (in drape mode) */}
              {surfaceMode === 'drape' && (
                <button
                  onClick={() => setIsBreezeActive(!isBreezeActive)}
                  className={`p-1.5 sm:p-2 rounded-lg transition-all cursor-pointer ${
                    isBreezeActive
                      ? 'bg-[#38BDF8]/20 text-[#7DD3FC] border border-[#38BDF8]/40'
                      : 'text-neutral-400 hover:text-white hover:bg-white/10'
                  }`}
                  title={isBreezeActive ? 'Pause cloth airflow (B)' : 'Activate cloth airflow (B)'}
                >
                  <Wind className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              )}

              {/* Camera Reset */}
              <button
                onClick={handleResetCamera}
                className="p-1.5 sm:p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Reset camera view (R)"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <div className="w-[1px] h-4 bg-[#332F26] mx-0.5" />

              {/* Zoom In */}
              <button
                onClick={() => setZoomLevel((prev) => Math.min(3.5, prev + 0.25))}
                className="p-1.5 sm:p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Zoom in"
              >
                <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Zoom Out */}
              <button
                onClick={() => setZoomLevel((prev) => Math.max(0.6, prev - 0.25))}
                className="p-1.5 sm:p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Zoom out"
              >
                <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Product Selector Drawer (All 24 Fabrics with Textile Filters) */}
      <div className="border-t border-[#262420] bg-[#141311] px-4 py-2.5 z-20 shrink-0">
        <div className="max-w-7xl mx-auto space-y-2">
          {/* Category Filter Chips & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                data-tab="all"
                onClick={() => setActiveCategoryFilter('All')}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                  activeCategoryFilter === 'All'
                    ? 'bg-[#D4AF37] text-[#121110] font-bold shadow-md'
                    : 'bg-[#1E1C18] text-neutral-400 hover:text-white hover:bg-[#26241F]'
                }`}
              >
                All ({categoryCounts['All']})
              </button>
              <button
                data-tab="natural-fibers"
                onClick={() => setActiveCategoryFilter('Natural Fibers')}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeCategoryFilter === 'Natural Fibers'
                    ? 'bg-[#D4AF37] text-[#121110] font-bold shadow-md'
                    : 'bg-[#1E1C18] text-neutral-400 hover:text-white hover:bg-[#26241F]'
                }`}
              >
                <Layers className="w-3 h-3" />
                Natural Fibers ({categoryCounts['Natural Fibers']})
              </button>
              <button
                data-tab="blends-luxury"
                onClick={() => setActiveCategoryFilter('Blends & Luxury')}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeCategoryFilter === 'Blends & Luxury'
                    ? 'bg-[#D4AF37] text-[#121110] font-bold shadow-md'
                    : 'bg-[#1E1C18] text-neutral-400 hover:text-white hover:bg-[#26241F]'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                Blends & Luxury ({categoryCounts['Blends & Luxury']})
              </button>
              <button
                data-tab="mesh-knits"
                onClick={() => setActiveCategoryFilter('Mesh & Knits')}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeCategoryFilter === 'Mesh & Knits'
                    ? 'bg-[#D4AF37] text-[#121110] font-bold shadow-md'
                    : 'bg-[#1E1C18] text-neutral-400 hover:text-white hover:bg-[#26241F]'
                }`}
              >
                <Wind className="w-3 h-3" />
                Mesh & Knits ({categoryCounts['Mesh & Knits']})
              </button>
              <button
                data-tab="synthetics-sheers"
                onClick={() => setActiveCategoryFilter('Synthetics & Sheers')}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeCategoryFilter === 'Synthetics & Sheers'
                    ? 'bg-[#D4AF37] text-[#121110] font-bold shadow-md'
                    : 'bg-[#1E1C18] text-neutral-400 hover:text-white hover:bg-[#26241F]'
                }`}
              >
                <Layers className="w-3 h-3" />
                Synthetics & Sheers ({categoryCounts['Synthetics & Sheers']})
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 24 curated fabrics..."
                className="pl-8 pr-3 py-1 rounded-lg bg-[#1E1C18] border border-[#332F28] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] w-full sm:w-64"
              />
            </div>
          </div>

          {/* Horizontal Swatch Thumbnails Carousel (24 Fabrics) */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-[#332F28] scrollbar-track-transparent">
            {filteredItems.map((item) => {
              const originalIndex = CATALOGUE_3D_ITEMS.findIndex((i) => i.id === item.id);
              const isSelected = originalIndex === selectedIndex;

              return (
                <button
                  key={item.id}
                  data-item-id={item.id}
                  onClick={() => setSelectedIndex(originalIndex)}
                  className={`group relative flex-shrink-0 w-24 sm:w-28 p-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#26221A] border-[#D4AF37] shadow-[0_0_16px_rgba(212,175,55,0.25)] ring-1 ring-[#D4AF37]'
                      : 'bg-[#181715] border-[#262420] hover:border-[#3D382E] hover:bg-[#1E1C19]'
                  }`}
                >
                  {/* Thumbnail Image */}
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-neutral-900 mb-1.5">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.dataset.triedFallback) return;
                        target.dataset.triedFallback = 'true';
                        if (target.src.includes('/catalogue-3d/')) {
                          target.src = target.src.replace('/catalogue-3d/', '/firefly-fabrics/');
                        } else {
                          target.src = '/assets/catalogue-3d/plain.png';
                        }
                      }}
                    />
                    <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[8px] font-mono uppercase tracking-wider text-neutral-300">
                      FAB
                    </div>

                    {isSelected && (
                      <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#D4AF37] text-[#121110] flex items-center justify-center">
                        <CheckCircle2 className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Title & Info */}
                  <div className="truncate">
                    <p className={`text-[10px] sm:text-[11px] font-medium truncate ${isSelected ? 'text-[#FAF7F0] font-semibold' : 'text-neutral-300'}`}>
                      {getSimpleFabricName(item)}
                    </p>
                    <p className="text-[9px] font-mono text-neutral-500 truncate">
                      {item.weightGsm || item.subcategory}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
