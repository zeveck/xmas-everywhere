// run-code body: visits every main screen, runs gamegen's text scanner and screenshots each into design/screenshots/<W>-<name>.png
async (page) => {
  const W = __W__, SC = '__SC__'; const out = {};
  const press = async (sel) => { const b = await page.evaluate((sel) => { const e = document.querySelector(sel); if (!e || !e.offsetParent) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, sel); if (!b) return false; await page.mouse.move(b.x, b.y); await page.mouse.down(); await page.waitForTimeout(110); await page.mouse.up(); await page.waitForTimeout(350); return true; };
  const scan = async (name) => { await page.addScriptTag({ path: SC }); const r = await page.evaluate(() => window.__scanText()); out[name] = r.length ? r.map((f) => `${f.kind || f.type}: ${String(f.text).slice(0, 60)}`) : 'ok'; await page.screenshot({ path: `xmas-everywhere/design/screenshots/${W}-${name}.png` }); };
  await scan('title'); await press('#btnHowto'); await scan('howto'); await press('#howtoBack'); await press('#btnLoad'); await scan('load'); await press('#loadBack');
  for (const [lv, nm] of [[2, 'a1'], [14, 'a2'], [24, 'a3'], [34, 'a4']]) {
    await page.evaluate((n) => window.__game.goToLevel(n), lv); await page.waitForTimeout(2200); await scan(nm + '-card');
    await press('#card button.mitten') || await press('#card button.big'); await page.waitForTimeout(1200); await press('#card button.big'); await page.waitForTimeout(600); await scan(nm + '-game');
    for (const t of ['tools', 'upgrades', 'noel']) { (await press(`#tabbar .tab[data-tab="${t}"]`)) || (await press(`#shopTabs .tab[data-tab="${t}"]`)); await scan(`${nm}-${t}`); }
    await press('#tabbar .tab[data-tab="helpers"]') || await press('#shopTabs .tab[data-tab="helpers"]');
  }
  await press('#btnGear'); await scan('pause'); await press('#pauseBox button:nth-child(2)'); await scan('settings');
  const cred = await page.evaluate(() => [...document.querySelectorAll('#pauseBox button')].findIndex((b) => b.textContent === 'Credits')); await press(`#pauseBox button:nth-of-type(${cred + 1})`); await scan('credits');
  await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  await page.evaluate(() => window.__game.goToLevel(27)); await page.waitForTimeout(1500); await page.keyboard.press('Escape'); await press('#card button.big'); await page.waitForTimeout(400); await press('#btnDeclare'); await page.waitForTimeout(1300); await scan('declare-or-lock');
  return JSON.stringify(out);
}
