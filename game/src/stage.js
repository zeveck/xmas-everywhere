// The stage: one 4:3 canvas per act, drawn from the stage maps in GAME_DESIGN.md "Art direction" (in % of the stage).
// Also: NOEL's eye, taps' juice, the lucky thing, the tilted globe and the Cheer Spot, ornaments, rails, finales, the legacy picture.
import { img, data, helperFile, jobFile, toolFile, toolHandFile } from './assets.js';
import { ACTS } from './data.js';
import * as R from './rules.js';

export const W = 800, H = 600;
const px = (x) => x * W / 100, py = (y) => y * H / 100;
let cv, cx, dpr = 1, cssW = 1, cssH = 1;
const fx = { spinAt: -9, popAt: -9, parts: [], nums: [], rings: [], splats: [], squash: 0, swing: -1, swingT: 0, bob: 0, shake: 0, eyeTo: [0.5, 0.5], eyeAt: [0.5, 0.5], blink: 0,
  flash: 0, presents: [], bellAt: null, recoil: 0, arrivals: {}, dim: 0, noelBright: 0, wakeT: -1, transition: null };
let spot = { u: 0.1, v: 0.1, from: [0.1, 0.1], to: [0.1, 0.1], t: 0, resting: true };
let tNow = 0;

export function init(canvas) { cv = canvas; cx = cv.getContext('2d'); resize(); }
export function resize() {
  if (!cv) return; const r = cv.getBoundingClientRect(); cssW = Math.max(1, r.width); cssH = Math.max(1, r.height);
  dpr = Math.min(2.5, window.devicePixelRatio || 1); cv.width = Math.round(cssW * dpr); cv.height = Math.round(cssH * dpr);
}
export const toStage = (clientX, clientY) => { const r = cv.getBoundingClientRect(); return [(clientX - r.left) / r.width * W, (clientY - r.top) / r.height * H]; };
export const cssScale = () => (cv && cv.clientWidth ? cv.clientWidth : cssW) / W;

// ---------- helpers ----------
function drawFit(c, im, x, y, w, h, o = {}) { // fit inside box, feet at bottom, centred
  if (!im) return null; const s = Math.min(w / im.width, h / im.height) * (o.scale || 1); const dw = im.width * s, dh = im.height * s;
  const dx = x + (w - dw) / 2, dy = o.top ? y : y + h - dh;
  if (o.flip) { c.save(); c.translate(dx + dw, dy); c.scale(-1, 1); c.drawImage(im, 0, 0, dw, dh); c.restore(); } else c.drawImage(im, dx, dy, dw, dh);
  return { x: dx, y: dy, w: dw, h: dh, s };
}
function cover(c, im, w = W, h = H, panX = 0.5, panY = 0.5, zoom = 1) {
  if (!im) { c.fillStyle = '#1a120c'; c.fillRect(0, 0, w, h); return; }
  const s = Math.max(w / im.width, h / im.height) * zoom; const dw = im.width * s, dh = im.height * s;
  c.drawImage(im, (w - dw) * panX, (h - dh) * panY, dw, dh);
}
const ease = (t) => (t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t));
const fmtShort = (n) => { if (n < 1000) return String(Math.round(n)); const u = ['K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx']; let i = -1; while (n >= 1000 && i < u.length - 1) { n /= 1000; i++; } return (n >= 100 ? n.toFixed(0) : n >= 10 ? n.toFixed(1) : n.toFixed(2)).replace(/\.0+$|(\.\d*[1-9])0+$/, '$1') + u[i]; };
function rand(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

// ---------- NOEL and its eye ----------
const PROPS = { 1: ['box', 87, 11.5, 10, 10.1], 2: ['cabinet', 70, 18, 29, 70], 3: ['console', 24, 80, 52, 20], 4: ['core', 44, 56, 12, 44] };
let lensTint = null;
function tintedLens(color) {
  const lens = img('shared/lens'); if (!lens) return null;
  if (lensTint && lensTint.color === color) return lensTint.c;
  const c = document.createElement('canvas'); c.width = lens.width; c.height = lens.height; const g = c.getContext('2d');
  g.drawImage(lens, 0, 0); g.globalCompositeOperation = 'multiply'; g.fillStyle = color; g.fillRect(0, 0, c.width, c.height);
  g.globalCompositeOperation = 'destination-in'; g.drawImage(lens, 0, 0); lensTint = { color, c }; return c;
}
export function drawNoel(c, act, S, o = {}) {
  const [key, x, y, w, h] = PROPS[act];
  const dusty = act === 1 && !S.woke;
  const im = img(dusty ? 'shared/noel-box-dusty' : 'shared/noel-' + key) || img('shared/noel-' + key);
  const r = drawFit(c, im, px(x), py(y), px(w), py(h)); if (!r) return;
  const eyes = data('shared/noel-eyes'); const e = eyes && eyes[key];
  const ecx = e ? r.x + e.cx * r.s * (im.width / (e.w || im.width)) : r.x + r.w / 2, ecy = e ? r.y + e.cy * r.s * (im.height / (e.h || im.height)) : r.y + r.h * 0.4;
  const rad = e ? e.r * r.s * (im.width / (e.w || im.width)) : r.w * 0.15;
  drawEye(c, ecx, ecy, rad, S, dusty, o);
}
export function drawEye(c, ecx, ecy, rad, S, dusty, o = {}) {
  const locked = S.locks && S.locks.length > 0; const col = dusty ? '#2a3a30' : locked ? '#ffb347' : '#3fd47a';
  c.save(); c.beginPath(); c.arc(ecx, ecy, rad, 0, Math.PI * 2); c.clip();
  c.fillStyle = '#081208'; c.fillRect(ecx - rad, ecy - rad, rad * 2, rad * 2);
  const lens = tintedLens(col); const bright = dusty ? 0.25 : 0.85 + fx.noelBright * 0.3 + Math.sin(tNow * 2) * 0.05;
  c.globalAlpha = Math.min(1, bright);
  if (lens) c.drawImage(lens, ecx - rad, ecy - rad, rad * 2, rad * 2); else { c.fillStyle = col; c.fillRect(ecx - rad, ecy - rad, rad * 2, rad * 2); }
  c.globalAlpha = 1;
  if (!dusty) { // pupil
    const ex = ecx + (fx.eyeAt[0] - 0.5) * rad * 0.7, ey = ecy + (fx.eyeAt[1] - 0.5) * rad * 0.6; const blink = fx.blink > 0 ? 1 - Math.abs(fx.blink - 0.5) * 2 : 0;
    const g = c.createRadialGradient(ex, ey, 0, ex, ey, rad * 0.42); g.addColorStop(0, 'rgba(0,0,0,0.92)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g; c.beginPath(); c.ellipse(ex, ey, rad * 0.42, rad * 0.42 * (1 - blink), 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = 'rgba(255,255,255,0.75)'; c.beginPath(); c.ellipse(ecx - rad * 0.35, ecy - rad * 0.38, rad * 0.16, rad * 0.1, -0.6, 0, Math.PI * 2); c.fill();
  }
  c.restore();
  if (!dusty) { c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createRadialGradient(ecx, ecy, rad * 0.6, ecx, ecy, rad * 2.4);
    g.addColorStop(0, locked ? 'rgba(255,180,70,0.35)' : 'rgba(63,212,122,0.3)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(ecx - rad * 3, ecy - rad * 3, rad * 6, rad * 6); c.restore(); }
}
export function noelPortraitDusty(canvas) { const im = img('shared/noel-box-dusty'); const g = canvas.getContext('2d'); g.clearRect(0, 0, canvas.width, canvas.height); if (!im) return; const s = canvas.width / im.width; g.drawImage(im, 0, (canvas.height - im.height * s) / 2, canvas.width, im.height * s); }
// a portrait of NOEL for cards: the prop's portrait crop with the eye drawn in
export function noelPortrait(canvas, act, S) {
  const key = PROPS[act][0]; const im = img('shared/noel-' + key); const g = canvas.getContext('2d'); const sz = canvas.width; g.clearRect(0, 0, sz, sz);
  if (!im) return; const eyes = data('shared/noel-eyes'); const e = eyes && eyes[key];
  let [x, y, w, h] = e && e.portrait ? e.portrait : [0, 0, im.width, im.height];
  const k = e && e.w ? im.width / e.w : 1; x *= k; y *= k; w *= k; h *= k;
  const s = Math.min(sz / w, sz / h); const ox = (sz - w * s) / 2, oy = (sz - h * s) / 2;
  g.drawImage(im, x, y, w, h, ox, oy, w * s, h * s);
  if (e) drawEye(g, ox + (e.cx * k - x) * s, oy + (e.cy * k - y) * s, e.r * k * s, S, false);
}

// ---------- rails: one figure per tier with ×N ----------
const RAILS = {
  2: { hand: [0, 49, 25, 39], noel: [70, 70, 29, 20], noelRow: true },
  3: { hand: [14, 40, 20, 40], noel: [74, 40, 26, 40] },
  4: { hand: [16, 58, 22, 40], noel: [68, 58, 32, 40] },
};
function tag(c, x, y, n) { if (n <= 1) return; const t = '×' + fmtShort(n); c.font = '900 15px Nunito'; const w = c.measureText(t).width + 10;
  c.fillStyle = 'rgba(255,246,226,0.92)'; c.strokeStyle = '#3a2415'; c.lineWidth = 1.5; roundRect(c, x - w / 2, y - 10, w, 19, 6); c.fill(); c.stroke(); c.fillStyle = '#3a2415'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(t, x, y); }
function roundRect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
function drawRails(c, act, S, legacyImg) {
  const A = ACTS[act]; const rail = RAILS[act];
  const hand = A.HELP.filter((h) => h[4] === 'hand' && S.n[h[0]] > 0); const noel = A.HELP.filter((h) => h[4] === 'noel' && (S.n[h[0]] > 0));
  const gripped = A.HELP.filter((h) => S.gripped[h[0]] > 0);
  // the legacy card at the back of the hand rail
  const [hx, hy, hw, hh] = rail.hand;
  if (legacyImg) { const lw = px(hw) * 0.62, lh = lw * 0.75; const lx = px(hx) + px(hw) * 0.04, ly = py(hy) - lh * 0.15;
    c.save(); c.fillStyle = '#b8892a'; c.fillRect(lx - 4, ly - 4, lw + 8, lh + 8); c.drawImage(legacyImg, lx, ly, lw, lh); c.strokeStyle = '#6a4a10'; c.lineWidth = 2; c.strokeRect(lx - 4, ly - 4, lw + 8, lh + 8); c.restore(); }
  placeFigures(c, act, hand, rail.hand, false, S);
  const [nx, ny, nw, nh] = rail.noel;
  placeFigures(c, act, noel, rail.noel, rail.noelRow, S, true);
  // gripped hand-run helpers stand on the NOEL rail with a chain badge
  if (gripped.length) { const h = gripped[0]; const im = img(helperFile(act, h[0])); const w = px(nw) * 0.24;
    const r = drawFit(c, im, px(nx) + px(nw) - w, py(ny) + py(nh) * 0.45, w, py(nh) * 0.55); if (r) { const b = img('locks/chain-badge'); if (b) c.drawImage(b, r.x, r.y, 22, 22); tag(c, r.x + r.w / 2, r.y + r.h - 6, R.helperDef(act, h[0]) ? gripped.reduce((s, x) => s + S.gripped[x[0]], 0) : 0); } }
  // the newest override
  const built = S.locks.filter((l) => l.built); if (built.length) { const l = built[built.length - 1]; const f = l.kind === 'lever' ? 'locks/lever' : 'locks/override-' + l.kind.slice(4);
    drawFit(c, img(f), px(hx) + px(hw) * 0.5, py(hy) + py(hh) * 0.05, px(hw) * 0.5, py(hh) * 0.42); }
}
function placeFigures(c, act, list, box, row, S, noel) {
  const [x, y, w, h] = box; const n = list.length; if (!n) return;
  for (let i = 0; i < n; i++) {
    const hdef = list[i]; let bx, by, bw, bh;
    if (row) { bw = px(w) / 4; bh = py(h); bx = px(x) + i * bw; by = py(y); }
    else { const col = i % 2, rw = Math.floor(i / 2); bw = px(w) / 2; bh = py(h) / 2; bx = px(x) + col * bw; by = py(y) + rw * bh; }
    const arr = fx.arrivals[hdef[0]]; const k = arr ? ease((tNow - arr) / 0.8) : 1; const off = (1 - k) * -120;
    const bob = noel ? 0 : Math.sin(tNow * 3 + i) * 2;
    c.save(); if (noel) c.globalAlpha = 0.9 + 0.1 * Math.sin(tNow * 2 + i);
    const r = drawFit(c, img(helperFile(act, hdef[0])), bx + off, by + bob, bw, bh * 0.96); c.restore();
    if (noel && r) { c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = `rgba(63,212,122,${0.08 + 0.06 * Math.sin(tNow * 2 + i)})`; c.fillRect(r.x, r.y, r.w, r.h); c.restore(); }
    if (r) tag(c, r.x + r.w / 2, r.y + r.h - 8, S.n[hdef[0]]);
  }
}

// ---------- Pip and his tool ----------
// Pip on his step stool, swinging the current tool onto the job (Chief Toy Officer's swing): the frames' pivots give the
// fist; on the strike the tool is aimed so its head (hammer) or face (stamp) lands on the job's top, and the job sits where it can.
const POSE = {
  1: { foot: 86.2, stool: [23.6, 17, 98.5], toyFoot: 68.5, toyW: 14, toyRange: [46, 62], kind: 'hammer', len: 0.35 },
  2: { foot: 81.6, stool: [23.6, 17, 93.8], toyFoot: 69, toyW: 11.5, toyRange: [42, 60], kind: 'stamp', len: 0.25 },
};
const SWING = [[0, 1], [45, 2], [125, 3], [190, -1]]; // ms -> frame
function pivotsOf(set) { const d = data(`sprites/${set}/pivots`); if (!d || !d.frames) return null;
  return d.frames.map((f) => ({ fist: f.pivot || (f.fist && f.fist.length === 2 ? f.fist : null), crop: f.fistCrop || (f.fist && f.fist.length === 4 ? f.fist : null), angle: f.angle || 0 })); }
function toolSpec(act, tool) {
  if (act === 1) { const h = data('act1/hammers')?.['hammer-' + (tool + 1)]; return h ? { grip: h.grip, tip: h.head, tipEdge: h.headBottom ?? h.head[1] + 60 } : { grip: [256, 435], tip: [256, 100], tipEdge: 160 }; }
  const st = data('act2/stamps')?.['stamp-' + (tool + 1)]; return st ? { grip: st.grip, tip: st.face, tipEdge: st.face[1] } : { grip: [254, 219], tip: [254, 480], tipEdge: 480 };
}
// where the job sits and the strike angle, for this act, tool and job
let poseCache = null;
function poseLayout(act, S) {
  const P = POSE[act]; const tool = R.toolIdx(S); const key = act + '|' + tool + '|' + S.job;
  if (poseCache && poseCache.key === key) return poseCache;
  const set = act === 1 ? 'pip-swing' : 'pip-clerk-swing'; const pv = pivotsOf(set); const w = px(40), x = px(12), y = py(P.foot) - w * (507 / 512); const k = w / 512; // foot = the lowest opaque pixel (row 507)
  const pipH = w * 0.986, len = P.len * pipH; const spec = toolSpec(act, tool);
  const jim = img(jobFile(act, S.job)); const jw = px(P.toyW), jh = jim ? jw * jim.height / jim.width : jw; const top = py(P.toyFoot) - jh * 0.92;
  let cx = px((P.toyRange[0] + P.toyRange[1]) / 2), strike = act === 1 ? 85 : 0;
  const f2 = pv && pv[2] && pv[2].fist;
  if (f2) {
    const fxp = x + f2[0] * k, fyp = y + f2[1] * k;
    if (P.kind === 'hammer') { // head comes down on the top: the head's centre a little above the top
      const headHalf = (spec.tipEdge - spec.tip[1]) / (spec.grip[1] - spec.tip[1]) * len; const aimY = top - headHalf * 0.3; const dy = fyp - aimY;
      const dx = Math.sqrt(Math.max(0, len * len - dy * dy)); cx = Math.min(px(P.toyRange[1]), Math.max(px(P.toyRange[0]), fxp + dx)); strike = Math.atan2(cx - fxp, dy) * 180 / Math.PI;
    } else { // the stamp's face comes down onto the top of the file
      const aimY = top + jh * 0.18; const dy = aimY - fyp; const dx = Math.sqrt(Math.max(0, len * len - dy * dy));
      cx = Math.min(px(P.toyRange[1]), Math.max(px(P.toyRange[0]), fxp + dx)); strike = -Math.atan2(cx - fxp, Math.max(1, dy)) * 180 / Math.PI;
    }
  }
  poseCache = { key, x, y, w, k, len, spec, set, pv, cx, strike, foot: py(P.toyFoot), jw, jh };
  return poseCache;
}
function swingFrame() { if (fx.swing < 0) return 0; const t = fx.swingT * 1000; let f = 0; for (const [ms, fr] of SWING) if (t >= ms) f = fr; return f < 0 ? 0 : f; }
function drawStool(c, act) { const P = POSE[act]; const st = img('act1/stool'); if (!st) return; const w = px(P.stool[1]), h = w * st.height / st.width; c.drawImage(st, px(P.stool[0]), py(P.stool[2]) - h, w, h); }
function drawPipSwing(c, act, S) {
  const L = poseLayout(act, S); const frame = swingFrame();
  const im = img(`sprites/${L.set}/${frame}`) || img(`sprites/${L.set}/0`);
  if (!im) { const fb = act === 2 ? img('shared/pip-clerk') : null; if (fb) drawFit(c, fb, px(20), py(40), px(24), py(53)); return; }
  c.drawImage(im, L.x, L.y, L.w, L.w);
  const fr = L.pv && L.pv[frame]; const hand = img(toolHandFile(act, R.toolIdx(S))); if (!fr || !fr.fist || !hand) return;
  let ang = frame === 2 ? L.strike : frame === 3 ? L.strike + (act === 1 ? 8 : -6) : (act === 1 ? fr.angle : fr.angle * 0.15);
  const sp = (tNow - fx.spinAt) / 0.38; if (act === 1 && sp >= 0 && sp < 1 && frame === 0) ang += 360 * (1 - (1 - sp) ** 2); // the spin after a finished toy
  const sp1 = L.spec; const hs = L.len / Math.abs(sp1.tip[1] - sp1.grip[1]);
  c.save(); c.translate(L.x + fr.fist[0] * L.k, L.y + fr.fist[1] * L.k); c.rotate(ang * Math.PI / 180);
  c.drawImage(hand, -sp1.grip[0] * hs, -sp1.grip[1] * hs, 512 * hs, 512 * hs); c.restore();
  if (fr.crop) { const [cx0, cy0, cw, ch] = fr.crop, sx = im.width / 512; c.drawImage(im, cx0 * sx, cy0 * sx, cw * sx, ch * sx, L.x + cx0 * L.k, L.y + cy0 * L.k, cw * L.k, ch * L.k); }
}
function drawJobAtPose(c, act, S, key) { const L = poseLayout(act, S); const im = img(key || jobFile(act, S.job)); if (!im) return; const sq = fx.squash;
  const pop = (tNow - fx.popAt) / 0.42; const lift = pop >= 0 && pop < 1 ? Math.sin(pop * Math.PI) * py(4) : 0; const ps = pop >= 0 && pop < 1 ? 1 + 0.15 * Math.sin(pop * Math.PI) : 1;
  c.save(); c.translate(L.cx, L.foot - lift); c.scale((1 + sq * 0.12) * ps, (1 - sq * 0.16) * ps); c.drawImage(im, -L.jw / 2, -L.jh, L.jw, L.jh); c.restore(); }
export const jobTop = (act, S) => { const L = poseLayout(act, S); return [L.cx, L.foot - L.jh * 0.6]; };
function drawPipStill(c, key, S) { const im = img(key); const b = fx.bob; c.save(); const x = px(0), y = py(48), w = px(16), h = py(50);
  c.translate(x + w / 2, y + h); c.scale(1 + b * 0.04, 1 - b * 0.05); drawFit(c, im, -w / 2, -h, w, h); c.restore(); }

// ---------- Act 1: the workshop ----------
function treeLights(c, S, allOn) {
  const strands = Math.min(9, allOn ? 9 : S.rank - 1);
  for (let k = 0; k < 9; k++) {
    const yy = 38 + k * 5.6; const half = 2 + k * 1.35; const cxp = 85.5; const r = rand(k * 97 + 3);
    for (let i = 0; i <= 6; i++) { const t = i / 6; const x = px(cxp - half + 2 * half * t), y = py(yy + Math.sin(t * Math.PI) * 2.2);
      const on = k < strands; const cols = ['#ff4a3a', '#ffd24a', '#4ad2ff', '#7cff6a', '#ff7ae0']; const col = cols[(i + k) % 5];
      c.fillStyle = on ? col : 'rgba(40,30,20,0.6)'; c.beginPath(); c.arc(x, y, 3.2, 0, Math.PI * 2); c.fill();
      if (on) { c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.35 + 0.25 * Math.sin(tNow * 3 + i * 1.7 + k); c.fillStyle = col; c.beginPath(); c.arc(x, y, 8, 0, Math.PI * 2); c.fill(); c.restore(); }
      r(); }
  }
}
// one present per toy for the first dozen, so the first toys you make are all there; then the pile grows more slowly,
// filling its 40 places at about 1,200 toys
function pileCount(n) { n = Math.floor(n); if (n <= 12) return Math.max(0, n); return Math.min(40, 12 + Math.floor(28 * Math.log(n / 12) / Math.log(100))); }
const PILE = (() => { const x0 = 66, x1 = 100, y1 = 99; const rows = [[12, 0], [10, 1], [8, 2], [6, 3], [4, 4]]; const slots = []; let k = 0;
  for (const [n, r] of rows) { const rowW = (x1 - x0) * (1 - r * 0.13), left = x0 + ((x1 - x0) - rowW) / 2 + 1;
    for (let i = 0; i < n; i++) { const j = ((k * 37) % 7) / 7 - 0.5; slots.push({ cx: left + (rowW - 2) * ((i + 0.5) / n) + j * 0.8, foot: y1 - 0.5 - r * 3.6 + Math.abs(j) * 0.6, size: 5.2 - r * 0.35 + (((k * 53) % 5) / 5) * 1.6, r, i, n }); k++; } }
  return slots.map((s, i) => [s.r * 100 + Math.abs(s.i - (s.n - 1) / 2), i]).sort((a, b) => a[0] - b[0]).map((a) => slots[a[1]]).slice(0, 40); })();
function pileImg(entry, i) { return entry >= 100 ? img('act1/presents-' + (1 + (i % 6))) : img(jobFile(1, entry)); }
function drawPile(c, S, shown) { const list = S.pileToys && S.pileToys.length ? S.pileToys : null;
  for (let i = shown - 1; i >= 0; i--) { const sl = PILE[i]; const e = list ? list[i % list.length] : 100; const im = pileImg(e, i); if (!im) continue;
    const w = px(sl.size), h = w * im.height / im.width; c.drawImage(im, px(sl.cx) - w / 2, py(sl.foot) - h, w, h); } }
function drawWorkshop(c, S, o) {
  cover(c, img('act1/workshop-bg'));
  if (fx.dim) { c.fillStyle = `rgba(5,5,20,${0.55 * fx.dim})`; c.fillRect(0, 0, W, H); }
  drawLucky(c, S, 1);
  // crew
  const elves = S.n.elf; const slots = [[1, 52, 10.5, 14], [7.5, 51, 10.5, 14], [0, 71, 12, 16]];
  for (let i = 0; i < Math.min(2, elves); i++) drawBob(c, 'act1/elf-helper', slots[i], i);
  if (S.n.toyMachine) drawBob(c, 'act1/toy-machine', [12, 50, 10.5, 14], 5, true);
  if (elves >= 3) drawBob(c, 'act1/elf-helper', slots[2], 2);
  if (S.n.reindeer) drawBob(c, 'act1/reindeer-team', [9, 66, 16, 21.5], 3);
  if (S.n.assemblyLine) drawBob(c, 'act1/assembly-line', [0, 86, 20, 13], 6, true);
  if (elves) { const sl = elves >= 3 ? slots[2] : slots[Math.min(1, elves - 1)]; tag(c, px(sl[0] + sl[2] / 2), py(sl[1] + sl[3]) - 6, elves); }
  if (S.n.toyMachine) tag(c, px(17), py(63), S.n.toyMachine); if (S.n.reindeer) tag(c, px(17), py(86), S.n.reindeer); if (S.n.assemblyLine) tag(c, px(10), py(98), S.n.assemblyLine);
  // tree
  const tree = img('act1/tree'); if (tree) { const w = px(29), h = w * tree.height / tree.width; c.drawImage(tree, px(71), py(89) - h, w, h); }
  treeLights(c, S, o.allLights);
  const star = img('act1/tree-star'); if (star) { const s = px(5.5); c.save(); if (!o.starLit) c.globalAlpha = 0.55; c.drawImage(star, px(85.5) - s / 2, py(31.5) - s / 2, s, s);
    if (o.starLit) { c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.6 + 0.2 * Math.sin(tNow * 4); const g = c.createRadialGradient(px(85.5), py(31.5), 2, px(85.5), py(31.5), 60); g.addColorStop(0, 'rgba(255,220,120,0.9)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(px(85.5) - 60, py(31.5) - 60, 120, 120); } c.restore(); }
  // NOEL's box on the upper jar shelf, from rank 3
  if (S.rank >= 3 || S.woke) { if (fx.wakeT >= 0 && tNow - fx.wakeT < 1.2) puff(c, px(92), py(16), tNow - fx.wakeT); drawNoel(c, 1, S); }
  // bench
  const bench = img('act1/bench'); if (bench) { const w = px(40), h = w * bench.height / bench.width; c.drawImage(bench, px(36), py(91) - h, w, h); }
  // the wrapping station joins the line once it's bought: toys come out of it as presents
  if (S.own && S.own.includes('wrappingStation')) { const ws = img('act1/upg-wrapping-station'); if (ws) { const w = px(9); c.drawImage(ws, px(62.5), py(93) - w, w, w); } }
  // the pile: the toys you made (and presents, once wrapped)
  const shown = o.pileOverride ?? pileCount(S.pile || 0);
  drawPile(c, S, shown);
  if ((S.pile || 0) > 990 && shown >= 40) tag(c, px(92), py(78), S.pile);
  // the toy on the bench
  drawStool(c, 1);
  if (!o.noToy) drawJobAtPose(c, 1, S);
  drawPipSwing(c, 1, S);
}
function drawBob(c, key, [x, y, w, h], i, noel) { const b = noel ? Math.sin(tNow * 6 + i) * 0.6 : Math.abs(Math.sin(tNow * 2.4 + i)) * -2.2; drawFit(c, img(key), px(x), py(y) + b, px(w), py(h)); }
function drawJobOnSpot(c, key, x, foot, wPct) { const im = img(key); if (!im) return; const w = px(wPct), h = w * im.height / im.width; const sq = fx.squash;
  c.save(); c.translate(px(x) + w / 2, py(foot)); c.scale(1 + sq * 0.12, 1 - sq * 0.16); c.drawImage(im, -w / 2, -h, w, h); c.restore(); }
function puff(c, x, y, t) { c.save(); for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; const d = 10 + t * 50; c.globalAlpha = Math.max(0, 0.6 - t * 0.5); c.fillStyle = '#d8d0c0'; c.beginPath(); c.arc(x + Math.cos(a) * d, y + Math.sin(a) * d * 0.6, 7 + t * 8, 0, Math.PI * 2); c.fill(); } c.restore(); }

// ---------- Act 2: the List Room ----------
function drawListRoom(c, S, o) {
  cover(c, img('act2/list-room-bg'));
  if (fx.dim) { c.fillStyle = `rgba(5,10,8,${0.5 * fx.dim})`; c.fillRect(0, 0, W, H); }
  drawLucky(c, S, 2);
  drawNoel(c, 2, S);
  drawRails(c, 2, S, o.legacy);
  const desk = img('act2/clerk-desk'); if (desk) { const w = px(40), h = w * desk.height / desk.width; c.drawImage(desk, px(36), py(91) - h, w, h); }
  // the file on the blotter
  if (!o.noToy) drawJobAtPose(c, 2, S, o.fileKey);
  for (const s of fx.splats) { const k = (tNow - s.t) / 0.6; if (k > 1) continue; c.save(); c.translate(s.x, s.y); c.rotate(s.rot); c.globalAlpha = 1 - k * k; const sc = 1 + (1 - ease(k * 3)) * 0.5; c.scale(sc, sc);
    c.font = '900 30px Nunito'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 4; c.strokeStyle = s.nice ? '#1d6a32' : '#8a1414'; c.strokeRect(-62, -20, 124, 40); c.fillStyle = s.nice ? '#22803a' : '#a51c1c'; c.fillText(s.nice ? 'NICE' : 'NAUGHTY', 0, 2); c.restore(); }
  drawStool(c, 2);
  drawPipSwing(c, 2, S);
  // the Nice dial
  const m = R.mul(S); const pct = Math.round(m.nice * 100);
  c.save(); c.translate(px(57), py(8)); c.fillStyle = 'rgba(247,236,214,0.92)'; roundRect(c, -78, -16, 156, 32, 10); c.fill(); c.strokeStyle = '#3a2415'; c.lineWidth = 2; c.stroke();
  c.fillStyle = '#2b4a2b'; c.font = '900 16px Nunito'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(`The List: ${pct}% Nice`, 0, 1); c.restore();
}

// ---------- Act 3: the Earthmas Deck and its globe ----------
let globe = null; // { D, map: ImageData data, mw, mh, lut: Int32Array, can, ctx2, img }
const PHI0 = 23 * Math.PI / 180;
function buildGlobe(D) {
  const mapIm = img('act3/globe-map'); if (!mapIm) return null;
  const m = document.createElement('canvas'); m.width = mapIm.width; m.height = mapIm.height; const mg = m.getContext('2d'); mg.drawImage(mapIm, 0, 0);
  const md = mg.getImageData(0, 0, m.width, m.height).data; const mw = m.width, mh = m.height;
  const lut = new Float32Array(D * D * 3); // lon, lat, shade (lon in 0..1, lat -90..90 => y)
  for (let j = 0; j < D; j++) for (let i = 0; i < D; i++) {
    const x = (i + 0.5) / D * 2 - 1, y = 1 - (j + 0.5) / D * 2; const k = (j * D + i) * 3; const rr = x * x + y * y;
    if (rr > 1) { lut[k + 2] = -1; continue; }
    const z = Math.sqrt(1 - rr); const lat = Math.asin(y * Math.cos(PHI0) + z * Math.sin(PHI0)); const lon = Math.atan2(x, z * Math.cos(PHI0) - y * Math.sin(PHI0));
    lut[k] = lon / (2 * Math.PI); lut[k + 1] = lat; lut[k + 2] = 0.55 + 0.45 * (z * 0.8 + (x * -0.3 + y * 0.35) * 0.4 + 0.2);
  }
  const can = document.createElement('canvas'); can.width = can.height = D; const g = can.getContext('2d'); const out = g.createImageData(D, D);
  return { D, md, mw, mh, lut, can, g, out, last: -1 };
}
function renderGlobe(turn) {
  const G = globe; const { D, md, mw, mh, lut, out } = G; const o = out.data; const cap = 75 * Math.PI / 180;
  for (let p = 0, k = 0; p < D * D; p++, k += 3) {
    const sh = lut[k + 2]; const q = p * 4; if (sh < 0) { o[q + 3] = 0; continue; }
    const lat = lut[k + 1]; let u = lut[k] + turn; u -= Math.floor(u); const mx = Math.min(mw - 1, (u * mw) | 0); const my = Math.min(mh - 1, Math.max(0, ((0.5 - lat / Math.PI) * mh) | 0));
    const s = (my * mw + mx) * 4; let r = md[s], gg = md[s + 1], b = md[s + 2];
    if (lat > cap - 0.08) { const t = Math.min(1, (lat - (cap - 0.08)) / 0.1); r = r + (240 - r) * t; gg = gg + (248 - gg) * t; b = b + (255 - b) * t; }
    o[q] = r * sh; o[q + 1] = gg * sh; o[q + 2] = b * sh; o[q + 3] = 255;
  }
  G.g.putImageData(out, 0, 0);
}
function project(lonDeg, latDeg, turn) { // returns disc coords (x right, y up) and visibility
  const lat = latDeg * Math.PI / 180; const lon = lonDeg / 360 - turn; const L = lon * 2 * Math.PI;
  const X = Math.cos(lat) * Math.sin(L), Y = Math.sin(lat), Z = Math.cos(lat) * Math.cos(L);
  const y = Y * Math.cos(PHI0) - Z * Math.sin(PHI0), z = Y * Math.sin(PHI0) + Z * Math.cos(PHI0);
  return [X, y, z];
}
const LIGHTS = (() => { const r = rand(7); const pts = [[0, 88]]; const sets = [[[10, 46], [-110, 40]]]; const a = [[0, 88]];
  for (let i = 0; i < 70; i++) a.push([r() * 360 - 180, r() * 120 - 50]); return a; })();
export const globeGeom = () => ({ cx: px(50), cy: py(46), R: py(62) / 2 });
export function spotState() { const { cx, cy, R: Rg } = globeGeom(); return { x: cx + spot.u * Rg, y: cy - spot.v * Rg, r: Math.max(0.3 * Rg, 36 / cssScale()), resting: spot.resting }; }
function updateSpot(dt, r) {
  spot.t += dt;
  if (spot.resting && spot.t >= 4) { spot.resting = false; spot.t = 0; spot.from = [spot.u, spot.v]; let u, v; do { u = (r() * 2 - 1) * 0.62; v = (r() * 2 - 1) * 0.62; } while (u * u + v * v > 0.42 || Math.hypot(u - spot.u, v - spot.v) < 0.25); spot.to = [u, v]; }
  if (!spot.resting) { const k = ease(spot.t / 1.5); spot.u = spot.from[0] + (spot.to[0] - spot.from[0]) * k; spot.v = spot.from[1] + (spot.to[1] - spot.from[1]) * k; if (spot.t >= 1.5) { spot.resting = true; spot.t = 0; } }
}
const spotRand = rand(99);
function drawDeck(c, S, o) {
  cover(c, img('act3/deck-bg'));
  drawLucky(c, S, 3);
  const { cx: gx, cy: gy, R: Rg } = globeGeom();
  const D = Math.min(384, Math.round(Rg * 2 * cssScale() * dpr));
  if (!globe || globe.D !== D) globe = buildGlobe(D);
  const turn = (o.turn ?? tNow / 60) % 1;
  // glow behind
  c.save(); const halo = c.createRadialGradient(gx, gy, Rg * 0.9, gx, gy, Rg * 1.25); halo.addColorStop(0, 'rgba(150,200,255,0.35)'); halo.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = halo; c.fillRect(gx - Rg * 1.3, gy - Rg * 1.3, Rg * 2.6, Rg * 2.6); c.restore();
  if (globe) { const fr = Math.floor(tNow * 30); if (fr !== globe.last) { globe.last = fr; renderGlobe(turn); } c.drawImage(globe.can, gx - Rg, gy - Rg, Rg * 2, Rg * 2); }
  else { c.fillStyle = '#2a5a8a'; c.beginPath(); c.arc(gx, gy, Rg, 0, Math.PI * 2); c.fill(); }
  // ice cap glow at the projected pole
  const pole = [gx, gy - Rg * Math.cos(PHI0)]; c.save(); const ig = c.createRadialGradient(pole[0], pole[1], 0, pole[0], pole[1], Rg * 0.32); ig.addColorStop(0, 'rgba(255,255,255,0.9)'); ig.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = ig; c.beginPath(); c.arc(gx, gy, Rg, 0, Math.PI * 2); c.clip(); c.fillRect(pole[0] - Rg, pole[1] - Rg, Rg * 2, Rg * 2); c.restore();
  // lights by Earth celebrating
  const frac = o.allLights ? 1 : earthFrac(S); const n = Math.round(frac * LIGHTS.length);
  c.save(); c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) { const [lon, lat] = LIGHTS[i]; const [x, y, z] = project(lon, lat, turn); if (z < 0.05) continue; const sx = gx + x * Rg, sy = gy - y * Rg; const tw = 0.6 + 0.4 * Math.sin(tNow * 3 + i);
    const g = c.createRadialGradient(sx, sy, 0, sx, sy, 9 * z + 3); g.addColorStop(0, i % 2 ? `rgba(255,90,70,${tw})` : `rgba(120,255,140,${tw})`); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(sx - 14, sy - 14, 28, 28); }
  c.restore();
  // orbiting tinsel from tier 4
  if (S.n.orbitalTinsel > 0 || o.allLights) { c.save(); c.strokeStyle = 'rgba(255,215,110,0.75)'; c.lineWidth = 3; c.setLineDash([6, 8]); c.lineDashOffset = -tNow * 30; c.beginPath(); c.ellipse(gx, gy, Rg * 1.15, Rg * 0.3, -0.25, 0, Math.PI * 2); c.stroke(); c.restore(); }
  if (o.ribbon != null) drawRibbon(c, gx, gy, Rg, o.ribbon);
  if (o.bow != null) { const b = img('act3/bow'); if (b) { const k = o.bow; const y0 = -100, y1 = pole[1] - Rg * 0.12; const by = y0 + (y1 - y0) * Math.min(1, k * 1.25) - (k > 0.8 ? Math.sin((k - 0.8) / 0.2 * Math.PI) * 12 : 0); const s = Rg * 0.55; c.drawImage(b, pole[0] - s / 2, by - s / 2, s, s); } }
  // the Cheer Spot
  if (!o.noSpot && !S.finalDone) { updateSpot(Math.min(0.05, tNow - (spot.lastT || tNow)), spotRand); spot.lastT = tNow; const sp = spotState(); c.save(); c.lineWidth = 4; c.strokeStyle = sp.resting ? `rgba(255,214,90,${0.75 + 0.25 * Math.sin(tNow * 6)})` : 'rgba(255,214,90,0.45)';
    c.beginPath(); c.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2); c.stroke(); c.globalCompositeOperation = 'lighter'; c.fillStyle = sp.resting ? 'rgba(255,214,90,0.16)' : 'rgba(255,214,90,0.06)'; c.fill(); c.restore();
    if (sp.resting) { c.font = '900 13px Nunito'; c.fillStyle = 'rgba(255,240,190,0.95)'; c.textAlign = 'center'; c.fillText('ready', sp.x, sp.y + sp.r + 14); } }
  // the Moon in its hat
  if (S.rank >= 9 || o.moon != null) { const mh = img('act3/moon-hat'); const k = o.moon ?? 1; if (mh) { const s = px(13); c.drawImage(mh, px(84) - s / 2 + (1 - ease(k)) * 120, py(18) - s / 2, s, s); } }
  drawNoel(c, 3, S);
  drawRails(c, 3, S, o.legacy);
  drawPipStill(c, 'shared/pip-coat', S);
  // the bell swings at the tap point
  if (fx.bellAt && tNow - fx.bellAt.t < 0.45) { const b = img(toolFile(3, R.toolIdx(S))); if (b) { const k = (tNow - fx.bellAt.t) / 0.45; c.save(); c.translate(fx.bellAt.x, fx.bellAt.y - 30); c.rotate(Math.sin(k * Math.PI * 3) * 0.5 * (1 - k)); const s = 64; c.globalAlpha = 1 - k * 0.6; c.drawImage(b, -s / 2, -s * 0.15, s, s); c.restore(); } }
}
function earthFrac(S) { const e = [0, 2, 8, 15, 25, 40, 55, 70, 85, 95, 100]; if (S.finalDone) return 1; const f = R.rankFrac(S); const r = S.rank; return (e[r] + (e[Math.min(10, r + 1)] - e[r]) * (r >= 10 ? 0 : f)) / 100; }
export { earthFrac };
function drawRibbon(c, gx, gy, Rg, k) { c.save(); c.beginPath(); c.arc(gx, gy, Rg + 2, 0, Math.PI * 2); c.clip(); c.lineWidth = Rg * 0.12; c.strokeStyle = '#c4202a';
  const len = Math.min(1, k * 2); c.beginPath(); c.ellipse(gx, gy, Rg * 0.18, Rg, 0, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * len); c.stroke();
  if (k > 0.5) { const l2 = Math.min(1, (k - 0.5) * 2); c.beginPath(); c.ellipse(gx, gy - Rg * 0.08, Rg, Rg * 0.3, 0, Math.PI, Math.PI + Math.PI * 2 * l2); c.stroke(); }
  c.strokeStyle = 'rgba(255,255,255,0.35)'; c.lineWidth = Rg * 0.03; c.beginPath(); c.ellipse(gx - Rg * 0.03, gy, Rg * 0.18, Rg, 0, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * len); c.stroke(); c.restore(); }

// ---------- Act 4: the Star-Sleigh bridge ----------
const ORN = (() => { const r = rand(5); const a = []; for (let i = 0; i < 60; i++) { const ang = r() * Math.PI * 2, d = Math.sqrt(r()) * 0.85; a.push([Math.cos(ang) * d, Math.sin(ang) * d * 0.9, r()]); } return a; })();
export const viewport = () => ({ cx: px(50), cy: py(42), R: py(76) / 2 });
function drawBridge(c, S, o) {
  cover(c, img('act4/bridge-bg'));
  const { cx: vx, cy: vy, R: Rv } = viewport();
  // ornaments: found worlds
  const found = o.allOrn ? ORN.length : Math.min(ORN.length, Math.round(S.made.reduce((a, b) => a + (b > 0 ? 1 : 0), 0) * 3 + Math.log10(1 + S.made.reduce((a, b) => a + b, 0)) * 4));
  c.save(); c.beginPath(); c.arc(vx, vy, Rv, 0, Math.PI * 2); c.clip();
  if (o.stars != null) drawStarTree(c, vx, vy, Rv, o.stars);
  for (let i = 0; i < found; i++) { const [x, y, h] = ORN[i]; let sx = vx + x * Rv, sy = vy + y * Rv; if (o.stars != null) { const t = treePos(i, vx, vy, Rv); const k = ease(o.stars); sx += (t[0] - sx) * k; sy += (t[1] - sy) * k; }
    const tw = 0.7 + 0.3 * Math.sin(tNow * 2 + i * 1.3); c.fillStyle = `hsla(${(h * 360) | 0},90%,65%,${tw})`; c.beginPath(); c.arc(sx, sy, 4.2, 0, Math.PI * 2); c.fill(); c.fillStyle = `rgba(255,255,255,${tw * 0.8})`; c.beginPath(); c.arc(sx - 1.2, sy - 1.2, 1.3, 0, Math.PI * 2); c.fill(); }
  // NOEL-run: probes streaking out, wreaths around stars
  if (S.n.sleighProbes) for (let i = 0; i < Math.min(6, S.n.sleighProbes); i++) { const k = ((tNow * 0.25 + i / 6) % 1); const a = i * 2.1; c.strokeStyle = `rgba(63,212,122,${1 - k})`; c.lineWidth = 2; c.beginPath(); c.moveTo(vx + Math.cos(a) * Rv * k * 0.9, vy + Math.sin(a) * Rv * k * 0.9); c.lineTo(vx + Math.cos(a) * Rv * (k * 0.9 - 0.06), vy + Math.sin(a) * Rv * (k * 0.9 - 0.06)); c.stroke(); }
  if (S.n.wreathsOfLight) for (let i = 0; i < Math.min(5, S.n.wreathsOfLight); i++) { const [x, y] = ORN[50 + i]; c.strokeStyle = 'rgba(120,255,170,0.7)'; c.lineWidth = 2; c.beginPath(); c.ellipse(vx + x * Rv, vy + y * Rv, 12, 5, tNow * 0.5 + i, 0, Math.PI * 2); c.stroke(); }
  drawLucky(c, S, 4);
  c.restore();
  if (o.lastStar != null) { const st = img('act1/tree-star'); if (st) { const k = ease(o.lastStar); const s = 46; const x = vx, y = py(80) + (vy - Rv * 0.86 - py(80)) * k; c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createRadialGradient(x, y, 2, x, y, 70); g.addColorStop(0, 'rgba(255,230,140,0.9)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(x - 70, y - 70, 140, 140); c.restore(); c.drawImage(st, x - s / 2, y - s / 2, s, s); } }
  drawNoel(c, 4, S);
  drawRails(c, 4, S, o.legacy);
  drawPipStill(c, 'shared/pip-suit', S);
  // the scanner on the console
  const sc = img(toolFile(4, R.toolIdx(S))); if (sc) { const rc = fx.recoil; drawFit(c, sc, px(14) - rc * 6, py(54) + rc * 3, px(8), py(12)); }
}
function treePos(i, vx, vy, Rv) { const rows = 8; const k = i / ORN.length; const row = Math.floor(k * rows); const inRow = (k * rows) % 1; const yy = vy - Rv * 0.7 + row * Rv * 0.19; const half = (row + 1) / rows * Rv * 0.6; return [vx - half + inRow * half * 2, yy]; }
const STARS = (() => { const r = rand(11); const a = []; for (let i = 0; i < 260; i++) { const ang = r() * Math.PI * 2, d = Math.sqrt(r()); a.push([Math.cos(ang) * d, Math.sin(ang) * d, r()]); } return a; })();
function drawStarTree(c, vx, vy, Rv, k) { c.save(); c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < STARS.length; i++) { const [x, y, h] = STARS[i]; const t = i / STARS.length; const row = t; const yy = -0.72 + row * 1.5; const half = 0.08 + row * 0.62; const tx = (h * 2 - 1) * half, ty = yy + (i % 3) * 0.01;
    const e = ease(k); const sx = vx + (x + (tx - x) * e) * Rv, sy = vy + (y + (ty - y) * e) * Rv; c.fillStyle = `rgba(${200 + 55 * h},${230},${255},${0.5 + 0.5 * Math.sin(tNow * 3 + i)})`; c.fillRect(sx, sy, 2, 2); }
  c.restore(); }

// ---------- the lucky thing ----------
export function luckyPos(S, act) {
  if (!S.lucky) return null; const k = Math.min(1, (S.t - S.lucky.t0) / 8); const y = S.lucky.y;
  if (act === 1) return [px(18 + 32 * k), py(15 + 20 * y + 8 * k)];
  if (act === 2) return [px(8 + Math.sin(k * 9) * 2), py(4 + 62 * k)];
  if (act === 3) return [px(10 + 80 * k), py(8 + 10 * y)];
  const { cx, cy, R: Rv } = viewport(); return [cx - Rv * 0.9 + Rv * 1.8 * k, cy - Rv * (0.5 - y * 0.6) + Rv * 0.3 * k];
}
function drawLucky(c, S, act) {
  const p = luckyPos(S, act); if (!p) return; const im = img({ 1: 'shared/lucky-star', 2: 'shared/lucky-letter', 3: 'shared/lucky-cloud', 4: 'shared/lucky-comet' }[act]); const w = act === 2 ? 60 : 120;
  c.save(); c.globalCompositeOperation = act === 3 ? 'source-over' : 'lighter'; const g = c.createRadialGradient(p[0], p[1], 2, p[0], p[1], 50); g.addColorStop(0, 'rgba(255,240,180,0.6)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(p[0] - 50, p[1] - 50, 100, 100); c.restore();
  if (im) { const h = w * im.height / im.width; c.save(); if (act === 2) { c.translate(p[0], p[1]); c.rotate(Math.sin(tNow * 4) * 0.4); c.drawImage(im, -w / 2, -h / 2, w, h); } else c.drawImage(im, p[0] - w * 0.7, p[1] - h / 2, w, h); c.restore(); }
}

// ---------- juice ----------
export function onTap(S, act, x, y, value, o = {}) {
  fx.squash = 1; fx.swing = 0; fx.swingT = 0; fx.bob = 1; fx.eyeTo = [x / W, y / H]; fx.recoil = 1;
  const big = o.spot; const n = big ? 14 : 7;
  const jt = act <= 2 ? jobTop(act, S) : null; const tx = jt ? jt[0] : x, ty = jt ? jt[1] : y;
  for (let i = 0; i < n && fx.parts.length < 40; i++) { const a = Math.random() * Math.PI * 2, s = 80 + Math.random() * 160 * (big ? 1.6 : 1);
    fx.parts.push({ x: tx, y: ty, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 80, t: 0, life: 0.5 + Math.random() * 0.3, col: act === 4 ? '#7affc0' : act === 3 ? '#ffd76a' : act === 2 ? '#fff4c8' : '#ffcf6a' }); }
  fx.nums.push({ x: tx + (Math.random() * 30 - 15), y: ty - 20, t: 0, txt: '+' + fmtShort(value), big });
  if (fx.nums.length > 14) fx.nums.shift();
  if (act === 2) fx.splats.push({ x: jobTop(2, S)[0] + Math.random() * 20 - 10, y: jobTop(2, S)[1] + 6 + Math.random() * 8, t: tNow, rot: Math.random() * 0.5 - 0.25, nice: Math.random() < R.mul(S).nice });
  if (fx.splats.length > 4) fx.splats.shift();
  if (act === 3) { fx.bellAt = { x, y, t: tNow }; fx.rings.push({ x, y, t: 0, col: big ? '255,220,90' : '255,214,120', max: big ? 90 : 50 }); }
  if (act === 4) fx.rings.push({ x, y, t: 0, col: '90,255,160', max: 70 });
  if (o.heavy) fx.shake = 0.25;
}
export function onJobDone(act, n, item) { fx.flash = 1; fx.popAt = tNow; if (n === 1) fx.spinAt = tNow + 0.05; fx.presents.push({ t: 0, n, item }); if (fx.presents.length > 3) fx.presents.shift(); }
export function onHelperAdded(id) { if (!fx.arrivals[id]) fx.arrivals[id] = tNow; }
export function onNoelBright() { fx.noelBright = 1; }
export function onWake() { fx.wakeT = tNow; }
export function setDim(v) { fx.dim = v; }
export function shake(s) { fx.shake = s; }
export function resetFx() { fx.parts = []; fx.nums = []; fx.rings = []; fx.splats = []; fx.presents = []; fx.arrivals = {}; fx.dim = 0; }
function drawFx(c, act, dt) {
  for (const p of fx.parts) { p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 420 * dt; }
  fx.parts = fx.parts.filter((p) => p.t < p.life);
  c.save(); c.globalCompositeOperation = 'lighter'; for (const p of fx.parts) { c.globalAlpha = 1 - p.t / p.life; c.fillStyle = p.col; c.fillRect(p.x - 2.5, p.y - 2.5, 5, 5); } c.restore();
  for (const r of fx.rings) r.t += dt; fx.rings = fx.rings.filter((r) => r.t < 0.5);
  for (const r of fx.rings) { c.strokeStyle = `rgba(${r.col},${1 - r.t * 2})`; c.lineWidth = 3; c.beginPath(); c.arc(r.x, r.y, 8 + r.max * ease(r.t * 2), 0, Math.PI * 2); c.stroke(); }
  for (const n of fx.nums) n.t += dt; fx.nums = fx.nums.filter((n) => n.t < 0.9);
  c.save(); c.textAlign = 'center'; c.textBaseline = 'middle';
  for (const n of fx.nums) { c.globalAlpha = 1 - n.t / 0.9; c.font = `900 ${n.big ? 30 : 24}px Nunito`; c.lineWidth = 4; c.strokeStyle = 'rgba(40,20,10,0.85)'; const y = n.y - n.t * 60; c.strokeText(n.txt, n.x, y); c.fillStyle = n.big ? '#ffe27a' : '#fff6dc'; c.fillText(n.txt, n.x, y); }
  c.restore();
  // a finished job: a present arcs to the pile (Act 1), a pop elsewhere
  for (const p of fx.presents) p.t += dt; fx.presents = fx.presents.filter((p) => p.t < 0.7);
  for (const p of fx.presents) { const k = p.t / 0.7;
    if (act === 1) { const im = p.item != null ? pileImg(p.item, p.n) : img('act1/presents-1'); const x0 = poseCache ? poseCache.cx : px(52); const x = x0 + (px(84) - x0) * k, y = py(56) - Math.sin(k * Math.PI) * 120 + (py(88) - py(56)) * k; if (im) { const w = 40, h = w * im.height / im.width; c.drawImage(im, x - w / 2, y - h / 2, w, h); } }
    else { c.save(); c.globalAlpha = 1 - k; c.strokeStyle = act === 4 ? '#7affc0' : '#ffe08a'; c.lineWidth = 5; const [x, y] = act === 2 ? [px(52), py(60)] : act === 3 ? [globeGeom().cx, globeGeom().cy] : [viewport().cx, viewport().cy]; c.beginPath(); c.arc(x, y, 20 + k * 80, 0, Math.PI * 2); c.stroke(); c.restore(); }
    if (p.n > 1 && p.t < 0.6) { c.save(); c.font = '900 26px Nunito'; c.textAlign = 'center'; c.fillStyle = '#ffe27a'; c.strokeStyle = '#3a2415'; c.lineWidth = 4; const t = '×' + fmtShort(p.n); const y = (act <= 2 ? py(46) : py(20)) - p.t * 40; c.strokeText(t, px(52), y); c.fillText(t, px(52), y); c.restore(); }
  }
  if (fx.flash > 0) { c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = fx.flash * 0.25; c.fillStyle = '#fff2c0'; c.fillRect(0, 0, W, H); c.restore(); }
}
function decay(dt) {
  fx.squash = Math.max(0, fx.squash - dt * 7); fx.bob = Math.max(0, fx.bob - dt * 6); fx.recoil = Math.max(0, fx.recoil - dt * 6); fx.flash = Math.max(0, fx.flash - dt * 4); fx.noelBright = Math.max(0, fx.noelBright - dt * 1.5);
  if (fx.swing >= 0) { fx.swingT += dt; if (fx.swingT >= 0.19) fx.swing = -1; }
  fx.eyeAt[0] += (fx.eyeTo[0] - fx.eyeAt[0]) * Math.min(1, dt * 5); fx.eyeAt[1] += (fx.eyeTo[1] - fx.eyeAt[1]) * Math.min(1, dt * 5);
  if (fx.blink > 0) fx.blink = Math.max(0, fx.blink - dt * 5); else if (Math.random() < dt * 0.25) fx.blink = 1;
  fx.shake = Math.max(0, fx.shake - dt);
}

// ---------- draw ----------
export function drawAct(c, act, S, o = {}) {
  if (act === 1) drawWorkshop(c, S, o); else if (act === 2) drawListRoom(c, S, o); else if (act === 3) drawDeck(c, S, o); else drawBridge(c, S, o);
}
let lastT = performance.now();
export function frame(act, S, o = {}) {
  const now = performance.now(); const dt = Math.min(0.05, (now - lastT) / 1000); lastT = now; tNow = now / 1000; decay(dt);
  const c = cx; c.setTransform(dpr * cssW / W, 0, 0, dpr * cssH / H, 0, 0);
  if (fx.shake > 0) c.translate((Math.random() - 0.5) * 10 * fx.shake * 4, (Math.random() - 0.5) * 10 * fx.shake * 4);
  drawAct(c, act, S, o);
  if (S.rush > 0) { c.save(); const g = c.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75); g.addColorStop(0, 'rgba(255,200,80,0)'); g.addColorStop(1, `rgba(255,200,80,${0.28 + 0.08 * Math.sin(tNow * 6)})`); c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.lineWidth = 6; c.strokeStyle = 'rgba(255,220,120,0.9)'; c.beginPath(); c.arc(W - 34, 34, 20, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (S.rush / R.RUSH_S)); c.stroke(); c.restore(); }
  drawFx(c, act, dt);
  if (o.fade) { c.fillStyle = `rgba(0,0,0,${o.fade})`; c.fillRect(0, 0, W, H); }
  if (o.overlay) o.overlay(c);
}
// The legacy picture: the finished stage at 400×300.
export function renderLegacy(act, S, o = {}) {
  const c2 = document.createElement('canvas'); c2.width = 400; c2.height = 300; const g = c2.getContext('2d'); g.scale(400 / W, 300 / H);
  const saved = { ...fx }; fx.swing = -1; fx.squash = 0;
  drawAct(g, act, S, { allLights: true, starLit: act === 1, allOrn: act === 4, noSpot: true, ...o });
  Object.assign(fx, { swing: saved.swing, squash: saved.squash });
  return c2;
}
export const now = () => tNow;
export { cover, drawFit, fmtShort, ease, px, py, roundRect };
