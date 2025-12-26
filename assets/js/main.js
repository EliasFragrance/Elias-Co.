// Elias & Co — basic site JS: active nav + reveal on scroll

(function () {
  // Active nav
  const page = document.body.getAttribute("data-page");
  if (page) {
    document.querySelectorAll(".nav-links a").forEach(a => {
      const key = a.getAttribute("data-nav");
      if (key === page) a.classList.add("active");
    });
  }

  // Reveal on scroll
  const els = Array.from(document.querySelectorAll("[data-reveal]"));
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
})();
