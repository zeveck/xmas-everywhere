// Plays every act headlessly with game/src/rules.js and the reference strategy, to check the game's engine
// matches the balance sim (design/BALANCE.md). Also writes the goToLevel snapshots: game/snapshots/a<act>-r<rank>.json.
//   node tools/verify-rules.mjs [tps] [catch] [policy] [choice] [--snap]
import fs from 'node:fs';
import * as R from '../game/src/rules.js';
import { TARGET, ACTS } from '../game/src/data.js';
const tps = +(process.argv[2] || 3), CATCH = +(process.argv[3] ?? 0.5), policy = process.argv[4] || 'clear', side = process.argv[5] || 'hand';
const snap = process.argv.includes('--snap') || process.argv.includes('--carried');
const mmss = (s) => s == null ? '-' : Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
let carry = {}, total = 0; const snaps = {};
for (const a of [1, 2, 3, 4]) {
  const S = R.newAct(a, carry); const rankT = [0];
  if (process.argv.includes('--carried') && a >= 3) snaps[`a${a}-carried`] = JSON.parse(JSON.stringify({ ...S, events: [] })); let tapAcc = 0, seen = 0, dt = 0.1, spotToggle = 0;
  if (snap && !process.argv.includes('--carried')) snaps[`a${a}-r1`] = JSON.parse(JSON.stringify({ ...S, events: [] }));
  while (!S.finalDone && S.t < 5400) {
    if (S.pendingChoice) R.choose(S, S.pendingChoice, side);
    for (let k = 0; k < 50; k++) { const b = R.bestBuy(S, policy, tps); if (!b) break; R.buy(S, b.kind, b.id); }
    if (S.lucky && !S.lucky.seen) { S.lucky.seen = true; seen++; if (CATCH >= 1 || (CATCH > 0 && seen % Math.round(1 / CATCH) === 0)) R.catchLucky(S); }
    tapAcc += tps * dt; while (tapAcc >= 1) { tapAcc -= 1; const spot = a === 3 && (spotToggle++ % 2 === 0); R.tap(S, spot); }
    R.step(S, dt);
    for (const e of S.events) if (e.type === 'rank') { rankT[e.rank - 1] = S.t; if (snap && !process.argv.includes('--carried')) snaps[`a${a}-r${e.rank}`] = JSON.parse(JSON.stringify({ ...S, events: [], pendingChoice: S.pendingChoice })); }
    S.events.length = 0;
  }
  total += S.t;
  console.log(`Act ${a}: ranks ${rankT.map(mmss).join(' ')} finale ${mmss(S.finalAt)} | locks ${S.locks.length} gripped ${S.gripCount} share ${Math.round(R.handShare(S) * 100)}% L-in ${S.legacyL}`);
  console.log('   dev ' + rankT.slice(1).map((x, i) => Math.round((x / TARGET[i + 1] - 1) * 100) + '%').join(' '));
  carry = R.carryOut(S);
}
console.log('total ' + mmss(total));
if (snap) { fs.mkdirSync(new URL('../game/snapshots/', import.meta.url), { recursive: true });
  for (const [k, v] of Object.entries(snaps)) fs.writeFileSync(new URL(`../game/snapshots/${k}.json`, import.meta.url), JSON.stringify(v)); console.log(Object.keys(snaps).length + ' snapshots'); }
