# Asset files: the contract between the art and the build

Every shipped picture is WebP (alpha where transparent), **trimmed to its opaque box and padded
square** unless a size below says otherwise. The game loads exactly these paths under
`game/assets/`. Descriptions come from GAME_DESIGN.md's asset list; this file fixes names and
sizes. Takes are made in `.gamegen/candidates/<group>/`; only accepted ones are copied here.

Square icons: the subject fills about 88% of the square, centred, feet/base at the bottom edge for
figures (a 6% margin). "Figure" = full-figure helper, three-quarter, facing right, on a shared foot
line (so one file is both the shop icon and the stage figure).

## Shared (`shared/`)

| File | Size | What |
|---|---|---|
| santa-portrait.webp | 512² | (done, reused) |
| santa-slumped.webp | 512² | Santa slumped bust, weary (Act 2 act-win card) |
| santa-beach.webp | 768×576, opaque | Santa in a sun hat on a beach, waving (postcard picture side) |
| pip-clerk.webp | 512 tall | Pip in clerk outfit: green visor, sleeve garters, waistcoat (full body, ¾, facing right) |
| pip-coat.webp | 512 tall | Pip in Santa's coat, much too big, sleeves rolled up four times |
| pip-suit.webp | 512 tall | Pip in a red star-sleigh suit with a glass bubble helmet |
| icon-cookie.webp, icon-cheer.webp, icon-insight.webp, icon-declare.webp, badge-mitten.webp, badge-eye.webp | 256² | the icons sheet (cheer = red bell with holly; insight = green glass lens on brass; declare = cream gift box tied with red ribbon) |
| lens.webp | 256² | the Insight lens glass alone, cut round, **desaturated** (for tinting in code) |
| lucky-star.webp, lucky-letter.webp, lucky-cloud.webp, lucky-comet.webp | 512×256 | lucky things (letter: blank envelope, no writing) |
| noel-box.webp | 512 wide | NOEL body 1, **lit/clean** |
| noel-box-dusty.webp | 512 wide | NOEL body 1, dusty and dark (same pose, by edit) |
| noel-cabinet.webp | 700 wide max | NOEL body 2 |
| noel-console.webp | 1250 wide max | NOEL body 3 |
| noel-core.webp | 790 tall max | NOEL body 4 |
| noel-eyes.json | | per body: lens ring centre (x, y) and radius in that file's pixels, plus a `portrait` crop box [x, y, w, h] for the card portrait |
| title-art.webp | 1600×1200 opaque | the workshop at night through a frosted window, no NOEL, room at the top for the title |
| title-art-tall.webp | 1080×1920 opaque | the same, 9:16 |
| app-icon.png | 1024² opaque | Pip's face with a hammer on red, tiny green eye glint in a corner (safe margin for maskable) |

## Sprites (`sprites/`)

| File | What |
|---|---|
| pip-swing/0.webp … 3.webp | 512² each, same canvas, foot line, scale: idle, raise, strike, follow-through; empty fist |
| pip-swing/pivots.json | `{ "frames": [ { "pivot": [x, y], "angle": deg, "fist": [x, y, w, h] }, ×4 ] }` in 512-px frame coords: the fist's grip point, the angle a straight handle-down tool should be rotated to sit in the fist (0 = handle pointing straight down, positive = clockwise), and a crop box around the fist to redraw on top |
| pip-clerk-swing/0.webp … 3.webp + pivots.json | the same for clerk Pip |

## Act 1 (`act1/`)

| File | Size | What |
|---|---|---|
| workshop-bg, bench, tree, toy-01, toy-05, toy-08, hammer-1, hammer-1-hand | | (done, reused) |
| toy-02 … toy-10 (02 Yo-yo, 03 Puzzle Cube, 04 Wooden Sword, 06 Fidget Spinner, 07 Chess king+knight, 09 Bike, 10 Smartphone: generic, blank screen, tiny green NOEL-eye camera) | 384² | toys, matching toy-01 |
| hammer-2 … hammer-4 (Heavy, Supreme brass-and-red, Thunder Mallet stormy blue-silver with a crackle) | 256² | shop icon; **drawn straight, handle down** |
| hammer-2-hand … hammer-4-hand | 512² | the same pictures at 512, plus `hammers.json`: per hammer the grip point (x, y) in the 512 file (where the fist holds the handle) and the head's centre |
| tree-star.webp | 256² | gold five-point tree-top star; tree-star-big.webp 1024² |
| presents-1 … presents-6 | 256² | wrapped presents, varied colours and sizes |
| elf-helper, toy-machine, reindeer-team, assembly-line | 384² | the crew figures (elf: red tunic, not Pip; toy machine: clockwork gingerbread contraption; two reindeer working a big toy press; short conveyor with little brass arms each with a green eye) |
| upg-elf-hammers, upg-steel-elf-hammers, upg-golden-elf-hammers (helper elf holding a wooden / steel / golden hammer), upg-hot-cocoa, upg-wrapping-station, upg-conveyor-belt, upg-plug-in-noel (a brass plug and cord) | 256² | upgrades |
| sleigh.webp | 1024×683 | loaded sleigh with reindeer, piled with presents (flies right) |
| finale-sky.webp | 1600×1200 opaque | a huge moon over snowy rooftops at night, no sleigh |

## Act 2 (`act2/`)

| File | Size | What |
|---|---|---|
| list-room-bg.webp | | (done) |
| clerk-desk.webp | 1024×683 | high clerk's desk, front view, empty blotter |
| file-01 … file-10 | 384² | folder icons: a blank folder with a big emblem (elf hat, antlers, village, town, skyline, headphones, a mug, a paw, a glowing screen, Santa's hat) |
| stamp-1 … stamp-4 (Rubber Stamp, Double Stamp, Rolling Stamp, the Great Seal) | 256² shop, and stamp-N-hand.webp 512² (handle up), plus `stamps.json` grip points like hammers.json |
| list-elves, window-watchers, letter-carriers, elf-field-office (hand-run) ; snow-globe-cams, chimney-sensors, sleigh-sats, list-engine (NOEL-run) | 384² | helper figures |
| upg-reading-glasses, upg-cocoa-thermos, upg-nice-ribbons, upg-pneumatic-tubes, upg-wish-board, upg-second-chances, upg-night-shift | 256² | upgrades |

## Act 3 (`act3/`)

| File | Size | What |
|---|---|---|
| deck-bg.webp | | (done) |
| globe-map.webp | 1024×512 opaque | seam-repaired equirectangular map (also globe-map-2048.webp 2048×1024 for ending 3) |
| holdout-01 … holdout-10 (North Pole Town, Ski Towns, The Suburbs, The Summer Side, Megacities, Night-Shift Workers, The Grumps, The Oceans, The Moon, Earth Itself) | 384² | job icons |
| moon-hat.webp | 384² | the Moon wearing a Santa hat |
| bow.webp | 512² | a big red satin bow |
| bell-1 … bell-4 (Hand Bell, Sleigh Bells, Bell Tower, Planetary Carillon) | 384² | used for shop and stage |
| santa-stations, elf-choirs, sleigh-depots, reindeer-airlift ; gift-drones, cheer-towers, snow-machines, orbital-tinsel | 384² | helper figures |
| upg-bigger-sacks, upg-warm-mittens, upg-sing-along, upg-carol-books, upg-gift-shops, upg-twelve-days-of-overtime | 256² | upgrades |

## Act 4 (`act4/`)

| File | Size | What |
|---|---|---|
| bridge-bg.webp | | (done) |
| species-01 … species-09 (Moon Moss, Crystal Choir, Driftwhales, Burrowfolk, Glimmerkin, Hive of Nine Suns, The Ones Who Want Nothing, Clockwork Wanderers, The Eldest) | 450² | portraits |
| species-10.webp | 384² | The Universe Itself job icon (a swirl of galaxy, no face) |
| scanner-1 … scanner-4 (Brass Telescope, Radio Dish, Wish Beacon, Star Lens) | 384² | shop and stage |
| crewed-sleighs, elf-colonies, star-choirs, pips-fleet ; sleigh-probes, ornament-sats, star-forges, wreaths-of-light | 384² | helper figures |
| upg-warmer-suits, upg-star-cocoa, upg-colony-bakeries, upg-letters-from-home, upg-gift-exchange, upg-home-for-the-holidays | 256² | upgrades |

## Locks (`locks/`)

| File | Size | What |
|---|---|---|
| chain-loop.webp | 256² | loop of iron chain with tinsel woven in |
| padlock.webp | 256² | big padlock |
| chain-run.webp | 1024×128 | straight horizontal chain, tileable left-right |
| clamp.webp | 256² | the brass Grip clamp |
| chain-badge.webp | 128² | small chain badge |
| padlock-small.webp | 64² | small padlock, readable at 24 px |
| override-1 … override-5, lever.webp | 384² | Elf Review Board (table of elves with quills), Unplugged Workshop (candle-lit wing, no wires), Bell Rope (great bell rung by hand), Pip's Own Sleigh (old wooden sleigh crewed by elves), Hand Crank as tall as a tree; Manual Override Lever |

## Endings (`endings/`)

ending-1.webp … ending-6.webp, 1600×1200 opaque (see the Endings table for content), focal
point inside the central 9:16 band.

## Audio (`audio/`)

MP3. Music: `music/workshop, eve, list, earthmas, starsleigh, stinger-review, stinger-wrap,
stinger-top, musicbox, candle`. Voices: `voice/santa-hohoho, santa-there-you-are, noel-hello,
noel-woke, noel-secured, noel-merry, noel-goodnight`. Effects (`sfx/`): tap, heavy-tap, toy-done,
present-rustle, cookie-clink, purchase, cant-afford, elf-hup, fanfare, star-appear, star-caught,
rush-bells (loop), rush-end, ui-click, eve-sleigh; stamp, bell, ping, file-done, holdout-won,
first-contact, letter-appear, cloud-appear, comet-appear, noel-buy, noel-speak, override-built,
lever-clunk, check-complete, lock, unlock, grip, seal-slam, ribbon-zip, stars-gather, declare,
transition, rush-paper (loop), rush-choir (loop), mitten-chime.
