// Sound: Web Audio effects (decoded per act), music streamed through <audio> elements into the music gain
// (two elements crossfading 2 s before the end), voices with NOEL's light ring-mod. Mute and volumes remembered.
const SFX_ALL = ['tap', 'heavy-tap', 'toy-done', 'present-rustle', 'cookie-clink', 'purchase', 'cant-afford', 'elf-hup', 'fanfare', 'star-appear', 'star-caught',
  'rush-bells', 'rush-end', 'ui-click', 'eve-sleigh', 'stamp', 'bell', 'ping', 'file-done', 'holdout-won', 'first-contact', 'letter-appear', 'cloud-appear',
  'comet-appear', 'noel-buy', 'noel-speak', 'override-built', 'lever-clunk', 'check-complete', 'lock', 'unlock', 'grip', 'seal-slam', 'ribbon-zip',
  'stars-gather', 'declare', 'transition', 'rush-paper', 'rush-choir', 'mitten-chime'];
const SHARED = ['ui-click', 'purchase', 'cant-afford', 'cookie-clink', 'fanfare', 'noel-buy', 'noel-speak', 'override-built', 'lever-clunk', 'check-complete', 'lock', 'unlock',
  'grip', 'declare', 'transition', 'mitten-chime', 'rush-end', 'present-rustle'];
const PER_ACT = {
  1: ['tap', 'heavy-tap', 'toy-done', 'elf-hup', 'star-appear', 'star-caught', 'rush-bells', 'eve-sleigh'],
  2: ['stamp', 'file-done', 'letter-appear', 'rush-paper', 'seal-slam', 'elf-hup'],
  3: ['bell', 'holdout-won', 'cloud-appear', 'rush-bells', 'ribbon-zip', 'seal-slam', 'comet-appear', 'elf-hup'],
  4: ['ping', 'first-contact', 'comet-appear', 'rush-choir', 'stars-gather', 'elf-hup'],
};
const VOICES = ['santa-hohoho', 'santa-there-you-are', 'noel-hello', 'noel-woke', 'noel-secured', 'noel-merry', 'noel-goodnight'];
const LIMIT = { 'toy-done': 250, 'file-done': 250, 'holdout-won': 300, 'cookie-clink': 300, 'present-rustle': 300 };

let ctx = null, master, musicGain, sfxGain, lowpass;
const buffers = new Map(); let loadedAct = 0;
const settings = { music: 0.7, sfx: 0.8, muted: false };
let music = null; // { name, els: [a, b], cur, nodes, timer }
let rushNode = null; const lastPlay = {}; let perSecond = 0, perSecondT = 0;
const state = { context: null, track: null };

export function loadSettings(s) { Object.assign(settings, s || {}); apply(); }
export const getSettings = () => ({ ...settings });
function apply() {
  if (!ctx) return;
  master.gain.value = settings.muted ? 0 : 1; musicGain.gain.value = settings.music; sfxGain.gain.value = settings.sfx;
}
export function setVolume(kind, v) { settings[kind] = v; apply(); }
export function setMuted(m) { settings.muted = m; apply(); }
export const isMuted = () => settings.muted;

export function unlock() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    ctx = new AC(); master = ctx.createGain(); master.connect(ctx.destination);
    lowpass = ctx.createBiquadFilter(); lowpass.type = 'lowpass'; lowpass.frequency.value = 20000; lowpass.connect(master);
    musicGain = ctx.createGain(); musicGain.connect(lowpass); sfxGain = ctx.createGain(); sfxGain.connect(master); apply();
    loadNames([...SHARED, ...VOICES]);
    if (loadedAct) loadAct(loadedAct);
  }
  if (ctx.state === 'suspended') ctx.resume();
}
async function loadNames(names) {
  await Promise.all(names.map(async (n) => {
    if (buffers.has(n)) return;
    buffers.set(n, null);
    const dir = VOICES.includes(n) ? 'voice' : 'sfx';
    try { const r = await fetch(`assets/audio/${dir}/${n}.mp3`); const b = await r.arrayBuffer(); buffers.set(n, await ctx.decodeAudioData(b)); } catch { buffers.delete(n); }
  }));
}
// Effects are decoded per act; the last act's go.
export function loadAct(a) {
  loadedAct = a; if (!ctx) return;
  const keep = new Set([...SHARED, ...VOICES, ...PER_ACT[a]]);
  for (const k of [...buffers.keys()]) if (!keep.has(k)) buffers.delete(k);
  loadNames(PER_ACT[a]);
}

export function sfx(name, o = {}) {
  if (!ctx || settings.muted) return;
  const b = buffers.get(name); if (!b) return;
  const now = performance.now();
  if (LIMIT[name] && now - (lastPlay[name] || 0) < LIMIT[name]) return;
  if (now - perSecondT > 1000) { perSecondT = now; perSecond = 0; } if (++perSecond > 30) return;
  lastPlay[name] = now;
  const src = ctx.createBufferSource(); src.buffer = b;
  src.playbackRate.value = (o.rate || 1) * (o.vary ? 1 + (Math.random() * 2 - 1) * 0.08 : 1);
  const g = ctx.createGain(); g.gain.value = o.vol ?? 1;
  if (o.vary) { const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 6000 + Math.random() * 8000; src.connect(f); f.connect(g); } else src.connect(g);
  g.connect(sfxGain); src.start();
}
// NOEL's voice gets a light ring-mod; Santa's plays plain.
export function voice(name) {
  if (!ctx || settings.muted) return; const b = buffers.get(name); if (!b) return;
  const src = ctx.createBufferSource(); src.buffer = b; const out = ctx.createGain(); out.gain.value = 1;
  if (name.startsWith('noel')) {
    const dry = ctx.createGain(); dry.gain.value = 0.75; const ring = ctx.createGain(); ring.gain.value = 0; const osc = ctx.createOscillator(); osc.frequency.value = 55;
    const depth = ctx.createGain(); depth.gain.value = 0.35; osc.connect(depth); depth.connect(ring.gain); src.connect(dry); src.connect(ring); dry.connect(out); ring.connect(out);
    osc.start(); osc.stop(ctx.currentTime + b.duration + 0.1);
  } else src.connect(out);
  out.connect(sfxGain); src.start();
}

export function rushLoop(on, name) {
  if (!ctx) return;
  if (on && !rushNode) {
    const b = buffers.get(name); if (!b) return;
    const src = ctx.createBufferSource(); src.buffer = b; src.loop = true; const g = ctx.createGain(); g.gain.value = 0;
    g.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 0.4); src.connect(g); g.connect(sfxGain); src.start(); rushNode = { src, g };
  } else if (!on && rushNode) {
    const { src, g } = rushNode; rushNode = null; g.gain.cancelScheduledValues(ctx.currentTime); g.gain.setValueAtTime(g.gain.value, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6); src.stop(ctx.currentTime + 0.7);
  }
}

// ---- music ----
function makeEl(name) { const a = new Audio(`assets/audio/music/${name}.mp3`); a.preload = 'auto'; a.crossOrigin = 'anonymous'; return a; }
function releaseEl(el) { try { el.pause(); el.removeAttribute('src'); el.load(); } catch {} }
export function playMusic(name, o = {}) {
  state.track = name;
  if (!ctx) { pendingMusic = [name, o]; return; }
  if (music && music.name === name && !o.restart) { setLowpass(o.lowpass); return; }
  stopMusic(o.fade ?? 1.2);
  const loop = o.loop !== false;
  const els = [makeEl(name), loop ? makeEl(name) : null].filter(Boolean);
  const gains = els.map((el) => { const s = ctx.createMediaElementSource(el); const g = ctx.createGain(); g.gain.value = 0; s.connect(g); g.connect(musicGain); return g; });
  const m = { name, els, gains, cur: 0, loop, rate: 1 };
  music = m;
  const start = (i) => {
    const el = m.els[i], g = m.gains[i]; el.currentTime = 0; el.playbackRate = m.rate;
    el.play().catch(() => {});
    const t = ctx.currentTime; g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(o.vol ?? 1, t + (i === 0 && !m.started ? 1.0 : 2));
    m.started = true; m.cur = i;
  };
  start(0);
  m.timer = setInterval(() => {
    if (music !== m) return;
    const el = m.els[m.cur]; if (!el.duration) return;
    if (m.loop && el.duration - el.currentTime < 2.05 && !m.crossing) {
      m.crossing = true; const old = m.cur; const g = m.gains[old]; const t = ctx.currentTime;
      g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t); g.gain.linearRampToValueAtTime(0, t + 2);
      setTimeout(() => { m.els[old].pause(); m.crossing = false; }, 2100);
      start(1 - old);
    }
    if (!m.loop && el.ended && o.then) { const n = o.then; o.then = null; playMusic(n); }
  }, 100);
  setLowpass(o.lowpass);
}
let pendingMusic = null;
export function resumePending() { if (pendingMusic && ctx) { const [n, o] = pendingMusic; pendingMusic = null; playMusic(n, o); } }
export function stopMusic(fade = 1) {
  const m = music; if (!m) return; music = null; clearInterval(m.timer);
  if (!ctx) { m.els.forEach(releaseEl); return; }
  const t = ctx.currentTime; m.gains.forEach((g) => { g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t); g.gain.linearRampToValueAtTime(0, t + fade); });
  setTimeout(() => m.els.forEach(releaseEl), fade * 1000 + 100);
}
export function duck(on) { if (!ctx) return; const t = ctx.currentTime; musicGain.gain.cancelScheduledValues(t); musicGain.gain.setValueAtTime(musicGain.gain.value, t); musicGain.gain.linearRampToValueAtTime(on ? settings.music * 0.3 : settings.music, t + 0.4); }
function setLowpass(on) { if (!ctx) return; lowpass.frequency.setTargetAtTime(on ? 900 : 20000, ctx.currentTime, 0.3); }
// Xmas Forever: slow the music box down and detune it to a stop.
export function windDown(seconds) {
  const m = music; if (!m) return; const el = m.els[m.cur]; el.preservesPitch = false; el.mozPreservesPitch = false; el.webkitPreservesPitch = false;
  const t0 = performance.now(); m.loop = false;
  const tick = () => { if (music !== m) return; const k = Math.min(1, (performance.now() - t0) / (seconds * 1000)); el.playbackRate = Math.max(0.0625, 1 - 0.94 * k); if (k < 1) requestAnimationFrame(tick); else stopMusic(1.5); };
  tick();
}
// The List's "slightly wrong" note: a detuned music-box ping every 20–40 s.
export function wrongNote() { if (!ctx || settings.muted || music?.name !== 'list') return;
  const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = 1318 * 1.03; const g = ctx.createGain(); g.gain.value = 0; o.connect(g); g.connect(musicGain);
  const t = ctx.currentTime; g.gain.linearRampToValueAtTime(0.12, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6); o.start(t); o.stop(t + 1.7); }
export const audioState = () => ({ context: ctx?.state || null, track: music?.name || null, muted: settings.muted, music: settings.music, sfx: settings.sfx,
  buffers: [...buffers.values()].filter(Boolean).length, musicEls: music ? music.els.length : 0, rush: !!rushNode });
