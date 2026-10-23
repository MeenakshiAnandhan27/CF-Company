import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Procedural open-weave combed linen/cotton canvas bump texture
 * Captures tactile warp and weft yarn structures
 */
function createWovenFabricTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, size, size);

    const step = 8;
    for (let x = 0; x < size; x += step) {
      for (let y = 0; y < size; y += step) {
        const isWarp = ((x / step) % 2 === 0) !== ((y / step) % 2 === 0);
        const shade = isWarp ? 155 : 105;
        const noise = (Math.random() - 0.5) * 14;
        const val = Math.min(255, Math.max(0, Math.round(shade + noise)));

        ctx.fillStyle = `rgb(${val},${val},${val})`;
        ctx.fillRect(x, y, step, step);

        // Fine thread fiber highlight
        ctx.strokeStyle = 'rgba(255,255,255,0.09)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (isWarp) {
          ctx.moveTo(x + step / 2, y);
          ctx.lineTo(x + step / 2, y + step);
        } else {
          ctx.moveTo(x, y + step / 2);
          ctx.lineTo(x + step, y + step / 2);
        }
        ctx.stroke();
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(24, 24);
  texture.colorSpace = THREE.NoColorSpace;
  return texture;
}

/**
 * Procedural liquid silk satin micro-grain texture
 * Captures smooth directional sheen of high-luster satin
 */
function createSatinSilkTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1.5;
    for (let i = -size; i < size * 2; i += 6) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + size, size);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 12);
  texture.colorSpace = THREE.NoColorSpace;
  return texture;
}

/**
 * Soft Alpha Falloff Map for Left Fabric Ribbon
 * Samples UV range [0.0, 0.32]: fully opaque on the outer drape, softly dissolving to 0 towards the center
 */
function createLeftFabricAlphaMap(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const imgData = ctx.createImageData(size, size);
    const uMax = 0.32; // leftUV spans x in [0.0, 0.32]

    for (let y = 0; y < size; y++) {
      const vNorm = y / (size - 1);
      const vFade = Math.sin(vNorm * Math.PI);
      const vAlpha = Math.min(1.0, vFade * 3.2);

      for (let x = 0; x < size; x++) {
        const u = x / (size - 1);
        let uAlpha = 0.0;
        if (u <= uMax) {
          const t = u / uMax; // 0 (outer left) to 1 (inner crest)
          if (t <= 0.45) {
            uAlpha = 1.0;
          } else {
            const easeT = (t - 0.45) / 0.55;
            uAlpha = 0.5 * (1 + Math.cos(easeT * Math.PI));
          }
        }

        const alphaVal = Math.round(255 * uAlpha * vAlpha);
        const idx = (y * size + x) * 4;
        imgData.data[idx] = 255;
        imgData.data[idx + 1] = 255;
        imgData.data[idx + 2] = 255;
        imgData.data[idx + 3] = alphaVal;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Soft Alpha Falloff Map for Right Fabric Ribbon
 * Samples UV range [0.68, 1.0]: softly easing from 0 at inner crest to fully opaque on outer right
 */
function createRightFabricAlphaMap(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const imgData = ctx.createImageData(size, size);
    const uMin = 0.68; // rightUV spans x in [0.68, 1.0]

    for (let y = 0; y < size; y++) {
      const vNorm = y / (size - 1);
      const vFade = Math.sin(vNorm * Math.PI);
      const vAlpha = Math.min(1.0, vFade * 3.2);

      for (let x = 0; x < size; x++) {
        const u = x / (size - 1);
        let uAlpha = 0.0;
        if (u >= uMin) {
          const t = (u - uMin) / (1.0 - uMin); // 0 (inner crest) to 1 (outer right)
          if (t >= 0.55) {
            uAlpha = 1.0;
          } else {
            const easeT = t / 0.55;
            uAlpha = 0.5 * (1 - Math.cos(easeT * Math.PI));
          }
        }

        const alphaVal = Math.round(255 * uAlpha * vAlpha);
        const idx = (y * size + x) * 4;
        imgData.data[idx] = 255;
        imgData.data[idx + 1] = 255;
        imgData.data[idx + 2] = 255;
        imgData.data[idx + 3] = alphaVal;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Soft Alpha Falloff Map for Lower Foundation Fabric
 * Samples UV range [0.0, 0.22] in V: fully opaque at bottom, softly easing to 0 at top edge
 */
function createLowerFabricAlphaMap(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const imgData = ctx.createImageData(size, size);
    const vMax = 0.22; // lowerUV spans y in [0.0, 0.22]

    for (let y = 0; y < size; y++) {
      const v = y / (size - 1);
      let vAlpha = 0.0;
      if (v <= vMax) {
        const t = v / vMax;
        if (t <= 0.40) {
          vAlpha = 1.0;
        } else {
          const easeT = (t - 0.40) / 0.60;
          vAlpha = 0.5 * (1 + Math.cos(easeT * Math.PI));
        }
      }

      for (let x = 0; x < size; x++) {
        const uNorm = x / (size - 1);
        const uFade = Math.sin(uNorm * Math.PI);
        const uAlpha = Math.min(1.0, uFade * 3.0);

        const alphaVal = Math.round(255 * vAlpha * uAlpha);
        const idx = (y * size + x) * 4;
        imgData.data[idx] = 255;
        imgData.data[idx + 1] = 255;
        imgData.data[idx + 2] = 255;
        imgData.data[idx + 3] = alphaVal;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export const HeroFabric3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0, 9.5);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.LinearToneMapping;
      renderer.toneMappingExposure = 1.0;
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('[HeroFabric3D] WebGL not available:', e);
      return;
    }

    // 2. Studio Lighting: Luxury Luminous Ambient & Warm Highlights
    // Soft luminous ambient base matching ivory showroom ambience
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xf6f0e4, 1.35);
    scene.add(hemiLight);

    // Warm Key Light highlighting silk sheen and woven crests
    const keyLight = new THREE.DirectionalLight(0xfffaec, 1.15);
    keyLight.position.set(4.5, 6.0, 5.0);
    scene.add(keyLight);

    // Left Studio Fill: Soft warm ivory
    const leftFillLight = new THREE.DirectionalLight(0xfef9f2, 0.95);
    leftFillLight.position.set(-5.0, 4.5, 4.5);
    scene.add(leftFillLight);

    // Subtle grazing rim light
    const rimLight = new THREE.DirectionalLight(0xfff6e8, 0.55);
    rimLight.position.set(-2.0, 4.0, -2.5);
    scene.add(rimLight);

    // Low fill light for depth foundation
    const lowerFill = new THREE.DirectionalLight(0xfff9f2, 0.5);
    lowerFill.position.set(0.0, -2.5, 3.0);
    scene.add(lowerFill);

    // Load High-Res Generated Raw Fabric Hero Texture
    const textureLoader = new THREE.TextureLoader();
    const heroTexture = textureLoader.load('/assets/hero/raw-fabric-hero.jpg');
    heroTexture.colorSpace = THREE.SRGBColorSpace;
    heroTexture.wrapS = THREE.ClampToEdgeWrapping;
    heroTexture.wrapT = THREE.ClampToEdgeWrapping;

    const wovenTexture = createWovenFabricTexture();
    const satinTexture = createSatinSilkTexture();
    const leftAlpha = createLeftFabricAlphaMap();
    const rightAlpha = createRightFabricAlphaMap();
    const lowerAlpha = createLowerFabricAlphaMap();

    // Responsive spread factor: opens center space wider on smaller screens
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const edgeSpread = isMobile ? 1.55 : isTablet ? 1.3 : 1.0;

    // -------------------------------------------------------------------------
    // 3. FABRIC 1 (LEFT SIDE): Soft Ivory Woven Raw Cotton / Georgette
    // Enters diagonally from upper-left corner, natural S-shaped curves & layered folds,
    // flows downwards and gently curls towards bottom-left corner
    // -------------------------------------------------------------------------
    const leftSegsU = 80;
    const leftSegsV = 100;
    const leftGeo = new THREE.PlaneGeometry(1, 1, leftSegsU, leftSegsV);
    const leftPos = leftGeo.attributes.position;
    const leftUV = leftGeo.attributes.uv;

    let leftIdx = 0;
    for (let iv = 0; iv <= leftSegsV; iv++) {
      const v = 1 - iv / leftSegsV;
      for (let iu = 0; iu <= leftSegsU; iu++) {
        const u = iu / leftSegsU;
        leftUV.setXY(leftIdx, u * 0.32, v);
        leftIdx++;
      }
    }
    leftUV.needsUpdate = true;

    const leftMat = new THREE.MeshPhysicalMaterial({
      map: heroTexture,
      alphaMap: leftAlpha,
      transparent: true,
      depthWrite: false,
      color: 0xffffff, // Pure white preserves authentic reference image tones
      roughness: 0.58, // Tactile dielectric raw cotton / georgette
      metalness: 0.0,
      sheen: 0.95,
      sheenColor: new THREE.Color(0xfffdf8),
      sheenRoughness: 0.72, // Broad, soft rim characteristic of cotton/linen
      bumpMap: wovenTexture,
      bumpScale: 0.038,
      side: THREE.DoubleSide,
    });

    const leftMesh = new THREE.Mesh(leftGeo, leftMat);
    scene.add(leftMesh);

    // -------------------------------------------------------------------------
    // 4. FABRIC 2 (RIGHT SIDE): Lightweight Champagne Chiffon / Liquid Silk
    // Broad flowing wave curving inward and sweeping back towards right edge,
    // lighter softer shade than gold, realistic highlights without metallic look
    // -------------------------------------------------------------------------
    const rightSegsU = 80;
    const rightSegsV = 100;
    const rightGeo = new THREE.PlaneGeometry(1, 1, rightSegsU, rightSegsV);
    const rightPos = rightGeo.attributes.position;
    const rightUV = rightGeo.attributes.uv;

    let rightIdx = 0;
    for (let iv = 0; iv <= rightSegsV; iv++) {
      const v = 1 - iv / rightSegsV;
      for (let iu = 0; iu <= rightSegsU; iu++) {
        const u = iu / rightSegsU;
        rightUV.setXY(rightIdx, 0.68 + u * 0.32, v);
        rightIdx++;
      }
    }
    rightUV.needsUpdate = true;

    const rightMat = new THREE.MeshPhysicalMaterial({
      map: heroTexture,
      alphaMap: rightAlpha,
      transparent: true,
      depthWrite: false,
      color: 0xffffff,
      roughness: 0.22, // Liquid silk / chiffon luster
      metalness: 0.01,
      clearcoat: 0.35,
      clearcoatRoughness: 0.2,
      sheen: 1.0,
      sheenColor: new THREE.Color(0xfffaed),
      sheenRoughness: 0.22, // Narrow bright satin sheen rim
      bumpMap: satinTexture,
      bumpScale: 0.015,
      side: THREE.DoubleSide,
    });

    const rightMesh = new THREE.Mesh(rightGeo, rightMat);
    scene.add(rightMesh);

    // -------------------------------------------------------------------------
    // 5. FABRIC 3 (LOWER EDGE): Subtle Third Fabric Layer (Beige Twill Foundation)
    // Resting behind central text area, gentle horizontal wave creating depth
    // -------------------------------------------------------------------------
    const lowerSegsU = 100;
    const lowerSegsV = 32;
    const lowerGeo = new THREE.PlaneGeometry(1, 1, lowerSegsU, lowerSegsV);
    const lowerPos = lowerGeo.attributes.position;
    const lowerUV = lowerGeo.attributes.uv;

    let lowIdx = 0;
    for (let iv = 0; iv <= lowerSegsV; iv++) {
      const v = iv / lowerSegsV;
      for (let iu = 0; iu <= lowerSegsU; iu++) {
        const u = iu / lowerSegsU;
        lowerUV.setXY(lowIdx, 0.15 + u * 0.70, v * 0.22);
        lowIdx++;
      }
    }
    lowerUV.needsUpdate = true;

    const lowerMat = new THREE.MeshPhysicalMaterial({
      map: heroTexture,
      alphaMap: lowerAlpha,
      transparent: true,
      depthWrite: false,
      color: 0xffffff,
      roughness: 0.65,
      metalness: 0.0,
      sheen: 0.7,
      sheenColor: new THREE.Color(0xfffcf7),
      sheenRoughness: 0.75,
      bumpMap: wovenTexture,
      bumpScale: 0.02,
      side: THREE.DoubleSide,
    });

    const lowerMesh = new THREE.Mesh(lowerGeo, lowerMat);
    scene.add(lowerMesh);

    // -------------------------------------------------------------------------
    // 6. REAL-TIME TRAVELING WAVE PROPAGATION & SUBTLE INTERACTIVITY
    // -------------------------------------------------------------------------
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animationFrameId: number;
    let accumulatedTime = 0;
    let lastTime = performance.now();
    let isPageVisible = true;

    const handleVisibilityChange = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible) lastTime = performance.now();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Continuous wave propagation with traveling deformation along cloth
    const updateFabricFolds = (time: number) => {
      // Interpolated pointer distance ripples (subtle, restrained depth shift)
      const leftPointerDist = Math.hypot(mouseX - (-0.6), mouseY - 0.1);
      const leftRipple = Math.exp(-leftPointerDist * 2.2) * Math.sin(time * 3.0) * 0.1;

      const rightPointerDist = Math.hypot(mouseX - 0.6, mouseY - 0.1);
      const rightRipple = Math.exp(-rightPointerDist * 2.2) * Math.sin(time * 3.0 + 1.5) * 0.1;

      // --- FABRIC 1 (LEFT SIDE): Soft Ivory Woven Raw Cotton / Georgette ---
      // Enters diagonally from upper-left, sweeps inward, curls to bottom-left
      const lPosArr = leftGeo.attributes.position.array as Float32Array;
      const leftDepthScale = 1.0 + 0.12 * Math.sin(time * 0.18);

      let idx = 0;
      for (let iv = 0; iv <= leftSegsV; iv++) {
        const v = 1 - iv / leftSegsV; // 1 at top, 0 at bottom
        // Centerline in X entering from upper-left, swooping inward, curling to bottom-left
        const cx = (-4.6 + 1.2 * Math.sin(v * Math.PI * 1.1) - 0.8 * (1 - v)) * edgeSpread;
        const cy = (v - 0.5) * 8.6;
        const ribWidth = 3.4 + 0.8 * (1 - v); // Slightly gathers towards bottom

        for (let iu = 0; iu <= leftSegsU; iu++) {
          const u = iu / leftSegsU; // 0 (outer left) to 1 (inner crest)
          const i3 = idx * 3;

          // Natural S-curve contour
          const sContour = Math.sin(v * Math.PI * 1.2) * 0.25 * u;
          const lateralSway = Math.sin(v * 2.2 + time * 0.24) * 0.08;

          // Diagonal traveling wave
          const diagPhase = v * 2.8 + u * 1.8 - time * 0.38;
          const fold1 = (Math.sin(diagPhase * 1.5) + 0.28 * Math.sin(diagPhase * 3.0)) * (0.7 + 0.22 * (1 - v));
          const fold2 = Math.cos(v * 4.6 - u * 2.4 - time * 0.26) * 0.25;
          const fold3 = Math.sin(u * 9.0 + v * 6.0 + time * 0.42) * 0.06;

          // Curled rolled hem on both edges of the ribbon for full 3D volume
          const edgeDist = Math.abs(u - 0.5) * 2;
          const edgeHem = -Math.pow(Math.max(0, edgeDist - 0.6) / 0.4, 2.0) * 0.55;

          lPosArr[i3] = cx + (u - 0.5) * ribWidth + sContour + lateralSway;
          lPosArr[i3 + 1] = cy + Math.cos(u * Math.PI) * 0.12;
          lPosArr[i3 + 2] = (fold1 + fold2 + fold3) * leftDepthScale + edgeHem + 0.28 + leftRipple * u;
          idx++;
        }
      }
      leftGeo.attributes.position.needsUpdate = true;
      leftGeo.computeVertexNormals();

      // --- FABRIC 2 (RIGHT SIDE): Champagne Chiffon / Liquid Silk Waves ---
      // Broad flowing wave curving inward and sweeping back towards right edge
      const rPosArr = rightGeo.attributes.position.array as Float32Array;
      const rightDepthScale = 1.0 + 0.14 * Math.cos(time * 0.22);

      idx = 0;
      for (let iv = 0; iv <= rightSegsV; iv++) {
        const v = 1 - iv / rightSegsV; // 1 at top, 0 at bottom
        // Broad flowing wave: curves inward at mid-upper and sweeps back towards right edge at bottom
        const cx = (4.5 - 1.2 * Math.sin(v * Math.PI * 0.95) + 0.85 * Math.pow(1 - v, 1.4)) * edgeSpread;
        const cy = (v - 0.5) * 8.8;
        const ribWidth = 3.4 + 0.6 * v;

        for (let iu = 0; iu <= rightSegsU; iu++) {
          const u = iu / rightSegsU; // 0 (inner hem) to 1 (outer right edge)
          const i3 = idx * 3;

          const sweepContour = -Math.sin(v * Math.PI * 1.1) * 0.25 * (1 - u);
          const silkSway = -Math.sin(v * 2.2 + time * 0.22) * 0.08;

          // Liquid silk traveling cascade
          const silkPhase = v * 2.8 - (1 - u) * 2.2 + time * 0.34;
          const silkFold1 = (Math.sin(silkPhase * 1.7) + 0.25 * Math.sin(silkPhase * 3.4)) * (0.8 + 0.22 * (1 - v));
          const silkFold2 = Math.cos(v * 5.2 + (1 - u) * 2.4 - time * 0.22) * 0.28;
          const silkFold3 = Math.sin((1 - u) * 8.0 - v * 3.5 + time * 0.38) * 0.06;

          // Curled rolled hem on both edges of the silk ribbon
          const silkEdgeDist = Math.abs(u - 0.5) * 2;
          const silkEdgeHem = -Math.pow(Math.max(0, silkEdgeDist - 0.6) / 0.4, 2.0) * 0.55;

          rPosArr[i3] = cx + (u - 0.5) * ribWidth + sweepContour + silkSway;
          rPosArr[i3 + 1] = cy + Math.cos(u * Math.PI) * 0.12;
          rPosArr[i3 + 2] = (silkFold1 + silkFold2 + silkFold3) * rightDepthScale + silkEdgeHem + 0.32 + rightRipple * (1 - u);
          idx++;
        }
      }
      rightGeo.attributes.position.needsUpdate = true;
      rightGeo.computeVertexNormals();

      // --- FABRIC 3 (LOWER EDGE): Beige Twill Foundation ---
      // Gentle horizontal wave layer providing layered textile depth across the foundation
      const lowPosArr = lowerGeo.attributes.position.array as Float32Array;

      idx = 0;
      for (let iv = 0; iv <= lowerSegsV; iv++) {
        const v = iv / lowerSegsV; // 0 at bottom, 1 at top
        const cy = -2.8 + (v - 0.5) * 2.0;

        for (let iu = 0; iu <= lowerSegsU; iu++) {
          const u = iu / lowerSegsU; // 0 at left, 1 at right
          const i3 = idx * 3;

          const cx = (u - 0.5) * 15.0;

          const lowerPhase = u * 3.4 - time * 0.18;
          const lowerFold = (Math.sin(lowerPhase) * 0.2 + 0.08 * Math.cos(u * 6.5 + time * 0.14)) * (0.6 + 0.4 * (1 - v));

          // Soft rolled hem on upper and lower edges
          const vDist = Math.abs(v - 0.5) * 2;
          const lowHem = -Math.pow(Math.max(0, vDist - 0.5) / 0.5, 2.0) * 0.35;

          lowPosArr[i3] = cx;
          lowPosArr[i3 + 1] = cy + Math.sin(u * Math.PI) * 0.16;
          lowPosArr[i3 + 2] = -0.9 + lowerFold + lowHem;
          idx++;
        }
      }
      lowerGeo.attributes.position.needsUpdate = true;
      lowerGeo.computeVertexNormals();
    };

    // Render loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isPageVisible) return;

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      accumulatedTime += delta;
      const time = accumulatedTime;

      // Smooth mouse parallax (restrained)
      mouseX += (targetMouseX - mouseX) * 0.035;
      mouseY += (targetMouseY - mouseY) * 0.035;

      camera.position.x = mouseX * 0.22;
      camera.position.y = -mouseY * 0.15;
      camera.lookAt(0, 0, 0);

      if (!prefersReducedMotion) {
        updateFabricFolds(time);
      }

      renderer.render(scene, camera);
    };

    updateFabricFolds(0.1);
    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }

      leftGeo.dispose();
      leftMat.dispose();
      rightGeo.dispose();
      rightMat.dispose();
      lowerGeo.dispose();
      lowerMat.dispose();
      heroTexture.dispose();
      wovenTexture.dispose();
      satinTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-10"
      style={{
        contain: 'strict',
      }}
    />
  );
};
