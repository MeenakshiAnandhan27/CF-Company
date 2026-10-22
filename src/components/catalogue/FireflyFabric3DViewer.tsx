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
  ChevronRight,
  Info,
  AlertCircle,
  X,
  Send,
  Wind,
  CheckCircle2,
  Maximize2,
} from 'lucide-react';
import { FIREFLY_FABRICS, FireflyFabricItem, findMatchingFireflyIndex } from '../../data/fireflyFabricsData.ts';

interface FireflyFabric3DViewerProps {
  onBack?: () => void;
  onEnquire?: (fabric: FireflyFabricItem) => void;
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
  // Active Fabric Selection — intelligently pre-select matching fabric from initialMaterial or ID
  const [selectedFabricIndex, setSelectedFabricIndex] = useState<number>(() => {
    const query = initialFabricId || initialMaterial?.name || initialMaterial?.id;
    return findMatchingFireflyIndex(query);
  });

  // Keep selected fabric in sync if initialMaterial or initialFabricId changes
  useEffect(() => {
    const query = initialFabricId || initialMaterial?.name || initialMaterial?.id;
    if (query) {
      setSelectedFabricIndex(findMatchingFireflyIndex(query));
    }
  }, [initialMaterial, initialFabricId]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Surface Geometry Mode
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
  const fabricMeshRef = useRef<THREE.Mesh | null>(null);
  const turntableRef = useRef<THREE.Group | null>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const currentTextureRef = useRef<THREE.Texture | null>(null);

  // Base geometry attribute positions (for dynamic breeze wave)
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

  // Refs for animation loop state to avoid recreating loop on state changes
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

  const currentFabric: FireflyFabricItem = FIREFLY_FABRICS[selectedFabricIndex] || FIREFLY_FABRICS[0];

  // Filtered fabric list for selector
  const filteredFabrics = FIREFLY_FABRICS.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.composition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.weave.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === 'All' || f.category === activeCategory;
    return matchesSearch && matchesCat;
  });

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

  // Geometry generator for 3D fabric surfaces with organic asymmetric folds
  const createFabricGeometry = useCallback(
    (mode: 'drape' | 'curved-swatch' | 'inspection-bed', stiffness: number) => {
      const width = 3.2;
      const height = 2.5;
      const segW = 120;
      const segH = 120;

      const geometry = new THREE.PlaneGeometry(width, height, segW, segH);
      const pos = geometry.attributes.position;
      const count = pos.count;

      const basePos = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const normY = Math.max(0, Math.min(1, (y + height / 2) / height)); // 0 (bottom) to 1 (top)
        const invertNormY = 1 - normY; // 0 (top) to 1 (bottom)
        const normX = x / (width / 2); // -1 to +1

        let z = 0;
        let finalY = y;

        if (mode === 'drape') {
          // Asymmetric realistic cloth drape
          const foldFreq = 2.4 + (1 - stiffness) * 1.8;

          const primaryFold =
            Math.sin(x * foldFreq + 0.35) * (0.34 - stiffness * 0.12) * Math.sin(normY * Math.PI * 0.94);

          const secondaryRipple = Math.cos(x * foldFreq * 1.85 + 0.6) * 0.08 * invertNormY;

          const asymmetricSway = Math.sin(x * 1.1 + y * 0.75) * 0.05 * invertNormY;

          const edgeCurl = Math.pow(Math.abs(normX), 2.8) * 0.09 * (normX > 0 ? 1 : -0.8) * invertNormY;

          z = primaryFold + secondaryRipple + asymmetricSway + edgeCurl;

          const sag = Math.pow(Math.abs(normX), 2) * 0.08 * (1 - stiffness);
          finalY = y - sag;
        } else if (mode === 'curved-swatch') {
          const arc = Math.cos((x / width) * Math.PI) * 0.36;
          z = arc;
        } else {
          z = 0;
        }

        pos.setX(i, x);
        pos.setY(i, finalY);
        pos.setZ(i, isNaN(z) ? 0 : z);

        basePos[i * 3] = x;
        basePos[i * 3 + 1] = finalY;
        basePos[i * 3 + 2] = isNaN(z) ? 0 : z;
      }

      basePositionsRef.current = basePos;
      geometry.computeVertexNormals();
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();
      return geometry;
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
    camera.position.set(0, 0.25, 4.6);
    cameraRef.current = camera;

    // 3. Renderer with ACES Filmic tone mapping and preserveDrawingBuffer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
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

    const ambientLight = new THREE.AmbientLight('#FFFFFF', 0.55);
    scene.add(ambientLight);

    // 5. Atelier Turntable Group
    const turntableGroup = new THREE.Group();
    scene.add(turntableGroup);
    turntableRef.current = turntableGroup;

    // Soft Contact Shadow Plane underneath the cloth
    const shadowGeo = new THREE.PlaneGeometry(5.5, 5.5);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.3 });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.5;
    shadowMesh.receiveShadow = true;
    scene.add(shadowMesh);

    // 6. Fabric Physical Material & Mesh
    const initialFab = FIREFLY_FABRICS[0];
    const fabricMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xffffff),
      roughness: initialFab.roughness,
      metalness: initialFab.metalness,
      clearcoat: initialFab.clearcoat || 0,
      clearcoatRoughness: initialFab.clearcoatRoughness || 0.1,
      sheen: initialFab.sheen || 0,
      sheenColor: new THREE.Color(initialFab.sheenColor || '#FFFFFF'),
      sheenRoughness: initialFab.sheenRoughness || 0.3,
      side: THREE.DoubleSide,
      shadowSide: THREE.DoubleSide,
    });
    materialRef.current = fabricMaterial;

    const geometry = createFabricGeometry('drape', initialFab.drapeStiffness);
    const fabricMesh = new THREE.Mesh(geometry, fabricMaterial);
    fabricMesh.position.set(0, 0.05, 0);
    fabricMesh.castShadow = true;
    fabricMesh.receiveShadow = true;
    turntableGroup.add(fabricMesh);
    fabricMeshRef.current = fabricMesh;

    // 7. Animation Loop
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
        fabricMeshRef.current &&
        basePositionsRef.current &&
        surfaceModeRef.current === 'drape' &&
        isBreezeActiveRef.current
      ) {
        breezeTimeRef.current += delta;
        const bTime = breezeTimeRef.current;
        const meshGeo = fabricMeshRef.current.geometry;
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

    // 8. Resize Handler
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
    if (container) {
      resizeObserver.observe(container);
    }

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
      geometry.dispose();
      fabricMaterial.dispose();
    };
  }, [webGLSupported, createFabricGeometry]);

  // Load Real Adobe Firefly Texture Map when selected fabric changes
  useEffect(() => {
    if (!materialRef.current) return;

    setIsTextureLoading(true);
    setTextureError(null);

    const loader = new THREE.TextureLoader();
    const encodedUrl = encodeURI(currentFabric.imageUrl);

    loader.load(
      encodedUrl,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(currentFabric.textureRepeat.x, currentFabric.textureRepeat.y);
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

        const mat = materialRef.current!;
        mat.map = texture;
        mat.color = new THREE.Color(0xffffff);
        mat.roughness = currentFabric.roughness;
        mat.metalness = currentFabric.metalness;
        mat.clearcoat = currentFabric.clearcoat || 0;
        mat.clearcoatRoughness = currentFabric.clearcoatRoughness || 0.1;
        mat.sheen = currentFabric.sheen || 0;
        mat.sheenColor = new THREE.Color(currentFabric.sheenColor || '#FFFFFF');
        mat.sheenRoughness = currentFabric.sheenRoughness || 0.3;
        mat.needsUpdate = true;

        setIsTextureLoading(false);
      },
      undefined,
      (err) => {
        console.error('Failed to load Firefly texture:', err);
        setTextureError(`Could not load texture from ${currentFabric.imageUrl}`);
        setIsTextureLoading(false);
      }
    );
  }, [currentFabric]);

  // Update Geometry when surfaceMode or fabric stiffness changes
  useEffect(() => {
    if (!fabricMeshRef.current) return;
    const newGeo = createFabricGeometry(surfaceMode, currentFabric.drapeStiffness);
    fabricMeshRef.current.geometry.dispose();
    fabricMeshRef.current.geometry = newGeo;
  }, [surfaceMode, currentFabric.drapeStiffness, createFabricGeometry]);

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
    const newRotX = Math.max(-55, Math.min(55, targetRotXRef.current - dy * 0.45));

    targetRotYRef.current = newRotY;
    targetRotXRef.current = newRotX;
    setRotationY(newRotY);
    setRotationX(newRotX);

    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored if already released
    }
  };

  // Wheel Zoom Handler
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

  // One-Click Camera Reset
  const handleResetCamera = () => {
    targetRotYRef.current = 0;
    targetRotXRef.current = 10;
    targetZoomRef.current = 1.0;
    setRotationY(0);
    setRotationX(10);
    setZoomLevel(1.0);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setSelectedFabricIndex((prev) => (prev + 1) % FIREFLY_FABRICS.length);
      } else if (e.key === 'ArrowLeft') {
        setSelectedFabricIndex((prev) => (prev - 1 + FIREFLY_FABRICS.length) % FIREFLY_FABRICS.length);
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsAutoSpinning((prev) => !prev);
      } else if (e.key === 'r' || e.key === 'R') {
        handleResetCamera();
      } else if (e.key === 'b' || e.key === 'B') {
        setIsBreezeActive((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const categories = ['All', 'Natural Fibers', 'Blends', 'Synthetics', 'Mesh & Knits'];

  return (
    <div
      role="region"
      aria-label="Interactive 3D Fabric Atelier Studio"
      className={`relative w-full ${isModal ? 'fixed inset-0 z-[70] bg-[#0B0A09]/98 backdrop-blur-2xl' : 'h-[calc(100vh-80px)] min-h-[650px] bg-[#0D0C0B]'} text-white flex flex-col overflow-hidden select-none`}
    >
      {/* Top Header Bar */}
      <header className="relative z-20 flex items-center justify-between px-4 sm:px-6 py-2.5 border-b border-[#262420] bg-[#141311]/95 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-full hover:bg-white/10 text-[#C6A66B] transition-colors cursor-pointer"
              title="Return to catalogue"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#F5DE93] text-[10px] font-mono uppercase tracking-widest font-semibold">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                Atelier 3D Fabric Studio
              </span>
              <span className="text-[10px] font-mono text-neutral-400 hidden sm:inline">
                Adobe Firefly Collection • 15 Real Fabric Textures
              </span>
            </div>
            <h1 className="font-serif text-base sm:text-lg font-bold text-[#F8F5EE] tracking-tight mt-0.5">
              {currentFabric.name}
            </h1>
          </div>
        </div>

        {/* Surface Geometry Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#1D1B17] p-1 rounded-xl border border-[#332F28]">
            <button
              onClick={() => setSurfaceMode('drape')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                surfaceMode === 'drape'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38728] text-[#121110] font-semibold shadow-sm'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              Draped Cloth
            </button>
            <button
              onClick={() => setSurfaceMode('curved-swatch')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                surfaceMode === 'curved-swatch'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38728] text-[#121110] font-semibold shadow-sm'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              Curved Swatch
            </button>
            <button
              onClick={() => setSurfaceMode('inspection-bed')}
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
          {/* Dedicated Three.js canvas container with ZERO React JSX children */}
          <div ref={mountRef} className="absolute inset-0 pointer-events-none" />

          {/* WebGL Not Supported Fallback */}
          {!webGLSupported && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#141210]">
              <AlertCircle className="w-12 h-12 text-[#D4AF37] mb-3" />
              <h3 className="font-serif text-xl font-bold">WebGL Acceleration Required</h3>
              <p className="text-neutral-400 text-sm max-w-md mt-2">
                Your browser does not currently support WebGL hardware rendering. Below is the authentic 2D high-resolution swatch preview.
              </p>
              <img
                src={encodeURI(currentFabric.imageUrl)}
                alt={currentFabric.name}
                className="mt-4 max-h-64 rounded-xl border border-[#D4AF37]/30 shadow-2xl object-cover"
              />
            </div>
          )}

          {/* Texture Streaming Indicator */}
          {isTextureLoading && (
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#181715]/85 backdrop-blur-md border border-[#D4AF37]/40 text-xs font-mono text-[#F5DE93]">
              <div className="w-3.5 h-3.5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
              <span>Streaming 1024×1024 PBR Texture...</span>
            </div>
          )}

          {/* Texture Error Display */}
          {textureError && (
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/85 border border-red-500/50 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>{textureError}</span>
            </div>
          )}

          {/* Prominent Simulated Geometry Notice Badge */}
          <div className="absolute top-3 right-3 z-20 max-w-xs sm:max-w-md hidden sm:block pointer-events-none">
            <div className="flex items-start gap-2.5 px-3 py-2 rounded-xl bg-[#141311]/85 backdrop-blur-md border border-[#332F26] text-[11px] text-neutral-300 leading-snug shadow-xl">
              <Info className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <span className="font-mono uppercase tracking-wider text-[10px] text-[#F3DE9C] font-semibold block">
                  Simulated Geometry Notice
                </span>
                <span>
                  {surfaceMode === 'drape'
                    ? 'Procedural simulated geometry (parametric catenary drape folds & atelier airflow). Not physically accurate real-time cloth simulation.'
                    : surfaceMode === 'curved-swatch'
                    ? 'Curved architectural swatch plaque for grazing specular reflection.'
                    : 'Flat tensioned inspection bed for weave density and thread inspection.'}
                </span>
              </div>
            </div>
          </div>

          {/* 3D Turntable Angle & Zoom Indicator */}
          <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#141311]/85 backdrop-blur-md border border-[#332F26] text-xs font-mono text-neutral-300 shadow-lg">
              <RotateCw className="w-3 h-3 text-[#D4AF37]" />
              <span>{Math.round(((rotationY % 360) + 360) % 360)}° Azimuth</span>
              <span className="text-neutral-500">•</span>
              <span>{zoomLevel.toFixed(1)}x Zoom</span>
            </div>
          </div>

          {/* Floating Viewport Controls (Reset, Auto-spin, Breeze, Zoom) */}
          <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 bg-[#141311]/90 backdrop-blur-md p-1.5 rounded-2xl border border-[#332F26] shadow-2xl">
            {/* Auto-spin Toggle */}
            <button
              onClick={() => setIsAutoSpinning(!isAutoSpinning)}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isAutoSpinning
                  ? 'bg-[#D4AF37]/20 text-[#F5DE93] border border-[#D4AF37]/40'
                  : 'text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
              title={isAutoSpinning ? 'Pause auto-rotation (Space)' : 'Start auto-rotation (Space)'}
            >
              {isAutoSpinning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {/* Breeze Airflow Toggle */}
            {surfaceMode === 'drape' && (
              <button
                onClick={() => setIsBreezeActive(!isBreezeActive)}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  isBreezeActive
                    ? 'bg-[#38BDF8]/20 text-[#7DD3FC] border border-[#38BDF8]/40'
                    : 'text-neutral-400 hover:text-white hover:bg-white/10'
                }`}
                title={isBreezeActive ? 'Pause cloth airflow (B)' : 'Activate cloth airflow (B)'}
              >
                <Wind className="w-4 h-4" />
              </button>
            )}

            {/* Camera Reset */}
            <button
              onClick={handleResetCamera}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Reset camera view (R)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="w-[1px] h-4 bg-[#332F26] mx-0.5" />

            {/* Zoom In */}
            <button
              onClick={() => setZoomLevel((prev) => Math.min(3.5, prev + 0.25))}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            {/* Zoom Out */}
            <button
              onClick={() => setZoomLevel((prev) => Math.max(0.6, prev - 0.25))}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Sidebar: Fabric Details & PBR Specs */}
        <div className="w-full md:w-80 lg:w-96 border-t md:border-t-0 md:border-l border-[#262420] bg-[#12110F] flex flex-col overflow-y-auto shrink-0">
          <div className="p-4 sm:p-5 space-y-5">
            {/* Fabric Image & Title Card */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#C6A66B]">
                  {currentFabric.category}
                </span>
                <span className="text-xs font-mono text-neutral-400">
                  {selectedFabricIndex + 1} of {FIREFLY_FABRICS.length}
                </span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#F8F5EE]">
                {currentFabric.name}
              </h2>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {currentFabric.description}
              </p>
            </div>

            {/* Technical Mill Specifications */}
            <div className="space-y-2 pt-3 border-t border-[#262420]">
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                Textile Specifications
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-[#181715] border border-[#262420]">
                  <span className="text-[10px] text-neutral-400 block font-mono">Composition</span>
                  <span className="text-[#FAF7F0] font-medium leading-tight block mt-0.5">
                    {currentFabric.composition}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-[#181715] border border-[#262420]">
                  <span className="text-[10px] text-neutral-400 block font-mono">Construction</span>
                  <span className="text-[#FAF7F0] font-medium leading-tight block mt-0.5">
                    {currentFabric.weave}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-[#181715] border border-[#262420]">
                  <span className="text-[10px] text-neutral-400 block font-mono">Weight / Density</span>
                  <span className="text-[#FAF7F0] font-medium leading-tight block mt-0.5">
                    {currentFabric.weightGsm}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-[#181715] border border-[#262420]">
                  <span className="text-[10px] text-neutral-400 block font-mono">Texture Mapping</span>
                  <span className="text-[#FAF7F0] font-medium leading-tight block mt-0.5 font-mono">
                    1024×1024 PNG
                  </span>
                </div>
              </div>
            </div>

            {/* Fabric PBR Material Parameters */}
            <div className="space-y-2.5 pt-3 border-t border-[#262420]">
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                Physical Shader Configuration
              </h4>
              <div className="space-y-2 text-xs font-mono">
                <div>
                  <div className="flex justify-between text-neutral-400 mb-1">
                    <span>Roughness (Matte vs Specular)</span>
                    <span className="text-[#E6C687]">{currentFabric.roughness}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#201E1A] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B38728]"
                      style={{ width: `${currentFabric.roughness * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-neutral-400 mb-1">
                    <span>Textile Sheen & Grazing Fiber Luster</span>
                    <span className="text-[#E6C687]">{currentFabric.sheen}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#201E1A] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B38728]"
                      style={{ width: `${currentFabric.sheen * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-neutral-400 mb-1">
                    <span>Drape Structural Stiffness</span>
                    <span className="text-[#E6C687]">{currentFabric.drapeStiffness}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#201E1A] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B38728]"
                      style={{ width: `${currentFabric.drapeStiffness * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#262420]">
              <button
                onClick={() => onEnquire && onEnquire(currentFabric)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F2D785] to-[#B38728] text-[#121110] font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-lg cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enquire About This Fabric</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fabric Selector Drawer (All 15 Adobe Firefly Fabrics) */}
      <div className="border-t border-[#262420] bg-[#141311] px-4 py-2.5 z-20 shrink-0">
        <div className="max-w-7xl mx-auto space-y-2">
          {/* Filter Chips & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-full text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#D4AF37] text-[#121110] font-bold'
                      : 'bg-[#1E1C18] text-neutral-400 hover:text-white hover:bg-[#26241F]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 15 Firefly fabrics..."
                className="pl-8 pr-3 py-1 rounded-lg bg-[#1E1C18] border border-[#332F28] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] w-full sm:w-56"
              />
            </div>
          </div>

          {/* Horizontal Swatch Thumbnails Carousel (15 Fabrics) */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-[#332F28] scrollbar-track-transparent">
            {filteredFabrics.map((fabric) => {
              const originalIndex = FIREFLY_FABRICS.findIndex((f) => f.id === fabric.id);
              const isSelected = originalIndex === selectedFabricIndex;

              return (
                <button
                  key={fabric.id}
                  onClick={() => setSelectedFabricIndex(originalIndex)}
                  className={`group relative flex-shrink-0 w-24 sm:w-28 p-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#26221A] border-[#D4AF37] shadow-[0_0_16px_rgba(212,175,55,0.25)] ring-1 ring-[#D4AF37]'
                      : 'bg-[#181715] border-[#262420] hover:border-[#3D382E] hover:bg-[#1E1C19]'
                  }`}
                >
                  {/* Thumbnail Image */}
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-neutral-900 mb-1.5">
                    <img
                      src={encodeURI(fabric.imageUrl)}
                      alt={fabric.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#D4AF37] text-[#121110] flex items-center justify-center">
                        <CheckCircle2 className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Title & Info */}
                  <div className="truncate">
                    <p className={`text-[10px] font-medium truncate ${isSelected ? 'text-[#FAF7F0]' : 'text-neutral-300'}`}>
                      {fabric.name}
                    </p>
                    <p className="text-[9px] font-mono text-neutral-500 truncate">
                      {fabric.weightGsm}
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
