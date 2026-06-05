/* =====================================================
   BabySteps — UI COMPONENTS (vanilla JS DOM builders)
   Each function returns a DOM element.
   ===================================================== */

const T = window.TOKENS;

/* tiny createElement helper */
function h(tag, attrs = {}, children = []) {
  const ns = (tag === 'svg' || tag === 'path' || tag === 'circle' || tag === 'ellipse'
            || tag === 'rect' || tag === 'g' || tag === 'text' || tag === 'defs'
            || tag === 'pattern' || tag === 'use')
    ? 'http://www.w3.org/2000/svg' : null;
  const el = ns ? document.createElementNS(ns, tag) : document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') el.setAttribute('class', v);
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'html') el.innerHTML = v;
    else if (ns) el.setAttribute(k, v);
    else if (k in el && typeof v !== 'object') {
      try { el[k] = v; } catch { el.setAttribute(k, v); }
    }
    else el.setAttribute(k, v);
  }
  const append = (c) => {
    if (c == null || c === false) return;
    if (Array.isArray(c)) c.forEach(append);
    else if (c.nodeType) el.appendChild(c);
    else el.appendChild(document.createTextNode(String(c)));
  };
  append(children);
  return el;
}

/* =====================================================
   Star — yellow doodle, used everywhere
   ===================================================== */
function Star({ size = 40, color, rotate = 0, style = {} } = {}) {
  const fill = color || T.c.yellow;
  const svg = h('svg', {
    class: 'star',
    width: size, height: size, viewBox: '0 0 100 100',
    style: {
      transform: `rotate(${rotate}deg)`,
      filter: 'drop-shadow(0 2px 0 rgba(0,0,0,0.06))',
      ...style,
    },
  }, [
    h('path', {
      d: 'M50 4 L62 36 L96 38 L70 60 L78 94 L50 76 L22 94 L30 60 L4 38 L38 36 Z',
      fill, stroke: T.c.ink, 'stroke-width': '2', 'stroke-linejoin': 'round',
    }),
  ]);
  return svg;
}

/* =====================================================
   Piffy — hand-drawn cat mascot
   ===================================================== */
function Piffy({ size = 100, style = {}, mood = 'wave' } = {}) {
  const svg = h('svg', {
    class: 'piffy',
    width: size, height: size, viewBox: '0 0 120 120', style,
  }, [
    h('path', { d: 'M28 38 L20 18 L42 32 Z M92 38 L100 18 L78 32 Z',
      fill: T.c.paper, stroke: T.c.ink, 'stroke-width': '2.2', 'stroke-linejoin': 'round' }),
    h('ellipse', { cx: 60, cy: 55, rx: 36, ry: 32, fill: T.c.paper, stroke: T.c.ink, 'stroke-width': '2.2' }),
    h('ellipse', { cx: 40, cy: 62, rx: 8, ry: 3.5, fill: T.c.pinkDeep, opacity: 0.45 }),
    h('ellipse', { cx: 80, cy: 62, rx: 8, ry: 3.5, fill: T.c.pinkDeep, opacity: 0.45 }),
    h('ellipse', { cx: 45, cy: 50, rx: 6, ry: 4, fill: T.c.paper, stroke: T.c.ink, 'stroke-width': '2' }),
    h('ellipse', { cx: 75, cy: 50, rx: 6, ry: 4, fill: T.c.paper, stroke: T.c.ink, 'stroke-width': '2' }),
    h('path', { d: 'M52 64 Q60 70 68 64', fill: 'none', stroke: T.c.ink, 'stroke-width': '2', 'stroke-linecap': 'round' }),
    h('path', { d: 'M58 62 Q60 65 62 62', fill: T.c.pinkDeep, stroke: T.c.ink, 'stroke-width': '1.5' }),
    h('path', { d: 'M38 85 Q60 95 82 85 L80 110 Q60 116 40 110 Z',
      fill: T.c.paper, stroke: T.c.ink, 'stroke-width': '2.2', 'stroke-linejoin': 'round' }),
    (mood === 'wave'
      ? h('path', { d: 'M82 88 Q98 78 96 60', fill: 'none', stroke: T.c.ink, 'stroke-width': '2.2', 'stroke-linecap': 'round' })
      : null),
    h('path', { d: 'M32 102 Q15 100 18 85', fill: 'none', stroke: T.c.ink, 'stroke-width': '2.2', 'stroke-linecap': 'round' }),
  ]);
  return svg;
}

/* =====================================================
   Background pattern (subtle dots + tiny stars)
   ===================================================== */
function BgPattern() {
  return h('div', { class: 'bg-pattern', 'aria-hidden': 'true' });
}

/* =====================================================
   Primary / Soft / Icon buttons
   ===================================================== */
function PrimaryButton({ text, onClick, size = 'lg', color, full = false, style = {} }) {
  const btn = h('button', {
    class: `btn-primary size-${size}${full ? ' full' : ''}`,
    style: Object.assign({}, style, color ? { background: color } : {}),
    onClick,
  }, [text]);
  return btn;
}

function SoftButton({ text, onClick, color, style = {}, extraClass = '' }) {
  return h('button', {
    class: `btn-soft ${extraClass}`,
    style: Object.assign({}, style, color ? { background: color } : {}),
    onClick,
  }, [text]);
}

function IconBtn({ icon, onClick, light = false, style = {} }) {
  return h('button', {
    class: `btn-icon ${light ? 'light' : ''}`,
    style, onClick,
  }, [icon]);
}

/* =====================================================
   Pill input (consistent 56px)
   ===================================================== */
function PillInput({ placeholder, value = '', onInput, type = 'text', iconSvg, style = {}, extraClass = '' }) {
  const input = h('input', { type, placeholder, value });
  if (onInput) input.addEventListener('input', onInput);
  const lab = h('label', {
    class: `pill-input ${extraClass}`,
    style,
  }, [
    iconSvg ? h('span', { class: 'icon' }, [iconSvg]) : null,
    input,
  ]);
  lab._input = input;
  return lab;
}

/* =====================================================
   SVG icon factory (used in pill inputs and buttons)
   ===================================================== */
const Icons = {
  user: () => svgIcon('<circle cx="10" cy="6" r="4" fill="currentColor"/><path d="M2 18c0-4 4-7 8-7s8 3 8 7" fill="currentColor"/>', 20),
  lock: () => svgIcon('<rect x="3" y="9" width="14" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M6 9V6a4 4 0 018 0v3" fill="none" stroke="currentColor" stroke-width="2"/>', 20),
  cake: () => svgIcon('<rect x="3" y="5" width="14" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 8h14M7 3v4M13 3v4" fill="none" stroke="currentColor" stroke-width="2"/>', 20),
  menu: () => svgIcon('<path d="M4 6h14M4 11h14M4 16h14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>', 22),
  back: () => svgIcon('<path d="M12 4l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>', 20),
  check: () => svgIcon('<path d="M3 7l3 3 5-6" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>', 14),
};

function svgIcon(inner, size = 20) {
  const wrap = document.createElement('span');
  wrap.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 20 20">${inner}</svg>`;
  return wrap.firstChild;
}

/* =====================================================
   Decorative art used by play cards
   ===================================================== */
function AdventureDoor() {
  return h('svg', { width: 100, height: 100, viewBox: '0 0 100 100' }, [
    h('rect', { x: 15, y: 14, width: 70, height: 80, rx: 6, fill: T.c.rust, stroke: T.c.ink, 'stroke-width': '2.2' }),
    h('rect', { x: 22, y: 22, width: 56, height: 64, rx: 3, fill: T.c.sky }),
    h('path', { d: 'M22 22 L78 22 L70 50 L30 50 Z', fill: T.c.paper, opacity: 0.6 }),
    h('circle', { cx: 50, cy: 62, r: 4, fill: T.c.yellow }),
    h('path', { d: 'M30 86 L46 60 L54 60 L70 86 Z', fill: T.c.mintDeep, stroke: T.c.ink, 'stroke-width': '1.5' }),
  ]);
}

function SmartieArt() {
  return h('svg', { width: 100, height: 100, viewBox: '0 0 100 100' }, [
    h('rect', { x: 14, y: 20, width: 68, height: 62, rx: 10, fill: T.c.yellow, stroke: T.c.ink, 'stroke-width': '2' }),
    h('path', { d: 'M22 30 L26 22 L34 26 Z', fill: T.c.yellow, stroke: T.c.ink, 'stroke-width': '1.5' }),
    h('path', { d: 'M78 30 L74 22 L66 26 Z', fill: T.c.yellow, stroke: T.c.ink, 'stroke-width': '1.5' }),
    h('ellipse', { cx: 36, cy: 48, rx: 3, ry: 2, fill: T.c.ink }),
    h('ellipse', { cx: 60, cy: 48, rx: 3, ry: 2, fill: T.c.ink }),
    h('path', { d: 'M44 56 Q48 60 52 56', fill: 'none', stroke: T.c.ink, 'stroke-width': '1.8', 'stroke-linecap': 'round' }),
    h('path', { d: 'M30 64 L38 72 M58 64 L66 72', stroke: T.c.yellowDeep, 'stroke-width': '1.5' }),
    h('text', { x: 50, y: 92, fill: T.c.inkSoft, 'font-size': '10', 'font-family': 'Lakki Reddy', 'text-anchor': 'middle' }, ['A B C']),
  ]);
}

function BigDoor() {
  return h('svg', { width: 220, height: 280, viewBox: '0 0 220 280' }, [
    h('rect', { x: 40, y: 20, width: 140, height: 240, rx: 12, fill: T.c.rust, stroke: T.c.ink, 'stroke-width': '3' }),
    h('rect', { x: 54, y: 36, width: 112, height: 208, rx: 6, fill: T.c.sky }),
    h('rect', { x: 54, y: 36, width: 112, height: 100, fill: T.c.paper, opacity: 0.6 }),
    h('circle', { cx: 160, cy: 140, r: 5, fill: T.c.yellow }),
    h('path', { d: 'M54 244 L100 180 L120 180 L166 244 Z', fill: T.c.mintDeep }),
  ]);
}

/* =====================================================
   Adventure Map scene — fantasy floating-island SVG.
   Sky gradient + sun + clouds + birds + mountains +
   diorama with grass / trees / mushrooms / river.
   ===================================================== */
function AdventureMapScene() {
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('class', 'map-scene');
  svg.setAttribute('viewBox', '0 0 430 780');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  svg.innerHTML = `
    <defs>
      <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stop-color="#FFEBC0" stop-opacity="0.95"/>
        <stop offset="55%"  stop-color="#FFD9A0" stop-opacity="0.55"/>
        <stop offset="100%" stop-color="#FFD9A0" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stop-color="#FCE9D5"/>
        <stop offset="45%"  stop-color="#F4E9DA"/>
        <stop offset="100%" stop-color="#EDE3D0" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="cloud" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stop-color="#FFFFFF" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="#CFE3F4" stop-opacity="0.6"/>
      </linearGradient>
      <linearGradient id="mtn" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stop-color="#FFFFFF"/>
        <stop offset="60%" stop-color="#CFE0F0"/>
        <stop offset="100%" stop-color="#9FB7D0"/>
      </linearGradient>
      <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stop-color="#B4DA8E"/>
        <stop offset="100%" stop-color="#8AC56C"/>
      </linearGradient>
      <linearGradient id="dirt" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stop-color="#C49A6B"/>
        <stop offset="100%" stop-color="#8B6443"/>
      </linearGradient>
      <linearGradient id="river" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stop-color="#BFE2F5"/>
        <stop offset="100%" stop-color="#6FA9D8"/>
      </linearGradient>
    </defs>

    <!-- sky tint -->
    <rect width="430" height="780" fill="url(#sky)"/>

    <!-- sun glow -->
    <circle cx="120" cy="170" r="130" fill="url(#sun-glow)"/>
    <circle cx="120" cy="170" r="55"  fill="#F6D49B" opacity="0.85"/>
    <circle cx="120" cy="170" r="40"  fill="#FBE4B7"/>

    <!-- birds (top right) -->
    <g fill="none" stroke="#5C5C66" stroke-width="2.4" stroke-linecap="round" opacity="0.75">
      <path d="M270 160 q8 -7 16 0 q8 -7 16 0"/>
      <path d="M310 180 q6 -5 12 0 q6 -5 12 0"/>
      <path d="M298 200 q5 -4 10 0 q5 -4 10 0"/>
    </g>

    <!-- mountains back -->
    <g>
      <path d="M250 360 L320 240 L360 320 L390 280 L430 360 Z" fill="url(#mtn)" opacity="0.85"/>
      <path d="M310 245 L320 240 L335 270 L325 270 Z" fill="#FFFFFF" opacity="0.9"/>
      <path d="M380 290 L390 280 L405 310 L395 310 Z" fill="#FFFFFF" opacity="0.9"/>
    </g>

    <!-- clouds -->
    <g fill="url(#cloud)" stroke="#D9E7F1" stroke-width="1">
      <path d="M30 260 q14 -22 38 -16 q12 -18 36 -8 q22 -6 32 12 q18 4 16 22 q-58 6 -120 0 q-8 -8 -2 -10z" opacity="0.9"/>
      <path d="M250 300 q14 -20 38 -14 q14 -16 34 -6 q22 -4 30 14 q18 4 14 22 q-58 6 -116 -2 q-6 -6 0 -14z" opacity="0.85"/>
    </g>

    <!-- river falling off the island -->
    <g>
      <path d="M280 470 q -10 30 0 60 q 4 35 -22 70 q -8 35 8 70 l 18 0 q -4 -40 4 -70 q 14 -35 8 -70 q -2 -30 14 -60 z"
            fill="url(#river)" opacity="0.85"/>
      <path d="M286 540 q4 12 -2 30 q-2 14 4 28" stroke="#FFFFFF" stroke-width="1.2" fill="none" opacity="0.6"/>
    </g>

    <!-- dirt underside (stalactite-ish) -->
    <path d="M55 460
             L375 440
             L385 510
             L355 545
             L320 535
             L290 565
             L260 540
             L220 575
             L190 545
             L155 575
             L120 540
             L85 565
             L60 525 Z"
          fill="url(#dirt)"/>

    <!-- grass top (parallelogram with rounded feel) -->
    <path d="M70 410
             Q60 400 80 395
             L360 375
             Q385 372 380 395
             L375 470
             Q380 482 355 482
             L80 478
             Q56 478 60 458
             Z"
          fill="url(#grass)" stroke="#5E8B41" stroke-width="1.4"/>

    <!-- white pebbles along front edge -->
    <g fill="#FAF5EC" opacity="0.95">
      <circle cx="95"  cy="476" r="3.6"/>
      <circle cx="125" cy="478" r="3"/>
      <circle cx="160" cy="476" r="3.8"/>
      <circle cx="200" cy="477" r="3"/>
      <circle cx="240" cy="476" r="3.6"/>
      <circle cx="285" cy="475" r="3.2"/>
      <circle cx="325" cy="474" r="3.6"/>
    </g>

    <!-- mushrooms (left side cluster) -->
    <g>
      <ellipse cx="105" cy="445" rx="11" ry="7" fill="#D86A6A"/>
      <path d="M100 445 L100 458 L110 458 L110 445 Z" fill="#F6E7C7"/>
      <circle cx="101" cy="442" r="2.2" fill="#FAF5EC"/>
      <circle cx="108" cy="446" r="1.6" fill="#FAF5EC"/>
      <ellipse cx="128" cy="452" rx="8" ry="5" fill="#E48B5A"/>
      <path d="M124 452 L124 462 L132 462 L132 452 Z" fill="#F6E7C7"/>
    </g>

    <!-- trees (cluster around middle) -->
    <g>
      <ellipse cx="195" cy="430" rx="34" ry="20" fill="#79B45D"/>
      <ellipse cx="180" cy="420" rx="20" ry="14" fill="#9AD17F"/>
      <ellipse cx="215" cy="425" rx="22" ry="14" fill="#6EA453"/>
      <ellipse cx="200" cy="416" rx="18" ry="12" fill="#A8DC8C"/>
    </g>

    <!-- back hill silhouette on the grass -->
    <path d="M250 390 Q300 360 360 388 L360 410 L250 410 Z" fill="#A8DC8C" opacity="0.7"/>

    <!-- tiny red flowers -->
    <g fill="#D86A6A">
      <circle cx="252" cy="455" r="2.4"/>
      <circle cx="305" cy="462" r="2.2"/>
      <circle cx="335" cy="455" r="2.4"/>
    </g>
    <g fill="#FFE082">
      <circle cx="252" cy="455" r="0.9"/>
      <circle cx="305" cy="462" r="0.9"/>
      <circle cx="335" cy="455" r="0.9"/>
    </g>

    <!-- small back star on the grass -->
    <path d="M275 392 l3 6 l7 .4 l-5 4 l1.6 6.6 l-6.6 -3.6 l-6.6 3.6 l1.6 -6.6 l-5 -4 l7 -.4 z"
          fill="#FFD167" stroke="#C58B2E" stroke-width="0.8"/>
  `;
  return svg;
}

/* expose */
Object.assign(window, {
  h, Star, Piffy, BgPattern,
  PrimaryButton, SoftButton, IconBtn, PillInput,
  Icons, AdventureDoor, SmartieArt, BigDoor,
  AdventureMapScene,
});
