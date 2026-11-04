/* Shared navigation and restrained, optional motion. No content depends on it. */
(() => {
  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
  const links = [...document.querySelectorAll('.header nav a')];
  const page = location.pathname.split('/').pop();
  const products = ['ainovel.html','declaration.html','bl-reco.html','edi-agent.html','cloud-agent.html','codegen-verify.html'];
  const current = products.includes(page) ? '#work' : page === 'guide.html' ? '#guides' : page === 'tools.html' ? 'tools.html' : null;
  if (current) {
    links.forEach(link => {
      const active = current === 'tools.html' ? link.pathname.endsWith('tools.html') : link.hash === current;
      if (active) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
    });
  } else if ('IntersectionObserver' in window) {
    // Resolve location from viewport position, including the tools/about wrappers.
    const sections = ['work','tools','guides','about'].map(id => document.getElementById(id)).filter(Boolean);
    let ticking = false;
    const updateLocation = () => {
      const active = [...sections].reverse().find(section => section.getBoundingClientRect().top <= innerHeight * .4);
      links.forEach(link => {
        if (active && link.hash === '#' + active.id) link.setAttribute('aria-current','location');
        else link.removeAttribute('aria-current');
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(updateLocation); }
    }, {passive:true});
    updateLocation();
  }

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // Animate once on arrival. Offscreen content remains fully readable without JS.
  let revealObserver;
  const stopReveals = () => {
    revealObserver?.disconnect();
    document.querySelectorAll('.reveal-in').forEach(node => node.classList.remove('reveal-in'));
  };
  if (!reduced.matches && 'IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('reveal-in');
        revealObserver.unobserve(entry.target);
      });
    }, {threshold:.12});
    document.querySelectorAll('.section-heading,.published-product,.project-card,.future-project,.guide-card,.about-heading,.capability-grid article').forEach(node => revealObserver.observe(node));
  }

  reduced.addEventListener('change', () => { if (reduced.matches) stopReveals(); });
})();
