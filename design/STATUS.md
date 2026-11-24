# Xmas Everywhere

## Requests

1. ```
/gamegen --out xmas-everywhere --scope large --plan-only --share-design
An Xmas idle game that starts cozy and gets steadily more twisted. Always say "Xmas", never "Christmas", anywhere in the game.
Start from the plan and art in ../xmas-clicker (Chief Toy Officer): reuse Pip, the workshop, the toys, the rank titles and its balance work for the opening act.
Act 1, Help Santa: automate Santa's workshop so the toys are ready for Xmas. Alongside real factory buildouts, there's an AI layer that makes the factory smarter about toy design, development and so on, and that layer runs through the whole game.
When you "win" an act, you get a "Declare Victory & Merry Xmas" button, with a button for the next act beside it. At the end of act 2 that second button is "Replace Santa".
From act 2 on, "Declare Victory & Merry Xmas" is always available so you can win at any time. But as you build more AI, it sometimes tries to lock that button down (rarely, maybe once or twice an act), and you have to build the factory in certain ways to unlock it again. If you don't, it can get pretty locked down, though you always get a free and clear chance to press it when you win an act.
Act 2, Replace Santa: track people, who's naughty and nice, and what everyone wants. The AI can help influence what people want and help make sure people are nice.
Act 3, Merry Earthmas: make sure all of Earth celebrates Xmas.
Act 4, Xmas Everywhere: find life in the

 Note the ideas of the sorts of thing you do in an act are intended to give flavor/direction. Design should include expanding the ideas to make fully fleshed out acts.
```
   (The pasted request ends mid-sentence at "find life in the"; read as "find life in the universe".)
- Later request (exactly as typed): `When this lands, we should apply /gamegen:gamegen --feedback to both xmas-clicker and xmas-everywhere and /gamegen:gamegen --saves to xmas-everywhere`
- Later request (exactly as typed): `Yes, "the universe". The tone feels right. What do you think about mid-act endings? It's tempting but seems complicated?`
  (Answered: keep the current early variants of endings 2–4; optional cheap add: a few early lines per act by progress.)
- `--continue` (exactly as typed): `/gamegen:gamegen --continue --out xmas-everywhere --budget 30 give each act a few early-ending lines by how far you got. --art-sheet --feedback --publish --no-confirm`
  (Applied: Endings now have four early lines per act for Acts 2–4, by rank band; Act 1 has no mid-act Declare.)

## Settings

- Feedback: on (from `--feedback`). Saves: 3 (from `--saves`). Both added to the design in round 2's refine.
- Folder: `xmas-everywhere/` (from `--out`), next to `xmas-clicker/` (the Chief Toy Officer plan, reused for Act 1)
- Platform: both. Target: web. 3D: no. Scope: large (from `--scope`): four acts, about 100 minutes of active play.
- Budget: $30 (from `--budget 30` on --continue; was $20). Mockups: $5. Rounds: 2. Plan only: was yes; now building. Share design: page. Art sheet: yes. Publish at the end: yes (synapticnoise.com). No-confirm: yes.
- Plans page: yes (asked and approved; GAMEGEN_PLANS=synapticnoise.com/plans, gallery zeveck/synapticnoise, a private repo). Making-of: on. Domain: synapticnoise.com.
- Credit: Rich Conlan (from GAMEGEN_CREDIT)
- ElevenLabs tier: creator (no credit line needed)
- Available: imagegen2, anim8gen (OpenAI ok), nanogen (Gemini ok), audiogen (ElevenLabs ok), playwright-cli, node, Python + Pillow.

- GitHub preview image: to upload (none set)
- Published: https://xmaseverywhere.synapticnoise.com (repo zeveck/xmas-everywhere, public; Feedback on, repo set). HTTPS on. In the gallery at the top of synapticnoise.com; plans card: Published.
- Art sheet: https://synapticnoise.com/plans/xmas-everywhere/art/ (on the plans page; pictures linked from the repo)

## Phases

- [x] Brief: design/BRIEF.md (Act 4's cut-off line read as "the universe")
- [x] Design: Xmas Everywhere, large; four acts on one engine, NOEL, the Declare button and its locks, six endings; balance sim for all acts
- [x] Design review: 2 rounds (30 + 24 findings; 3 must-fix, all fixed); --saves 3 and --feedback on added in round 2; sim 88/88 checks, numbers in design/BALANCE.md
- [x] Shared design (mock pictures): 8 pictures (four NOEL bodies, three act backgrounds, the globe map), about $1.28, plus two composites; design page built in .gamegen/plans/xmas-everywhere/ for the plans page (published on the plans page)
- [x] Plans page: card added (Planned), plan files and the design page at https://synapticnoise.com/plans/xmas-everywhere/. Design shared: https://synapticnoise.com/plans/xmas-everywhere/, as a page on the plans page.
- [x] Art, animation and audio: every asset made (about 230 files), about $17.30 of $30 in all; details in design/ASSETS.md
- [x] Build: one engine (game/src/rules.js, matches the balance sim within 2% on every rank), four stages on one canvas, shop, cards, locks, finales, six endings with early/cold variants, three save slots, Report a bug (hidden until a repo is set), offline, phone layouts.
- [x] Play-test: 40/40 rank solutions replayed twice with real input on the final rules (80/80 PASS, same end state, within ±15%); the lock-ignorer run (carried locks) reached the Act 4 act-win card with no Switch NOEL Off; text scanner clean at six sizes; first load filmed (title once, then still); touch, two fingers, Cheer Spot (72 px, every aimed tap lands), slots, away card, Report a bug, offline all checked.
- [x] Final review: playtester and bug hunter; 3 must-fix and 9 should-fix found, all fixed (design/REVIEW_LOG.md); the lock rule got a minimum step (sim 88/88).
- [x] Polish pass: fresh reviewer at six sizes; 10 findings, all fixed (800×600 shop layout the big one).
- [x] Wrap up: social card and GitHub preview from the game's art; README with screenshots and the requests; Pages workflow; published; whole game proven in one go (New Xmas to Silent Night, real input, 58:28 at 10 taps/s).
