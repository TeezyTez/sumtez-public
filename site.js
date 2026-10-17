(() => {
  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
  const links = [...document.querySelectorAll('.header nav a')];
  if (location.pathname.endsWith('tools.html')) return;
  const current = location.pathname.endsWith('ainovel.html') ? '#work' : location.pathname.endsWith('guide.html') ? '#guides' : null;
  if (current) { links.find(link => link.hash === current)?.setAttribute('aria-current', 'page'); return; }
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) links.forEach(link => {
      if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, {rootMargin: '-12% 0px -60% 0px'});
  document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section));
})();
