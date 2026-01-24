(function () {
  const toggle = document.querySelector('[data-mobile-toggle]');
  const nav = document.querySelector('[data-navlinks]');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
    });
  }

  // Set current nav link automatically
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('a[data-nav]').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === path) a.setAttribute('aria-current', 'page');
  });

  const bubble = document.querySelector('[data-bubble]');
  if (bubble) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      const start = performance.now();
      const animate = (time) => {
        const t = (time - start) / 1000;
        const scale = 1 + (Math.sin(t * 2) * 0.04);
        bubble.style.transform = `scale(${scale})`;
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }
})();
