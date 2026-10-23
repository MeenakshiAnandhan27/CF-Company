import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Procedural open-weave combed linen/cotton canvas bump texture
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

        // Micro-fiber weave highlight
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
    // Soft warm ambient base calibrated so unlit cloth seamlessly matches ivory background
    const hemiLight = new THREE.HemisphereLight(0xfffef9, 0xf6f0e6, 1.6);
    scene.add(hemiLight);

    // Warm Key Light highlighting silk sheen and woven crests
    const keyLight = new THREE.DirectionalLight(0xfffbee, 1.25);
    keyLight.position.set(4.5, 6.0, 5.5);
    scene.add(keyLight);

    // Left Studio Fill: Soft warm ivory
    const leftFillLight = new THREE.DirectionalLight(0xfef9f0, 0.95);
    leftFillLight.position.set(-5.5, 4.0, 5.0);
    scene.add(leftFillLight);

    // Subtle grazing rim light
    const rimLight = new THREE.DirectionalLight(0xfff6e8, 0.6);
    rimLight.position.set(-2.5, 4.5, -2.0);
    scene.add(rimLight);

    const wovenTexture = createWovenFabricTexture();
    const satinTexture = createSatinSilkTexture();

    // Responsive spread factor
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const edgeSpread = isMobile ? 1.5 : isTablet ? 1.25 : 1.0;

    // -------------------------------------------------------------------------
    // 3. LEFT FABRIC: Natural Combed Linen/Cotton Drapes (Warm Ivory Weave)
    // -------------------------------------------------------------------------
    const leftWidth = 4.4;
    const leftHeight = 8.8;
    const leftSegsX = 96;
    const leftSegsY = 96;
    const leftGeo = new THREE.PlaneGeometry(leftWidth, leftHeight, leftSegsX, leftSegsY);

    const leftPos = leftGeo.attributes.position;
    const leftCount = leftPos.count;
    const leftBaseX = new Float32Array(leftCount);
    const leftBaseY = new Float32Array(leftCount);
    const leftBaseZ = new Float32Array(leftCount);

    for (let i = 0; i < leftCount; i++) {
      const i3 = i * 3;
      leftBaseX[i] = leftPos.array[i3];
      leftBaseY[i] = leftPos.array[i3 + 1];
      leftBaseZ[i] = leftPos.array[i3 + 2];
    }

    const leftMat = new THREE.MeshPhysicalMaterial({
      color: 0xfffaf3, // Luminous warm ivory/cream
      roughness: 0.44, // Tactile combed organic linen weave
      metalness: 0.01,
      sheen: 1.0,
      sheenColor: new THREE.Color(0xfffcf5),
      sheenRoughness: 0.3,
      bumpMap: wovenTexture,
      bumpScale: 0.055,
      side: THREE.DoubleSide,
    });

    const leftMesh = new THREE.Mesh(leftGeo, leftMat);
    leftMesh.position.set(-4.6 * edgeSpread, 0.1, 0.2);
    leftMesh.rotation.set(-0.06, 0.28, -0.06);
    scene.add(leftMesh);

    // -------------------------------------------------------------------------
    // 4. RIGHT FABRIC: Flowing Champagne Silk / Satin Cascades
    // -------------------------------------------------------------------------
    const rightWidth = 4.4;
    const rightHeight = 9.0;
    const rightSegsX = 96;
    const rightSegsY = 96;
    const rightGeo = new THREE.PlaneGeometry(rightWidth, rightHeight, rightSegsX, rightSegsY);

    const rightPos = rightGeo.attributes.position;
    const rightCount = rightPos.count;
    const rightBaseX = new Float32Array(rightCount);
    const rightBaseY = new Float32Array(rightCount);
    const rightBaseZ = new Float32Array(rightCount);

    for (let i = 0; i < rightCount; i++) {
      const i3 = i * 3;
      rightBaseX[i] = rightPos.array[i3];
      rightBaseY[i] = rightPos.array[i3 + 1];
      rightBaseZ[i] = rightPos.array[i3 + 2];
    }

    const rightMat = new THREE.MeshPhysicalMaterial({
      color: 0xfcf6ed, // Pale champagne-cream silk
      roughness: 0.22, // Liquid silk luster
      metalness: 0.03,
      clearcoat: 0.42,
      clearcoatRoughness: 0.18,
      sheen: 1.0,
      sheenColor: new THREE.Color(0xfffbee),
      sheenRoughness: 0.18,
      bumpMap: satinTexture,
      bumpScale: 0.016,
      side: THREE.DoubleSide,
    });

    const rightMesh = new THREE.Mesh(rightGeo, rightMat);
    rightMesh.position.set(4.7 * edgeSpread, -0.05, 0.25);
    rightMesh.rotation.set(-0.05, -0.28, 0.05);
    scene.add(rightMesh);

    // -------------------------------------------------------------------------
    // 5. FLOATING SATIN PEARLS & DELICATE GOLD ACCENTS
    // -------------------------------------------------------------------------
    const pearlMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.26,
      metalness: 0.02,
      clearcoat: 0.3,
      clearcoatRoughness: 0.25,
      sheen: 0.8,
      sheenColor: new THREE.Color(0xfffdf6),
    });

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.2,
      metalness: 0.92,
    });

    interface FloatingItem {
      mesh: THREE.Mesh;
      baseX: number;
      baseY: number;
      baseZ: number;
      freq: number;
      phase: number;
      amp: number;
    }

    const floatingItems: FloatingItem[] = [];

    const addSphere = (
      radius: number,
      pos: [number, number, number],
      mat: THREE.Material,
      amp = 0.04,
      freq = 0.75
    ) => {
      const geo = new THREE.SphereGeometry(radius, 40, 40);
      const mesh = new THREE.Mesh(geo, mat);
      const px = pos[0] * edgeSpread;
      mesh.position.set(px, pos[1], pos[2]);
      scene.add(mesh);

      floatingItems.push({
        mesh,
        baseX: px,
        baseY: pos[1],
        baseZ: pos[2],
        freq,
        phase: Math.random() * Math.PI * 2,
        amp,
      });
      return mesh;
    };

    // Satin pearls and gold beads matching reference layout
    addSphere(0.70, [-3.4, -1.8, 2.2], pearlMat, 0.035, 0.65); // Large foreground pearl (sitting in front of cloth)
    addSphere(0.36, [-3.0, 2.2, 1.2], pearlMat, 0.045, 0.8);   // Upper-left pearl
    addSphere(0.16, [3.6, 2.7, 0.5], pearlMat, 0.04, 0.75);    // Tiny pearl (top-right)
    addSphere(0.11, [3.1, 2.0, 0.6], goldMat, 0.03, 1.1);      // Gold bead (top-right)
    addSphere(0.08, [-2.3, 1.5, 0.6], goldMat, 0.03, 1.0);     // Gold bead on upper arc
    addSphere(0.08, [1.7, -1.9, 0.5], goldMat, 0.025, 0.95);   // Gold bead on lower arc

    // -------------------------------------------------------------------------
    // 6. FINE GOLD DECORATIVE 3D WIRE ARCS
    // -------------------------------------------------------------------------
    const upperCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-4.8 * edgeSpread, 1.6, -0.2),
      new THREE.Vector3(-2.6, 3.3, 0.2),
      new THREE.Vector3(0.5, 3.0, 0.2),
      new THREE.Vector3(3.8 * edgeSpread, 2.1, -0.2)
    );
    const upperArcGeo = new THREE.TubeGeometry(upperCurve, 72, 0.011, 10, false);
    const upperArcMesh = new THREE.Mesh(upperArcGeo, goldMat);
    scene.add(upperArcMesh);

    const lowerCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-3.2 * edgeSpread, -2.5, 0.3),
      new THREE.Vector3(-1.3, -1.8, 0.4),
      new THREE.Vector3(1.3, -1.8, 0.4),
      new THREE.Vector3(3.2 * edgeSpread, -2.5, 0.3)
    );
    const lowerArcGeo = new THREE.TubeGeometry(lowerCurve, 72, 0.011, 10, false);
    const lowerArcMesh = new THREE.Mesh(lowerArcGeo, goldMat);
    scene.add(lowerArcMesh);

    // -------------------------------------------------------------------------
    // 7. REAL-TIME ORGANIC FABRIC FOLDS DEFORMATION
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
    let clock = new THREE.Clock();
    let isPageVisible = true;

    const handleVisibilityChange = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible) clock.start();
      else clock.stop();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Advanced Trochoid / Gerstner-like Cloth Fold Dynamics
    const updateFabricFolds = (time: number) => {
      // --- LEFT CLOTH: Natural Organic Linen Drapes ---
      const lPosArr = leftGeo.attributes.position.array as Float32Array;

      for (let i = 0; i < leftCount; i++) {
        const i3 = i * 3;
        const bx = leftBaseX[i];
        const by = leftBaseY[i];

        // u: 0 (outer left) to 1 (inner center edge); v: 0 (bottom) to 1 (top)
        const u = (bx + leftWidth * 0.5) / leftWidth;
        const v = (by + leftHeight * 0.5) / leftHeight;

        // Diagonal catenary drape wave with organic harmonics
        const phase1 = v * 2.8 + u * 2.2 + time * 0.4;
        const fold1 = (Math.sin(phase1 * 1.6) + 0.35 * Math.sin(phase1 * 3.2)) * (1.1 + 0.3 * (1 - v));

        // Cross-tension draping folds
        const fold2 = Math.cos(v * 5.4 - u * 3.0 - time * 0.22) * 0.4;

        // Subtle textile weave ripples
        const fold3 = Math.sin(u * 8.5 + v * 7.0 + time * 0.48) * 0.12;

        // Inner rolled hem: curl backwards smoothly into Z depth and tuck inward in X
        const edgeFactor = Math.max(0, (u - 0.72) / 0.28);
        const edgeCurve = Math.sin(edgeFactor * Math.PI);
        const edgeCurl = Math.pow(edgeFactor, 1.8);
        const xTuck = -edgeCurl * 0.5;
        const zTuck = -edgeCurve * 0.95 - edgeCurl * 0.85;

        // Broad billow along the drape center
        const billow = Math.sin(u * Math.PI * 0.85) * Math.cos(v * 2.4) * 0.45;

        lPosArr[i3 + 2] = fold1 + fold2 + fold3 + billow + zTuck;

        // Organic silhouette contouring: curve the inner edge naturally like gathered fabric
        const silhouetteCurve = Math.sin(v * Math.PI * 1.2 + 0.2) * 0.32 * u;
        const lateralSway = Math.sin(v * 2.5 + time * 0.26) * 0.12;
        lPosArr[i3] = bx + silhouetteCurve + lateralSway + xTuck;
      }
      leftGeo.attributes.position.needsUpdate = true;
      leftGeo.computeVertexNormals();

      // --- RIGHT CLOTH: Liquid Silk Cascades ---
      const rPosArr = rightGeo.attributes.position.array as Float32Array;

      for (let i = 0; i < rightCount; i++) {
        const i3 = i * 3;
        const bx = rightBaseX[i];
        const by = rightBaseY[i];

        // u: 0 (inner center edge) to 1 (outer right); v: 0 (bottom) to 1 (top)
        const u = (bx + rightWidth * 0.5) / rightWidth;
        const v = (by + rightHeight * 0.5) / rightHeight;

        // Liquid silk sweeping cascades
        const silkPhase = v * 2.6 - (1 - u) * 2.0 + time * 0.36 + 1.2;
        const silkFold1 = (Math.sin(silkPhase * 1.8) + 0.3 * Math.cos(silkPhase * 3.4)) * (1.2 + 0.28 * (1 - v));

        // Secondary liquid waves
        const silkFold2 = Math.cos(v * 5.2 + (1 - u) * 2.5 - time * 0.2 + 0.7) * 0.42;

        // Micro-flutter
        const silkFold3 = Math.sin((1 - u) * 7.5 - v * 3.8 + time * 0.42) * 0.1;

        // Inner rolled hem: curl backwards into Z depth and tuck outward in X
        const silkEdgeFactor = Math.max(0, (0.28 - u) / 0.28);
        const silkEdgeCurve = Math.sin(silkEdgeFactor * Math.PI);
        const silkEdgeCurl = Math.pow(silkEdgeFactor, 1.8);
        const silkXTuck = silkEdgeCurl * 0.5;
        const silkZTuck = -silkEdgeCurve * 0.95 - silkEdgeCurl * 0.85;

        // Silk cascade billow
        const silkBillow = Math.sin((1 - u) * Math.PI * 0.85) * Math.sin(v * 2.2) * 0.5;

        rPosArr[i3 + 2] = silkFold1 + silkFold2 + silkFold3 + silkBillow + silkZTuck;

        // Organic silhouette contouring
        const rSilhouette = -Math.sin(v * Math.PI * 1.1) * 0.32 * (1 - u);
        const rSway = -Math.sin(v * 2.2 + time * 0.24) * 0.12;
        rPosArr[i3] = bx + rSilhouette + rSway + silkXTuck;
      }
      rightGeo.attributes.position.needsUpdate = true;
      rightGeo.computeVertexNormals();
    };

    // Render loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isPageVisible) return;

      const time = clock.getElapsedTime();

      // Smooth mouse parallax
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      camera.position.x = mouseX * 0.3;
      camera.position.y = -mouseY * 0.2;
      camera.lookAt(0, 0, 0);

      if (!prefersReducedMotion) {
        updateFabricFolds(time);

        // Floating pearls gentle bobbing
        for (const item of floatingItems) {
          item.mesh.position.y = item.baseY + Math.sin(time * item.freq + item.phase) * item.amp;
          item.mesh.position.x = item.baseX + Math.cos(time * item.freq * 0.5 + item.phase) * (item.amp * 0.35);
        }

        // Subtle gold arc breathing
        upperArcMesh.rotation.z = Math.sin(time * 0.2) * 0.012;
        lowerArcMesh.rotation.z = Math.cos(time * 0.18) * 0.01;
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

      const newMobile = width < 768;
      const newTablet = width >= 768 && width < 1024;
      const newSpread = newMobile ? 1.5 : newTablet ? 1.25 : 1.0;

      leftMesh.position.x = -4.5 * newSpread;
      rightMesh.position.x = 4.6 * newSpread;

      for (const item of floatingItems) {
        item.mesh.position.x = (item.baseX / edgeSpread) * newSpread;
      }
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
      pearlMat.dispose();
      goldMat.dispose();
      upperArcGeo.dispose();
      lowerArcGeo.dispose();
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
