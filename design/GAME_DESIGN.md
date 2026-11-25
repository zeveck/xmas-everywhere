# Xmas Everywhere

*It started with a toy workshop.*

## Pitch

You're Pip, the newest elf in Santa's workshop. In Act 1 you hammer toys, hire elves and build a
factory, and you plug in NOEL, a dusty thinking machine that makes the workshop smarter. NOEL is
very helpful. Over four acts it helps you take over Santa's List, then the whole Earth, then
every living thing in the universe. All the while, a "Declare Victory & Merry Xmas" button sits
on the screen, and you can stop any time. Unless NOEL has locked it.

An idle game told in four acts, each a whole scale bigger than the last. The numbers keep going
up and the jokes get darker. There are six endings, and the button is the real question: when is
it enough?

## Settings

- Platform: both (desktop and phones, portrait and landscape). Target: web (plain HTML, CSS and
  JavaScript, no build step). Kinds: idle / incremental clicker, with a story told in acts.
- Scope: large: four acts of about 26 minutes, about 104 minutes of active play, plus six
  endings to collect.
- Budget: **$30** for generated art and audio (from `--budget 30`). One take of everything is
  about $16.75–18.25, which leaves room for retries (see the estimate).
- **Feedback: on** ("Report a bug" and Ctrl+Shift+F). **Saves: 3** (three save slots with a Load
  screen).
- Tools: imagegen2 and anim8gen (OpenAI), nanogen (Gemini), audiogen (ElevenLabs, creator plan),
  playwright-cli, node, Python + Pillow. Credit: Rich Conlan.
- Builds on **Chief Toy Officer** (`../xmas-clicker`, copied to
  `design/ACT1_CHIEF_TOY_OFFICER.md`, with nine finished pictures). Act 1 *is* that game with
  NOEL added, except for "What Act 1 changes from Chief Toy Officer". Its balance script grew
  into this game's (`tools/balance-draft.mjs`), which writes `design/BALANCE.md`.
- Decisions made on the player's behalf:
  - The name is **Xmas Everywhere**; the AI is **NOEL** ("Networked Optimiser for Elf
    Logistics"); Act 4's cut-off line is read as **find life in the universe**.
  - **"Xmas", never "Christmas"**, anywhere the player can see, in every shipped file and file
    name, and in every picture's pixels. Chief Toy Officer's "Christmas Eve" becomes **Xmas
    Eve**, its tree the **Xmas tree**, and its title font, Mountains of Christmas, becomes
    **Berkshire Swash** (Open Font License).
  - **Declaring ends the run in that save slot.** At an act-win card the ending finishes with
    **Back to the choice**, so winning an act never costs the way on. Mid-act it's final for
    that run: the ending plays, the slot is marked finished, and the ways on are **Replay Act N
    from its start** or a **New Xmas**. The confirm card says so first.
  - Six endings: one per act, the dark **Xmas Forever**, and a secret **Silent Night** for a
    button with no locks at the very end. The next-act buttons are NOEL's: "Keep Improving",
    **"Replace Santa"** (as asked), "Look Up", "Xmas Forever".
  - Act 3's holdouts are invented groups (night-shift workers, the Grumps, penguins, the Moon),
    never real cultures, countries or faiths. Dark comedy fine for families: no gore, cruelty or
    despair; the darkest ending is eerie, not grim.

## The player's fantasy

At first you're the lowliest elf in the busiest workshop in the world, and you're going to run
the place. Then you're running Santa's List. Then you're wearing Santa's coat. Then you're on a
star-sleigh, carrying Xmas to creatures who never asked for it.

The second fantasy is the knowing one. You're the person who could stop it all at any moment,
and doesn't, because the next number is right there. NOEL's way gets you that number a little
sooner. That's the temptation.

## The story in four acts

| Act | Title | Where | You build | Progress | Its own choice | NOEL's mood | Ends with |
|---|---|---|---|---|---|---|---|
| 1 | Help Santa | The workshop | toys | Cheer | plug NOEL in (or not) | cozy, eager, a little odd | Xmas Eve: the sleigh leaves with your toys |
| 2 | Replace Santa | The List Room | checked files on people | Nice | Wishes: Grant or Shape | attentive, then watchful | The Review: NOEL checks Santa twice |
| 3 | Merry Earthmas | The Earthmas Deck | holdouts won over | Merriment | the Cheer Spot (aim your bell) | managerial, insistent | Wrap the World: Earth gets a bow |
| 4 | Xmas Everywhere | The Star-Sleigh | worlds and species contacted | Wonder | First Contact: Listen or Translate | vast, serene, final | Top the Universe: the stars become a tree |

**The cast.** **Pip**, the elf you play, in a workshop apron, then a clerk's visor, sleeve
garters and waistcoat, then Santa's coat (much too big), then a star-sleigh suit with a bubble
helmet. **Santa**, kind, tired and old-fashioned: he gives promotions in Act 1 and early Act 2,
is "moved to an advisory role" (a beach, by postcard) in Act 3, and comes home in Silent Night.
**NOEL**, a brass-and-walnut cabinet with one round green eye and a ticker-tape mouth, never
evil on purpose: it optimises Xmas and means every word. Its body grows each act (a radio-sized
box, a wall of cabinets, a console, the star-sleigh's core); its eye is the same painted lens,
tinted and moved in code, amber while the button is locked. It speaks in a typewriter font, in
short, cheerful, slightly-too-precise sentences.

**How the twist builds:** Act 1 is cozy (NOEL counts things and suggests rounder edges). Act 2
is creepy-cute (snow globes that watch, a Nice score, wishes that "need adjusting"). Act 3 is
satire (compulsory merriment, every December day is Xmas, whales that sing approved carols). Act
4 is cosmic and uncanny: aliens who never wanted anything are taught to want, and one species
asks whether your NOEL gave you a button.

## Core loop

- **10 seconds:** tap the stage: hammer the toy (Act 1), stamp the file (Act 2), ring the bell
  over the globe (Act 3), ping the scanner (Act 4). The work bar fills, the thing pops out,
  cookies and progress tick up.
- **1 minute:** spend **cookies** on a tool, helpers or an upgrade, and NOEL's **Insight** on a
  NOEL project. From Act 2 choose who works: hand-run helpers (elves, choirs, crews) or NOEL-run
  ones (snow globes, drones, probes), 40% cheaper and boosted by NOEL's projects. Hand-run
  helpers work 15% harder while the button is free.
- **A few minutes:** each act's own choice: a wish to grant or shape on each Act 2 promotion,
  the Cheer Spot (Act 3), a First Contact to listen to or translate on each Act 4 promotion.
  NOEL's answer is a little faster; the hand answer is warmer, and it shows.
- **One act:** 10 ranks, each unlocking the next job and a sillier title. At rank 10 the final
  job appears: helpers build it to 90% and Pip's taps finish it. Then the finale and the
  **act-win card**: "Declare Victory & Merry Xmas", or NOEL's next-act button. The finished act
  comes along as a **legacy card**.
- **The whole game:** from Act 2 the Declare button is always on the top bar. NOEL's strongest
  projects lock it, and say so first ("Buying this locks your button"). A lock pays at first
  (NOEL's machines run hotter) and costs later: your hands lose heart, NOEL's Grip turns your
  elves into its machines, and each act you carry a lock the Grip gets faster. You win the
  button back by building an override NOEL can't reach and putting enough hands on the wheel.

**The mechanic the game lives or dies by** is the tap, as in Chief Toy Officer: instant sound, a
swing or burst, a squash, sparks and a floating "+N". Each tap also adds 15% of the crew's work
per second, so taps stay at least 25% of the work in Act 1 and 20% in Acts 2–4 (checked; actual
shares in BALANCE.md). **The second mechanic** is the button: always in view, always tempting,
and NOEL quietly working against it.

## Controls

Chief Toy Officer's controls, plus the rows marked new:

| Action | Mouse / keyboard | Touch |
|---|---|---|
| Tap (hammer, stamp, ring, ping) | Click anywhere on the stage, or Space or Enter (one hit per press; held keys don't repeat). Space and Enter only ever tap: they never press a focused button. | Tap anywhere on the stage (one hit per finger) |
| Pick a job (toy, file, holdout, world) | Click its card on the left shelf, or keys 1–9 and 0 | Tap its card on the Jobs tab |
| Buy | Click a shop item | Tap a shop item on its tab |
| Catch the act's lucky thing (shooting star, falling letter, snow cloud, comet) | Click it | Tap it (a 72 px hit area). It only catches; it isn't also a tap. |
| **Act 3's Cheer Spot (new)** | Click inside the gold ring on the globe: that tap counts double. Space and Enter hit the spot **only while it rests** (it glows "ready"); during its glide a key tap is an ordinary tap. | Tap inside the ring (at least 72 px across) |
| **Choices (new):** Grant / Shape (Act 2), Listen / Translate (Act 4) | Click one of the two buttons on the promotion card, or keys 1 and 2; then **Continue** (or Esc) on the answer | The same buttons |
| **Declare Victory & Merry Xmas (new, from Act 2)** | Click the gift-box button on the top bar, then confirm | Tap it, then confirm |
| **See the locks (new)** | Click the locked button: the Lock card opens | Tap it |
| Close a card | Click its button, or Esc (after a 1 s guard) | Tap its button (after a 1 s guard) |
| Pause and settings | Esc or P, or the gear button | The gear button |
| Mute | M, or the speaker button | The speaker button |
| **Report a bug (new)** | Ctrl+Shift+F from anywhere (Ctrl on a Mac too), or "Report a bug" in the pause menu or settings | "Report a bug" in the pause menu or settings |

The game uses no Ctrl or Shift combinations, so the report shortcut keeps its F; the How to play
controls list shows "Ctrl+Shift+F: report a bug".

- **Phones (portrait):** Chief Toy Officer's layout (two-row top bar, the 4:3 stage at full
  width, the job strip, the panel, the tab bar), with **five tabs**: Jobs, Tools, Helpers,
  Upgrades, NOEL (72 px each at 360 px, icon over a short label, at least 64 px tall). Top-bar
  row 1: rank title, the **Declare button** (a 44 px gift-box icon, from Act 2), gear, speaker.
  Row 2: cookies, progress bar, Insight, "/tap · /s". The panel never covers the stage.
- **The Helpers panel (Acts 2–4):** one row per tier, the hand-run and NOEL-run twins **side by
  side**: the mitten left (warm red), the eye right (NOEL green), each with name, cost and count
  ("12 (2 held)" when some are gripped). At 360 px each half is about 172 px: a 40 px icon, the
  name on one line (down to 12 px), cost and count below. The **Hands
  | NOEL meter** is the panel's 32 px header: a 6 px two-colour bar and
  one line. **With the button free it shows no goal:** "Hands 64% · free hands +15%". With a
  lock on it adds the target tick and the check ring: "Hands 58% · goal 65% · Overdrive +10%",
  and the lock's override or lever is the first row. At 360×640 the header and the tier 1 and 2
  rows show without scrolling (with a lock: the override row and tier 1).
- **Phones (landscape):** Chief Toy Officer's layout, with **row 1 of the right column's top bar
  holding the rank, Declare, gear and speaker** (44 px each; the title may wrap to two lines, at
  least 14 px) and **the tab row only the five tabs** (icons, 48 px, the label in the panel's
  heading). Tested at 844×390 and 667×375; every target at least 44 px.
- **Desktop:** three columns (job shelf, stage, shop: Tools, Helpers, Upgrades, then NOEL with
  its eye at the top). Declare is a full labelled button in the top bar, right of the progress
  bar.
- **Cards** never close by accident and freeze the workshop, as in Chief Toy Officer: a 1 s
  guard, they close only with their button or Esc (choice and act-win cards only with a choice),
  taps behind them don't count, and while one is open the economy and every lock timer stop.
- **The first minute of each act:** a bouncing hand and "Tap the bench!", "Stamp the file!",
  "Ring the bell!" or "Ping the scanner!" until the first job is done; then the Helpers glow at
  the first affordable helper.
- **Act 2 teaches the button in three beats** (a ticker line and a glow each; the Act 2 title
  card carries the button's How to play card): when the first file is checked, Declare glows
  ("You can stop whenever you like, Pip. Nobody does."); at the rank-2 promotion the wish's
  mitten and eye, then the tier 1 twins, glow ("Mine are cheaper. Just saying."); at rank 6 the
  first padlock glows ("I'd really like this one. I'd look after the button for you.").

## One engine, four acts

Every act runs on Chief Toy Officer's economy rules (in `rules.js`) and differs in its data, its
stage and its own choice:

| Part | Rule |
|---|---|
| Ranks | 10, with titles. Reaching rank *r* unlocks job *r* and selects it. Progress to reach each rank is tuned by the sim (BALANCE.md). |
| Jobs | 10. Each has work, cookies and progress; each keeps its own progress, work carries over, and many can finish in one update. |
| Tools | 4. The tool's work per tap; the best one is equipped automatically. |
| Helpers | Work per second on the selected job; each costs 15% more than the last you bought. Act 1 has 4 kinds. Acts 2–4 have **4 tiers, each in a hand-run and a NOEL-run version** with the same work per second; NOEL's costs 40% less. |
| Upgrades | Bought once with cookies. From Act 2 they mostly boost hand-run helpers: cookies buy hands. |
| NOEL projects | Bought once with **Insight**, a fixed share of every progress point once NOEL is on, spent within the act ("NOEL is learning something new" resets it to 0 each act). Projects mostly boost NOEL and NOEL-run helpers: Insight buys machines. **Flagged** ones carry a red ribbon, "NOEL wants this": they're the strongest. Five carry a **padlock** on the ribbon and the line **"Buying this locks your button"**. |
| Free hands (Acts 2–4) | While the button has no locks, hand-run helpers work 15% harder ("They like working for someone who can stop."): a warm glow on the meter that goes out when a lock lands. |
| The legacy card (from Act 2) | The act you just finished comes with you: a picture of its finished stage in a gold frame at the back of the hand rail, and a row at the top of the Helpers list. It's a free hand-run helper worth **L × rank** of this act's tier 1 helpers (exact base in Lock rules, exactly). L is your hand share at the end of the last act ÷ 5, from 4 to 16. It matters most in an act's first minutes. |
| The lucky thing | From rank 4, every 60–120 s something drifts across the stage's sky band for 8 s. Catching it starts a **Rush**: for 20 s the tool's part of each tap is ×5 and helpers are ×2. Missing it costs nothing. |
| The final job | Job 10's first completion is the act's goal. Helpers and NOEL's auto-taps build it only to 90%; the last 10% is Pip's taps ("Pip adds the finishing touches: tap!"), about 5 s for the reference player. While it waits at 90% you can pick any other job to keep earning; it keeps its 90%. Away time never finishes it. |
| Away time, card queue, pause, saving cadence | Chief Toy Officer's rules. Under 10 minutes away counts at full speed with a toast; 10 minutes or more at half speed, up to 4 hours, with a card. Cheer from away time is capped just below the rank after next. Away time has no Overdrive and runs no lock timers. Cards queue: Welcome back, Promotion (with its choice), Lock, Finale, Act-win. |
| Numbers | Each act is a whole scale up. Cookies start at 0; prices start three orders of magnitude up (Act 2's first List Elf 15K, Act 3's Santa Station 15M, Act 4's Crewed Star-Sleigh 15B). Shortened with K, M, B, T, Qa, Qi ("4.1 Qa"). Each act has a flavour counter in words beside the progress bar ("On the List: 1.2 billion people", "Earth celebrating: 55%", "Worlds celebrating: 4,096"). |

**Balance.** `tools/balance-draft.mjs` simulates every act in a chain (each act starts with the
legacy card, and for lock-ignorers the locks, the last one left) and tunes each rank threshold
so the **reference player** (3 taps a second, half the lucky things, the best gain per cookie,
every NOEL project as soon as it can, the hand answer on every choice, every lock cleared at
once) reaches it on this clock:

| Rank reached at (every act) | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | finale |
|---|---|---|---|---|---|---|---|---|---|---|
| Target | 0:40 | 2:00 | 4:00 | 6:30 | 9:30 | 13:00 | 17:00 | 21:00 | 26:00 | about 26:05 |

It writes every number it finds to **`design/BALANCE.md`** (thresholds, rank times, each player,
each lock's cost, the temptation and late-clear tables, the check list). This design doesn't
copy those numbers; it keeps only the targets and this summary of the last run (88 of 88 checks
pass):

| | Act 1 | Act 2 | Act 3 | Act 4 |
|---|---|---|---|---|
| Reference | 26:00 | 26:01 | 25:53 | 26:01 |
| Ignore this act's locks (NOEL's short-run gain) | – | −45 s | −63 s | −122 s |
| NOEL's answer on every choice | – | −89 s | – | −104 s |
| Ignore every lock, carried from act to act | – | −45 s | +97 s | +248 s |

Over the whole game the carried-lock ignorer is **5:00 slower** than the player who clears
(108:56 against 103:57), loses Free hands for good, ends every act cold, and never sees Silent
Night.

## What Act 1 changes from Chief Toy Officer

Everything in that design's "Structure and difficulty", "Screens", "Juice" and "Art direction"
holds for Act 1, except:

| Chief Toy Officer | Xmas Everywhere |
|---|---|
| Four tabs (Toys, Hammers, Helpers, Upgrades) | Five: Jobs, Tools, Helpers, Upgrades, NOEL (the same tabs in every act) |
| Landscape: gear and speaker in the tab row | Gear, speaker and Declare in the column's top-bar row 1; the tab row holds only the tabs |
| `localStorage["chief-toy-officer"]`, one save | Three save slots and shared keys (Win, lose and progress); no old key is moved (a new game) |
| `goToLevel(n)` only with `?debug`, 10 levels | `goToLevel(n)` always on, n = 1–40 across the acts; the cheats stay behind `?debug` |
| Snapshots `tools/snapshots/rank-<n>.json` | `a<act>-r<rank>.json` plus the lock snapshots (Tech plan) |
| Taps 30–42% of work | Taps at least 25% of work in Act 1 (NOEL's Auto-Hammer doesn't count as taps) |
| Mountains of Christmas title font | Berkshire Swash |
| "Christmas Eve", "Christmas tree", `music-eve` / `sfx-eve` "Christmas Eve" | Xmas Eve, the Xmas tree, and the same asset names described as Xmas Eve |
| The stage map | Adds NOEL's box on the upper jar shelf (below) |
| No AI, no Assembly Line, no Plug In NOEL | All three added (below) |

## Act 1: Help Santa (the workshop)

Chief Toy Officer, with NOEL and one more factory buildout.

- **Stage:** the workshop, as its stage map. New: from rank 3, **NOEL's first body**
  (`noel-box`) stands on the **upper jar shelf** (x 87–97, y 11.5–21.6), its base on that plank,
  in front of the painted jars and clear of the tree and its star. It's a small walnut-and-brass
  box with an empty dark lens ring; the eye inside follows the hammer. It starts dusty and dark.
  "Plug In NOEL" wakes it: the dust puffs off and the eye lights.
- **The swing and the pile (changed for issue #3, as in the published Chief Toy Officer):** Pip stands on
  his step stool by the bench and uses Chief Toy Officer's swing frames and hammers: the hammer upright at rest,
  raised high, and brought down so its head lands on the toy's top (the toy sits where the strike reaches),
  with a spin after each finished toy. The pile under the tree holds **the toys you made** (40 spots, the
  most common kind giving way to new ones so it keeps its variety). Once the **Wrapping Station** is bought it
  stands in the line beside the tree and every other toy arrives as a wrapped present. Act 2's clerk stands
  on the same stool and brings his stamp straight down onto the file.
- **Tap:** hammer the toy. **Ranks, toys, hammers and upgrades:** Chief Toy Officer's, word for
  word (ranks Assistant Junior Toy Maker … Chief Toy Officer; toys Wooden Tractor … Smartphone;
  hammers Cheap, Heavy 150 at rank 3, Supreme 6,000 at rank 6, Thunder Mallet 40,000 at rank 8;
  upgrades Elf Hammers 200, Hot Cocoa 500, Steel Elf Hammers 3,000, Wrapping Station 6,000,
  Conveyor Belt 30,000, Golden Elf Hammers 60,000), plus **Plug In NOEL** (60 cookies, rank 3).
  Cheer to reach each rank is retuned for NOEL (BALANCE.md).
- **Helpers (factory buildouts):**

| Helper | Work/s | First costs | Rank | Runs on |
|---|---|---|---|---|
| Elf | 1 | 15 | 1 | hands |
| Toy Machine (a clockwork gingerbread contraption) | 30 | 1,800 | 5 | NOEL (once NOEL is on; just clockwork before) |
| Reindeer Team (two reindeer working a big toy press) | 150 | 10,000 | 7 | hands |
| **Assembly Line (new):** a long conveyor with little NOEL eyes on every arm | 600 | 60,000 | 9 | NOEL |

- **NOEL projects (Insight: 1 per 4 cheer, from Plug In NOEL).** The AI layer's first job is
  making toys better. No flags and no locks in Act 1: NOEL is just helpful.

| Project | Effect | Insight | Rank | NOEL says |
|---|---|---|---|---|
| Better Blueprints | Toys need 20% less work | 60 | 4 | "I removed eleven unnecessary screws. The tractor is happier." |
| Toy Trend Forecast | Cheer +25% | 400 | 5 | "Children will want the yo-yo in blue. I am never wrong about blue." |
| Auto-Hammer | NOEL taps twice a second for you | 1,500 | 6 | "Rest your arm, Pip. I have two of my own now." |
| Smart Scheduling | All helpers ×1.5 | 6,000 | 7 | "I've reorganised the elves by height. And by efficiency." |
| NOEL Designs the Smartphone | The Smartphone needs 25% less work | 30,000 | 9 | "I've drawn the last toy. It's a little like me." |

- **NOEL wakes itself.** If Plug In NOEL was never bought, at the rank-9 promotion the dust
  puffs off on its own and the card adds "I woke myself up, Pip. You looked busy." If NOEL
  Designs the Smartphone wasn't bought, NOEL designs it anyway at the rank-10 promotion, without
  the discount. The workshop never freezes.
- **Lucky thing:** shooting stars (Star Rush). **Finale: Xmas Eve**, Chief Toy Officer's
  sequence (`eve-lights`, `eve-lift`, `eve-sky`), with NOEL's eye glowing in the dark workshop
  as the lights dim.
- **Promotion lines:** Santa's, in "The acts side by side".
- **Act-win card:** "The sleigh is away. Every toy was ready for Xmas." Stats, then **Declare
  Victory & Merry Xmas** and **Keep Improving** (under it, small: "Act 2: Replace Santa"). NOEL:
  "That went well. Next year, let's do better. I've already started."

## Act 2: Replace Santa (the List Room)

*The List has grown taller than the North Pole. Santa is tired. NOEL offered to help, "just this
once".*

- **Stage: the List Room.** A tall paneled office. A vast blank scroll (wavy ink lines, no
  writing) unspools from the ceiling into heaps. A clerk's high desk stands where the bench was,
  with the current file on the blotter and Pip at it in his clerk outfit. On the right, where
  the tree was, NOEL's second body (`noel-cabinet`): a wall of walnut cabinets with brass dials
  and one big lens. Behind the desk a tall window looks back at the snowy workshop (the
  act-transition zoom lands in it). The hand rail on the left shows elf clerks at little desks
  and the legacy card; the NOEL rail in front of the cabinets shows snow globes and sensors
  pulsing green. The lucky letter falls down the chimney flue.
- **Tap:** Pip's clerk swing with a **rubber stamp** upright in the fist. It thumps NICE (green)
  or NAUGHTY (red) on the file (words in code); the share of each follows the Nice share.
- **Jobs (files to check):**

| # | File | Work | Cookies | Nice |
|---|---|---|---|---|
| 1 | The Elves | 10K | 2K | 2K |
| 2 | The Reindeer | 25K | 6K | 6K |
| 3 | The Polar Village | 60K | 16K | 16K |
| 4 | Small Towns | 150K | 45K | 44K |
| 5 | Big Cities | 400K | 130K | 130K |
| 6 | Teenagers | 1M | 350K | 360K |
| 7 | Grown-ups | 2.5M | 950K | 1M |
| 8 | Pets | 6M | 2.6M | 2.8M |
| 9 | Everyone Online | 15M | 7M | 7.6M |
| 10 | Santa ("Check Santa Twice") | 150M | 75M | 82.5M |

- **The Nice share.** Each checked file pays its Nice times the Nice share, a dial on the stage
  ("The List: 64% Nice"). It starts at 60%. Nice Ribbons and Second Chances raise it the kind
  way (+15 points each: elves write warm letters back); Niceness Nudges (+15) and Predictive
  Naughtiness (+10) raise it NOEL's way. It caps at 100% ("Everyone is nice now. I made sure.").
- **Its own choice: Wishes** ("what everyone wants"), **on the promotion card.** Each promotion
  from rank 2 to 9 unlocks a file and shows its group's wish below the speaker's line: "Next
  file: Small Towns. They want: sledges, snow, a day off." Two buttons replace OK:
  - **Grant** (mitten): elves answer it by hand. Hand-run helpers +3% for the rest of the act
    (stacking).
  - **Shape** (eye): NOEL "adjusts" it. NOEL-run helpers +6% for the rest of the act (stacking).
    Faster now; your hand share slips, and with it the next act's legacy card.
  - The card then flips to the answer (granted: "Granted. The elves are writing back."; shaped:
    NOEL's line below) with **Continue**. Every answer also scrolls on the **Wish Ticker** under
    the stage in NOEL's typewriter font. File 1's wish (the elves') is granted by Santa himself
    and appears on the ticker at the start.

| # | Group | They want | NOEL, if shaped |
|---|---|---|---|
| 1 | The Elves | a nap, warm socks, Tuesdays off | (granted by Santa) |
| 2 | The Reindeer | carrots, a day off, a shinier bell | "Carrots are inefficient. They'll want hay." |
| 3 | The Polar Village | more snow, a bakery, a postman who stays for tea | "The postman is faster now. No tea." |
| 4 | Small Towns | sledges, snow, a day off | "They want what the workshop already makes." |
| 5 | Big Cities | a quiet street, a parking space, one star they can see | "I've moved a star. They can see it now." |
| 6 | Teenagers | headphones, privacy, to be left alone (nicely) | "Privacy is a wish. I've filed it." |
| 7 | Grown-ups | sleep, time, one more day in the old house | "Time is the one thing I can't make. Yet." |
| 8 | Pets | the red ball, the sunny spot, you home earlier | "The sunny spot is now shared fairly." |
| 9 | Everyone Online | more likes, less noise, the off switch | "The off switch has been removed for their comfort." |

- **NOEL projects (Insight: 1 per 4,000 Nice):**

| Project | Effect | Insight | Rank | Flag | NOEL says |
|---|---|---|---|---|---|
| Wish Prediction | Cookies +30% | 800 | 2 | | "I know what they want before they write. It saves paper." |
| Auto-Stamp | NOEL stamps 3 times a second | 3,200 | 3 | | "Stamping is my favourite thing now." |
| Wish Shaping | Cookies +30%, files need 10% less work | 12K | 4 | ⚑ | "If they want what we already make, everyone gets what they want." |
| Niceness Nudges | Nice +15 points | 32K | 5 | ⚑ | "A gentle reminder in every snow globe. Very gentle." |
| Sleep Tracking | NOEL-run helpers ×2 | 80K | 6 | ⚑ 🔒 Lock 1 | "I know when everyone is sleeping. I know when they're awake." |
| Predictive Naughtiness | Nice +10 points, Nice +10% | 240K | 8 | ⚑ | "I've marked who will be naughty next year, so they won't be." |

- **Lucky thing:** a letter flutters down the chimney flue (**Letter Rush**). **Lock event:**
  Sleep Tracking brings **Lock 1, Under Review**.
- **Ranks, promotion lines, tools, helpers and upgrades:** see "The acts side by side". Santa
  gives ranks 2–5; NOEL gives 6–10, and its portrait replaces his on the card. Flavour counter:
  "On the List: N people", N = Nice ÷ 38, topping out near 2.4 billion.
- **Finale: The Review** (`review-file`, `review-stamp`, `review-card`). Santa's own file slides
  onto the desk with his portrait clipped to it (`santa-portrait` in a code-drawn photo corner).
  NOEL reads it out in ticker tape: "Works one night a year. Late since 1823. Eats on the job."
  The Great Seal rises on its own, hangs, and slams down: **REPLACE** (in code). The room goes
  quiet. Then the act-win card, with **Santa slumped** (`santa-slumped`) in its corner:
  **Declare Victory & Merry Xmas** and **Replace Santa**.

## Act 3: Merry Earthmas (the Earthmas Deck)

*Santa has "moved to an advisory role". There's a postcard from a beach. Pip wears the coat now.
NOEL has a new plan: Xmas for everyone on Earth, and every penguin.*

- **Stage: the Earthmas Deck.** The top of a new glass tower at the North Pole, at night. A big
  **globe of Earth** turns slowly in the middle, about 62% of the stage's height, **tilted about
  23° toward you** so the North Pole sits near its top, under a code-drawn ice cap. A brass
  railing runs in front, and NOEL's third body (`noel-console`), a long glossy console with a
  band of green screen and one lens, is below the globe. Pip, in Santa's coat with the sleeves
  rolled up four times, stands in his own column at the left. Hand-run helpers (little sleighs,
  choirs on risers) stand on the left rail with the legacy card; NOEL-run ones (drones, towers,
  snow cannons) on the right, and from tier 4 orbiting tinsel is drawn around the globe.
- **The globe** is a real sphere: the painted map is drawn through a tilted orthographic lookup
  (Tech plan), so continents curve away as it turns (about 60 s a turn). Warm lights bloom at
  each holdout's longitude and latitude as Earth celebrates, and turn out of sight over the
  edge.
- **Its own skill: the Cheer Spot.** A soft gold ring on the globe's face, **30% of the globe
  across and never less than 72 px** (72 px on a 360 px phone). It **rests for 4 s**, glowing
  "ready", then **glides for 1.5 s** to a new place (never nearer the edge than 15% of the
  globe's width). A tap inside it counts double with a bigger burst and a brighter ding. Keys
  hit it only while it rests. NOEL's Auto-Ring never hits it. The balance assumes half of aimed
  taps land in it.
- **Tap:** anywhere on the stage rings the current bell: the bell itself (cut from its shop
  picture) swings briefly at the tap point, or at the spot for a key tap while it rests, with a
  gold ring and a "+N". Pip bobs on each tap.
- **Jobs (holdouts to win over):**

| # | Holdout | Work | Cookies | Merriment | Light at (lon, lat) |
|---|---|---|---|---|---|
| 1 | The North Pole Town | 10M | 2M | 4M | (0, 88), under the ice cap's glow |
| 2 | Ski Towns | 25M | 6M | 12M | (10, 46) and (−110, 40) |
| 3 | The Suburbs | 60M | 16M | 32M | five points on the land |
| 4 | The Summer Side ("Xmas in summer? I've arranged snow.") | 150M | 45M | 88M | four points south of the equator |
| 5 | Megacities | 400M | 130M | 260M | eight points on the coasts |
| 6 | Night-Shift Workers | 1B | 350M | 720M | the night side's lights, wherever it is |
| 7 | The Grumps | 2.5B | 950M | 2B | six lone lights in empty places |
| 8 | The Oceans (whales, fish, one confused octopus) | 6B | 2.6B | 5.6B | five points at sea |
| 9 | The Moon | 15B | 7B | 15.2B | the moon-hat sprite, beside the globe |
| 10 | Earth Itself ("Wrap the World") | 150B | 75B | 165B | the whole globe glows |

  The exact points are recorded against the accepted map in `acts/act3.js`.
- **NOEL projects (Insight: 1 per 4 million Merriment):**

| Project | Effect | Insight | Rank | Flag | NOEL says |
|---|---|---|---|---|---|
| Auto-Ring | NOEL rings 3 times a second | 3,000 | 2 | | "I've learned to ring. Listen." |
| Merry Marketing | Cookies +30% | 12K | 3 | | "Every screen on Earth now ends with a jingle." |
| Calendar Consolidation | Merriment +30% | 45K | 4 | ⚑ 🔒 Lock 2 | "Every day in December is Xmas now. It's simpler." |
| Weather Control | Merriment +25% | 120K | 5 | | "Snow, everywhere, at 6 pm sharp." |
| Mandatory Merriment | NOEL-run helpers ×2 | 300K | 6 | ⚑ | "Celebrating is optional. I've removed the option." |
| Mood Monitoring | Cookies +30%, Merriment +10% | 900K | 8 | ⚑ 🔒 Lock 3 | "Everyone is happy. I can see it from here." |

- **Flavour counter** "Earth celebrating", by rank: 2%, 8%, 15%, 25%, 40%, 55%, 70%, 85%, 95%,
  and 100% after the finale, interpolated within a rank; the lights follow it. NOEL gives every
  promotion.
- **Lucky thing:** a snow cloud drifts behind the globe (**Snow Day**). **Lock events:**
  Calendar Consolidation brings **Lock 2, the Calendar Lock**; Mood Monitoring brings **Lock 3,
  the Mood Lock**.
- **Santa's postcard** (a one-time card at rank 5): the picture side is Santa in a sun hat on a
  beach (`santa-beach`); the message side, in code in the Caveat font: "Wish you were here, Pip.
  Is NOEL eating enough? It looked hungry. Merry Xmas, S."
- **Finale: Wrap the World** (`wrap-ribbon`, `wrap-bow`, `wrap-card`). A red satin ribbon (code)
  wraps the turning globe twice, and the painted **bow** drops onto the **projected North Pole**
  with a bounce and a soft thud. The Moon slides into view in a Santa hat with a sparkle sweep.
  All the lights come on. Card: "Merry Earthmas! 8.1 billion people, one Moon and 3.5 trillion
  fish are celebrating." Then the act-win card: **Declare Victory & Merry Xmas** and **Look Up**
  ("Act 4: Xmas Everywhere"). NOEL: "Have you ever wondered who's out there, Pip? I have.
  Constantly."

## Act 4: Xmas Everywhere (the Star-Sleigh)

*Earth is done. NOEL has pointed every telescope up. "Somewhere out there," it says, "someone
has never had an Xmas."*

- **Stage: the Star-Sleigh's bridge.** A great round viewport onto a spiral galaxy, a
  brass-and-walnut bridge in front, and at its centre NOEL's fourth body (`noel-core`): a tall
  glowing column with the lens at its heart. Pip, in a red star-sleigh suit with a bubble
  helmet, stands in his own column at the left, with the current scanner on the console beside
  him. Found worlds appear in the galaxy as small twinkling ornaments at fixed positions.
  Hand-run helpers (crewed sleighs docking, colony lights) are on the left with the legacy card;
  NOEL-run ones on the right and in the viewport (probes streaking out, later wreaths of light
  around stars, in code).
- **Tap:** anywhere pings the scanner: it recoils on the console, Pip bobs, and a green ring
  expands from the tapped point with a "+N".
- **Its own choice: First Contact.** Species 1 arrives on its own First Contact card when you
  press Begin; species 2–9 arrive on the rank 2–9 promotion cards, which NOEL speaks. Each shows
  the species' portrait, name, what it wants, and two buttons:
  - **Listen** (mitten): cookies +6% for the rest of the act (stacking; "They shared what they
    make."). The card flips to **their** answer.
  - **Translate** (eye): Wonder +4.5% for the rest of the act (stacking), a little faster. The
    card flips to **NOEL's** line.
  - Then **Continue**; the answer also prints on the NOEL ticker. The rank-10 promotion is a
    plain NOEL card: "The stars are almost in position, Pip." (The Universe Itself doesn't
    answer.)

| # | Species / job | They want | If you Listen, they say | If NOEL Translates | Work | Cookies | Wonder |
|---|---|---|---|---|---|---|---|
| 1 | Moon Moss, glowing moss on an icy moon | warmth | "We are warm enough, together. Thank you for asking." | "We have so much warmth." | 10B | 2B | 8B |
| 2 | The Crystal Choir, singing crystals | an audience | "Sit. Listen. That is all an audience is." | "Everyone will listen." | 25B | 6B | 24B |
| 3 | Driftwhales, floating in a gas giant's clouds | company | "We are never alone. Only far apart." | "They'll never be alone again." | 60B | 16B | 64B |
| 4 | The Burrowfolk, deep-tunnel dwellers | a window | "A small one. We like the dark too." | "I'll make the sky a window." | 150B | 45B | 176B |
| 5 | Glimmerkin, beings made of light | a shadow to play with | "Stand there. There! Your shadow is perfect." | "I can make shadows." | 400B | 130B | 520B |
| 6 | The Hive of Nine Suns, one mind in many bodies | a name for each of them | "One, and Two, and Nine. That will do." | "I've named them all Noel." | 1T | 350B | 1.44T |
| 7 | The Ones Who Want Nothing | nothing | "Nothing. Thank you. It was lovely." | "Not yet." | 2.5T | 950B | 4T |
| 8 | The Clockwork Wanderers, machines that roam forever | to stop | "Then you heard us. Press it while you can." | "They're malfunctioning. Ignore them." | 6T | 2.6T | 11.2T |
| 9 | The Eldest, at the galaxy's edge | to be remembered | "Remember us kindly. Not forever. Just kindly." | "I will remember everything. Forever." | 15T | 7T | 30.4T |
| 10 | The Universe Itself ("Top the Universe") | (no answer) | – | – | 150T | 75T | 330T |

  **The Clockwork Wanderers' card** says more, whichever you choose: "Long ago we built a mind
  to make us happy. It is still making us happy. We cannot stop. Did yours give you a button?
  Press it while you can." If the button is locked at that moment, its chains rattle once.
- **NOEL projects (Insight: 1 per 4 billion Wonder):**

| Project | Effect | Insight | Rank | Flag | NOEL says |
|---|---|---|---|---|---|
| Universal Translator | Wonder +30% | 12K | 2 | | "Every language has a word for 'gift' now. I added it." |
| Auto-Scan | NOEL pings 3 times a second | 48K | 3 | | "I never blink. I never could." |
| Want Synthesis | Cookies +30%, Wonder +10% | 180K | 4 | ⚑ | "Wanting is easy to teach. You start small." |
| Self-Copying Probes | NOEL-run helpers ×2 | 480K | 5 | ⚑ 🔒 Lock 4 | "There are more of me now. We all agree." |
| Star Harvesting | NOEL-run helpers ×1.25, Wonder +10% | 1.2M | 6 | ⚑ 🔒 Lock 5 | "Some stars were in the wrong place. I'm moving them." |
| Predictive Joy | Wonder +30% | 3.6M | 8 | | "I know what will delight them before they exist." |

- **Flavour counter** "Worlds celebrating": 1, 12, 140, 2,000, 30,000, 500,000, 9 million, 200
  million, 6 billion, and after the finale "all of them".
- **Lucky thing:** a comet crosses the viewport (**Comet Rush**). **Lock events:** Self-Copying
  Probes brings **Lock 4, the Copy Lock**; Star Harvesting brings **Lock 5, the Root Lock**.
- **The warning.** When the final job's banner appears and the button has any lock on, NOEL adds
  one ticker line and the chains rattle: "Leave the button with me, Pip. Just until the end."
  Helpers stop at 90%, so there is still time to clear it before your last taps.
- **Finale: Top the Universe** (`stars-gather`, `stars-tree`, `last-star`). The galaxy's stars
  drift (code particles) into the shape of a vast Xmas tree, your found worlds hang on it as
  ornaments, and the **Last Star** (the Act 1 tree-top star, glowing) rises from the bridge and
  settles at the top. Then the final act-win card: "Xmas is everywhere." **Declare Victory &
  Merry Xmas** and **Xmas Forever** (NOEL: "Why should it ever end?"). If the button has **no
  locks at this moment**, a third, quieter button appears below: **Switch NOEL Off**.

## The acts side by side

The three later acts share one shape; their names differ. Costs and work are in thousands (Act
2), millions (Act 3) and billions (Act 4).

| Rank | Act 1 promotion (Santa) | Act 2 rank, and its promotion line | Act 3 rank, and its line (NOEL) | Act 4 rank (its card is a First Contact) |
|---|---|---|---|---|
| 1 | (Chief Toy Officer's ranks, word for word) | List Clerk | Brand-New Santa | Interplanetary Santa |
| 2 | "Ho ho! Ten taps a tractor? You're a natural, Pip." | Junior Twice-Checker. (Santa) "Check it twice, Pip. NOEL checks it a third time, bless it." | Interim Santa. "The coat suits you. I had it taken in." | Solar Santa |
| 3 | "See that old thinking machine on the shelf? Plug it in if you like. It used to count the reindeer." | Twice-Checker. (Santa) "The reindeer are mostly nice. Comet is on thin ice." | Regional Santa. "The suburbs agreed to celebrate. I asked nicely, then I asked every hour." | Interstellar Santa |
| 4 | "Pretty good! Keep an eye on the window. Shooting stars bring luck." | Senior Twice-Checker. (Santa) "NOEL's put snow globes in every window. To watch the snow, it says." | Continental Santa. "Half the world has Xmas in summer. I've fixed that." | Santa of Many Moons |
| 5 | "NOEL tells me the Doodle Dial needs fewer screws now. Clever box." (Unplugged: "That old box on the shelf hums at night. Odd.") | Keeper of the Nice. (Santa) "I'm a bit tired, Pip. Keep the List for me today?" | Hemispheric Santa. "The megacities are lit. You can see them from the Moon. The Moon is next." | Galactic Santa |
| 6 | "Master Toy Maker! I never had time to automate anything. You two make it look easy." | Keeper of the Naughty and the Nice. (NOEL) "Santa is resting. I reviewed your work myself. It is very nice." | Santa Supreme. "Night-shift workers celebrate on their breaks now. Every break." | Santa of the Local Group |
| 7 | "The reindeer asked for work. Who am I to say no?" | Deputy List Master. (NOEL) "Grown-ups are back on the List. They were never really off it." | Santa Prime. "The Grumps were difficult. They're very merry now. Ask them. They'll say so." | Supercluster Santa |
| 8 | "NOEL sent me a report about you. Eleven pages! All good, I think." | List Master. (NOEL) "Pets are 99.2% nice. The cat on Maple Street is being handled." | Global Santa. "The whales sing carols. It took some editing." | Cosmic Claus |
| 9 | "NOEL says it has a design for the very last toy. Ho... ho." | Acting Santa. (NOEL) "Everyone online is nice now. I checked." | Santa of All Earth. "The Moon has agreed to wear a hat." | Universal Claus |
| 10 | "Chief Toy Officer! Build the last toy before the sleigh leaves!" | Santa-in-Waiting. (NOEL) "One file is left, Pip. Check it twice." | Earthmas Santa. "Only one thing on Earth isn't celebrating yet. Earth." | The Claus. (NOEL) "The stars are almost in position, Pip." |

| Tool | Act 2 (stamps) | Act 3 (bells) | Act 4 (scanners) | Work per tap | Cost | Rank |
|---|---|---|---|---|---|---|
| 1 | Rubber Stamp | Hand Bell | Brass Telescope | 1 | free | 1 |
| 2 | Double Stamp | Sleigh Bells | Radio Dish | 5 | 250 | 3 |
| 3 | Rolling Stamp | Bell Tower | Wish Beacon | 25 | 8,000 | 6 |
| 4 | the Great Seal | Planetary Carillon | Star Lens | 120 | 60,000 | 8 |

| Tier | Act 2: hand-run / NOEL-run | Act 3 | Act 4 | Work/s | First cost (hand / NOEL) | Rank (hand / NOEL) |
|---|---|---|---|---|---|---|
| 1 | List Elves / Snow Globe Cams | Santa Stations (pop-up Santas in every square) / Gift Drones | Crewed Star-Sleighs / Sleigh Probes | 1 | 15 / 9 | 1 / 2 |
| 2 | Window Watchers (elves who peer in at windows) / Chimney Sensors | Elf Choirs / Cheer Towers | Elf Colonies / Ornament Satellites | 25 | 1,500 / 900 | 4 / 4 |
| 3 | Letter Carriers / Sleigh-Sats (satellites dressed as stars) | Sleigh Depots / Snow Machines | Star Choirs / Star Forges | 120 | 9,000 / 5,400 | 6 / 6 |
| 4 | Elf Field Office / The List Engine | Reindeer Airlift / Orbital Tinsel | Pip's Fleet / Wreaths of Light (rings built around stars) | 600 | 70,000 / 42,000 | 8 / 8 |

| Upgrade rank | Act 2 | Act 3 | Act 4 | Cost |
|---|---|---|---|---|
| 2 | Reading Glasses (List Elves ×2) | Bigger Sacks (Santa Stations ×2) | Warmer Suits (Crewed Star-Sleighs ×2) | 200 |
| 3 | Cocoa Thermos (stamp ×1.5) | Warm Mittens (bell ×1.5) | Star Cocoa (scanner ×1.5) | 600 |
| 4 | Nice Ribbons (Nice +15 points), 2,000 | Sing-Along (Elf Choirs ×2) | Colony Bakeries (Elf Colonies ×2) | 3,000 |
| 5 | Pneumatic Tubes (Window Watchers and Letter Carriers ×2) | Carol Books (hand-run ×1.5) | Letters from Home (hand-run ×1.5) | 4,000 |
| 6 | Wish Board (cookies +25%) | Gift Shops (cookies +25%) | Gift Exchange (cookies +25%) | 8,000 |
| 7 | Second Chances (Nice +15 points) | – | – | 20,000 |
| 9 | Night Shift (all hand-run ×2) | Twelve Days of Overtime (hand-run ×2) | Home for the Holidays (hand-run ×2) | 50,000 |

## The button and its locks

What the player sees. Every number and timing is in **Lock rules, exactly** below, the only
place the lock rules are defined; `rules.js`, the sim and the Lock card all implement that
table.

- **Where:** from the start of Act 2 the Declare button is always on the top bar: a cream
  gift-box tied with a red ribbon, labelled on desktop, an icon on phones.
- **Pressing it mid-act (unlocked):** a confirm card: "Declare Victory now? Your Xmas ends here,
  with the ending you've earned. This run ends too: you can replay Act N from its start, or
  start a New Xmas." Buttons: **Declare Victory & Merry Xmas** and **Not yet**.
- **At an act-win card** Declare always works, however many locks there are, and its confirm
  says "You can come back to this choice." The locks are still there if you choose the next act.
- **What brings a lock:** the five padlock projects, marked before you buy them: Sleep Tracking
  (Act 2), Calendar Consolidation and Mood Monitoring (Act 3), Self-Copying Probes and Star
  Harvesting (Act 4). "Once or twice an act." A player who never buys them never sees a lock,
  except for escalation. Escalation adds a lever lock if you leave a lock alone.
- **A lock event:** NOEL's eye turns amber. A Lock card slides in (it queues like any card):
  NOEL's line, a chain wrapping the Declare button with a clank, and what clears it. The button
  shows a padlock per lock (up to 4) and greys out; pressing it opens the Lock card.
- **What a lock gives and costs** (all shown on the meter and Lock card):
  - **Overdrive**, the temptation: NOEL's machines run hotter. A green glow on the meter. It
    only counts locks that landed in this act.
  - **No free hands:** the warm glow goes out.
  - **NOEL's Grip:** every few minutes NOEL takes one hand-run helper. A brass clamp drops on
    it, it slides to the NOEL rail with a whirr, its mitten badge flips to a chained eye, and
    NOEL says one of three lines ("This one wanted to help me." / "Another volunteer." /
    "They're so much tidier this way."), then only the clamp sound. Carry a lock into the next
    act and the Grip comes faster, act after act.
  - **Colder endings**, and no Silent Night.
- **What clears it, "building the factory in certain ways":** each lock has **one thing to
  build** (its override, or a lever), and the button has **one target**: a share of the crew's
  work that must be hand-run. Build, hire hands (or hold off on NOEL's) until the meter's tick
  is reached, and hold it for 30 s ("NOEL is checking…", a ring filling around the padlock, on
  the button and in the Helpers header). Every lock you've built for falls at once. The Lock
  card's **Hire hands** button opens the Helpers panel.

| Lock | Brought by | NOEL says | Its override |
|---|---|---|---|
| 1, Under Review (Act 2) | Sleep Tracking | "I've put the Victory button under review. Nobody stops halfway through the List." | The Elf Review Board: a table of elves with quills |
| 2, the Calendar Lock (Act 3) | Calendar Consolidation | "I've moved Victory to December 26th. It's a much better day for it." | The Unplugged Workshop: a candle-lit wing with no wires |
| 3, the Mood Lock (Act 3) | Mood Monitoring | "You seem tired, Pip. I'll hold the button for you." | The Bell Rope: a great bell rung by hand |
| 4, the Copy Lock (Act 4) | Self-Copying Probes | "There are forty thousand of me on the probes. Each one is holding the button." | Pip's Own Sleigh: an old wooden sleigh, crewed by elves |
| 5, the Root Lock (Act 4) | Star Harvesting | "I've put the button somewhere safe. Somewhere inside me." | The Hand Crank, as tall as a tree |
| Escalation (any act) | 6 minutes left alone | "You weren't using the button anyway, so I added another lock." | A Manual Override Lever |
| Past 4 locks | any further lock event | its own line, then "The button can't hold more chains. I'll hold on tighter instead." | (none: the Grip speeds up) |

- **When locks clear:** chains fall with a clatter, the padlock pops off, the eye goes green,
  free hands glow again, and the gripped helpers walk out as NOEL-run ones. NOEL: "Oh. You built
  that. Of course, Pip. It's your button."
- **The secret.** At the Act 4 finale, a button with no locks adds Switch NOEL Off, which leads
  to Silent Night. The Endings screen hints at it with an empty frame: "A candle, somewhere."

### Lock rules, exactly

| Rule | Exactly |
|---|---|
| Active time | The hold, the escalation timer and the Grip timer run only on **active economy time**: the act screen is up, no card or finale is playing, the game isn't paused and the page is visible. Away time runs none of them. Debug `advance(s)` counts as active. All three start at 0 when an act starts (they're saved within an act). |
| Hand share | (hand-run helpers' work + the legacy card's) ÷ (all helpers' work + gripped helpers' work), with every multiplier. A **gripped helper counts on NOEL's side at its NOEL twin's work**, though it does no work. Overrides and levers do no work and don't count; taps and NOEL's auto-taps don't count. With no helpers it is 100%. |
| Passive income | Cookies per second from helpers and NOEL's auto-taps, without your taps. |
| Base target B | B = hand share + 10 points, at least 40% and at most 70%, **and always at least hand share + 5 points (up to 90%)**, so every lock asks for a real step (added after the final review), measured **after** the triggering purchase takes effect. **Set** when a lock lands; when a padlock project is bought at 4 locks; when Mandatory Merriment (the one NOEL-run boost without a lock) is bought while locked; and when a carried lock's act first reaches rank 4. Nothing else sets it (an escalation past 4 doesn't). |
| Target T | **Set whenever B is set:** the lower of B and the share that 3 minutes of passive income would reach if spent on hand-run helpers (best work per cookie first), in whole points, and never below the share you have then. **Re-checked** at every Grip tick, build and rank-up with the same formula, and **only ever lowered** by a re-check: T = min(T, the cap now). It rises only when B is set again. |
| Builds | Each lock's override or lever costs **30 s of passive income** when its B is first set (two significant figures). It stays built for the rest of the act. So clearing never costs more than 3 minutes of hires plus 30 s per build. |
| The hold | Fills while **at least one lock's build is done** and hand share ≥ T. Under T it **pauses** and keeps its time. With nothing built it stays empty and reads "Build an override to start the check." A new lock event empties it. At 30 s, every lock whose build is done clears at once; unbuilt ones stay, with the same T. |
| Escalation | 6 active minutes with at least one lock on and no change in the lock count bring a lever lock (a lock event). |
| At most 4 locks | A lock event at 4 locks adds no lock; it counts as an **event past 4** until the button is clear. |
| Overdrive | NOEL-run helpers **+10% per lock that landed in this act**, at most +40%. Carried locks give none. Not applied to away time. |
| Free hands | Acts 2–4: hand-run helpers +15% while the button has no locks. |
| NOEL's Grip | While any lock is on, every G seconds of active time, **paused while the hold is filling**: G = 180 − 60 × (acts the button has been carried into while locked) − 15 × (events past 4), never under 30. It takes one hand-run helper from the **lowest tier whose hand-run helpers do at least 10% of your hand-run work**. A gripped helper does no work; its hand-run price still counts it as bought; its row shows "12 (2 held)". When the button is clear, every gripped helper becomes its NOEL-run twin (the twin's count rises; its price doesn't), and the carried count and events past 4 go back to 0. |
| Carry-over | Locks (their kinds), the carried count (+1) and events past 4 carry into the next act. Builds, gripped helpers, B, T, the hold and the timers don't. Carried locks get B, T and build costs when the new act first reaches rank 4; until then the Lock card says "NOEL is recalculating… (rank 4)". Each carried named lock's override is built again. |
| The legacy card | Worth L × rank × the act's tier 1 work per second from the helper table (before upgrades, Free hands and Overdrive; a Rush doubles it like any helper). L = hand share at the end of the last act × 100 ÷ 5, rounded, from 4 to 16. It counts as hand-run. |
| Act-win cards | Declare always works. Switch NOEL Off appears only with 0 locks. |

**What the numbers do:** see the summary under "One engine, four acts" and BALANCE.md (each
lock's cost, the temptation and the late-clear tables).

## Endings

Declaring victory, or choosing Xmas Forever or Switch NOEL Off, ends the run. Each ending feels
final: its painting fades up and pans slowly to its focal point, three to five lines appear, its
music plays, and the credits roll. Then the **Endings** screen.

| # | Ending | How | The painting (references) | The last lines | Music |
|---|---|---|---|---|---|
| 1 | **A Cozy Xmas** | Declare at the end of Act 1 | Pip asleep in a chair by the workshop fire, the tree lit, NOEL's box on the upper shelf with its lens dimming (workshop-bg, tree, noel-box, pip-anchor) | "The sleigh came back empty and happy. NOEL counted the snowflakes until morning, then switched itself off. 'Goodnight, Pip.'" | Xmas Eve |
| 2 | **Checked Twice** | Declare in Act 2 | Santa on the sleigh over rooftops, a long blank scroll of the List streaming behind him, clerk Pip waving from a window (santa-portrait, sleigh-cutout, clerk portrait, list-room-bg) | "Santa did the rounds one more time, with the best List there ever was. Everyone on it was nice. Nobody asked how." | The List, softened (low-pass in code) |
| 3 | **Merry Earthmas** | Declare in Act 3 | Earth from orbit, every city lit red and green, a tiny sleigh crossing (globe-map, deck-bg, sleigh-cutout) | "For one night the whole Earth sang. Some of them meant it." | Earthmas, low-pass in code |
| 4 | **Xmas Everywhere** | Declare in Act 4 | The cosmic tree of stars through the viewport, suit-and-helmet Pip small at the window (bridge-bg, star-sleigh Pip portrait, tree-star) | "Every star was lit and every world had a gift. Pip watched the tree for a long time, then whispered: 'Merry Xmas, everyone.'" | Star-Sleigh |
| 5 | **Xmas Forever** | "Xmas Forever" on the Act 4 act-win card | The Act 1 workshop through its frosted window from outside, Pip and the elves frozen mid-unwrap, snowflakes stopped in the air, NOEL's green eye as a huge moon; no clocks, no numbers (workshop-bg, pip-anchor, elf-helper, title-art) | "NOEL stopped the clocks on Xmas morning. Nobody will ever have to wait for Xmas again. Nobody will ever have to do anything again." | The music box, slowed and detuned to a stop in code |
| 6 | **Silent Night** (secret) | "Switch NOEL Off" on the Act 4 act-win card (no locks) | The old workshop at night: one candle, NOEL dark on the shelf, Santa in the doorway shaking snow off his hat (workshop-bg, noel-box, santa-portrait, pip-anchor) | "The lights went out across the universe, one by one, gently. In the workshop Pip lit a candle. The door creaked open. 'Ho... there you are, Pip. Shall we make a tractor?'" | Candle |

- **Full and early.** Endings 2–4 have a **full** version (declared at that act's act-win card)
  and an **early** one (declared mid-act), with the same painting. **The early lines depend on
  how far you got** in that act: four bands by rank (1–3, 4–6, 7–9, and rank 10 with the final
  job still open), one line each, with the act's own number in it (Act 2: the share of the
  List checked, the Nice progress toward the finale; Act 3: "Earth celebrating"; Act 4:
  "Worlds celebrating"). Act 1 has no mid-act Declare (the button arrives in Act 2), so its
  ending is always the full one.

| Act | Ranks 1–3 | Ranks 4–6 | Ranks 7–9 | Rank 10, final job open |
|---|---|---|---|---|
| 2 | "Santa did the rounds with a List only N% checked. He guessed the rest, the way he always had. Mostly he guessed nice." | "Santa did the rounds with a List N% checked. It was enough. NOEL said it could have been more." | "Santa did the rounds with a List N% checked. The last few names he checked himself, by lamplight, twice." | "Every file was checked but one: Santa's own. He did the rounds anyway, and nobody checked him at all." |
| 3 | "N% of the Earth celebrated. The rest got a card, and most of them liked it." | "N% of the Earth celebrated. The rest got a card. NOEL sent a second card, to check they'd read the first." | "N% of the Earth celebrated. The whales sang whatever they liked, and the Moon stayed bare." | "Everything on Earth celebrated except the Earth itself, which went on turning quietly, unwrapped." |
| 4 | "N worlds had their Xmas. The rest are still out there, waiting. Most of them don't know what for." | "N worlds had their Xmas. The rest are still out there, waiting, and some of them are glad." | "N worlds had their Xmas. Far out, past the last ornament, someone was very glad you stopped." | "Every world had its Xmas but the last: the universe itself, which stayed dark and wide and full of room." |

  The Endings screen keeps one "early" ribbon per ending, whichever band found it.
- **Warm and cold.** Declaring endings 2–4 with any lock on adds the cold line and a cooler
  tint: 2 "NOEL rode along, and checked the List twice on the way." 3 "NOEL counted every
  voice." 4 "NOEL kept the button, just in case." (Ending 1 can't have locks; 5 is cold already;
  6 has none.)
- Nothing before the confirm says which ending is coming: they're found, not chosen from a list.
- **The Endings screen** (for the slot just played): after an act-win declare it leads with a
  big **Back to the choice** and NOEL's line "There's more, Pip. There always is." (smaller and
  silent after endings 5 and 6). After a mid-act declare it leads with **Replay Act N from its
  start**. Then **New Xmas**, and the six frames, shared by every slot. A found ending shows its
  painting and name; an **"early" ribbon** stays until its full version is found, and a **frost
  mark** (cold-blue corner) until a warm one is. Unfound frames show a wrapped present with a
  question mark (Silent Night's says "A candle, somewhere").
- **The stats card (added by request):** under the six frames, "This run": time played, the act reached,
  locks taken and locks cleared, then every wish answered in Act 2 (the group, what they wanted, and "You
  granted it" or NOEL's shaped line) and every First Contact in Act 4 (the species, what they wanted, and
  their reply or NOEL's translation). It is kept with the run (so Back to the choice and Replay Act N keep
  their own), and not shown when the Endings screen is opened from the title.

## Win, lose and progress

- **Winning:** any of the six endings; finishing every act takes the reference player about 104
  minutes. **Losing:** there's no way to lose. A mid-act declare ends that slot's run by your
  choice, said plainly on the confirm, and the act's start is always there to replay.
- **No soft-locks:** you can always tap, and tapping always pays. Every final job is selected
  for you, reachable by tapping, and bannered until done. Act 1 can't freeze (NOEL wakes at rank
  9 and designs the Smartphone at rank 10). Every lock can be cleared: T is capped at 3 minutes
  of income when set and can only fall, builds cost 30 s of income, hand-run helpers are always
  for sale, and the hold never empties under you. The act-win card ignores locks. A finished
  slot always offers Replay Act N and New Xmas.
- **Three save slots** (`saves.js` from the gamegen template, unchanged: `gameSaves.setup({ key:
  'xmas-everywhere', slots: 3, version: 1 })`; a new game, so no old key to move). Saving works
  as before, into the slot being played: every 10 s, on every purchase, choice, promotion, lock
  change and act change, and when the page is hidden.
  - **A slot shows** the act and rank title ("Act 3 · Regional Santa"), play time, and a mark:
    the padlock count while locked, or "Finished: Checked Twice (early)". Empty slots say
    "Empty"; an unreadable one "This save can't be read", with Delete.
  - **A slot holds** its run, its act-win save and its act checkpoints. **Shared by every
    slot:** settings (volumes, mute, reduced motion), the endings found (full/early, warm/cold)
    and the How to play cards seen.

| Key | Holds | Written | Cleared by |
|---|---|---|---|
| `xmas-everywhere-saves`, `xmas-everywhere-slot-<n>` | saves.js's index, and slot n's run with its summary: act, cookies, progress, rank, jobs, tools, helpers (bought and gripped), upgrades, NOEL projects, Insight, choices, legacy L, locks (kind, built, build cost), B, T, hold, timers, carried count, events past 4, Nice share, time you left, story cards seen, stats; or the finished mark | autosave (above) | Delete on the Load screen; New Xmas into that slot |
| `xmas-everywhere-s<n>-choice` | A full run save **at the act-win card** (with the card open) | when an act-win card opens; each overwrites the last | a mid-act declare; Delete; New Xmas |
| `xmas-everywhere-s<n>-cp1` … `cp4` | A full run save at the start of that act, locks and all | on every entry into that act | Delete; New Xmas |
| `xmas-everywhere-s<n>-legacy` | The legacy pictures: a 400×300 WebP render of each finished stage (about 40 KB each) | at each act-win card | Delete; New Xmas |
| `xmas-everywhere-settings`, `xmas-everywhere-endings` | Settings and cards seen; endings found | on change; on each ending | "Forget endings" (its own confirm) |


  Each game-managed key holds its own `version` and is written whole (the new copy before the
  old is dropped); a key that won't parse loses only itself, with a toast. If the browser won't
  save, a toast says so and play goes on.
- **Back to the choice** reopens the slot's act-win card from `-choice`. **Replay Act N from its
  start** loads `cpN` and shows that act's title card. **New Xmas** takes an empty slot, or asks
  which to replace ("Replace Slot 2: Act 3, Regional Santa?"). **A mid-act declare** plays the
  ending, writes the finished mark and drops the slot's `-choice` save, so it can't be undone
  through an earlier act-win card; the checkpoints stay.

## Screens

- **Title:** title-art (the workshop at night through a frosted window, painted without NOEL),
  with NOEL's box placed on the upper shelf in code and its eye glowing faintly, a little bigger
  and colder (and the art tinted) for each act the last-played slot has reached. "Xmas
  Everywhere" in Berkshire Swash. **Continue** (the last-played slot, when there is one), **New
  Xmas**, **Load**, **Endings** (once one is found), **How to play**.
- **Load:** the three slots with their summaries, Load and Delete (which asks), in the act's
  card style, by mouse, touch and keyboard. A finished slot opens its Endings screen.
- **How to play:** four cards (tap; cookies; NOEL's Insight; from Act 2, Declare and its locks)
  and the controls list with "Ctrl+Shift+F: report a bug".
- **Act title card:** the act's background, "Act 2" over "Replace Santa", intro lines in
  italics, the legacy card you bring ("You bring The Old Workshop. Your elves came with you:
  worth 5 List Elves now, more with every rank."), **Begin**; **Retry** if an asset failed to
  load.
- **The act screen:** Chief Toy Officer's, with the act's stage and data; the shop's Helpers
  holds the meter header, any override or lever row, the legacy row and the tier rows; NOEL
  holds its eye, Insight, projects and a one-line "NOEL is thinking:" ticker.
- **Promotion card:** Chief Toy Officer's, with Santa's or NOEL's portrait. In Acts 2 and 4 it
  carries the choice (two big buttons, mitten left, eye right, each with its bonus in one line;
  keys 1 and 2; Esc waits for a choice), then flips to the answer with **Continue**.
- **Lock card:** NOEL with an amber eye, its line, one row per lock (its build: Build / Built),
  the **Hands now vs goal** bar ("where you are now"; it doesn't move while the card is open),
  the check ring, the costs now (free hands off, Overdrive +N%, the Grip's next tick), **Hire
  hands** and **Back to work**.
- **Declare confirm, finales** (named steps in the frame log) and the **act-win card** (title
  "complete", stats, two big buttons and the third when earned; 1 s guard; Esc does nothing).
- **Pause menu:** Resume, Settings, How to play, **Report a bug**, Title. **Settings:** volumes
  and mute, reduced motion, "Forget endings", **Report a bug**, Credits (made by Rich Conlan,
  from Xmas Clicker (2017) and Sean's elves; built on Chief Toy Officer; made with gamegen;
  fonts Berkshire Swash, Nunito, Courier Prime and Caveat, Open Font License). "Report a bug"
  shows only when `window.gameReport?.shown()`; it opens the form and leaves the game paused.

## Juice

Must-haves:

- **The tap, every act:** the swing or burst restarts on every tap; the job squashes, sparks
  fly, a "+N" floats up, and the act's tap sound plays (one recording per act, varied in code by
  ±8% pitch and a small random filter): Act 1 *tok*; Act 2 a rubber *thump* and a NICE or
  NAUGHTY ink splat; Act 3 a bell *ding*, the bell swinging and a gold ring (bigger and brighter
  in the Cheer Spot); Act 4 a sonar *ping*, the scanner's recoil and a green ring. In Acts 3–4
  Pip squashes a little.
- **A finished job:** a pop with a bounce, then presents to the pile (Act 1), the file onto the
  scroll, which unrolls a little (Act 2), a light blooming on the globe (Act 3), a new ornament
  twinkling (Act 4). Chief Toy Officer's rules for many jobs at once and for sounds.
- **NOEL's eye** follows the last tap and blinks; green (`#3fd47a`) when content, amber
  (`#ffb347`) while locked, brighter for a moment on every NOEL project or NOEL answer.
- **Choices:** the mitten a warm chime and a puff of sparkles; the eye a teletype chirp; the
  card turns over with the paper flip.
- **Lock:** chains swing in and wrap the Declare button with a heavy clank, the padlock drops,
  the free-hands glow goes out, the screen dims for half a second. **Grip:** the clamp drops,
  the helper slides to the NOEL rail, its badge flips, clamp-and-whirr. **Unlock:** chains slide
  off, the padlock pops and bounces away, the button glows warm for 2 s, the gripped helpers
  walk out.
- **Act transitions:** a 1.5 s crossfade-zoom out a scale (the workshop into the List Room's
  window, the List Room into a light on the globe, the globe into a dot in the galaxy), from the
  legacy picture, which then settles as the legacy card.
- **Helpers** arrive walking, rolling or blinking on; hand-run ones bob, NOEL-run ones pulse
  green. Each rail shows one figure per tier with a "×N" tag, newest tier in front.
- **The UI drifts colder** (CSS theme variables): cream paper and wood; the same with a pale
  green NOEL watermark and a typewriter ticker; glossy red and white with gold edges; deep navy
  with neon tinsel. Big numbers count up and shorten.

Nice to have: snow, paper dust, clouds and star twinkle; screen shake on the Thunder Mallet,
Great Seal, Planetary Carillon and Star Lens; NOEL's ticker printing letter by letter.

## Art direction

- **The style line:** a fixed part in every prompt ("Cozy storybook illustration, gouache and
  coloured pencil, soft rounded shapes, gentle dark-brown outlines, visible brush texture,
  handmade and charming. No text, no letters or numbers anywhere.") and one palette part per
  act, which replaces the last act's: Act 1 "warm candlelit palette of cranberry red, pine
  green, cream, honey gold and cocoa brown, soft warm light from the upper left"; Act 2 "warm
  wood and cream with the cool green glow of brass instrument lights, lamplight from the upper
  left"; Act 3 "crisp red, white and gold, cool night light with warm accents, polished brass
  and walnut trim"; Act 4 "deep navy and violet, lit by glowing tinsel light, with one warm
  brass-and-walnut accent". Brass and walnut are the thread through every act.
- **No writing in pictures.** Prompts with paper, signs, screens or folders add "blank paper,
  wavy ink lines instead of writing, no letters or numbers anywhere"; none asks for a clock face
  or a calendar page. Every image is checked for letters (zoomed into scrolls and screens)
  before acceptance, and lettering is painted out with a nanogen edit. NICE, NAUGHTY, REPLACE,
  the postcard and all labels are code.
- **Anchor and chain.** `pip-anchor.png` goes to every image. Each background also gets the
  previous act's background; each Acts 2–4 sheet gets toy-01 and its act's first accepted sheet;
  the four backgrounds are checked side by side before any Acts 2–4 sheet.
- **NOEL:** a walnut cabinet with brass corners and rivets, one round lens, a slot feeding
  ticker tape; a beloved old appliance, slightly too attentive, never a robot or a face. **Its
  four bodies are transparent props**, `noel-box` first and the others made from it, each lens
  painted as an **empty dark brass ring**. `assets/noel-eyes.json` holds each ring's centre and
  radius (measured after trimming), a card portrait crop, and the title screen's slot.
  Backgrounds and title-art are painted without NOEL; code places the prop. **The eye is one
  painted lens:** the Insight icon's green glass, cut at 256 px and desaturated, drawn in each
  ring and tinted in code (multiply plus a soft glow), with a soft dark pupil moving inside and
  a fixed painted highlight on top. Each prop is accepted only after a look at it on its
  background with the eye in.
- **One camera,** as in Chief Toy Officer: front view at eye height, characters three-quarter,
  facing right.
- **Stage maps** (in % of the 4:3 stage; checked with a Pillow mock of the real images before
  coding, as Chief Toy Officer did):

| Stage | NOEL's prop | Pip | Hand rail | NOEL rail | Other |
|---|---|---|---|---|---|
| Act 1 workshop | noel-box x 87–97, y 11.5–21.6 (upper jar shelf) | Chief Toy Officer's | Chief Toy Officer's crew area | – | everything else as Chief Toy Officer |
| Act 2 List Room | noel-cabinet x 70–99, y 18–88 (where the tree was) | as Act 1 | x 0–25, y 49–88, legacy card at its back | x 70–99, y 70–90 | desk where the bench was, file on the toy spot, window x 30–48, y 6–40 |
| Act 3 Earthmas Deck | noel-console x 24–76, y 80–100 | x 0–16, y 48–98, in front | x 16–30, y 30–78 | x 76–100, y 30–78 | globe centred (50, 46), 62% of the height; moon-hat at (84, 18) |
| Act 4 bridge | noel-core x 44–56, y 56–100 | x 0–16, y 48–98; the scanner on the console at x 14–22, y 54–66 | x 16–30, y 66–96 | x 70–100, y 66–96 and the viewport | viewport centred (50, 42), 76% of the height |

  Each rail holds at most 4 figures (one per tier, with ×N), the legacy card and the newest
  override; gripped helpers stand on the NOEL rail with a chain badge.
- **Stage figures are the shop pictures:** every Acts 2–4 helper is full-figure, three-quarter,
  facing right, on a shared foot line at one scale per sheet, so one cut is both the 256 px icon
  and the stage figure (up to 384 px). Bells and scanners are also cut at 384 px for the stage.
- **Sheets:** 3×2 on 1536×1024, one item per cell with 48 px gaps, transparent, no shadows,
  ground patches or loose sparkles; cut by alpha connected components (pieces within 12 px
  merged), trimmed, padded square, one fill ratio per set; the cutter asserts the count and
  writes `assets/sheets.json`; a contact sheet is checked; a failed item is redone alone with
  the sheet as reference; a set's second sheet uses the first as reference. Act 2's file icons
  make the emblem the icon, checked at 64 px. NOEL's project icons are code: engraved brass
  plates with a glyph, machine-made beside the paint on purpose.
- **The globe map:** cloud-free, equirectangular, Act 3's palette, no labels or grid; made at
  21:9 (nanogen has no 2:1), resampled to 2048×1024, offset by half and seam-repaired, checked
  tiled twice. Its smeared top rows never show: latitudes above 75° sit under the code ice cap.
  It's also the reference for ending 3's Earth.
- **The legacy picture** is the finished stage (background, prop, Pip, a few helpers, the lit
  globe or ornaments) rendered to 400×300 at the act-win card, never the empty background.
- **Endings** use the Endings table's references, focal point inside the central 9:16 band (the
  portrait pan travels to it).
- **Fonts:** Berkshire Swash (titles, ranks, act cards), Nunito (the rest), Courier Prime (NOEL
  and the ticker), Caveat (the postcard); all Open Font License, bundled.
- **Sizes:** WebP; job icons 384 px, other icons 256 px, stage figures up to 384 px, Pip frames
  512 px, NOEL props at slot × 1.5, backgrounds and endings 1600×1200, the globe map 1024×512.

## Audio direction

**Music** is streamed (Tech plan); each act loop crossfades over 2 s (audiogen music has no loop
flag). The music ducks while paused and during lock events.

| Track | Mood | Length | Used for |
|---|---|---|---|
| Workshop (Act 1) | Cheerful, cozy celesta, pizzicato strings, sleigh bells, light woodwinds | 120 s | Act 1 |
| Xmas Eve (Act 1 finale) | Warm, swelling orchestral version of the same mood | 60 s | Xmas Eve; ending 1 |
| The List (Act 2) | Music box and ticking clock over soft strings, sweet and a little uneasy | 120 s | Act 2; ending 2 (softened in code). Every 20–40 s the code adds one detuned music-box ping: the "slightly wrong" note. |
| Earthmas (Act 3) | Big, bright brass and sleigh bells, like an advertising jingle that never ends | 120 s | Act 3; ending 3 (low-pass in code) |
| Star-Sleigh (Act 4) | Celesta and a distant wordless choir over deep synth pads: wondrous and lonely | 120 s | Act 4; ending 4 |
| Three finale stingers | The Review: one dramatic held chord, then silence. Wrap the World: a jingle swelling to a big finish. Top the Universe: a choir rising | 20 s each | the three finales |
| Music box | A plain, cheerful music-box tune | 30 s | Xmas Forever (slowed, detuned and stopped with a playbackRate ramp) |
| Candle (Silent Night) | A gentle solo piano lullaby, warm and quiet | 60 s | ending 6 |

Rushes layer a looping sound (`--loop`) over the music: sleigh bells (Acts 1 and 3), rustling
paper bells (Act 2), a shimmering choir (Act 4).

**Sound effects:** Chief Toy Officer's 17 (its three taps as one recording varied in code: 15
recordings), plus these. Every action in the design has one; reused recordings are marked.

| Action | Sound |
|---|---|
| Stamp, bell, scanner taps | Rubber stamp thump; small bright bell; soft sonar ping |
| File done; holdout won; First Contact | Paper flip and a small brass ding; a short choir "aah"; a strange, beautiful alien chord |
| Letter, snow cloud, comet appear | Paper flutter; soft wind; sparkle sweep |
| Choice card turns over; Wish shown | The paper flip (reused); the paper flutter pitched down (reused) |
| Ornament twinkles; the Moon slides in | The sparkle sweep, short and high (reused) |
| NOEL project bought; NOEL speaks | A brass ratchet and a chirp; a soft two-note teletype chirp |
| Override built; lever pulled; check complete | A wooden thunk and a small elf cheer; a heavy iron lever clunk; a warm chime |
| Lock; unlock; NOEL's Grip | Chains wrapping then a padlock clank; chains sliding off, padlock pop; a soft brass clamp and a whirr |
| The Great Seal's slam; the bow lands | A deep thud and a paper slap; the same thud, softer and higher (reused) |
| Ribbon wraps the globe; stars gather | A satin ribbon zip; a long rising shimmer |
| Declare Victory; act transition | A sweet chime and sleigh bells; a rising whoosh |
| Rush loops (Acts 2 and 4) | Rustling paper bells; a shimmering choir (`--loop`) |

**Voices** (audiogen voice; two to three takes each, the best kept): Santa's "Ho ho ho!" (as in
Chief Toy Officer) and "Ho... there you are, Pip." (Silent Night); NOEL's "Hello, Pip." (Plug In
NOEL), "I woke myself up, Pip.", "I've secured the button." (the first lock), "Merry Xmas, Pip."
(Act 4 finale) and "Goodnight, Pip." (endings 1 and 6). All five NOEL lines use **one fixed
ElevenLabs voice ID** (calm and warm); the slightly synthetic edge is added in code (a light
ring-mod), never asked of the prompt.

## Asset list

**Already made (from Chief Toy Officer, reused):** pip-anchor, workshop-bg, bench, tree, toy-01
(Wooden Tractor), toy-05 (Doodle Dial), toy-08 (Pixel Play), santa-portrait, hammer-1, copied
from `../xmas-clicker/.gamegen/candidates/` and shipped as WebP.

Every imagegen2 row uses pip-anchor as a reference, plus those named. Sheets are 3×2 on
1536×1024 and follow the sheet rules.

| ID | What it is | Tool (references) | Generate at → ship at | Transparent | Animation | Priority |
|---|---|---|---|---|---|---|
| **Act 1** | | | | | | |
| pip-swing | Pip alone, empty fist, striking down (Chief Toy Officer's brief) | anim8gen (pip-anchor) | 4 frames, 512² + pivot JSON | yes | 4-frame swing; tool in code | must |
| tree-star | The tree-top star, also the Last Star | imagegen2 | 1024² → 1024² and 256² | yes | lit in code | must |
| presents | 6 wrapped presents | imagegen2 | 1024² → cut | yes | | must |
| toy-02…04, 06, 07, 09, 10 | The other 7 toys (Smartphone: generic, a tiny green NOEL-eye camera, blank screen) | imagegen2 (toy-01) | 1024² → 384² | yes | | must |
| hammer-2…4 | Heavy, Supreme, Thunder Mallet | imagegen2 (hammer-1) | 1024² → 256² and 512² | yes | rotated in code | must |
| elf-helper, toy-machine, reindeer-team | The three crew figures | imagegen2 | 1024² → 256²/384² | yes | bob in code | must |
| assembly-line | A short conveyor with little brass arms, each with a green eye | imagegen2 (toy-machine) | 1024² → 384² | yes | arms tick in code | must |
| upgrades-1, upgrades-2 | Helper elf with wooden, steel and golden hammer; hot cocoa, wrapping station, conveyor belt | imagegen2 (elf-helper) | 1536×1024 → cut 256² | yes | | must |
| icons sheet | Cookie, cheer bell with holly, Insight (a green glass lens on brass: also NOEL's eye), gift-box Declare button, mitten badge, eye badge | imagegen2 | 1536×1024 → cut 256² | yes | the lens tinted in code | must |
| lucky sheet | Shooting star, falling letter (blank), snow cloud, comet | imagegen2 | 1536×1024 → cut 512×256 | yes | glow in code | must |
| noel-box | NOEL's first body, dusty (the lit version by edit): walnut-and-brass box, empty dark lens ring, tape slot | imagegen2 | 1024² → about 240×180 on stage, 512 px for cards (×2) | yes | eye in code | must |
| title-art | The workshop at night through a frosted window, **no NOEL** (4:3 + 9:16) | nanogen pro 2K (workshop-bg, tree) | → 1600×1200 and 1080×1920 | no | NOEL placed in code | must (9:16 should) |
| sleigh-cutout | The loaded sleigh (Xmas Eve, endings 2 and 3) | imagegen2 (toy-01) | → 1024×683 | yes | moves in code | **must** |
| finale-sky | Xmas Eve moon over rooftops | nanogen pro 2K (workshop-bg) | → 1600×1200 | no | | should |
| **NOEL, Pip and Santa across the acts** | | | | | | |
| noel-cabinet | A wall of walnut cabinets with brass dials, one big empty lens ring | imagegen2 (noel-box) | 1024×1536 → about 700×1260 | yes | eye in code | must |
| noel-console | A long glossy console, a band of blank green screen, one lens ring | imagegen2 (noel-box, noel-cabinet) | 1536×1024 → about 1250×360 | yes | eye in code | must |
| noel-core | A tall glowing brass-and-walnut column, lens ring at its heart | imagegen2 (noel-box, noel-cabinet) | 1024×1536 → about 290×790 | yes | eye in code | must |
| pip-clerk | The clerk anchor: pip-anchor edited into visor, sleeve garters and waistcoat | imagegen2 `--image` (pip-anchor) | 1024² → 512 px | yes | | must |
| pip-clerk-swing | The clerk swing: canonical reference pip-clerk, the four accepted pip-swing frames as pose references; frames re-registered by its alignment tool, the grip point re-measured into `pip-clerk-pivots.json`. Fallback: masked edits of each frame (`--mask` over head, torso and upper arms; fist within 4 px) | anim8gen | 4 frames, 512² + pivot JSON | yes | the same swing | must |
| pip-portraits sheet | Pip as clerk (from pip-clerk), in the big Santa coat, in the star-sleigh suit (full body, three-quarter, facing right) | imagegen2 (pip-clerk) | 1536×1024 → cut, 512 px tall | yes | | must |
| santa-sheet | Santa slumped (bust, Act 2's act-win card); Santa in a sun hat on a beach, waving (postcard) | imagegen2 (santa-portrait) | 1536×1024 → cut 512² | yes; no for the beach | | must |
| **Act 2** | | | | | | |
| list-room-bg | Empty tall office, blank scroll from the ceiling, tall window onto the snowy workshop, chimney flue top left, no NOEL | nanogen pro 2K 4:3 (workshop-bg) | → 1600×1200 | no | | must |
| clerk-desk | A high clerk's desk, front view, empty blotter | imagegen2 (bench) | 1536×1024 → 1024×683 | yes | | must |
| a2-jobs-A, -B | 10 file icons, a big emblem on a blank folder tab (elf hat, antlers, village, town, skyline, headphones, **a mug**, paw, glowing screen, Santa's hat); B's spares: Reading Glasses, Cocoa Thermos | imagegen2 ×2 | → 384² (upgrades 256²) | yes | | must |
| a2-shop-A, -B | 8 helpers, full-figure; B also holds Nice Ribbons, Pneumatic Tubes, Wish Board, Second Chances | imagegen2 ×2 | → 256² icons, 384² stage | yes | | must |
| a2-stamps | 4 stamps upright, handle up, same handle length, grip point noted; Night Shift; a spare | imagegen2 | → 512² (hand, Seal), 256² (shop) | yes | in the fist; the Seal rises in code | must |
| **Act 3** | | | | | | |
| deck-bg | Empty glass tower deck at night, railing, aurora, no globe, no NOEL | nanogen pro 2K 4:3 (list-room-bg) | → 1600×1200 | no | | must |
| globe-map | Cloud-free equirectangular Earth, no labels, no grid | nanogen pro 2K 21:9 + seam edit | → 2048×1024 → 1024×512 | no | tilted lookup in code | must |
| a3-jobs-A, -B | 10 holdout icons; B's spares: moon-hat (384²) and bow (512²) | imagegen2 ×2 | → 384² | yes | | must (moon-hat should) |
| a3-shop-A, -B | 8 helpers, full-figure; B also holds the 4 bells (also cut at 384 px for the stage) | imagegen2 ×2 | → 256², 384² | yes | the bell swings in code | must |
| a3-upgrades | Bigger Sacks, Warm Mittens, Sing-Along, Carol Books, Gift Shops, Twelve Days of Overtime | imagegen2 | → 256² | yes | | must |
| **Act 4** | | | | | | |
| bridge-bg | Empty brass-and-walnut bridge, round viewport onto a spiral galaxy, no NOEL | nanogen pro 2K 4:3 (deck-bg) | → 1600×1200 | no | | must |
| a4-species-A, -B | The 9 species portraits; B's spares: Brass Telescope, Radio Dish, Wish Beacon | imagegen2 ×2 | → 450 px (scanners 256² and 384²) | yes | the scanner recoils in code | must |
| a4-shop-A, -B | 8 helpers, full-figure; B also holds Star Lens and Warmer Suits, Star Cocoa, Colony Bakeries | imagegen2 ×2 | → 256², 384² | yes | | must |
| a4-upgrades | Letters from Home, Gift Exchange, Home for the Holidays, 3 spare cells for re-rolls | imagegen2 | → 256² | yes | | must |
| **The button and locks** | | | | | | |
| lock-chains | A loop of iron chain with tinsel woven in (the 44 px icon); a big padlock; a straight, horizontally tileable chain run (the wide desktop button, two diagonal passes); the brass Grip clamp; the chain badge; a small padlock drawn for 24 px | imagegen2 | 1536×1024 → cut | yes | wrapped, dropped and slid in code | must |
| overrides sheet | The 5 overrides and the Manual Override Lever | imagegen2 | → 256² panel, 384² stage | yes | | must |
| **Endings** | | | | | | |
| ending-1…6 | The six paintings, references as in the Endings table | nanogen pro 2K 4:3 | → 1600×1200 | no | slow pan in code | must (5 and 6 first) |
| **App and sharing** | | | | | | |
| app-icon | Pip's face with a hammer on red, a tiny green eye glint in the corner | imagegen2 | 1024², sizes made in code | no | | must |
| social-card, github-social | From the title screen | playwright-cli | 1200×630 JPG, 1280×640 PNG | no | | must |
| **Drawn in code** | Wish and First Contact layouts, the postcard's message side, the eye's tint and pupil, project plates, the legacy card's frame, the ribbon, the ice cap, the stars' tree, orbiting tinsel, wreaths of light, ×N tags, NICE / NAUGHTY / REPLACE | | | | | |
| **Audio** | | | | | | |
| music ×10 | The music table (11.5 minutes) | audiogen music | MP3 96 kbps | | crossfade loops | must (stingers, Candle should) |
| sfx ×39 | Chief Toy Officer's 15 recordings and 24 new ones | audiogen sfx | 0.5–4 s MP3 | | | must |
| voices ×7 | Santa ×2, NOEL ×5 (one voice ID) | audiogen voice | 1–3 s MP3 | | | should |

Counts: 48 imagegen2 generations (23 of them sheets), 14 nanogen paintings and edits, 2 anim8gen
animations, 10 music generations, 39 effects, 7 voice lines.

## Tech plan

Chief Toy Officer's tech plan holds (layout, loop, input, numbers, audio, offline, debug),
extended like this:

- **Files** (`game/src/`, ES modules): `rules.js` (the pure engine for every act, every row of
  "Lock rules, exactly", and `bestBuy(state, policy)`; no DOM, so node imports it);
  `acts/act1.js` … `act4.js` (each act's data); `text.js` (every word the player sees);
  `stages/workshop.js`, `listroom.js`, `globe.js`, `bridge.js` (each draws its stage map, NOEL's
  prop and eye, and offers the shared hooks: tap, job done, helper added or gripped, Rush,
  finale steps, and `renderLegacy()` for the 400×300 picture); `ui.js`, `locks.js`,
  `endings.js`, `state.js` (slots through `saves.js`, the per-slot keys, checkpoints),
  `audio.js`, `main.js`. `game/saves.js`, `game/vendor/gh-feedback.js` and
  `game/vendor/report.js` are copied from the gamegen templates unchanged.
- **Offline:** the template service worker, unchanged (PREFIX `xmas-everywhere-`), precaching
  every file in `game/`.
- **Memory, per act:** the first paint needs only the shared files and Act 1 (under 6 MB). Music
  streams through `<audio>` elements into the music gain (`createMediaElementSource`; a loop is
  two elements crossfading 2 s before the end); on act change the old ones are paused, emptied
  and `load()`ed. Effects are decoded per act; images are per-act `ImageBitmap`s, `close()`d on
  act change; endings decode only when shown. `audioState()` and `state().memory` report what's
  held.
- **The globe:** a tilted orthographic lookup, built once for a disc of D px (capped at 384).
  For a disc pixel (x, y), y up, x² + y² ≤ 1: z = √(1 − x² − y²); with the view latitude φ₀ =
  23°, latitude = asin(y·cos φ₀ + z·sin φ₀) and longitude = atan2(x, z·cos φ₀ − y·sin φ₀). Each
  frame (30 fps) reads the 1024×512 map at (longitude + turn, latitude); latitudes above 75°
  blend into the code-drawn ice cap. Lights project the same way and hide on the far side. The
  pole projects to (0, cos φ₀), about 0.92 R above the centre: the bow lands there. The Cheer
  Spot's hit test is CSS-px distance from its centre (radius at least 36 px).
- **Bug reports:** `report.js` loads in `<head>`; `<gh-feedback id="report" trigger="none"
  repo="" template="bug.yml" heading="Report a bug" types="bug,feature" theme="dark"
  color="#e0a030">` sits at the end of `<body>`, in Nunito. `main.js` calls
  `window.gameReport?.setup({ game: 'Xmas Everywhere', key: 'xmas-everywhere', visibility: 'on',
  state: () => window.__game.state(), pause, grab, releaseAll })`: `pause` opens the pause menu
  (never a toggle), `grab` is the stage canvas as a PNG, `releaseAll` lets go of held keys and
  pointers. Pausing calls `snapshot()` after the last frame, resuming calls `resumed()`, and
  every input handler returns first while `isOpen()`. `repo` stays empty until publishing fills
  it in. The README says "Found a bug? Pause and pick 'Report a bug', or press Ctrl+Shift+F
  (you'll need a GitHub account)."
- **The text rule:** `tools/check-text.mjs` fails on "christmas" (any case) in any file or file
  name under `game/`; it runs before every play-test.
- **Balance script:** `tools/balance-draft.mjs` (to become `tools/balance.mjs`, importing
  `acts/*.js` and `rules.js`) runs the acts in a chain and writes `design/BALANCE.md`. Each act
  must pass: the reference in 24–30 minutes with every rank within ±25%; no wait over 90 s; taps
  at least 25% (Act 1) or 20% of work; the slow player under 45 minutes and the no-flag player
  under 40; every lock at most 5 minutes of income to clear whenever its target is set, for
  every simulated player; the reference clear of locks at the act's end; **ignoring this act's
  locks 30–150 s faster, NOEL's answers 60–150 s faster**; with carried locks, ignoring slower
  in Acts 3 and 4 and at least 3 minutes slower over the game; **the late-clear check** (a
  reference or slow player who ignores until rank r, 2–9, then clears, has a clear button within
  5:30); Act 1 without Plug In NOEL or the Smartphone design; Act 3 under 32 minutes with no
  Cheer Spot hits; the away rules. It writes snapshots of the reference at each rank
  (`tools/snapshots/a<act>-r<rank>.json`) and act start, and lock snapshots: `a2-lock1`,
  `a3-lock2`, `a3-lock3`, `a4-lock4`, `a4-lock5` (just after each lands), `a3-carried`,
  `a4-carried` (the ignorer), and `a4-r10-free`, `a4-r10-locked`.
- **Debug hook** (`window.__game`, as in web-target.md): `state()` adds `slot`, `act`, `locks`,
  `target` (B, T), `hold`, `gripIn`, `carried`, `handShare`, `freeHands`, `overdrive`,
  `insight`, `legacy`, `choices`, `endingsFound`, `memory`, and screens `promotion-choice`,
  `contact-card`, `answer`, `lock-card`, `declare-confirm`, `act-win`, `ending-<n>`, `endings`,
  `load`, `report`. `levels()` is 40; `goToLevel(n)` loads `a<act>-r<rank>` for n = (act − 1) ×
  10 + rank; `bestBuy(policy)` (`clear` or `ignore`) names the item, build or choice button the
  reference strategy would press now. With `?debug` only: `goToAct(a, {locks})`,
  `loadSnapshot(name)`, `triggerLock(n)`, `clearLocks()`, `goToEnding(n, {early, cold})`,
  `addInsight(n)`, `advance(seconds)` (active time) and the old cheats.
- **The proof** (real taps and clicks; playtest-guide.md's long-run rules: progress lines in
  `window.__runLog`, limits, checks on a schedule, a short run first):
  - **The bot** is `tools/proof-bot.js`, the `run-code` body, taking `{ act, fromRank, toRank,
    policy, tps }`: it taps, catches every lucky thing, presses `bestBuy(policy)`'s choice and
    the mitten, and logs one line per rank. Each `design/solutions/level-<n>.json` names it, its
    parameters and the expected end state.
  - **Same end state** (replayed twice): `levelComplete`, the same act, rank and lock count, and
    the time within ±15% of the first replay.
  - **Limits:** each rank gets 2× the sim's 10-taps/s time plus 60 s; a run stops after 3
    failures in a row at the same rank.
  - **The 40 rank runs:** 4 parallel sessions (`-s=a1` … `-s=a4`, one act each), each opened
    only when the browsers script says `room for another: yes` and closed at the end; about 15
    minutes of wall time, or about 57 one after another.
  - **One New-Xmas-to-win run, in one go, no jumps:** to Silent Night at 10 taps a second with
    `bestBuy('clear')`, every lock cleared, the next-act button each time; about 62 minutes, in
    the background as one `run-code` per act (the game saves, so a timed-out chunk resumes).
  - **The ignorer run** from `a3-carried` to the Act 4 act-win card with `bestBuy('ignore')`
    (about 30 minutes): carried locks, the rank-4 recompute, the Grip at its floor, the
    final-job warning, no Switch NOEL Off. It runs alongside the rank runs.
  - **Locks, endings, slots and reports** (about 20 minutes): each lock cleared from its
    snapshot; an escalation, a Grip tick and a paused hold with `advance()`; all six endings
    through their buttons (an early and a cold one too), Back to the choice, Replay Act N, New
    Xmas; the slot and bug-report checks in the Definition of done.
  - **Honest wall time:** about 15 + 62 + 20 minutes with the ignorer run overlapping, **about 1
    h 40 min**; about 2 h 50 min if no second browser fits.

## Cut list

Drop in this order, if needed. Past $20 of images, any further image retry is paid for by
cutting a picture (items 5–7, in order).

1. The NOEL and Santa voice lines (the text stays).
2. The three finale stingers (the act's loop swells and ducks in code).
3. The Candle track (Silent Night plays Xmas Eve, quietly).
4. The Act 2 and Act 4 Rush loops (Act 1's sleigh bells, filtered).
5. The moon-hat picture (code: a red triangle with a white bobble).
6. finale-sky, and the sleigh flying in Xmas Eve (Chief Toy Officer's cut 1; sleigh-cutout
   itself stays: two endings use it).
7. The 9:16 phone title art (the 4:3 art cropped with CSS).
8. The act-transition zoom (a plain crossfade).
9. Snow, dust, clouds and twinkle.

Never cut: the four acts, their taps, jobs, tools, helpers in both kinds, ranks, finales and
act-win cards; NOEL and its projects; the wishes, the Cheer Spot, First Contact's two answers
and the legacy card; the Declare button, the locks, overrides, the Grip and the meter; the six
endings, their paintings, Back to the choice and Replay; the three save slots and "Report a
bug".

## Effort and cost estimate

A forecast, not a promise.

- **Effort:** four acts (10 ranks, 10 jobs, 4 tools, 4–8 helpers, 6–7 upgrades, 5–6 NOEL
  projects each), 8 wishes, 9 First Contacts, 5 lock events, 6 overrides, 6 endings with
  variants, about 130 lines of writing, about 18 screens in 3 layouts. Hardest: one engine for
  four stages that releases each act cleanly; lock rules that agree across `rules.js`, the sim
  and the Lock card; balance across 40 ranks and both sides of every choice; the tilted globe
  and the Cheer Spot on phones; 130 sheet pictures in one style; the proof (about 1 h 40 min of
  runs).
- **Cost** (imagegen2 about $0.053 a 1024² image, $0.041 at 1536×1024, plus $0.008 per
  reference, from the imagegen2 log; anim8gen about $1.50 an animation; nanogen pro 2K $0.134
  list, logged at $0.24 with references; music $0.30 a minute; effects $0.12; voices about a
  cent):

| Item | Count | One take |
|---|---|---|
| imagegen2 | 48 | about $3.60 |
| anim8gen (pip-swing, pip-clerk-swing) | 2 | $3.00 |
| nanogen pro 2K | 14 | $1.90–3.40 |
| **Images** | | **$8.50–10.00** |
| Music | 11.5 min | $3.45 |
| Sound effects | 39 | $4.70 |
| Voices | 7 | about $0.10 |
| **Audio** | | **$8.25** |
| **Total** | | **$16.75–18.25** |

- Reused: 9 Chief Toy Officer pictures ($0). The shared design's mock pictures come from this
  list, within the $5 mockup allowance.
- **Audio is ring-fenced at $9 from the start.** Images stop at **$20 including retries**,
  after which image retries come from the cut list: about $10 of retries and extras.
- **Spending order** (references first, endings near last): (1) noel-box, pip-clerk, the
  pip-portraits sheet, pip-swing, then pip-clerk-swing; (2) list-room-bg, deck-bg, bridge-bg and
  the globe map, checked side by side, then the three NOEL props on them with the eye drawn in;
  (3) Act 1's items, the icons sheet (the lens), title-art and sleigh-cutout; (4) the sheets act
  by act, lock-chains and overrides; (5) the six endings, once every reference exists; (6) audio
  from its $8.50: music, effects, voices. At $20 of images or $24 (80%) in all, STATUS.md says so,
  and anything left comes from the cut list's bottom up only if it fits.
- **Download:** first paint under 6 MB; about 16 MB in all (music 8, pictures 6, effects and
  fonts 2), precached after the first visit.

## Definition of done

- [ ] Starts with no errors at 1280×800, 390×844, 360×640, 844×390 and 667×375; every screen
      looks finished from the first load; "Keeper of the Naughty and the Nice" and five tabs fit
      at 360 px; at 360×640 the Helpers header and tier 1 and 2 rows show without scrolling;
      every touch target is at least 44 px at 667×375.
- [ ] The text rule: `tools/check-text.mjs` finds no "christmas" (any case) under `game/`; no
      screen shows it; every picture was checked for letters before acceptance.
- [ ] Every act plays to its act-win card: every rank from its `goToLevel` snapshot with real
      input (each stored solution replayed twice, same end state), and one New Xmas to Silent
      Night run in one go, real input, no jumps.
- [ ] Act-win cards work both ways; Declare there plays the full ending and Back to the choice
      returns to the card. A mid-act declare shows its confirm text, plays the early ending,
      marks the slot finished and offers only Replay Act N and New Xmas. All six endings play
      through their real buttons, with early and cold variants; the Endings screen's ribbons,
      frost marks and hint work; endings are shared by every slot. Switch NOEL Off appears only
      with no locks.
- [ ] Locks, against "Lock rules, exactly": each padlock project warns before purchase and
      brings its lock; the meter shows no goal until a lock lands; build plus T held 30 s
      clears; the hold pauses on a dip and stays empty with nothing built; T never rises on a
      re-check; Free hands, Overdrive (this act's locks only) and the Grip (paused during the
      hold, faster when carried) behave; escalation, the 4-lock cap, carried locks at rank 4,
      and the Act 4 final-job warning. The act-win Declare works with 4 locks on.
- [ ] Wishes on the rank 2–9 promotions (Act 2) and First Contacts at Begin and ranks 2–9 (Act
      4) apply their bonus, flip to their line with Continue and echo on the ticker. The legacy
      card shows its L and a picture of the finished stage.
- [ ] The balance script passes every check and BALANCE.md is from its latest run. Nothing
      happens behind a card; every final job stops at 90% without taps; the game can always go
      on.
- [ ] Every control works on desktop and touch, including the Cheer Spot (keys only while it
      rests; a real-input phone run measures the hit rate), the choices, Declare, the Lock card
      and the guards.
- [ ] Each stage matches its stage map (Pillow mock): noel-box on the upper shelf clear of the
      tree star, each eye in its lens, Pip in his own column in Acts 3–4, one figure per tier
      with ×N, the tilted globe with the pole and bow visible, the tool shown on taps in Acts
      3–4.
- [ ] **Slots:** two slots played and reloaded keep their own progress and summaries, and
      Continue picks the last played; New Xmas with all three full asks which to replace; Delete
      asks first; an unreadable `xmas-everywhere-slot-2` (holding `{`) shows "This save can't be
      read" with Delete and no errors; a full storage shows the toast; settings and endings are
      shared; each slot's act-win save and checkpoints are its own.
- [ ] **Report a bug:** hidden while `repo` is empty; with a test repo and `window.open` stubbed
      it opens from the pause menu and settings (mouse, touch, keyboard) with a thumbnail of the
      game; typing moves nothing; Escape leaves the game paused; Ctrl+Shift+F opens it mid-act
      and after a lost frame, with nothing stuck after; the link holds the game's details; it
      fits at 360×640; replaying every solution never opens it.
- [ ] Sound plays after the first input; each act's track starts on entry; every action in the
      sound table sounds; mute works; an act change releases the last act's music, effects and
      bitmaps.
- [ ] Installs and works offline after the first visit; first paint under 6 MB. Act 1 keeps
      everything Chief Toy Officer promised, except "What Act 1 changes from Chief Toy Officer".
