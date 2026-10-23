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
 * Samples UV range [0, 0.40]: solid on the outer drape, smoothly easing into ivory background.
 * Note: Three.js alphaMap samples the green (.g) channel.
 */
function createLeftFabricAlphaMap(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const imgData = ctx.createImageData(size, size);
    const uFadeStart = 0.26;
    const uMax = 0.40;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const u = x / (size - 1);
        let uAlpha = 1.0;

        if (u > uMax) {
          uAlpha = 0.0;
        } else if (u > uFadeStart) {
          const t = (u - uFadeStart) / (uMax - uFadeStart);
          uAlpha = 0.5 * (1 + Math.cos(t * Math.PI));
        }

        const alphaVal = Math.round(255 * uAlpha);
        const idx = (y * size + x) * 4;
        imgData.data[idx] = alphaVal;
        imgData.data[idx + 1] = alphaVal;
        imgData.data[idx + 2] = alphaVal;
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
 * Samples UV range [0.55, 1.0]: softly easing in from center (0.55 to 0.65),
 * fully solid (0.65 to 1.0) through the right edge.
 */
function createRightFabricAlphaMap(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const imgData = ctx.createImageData(size, size);
    const uMin = 0.55;
    const uFadeEnd = 0.65;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const u = x / (size - 1);
        let uAlpha = 1.0;

        if (u < uMin) {
          uAlpha = 0.0;
        } else if (u < uFadeEnd) {
          const t = (u - uMin) / (uFadeEnd - uMin);
          uAlpha = 0.5 * (1 - Math.cos(t * Math.PI));
        }

        const alphaVal = Math.round(255 * uAlpha);
        const idx = (y * size + x) * 4;
        imgData.data[idx] = alphaVal;
        imgData.data[idx + 1] = alphaVal;
        imgData.data[idx + 2] = alphaVal;
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

    // 2. Studio Lighting: Luxury Luminous Ambient & Balanced Highlights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xf6f0e4, 1.25);
    scene.add(hemiLight);

    const rightStudioLight = new THREE.DirectionalLight(0xfffaec, 0.85);
    rightStudioLight.position.set(4.5, 5.0, 4.0);
    scene.add(rightStudioLight);

    const leftStudioLight = new THREE.DirectionalLight(0xfef9f2, 0.85);
    leftStudioLight.position.set(-4.5, 5.0, 4.0);
    scene.add(leftStudioLight);

    const rimLight = new THREE.DirectionalLight(0xfff6e8, 0.40);
    rimLight.position.set(0.0, 4.0, -2.5);
    scene.add(rimLight);

    const lowerFill = new THREE.DirectionalLight(0xfff9f2, 0.45);
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

    // -------------------------------------------------------------------------
    // 3. FABRIC 1 (LEFT SIDE): Soft Ivory Woven Raw Cotton / Silk Drape
    // Maps genuine ivory linen and crepe fabric folds (UV 0.0 to 0.40)
    // -------------------------------------------------------------------------
    const leftSegsU = 80;
    const leftSegsV = 100;
    const leftGeo = new THREE.PlaneGeometry(1, 1, leftSegsU, leftSegsV);
    const leftUV = leftGeo.attributes.uv;

    let leftIdx = 0;
    for (let iv = 0; iv <= leftSegsV; iv++) {
      const v = 1 - iv / leftSegsV;
      for (let iu = 0; iu <= leftSegsU; iu++) {
        const u = iu / leftSegsU;
        leftUV.setXY(leftIdx, u * 0.40, v);
        leftIdx++;
      }
    }
    leftUV.needsUpdate = true;

    const leftMat = new THREE.MeshPhysicalMaterial({
      map: heroTexture,
      alphaMap: leftAlpha,
      transparent: true,
      depthWrite: false,
      color: 0xffffff,
      roughness: 0.58, // Smooth matte tactile cotton/silk
      metalness: 0.0,
      clearcoat: 0.0,
      clearcoatRoughness: 0.0,
      sheen: 0.95,
      sheenColor: new THREE.Color(0xfffdf8),
      sheenRoughness: 0.72,
      bumpMap: wovenTexture,
      bumpScale: 0.035,
      side: THREE.DoubleSide,
    });

    const leftMesh = new THREE.Mesh(leftGeo, leftMat);
    scene.add(leftMesh);

    // -------------------------------------------------------------------------
    // 4. FABRIC 2 (RIGHT SIDE): Champagne Liquid Silk Cascade
    // Maps genuine champagne liquid silk satin cascade (UV 0.55 to 1.0)
    // Extends from headline frame to the right screen border
    // -------------------------------------------------------------------------
    const rightSegsU = 80;
    const rightSegsV = 100;
    const rightGeo = new THREE.PlaneGeometry(1, 1, rightSegsU, rightSegsV);
    const rightUV = rightGeo.attributes.uv;

    let rightIdx = 0;
    for (let iv = 0; iv <= rightSegsV; iv++) {
      const v = 1 - iv / rightSegsV;
      for (let iu = 0; iu <= rightSegsU; iu++) {
        const u = iu / rightSegsU;
        rightUV.setXY(rightIdx, 0.55 + u * 0.45, v);
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
      roughness: 0.55, // Smooth natural luster without plastic shine
      metalness: 0.0,
      clearcoat: 0.0,
      clearcoatRoughness: 0.0,
      sheen: 0.95, // Soft authentic textile sheen
      sheenColor: new THREE.Color(0xfffdf8),
      sheenRoughness: 0.70,
      bumpMap: wovenTexture,
      bumpScale: 0.030,
      side: THREE.DoubleSide,
    });

    const rightMesh = new THREE.Mesh(rightGeo, rightMat);
    scene.add(rightMesh);

    // -------------------------------------------------------------------------
    // 5. REAL-TIME TRAVELING WAVE & VIEWPORT ANCHORED ALIGNMENT
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

    // Dynamic wave deformation
    const updateFabricFolds = (time: number) => {
      const vFOV = THREE.MathUtils.degToRad(camera.fov);
      const visH = 2 * Math.tan(vFOV / 2) * camera.position.z;
      const visW = visH * camera.aspect;
      const halfW = visW / 2;

      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const edgeSpread = isMobile ? 1.55 : isTablet ? 1.3 : 1.0;

      const outerBuffer = 0.50;

      const leftPointerDist = Math.hypot(mouseX - (-0.6), mouseY - 0.1);
      const leftRipple = Math.exp(-leftPointerDist * 2.2) * Math.sin(time * 3.0) * 0.08;

      const rightPointerDist = Math.hypot(mouseX - 0.6, mouseY - 0.1);
      const rightRipple = Math.exp(-rightPointerDist * 2.2) * Math.sin(time * 3.0 + 1.5) * 0.08;

      // --- FABRIC 1 (LEFT SIDE): Soft Ivory Woven Drape ---
      const lPosArr = leftGeo.attributes.position.array as Float32Array;
      const leftDepthScale = 1.0 + 0.12 * Math.sin(time * 0.18);
      const leftOuterX = Math.min(-4.6 - 1.7 * edgeSpread, -halfW - outerBuffer);

      let idx = 0;
      for (let iv = 0; iv <= leftSegsV; iv++) {
        const v = 1 - iv / leftSegsV; // 1 at top, 0 at bottom
        const cy = (v - 0.5) * 8.6;

        const origCx = (-4.6 + 1.2 * Math.sin(v * Math.PI * 1.1) - 0.8 * (1 - v)) * edgeSpread;
        const origRibWidth = 3.4 + 0.8 * (1 - v);
        const x_inner = origCx + 0.5 * origRibWidth;

        for (let iu = 0; iu <= leftSegsU; iu++) {
          const u = iu / leftSegsU; // 0 (outer left screen edge) to 1 (inner crest)
          const i3 = idx * 3;

          const sContour = Math.sin(v * Math.PI * 1.2) * 0.25 * u;
          const lateralSway = Math.sin(v * 2.2 + time * 0.24) * 0.08;

          const diagPhase = v * 2.8 + u * 1.8 - time * 0.38;
          const fold1 = (Math.sin(diagPhase * 1.5) + 0.28 * Math.sin(diagPhase * 3.0)) * (0.7 + 0.22 * (1 - v));
          const fold2 = Math.cos(v * 4.6 - u * 2.4 - time * 0.26) * 0.25;
          const fold3 = Math.sin(u * 9.0 + v * 6.0 + time * 0.42) * 0.06;

          const innerDist = Math.max(0, (u - 0.65) / 0.35);
          const edgeHem = -Math.pow(innerDist, 2.0) * 0.45;

          const x = leftOuterX + u * (x_inner - leftOuterX) + sContour + lateralSway;

          lPosArr[i3] = x;
          lPosArr[i3 + 1] = cy + Math.cos(u * Math.PI) * 0.12;
          lPosArr[i3 + 2] = (fold1 + fold2 + fold3) * leftDepthScale + edgeHem + 0.28 + leftRipple * u;
          idx++;
        }
      }
      leftGeo.attributes.position.needsUpdate = true;
      leftGeo.computeVertexNormals();

      // --- FABRIC 2 (RIGHT SIDE): Champagne Silk / Soft Drape ---
      const rPosArr = rightGeo.attributes.position.array as Float32Array;
      const rightDepthScale = 1.0 + 0.14 * Math.cos(time * 0.22);
      const rightOuterX = Math.max(4.5 + 2.0 * edgeSpread, halfW + outerBuffer);

      idx = 0;
      for (let iv = 0; iv <= rightSegsV; iv++) {
        const v = 1 - iv / rightSegsV; // 1 at top, 0 at bottom
        const cy = (v - 0.5) * 8.8;

        const origCx = (4.0 - 1.1 * Math.sin(v * Math.PI * 0.95) + 0.75 * Math.pow(1 - v, 1.4)) * edgeSpread;
        const origRibWidth = 3.6 + 0.6 * v;
        const x_inner = origCx - 0.5 * origRibWidth;

        for (let iu = 0; iu <= rightSegsU; iu++) {
          const u = iu / rightSegsU; // 0 (inner crest) to 1 (outer right screen edge)
          const i3 = idx * 3;

          const sweepContour = -Math.sin(v * Math.PI * 1.1) * 0.22 * (1 - u);
          const silkSway = -Math.sin(v * 2.2 + time * 0.22) * 0.08;

          const silkPhase = v * 2.8 - (1 - u) * 2.2 + time * 0.34;
          const silkFold1 = (Math.sin(silkPhase * 1.7) + 0.25 * Math.sin(silkPhase * 3.4)) * (0.75 + 0.20 * (1 - v));
          const silkFold2 = Math.cos(v * 5.2 + (1 - u) * 2.4 - time * 0.22) * 0.26;
          const silkFold3 = Math.sin((1 - u) * 8.0 - v * 3.5 + time * 0.38) * 0.06;

          const innerDist = Math.max(0, (0.35 - u) / 0.35);
          const silkEdgeHem = -Math.pow(innerDist, 2.0) * 0.40;

          const x = x_inner + u * (rightOuterX - x_inner) + sweepContour + silkSway;

          rPosArr[i3] = x;
          rPosArr[i3 + 1] = cy + Math.cos(u * Math.PI) * 0.12;
          rPosArr[i3 + 2] = (silkFold1 + silkFold2 + silkFold3) * rightDepthScale + silkEdgeHem + 0.32 + rightRipple * (1 - u);
          idx++;
        }
      }
      rightGeo.attributes.position.needsUpdate = true;
      rightGeo.computeVertexNormals();
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

      mouseX += (targetMouseX - mouseX) * 0.035;
      mouseY += (targetMouseY - mouseY) * 0.035;

      camera.position.x = mouseX * 0.20;
      camera.position.y = -mouseY * 0.12;
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

      updateFabricFolds(accumulatedTime);
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
      heroTexture.dispose();
      wovenTexture.dispose();
      satinTexture.dispose();
      leftAlpha.dispose();
      rightAlpha.dispose();
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
