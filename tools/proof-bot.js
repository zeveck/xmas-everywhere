// The proof bot: the body of a playwright-cli run-code. Real input only: mouse presses on the stage (taps), on lucky
// things, on shop tabs and items (whatever __game.bestBuy names), and on card buttons (the mitten on every choice).
// tools/run-proof.sh fills in __OPTS__: { level, toRank, policy, tps, limit, fromTitle, stopAtWin }
// Progress lines go to window.__runLog; it returns the end state.
async (page) => {
  const o = __OPTS__;
  const log = (m) => page.evaluate((m) => { (window.__runLog = window.__runLog || []).push(m); }, m);
  const st = () => page.evaluate(() => window.__game.state());
  const press = async (x, y, hold = 40) => { await page.mouse.move(x, y); await page.mouse.down(); await page.waitForTimeout(hold); await page.mouse.up(); };
  const pressEl = async (sel) => { const b = await page.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; const r = e.getBoundingClientRect(); if (!r.width || !e.offsetParent) return null; return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, sel); if (!b) return false; await press(b.x, b.y, 80); return true; };
  if (o.level) { await page.evaluate((n) => window.__game.goToLevel(n), o.level); await page.waitForTimeout(800); }
  let s = await st(); const startAct = s.act, startRank = s.rank, t0 = Date.now(); let rankT = Date.now(); let lastRank = s.rank;
  await log(`start act ${s.act} rank ${s.rank} (${o.policy}, ${o.tps}/s)`);
  let cardSince = null, lastCard = null, fails = 0, winLogged = 0;
  const stageRect = () => page.evaluate(() => { const r = document.querySelector('#stage').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; }); let stage = await stageRect();
  const period = 1000 / o.tps; let nextTap = Date.now();
  while (true) {
    s = await st();
    if (s.rank !== lastRank) { await log(`act ${s.act} rank ${s.rank} at ${Math.round((Date.now() - t0) / 1000)} s (game ${Math.round(s.t)} s) locks ${s.locks.length}`); lastRank = s.rank; rankT = Date.now(); }
    if ((s.card === 'act-win' || s.phase === 'actwin') && winLogged !== s.act) { winLogged = s.act; await log(`act ${s.act} act-win card at ${Math.round((Date.now() - t0) / 1000)} s, locks ${s.locks.length}`); if (o.stopAtWin !== false && o.onWin !== 'next') break; }
    if (o.toRank && s.act === startAct && s.rank >= o.toRank && s.rank > startRank) break;
    if (o.toAct && s.act >= o.toAct) break;
    if ((Date.now() - rankT) / 1000 > o.limit) { await log(`LIMIT at act ${s.act} rank ${s.rank}`); fails++; if (fails >= 3) break; rankT = Date.now(); }
    if (Date.now() - t0 > (o.total || 3600) * 1000) { await log('TOTAL LIMIT'); break; }
    // cards: wait out the 1 s guard, then press like a person
    if (s.card) {
      if (s.card !== lastCard) { lastCard = s.card; cardSince = Date.now(); }
      if (Date.now() - cardSince < 1150) { await page.waitForTimeout(100); continue; }
      stage = { w: 0 };
      if (s.card === 'act-win' && s.act === 4 && o.onWin === 'next') { const off = await page.evaluate(() => !!document.querySelector('#card button.quiet-btn')); await log(`act 4 act-win: Switch NOEL Off ${off ? 'offered' : 'not offered'}`); if (off && o.policy !== 'ignore') { await pressEl('#card button.quiet-btn'); await page.waitForTimeout(3000); } break; }
      if (s.card === 'act-win') { if (o.onWin === 'next') { await pressEl('#card button.eye'); cardSince = Date.now(); lastCard = null; await page.waitForTimeout(1500); if (await page.evaluate(() => !document.querySelector('#actBegin').closest('[hidden]'))) { await page.waitForTimeout(1500); await pressEl('#actBegin'); await page.waitForTimeout(1500); } continue; } break; }
      const pick = (s.card === 'promotion-choice' || s.card === 'contact-card') ? (o.policy === 'noel' ? '#card button.eye' : '#card button.mitten') : '#card button.big';
      const ok = await pressEl(pick) || await pressEl('#card button'); lastCard = null; await page.waitForTimeout(250); continue;
    }
    if (s.screen === 'actcard' || s.screen.startsWith('actcard')) { await pressEl('#actBegin'); await page.waitForTimeout(1500); continue; }
    if (s.finale) { await page.waitForTimeout(300); continue; }
    // lucky things
    if (s.lucky) { const p = await page.evaluate(() => window.__game.luckyAt()); if (p) await press(p.x, p.y); }
    // buy what the reference strategy would
    for (let k = 0; k < 3; k++) {
      const b = await page.evaluate((a) => window.__game.bestBuy(a[0], a[1]), [o.policy === 'noel' ? 'clear' : o.policy, o.tps]); if (!b) break;
      const vis = await page.evaluate((sel) => { const e = document.querySelector(sel); return !!(e && e.offsetParent && e.closest('.sec.on')); }, b.selector);
      if (!vis) { await pressEl(`#shopTabs .tab[data-tab="${b.tab}"]`) || await pressEl(`#tabbar .tab[data-tab="${b.tab}"]`); await page.waitForTimeout(60); }
      await page.evaluate((sel) => document.querySelector(sel)?.scrollIntoView({ block: 'center' }), b.selector);
      if (!(await pressEl(b.selector))) break;
    }
    // taps at the set rate (Act 3: aim at the Cheer Spot every other tap while it rests)
    if (!stage.w) stage = await stageRect(); if (!stage.w) { await page.waitForTimeout(200); continue; }
    const now = Date.now(); let n = 0;
    while (nextTap <= now && n++ < 6) {
      nextTap += period; let x = stage.x + stage.w * 0.52, y = stage.y + stage.h * 0.62;
      if (s.act === 3) { const sp = await page.evaluate(() => window.__game.spotAt()); if (sp && sp.resting && Math.random() < 0.6) { x = sp.x; y = sp.y; } else { x = stage.x + stage.w * 0.5; y = stage.y + stage.h * 0.75; } }
      if (s.act === 4) { x = stage.x + stage.w * 0.5; y = stage.y + stage.h * 0.3; }
      await press(x, y, 15);
    }
    if (nextTap < Date.now() - 1000) nextTap = Date.now();
    await page.waitForTimeout(Math.max(5, nextTap - Date.now()));
  }
  s = await st();
  await log(`end act ${s.act} rank ${s.rank} phase ${s.phase} card ${s.card} after ${Math.round((Date.now() - t0) / 1000)} s`);
  return { act: s.act, rank: s.rank, phase: s.phase, card: s.card, levelComplete: s.levelComplete, locks: s.locks.length, secs: Math.round((Date.now() - t0) / 1000), gameT: Math.round(s.t) };
}
