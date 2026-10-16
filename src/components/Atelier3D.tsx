import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const FALLBACK = '/assets/reach-us/hero-atelier-3d-hd.jpg';

const canvasTex = (w: number, h: number, draw: (c: CanvasRenderingContext2D) => void, repeat = false) => {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d')!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
};

const weave = (base: string, line: string) =>
  canvasTex(128, 128, (g) => {
    g.fillStyle = base; g.fillRect(0, 0, 128, 128);
    g.strokeStyle = line; g.globalAlpha = 0.22; g.lineWidth = 1;
    for (let i = 0; i < 128; i += 4) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 128); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(128, i); g.stroke(); }
  }, true);

const GOLD = 0xc49a55;

export const Atelier3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch { setFailed(true); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    const camBase = new THREE.Vector3(0, 3.4, 11.5);
    camera.position.copy(camBase);

    // Lighting: soft studio key + gold rim + ambient
    scene.add(new THREE.HemisphereLight(0xcfe6d8, 0x0a1a14, 0.55));
    const key = new THREE.SpotLight(0xffe2b0, 90, 40, 0.55, 0.6);
    key.position.set(-3, 9, 6); key.target.position.set(0, 1, 0);
    key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -0.0004;
    scene.add(key, key.target);
    const rim = new THREE.PointLight(GOLD, 25, 18); rim.position.set(5, 3, -2); scene.add(rim);

    const disposables: { dispose: () => void }[] = [];
    const mat = (p: THREE.MeshStandardMaterialParameters) => { const m = new THREE.MeshStandardMaterial(p); disposables.push(m); return m; };
    const add = (g: THREE.BufferGeometry, m: THREE.Material, parent: THREE.Object3D, x = 0, y = 0, z = 0) => {
      disposables.push(g);
      const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; parent.add(o); return o;
    };

    const stage = new THREE.Group(); scene.add(stage);
    const emerald = mat({ color: 0x0f2c22, roughness: 0.45, metalness: 0.5 });
    const gold = mat({ color: GOLD, roughness: 0.25, metalness: 1 });
    const black = mat({ color: 0x0b0b0b, roughness: 0.22, metalness: 0.75 });

    // Pedestal with gold rings and CF plaque
    add(new THREE.CylinderGeometry(4.6, 4.8, 0.7, 72), emerald, stage, 0, -0.35, 0);
    const ring = add(new THREE.TorusGeometry(4.62, 0.05, 12, 96), gold, stage, 0, 0.0, 0); ring.rotation.x = Math.PI / 2;
    const plaque = canvasTex(512, 128, (g) => {
      g.fillStyle = '#071B15'; g.fillRect(0, 0, 512, 128);
      g.fillStyle = '#C49A55'; g.font = 'bold 86px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('CF', 256, 68);
    });
    const plaqueMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.45), new THREE.MeshStandardMaterial({ map: plaque, metalness: 0.6, roughness: 0.35 }));
    plaqueMesh.position.set(0, -0.35, 4.83); plaqueMesh.rotation.x = -0.05; stage.add(plaqueMesh);
    disposables.push(plaqueMesh.geometry, plaqueMesh.material as THREE.Material, plaque);

    // Folded fabric stack (right) using weave textures
    const fabrics: [string, string, number, number][] = [
      ['#2c4a3a', '#cfe0d4', 0.0, 0.03], ['#5a4634', '#e8d7bf', 0.22, -0.05], ['#cdbfa6', '#8a7a5e', 0.44, 0.04], ['#ece3d1', '#9a8f78', 0.66, -0.02],
    ];
    fabrics.forEach(([base, line, y, rot]) => {
      const t = weave(base, line); t.repeat.set(3, 2); disposables.push(t);
      const m = add(new THREE.BoxGeometry(2.6, 0.2, 1.7, 1, 1, 1), mat({ map: t, roughness: 0.95 }), stage, 1.9, 0.12 + y, 0.9);
      m.rotation.y = rot; m.scale.set(1 - y * 0.05, 1, 1 - y * 0.04);
    });

    // Sewing machine (stylised procedural model, left-centre)
    const sm = new THREE.Group(); sm.position.set(-0.9, 0.08, -0.3); sm.rotation.y = 0.25; stage.add(sm);
    add(new THREE.BoxGeometry(3.0, 0.22, 1.2), black, sm, 0, 0.11, 0);
    add(new THREE.BoxGeometry(0.55, 1.5, 0.7), black, sm, 1.1, 0.95, 0);
    add(new THREE.BoxGeometry(2.7, 0.42, 0.7), black, sm, 0.1, 1.75, 0);
    add(new THREE.BoxGeometry(0.75, 0.9, 0.62), black, sm, -1.15, 1.35, 0);
    add(new THREE.CylinderGeometry(0.035, 0.035, 0.7, 12), gold, sm, -1.15, 0.75, 0.05);
    const wheel = add(new THREE.TorusGeometry(0.42, 0.06, 16, 40), gold, sm, 1.55, 1.75, 0.45); wheel.rotation.y = 0;
    add(new THREE.CylinderGeometry(0.3, 0.3, 0.08, 32), black, sm, 1.55, 1.75, 0.42).rotation.x = Math.PI / 2;
    add(new THREE.CylinderGeometry(0.05, 0.05, 0.4, 12), gold, sm, 0.4, 2.15, 0);
    add(new THREE.BoxGeometry(2.4, 0.04, 0.025), gold, sm, 0.1, 1.55, 0.36);

    // Thread spools (left front)
    const spool = (x: number, z: number, c: number) => {
      const g = new THREE.Group(); g.position.set(x, 0.5, z); stage.add(g);
      add(new THREE.CylinderGeometry(0.2, 0.2, 0.6, 24), mat({ color: c, roughness: 0.9 }), g);
      add(new THREE.CylinderGeometry(0.28, 0.28, 0.06, 24), mat({ color: 0xb98a52, roughness: 0.6 }), g, 0, 0.33, 0);
      add(new THREE.CylinderGeometry(0.28, 0.28, 0.06, 24), mat({ color: 0xb98a52, roughness: 0.6 }), g, 0, -0.33, 0);
      g.position.y = 0.4;
    };
    spool(-3.4, 1.4, 0x1f5a3e); spool(-2.8, 2.0, 0xe9dfc9);

    // Measuring tape coil
    const tapeTex = canvasTex(256, 32, (g) => {
      g.fillStyle = '#e0b83c'; g.fillRect(0, 0, 256, 32); g.fillStyle = '#222';
      for (let i = 0; i < 256; i += 8) g.fillRect(i, 0, 1, i % 32 === 0 ? 14 : 7);
    }, true);
    const tape = add(new THREE.CylinderGeometry(0.62, 0.62, 0.14, 48, 1, true), mat({ map: tapeTex, side: THREE.DoubleSide, roughness: 0.6 }), stage, -1.6, 0.17, 2.5);
    tape.rotation.y = 0.4;

    // Hanging dark tag with gold services (top-right), gentle sway
    const tagTex = canvasTex(256, 384, (g) => {
      g.fillStyle = '#0d1512'; g.fillRect(0, 0, 256, 384);
      g.strokeStyle = '#C49A55'; g.lineWidth = 4; g.strokeRect(10, 10, 236, 364);
      g.fillStyle = '#E6C995'; g.font = '600 20px Arial'; g.textAlign = 'left';
      ['PREMIUM FABRICS', 'QUALITY ACCESSORIES', 'WHOLESALE SUPPLY', 'CUSTOM SOLUTIONS'].forEach((t, i) => g.fillText(t, 26, 110 + i * 70));
    });
    const tag = new THREE.Group(); tag.position.set(4.6, 6.2, 0.5); scene.add(tag);
    const tagMesh = add(new THREE.BoxGeometry(1.8, 2.7, 0.06), mat({ map: tagTex, roughness: 0.4, metalness: 0.3 }), tag, 0, -1.6, 0);
    add(new THREE.CylinderGeometry(0.012, 0.012, 1.7, 6), gold, tag, 0, 0.1, 0).position.y = -0.1;
    disposables.push(tagTex);
    void tagMesh;

    // Resize + pointer + loop
    const resize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize); ro.observe(mount); resize();
    const ptr = new THREE.Vector2();
    const onMove = (e: PointerEvent) => {
      const r = mount.getBoundingClientRect();
      ptr.set(((e.clientX - r.left) / r.width - 0.5) * 2, ((e.clientY - r.top) / r.height - 0.5) * 2);
    };
    if (!reduce) window.addEventListener('pointermove', onMove);

    let raf = 0, visible = true; const clock = new THREE.Clock();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.05 }); io.observe(mount);
    const look = new THREE.Vector3(0, 1.5, 0);
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const t = clock.getElapsedTime();
      if (!reduce) {
        camera.position.x += (camBase.x + ptr.x * 1.1 - camera.position.x) * 0.05;
        camera.position.y += (camBase.y - ptr.y * 0.5 - camera.position.y) * 0.05;
        stage.rotation.y = Math.sin(t * 0.25) * 0.08;
        tag.rotation.z = Math.sin(t * 0.8) * 0.04;
        wheel.rotation.z = t * 0.3;
      }
      camera.lookAt(look);
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      window.removeEventListener('pointermove', onMove);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  if (failed) return <img src={FALLBACK} alt="Classic Fashions textile atelier" className="w-full h-full object-cover" />;
  return <div ref={mountRef} role="img" aria-label="Interactive 3D textile atelier with sewing machine, folded fabrics and thread spools" className="w-full h-full" />;
};

export default Atelier3D;
