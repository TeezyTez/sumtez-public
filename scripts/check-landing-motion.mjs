// Independent behavioral checks. Does not modify production files.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const repository = new URL('../', import.meta.url);
const site = fs.existsSync(new URL('dist/landing.js', repository))
  ? new URL('dist/', repository)
  : repository;
const source = fs.readFileSync(new URL('landing.js', site), 'utf8');
const tests = [];
const test = (name, run) => tests.push({ name, run });
class Target {
  constructor() { this.listeners = new Map(); }
  addEventListener(type, callback) {
    const list = this.listeners.get(type) || [];
    list.push(callback); this.listeners.set(type, list);
  }
  emit(type, values = {}) {
    for (const callback of this.listeners.get(type) || []) callback({ type, target: this, ...values });
  }
}
class Element extends Target {
  constructor() { super(); this.hidden = true; this.attributes = new Map(); this.classList = new Set(); }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  getAttribute(name) { return this.attributes.get(name); }
}
function boot({ reduced = false, fine = true, hidden = false, width = 1200, height = 800, dpr = 1, failure = '', observer = true } = {}) {
  const draws = [];
  let current, lost = false;
  const context = {
    clearRect() { if (!lost) { current = { sum: 0, points: 0, strokes: 0 }; draws.push(current); } },
    setTransform(...args) { this.transform = args; },
    beginPath() {},
    moveTo(x, y) { if (!lost) { assert(Number.isFinite(x) && Number.isFinite(y)); current.sum += x + y; current.points++; } },
    lineTo(x, y) { this.moveTo(x, y); },
    stroke() { if (!lost) current.strokes++; },
    isContextLost() { return lost; }
  };
  const page = new Element(), canvas = new Element(), control = new Element();
  page.classList.remove = name => page.classList.delete(name);
  canvas.clientWidth = width; canvas.clientHeight = height;
  canvas.getContext = () => { if (failure === 'throw') throw new Error('Canvas unavailable'); return failure === 'null' ? null : context; };
  page.getBoundingClientRect = () => ({ left: 0, top: 0, width: canvas.clientWidth, height: canvas.clientHeight });
  const document = new Target(); document.hidden = hidden;
  document.querySelector = selector => ({ '.field-page': page, '.living-field': canvas, '.motion-control': control })[selector] || null;
  const reduceQuery = new Target(), fineQuery = new Target();
  reduceQuery.matches = reduced; fineQuery.matches = fine;
  const window = new Target(), queue = new Map(), observers = [];
  let sequence = 0, time = 100, peak = 0;
  window.devicePixelRatio = dpr;
  const environment = {
    window, document,
    matchMedia: query => query.includes('reduced-motion') ? reduceQuery : fineQuery,
    requestAnimationFrame: callback => { queue.set(++sequence, callback); peak = Math.max(peak, queue.size); return sequence; },
    cancelAnimationFrame: id => queue.delete(id)
  };
  if (observer) {
    environment.ResizeObserver = window.ResizeObserver = class {
      constructor(callback) { observers.push(callback); }
      observe() {}
    };
  }
  vm.runInNewContext(source, environment, { filename: fileURLToPath(new URL('landing.js', site)) });
  return {
    page, canvas, control, context, document, window, queue, draws,
    get peak() { return peak; },
    step(ms = 30) { time += ms; const callbacks = [...queue.values()]; queue.clear(); callbacks.forEach(callback => callback(time)); },
    frames(n, ms = 30) { for (let i = 0; i < n; i++) this.step(ms); },
    pause() { control.emit('click'); },
    preference(value) { reduceQuery.matches = value; reduceQuery.emit('change', { matches: value }); },
    visibility(value) { document.hidden = !value; document.emit('visibilitychange'); },
    resize(w, h, ratio = window.devicePixelRatio) {
      canvas.clientWidth = w; canvas.clientHeight = h; window.devicePixelRatio = ratio;
      if (observers.length) observers.forEach(callback => callback([])); else window.emit('resize');
    },
    lose() { lost = true; canvas.emit('contextlost', { preventDefault() {} }); },
    restore() { lost = false; canvas.emit('contextrestored'); }
  };
}

test('initialization and repeated resumes use one RAF chain, capped at 40 fps', () => {
  const app = boot();
  assert(app.page.classList.has('field-ready')); assert.equal(app.control.hidden, false);
  assert.equal(app.queue.size, 1); app.step();
  const count = app.draws.length;
  app.step(10); assert.equal(app.draws.length, count);
  app.step(15); assert.equal(app.draws.length, count + 1);
  app.visibility(true); app.visibility(true); app.window.emit('pageshow', { persisted: true });
  app.frames(10); assert.equal(app.queue.size, 1); assert.equal(app.peak, 1);
});

test('pause freezes drawing and updates the native control; resume creates one loop', () => {
  const app = boot(); app.frames(3); app.pause();
  assert.equal(app.control.getAttribute('aria-pressed'), 'true');
  assert.equal(app.control.getAttribute('aria-label'), '播放动效');
  const count = app.draws.length;
  app.page.emit('pointermove', { pointerType: 'mouse', clientX: 100, clientY: 200 }); app.frames(10);
  assert.equal(app.queue.size, 0); assert.equal(app.draws.length, count);
  app.pause(); assert.equal(app.queue.size, 1); assert.equal(app.control.getAttribute('aria-pressed'), 'false');
});

test('initial reduced motion renders a static frame without a RAF loop', () => {
  const app = boot({ reduced: true });
  assert.equal(app.queue.size, 0); assert.equal(app.control.hidden, true); assert(app.draws.length >= 1);
  const count = app.draws.length; app.frames(20); assert.equal(app.draws.length, count);
  app.preference(false); assert.equal(app.queue.size, 1); assert.equal(app.control.hidden, false);
});

test('live reduced-motion changes stop drawing and preserve a manual pause', () => {
  const app = boot(); app.frames(3); app.preference(true);
  assert.equal(app.queue.size, 0); const count = app.draws.length; app.frames(20); assert.equal(app.draws.length, count);
  app.preference(false); assert.equal(app.queue.size, 1);
  app.pause(); app.preference(true); app.preference(false);
  assert.equal(app.queue.size, 0); assert.equal(app.control.getAttribute('aria-pressed'), 'true');
});

test('hidden documents stop; resume does not advance by time spent hidden', () => {
  const app = boot(); app.frames(5); const previous = app.draws.at(-1).sum;
  app.visibility(false); const count = app.draws.length; app.frames(3, 60000);
  assert.equal(app.queue.size, 0); assert.equal(app.draws.length, count);
  app.visibility(true); app.step(60000); assert.equal(app.draws.at(-1).sum, previous);
  app.pause(); app.visibility(false); app.visibility(true); assert.equal(app.queue.size, 0);
  const hidden = boot({ hidden: true }); assert.equal(hidden.queue.size, 0);
});

test('bfcache pagehide/pageshow restores one loop and respects pause/reduced motion', () => {
  const app = boot(); app.frames(4); const previous = app.draws.at(-1).sum;
  app.window.emit('pagehide', { persisted: true }); assert.equal(app.queue.size, 0);
  app.frames(3, 60000); app.window.emit('pageshow', { persisted: true }); app.step(60000);
  assert.equal(app.draws.at(-1).sum, previous); assert.equal(app.queue.size, 1);
  app.pause(); app.window.emit('pagehide', { persisted: true }); app.window.emit('pageshow', { persisted: true });
  assert.equal(app.queue.size, 0);
  const reduced = boot({ reduced: true }); reduced.window.emit('pageshow', { persisted: true }); assert.equal(reduced.queue.size, 0);
});

test('resize redraws while paused without restarting; DPR and backing pixels are bounded', () => {
  const app = boot(); app.pause(); const before = app.draws.length;
  app.resize(1920, 1080, 4);
  assert.equal(app.draws.length, before + 1); assert.equal(app.queue.size, 0);
  assert(app.context.transform[0] <= 2);
  // Integer rounding of both backing dimensions may add at most one row/column.
  assert(app.canvas.width * app.canvas.height <= 4000000 + app.canvas.width + app.canvas.height);
  app.resize(0, 0, 3); assert(app.canvas.width > 0 && app.canvas.height > 0);
});

test('window resize fallback works when ResizeObserver is unavailable', () => {
  const app = boot({ observer: false }); app.pause(); app.resize(500, 700, 3);
  assert.equal(app.canvas.width, 1000); assert.equal(app.canvas.height, 1400); assert.equal(app.queue.size, 0);
});

test('DPR changes with unchanged CSS geometry update the backing buffer', () => {
  const app = boot({ width: 800, height: 600, dpr: 1 }); app.pause();
  app.window.devicePixelRatio = 2; app.window.emit('resize');
  assert.equal(app.canvas.width, 1600, 'ResizeObserver need not fire when only DPR changes');
});

test('null and throwing getContext preserve fallback and expose no inert motion control', () => {
  for (const failure of ['null', 'throw']) {
    const app = boot({ failure });
    assert.equal(app.page.classList.has('field-ready'), false);
    assert.equal(app.control.hidden, true); assert.equal(app.queue.size, 0);
    app.preference(false); app.visibility(true); app.window.emit('pageshow', { persisted: true });
    assert.equal(app.queue.size, 0); assert.equal(app.control.hidden, true);
  }
});

test('runtime context loss stops animation and restores the static fallback', () => {
  const app = boot(); app.frames(2); app.lose();
  assert.equal(app.queue.size, 0, 'A lost Canvas renderer must stop its RAF loop');
  assert.equal(app.page.classList.has('field-ready'), false);
  assert.equal(app.control.hidden, true);
  app.restore(); assert.equal(app.queue.size, 1); assert(app.page.classList.has('field-ready'));
});

test('navigation is static HTML and the decorative canvas cannot intercept pointer events', () => {
  const html = fs.readFileSync(new URL('index.html', site), 'utf8');
  const css = fs.readFileSync(new URL('landing.css', site), 'utf8');
  for (const href of ['work.html', 'work.html#guides', 'tools.html']) {
    assert(html.includes(`href="${href}"`)); assert(fs.existsSync(new URL(href.split('#')[0], site)));
  }
  assert(/<canvas\b[^>]*aria-hidden="true"/.test(html));
  assert(/\.living-field\s*\{[^}]*pointer-events\s*:\s*none/.test(css));
  assert(!/preventDefault|location\s*=|\.href\s*=/.test(source));
  assert(!/field-ready[^}]*\{[^}]*(?:\.field-header|\.field-intro)/.test(css));
});

const results = [];
for (const { name, run } of tests) {
  try { run(); results.push({ name, pass: true }); console.log(`PASS ${name}`); }
  catch (error) { results.push({ name, pass: false, error: error.message }); console.error(`FAIL ${name}: ${error.message}`); }
}
const failed = results.filter(result => !result.pass).length;
const report = { source: fileURLToPath(new URL('landing.js', site)), sha256: createHash('sha256').update(source).digest('hex'), passed: results.length - failed, failed, results };
console.log(`${report.passed}/${results.length} passed; source SHA256 ${report.sha256}`);
process.exitCode = failed ? 1 : 0;
