import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { FabricPackItem, Fabric3DMaterialConfig } from '../../data/fabricPack4KData.ts';
import { Layers, Eye, RefreshCw, ZoomIn, ZoomOut, AlertCircle } from 'lucide-react';

interface Fabric3DSceneProps {
  fabric: FabricPackItem;
  rotationY: number;
  rotationX: number;
  zoomLevel: number;
  isAutoSpinning: boolean;
  surfaceMode: 'drape' | 'curved-swatch' | 'inspection-bed';
  onAngleChange: (rotY: number, rotX: number) => void;
  onAutoSpinToggle: () => void;
}

// Global cache for procedural weave textures to ensure zero repeat calculation
const textureCache = new Map<string, THREE.CanvasTexture>();

/**
 * Procedural Normal Map Generator for authentic textile weaves
 * Generates an accurate RGB normal map representing micro-fiber elevation and yarn paths.
 */
function getWeaveNormalTexture(weaveType: Fabric3DMaterialConfig['weaveType']): THREE.CanvasTexture {
  if (textureCache.has(weaveType)) {
    return textureCache.get(weaveType)!;
  }

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const dummy = new THREE.CanvasTexture(canvas);
    return dummy;
  }

  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;
  const heightMap = new Float32Array(size * size);

  // 1. Generate height field based on authentic weave physics
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let h = 0.5;
      const u = (x / size) * Math.PI * 2;
      const v = (y / size) * Math.PI * 2;

      switch (weaveType) {
        case 'plain': {
          // 1/1 Balanced Plain Weave: Over-under interlacing yarns with subtle fiber fuzz
          const warp = Math.sin(u * 32);
          const weft = Math.sin(v * 32);
          const micro = (Math.sin(u * 128) + Math.cos(v * 128)) * 0.08;
          h = 0.5 + 0.35 * (warp * weft) + micro;
          break;
        }

        case 'satin': {
          // 8-End Floating Satin: Long smooth warp floats with minimal weft interruption
          const floatTrack = Math.sin(u * 64);
          const subtleStitch = Math.cos(v * 8) * 0.12;
          h = 0.5 + 0.22 * floatTrack + subtleStitch;
          break;
        }

        case 'linen-slub': {
          // Flax Slub Weave: Irregular yarn diameters and natural organic slubs
          const warpNoise = Math.sin(u * 24 + Math.sin(v * 4) * 2.5);
          const weftNoise = Math.sin(v * 24 + Math.cos(u * 3) * 2.5);
          const slubNodule = Math.sin(u * 8 + v * 6) > 0.7 ? 0.3 : 0.0;
          h = 0.5 + 0.32 * (warpNoise * weftNoise) + slubNodule;
          break;
        }

        case 'twill': {
          // 3/1 Right-Hand Diagonal Twill (Denim): 45-degree diagonal ridges
          const diag = Math.sin((u + v) * 36);
          const secondary = Math.cos((u - v) * 8) * 0.15;
          h = 0.5 + 0.38 * diag + secondary;
          break;
        }

        case 'velvet-pile': {
          // Dense cut-pile: Vertical sheared upright tufts with micro-porous texture
          const pile1 = Math.sin(u * 80) * Math.cos(v * 80);
          const pile2 = Math.sin(u * 140 + 1.2) * Math.cos(v * 140 + 1.5);
          h = 0.5 + 0.28 * pile1 + 0.18 * pile2;
          break;
        }

        case 'herringbone': {
          // Chevron Herringbone: Alternating diagonal bands (broken twill)
          const band = Math.floor((x / size) * 8) % 2 === 0 ? 1 : -1;
          const diag = Math.sin((u * band + v) * 32);
          h = 0.5 + 0.35 * diag;
          break;
        }

        case 'jacquard': {
          // Raised damask floral relief and brocade weave contours
          const floral = Math.sin(u * 6) * Math.cos(v * 6) + Math.sin((u + v) * 4);
          const ground = Math.sin(u * 32) * Math.sin(v * 32) * 0.2;
          h = 0.5 + 0.38 * (floral * 0.7 + ground);
          break;
        }

        case 'pique-knit': {
          // Double-Jersey Honeycomb / Waffle knit: Raised hexagonal cells with indented centers
          const cellX = Math.sin(u * 28);
          const cellY = Math.sin(v * 28);
          const waffle = Math.pow(cellX * cellY, 2);
          h = 0.5 + 0.42 * (waffle - 0.5);
          break;
        }
      }

      heightMap[y * size + x] = Math.max(0, Math.min(1, h));
    }
  }

  // 2. Compute Normal vectors via Sobel filter
  const scale = 2.4;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const x0 = (x - 1 + size) % size;
      const x1 = (x + 1) % size;
      const y0 = (y - 1 + size) % size;
      const y1 = (y + 1) % size;

      const dx = (heightMap[y * size + x1] - heightMap[y * size + x0]) * scale;
      const dy = (heightMap[y1 * size + x] - heightMap[y0 * size + x]) * scale;
      const dz = 1.0;

      const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const nx = -dx / len;
      const ny = -dy / len;
      const nz = dz / len;

      const idx = (y * size + x) * 4;
      data[idx] = Math.floor((nx * 0.5 + 0.5) * 255);
      data[idx + 1] = Math.floor((ny * 0.5 + 0.5) * 255);
      data[idx + 2] = Math.floor((nz * 0.5 + 0.5) * 255);
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 12);
  texture.needsUpdate = true;

  textureCache.set(weaveType, texture);
  return texture;
}

export const Fabric3DScene: React.FC<Fabric3DSceneProps> = ({
  fabric,
  rotationY,
  rotationX,
  zoomLevel,
  isAutoSpinning,
  surfaceMode,
  onAngleChange,
  onAutoSpinToggle,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGLSupported, setWebGLSupported] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const fabricMeshRef = useRef<THREE.Mesh | null>(null);
  const turntableRef = useRef<THREE.Group | null>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Drag interaction tracking
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchDistanceRef = useRef<number | null>(null);

  // Current interactive angle states
  const targetRotYRef = useRef<number>(rotationY);
  const targetRotXRef = useRef<number>(rotationX);
  const currentRotYRef = useRef<number>(rotationY);
  const currentRotXRef = useRef<number>(rotationX);
  const targetZoomRef = useRef<number>(zoomLevel);
  const currentZoomRef = useRef<number>(zoomLevel);

  // Sync props to refs
  useEffect(() => {
    targetRotYRef.current = rotationY;
    targetRotXRef.current = rotationX;
  }, [rotationY, rotationX]);

  useEffect(() => {
    targetZoomRef.current = zoomLevel;
  }, [zoomLevel]);

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

  // Geometry Generator for various fabric surface modes
  const createFabricGeometry = useCallback(
    (mode: 'drape' | 'curved-swatch' | 'inspection-bed', stiffness: number) => {
      const width = 3.4;
      const height = 2.4;
      const segW = 128;
      const segH = 128;

      const geometry = new THREE.PlaneGeometry(width, height, segW, segH);
      const pos = geometry.attributes.position;

      // Apply catenary cloth physics to vertices
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const normY = (y + height / 2) / height; // 0 (bottom) to 1 (top)

        if (mode === 'drape') {
          // Natural Atelier Hanging Drape: Catenary sag and undulating S-folds
          // Frequencies and amplitudes scale with material stiffness
          const foldFreq = 2.5 + (1 - stiffness) * 1.5; // silk ripples more, denim broader
          const primaryFold = Math.sin(x * foldFreq) * (0.28 - stiffness * 0.08) * Math.sin(normY * Math.PI * 0.95);
          const secondaryWave = Math.cos(x * foldFreq * 1.8 + 0.5) * 0.08 * (1 - normY);
          const bottomCurl = Math.sin(x * foldFreq * 2.2) * 0.09 * Math.pow(1 - normY, 2.5);

          const z = primaryFold + secondaryWave + bottomCurl;
          pos.setZ(i, z);
          // Subtle vertical catenary drape sagging
          pos.setY(i, y - Math.pow(x / (width * 0.6), 2) * 0.08 * (1 - stiffness));
        } else if (mode === 'curved-swatch') {
          // Architectural Curved Swatch Plaque: Smooth cylindrical arc
          const arc = Math.cos((x / width) * Math.PI) * 0.35;
          pos.setZ(i, arc);
        } else {
          // Tensioned Flat Inspection Bed: Perfectly flat surface for thread-level inspection
          pos.setZ(i, 0);
        }
      }

      geometry.computeVertexNormals();
      return geometry;
    },
    []
  );

  // Initialize Three.js Scene
  useEffect(() => {
    if (!webGLSupported || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0.4, 4.8);
    cameraRef.current = camera;

    // 3. Renderer with high-end color grading
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Studio Lighting Rig
    // Key Light (Warm daylight studio spot)
    const keyLight = new THREE.DirectionalLight('#FFF5E6', 2.4);
    keyLight.position.set(4, 5, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    scene.add(keyLight);

    // Fill Light (Soft cool studio diffuser)
    const fillLight = new THREE.DirectionalLight('#D8ECFF', 0.85);
    fillLight.position.set(-4, 3, 3);
    scene.add(fillLight);

    // Rim / Grazing Light (Backlight highlighting textile sheen, silhouette, and fiber fuzz)
    const rimLight = new THREE.DirectionalLight('#FFE8B5', 1.8);
    rimLight.position.set(0, 3.5, -4.5);
    scene.add(rimLight);

    // Underside bounce light
    const bounceLight = new THREE.DirectionalLight('#FFFFFF', 0.4);
    bounceLight.position.set(0, -3, 2);
    scene.add(bounceLight);

    // Soft Ambient
    const ambientLight = new THREE.AmbientLight('#FFFFFF', 0.55);
    scene.add(ambientLight);

    // 5. Atelier Turntable Group
    const turntableGroup = new THREE.Group();
    scene.add(turntableGroup);
    turntableRef.current = turntableGroup;

    // Turntable Base Platform
    const baseGeo = new THREE.CylinderGeometry(2.2, 2.25, 0.08, 64);
    const baseMat = new THREE.MeshStandardMaterial({
      color: '#121415',
      roughness: 0.4,
      metalness: 0.6,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -1.35;
    baseMesh.receiveShadow = true;
    turntableGroup.add(baseMesh);

    // Brass Accent Ring on Turntable
    const ringGeo = new THREE.TorusGeometry(2.18, 0.015, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: '#C6A66B',
      roughness: 0.25,
      metalness: 0.85,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -1.31;
    turntableGroup.add(ringMesh);

    // 6. Fabric Swatch Chassis & Cloth Mesh
    const normalMap = getWeaveNormalTexture(fabric.materialConfig.weaveType);

    const fabricMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(fabric.materialConfig.baseColor),
      roughness: fabric.materialConfig.roughness,
      metalness: fabric.materialConfig.metalness,
      clearcoat: fabric.materialConfig.clearcoat || 0,
      clearcoatRoughness: fabric.materialConfig.clearcoatRoughness || 0.1,
      sheen: fabric.materialConfig.sheen || 0,
      sheenColor: fabric.materialConfig.sheenColor ? new THREE.Color(fabric.materialConfig.sheenColor) : new THREE.Color('#FFFFFF'),
      sheenRoughness: fabric.materialConfig.sheenRoughness || 0.3,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(
        fabric.materialConfig.bumpScale || 0.05,
        fabric.materialConfig.bumpScale || 0.05
      ),
      side: THREE.DoubleSide,
      shadowSide: THREE.DoubleSide,
    });
    materialRef.current = fabricMaterial;

    const geometry = createFabricGeometry(surfaceMode, fabric.materialConfig.drapeStiffness);
    const fabricMesh = new THREE.Mesh(geometry, fabricMaterial);
    fabricMesh.position.set(0, 0.1, 0);
    fabricMesh.castShadow = true;
    fabricMesh.receiveShadow = true;
    turntableGroup.add(fabricMesh);
    fabricMeshRef.current = fabricMesh;

    // Brass Atelier Swatch Clip on Top
    const clipGroup = new THREE.Group();
    const clipBarGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.5, 32);
    const clipBarMat = new THREE.MeshStandardMaterial({
      color: '#D4AF37',
      metalness: 0.9,
      roughness: 0.22,
    });
    const clipBar = new THREE.Mesh(clipBarGeo, clipBarMat);
    clipBar.rotation.z = Math.PI / 2;
    clipBar.position.y = 1.32;
    clipGroup.add(clipBar);

    const hangerGeo = new THREE.TorusGeometry(0.18, 0.025, 16, 32);
    const hanger = new THREE.Mesh(hangerGeo, clipBarMat);
    hanger.position.set(0, 1.48, 0);
    clipGroup.add(hanger);

    turntableGroup.add(clipGroup);

    setIsLoading(false);

    // 7. Animation & Render Loop
    let lastTime = performance.now();

    const animate = (time: number) => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const delta = (time - lastTime) * 0.001;
      lastTime = time;

      // Auto-spin turntable smoothly when enabled
      if (isAutoSpinning && !isDraggingRef.current) {
        targetRotYRef.current = (targetRotYRef.current + delta * 20) % 360;
      }

      // Smooth camera / turntable interpolation (inertia damping)
      currentRotYRef.current += (targetRotYRef.current - currentRotYRef.current) * 0.12;
      currentRotXRef.current += (targetRotXRef.current - currentRotXRef.current) * 0.12;
      currentZoomRef.current += (targetZoomRef.current - currentZoomRef.current) * 0.15;

      // Apply rotation to turntable group
      if (turntableRef.current) {
        turntableRef.current.rotation.y = (currentRotYRef.current * Math.PI) / 180;
        turntableRef.current.rotation.x = (currentRotXRef.current * Math.PI) / 180;
      }

      // Apply zoom to camera position
      if (cameraRef.current) {
        const baseDist = 4.8;
        cameraRef.current.position.z = baseDist / currentZoomRef.current;
      }

      renderer.render(scene, camera);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // 8. Handle Window Resize
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 600;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      geometry.dispose();
      fabricMaterial.dispose();
    };
  }, [webGLSupported, fabric, surfaceMode, createFabricGeometry, isAutoSpinning]);

  // Update material properties when fabric changes
  useEffect(() => {
    if (!materialRef.current) return;

    const mat = materialRef.current;
    mat.color = new THREE.Color(fabric.materialConfig.baseColor);
    mat.roughness = fabric.materialConfig.roughness;
    mat.metalness = fabric.materialConfig.metalness;
    mat.clearcoat = fabric.materialConfig.clearcoat || 0;
    mat.clearcoatRoughness = fabric.materialConfig.clearcoatRoughness || 0.1;
    mat.sheen = fabric.materialConfig.sheen || 0;
    mat.sheenColor = fabric.materialConfig.sheenColor ? new THREE.Color(fabric.materialConfig.sheenColor) : new THREE.Color('#FFFFFF');
    mat.sheenRoughness = fabric.materialConfig.sheenRoughness || 0.3;

    const normalMap = getWeaveNormalTexture(fabric.materialConfig.weaveType);
    mat.normalMap = normalMap;
    const bump = fabric.materialConfig.bumpScale || 0.05;
    mat.normalScale.set(bump, bump);
    mat.needsUpdate = true;
  }, [fabric]);

  // Update Geometry when surfaceMode or stiffness changes
  useEffect(() => {
    if (!fabricMeshRef.current) return;
    const newGeo = createFabricGeometry(surfaceMode, fabric.materialConfig.drapeStiffness);
    fabricMeshRef.current.geometry.dispose();
    fabricMeshRef.current.geometry = newGeo;
  }, [surfaceMode, fabric.materialConfig.drapeStiffness, createFabricGeometry]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    if (isAutoSpinning) {
      onAutoSpinToggle();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    const newRotY = (targetRotYRef.current + dx * 0.65 + 360) % 360;
    const newRotX = Math.max(-55, Math.min(55, targetRotXRef.current - dy * 0.45));

    targetRotYRef.current = newRotY;
    targetRotXRef.current = newRotX;
    onAngleChange(newRotY, newRotX);

    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      touchDistanceRef.current = null;
      if (isAutoSpinning) {
        onAutoSpinToggle();
      }
    } else if (e.touches.length === 2) {
      // Two finger pinch zoom start
      isDraggingRef.current = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchDistanceRef.current = Math.sqrt(dx * dx + dy * dy);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDraggingRef.current) {
      const dx = e.touches[0].clientX - dragStartRef.current.x;
      const dy = e.touches[0].clientY - dragStartRef.current.y;

      const newRotY = (targetRotYRef.current + dx * 0.75 + 360) % 360;
      const newRotX = Math.max(-55, Math.min(55, targetRotXRef.current - dy * 0.5));

      targetRotYRef.current = newRotY;
      targetRotXRef.current = newRotX;
      onAngleChange(newRotY, newRotX);

      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2 && touchDistanceRef.current !== null) {
      // Pinch to zoom
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const currentDist = Math.sqrt(dx * dx + dy * dy);
      const ratio = currentDist / touchDistanceRef.current;

      const newZoom = Math.max(0.7, Math.min(2.8, targetZoomRef.current * ratio));
      targetZoomRef.current = newZoom;
      touchDistanceRef.current = currentDist;
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    touchDistanceRef.current = null;
  };

  // Wheel zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * -0.0015;
    const newZoom = Math.max(0.7, Math.min(2.8, targetZoomRef.current + zoomDelta));
    targetZoomRef.current = newZoom;
  };

  // Fallback view if WebGL is unavailable
  if (!webGLSupported) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-[#0A0D0C]">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-amber-400" />
        </div>
        <h3 className="text-xl font-serif text-white mb-2">3D Hardware Acceleration Unavailable</h3>
        <p className="text-sm text-white/70 max-w-md mb-6 leading-relaxed">
          WebGL rendering is not active on your browser or device. You can still inspect the authentic 4K master studio photography in high definition below.
        </p>
        <div className="relative max-w-lg aspect-square rounded-xl overflow-hidden border border-white/20 shadow-2xl">
          <img
            src={fabric.studioImage}
            alt={fabric.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/80 text-xs font-mono text-[#D4AF37]">
            4K MASTER STUDIO REFERENCE
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none overflow-hidden"
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#070A09] z-20 transition-opacity duration-300">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 text-[#C6A66B] animate-spin" />
            <span className="font-mono text-xs text-white/70 tracking-widest uppercase">
              Initializing 3D Cloth Physics...
            </span>
          </div>
        </div>
      )}

      {/* Surface Physics & Weave HUD Pill */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
        <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono text-white/90 flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
          <span>SURFACE: <strong className="text-[#C6A66B]">{fabric.materialConfig.weaveType.toUpperCase()}</strong></span>
          <span className="text-white/30">|</span>
          <span>ROUGHNESS: <strong className="text-white font-medium">{Math.round(fabric.materialConfig.roughness * 100)}%</strong></span>
          {fabric.materialConfig.sheen ? (
            <>
              <span className="text-white/30">|</span>
              <span>SHEEN: <strong className="text-[#D4AF37] font-medium">{Math.round((fabric.materialConfig.sheen || 0) * 100)}%</strong></span>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
