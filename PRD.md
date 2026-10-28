# PRD: 3D Technical Publication & Ralph Autonomous Loop

## Vision & Objectives
Convert Ayrix (`ayrix.online`) into a cutting-edge, high-performance, accessible 3D technical publication featuring interactive WebGL 3D scenes, multi-dimensional cards with real-time perspective tilt and glare, properly formatted high-resolution visual covers and article imagery, managed continuously through the autonomous Ralph Loop pattern.

---

## Autonomous Ralph Loop Architecture
The Ralph Loop pattern (named after Ralph Wiggum by Geoffrey Huntley) achieves continuous, crash-resilient autonomy through external file-based state and verification:
- `PRD.md`: Backlog of user stories, discrete tasks, acceptance criteria, and machine-verifiable gates.
- `progress.txt`: Append-only chronological record of task completions, git commit hashes, test results, and next actions.
- `scripts/ralph_loop.sh`: Deterministic shell runner that validates workspace state, executes builds and checks, gates promotions, and enforces atomic commits.

---

## Tasks & Milestones

### Epic 1: Ralph Loop Framework & Static Build Idempotency
- [x] **TASK-101**: Fix title and description idempotency in `tools/build.mjs` to prevent category/tag title duplication.
- [x] **TASK-102**: Create `PRD.md` specifying tasks, acceptance criteria, and verification commands.
- [x] **TASK-103**: Create `progress.txt` for iteration tracking and memory persistence.
- [x] **TASK-104**: Create `scripts/ralph_loop.sh` and root `./ralph.sh` runner script with automated check and commit pipeline.

### Epic 2: Visual Assets & Formatted Photos
- [ ] **TASK-201**: Generate bespoke, high-resolution 3D-styled covers (`1536x1024` WebP + PNG) for:
  - `cursor-ai-complete-developer-guide` (`cursor-ai-cover`)
  - `my-first-post` (`my-first-post-cover`)
  - `codex-cli-ubuntu-guide` (`codex-cover`)
  - `github-cli-complete-guide` (`github-cli-cover`)
- [ ] **TASK-202**: Register new cover assets and dimensions in `tools/build.mjs` `IMAGE_DIMENSIONS`.
- [ ] **TASK-203**: Update all 11 guide HTML templates under `public/posts/` with formatted `<figure class="entry-cover">` using `<picture>` elements, WebP sources, semantic `figcaption`, and explicit dimensions to avoid Layout Shift (CLS).
- [ ] **TASK-204**: Upgrade inline article images and illustrations with 3D glass borders, subtle emerald glow, responsive centering, and lightbox integration.

### Epic 3: Core 3D Website Transformation (WebGL & Interactive 3D Canvas)
- [ ] **TASK-301**: Implement high-performance, self-contained 3D WebGL engine (`public/assets/js/ayrix-3d.js`) compatible with strict CSP (`default-src 'self'`).
- [ ] **TASK-302**: Create interactive 3D Hero scene for the homepage:
  - Rotating cyber-geometric icosahedron / tech core with dynamic wireframes and vertices.
  - Floating 3D orbital rings spinning on multiple axes with node beacons.
  - Interactive 3D particle constellation responding to mouse/pointer physics and viewport parallax.
  - Interactive pointer controls (smooth lerp rotation on drag/move).
- [ ] **TASK-303**: Create subtle 3D interactive ambient particle canvas on article and category headers for immersive technical aesthetics.
- [ ] **TASK-304**: Add performance guardrails: `IntersectionObserver` auto-pausing when canvas is out of viewport, `requestAnimationFrame` battery optimization, and complete `prefers-reduced-motion` compliance.

### Epic 4: Interactive 3D Perspective Tilt & Multi-Layer Depth
- [ ] **TASK-401**: Implement CSS 3D perspective system (`perspective: 1000px`, `transform-style: preserve-3d`) in `public/assets/css/ayrix-redesign.css` and `site.css`.
- [ ] **TASK-402**: Add dynamic mouse tracking 3D tilt engine with realistic radial specular glare on all post cards, guide cards, and topic badges.
- [ ] **TASK-403**: Provide tactile multi-layer 3D depth elevations (`translateZ` layers for icons, titles, badges, and covers).
- [ ] **TASK-404**: Add 3D interactive floating navigation controls / quick status dock.

### Epic 5: Verification, Contrast, Performance & Static Validation
- [ ] **TASK-501**: Run `node tools/build.mjs` to regenerate manifest `data/posts.json`, sitemaps, feeds, and updated pages.
- [ ] **TASK-502**: Run `node tools/check.mjs` to ensure all HTML pages and assets pass static validation.
- [ ] **TASK-503**: Run `node tools/contrast-check.mjs` to guarantee WCAG AA / AAA contrast across dark and light modes.
- [ ] **TASK-504**: Verify zero external network requests under strict CSP.

---

## Machine-Verifiable Acceptance Commands
```sh
node tools/build.mjs
node tools/check.mjs
node tools/contrast-check.mjs
./ralph.sh verify
```
