import * as THREE from 'three';
import { Catalogue3DItem } from '../../data/catalogue3DData.ts';

/**
 * Creates 3D cloth surface geometry with natural asymmetric folds
 */
export function createClothGeometry(
  mode: 'drape' | 'curved-swatch' | 'inspection-bed',
  stiffness: number = 0.4
): THREE.PlaneGeometry {
  const width = 3.2;
  const height = 2.5;
  const segW = 120;
  const segH = 120;

  const geometry = new THREE.PlaneGeometry(width, height, segW, segH);
  const pos = geometry.attributes.position;
  const count = pos.count;

  if (mode === 'drape') {
    // Natural cascading cloth with gravity sag, asymmetric S-pleats, and catenary drape
    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      // Normalized coordinates [0, 1]
      const u = (x + width / 2) / width;
      const v = (y + height / 2) / height;

      // Vertical suspension fall-off (pinned near top y ~ 1.25)
      const hangProgress = (1.25 - y) / height;
      const flex = Math.pow(Math.max(0, hangProgress), 1.25) * (1.1 - stiffness * 0.4);

      // Asymmetric longitudinal folds (S-pleats)
      const primaryFold = Math.sin(u * Math.PI * 4.2 + 0.3) * 0.28 * flex;
      const secondaryFold = Math.sin(u * Math.PI * 8.5 - 0.4) * 0.12 * flex;
      const microRipples = Math.cos(u * Math.PI * 16.0 + v * 3.0) * 0.03 * flex;

      // Catenary forward drape sag
      const catenarySag = Math.sin(v * Math.PI) * 0.35 * flex;

      // Bottom hem organic wave
      const bottomHemWave = Math.sin(u * Math.PI * 6.0) * 0.08 * Math.pow(1 - v, 2.0);

      const z = primaryFold + secondaryFold + microRipples + catenarySag + bottomHemWave;

      // Subtle asymmetric lateral tuck
      const newX = x + Math.sin(v * Math.PI * 2.0) * 0.04 * flex;
      const newY = y - Math.pow(1 - v, 1.5) * 0.08 * (1 - stiffness * 0.5);

      pos.setXYZ(i, newX, newY, z);
    }
  } else if (mode === 'curved-swatch') {
    // Elegant cylindrical swatch roll showcasing front face rolling backward
    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const u = (x + width / 2) / width;
      const v = (y + height / 2) / height;

      const curve = Math.cos(u * Math.PI * 1.8 - 0.2) * 0.38;
      const rollBack = Math.sin(v * Math.PI) * 0.2;
      const edgeTurn = Math.pow(u, 3) * 0.15;

      pos.setXYZ(i, x, y, curve + rollBack + edgeTurn);
    }
  } else {
    // Flat inspection bed with subtle corner lift and yarn relief
    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const u = (x + width / 2) / width;
      const v = (y + height / 2) / height;

      // Micro yarn relief
      const yarnRelief = Math.sin(u * 80) * Math.cos(v * 80) * 0.003;
      // Gentle corner curl
      const cornerLift =
        Math.pow(Math.max(0, u - 0.75), 2) * 0.08 +
        Math.pow(Math.max(0, 0.25 - u), 2) * 0.05 +
        Math.pow(Math.max(0, 0.2 - v), 2) * 0.06;

      pos.setXYZ(i, x, y, yarnRelief + cornerLift);
    }
  }

  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Creates true 3D Button assembly with beveled rim, dished face, reverse contour,
 * and stitch holes or rear shank loop.
 */
export function createButton3DGroup(
  item: Catalogue3DItem,
  texture: THREE.Texture
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'ButtonRootGroup';

  const buttonType = item.buttonType || 'plastic';
  const radius = 1.35;
  const thickness = 0.28;
  const dishRadius = 1.05;
  const dishDepth = 0.08;

  // Configure PBR materials according to button type
  const baseColor =
    buttonType === 'wood'
      ? 0xd4a373
      : buttonType === 'metal'
      ? 0xd4af37
      : buttonType === 'snap'
      ? 0xdcdde1
      : buttonType === 'pearl' || buttonType === 'shell'
      ? 0xfcfbfa
      : buttonType === 'glass'
      ? 0xffffff
      : 0x2c3e50;

  // Front Face Material with the real reference texture mapped
  const frontMat = new THREE.MeshPhysicalMaterial({
    map: texture,
    roughness: item.roughness ?? 0.3,
    metalness: item.metalness ?? 0.0,
    clearcoat: item.clearcoat ?? (buttonType === 'glass' ? 1.0 : buttonType === 'metal' ? 0.3 : 0.4),
    clearcoatRoughness: item.clearcoatRoughness ?? 0.1,
    sheen: item.sheen ?? (buttonType === 'pearl' || buttonType === 'shell' ? 0.8 : 0.1),
    sheenColor: new THREE.Color(item.sheenColor || '#FFFFFF'),
    transmission: item.transmission ?? (buttonType === 'glass' ? 0.75 : 0.0),
    ior: buttonType === 'glass' ? 1.52 : 1.45,
    thickness: 0.5,
    reflectivity: buttonType === 'metal' ? 0.95 : 0.5,
    side: THREE.DoubleSide,
  });

  // Rim and Back Material (calibrated metallic / wood / shell / resin body)
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: baseColor,
    roughness: item.roughness ?? 0.35,
    metalness: item.metalness ?? 0.0,
    clearcoat: item.clearcoat ?? 0.3,
    clearcoatRoughness: item.clearcoatRoughness ?? 0.15,
    sheen: item.sheen ?? 0.2,
    sheenColor: new THREE.Color(item.sheenColor || '#FFFFFF'),
    side: THREE.DoubleSide,
  });

  // Dark inner cavity material for stitch holes
  const holeMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.9,
    metalness: 0.1,
  });

  if (buttonType === 'snap') {
    // --- SNAP BUTTON FASTENER PROFILE ---
    // Outer beveled ring wall
    const outerRingGeo = new THREE.CylinderGeometry(radius, radius * 0.96, thickness, 48, 1, true);
    const outerRing = new THREE.Mesh(outerRingGeo, bodyMat);
    group.add(outerRing);

    // Front face with authentic photographic texture
    const snapFaceGeo = new THREE.CircleGeometry(radius * 0.96, 64);
    snapFaceGeo.rotateX(-Math.PI / 2);
    snapFaceGeo.translate(0, thickness / 2 + 0.003, 0);
    const snapFace = new THREE.Mesh(snapFaceGeo, frontMat);
    group.add(snapFace);

    // Reverse rear plate
    const backGeo = new THREE.CircleGeometry(radius * 0.94, 64);
    backGeo.rotateX(Math.PI / 2);
    backGeo.translate(0, -thickness / 2, 0);
    const backFace = new THREE.Mesh(backGeo, bodyMat);
    group.add(backFace);

  } else if (item.shank || buttonType === 'metal') {
    // --- SHANK / BLAZER BUTTON PROFILE ---
    // Domed front face with planar UV mapping for undistorted crest texture
    const faceGeo = new THREE.CircleGeometry(radius * 0.96, 64);
    const pos = faceGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const dist = Math.sqrt(x * x + y * y);
      const domeCurve = Math.cos(Math.min(1, dist / radius) * (Math.PI / 2)) * 0.22;
      pos.setZ(i, domeCurve);
    }
    faceGeo.computeVertexNormals();
    faceGeo.rotateX(-Math.PI / 2);
    faceGeo.translate(0, thickness * 0.35, 0);
    const frontFace = new THREE.Mesh(faceGeo, frontMat);
    group.add(frontFace);

    // Knurled perimeter rim
    const rimGeo = new THREE.TorusGeometry(radius * 0.88, thickness * 0.35, 16, 48);
    rimGeo.rotateX(Math.PI / 2);
    rimGeo.translate(0, thickness * 0.25, 0);
    const rim = new THREE.Mesh(rimGeo, bodyMat);
    group.add(rim);

    // Tapered back cone
    const backConeGeo = new THREE.ConeGeometry(radius * 0.85, thickness * 1.5, 36);
    backConeGeo.rotateX(Math.PI);
    backConeGeo.translate(0, -thickness * 0.6, 0);
    const backCone = new THREE.Mesh(backConeGeo, bodyMat);
    group.add(backCone);

    // Metal shank loop underneath for thread attachment
    const shankLoopGeo = new THREE.TorusGeometry(0.25, 0.06, 16, 32);
    shankLoopGeo.translate(0, -thickness * 1.45, 0);
    const shankLoop = new THREE.Mesh(shankLoopGeo, bodyMat);
    group.add(shankLoop);

    // Shank through-hole
    const shankHoleGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.3, 16);
    shankHoleGeo.rotateZ(Math.PI / 2);
    shankHoleGeo.translate(0, -thickness * 1.45, 0);
    const shankHole = new THREE.Mesh(shankHoleGeo, holeMat);
    group.add(shankHole);

  } else {
    // --- STANDARD 4-HOLE / 2-HOLE DISHED BUTTON PROFILE ---
    // (Wood, Pearl, Shell, Plastic, Glass)
    
    // Outer beveled ring / rim
    const rimTorusGeo = new THREE.TorusGeometry(radius * 0.92, thickness * 0.28, 16, 64);
    rimTorusGeo.rotateX(Math.PI / 2);
    rimTorusGeo.translate(0, thickness / 2, 0);
    const rimTorus = new THREE.Mesh(rimTorusGeo, bodyMat);
    group.add(rimTorus);

    // Main button cylindrical body wall
    const bodyCylinderGeo = new THREE.CylinderGeometry(radius, radius * 0.94, thickness, 64, 1, true);
    const bodyCylinder = new THREE.Mesh(bodyCylinderGeo, bodyMat);
    group.add(bodyCylinder);

    // Front dish face with subtle concave dish and planar UV texture
    const faceGeo = new THREE.CircleGeometry(radius * 0.96, 64);
    const pos = faceGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const dist = Math.sqrt(x * x + y * y);
      const dish = Math.sin(Math.min(1, dist / radius) * Math.PI) * 0.04;
      pos.setZ(i, dish);
    }
    faceGeo.computeVertexNormals();
    faceGeo.rotateX(-Math.PI / 2);
    faceGeo.translate(0, thickness / 2 + 0.003, 0);
    const frontFace = new THREE.Mesh(faceGeo, frontMat);
    group.add(frontFace);

    // Reverse rear dish / flat back
    const backGeo = new THREE.CircleGeometry(radius * 0.94, 64);
    backGeo.rotateX(Math.PI / 2);
    backGeo.translate(0, -thickness / 2, 0);
    const backFace = new THREE.Mesh(backGeo, bodyMat);
    group.add(backFace);
  }

  // Orient the button vertically facing camera by default (X tilt 90 deg so front face looks at +Z)
  group.rotation.x = Math.PI / 2;
  return group;
}

/**
 * Creates 3D Accessory presentation geometry (ribbon/lace band, zipper strip, or drawcord tipping)
 */
export function createAccessory3DGroup(
  item: Catalogue3DItem,
  texture: THREE.Texture
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'AccessoryRootGroup';

  const type = item.accessoryType || 'lace';

  if (type === 'tipping') {
    // --- 3D DRAWCORD TIPPING / AGLET PRESENTATION ---
    const cordLength = 3.6;
    const cordRadius = 0.22;
    const agletLength = 1.35;
    const agletRadius = 0.25;

    // Braided cord segment
    const cordGeo = new THREE.CylinderGeometry(cordRadius, cordRadius, cordLength, 32);
    cordGeo.rotateZ(Math.PI / 2);
    cordGeo.translate(-agletLength * 0.8, 0, 0);

    const cordMat = new THREE.MeshStandardMaterial({
      color: 0x22252a,
      roughness: 0.85,
      metalness: 0.05,
    });
    const cord = new THREE.Mesh(cordGeo, cordMat);
    group.add(cord);

    // Aglet metal or silicone tipping sleeve
    const agletGeo = new THREE.CylinderGeometry(agletRadius, agletRadius * 0.92, agletLength, 48);
    agletGeo.rotateZ(Math.PI / 2);
    agletGeo.translate(cordLength * 0.28, 0, 0);

    const agletMat = new THREE.MeshPhysicalMaterial({
      map: texture,
      color: item.metalness > 0.5 ? 0xddc088 : 0x202020,
      roughness: item.roughness ?? 0.25,
      metalness: item.metalness ?? 0.9,
      clearcoat: item.clearcoat ?? 0.5,
      clearcoatRoughness: 0.1,
    });
    const aglet = new THREE.Mesh(agletGeo, agletMat);
    group.add(aglet);

    // Decorative crimp ring bands
    [-0.3, 0.0, 0.3].forEach((offset) => {
      const ringGeo = new THREE.TorusGeometry(agletRadius + 0.015, 0.02, 16, 32);
      ringGeo.rotateY(Math.PI / 2);
      ringGeo.translate(cordLength * 0.28 + offset, 0, 0);
      const ring = new THREE.Mesh(ringGeo, agletMat);
      group.add(ring);
    });

  } else if (type === 'zipper') {
    // --- 3D ZIPPER TAPE & TRACK STRIP ---
    const tapeWidth = 3.6;
    const tapeHeight = 1.25;
    const tapeGeo = new THREE.PlaneGeometry(tapeWidth, tapeHeight, 64, 24);

    // Subtle gentle arc so the tape looks like an authentic textile ribbon
    const pos = tapeGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const arch = Math.sin((x / tapeWidth + 0.5) * Math.PI) * 0.18;
      const wave = Math.cos((y / tapeHeight + 0.5) * Math.PI * 2) * 0.04;
      pos.setZ(i, arch + wave);
    }
    tapeGeo.computeVertexNormals();

    const zipperMat = new THREE.MeshPhysicalMaterial({
      map: texture,
      roughness: item.roughness ?? 0.35,
      metalness: item.metalness ?? 0.7,
      clearcoat: item.clearcoat ?? 0.25,
      side: THREE.DoubleSide,
    });
    const tapeMesh = new THREE.Mesh(tapeGeo, zipperMat);
    group.add(tapeMesh);

    // 3D zipper slider puller placed along the center seam
    const sliderGeo = new THREE.BoxGeometry(0.35, 0.22, 0.14);
    sliderGeo.translate(0.1, 0, 0.12);
    const sliderMat = new THREE.MeshStandardMaterial({
      color: item.metalness > 0.5 ? 0xcc9a33 : 0x222222,
      roughness: 0.2,
      metalness: item.metalness > 0.5 ? 0.95 : 0.1,
    });
    const slider = new THREE.Mesh(sliderGeo, sliderMat);
    group.add(slider);

    // Puller tab hanging down
    const tabGeo = new THREE.BoxGeometry(0.16, 0.5, 0.04);
    tabGeo.translate(0.1, -0.32, 0.16);
    const tab = new THREE.Mesh(tabGeo, sliderMat);
    group.add(tab);

  } else {
    // --- LACES & BRAIDS RIBBON BAND ---
    // Elegant elongated ribbon band with gentle serpentine curvature and scalloped edges
    const bandWidth = 3.8;
    const bandHeight = 1.35;
    const segX = 80;
    const segY = 30;

    const bandGeo = new THREE.PlaneGeometry(bandWidth, bandHeight, segX, segY);
    const pos = bandGeo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const u = (x + bandWidth / 2) / bandWidth;
      const v = (y + bandHeight / 2) / bandHeight;

      // Serpentine S-curve ribbon flow
      const sCurve = Math.sin(u * Math.PI * 2.2) * 0.22;
      const edgeCurl = Math.sin(v * Math.PI) * 0.06;
      const scallopRelief = Math.sin(u * 28.0) * 0.02 * (1 - Math.abs(v - 0.5) * 2);

      pos.setZ(i, sCurve + edgeCurl + scallopRelief);
    }
    bandGeo.computeVertexNormals();

    const laceMat = new THREE.MeshPhysicalMaterial({
      map: texture,
      roughness: item.roughness ?? 0.8,
      metalness: item.metalness ?? 0.0,
      sheen: item.sheen ?? 0.3,
      sheenColor: new THREE.Color(item.sheenColor || '#FFFFFF'),
      transparent: true,
      alphaTest: 0.15,
      side: THREE.DoubleSide,
    });
    const bandMesh = new THREE.Mesh(bandGeo, laceMat);
    group.add(bandMesh);
  }

  return group;
}
