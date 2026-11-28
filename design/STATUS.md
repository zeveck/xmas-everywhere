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

- `--fix` (exactly as typed): `/gamegen:gamegen --out xmas-everywhere --fix all --publish --no-confirm`
  - #1: Flickering tab (https://github.com/zeveck/xmas-everywhere/issues/1)
  - #2: Screen cap doesn't capture the whole screen (https://github.com/zeveck/xmas-everywhere/issues/2)
  - #3: Visual layout (https://github.com/zeveck/xmas-everywhere/issues/3)

- `--change` (exactly as typed): `/gamegen:gamegen --out xmas-everywhere --change add a stats card to the Endings screen: time played, locks taken and cleared, and every wish and First Contact answer you chose --publish --no-confirm`

- `--change` (exactly as typed): `/gamegen --out xmas-everywhere --change reword the Declare Victory button's introduction and warnings, exactly as follows, then check those screens at every size and publish. --publish --no-confirm` (four numbered wordings: Act 2 title card "New:" line; Act 2 how-to card second paragraph; padlock-project warning with the gift-box icon; Lock card heading. How to play left as is.) Then: `After than, publish no-confirm.`

- `--fix` (exactly as typed): `/gamegen:gamegen --fix all --publish --no-confirm --out xmas-everywhere`
  - #4: Toys under tree (https://github.com/zeveck/xmas-everywhere/issues/4)
  - #5: Yo-yo (https://github.com/zeveck/xmas-everywhere/issues/5)
  - #6: Puzzle cube (https://github.com/zeveck/xmas-everywhere/issues/6)
  - #7: Fidget Spinner + Chess (https://github.com/zeveck/xmas-everywhere/issues/7)
  - #8: NOEL (https://github.com/zeveck/xmas-everywhere/issues/8)
  - #9: Text wraps leaving a single word alone on its last line (https://github.com/zeveck/xmas-everywhere/issues/9)
  - Typed mid-run: `If any seem more like you  should just explan something to me, feel tree to do that now.` (Explained #8's Comet joke; still reworded it.)

- Change (asked in chat, 2026-11-26/28): `We should probably fix https://github.com/zeveck/xmas-clicker/issues/1 here too unless you object. Thoughts and best path?` then `It's not critical to match Xmas Clicker. which is the better play mechanic fix?` then `yes` (to: tools multiply the whole tap instead of adding a flat amount, every act; re-tune, replay all 40, whole-game run, publish).

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

- Fix #1–#3 and the stats card (2026-11-25): done, published; 40/40 rank replays passed on the new code; issues closed by the push.
- Declare Victory wording (2026-11-25): Act 2 title card, Act 2 how-to card, padlock warning (with the gift-box icon), Lock card heading; checked at six sizes and live; published; Design page on the plans page updated.

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

## Fixes #4–#9 (2026-11-26)

- [x] #4 pile: 1:1 for the first 12 toys, then log growth to 40 at ~1,200 (stage.js pileCount)
- [x] #5 toy sizes: per-toy scale on the bench, in the pile and in the arc (stage.js TOY_SCALE)
- [x] #6 Puzzle Cube repainted 3×3 (toy-03); #7 toy 6 Wooden Train Set, toy 7 Remote Control Car (toy-06, toy-07): 3 imagegen2 high images, ~$0.21
- [x] #8 NOEL's wake line points at the NOEL tab instead of "check Comet"
- [x] #9: full sweep (all 40 ranks: card, play screen, every shop tab; title, how-to, load, endings, pause, settings, credits) at 6 sizes found the Twice-Checker rows, the hands meter line, the rank bar and twin-card counts at 800×600, the job strip (cut names on phones; on 667×375 it pushed the shop off screen) and, on phones, long rank titles pushing gear/mute off screen (live too). All fixed; final sweep clean at all six sizes. Reviews: two fresh reviewers (fixes #4–#8; #9) — follow-ups fixed (pile contents, hammer aim on the train, NOEL hints, hyphen joiner, held counts).
- [x] Act 1 replays 10/10 twice on the new code (Acts 2–4 unchanged in play: text/CSS only). Commits d40b754…, each Fixes #N.
- [x] Published 2026-11-26 (deploy OK; issues #4–#9 closed by the push); live check desktop 1280×800 and iPhone 15 (title, Act 1 rank 6 train set, Act 2 ranks 2 and 6), no errors, scanner clean; art page labels updated (gallery e5328e4).

## Change: tools multiply the tap (2026-11-28)

Why: a tap = tool + 15% of crew work/s, so the tool's share of a tap fell to 1–3% by rank 10 in every act; skipping tools cost only 3–8% (sim, 6 taps/s). xmas-clicker #1 ("keep hiring elves rather than upgrade my hammer") applies here.
- [x] Rule in tools/balance-draft.mjs + game/src/rules.js: tap = tool multiplier × (TAP + CREW_TAP × crew). Tried ×2/4/8 (skipping tools 180–250% slower: too much), settled ×1.5/×2/×3, prices kept (54–68% slower without tools). 92/92 checks (new: skipping tools ≥12% slower; Translate +4% was 4.5%; no-NOEL guard 50 min, was 45). Thresholds re-tuned; verify-rules within 2% (Act 1 rank 2 −5% as before).
- [x] Tool rows "Every tap ×1.5" / "The one you start with"; Translate text from CHOICE; v1 saves keep their place in the rank on the new thresholds (main.js migrate); Rush countdown order as in the sim; GAME_DESIGN, BALANCE (regenerated), README
- [ ] Snapshots rebuilt (verify-rules --snap; --carried with ignore). Replays round 1: 40/40 PASS (.gamegen/elves/round1). Fresh review: 3 findings, all fixed. Round 2 + whole-game run: running
- [ ] Publish

