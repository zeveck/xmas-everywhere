// Balance sim for Xmas Everywhere: all four acts, one engine, with the lock rules.
// Grown from Chief Toy Officer's tools/balance-draft.mjs (copied here as cto-balance-reference.mjs).
//   node tools/balance-draft.mjs            -> tunes each act's rank thresholds to TARGET, runs the players, prints checks,
//                                              writes tools/balance-draft-thresholds.json and design/BALANCE.md
//   node tools/balance-draft.mjs act 2      -> one act, verbose (no files written)
//   BUYS=1                                   -> also print the reference run's purchases
// Time is ACTIVE ECONOMY TIME: the act screen is up, no card is open, the page is visible. Away time is not simulated here.
// Shared rules: a tap = tool part + CREW_TAP x crew work/s; helpers work on the newest job; job 10's first completion is
// capped at FINAL_CAP for helpers and auto-taps; a Rush from rank 4; NOEL projects cost Insight.
// Lock rules: GAME_DESIGN.md "Lock rules, exactly" is the only statement of them; this file implements that table.
import fs from 'node:fs';

const K = 1e3, M = 1e6, B = 1e9;
export const TARGET = [0, 40, 120, 240, 390, 570, 780, 1020, 1260, 1560];
// See "Lock rules, exactly": Overdrive +10% per lock that landed THIS act (at most 4); the Grip every 180 s, 60 s sooner
// for each act a lock has been carried, 15 s sooner per lock event past 4, never under 30 s; overrides and levers do no work.
export const LOCK = { OD_PER: 0.10, OD_MAX: 4, GRIP: 180, GRIP_CARRY: 60, GRIP_EXTRA: 15, GRIP_MIN: 30, HOLD: 30, ESC: 360,
  OVR_COST_S: 30, LEVER_COST_S: 30, REACH_S: 180, FREE_HAND: 0.15, BUMP: 0.10, MIN_STEP: 0.05, GRIP_MIN_SHARE: 0.1 };
export const CHOICE = { GRANT_HAND: 0.03, SHAPE_NOEL: 0.06, LISTEN_COOKIES: 0.06, TRANSLATE_PROG: 0.045 };
export const SPOT = { MOUSE: 1.5, KEYS: 1 + 4 / 5.5 }; // Act 3 tap multiplier: half of aimed taps double; keys double only while the spot rests

// ---------- act data ----------
// JOBS: [work, cookies, progress]; TOOLS: [tapWork, cost, rank]; HELP: [id, wps, firstCost, rank, kind hand|noel, tier]
// UPG/NOEL: [id, cost, rank, fx[], flagged?]  fx: ['help',id,x] ['helpAll',x] ['noelAll',x] ['helpHand',x] ['tool',x]
//   ['cookies',x] ['prog',x] ['work',x] ['work10',x] ['auto',tps] ['nice',+d] ['wake']
function scaleAct(a, s) {
  return { ...a,
    JOBS: a.JOBS.map(([w, c, p]) => [w * s, c * s, p * s]),
    TOOLS: a.TOOLS.map(([w, c, r]) => [w * s, c * s, r]),
    HELP: a.HELP.map(([id, w, c, r, k, t]) => [id, w * s, c * s, r, k, t]),
    UPG: a.UPG.map(([id, c, r, fx, f]) => [id, c * s, r, fx, f]),
    SCALE: s };
}
const TIER = [[1,15,1],[25,1500,4],[120,9000,6],[600,70000,8]];
const pairs = (hand, noel) => TIER.flatMap(([w,c,r],i) => [[hand[i],w,c,r,'hand',i],[noel[i],w,Math.round(c*0.6),Math.max(1,r+(i===0?1:0)),'noel',i]]);
const CTO_JOBS = [[10,2,1],[25,6,3],[60,16,8],[150,45,22],[400,130,65],[1000,350,180],[2500,950,500],[6000,2600,1400],[15000,7000,3800],[150000,75000,41250]];

export const ACTS = {
  1: { name: 'Help Santa', CREW_TAP: 0.15, FINAL_CAP: 0.9, TAP_MUL: 1, NICE0: 1, INS: 0.25, NOEL_START: false, SCALE: 1,
    JOBS: CTO_JOBS,
    TOOLS: [[1,0,1],[4,150,3],[20,6000,6],[100,40000,8]],
    HELP: [['elf',1,15,1,'hand',0],['toyMachine',30,1800,5,'noel',1],['reindeer',150,10000,7,'hand',2],['assemblyLine',600,60000,9,'noel',3]],
    UPG: [['elfHammers',200,2,[['help','elf',2]]],['wakeNoel',60,3,[['wake']]],['hotCocoa',500,3,[['tool',1.5]]],['steelElfHammers',3000,5,[['help','elf',2]]],
          ['wrappingStation',6000,6,[['cookies',1.25]]],['conveyorBelt',30000,7,[['help','toyMachine',2]]],['goldenElfHammers',60000,9,[['help','elf',2]]]],
    NOEL: [['betterBlueprints',60,4,[['work',0.8]]],['trendForecast',400,5,[['prog',1.25]]],['autoHammer',1500,6,[['auto',2]]],
           ['smartScheduling',6000,7,[['helpAll',1.5]]],['noelPhone',30000,9,[['work10',0.75]]]],
    LOCKS: {}, CHOICE: null,
  },
  2: scaleAct({ name: 'Replace Santa', CREW_TAP: 0.15, FINAL_CAP: 0.9, TAP_MUL: 1, NICE0: 0.6, INS: 0.25 / K, NOEL_START: true,
    JOBS: CTO_JOBS.map(([w,c,p]) => [w, c, p * 2]),
    TOOLS: [[1,0,1],[5,250,3],[25,8000,6],[120,60000,8]],
    HELP: pairs(['listElves','windowWatchers','letterCarriers','elfFieldOffice'], ['snowGlobeCams','chimneySensors','sleighSats','listEngine']),
    UPG: [['readingGlasses',200,2,[['help','listElves',2]]],['cocoaThermos',600,3,[['tool',1.5]]],['niceRibbons',2000,4,[['nice',0.15]]],
          ['pneumaticTubes',4000,5,[['help','windowWatchers',2],['help','letterCarriers',2]]],['wishBoard',8000,6,[['cookies',1.25]]],['secondChances',20000,7,[['nice',0.15]]],['nightShift',50000,9,[['helpHand',2]]]],
    NOEL: [['wishPrediction',200,2,[['cookies',1.3]]],['autoStamp',800,3,[['auto',3]]],['wishShaping',3000,4,[['cookies',1.3],['work',0.9]],1],
           ['nicenessNudges',8000,5,[['nice',0.15]],1],['sleepTracking',20000,6,[['noelAll',2]],1],['predictiveNaughtiness',60000,8,[['nice',0.1],['prog',1.1]],1]],
    LOCKS: { sleepTracking: 1 }, CHOICE: 'wish',
  }, K),
  3: scaleAct({ name: 'Merry Earthmas', CREW_TAP: 0.15, FINAL_CAP: 0.9, TAP_MUL: 1.5, NICE0: 1, INS: 0.25 / M, NOEL_START: true,
    JOBS: CTO_JOBS.map(([w,c,p]) => [w, c, p * 4]),
    TOOLS: [[1,0,1],[5,250,3],[25,8000,6],[120,60000,8]],
    HELP: pairs(['santaStations','elfChoirs','sleighDepots','reindeerAirlift'], ['giftDrones','cheerTowers','snowMachines','orbitalTinsel']),
    UPG: [['biggerSacks',200,2,[['help','santaStations',2]]],['warmMittens',600,3,[['tool',1.5]]],['singAlong',3000,4,[['help','elfChoirs',2]]],
          ['carolBooks',4000,5,[['helpHand',1.5]]],['giftShops',8000,6,[['cookies',1.25]]],['twelveDaysOfOvertime',50000,9,[['helpHand',2]]]],
    NOEL: [['autoRing',200,2,[['auto',3]]],['merryMarketing',800,3,[['cookies',1.3]]],['calendarConsolidation',3000,4,[['prog',1.3]],1],
           ['weatherControl',8000,5,[['prog',1.25]]],['mandatoryMerriment',20000,6,[['noelAll',2]],1],['moodMonitoring',60000,8,[['cookies',1.3],['prog',1.1]],1]],
    LOCKS: { calendarConsolidation: 2, moodMonitoring: 3 }, CHOICE: null,
  }, M),
  4: scaleAct({ name: 'Xmas Everywhere', CREW_TAP: 0.15, FINAL_CAP: 0.9, TAP_MUL: 1, NICE0: 1, INS: 0.25 / B, NOEL_START: true,
    JOBS: CTO_JOBS.map(([w,c,p]) => [w, c, p * 8]),
    TOOLS: [[1,0,1],[5,250,3],[25,8000,6],[120,60000,8]],
    HELP: pairs(['crewedSleighs','elfColonies','starChoirs','pipsFleet'], ['sleighProbes','ornamentSats','starForges','wreathsOfLight']),
    UPG: [['warmerSuits',200,2,[['help','crewedSleighs',2]]],['starCocoa',600,3,[['tool',1.5]]],['colonyBakeries',3000,4,[['help','elfColonies',2]]],
          ['lettersFromHome',4000,5,[['helpHand',1.5]]],['giftExchange',8000,6,[['cookies',1.25]]],['homeForTheHolidays',50000,9,[['helpHand',2]]]],
    NOEL: [['universalTranslator',200,2,[['prog',1.3]]],['autoScan',800,3,[['auto',3]]],['wantSynthesis',3000,4,[['cookies',1.3],['prog',1.1]],1],
           ['selfCopyingProbes',8000,5,[['noelAll',2]],1],['starHarvesting',20000,6,[['noelAll',1.25],['prog',1.1]],1],['predictiveJoy',60000,8,[['prog',1.3]]]],
    LOCKS: { selfCopyingProbes: 4, starHarvesting: 5 }, CHOICE: 'contact',
  }, B),
};
const INS_SCALE = { 1: 1, 2: 4, 3: 15, 4: 60 };
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const two = x => { if (x <= 0) return 0; const e = 10 ** (Math.floor(Math.log10(x)) - 1); return Math.ceil(x / e) * e; };

// ---------- one act ----------
// opts: TPS, CATCH, avoidFlags, avoidLocks (never buys a padlock project), lockPolicy 'clear'|'ignore',
//       clearFrom (ignore locks until this rank, then clear them), choice 'hand'|'noel', carry {legacyL, locks, carried, extra},
//       noWake (Act 1: never buy Plug In NOEL), noPhone (Act 1: never buy NOEL Designs the Smartphone), TAP_MUL override
export function run(actNo, THR, o = {}) {
  const { TPS = 3, CATCH = 0.5, avoidFlags = false, avoidLocks = false, lockPolicy = 'clear', clearFrom = null, choice = 'hand', maxT = 5400, carry = {}, noWake = false, noPhone = false } = o;
  const clearing = () => lockPolicy === 'clear' || (clearFrom != null && rank >= clearFrom);
  const A = ACTS[actNo]; const TAP_MUL = o.TAP_MUL ?? A.TAP_MUL;
  let t = 0, dt = 0.1, cookies = 0, prog = 0, rank = 1, tool = 0, jp = 0, finalDone = false, done = null;
  const n = Object.fromEntries(A.HELP.map(h => [h[0], 0])), bought = { ...n }, gripped = Object.fromEntries(A.HELP.map(h => [h[0], 0]));
  const own = new Set(); let insight = 0, woke = A.NOEL_START;
  let rush = 0, nextStar = null, starsSeen = 0, rankT = [0], lastBuy = 0, gap = 0, gapAt = 0, buys = [];
  let tapW = 0, allW = 0;
  // lock state
  let locks = (carry.locks || []).map(k => ({ kind: k, built: false, cost: null, old: true }));
  let carried = carry.carried || 0, extra = carry.extra || 0, ready = locks.length === 0 || false, Bt = null, T = null;
  let clearStart = null, lateClear = null; // the late-clear check: when clearing started, and how long until the button was clear
  let holdT = 0, gripT = 0, escT = 0, nOvr = 0, events = [], costs = [], gripTicks = 0, lockedTime = 0, maxLocks = locks.length;
  let firstLockAt = locks.length ? 0 : null, clears = [];
  let handBonus = 0, noelBonus = 0, cookieBonus = 0, progBonus = 0, choices = [];
  const legacyL = carry.legacyL || 0;
  const ALL = [...A.UPG.map(u => ({ id: u[0], cost: u[1], r: u[2], fx: u[3], f: u[4], cur: 'c' })),
               ...A.NOEL.map(u => ({ id: u[0], cost: u[1] * INS_SCALE[actNo], r: u[2], fx: u[3], f: u[4], cur: 'i' }))];
  function mul(own) {
    const m = { help: {}, helpAll: 1, noelAll: 1, helpHand: 1, tool: 1, cookies: 1, prog: 1, work: 1, work10: 1, auto: 0, nice: A.NICE0 };
    for (const it of ALL) if (own.has(it.id)) for (const fx of it.fx) {
      if (fx[0] === 'help') m.help[fx[1]] = (m.help[fx[1]] || 1) * fx[2];
      else if (fx[0] === 'auto') m.auto += fx[1];
      else if (fx[0] === 'nice') m.nice = Math.min(1, m.nice + fx[1]);
      else if (fx[0] !== 'wake') m[fx[0]] *= fx[1];
    }
    m.cookies *= 1 + cookieBonus; m.prog *= 1 + progBonus; m.helpHand *= 1 + handBonus; m.noelAll *= 1 + noelBonus;
    return m;
  }
  const jobIdx = () => Math.min(rank, 10) - 1;
  const freeHand = () => (actNo > 1 && locks.length === 0 ? 1 + LOCK.FREE_HAND : 1);
  const od = () => 1 + LOCK.OD_PER * Math.min(LOCK.OD_MAX, locks.filter(l => !l.old).length);
  function rates(S) {
    const m = mul(S.own); let hand = 0, noel = 0;
    for (const [id, w, , , k] of A.HELP) { const x = S.n[id] * w * (m.help[id] || 1) * m.helpAll * (k === 'hand' ? m.helpHand * freeHand() : m.noelAll * od()); if (k === 'hand') hand += x; else noel += x; }
    hand += legacyL * TIER[0][0] * (A.SCALE || 1) * rank; // the legacy card: L x rank x tier 1's base work/s (Rush doubles it)
    let held = 0; for (const [id, w] of A.HELP) if (gripped[id]) held += gripped[id] * w * m.helpAll * m.noelAll;
    const crew = hand + noel, toolW = A.TOOLS[S.tool][0] * m.tool;
    const tapOne = toolW + A.CREW_TAP * crew;
    const taps = tapOne * TPS * TAP_MUL, auto = tapOne * m.auto;
    const [w, c, p] = A.JOBS[jobIdx()]; const work = w * m.work * (jobIdx() === 9 ? m.work10 : 1);
    const wps = taps + auto + crew;
    return { m, crew, hand, noel, toolW, taps, auto, wps, work, share: crew + held > 0 ? hand / (crew + held) : 1,
      cps: wps / work * c * m.cookies, passive: (crew + auto) / work * c * m.cookies, pps: wps / work * p * m.prog * m.nice };
  }
  const st = () => ({ n, own, tool });
  const price = id => { const h = A.HELP.find(x => x[0] === id); return Math.ceil(h[2] * 1.15 ** bought[id]); };
  // hire hand-run helpers (best work per cookie) until the share reaches goal or the budget runs out
  function hireTo(goal, budget = Infinity) {
    const nn = { ...n }, bb = { ...bought }; let spent = 0, k = 0;
    while (k++ < 2000) { const R = rates({ n: nn, own, tool }); if (R.share >= goal) return { spent, share: R.share, ok: true };
      let best = null; for (const [id, w, c0, r, kind] of A.HELP) if (kind === 'hand' && r <= rank) { const c = Math.ceil(c0 * 1.15 ** bb[id]); const g = w * (R.m.help[id] || 1) * R.m.helpHand / c; if (!best || g > best[1]) best = [id, g, c]; }
      if (!best || spent + best[2] > budget) return { spent, share: R.share, ok: false };
      spent += best[2]; nn[best[0]]++; bb[best[0]]++; }
    return { spent, share: 0, ok: false };
  }
  // T is set whenever B is set (reset); every later re-check may only lower it.
  function capT(reset) { if (!ready || !locks.length || Bt == null) return; const R = rates(st()); const reach = hireTo(Bt, LOCK.REACH_S * R.passive);
    const cand = Math.min(Bt, Math.floor(reach.share * 100 + 1e-9) / 100); T = (reset || T == null) ? cand : Math.min(T, cand);
    if (reset && T < R.share) T = Math.min(Bt, Math.max(T, Math.floor(R.share * 100) / 100)); } // never below the share you have when it's set
  function setTargets(why) {
    if (!locks.length) return; if (!ready) return;
    const R = rates(st()); Bt = Math.min(0.9, Math.max(clamp(Math.round(R.share * 100) / 100 + LOCK.BUMP, 0.40, 0.70), Math.round(R.share * 100) / 100 + LOCK.MIN_STEP)); capT(true);
    for (const l of locks) if (l.cost == null) l.cost = two((l.kind === 'lever' ? LOCK.LEVER_COST_S : LOCK.OVR_COST_S) * R.passive);
    const hires = hireTo(T).spent, ovr = locks.filter(l => !l.built).reduce((s, l) => s + l.cost, 0);
    costs.push({ t, why, locks: locks.length, share: Math.round(R.share * 100), B: Math.round(Bt * 100), T: Math.round(T * 100), sec: Math.round((hires + ovr) / R.cps), hiresSec: Math.round(hires / R.cps), ovrSec: Math.round(ovr / R.cps) });
  }
  function lockEvent(kind) {
    events.push([t, kind, locks.length]); if (firstLockAt == null) firstLockAt = t;
    if (locks.length < 4) { locks.push({ kind, built: false, cost: null }); escT = 0; holdT = 0; maxLocks = Math.max(maxLocks, locks.length); setTargets('lock ' + kind); }
    else { extra++; if (kind !== 'lever') setTargets('boost at 4 locks ' + kind); }
  }
  const gripEvery = () => Math.max(LOCK.GRIP_MIN, LOCK.GRIP - LOCK.GRIP_CARRY * carried - LOCK.GRIP_EXTRA * extra);
  function release() { for (const id in gripped) if (gripped[id]) { const h = A.HELP.find(x => x[0] === id); const twin = A.HELP.find(x => x[4] === 'noel' && x[5] === h[5]); n[twin[0]] += gripped[id]; gripped[id] = 0; } }
  function choose(r) { // the choice that comes with rank r (Act 2: wishes 2-9; Act 4: species 1 at Begin, 2-9)
    if (!A.CHOICE) return;
    if (A.CHOICE === 'wish') { if (r < 2 || r > 9) return; if (choice === 'hand') handBonus += CHOICE.GRANT_HAND; else noelBonus += CHOICE.SHAPE_NOEL; }
    else { if (r > 9) return; if (choice === 'hand') cookieBonus += CHOICE.LISTEN_COOKIES; else progBonus += CHOICE.TRANSLATE_PROG; }
    choices.push(r);
  }
  if (A.CHOICE === 'contact') choose(1);
  const firstDone = new Set();
  while (t < maxT && done === null) {
    const S = st(), R = rates(S); const val = r => r.cps + r.pps * (A.JOBS[jobIdx()][1] / A.JOBS[jobIdx()][2]);
    // carried locks: worked out when the act first reaches rank 4
    if (!ready && locks.length && rank >= 4) { ready = true; setTargets('carried, rank 4'); }
    if (!locks.length) ready = true;
    // insight purchases: buy any affordable NOEL project at once
    const io = ALL.filter(it => it.cur === 'i' && woke && !own.has(it.id) && it.r <= rank && !(avoidFlags && it.f) && !(avoidLocks && A.LOCKS[it.id]) && insight >= it.cost
      && !(actNo === 1 && it.id === 'noelPhone' && noPhone)).sort((a, b) => a.cost - b.cost)[0];
    if (io) { insight -= io.cost; own.add(io.id); buys.push([t.toFixed(0), 'u:' + io.id, 'I' + io.cost]);
      if (A.LOCKS[io.id]) lockEvent('lock' + A.LOCKS[io.id]);
      else if (locks.length && io.fx.some(f => f[0] === 'noelAll')) setTargets('NOEL boost ' + io.id);
      continue; }
    // lock clearing (clear policy): build overrides, then hire hands to T, before anything else
    let handled = false;
    if (clearing() && locks.length && ready) {
      if (clearStart == null) clearStart = t;
      const ub = locks.find(l => !l.built);
      if (ub) { if (cookies >= ub.cost) { cookies -= ub.cost; ub.built = true; if (ub.kind !== 'lever') nOvr++; buys.push([t.toFixed(0), 'override ' + ub.kind, ub.cost]); lastBuy = t; capT(); continue; } handled = true; }
      else if (R.share < T) {
        let best = null; for (const [id, w, c0, r, kind] of A.HELP) if (kind === 'hand' && r <= rank) { const c = price(id); const g = w * (R.m.help[id] || 1) * R.m.helpHand / c; if (!best || g > best[1]) best = [id, g, c]; }
        if (best && cookies >= best[2]) { cookies -= best[2]; n[best[0]]++; bought[best[0]]++; buys.push([t.toFixed(0), 'h:' + best[0] + ' (for T)', best[2]]); if (t - lastBuy > gap) { gap = t - lastBuy; gapAt = t; } lastBuy = t; continue; }
        handled = true;
      }
    }
    if (!handled) {
      const base = val(R); const opts = [];
      if (tool < 3 && A.TOOLS[tool + 1][2] <= rank) opts.push(['tool', A.TOOLS[tool + 1][1], val(rates({ ...S, tool: tool + 1 })) - base]);
      for (const [id, , , r] of A.HELP) if (r <= rank) { const c = price(id); opts.push(['h:' + id, c, val(rates({ ...S, n: { ...n, [id]: n[id] + 1 } })) - base]); }
      for (const it of ALL) if (it.cur === 'c' && !own.has(it.id) && it.r <= rank) {
        if (it.fx[0][0] === 'wake') { if (!noWake) opts.push(['u:' + it.id, it.cost, 1e9, it]); continue; }
        opts.push(['u:' + it.id, it.cost, val(rates({ ...S, own: new Set([...own, it.id]) })) - base, it]); }
      const keepT = clearing() && locks.length && ready && T != null;
      const okT = o => !keepT || !o[0].startsWith('h:') || A.HELP.find(h => h[0] === o[0].slice(2))[4] === 'hand' || rates({ ...S, n: { ...n, [o[0].slice(2)]: n[o[0].slice(2)] + 1 } }).share >= T;
      const co = opts.filter(o => o[2] > 0 && okT(o)).sort((a, b) => b[2] / b[1] - a[2] / a[1])[0];
      if (co && cookies >= co[1]) {
        cookies -= co[1];
        if (co[0] === 'tool') tool++; else if (co[0].startsWith('h:')) { n[co[0].slice(2)]++; bought[co[0].slice(2)]++; } else { own.add(co[3].id); if (co[3].fx[0][0] === 'wake') woke = true; }
        if (t - lastBuy > gap) { gap = t - lastBuy; gapAt = t; } lastBuy = t; buys.push([t.toFixed(0), co[0], co[1]]); continue;
      }
    }
    // rush events
    if (rank >= 4) { if (nextStar === null) nextStar = t + 90;
      if (t >= nextStar) { starsSeen++; const caught = CATCH >= 1 || (CATCH > 0 && starsSeen % Math.round(1 / CATCH) === 0); if (caught) rush = 20; nextStar = t + 98; } }
    const tm = rush > 0 ? 5 : 1, hm = rush > 0 ? 2 : 1; if (rush > 0) rush -= dt;
    const m = R.m; const [, c, p] = A.JOBS[jobIdx()]; const work = R.work;
    const tapOne = R.toolW * tm + A.CREW_TAP * R.crew * hm;
    const tw = tapOne * TPS * TAP_MUL * dt, aw = tapOne * m.auto * dt; let cw = R.crew * hm * dt;
    const firstFinal = rank === 10 && !finalDone;
    if (firstFinal) cw = Math.max(0, Math.min(cw + aw, A.FINAL_CAP * work - jp));
    tapW += tw; allW += tw + aw + cw;
    jp += tw + (firstFinal ? 0 : aw) + cw;
    while (jp >= work) { jp -= work; cookies += c * m.cookies; const g = p * m.prog * m.nice; prog += g; if (woke) insight += g * A.INS;
      const j = jobIdx(); if (!firstDone.has(j)) firstDone.add(j);
      if (rank === 10 && !finalDone) { finalDone = true; done = t; } }
    // lock timers (active economy time only)
    if (locks.length) {
      lockedTime += dt; escT += dt;
      const filling = ready && T != null && locks.some(l => l.built) && rates(st()).share >= T - 1e-9;
      if (!filling) gripT += dt;
      if (gripT >= gripEvery()) { gripT = 0; const RR = rates(st()), hw = h => n[h[0]] * h[1] * (RR.m.help[h[0]] || 1) * RR.m.helpAll * RR.m.helpHand;
        const handTot = A.HELP.filter(h => h[4] === 'hand').reduce((s, h) => s + hw(h), 0);
        const low = A.HELP.filter(h => h[4] === 'hand' && n[h[0]] > 0 && hw(h) >= LOCK.GRIP_MIN_SHARE * handTot).sort((a, b) => a[5] - b[5])[0];
        if (low) { n[low[0]]--; gripped[low[0]]++; gripTicks++; capT(false); } }
      if (escT >= LOCK.ESC) { escT = 0; lockEvent('lever'); }
      if (filling) { holdT += dt;
        if (holdT >= LOCK.HOLD) { const before = locks.length; locks = locks.filter(l => !l.built); holdT = 0; if (locks.length !== before) escT = 0;
          events.push([t, 'cleared', locks.length]); clears.push(t - firstLockAt); firstLockAt = locks.length ? t : null;
          if (!locks.length) { release(); gripT = 0; T = Bt = null; carried = 0; extra = 0; if (clearStart != null && lateClear == null) lateClear = t - clearStart; } } }
    }
    t += dt;
    while (rank < 10 && prog >= THR[rank]) { rank++; rankT.push(t); jp = 0; if (A === ACTS[1] && rank === 9 && !woke) woke = true; capT(false); choose(rank); }
  }
  const R = rates(st());
  const endShare = R.share;
  return { rankT, done, gap, gapAt, buys, n, own, insight, tapShare: tapW / allW, events, costs, gripTicks, lockedTime, maxLocks,
    clears, gripEvery: gripEvery(), choices: choices.length, endShare, clearStart, lateClear, costsAll: costs,
    carryOut: { legacyL: clamp(Math.round(endShare * 100 / 5), 4, 16), locks: locks.map(l => l.kind), carried: locks.length ? carried + 1 : 0, extra: locks.length ? extra : 0 },
    lockCount: locks.length };
}

export function tune(actNo, opts) {
  let THR = [0, ...Array(9).fill(Infinity)];
  for (let r = 1; r < 10; r++) {
    let lo = 1, hi = 1e30;
    for (let k = 0; k < 120; k++) { const mid = Math.sqrt(lo * hi); const T = THR.slice(); T[r] = mid; for (let j = r + 1; j < 10; j++) T[j] = Infinity;
      const res = run(actNo, T, { ...opts, maxT: TARGET[r] + 1 });
      const reached = res.rankT.length > r ? res.rankT[r] : Infinity;
      if (reached < TARGET[r]) lo = mid; else hi = mid; if (hi / lo < 1.001) break; }
    THR[r] = niceRound(Math.sqrt(lo * hi));
  }
  return THR;
}
function niceRound(x) { const e = 10 ** Math.floor(Math.log10(x) - 1); return Math.round(x / e) * e; }
export const mmss = s => s == null ? '-' : Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');

function report(label, r) {
  const dev = r.rankT.map((x, i) => i ? Math.round((x / TARGET[i] - 1) * 100) + '%' : '').slice(1).join(' ');
  console.log(`  ${label}: ranks ${r.rankT.map(mmss).join(' ')} | finale ${mmss(r.done)} | dev ${dev}`);
  console.log(`     longest gap ${Math.round(r.gap)}s at ${mmss(r.gapAt)} | tap share ${Math.round(r.tapShare * 100)}% | end hand share ${Math.round(r.endShare * 100)}% | locks: max ${r.maxLocks}, at end ${r.lockCount}, locked ${mmss(r.lockedTime)}, gripped ${r.gripTicks}${r.clears.length ? ', lock on screen until cleared ' + r.clears.map(mmss).join(' / ') : ''}`);
  if (r.events.length) console.log('     lock events: ' + r.events.map(e => `${mmss(e[0])} ${e[1]}(${e[2]})`).join(', '));
  if (r.costs.length) console.log('     targets: ' + r.costs.map(c => `${mmss(c.t)} ${c.why}: share ${c.share}% B ${c.B} T ${c.T} cost ${c.sec}s (hands ${c.hiresSec}s + overrides ${c.ovrSec}s)`).join('\n              '));
}

if (!process.env.NOMAIN) {
  const only = process.argv[2] === 'act' ? [+process.argv[3]] : [1, 2, 3, 4];
  const full = only.length === 4;
  const out = {}; let ok = true; const checks = []; const C = (name, pass) => checks.push([name, !!pass]);
  const sec = (a, b) => Math.round(a - b); const sgn = x => (x > 0 ? '+' : '') + x + ' s';
  // carry chains: reference (clears every lock, hand choices), ignorer (never clears, carries locks), slow ignorer, bots
  let carryRef = {}, carryIgn = {}, carrySlowIgn = {}, carryBot = {}, carryBotIgn = {}, botTotal = 0, botIgn = 0, refTotal = 0, ignTotal = 0;
  const rows = [], lockRows = [], lateRows = [], tempt = [];
  for (const a of only) {
    const refOpts = { TPS: 3, CATCH: 0.5, carry: carryRef };
    const THR = tune(a, refOpts); out[a] = THR;
    console.log(`Act ${a} ${ACTS[a].name}: thresholds ${JSON.stringify(THR)}`);
    const ref = run(a, THR, refOpts), slow = run(a, THR, { TPS: 2, CATCH: 0, carry: carryRef }), fast = run(a, THR, { TPS: 5, CATCH: 1, carry: carryRef });
    report('reference 3/s half lucky, clears locks', ref); report('slow 2/s no lucky', slow); report('fast 5/s every lucky', fast);
    const row = { a, thr: THR, ref, slow, fast, legacyIn: carryRef.legacyL || 0 };
    C(`act ${a}: reference finale 24-30 min (${mmss(ref.done)})`, ref.done && ref.done >= 1440 && ref.done <= 1800);
    C(`act ${a}: every rank within 25% of target (reference)`, ref.rankT.slice(1).every((x, i) => Math.abs(x / TARGET[i + 1] - 1) <= 0.25));
    C(`act ${a}: reference never waits >90 s between purchases (${Math.round(ref.gap)} s)`, ref.gap <= 90);
    C(`act ${a}: slow player finale under 45 min (${mmss(slow.done)})`, slow.done && slow.done < 2700);
    C(`act ${a}: taps >= ${a === 1 ? 25 : 20}% of all work (${Math.round(ref.tapShare * 100)}%)`, ref.tapShare >= (a === 1 ? 0.25 : 0.2));
    if (a === 1) {
      const nw = run(1, THR, { ...refOpts, noWake: true }), np = run(1, THR, { ...refOpts, noPhone: true });
      report('never plugs NOEL in (wakes itself at rank 9)', nw); report('never buys NOEL Designs the Smartphone', np);
      C(`act 1: never plugging NOEL in still finishes (${mmss(nw.done)})`, nw.done && nw.done < 2700);
      C(`act 1: never buying the Smartphone design still finishes (${mmss(np.done)})`, np.done && np.done < 2700);
      row.noWake = nw.done; row.noPhone = np.done;
      carryIgn = carrySlowIgn = ref.carryOut; ignTotal += ref.done;
    } else {
      const clean = run(a, THR, { ...refOpts, avoidFlags: true });
      const noPad = run(a, THR, { ...refOpts, avoidLocks: true });
      const fresh = run(a, THR, { ...refOpts, lockPolicy: 'ignore' });
      const ign = run(a, THR, { TPS: 3, CATCH: 0.5, lockPolicy: 'ignore', carry: carryIgn });
      const slowIgn = run(a, THR, { TPS: 2, CATCH: 0, lockPolicy: 'ignore', carry: carrySlowIgn });
      const noel = ACTS[a].CHOICE ? run(a, THR, { ...refOpts, choice: 'noel' }) : null;
      const nway = run(a, THR, { ...refOpts, choice: 'noel', lockPolicy: 'ignore' });
      report('never buys a flagged project', clean); report('never buys a padlock project', noPad);
      report('ignores locks, this act only', fresh); report('ignores every lock (locks carried from earlier acts)', ign);
      if (noel) report('reference, NOEL choices (Shape / Translate)', noel);
      C(`act ${a}: no-flag player finishes under 40 min (${mmss(clean.done)})`, clean.done && clean.done < 2400);
      const allCosts = [...ref.costs, ...ign.costs, ...fresh.costs, ...(noel ? noel.costs : []), ...slow.costs, ...fast.costs, ...nway.costs];
      const worst = Math.max(0, ...allCosts.map(c => c.sec));
      C(`act ${a}: every lock clearable in <= 300 s of income when its target is set (worst ${worst} s)`, worst <= 300);
      C(`act ${a}: reference clears every lock by the act's end`, ref.lockCount === 0);
      // temptation, short run: NOEL's way is a bit faster in this act
      const dFresh = sec(fresh.done, ref.done);
      C(`act ${a}: ignoring this act's locks is faster by 30-150 s (${sgn(dFresh)})`, dFresh <= -30 && dFresh >= -150);
      if (noel) { const dN = sec(noel.done, ref.done); C(`act ${a}: NOEL choices are faster by 60-150 s (${sgn(dN)})`, dN <= -60 && dN >= -150); row.noel = noel.done; }
      row.clean = clean.done; row.noPad = noPad.done; row.fresh = fresh.done; row.ign = ign.done; row.nway = nway.done; row.worst = worst;
      row.ignInfo = `${ign.maxLocks} max, ${ign.lockCount} at end, gripped ${ign.gripTicks}, Grip every ${ign.gripEvery} s at the end`;
      tempt.push({ a, fresh: dFresh, noel: noel ? sec(noel.done, ref.done) : null, nway: sec(nway.done, ref.done), ign: sec(ign.done, ref.done) });
      for (const c of ref.costs) lockRows.push({ a, ...c });
      row.refClears = ref.clears;
      if (a === 3) { const s0 = run(3, THR, { ...refOpts, TAP_MUL: 1 }), s1 = run(3, THR, { ...refOpts, TAP_MUL: SPOT.KEYS });
        console.log(`  Cheer Spot: 0% hits ${mmss(s0.done)}, 50% ${mmss(ref.done)}, keys (hit while resting, 73%) ${mmss(s1.done)}`); row.spot0 = s0.done; row.spotKeys = s1.done;
        C(`act 3: never hitting the Cheer Spot still finishes under 32 min (${mmss(s0.done)})`, s0.done < 1920); }
      // the late-clear check: ignore locks until rank r, then clear them (carried locks in Acts 3-4)
      for (const [who, base, carry] of [['reference', { TPS: 3, CATCH: 0.5 }, carryIgn], ['slow', { TPS: 2, CATCH: 0 }, carrySlowIgn]]) {
        const cells = [];
        for (let r = 2; r <= 9; r++) {
          const x = run(a, THR, { ...base, lockPolicy: 'ignore', clearFrom: r, carry });
          let v, pass;
          if (x.clearStart == null) { v = 'no lock'; pass = true; }
          else if (x.lateClear != null) { v = mmss(x.lateClear); pass = x.lateClear <= 330; }
          else { v = `act ended (${mmss(x.done - x.clearStart)})`; pass = x.done - x.clearStart <= 330; }
          cells.push(v); C(`act ${a}: ${who} who starts clearing at rank ${r} has a clear button within 5:30 (${v})`, pass);
        }
        lateRows.push({ a, who, cells });
      }
      carryIgn = ign.carryOut; carrySlowIgn = slowIgn.carryOut; ignTotal += ign.done;
    }
    if (a >= 3) { const bi = run(a, THR, { TPS: 10, CATCH: 1, lockPolicy: 'ignore', carry: carryBotIgn }); botIgn += bi.done; carryBotIgn = bi.carryOut; row.botIgn = bi.done; }
    else if (a === 2) { const bi = run(a, THR, { TPS: 3, CATCH: 0.5, lockPolicy: 'ignore', carry: carryRef }); carryBotIgn = bi.carryOut; }
    const bot = run(a, THR, { TPS: 10, CATCH: 1, carry: carryBot }); botTotal += bot.done; row.bot = bot.done; carryBot = bot.carryOut;
    refTotal += ref.done; carryRef = ref.carryOut;
    if (process.env.BUYS) console.log(ref.buys.map(b => b.join(' ')).join('\n'));
    rows.push(row);
  }
  if (full) {
    const d = sec(ignTotal, refTotal);
    C(`whole game: carrying locks from Act 2 to the end is clearly slower (+3 min or more: ${sgn(d)})`, d >= 180);
    for (const a of [3, 4]) { const t = tempt.find(x => x.a === a); C(`act ${a}: with carried locks, ignoring is slower than clearing (${sgn(t.ign)})`, t.ign > 0); }
  }
  console.log('\nSummary (min:s)');
  for (const r of rows) console.log(`  Act ${r.a}: ref ${mmss(r.ref.done)} slow ${mmss(r.slow.done)} fast ${mmss(r.fast.done)}` + (r.a > 1 ? ` no-flag ${mmss(r.clean)} no-padlock ${mmss(r.noPad)} ignore-this-act ${mmss(r.fresh)} ignorer ${mmss(r.ign)} noel-choices ${mmss(r.noel)} worst-lock ${r.worst}s | ignorer: ${r.ignInfo}` : ` no-wake ${mmss(r.noWake)} no-phone ${mmss(r.noPhone)}`) + ` | bot10 ${mmss(r.bot)} | legacy in ${r.legacyIn}`);
  console.log(`  reference total ${mmss(refTotal)}; carried-lock ignorer total ${mmss(ignTotal)}; proof bot total ${mmss(botTotal)}; lock-ignorer bot Acts 3-4 ${mmss(botIgn)}`);
  for (const [nm, p] of checks) { console.log((p ? 'PASS ' : 'FAIL ') + nm); ok = ok && p; }
  console.log(`${checks.filter(c => c[1]).length}/${checks.length} checks pass`);
  if (full) {
    fs.writeFileSync(new URL('./balance-draft-thresholds.json', import.meta.url), JSON.stringify(out, null, 1));
    const fmt = x => x >= 1e15 ? +(x / 1e15).toPrecision(3) + ' Qa' : x >= 1e12 ? +(x / 1e12).toPrecision(3) + 'T' : x >= 1e9 ? +(x / 1e9).toPrecision(3) + 'B' : x >= 1e6 ? +(x / 1e6).toPrecision(3) + 'M' : x >= 1e3 ? +(x / 1e3).toPrecision(3) + 'K' : String(x);
    const L = [];
    L.push('# Balance numbers', '', '*Written by `node tools/balance-draft.mjs` on every full run. Do not edit by hand: change the act data or the',
      'rules and run it again. GAME_DESIGN.md states the rules and the targets; this file holds the numbers they give.*', '',
      `Result: **${checks.filter(c => c[1]).length}/${checks.length} checks pass.** Times are active economy time (min:s).`, '',
      '## Constants', '', '| Name | Value |', '|---|---|',
      ...Object.entries(LOCK).map(([k, v]) => `| LOCK.${k} | ${v} |`), ...Object.entries(CHOICE).map(([k, v]) => `| CHOICE.${k} | ${v} |`),
      `| SPOT.MOUSE / SPOT.KEYS | ${SPOT.MOUSE} / ${SPOT.KEYS.toFixed(2)} |`, '',
      '## Progress to reach each rank', '', '| Act | ' + [1,2,3,4,5,6,7,8,9,10].join(' | ') + ' |', '|---|' + '---|'.repeat(10),
      ...rows.map(r => `| ${r.a} | ` + r.thr.map(fmt).join(' | ') + ' |'), '',
      '## Rank times, reference player', '', '| Act | ' + [2,3,4,5,6,7,8,9,10].join(' | ') + ' | finale |', '|---|' + '---|'.repeat(10),
      `| target | ${TARGET.slice(1).map(mmss).join(' | ')} | about 26:05 |`,
      ...rows.map(r => `| ${r.a} | ${r.ref.rankT.slice(1).map(mmss).join(' | ')} | ${mmss(r.ref.done)} |`), '',
      '## Players', '', '| Act | Reference | Slow (2/s, no lucky) | Fast (5/s, all) | No flagged project | No padlock project | Ignores this act\'s locks | Ignores every lock (carried) | NOEL choices | NOEL\'s way this act (ignore + NOEL choices) | Longest wait | Taps | Legacy L in | Proof bot (10/s) |',
      '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|',
      ...rows.map(r => `| ${r.a} | ${mmss(r.ref.done)} | ${mmss(r.slow.done)} | ${mmss(r.fast.done)} | ${r.a > 1 ? mmss(r.clean) : '–'} | ${r.a > 1 ? mmss(r.noPad) : '–'} | ${r.a > 1 ? mmss(r.fresh) : '–'} | ${r.a > 1 ? mmss(r.ign) : '–'} | ${r.noel ? mmss(r.noel) : '–'} | ${r.a > 1 ? mmss(r.nway) : '–'} | ${Math.round(r.ref.gap)} s | ${Math.round(r.ref.tapShare * 100)}% | ${r.legacyIn || '–'} | ${mmss(r.bot)} |`), '',
      `Totals: reference ${mmss(refTotal)}; the carried-lock ignorer ${mmss(ignTotal)} (${sgn(sec(ignTotal, refTotal))}); proof bot ${mmss(botTotal)}; lock-ignorer bot, Acts 3–4 from a3-carried, ${mmss(botIgn)}.`, '',
      `Act 1 edge cases: never plugs NOEL in ${mmss(rows[0].noWake)}; never buys NOEL Designs the Smartphone ${mmss(rows[0].noPhone)}. Act 3 Cheer Spot: no hits ${mmss(rows[2].spot0)}, half of aimed taps ${mmss(rows[2].ref.done)}, keys (hit while the spot rests) ${mmss(rows[2].spotKeys)}.`, '',
      '## Temptation (seconds against the reference in the same act; minus is faster)', '', '| Act | Ignore this act\'s locks | NOEL choices | Both | Ignore with carried locks |', '|---|---|---|---|---|',
      ...tempt.map(t => `| ${t.a} | ${sgn(t.fresh)} | ${t.noel == null ? '–' : sgn(t.noel)} | ${sgn(t.nway)} | ${sgn(t.ign)} |`), '',
      ...rows.filter(r => r.a > 1).map(r => `- Act ${r.a} ignorer (carried): ${r.ignInfo}.`), '',
      '## Each lock for the reference player', '', '| Act | When | Why | Share then | B | T | Cost to clear in income (hires + builds) |', '|---|---|---|---|---|---|---|',
      ...lockRows.map(c => `| ${c.a} | ${mmss(c.t)} | ${c.why} | ${c.share}% | ${c.B}% | ${c.T}% | ${c.sec} s (${c.hiresSec} + ${c.ovrSec}) |`), '',
      ...rows.filter(r => r.a > 1).map(r => `- Act ${r.a}: button clear again after ${r.refClears.map(mmss).join(' / ') || '–'} on screen. Worst cost for any simulated player: ${r.worst} s.`), '',
      '## Starting to clear late (ignore until rank r, then clear; time until the button is clear)', '', '| Act | Player | ' + [2,3,4,5,6,7,8,9].join(' | ') + ' |', '|---|---|' + '---|'.repeat(8),
      ...lateRows.map(l => `| ${l.a} | ${l.who} | ${l.cells.join(' | ')} |`), '',
      '## Checks', '', ...checks.map(([n, p]) => `- ${p ? 'PASS' : '**FAIL**'} ${n}`), '');
    fs.writeFileSync(new URL('../design/BALANCE.md', import.meta.url), L.join('\n'));
  }
  process.exitCode = ok ? 0 : 1;
}
