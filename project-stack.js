/* Progressive enhancement: native document scroll, no wheel or touch interception. */
(() => {
  const work = document.querySelector('#work');
  const list = document.querySelector('#published-products');
  const cards = [...(list?.querySelectorAll('.project-stack-card') || [])];
  const nav = work?.querySelector('.project-stack-nav');
  if (!nav || !cards.length) return;
  const surfaces = cards.map(card => card.querySelector('.project-stack-surface'));
  const prev = nav.querySelector('[data-stack-prev]');
  const next = nav.querySelector('[data-stack-next]');
  const counter = nav.querySelector('.project-stack-count');
  const hint = nav.querySelector('.project-stack-hint');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = value => Math.max(0, Math.min(1, value));
  let starts = [], index = -1, frame = 0, resizeFrame = 0, enabled = false, top = 90;
  nav.hidden = false;

  function update() {
    frame = 0;
    if (document.hidden || !starts.length) return;
    let current = 0;
    // A card becomes current as it fills most of the viewing area.
    for (let i = 1; i < starts.length; i++) {
      if (scrollY >= starts[i] - Math.min(cards[i].offsetHeight * .3, 160)) current = i;
    }
    surfaces.forEach((surface, i) => {
      const distance = i < starts.length - 1 ? starts[i + 1] - starts[i] : 1;
      const progress = i < starts.length - 1 ? clamp((scrollY - starts[i] - distance * .16) / (distance * .84)) : 0;
      surface.style.transform = enabled ? `translateY(${-progress * 18}px) scale(${1 - progress * .045})` : '';
    });
    if (current !== index) {
      index = current;
      counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
      hint.textContent = index === cards.length - 1 ? '继续向下，探索工具箱 ↓' : '向下滚动，翻看作品 ↓';
      // Keep focused controls available while the selected card changes.
      prev.setAttribute('aria-disabled', String(index === 0));
      next.setAttribute('aria-disabled', String(index === cards.length - 1));
    }
  }
  function schedule() {
    if (!frame && !document.hidden) frame = requestAnimationFrame(update);
  }
  function measure() {
    resizeFrame = 0;
    work.classList.remove('has-project-stack');
    surfaces.forEach(surface => { surface.style.transform = ''; });
    top = nav.offsetHeight + 24;
    work.style.setProperty('--stack-top', `${top}px`);
    const tallest = Math.max(...cards.map(card => card.offsetHeight));
    enabled = !reduced.matches && document.documentElement.dataset.homeMotion !== 'off' && tallest + top + 20 <= innerHeight;
    starts = cards.map(card => card.getBoundingClientRect().top + scrollY - top);
    cards.forEach((card, i) => { card.style.zIndex = String(i + 1); });
    work.classList.toggle('has-project-stack', enabled);
    update();
  }
  function scheduleMeasure() {
    if (!resizeFrame) resizeFrame = requestAnimationFrame(measure);
  }
  function go(target, instant = false) {
    const i = Math.max(0, Math.min(cards.length - 1, target));
    if (!starts.length) return;
    scrollTo({top: Math.max(0, starts[i]), behavior: instant || !enabled ? 'instant' : 'smooth'});
  }
  prev.addEventListener('click', () => { if (index > 0) go(index - 1); });
  next.addEventListener('click', () => { if (index < cards.length - 1) go(index + 1); });
  next.addEventListener('keydown', event => {
    if (event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault();
      cards[Math.max(0, index)].querySelector('a').focus({preventScroll: true});
    }
  });
  // Tabbing to a covered card reveals it; links stay reachable in document order.
  list.addEventListener('focusin', event => {
    const card = event.target.closest('.project-stack-card');
    if (card && event.target.matches(':focus-visible') && (enabled || cards.indexOf(card) !== index)) go(cards.indexOf(card), true);
  });
  addEventListener('scroll', schedule, {passive: true});
  addEventListener('resize', scheduleMeasure, {passive: true});
  addEventListener('pageshow', scheduleMeasure);
  reduced.addEventListener('change', scheduleMeasure);
  new MutationObserver(scheduleMeasure).observe(document.documentElement, {attributes: true, attributeFilter: ['data-home-motion']});
  const observer = new ResizeObserver(scheduleMeasure);
  surfaces.forEach(surface => observer.observe(surface));
  observer.observe(nav);
  document.fonts?.ready.then(scheduleMeasure);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
    else scheduleMeasure();
  });
  measure();
})();
