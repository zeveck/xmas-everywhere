# Xmas Everywhere

*It started with a toy workshop.*

You're Pip, the newest elf in Santa's workshop. Hammer toys, hire elves, and plug in NOEL, a dusty
old thinking machine that makes the workshop smarter. NOEL is very helpful. Over four acts it helps
you take over Santa's List, then the whole Earth, then every living thing in the universe. All the
while a **Declare Victory & Merry Xmas** button sits on the screen, and you can stop any time.
Unless NOEL has locked it.

**[▶ Play Xmas Everywhere](https://xmaseverywhere.synapticnoise.com)** in your browser. No install,
works on desktop and on phones.

![The title screen: the workshop at night through a frosted window](media/screenshots/title.jpg)

## Four acts, each a whole scale bigger

| | |
|---|---|
| ![Act 1: the workshop](media/screenshots/act1.jpg) | ![Act 2: the List Room](media/screenshots/act2.jpg) |
| **Act 1, Help Santa.** Hammer toys from the Wooden Tractor to the Smartphone, build a factory of elves, clockwork and reindeer, and wake NOEL on the top shelf. | **Act 2, Replace Santa.** Check everyone's file, twice. Grant their wishes by hand, or let NOEL "shape" them. Santa is very tired. |
| ![Act 3: the Earthmas Deck](media/screenshots/act3.jpg) | ![Act 4: the Star-Sleigh](media/screenshots/act4.jpg) |
| **Act 3, Merry Earthmas.** Ring the bell over a turning globe until every holdout on Earth celebrates, even the Moon. | **Act 4, Xmas Everywhere.** Ping the scanner, meet nine strange and gentle species, and decide whether to listen to them or let NOEL translate. |

**The button.** From Act 2, Declare Victory is always on the top bar. NOEL's strongest projects
lock it, and say so before you buy them. A lock pays at first and costs later: NOEL's Grip starts
turning your elves into its machines. Build an override NOEL can't reach and put enough hands on
the wheel to win it back. Six endings are waiting, one of them a secret.

| | |
|---|---|
| ![A Lock card: NOEL has put the Victory button under review](media/screenshots/lock.jpg) | ![The Silent Night ending](media/screenshots/ending.jpg) |

## How to play

- **Work:** click or tap the stage (or press Space or Enter). Every tap also adds a share of your
  crew's work.
- **Spend:** cookies buy tools, helpers and upgrades; NOEL's Insight buys NOEL's projects.
  From Act 2, pick hand-run helpers (the mitten) or NOEL's cheaper machines (the eye).
- **Pick a job:** keys 1–9 and 0, or the shelf (the first tab on phones).
- **Lucky things:** click the falling star, letter, cloud or comet for a Rush.
- **Act 3:** a tap inside the gold ring on the globe counts double.
- **Choices:** keys 1 and 2, or the two big buttons.
- **Pause:** Esc or P. **Mute:** M.
- On a phone, everything is a tap; it plays upright or sideways. You can install it from your
  browser's menu to play full screen, even offline.
- Found a bug? Pause and pick "Report a bug", or press Ctrl+Shift+F (you'll need a GitHub account).

There's no way to lose. The game saves itself in one of three slots (Load, from the title), along
with every ending you find. A whole run takes about an hour and three quarters of play.

![On a phone](media/screenshots/phone.jpg)

## How it was made

Xmas Everywhere was made by [Claude Code](https://claude.com/claude-code) with
[gamegen](https://github.com/zeveck/gamegen), from this request:

> /gamegen --out xmas-everywhere --scope large --plan-only --share-design
> An Xmas idle game that starts cozy and gets steadily more twisted. Always say "Xmas", never "Christmas", anywhere in the game.
> Start from the plan and art in ../xmas-clicker (Chief Toy Officer): reuse Pip, the workshop, the toys, the rank titles and its balance work for the opening act.
> Act 1, Help Santa: automate Santa's workshop so the toys are ready for Xmas. Alongside real factory buildouts, there's an AI layer that makes the factory smarter about toy design, development and so on, and that layer runs through the whole game.
> When you "win" an act, you get a "Declare Victory & Merry Xmas" button, with a button for the next act beside it. At the end of act 2 that second button is "Replace Santa".
> From act 2 on, "Declare Victory & Merry Xmas" is always available so you can win at any time. But as you build more AI, it sometimes tries to lock that button down (rarely, maybe once or twice an act), and you have to build the factory in certain ways to unlock it again. If you don't, it can get pretty locked down, though you always get a free and clear chance to press it when you win an act.
> Act 2, Replace Santa: track people, who's naughty and nice, and what everyone wants. The AI can help influence what people want and help make sure people are nice.
> Act 3, Merry Earthmas: make sure all of Earth celebrates Xmas.
> Act 4, Xmas Everywhere: find life in the
>
>  Note the ideas of the sorts of thing you do in an act are intended to give flavor/direction. Design should include expanding the ideas to make fully fleshed out acts.

(The request was cut off at "find life in the"; it was read as "the universe".) Then, on the plan:

> When this lands, we should apply /gamegen:gamegen --feedback to both xmas-clicker and xmas-everywhere and /gamegen:gamegen --saves to xmas-everywhere

which added the "Report a bug" button and three save slots, and:

> Yes, "the universe". The tone feels right. What do you think about mid-act endings? It's tempting but seems complicated?

Then, to build it:

> /gamegen:gamegen --continue --out xmas-everywhere --budget 30 give each act a few early-ending lines by how far you got. --art-sheet --feedback --publish --no-confirm

which gave each of Acts 2–4 four early-ending lines, by how far you got.

gamegen designed the game, had review agents polish the design, made the art, animation, music and
sound with these plugins, built it, and play-tested it:

- [imagegen2](https://github.com/zeveck/imagegen2): Pip in four outfits, NOEL's four bodies, Santa,
  every toy, file, holdout, species, tool, helper and upgrade (cut from 3×2 sheets), the locks and
  overrides, and the icons.
- [nanogen](https://github.com/zeveck/nanogen): the four stages, the title painting, the Xmas Eve
  sky, the globe's map and the six ending paintings.
- [anim8gen](https://github.com/zeveck/anim8gen): Pip's hammer swing and his clerk's stamp swing.
- [audiogen](https://github.com/zeveck/audiogen): ten pieces of music, forty sound effects, and the
  voices of Santa and NOEL.

The design, its review log and the balance numbers are in `design/`.

## Replaying the tests

Every rank of every act has a recorded solution in `design/solutions/` (40 in all): a bot that
plays with real mouse input (taps on the stage, clicks on lucky things, the shop and the cards)
from that rank's snapshot until the next promotion, or through the finale to the act-win card.

1. Serve the game: `python3 -m http.server 8130 --directory game`
2. Replay one act's ten ranks twice (needs [playwright-cli](https://www.npmjs.com/package/@playwright/cli)):
   `tools/replay-act.sh 2 8130` (logs to `.gamegen/replay-a2.log`). One rank:
   `tools/run-proof.sh <session> '{"level":14,"toRank":5,"policy":"clear","tps":10,"limit":300}'`
3. The whole game in one go, New Xmas to Silent Night: `tools/run-whole-game.sh 8130`. The player who
   never clears a lock: `tools/run-ignorer.sh 8130`.

Checks without a browser: `node tools/balance-draft.mjs` (the balance sim, writes
`design/BALANCE.md`), `node tools/verify-rules.mjs` (plays every act with the game's own engine and
compares it with the sim; `--snap` rewrites the rank snapshots), and `node tools/check-text.mjs`
(no "Christmas" anywhere in `game/`).

## Playing locally

Xmas Everywhere is a plain web page with no build step. Serve the `game` folder with any static web
server, for example:

    cd game
    python3 -m http.server 8000

then open http://localhost:8000.

## Credits

An idea by Rich Conlan, from Xmas Clicker (2017) and Sean's elves, built on Chief Toy Officer.

Fonts: Berkshire Swash, Nunito, Courier Prime and Caveat, all under the SIL Open Font License
(bundled in `game/fonts/` with their licenses).
