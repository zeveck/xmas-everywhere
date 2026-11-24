// The text rule: "christmas" (any case) never appears in any file or file name under game/.
import fs from 'node:fs'; import path from 'node:path';
const root = new URL('../game/', import.meta.url).pathname; const bad = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (/christmas/i.test(f)) bad.push(p + ' (name)');
  if (fs.statSync(p).isDirectory()) walk(p); else if (/\.(js|html|css|json|webmanifest|txt|md|yml|svg)$/.test(f) && /christmas/i.test(fs.readFileSync(p, 'utf8'))) bad.push(p); } })(root);
if (bad.length) { console.log('FAIL: "christmas" found in:\n' + bad.join('\n')); process.exit(1); } else console.log('PASS: no "christmas" under game/');
