(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mount = () => {
    if (document.querySelector('.signal-loader')) return;
    const loader = document.createElement('div');
    loader.className = 'signal-loader';
    loader.setAttribute('aria-hidden', 'true');
    loader.innerHTML = '<div class="signal-loader__grid"></div><div class="signal-loader__core"><span class="signal-loader__eyebrow">AYRIX / INITIALIZING</span><strong class="signal-loader__mark">A</strong><span class="signal-loader__status">LOADING KNOWLEDGE BASE</span><div class="signal-loader__line"><i></i></div><span class="signal-loader__count">000</span></div>';
    document.body.prepend(loader);
    const count = loader.querySelector('.signal-loader__count');
    const line = loader.querySelector('.signal-loader__line i');
    const duration = reduced ? 0 : 1150;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      count.textContent = String(Math.round(progress * 100)).padStart(3, '0');
      line.style.transform = `scaleX(${progress})`;
      if (progress < 1) requestAnimationFrame(tick);
      else {
        document.documentElement.classList.add('signal-ready');
        loader.classList.add('signal-loader--exit');
        window.setTimeout(() => loader.remove(), reduced ? 0 : 650);
      }
    };
    requestAnimationFrame(tick);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
