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
