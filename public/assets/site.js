import { AyrixUniverse, initCard3DTilt, init3DEntrance } from '/assets/js/ayrix-universe.js';

// ----------------------------------------------------
// 1. 3D Digital Universe Initialization
// ----------------------------------------------------
let universe = null;
try {
  universe = new AyrixUniverse();
} catch (e) {
  console.warn('[Ayrix] Failed to initialize 3D Universe:', e);
}

// ----------------------------------------------------
// 2. 3D Entrance Sequence & Skips
// ----------------------------------------------------
init3DEntrance();

// ----------------------------------------------------
// 3. Email Utilities & Haptic Feedback
// ----------------------------------------------------
const user = 'aliyanniazi370';
const host = 'gmail.com';
const address = `${user}@${host}`;

document.querySelectorAll('[data-copy-email]').forEach((button) => {
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(address);
      button.textContent = 'Email copied';
      window.setTimeout(() => { button.textContent = 'Copy email'; }, 1500);
    } catch {
      button.textContent = 'Copy unavailable';
    }
  });
});

document.querySelectorAll('[data-send-email]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = `mailto:${address}`;
  });
});

// ----------------------------------------------------
// 4. Secure External Links
// ----------------------------------------------------
document.querySelectorAll('a[target="_blank"]').forEach((link) => {
  const rel = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
  rel.add('noopener');
  rel.add('noreferrer');
  link.setAttribute('rel', [...rel].join(' '));
});

// ----------------------------------------------------
// 5. Code Block Copy Buttons
// ----------------------------------------------------
for (const pre of document.querySelectorAll('.post-content pre')) {
  const code = pre.querySelector('code');
  if (!code) continue;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'copy-code-button';
  button.textContent = 'Copy';
  button.setAttribute('aria-label', 'Copy code block');
  const status = document.createElement('span');
  status.className = 'visually-hidden';
  status.setAttribute('aria-live', 'polite');
  pre.append(button, status);

  button.addEventListener('click', async () => {
    try {
      const value = code.innerText.replace(/^\$ /gm, '');
      await navigator.clipboard.writeText(value);
      button.textContent = 'Copied';
      status.textContent = 'Code copied to clipboard';
      window.setTimeout(() => { button.textContent = 'Copy'; status.textContent = ''; }, 1500);
    } catch {
      status.textContent = 'Clipboard access is unavailable';
    }
  });
}

// ----------------------------------------------------
// 6. Reading Progress Bar (Fallback / Supporting)
// ----------------------------------------------------
if (document.querySelector('.post-single')) {
  const progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('role', 'progressbar');
  progress.setAttribute('aria-label', 'Article reading progress');
  progress.setAttribute('aria-valuemin', '0');
  progress.setAttribute('aria-valuemax', '100');
  document.body.append(progress);

  if (!CSS.supports('animation-timeline: scroll()')) {
    const update = () => {
      const doc = document.documentElement;
      const amount = Math.min(1, doc.scrollTop / Math.max(1, doc.scrollHeight - doc.clientHeight));
      progress.style.setProperty('--progress', amount);
      progress.setAttribute('aria-valuenow', String(Math.round(amount * 100)));
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }
}

// ----------------------------------------------------
// 7. 3D Lightbox for Images
// ----------------------------------------------------
const dialog = document.createElement('dialog');
dialog.className = 'image-lightbox';
dialog.innerHTML = '<form method="dialog"><button class="lightbox-close" aria-label="Close image">Close</button></form><img alt="">';
document.body.append(dialog);
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
dialog.querySelector('img').addEventListener('click', () => dialog.close());

document.querySelectorAll('.post-content figure img').forEach((image) => {
  image.tabIndex = 0;
  image.setAttribute('role', 'button');
  image.setAttribute('aria-label', `Enlarge image: ${image.alt || 'article image'}`);
  const open = () => {
    const enlarged = dialog.querySelector('img');
    enlarged.src = image.currentSrc || image.src;
    enlarged.alt = image.alt;
    dialog.showModal();
    dialog.querySelector('button').focus();
  };
  image.addEventListener('click', open);
  image.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      open();
    }
  });
});

// ----------------------------------------------------
// 8. 3D Spatial Search Command Palette
// ----------------------------------------------------
let openSearchPalette = null;
const searchOpeners = document.querySelectorAll('[data-search-open]');
if (searchOpeners.length) {
  const palette = document.createElement('dialog');
  palette.className = 'search-palette';
  palette.setAttribute('aria-label', 'Search Ayrix guides');
  palette.innerHTML = `
    <form method="dialog" class="search-palette__form">
      <label for="site-search-input">3D Universe Search</label>
      <input id="site-search-input" type="search" autocomplete="off" placeholder="Search Linux, Codex, GitHub, AI coding...">
      <button class="search-close" aria-label="Close search">Close</button>
    </form>
    <p class="visually-hidden" data-search-status aria-live="polite"></p>
    <ul class="search-results" id="site-search-results"></ul>
  `;
  document.body.append(palette);
  const input = palette.querySelector('input');
  const results = palette.querySelector('.search-results');
  const status = palette.querySelector('[data-search-status]');

  let entries = [];
  let returnFocus = null;
  let activeIndex = -1;
  let loadPromise;

  const load = () => loadPromise ||= fetch('/data/posts.json').then((response) => response.ok ? response.json() : []).catch(() => []);

  const open = async (trigger) => {
    returnFocus = trigger || document.activeElement;
    palette.showModal();
    input.focus();
    entries = await load();
    render(input.value);
  };
  openSearchPalette = open;

  const render = (query) => {
    const term = query.trim().toLowerCase();
    const matches = entries.filter((post) => !term || `${post.title} ${post.description} ${post.tags.join(' ')}`.toLowerCase().includes(term)).slice(0, 8);
    results.replaceChildren();
    activeIndex = -1;

    for (const post of matches) {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = `/posts/${encodeURIComponent(post.slug)}/`;
      const title = document.createElement('strong');
      title.textContent = post.title;
      const summary = document.createElement('span');
      summary.textContent = post.description;
      item.append(title, summary);
      link.append(item);
      results.append(link);
    }
    status.textContent = matches.length ? `${matches.length} guides found` : 'No guides found';
  };

  searchOpeners.forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); open(link); }));
  input.addEventListener('input', () => render(input.value));
  input.addEventListener('keydown', (event) => {
    const links = [...results.querySelectorAll('a')];
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      activeIndex = (activeIndex + (event.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
      links[activeIndex]?.focus();
    }
  });

  results.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const links = [...results.querySelectorAll('a')];
    const current = links.indexOf(document.activeElement);
    const next = (current + (event.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
    links[next]?.focus();
  });

  palette.addEventListener('close', () => returnFocus?.focus());

  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k' || event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
      event.preventDefault();
      open(document.activeElement);
    }
  });
}

// ----------------------------------------------------
// 9. Interactive 3D Perspective Tilt on All Cards
// ----------------------------------------------------
initCard3DTilt();

// ----------------------------------------------------
// 10. Mount 3D Tactile Floating Navigation Dock
// ----------------------------------------------------
if (!document.querySelector('.floating-3d-dock')) {
  const dock = document.createElement('nav');
  dock.className = 'floating-3d-dock';
  dock.setAttribute('aria-label', '3D Quick Navigation');
  dock.innerHTML = `
    <a href="/"><span aria-hidden="true">✦</span> Home</a>
    <a href="/posts/"><span aria-hidden="true">◈</span> Guides</a>
    <a href="/categories/"><span aria-hidden="true">⬡</span> Categories</a>
    <button type="button" data-dock-search aria-label="Open Search"><span aria-hidden="true">⌕</span> Search</button>
    <button type="button" data-dock-top aria-label="Scroll to top"><span aria-hidden="true">▲</span> Top</button>
  `;
  document.body.appendChild(dock);

  dock.querySelector('[data-dock-top]')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  dock.querySelector('[data-dock-search]')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof openSearchPalette === 'function') {
      openSearchPalette(e.currentTarget);
    } else {
      window.location.href = '/posts/';
    }
  });
}

// ----------------------------------------------------
// 11. Homepage Hero 3D HUD & Drag Stage
// ----------------------------------------------------
const homeInfo = document.querySelector('.home-info');
if (homeInfo && !document.getElementById('ayrix-3d-hero')) {
  const hero3D = document.createElement('div');
  hero3D.className = 'ayrix-3d-hero';
  hero3D.id = 'ayrix-3d-hero';
  hero3D.setAttribute('aria-label', '3D Technological Sculpture Stage');
  hero3D.innerHTML = `
    <div class="ayrix-3d-hud">
      <span class="hud-tag">3D CYBER CORE // ONLINE</span>
      <span class="hud-hint">DRAG TO ROTATE SCULPTURE</span>
      <span class="hud-coords" data-hud-coords>ROT: 0° / 0°</span>
    </div>
  `;
  homeInfo.insertAdjacentElement('afterend', hero3D);
}
