# Chief Toy Officer

*Hammer your way from Assistant Junior Toy Maker to the top of Santa's workshop.*

A remake of Xmas Clicker (2017).

## Pitch

You're Pip, the newest elf in Santa's workshop. Tap the workbench to hammer
toys together, spend the cookies they earn on better hammers and more
helpers, and watch the presents pile up under the tree. Every promotion
unlocks a new toy and a sillier job title, until Santa names you Chief Toy
Officer and you build the last toy before the sleigh leaves on Christmas Eve.

## Settings

- Platform: both (desktop and phones; phones in portrait, and in landscape with its own layout)
- Target: web (plain HTML, CSS and JavaScript, no build step)
- Scope: medium: 10 ranks and 10 toys, about 20–30 minutes of active play to the top. That's what the original's ranks and toys add up to.
- Kinds: idle / incremental clicker
- Budget: $20 for generated art and audio. The shared design's pictures are made at final spec and become real assets (about $2–3 of the total).
- Tools available: imagegen2 and anim8gen (OpenAI), nanogen (Gemini), audiogen (ElevenLabs, creator plan), playwright-cli, node, Python + Pillow
- Credit: Rich Conlan
- Remake of: Xmas Clicker (synapticnoise.com/xmasclicker), leeway lots. See `ORIGINAL.md`.
- Decisions made on the player's behalf:
  - The new name is **Chief Toy Officer**, with "a remake of Xmas Clicker" under the title.
  - Three names change for originality: **Thunder Mallet** (was Thor's Hammer), **Pixel Play** console (was Super Game System), **Doodle Dial** (was Sketch An Etch).
  - The original's toy "value" becomes **cookies**, the money you spend.
  - Sean's prototype supplies the helpers: elves, elf hammers, and click upgrades (the hammers).
  - All art is new. The ctrl-click cheat is gone.

## The player's fantasy

You're the lowliest elf in the busiest workshop in the world, and you're
going to run the place. You start with a cheap hammer and a wooden tractor,
and end up commanding a crew of elves, clockwork machines and reindeer, with
a Thunder Mallet in your fist and a tree buried in presents.

## Core loop

- **10 seconds:** tap the bench. *Tok, tok, tok:* the toy fills up, pops
  out finished, gets wrapped, and flies into the pile under the tree. You
  earn cookies and cheer.
- **1 minute:** spend cookies on the next helper, a better hammer or an
  upgrade, so the next toy comes faster. Pick which toy to build: newer toys
  take more work but pay more.
- **Session:** fill the cheer bar to win a promotion. Santa pops in, reads
  out your new title, and a new toy unlocks. Your helpers keep working while
  you're away. At Chief Toy Officer, the Smartphone unlocks. Your crew
  builds it to 90%, and Pip adds the finishing touches with your taps.
  That brings Christmas Eve: the tree lights up, the sleigh takes the whole
  pile, and the credits roll. Then you can keep playing for fun.

**The mechanic the game lives or dies by:** the tap on the bench. It must
feel great every time: instant sound, a hammer swing, a squash on the toy, a
spark, a "+4" that floats up. It stays worth doing all game: every tap also
adds a share of the crew's work (see Structure and difficulty), so taps are
about a third of the work at every rank.

## Controls

| Action | Mouse / keyboard | Touch |
|---|---|---|
| Hammer the toy | Click anywhere on the stage, or press Space or Enter (one hit per key press; held keys don't repeat). Space and Enter only ever hammer: they never press a focused button. | Tap anywhere on the stage (one hit per finger, several fingers count) |
| Pick a toy | Click its card on the toy shelf, or keys 1–9 and 0 | Tap its card on the Toys tab |
| Buy | Click a shop item | Tap a shop item on the Hammers, Helpers or Upgrades tab |
| Catch a shooting star | Click it | Tap it (a 72 px hit area around it). A tap on the star only catches it; it isn't a hammer hit. |
| Close a card (promotion, welcome back, finale) | Click its button, or Esc (after a 1 s guard) | Tap its button (after a 1 s guard) |
| Pause and settings | Esc or P, or the gear button | The gear button |
| Mute | M, or the speaker button | The speaker button |

- **Phones (portrait):** from top to bottom: the top bar (two rows), the
  stage (full width, 4:3), the toy's name and work bar, the shop panel, and
  the tab bar inside the home-bar safe area. Four tabs (Toys, Hammers,
  Helpers, Upgrades), at least 64 px tall. The panel has its own space below
  the stage and never covers it, so you can tap the bench with any tab open.
  At 360×640 it still shows at least two cards. Tabs switch the panel's
  content; one is always open: Toys at the very start, then Helpers from
  the moment the first elf is bought (and on every later load). The
  selected toy is always on the bench, with its name under the stage, so
  the Toys tab isn't needed to see what you're building. A promotion puts
  a dot on Toys.
- **Phones (landscape, short screens):** the stage on the left; a right
  column with the top bar, the tabs and the panel. Stage width = the
  smaller of (screen height − the toy strip) × 4/3 and (screen width − 240
  px − the side safe insets); the column takes the rest (at least 240 px).
  The toy's name and work bar are a 28 px strip under the stage. In the
  column the rank title may wrap to two lines (at least 14 px), and the
  gear and speaker buttons sit in the tab row. Tabs are 48 px tall, full
  column width. Tested at 844×390 and 667×375.
- **Desktop:** three columns. The toy shelf is on the left, the stage in the
  middle, and the shop on the right. Each item's name, cost and effect show
  on its card; nothing depends on hovering.
- Tapping a locked toy shakes its padlock and says which rank unlocks it.
  Tapping something you can't afford shakes it and shows how many cookies
  it costs.
- **Cards never close by accident.** When a card opens during play
  (promotion, welcome back, Christmas Eve), input to it is ignored for 1
  second. It closes only with its button ("Back to work!", "Keep
  building") or Esc. Space and Enter never close a card. While a card is
  open, taps and keys don't reach the bench, and taps on the card don't
  count as hits.
- **Cards freeze the workshop.** While any card is open, the economy
  stops: helpers don't work, the Star Rush timer and the shooting stars
  wait. Nothing finishes behind a card. (Pause and settings isn't a card:
  there helpers keep working. Time with the page hidden still counts as
  time away.)
- **The first minute:**
  - A bouncing hand and "Tap the bench!" sit over the stage until the first
    toy is done.
  - At 15 cookies the Helpers tab (or the Elf card on desktop) glows with
    "Hire your first elf!" until the first elf is bought.
  - On phones, a tab shows a dot when it has something new or affordable;
    opening the tab clears it.

## Structure and difficulty

There are 10 ranks, kept word for word from the original. Each promotion
unlocks the next toy. The starting thresholds below come from the balance
script (see the tech plan). They put the reference player (3 taps a second,
catching half the shooting stars, buying sensibly) within ±25% of every
target time; the script shows ±3%.

| Rank | Title | Cheer to reach | Unlocks | Target time to reach |
|---|---|---|---|---|
| 1 | Assistant Junior Toy Maker | 0 | Wooden Tractor, Cheap Hammer, Elf | start |
| 2 | Junior Toy Maker | 14 | Yo-yo, Elf Hammers | 0:40 |
| 3 | Assistant Toy Maker | 90 | Puzzle Cube, Heavy Hammer, Hot Cocoa | 2:00 |
| 4 | Pretty Good Toy Maker | 550 | Wooden Sword, the first shooting stars | 4:00 |
| 5 | Crafty Toy Maker | 2,200 | Doodle Dial, Toy Machine, Steel Elf Hammers | 6:30 |
| 6 | Master Toy Maker | 8,000 | Fidget Spinner, Supreme Hammer, Wrapping Station | 9:30 |
| 7 | Senior Master Toy Maker | 28,000 | Chess, Reindeer Team, Conveyor Belt | 13:00 |
| 8 | Principal Toy Maker | 130,000 | Pixel Play, Thunder Mallet | 17:00 |
| 9 | Assistant Toy Officer | 470,000 | Bike, Golden Elf Hammers | 21:00 |
| 10 | Chief Toy Officer | 1,100,000 | Smartphone; the first Smartphone finished starts Christmas Eve | 26:00 |

"Cheer to reach" is the total cheer earned since the start. Times are
active play with no card open (cards freeze the workshop). The script's
results with these numbers:

| Player | Chief Toy Officer at | Christmas Eve at | Notes |
|---|---|---|---|
| Reference: 3 taps/s, half the stars | 26:02 | 26:23 | every rank within ±3% of target; never more than 58 s between purchases; taps 35–41% of the work from rank 5 on |
| 3 taps/s, no stars | 28:31 | 28:52 | |
| 2 taps/s, no stars (slow player) | 33:05 | 33:31 | under 45 minutes |
| 5 taps/s, every star (fast player) | 18:16 | 18:32 | |

Toys keep the original's order, with the work, cookies and cheer now rising
steadily:

| # | Toy | Work | Cookies | Cheer |
|---|---|---|---|---|
| 1 | Wooden Tractor | 10 | 2 | 1 |
| 2 | Yo-yo | 25 | 6 | 3 |
| 3 | Puzzle Cube | 60 | 16 | 8 |
| 4 | Wooden Sword | 150 | 45 | 22 |
| 5 | Doodle Dial | 400 | 130 | 65 |
| 6 | Fidget Spinner | 1,000 | 350 | 180 |
| 7 | Chess | 2,500 | 950 | 500 |
| 8 | Pixel Play | 6,000 | 2,600 | 1,400 |
| 9 | Bike | 15,000 | 7,000 | 3,800 |
| 10 | Smartphone | 150,000 | 75,000 | 41,250 |

Each new toy pays a little better per unit of work than the last, so
switching up is always the right call, but older toys still work.

**Toys and their progress:**

- Each toy keeps its own progress. Switching toys never loses work. Each
  shelf card shows a thin bar with that toy's progress.
- A promotion selects the newly unlocked toy for you; the card says "Now
  building: Yo-yo". You can switch back at any time.
- Work beyond what a toy needs carries over into the next one of the same
  toy. One update can finish many toys at once (a big tap, a Star Rush, or
  helpers on a cheap toy).
- Picking an older toy is allowed (as in the original) but never needed;
  the game picks the newest for you, and on phones the Toys tab steps
  aside once you have helpers (see Controls).

**Every tap leads the crew.** A tap does the hammer's work (below) plus
15% of the crew's work per second. At the start that's nothing; at the
top, with the Thunder Mallet and a full crew (about 5,600 work/s), a tap
is worth about 1,000.
The "+N" and the "/tap" figure in the top bar include it. With this rule
the reference player's taps are 55% of the work early on, while the crew
is small, and 35–41% from rank 5 to the end (the balance script checks
it).

**Hammers** (the hammer's part of each tap; you equip your best one
automatically, and older ones stay on show):

| Hammer | Work per tap | Cost | Unlocked at rank |
|---|---|---|---|
| Cheap Hammer | 1 | free | 1 |
| Heavy Hammer | 4 | 150 cookies | 3 |
| Supreme Hammer | 20 | 6,000 | 6 |
| Thunder Mallet | 100 | 40,000 | 8 |

**Helpers** (work per second on whichever toy is selected; each one costs
15% more than the last):

| Helper | Work per second | First costs | Unlocked at rank |
|---|---|---|---|
| Elf | 1 | 15 | 1 |
| Toy Machine (a clockwork gingerbread contraption) | 30 | 1,800 | 5 |
| Reindeer Team (two reindeer working a big toy press) | 150 | 10,000 | 7 |

**Upgrades** (bought once each):

| Upgrade | Effect | Cost | Unlocked at rank |
|---|---|---|---|
| Elf Hammers | Elves ×2 | 200 | 2 |
| Hot Cocoa | Hammer hits ×1.5 (the hammer's part of a tap) | 500 | 3 |
| Steel Elf Hammers | Elves ×2 | 3,000 | 5 |
| Wrapping Station | Cookies +25% | 6,000 | 6 |
| Conveyor Belt | Toy Machines ×2 | 30,000 | 7 |
| Golden Elf Hammers | Elves ×2 | 60,000 | 9 |

The reference player buys every hammer and upgrade before Chief Toy
Officer (the Thunder Mallet at about 17:10, Golden Elf Hammers at about
21:00).

**Shooting stars** (from rank 4): every 60 to 120 seconds a star drifts
slowly across the big window behind the bench, for 8 seconds. Catching it
starts a **Star Rush**: for 20 seconds, the hammer's part of each tap is
×5 and helpers ×2 (so the crew's part of a tap doubles too), with a gold
glow and a timer ring. Missing one costs nothing. Tapping the star only
catches it; it isn't also a hammer hit.

**The first Smartphone is yours to finish.** Helpers can build the first
Smartphone only to 90%. There the work bar glows gold, the banner changes
to "Pip adds the finishing touches: tap!", and the last 10% (15,000 work)
comes from taps alone, about 5 seconds for the reference player. Helper
work past 90% isn't used. Later Smartphones work like any toy.

**Away from the workshop:**

- Helpers work at full speed whenever the page is visible, paused or not,
  unless a card is open.
  Pausing stops only the shooting stars and the Star Rush timer.
- Time with the page hidden or the game closed is credited when you come
  back (stars and the Rush timer don't run during it):
  - Under 10 minutes: at full speed, with a small "+N cookies" toast. No
    card.
  - 10 minutes or more: at half speed, for up to 4 hours. A card says
    "While you were away, your elves made 37 Yo-yos (+222 cookies)."
- Away time keeps the toy you left on. A promotion earned while away
  doesn't switch toys; its card shows when you come back.
- Cookies from away time are all kept. Cheer from away time is capped
  just below the threshold of the rank after next (at most one promotion).
  The cap keeps the ending earned.
- Away time never finishes the first Smartphone (helpers stop at 90%), so
  Christmas Eve always happens with you there.

**Easing in and avoiding frustration:**

- The first toy takes 10 taps, and the first elf is affordable after 8
  toys (about 27 seconds).
- Every shop card shows what it adds ("+1 work/s", "+3 per tap").
- There's always something worth buying soon: the reference player never
  waits more than 90 seconds between purchases (58 s at most in the
  script).
- No way to lose and nothing to waste: cookies only go up until you spend
  them, and every purchase helps.
- **No soft-locks:** you can always tap, and tapping always earns. With
  zero cookies and zero helpers, the Wooden Tractor still pays. Christmas
  Eve waits for a Smartphone, which is selected for you and always
  reachable by tapping (taps are what finish it); a banner over the stage
  ("Build a Smartphone before the sleigh leaves!", then "Pip adds the
  finishing touches: tap!") stays until it's done.

## Win, lose and progress

- **Winning:** the promotion to Chief Toy Officer unlocks the Smartphone.
  Your crew builds the first one to 90% and your taps finish it, which
  starts Christmas Eve, the finale described
  under Screens. Afterwards the game keeps going in free play: everything
  still works, the counters keep climbing, the pile starts again from empty,
  and a toy's tally plate turns gold at 100 made.
- **At the top rank:** the cheer bar stays full, labelled "Chief Toy
  Officer", with your total cheer. (The original crashed here.)
- **Losing:** there's no way to lose.
- **Saved:** cookies, cheer, rank, the toy counters, each toy's progress,
  the selected toy, owned hammers, helpers and upgrades, the presents in
  the pile (a count only), settings, the time you left, whether the
  Smartphone task and the ending have been seen, and stats (taps, toys
  made, stars caught, time played).
- **When it saves:** every 10 seconds, on every purchase and promotion, and
  when the page is hidden.
- **Reset:** in settings, behind a two-step confirm.

## Screens

- **Title:** the workshop at night through a frosted window. The game name
  is in Mountains of Christmas, with "a remake of Xmas Clicker" below. The
  buttons are "Start building" (or "Keep building" with a save) and "How to
  play".
- **How to play:** three short cards with pictures: tap the bench to build
  toys; spend cookies on hammers and helpers; earn cheer to get promoted.
- **Workshop (the main screen):**
  - Top bar. On phones it has two rows: (1) the rank title, scaled down to
    fit (the longest, "Assistant Junior Toy Maker", must fit at 360 px),
    plus the gear and speaker buttons; (2) cookies, the cheer bar to the
    next rank, and "4/tap · 12/s". On desktop it's one row.
  - The stage: Pip at the bench with the current toy, the tree with its
    present pile, and the crew working at the left, under the lanterns
    (see the stage map under Art direction). Below it: the toy's name and
    its red-and-white candy-stripe work bar.
  - Toy shelf: 10 cards, each with the toy's picture, a thin progress bar
    and a zero-padded brass tally plate ("0037"); locked toys show a
    padlock.
  - Shop: Hammers, Helpers and Upgrades.
  - Gear and speaker buttons.
- **Promotion:** a card slides in with Santa's portrait. Santa says one
  line, then the new title is set in big letters with the newly unlocked toy
  (and hammer, helper or upgrade) and "Now building: <toy>". Santa's "Ho ho
  ho", a fanfare and confetti. One button: "Back to work!" (after the 1 s
  guard). Each of the 9 promotions has its own line of dialogue; the last
  one ends "Build the last toy before the sleigh leaves!"
- **Welcome back:** the away-earnings card (only after 10 minutes or more
  away), with a "Back to work!" button.
- **Cards queue:** only one card shows at a time, in this order: Welcome
  back, then Promotion, then Christmas Eve.
- **Pause and settings:** music on/off, sound on/off, stats, credits, reset
  progress (confirm twice), and resume. Opening it pauses the shooting stars
  and the Star Rush timer; helpers keep working.
- **Christmas Eve (the finale):** a scripted sequence, one screen name per
  step in the frame log:
  1. `eve-lights`: the workshop lights dim, and the tree's strands switch
     on one by one, the tree-top star last.
  2. `eve-lift`: the presents float up off the pile and out of the top of
     the stage, a few at a time (the drawn slots empty).
  3. `eve-sky`: a 0.6 s crossfade to `finale-sky`, the moon over the
     rooftops; the sleigh, piled high with those presents, crosses the
     moon.
  4. `eve-card`: "Merry Christmas, Chief Toy Officer!", your stats, the
     credits, and a "Keep building" button.
- **Credits:** made by Rich Conlan, from Xmas Clicker (2017) and Sean's
  elves; made with gamegen; the fonts and their licenses.

## Juice

Must-haves:

- On every tap:
  - Pip swings the current hammer (the swing restarts on every tap, so
    fast taps never queue)
  - the toy squashes
  - a spark burst on the toy
  - a floating "+N"
  - a tap sound, picked from 3 variations with a small random pitch change
- On every finished toy:
  - it pops up with a bounce, and Pip's hammer spins once (as in the
    original)
  - it wraps into a present: a quick flash of paper
  - the present arcs into the pile under the tree
  - cookies tick up, with a sound
- **Many toys at once:** when one update finishes more than one toy, it
  shows one pop with "×75", one present arc and one set of sounds; no
  hammer spin. At most 3 presents are in the air at once.
- **The pile:** at most 40 presents are drawn, in fixed slots under the
  tree. Slot n (1–40) fills when the pile reaches 2^(n/4) presents, so it
  grows fast at first and is nearly full (about 39 slots, ~990 presents)
  at Chief Toy Officer. Past 40 slots a "×N" tag shows the count. After
  Christmas Eve the pile starts again from empty.
- Purchases: the card flashes, plus a coin-jar sound. New helpers walk (or
  roll, or trot) in from the left edge and take their place in the crew
  area. The crew area has 5 fixed slots: 3 elves, 1 Toy Machine, 1
  Reindeer Team (see the stage map). A slot shows once you own one of its
  kind; past the slots, a kind shows "×N" on its last figure.
- Promotions: confetti, the Santa card, and a fanfare. A new strand of
  lights (bulbs off) is hung on the tree, one per promotion.
- The first Smartphone at 90%: the work bar glows gold and pulses, the
  banner changes, and each tap throws extra sparks until it's done.
- The Star Rush: a gold vignette, a timer ring, and a looping sleigh-bell
  layer over the music.
- Cookie and cheer numbers count up instead of jumping.
- Big numbers are shortened: 12,400 → "12.4K", then "3.2M".

Nice to have:

- Snow outside the window.
- Helpers bob as they work.
- The tree twinkles.
- Screen shake on a Thunder Mallet hit.

## Art direction

- **Style line (pasted into every prompt):** "Cozy storybook illustration,
  gouache and coloured pencil, warm candlelit palette of cranberry red,
  pine green, cream, honey gold and cocoa brown, soft rounded shapes, gentle
  dark-brown outlines, soft warm lighting from the upper left, handmade and
  charming, no text."
- **Style anchor (made):** `pip-anchor.png`, 1024×1024, transparent. Pip,
  a young elf toymaker: curly red hair, a green pointed hat with a red
  zig-zag band and a brass bell, green tunic with a cream collar, a brown
  leather apron with a brass-buckled belt and a tool pouch on his right
  hip, red-and-white striped stockings, curled brown boots with bells.
  His right hand is a loose fist at his chest holding the apron strap; the
  left hand is open at his side. No mallet. Three-quarter view from the
  front, facing right, full body. His body fills about 45% of the canvas
  width (alpha box x 284–747, y 0–1010). Every later image uses Pip as a
  reference. The anchor itself is never put on the stage: the swing's
  frame 0 is the idle pose.
- **One camera:** everything on the stage is seen from the front at the
  same eye height. Characters stand three-quarter, facing right; the bench
  is straight on (as made), with its top just visible.
- **Pip's swing:** one anim8gen animation made from the anchor. Brief:
  "Pip alone, no bench, no hammer, no props; right hand a closed empty
  fist; striking down at chest-to-waist height in front of him, to the
  right." 4 frames: 0 idle (also the pose between taps), 1 raise, 2
  strike, 3 follow-through. All frames share one canvas, one scale and
  one foot line (anim8gen's bottom-centre alignment). After alignment, a
  small JSON file gives, per final frame in `assets/anim8gen/pip-swing/
  frames/`, the fist pivot (x, y), the hammer angle, and a fist crop box.
  The current hammer (hammer-1…4) is drawn in code at the pivot, then the
  fist crop is drawn again on top, so the fingers wrap the handle. Every
  hammer is drawn with the same handle length (35% of Pip's height) from
  a per-hammer grip point, so on the strike frame every head lands on the
  toy's top centre.
- **Stage map** (in % of the 4:3 stage, x from left, y from top; checked
  with a Pillow mock of the real images, `.gamegen/review/stage-mock.png`,
  made by `stage-mock.py` from `stage-map.json`). Sizes are the image's
  full canvas width; "foot" is where the image's lowest opaque pixel sits.
  - **Background** (`workshop-bg`, as made): fills the stage. Arched night
    window x 16–52, y 10–58 (sill at 57); lanterns upper left (x 4–18, y
    0–35); garland along the top; tool rack and jar shelves upper right
    (x 55–99, y 14–45); the back wall meets the floor at y 66; the floor
    (y 66–100) is empty.
  - **Star band:** the shooting star crosses the window inside x 18–50, y
    13–40, above Pip's hat (top at y 45).
  - **Tree** (`tree`, 1024×1536): canvas 29% wide at x 71, foot at y 89.
    The tree shows at x 72–99, y 32–89, in front of the jar shelves.
  - **Bench** (`bench`, 1536×1024): canvas 40% wide at x 36, foot at y
    91. It shows at x 36–76, y 61–91; the top surface is y 62–70; the vice
    is at its left end (x 37–43).
  - **Toy spot:** toy canvas 14% wide at x 45, foot at y 68.5 (on the
    bench top). The toy shows at about x 46–59, y 52–68.5. Its top centre,
    about (52, 55), is where the hammer lands.
  - **Pip** (`pip-swing` frames, same scale as the anchor): canvas 40% wide
    at x 12, foot at y 98. His body shows at x 23–41, y 45–98, standing in
    front of the bench's left end (over the vice). His idle fist is at
    about (31, 61); on the strike frame the fist reaches about (40, 64).
    His hat crosses the window's lower left panes; nothing else is there.
  - **Crew area** (left, under the lanterns, x 0–25, y 49–88): five square
    slots, each figure's feet at the slot's bottom. Back row (feet at the
    wall line): elf 1 x 1–11.5, y 52–66; elf 2 x 7.5–18, y 51–65; Toy
    Machine x 12–22.5, y 50–64. Front row: elf 3 x 0–12, y 71–87;
    Reindeer Team (bigger, it's two reindeer) x 9–25, y 66–87.5. The
    figures overlap each other a little, back row first. Pip's hat bell
    touches the Toy Machine slot's corner; Pip is drawn over it.
  - **Present pile:** x 66–100, y 80–99, in front of the tree's tub and
    the bench's right legs.
  - **Draw order** (back to front): background, star and its glow, crew
    back row, crew front row, tree and its lights, tree-top star, bench,
    pile, toy, Pip, the hammer canvas (hammer, then the fist crop),
    particles and floating numbers, the presents flying to the pile, the
    banner and the tap hint.
  - On a portrait phone (390 px wide) the stage is about 290 px tall: Pip
    is about 150 px tall, the toy about 55 px wide, back-row crew figures
    about 40 px.
- **The tree (made):** a plain fir in a wooden tub with iron bands, no
  lights, a bare tip, 1024×1536. Nine
  light strands are hand-placed paths, and the tip is a point, in
  `assets/tree-lights.json`; code draws the bulbs. The tree-top star is its
  own image (`tree-star`), drawn dim until Christmas Eve, then lit.
- **Look:**
  - Toys and hammers are chunky, readable icons, like the three made:
    the Wooden Tractor (red cab, green body, a little elf driver), the
    Doodle Dial (a cream screen in a green rim with brass rivets, a brass
    crank, on a red stand) and the Pixel Play (a cream-and-red handheld
    with a green screen, a brass d-pad and a red wrist strap).
  - The elf-hammer upgrades are not bare hammers (those would look like the
    hammers shop): each is a helper elf holding a small hammer, wood, then
    steel, then gold.
  - Characters are drawn as storybook figures.
  - The three gold things are told apart: the shooting star is a white-gold
    streak, the tree-top star a gold five-point star, and the cheer icon a
    red bell with holly (not a star).
  - Backgrounds are painterly and a little soft, so the UI sits on top.
- **Size:** a responsive layout, not a fixed canvas. The stage has a fixed
  4:3 aspect, scaled to fit its slot. imagegen2 needs at least 655,360
  pixels and edges that are multiples of 16, so squares are generated at
  1024×1024 and wide pictures at 1536×1024 or 1280×640, then scaled down
  with Pillow. Everything ships as WebP (with alpha where transparent);
  a 1024 PNG toy is 1.7 MB, the same toy as a 256 px WebP is 16 KB. Toys
  ship at 384 px (on the bench and the shelf); shop, upgrade and other
  icons at 256 px (shown at 64–128 px); Pip's frames at 512 px; stage
  props and backgrounds as in the asset list. The anchor isn't shipped.
- **UI:**
  - The interface is drawn in code.
  - Cards look like cream paper with a dark-brown outline and a red ribbon
    corner, and shop buttons look like wooden plaques.
  - The work bar is a red-and-white candy stripe and the cheer bar is green
    and gold.
  - Fonts: Mountains of Christmas (as in the original) for titles and the
    rank, and Nunito for everything else. Both are under the Open Font
    License and bundled with the game.
- **Staying consistent:**
  - Every later image passes the style anchor to imagegen2 as a reference.
  - Backgrounds come from nanogen with the anchor as a reference.
  - The toy icons come from one shared prompt, with only the toy changed,
    and toy-01 as a second reference.
- **Shared-design pictures (made):** at final spec and used later in the
  game: pip-anchor, workshop-bg, bench, tree, toy-01, toy-05 (Doodle Dial)
  and toy-08 (Pixel Play), the two original designs. A mock of the
  workshop screen is composited from them in code (Pillow), at no
  generation cost.

## Audio direction

- **Music:**
  - "Workshop" is a cheerful, cozy instrumental with celesta, pizzicato
    strings, sleigh bells and light woodwinds, at a medium tempo. 120
    seconds, looped in code with a 2-second crossfade (audiogen music has
    no loop flag).
  - "Christmas Eve" is a warm, swelling orchestral version of the same
    mood, for the finale, 60 seconds long. It plays from `eve-lights`;
    if the player is still on the final card when it ends, it fades into
    the workshop loop.
  - During a Star Rush a looping sleigh-bell sound plays over the music
    (the music's speed and pitch don't change).
- **Sound effects** (audiogen's shortest is 0.5 s; shorter sounds are
  trimmed in code):

| Action | Sound |
|---|---|
| Tap (3 variations) | Wooden mallet on wood, *tok* |
| Heavy tap (Supreme Hammer and Thunder Mallet) | Deeper thunk with a small clang |
| Toy done | Bright pop and chime |
| Present flies to the pile | Paper rustle and whoosh |
| Cookies earned | Cookie-jar clink |
| Purchase | Cash register with a sleigh bell |
| Can't afford, or locked | Soft wooden knock and "nope" bell |
| Elf hired | Cheerful little "hup!" with a jingle (no words) |
| Promotion | Fanfare and an elf crowd cheer; Santa's "Ho ho ho" (a voice line) layered on top in code |
| Shooting star appears | Sparkly shimmer |
| Shooting star caught | Magical whoosh |
| Star Rush (loop) | Bright sleigh bells, seamless loop |
| Star Rush ends | Soft wind-down chime |
| UI click | Wooden tick |
| Christmas Eve | Sleigh bells taking off |

- **Voice:** Santa's "Ho ho ho!", one short line from audiogen voice (a
  warm, deep, older male voice), 2–3 takes, the best one kept.
- **Not a wall of noise:** at most 30 sounds a second in all, and per
  effect: toy done at most 4 a second; rustle and clink at most once per
  300 ms each (merged). Past those limits, one "batch done" sound (the toy
  done sound, pitched up) plays instead, and the floating numbers show
  totals.

## Asset list

| ID | What it is | Tool | Generate at → ship at | Transparent | Animation | Priority |
|---|---|---|---|---|---|---|
| pip-anchor | Pip, the style anchor (made: empty fist at the chest, leather apron, tool pouch, no mallet; full body, three-quarter front, facing right) | imagegen2 | 1024×1024 PNG, kept in `.gamegen/` as the reference, not shipped | yes | | must (shared design, made) |
| pip-swing | Pip alone, no bench, no hammer, no props, right hand a closed empty fist, striking down at chest-to-waist height in front of him to the right | anim8gen (from pip-anchor) | 1024×1024 → 4 frames, 512×512 WebP each (frame 0 = idle), plus a pivot JSON measured on the final aligned frames | yes | 4-frame swing, ~120 ms, restarts on every tap; hammer and fist crop drawn in code | must |
| workshop-bg | The empty workshop interior (made): arched night window x 16–52%, lanterns, garland, tool rack and shelves, empty floor from y 66% | nanogen (anchor as style ref) | 2400×1792 → 1600×1200 WebP | no | | must (shared design, made) |
| bench | The workbench (made): front view, empty top, green vice on the left end, carving tools on the right end, lower shelf with offcuts | imagegen2 (ref anchor) | 1536×1024 → 1024×683 WebP | yes | | must (made) |
| tree | Christmas tree (made): plain fir in a wooden tub, no lights, bare tip | imagegen2 (ref anchor) | 1024×1536 → 683×1024 WebP, plus hand-placed `tree-lights.json` | yes | lights drawn in code | must (made) |
| tree-star | The tree-top star | imagegen2 (ref anchor + tree) | 1024×1024 → 256×256 WebP | yes | dim, then lit, in code | must |
| presents | 6 wrapped presents, different colours and sizes, on one sheet, cut apart in code | imagegen2 (ref anchor) | 1024×1024 → 1024×1024 WebP | yes | | must |
| toy-01…toy-10 | The 10 toys, one each: Wooden Tractor (made), Yo-yo, Puzzle Cube, Wooden Sword, Doodle Dial (made: cream screen in a green rim, brass crank, red stand), Fidget Spinner, Chess (king and knight), Pixel Play (made: cream-and-red handheld, green screen, brass d-pad), Bike, Smartphone (generic, no logos) | imagegen2 (ref anchor + toy-01) | 1024×1024 → 384×384 WebP each | yes | | must (toy-01, 05, 08 made) |
| hammer-1…hammer-4 | Cheap Hammer, Heavy Hammer, Supreme Hammer (brass and red), Thunder Mallet (a stormy blue-silver mallet with a crackle of lightning, original design); drawn straight, handle down, for rotating in Pip's hand; grip point noted per hammer | imagegen2 (ref anchor) | 1024×1024 → 256×256 WebP each (shop) and 512×512 WebP (in hand) | yes | rotated in code | must |
| elf-helper | A helper elf (different from Pip: a red tunic) at work, three-quarter, facing right | imagegen2 (ref anchor) | 1024×1024 → 256×256 WebP | yes | bobbing in code | must |
| toy-machine | Clockwork gingerbread toy machine, three-quarter, facing right | imagegen2 (ref anchor) | 1024×1024 → 256×256 WebP | yes | wobble in code | must |
| reindeer-team | Two reindeer working a big wooden toy press, facing right | imagegen2 (ref anchor) | 1024×1024 → 384×384 WebP | yes | bobbing in code | must |
| upgrades | 6 icons: helper elf holding a wooden, a steel and a golden hammer (3, ref elf-helper), mug of hot cocoa, wrapping station, conveyor belt | imagegen2 (ref anchor) | 1024×1024 → 256×256 WebP each | yes | | must |
| cookie | Cookie icon (the currency) | imagegen2 (ref anchor) | 1024×1024 → 256×256 WebP | yes | | must |
| cheer | Cheer icon (a red bell with holly; not a star) | imagegen2 (ref anchor) | 1024×1024 → 256×256 WebP | yes | | must |
| lock | Padlock icon | imagegen2 (ref anchor) | 1024×1024 → 256×256 WebP | yes | | must |
| shooting-star | Shooting star with a sparkly white-gold tail | imagegen2 (ref anchor) | 1280×640 → 512×256 WebP | yes | glow in code | must |
| santa-portrait | Santa, bust portrait, jolly, for the promotion card | imagegen2 (ref anchor) | 1024×1024 → 512×512 WebP | yes | | must |
| title-art | The workshop at night, warm windows, snow, the tree visible inside, room at the top for the title | nanogen (ref anchor + workshop-bg + tree); the 9:16 phone version uses the 4:3 one as its reference | 4:3 at 2K → 1600×1200 WebP, plus a 9:16 phone version → 1080×1920 WebP | no | | must |
| finale-sky | A huge moon over snowy rooftops, night sky; no sleigh | nanogen (ref anchor) | 4:3 at 2K → 1600×1200 WebP | no | pans slowly in code | should |
| sleigh-cutout | Santa's sleigh and reindeer alone, the sleigh piled high with wrapped presents, for flying across the moon | imagegen2 (refs santa-portrait, finale-sky, presents) | 1536×1024 → 1024×683 WebP | yes | moves in code | should |
| howto-1…3 | How-to-play pictures: reuse the game's own art, put together in code | code | — | — | | must |
| mock-workshop | Mock of the workshop screen for the shared design, composited from the shared-design pictures | code (Pillow) | 1280×800 PNG | no | | must (shared design) |
| app-icon | App icon: Pip's face with a hammer, on red | imagegen2 (ref anchor) | 1024×1024, made into favicon, 192, 512 and maskable icons in code | no | | must |
| social-card | 1200×630 link preview, screenshotted from the title screen | code (playwright-cli) | JPG | no | | must |
| github-social | 1280×640 repo preview | code (playwright-cli) | PNG | no | | must |
| music-workshop | Workshop music | audiogen music | 120 s MP3 at 96 kbps | | looped with a crossfade | must |
| music-eve | Christmas Eve music | audiogen music | 60 s MP3 at 96 kbps | | | should |
| sfx-* | The 17 sounds in the sound table (3 taps; the Star Rush bells made with `--loop`) | audiogen sfx | 0.5–4 s MP3 each, trimmed in code | | | must |
| voice-santa-hohoho | Santa's "Ho ho ho!" | audiogen voice | ~1.5 s MP3 | | | should |

## Tech plan

- **Files:**
  - `game/index.html`
  - `game/style.css`
  - `game/src/` (ES modules):
    - `rules.js`: all the data and the pure rules (costs, rates, rank
      thresholds, the tap's crew share, carry-over, the first
      Smartphone's 90% cap, away earnings and their caps), with no DOM,
      so node can import it
    - `state.js`: the save, load and migrate code
    - `ui.js`: the panels, cards, the card queue and the input guard
    - `bench.js`: the stage, taps, the swing and the hammer, animations,
      particles, the pile and the tree lights
    - `audio.js`
    - `main.js`
  - plus `manifest.webmanifest`, `sw.js`, the icons and fonts, and
    `assets/` as in asset-guide.md (with `tree-lights.json` and the swing's
    pivot JSON).
- **Layout:**
  - The UI is in HTML and CSS: shelf, shop, bars, cards and dialogs.
  - The stage is a fixed-aspect 4:3 box. In it the art sits as positioned
    images (placed by the stage map, in the map's draw order), with one
    canvas layer for Pip's hammer and fist crop, particles, the presents
    flying to the pile, and the tree's lights. The stage map's numbers
    live in one object in `bench.js`.
  - Three layouts:
    - Portrait phones: one column (top bar, stage, work bar, panel, tab
      bar).
    - Landscape short screens, `(orientation: landscape) and (max-height:
      500px)`: stage left with the 28 px toy strip (name and work bar)
      under it; stage width = min((height − 28) × 4/3, width − 240 − the
      side safe insets); a right column with the rest (at least 240 px):
      top bar (the title may wrap to two lines, at least 14 px), tabs 48
      px tall with the gear and speaker, and the panel.
    - 900 px wide and up (and not short landscape): three columns.
  - The layout respects `env(safe-area-inset-*)`. The page never scrolls
    as a whole; the panel scrolls inside itself.
- **Loop:** `requestAnimationFrame`, with a fixed 10 updates a second for
  the economy and helpers, and smooth per-frame animation on top. Time is
  measured with `performance.now()`. Each update finishes every toy the
  work covers and carries the rest over. While any card is open the
  economy updates are skipped (helpers, stars and the Rush timer all
  wait); animation keeps running. Time with the page hidden goes through
  the away rule on `visibilitychange`; a stall of more than 5 seconds
  while visible is treated the same way.
- **Away function** (`away(state, seconds)` in `rules.js`): full speed
  under 10 minutes, half speed after, at most 4 hours; work goes to the
  toy selected when you left; all cookies kept; cheer clamped at the
  threshold of the rank after next minus 1; a promotion it causes queues
  its card but doesn't switch toys; the first Smartphone's 90% cap
  applies, so away time never finishes it. `tools/balance.mjs` tests each
  of these.
- **Input:**
  - Pointer events on the stage: one hit per `pointerdown`, whatever the
    pointer type, so several fingers work.
  - Space and Enter count on `keydown`, but only when `!e.repeat`, and
    never while a card is open. One window-level keydown listener in the
    capture phase calls `preventDefault()` for Space and Enter, so they
    never activate a focused button or card; shop and toy cards blur
    after a pointer click. (Cards close with their button by pointer, or
    Esc.)
  - A pointerdown on the shooting star's hit area catches the star and
    stops there: no hammer hit.
  - Number keys 1–9 and 0 pick toys; Esc or P pauses (or closes a card
    after its guard); M mutes.
  - Cards: one queue (Welcome back, Promotion, Christmas Eve); a 1-second
    input guard when each opens; they close only with their button or Esc.
  - Buttons are only re-rendered when their state changes (affordable,
    locked, owned, new), never every frame.
  - To keep up with fast tapping: no rate cap on taps, but the sound limits
    above and at most 40 particles at once.
- **Numbers:** plain JS numbers (the top is well under 1e12) and one
  `format()` helper for short numbers ("12.4K"). The tally plates are
  zero-padded to 4 digits, then switch to short form past 9999.
- **Audio:**
  - Web Audio throughout: buffers decoded at the first input, music
    looping through a gain node with a 2 s crossfade, and the effects in a
    small pool with the per-effect limits.
  - The Star Rush bells loop on their own gain node and fade out when the
    Rush ends.
  - Music and sound can be muted separately, and both settings are
    remembered.
  - The music ducks while paused.
- **Saving:** `localStorage["chief-toy-officer"]` holds a JSON object with
  `version: 1` and is migrated on load. A broken save is backed up to
  `…-broken` and a fresh one is started.
- **Offline and install:** a manifest (orientation `any`, theme cranberry
  `#9e2a2b`) and a service worker that caches every file, with a cache name
  that changes per version. Nothing loads from the internet.
- **Balance script:**
  - `tools/balance.mjs` imports `rules.js` and simulates a player who
    always builds the newest toy and buys the item with the best gain per
    cookie when they can afford it. Stars come from rank 4, one about every
    90 seconds plus 8 seconds of drift; a caught one gives the 20-second
    Rush. It prints the time to each rank and the longest wait between
    purchases.
  - It models taps as the hammer's part plus 15% of the crew's work/s,
    the Rush (hammer part ×5, helpers ×2), and the first Smartphone's
    90% helper cap. Simulated time is active time with no card open.
  - Checks: the reference player (3 taps/s, catches every other star) has
    every rank within ±25% of its target time, never waits more than 90
    seconds between purchases, buys every hammer and upgrade before
    Chief Toy Officer, and gets at least 30% of its work from taps at
    every rank and 30–42% from rank 5 on (taps lead while the crew is
    small); a player at 2 taps/s with no stars reaches Christmas Eve in
    under 45 minutes. It also tests the away rules above.
  - It saves a snapshot of the reference player's save at the moment it
    reaches each rank (`tools/snapshots/rank-<n>.json`), for `goToLevel`.
  - Its starting point is `tools/balance-draft.mjs` with
    `tools/balance-draft-params.json`, which already pass with this
    design's numbers (see Structure and difficulty). If any number
    changes, re-run it.
- **Debug hook:** `window.__game`, as in web-target.md:
  - Always on, read-only: `state()` (screen, `level` and `rank` (the
    same, 1–10), cookies, cheer, toy, progress, helpers, hammers,
    upgrades, Rush, `levelComplete` (true once the next rank is reached,
    or at rank 10 once Christmas Eve has started), `gameWon` (ending
    seen)),
    `frames()` (the screen-change log, naming screens such as
    `workshop`, `workshop>promotion`, `eve-lights`, `eve-lift`,
    `eve-sky`, `eve-card`), `audioState()`, and `levels()` (10).
  - With `?debug` in the address only: `goToLevel(n)` (loads the balance
    script's snapshot for rank n: the reference player's save as it
    arrived there, so the rank can be finished at a normal pace),
    `addCookies(n)`, `addCheer(n)`, `setRank(i)`, `tap(n)`,
    `advance(seconds)` (runs helpers and stars without waiting),
    `spawnStar()`, `seedStars(seed)` (fixes the star timer so runs
    repeat), and `setAway(seconds)` (fakes time away).
- **Proving the whole game:** per rank, `goToLevel(n)` then real taps
  (`run-code`, ~10/s) and real clicks on affordable cards until
  `levelComplete`. Then one full real-input run from a fresh save,
  started as a background `run-code` (about 12 minutes at 10 taps/s with
  every star: the script gives Christmas Eve at 11:51; 13:54 at 8/s),
  logging each rank's time to
  `window.__runLog`, read with a separate `eval` while it runs.
- **On other devices:** not needed (platform is both).

## Cut list

Drop in this order, if needed:

1. The sleigh flying across the finale. Instead the loaded sleigh
   cut-out holds still in front of the moon while the sky pans (the
   presents still float up out of the workshop first).
2. The finale music. Instead the workshop music plays at a slower tempo.
3. Santa's "Ho ho ho" voice line. The promotion keeps its fanfare and
   cheer.
4. The Conveyor Belt and Golden Elf Hammers icons. They're drawn in code
   instead (the upgrades stay, for the balance).
5. The phone version of the title art. Instead the title is cropped with
   CSS.
6. Snow and twinkle effects.

The tap, the swing, toys, hammers, all three helpers, ranks, promotions,
the tree, the pile and saving are never cut.

## Effort and cost estimate

A forecast, not a promise.

- **Effort:** 10 ranks and 10 toys, 4 hammers, 3 helpers, 6 upgrades and
  shooting stars. About 35 imagegen2 images, 4 nanogen backgrounds, 1
  animation, 2 music tracks, 17 sound effects and 1 voice line. 8 screens
  and 3 layouts.
- **The hardest work:**
  - the balance: getting 26 minutes that never feel like waiting
  - making the tap feel great on phones, with the hammer in Pip's fist
    (the pivot JSON and the fist crop) landing on every toy
  - keeping 27 icons in one style
- **Cost:**
  - Already made and accepted (pip-anchor, workshop-bg, bench, tree,
    toy-01, toy-05, toy-08): $0.64 spent, counted in the lines below. The
    screen mock is composited in code.
  - Images (imagegen2, about 35): about $8–10.
  - The Pip animation: about $1.5.
  - nanogen backgrounds (4): about $0.5.
  - Music (3 minutes): about $1.
  - Sound effects (17) and the voice line: about $2.5.
  - **Total about $14–16 of the $20, including retries.**
- **Download size:** under 6 MB in all: images under 2.5 MB (WebP, sizes
  as in the asset list), music about 2.2 MB at 96 kbps, sounds and fonts
  the rest.

## Definition of done

- [ ] Starts with no errors at desktop (1280×800), phone portrait (390×844 and 360×640) and phone landscape (844×390 and 667×375) sizes.
- [ ] The game can be played from the first tap to Chief Toy Officer, the first Smartphone and the Christmas Eve finale: every rank from its `goToLevel(n)` snapshot with real taps and clicks, and one full real-input run from a fresh save (background `run-code`, logged to `window.__runLog`).
- [ ] The balance script passes: the reference player (3 taps/s, half the stars) within ±25% of every target, no wait over 90 s between purchases, every hammer and upgrade bought before the top, taps at least 30% of the work at every rank (30–42% from rank 5); the slow player (2 taps/s, no stars) reaches Christmas Eve under 45 minutes; the away rules hold.
- [ ] Nothing happens behind a card: with a promotion card open for 30 s, cookies, toy progress and the Rush timer don't move. The first Smartphone stops at 90% without taps, and taps finish it.
- [ ] The game can always go on: no state without a way to earn, and Christmas Eve always reachable.
- [ ] Every control works on desktop (mouse and keyboard) and on touch; several fingers tapping at once all count; held keys don't auto-click; fast tapping never closes a card; click Buy, then press Space 5 times: no extra purchase, 5 hammer hits; tapping a shooting star catches it without a hammer hit.
- [ ] Every screen looks finished at every targeted size, from the first load; the longest rank title fits at 360 px, and is readable at 14 px or more with the work bar visible at 667×375 and 844×390; the panel shows at least two cards at 360×640.
- [ ] The stage matches the stage map: Pip, the toy, the bench, the tree, the crew and the window are all clearly visible, nothing covers the crew, and the crew and pile appear as they're earned.
- [ ] Pip swings the current hammer, in the same view as the rest of the stage; on the strike frame every hammer's head lands on the toy, and his fingers wrap the handle.
- [ ] The whole game downloads in under 6 MB (images under 2.5 MB).
- [ ] Music and sound play (after the first tap or key), mute works, and late-game batches don't flood the speakers.
- [ ] Progress is saved and restored, including each toy's progress and away earnings, and a broken save doesn't crash.
- [ ] Installs as an app and works offline.
- [ ] The kept parts are all there: the 10 rank titles word for word, the 10 toys (with the three renames), the zero-padded tally plates, four hammers, the tree and the present pile.
