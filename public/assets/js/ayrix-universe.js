/**
 * Ayrix 3D Digital Universe Engine
 * Powered by Three.js & WebGL
 *
 * Implements a complete, living 3D digital world:
 * - Persistent cinematic WebGL universe canvas
 * - Atmospheric exponential fog, ACES filmic tone mapping, physically based lighting
 * - Central technological cyber core with gyroscopic gimbal rings and orbiting satellites
 * - Deep space particle constellation with procedural wave dynamics
 * - Scroll-driven cinematic camera flight across 3D waypoints
 * - Raycaster-powered 3D spatial navigation beacons with interactive fly-to transitions
 * - 3D Chrono-Orb reading progress beacon for article pages
 * - Interactive 3D perspective tilt with specular glare
 * - Full reduced-motion & WebGL fallback guardrails
 */

import * as THREE from './three.module.js';

export class AyrixUniverse {
  constructor(options = {}) {
    this.options = options;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.hasWebGL = this.checkWebGLSupport();

    if (!this.hasWebGL) {
      console.warn('[AyrixUniverse] WebGL not supported or disabled. Falling back to CSS 3D layout.');
      document.documentElement.classList.add('no-webgl');
      return;
    }

    this.container = document.body;
    this.canvas = null;
    this.renderer = null;
    this.scene = null;
    this.camera = null;

    // Viewport & Scaling
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Camera Targets & Motion State
    this.camPos = new THREE.Vector3(0, 8, 95);
    this.targetCamPos = new THREE.Vector3(0, 8, 95);
    this.camLookAt = new THREE.Vector3(0, 0, 0);
    this.targetCamLookAt = new THREE.Vector3(0, 0, 0);

    // Pointer Physics (Normalized -1 to 1)
    this.pointer = new THREE.Vector2(0, 0);
    this.targetPointer = new THREE.Vector2(0, 0);
    this.mouseWorld = new THREE.Vector3(0, 0, 0);
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.coreDragRotation = { x: 0, y: 0 };

    // Scroll Physics
    this.scrollProgress = 0;
    this.targetScrollProgress = 0;

    // Raycasting & Interaction
    this.raycaster = new THREE.Raycaster();
    this.interactiveNodes = [];
    this.hoveredNode = null;
    this.tooltipElement = null;

    // 3D Scene Components
    this.clock = new THREE.Clock();
    this.particles = null;
    this.particleCount = 1200;
    this.cyberCoreGroup = null;
    this.gimbalRings = [];
    this.orbitSatellites = [];
    this.gridHelper = null;
    this.cursorLight = null;
    this.probeLight = null;

    // Lifecycle
    this.animationFrameId = null;
    this.isVisible = true;

    // Page Context
    this.pathname = window.location.pathname;
    this.isHome = this.pathname === '/' || this.pathname === '/index.html';
    this.isPost = /^\/posts\/[^/]+\/?$/.test(this.pathname) && this.pathname !== '/posts/';
    this.isPostsIndex = this.pathname.startsWith('/posts/') && !this.isPost;

    this.init();
  }

  checkWebGLSupport() {
    try {
      const testCanvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')));
    } catch {
      return false;
    }
  }

  init() {
    this.setupCanvas();
    this.setupRenderer();
    this.setupScene();
    this.setupCamera();
    this.setupLighting();
    this.buildDeepSpaceConstellation();
    this.buildCyberGrid();
    this.buildCentralTechSculpture();
    this.buildSpatialNavigationNodes();
    this.setupHUD();

    if (this.isPost) {
      this.setupChronoOrbHUD();
    }

    this.bindEvents();
    this.updateScrollPosition();
    this.animate();
  }

  setupCanvas() {
    let canvas = document.getElementById('ayrix-universe-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'ayrix-universe-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      document.body.prepend(canvas);
    }
    this.canvas = canvas;
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.renderer.setClearColor(0x000000, 0); // Transparent so CSS gradient blends seamlessly
  }

  setupScene() {
    this.scene = new THREE.Scene();
    // Atmospheric deep space exponential fog
    this.scene.fog = new THREE.FogExp2(0x040814, 0.0022);
  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(55, this.width / this.height, 0.5, 2000);
    this.camera.position.copy(this.camPos);
    this.camera.lookAt(this.camLookAt);
  }

  setupLighting() {
    // Deep midnight ambient fill
    const ambient = new THREE.AmbientLight(0x0e172a, 1.6);
    this.scene.add(ambient);

    // Primary Electric Cyan Key Light
    const cyanKey = new THREE.DirectionalLight(0x38bdf8, 2.8);
    cyanKey.position.set(70, 90, 80);
    this.scene.add(cyanKey);

    // Electric Violet Fill Light
    const violetFill = new THREE.DirectionalLight(0xa855f7, 2.2);
    violetFill.position.set(-80, -50, 60);
    this.scene.add(violetFill);

    // Orbiting Emerald Probe Light
    this.probeLight = new THREE.PointLight(0x10b981, 3.5, 450);
    this.probeLight.position.set(30, 20, 40);
    this.scene.add(this.probeLight);

    // Interactive Cursor Follow Light
    this.cursorLight = new THREE.PointLight(0x00f0ff, 2.2, 300);
    this.cursorLight.position.set(0, 0, 50);
    this.scene.add(this.cursorLight);
  }

  buildDeepSpaceConstellation() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);
    const scales = new Float32Array(this.particleCount);

    const cyan = new THREE.Color(0x38bdf8);
    const violet = new THREE.Color(0xa855f7);
    const emerald = new THREE.Color(0x10b981);
    const white = new THREE.Color(0xe2e8f0);

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      // Volume distribution
      positions[i3] = (Math.random() - 0.5) * 1600;
      positions[i3 + 1] = (Math.random() - 0.5) * 1200;
      positions[i3 + 2] = (Math.random() - 0.5) * 1200;

      // Color variation across cyber palette
      const rand = Math.random();
      let color;
      if (rand < 0.45) color = cyan;
      else if (rand < 0.75) color = violet;
      else if (rand < 0.9) color = emerald;
      else color = white;

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      scales[i] = 1.0 + Math.random() * 2.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // High performance points material with vertex colors
    const material = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  buildCyberGrid() {
    // Vector floor grid located at the base of the universe
    const grid = new THREE.GridHelper(1200, 48, 0x38bdf8, 0x1e293b);
    grid.position.y = -140;
    grid.material.opacity = 0.22;
    grid.material.transparent = true;
    grid.material.blending = THREE.AdditiveBlending;
    this.gridHelper = grid;
    this.scene.add(grid);
  }

  buildCentralTechSculpture() {
    this.cyberCoreGroup = new THREE.Group();
    this.cyberCoreGroup.position.set(0, 0, 0);

    // 1. Inner Crystalline Icosahedron Core
    const coreGeo = new THREE.IcosahedronGeometry(15, 1);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x051326,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.35,
      roughness: 0.12,
      metalness: 0.88,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: false
    });
    this.coreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.cyberCoreGroup.add(this.coreMesh);

    // 2. Outer Wireframe Matrix
    const wireGeo = new THREE.IcosahedronGeometry(15.4, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    this.cyberCoreGroup.add(wireMesh);
    this.coreWireMesh = wireMesh;

    // 3. Multi-Axis Gyroscopic Gimbal Rings
    const ringConfigs = [
      { radius: 25, tube: 0.45, color: 0x38bdf8, rotX: 0.65, rotY: 0.4, speed: 0.008 },
      { radius: 34, tube: 0.4, color: 0xa855f7, rotX: -0.5, rotY: 0.8, speed: -0.006 },
      { radius: 42, tube: 0.35, color: 0x10b981, rotX: 0.9, rotY: -0.3, speed: 0.004 }
    ];

    this.gimbalRings = ringConfigs.map((config) => {
      const ringGeo = new THREE.TorusGeometry(config.radius, config.tube, 16, 90);
      const ringMat = new THREE.MeshStandardMaterial({
        color: config.color,
        emissive: config.color,
        emissiveIntensity: 0.45,
        roughness: 0.2,
        metalness: 0.8,
        wireframe: false
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = config.rotX;
      ring.rotation.y = config.rotY;
      ring.userData = { speed: config.speed };
      this.cyberCoreGroup.add(ring);
      return ring;
    });

    // 4. Orbiting Satellite Beacons
    const satCount = 6;
    for (let i = 0; i < satCount; i++) {
      const angle = (i / satCount) * Math.PI * 2;
      const radius = 54 + (i % 2) * 12;
      const satGeo = new THREE.OctahedronGeometry(1.8);
      const satMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0x00f0ff : 0xa855f7,
        emissive: i % 2 === 0 ? 0x00f0ff : 0xa855f7,
        emissiveIntensity: 0.7,
        metalness: 0.9,
        roughness: 0.1
      });
      const satMesh = new THREE.Mesh(satGeo, satMat);
      satMesh.userData = {
        baseAngle: angle,
        radius: radius,
        speed: 0.006 * (i % 2 === 0 ? 1 : -1),
        yOffset: (Math.random() - 0.5) * 20
      };

      // Connective energy laser line to core
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(radius * Math.cos(angle), satMesh.userData.yOffset, radius * Math.sin(angle))
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending
      });
      const line = new THREE.Line(lineGeo, lineMat);

      this.cyberCoreGroup.add(satMesh);
      this.cyberCoreGroup.add(line);
      this.orbitSatellites.push({ mesh: satMesh, line: line });
    }

    this.scene.add(this.cyberCoreGroup);
  }

  buildSpatialNavigationNodes() {
    // 3D Interactive Floating Navigation Nodes placed in deep space
    const navItems = [
      { id: 'nav-home', label: '01 // BASE CORE', url: '/', pos: [0, 24, -20], color: 0x38bdf8 },
      { id: 'nav-posts', label: '02 // PUBLICATIONS ARCHIVE', url: '/posts/', pos: [-45, 14, -30], color: 0x10b981 },
      { id: 'nav-tags', label: '03 // TAXONOMY TAGS', url: '/tags/', pos: [-35, -20, -40], color: 0xa855f7 },
      { id: 'nav-categories', label: '04 // CATEGORY CLUSTERS', url: '/categories/', pos: [35, -20, -40], color: 0x38bdf8 },
      { id: 'nav-about', label: '05 // AUTHOR PROFILE', url: '/about/', pos: [45, 14, -30], color: 0xa855f7 },
      { id: 'nav-contact', label: '06 // TRANSCEIVER CONTACT', url: '/contact/', pos: [0, -45, -50], color: 0x10b981 }
    ];

    this.interactiveNodes = navItems.map((item) => {
      const group = new THREE.Group();
      group.position.set(item.pos[0], item.pos[1], item.pos[2]);

      // Central Beacon Orb
      const geo = new THREE.SphereGeometry(2.4, 24, 24);
      const mat = new THREE.MeshPhysicalMaterial({
        color: item.color,
        emissive: item.color,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.7,
        clearcoat: 1.0
      });
      const mesh = new THREE.Mesh(geo, mat);

      // Outer Pulsing Orbit Ring
      const ringGeo = new THREE.TorusGeometry(3.8, 0.18, 12, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: item.color,
        wireframe: true,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 3;

      group.add(mesh);
      group.add(ring);

      group.userData = {
        isNavNode: true,
        id: item.id,
        label: item.label,
        url: item.url,
        mesh: mesh,
        ring: ring,
        baseColor: item.color,
        baseScale: 1.0,
        targetScale: 1.0
      };

      this.scene.add(group);
      return group;
    });
  }

  setupHUD() {
    let tooltip = document.querySelector('.spatial-label-hud');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'spatial-label-hud';
      tooltip.setAttribute('aria-hidden', 'true');
      document.body.appendChild(tooltip);
    }
    this.tooltipElement = tooltip;

    // Create 3D Warp Transition Overlay if not already present
    if (!document.querySelector('.universe-warp-overlay')) {
      const warp = document.createElement('div');
      warp.className = 'universe-warp-overlay';
      warp.setAttribute('aria-hidden', 'true');
      document.body.appendChild(warp);
    }
  }

  setupChronoOrbHUD() {
    if (document.querySelector('.chrono-orb-hud')) return;

    const orbHUD = document.createElement('div');
    orbHUD.className = 'chrono-orb-hud';
    orbHUD.setAttribute('role', 'region');
    orbHUD.setAttribute('aria-label', '3D Reading Telemetry');
    orbHUD.innerHTML = `
      <canvas class="chrono-orb-canvas" width="68" height="68"></canvas>
      <div class="chrono-orb-text">
        <span class="chrono-orb-val" data-chrono-val>0%</span>
        <span class="chrono-orb-lbl">READING DEPTH</span>
      </div>
    `;
    document.body.appendChild(orbHUD);

    // Click on Chrono-Orb scrolls smoothly to top
    orbHUD.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Initialize mini 3D Chrono-Orb Canvas
    const orbCanvas = orbHUD.querySelector('.chrono-orb-canvas');
    if (orbCanvas) {
      this.initChronoOrbRenderer(orbCanvas);
    }
  }

  initChronoOrbRenderer(canvas) {
    try {
      const orbRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      orbRenderer.setSize(34, 34);
      orbRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      const orbScene = new THREE.Scene();
      const orbCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      orbCamera.position.z = 10;

      // Outer Chrono Ring
      const ringGeo = new THREE.TorusGeometry(3.2, 0.32, 16, 48);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      orbScene.add(ringMesh);

      // Inner Core
      const coreGeo = new THREE.IcosahedronGeometry(1.6, 1);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      orbScene.add(coreMesh);

      const renderOrb = () => {
        if (!this.isVisible) return;
        ringMesh.rotation.z -= 0.02 + this.scrollProgress * 0.05;
        ringMesh.rotation.x += 0.015;
        coreMesh.rotation.y += 0.03;

        // Dynamic color transition based on reading progress:
        // 0% -> Cyan (0x38bdf8), 50% -> Violet (0xa855f7), 100% -> Emerald (0x10b981)
        if (this.scrollProgress < 0.5) {
          ringMat.color.setHex(0x38bdf8);
          coreMat.color.setHex(0x00f0ff);
        } else if (this.scrollProgress < 0.85) {
          ringMat.color.setHex(0xa855f7);
          coreMat.color.setHex(0xc084fc);
        } else {
          ringMat.color.setHex(0x10b981);
          coreMat.color.setHex(0x34d399);
        }

        orbRenderer.render(orbScene, orbCamera);
        requestAnimationFrame(renderOrb);
      };
      renderOrb();
    } catch (e) {
      console.warn('[AyrixUniverse] Chrono-Orb WebGL renderer failed:', e);
    }
  }

  bindEvents() {
    window.addEventListener('resize', this.onResize.bind(this), { passive: true });
    window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
    window.addEventListener('pointermove', this.onPointerMove.bind(this), { passive: true });
    window.addEventListener('click', this.onClick.bind(this));

    // Drag to rotate on Hero container
    const hero = document.querySelector('.ayrix-3d-hero');
    if (hero) {
      hero.addEventListener('pointerdown', (e) => {
        this.isDragging = true;
        this.dragStart.x = e.clientX;
        this.dragStart.y = e.clientY;
      });
      window.addEventListener('pointerup', () => {
        this.isDragging = false;
      });
      hero.addEventListener('pointermove', (e) => {
        if (!this.isDragging) return;
        const dx = e.clientX - this.dragStart.x;
        const dy = e.clientY - this.dragStart.y;
        this.coreDragRotation.y += dx * 0.008;
        this.coreDragRotation.x += dy * 0.008;
        this.dragStart.x = e.clientX;
        this.dragStart.y = e.clientY;

        const coords = document.querySelector('[data-hud-coords]');
        if (coords) {
          const degX = Math.round((this.coreDragRotation.x * 180) / Math.PI) % 360;
          const degY = Math.round((this.coreDragRotation.y * 180) / Math.PI) % 360;
          coords.textContent = `ROT: ${degX}° / ${degY}°`;
        }
      });
    }

    // Visibility change auto-pause
    document.addEventListener('visibilitychange', () => {
      this.isVisible = document.visibilityState === 'visible';
    });
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    if (this.camera) {
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
    }
    if (this.renderer) {
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(this.dpr);
    }
  }

  onScroll() {
    this.updateScrollPosition();
  }

  updateScrollPosition() {
    const doc = document.documentElement;
    const maxScroll = Math.max(1, doc.scrollHeight - doc.clientHeight);
    this.targetScrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));

    // Update Chrono-Orb HUD text if present
    const chronoVal = document.querySelector('[data-chrono-val]');
    if (chronoVal) {
      chronoVal.textContent = `${Math.round(this.targetScrollProgress * 100)}%`;
    }
  }

  onPointerMove(e) {
    this.targetPointer.x = (e.clientX / this.width) * 2 - 1;
    this.targetPointer.y = -(e.clientY / this.height) * 2 + 1;

    // Raycast against interactive 3D nodes
    this.checkRaycastIntersections(e);
  }

  checkRaycastIntersections(e) {
    if (!this.camera || !this.interactiveNodes.length) return;

    this.raycaster.setFromCamera(this.targetPointer, this.camera);
    const meshes = this.interactiveNodes.map((n) => n.userData.mesh);
    const intersects = this.raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object;
      const node = hitMesh.parent;

      if (this.hoveredNode !== node) {
        if (this.hoveredNode) {
          this.hoveredNode.userData.targetScale = 1.0;
          this.hoveredNode.userData.mesh.material.emissiveIntensity = 0.5;
        }
        this.hoveredNode = node;
        node.userData.targetScale = 1.35;
        node.userData.mesh.material.emissiveIntensity = 1.2;
        document.body.style.cursor = 'pointer';

        // Show spatial tooltip
        if (this.tooltipElement) {
          this.tooltipElement.textContent = node.userData.label;
          this.tooltipElement.style.left = `${e.clientX}px`;
          this.tooltipElement.style.top = `${e.clientY}px`;
          this.tooltipElement.classList.add('active');
        }
      } else if (this.tooltipElement) {
        this.tooltipElement.style.left = `${e.clientX}px`;
        this.tooltipElement.style.top = `${e.clientY}px`;
      }
    } else {
      if (this.hoveredNode) {
        this.hoveredNode.userData.targetScale = 1.0;
        this.hoveredNode.userData.mesh.material.emissiveIntensity = 0.5;
        this.hoveredNode = null;
        document.body.style.cursor = 'default';
        if (this.tooltipElement) {
          this.tooltipElement.classList.remove('active');
        }
      }
    }
  }

  onClick(e) {
    if (!this.hoveredNode) return;

    const url = this.hoveredNode.userData.url;
    if (url && url !== window.location.pathname) {
      e.preventDefault();
      this.triggerWarpTransition(url, this.hoveredNode.position);
    }
  }

  triggerWarpTransition(destinationUrl, targetPosition) {
    const warp = document.querySelector('.universe-warp-overlay');
    if (warp) {
      warp.classList.add('active');
    }

    // Accelerate camera toward target node
    if (targetPosition) {
      this.targetCamPos.set(targetPosition.x, targetPosition.y, targetPosition.z + 12);
      this.targetCamLookAt.copy(targetPosition);
    }

    setTimeout(() => {
      window.location.href = destinationUrl;
    }, 450);
  }

  calculateCameraWaypoints() {
    const p = this.scrollProgress;

    if (this.isHome) {
      // 5-Stage Cinematic Flight through Homepage Universe
      if (p < 0.25) {
        // Stage 0: Hero Tech Sculpture
        const t = p / 0.25;
        this.targetCamPos.set(
          THREE.MathUtils.lerp(0, 10, t),
          THREE.MathUtils.lerp(8, 25, t),
          THREE.MathUtils.lerp(95, 115, t)
        );
        this.targetCamLookAt.set(0, THREE.MathUtils.lerp(0, 8, t), 0);
      } else if (p < 0.55) {
        // Stage 1: Documentation Hub & Recommended Guides
        const t = (p - 0.25) / 0.3;
        this.targetCamPos.set(
          THREE.MathUtils.lerp(10, -22, t),
          THREE.MathUtils.lerp(25, -12, t),
          THREE.MathUtils.lerp(115, 100, t)
        );
        this.targetCamLookAt.set(
          THREE.MathUtils.lerp(0, -5, t),
          THREE.MathUtils.lerp(8, -5, t),
          -20
        );
      } else if (p < 0.82) {
        // Stage 2: AI Agents & Technical Domains
        const t = (p - 0.55) / 0.27;
        this.targetCamPos.set(
          THREE.MathUtils.lerp(-22, 18, t),
          THREE.MathUtils.lerp(-12, -45, t),
          THREE.MathUtils.lerp(100, 90, t)
        );
        this.targetCamLookAt.set(
          THREE.MathUtils.lerp(-5, 0, t),
          THREE.MathUtils.lerp(-5, -40, t),
          -30
        );
      } else {
        // Stage 3: Terminal Nexus & Footer
        const t = (p - 0.82) / 0.18;
        this.targetCamPos.set(
          THREE.MathUtils.lerp(18, 0, t),
          THREE.MathUtils.lerp(-45, -75, t),
          THREE.MathUtils.lerp(90, 82, t)
        );
        this.targetCamLookAt.set(0, THREE.MathUtils.lerp(-40, -75, t), 0);
      }
    } else if (this.isPost) {
      // 3D Reading Chamber Waypoints
      this.targetCamPos.set(
        -12 + this.pointer.x * 6,
        15 - p * 60,
        105 - p * 15
      );
      this.targetCamLookAt.set(0, 5 - p * 60, -20);
    } else {
      // Publications / Tags / Categories Waypoints
      this.targetCamPos.set(
        this.pointer.x * 12,
        10 - p * 45,
        100
      );
      this.targetCamLookAt.set(0, -p * 35, 0);
    }
  }

  animate() {
    if (!this.isVisible) {
      this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
      return;
    }

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Smooth Lerp Pointer
    this.pointer.x += (this.targetPointer.x - this.pointer.x) * 0.08;
    this.pointer.y += (this.targetPointer.y - this.pointer.y) * 0.08;

    // Smooth Lerp Scroll Progress
    this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.08;

    // Calculate camera target based on scroll position
    this.calculateCameraWaypoints();

    // Parallax sway based on pointer
    const parallaxX = this.pointer.x * (this.isReducedMotion ? 2 : 12);
    const parallaxY = this.pointer.y * (this.isReducedMotion ? 2 : 8);

    // Apply Camera Smooth Damping
    this.camPos.x += (this.targetCamPos.x + parallaxX - this.camPos.x) * 0.06;
    this.camPos.y += (this.targetCamPos.y + parallaxY - this.camPos.y) * 0.06;
    this.camPos.z += (this.targetCamPos.z - this.camPos.z) * 0.06;

    this.camLookAt.x += (this.targetCamLookAt.x - this.camLookAt.x) * 0.06;
    this.camLookAt.y += (this.targetCamLookAt.y - this.camLookAt.y) * 0.06;
    this.camLookAt.z += (this.targetCamLookAt.z - this.camLookAt.z) * 0.06;

    this.camera.position.copy(this.camPos);
    this.camera.lookAt(this.camLookAt);

    // Dynamic Lights Motion
    if (this.probeLight) {
      this.probeLight.position.x = Math.sin(elapsedTime * 0.8) * 65;
      this.probeLight.position.z = Math.cos(elapsedTime * 0.8) * 65;
      this.probeLight.position.y = Math.sin(elapsedTime * 0.5) * 30;
    }
    if (this.cursorLight) {
      this.cursorLight.position.x = this.pointer.x * 50;
      this.cursorLight.position.y = this.pointer.y * 35;
    }

    // Animate Central Technological Sculpture
    if (this.cyberCoreGroup && !this.isReducedMotion) {
      this.cyberCoreGroup.rotation.y = elapsedTime * 0.15 + this.coreDragRotation.y;
      this.cyberCoreGroup.rotation.x = Math.sin(elapsedTime * 0.1) * 0.1 + this.coreDragRotation.x;

      if (this.coreWireMesh) {
        this.coreWireMesh.rotation.y = -elapsedTime * 0.25;
        this.coreWireMesh.rotation.z = elapsedTime * 0.18;
      }

      // Animate Gimbal Rings
      this.gimbalRings.forEach((ring, idx) => {
        ring.rotation.z += ring.userData.speed;
        ring.rotation.x += ring.userData.speed * 0.6;
      });

      // Animate Satellites & Connective Lines
      this.orbitSatellites.forEach((sat, i) => {
        const angle = sat.mesh.userData.baseAngle + elapsedTime * sat.mesh.userData.speed * 1.5;
        const x = sat.mesh.userData.radius * Math.cos(angle);
        const z = sat.mesh.userData.radius * Math.sin(angle);
        const y = sat.mesh.userData.yOffset + Math.sin(elapsedTime * 1.2 + i) * 5;

        sat.mesh.position.set(x, y, z);
        sat.mesh.rotation.y += 0.02;

        const posAttr = sat.line.geometry.attributes.position;
        posAttr.setXYZ(1, x, y, z);
        posAttr.needsUpdate = true;
      });
    }

    // Animate Deep Space Constellation
    if (this.particles && !this.isReducedMotion) {
      this.particles.rotation.y = elapsedTime * 0.015;
      const posAttr = this.particles.geometry.attributes.position;
      // Gentle harmonic wave
      const count = Math.min(150, this.particleCount);
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        posAttr.array[i3 + 1] += Math.sin(elapsedTime * 1.5 + i) * 0.04;
      }
      posAttr.needsUpdate = true;
    }

    // Animate Spatial Navigation Nodes
    this.interactiveNodes.forEach((node, idx) => {
      // Gentle floating bob
      node.position.y += Math.sin(elapsedTime * 1.5 + idx) * 0.015;

      // Orbit ring spin
      if (node.userData.ring) {
        node.userData.ring.rotation.z += 0.025;
      }

      // Scale transition (hover state)
      const curScale = node.scale.x;
      const targetScale = node.userData.targetScale;
      const newScale = curScale + (targetScale - curScale) * 0.12;
      node.scale.set(newScale, newScale, newScale);
    });

    // Render 3D Scene
    this.renderer.render(this.scene, this.camera);

    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
  }

  dispose() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('click', this.onClick);

    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}

// ----------------------------------------------------
// 3D Card Perspective Tilt Engine (Tactile Depth)
// ----------------------------------------------------
export function initCard3DTilt() {
  const cards = document.querySelectorAll('.home-card, .post-entry, .guide-card, .topic-pill');
  if (!cards.length) return;

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isReducedMotion) return;

  cards.forEach((card) => {
    let glare = card.querySelector('.card-3d-glare');
    if (!glare && (card.classList.contains('home-card') || card.classList.contains('post-entry'))) {
      glare = document.createElement('div');
      glare.className = 'card-3d-glare';
      glare.setAttribute('aria-hidden', 'true');
      card.appendChild(glare);
    }

    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate degrees (Max 12 deg tilt)
      const rotateX = ((centerY - y) / centerY) * 10;
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px) scale3d(1.02, 1.02, 1.02)`;

      if (glare) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.35) 0%, transparent 60%)`;
      }
    };

    const onLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease';
    };

    const onEnter = () => {
      card.style.transition = 'transform 0.1s ease-out, box-shadow 0.25s ease';
    };

    card.addEventListener('pointerenter', onEnter);
    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerleave', onLeave);
  });
}

// ----------------------------------------------------
// 3D Entrance Sequence & Skips
// ----------------------------------------------------
export function init3DEntrance() {
  const introRoot = document.documentElement;
  const intro = document.getElementById('intro');
  if (!intro) return;

  if (!introRoot.classList.contains('intro-on')) {
    intro.remove();
    return;
  }

  const pageElements = [...document.body.children].filter((el) => el !== intro && el.id !== 'ayrix-universe-canvas');
  const prevInert = pageElements.map((el) => el.inert);
  pageElements.forEach((el) => { el.inert = true; });

  const skipBtn = intro.querySelector('.intro-skip');
  let finished = false;
  let timer;

  const finish = () => {
    if (finished) return;
    finished = true;
    clearTimeout(timer);
    intro.remove();
    introRoot.classList.remove('intro-on', 'intro-reveal');
    pageElements.forEach((el, idx) => { el.inert = prevInert[idx]; });
  };

  const leave = () => {
    if (finished) return;
    introRoot.classList.add('intro-reveal');
    intro.classList.add('leave');
    setTimeout(finish, 850);
  };

  timer = setTimeout(leave, 1600);
  intro.addEventListener('click', leave);
  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      finish();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
      finish();
    }
  }, { once: true });
}
