// Pictures, loaded per act as ImageBitmaps (closed on act change), plus the shared set. A missing file never stops the game:
// it is drawn as nothing and reported in missing().
import { ACTS, kebab } from './data.js';

const SHARED = ['shared/noel-box', 'shared/noel-box-dusty', 'shared/noel-cabinet', 'shared/noel-console', 'shared/noel-core', 'shared/lens', 'shared/icon-cookie', 'shared/icon-cheer',
  'shared/icon-insight', 'shared/icon-declare', 'shared/badge-mitten', 'shared/badge-eye', 'shared/santa-portrait', 'locks/clamp', 'locks/chain-badge', 'locks/padlock', 'locks/chain-loop'];
const LUCKY = { 1: 'shared/lucky-star', 2: 'shared/lucky-letter', 3: 'shared/lucky-cloud', 4: 'shared/lucky-comet' };
export const helperFile = (a, id) => (a === 1 ? `act1/${{ elf: 'elf-helper', toyMachine: 'toy-machine', reindeer: 'reindeer-team', assemblyLine: 'assembly-line' }[id]}` : `act${a}/${kebab(id)}`);
export const upgFile = (a, id) => (id === 'wakeNoel' ? 'act1/upg-plug-in-noel' : `act${a}/upg-${kebab(id)}`);
export const jobFile = (a, i) => `act${a}/${['toy', 'file', 'holdout', 'species'][a - 1]}-${String(i + 1).padStart(2, '0')}`;
export const toolFile = (a, i) => `act${a}/${['hammer', 'stamp', 'bell', 'scanner'][a - 1]}-${i + 1}`;
export const toolHandFile = (a, i) => (a <= 2 ? `act${a}/${['hammer', 'stamp'][a - 1]}-${i + 1}-hand` : toolFile(a, i));

export function actFiles(a) {
  const f = [];
  const bg = { 1: 'act1/workshop-bg', 2: 'act2/list-room-bg', 3: 'act3/deck-bg', 4: 'act4/bridge-bg' }[a]; f.push(bg, LUCKY[a]);
  for (let i = 0; i < 10; i++) f.push(jobFile(a, i));
  for (let i = 0; i < 4; i++) { f.push(toolFile(a, i)); if (a <= 2) f.push(toolHandFile(a, i)); }
  for (const h of ACTS[a].HELP) f.push(helperFile(a, h[0]));
  for (const u of ACTS[a].UPG) f.push(upgFile(a, u[0]));
  if (a <= 2) f.push('act1/stool');
  if (a === 1) f.push('act1/bench', 'act1/tree', 'act1/tree-star', 'act1/sleigh', 'act1/finale-sky', ...[1, 2, 3, 4, 5, 6].map((i) => `act1/presents-${i}`));
  if (a === 2) f.push('act2/clerk-desk', 'shared/pip-clerk', 'shared/santa-slumped', 'act1/tree-star');
  if (a === 3) f.push('shared/pip-coat', 'act3/moon-hat', 'act3/bow', 'shared/santa-beach', 'act3/globe-map');
  if (a === 4) f.push('shared/pip-suit', 'act1/tree-star', 'act4/species-10');
  if (a >= 2) for (let i = 1; i <= 5; i++) f.push(`locks/override-${i}`);
  if (a >= 2) f.push('locks/lever');
  return f;
}

const cache = new Map(); let curAct = 0; const missingSet = new Set();
const json = {};
function loadOne(path) {
  if (cache.has(path)) return cache.get(path);
  const p = (async () => {
    try {
      const r = await fetch(`assets/${path}.webp`); if (!r.ok) throw new Error(r.status);
      const blob = await r.blob(); return await createImageBitmap(blob);
    } catch { missingSet.add(path); return null; }
  })();
  cache.set(path, p); return p;
}
export const img = (path) => { const p = cache.get(path); return p && p.done ? p.v : null; };
function track(path) { const p = loadOne(path); if (!p.tracked) { p.tracked = true; p.then((v) => { p.done = true; p.v = v; }); } return p; }
export async function loadTitleBits() { await track('shared/noel-box'); try { const r = await fetch('assets/shared/noel-eyes.json'); if (r.ok) json['shared/noel-eyes'] = await r.json(); } catch {} }
export async function loadShared() {
  await Promise.all([...SHARED, 'act1/workshop-bg', 'act1/tree-star'].map(track));
  for (const k of ['shared/noel-eyes', 'sprites/pip-swing/pivots', 'sprites/pip-clerk-swing/pivots', 'act1/hammers', 'act2/stamps']) {
    try { const r = await fetch(`assets/${k}.json`); if (r.ok) json[k] = await r.json(); } catch {}
  }
}
export const data = (k) => json[k];
// Loads everything an act draws; resolves when ready (missing ones count as ready). Releases the last act's bitmaps.
export async function loadAct(a) {
  const files = [...actFiles(a)]; const swing = a === 1 ? 'pip-swing' : a === 2 ? 'pip-clerk-swing' : null;
  if (swing) for (let i = 0; i < 4; i++) files.push(`sprites/${swing}/${i}`);
  if (curAct && curAct !== a) {
    const keep = new Set([...SHARED, ...files, 'act1/tree-star']);
    for (const [k, p] of cache) if (!keep.has(k) && !k.startsWith('endings/') && p.done && p.v) { p.v.close?.(); cache.delete(k); }
  }
  curAct = a;
  await Promise.all(files.map(track));
}
export async function loadEnding(n) { await track(`endings/ending-${n}`); return img(`endings/ending-${n}`); }
export function releaseEndings() { for (const [k, p] of cache) if (k.startsWith('endings/') && p.done && p.v) { p.v.close?.(); cache.delete(k); } }
export const missing = () => [...missingSet];
export const memory = () => { let n = 0, px = 0; for (const p of cache.values()) if (p.done && p.v) { n++; px += p.v.width * p.v.height; } return { bitmaps: n, megapixels: +(px / 1e6).toFixed(1), act: curAct }; };
export const url = (path) => `assets/${path}.webp`;
