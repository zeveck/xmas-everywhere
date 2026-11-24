// The pure engine for every act: economy, taps, jobs, ranks, NOEL projects, choices, and every row of
// GAME_DESIGN.md "Lock rules, exactly". No DOM, so node imports it (tools/balance.mjs, tools/snapshots.mjs).
import { ACTS, LOCK, CHOICE, INS_SCALE, THRESHOLDS, TIER, SPOT } from './data.js';

const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const two = (x) => { if (x <= 0) return 0; const e = 10 ** (Math.floor(Math.log10(x)) - 1); return Math.ceil(x / e) * e; };
export const RUSH_S = 20, LUCKY_S = 8;

// Seeded random, kept in the state so runs repeat.
function rnd(S) { let t = (S.seed = (S.seed + 0x6D2B79F5) >>> 0); t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }

export function items(actNo) {
  const A = ACTS[actNo];
  return [...A.UPG.map((u) => ({ id: u[0], cost: u[1], r: u[2], fx: u[3], f: u[4], cur: 'c' })),
    ...A.NOEL.map((u) => ({ id: u[0], cost: u[1] * INS_SCALE[actNo], r: u[2], fx: u[3], f: u[4], cur: 'i', lock: A.LOCKS[u[0]] || 0 }))];
}
const ITEMS = { 1: items(1), 2: items(2), 3: items(3), 4: items(4) };
export const itemsOf = (a) => ITEMS[a];
export const helperDef = (a, id) => ACTS[a].HELP.find((h) => h[0] === id);
export const twinOf = (a, id) => { const h = helperDef(a, id); return ACTS[a].HELP.find((x) => x[5] === h[5] && x[4] !== h[4]); };

// carry: { legacyL, locks: [kinds], carried, extra, seed }
export function newAct(actNo, carry = {}) {
  const A = ACTS[actNo];
  const n = Object.fromEntries(A.HELP.map((h) => [h[0], 0]));
  const S = {
    act: actNo, t: 0, cookies: 0, prog: 0, insight: 0, rank: 1, tools: [true, false, false, false], job: 0,
    jp: Array(10).fill(0), made: Array(10).fill(0), n: { ...n }, bought: { ...n }, gripped: { ...n }, own: [], woke: A.NOEL_START,
    handBonus: 0, noelBonus: 0, cookieBonus: 0, progBonus: 0, choices: {},
    rush: 0, lucky: null, nextLucky: null, finalDone: false, finalAt: null, phoneByNoel: false,
    locks: (carry.locks || []).map((k) => ({ kind: k, built: false, cost: null, old: true })),
    carried: carry.carried || 0, extra: carry.extra || 0, ready: !(carry.locks && carry.locks.length), B: null, T: null,
    holdT: 0, gripT: 0, escT: 0, gripCount: 0, lockedTime: 0,
    legacyL: carry.legacyL || 0, seed: (carry.seed ?? 12345 + actNo * 777) >>> 0,
    stats: { taps: 0, made: 0, lucky: 0, time: 0, spot: 0 },
    events: [],
  };
  if (A.CHOICE === 'contact') S.pendingChoice = 1; // species 1 at Begin
  return S;
}

const owns = (S, id) => S.own.includes(id);
export function mul(S, own = S.own) {
  const A = ACTS[S.act];
  const m = { help: {}, helpAll: 1, noelAll: 1, helpHand: 1, tool: 1, cookies: 1, prog: 1, work: 1, work10: 1, auto: 0, nice: A.NICE0 };
  for (const it of ITEMS[S.act]) if (own.includes(it.id)) for (const fx of it.fx) {
    if (fx[0] === 'help') m.help[fx[1]] = (m.help[fx[1]] || 1) * fx[2];
    else if (fx[0] === 'auto') m.auto += fx[1];
    else if (fx[0] === 'nice') m.nice = Math.min(1, m.nice + fx[1]);
    else if (fx[0] !== 'wake') m[fx[0]] *= fx[1];
  }
  m.cookies *= 1 + S.cookieBonus; m.prog *= 1 + S.progBonus; m.helpHand *= 1 + S.handBonus; m.noelAll *= 1 + S.noelBonus;
  return m;
}
export const freeHands = (S) => S.act > 1 && S.locks.length === 0;
export const overdrive = (S) => LOCK.OD_PER * Math.min(LOCK.OD_MAX, S.locks.filter((l) => !l.old).length);
export const toolIdx = (S) => S.tools.lastIndexOf(true);

// Rates. o: { n, own, tool, noOD (away time) }
export function rates(S, o = {}) {
  const A = ACTS[S.act]; const n = o.n || S.n; const own = o.own || S.own; const tool = o.tool ?? toolIdx(S);
  const m = mul(S, own); let hand = 0, noel = 0; const fh = freeHands(S) ? 1 + LOCK.FREE_HAND : 1; const od = o.noOD ? 1 : 1 + overdrive(S);
  const per = {};
  for (const [id, w, , , k] of A.HELP) {
    const x = n[id] * w * (m.help[id] || 1) * m.helpAll * (k === 'hand' ? m.helpHand * fh : m.noelAll * od);
    per[id] = x; if (k === 'hand') hand += x; else noel += x;
  }
  const legacy = S.legacyL * TIER[0][0] * (A.SCALE || 1) * S.rank;
  hand += legacy;
  let held = 0; for (const [id, w] of A.HELP) if (S.gripped[id]) held += S.gripped[id] * twinWork(S, id, m);
  const crew = hand + noel, toolW = A.TOOLS[tool][0] * m.tool;
  const tapOne = toolW + A.CREW_TAP * crew, auto = tapOne * m.auto;
  const j = o.job ?? S.job; const [w, c, p] = A.JOBS[j]; const work = w * m.work * (j === 9 ? m.work10 : 1);
  return { m, crew, hand, noel, legacy, per, toolW, tapOne, auto, work, share: crew + held > 0 ? hand / (crew + held) : 1,
    cpsPassive: (crew + auto) / work * c * m.cookies, cookiesPer: c * m.cookies, progPer: p * m.prog * m.nice };
}
// A gripped helper counts on NOEL's side at its NOEL twin's work.
function twinWork(S, id, m) { const A = ACTS[S.act]; const t = twinOf(S.act, id); return t[1] * (m.help[t[0]] || 1) * m.helpAll * m.noelAll; }
export const handShare = (S) => rates(S).share;
export const price = (S, id) => Math.ceil(helperDef(S.act, id)[2] * 1.15 ** S.bought[id]);
export const nextTool = (S) => { const i = toolIdx(S); return i < 3 ? i + 1 : null; };
export const finalOpen = (S) => S.rank === 10 && !S.finalDone;
export const threshold = (S, r) => THRESHOLDS[S.act][r];

// ---- work -----------------------------------------------------------------------------
// Adds work to the selected job; finishes as many as it covers. capped: helper/auto work on the first final job stops at 90%.
function addWork(S, w, capped) {
  const A = ACTS[S.act]; const R = rates(S); const j = S.job; let done = 0;
  if (capped && j === 9 && !S.finalDone) w = Math.max(0, Math.min(w, A.FINAL_CAP * R.work - S.jp[9]));
  S.jp[j] += w;
  while (S.jp[j] >= R.work) {
    S.jp[j] -= R.work; done++;
    S.cookies += R.cookiesPer; const g = R.progPer; S.prog += g; if (S.woke) S.insight += g * A.INS;
    S.made[j]++; S.stats.made++;
    if (j === 9 && S.rank === 10 && !S.finalDone) { S.finalDone = true; S.finalAt = S.t; S.jp[9] = 0; S.events.push({ type: 'final' }); break; }
  }
  if (done) S.events.push({ type: 'done', job: j, n: done });
  promote(S);
  return done;
}
// A tap: tool part + CREW_TAP × crew; Rush ×5 tool and ×2 crew; spot (Act 3 Cheer Spot) doubles it.
export function tapValue(S, spot = false) {
  const A = ACTS[S.act]; const R = rates(S); const tm = S.rush > 0 ? 5 : 1, hm = S.rush > 0 ? 2 : 1;
  return (R.toolW * tm + A.CREW_TAP * R.crew * hm) * (spot ? 2 : 1);
}
export function tap(S, spot = false) {
  const v = tapValue(S, spot); S.stats.taps++; if (spot) S.stats.spot++;
  addWork(S, v, false); return v;
}

function promote(S) {
  const T = THRESHOLDS[S.act];
  while (S.rank < 10 && S.prog >= T[S.rank]) {
    S.rank++; S.job = S.rank - 1;
    if (S.act === 1 && S.rank === 9 && !S.woke) { S.woke = true; S.wokeSelf = true; }
    if (S.act === 1 && S.rank === 10 && !owns(S, 'noelPhone')) S.phoneByNoel = true;
    if (ACTS[S.act].CHOICE === 'wish' && S.rank >= 2 && S.rank <= 9) S.pendingChoice = S.rank;
    if (ACTS[S.act].CHOICE === 'contact' && S.rank >= 2 && S.rank <= 9) S.pendingChoice = S.rank;
    S.events.push({ type: 'rank', rank: S.rank });
    capT(S, false);
  }
}

// The choice that comes with rank r. side: 'hand' | 'noel'
export function choose(S, r, side) {
  const A = ACTS[S.act]; if (S.choices[r]) return;
  if (A.CHOICE === 'wish') { if (side === 'hand') S.handBonus += CHOICE.GRANT_HAND; else S.noelBonus += CHOICE.SHAPE_NOEL; }
  else if (A.CHOICE === 'contact') { if (side === 'hand') S.cookieBonus += CHOICE.LISTEN_COOKIES; else S.progBonus += CHOICE.TRANSLATE_PROG; }
  S.choices[r] = side; if (S.pendingChoice === r) S.pendingChoice = null;
  if (side === 'noel' && S.locks.length && S.act === 2) {/* a NOEL-run boost without a lock doesn't set B (only Mandatory Merriment does) */}
}

// ---- buying -----------------------------------------------------------------------------
export function canBuy(S, kind, id) {
  const A = ACTS[S.act];
  if (kind === 'tool') { const i = nextTool(S); return i != null && i === id && A.TOOLS[i][2] <= S.rank && S.cookies >= A.TOOLS[i][1]; }
  if (kind === 'helper') { const h = helperDef(S.act, id); return h && h[3] <= S.rank && S.cookies >= price(S, id); }
  if (kind === 'item') { const it = ITEMS[S.act].find((x) => x.id === id); if (!it || owns(S, id) || it.r > S.rank) return false;
    if (it.cur === 'i') return S.woke && S.insight >= it.cost; return S.cookies >= it.cost; }
  if (kind === 'build') { const l = S.locks[id]; return l && S.ready && !l.built && l.cost != null && S.cookies >= l.cost; }
  return false;
}
export function buy(S, kind, id) {
  if (!canBuy(S, kind, id)) return false;
  const A = ACTS[S.act];
  if (kind === 'tool') { S.cookies -= A.TOOLS[id][1]; S.tools[id] = true; }
  else if (kind === 'helper') { S.cookies -= price(S, id); S.n[id]++; S.bought[id]++; }
  else if (kind === 'item') {
    const it = ITEMS[S.act].find((x) => x.id === id);
    if (it.cur === 'i') S.insight -= it.cost; else S.cookies -= it.cost;
    S.own.push(id);
    if (it.fx[0][0] === 'wake') { S.woke = true; S.events.push({ type: 'wake' }); }
    if (it.lock) lockEvent(S, 'lock' + it.lock);
    else if (S.locks.length && it.fx.some((f) => f[0] === 'noelAll')) setTargets(S, 'NOEL boost ' + id);
  } else if (kind === 'build') { const l = S.locks[id]; S.cookies -= l.cost; l.built = true; S.events.push({ type: 'built', kind: l.kind }); capT(S, false); }
  if (kind === 'helper') capT(S, false);
  S.events.push({ type: 'buy', kind, id });
  return true;
}

// ---- locks ------------------------------------------------------------------------------
function hireTo(S, goal, budget = Infinity) {
  const A = ACTS[S.act]; const nn = { ...S.n }, bb = { ...S.bought }; let spent = 0, k = 0;
  while (k++ < 2000) {
    const R = rates(S, { n: nn }); if (R.share >= goal) return { spent, share: R.share, ok: true };
    let best = null;
    for (const [id, w, c0, r, kind] of A.HELP) if (kind === 'hand' && r <= S.rank) { const c = Math.ceil(c0 * 1.15 ** bb[id]); const g = w * (R.m.help[id] || 1) * R.m.helpHand / c; if (!best || g > best[1]) best = [id, g, c]; }
    if (!best || spent + best[2] > budget) return { spent, share: R.share, ok: false };
    spent += best[2]; nn[best[0]]++; bb[best[0]]++;
  }
  return { spent, share: 0, ok: false };
}
// T is set whenever B is set (reset); every later re-check may only lower it.
function capT(S, reset) {
  if (!S.ready || !S.locks.length || S.B == null) return;
  const R = rates(S); const reach = hireTo(S, S.B, LOCK.REACH_S * R.cpsPassive);
  const cand = Math.min(S.B, Math.floor(reach.share * 100 + 1e-9) / 100);
  S.T = (reset || S.T == null) ? cand : Math.min(S.T, cand);
  if (reset && S.T < R.share) S.T = Math.min(S.B, Math.max(S.T, Math.floor(R.share * 100) / 100));
}
export function setTargets(S, why) {
  if (!S.locks.length || !S.ready) return;
  const R = rates(S); S.B = Math.min(0.9, Math.max(clamp(Math.round(R.share * 100) / 100 + LOCK.BUMP, 0.40, 0.70), Math.round(R.share * 100) / 100 + LOCK.MIN_STEP)); capT(S, true);
  for (const l of S.locks) if (l.cost == null) l.cost = two((l.kind === 'lever' ? LOCK.LEVER_COST_S : LOCK.OVR_COST_S) * R.cpsPassive);
  S.events.push({ type: 'targets', why });
}
export function lockEvent(S, kind) {
  if (S.locks.length < 4) {
    S.locks.push({ kind, built: false, cost: null }); S.escT = 0; S.holdT = 0; setTargets(S, 'lock ' + kind);
    S.events.push({ type: 'lock', kind, count: S.locks.length });
  } else {
    S.extra++; if (kind !== 'lever') setTargets(S, 'boost at 4 locks ' + kind);
    S.events.push({ type: 'lock', kind, count: S.locks.length, past4: true });
  }
}
export const gripEvery = (S) => Math.max(LOCK.GRIP_MIN, LOCK.GRIP - LOCK.GRIP_CARRY * S.carried - LOCK.GRIP_EXTRA * S.extra);
export const holdFilling = (S) => S.ready && S.T != null && S.locks.some((l) => l.built) && rates(S).share >= S.T - 1e-9;
function release(S) {
  for (const id in S.gripped) if (S.gripped[id]) { const t = twinOf(S.act, id); S.n[t[0]] += S.gripped[id]; S.gripped[id] = 0; }
}
function gripOne(S) {
  const A = ACTS[S.act]; const R = rates(S);
  const hw = (h) => S.n[h[0]] * h[1] * (R.m.help[h[0]] || 1) * R.m.helpAll * R.m.helpHand;
  const handTot = A.HELP.filter((h) => h[4] === 'hand').reduce((s, h) => s + hw(h), 0);
  const low = A.HELP.filter((h) => h[4] === 'hand' && S.n[h[0]] > 0 && hw(h) >= LOCK.GRIP_MIN_SHARE * handTot).sort((a, b) => a[5] - b[5])[0];
  if (low) { S.n[low[0]]--; S.gripped[low[0]]++; S.gripCount++; S.events.push({ type: 'grip', id: low[0] }); capT(S, false); }
}
function lockTimers(S, dt) {
  if (!S.locks.length) return;
  S.lockedTime += dt; S.escT += dt;
  const filling = holdFilling(S);
  if (!filling) S.gripT += dt;
  if (S.gripT >= gripEvery(S)) { S.gripT = 0; gripOne(S); }
  if (S.escT >= LOCK.ESC) { S.escT = 0; lockEvent(S, 'lever'); }
  if (filling) {
    S.holdT += dt;
    if (S.holdT >= LOCK.HOLD) {
      const before = S.locks.length; S.locks = S.locks.filter((l) => !l.built); S.holdT = 0; if (S.locks.length !== before) S.escT = 0;
      S.events.push({ type: 'cleared', left: S.locks.length });
      if (!S.locks.length) { release(S); S.gripT = 0; S.T = S.B = null; S.carried = 0; S.extra = 0; S.events.push({ type: 'unlock' }); }
    }
  }
}

// ---- one economy update (active time only: the caller skips it while a card or finale is up) ----------
export function step(S, dt) {
  const A = ACTS[S.act];
  if (S.locks.length && !S.ready && S.rank >= 4) { S.ready = true; setTargets(S, 'carried, rank 4'); }
  if (!S.locks.length) S.ready = true;
  // lucky things from rank 4: every 60–120 s, for 8 s
  if (S.rank >= 4) {
    if (S.nextLucky == null) S.nextLucky = S.t + 60 + rnd(S) * 60;
    if (!S.lucky && S.t >= S.nextLucky) { S.lucky = { t0: S.t, y: rnd(S) }; S.events.push({ type: 'lucky' }); }
    if (S.lucky && S.t - S.lucky.t0 > LUCKY_S) { S.lucky = null; S.nextLucky = S.t + 60 + rnd(S) * 60; }
  }
  const R = rates(S); const hm = S.rush > 0 ? 2 : 1;
  if (S.rush > 0) { S.rush -= dt; if (S.rush <= 0) { S.rush = 0; S.events.push({ type: 'rushEnd' }); } }
  const auto = (R.toolW * (S.rush > 0 ? 5 : 1) + A.CREW_TAP * R.crew * hm) * R.m.auto * dt;
  const crew = R.crew * hm * dt;
  addWork(S, crew + auto, true);
  lockTimers(S, dt);
  S.t += dt; S.stats.time += dt;
}
export function catchLucky(S) { if (!S.lucky) return false; S.lucky = null; S.nextLucky = S.t + 60 + rnd(S) * 60; S.rush = RUSH_S; S.stats.lucky++; S.events.push({ type: 'rush' }); return true; }

// ---- away time: under 10 min full speed, then half, up to 4 h; no Overdrive, no lock timers, cheer capped below the rank after next.
export function away(S, seconds) {
  if (seconds <= 1) return null;
  const A = ACTS[S.act]; const secs = Math.min(seconds, 4 * 3600); const speed = secs < 600 ? 1 : 0.5;
  const R = rates(S, { noOD: true }); let work = (R.crew + R.auto) * secs * speed; const j = S.job;
  if (j === 9 && !S.finalDone) work = Math.max(0, Math.min(work, A.FINAL_CAP * R.work - S.jp[9]));
  const total = S.jp[j] + work; const n = Math.floor(total / R.work); S.jp[j] = total - n * R.work;
  const cookies = n * R.cookiesPer; S.cookies += cookies; S.made[j] += n;
  const cap = S.rank + 1 < 10 ? THRESHOLDS[S.act][S.rank + 1] - 1 : Infinity;
  const g = Math.min(n * R.progPer, Math.max(0, cap - S.prog)); S.prog += g; if (S.woke) S.insight += g * A.INS;
  promote(S);
  return { seconds: secs, made: n, job: j, cookies, card: secs >= 600 };
}

// ---- the reference strategy: what to press now. policy 'clear' | 'ignore'. Returns {kind, id} or null.
export function bestBuy(S, policy = 'clear', tps = 3) {
  const A = ACTS[S.act]; const R = rates(S); const its = ITEMS[S.act];
  const cp = A.JOBS[S.job][1] / A.JOBS[S.job][2];
  const val = (r) => (r.tapOne * tps * A.TAP_MUL + r.auto + r.crew) / r.work * (r.cookiesPer + r.progPer * cp);
  // insight first: the cheapest affordable NOEL project
  const io = its.filter((it) => it.cur === 'i' && S.woke && !owns(S, it.id) && it.r <= S.rank && S.insight >= it.cost).sort((a, b) => a.cost - b.cost)[0];
  if (io) return { kind: 'item', id: io.id };
  const clearing = policy === 'clear' && S.locks.length && S.ready;
  if (clearing) {
    const ub = S.locks.findIndex((l) => !l.built);
    if (ub >= 0) return S.cookies >= S.locks[ub].cost ? { kind: 'build', id: ub } : null;
    if (S.T != null && R.share < S.T) {
      let best = null; for (const [id, w, , r, kind] of A.HELP) if (kind === 'hand' && r <= S.rank) { const c = price(S, id); const g = w * (R.m.help[id] || 1) * R.m.helpHand / c; if (!best || g > best[1]) best = [id, g, c]; }
      return best && S.cookies >= best[2] ? { kind: 'helper', id: best[0] } : null;
    }
  }
  const base = val(R); const opts = [];
  const nt = nextTool(S); if (nt != null && A.TOOLS[nt][2] <= S.rank) opts.push([{ kind: 'tool', id: nt }, A.TOOLS[nt][1], val(rates(S, { tool: nt })) - base]);
  for (const [id, , , r] of A.HELP) if (r <= S.rank) opts.push([{ kind: 'helper', id }, price(S, id), val(rates(S, { n: { ...S.n, [id]: S.n[id] + 1 } })) - base]);
  for (const it of its) if (it.cur === 'c' && !owns(S, it.id) && it.r <= S.rank) {
    if (it.fx[0][0] === 'wake') { opts.push([{ kind: 'item', id: it.id }, it.cost, 1e300]); continue; }
    opts.push([{ kind: 'item', id: it.id }, it.cost, val(rates(S, { own: [...S.own, it.id] })) - base]);
  }
  const keepT = clearing && S.T != null;
  const okT = (o) => !keepT || o[0].kind !== 'helper' || helperDef(S.act, o[0].id)[4] === 'hand' || rates(S, { n: { ...S.n, [o[0].id]: S.n[o[0].id] + 1 } }).share >= S.T;
  const co = opts.filter((o) => o[2] > 0 && okT(o)).sort((a, b) => b[2] / b[1] - a[2] / a[1])[0];
  if (co && S.cookies >= co[1]) return co[0];
  return null;
}

// ---- the act's end: what carries on
export function carryOut(S) {
  const share = handShare(S);
  return { legacyL: clamp(Math.round(share * 100 / 5), 4, 16), locks: S.locks.map((l) => l.kind), carried: S.locks.length ? S.carried + 1 : 0, extra: S.locks.length ? S.extra : 0, seed: S.seed };
}
// The flavour counter, by rank and progress within it.
export function rankFrac(S) {
  if (S.rank >= 10) return S.finalDone ? 1 : 0.9 + 0.1 * (S.jp[9] / rates(S, { job: 9 }).work);
  const T = THRESHOLDS[S.act]; const lo = T[S.rank - 1] || 0, hi = T[S.rank]; return clamp((S.prog - lo) / (hi - lo), 0, 1);
}
export { SPOT };
