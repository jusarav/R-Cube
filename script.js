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

// Three.js - Services 3D Scene
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
  const hemiLight = new THREE.HemisphereLight(0x88c0ff, 0x020617, 1.1);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0x22d3ee, 1.2);
  dirLight.position.set(2, 3, 4);
  scene.add(dirLight);

  // Service nodes (boxes on a ring)
  const group = new THREE.Group();
  scene.add(group);

  const serviceNames = [
    'IT Support',
    'AMC',
    'Laptop / Desktop',
    'Network & Firewall',
    'Azure / M365',
    'Backup & Recovery',
  ];

  const geometry = new THREE.BoxGeometry(0.32, 0.18, 0.16);
  const baseColor = new THREE.Color(0x4f46e5);
  const accentColor = new THREE.Color(0x22d3ee);

  const materials = serviceNames.map((_, i) => {
    const c = baseColor.clone().lerp(accentColor, i / serviceNames.length);
    return new THREE.MeshStandardMaterial({
      color: c,
      metalness: 0.6,
      roughness: 0.25,
      emissive: c.clone().multiplyScalar(0.4),
      emissiveIntensity: 0.6,
    });
  });

  const radius = 1.15;
  serviceNames.forEach((name, i) => {
    const angle = (i / serviceNames.length) * Math.PI * 2;
    const mesh = new THREE.Mesh(geometry, materials[i]);
    mesh.position.set(Math.cos(angle) * radius, (i % 2 === 0 ? 0.28 : -0.2), Math.sin(angle) * radius);
    mesh.lookAt(0, 0, 0);
    mesh.userData = { serviceName: name };
    group.add(mesh);
  });

  // Center core
  const coreGeom = new THREE.SphereGeometry(0.32, 32, 32);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x0ea5e9,
    metalness: 0.5,
    roughness: 0.2,
    emissive: 0x22d3ee,
    emissiveIntensity: 0.8,
  });
  const core = new THREE.Mesh(coreGeom, coreMat);
  scene.add(core);

  // Resize handling
  function resize() {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || canvas.clientWidth || 400;
    const height = rect.height || width * 0.8;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // Hover interaction (simple raycasting)
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hovered = null;

  function onPointerMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  canvas.addEventListener('pointermove', onPointerMove);

  // Animation loop
  const overlayHint = document.querySelector('.services-3d-overlay .hint');

  function animate() {
    requestAnimationFrame(animate);

    // Slow rotation
    group.rotation.y += 0.0035;
    core.rotation.y -= 0.004;

    // Hover highlight
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(group.children);
    if (intersects.length > 0) {
      const target = intersects[0].object;
      if (hovered !== target) {
        if (hovered) {
          hovered.scale.set(1, 1, 1);
        }
        hovered = target;
        hovered.scale.set(1.15, 1.15, 1.15);
        if (overlayHint && hovered.userData.serviceName) {
          overlayHint.textContent = hovered.userData.serviceName + ' – managed end to end by R‑Cube IT.';
        }
      }
    } else if (hovered) {
      hovered.scale.set(1, 1, 1);
      hovered = null;
      if (overlayHint) {
        overlayHint.textContent = '3D nodes represent key service areas managed by R‑Cube IT.';
      }
    }

    renderer.render(scene, camera);
  }

  animate();
})();
