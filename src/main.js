import '@fontsource/chakra-petch/latin-500.css';
import '@fontsource/chakra-petch/latin-600.css';
import '@fontsource/chakra-petch/latin-700.css';
import '@fontsource-variable/inter/index.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/jetbrains-mono/latin-500.css';
import './styles.css';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const html = document.documentElement;

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);
window.addEventListener('beforeunload', () => window.scrollTo(0, 0));
$('#year').textContent = new Date().getFullYear();

/* =========================================================
   Smooth scroll (Lenis + GSAP ticker)
   ========================================================= */
let lenis = null;
if (!reducedMotion) {
  lenis = new Lenis({
    lerp: 0.085, // frame-rate independent exponential smoothing: fluid on both mice and trackpads
    smoothWheel: true,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.2,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();
}

function scrollToTarget(target) {
  const el = target === '#top' ? 0 : $(target);
  if (el === null) {
    // on a service page, home-page sections live on the home page
    const home = document.body.dataset.home;
    if (home) window.location.href = home + target;
    return;
  }
  if (lenis) lenis.scrollTo(el, { duration: 1.4, offset: 0 });
  else if (el === 0) window.scrollTo({ top: 0 });
  else el.scrollIntoView();
}

/* =========================================================
   Hero scene (lazy-loaded Three.js)
   ========================================================= */
let scene = null;
const heroCanvas = $('#heroCanvas');

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}

const hudValue = $('#hudValue');
const SCRAMBLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-/';
let scrambleTween = null;
function scrambleTo(text) {
  if (!hudValue) return;
  scrambleTween?.kill();
  const o = { p: 0 };
  scrambleTween = gsap.to(o, {
    p: 1,
    duration: 0.6,
    ease: 'none',
    onUpdate() {
      const n = Math.floor(o.p * text.length);
      let out = text.slice(0, n);
      for (let i = n; i < text.length; i++) out += text[i] === ' ' ? ' ' : SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0];
      hudValue.textContent = out;
    },
    onComplete() { hudValue.textContent = text; },
  });
}

// only the home page has the 3D hero
const webgl = heroCanvas ? hasWebGL() : false;
// start fetching Three.js right away, in parallel with fonts
const sceneModule = webgl ? import('./hero-scene.js') : null;
sceneModule?.catch(() => {});

async function initScene() {
  if (!webgl) {
    heroCanvas.classList.add('is-fallback');
    return false;
  }
  try {
    const mod = await sceneModule;
    setProgress(72, 'WIRING AGENTS');
    // canvas cards need the fonts in memory before they are drawn
    await Promise.race([
      Promise.all([
        document.fonts.load('700 46px "Chakra Petch"'),
        document.fonts.load('500 25px "JetBrains Mono"'),
      ]),
      new Promise((r) => setTimeout(r, 1500)),
    ]);
    scene = mod.createHeroScene(heroCanvas, {
      reducedMotion,
      onActive: (i, agent) => scrambleTo(agent.name),
    });
    return true;
  } catch (err) {
    console.warn('[hero] WebGL scene unavailable, using fallback.', err);
    heroCanvas.classList.add('is-fallback');
    return false;
  }
}

/* =========================================================
   Loader
   ========================================================= */
const loaderEl = $('#loader');
const countEl = $('#loaderCount');
const barEl = $('#loaderBar');
const statusEl = $('#loaderStatus');
const prog = { v: 0, target: 0 };
let progTween = null;
let finishResolve;
const progressDone = new Promise((r) => (finishResolve = r));

function renderProgress() {
  const v = Math.round(prog.v);
  countEl.textContent = String(v).padStart(3, '0');
  barEl.style.transform = `scaleX(${prog.v / 100})`;
}
function setProgress(v, status) {
  if (v <= prog.target) return;
  prog.target = v;
  if (status) statusEl.textContent = status;
  progTween?.kill();
  progTween = gsap.to(prog, {
    v,
    duration: v === 100 ? 0.7 : 0.9,
    ease: 'power2.out',
    onUpdate: renderProgress,
    onComplete: () => { if (v === 100) finishResolve(); },
  });
}

/** land on #section when arriving from another page (e.g. a service page's "Book a free audit") */
function landOnHash() {
  const id = window.location.hash.slice(1);
  if (!/^[a-z0-9-]+$/i.test(id) || id === 'top' || id === 'main') return false;
  const el = document.getElementById(id);
  if (!el) return false;
  ScrollTrigger.refresh();
  if (lenis) lenis.scrollTo(el, { immediate: true, force: true });
  else el.scrollIntoView();
  return true;
}

/** pages without the loader (service pages): quick, quiet entrance */
function bootLight() {
  initPage();
  if (!reducedMotion) gsap.from('.nav', { y: -70, autoAlpha: 0, duration: 1, ease: 'expo.out' });
  lenis?.start();
  requestAnimationFrame(() => { landOnHash(); ScrollTrigger.refresh(); });
}

async function boot() {
  if (!loaderEl) { bootLight(); return; }
  const t0 = performance.now();
  // logo's 'down' row is flipped in the markup (no unflipped first frame); hand it to GSAP
  const down = document.querySelector('.od-logo--loader .lg-down');
  if (down) {
    down.removeAttribute('transform');
    gsap.set(down, { scaleY: -1, transformOrigin: '50% 50%' });
  }
  // reveal loader content once fonts are ready (no fallback-font flash), max ~0.8s
  Promise.race([
    Promise.all([document.fonts.load('700 40px "Chakra Petch"'), document.fonts.load('400 12px "JetBrains Mono"')]),
    new Promise((r) => setTimeout(r, 800)),
  ]).catch(() => {})
    .then(() => gsap.to('.loader__inner', { opacity: 1, duration: 0.5, ease: 'power2.out' }));
  setProgress(18, 'BOOTING AGENTS');

  const fontsReady = Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))])
    .then(() => setProgress(46, 'LOADING INTERFACE'));
  const sceneReady = fontsReady.then(initScene);

  // never let the loader hang: hard cap
  const cap = new Promise((r) => setTimeout(r, 6000));
  await Promise.race([sceneReady, cap]);

  // keep the loader up long enough to read (but not longer)
  const minTime = reducedMotion ? 300 : 1300;
  const elapsed = performance.now() - t0;
  if (elapsed < minTime) await new Promise((r) => setTimeout(r, minTime - elapsed));

  setProgress(100, 'SYSTEMS ONLINE');
  await progressDone;
  initPage();
  exitLoader();
}

function exitLoader() {
  const tl = gsap.timeline({
    defaults: { ease: 'expo.inOut' },
    onComplete: () => {
      loaderEl.remove();
      html.classList.remove('is-loading');
      if (!landOnHash()) lenis?.scrollTo(0, { immediate: true, force: true });
      lenis?.start();
      ScrollTrigger.refresh();
    },
  });
  if (reducedMotion) {
    tl.to(loaderEl, { autoAlpha: 0, duration: 0.3 });
    heroIntro(tl, 0.1);
    return;
  }
  tl.to('.od-logo--loader .lg-down', { scaleY: 1, duration: 0.9, ease: 'back.out(1.8)' })
    .to('.loader__count, .loader__status, .loader__top, .loader__bar', { autoAlpha: 0, duration: 0.4, ease: 'power2.out' }, '-=0.3')
    .to('.loader__brand', { yPercent: -40, autoAlpha: 0, duration: 0.7, ease: 'power3.in' }, '+=0.05')
    .to('.loader__panel--a', { yPercent: -100, duration: 1.1 }, '-=0.25')
    .to('.loader__panel--b', { yPercent: 100, duration: 1.1 }, '<');
  heroIntro(tl, '-=0.75');
}

/* =========================================================
   Hero intro
   ========================================================= */
function heroIntro(tl, at) {
  const lines = $$('.hero__line');
  const splits = lines.map((l) => SplitText.create(l, { type: 'chars', charsClass: 'char' }));
  const chars = splits.flatMap((s) => s.chars);
  gsap.set(lines, { overflow: 'hidden', paddingBlock: '0.06em', marginBlock: '-0.06em' });

  tl.from('.nav', { y: -90, autoAlpha: 0, duration: 1.1, ease: 'expo.out' }, at)
    .from('.hero__canvas', { scale: 1.12, duration: 2, ease: 'expo.out' }, '<')
    .from('.hero__eyebrow', { y: 20, autoAlpha: 0, duration: 0.8, ease: 'power3.out', onStart: () => decode($('.hero__eyebrow')) }, '<0.15')
    .from(chars, {
      yPercent: 115,
      rotate: 6,
      duration: 1.1,
      ease: 'expo.out',
      stagger: { each: 0.025 },
      onComplete: () => {
        splits.forEach((s) => s.revert());
        gsap.set(lines, { clearProps: 'overflow,paddingBlock,marginBlock' });
      },
    }, '<0.05')
    .from('.hero__sub', { y: 24, autoAlpha: 0, duration: 0.9, ease: 'power3.out' }, '<0.45')
    .from('.hero__ctas .btn', { y: 24, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 }, '<0.1')
    .from('.hero__hud .hud', { y: 16, autoAlpha: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08 }, '<0.15')
    .from('.marquee', { yPercent: 100, autoAlpha: 0, duration: 0.9, ease: 'power3.out' }, '<');
}

/* =========================================================
   Page setup (after loader)
   ========================================================= */
/* ---------- scroll hygiene ---------- */
function initScrollHygiene() {
  // pause pointer/hover work while scrolling
  // (inline style on the content roots only — a class on <html> would restyle the whole document)
  const roots = [$('#main'), $('.footer')].filter(Boolean);
  let t = 0;
  let paused = false;
  const setPaused = (v) => {
    paused = v;
    roots.forEach((r) => { r.style.pointerEvents = v ? 'none' : ''; });
    scene?.setScrolling(v);
  };
  const onScroll = () => {
    if (!paused) setPaused(true);
    clearTimeout(t);
    t = setTimeout(() => setPaused(false), 160);
  };
  if (lenis) lenis.on('scroll', onScroll);
  else window.addEventListener('scroll', onScroll, { passive: true });

  // decode the brand gradient during idle time so it never stalls a scroll frame
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 400));
  idle(() => {
    const img = new Image();
    const pre = document.querySelector('link[rel="preload"][as="image"]');
    if (!pre) return;
    img.src = pre.href;
    img.decode?.().catch(() => {});
  });
}

function initPage() {
  initScrollHygiene();
  initHeroScroll();
  initNav();
  initMobileMenu();
  initAnchors();
  initProgressBar();
  initReveals();
  initAbout();
  initCounters();
  initGlow();
  initTilt();
  initMagnetic();
  initButtonDecode();
  initMocks();
  initProcess();
  initCalculator();
  initFaq();
  initForm();
  initWordmark();
  initDecode();
  initConcierge();
  scene?.start();
}

/* ---------- hero scroll + scene visibility ---------- */
function initHeroScroll() {
  if (!$('.hero')) return; // home page only
  const hero = $('#top');
  if (scene) {
    const io = new IntersectionObserver(([e]) => scene.setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(hero);
  }
  ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: 'bottom top',
    onUpdate: (self) => scene?.setScroll(self.progress),
  });
  if (!reducedMotion) {
    gsap.to('.hero__content', {
      yPercent: -18,
      autoAlpha: 0.2,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });
  }

  // keyboard control of the scene while the hero is on screen
  window.addEventListener('keydown', (e) => {
    if (!scene) return;
    if (window.scrollY > hero.offsetHeight * 0.6) return;
    const tag = (e.target.tagName || '').toLowerCase();
    if (['input', 'textarea', 'select', 'button', 'a'].includes(tag)) return;
    if (document.body.classList.contains('menu-open')) return;
    if (e.key === 'ArrowRight') { scene.next(); e.preventDefault(); }
    else if (e.key === 'ArrowLeft') { scene.prev(); e.preventDefault(); }
    else if (e.code === 'Space') { scene.pulse(); e.preventDefault(); }
  });
}

/* ---------- nav ---------- */
function initNav() {
  const header = $('#header');
  const pill = $('#navPill');
  const links = $$('[data-nav]');
  let current = null;

  function movePill(link) {
    if (!link) {
      gsap.to(pill, { opacity: 0, duration: 0.3 });
      links.forEach((l) => l.classList.remove('is-active'));
      current = null;
      return;
    }
    if (current === link) return;
    current = link;
    links.forEach((l) => l.classList.toggle('is-active', l === link));
    gsap.to(pill, { x: link.offsetLeft, width: link.offsetWidth, opacity: 1, duration: 0.55, ease: 'expo.out' });
  }

  links.forEach((link) => {
    const section = $(`#${link.dataset.nav}`);
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => { if (self.isActive) movePill(link); },
    });
  });
  ScrollTrigger.create({ trigger: '#top', start: 'top top', end: 'bottom 50%', onEnterBack: () => movePill(null) });
  if ($('#contact')) ScrollTrigger.create({ trigger: '#contact', start: 'top 50%', onEnter: () => movePill(null) });

  // hide on scroll down, show on scroll up
  let lastY = 0;
  const onScroll = (y) => {
    header.classList.toggle('is-scrolled', y > 30);
    const down = y > lastY;
    if (y > window.innerHeight * 0.7 && down && Math.abs(y - lastY) > 2) header.classList.add('is-hidden');
    else if (!down || y < 50) header.classList.remove('is-hidden');
    lastY = y;
  };
  if (lenis) lenis.on('scroll', ({ scroll }) => onScroll(scroll));
  else window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });
  header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
  ScrollTrigger.create({
    trigger: '#top',
    start: 'top top',
    end: 'bottom top+=80',
    onToggle: (self) => header.classList.toggle('is-over-hero', self.isActive),
  });
}

/* ---------- mobile menu ---------- */
let closeMenu = () => {};
function initMobileMenu() {
  const burger = $('#burger');
  const menu = $('#mobileMenu');
  const links = $$('.mmenu__list a', menu);
  let open = false;

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.inOut' } })
    .set(menu, { visibility: 'visible' })
    .fromTo('.mmenu__bg', { clipPath: 'circle(0% at calc(100% - 44px) 42px)' }, { clipPath: 'circle(150% at calc(100% - 44px) 42px)', duration: 0.9 })
    .from(links, { yPercent: 110, duration: 0.8, ease: 'expo.out', stagger: 0.05 }, '-=0.45')
    .from('.mmenu__foot', { autoAlpha: 0, y: 10, duration: 0.5 }, '-=0.5');

  function set(state) {
    open = state;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
    $('#header').classList.remove('is-hidden');
    if (open) { lenis?.stop(); tl.timeScale(1).play(); }
    else { lenis?.start(); tl.timeScale(1.6).reverse(); }
  }
  closeMenu = () => open && set(false);
  burger.addEventListener('click', () => set(!open));
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 920) closeMenu(); });
}

/* ---------- anchors ---------- */
function initAnchors() {
  $$('[data-scroll]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      e.preventDefault();
      const wasOpen = document.body.classList.contains('menu-open');
      closeMenu();
      setTimeout(() => scrollToTarget(href), wasOpen ? 350 : 0);
    });
  });
  $('#toTop').addEventListener('click', () => scrollToTarget('#top'));
}

/* ---------- scroll progress ---------- */
function initProgressBar() {
  gsap.to('#scrollProgress', {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
  });
}

/* ---------- reveals ---------- */
function initReveals() {
  if (reducedMotion) return;

  // headings: masked line-by-line word rise, reverted afterwards so wraps stay natural on resize
  $$('[data-split]').forEach((el) => {
    const split = SplitText.create(el, { type: 'lines,words', mask: 'lines', linesClass: 'split-line' });
    gsap.from(split.words, {
      yPercent: 110,
      duration: 1.1,
      ease: 'expo.out',
      stagger: 0.06,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      onComplete: () => split.revert(),
    });
  });

  gsap.set('[data-reveal]', { y: 28, autoAlpha: 0 });
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%',
    once: true,
    onEnter: (els) => gsap.to(els, { y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out', stagger: 0.08, overwrite: true }),
  });

  gsap.set('[data-card]', { y: 50, autoAlpha: 0 });
  ScrollTrigger.batch('[data-card]', {
    start: 'top 92%',
    once: true,
    onEnter: (els) => gsap.to(els, { y: 0, autoAlpha: 1, duration: 1.1, ease: 'expo.out', stagger: 0.09, overwrite: true, clearProps: 'transform' }),
  });

  gsap.set('.step', { y: 40, autoAlpha: 0 });
  ScrollTrigger.batch('.step', {
    start: 'top 88%',
    once: true,
    onEnter: (els) => gsap.to(els, { y: 0, autoAlpha: 1, duration: 1, ease: 'expo.out', stagger: 0.1, overwrite: true }),
  });
}

/* ---------- about statement scrub ---------- */
function initAbout() {
  const el = $('#aboutStatement');
  if (!el || reducedMotion) return;
  const split = SplitText.create(el, { type: 'words' });
  gsap.fromTo(split.words, { opacity: 0.14 }, {
    opacity: 1,
    ease: 'none',
    stagger: 0.1,
    scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: 0.6 },
  });
}

/* ---------- counters ---------- */
function initCounters() {
  $$('[data-count]').forEach((el) => {
    const to = parseFloat(el.dataset.count);
    const from = parseFloat(el.dataset.from || 0);
    const prefix = el.dataset.prefix || '';
    const fmt = el.dataset.format === 'k' ? (v) => `${(v / 1000).toFixed(1)}k` : (v) => Math.round(v);
    const o = { v: from };
    el.textContent = prefix + fmt(from);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => gsap.to(o, {
        v: to,
        duration: reducedMotion ? 0.01 : 1.8,
        ease: 'power3.out',
        onUpdate: () => { el.textContent = prefix + fmt(o.v); },
      }),
    });
  });
}

/* ---------- card cursor glow ---------- */
function initGlow() {
  if (!canHover) return;
  $$('[data-glow]').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}

/* ---------- 3D tilt ---------- */
function initTilt() {
  if (!canHover || reducedMotion) return;
  $$('[data-tilt]').forEach((card) => {
    gsap.set(card, { transformPerspective: 900 });
    const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3.out' });
    const ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3.out' });
    const ty = gsap.quickTo(card, 'y', { duration: 0.6, ease: 'power3.out' });
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      rx(-py * 6); ry(px * 6); ty(-6);
    });
    card.addEventListener('pointerleave', () => { rx(0); ry(0); ty(0); });
  });
}

/* ---------- magnetic buttons ---------- */
function initMagnetic() {
  if (!canHover || reducedMotion) return;
  $$('.magnetic').forEach((btn) => {
    const xTo = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' });
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.12);
      yTo((e.clientY - r.top - r.height / 2) * 0.18);
    });
    btn.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
}

/* ---------- buttons: label decodes on hover (width locked, no jitter) ---------- */
const BTN_GLYPHS = 'ABCDEFGHKMNPRSTUVXYZ0123456789#/';
function initButtonDecode() {
  if (!canHover || reducedMotion) return;
  $$('.btn > span').forEach((label) => {
    const btn = label.parentElement;
    let tween = null;
    btn.addEventListener('pointerenter', () => {
      if (tween) return;
      const text = label.dataset.text || label.textContent;
      label.dataset.text = text;
      label.style.width = label.offsetWidth + 'px';
      const o = { p: 0 };
      tween = gsap.to(o, {
        p: 1,
        duration: 0.45,
        ease: 'power1.out',
        onUpdate() {
          const n = Math.floor(o.p * text.length);
          let out = text.slice(0, n);
          for (let i = n; i < text.length; i++) out += text[i] === ' ' ? ' ' : BTN_GLYPHS[(Math.random() * BTN_GLYPHS.length) | 0];
          label.textContent = out;
        },
        onComplete() { label.textContent = text; label.style.width = ''; tween = null; },
      });
    });
  });
}

/* =========================================================
   Bento mock animations (only run while on screen)
   ========================================================= */
function whileInView(el, { play, pause }) {
  ScrollTrigger.create({
    trigger: el,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => {
      el.classList.toggle('is-inview', self.isActive);
      self.isActive ? play() : pause();
    },
  });
}

function initMocks() {
  // --- chat ---
  const chat = $('[data-mock="chat"]');
  if (chat) {
    const [in1, out1, in2, typing, out2, sys] = $$('.msg', chat);
    const all = [in1, out1, in2, out2, sys];
    if (reducedMotion) {
      typing.style.display = 'none';
    } else {
      gsap.set(all, { autoAlpha: 0, y: 12, scale: 0.97 });
      gsap.set(typing, { display: 'none', autoAlpha: 0 });
      const show = { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.6)' };
      const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.4 })
        .to(in1, { ...show, transformOrigin: '0% 100%' }, 0.4)
        .to(out1, { ...show, transformOrigin: '100% 100%' }, 1.5)
        .to(in2, { ...show, transformOrigin: '0% 100%' }, 2.9)
        .set(typing, { display: 'flex' }, 3.5)
        .to(typing, { autoAlpha: 1, duration: 0.3 }, 3.5)
        .set(typing, { display: 'none', autoAlpha: 0 }, 4.7)
        .to(out2, { ...show, transformOrigin: '100% 100%' }, 4.7)
        .to(sys, { ...show }, 5.4)
        .to(all, { autoAlpha: 0, y: -8, duration: 0.5, ease: 'power2.in', stagger: 0.04 }, 8.6)
        .set(all, { y: 12, scale: 0.97 });
      whileInView(chat, { play: () => tl.play(), pause: () => tl.pause() });
    }
  }

  // --- voice ---
  const voice = $('[data-mock="voice"]');
  if (voice) {
    const timerEl = $('#voiceTimer', voice);
    let sec = 0;
    let iv = null;
    whileInView(voice, {
      play: () => {
        if (iv) return;
        iv = setInterval(() => {
          sec = (sec + 1) % 60;
          timerEl.textContent = `00:${String(sec).padStart(2, '0')}`;
        }, 1000);
      },
      pause: () => { clearInterval(iv); iv = null; },
    });
  }

  // --- report ---
  const report = $('[data-mock="report"]');
  if (report) {
    const bars = $$('.bars i', report);
    const tl = gsap.timeline({ paused: true })
      .from(bars, { scaleY: 0, duration: 1, ease: 'expo.out', stagger: 0.06 });
    whileInView(report, { play: () => tl.restart(), pause: () => {} });
  }

  // --- creatives deck ---
  const deck = $('[data-mock="creative"]');
  if (deck) {
    let order = $$('.creative', deck);
    const slots = [
      { x: 0, y: 0, rotate: -4, scale: 1, zIndex: 3, autoAlpha: 1 },
      { x: 22, y: -12, rotate: 5, scale: 0.93, zIndex: 2, autoAlpha: 1 },
      { x: 42, y: -22, rotate: 12, scale: 0.86, zIndex: 1, autoAlpha: 0.9 },
    ];
    const place = (dur) => order.forEach((c, i) => gsap.to(c, { ...slots[i], xPercent: -8, duration: dur, ease: 'expo.out' }));
    place(0);
    let call = null;
    const cycle = () => {
      const top = order[0];
      gsap.timeline()
        .to(top, { x: -140, y: 20, rotate: -22, autoAlpha: 0, duration: 0.55, ease: 'power3.in' })
        .add(() => { order = [...order.slice(1), top]; gsap.set(top, { zIndex: 0 }); place(0.8); })
        .fromTo(top, { autoAlpha: 0 }, { autoAlpha: 0.9, duration: 0.4 }, '+=0.1');
      call = gsap.delayedCall(2.4, cycle);
    };
    if (!reducedMotion) {
      whileInView(deck, {
        play: () => { if (!call) call = gsap.delayedCall(1.2, cycle); },
        pause: () => { call?.kill(); call = null; },
      });
    }
  }

  // --- strategy spark line ---
  const strat = $('[data-mock="strategy"]');
  if (strat) {
    const line = $('.spark__line', strat);
    const fill = $('.spark__fill', strat);
    const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 2.2 })
      .fromTo(line, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' })
      .fromTo(fill, { opacity: 0 }, { opacity: 1, duration: 0.8 }, '-=0.6')
      .fromTo('.strategy__log', { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: 0.5 }, '-=0.4')
      .to([line, fill], { opacity: 0, duration: 0.4 }, '+=2.6')
      .set(line, { opacity: 1, strokeDashoffset: 1 });
    gsap.set(line, { strokeDasharray: 1, strokeDashoffset: reducedMotion ? 0 : 1 });
    if (!reducedMotion) whileInView(strat, { play: () => tl.play(), pause: () => tl.pause() });
  }

  // --- workflow pipeline ---
  const flow = $('[data-mock="flow"]');
  if (flow) {
    const nodes = $$('.flow__node', flow);
    const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.6 });
    nodes.forEach((n, i) => {
      tl.call(() => n.classList.add('is-on'), null, i * 0.45)
        .fromTo(n, { x: 0 }, { x: 6, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.out' }, i * 0.45);
    });
    tl.call(() => nodes.forEach((n) => n.classList.remove('is-on')), null, nodes.length * 0.45 + 1.4);
    if (reducedMotion) nodes.forEach((n) => n.classList.add('is-on'));
    else whileInView(flow, { play: () => tl.play(), pause: () => tl.pause() });
  }
}

/* ---------- process ---------- */
function initProcess() {
  if (!$('#steps')) return;
  const steps = $$('.step');
  const now = $('#stepNow');
  gsap.to('#stepsRail', {
    scaleY: 1,
    ease: 'none',
    scrollTrigger: { trigger: '#steps', start: 'top 60%', end: 'bottom 60%', scrub: 0.4 },
  });
  steps.forEach((step) => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top 62%',
      end: 'bottom 62%',
      onToggle: (self) => {
        step.classList.toggle('is-active', self.isActive);
        if (self.isActive && now) now.textContent = step.dataset.step;
      },
    });
  });
}

/* ---------- performance fee calculator: €790 flat + 5% of ad revenue above the baseline ---------- */
function initCalculator() {
  const root = $('#roiCalc');
  if (!root) return;
  const inputs = $$('input[type="range"]', root);
  const out = { bill: $('#feeBill'), baseline: $('#feeBaseline'), above: $('#feeAbove'), cut: $('#feeCut'), keep: $('#feeKeep') };
  const money = (v) => '€' + Math.round(v).toLocaleString('en-GB');
  const label = { spend: (v) => money(v), base: (v) => v.toFixed(1) + '×', next: (v) => v.toFixed(1) + '×' };
  const shown = { bill: 0, baseline: 0, above: 0, cut: 0, keep: 0 };
  const FLAT = 790;
  const SHARE = 0.05;

  const render = () => Object.keys(out).forEach((k) => { out[k].textContent = money(shown[k]); });
  function calc(animate = true) {
    const v = {};
    inputs.forEach((i) => {
      v[i.name] = +i.value;
      const pct = ((i.value - i.min) / (i.max - i.min)) * 100;
      i.style.setProperty('--p', pct + '%');
      const o = root.querySelector(`[data-out="${i.name}"]`);
      if (o) o.textContent = label[i.name](+i.value);
    });
    const baseline = v.spend * v.base;
    const above = Math.max(0, v.spend * v.next - baseline);
    const cut = above * SHARE;
    const target = { bill: FLAT + cut, baseline, above, cut, keep: above - cut };
    if (!animate || reducedMotion) { Object.assign(shown, target); render(); return; }
    gsap.to(shown, { ...target, duration: 0.6, ease: 'power3.out', overwrite: true, onUpdate: render });
  }
  inputs.forEach((i) => i.addEventListener('input', () => calc(true)));
  calc(false);
  // count up the first time the result scrolls into view
  const final = { ...shown };
  Object.assign(shown, { bill: 0, baseline: 0, above: 0, cut: 0, keep: 0 });
  render();
  ScrollTrigger.create({
    trigger: root,
    start: 'top 80%',
    once: true,
    onEnter: () => gsap.to(shown, { ...final, duration: reducedMotion ? 0.01 : 1.6, ease: 'power3.out', onUpdate: render }),
  });
}

/* ---------- FAQ ---------- */
function initFaq() {
  const items = $$('.faq__item');
  items.forEach((item) => {
    const btn = $('.faq__q', item);
    btn.addEventListener('click', () => {
      const open = !item.classList.contains('is-open');
      items.forEach((other) => {
        if (other !== item && other.classList.contains('is-open')) {
          other.classList.remove('is-open');
          $('.faq__q', other).setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      // let layout settle, then re-measure triggers below
      setTimeout(() => ScrollTrigger.refresh(), 600);
    });
  });
  items[0]?.querySelector('.faq__q').click();
}

/* ---------- contact form ---------- */
function initForm() {
  const form = $('#contactForm');
  if (!form) return;
  const note = $('#formNote');
  const done = $('.form__done', form);
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  form.addEventListener('input', (e) => e.target.closest('.field')?.classList.remove('is-error'));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    note.textContent = '';
    if (form.company_site.value) return; // honeypot
    let ok = true;
    $$('[required]', form).forEach((f) => {
      const bad = !f.value.trim() || (f.type === 'email' && !emailRe.test(f.value.trim()));
      f.closest('.field').classList.toggle('is-error', bad);
      if (bad) ok = false;
    });
    if (!ok) {
      note.textContent = 'PLEASE COMPLETE THE HIGHLIGHTED FIELDS';
      gsap.fromTo(form, { x: -6 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
      return;
    }

    const btn = $('button[type="submit"]', form);
    const label = $('span', btn);
    const idle = label.dataset.text || label.textContent;
    btn.disabled = true;
    label.textContent = 'Sending…';

    // Set data-endpoint="https://formspree.io/f/xxxx" (or your own API) on the form to deliver submissions.
    const endpoint = form.dataset.endpoint;
    try {
      if (endpoint) {
        const res = await fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } else {
        await new Promise((r) => setTimeout(r, 700));
      }
      done.setAttribute('aria-hidden', 'false');
      gsap.timeline()
        .to(done, { autoAlpha: 1, duration: 0.5, ease: 'power2.out' })
        .from('.form__check', { scale: 0, rotate: -90, duration: 0.8, ease: 'back.out(2)' }, '-=0.2')
        .from(done.querySelectorAll('h3, p'), { y: 12, autoAlpha: 0, stagger: 0.08, duration: 0.6 }, '-=0.5');
      form.reset();
    } catch (err) {
      note.textContent = 'SOMETHING WENT WRONG — PLEASE EMAIL US DIRECTLY';
    } finally {
      btn.disabled = false;
      label.textContent = idle;
    }
  });
}

/* ---------- footer logo: the "down" row flips into place ---------- */
function initWordmark() {
  const wm = $('#wordmark');
  const down = $('.od-logo--footer .lg-down');
  if (!wm || !down || reducedMotion) return;
  gsap.set(down, { scaleY: -1, transformOrigin: '50% 50%' });
  const flip = () => gsap.fromTo(down, { scaleY: -1 }, { scaleY: 1, duration: 1, ease: 'back.out(1.8)', overwrite: true });
  ScrollTrigger.create({ trigger: wm, start: 'top 90%', once: true, onEnter: flip });
  if (canHover) wm.addEventListener('pointerenter', () => { if (!gsap.isTweening(down)) flip(); });
}

/* ---------- decode text: labels resolve from glyph noise ---------- */
const GLYPHS = '01<>/\\_-+=*#{}[]';
function decode(el, duration = 0.9) {
  if (!el || reducedMotion) return;
  const text = el.dataset.text || el.textContent;
  el.dataset.text = text;
  el.classList.add('is-decoding');
  const o = { p: 0 };
  gsap.to(o, {
    p: 1,
    duration,
    ease: 'power2.out',
    onUpdate() {
      const n = Math.floor(o.p * text.length);
      let out = '';
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        out += i < n || ch === ' ' || ch === '/' ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
    },
    onComplete() { el.textContent = text; el.classList.remove('is-decoding'); },
  });
}
function initDecode() {
  $$('.section .eyebrow').forEach((el) => {
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => decode(el) });
  });
}

/* ---------- Lumi, the AI concierge (scripted demo of what we build) ---------- */
function initConcierge() {
  const root = $('#concierge');
  if (!root) return;
  const orb = $('#conciergeOrb');
  const panel = $('#conciergePanel');
  const body = $('#conciergeBody');
  const teaser = $('#conciergeTeaser');
  const quick = $$('#conciergeQuick button');
  const REPLIES = {
    concepts: { me: "I'd like 3 free ad concepts", bot: "Lovely. Share your store and we'll bring three concepts made for your brand to a 20-minute call. Yours to keep ✨", to: '#contact' },
    what: { me: 'What do you actually do?', bot: 'We run a growth engine for e-commerce brands: customer insight, fresh ads every week, testing, campaigns and fast replies to buyers. Here’s how it fits together →', to: '#services' },
    price: { me: 'How does pricing work?', bot: 'Start with a 30-day Sprint, then a flat monthly fee plus 5% of growth above your own baseline. No growth, no extra. Have a look →', to: '#pricing' },
  };
  let open = false;
  let greeted = false;
  let busy = false;

  const bubble = (cls, text) => {
    const el = document.createElement('div');
    el.className = 'msg ' + cls;
    if (text) el.textContent = text;
    else el.innerHTML = '<i></i><i></i><i></i>';
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
    if (!reducedMotion) gsap.from(el, { y: 10, autoAlpha: 0, scale: 0.96, duration: 0.45, ease: 'back.out(1.6)', transformOrigin: cls === 'msg--me' ? '100% 100%' : '0% 100%' });
    return el;
  };
  const botSay = (text, delay = 900) => new Promise((resolve) => {
    const typing = bubble('msg--typing');
    setTimeout(() => { typing.remove(); bubble('msg--bot', text); resolve(); }, reducedMotion ? 0 : delay);
  });

  function setOpen(v) {
    open = v;
    root.classList.toggle('is-open', v);
    panel.setAttribute('aria-hidden', String(!v));
    orb.setAttribute('aria-expanded', String(v));
    orb.setAttribute('aria-label', v ? 'Close AI concierge' : 'Open AI concierge');
    teaser.classList.remove('is-on');
    if (v && !greeted) {
      greeted = true;
      botSay("Hi, I'm Lumi 👋 — the same kind of assistant that answers your buyers under your ads, in seconds, day or night. What can I help with?", 1100);
    }
  }

  orb.addEventListener('click', () => setOpen(!open));
  teaser.addEventListener('click', () => setOpen(true));
  $('#conciergeClose').addEventListener('click', () => setOpen(false));
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) setOpen(false); });

  quick.forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (busy) return;
      const r = REPLIES[btn.dataset.ask];
      busy = true;
      quick.forEach((b) => { b.disabled = true; });
      bubble('msg--me', r.me);
      await botSay(r.bot, 1000);
      setTimeout(() => {
        if (window.innerWidth < 640) setOpen(false);
        scrollToTarget(r.to);
        busy = false;
        quick.forEach((b) => { b.disabled = false; });
      }, reducedMotion ? 0 : 700);
    });
  });

  // appear after the intro, then nudge once
  setTimeout(() => root.classList.add('is-ready'), reducedMotion ? 0 : 1600);
  setTimeout(() => { if (!open && !greeted) teaser.classList.add('is-on'); }, 9000);
  setTimeout(() => teaser.classList.remove('is-on'), 17000);
}

/* =========================================================
   Go
   ========================================================= */
document.fonts?.ready.then(() => ScrollTrigger.refresh());
window.addEventListener('load', () => ScrollTrigger.refresh());
boot();
