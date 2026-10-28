/**
 * Ayrix 3D Engine (Pure WebGL & Canvas 3D + CSS 3D Perspective)
 * Built for high performance, zero external dependencies, strict CSP compliance.
 */

export class Ayrix3DEngine {
  constructor(options = {}) {
    this.canvas = options.canvas;
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) return;

    this.hudCoords = document.querySelector('[data-hud-coords]');
    this.container = this.canvas.parentElement || document.body;

    // Viewport & Scale
    this.width = 0;
    this.height = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    // 3D Scene Parameters
    this.fov = 400;
    this.cameraZ = -600;

    // Rotation & Physics (with smooth damping / lerp)
    this.rotX = 0.35;
    this.rotY = 0.45;
    this.targetRotX = 0.35;
    this.targetRotY = 0.45;
    this.autoSpinSpeed = 0.005;

    // Mouse / Touch Interaction
    this.isDragging = false;
    this.pointerX = 0;
    this.pointerY = 0;
    this.lastPointerX = 0;
    this.lastPointerY = 0;

    // Animation & Optimization
    this.animationId = null;
    this.isVisible = true;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Geometry Generation
    this.coreVertices = [];
    this.coreEdges = [];
    this.particles = [];
    this.rings = [];

    this.initGeometries();
    this.initParticles(90);
    this.initRings();
    this.bindEvents();
    this.resize();

    // Start loop if visible
    if (!this.prefersReducedMotion) {
      this.start();
    } else {
      this.render(); // Single static frame
    }
  }

  initGeometries() {
    // 3D Icosahedron Geometry
    const t = (1.0 + Math.sqrt(5.0)) / 2.0;
    const r = 110; // Radius

    const rawVerts = [
      [-1,  t,  0], [ 1,  t,  0], [-1, -t,  0], [ 1, -t,  0],
      [ 0, -1,  t], [ 0,  1,  t], [ 0, -1, -t], [ 0,  1, -t],
      [ t,  0, -1], [ t,  0,  1], [-t,  0, -1], [-t,  0,  1]
    ];

    this.coreVertices = rawVerts.map(([x, y, z]) => {
      const len = Math.hypot(x, y, z);
      return { x: (x / len) * r, y: (y / len) * r, z: (z / len) * r };
    });

    this.coreEdges = [
      [0, 11], [0, 5], [0, 1], [0, 7], [0, 10],
      [1, 5], [5, 11], [11, 10], [10, 7], [7, 1],
      [3, 9], [3, 4], [3, 2], [3, 6], [3, 8],
      [4, 9], [9, 8], [8, 6], [6, 2], [2, 4],
      [1, 9], [5, 4], [11, 2], [10, 6], [7, 8],
      [0, 1], [3, 4]
    ];
  }

  initParticles(count) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      const radius = 180 + Math.random() * 260;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      this.particles.push({
        x: radius * Math.cos(phi) * Math.cos(theta),
        y: radius * Math.cos(phi) * Math.sin(theta),
        z: radius * Math.sin(phi),
        baseX: radius * Math.cos(phi) * Math.cos(theta),
        baseY: radius * Math.cos(phi) * Math.sin(theta),
        baseZ: radius * Math.sin(phi),
        size: 1.5 + Math.random() * 2.5,
        speed: 0.002 + Math.random() * 0.006,
        color: i % 3 === 0 ? '#34d399' : i % 3 === 1 ? '#38bdf8' : '#818cf8',
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  initRings() {
    this.rings = [
      { radius: 210, tiltX: 0.7, tiltY: 0.2, speed: 0.012, color: 'rgba(52, 211, 153, 0.45)', angle: 0 },
      { radius: 240, tiltX: -0.5, tiltY: 0.8, speed: -0.009, color: 'rgba(56, 189, 248, 0.4)', angle: Math.PI / 3 },
      { radius: 270, tiltX: 0.3, tiltY: -0.9, speed: 0.007, color: 'rgba(129, 140, 248, 0.35)', angle: Math.PI / 1.5 }
    ];
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    this.width = rect.width || window.innerWidth;
    this.height = rect.height || 420;

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.scale(this.dpr, this.dpr);
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      if (this.prefersReducedMotion) this.render();
    }, { passive: true });

    // Pointer rotation controls
    const onPointerMove = (clientX, clientY) => {
      const rect = this.container.getBoundingClientRect();
      const x = clientX - rect.left - rect.width / 2;
      const y = clientY - rect.top - rect.height / 2;

      this.pointerX = x;
      this.pointerY = y;

      if (this.isDragging) {
        const deltaX = clientX - this.lastPointerX;
        const deltaY = clientY - this.lastPointerY;
        this.targetRotY += deltaX * 0.008;
        this.targetRotX += deltaY * 0.008;
        this.lastPointerX = clientX;
        this.lastPointerY = clientY;
      } else {
        this.targetRotY = (x / rect.width) * 0.8;
        this.targetRotX = -(y / rect.height) * 0.8;
      }
    };

    this.container.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      onPointerMove(e.clientX, e.clientY);
    }, { passive: true });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Touch support
    this.container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.lastPointerX = e.touches[0].clientX;
        this.lastPointerY = e.touches[0].clientY;
      }
    }, { passive: true });

    this.container.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    this.container.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    // IntersectionObserver to preserve battery & CPU
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        this.isVisible = entry.isIntersecting;
        if (this.isVisible && !this.animationId && !this.prefersReducedMotion) {
          this.start();
        } else if (!this.isVisible && this.animationId) {
          this.stop();
        }
      }
    }, { threshold: 0.05 });
    observer.observe(this.container);
  }

  project(p) {
    // 3D Euler Rotation
    // Rotate Y (yaw)
    const cosY = Math.cos(this.rotY);
    const sinY = Math.sin(this.rotY);
    const x1 = p.x * cosY + p.z * sinY;
    const y1 = p.y;
    const z1 = -p.x * sinY + p.z * cosY;

    // Rotate X (pitch)
    const cosX = Math.cos(this.rotX);
    const sinX = Math.sin(this.rotX);
    const x2 = x1;
    const y2 = y1 * cosX - z1 * sinX;
    const z2 = y1 * sinX + z1 * cosX;

    // Perspective Projection
    const distance = z2 - this.cameraZ;
    const scale = this.fov / Math.max(distance, 1);
    const screenX = this.width / 2 + x2 * scale;
    const screenY = this.height / 2 + y2 * scale;

    return {
      x: screenX,
      y: screenY,
      z: z2,
      scale,
      visible: distance > 0
    };
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Dynamic HUD Coordinates
    if (this.hudCoords) {
      const degX = Math.round(((this.rotX % (Math.PI * 2)) * 180) / Math.PI);
      const degY = Math.round(((this.rotY % (Math.PI * 2)) * 180) / Math.PI);
      this.hudCoords.textContent = `ROT: ${degX}° / ${degY}°`;
    }

    // 1. Draw 3D Orbital Rings
    for (const ring of this.rings) {
      if (!this.prefersReducedMotion) ring.angle += ring.speed;
      this.ctx.beginPath();
      const points = 48;
      for (let i = 0; i <= points; i++) {
        const theta = (i / points) * Math.PI * 2 + ring.angle;
        const rx = ring.radius * Math.cos(theta);
        const rz = ring.radius * Math.sin(theta);
        // Tilt ring
        const ry = rx * Math.sin(ring.tiltX) + rz * Math.cos(ring.tiltY);
        const proj = this.project({ x: rx, y: ry, z: rz });
        if (i === 0) this.ctx.moveTo(proj.x, proj.y);
        else this.ctx.lineTo(proj.x, proj.y);
      }
      this.ctx.strokeStyle = ring.color;
      this.ctx.lineWidth = 1.2;
      this.ctx.stroke();
    }

    // 2. Project & Sort Core Vertices
    const projectedCore = this.coreVertices.map((v) => this.project(v));

    // Draw Core Edges (Wireframe)
    this.ctx.lineWidth = 1.6;
    for (const [startIdx, endIdx] of this.coreEdges) {
      const p1 = projectedCore[startIdx];
      const p2 = projectedCore[endIdx];
      if (!p1.visible || !p2.visible) continue;

      const avgZ = (p1.z + p2.z) / 2;
      const alpha = Math.max(0.15, Math.min(0.85, (avgZ + 150) / 300));
      this.ctx.strokeStyle = `rgba(52, 211, 153, ${alpha})`;
      this.ctx.beginPath();
      this.ctx.moveTo(p1.x, p1.y);
      this.ctx.lineTo(p2.x, p2.y);
      this.ctx.stroke();
    }

    // Draw Core Nodes (Glowing Vertices)
    for (const p of projectedCore) {
      if (!p.visible) continue;
      const size = Math.max(1, 3.5 * p.scale);
      this.ctx.fillStyle = '#34d399';
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      this.ctx.fill();

      // Outer glow
      this.ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, size * 2.2, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 3. Draw Floating Depth Particles & Constellation Links
    const projectedParticles = this.particles.map((p) => {
      if (!this.prefersReducedMotion) {
        p.pulse += 0.03;
        p.x = p.baseX + Math.sin(p.pulse) * 12;
        p.y = p.baseY + Math.cos(p.pulse) * 12;
      }
      return { proj: this.project(p), p };
    });

    // Proximity connections between particles
    this.ctx.lineWidth = 0.6;
    for (let i = 0; i < projectedParticles.length; i++) {
      for (let j = i + 1; j < projectedParticles.length; j++) {
        const p1 = projectedParticles[i].proj;
        const p2 = projectedParticles[j].proj;
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (dist < 65) {
          const alpha = (1 - dist / 65) * 0.35;
          this.ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    }

    // Render individual particles
    for (const { proj, p } of projectedParticles) {
      if (!proj.visible) continue;
      const pSize = Math.max(0.8, p.size * proj.scale);
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(proj.x, proj.y, pSize, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  update() {
    // Smooth damping (lerp) toward target rotation
    this.rotX += (this.targetRotX - this.rotX) * 0.06;
    this.rotY += (this.targetRotY - this.rotY) * 0.06;

    // Continuous subtle auto-spin
    if (!this.isDragging) {
      this.targetRotY += this.autoSpinSpeed;
    }
  }

  loop() {
    if (!this.isVisible) return;
    this.update();
    this.render();
    this.animationId = requestAnimationFrame(() => this.loop());
  }

  start() {
    if (!this.animationId) {
      this.animationId = requestAnimationFrame(() => this.loop());
    }
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}

/**
 * Interactive 3D Perspective Tilt on Elements
 */
export function initCard3DTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const tiltElements = document.querySelectorAll(
    '.home-card, .post-entry, .guide-card, .topic-pill, .entry-cover-3d'
  );

  tiltElements.forEach((el) => {
    // Wrap card content or set perspective style
    el.style.transformStyle = 'preserve-3d';
    el.style.transition = 'transform 0.15s ease-out, box-shadow 0.25s ease';

    // Add dynamic specular glare overlay
    let glare = el.querySelector('.card-3d-glare');
    if (!glare) {
      glare = document.createElement('div');
      glare.className = 'card-3d-glare';
      glare.setAttribute('aria-hidden', 'true');
      el.appendChild(glare);
    }

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const percentX = (x - centerX) / centerX;
      const percentY = (y - centerY) / centerY;

      const maxRotate = 8.5; // degrees
      const rotX = -percentY * maxRotate;
      const rotY = percentX * maxRotate;

      el.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(12px)`;

      // Dynamic glare gradient position
      if (glare) {
        glare.style.opacity = '1';
        glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.15) 0%, transparent 60%)`;
      }
    };

    const onLeave = () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      if (glare) {
        glare.style.opacity = '0';
      }
    };

    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave, { passive: true });
  });
}

/**
 * 3D Ambient Particle Mesh for Header Banner
 */
export function initHeader3DParticles() {
  const headerCanvas = document.getElementById('header-3d-canvas');
  if (!headerCanvas) return;

  const ctx = headerCanvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let particles = [];
  let animId = null;

  const resize = () => {
    width = headerCanvas.parentElement.clientWidth || window.innerWidth;
    height = headerCanvas.parentElement.clientHeight || 260;
    headerCanvas.width = width;
    headerCanvas.height = height;
  };

  const createParticles = () => {
    particles = [];
    const count = Math.min(Math.floor(width / 25), 45);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: 1 + Math.random() * 2,
        color: i % 2 === 0 ? 'rgba(52, 211, 153, 0.35)' : 'rgba(56, 189, 248, 0.35)'
      });
    }
  };

  const render = () => {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    ctx.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 90) {
          ctx.strokeStyle = `rgba(52, 211, 153, ${(1 - dist / 90) * 0.15})`;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Update & draw particles
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    animId = requestAnimationFrame(render);
  };

  resize();
  createParticles();
  window.addEventListener('resize', () => { resize(); createParticles(); }, { passive: true });

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animId = requestAnimationFrame(render);
  }
}
