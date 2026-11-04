/* A flat scanline signature. Animation runs only while visible, at 30 fps. */
(() => {
  const signature = document.querySelector('.signature');
  const toggle = document.querySelector('#home-motion-toggle');
  if (!signature || !toggle) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const cut = signature.querySelector('#signature-cut path');
  const band = signature.querySelector('.signature-shift svg');
  const light = signature.querySelector('.signature-light');
  const entries = [...document.querySelectorAll('.work-entry')];
  let enabled = !reduced.matches;
  let manuallyPaused = false;
  let inView = true;
  let frame = 0;
  let lastFrame = 0;
  let bounds;
  let pointerActive = false;
  let pointerY = 110;
  let pointerX = 0;
  let y = 108;
  let shift = 14;
  let start = performance.now();
  const activeAnimations = new Set();
  const measure = () => { bounds = signature.getBoundingClientRect(); };
  measure();
  const resize = new ResizeObserver(measure);
  resize.observe(signature);
  addEventListener('scroll', measure, {passive:true});
  signature.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || !enabled) return;
    pointerActive = true;
    pointerY = Math.max(10, Math.min(222, (event.clientY - bounds.top) / bounds.height * 264));
    pointerX = ((event.clientX - bounds.left) / bounds.width - .5) * 46;
  }, {passive:true});
  signature.addEventListener('pointerleave', () => { pointerActive = false; });
  const paint = () => {
    const top = y.toFixed(2), bottom = (y + 22).toFixed(2);
    cut.setAttribute('d', `M0 0H1200V${top}H0ZM0 ${bottom}H1200V264H0Z`);
    band.setAttribute('y', top);
    band.setAttribute('height', '22');
    band.setAttribute('viewBox', `0 ${top} 1200 22`);
    band.setAttribute('x', shift.toFixed(2));
    if (light) {
      light.setAttribute('y1', bottom); light.setAttribute('y2', bottom);
      light.style.opacity = String(pointerActive ? .32 : .14);
    }
  };
  function tick(now) {
    frame = 0;
    if (!enabled || !inView || document.hidden) return;
    frame = requestAnimationFrame(tick);
    if (now - lastFrame < 32) return;
    lastFrame = now;
    const elapsed = now - start;
    const phase = (elapsed % 7200) / 7200;
    const autoY = 12 + phase * 218;
    const autoShift = (Math.sin(elapsed / 440) * 12 + Math.sin(elapsed / 1100) * 7) * Math.sin(phase * Math.PI);
    y += ((pointerActive ? pointerY : autoY) - y) * .14;
    shift += ((pointerActive ? pointerX + Math.sin(elapsed / 420) * 6 : autoShift) - shift) * .17;
    paint();
  }
  function run() { if (!frame && enabled && inView && !document.hidden) frame = requestAnimationFrame(tick); }
  function cancel() { if (frame) cancelAnimationFrame(frame); frame = 0; }
  function apply() {
    document.documentElement.dataset.homeMotion = enabled ? 'on' : 'off';
    toggle.hidden = false;
    toggle.textContent = enabled ? 'Ⅱ' : '▷';
    toggle.setAttribute('aria-label', enabled ? '暂停动态效果' : '播放动态效果');
    toggle.setAttribute('aria-pressed', String(enabled));
    toggle.title = enabled ? '暂停动态效果' : '播放动态效果';
    if (enabled) { start = performance.now(); run(); }
    else {
      cancel(); pointerActive = false; y = 108; shift = 14; paint();
      if (light) light.style.opacity = '0';
      activeAnimations.forEach(animation => animation.cancel()); activeAnimations.clear();
    }
  }
  toggle.addEventListener('click', () => { enabled = !enabled; manuallyPaused = !enabled; apply(); });
  reduced.addEventListener('change', event => { enabled = !event.matches && !manuallyPaused; apply(); });
  document.addEventListener('visibilitychange', () => document.hidden ? cancel() : run());
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(items => {
      inView = items[0].isIntersecting;
      if (inView) run(); else cancel();
    }, {rootMargin:'40px'}).observe(signature);
    const arrival = new IntersectionObserver(items => {
      items.forEach(item => {
        if (!item.isIntersecting) return;
        arrival.unobserve(item.target);
        if (!enabled) return;
        const delay = Number(item.target.dataset.arrival || 0) * 65;
        const animation = item.target.animate([
          {opacity:.12, transform:'translateY(26px)', clipPath:'inset(0 0 12% 0)'},
          {opacity:1, transform:'translateY(0)', clipPath:'inset(0 0 0 0)'}
        ], {duration:850, delay, easing:'cubic-bezier(.16,1,.3,1)', fill:'backwards'});
        activeAnimations.add(animation);
        animation.finished.then(() => activeAnimations.delete(animation), () => activeAnimations.delete(animation));
      });
    }, {threshold:.12});
    entries.forEach((entry,index) => { entry.dataset.arrival = String(index % 2); arrival.observe(entry); });
  }
  entries.forEach(entry => {
    const word = entry.querySelector('.work-word');
    if (word) word.dataset.text = word.textContent;
    entry.addEventListener('pointermove', event => {
      if (!enabled || event.pointerType === 'touch') return;
      const r = entry.getBoundingClientRect();
      entry.style.setProperty('--entry-x', ((event.clientX-r.left)/r.width-.5)*8+'px');
      entry.style.setProperty('--entry-y', ((event.clientY-r.top)/r.height-.5)*5+'px');
    }, {passive:true});
    entry.addEventListener('pointerleave', () => {
      entry.style.setProperty('--entry-x','0px'); entry.style.setProperty('--entry-y','0px');
    });
  });
  apply();
})();
