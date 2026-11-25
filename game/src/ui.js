// The act screen's HTML: top bar, tabs, the shop sections, and helpers for cards and toasts.
// Buttons are built once per act and only updated when their state changes.
import { ACTS, ACT_TEXT, LOCKS_TEXT, INS_SCALE, THRESHOLDS } from './data.js';
import * as R from './rules.js';
import { url, helperFile, upgFile, jobFile, toolFile } from './assets.js';

export const $ = (s) => document.querySelector(s);
export function fmt(n) {
  if (!isFinite(n)) return '∞'; if (n < 1000) return String(Math.floor(n));
  const u = ['K', 'M', 'B', 'T', ' Qa', ' Qi', ' Sx', ' Sp']; let i = -1; while (n >= 1000 && i < u.length - 1) { n /= 1000; i++; }
  let s = n >= 100 ? n.toFixed(0) : n >= 10 ? n.toFixed(1) : n.toFixed(2); if (s.includes('.')) s = s.replace(/\.?0+$/, ''); if (+s >= 1000 && i < u.length - 1) { s = '1'; i++; } return s + u[i];
}
export const fmtPeople = (n) => (n >= 1e9 ? (n / 1e9).toFixed(1).replace(/\.0$/, '') + ' billion' : n >= 1e6 ? (n / 1e6).toFixed(1).replace(/\.0$/, '') + ' million' : Math.round(n).toLocaleString('en-US'));
export const ICON = {
  gear: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.4 13a7.5 7.5 0 0 0 0-2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-1.7-1L15 3.5h-4l-.4 2.5a7 7 0 0 0-1.7 1l-2.4-1-2 3.4L6.6 11a7.5 7.5 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 1.7 1l.4 2.5h4l.4-2.5a7 7 0 0 0 1.7-1l2.4 1 2-3.4zM13 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" transform="translate(-1 0)"/></svg>',
  sound: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
  muted: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
};

let H = null; // handlers from main: { buy(kind,id), pickJob(i), cant(el) , openLockCard(), tab(name) }
let act = 0; const els = {}; const last = new Map();
const TABS = ['jobs', 'tools', 'helpers', 'upgrades', 'noel'];
let curTab = 'jobs';

export function setHandlers(h) { H = h; }
function setIf(key, el, prop, v) { if (last.get(key) === v) return; last.set(key, v); if (prop === 'text') el.textContent = v; else if (prop === 'html') el.innerHTML = v; else if (prop === 'cls') el.className = v; else if (prop === 'hidden') el.hidden = v; else el.style.setProperty(prop, v); }
const mk = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

export function buildAct(a, S) {
  act = a; last.clear(); const A = ACTS[a], T = ACT_TEXT[a];
  document.body.className = document.body.className.replace(/\bact\d\b/g, '') + ' act' + a;
  const panel = $('#panel'), shelf = $('#shelf'); panel.innerHTML = ''; shelf.innerHTML = '';
  // tabs
  const tabInfo = { jobs: [T.jobsTab, url(jobFile(a, 0))], tools: [T.toolsTab, url(toolFile(a, 0))], helpers: ['Helpers', url(helperFile(a, A.HELP[0][0]))],
    upgrades: ['Upgrades', url(upgFile(a, A.UPG[0][0]))], noel: ['NOEL', url('shared/icon-insight')] };
  for (const bar of [$('#tabbar'), $('#shopTabs')]) { bar.innerHTML = '';
    for (const t of TABS) { if (bar.id === 'shopTabs' && t === 'jobs') continue; const b = mk('button', 'tab', `<img src="${tabInfo[t][1]}" alt=""><span>${tabInfo[t][0]}</span><i class="dot"></i>`); b.dataset.tab = t; b.setAttribute('aria-label', tabInfo[t][0]);
      b.addEventListener('click', () => { H.click(); showTab(t); }); bar.appendChild(b); } }
  // sections
  els.sec = {};
  for (const t of TABS) { const s = mk('div', 'sec sec-' + t); s.appendChild(mk('div', 'sec-head', tabInfo[t][0])); els.sec[t] = s; (t === 'jobs' ? shelf : panel).appendChild(s); }
  // jobs
  els.jobs = [];
  for (let i = 0; i < 10; i++) { const b = mk('button', 'item', `<img src="${url(jobFile(a, i))}" alt=""><div class="it-main"><div class="it-name">${T.jobs[i]}</div><div class="it-desc"></div></div><div class="it-side"><span class="tally">0000</span></div><div class="mini-bar"><i></i></div>`);
    b.dataset.buy = 'job:' + i; b.addEventListener('click', () => H.pickJob(i, b)); els.sec.jobs.appendChild(b); els.jobs.push(b); }
  // tools
  els.tools = [];
  for (let i = 0; i < 4; i++) { const [w, c, r] = A.TOOLS[i]; const b = mk('button', 'item', `<img src="${url(toolFile(a, i))}" alt=""><div class="it-main"><div class="it-name">${T.tools[i]}</div><div class="it-desc"><span class="nw">+${fmt(w)} work</span> per tap</div></div><div class="it-side"><div class="it-cost"></div></div>`);
    b.dataset.buy = 'tool:' + i; b.addEventListener('click', () => H.buy('tool', i, b)); els.sec.tools.appendChild(b); els.tools.push(b); }
  // helpers
  els.helpers = {}; els.meter = null;
  if (a > 1) { const m = mk('div', 'meter', '<div class="meter-bar"><i></i><span class="tick" hidden></span></div><div class="meter-line"><span class="meter-ring" hidden></span><span class="ml-text"></span></div>');
    els.sec.helpers.appendChild(m); els.meter = m; els.locksBox = mk('div', 'lock-builds'); els.sec.helpers.appendChild(els.locksBox);
    els.legacy = mk('div', 'legacy-row'); els.legacy.hidden = true; els.sec.helpers.appendChild(els.legacy); }
  const helperBtn = (h) => { const [id, w, , r, kind] = h; const nm = T.help[id]; const b = mk('button', 'item ' + (a > 1 ? (kind === 'hand' ? 'hand-side' : 'noel-side') : ''),
      a === 1 ? `<img src="${url(helperFile(a, id))}" alt=""><div class="it-main"><div class="it-name">${nm[0]}</div><div class="it-desc">${nm[1]} · <span class="nw">+${fmt(w)} work/s</span></div></div><div class="it-side"><div class="it-cost"></div><div class="it-count"></div></div>`
      : `<img src="${url(helperFile(a, id))}" alt=""><img class="badge" src="${url(kind === 'hand' ? 'shared/badge-mitten' : 'shared/badge-eye')}" alt=""><div class="it-main"><div class="it-name">${nm[0]}</div><div class="it-row"><span class="it-cost"></span><span class="it-count"></span></div><div class="it-desc"><span class="nw">+${fmt(w)}/s</span></div></div>`);
    b.title = nm[1]; b.dataset.buy = 'helper:' + id; b.addEventListener('click', () => H.buy('helper', id, b)); els.helpers[id] = b; return b; };
  if (a === 1) for (const h of A.HELP) els.sec.helpers.appendChild(helperBtn(h));
  else for (let t = 0; t < 4; t++) { const row = mk('div', 'twins'); const hs = A.HELP.filter((h) => h[5] === t); row.appendChild(helperBtn(hs.find((h) => h[4] === 'hand'))); row.appendChild(helperBtn(hs.find((h) => h[4] === 'noel'))); els.sec.helpers.appendChild(row); }
  // upgrades
  els.items = {};
  for (const it of R.itemsOf(a).filter((x) => x.cur === 'c')) { const nm = T.upg[it.id]; const b = mk('button', 'item', `<img src="${url(upgFile(a, it.id))}" alt=""><div class="it-main"><div class="it-name">${nm[0]}</div><div class="it-desc">${nm[1]}</div></div><div class="it-side"><div class="it-cost"></div></div>`);
    b.dataset.buy = 'item:' + it.id; b.addEventListener('click', () => H.buy('item', it.id, b)); els.sec.upgrades.appendChild(b); els.items[it.id] = b; }
  // NOEL
  const head = mk('div', 'noel-head', `<canvas width="128" height="128"></canvas><div><div class="ins"><img src="${url('shared/icon-insight')}" alt=""><span>0</span></div><div class="thinking"></div></div>`);
  els.sec.noel.appendChild(head); els.noelHead = head; els.noelEye = head.querySelector('canvas');
  els.asleep = mk('p', 'asleep-note', 'NOEL is asleep on the top shelf. Plug it in (Upgrades) and it starts learning: it earns Insight from every bit of Cheer.'); els.sec.noel.appendChild(els.asleep);
  const glyphs = '◆●▲■✦◇○△□✧'; let gi = 0;
  for (const it of R.itemsOf(a).filter((x) => x.cur === 'i')) { const nm = T.noel[it.id];
    const b = mk('button', 'item', `${it.f ? `<span class="ribbon${it.lock ? ' pad' : ''}">NOEL wants this</span>` : ''}<div class="noel-plate">${glyphs[gi++ % glyphs.length]}</div><div class="it-main"><div class="it-name">${nm[0]}</div><div class="it-desc">${nm[1]}</div>${it.lock ? '<div class="warn">Buying this locks your button</div>' : ''}</div><div class="it-side"><div class="it-cost"></div></div>`);
    b.dataset.buy = 'item:' + it.id; b.addEventListener('click', () => H.buy('item', it.id, b)); els.sec.noel.appendChild(b); els.items[it.id] = b; }
  $('#btnDeclare').hidden = a < 2;
  relayout();
  showTab(S.n[A.HELP[0][0]] > 0 ? 'helpers' : 'jobs');
}
export function showTab(t) {
  const desktop = isDesktop(); if (desktop && t === 'jobs') t = 'helpers';
  curTab = t;
  for (const k of TABS) els.sec[k].classList.toggle('on', k === t || (desktop && k === 'jobs'));
  document.querySelectorAll('.tab').forEach((b) => { b.classList.toggle('on', b.dataset.tab === t); if (b.dataset.tab === t) b.classList.remove('dotted'); });
  $('#panel').scrollTop = 0;
}
export const isDesktop = () => matchMedia('(min-width: 900px) and (min-height: 501px)').matches;
export const currentTab = () => curTab;
export function relayout() { if (!els.sec) return; const want = isDesktop() ? $('#shelf') : $('#panel'); if (els.sec.jobs.parentElement !== want) want.prepend(els.sec.jobs); showTab(curTab); }
export function dot(tab, on = true) { if (curTab === tab) return; document.querySelectorAll(`.tab[data-tab="${tab}"]`).forEach((b) => b.classList.toggle('dotted', on)); }
export function glowTab(tab, on) { document.querySelectorAll(`.tab[data-tab="${tab}"]`).forEach((b) => { if (b.classList.contains('glow') !== on) b.classList.toggle('glow', on); }); }

function costHTML(n, ins) { return `<img src="${url(ins ? 'shared/icon-insight' : 'shared/icon-cookie')}" alt="">${fmt(n)}`; }
export function update(S, extra = {}) {
  const A = ACTS[act], T = ACT_TEXT[act]; const RR = R.rates(S);
  // top bar
  setIf('rank', $('#rankTitle'), 'text', T.ranks[S.rank - 1]);
  setIf('cookies', $('#statCookies span'), 'text', fmt(S.cookies));
  setIf('insHidden', $('#statInsight'), 'hidden', !S.woke);
  setIf('ins', $('#statInsight span'), 'text', fmt(S.insight));
  const tapv = R.tapValue(S); setIf('rate', $('#statRate'), 'text', `${fmt(tapv)}/tap · ${fmt(RR.crew + RR.auto)}/s`);
  const thr = THRESHOLDS[act]; let frac, label;
  if (S.rank < 10) { frac = (S.prog - thr[S.rank - 1]) / (thr[S.rank] - thr[S.rank - 1]); label = `<span class="rank-no">Rank ${S.rank} ·&nbsp;</span><span class="pl-word">${T.progress}&nbsp;</span>${fmt(S.prog)}&nbsp;/&nbsp;${fmt(thr[S.rank])}`; }
  else { frac = 1; label = `<span class="rank-no">Rank 10 ·&nbsp;</span>${fmt(S.prog)}<span class="pl-word">&nbsp;${T.progress}</span>`; }
  setIf('progw', $('#progFill'), 'width', Math.max(0, Math.min(100, frac * 100)).toFixed(1) + '%'); setIf('progl', $('#progLabel'), 'html', label);
  // job strip
  setIf('jobname', $('#jobName'), 'text', T.jobs[S.job]);
  const wf = S.jp[S.job] / RR.work; setIf('workw', $('#workFill'), 'width', Math.min(100, wf * 100).toFixed(1) + '%');
  const gold = S.job === 9 && !S.finalDone && S.rank === 10 && wf >= 0.899; setIf('workgold', $('.work-bar'), 'cls', 'work-bar' + (gold ? ' gold' : ''));
  setIf('counter', $('#counter'), 'text', extra.counter || '');
  // jobs
  for (let i = 0; i < 10; i++) { const b = els.jobs[i]; const lockd = i >= S.rank; const st = lockd ? 'locked' : (i === S.job ? 'sel' : '');
    setIf('jc' + i, b, 'cls', 'item ' + st); const made = S.made[i]; setIf('jt' + i, b.querySelector('.tally'), 'text', made > 9999 ? fmt(made) : String(made).padStart(4, '0'));
    setIf('jd' + i, b.querySelector('.it-desc'), 'text', lockd ? `Rank ${i + 1}: ${T.ranks[i]}` : `${fmt(A.JOBS[i][1] * RR.m.cookies)}\u00a0cookies, ${fmt(A.JOBS[i][2] * RR.m.prog * RR.m.nice)}\u00a0${T.progress}`);
    if (!lockd) { const w = R.rates(S, { job: i }).work; setIf('jb' + i, b.querySelector('.mini-bar i'), 'width', Math.min(100, S.jp[i] / w * 100).toFixed(0) + '%'); } }
  // tools
  const owned = R.toolIdx(S);
  for (let i = 0; i < 4; i++) { const b = els.tools[i]; const [, c, r] = A.TOOLS[i]; let st, cost;
    if (S.tools[i]) { st = i === owned ? 'owned sel' : 'owned'; cost = i === owned ? 'In hand' : 'Owned'; }
    else if (r > S.rank) { st = 'locked'; cost = `Rank ${r}`; } else { st = S.cookies >= c && i === R.nextTool(S) ? '' : 'cant'; cost = costHTML(c); }
    setIf('tc' + i, b, 'cls', 'item ' + st); setIf('tk' + i, b.querySelector('.it-cost'), 'html', cost); }
  // helpers
  for (const [id, w, , r, kind] of A.HELP) { const b = els.helpers[id]; const p = R.price(S, id); const lockd = r > S.rank;
    setIf('hc' + id, b, 'cls', 'item ' + (act > 1 ? (kind === 'hand' ? 'hand-side ' : 'noel-side ') : '') + (lockd ? 'locked' : S.cookies >= p ? '' : 'cant') + (extra.glowHelper === id ? ' glowing' : ''));
    setIf('hk' + id, b.querySelector('.it-cost'), 'html', lockd ? `Rank ${r}` : costHTML(p));
    const g = S.gripped[id]; setIf('hn' + id, b.querySelector('.it-count'), 'text', S.n[id] || g ? `${S.n[id] + g}${g ? ` (${g} held)` : ''}` : ''); }
  if (els.meter) updateMeter(S, RR);
  // upgrades and NOEL
  for (const it of R.itemsOf(act)) { const b = els.items[it.id]; if (!b) continue; const own = S.own.includes(it.id); const lockd = it.r > S.rank;
    const can = it.cur === 'i' ? S.woke && S.insight >= it.cost : S.cookies >= it.cost;
    setIf('ic' + it.id, b, 'cls', 'item ' + (own ? 'owned' : lockd ? 'locked' : can ? '' : 'cant'));
    setIf('ik' + it.id, b.querySelector('.it-cost'), 'html', own ? 'Done' : lockd ? `Rank ${it.r}` : (it.cur === 'i' && !S.woke ? 'Asleep' : costHTML(it.cost, it.cur === 'i'))); }
  setIf('asleep', els.asleep, 'hidden', !!S.woke); setIf('insn', els.noelHead.querySelector('.ins span'), 'text', fmt(S.insight));
  setIf('think', els.noelHead.querySelector('.thinking'), 'text', S.woke ? 'NOEL is thinking: ' + (extra.thinking || '…') : '');
  // dots: something new or affordable
  if (act) { const anyHelper = A.HELP.some((h) => h[3] <= S.rank && S.cookies >= R.price(S, h[0])); const anyUp = R.itemsOf(act).some((it) => it.cur === 'c' && !S.own.includes(it.id) && it.r <= S.rank && S.cookies >= it.cost);
    const anyNoel = S.woke && R.itemsOf(act).some((it) => it.cur === 'i' && !S.own.includes(it.id) && it.r <= S.rank && S.insight >= it.cost); const nt = R.nextTool(S); const anyTool = nt != null && A.TOOLS[nt][2] <= S.rank && S.cookies >= A.TOOLS[nt][1];
    for (const [t, v] of [['helpers', anyHelper], ['upgrades', anyUp], ['noel', anyNoel], ['tools', anyTool]]) if (last.get('dot' + t) !== v) { last.set('dot' + t, v); dot(t, v); } }
}
function updateMeter(S, RR) {
  const share = RR.share; const m = els.meter; const locked = S.locks.length > 0;
  setIf('mw', m.querySelector('.meter-bar i'), 'width', (share * 100).toFixed(1) + '%');
  const tick = m.querySelector('.tick'); setIf('mth', tick, 'hidden', !(locked && S.T != null)); if (S.T != null) setIf('mtl', tick, 'left', (S.T * 100).toFixed(1) + '%');
  const filling = R.holdFilling(S); const ring = m.querySelector('.meter-ring'); setIf('mrh', ring, 'hidden', !locked); setIf('mrv', ring, '--hold', (S.holdT / 30).toFixed(3));
  let txt;
  if (!locked) txt = `Hands ${Math.round(share * 100)}% · <span class="warm">free hands +15%</span>`;
  else if (!S.ready || S.T == null) txt = `Hands ${Math.round(share * 100)}% · ${'NOEL is recalculating… (rank 4)'}`;
  else { const od = Math.round(R.overdrive(S) * 100); const built = S.locks.some((l) => l.built);
    txt = `Hands ${Math.floor(share * 100)}% · goal ${Math.round(S.T * 100)}%` + (od ? ` · <span class="od">Overdrive +${od}%</span>` : '') + (filling ? ' · NOEL is checking…' : built ? '' : ' · Build an override to start the check'); }
  setIf('mt', m.querySelector('.ml-text'), 'html', txt); setIf('mcls', m, 'cls', 'meter' + (locked ? '' : ' warmglow'));
  // override / lever rows
  const key = S.locks.map((l) => l.kind + (l.built ? 'b' : '') + (l.cost ?? 'x')).join(',') + '|' + S.ready + '|' + (S.cookies >= Math.min(...S.locks.map((l) => l.cost ?? Infinity)));
  if (last.get('locksKey') !== key) { last.set('locksKey', key); els.locksBox.innerHTML = '';
    S.locks.forEach((l, i) => { const tx = LOCKS_TEXT[l.kind]; const can = S.ready && !l.built && l.cost != null && S.cookies >= l.cost;
      const b = mk('button', 'item ' + (l.built ? 'owned' : can ? '' : 'cant'), `<img src="${url('locks/' + (l.kind === 'lever' ? 'lever' : 'override-' + l.kind.slice(4)))}" alt=""><div class="it-main"><div class="it-name">${tx.build}</div><div class="it-desc">${l.built ? 'Built. Now get enough hands on the wheel.' : tx.buildDesc + ' (does no work; NOEL can\'t reach it)'}</div></div><div class="it-side"><div class="it-cost">${l.built ? 'Built' : !S.ready || l.cost == null ? 'Rank 4' : costHTML(l.cost)}</div></div>`);
      b.dataset.buy = 'build:' + i; b.addEventListener('click', () => H.buy('build', i, b)); els.locksBox.appendChild(b); }); }
  if (S.legacyL) { setIf('lgh', els.legacy, 'hidden', false); setIf('lg', els.legacy, 'html', `${extra_legacyImg ? `<img src="${extra_legacyImg}" alt="">` : ''}<div>The ${['', 'Old Workshop', 'List Room', 'Earthmas Deck'][act - 1]} came with you: worth ${fmt(S.legacyL * S.rank)} of your first helpers, hand-run.</div>`); }
}
let extra_legacyImg = null; export function setLegacyImg(src) { extra_legacyImg = src; last.delete('lg'); }

// ---- toasts ----
export function toast(msg, cls = '') { const t = mk('div', 'toast ' + cls, msg); const box = $('#toasts'); box.appendChild(t); while (box.children.length > 3) box.firstChild.remove(); setTimeout(() => t.remove(), 3200); }
export function itemFlash(el, cls) { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); setTimeout(() => el.classList.remove(cls), 400); }
export { els };
