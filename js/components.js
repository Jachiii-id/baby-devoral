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

/* expose */
Object.assign(window, {
  h, Star, Piffy, BgPattern,
  PrimaryButton, SoftButton, IconBtn, PillInput,
  Icons, AdventureDoor, SmartieArt, BigDoor,
});
