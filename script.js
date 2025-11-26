// Smooth scroll for internal nav links
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const el = document.querySelector(targetId);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Three.js - Services 3D Scene with procedural "realistic" meshes
(function initServices3D() {
  const canvas = document.getElementById('servicesCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x020617);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0.4, 3);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lights
  const hemiLight = new THREE.HemisphereLight(0x88c0ff, 0x020617, 1.2);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0x22d3ee, 1.3);
  keyLight.position.set(2, 3, 4);
  scene.add(keyLight);

  const fillLight = new THREE.PointLight(0x6366f1, 1.0, 10);
  fillLight.position.set(-2.5, -1, -1.5);
  scene.add(fillLight);

  const backGlow = new THREE.PointLight(0x0ea5e9, 0.9, 8);
  backGlow.position.set(0, 1.5, -2);
  scene.add(backGlow);

  // Materials helpers
  function metalMaterial(colorHex, emissiveHex) {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(colorHex),
      metalness: 0.8,
      roughness: 0.25,
      clearcoat: 1.0,
      clearcoatRoughness: 0.2,
      transmission: 0.15,
      transparent: true,
      thickness: 0.25,
      emissive: new THREE.Color(emissiveHex || colorHex).multiplyScalar(0.4),
      emissiveIntensity: 0.9
    });
  }

  // === Procedural meshes for each service ===

  // Laptop: screen + base with slight open angle
  function createLaptop() {
    const group = new THREE.Group();

    const screenMat = metalMaterial(0x1f2937, 0x38bdf8);
    const baseMat = metalMaterial(0x0f172a, 0x22d3ee);

    const screenGeom = new THREE.BoxGeometry(1.0, 0.6, 0.05);
    const screen = new THREE.Mesh(screenGeom, screenMat);
    screen.position.set(0, 0.33, 0);
    screen.rotation.x = -0.25;

    const baseGeom = new THREE.BoxGeometry(1.1, 0.08, 0.65);
    const base = new THREE.Mesh(baseGeom, baseMat);
    base.position.set(0, 0, 0.18);

    const keyboardGeom = new THREE.BoxGeometry(0.9, 0.02, 0.38);
    const keyboardMat = new THREE.MeshStandardMaterial({
      color: 0x020617,
      metalness: 0.6,
      roughness: 0.3,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.4
    });
    const keyboard = new THREE.Mesh(keyboardGeom, keyboardMat);
    keyboard.position.set(0, 0.03, 0.15);

    group.add(screen, base, keyboard);
    return group;
  }

  // Firewall: stacked metal plates with glow edge
  function createFirewall() {
    const group = new THREE.Group();
    const bodyMat = metalMaterial(0x111827, 0xf97316);
    const plateGeom = new THREE.BoxGeometry(0.9, 0.18, 0.4);

    for (let i = 0; i < 3; i++) {
      const plate = new THREE.Mesh(plateGeom, bodyMat);
      plate.position.set(0, (i - 1) * 0.2, 0);
      group.add(plate);
    }

    const shieldGeom = new THREE.OctahedronGeometry(0.22, 0);
    const shieldMat = new THREE.MeshStandardMaterial({
      color: 0x020617,
      metalness: 0.7,
      roughness: 0.25,
      emissive: 0xf97316,
      emissiveIntensity: 1.2
    });
    const shield = new THREE.Mesh(shieldGeom, shieldMat);
    shield.position.set(0, 0, 0.32);
    group.add(shield);

    return group;
  }

  // Cloud: three merged spheres with soft glow
  function createCloud() {
    const group = new THREE.Group();
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      metalness: 0.3,
      roughness: 0.2,
      emissive: 0x22d3ee,
      emissiveIntensity: 1.0
    });

    const main = new THREE.Mesh(new THREE.SphereGeometry(0.45, 32, 32), coreMat);
    const side1 = new THREE.Mesh(new THREE.SphereGeometry(0.32, 32, 32), coreMat);
    const side2 = new THREE.Mesh(new THREE.SphereGeometry(0.32, 32, 32), coreMat);

    side1.position.set(-0.35, -0.08, 0);
    side2.position.set(0.35, -0.05, 0);

    group.add(main, side1, side2);
    return group;
  }

  // NAS / Backup: tower with LED bars
  function createBackup() {
    const group = new THREE.Group();
    const caseMat = metalMaterial(0x020617, 0x22c55e);

    const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.9, 0.5), caseMat);
    body.position.set(0, 0.1, 0);

    const ledGeom = new THREE.BoxGeometry(0.04, 0.12, 0.02);
    const ledMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      emissive: 0x22c55e,
      emissiveIntensity: 1.5
    });

    for (let i = 0; i < 4; i++) {
      const led = new THREE.Mesh(ledGeom, ledMat);
      led.position.set(0.22, -0.25 + i * 0.2, 0.26);
      group.add(led);
    }

    group.add(body);
    return group;
  }

  // Gear / AMC: rotating cog
  function createGear() {
    const group = new THREE.Group();

    const baseMat = metalMaterial(0x111827, 0x22d3ee);
    const torus = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.12, 16, 40), baseMat);
    torus.rotation.x = Math.PI / 2;

    const toothGeom = new THREE.BoxGeometry(0.12, 0.14, 0.18);
    const toothMat = metalMaterial(0x1f2937, 0x38bdf8);

    const toothCount = 10;
    for (let i = 0; i < toothCount; i++) {
      const t = (i / toothCount) * Math.PI * 2;
      const tooth = new THREE.Mesh(toothGeom, toothMat);
      tooth.position.set(Math.cos(t) * 0.45, 0, Math.sin(t) * 0.45);
      tooth.lookAt(0, 0, 0);
      group.add(tooth);
    }

    group.add(torus);
    return group;
  }

  // Admin / Support node: cube with ring halo
  function createAdminNode() {
    const group = new THREE.Group();

    const cubeMat = metalMaterial(0x0f172a, 0x22d3ee);
    const cube = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.55), cubeMat);

    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x22d3ee,
      emissiveIntensity: 1.2,
      metalness: 0.7,
      roughness: 0.3
    });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.03, 16, 64), ringMat);
    ring.rotation.x = Math.PI / 2;

    group.add(cube, ring);
    return group;
  }

  // === Layout: Tri-layer depth ===
  const serviceDefs = [
    { name: 'Laptop & Desktop Support', create: createLaptop, layer: 'front', position: new THREE.Vector3(-0.9, 0.35, 0.5) },
    { name: 'Network & Firewall Security', create: createFirewall, layer: 'front', position: new THREE.Vector3(0.9, 0.35, 0.5) },
    { name: 'Azure & Microsoft 365', create: createCloud, layer: 'mid', position: new THREE.Vector3(-0.9, -0.2, 0.2) },
    { name: 'Annual Maintenance Contracts', create: createGear, layer: 'mid', position: new THREE.Vector3(0.9, -0.2, 0.2) },
    { name: 'Storage & Data Recovery', create: createBackup, layer: 'back', position: new THREE.Vector3(-0.35, 0.0, -0.15) },
    { name: 'IT Support & SysAdmin', create: createAdminNode, layer: 'back', position: new THREE.Vector3(0.35, 0.0, -0.15) }
  };

  const rootGroup = new THREE.Group();
  scene.add(rootGroup);

  const interactiveMeshes = [];
  const serviceGroups = [];

  serviceDefs.forEach((def) => {
    const g = def.create();
    g.position.copy(def.position);
    g.userData.serviceName = def.name;
    g.userData.basePosition = g.position.clone();
    g.userData.layer = def.layer;
    g.userData.baseScale = 0.75;
    g.scale.setScalar(g.userData.baseScale);

    // store children meshes for raycasting
    g.traverse((obj) => {
      if (obj.isMesh) {
        obj.userData.parentServiceGroup = g;
        interactiveMeshes.push(obj);
      }
    });

    rootGroup.add(g);
    serviceGroups.push(g);
  });

  // Background plane for depth
  const planeGeom = new THREE.PlaneGeometry(5, 3.6);
  const planeMat = new THREE.MeshBasicMaterial({
    color: 0x020617,
    transparent: true,
    opacity: 0.85
  });
  const plane = new THREE.Mesh(planeGeom, planeMat);
  plane.position.set(0, 0.1, -2);
  scene.add(plane);

  // Resize
  function resize() {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || canvas.clientWidth || 400;
    const height = rect.height || width * 0.75;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // Hover interaction
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hoveredGroup = null;

  function onPointerMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }
  canvas.addEventListener('pointermove', onPointerMove);

  const overlayHint = document.querySelector('.services-3d-overlay .hint');

  // Animation
  function animate() {
    requestAnimationFrame(animate);

    const t = performance.now() * 0.00015;

    // Parallax on whole group
    rootGroup.rotation.y = Math.sin(t) * 0.15;
    rootGroup.position.y = Math.sin(t * 1.5) * 0.04;

    // Subtle idle rotations
    serviceGroups.forEach((g, index) => {
      const layerFactor = g.userData.layer === 'front' ? 1.4 : g.userData.layer === 'mid' ? 1.0 : 0.6;
      g.rotation.y += 0.0025 * layerFactor;
      g.rotation.x += 0.0012 * layerFactor;
    });

    // Hover detection
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveMeshes, true);
    if (intersects.length > 0) {
      const targetGroup = intersects[0].object.userData.parentServiceGroup;
      if (targetGroup && hoveredGroup !== targetGroup) {
        hoveredGroup = targetGroup;
        if (overlayHint && hoveredGroup.userData.serviceName) {
          overlayHint.textContent = hoveredGroup.userData.serviceName + ' – managed end to end by R-Cube IT.';
        }
      }
    } else if (hoveredGroup) {
      hoveredGroup = null;
      if (overlayHint) {
        overlayHint.textContent = 'Hover the cards to explore each managed IT area.';
      }
    }

    // Animate hover scale and slight lift
    serviceGroups.forEach((g) => {
      const basePos = g.userData.basePosition;
      const targetPos = basePos.clone();
      let targetScale = g.userData.baseScale;

      if (g === hoveredGroup) {
        targetPos.z += 0.4;
        targetPos.y += 0.05;
        targetScale *= 1.12;
      }

      g.position.lerp(targetPos, 0.14);
      const currentScale = g.scale.x;
      const nextScale = currentScale + (targetScale - currentScale) * 0.16;
      g.scale.setScalar(nextScale);
    });

    renderer.render(scene, camera);
  }

  animate();
})();
