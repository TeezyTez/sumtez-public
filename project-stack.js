/* A compact gallery. Only its viewport scrolls; the page and side gutters stay free. */
(() => {
  const gallery = document.querySelector('.project-gallery');
  const viewport = document.querySelector('#published-products');
  const stage = gallery?.querySelector('.project-stack-stage');
  const cards = [...(stage?.querySelectorAll('.project-stack-card') || [])];
  if (!gallery || !viewport || !stage || !cards.length) return;
  const surfaces = cards.map(card => card.querySelector('.project-stack-surface'));
  const nav = gallery.querySelector('.project-stack-nav');
  const prev = nav.querySelector('[data-stack-prev]');
  const next = nav.querySelector('[data-stack-next]');
  const play = nav.querySelector('[data-stack-play]');
  const counter = nav.querySelector('.project-stack-count');
  const status = gallery.querySelector('.project-stack-status');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const clamp = value => Math.max(0, Math.min(1, value));
  let index = 0, step = 500, compact = false, hovered = false, focused = false;
  let userPaused = false, touchPaused = false, inView = false, completed = false;
  let frame = 0, resizeFrame = 0, lastTime = 0, resumeAt = performance.now() + 2200;
  let nextRest = step, measuring = false, fraction = 0;
  nav.hidden = false;

  const motionAllowed = () => !reduced.matches && document.documentElement.dataset.homeMotion !== 'off';
  const shouldRun = () => compact && motionAllowed() && finePointer.matches && !userPaused && !touchPaused && !hovered && !focused && inView && !document.hidden && !completed;
  function reflectState() {
    const paused = userPaused || touchPaused || !motionAllowed() || !finePointer.matches || completed;
    play.textContent = paused ? '播放' : '暂停';
    play.setAttribute('aria-label', paused ? '播放作品自动滚动' : '暂停作品自动滚动');
    play.setAttribute('aria-pressed', String(!paused));
    play.disabled = !compact || !motionAllowed() || !finePointer.matches;
    status.textContent = !compact ? '逐项浏览' : completed ? '已看完全部作品' : paused ? '自动滚动已暂停' : hovered || focused ? '阅读中，自动滚动暂停' : '缓慢自动滚动 · 移入暂停';
  }
  function paint() {
    const progress = compact ? viewport.scrollTop / step : index;
    if (compact) {
      const animate = motionAllowed();
      cards.forEach((card, i) => {
        const distance = i - progress;
        const incoming = clamp((distance - .12) / .88);
        const outgoing = clamp(-distance);
        const y = distance >= 0 ? incoming * (step - 46) : -outgoing * 14;
        card.style.transform = `translateY(${y}px) scale(${animate && distance < 0 ? 1 - outgoing * .035 : 1})`;
        card.style.opacity = distance > 1.12 || distance < -1.12 ? '0' : '1';
        card.style.pointerEvents = distance > 1.12 || distance < -1.12 ? 'none' : '';
      });
      index = Math.max(0, Math.min(cards.length - 1, Math.floor(progress + .52)));
    } else {
      index = 0;
      cards.forEach((card, i) => { if (card.getBoundingClientRect().top <= innerHeight * .3) index = i; });
    }
    const text = `${index + 1} / ${cards.length}`;
    if (counter.textContent !== text) counter.textContent = text;
    prev.setAttribute('aria-disabled', String(index === 0));
    next.setAttribute('aria-disabled', String(index === cards.length - 1));
  }
  function stop() { cancelAnimationFrame(frame); frame = 0; lastTime = 0; fraction = 0; }
  function tick(time) {
    frame = 0;
    if (!shouldRun()) { lastTime = 0; return; }
    const elapsed = lastTime ? Math.min(50, time - lastTime) : 0;
    lastTime = time;
    if (time >= resumeAt) {
      const maximum = (cards.length - 1) * step;
      const movement = elapsed * .025 + fraction;
      const pixels = Math.floor(movement);
      fraction = movement - pixels;
      const position = Math.min(maximum, viewport.scrollTop + pixels);
      viewport.scrollTop = position;
      if (position >= nextRest - 1) {
        resumeAt = time + 3000;
        nextRest = Math.min(maximum, nextRest + step);
      }
      if (position >= maximum - 1) { completed = true; reflectState(); stop(); paint(); return; }
    }
    frame = requestAnimationFrame(tick);
  }
  function reconcile() {
    reflectState();
    if (shouldRun()) { if (!frame) {
      nextRest = Math.min((cards.length - 1) * step, (Math.floor(viewport.scrollTop / step) + 1) * step);
      lastTime = 0; frame = requestAnimationFrame(tick);
    } }
    else stop();
  }
  function measure() {
    resizeFrame = 0;
    if (measuring) return;
    measuring = true;
    const progress = compact ? viewport.scrollTop / step : index;
    const previousWidth = viewport.clientWidth;
    gallery.classList.remove('is-compact');
    viewport.style.removeProperty('height');
    cards.forEach(card => { card.style.transform = ''; card.style.opacity = ''; card.style.pointerEvents = ''; });
    const height = Math.ceil(Math.max(...surfaces.map(surface => surface.getBoundingClientRect().height)));
    step = height + 56;
    // At large text sizes or short windows, natural flow keeps every line accessible.
    compact = step <= Math.max(560, innerHeight * .82) && previousWidth > 0;
    gallery.style.setProperty('--stack-height', `${step}px`);
    gallery.style.setProperty('--stack-card-height', `${height}px`);
    gallery.style.setProperty('--stack-track-height', `${step * cards.length}px`);
    gallery.classList.toggle('is-compact', compact);
    cards.forEach((card, i) => { card.style.zIndex = String(i + 1); });
    if (compact) viewport.scrollTop = Math.min(cards.length - 1, progress) * step;
    nextRest = (Math.floor(viewport.scrollTop / step) + 1) * step;
    resumeAt = performance.now() + 2200;
    measuring = false;
    paint(); reconcile();
  }
  function scheduleMeasure() { if (!resizeFrame) resizeFrame = requestAnimationFrame(measure); }
  function go(target) {
    const i = Math.max(0, Math.min(cards.length - 1, target));
    completed = false;
    resumeAt = performance.now() + 5000;
    nextRest = (i + 1) * step;
    if (compact) viewport.scrollTo({top: i * step, behavior: motionAllowed() ? 'smooth' : 'instant'});
    else { index = i; cards[i].scrollIntoView({block: 'start', behavior: 'instant'}); paint(); }
    reconcile();
  }
  prev.addEventListener('click', () => { if (index > 0) go(index - 1); });
  next.addEventListener('click', () => { if (index < cards.length - 1) go(index + 1); });
  play.addEventListener('click', () => {
    if (userPaused || touchPaused || completed) {
      userPaused = false; touchPaused = false;
      if (completed) { completed = false; viewport.scrollTop = 0; nextRest = step; paint(); }
      resumeAt = performance.now() + 2000;
    } else userPaused = true;
    reconcile();
  });
  gallery.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') { hovered = true; reconcile(); } });
  gallery.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') { hovered = false; resumeAt = performance.now() + 1600; reconcile(); } });
  gallery.addEventListener('pointerdown', event => { if (event.pointerType === 'touch') { touchPaused = true; reconcile(); } }, {passive: true});
  gallery.addEventListener('focusin', event => {
    if (!event.target.matches(':focus-visible')) return;
    focused = true; reconcile();
    const card = event.target.closest('.project-stack-card');
    if (card && compact) { viewport.scrollTo({top: cards.indexOf(card) * step, behavior: 'instant'}); paint(); }
  });
  gallery.addEventListener('focusout', event => {
    if (!gallery.contains(event.relatedTarget)) { focused = false; resumeAt = performance.now() + 1600; reconcile(); }
  });
  // Native scroll chaining is intentional: the sides and both ends can leave the gallery.
  viewport.addEventListener('scroll', paint, {passive: true});
  addEventListener('scroll', () => { if (!compact) paint(); }, {passive: true});
  viewport.addEventListener('wheel', () => { resumeAt = performance.now() + 5000; }, {passive: true});
  gallery.addEventListener('keydown', event => {
    if (event.key === 'Tab' || event.target.closest('a,button')) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') { event.preventDefault(); go(index + 1); }
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') { event.preventDefault(); go(index - 1); }
  });
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { inView = entries[0].isIntersecting; reconcile(); }, {threshold: .25}).observe(viewport);
  else inView = true;
  new MutationObserver(() => { paint(); reconcile(); }).observe(document.documentElement, {attributes: true, attributeFilter: ['data-home-motion']});
  reduced.addEventListener('change', () => { paint(); reconcile(); });
  finePointer.addEventListener('change', reconcile);
  new ResizeObserver(scheduleMeasure).observe(gallery);
  addEventListener('resize', scheduleMeasure, {passive: true});
  addEventListener('pageshow', scheduleMeasure);
  document.fonts?.ready.then(scheduleMeasure);
  document.addEventListener('visibilitychange', reconcile);
  measure();
})();
