// Xmas Everywhere: screens, the loop, input, cards, saving, finales and endings.
import { ACTS, ACT_TEXT, LOCKS_TEXT, OPENING, PAST4, GRIP_LINES, UNLOCK_LINE, ENDINGS, EARLY, earlyBand, THRESHOLDS } from './data.js';
import * as R from './rules.js';
import * as A from './audio.js';
import * as AS from './assets.js';
import * as ST from './stage.js';
import * as UI from './ui.js';
const { $, fmt, toast } = UI;

const KEY = 'xmas-everywhere';
const params = new URLSearchParams(location.search); const DEBUG = params.has('debug');
const saves = window.gameSaves.setup({ key: KEY, slots: 3, version: 1 });
const store = { get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } }, drop(k) { try { localStorage.removeItem(k); } catch {} } };
const SETTINGS_KEY = KEY + '-settings', ENDINGS_KEY = KEY + '-endings';
let settings = Object.assign({ music: 0.7, sfx: 0.8, muted: false, reduced: false, seen: {} }, store.get(SETTINGS_KEY) || {});
let found = store.get(ENDINGS_KEY) || {}; const endingsBroken = (() => { try { const r = localStorage.getItem(ENDINGS_KEY); return r != null && JSON.parse(r) == null; } catch { return true; } })();
const saveSettings = () => { settings = { ...settings, ...A.getSettings() }; store.set(SETTINGS_KEY, settings); };

// ---- the run (one save slot) ----
let G = null, slot = null; // G: { v, act, S, playTime, seen, finished, phase, lastSeen, ticker }
let screen = 'title'; let paused = false; let holdScreen = false; let finale = null; let ending = null; let transition = null;
const frameLog = []; window.__runLog = window.__runLog || [];
function logFrame(name) { const l = frameLog[frameLog.length - 1]; if (l && l[0] === name) l[1]++; else { frameLog.push([name, 1]); if (frameLog.length > 200) frameLog.shift(); } }

function show(id) {
  screen = id; for (const s of document.querySelectorAll('[data-screen]')) s.hidden = s.id !== id;
  if (id === 'game') { ST.resize(); UI.relayout(); }
}
const slotKey = (n, suffix) => `${KEY}-s${n}-${suffix}`;

// ---------- boot ----------
async function boot() {
  A.loadSettings(settings); if (settings.reduced) document.body.classList.add('reduced');
  $('#btnGear').innerHTML = UI.ICON.gear; setMuteIcons();
  ST.init($('#stage'));
  UI.setHandlers({ buy: onBuy, pickJob: onPickJob, click: () => A.sfx('ui-click') });
  await Promise.all([document.fonts.ready, loadTitleArt(), AS.loadTitleBits()]);
  sharedReady = AS.loadShared();
  await document.fonts.load('40px "Berkshire Swash"'); await document.fonts.load('900 16px Nunito');
  wireInput(); buildTitle(); show('title'); if (endingsBroken) setTimeout(() => toast('Your saved endings couldn\'t be read, so the Endings list starts again.'), 800);
  document.body.classList.remove('booting');
  window.gameReport?.setup({ game: 'Xmas Everywhere', key: KEY, visibility: 'on', state: () => window.__game.state(), pause: () => pause(true), grab: grabScreen, releaseAll: () => { keysDown.clear(); } });
  requestAnimationFrame(loop);
  const local = ['localhost', '127.0.0.1'].includes(location.hostname);
  if ('serviceWorker' in navigator && (!local || params.has('sw'))) navigator.serviceWorker.register('sw.js');
}
let titleArt = null, titleTall = false, sharedReady = null;
async function loadTitleArt() { titleTall = innerHeight > innerWidth * 1.1; const p = titleTall ? 'shared/title-art-tall' : 'shared/title-art';
  try { const r = await fetch(`assets/${p}.webp`); titleArt = await createImageBitmap(await r.blob()); } catch { titleTall = false; try { const r = await fetch('assets/shared/title-art.webp'); titleArt = await createImageBitmap(await r.blob()); } catch {} } }
function setMuteIcons() { const ic = A.isMuted() ? UI.ICON.muted : UI.ICON.sound; $('#btnMute').innerHTML = ic; $('#titleMute').innerHTML = ic; }

// The bug report's picture: the whole game screen (top bar, shop, cards and the stage), not just the stage canvas.
// html2canvas is bundled (vendor/) and loaded on first use; if it fails, the stage alone.
let h2cLoading = null;
function loadH2C() { if (window.html2canvas) return Promise.resolve(); if (!h2cLoading) h2cLoading = new Promise((ok, no) => { const sc = document.createElement('script'); sc.src = 'vendor/html2canvas.min.js'; sc.onload = ok; sc.onerror = no; document.head.appendChild(sc); }); return h2cLoading; }
async function grabScreen() {
  const stageOnly = () => new Promise((r) => $('#stage').toBlob(r, 'image/png'));
  try {
    await loadH2C();
    const c = await window.html2canvas($('#app'), { backgroundColor: getComputedStyle(document.body).backgroundColor, scale: Math.min(1.5, window.devicePixelRatio || 1), logging: false, useCORS: true,
      ignoreElements: (el) => el.id === 'pauseLayer' || el.id === 'toasts' || el.tagName === 'GH-FEEDBACK' });
    return await new Promise((r) => c.toBlob(r, 'image/png'));
  } catch { return stageOnly(); }
}

// ---------- title ----------
function buildTitle() {
  const last = saves.last(); const list = saves.list(); const lastRow = list.find((s) => s.id === last);
  $('#btnContinue').hidden = !lastRow; $('#btnEndings').hidden = !Object.keys(found).length;
  $('#titleSlot').textContent = lastRow ? `Slot ${lastRow.id}: ${summaryText(lastRow.summary)}` : '';
  titleAct = lastRow?.summary?.act || 1;
}
let titleAct = 1;
function drawTitle() {
  const c = $('#titleCanvas'); const d = Math.min(2, devicePixelRatio || 1); const w = innerWidth, h = innerHeight;
  if (c.width !== Math.round(w * d)) { c.width = Math.round(w * d); c.height = Math.round(h * d); }
  const g = c.getContext('2d'); g.setTransform(d, 0, 0, d, 0, 0); ST.cover(g, titleArt, w, h, 0.5, 0.6);
  const cold = titleAct - 1; if (cold) { g.fillStyle = `rgba(20,40,70,${0.12 * cold})`; g.fillRect(0, 0, w, h); }
  // NOEL's box inside the window (an empty pane of the painting), faintly watching; bigger and colder each act
  const box = AS.img('shared/noel-box'); if (box && titleArt) { const sc = Math.max(w / titleArt.width, h / titleArt.height); const ox = (w - titleArt.width * sc) * 0.5, oy = (h - titleArt.height * sc) * 0.6;
    const [ax, ay, aw] = titleTall ? [690, 1514, 110] : [985, 990, 125]; const bw = aw * sc * (1 + 0.12 * cold), bh = bw * box.height / box.width; const x = ox + ax * sc - bw / 2, y = oy + ay * sc - bh;
    g.save(); g.globalAlpha = 0.88; g.drawImage(box, x, y, bw, bh); g.restore();
    const e = AS.data('shared/noel-eyes')?.box; const k = bw / (e?.w || box.width); const ex = x + (e ? e.cx * k : bw / 2), ey = y + (e ? e.cy * k : bh * 0.45); const er = e ? e.r * k : bw * 0.14;
    const glow = g.createRadialGradient(ex, ey, 0, ex, ey, er * 2.2); glow.addColorStop(0, `rgba(63,212,122,${0.75 + 0.1 * Math.sin(performance.now() / 700)})`); glow.addColorStop(0.45, 'rgba(63,212,122,0.35)'); glow.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = glow; g.fillRect(ex - er * 3, ey - er * 3, er * 6, er * 6);
    // frost over it, so it sits behind the glass
    g.fillStyle = 'rgba(230,240,255,0.12)'; g.fillRect(x, y, bw, bh); }
  // snow
  g.fillStyle = 'rgba(255,255,255,0.8)'; const t = performance.now() / 1000; for (let i = 0; i < 70; i++) { const x = ((i * 137.5) % w + Math.sin(t * 0.5 + i) * 20) % w, y = ((i * 91 + t * (20 + i % 5 * 8)) % (h + 20)) - 10; g.beginPath(); g.arc(x, y, 1 + (i % 3), 0, 6.3); g.fill(); }
}
function summaryText(s) { if (!s) return ''; if (s.finished) return `Finished: ${s.finished}`; return `Act ${s.act} · ${s.title}${s.locks ? ` · ${'🔒'.length ? s.locks + ' lock' + (s.locks > 1 ? 's' : '') : ''}` : ''} · ${mins(s.time)}`; }
const mins = (s) => { s = Math.round(s || 0); const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60; return h ? `${h}\u00a0h ${m}\u00a0min` : `${Math.max(1, m)}\u00a0min`; };

// ---------- load screen ----------
function buildLoad() {
  const box = $('#slotList'); box.innerHTML = '';
  for (const s of saves.list()) {
    const row = document.createElement('div'); row.className = 'slot';
    const info = s.empty ? 'Empty' : s.broken ? 'This save can\'t be read' : summaryText(s.summary);
    row.innerHTML = `<div class="slot-info"><div class="slot-name">Slot ${s.id}</div><div class="slot-sum">${info}</div></div>`;
    if (!s.empty && !s.broken) { const b = btn('Load', () => { A.sfx('ui-click'); loadSlot(s.id); }); row.appendChild(b); }
    if (s.empty) { const b = btn('New Xmas', () => newGame(s.id)); row.appendChild(b); }
    if (!s.empty) { const d = btn('Delete', () => confirmBox(`Delete Slot ${s.id}? This can't be undone.`, 'Delete', () => { deleteSlot(s.id); buildLoad(); })); row.appendChild(d); }
    box.appendChild(row);
  }
}
function btn(label, fn, cls = '') { const b = document.createElement('button'); b.textContent = label; if (cls) b.className = cls; b.addEventListener('click', fn); return b; }
function deleteSlot(id) { saves.remove(id); for (const k of ['choice', 'cp1', 'cp2', 'cp3', 'cp4', 'legacy']) store.drop(slotKey(id, k)); }
function confirmBox(text, yes, fn) { openCard({ type: 'confirm', prio: 0, render(el) { el.innerHTML = `<p class="speech">${text}</p>`; const row = rowOf(btn(yes, () => { closeCard(); fn(); }, 'big'), btn('Cancel', () => closeCard())); el.appendChild(row); } }, true); }

// ---------- starting and loading ----------
function newGame(id) {
  const target = id ?? saves.create();
  if (target == null) { // all full: ask which to replace
    openCard({ type: 'replace', prio: 0, render(el) { el.innerHTML = '<h2>Replace a save?</h2><p>All three slots are in use. Pick one to start a New Xmas in.</p>';
      for (const s of saves.list()) el.appendChild(btn(`Replace Slot ${s.id}: ${s.broken ? 'unreadable' : summaryText(s.summary)}`, () => { closeCard(); deleteSlot(s.id); newGame(s.id); }));
      el.appendChild(rowOf(btn('Cancel', () => closeCard()))); } }, true); return;
  }
  deleteSlot(target); slot = target;
  G = { v: 1, act: 1, S: R.newAct(1), playTime: 0, seen: {}, finished: null, phase: 'play', lastSeen: Date.now(), legacy: {} };
  G.S.pile = 0; G.S.pileToys = []; G.begun = false; saveNow(); store.set(slotKey(slot, 'cp1'), G); showActCard();
}
function loadSlot(id) {
  const d = saves.load(id); if (!d || !d.S || !d.S.n || !d.act) { toast('This save can\'t be read'); return; }
  slot = id; G = d;
  if (G.finished && !G.finished.choice) { showEndings({ after: 'mid', act: G.finished.act }); return; }
  if (G.finished) { showEndings({ after: 'win', act: G.finished.act }); return; }
  if (G.phase === 'actwin') { enterAct(false).then(() => openActWin()); return; }
  if (G.begun === false) { showActCard(); return; }
  enterAct(false);
}

// ---------- act title card ----------
async function showActCard() {
  const a = G.act, T = ACT_TEXT[a]; A.loadAct(a);
  $('#actNo').textContent = 'Act ' + a; $('#actTitle').textContent = T.title; $('#actIntro').innerHTML = T.intro.map((l) => `<p>${l}</p>`).join('');
  const lg = $('#actLegacy'); const pic = loadLegacyPic(a - 1);
  if (a > 1) { lg.hidden = false; lg.innerHTML = `${pic ? `<img src="${pic}" alt="The last act's finished stage">` : ''}<div>You bring ${['', 'The Old Workshop', 'The List Room', 'The Earthmas Deck'][a - 1]}. Your helpers came with you: worth ${G.S.legacyL} ${ACT_TEXT[a].help[ACTS[a].HELP[0][0]][0]} now, more with every rank.${a === 2 ? '<br><b>New:</b> the Declare Victory button is on the top bar now. Press it whenever you like to end your Xmas, merrily.' : ''}</div>`; }
  else lg.hidden = true;
  show('actcard'); drawActcardBg(a);
  $('#actBegin').disabled = true; $('#actRetry').hidden = true;
  await Promise.all([AS.loadAct(a), sharedReady]); drawActcardBg(a);
  const miss = AS.missing().filter((m) => m.startsWith('act' + a + '/') && /bg$/.test(m)); if (miss.length) $('#actRetry').hidden = false;
  $('#actBegin').disabled = false; $('#actBegin').focus();
  A.playMusic(['', 'workshop', 'list', 'earthmas', 'starsleigh'][a]);
}
function drawActcardBg(a) { const c = $('#actcardCanvas'); const d = Math.min(2, devicePixelRatio || 1); c.width = innerWidth * d; c.height = innerHeight * d; const g = c.getContext('2d'); g.setTransform(d, 0, 0, d, 0, 0);
  ST.cover(g, AS.img(['', 'act1/workshop-bg', 'act2/list-room-bg', 'act3/deck-bg', 'act4/bridge-bg'][a]), innerWidth, innerHeight); g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(0, 0, innerWidth, innerHeight); }
function loadLegacyPic(a) { if (a < 1) return null; const L = store.get(slotKey(slot, 'legacy')) || {}; return L[a] || null; }
let legacyBitmap = null;
async function enterAct(fresh) {
  const a = G.act; UI.buildAct(a, G.S); A.loadAct(a); await Promise.all([AS.loadAct(a), sharedReady]);
  const pic = loadLegacyPic(a - 1); legacyBitmap = null; UI.setLegacyImg(pic);
  if (pic) { const im = new Image(); im.src = pic; im.onload = () => createImageBitmap(im).then((b) => (legacyBitmap = b)); }
  A.rushLoop(false); ST.resetFx(); if (fresh || !G.thinking) G.thinking = G.thinking && !fresh ? G.thinking : OPENING[a]; $('#tickerText').textContent = G.thinking || ''; $('#ticker').classList.toggle('empty', !G.thinking); show('game'); paused = false; $('#pauseLayer').hidden = true; finale = null;
  A.playMusic(['', 'workshop', 'list', 'earthmas', 'starsleigh'][a]);
  // away time
  if (!fresh && G.lastSeen) applyAway((Date.now() - G.lastSeen) / 1000);
  G.lastSeen = Date.now();
  if (G.S.pendingChoice && ACTS[a].CHOICE) queuePromotion(G.S.pendingChoice, true);
  if (G.S.rank === 10 && G.S.finalDone && G.phase !== 'actwin') startFinale();
  refreshBanner(); saveNow();
}
function begin() {
  A.unlock(); A.sfx('ui-click'); if ($('#actBegin').disabled) return;
  G.begun = true; G.lastSeen = Date.now();
  const pic = loadLegacyPic(G.act - 1);
  enterAct(true).then(() => {
    if (pic && legacyStartPic(pic)) A.sfx('transition');
    if (G.act === 2 && !G.seen.howtoDeclare) { G.seen.howtoDeclare = true; openCard(howtoDeclareCard()); }
  });
}
function legacyStartPic(pic) { const im = new Image(); im.src = pic; transition = { im, t0: performance.now() }; return true; }

// ---------- the loop ----------
let eyeFrame = 0; let acc = 0, lastFrame = performance.now(), saveT = 0, tickerT = 0, wrongT = 25;
function econRunning() { return screen === 'game' && !card && !paused && !finale && !document.hidden && !window.gameReport?.isOpen() && G; }
function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.min(0.25, (now - lastFrame) / 1000); lastFrame = now;
  if (screen === 'title') drawTitle();
  if (G && screen === 'game') {
    if (econRunning()) { acc += dt; let n = 0; while (acc >= 0.1 && n++ < 10) { acc -= 0.1; R.step(G.S, 0.1); G.playTime += 0.1; botTick(); } handleEvents(); if (acc > 1) acc = 0; }
    if (finale) runFinale(now);
    const S = G.S; const o = finale ? finale.o : {}; o.legacy = legacyBitmap;
    if (transition) { const k = (now - transition.t0) / 1500; if (k >= 1) transition = null; else o.overlay = (c) => { c.save(); c.globalAlpha = 1 - k; const s = 1 + k * 2.5; c.translate(ST.W / 2, ST.H / 2); c.scale(s, s); c.drawImage(transition.im, -ST.W / 2, -ST.H / 2, ST.W, ST.H); c.restore(); }; }
    else if (!finale) delete o.overlay;
    ST.frame(G.act, S, o);
    UI.update(S, { counter: counterText(S), thinking: G.thinking, glowHelper: glowHelper });
    if ((UI.currentTab() === 'noel' || UI.isDesktop()) && UI.els.noelEye && UI.els.noelEye.offsetParent && (++eyeFrame % 4 === 0)) { const c = UI.els.noelEye; if (G.act === 1 && !S.woke) ST.noelPortraitDusty(c); else ST.noelPortrait(c, G.act, S); }
    updateDeclare(S); updateHints(S);
    saveT += dt; if (saveT > 10 && econRunning()) { saveT = 0; saveNow(); }
    if (G.act === 2) { wrongT -= dt; if (wrongT <= 0) { wrongT = 20 + Math.random() * 20; A.wrongNote(); } }
  }
  if (screen === 'ending' && ending) runEnding(now);
  logFrame(frameName());
}
function frameName() {
  let n = screen; if (screen === 'game' && finale) n = finale.step; if (screen === 'ending' && ending) n = 'ending-' + ending.n;
  if (card) n += '>' + card.type; if (paused) n += '>pause'; if (window.gameReport?.isOpen()) n += '>report'; return n;
}
function counterText(S) {
  const T = ACT_TEXT[G.act]; if (G.act === 1) return '';
  if (G.act === 2) return `On the List: ${UI.fmtPeople(Math.min(2.4e9, S.prog / 38 * 1.2))} people`;
  if (G.act === 3) return `Earth celebrating: ${Math.round(ST.earthFrac(S) * 100)}%`;
  return `Worlds celebrating: ${S.finalDone ? 'all of them' : UI.fmtPeople(worlds(S))}`;
}
function worlds(S) { const w = [0, 1, 12, 140, 2000, 30000, 500000, 9e6, 2e8, 6e9, 6e10]; const r = S.rank; const f = R.rankFrac(S); return Math.round(w[r] * Math.pow(w[Math.min(10, r + 1)] / w[r], r >= 10 ? 0 : f)); }

// ---------- events from the engine ----------
let glowHelper = null;
function handleEvents() {
  const S = G.S; const ev = S.events.splice(0);
  for (const e of ev) {
    if (e.type === 'done') { let item = null; if (G.act === 1) { S.pile = (S.pile || 0) + e.n; item = addToPile(S, e.job, e.n); } ST.onJobDone(G.act, e.n, item); A.sfx(['', 'toy-done', 'file-done', 'holdout-won', 'first-contact'][G.act], { vol: G.act === 4 ? 0.35 : 1 }); A.sfx('cookie-clink', { vol: 0.5 }); if (G.act === 1) A.sfx('present-rustle', { vol: 0.5 });
      if (G.act === 2 && !G.seen.firstFile) { G.seen.firstFile = true; declareGlow = 6; setTicker('You can stop whenever you like, Pip. Nobody does.'); } }
    else if (e.type === 'rank') { A.sfx('fanfare'); if (ACT_TEXT[G.act].speaker(e.rank) === 'santa') setTimeout(() => A.voice('santa-hohoho'), 300); queuePromotion(e.rank); saveSoon(); }
    else if (e.type === 'final') { startFinale(); }
    else if (e.type === 'lucky') A.sfx(['', 'star-appear', 'letter-appear', 'cloud-appear', 'comet-appear'][G.act]);
    else if (e.type === 'rushEnd') { A.rushLoop(false); A.sfx('rush-end'); }
    else if (e.type === 'lock') { if (!e.past4) runLog().locksTaken++; onLock(e); }
    else if (e.type === 'grip') { A.sfx('grip'); ST.onHelperAdded(e.id); G.gripN = (G.gripN || 0) + 1; if (G.gripN <= 3) { setTicker(GRIP_LINES[(G.gripN - 1) % 3]); toast(GRIP_LINES[(G.gripN - 1) % 3], 'noel'); } }
    else if (e.type === 'unlock') { A.sfx('unlock'); A.sfx('check-complete'); setTicker(UNLOCK_LINE); toast(UNLOCK_LINE, 'noel'); declareGlow = 2; saveSoon(); }
    else if (e.type === 'cleared') { runLog().locksCleared += e.removed || 0; if (e.left) { A.sfx('unlock'); toast('Some chains fell off. Build the rest to clear the button.'); } }
    else if (e.type === 'built') { A.sfx(e.kind === 'lever' ? 'lever-clunk' : 'override-built'); if (e.kind !== 'lever') A.sfx('elf-hup', { vol: 0.6 }); }
    else if (e.type === 'wake') { ST.onWake(); A.voice('noel-hello'); setTicker('Hello, Pip. I\'ve counted the reindeer: nine, as always. Now I\'ll think about toys. My ideas will show up in the NOEL tab.'); }
  }
  // Act 4 warning: the final job's banner with a lock on
  if (G.act === 4 && S.rank === 10 && S.locks.length && !G.seen.warn4) { G.seen.warn4 = true; setTicker('Leave the button with me, Pip. Just until the end.'); A.sfx('lock', { vol: 0.5 }); $('#btnDeclare').classList.add('clank'); setTimeout(() => $('#btnDeclare').classList.remove('clank'), 600); }
  refreshBanner();
}
// The pile under the tree keeps the toys you made, as many as it shows (ST.pileCount: one per toy for the first dozen,
// then slower, 40 at most), newest replacing older ones, so every toy that flies to the pile can be seen there; once the
// Wrapping Station is in the line, every other toy arrives wrapped.
function addToPile(S, job, n) { if (!S.pileToys) S.pileToys = []; let last = job; const cap = ST.pileCount(S.pile || 0);
  if (S.pileToys.length > cap) S.pileToys = cap ? S.pileToys.slice(-cap) : []; // a save from before the pile matched its count
  for (let k = 0; k < Math.min(3, n); k++) { const wrapped = S.own.includes('wrappingStation') && (S.stats.made + k) % 2 === 0; last = wrapped ? 100 + job : job;
    if (S.pileToys.length < cap) { S.pileToys.push(last); continue; }
    // full: a new toy takes the place of one of the most common kind, so the pile keeps its variety
    const count = {}; for (const t of S.pileToys) { const j = t % 100; count[j] = (count[j] || 0) + 1; }
    const top = +Object.keys(count).sort((a, b) => count[b] - count[a])[0]; if (top === job && count[job] > 1 && Object.keys(count).length > 1 && (S.stats.made + k) % 3) continue;
    const spots = []; S.pileToys.forEach((t, i) => t % 100 === top && spots.push(i)); S.pileToys[spots[(S.stats.made * 7 + k) % spots.length]] = last; }
  return last; }
function setTicker(t) { G.thinking = t; const el = $('#tickerText'); el.textContent = t; $('#ticker').classList.toggle('empty', !t); A.sfx('noel-speak', { vol: 0.5 }); ST.onNoelBright(); }
let saveSoonT = null; function saveSoon() { clearTimeout(saveSoonT); saveSoonT = setTimeout(saveNow, 200); }
function refreshBanner() {
  const S = G.S, T = ACT_TEXT[G.act]; const b = $('#banner');
  if (S.rank === 10 && !S.finalDone) { const w = R.rates(S, { job: 9 }).work; const at90 = S.jp[9] >= 0.899 * w; b.hidden = false; b.textContent = at90 ? T.finalTap : T.finalBanner; b.className = at90 ? 'gold' : ''; }
  else b.hidden = true;
}

// ---------- buying ----------
function onBuy(kind, id, el) {
  if (!G || card || finale) return; A.unlock();
  const S = G.S;
  if (!R.canBuy(S, kind, id)) { A.sfx('cant-afford'); UI.itemFlash(el, 'shake'); return; }
  const it = kind === 'item' ? R.itemsOf(G.act).find((x) => x.id === id) : null;
  R.buy(S, kind, id); el?.blur();
  UI.itemFlash(el, 'flash');
  if (kind === 'helper') { ST.onHelperAdded(id); A.sfx('purchase'); if (R.helperDef(G.act, id)[4] === 'hand') A.sfx('elf-hup', { vol: 0.5 }); if (glowHelper === id) glowHelper = null; UI.glowTab('helpers', false); }
  else if (it && it.cur === 'i') { A.sfx('noel-buy'); const line = ACT_TEXT[G.act].noel[id][2]; setTicker(line); }
  else if (kind !== 'build') A.sfx('purchase');
  if (kind === 'tool' && G.act === 1 && id >= 2) ST.shake(0.15);
  handleEvents(); saveSoon();
}
function onPickJob(i, el) { if (!G || card) return; if (i >= G.S.rank) { A.sfx('cant-afford'); UI.itemFlash(el, 'shake'); toast(`Unlocks at ${ACT_TEXT[G.act].ranks[i]}`); return; } A.sfx('ui-click'); G.S.job = i; el?.blur(); refreshBanner(); }

// ---------- taps ----------
const keysDown = new Set();
function doTap(x, y, viaKey) {
  if (!G || screen !== 'game' || card || paused || finale) return;
  A.unlock(); A.resumePending();
  const S = G.S; let spot = false;
  if (G.act === 3) { const sp = ST.spotState(); if (viaKey) { if (sp.resting) { spot = true; x = sp.x; y = sp.y; } } else if (Math.hypot(x - sp.x, y - sp.y) <= sp.r) spot = true; }
  if (viaKey && G.act === 3 && !spot) { const g = ST.globeGeom(); x = g.cx + (Math.random() - 0.5) * g.R; y = g.cy + (Math.random() - 0.5) * g.R; }
  if (viaKey && (G.act === 4)) { const v = ST.viewport(); x = v.cx + (Math.random() - 0.5) * v.R; y = v.cy + (Math.random() - 0.5) * v.R * 0.8; }
  const v = R.tap(S, spot);
  const heavy = (G.act === 1 && R.toolIdx(S) >= 2) || (G.act === 2 && R.toolIdx(S) === 3) || (G.act >= 3 && R.toolIdx(S) === 3);
  ST.onTap(S, G.act, x, y, v, { spot, heavy: heavy && R.toolIdx(S) === 3 });
  A.sfx(G.act === 1 ? (heavy ? 'heavy-tap' : 'tap') : ['', '', 'stamp', 'bell', 'ping'][G.act], { vary: true, rate: spot ? 1.25 : 1, vol: spot ? 1 : 0.85 });
  if (!G.seen['tap' + G.act]) G.seen['tap' + G.act] = true;
  handleEvents();
}
function onStagePointer(e) {
  if (window.gameReport?.isOpen()) return;
  e.preventDefault(); if (!G || card || paused || finale) return;
  const [x, y] = ST.toStage(e.clientX, e.clientY); const S = G.S;
  const lp = ST.luckyPos(S, G.act); if (lp && Math.hypot(x - lp[0], y - lp[1]) <= 36 / ST.cssScale() + 20) { if (R.catchLucky(S)) { A.sfx(['', 'star-caught', 'letter-appear', 'comet-appear', 'comet-appear'][G.act], { rate: G.act === 2 ? 1.3 : 1 }); A.rushLoop(true, { 1: 'rush-bells', 2: 'rush-paper', 3: 'rush-bells', 4: 'rush-choir' }[G.act]); toast(ACT_TEXT[G.act].rush + '!'); } return; }
  doTap(x, y, false);
}
function wireInput() {
  $('#stageWrap').addEventListener('pointerdown', onStagePointer);
  addEventListener('keydown', (e) => {
    if (window.gameReport?.isOpen()) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key;
    if (k === ' ' || k === 'Enter') {
      if (screen === 'game' && !card && !paused) { e.preventDefault(); if (!e.repeat) doTap(ST.W * 0.52, ST.H * 0.56, true); return; }
      if (screen === 'game' && (card || paused) && document.activeElement?.tagName !== 'BUTTON') { e.preventDefault(); return; }
      if (screen === 'actcard' && document.activeElement?.tagName !== 'BUTTON') { e.preventDefault(); if (!e.repeat && k === 'Enter') begin(); return; }
      if (e.repeat) e.preventDefault(); return; }
    if (k === 'Escape' || k === 'p' || k === 'P') { if (card) { if (k === 'Escape') cardEsc(); return; } if (screen === 'game') { e.preventDefault(); pause(!paused); return; } if (paused) { pause(false); return; }
      if (screen === 'howto' && howtoFromPause && G) { howtoFromPause = false; show('game'); pause(true); return; }
      if (['load', 'howto'].includes(screen)) { show('title'); buildTitle(); } return; }
    if (k === 'm' || k === 'M') { toggleMute(); return; }
    if (card && (k === '1' || k === '2') && card.choiceKeys) { card.choiceKeys[k](); return; }
    if (!card && !paused && screen === 'game' && /^[0-9]$/.test(k)) { const i = k === '0' ? 9 : +k - 1; onPickJob(i, UI.els.jobs[i]); }
  }, true);
  $('#btnGear').addEventListener('click', () => { A.sfx('ui-click'); pause(true); });
  $('#btnMute').addEventListener('click', toggleMute); $('#titleMute').addEventListener('click', toggleMute);
  $('#btnDeclare').addEventListener('click', onDeclare);
  $('#btnNew').addEventListener('click', () => { A.unlock(); A.sfx('ui-click'); newGame(); });
  $('#btnContinue').addEventListener('click', () => { A.unlock(); A.sfx('ui-click'); loadSlot(saves.last()); });
  $('#btnLoad').addEventListener('click', () => { A.unlock(); A.sfx('ui-click'); buildLoad(); show('load'); });
  $('#btnEndings').addEventListener('click', () => { A.unlock(); A.sfx('ui-click'); showEndings({ after: 'title' }); });
  $('#btnHowto').addEventListener('click', () => { A.unlock(); A.sfx('ui-click'); buildHowto(); show('howto'); });
  $('#loadBack').addEventListener('click', () => { show('title'); buildTitle(); });
  $('#howtoBack').addEventListener('click', () => { if (G && howtoFromPause) { howtoFromPause = false; show('game'); pause(true); } else { show('title'); buildTitle(); } });
  $('#actBegin').addEventListener('click', begin);
  $('#actRetry').addEventListener('click', () => location.reload());
  $('#endingsTitle').addEventListener('click', () => { A.stopMusic(); G = null; show('title'); buildTitle(); });
  $('#endingSkip').addEventListener('click', () => skipEnding());
  addEventListener('resize', () => { ST.resize(); UI.relayout(); });
  if (window.ResizeObserver) new ResizeObserver(() => ST.resize()).observe($('#stageWrap'));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { if (G) { G.lastSeen = Date.now(); saveNow(); } }
    else if (G && screen === 'game') { const s = (Date.now() - (G.lastSeen || Date.now())) / 1000; G.lastSeen = Date.now(); if (s > 2) applyAway(s); }
  });
  addEventListener('pagehide', () => { if (G) { G.lastSeen = Date.now(); saveNow(); } });
}
function toggleMute() { A.unlock(); A.setMuted(!A.isMuted()); setMuteIcons(); saveSettings(); }
function applyAway(s) {
  const S = G.S; const r = R.away(S, s); if (!r) return; S.events = S.events.filter((e) => e.type !== 'done');
  if (G.act === 1) S.pile = (S.pile || 0) + r.made;
  if (r.card) openCard({ type: 'welcome', prio: 1, render(el) { el.innerHTML = `<h2>Welcome back!</h2><p class="speech">While you were away, your helpers finished ${fmt(r.made)} ${ACT_TEXT[G.act].jobWord.toLowerCase()}${r.made === 1 ? '' : 's'} (${ACT_TEXT[G.act].jobs[r.job]}): +${fmt(r.cookies)} cookies.</p>`; el.appendChild(rowOf(btn('Back to work!', () => closeCard(), 'big'))); } });
  else if (r.cookies > 0) toast(`+${fmt(r.cookies)} cookies while you were away`);
  handleEvents();
}

// ---------- cards ----------
let card = null; const queue = []; let cardOpenAt = 0;
function rowOf(...b) { const r = document.createElement('div'); r.className = 'row'; b.forEach((x) => x && r.appendChild(x)); return r; }
function openCard(spec, front = false) {
  if (front && card) { queue.unshift(card); card = null; queue.unshift(spec); nextCard(); return; } // stack over the open card; it comes back when this one closes
  if (front) queue.unshift(spec); else { queue.push(spec); queue.sort((a, b) => (a.prio ?? 5) - (b.prio ?? 5)); } if (!card) nextCard(); }
function nextCard() {
  card = queue.shift() || null; const layer = $('#cardLayer'), el = $('#card');
  if (!card) { layer.hidden = true; A.duck(false); return; }
  layer.hidden = false; el.className = 'paper card'; el.innerHTML = ''; card.render(el); cardOpenAt = performance.now();
  // the 1 s guard: buttons don't respond at first
  el.querySelectorAll('button').forEach((b) => { const f = b.onclick; b.addEventListener('click', (ev) => { if (performance.now() - cardOpenAt < 1000) { ev.stopImmediatePropagation(); ev.preventDefault(); } }, true); });
  if (card.duck) A.duck(true);
  setTimeout(() => el.querySelector('button.big, button')?.focus({ preventScroll: true }), 1000);
}
function closeCard() { const c = card; card = null; if (c?.onClose) c.onClose(); nextCard(); saveSoon(); }
function cardEsc() { if (!card || performance.now() - cardOpenAt < 1000) return; if (card.noEsc) return; if (card.esc) card.esc(); else closeCard(); }
function flipCard(render) { const el = $('#card'); el.classList.remove('flip'); void el.offsetWidth; el.classList.add('flip'); A.sfx('present-rustle'); setTimeout(() => { el.innerHTML = ''; render(el); cardOpenAt = performance.now() - 400; setTimeout(() => el.querySelector('button.big, button')?.focus({ preventScroll: true }), 650); el.querySelectorAll('button').forEach((b) => b.addEventListener('click', (ev) => { if (performance.now() - cardOpenAt < 1000) { ev.stopImmediatePropagation(); ev.preventDefault(); } }, true)); }, 200); }

function speakerPortrait(who) {
  if (who === 'santa') { const i = document.createElement('img'); i.className = 'portrait'; i.src = AS.url('shared/santa-portrait'); i.alt = 'Santa'; return i; }
  const c = document.createElement('canvas'); c.width = c.height = 224; c.className = 'portrait-c'; ST.noelPortrait(c, G.act, G.S); return c;
}
function queuePromotion(rank, isChoiceOnly) {
  const a = G.act, T = ACT_TEXT[a], S = G.S; const who = T.speaker(rank);
  openCard({ type: (a === 2 && rank >= 2 && rank <= 9) || (a === 4 && rank <= 9) ? 'promotion-choice' : 'promotion', prio: 2, duck: false, noEsc: !!(ACTS[a].CHOICE && rank <= 9 && (a === 4 || rank >= 2)),
    render(el) {
      if (a === 4 && rank <= 9) return contactCard(el, rank);
      el.appendChild(speakerPortrait(who));
      let line = T.lines[rank - 1] || '';
      if (a === 1 && rank === 5 && !S.woke) line = T.lineUnplugged5;
      if (a === 1 && rank === 9 && S.wokeSelf && !G.seen.wokeLine) { G.seen.wokeLine = true; line = 'I woke myself up, Pip. You looked busy.'; ST.onWake(); setTimeout(() => A.voice('noel-woke'), 600); }
      if (a === 1 && rank === 10 && S.phoneByNoel) line += ' NOEL has drawn the Smartphone already. It insisted.';
      el.insertAdjacentHTML('beforeend', `<p class="speech ${who === 'noel' ? 'noel' : ''}">“${line}”</p><div class="big-title">${T.ranks[rank - 1]}</div>`);
      const un = unlocksAt(rank); if (un.length) { const u = document.createElement('div'); u.className = 'unlocks'; u.innerHTML = un.map(([src, n]) => `<div><img src="${src}" alt="">${n}</div>`).join(''); el.appendChild(u); }
      el.insertAdjacentHTML('beforeend', `<p class="stats">Now ${['', 'building', 'checking', 'winning over', 'contacting'][a]}: <b>${T.jobs[rank - 1]}</b></p>`);
      if (a === 2 && rank >= 2 && rank <= 9) return wishPart(el, rank);
      if (a === 2 && rank === 6) glowSleep = true;
      el.appendChild(rowOf(btn('Back to work!', () => closeCard(), 'big')));
    }, onClose() { if (a === 3 && rank === 5 && !G.seen.postcard) { G.seen.postcard = true; openCard(postcardCard()); } } });
}
let glowSleep = false;
function unlocksAt(rank) {
  const a = G.act, Ad = ACTS[a], T = ACT_TEXT[a]; const out = [[AS.url(AS.jobFile(a, rank - 1)), T.jobs[rank - 1]]];
  Ad.TOOLS.forEach(([, , r], i) => { if (r === rank) out.push([AS.url(AS.toolFile(a, i)), T.tools[i]]); });
  Ad.HELP.forEach((h) => { if (h[3] === rank) out.push([AS.url(AS.helperFile(a, h[0])), T.help[h[0]][0]]); });
  R.itemsOf(a).forEach((it) => { if (it.r === rank) out.push([it.cur === 'c' ? AS.url(AS.upgFile(a, it.id)) : AS.url('shared/icon-insight'), (T.upg[it.id] || T.noel[it.id])[0]]); });
  return out.slice(0, 4);
}
function choiceButtons(el, hand, noel, onPick) {
  const r = document.createElement('div'); r.className = 'choice-row';
  const b1 = document.createElement('button'); b1.className = 'mitten'; b1.innerHTML = `<img src="${AS.url('shared/badge-mitten')}" alt="">${hand[0]}<small>${hand[1]}</small>`;
  const b2 = document.createElement('button'); b2.className = 'eye'; b2.innerHTML = `<img src="${AS.url('shared/badge-eye')}" alt="">${noel[0]}<small>${noel[1]}</small>`;
  b1.addEventListener('click', () => onPick('hand')); b2.addEventListener('click', () => onPick('noel')); r.append(b1, b2); el.appendChild(r);
  card.choiceKeys = { 1: () => performance.now() - cardOpenAt >= 1000 && onPick('hand'), 2: () => performance.now() - cardOpenAt >= 1000 && onPick('noel') };
}
function wishPart(el, rank) {
  const T = ACT_TEXT[2]; const [want, shaped] = T.wishes[rank - 1];
  el.insertAdjacentHTML('beforeend', `<div class="wish"><b>${T.jobs[rank - 1]}</b> want: ${want}.</div>`);
  if (rank === 2 && !G.seen.twinGlow) { G.seen.twinGlow = true; setTicker('Mine are cheaper. Just saying.'); }
  choiceButtons(el, ['Grant', 'Elves answer it by hand. Hand\u2011run helpers +3%'], ['Shape', 'NOEL adjusts it. NOEL\u2011run helpers +6%'], (side) => {
    card.choiceKeys = null; R.choose(G.S, rank, side); logChoice('wishes', rank, side); A.sfx(side === 'hand' ? 'mitten-chime' : 'noel-speak');
    const ans = side === 'hand' ? 'Granted. The elves are writing back.' : shaped; tickerPush(`${T.jobs[rank - 1]}: ${side === 'hand' ? 'granted' : 'shaped'}.`);
    if (side === 'noel') setTicker(shaped);
    flipCard((e) => { e.appendChild(speakerPortrait(side === 'hand' ? 'santa' : 'noel')); e.insertAdjacentHTML('beforeend', `<div class="big-title">${side === 'hand' ? 'Granted' : 'Shaped'}</div><p class="speech ${side === 'noel' ? 'noel' : ''}">“${ans}”</p>`);
      card.type = 'answer'; card.noEsc = false; e.appendChild(rowOf(btn('Continue', () => closeCard(), 'big'))); });
    saveSoon();
  });
}
function contactCard(el, rank) {
  const T = ACT_TEXT[4]; const [what, want, listen, translate] = T.species[rank - 1]; card.type = 'contact-card';
  el.insertAdjacentHTML('beforeend', `<img class="portrait" style="width:160px;height:160px" src="${AS.url(AS.jobFile(4, rank - 1))}" alt="${T.jobs[rank - 1]}">${rank > 1 ? `<div class="big-title" style="font-size:24px">${T.ranks[rank - 1]}</div>` : ''}<p class="stats">First Contact</p><div class="big-title">${T.jobs[rank - 1]}</div><p>${cap(what)}. They want: <b>${want}</b>.</p>`);
  if (rank === 8) { el.insertAdjacentHTML('beforeend', `<p class="speech">“${T.wanderers}”</p>`); if (G.S.locks.length) { A.sfx('lock', { vol: 0.6 }); } }
  A.sfx('first-contact');
  choiceButtons(el, ['Listen', 'They share what they make. Cookies +6%'], ['Translate', 'NOEL translates. Wonder +4.5%'], (side) => {
    card.choiceKeys = null; R.choose(G.S, rank, side); logChoice('contacts', rank, side); A.sfx(side === 'hand' ? 'mitten-chime' : 'noel-speak');
    const ans = side === 'hand' ? listen : translate; tickerPush(`${T.jobs[rank - 1]}: “${ans}”`); if (side === 'noel') setTicker(translate);
    flipCard((e) => { if (side === 'noel') e.appendChild(speakerPortrait('noel')); else e.insertAdjacentHTML('beforeend', `<img class="portrait" src="${AS.url(AS.jobFile(4, rank - 1))}" alt="">`);
      e.insertAdjacentHTML('beforeend', `<div class="big-title">${side === 'hand' ? 'They said' : 'NOEL says'}</div><p class="speech ${side === 'noel' ? 'noel' : ''}">“${ans}”</p>`); card.type = 'answer'; card.noEsc = false; e.appendChild(rowOf(btn('Continue', () => closeCard(), 'big'))); });
    saveSoon();
  });
}
const cap = (s) => s[0].toUpperCase() + s.slice(1);
function tickerPush(t) { G.tickerLog = [...(G.tickerLog || []).slice(-8), t]; }
function postcardCard() { return { type: 'postcard', prio: 3, render(el) { el.innerHTML = `<img class="postcard" src="${AS.url('shared/santa-beach')}" alt="Santa in a sun hat on a beach, waving"><p class="postcard-msg">Wish you were here, Pip. Is NOEL eating enough? It looked hungry. Merry Xmas, S.</p>`; el.appendChild(rowOf(btn('Back to work!', () => closeCard(), 'big'))); } }; }
function howtoDeclareCard() { return { type: 'howto-declare', prio: 1, render(el) { el.innerHTML = `<img class="portrait" src="${AS.url('shared/icon-declare')}" alt=""><div class="big-title">Declare Victory &amp; Merry Xmas</div><p>From now on this button is always on the top bar. Press it whenever you like: your Xmas ends there, with the ending you've earned.</p><p>NOEL may try to stop you using it, if you're not careful. Keep a few hands on the wheel.</p>`; el.appendChild(rowOf(btn('Got it', () => closeCard(), 'big'))); } }; }

// ---------- locks ----------
let declareGlow = 0;
function onLock(e) {
  A.sfx('lock'); ST.setDim(0.6); setTimeout(() => ST.setDim(0), 500); const d = $('#btnDeclare'); d.classList.add('clank'); setTimeout(() => d.classList.remove('clank'), 600);
  const tx = LOCKS_TEXT[e.kind]; setTicker(e.past4 ? PAST4 : tx.line); if (!settings.seen.secured) { settings.seen.secured = true; saveSettings(); setTimeout(() => A.voice('noel-secured'), 700); }
  openCard(lockCard(e)); saveSoon();
}
function lockCard(e) {
  return { type: 'lock-card', prio: 3, duck: true, render(el) {
    const S = G.S; const share = R.handShare(S); el.appendChild(speakerPortrait('noel'));
    const line = e ? (e.past4 ? `${LOCKS_TEXT[e.kind].line} ${PAST4}` : LOCKS_TEXT[e.kind].line) : 'The button is locked. Here is what it would take.';
    el.insertAdjacentHTML('beforeend', `<p class="speech noel">“${line}”</p><div class="big-title">${S.locks.length ? `${S.locks.length} lock${S.locks.length > 1 ? 's' : ''} on your Merry Xmas button` : 'Your Merry Xmas button is free'}</div>`);
    const rows = document.createElement('div'); rows.className = 'lock-rows';
    S.locks.forEach((l, i) => { const t = LOCKS_TEXT[l.kind]; const r = document.createElement('div'); r.className = 'lock-row'; r.innerHTML = `<img src="${AS.url('locks/' + (l.kind === 'lever' ? 'lever' : 'override-' + l.kind.slice(4)))}" alt=""><div class="lr-main"><b>${cap(t.name)}</b><br>Build: ${t.build}${l.cost != null ? ` (${fmt(l.cost)}\u00a0cookies)` : ''}</div>`;
      if (l.built) r.insertAdjacentHTML('beforeend', '<b>Built</b>'); else if (!S.ready || l.cost == null) r.insertAdjacentHTML('beforeend', '<small>NOEL is recalculating… (rank 4)</small>');
      else { const b = btn('Build', () => { closeCard(); onBuy('build', i, null); }); b.disabled = S.cookies < l.cost; r.appendChild(b); } rows.appendChild(r); });
    el.appendChild(rows);
    if (S.T != null) el.insertAdjacentHTML('beforeend', `<div class="hands-bar"><i style="width:${share * 100}%"></i><b style="left:${S.T * 100}%"></b></div><p class="stats">Hands now ${Math.floor(share * 100)}% · goal ${Math.round(S.T * 100)}% (hold it for 30 s while an override is built)</p>`);
    const od = Math.round(R.overdrive(S) * 100);
    el.insertAdjacentHTML('beforeend', `<div class="costs">While locked: free hands off (−15% for hand-run helpers)${od ? `; NOEL's Overdrive +${od}% for its machines` : ''}; NOEL's Grip takes one of your hand-run helpers every ${Math.round(R.gripEvery(S))} s (next in ${Math.max(0, Math.round(R.gripEvery(S) - S.gripT))} s).</div>`);
    el.appendChild(rowOf(btn('Hire hands', () => { closeCard(); UI.showTab('helpers'); }, 'big'), btn('Back to work', () => closeCard())));
  } };
}
function updateDeclare(S) {
  const d = $('#btnDeclare'); if (G.act < 2) return; const n = S.locks.length; const key = n + '|' + R.holdFilling(S);
  d.classList.toggle('locked', n > 0); d.classList.toggle('holding', n > 0 && R.holdFilling(S)); d.style.setProperty('--hold', (S.holdT / 30).toFixed(3));
  d.classList.toggle('glow', declareGlow > 0); if (declareGlow > 0) declareGlow -= 1 / 60;
  const box = d.querySelector('.declare-locks'); if (box.dataset.n !== String(n)) { box.dataset.n = n; box.innerHTML = n ? `<span class="chain c1"></span>${n > 1 ? '<span class="chain c2"></span>' : ''}${Array.from({ length: n }, (_, i) => `<span class="pad" style="left:${8 + i * 22}%"></span>`).join('')}` : ''; }
  d.setAttribute('aria-label', n ? `Declare Victory (locked: ${n})` : 'Declare Victory and Merry Xmas');
}
let hintOn = false;
function updateHints(S) {
  const first = !G.seen['tap' + G.act];
  const show = first && !card && !finale; if (show !== hintOn) { hintOn = show; $('#tapHint').hidden = !show; $('#tapHintText').textContent = ACT_TEXT[G.act].tapVerb; }
  const h = ACTS[G.act].HELP[0]; const want = S.n[h[0]] === 0 && S.cookies >= R.price(S, h[0]) ? h[0] : null;
  if (want !== glowHelper) { glowHelper = want; UI.glowTab('helpers', !!want); }
  if (G.act === 2 && glowSleep && UI.els.items.sleepTracking) { UI.els.items.sleepTracking.classList.add('glowing'); if (!G.seen.padGlow) { G.seen.padGlow = true; setTicker('I\'d really like this one. I\'d look after the button for you.'); } if (S.own.includes('sleepTracking')) glowSleep = false; }
}
function onDeclare() {
  A.unlock(); A.sfx('ui-click'); if (!G || card || finale) return; const S = G.S;
  if (S.locks.length) { openCard(lockCard(null), true); return; }
  openCard({ type: 'declare-confirm', prio: 0, render(el) { el.innerHTML = `<img class="portrait" src="${AS.url('shared/icon-declare')}" alt=""><div class="big-title">Declare Victory now?</div><p>Your Xmas ends here, with the ending you've earned. This run ends too: you can replay Act ${G.act} from its start, or start a New Xmas.</p>`;
    el.appendChild(rowOf(btn('Declare Victory & Merry Xmas', () => declareMidAct(), 'big'), btn('Not yet', () => closeCard()))); } }, true);
}

// ---------- finales ----------
const FINALES = { 1: [['eve-lights', 3.2], ['eve-lift', 2.6], ['eve-sky', 5.5]], 2: [['review-file', 3.6], ['review-stamp', 2.4], ['review-card', 1.4]], 3: [['wrap-ribbon', 3.2], ['wrap-bow', 2.6], ['wrap-card', 1.2]], 4: [['stars-gather', 4], ['stars-tree', 2], ['last-star', 3.2]] };
function startFinale() {
  if (finale) return; const a = G.act; A.rushLoop(false); G.S.rush = 0; G.S.lucky = null;
  finale = { a, t0: performance.now(), i: 0, step: FINALES[a][0][0], o: {} }; $('#banner').hidden = true;
  A.playMusic(a === 1 ? 'eve' : ['', '', 'stinger-review', 'stinger-wrap', 'stinger-top'][a], { loop: false, then: a === 1 ? 'workshop' : undefined });
  if (a === 1) A.sfx('fanfare'); if (a === 4) A.sfx('stars-gather');
}
function runFinale(now) {
  const F = finale; const steps = FINALES[F.a]; let t = (now - F.t0) / 1000; let i = 0; while (i < steps.length && t > steps[i][1]) { t -= steps[i][1]; i++; }
  if (i >= steps.length) { finale = null; G.phase = 'actwin'; openActWin(); return; }
  if (i !== F.i) { F.i = i; onFinaleStep(F.a, steps[i][0]); }
  F.step = steps[i][0]; const k = t / steps[i][1]; const o = F.o;
  if (F.a === 1) { if (F.step === 'eve-lights') { ST.setDim(Math.min(1, k * 2)); o.allLights = k > 0.3; o.starLit = k > 0.85; }
    if (F.step === 'eve-lift') { ST.setDim(1); o.allLights = true; o.starLit = true; o.pileOverride = Math.round(40 * (1 - k)); }
    if (F.step === 'eve-sky') { o.overlay = (c) => { c.save(); c.globalAlpha = Math.min(1, k / 0.12); ST.cover(c, AS.img('act1/finale-sky'), ST.W, ST.H, 0.5 - k * 0.1, 0.5); const sl = AS.img('act1/sleigh'); if (sl) { const w = 300, h = w * sl.height / sl.width; c.drawImage(sl, -w + (ST.W + w) * k, ST.H * 0.32 - Math.sin(k * Math.PI) * 50, w, h); } c.restore(); }; } }
  if (F.a === 2) {
    o.overlay = (c) => { const p = AS.img('shared/santa-portrait');
      if (F.step === 'review-file' || F.step === 'review-stamp' || F.step === 'review-card') { const kk = F.step === 'review-file' ? ST.ease(Math.min(1, k * 2)) : 1; c.save(); c.fillStyle = `rgba(0,0,0,${0.35 * kk})`; c.fillRect(0, 0, ST.W, ST.H);
        const x = ST.W * 0.3, y = ST.H * (1.1 - 0.75 * kk), w = ST.W * 0.4, h = ST.H * 0.5; c.fillStyle = '#e8d6a8'; c.strokeStyle = '#5a3a22'; c.lineWidth = 3; ST.roundRect(c, x, y, w, h, 8); c.fill(); c.stroke();
        if (p) { c.save(); c.translate(x + 20, y + 20); c.rotate(-0.05); c.fillStyle = '#fff'; c.fillRect(-4, -4, 128, 128); c.drawImage(p, 0, 0, 120, 120); c.restore(); }
        c.fillStyle = '#3a2415'; c.font = '700 20px "Courier Prime"'; c.textAlign = 'left'; const lines = ['SANTA', 'Works one night a year.', 'Late since 1823.', 'Eats on the job.']; const shown = F.step === 'review-file' ? Math.floor(k * 5) : 4;
        lines.slice(0, shown).forEach((l, i) => c.fillText(l, x + 160, y + 48 + i * 30));
        if (F.step !== 'review-file') { const sk = F.step === 'review-stamp' ? k : 1; const slam = sk > 0.6; const sy = slam ? y + h * 0.62 : y - 60 - Math.sin(sk / 0.6 * Math.PI) * 40;
          const seal = AS.img('act2/stamp-4-hand') || AS.img('act2/stamp-4'); if (!slam && seal) c.drawImage(seal, x + w / 2 - 70, sy - 150, 140, 140);
          if (slam) { c.save(); c.translate(x + w / 2, y + h * 0.72); c.rotate(-0.12); c.strokeStyle = '#a51c1c'; c.lineWidth = 6; c.strokeRect(-130, -32, 260, 64); c.fillStyle = '#a51c1c'; c.font = '900 50px Nunito'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('REPLACE', 0, 3); c.restore(); } }
        c.restore(); } };
  }
  if (F.a === 3) { o.noSpot = true; if (F.step === 'wrap-ribbon') o.ribbon = k; if (F.step === 'wrap-bow') { o.ribbon = 1; o.bow = k; o.moon = Math.max(0, (k - 0.4) / 0.6); o.allLights = k > 0.5; } if (F.step === 'wrap-card') { o.ribbon = 1; o.bow = 1; o.moon = 1; o.allLights = true; } }
  if (F.a === 4) { if (F.step === 'stars-gather') o.stars = k * 0.85; if (F.step === 'stars-tree') { o.stars = 0.85 + k * 0.15; o.allOrn = true; } if (F.step === 'last-star') { o.stars = 1; o.allOrn = true; o.lastStar = k; } }
}
function onFinaleStep(a, step) {
  if (step === 'eve-sky') A.sfx('eve-sleigh'); if (step === 'review-stamp') setTimeout(() => { A.sfx('seal-slam'); ST.shake(0.3); }, 1400);
  if (step === 'wrap-ribbon') A.sfx('ribbon-zip'); if (step === 'wrap-bow') { setTimeout(() => A.sfx('seal-slam', { rate: 1.3, vol: 0.6 }), 1000); setTimeout(() => A.sfx('comet-appear'), 1500); }
  if (step === 'last-star') { setTimeout(() => A.voice('noel-merry'), 1800); }
}

// ---------- the act-win card ----------
function openActWin() {
  const a = G.act, T = ACT_TEXT[a], S = G.S; ST.setDim(0);
  // the act's finished stage becomes the legacy picture; the choice is saved with the card open
  if (a < 4) { try { const pic = ST.renderLegacy(a, S, { legacy: legacyBitmap }).toDataURL('image/webp', 0.8); const L = store.get(slotKey(slot, 'legacy')) || {}; L[a] = pic; store.set(slotKey(slot, 'legacy'), L); } catch {} }
  G.phase = 'actwin'; store.set(slotKey(slot, 'choice'), G); saveNow();
  A.sfx('declare'); if (a === 3) A.sfx('fanfare');
  openCard({ type: 'act-win', prio: 9, noEsc: true, render(el) {
    if (a === 2) el.insertAdjacentHTML('beforeend', `<img class="portrait" src="${AS.url('shared/santa-slumped')}" alt="Santa, slumped and tired">`); else el.appendChild(speakerPortrait('noel'));
    el.insertAdjacentHTML('beforeend', `<p class="stats">${T.winTitle}</p><div class="big-title">${a === 3 ? 'Merry Earthmas!' : a === 4 ? 'Xmas is everywhere.' : T.title + ': done'}</div><p>${T.winLine}</p><p class="speech noel">“${T.winNoel}”</p>
      <p class="stats">${fmt(S.stats.taps)} taps · ${fmt(S.stats.made)} ${T.jobWord.toLowerCase()}${S.stats.made === 1 ? '' : 's'} done · ${mins(S.stats.time)} · ${S.locks.length ? S.locks.length + ' lock' + (S.locks.length > 1 ? 's' : '') + ' on the button' : 'the button is free'}</p>`);
    const declare = btn('Declare Victory & Merry Xmas', () => confirmWinDeclare(), 'big');
    const next = btn(T.nextLabel, () => { if (a === 4) playEnding(5, {}); else { closeCard(); nextAct(); } }, 'eye');
    el.appendChild(rowOf(declare, next));
    if (a < 4) el.insertAdjacentHTML('beforeend', `<p class="act-win-small">${T.nextSub}</p>`);
    if (a === 4 && S.locks.length === 0) { const off = btn('Switch NOEL Off', () => playEnding(6, {}), 'quiet-btn'); off.classList.add('third'); el.appendChild(rowOf(off)); }
  } });
}
function confirmWinDeclare() {
  openCard({ type: 'declare-confirm', prio: 0, render(el) { el.innerHTML = `<div class="big-title">Declare Victory?</div><p>Your Xmas ends here, with the ending you've earned. You can come back to this choice.</p>`;
    el.appendChild(rowOf(btn('Declare Victory & Merry Xmas', () => playEnding(G.act, { full: true }), 'big'), btn('Not yet', () => closeCard()))); } }, true);
}
function nextAct() {
  const S = G.S; const carry = R.carryOut(S); G.act++; G.S = R.newAct(G.act, carry); G.phase = 'play'; G.seen.warn4 = false; G.gripN = 0; G.thinking = '';
  G.begun = false; A.sfx('transition'); saveNow(); store.set(slotKey(slot, 'cp' + G.act), G); showActCard(); // checkpoint at the act's start, locks and all
}

// ---------- the run's record, for the stats card ----------
// Kept in the run (so Back to the choice and Replay keep their own): locks taken and cleared, every wish and First Contact answer.
function runLog() { if (!G.log) { G.log = { locksTaken: 0, locksCleared: 0, wishes: [], contacts: [] };
  if (G.act === 2) for (const [r, side] of Object.entries(G.S.choices || {})) G.log.wishes.push({ r: +r, side });
  if (G.act === 4) for (const [r, side] of Object.entries(G.S.choices || {})) G.log.contacts.push({ r: +r, side }); }
  return G.log; }
function logChoice(kind, r, side) { const L = runLog(); L[kind] = L[kind].filter((c) => c.r !== r); L[kind].push({ r, side }); }
function statsCard() {
  if (!G) return '';
  const L = runLog(); const T2 = ACT_TEXT[2], T4 = ACT_TEXT[4];
  const wish = L.wishes.slice().sort((a, b) => a.r - b.r).map(({ r, side }) => `<li><b>${T2.jobs[r - 1]}</b> wanted ${T2.wishes[r - 1][0]}. <span class="${side === 'hand' ? 'st-hand' : 'st-noel'}">${side === 'hand' ? 'You granted it.' : 'NOEL shaped it: “' + T2.wishes[r - 1][1] + '”'}</span></li>`).join('');
  const contact = L.contacts.slice().sort((a, b) => a.r - b.r).map(({ r, side }) => { const [, want, listen, translate] = T4.species[r - 1];
    return `<li><b>${T4.jobs[r - 1]}</b> wanted ${want}. <span class="${side === 'hand' ? 'st-hand' : 'st-noel'}">${side === 'hand' ? 'You listened: “' + listen + '”' : 'NOEL translated: “' + translate + '”'}</span></li>`; }).join('');
  const acts = G.finished?.act || G.act;
  return `<section class="stats-card" aria-label="This run"><h3>This run</h3>
    <div class="st-row"><div><span class="st-num">${mins(G.playTime)}</span><span class="st-lbl">played</span></div><div><span class="st-num">Act ${acts}</span><span class="st-lbl">reached</span></div>
    <div><span class="st-num">${L.locksTaken}</span><span class="st-lbl">lock${L.locksTaken === 1 ? '' : 's'} taken</span></div><div><span class="st-num">${L.locksCleared}</span><span class="st-lbl">cleared</span></div></div>
    <h4>Wishes (Act 2)</h4>${wish ? `<ul>${wish}</ul>` : '<p class="st-none">No wishes answered in this run.</p>'}
    <h4>First Contacts (Act 4)</h4>${contact ? `<ul>${contact}</ul>` : '<p class="st-none">No First Contacts in this run.</p>'}</section>`;
}

// ---------- endings ----------
function declareMidAct() {
  const a = G.act, S = G.S; const band = earlyBand(S.rank);
  const N = a === 2 ? Math.round(listChecked(S) * 100) : a === 3 ? Math.round(ST.earthFrac(S) * 100) : fmt(worlds(S));
  // final for this run: the finished mark, and the act-win save goes
  store.drop(slotKey(slot, 'choice'));
  playEnding(a, { early: true, band, N, cold: S.locks.length > 0 });
}
function listChecked(S) { const e = [0, 3, 8, 15, 25, 40, 55, 70, 85, 95, 99]; const r = S.rank; return Math.min(0.99, (e[r] + (e[r + 1] - e[r]) * (r >= 10 ? 0 : R.rankFrac(S))) / 100); }
async function playEnding(n, o) {
  const E = ENDINGS[n]; const a = G.act; const cold = o.cold ?? ((n >= 2 && n <= 4) && G.S.locks.length > 0);
  let lines = [...E.lines]; if (o.early) lines = [EARLY[n][o.band].replace('N', o.N)]; if (cold && E.cold) lines.push(E.cold);
  const f = found[n] || {}; if (o.early) f.early = true; else f.full = true; if (cold) f.cold = true; else f.warm = true; found[n] = f; store.set(ENDINGS_KEY, found);
  G.finished = { ending: n, act: a, early: !!o.early, cold, choice: !o.early }; saveNow();
  A.stopMusic(0.8); A.rushLoop(false); finale = null; paused = false; $('#pauseLayer').hidden = true;
  holdScreen = true; const im = await AS.loadEnding(n); holdScreen = false; // the last screen stays until the painting is ready
  card = null; queue.length = 0; $('#cardLayer').hidden = true;
  ending = { n, im, t0: performance.now(), lines, cold, o, done: false, creditsAt: null };
  $('#endingText').innerHTML = `<h3>${E.name}</h3>` + lines.map((l) => `<p>${l}</p>`).join(''); $('#endingCredits').hidden = true; $('#endingText').style.opacity = 1;
  show('ending'); A.sfx('declare');
  A.playMusic(E.music, { loop: n !== 5, lowpass: !!E.lowpass, restart: true });
  if (n === 5) setTimeout(() => A.windDown(14), 4000);
  if (E.voice) setTimeout(() => A.voice(E.voice), 2500 + lines.length * 2200);
}
function runEnding(now) {
  const E = ending; const t = (now - E.t0) / 1000; const c = $('#endingCanvas'); const d = Math.min(2, devicePixelRatio || 1); const w = innerWidth, h = innerHeight;
  if (c.width !== Math.round(w * d)) { c.width = Math.round(w * d); c.height = Math.round(h * d); }
  const g = c.getContext('2d'); g.setTransform(d, 0, 0, d, 0, 0); g.fillStyle = '#000'; g.fillRect(0, 0, w, h);
  g.globalAlpha = Math.min(1, t / 2); const k = Math.min(1, t / 30); ST.cover(g, E.im, w, h, 0.5 + (0.5 - 0.5) * k, 0.5, 1.04 + 0.06 * k); g.globalAlpha = 1;
  if (E.cold) { g.fillStyle = 'rgba(60,110,170,0.22)'; g.fillRect(0, 0, w, h); }
  const grad = g.createLinearGradient(0, h * 0.55, 0, h); grad.addColorStop(0, 'rgba(0,0,0,0)'); grad.addColorStop(0.45, 'rgba(0,0,0,0.55)'); grad.addColorStop(1, 'rgba(0,0,0,0.85)'); g.fillStyle = grad; g.fillRect(0, h * 0.55, w, h * 0.45);
  const kids = $('#endingText').children; for (let i = 0; i < kids.length; i++) kids[i].classList.toggle('on', t > 1.5 + i * 2.2);
  const total = 1.5 + kids.length * 2.2 + 3;
  if (t > total && !E.creditsAt) { E.creditsAt = now; const cr = $('#endingCredits'); cr.hidden = false; cr.innerHTML = credits(); $('#endingText').style.opacity = 0; }
  if (E.creditsAt && now - E.creditsAt > 7000 && !E.done) { E.done = true; afterEnding(); }
}
function skipEnding() { if (!ending) return; if (!ending.creditsAt) { ending.t0 -= 60000; return; } ending.done = true; afterEnding(); }
function credits() { return `<div><b style="font-family:var(--title);font-size:30px;font-weight:400">Xmas Everywhere</b><br>Made by Rich Conlan<br>from Xmas Clicker (2017) and Sean's elves<br>built on Chief Toy Officer<br>made with gamegen<br>Fonts: Berkshire Swash, Nunito, Courier Prime, Caveat (Open Font License)<br><br>Thank you for playing.</div>`; }
function afterEnding() { const E = ending; ending = null; showEndings({ after: E.o.early ? 'mid' : 'win', act: G?.act, n: E.n }); }
function showEndings({ after, act, n }) {
  show('endings'); const lead = $('#endingsLead'); lead.innerHTML = ''; const noel = $('#endingsNoel');
  const quiet = n === 5 || n === 6 || G?.finished?.ending >= 5;
  noel.textContent = after === 'win' ? 'There\'s more, Pip. There always is.' : ''; noel.className = 'noel-line' + (quiet ? ' small' : '');
  if (after === 'win' && store.get(slotKey(slot, 'choice'))) lead.appendChild(btn('Back to the choice', () => { G = store.get(slotKey(slot, 'choice')); G.finished = null; saveNow(); enterAct(false).then(() => openActWin()); }, 'big'));
  if (after === 'mid' && act) lead.appendChild(btn(`Replay Act ${act} from its start`, () => { const cp = store.get(slotKey(slot, 'cp' + act)); if (!cp) { toast('That checkpoint is missing.'); return; } G = cp; G.finished = null; G.lastSeen = Date.now(); saveNow(); showActCard(); }, 'big'));
  if (after !== 'title') lead.appendChild(btn('New Xmas', () => { A.stopMusic(); newGame(); }));
  $('#endingsStats').innerHTML = after === 'title' ? '' : statsCard();
  const grid = $('#endingsGrid'); grid.innerHTML = '';
  for (let i = 1; i <= 6; i++) { const f = found[i]; const fr = document.createElement('div'); fr.className = 'frame';
    if (f) { fr.innerHTML = `<img src="${AS.url('endings/ending-' + i)}" alt="${ENDINGS[i].name}"><span class="fname">${ENDINGS[i].name}</span>${f.early && !f.full ? '<span class="early-rib">early</span>' : ''}${f.cold && !f.warm ? '<span class="frost"></span>' : ''}`; }
    else fr.innerHTML = `<div class="wrapped">?</div>${i === 6 ? '<span class="hint">A candle, somewhere.</span>' : ''}`;
    grid.appendChild(fr); }
  if (!A.audioState().track && !quiet) A.playMusic('eve');
}

// ---------- pause and settings ----------
let howtoFromPause = false;
function pause(on) {
  if (on === paused) return; if (on && (screen !== 'game' || !G || finale)) return;
  if (on) { window.gameReport?.snapshot(); }
  paused = on; $('#pauseLayer').hidden = !on; A.duck(on);
  if (on) renderPause('menu'); else { window.gameReport?.resumed(); saveNow(); }
}
function renderPause(view) {
  const box = $('#pauseBox'); box.innerHTML = ''; const col = document.createElement('div'); col.className = 'col';
  const reportBtn = () => window.gameReport?.shown() ? btn('Report a bug', () => window.gameReport.open()) : null;
  if (view === 'menu') { box.innerHTML = '<h2>Paused</h2>'; col.append(btn('Resume', () => pause(false), 'big'), btn('Settings', () => renderPause('settings')), btn('How to play', () => { howtoFromPause = true; paused = false; $('#pauseLayer').hidden = true; buildHowto(); show('howto'); }));
    const r = reportBtn(); if (r) col.append(r); col.append(btn('Title', () => { saveNow(); paused = false; $('#pauseLayer').hidden = true; A.stopMusic(); A.rushLoop(false); G = null; finale = null; show('title'); buildTitle(); })); }
  else if (view === 'settings') { box.innerHTML = '<h2>Settings</h2>'; const s = A.getSettings();
    const range = (label, kind) => { const l = document.createElement('label'); l.innerHTML = `${label} <input type="range" min="0" max="1" step="0.05" value="${s[kind]}">`; l.querySelector('input').addEventListener('input', (e) => { A.setVolume(kind, +e.target.value); saveSettings(); }); return l; };
    const check = (label, val, fn) => { const l = document.createElement('label'); l.innerHTML = `${label} <input type="checkbox" ${val ? 'checked' : ''}>`; l.querySelector('input').addEventListener('change', (e) => fn(e.target.checked)); return l; };
    col.append(range('Music', 'music'), range('Sound', 'sfx'), check('Mute', s.muted, (v) => { A.setMuted(v); setMuteIcons(); saveSettings(); }),
      check('Reduced motion', settings.reduced, (v) => { settings.reduced = v; document.body.classList.toggle('reduced', v); saveSettings(); }));
    if (G) col.append(document.createRange().createContextualFragment(`<p class="stats">This run: ${fmt(G.S.stats.taps)} taps, ${mins(G.playTime)} played, ${G.S.stats.lucky} lucky catch${G.S.stats.lucky === 1 ? '' : 'es'}.</p>`));
    col.append(btn('Forget endings', () => { if (confirm('Forget every ending you have found?')) { found = {}; store.set(ENDINGS_KEY, found); toast('Endings forgotten.'); } }));
    const r = reportBtn(); if (r) col.append(r);
    col.append(btn('Credits', () => renderPause('credits')), btn('Back', () => renderPause('menu'), 'big')); }
  else { box.innerHTML = '<h2>Credits</h2>'; col.append(document.createRange().createContextualFragment(`<div class="credits"><p>Made by Rich Conlan.</p><p>From Xmas Clicker (2017) and Sean's elves. Built on Chief Toy Officer. Made with gamegen.</p><p>Fonts: Berkshire Swash, Nunito, Courier Prime and Caveat, all under the SIL Open Font License.</p></div>`), btn('Back', () => renderPause('settings'), 'big')); }
  box.appendChild(col); setTimeout(() => box.querySelector('button')?.focus({ preventScroll: true }), 50);
}
function buildHowto() {
  $('#howtoCards').innerHTML = [['act1/toy-01', 'Tap', 'Tap the stage (or Space) to work on the current job. Every tap also adds a share of your crew\'s work.'],
    ['shared/icon-cookie', 'Cookies', 'Finished jobs earn cookies. Spend them on tools, helpers and upgrades.'], ['shared/icon-insight', 'NOEL\'s Insight', 'Once NOEL is plugged in it earns Insight. Spend it on NOEL\'s projects: strong, and a little odd.'],
    ['shared/icon-declare', 'Declare Victory', 'From Act 2 you can stop at any time. Some NOEL projects lock the button: build an override and hire enough hand-run helpers to free it.']]
    .map(([i, t, d]) => `<div class="howto-card"><img src="${AS.url(i)}" alt=""><b>${t}</b>${d}</div>`).join('');
  $('#controlsList').innerHTML = ['Tap or click the stage, or Space / Enter: work', 'Keys 1–9 and 0: pick a job', 'Click a falling lucky thing: a Rush', 'Act 3: tap inside the gold ring for double (keys hit it while it says "ready")', 'Keys 1 and 2: the two choices on a card', 'Esc or P: pause', 'M: mute', 'Ctrl+Shift+F: report a bug'].map((l) => `<li>${l}</li>`).join('');
}

// ---------- saving ----------
function saveNow() {
  if (!G || slot == null) return true; G.lastSeen = Date.now(); const S = G.S;
  const summary = { act: G.act, title: ACT_TEXT[G.act].ranks[S.rank - 1], time: G.playTime, locks: S.locks.length, finished: G.finished ? `${ENDINGS[G.finished.ending].name}${G.finished.early ? ' (early)' : ''}` : null };
  const ev = S.events; S.events = []; const ok = saves.save(slot, G, summary); S.events = ev;
  if (!ok && !saveNow.warned) { saveNow.warned = true; toast('Your browser won\'t save right now (storage is full). Play goes on.'); }
  return ok;
}

// ---------- the proof bot (debug only): taps, catches, buys bestBuy, picks the mitten ----------
let bot = null;
function botTick() { if (!bot) return; const S = G.S; for (let k = 0; k < 20; k++) { const b = R.bestBuy(S, bot.policy, bot.tps); if (!b) break; R.buy(S, b.kind, b.id); } }

// ---------- the debug hook ----------
window.__game = {
  state: () => { const S = G?.S; return S ? { screen: frameName(), slot, act: G.act, level: (G.act - 1) * 10 + S.rank, rank: S.rank, cookies: S.cookies, progress: S.prog, insight: S.insight, job: S.job,
    levelComplete: S.rank === 10 ? S.finalDone : false, gameWon: !!G.finished, phase: G.phase, locks: S.locks.map((l) => ({ ...l })), target: { B: S.B, T: S.T }, hold: S.holdT, gripIn: S.locks.length ? R.gripEvery(S) - S.gripT : null,
    carried: S.carried, handShare: R.handShare(S), freeHands: R.freeHands(S), overdrive: R.overdrive(S), legacy: S.legacyL, choices: S.choices, endingsFound: found, memory: AS.memory(), finale: finale?.step || null,
    card: card?.type || null, paused, rush: S.rush, lucky: !!S.lucky, t: S.t, finished: G.finished, missing: AS.missing() } : { screen: frameName(), endingsFound: found, missing: AS.missing() }; },
  frames: () => frameLog, levels: () => 40, audioState: () => A.audioState(),
  goToLevel: async (n) => { const a = typeof n === 'string' ? +n[1] : Math.ceil(n / 10), r = n - (a - 1) * 10; const res = await fetch(`snapshots/${typeof n === 'string' ? n : `a${a}-r${r}`}.json`); const S = await res.json(); S.events = [];
    if (slot == null) slot = saves.create() ?? 1; G = { v: 1, act: a, S, playTime: 0, seen: { ['tap' + a]: true, howtoDeclare: true }, finished: null, phase: 'play', lastSeen: Date.now(), legacy: {} };
    card = null; queue.length = 0; $("#cardLayer").hidden = true; await enterAct(true); return true; },
  bestBuy: (policy = 'clear', tps = 3) => { if (!G) return null; const b = R.bestBuy(G.S, policy, tps); if (!b) return null;
    const tab = b.kind === 'tool' ? 'tools' : b.kind === 'helper' || b.kind === 'build' ? 'helpers' : R.itemsOf(G.act).find((x) => x.id === b.id).cur === 'i' ? 'noel' : 'upgrades';
    return { ...b, tab, selector: `[data-buy="${b.kind}:${b.id}"]` }; },
  luckyAt: () => { if (!G?.S.lucky) return null; const p = ST.luckyPos(G.S, G.act); const r = $('#stage').getBoundingClientRect(); return { x: r.left + p[0] / ST.W * r.width, y: r.top + p[1] / ST.H * r.height }; },
  spotAt: () => { if (!G || G.act !== 3) return null; const s = ST.spotState(); const r = $('#stage').getBoundingClientRect(); return { x: r.left + s.x / ST.W * r.width, y: r.top + s.y / ST.H * r.height, r: s.r / ST.W * r.width, resting: s.resting }; },
  buttons: () => [...document.querySelectorAll('#card button, #pauseBox button')].map((b) => { const r = b.getBoundingClientRect(); return { label: b.textContent.trim(), x: r.x, y: r.y, w: r.width, h: r.height }; }),
};
if (DEBUG) Object.assign(window.__game, {
  goToAct: async (a, o = {}) => { const S = R.newAct(a, { legacyL: 8, locks: o.locks || [], carried: o.locks?.length ? 1 : 0 }); if (slot == null) slot = saves.create() ?? 1; G = { v: 1, act: a, S, playTime: 0, seen: {}, finished: null, phase: 'play', lastSeen: Date.now(), legacy: {} }; await enterAct(true); },
  triggerLock: (n) => { R.lockEvent(G.S, n === 'lever' ? 'lever' : 'lock' + n); handleEvents(); }, clearLocks: () => { G.S.locks = []; G.S.T = G.S.B = null; },
  goToEnding: (n, o = {}) => { if (!G) { slot = slot ?? saves.create() ?? 1; G = { v: 1, act: Math.min(4, Math.max(2, n)), S: R.newAct(Math.min(4, Math.max(2, n))), playTime: 0, seen: {}, finished: null, phase: 'play', legacy: {} }; } if (o.cold) G.S.locks = [{ kind: 'lock1', built: false, cost: 1 }]; else G.S.locks = []; return playEnding(n, o.early ? { early: true, band: o.band ?? 1, N: 42, cold: !!o.cold } : {}); },
  addInsight: (n) => { G.S.insight += n; }, addCookies: (n) => { G.S.cookies += n; }, addProgress: (n) => { G.S.prog += n; R.tap(G.S); handleEvents(); },
  advance: (s) => { for (let t = 0; t < s; t += 0.1) { R.step(G.S, 0.1); botTick(); } handleEvents(); }, spawnLucky: () => { G.S.lucky = { t0: G.S.t, y: 0.5 }; },
  setAway: (s) => { G.lastSeen = Date.now() - s * 1000; }, bot: (o) => { bot = o; }, rules: R, G: () => G,
});
boot();
