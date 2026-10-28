/**
 * Hero scene: a dark room with a desk setup. Code is typed live on the main
 * monitor, a terminal streams agent logs on the second, the desk lamp
 * flickers, PC LEDs blink and a crimson neon logo hums on the wall.
 *
 * Built to be light: low-poly Lambert materials, faked light pools/cones
 * (no shadows, no post-processing), screens redrawn at ~20fps, adaptive
 * pixel ratio, and rendering pauses when the hero is off-screen.
 *
 * Interactions: mouse parallax, ←/→ switch the file being written,
 * Space toggles the lamp, click makes the lamp flicker.
 */
import {
  WebGLRenderer, Scene, PerspectiveCamera, Color, Fog,
  HemisphereLight, PointLight,
  Group, Mesh, Points, Sprite,
  PlaneGeometry, CircleGeometry, BoxGeometry, CylinderGeometry, ConeGeometry, TorusGeometry,
  IcosahedronGeometry, BufferGeometry, BufferAttribute, EdgesGeometry, LineSegments,
  MeshLambertMaterial, MeshBasicMaterial, PointsMaterial, SpriteMaterial, LineBasicMaterial,
  CanvasTexture, SRGBColorSpace, AdditiveBlending, DoubleSide,
  Vector3, MathUtils, Timer,
} from 'three';
import logoRaw from './logo-inline.svg?raw';

/* ---------- what's being "built" on screen ---------- */
export const AGENTS = [
  {
    name: 'CREATIVE ENGINE',
    file: 'creative-engine.ts',
    code: [
      '// creative-engine.ts — fresh ads, every week',
      "import { insight, studio, review } from '@opside/core'",
      '',
      'const angles = await insight.topAngles(brand, { n: 5 })',
      'for (const angle of angles) {',
      '  const ads = await studio.build(angle, brand.photos)',
      '  await review.human(ads) // every ad checked by a person',
      "  await queue.add(ads, { batch: 'week-12' })",
      '}',
      '// 24 new ads ready · built from your real product',
    ],
  },
  {
    name: 'CUSTOMER INSIGHT',
    file: 'insight.ts',
    code: [
      '// insight.ts — why do people actually buy?',
      'const voice = await Promise.all([',
      '  shopify.reviews({ minStars: 4 }),',
      "  meta.comments({ range: '30d' }),",
      "  adLibrary.category(brand.niche),",
      '])',
      '',
      'const reasons = await agent.cluster(voice.flat())',
      "// 'the gift' · 'saves time' · 'it actually works'",
      'export default reasons.rank()',
    ],
  },
  {
    name: 'WEEKLY TESTING',
    file: 'testing.ts',
    code: [
      '// testing.ts — let the data decide',
      "every('monday', async () => {",
      "  const ads = await meta.ads({ campaign: 'test' })",
      '  for (const ad of ads) {',
      '    if (ad.cpa > target.cpa * 1.3) await ad.pause()',
      '    if (ad.isWinner) await studio.remix(ad, { n: 5 })',
      '  }',
      '})',
      '// 6 paused · 5 new versions of the winner live',
    ],
  },
  {
    name: 'CAMPAIGN SCALING',
    file: 'scaling.ts',
    code: [
      '// scaling.ts — winners earn the budget',
      "const winners = await meta.ads({ tag: 'winner' })",
      'for (const ad of winners) {',
      "  await campaigns.move(ad, 'scale')",
      '  await ad.budget.increase(0.2)',
      '}',
      '',
      'await fatigue.watch(winners, { refreshAt: 0.8 })',
      '// next winner already in testing',
    ],
  },
  {
    name: 'AD CONVERSATIONS',
    file: 'conversations.ts',
    code: [
      '// conversations.ts — every question, under 60s',
      "meta.on(['comment', 'dm'], async (msg) => {",
      '  const answer = await agent.reply(msg, store.knowledge)',
      '  await msg.respond(answer, { link: answer.product })',
      '  if (answer.sensitive) await team.handoff(msg)',
      '  await insight.log(msg.question)',
      '})',
      "// 'Does this ship to Germany?' → replied in 42s",
    ],
  },
  {
    name: 'WEEKLY REPORT',
    file: 'weekly-report.ts',
    code: [
      '// weekly-report.ts — one page, every Monday',
      "schedule('0 8 * * MON', async () => {",
      "  const ads = await meta.insights({ range: '7d' })",
      "  const sales = await shopify.orders({ range: '7d' })",
      '  const page = await agent.summarize({ ads, sales })',
      '',
      "  await slack.post('#growth', page.whatWon())",
      '  // what won · what is next · and why',
      '})',
    ],
  },
];

const LOGS = [
  ['ok', 'batch 03: 24 new ads ready'],
  ['in', 'angle found: "the gift"'],
  ['ok', 'ad 14 live · hook: saves time'],
  ['hot', 'ad set 7 paused (cpa over target)'],
  ['ok', 'budget +20% → ad 3'],
  ['in', 'comment answered in 42s'],
  ['ok', 'dm: link to 50ml sent'],
  ['in', '5 new versions of winner queued'],
  ['ok', 'human review: 24/24 approved'],
  ['hot', 'fatigue alert: ad 2 at 80%'],
  ['ok', 'weekly report posted to #growth'],
  ['in', 'reviews mined: 312 new'],
  ['ok', 'test campaign: new winner found'],
  ['in', 'question logged → new angle'],
];

const C = {
  bg: '#150d13',
  wall: '#2c1b26',
  wallSide: '#24161f',
  floor: '#1c1219',
  desk: '#3a2631',
  metal: '#1b1218',
  paper: '#f3eeec',
  red: '#d4978e', // brand rose (glow)
  warm: '#ffc9a8',
};
const MONO = '"JetBrains Mono", ui-monospace, monospace';
const SYN = { kw: '#e8a89e', str: '#ebc9a8', num: '#f0b3a4', fn: '#f3eeec', dim: '#8a7c84', com: '#75666f', text: '#d9d0d3', accent: '#d4978e', status: '#6e3a45', bg: '#150d13', bar: '#1e141b' };
const KEYWORDS = /^(import|from|export|async|function|const|await|if|return|new|for|of|every|schedule|flow)$/;

/* ---------- textures ---------- */
function radialTexture(stops) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  stops.forEach(([o, col]) => grd.addColorStop(o, col));
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}
function beamTexture() {
  const c = document.createElement('canvas');
  c.width = 4; c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createLinearGradient(0, 128, 0, 0);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 4, 128);
  return new CanvasTexture(c);
}

/* ---------- neon sign from the brand logo ---------- */
function neonLogoTexture(onReady) {
  const W = 1024, H = 360;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  const svg = logoRaw
    .replace('<svg ', '<svg width="900" height="296" ')
    .replace('<g class="lg-top">', '<g fill="#ffe8e2">')
    .replace('<g class="lg-down">', '<g fill="#ffe8e2">')
    .replace('<g class="lg-waves">', '<g fill="#ff9f94">')
    .replace('<circle class="lg-dot"', '<circle fill="#ff9f94"');
  const img = new Image();
  img.onload = () => {
    const x = (W - 900) / 2, y = (H - 296) / 2;
    g.shadowColor = '#e0786f';
    g.shadowBlur = 40;
    g.drawImage(img, x, y, 900, 296);
    g.shadowBlur = 14;
    g.drawImage(img, x, y, 900, 296);
    g.shadowBlur = 0;
    g.drawImage(img, x, y, 900, 296);
    tex.needsUpdate = true;
    if (onReady) onReady();
  };
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  return tex;
}

/* ---------- code editor screen ---------- */
class EditorScreen {
  constructor(w = 640, h = 360) {
    this.c = document.createElement('canvas');
    this.c.width = w; this.c.height = h;
    this.g = this.c.getContext('2d');
    this.tex = new CanvasTexture(this.c);
    this.tex.colorSpace = SRGBColorSpace;
    this.tex.anisotropy = 4;
    this.w = w; this.h = h;
    this.fs = 17; this.lh = 24;
    this.g.font = `400 ${this.fs}px ${MONO}`;
    this.cw = this.g.measureText('M').width;
    this.top = 40; this.left = 54;
    this.maxLines = Math.floor((h - this.top - 30) / this.lh);
    this.setAgent(AGENTS[0]);
  }
  setAgent(agent) {
    this.agent = agent;
    this.text = agent.code.join('\n');
    this.typed = 0;
    this.scroll = 0;
    this.done = false;
    this.doneAt = 0;
    this.pause = 0;
  }
  update(dt, speed) {
    if (this.typed < this.text.length) {
      if (this.pause > 0) { this.pause -= dt; return; }
      const before = this.typed;
      this.typed = Math.min(this.text.length, this.typed + dt * 48 * speed);
      // a tiny human pause at the end of each line
      if (this.text.slice(Math.floor(before), Math.floor(this.typed)).includes('\n')) this.pause = 0.18;
    } else if (!this.done) {
      this.done = true;
      this.doneAt = performance.now();
    }
  }
  draw(t) {
    const { g, w, h, lh, cw, left, top } = this;
    if (!this.prepared(t)) return;
    g.fillStyle = SYN.bg;
    g.fillRect(0, 0, w, h);
    // tab bar
    g.fillStyle = SYN.bar;
    g.fillRect(0, 0, w, 28);
    g.fillStyle = SYN.accent; g.beginPath(); g.arc(16, 14, 5, 0, 7); g.fill();
    g.fillStyle = '#4e3f48'; g.beginPath(); g.arc(32, 14, 5, 0, 7); g.fill();
    g.beginPath(); g.arc(48, 14, 5, 0, 7); g.fill();
    g.fillStyle = SYN.bg;
    g.fillRect(66, 4, 170, 24);
    g.fillStyle = SYN.fn;
    g.font = `500 13px ${MONO}`;
    g.fillText(this.agent.file, 78, 21);
    g.fillStyle = SYN.accent;
    g.fillRect(66, 4, 170, 2);

    const { lines } = this;

    g.save();
    g.beginPath(); g.rect(0, 30, w, h - 56); g.clip();
    g.font = `400 ${this.fs}px ${MONO}`;
    for (let i = 0; i < lines.length; i++) {
      const y = top + 8 + i * lh - this.scroll;
      if (y < 20 || y > h) continue;
      g.fillStyle = '#4e4048';
      g.fillText(String(i + 1).padStart(2, ' '), 14, y);
      this.drawLine(lines[i], left, y);
    }
    // caret
    if (this.caretOn) {
      const last = lines[lines.length - 1] || '';
      const y = top + 8 + (lines.length - 1) * lh - this.scroll;
      g.fillStyle = SYN.accent;
      g.fillRect(left + last.length * cw + 1, y - this.fs + 2, 2, this.fs + 2);
    }
    g.restore();

    // status bar
    g.fillStyle = SYN.status;
    g.fillRect(0, h - 24, w, 24);
    g.fillStyle = SYN.fn;
    g.font = `500 12px ${MONO}`;
    g.fillText(`● ${this.done ? 'SAVED' : 'WRITING'}  ·  main  ·  TypeScript`, 12, h - 8);
    const ln = `Ln ${lines.length}, Col ${(lines[lines.length - 1] || '').length + 1}`;
    g.fillText(ln, w - 12 - g.measureText(ln).width, h - 8);
    this.tex.needsUpdate = true;
  }
  /** advance scroll + decide whether anything visible changed since the last upload */
  prepared(t) {
    const shown = this.text.slice(0, Math.floor(this.typed));
    this.lines = shown.split('\n');
    const target = Math.max(0, this.lines.length - this.maxLines) * this.lh;
    this.scroll += (target - this.scroll) * 0.2;
    this.caretOn = Math.floor(t * 2.2) % 2 === 0 || !this.done;
    const key = shown.length + '|' + this.caretOn + '|' + Math.round(this.scroll) + '|' + this.done + '|' + this.agent.file;
    if (key === this.lastKey) return false;
    this.lastKey = key;
    return true;
  }
  drawLine(line, x, y) {
    const { g, cw } = this;
    const ci = line.indexOf('//');
    if (ci === 0 || (ci > 0 && line.trimStart().startsWith('//'))) {
      g.fillStyle = SYN.com;
      g.fillText(line, x, y);
      return;
    }
    // tokens: strings | words | everything else
    const re = /('[^']*'?|"[^"]*"?|[A-Za-z_$][\w$]*|\d+(?:\.\d+)?|\s+|.)/g;
    let m;
    let col = 0;
    while ((m = re.exec(line))) {
      const tok = m[0];
      let color = SYN.text;
      if (tok[0] === "'" || tok[0] === '"') color = SYN.str;
      else if (KEYWORDS.test(tok)) color = SYN.kw;
      else if (/^\d/.test(tok)) color = SYN.num;
      else if (/^[A-Za-z_$]/.test(tok) && line[m.index + tok.length] === '(') color = SYN.fn;
      else if (/^[{}()[\]]$/.test(tok)) color = SYN.dim;
      g.fillStyle = color;
      g.fillText(tok, x + col * cw, y);
      col += tok.length;
    }
  }
}

/* ---------- terminal screen ---------- */
class TerminalScreen {
  constructor(w = 512, h = 324) {
    this.c = document.createElement('canvas');
    this.c.width = w; this.c.height = h;
    this.g = this.c.getContext('2d');
    this.tex = new CanvasTexture(this.c);
    this.tex.colorSpace = SRGBColorSpace;
    this.tex.anisotropy = 4;
    this.w = w; this.h = h;
    this.lh = 21;
    this.lines = [];
    this.scroll = 0;
    this.next = 0;
    this.clock = 23 * 3600 + 41 * 60 + 7;
    this.idx = 0;
    for (let i = 0; i < 8; i++) this.push();
    this.scroll = this.targetScroll();
  }
  push() {
    const [kind, msg] = LOGS[this.idx++ % LOGS.length];
    this.clock += 1 + Math.floor(Math.random() * 9);
    const s = this.clock;
    const ts = [Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60].map((v) => String(v).padStart(2, '0')).join(':');
    this.lines.push({ kind, msg, ts });
    if (this.lines.length > 40) { this.lines.shift(); this.scroll -= this.lh; }
  }
  targetScroll() {
    const visible = Math.floor((this.h - 46) / this.lh);
    return Math.max(0, this.lines.length - visible) * this.lh;
  }
  update(dt, speed) {
    this.next -= dt * speed;
    if (this.next <= 0) {
      this.push();
      this.next = 0.35 + Math.random() * 0.75;
    }
  }
  draw() {
    const { g, w, h, lh } = this;
    this.scroll += (this.targetScroll() - this.scroll) * 0.18;
    const key = this.idx + '|' + Math.round(this.scroll);
    if (key === this.lastKey) return;
    this.lastKey = key;
    g.fillStyle = '#120a10';
    g.fillRect(0, 0, w, h);
    g.fillStyle = SYN.bar;
    g.fillRect(0, 0, w, 26);
    g.font = `500 12px ${MONO}`;
    g.fillStyle = '#8f8085';
    g.fillText('agents — production', 12, 18);
    g.fillStyle = '#8fd4a8';
    g.beginPath(); g.arc(w - 18, 13, 4.5, 0, 7); g.fill();

    g.save();
    g.beginPath(); g.rect(0, 28, w, h - 28); g.clip();
    g.font = `400 14px ${MONO}`;
    for (let i = 0; i < this.lines.length; i++) {
      const y = 50 + i * lh - this.scroll;
      if (y < 20 || y > h + lh) continue;
      const l = this.lines[i];
      g.fillStyle = '#5a4b50';
      g.fillText(l.ts, 12, y);
      g.fillStyle = l.kind === 'ok' ? '#8fd4a8' : l.kind === 'hot' ? SYN.kw : SYN.text;
      g.fillText(l.kind === 'ok' ? '✓' : l.kind === 'hot' ? '●' : '→', 92, y);
      g.fillStyle = l.kind === 'in' ? '#a89ca0' : '#e8e1d6';
      g.fillText(l.msg, 112, y);
    }
    g.restore();
    this.tex.needsUpdate = true;
  }
}

/* ========================================================= */
export function createHeroScene(container, opts = {}) {
  const { onActive = () => {}, reducedMotion = false } = opts;

  const isTouch = window.matchMedia('(hover: none)').matches;
  const lowPower = isTouch || (navigator.hardwareConcurrency || 8) <= 4;
  let dpr = Math.min(window.devicePixelRatio, lowPower ? 1.25 : 1.5);

  const renderer = new WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance', stencil: false });
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(C.bg, 1);
  container.appendChild(renderer.domElement);

  const scene = new Scene();
  scene.background = new Color(C.bg);
  scene.fog = new Fog(C.bg, 14, 30);
  const camera = new PerspectiveCamera(32, 1, 0.1, 60);

  /* ---------- shared materials / helpers ---------- */
  const lam = (color) => new MeshLambertMaterial({ color });
  const M = {
    wall: lam(C.wall), wallSide: lam(C.wallSide), floor: lam(C.floor),
    desk: lam(C.desk), deskDark: lam('#2a1e22'), metal: lam(C.metal),
    bezel: lam('#120d10'), paperDim: lam('#bfb6a8'),
  };
  const box = (w, h, d, mat, x, y, z, parent = scene) => {
    const m = new Mesh(new BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  };
  const UP = new Vector3(0, 1, 0);
  const between = (geo, mat, a, b) => {
    const m = new Mesh(geo, mat);
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(UP, b.clone().sub(a).normalize());
    scene.add(m);
    return m;
  };
  const glowTex = radialTexture([[0, 'rgba(255,255,255,1)'], [0.3, 'rgba(255,255,255,0.35)'], [1, 'rgba(255,255,255,0)']]);
  const softTex = radialTexture([[0, 'rgba(255,255,255,0.9)'], [0.5, 'rgba(255,255,255,0.25)'], [1, 'rgba(255,255,255,0)']]);
  const additive = (color, opacity, map = softTex) => new MeshBasicMaterial({ color, map, transparent: true, opacity, blending: AdditiveBlending, depthWrite: false });
  const flat = (w, h, mat, x, y, z, rx = 0, ry = 0) => {
    const m = new Mesh(new PlaneGeometry(w, h), mat);
    m.position.set(x, y, z);
    m.rotation.set(rx, ry, 0);
    scene.add(m);
    return m;
  };

  /* ---------- lights ---------- */
  scene.add(new HemisphereLight('#5e3f52', '#0c060b', 1.8));
  const lampLight = new PointLight(C.warm, 16, 6.5, 1.3);
  scene.add(lampLight);
  const screenLight = new PointLight('#ffe6e2', 5, 5, 1.4);
  screenLight.position.set(0.3, 2.3, 0.5);
  scene.add(screenLight);
  const neonLight = new PointLight('#e08a80', 9, 6, 1.4);
  neonLight.position.set(1.3, 3.5, -0.9);
  scene.add(neonLight);

  /* ---------- room ---------- */
  flat(40, 40, M.floor, 0, 0, 0, -Math.PI / 2);
  flat(40, 20, M.wall, 0, 10, -1.4);
  flat(40, 20, M.wallSide, -5.4, 10, 0, 0, Math.PI / 2);
  box(40, 0.14, 0.04, M.deskDark, 0, 0.07, -1.38);

  // rug
  const rug = new Mesh(new CircleGeometry(2.6, 48), lam('#26171f'));
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(0.2, 0.01, 0.9);
  scene.add(rug);

  /* ---------- desk ---------- */
  const DESK_Y = 1.5;
  box(4.5, 0.1, 1.7, M.desk, 0, DESK_Y, -0.5);
  box(0.08, DESK_Y - 0.05, 1.6, M.deskDark, -2.15, (DESK_Y - 0.05) / 2, -0.5);
  box(0.08, DESK_Y - 0.05, 1.6, M.deskDark, 2.15, (DESK_Y - 0.05) / 2, -0.5);
  box(4.2, 0.5, 0.04, M.deskDark, 0, DESK_Y - 0.35, -1.25);
  // red underglow strip along the back edge (brand accent)
  box(4.3, 0.02, 0.02, new MeshBasicMaterial({ color: C.red }), 0, DESK_Y + 0.06, -1.32);
  const wallGlow = flat(6.5, 2.6, additive('#a06969', 0.36), 0, DESK_Y + 0.9, -1.39);

  /* ---------- monitors ---------- */
  const editor = new EditorScreen();
  const term = new TerminalScreen();

  function monitor(x, z, ry, w, h, tex) {
    const g = new Group();
    g.position.set(x, DESK_Y + 0.05, z);
    g.rotation.y = ry;
    box(0.55, 0.03, 0.32, M.metal, 0, 0.015, 0, g);
    box(0.08, 0.5, 0.06, M.metal, 0, 0.27, -0.06, g);
    box(w + 0.1, h + 0.1, 0.06, M.bezel, 0, 0.5 + h / 2, -0.02, g);
    const screen = new Mesh(new PlaneGeometry(w, h), new MeshBasicMaterial({ map: tex, toneMapped: false }));
    screen.position.set(0, 0.5 + h / 2, 0.012);
    g.add(screen);
    const bloom = new Mesh(new PlaneGeometry(w * 1.7, h * 1.9), additive('#ffd7d7', 0.1));
    bloom.position.set(0, 0.5 + h / 2, 0.02);
    g.add(bloom);
    scene.add(g);
    return { g, screen, bloom };
  }
  const mainMon = monitor(-0.5, -0.9, 0.12, 1.92, 1.08, editor.tex);
  const sideMon = monitor(1.45, -0.8, -0.32, 1.28, 0.81, term.tex);
  // light the screens throw onto the desk
  const deskGlow = flat(3.2, 1.4, additive('#ffe6e6', 0.12), 0.3, DESK_Y + 0.056, -0.25, -Math.PI / 2);

  /* ---------- keyboard, mouse, mug, phone ---------- */
  box(1.35, 0.05, 0.42, lam('#1a1316'), -0.35, DESK_Y + 0.075, 0.05);
  const keyGlow = flat(1.6, 0.7, additive(C.red, 0.35), -0.35, DESK_Y + 0.052, 0.05, -Math.PI / 2);
  const keycaps = box(1.25, 0.012, 0.34, new MeshBasicMaterial({ color: '#3a1d27' }), -0.35, DESK_Y + 0.106, 0.05);
  box(0.14, 0.05, 0.24, lam('#1a1316'), 0.62, DESK_Y + 0.075, 0.1);

  // mug + phone
  const mugGroup = new Group();
  mugGroup.position.set(1.05, DESK_Y + 0.16, 0.12);
  scene.add(mugGroup);
  mugGroup.add(new Mesh(new CylinderGeometry(0.11, 0.1, 0.22, 16), M.paperDim));
  const handle = new Mesh(new TorusGeometry(0.06, 0.018, 6, 12), M.paperDim);
  handle.position.x = 0.12;
  mugGroup.add(handle);

  const phoneGroup = new Group();
  phoneGroup.position.set(1.45, DESK_Y + 0.058, -0.05);
  phoneGroup.rotation.y = -0.4;
  scene.add(phoneGroup);
  box(0.18, 0.016, 0.34, M.bezel, 0, 0, 0, phoneGroup);
  const phoneScreen = new Mesh(new PlaneGeometry(0.15, 0.3), new MeshBasicMaterial({ color: '#151012' }));
  phoneScreen.rotation.x = -Math.PI / 2;
  phoneScreen.position.y = 0.0095;
  phoneGroup.add(phoneScreen);
  const phoneGlow = new Mesh(new PlaneGeometry(0.8, 0.8), additive(C.paper, 0));
  phoneGlow.rotation.x = -Math.PI / 2;
  phoneGlow.position.y = 0.012;
  phoneGroup.add(phoneGlow);

  /* ---------- AI hologram on the desk ---------- */
  const HOLO = new Vector3(1.98, DESK_Y + 0.05, 0.08);
  const HOLO_Y = HOLO.y + 0.62;
  const puck = new Mesh(new CylinderGeometry(0.15, 0.19, 0.06, 24), lam('#1a1117'));
  puck.position.set(HOLO.x, HOLO.y + 0.03, HOLO.z);
  scene.add(puck);
  const puckRing = new Mesh(new TorusGeometry(0.14, 0.009, 6, 40), new MeshBasicMaterial({ color: '#ffb8ad' }));
  puckRing.rotation.x = Math.PI / 2;
  puckRing.position.set(HOLO.x, HOLO.y + 0.064, HOLO.z);
  scene.add(puckRing);
  const holoBeamMat = new MeshBasicMaterial({ color: '#ffb3a6', alphaMap: beamTexture(), transparent: true, opacity: 0.16, blending: AdditiveBlending, depthWrite: false, side: DoubleSide });
  const holoBeam = new Mesh(new CylinderGeometry(0.34, 0.12, 0.72, 28, 1, true), holoBeamMat);
  holoBeam.position.set(HOLO.x, HOLO.y + 0.43, HOLO.z);
  scene.add(holoBeam);
  const holo = new Group();
  holo.position.set(HOLO.x, HOLO_Y, HOLO.z);
  scene.add(holo);
  const holoWireMat = new LineBasicMaterial({ color: '#ffc9bf', transparent: true, opacity: 0.8, blending: AdditiveBlending, depthWrite: false });
  const holoWire = new LineSegments(new EdgesGeometry(new IcosahedronGeometry(0.17, 1)), holoWireMat);
  holo.add(holoWire);
  const holoNucleus = new Mesh(new IcosahedronGeometry(0.06, 0), new MeshBasicMaterial({ color: '#fff0ec' }));
  holo.add(holoNucleus);
  const holoRingMat = new MeshBasicMaterial({ color: '#ffb8ad', transparent: true, opacity: 0.5, blending: AdditiveBlending, depthWrite: false });
  const holoRingA = new Mesh(new TorusGeometry(0.27, 0.004, 4, 64), holoRingMat);
  const holoRingB = new Mesh(new TorusGeometry(0.32, 0.003, 4, 64), holoRingMat);
  holoRingA.rotation.x = 1.2;
  holoRingB.rotation.x = 1.9;
  holo.add(holoRingA, holoRingB);
  const holoGlow = new Sprite(new SpriteMaterial({ map: glowTex, color: '#e0897f', transparent: true, blending: AdditiveBlending, depthWrite: false, opacity: 0.55 }));
  holoGlow.scale.setScalar(1.0);
  holo.add(holoGlow);
  // particles rising through the beam
  const HP = 22;
  const hpPos = new Float32Array(HP * 3);
  const hpSeed = Array.from({ length: HP }, () => ({ a: Math.random() * Math.PI * 2, r: 0.04 + Math.random() * 0.2, t: Math.random(), v: 0.15 + Math.random() * 0.25 }));
  const hpGeo = new BufferGeometry();
  hpGeo.setAttribute('position', new BufferAttribute(hpPos, 3));
  const holoParticles = new Points(hpGeo, new PointsMaterial({ color: '#ffd6cf', size: 0.03, map: glowTex, transparent: true, opacity: 0.85, depthWrite: false, blending: AdditiveBlending }));
  scene.add(holoParticles);

  /* ---------- desk lamp ---------- */
  const lampMat = lam('#2b2023');
  const base = new Mesh(new CylinderGeometry(0.2, 0.25, 0.06, 20), lampMat);
  const B = new Vector3(-2.0, DESK_Y + 0.08, -0.9);
  base.position.copy(B);
  scene.add(base);
  const E = new Vector3(-1.95, DESK_Y + 1.05, -1.08);
  const H = new Vector3(-1.62, DESK_Y + 1.2, -0.35);
  const T = new Vector3(-1.05, DESK_Y + 0.055, 0.15);
  const rod = new CylinderGeometry(0.028, 0.028, 1, 8);
  between(rod, lampMat, B, E).scale.y = B.distanceTo(E);
  between(rod, lampMat, E, H).scale.y = E.distanceTo(H);
  const joint = new Mesh(new IcosahedronGeometry(0.05, 0), lampMat);
  joint.position.copy(E);
  scene.add(joint);
  const dir = T.clone().sub(H).normalize();
  const head = new Mesh(new ConeGeometry(0.2, 0.32, 20, 1, true), new MeshLambertMaterial({ color: '#a06969', side: DoubleSide }));
  head.position.copy(H);
  head.quaternion.setFromUnitVectors(UP, dir.clone().negate());
  scene.add(head);
  const bulbPos = H.clone().addScaledVector(dir, 0.1);
  const bulb = new Mesh(new IcosahedronGeometry(0.075, 1), new MeshBasicMaterial({ color: '#fff3e0' }));
  bulb.position.copy(bulbPos);
  scene.add(bulb);
  const bulbGlow = new Sprite(new SpriteMaterial({ map: glowTex, color: C.warm, transparent: true, blending: AdditiveBlending, depthWrite: false, opacity: 0.9 }));
  bulbGlow.position.copy(bulbPos);
  bulbGlow.scale.setScalar(1.1);
  scene.add(bulbGlow);
  lampLight.position.copy(bulbPos).addScaledVector(dir, 0.35);
  const coneMat = new MeshBasicMaterial({ color: C.warm, alphaMap: beamTexture(), transparent: true, opacity: 0.16, blending: AdditiveBlending, depthWrite: false, side: DoubleSide });
  const cone = between(new CylinderGeometry(0.85, 0.12, 1, 28, 1, true), coneMat, bulbPos, T);
  cone.scale.y = bulbPos.distanceTo(T);
  const pool = flat(2.4, 2.4, additive(C.warm, 0.5), T.x, T.y, T.z, -Math.PI / 2);

  // dust floating in the lamp light
  const DUST = lowPower ? 30 : 60;
  const dp = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i++) {
    const k = Math.random();
    const p = bulbPos.clone().lerp(T, k);
    dp[i * 3] = p.x + (Math.random() - 0.5) * 0.9 * k;
    dp[i * 3 + 1] = p.y + Math.random() * 0.2;
    dp[i * 3 + 2] = p.z + (Math.random() - 0.5) * 0.9 * k;
  }
  const dustGeo = new BufferGeometry();
  dustGeo.setAttribute('position', new BufferAttribute(dp, 3));
  const dustMat = new PointsMaterial({ color: '#ffe2c4', size: 0.025, map: glowTex, transparent: true, opacity: 0.7, depthWrite: false, blending: AdditiveBlending });
  const dust = new Points(dustGeo, dustMat);
  scene.add(dust);

  /* ---------- PC tower ---------- */
  box(0.5, 1.25, 1.1, lam('#1a1316'), 2.75, 0.625, -0.5);
  const ledStrip = box(0.03, 1.0, 0.02, new MeshBasicMaterial({ color: C.red }), 2.62, 0.62, 0.055);
  const leds = [0, 1, 2].map((i) => box(0.035, 0.035, 0.02, new MeshBasicMaterial({ color: i === 0 ? '#8fd4a8' : C.red }), 2.82 + i * 0.07, 1.12, 0.055));
  flat(0.9, 1.0, new MeshBasicMaterial({ color: '#2a1420' }), 3.002, 0.66, -0.5, 0, Math.PI / 2);
  const fanMat = new MeshBasicMaterial({ color: '#e08a80' });
  const fans = [0.95, 0.42].map((y) => {
    const f = new Mesh(new TorusGeometry(0.17, 0.014, 6, 32), fanMat);
    f.position.set(3.005, y, -0.5);
    f.rotation.y = Math.PI / 2;
    scene.add(f);
    return f;
  });
  const towerGlow = flat(1.6, 1.6, additive(C.red, 0.3), 3.01, 0.66, -0.5, 0, Math.PI / 2);

  /* ---------- shelf + books ---------- */
  box(1.7, 0.06, 0.34, M.deskDark, -1.5, 3.35, -1.22);
  [['#5a2f45', 0.42], ['#2e2229', 0.5], ['#a06969', 0.38], ['#abadb0', 0.46], ['#414042', 0.34]].forEach(([c, h], i) => {
    const b = box(0.11, h, 0.26, lam(c), -2.15 + i * 0.13, 3.38 + h / 2, -1.22);
    if (i === 4) { b.rotation.z = 0.35; b.position.x += 0.08; }
  });
  const pot = new Mesh(new CylinderGeometry(0.11, 0.09, 0.2, 12), lam('#abadb0'));
  pot.position.set(-0.85, 3.48, -1.22);
  scene.add(pot);
  const leaf = new Mesh(new IcosahedronGeometry(0.2, 0), lam('#2e3b30'));
  leaf.position.set(-0.85, 3.7, -1.22);
  scene.add(leaf);

  // floor plant
  const fpot = new Mesh(new CylinderGeometry(0.3, 0.24, 0.55, 14), lam('#2a1e22'));
  fpot.position.set(-3.1, 0.275, -0.55);
  scene.add(fpot);
  const leafMat = lam('#253128');
  [[0, 0.95, 0, 0.42], [0.18, 1.3, 0.05, 0.3], [-0.2, 1.2, -0.05, 0.32]].forEach(([x, y, z, r]) => {
    const l = new Mesh(new IcosahedronGeometry(r, 0), leafMat);
    l.position.set(-3.1 + x, y, -0.55 + z);
    scene.add(l);
  });

  /* ---------- neon sign: the Opside Down logo ---------- */
  const neonMat = new MeshBasicMaterial({ map: neonLogoTexture(), transparent: true, depthWrite: false, toneMapped: false });
  flat(2.5, 2.5 * (360 / 1024), neonMat, 1.3, 3.5, -1.36);
  const neonGlow = flat(3.6, 2.2, additive('#c46f6a', 0.5), 1.3, 3.5, -1.385);

  /* ---------- state ---------- */
  const state = {
    active: 0,
    lampOn: true,
    lamp: 1,
    flickerUntil: 0,
    nextFlicker: performance.now() + 3500,
    neon: 1,
    neonFlickerUntil: 0,
    nextNeon: performance.now() + 7000,
    phone: 0,
    nextPhone: performance.now() + 2500,
    pointer: { x: 0, y: 0 }, smooth: { x: 0, y: 0 },
    scroll: 0,
    autoPausedUntil: 0,
    running: false,
    visible: true,
    mobile: false,
    drawAcc: 1,
    scrolling: false,
    skip: 0,
    ledAcc: 0,
    perfAcc: 0, perfN: 0,
  };
  const holoState = { spin: 1, flash: 0, wasDone: false };
  const ROSE_TINT = new Color(1, 0.72, 0.68);
  const camBase = new Vector3();
  const look = new Vector3();
  const lookBase = new Vector3();
  const CENTER = new Vector3(0.2, 2.0, -0.4);

  /* ---------- layout ---------- */
  function layout() {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    state.mobile = w < 900;
    if (state.mobile) {
      camera.fov = 40;
      const tanHalf = Math.tan(MathUtils.degToRad(20));
      const dist = Math.max(9, 3.0 / (tanHalf * camera.aspect));
      lookBase.set(CENTER.x, CENTER.y - tanHalf * dist * 0.4, CENTER.z);
      camBase.set(lookBase.x + 1.0, CENTER.y + 1.3, CENTER.z + dist);
    } else {
      camera.fov = 32;
      const tanHalf = Math.tan(MathUtils.degToRad(16));
      const dist = MathUtils.clamp(3.6 / (0.6 * tanHalf * camera.aspect), 8, 22);
      const halfW = tanHalf * camera.aspect * dist;
      lookBase.set(CENTER.x + halfW * 0.5, CENTER.y - 0.05, CENTER.z);
      camBase.set(lookBase.x + 1.8, CENTER.y + 1.5, CENTER.z + dist);
    }
    camera.updateProjectionMatrix();
  }

  /* ---------- controls ---------- */
  function setActive(i, user = false) {
    holoState.flash = 1;
    const n = AGENTS.length;
    state.active = ((i % n) + n) % n;
    editor.setAgent(AGENTS[state.active]);
    state.drawAcc = 1;
    if (user) state.autoPausedUntil = performance.now() + 9000;
    onActive(state.active, AGENTS[state.active]);
  }
  function flicker(ms = 600) {
    state.flickerUntil = performance.now() + ms;
  }
  function toggleLamp() {
    state.lampOn = !state.lampOn;
    if (state.lampOn) flicker(450);
  }

  const el = renderer.domElement;
  function onWindowMove(e) {
    const r = el.getBoundingClientRect();
    if (e.clientY > r.bottom) return;
    state.pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    state.pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
  }
  function onClick() { flicker(700); }
  window.addEventListener('pointermove', onWindowMove, { passive: true });
  el.addEventListener('click', onClick);
  el.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    stop();
    container.classList.add('is-fallback');
    el.style.opacity = '0';
  });

  /* ---------- frame ---------- */
  const timer = new Timer();
  timer.connect(document);
  const speed = reducedMotion ? 0.4 : 1;

  function frame() {
    // while the page is actively scrolling, render the 3D at 30fps so the GPU keeps the scroll at 60
    if (state.scrolling && (++state.skip & 1)) return;
    timer.update();
    const dt = Math.min(timer.getDelta(), 1 / 20);
    const t = timer.getElapsed();
    const now = performance.now();

    // adaptive resolution: if frames are slow, render fewer pixels
    // (ignore scroll frames — never resize the canvas mid-scroll)
    if (state.scrolling) { state.perfAcc = 0; state.perfN = 0; }
    state.perfAcc += timer.getDelta(); state.perfN++;
    if (state.perfN >= 90) {
      if (state.perfAcc / state.perfN > 0.026 && dpr > 1) {
        dpr = Math.max(1, dpr - 0.25);
        renderer.setPixelRatio(dpr);
        layout();
      }
      state.perfAcc = 0; state.perfN = 0;
    }

    // screens: simulate every frame, redraw at ~20fps
    editor.update(dt, speed);
    term.update(dt, speed);
    if (editor.done && !reducedMotion && now > state.autoPausedUntil && now - editor.doneAt > 1600) setActive(state.active + 1);
    state.drawAcc += dt;
    if (state.drawAcc >= 0.05 && !state.scrolling) {
      editor.draw(t);
      term.draw();
      state.drawAcc = 0;
    }

    // lamp: steady, with random flickers
    if (!reducedMotion && now > state.nextFlicker) {
      flicker(250 + Math.random() * 500);
      state.nextFlicker = now + 4000 + Math.random() * 6000;
    }
    let lampTarget = state.lampOn ? 1 : 0.04;
    if (state.lampOn && now < state.flickerUntil) lampTarget = Math.random() > 0.45 ? 1 : 0.12;
    state.lamp = now < state.flickerUntil ? lampTarget : MathUtils.damp(state.lamp, lampTarget, 12, dt);
    const L = state.lamp * (0.97 + Math.sin(t * 47) * 0.03);
    lampLight.intensity = 16 * L;
    coneMat.opacity = 0.16 * L;
    pool.material.opacity = 0.5 * L;
    bulbGlow.material.opacity = 0.9 * L;
    bulb.material.color.setScalar(0.25 + 0.75 * L);
    dustMat.opacity = 0.7 * L;

    // neon hum, rare flickers
    if (!reducedMotion && now > state.nextNeon) {
      state.neonFlickerUntil = now + 300 + Math.random() * 300;
      state.nextNeon = now + 8000 + Math.random() * 8000;
    }
    state.neon = now < state.neonFlickerUntil ? (Math.random() > 0.5 ? 1 : 0.2) : 1;
    const N = state.neon * (0.92 + Math.sin(t * 3) * 0.08);
    neonMat.opacity = Math.min(1, 0.25 + 0.75 * N);
    neonGlow.material.opacity = 0.55 * N;
    neonLight.intensity = 9 * N;

    // phone notification
    if (now > state.nextPhone) { state.phone = 1; state.nextPhone = now + 5000 + Math.random() * 4000; }
    state.phone = MathUtils.damp(state.phone, 0, 1.6, dt);
    phoneScreen.material.color.setRGB(0.08 + 0.85 * state.phone, 0.06 + 0.8 * state.phone, 0.07 + 0.75 * state.phone);
    phoneGlow.material.opacity = 0.35 * state.phone;

    // hologram: spins faster while code is being written, pulses when a file is done
    if (editor.done && !holoState.wasDone) holoState.flash = 1;
    holoState.wasDone = editor.done;
    holoState.spin = MathUtils.damp(holoState.spin, editor.done ? 0.5 : 1.8, 2, dt);
    holoState.flash = MathUtils.damp(holoState.flash, 0, 2.2, dt);
    const hf = holoState.flash;
    holo.position.y = HOLO_Y + Math.sin(t * 1.6) * 0.03;
    holoWire.rotation.y += dt * holoState.spin * speed;
    holoWire.rotation.x += dt * 0.35 * speed;
    holoNucleus.rotation.y -= dt * 1.4 * speed;
    holoRingA.rotation.z += dt * 0.9 * speed;
    holoRingB.rotation.z -= dt * 0.6 * speed;
    holo.scale.setScalar(1 + hf * 0.35);
    holoWireMat.opacity = 0.65 + Math.sin(t * 9) * 0.06 + hf * 0.3;
    holoGlow.material.opacity = 0.45 + hf * 0.5;
    holoBeamMat.opacity = 0.13 + Math.sin(t * 3.1) * 0.025 + hf * 0.12;
    puckRing.material.color.setScalar(0.75 + hf * 0.25).multiply(ROSE_TINT);
    for (let i = 0; i < HP; i++) {
      const p = hpSeed[i];
      p.t = (p.t + dt * p.v * speed) % 1;
      const r = p.r * (0.6 + p.t * 0.9);
      hpPos[i * 3] = HOLO.x + Math.cos(p.a + t * 0.5) * r;
      hpPos[i * 3 + 1] = HOLO.y + 0.08 + p.t * 0.75;
      hpPos[i * 3 + 2] = HOLO.z + Math.sin(p.a + t * 0.5) * r;
    }
    hpGeo.attributes.position.needsUpdate = true;

    // tower LEDs + fans, keyboard breathing
    state.ledAcc += dt;
    if (state.ledAcc > 0.12) {
      state.ledAcc = 0;
      leds.forEach((l, i) => { l.visible = Math.random() > (i === 0 ? 0.15 : 0.45); });
    }
    fans.forEach((f, i) => { f.rotation.x += dt * (i ? 3 : 2.4) * speed; });
    const breathe = 0.5 + Math.sin(t * 1.4) * 0.5;
    keyGlow.material.opacity = 0.22 + breathe * 0.2;
    keycaps.material.color.setRGB(0.18 + breathe * 0.12, 0.05, 0.07);
    ledStrip.material.color.setRGB(0.7 + breathe * 0.3, 0.13, 0.15);
    towerGlow.material.opacity = 0.2 + breathe * 0.15;
    wallGlow.material.opacity = 0.26 + breathe * 0.1;
    const flickerScreen = 0.92 + Math.sin(t * 2.3) * 0.04;
    mainMon.bloom.material.opacity = 0.1 * flickerScreen;
    sideMon.bloom.material.opacity = 0.08 * flickerScreen;
    deskGlow.material.opacity = 0.12 * flickerScreen;

    // dust drift
    dust.position.y = Math.sin(t * 0.5) * 0.05;
    dust.rotation.y = Math.sin(t * 0.2) * 0.04;

    // camera: parallax + scroll
    const k = reducedMotion ? 0 : 1;
    state.smooth.x = MathUtils.damp(state.smooth.x, state.pointer.x * k, 3, dt);
    state.smooth.y = MathUtils.damp(state.smooth.y, state.pointer.y * k, 3, dt);
    const px = state.smooth.x, py = state.smooth.y, sc = state.scroll;
    camera.position.set(camBase.x + px * 0.7, camBase.y + py * 0.35 + sc * 1.6, camBase.z - sc * 1.2);
    look.set(lookBase.x + px * 0.15, lookBase.y + sc * 0.4, lookBase.z);
    camera.lookAt(look);

    renderer.render(scene, camera);
  }

  /* ---------- lifecycle ---------- */
  function start() {
    if (state.running) return;
    state.running = true;
    renderer.setAnimationLoop(frame);
  }
  function stop() {
    state.running = false;
    renderer.setAnimationLoop(null);
  }
  function setVisible(v) {
    state.visible = v;
    if (v && !document.hidden) start(); else stop();
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else if (state.visible) start();
  });

  let resizeRaf = 0;
  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => { layout(); if (!state.running) renderer.render(scene, camera); });
  });
  ro.observe(container);

  layout();
  setActive(0);
  editor.draw(0);
  term.draw();
  frame();

  return {
    start,
    stop,
    setVisible,
    pulse: toggleLamp,
    flicker,
    next: () => setActive(state.active + 1, true),
    prev: () => setActive(state.active - 1, true),
    setScroll: (v) => { state.scroll = v; },
    setScrolling: (v) => { state.scrolling = v; },
  };
}
