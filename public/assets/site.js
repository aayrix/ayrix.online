const introRoot = document.documentElement;
const intro = document.getElementById('intro');

if (intro) {
  if (!introRoot.classList.contains('intro-on')) {
    intro.remove();
  } else {
    const pageElements = [...document.body.children].filter((element) => element !== intro);
    const previousInert = pageElements.map((element) => element.inert);
    pageElements.forEach((element) => { element.inert = true; });

    const skipButton = intro.querySelector('.intro-skip');
    let leaving = false;
    let finished = false;
    let timer;

    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(timer);
      intro.remove();
      introRoot.classList.remove('intro-on', 'intro-reveal');
      pageElements.forEach((element, index) => { element.inert = previousInert[index]; });
      try { sessionStorage.setItem('ayrix-intro', '1'); } catch {}
    };

    const leave = () => {
      if (leaving || finished) return;
      leaving = true;
      window.clearTimeout(timer);
      introRoot.classList.add('intro-reveal');
      intro.classList.add('leave');
      const lastPanel = intro.querySelector('.intro-panel--bottom');
      lastPanel.addEventListener('transitionend', (event) => {
        if (event.target === lastPanel && event.propertyName === 'transform') finish();
      }, { once: true });
      window.setTimeout(finish, 1200);
    };

    timer = window.setTimeout(leave, 1900);
    intro.addEventListener('click', leave);
    skipButton.addEventListener('click', (event) => {
      event.stopPropagation();
      leave();
    });
    window.addEventListener('keydown', (event) => {
      if (!leaving && (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        leave();
      }
    });
    skipButton.focus({ preventScroll: true });
  }
}

const user = 'aliyanniazi370';
const host = 'gmail.com';
const address = `${user}@${host}`;
document.querySelectorAll('[data-copy-email]').forEach((button) => button.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(address);
    button.textContent = 'Email copied';
    window.setTimeout(() => { button.textContent = 'Copy email'; }, 1500);
  } catch { button.textContent = 'Copy unavailable'; }
}));
document.querySelectorAll('[data-send-email]').forEach((link) => link.addEventListener('click', (event) => {
  event.preventDefault();
  window.location.href = `mailto:${address}`;
}));

document.querySelectorAll('a[target="_blank"]').forEach((link) => {
  const rel = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
  rel.add('noopener'); rel.add('noreferrer');
  link.setAttribute('rel', [...rel].join(' '));
});

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
  image.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
});

const searchOpeners = document.querySelectorAll('[data-search-open]');
if (searchOpeners.length) {
  const palette = document.createElement('dialog');
  palette.className = 'search-palette';
  palette.setAttribute('aria-label', 'Search Ayrix guides');
  palette.innerHTML = '<form method="dialog" class="search-palette__form"><label for="site-search-input">Search guides</label><input id="site-search-input" type="search" autocomplete="off" placeholder="Linux, GitHub, Codex…"><button class="search-close" aria-label="Close search">Close</button></form><p class="visually-hidden" data-search-status aria-live="polite"></p><ul class="search-results" id="site-search-results"></ul>';
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
