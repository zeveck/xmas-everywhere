# Assets

Prices: imagegen2 (gpt-image-2.6-flare) about $0.053 for a high 1024² image and $0.041 at 1536×1024, plus about $0.008 per reference image (from the imagegen2 log, 2026-11-23); nanogen pro 2K $0.134 list. Reused from Chief Toy Officer (paid there, $0 here): pip-anchor, workshop-bg, bench, tree, toy-01, toy-05, toy-08, santa-portrait, hammer-1.

## Mock pictures for the shared design (final spec; they become game assets)

| ID | File | Tool | Prompt (short) | Tries | Est. cost |
|---|---|---|---|---|---|
| noel-box | design/mockups/noel-box.png | imagegen2 high 1024² transparent, ref anchor | NOEL's first body, walnut and brass, empty lens ring, tape slot | 1 | $0.08 |
| noel-cabinet | design/mockups/noel-cabinet.png | imagegen2 high 1024×1536 transparent, refs noel-box, anchor | wall of three cabinet columns, empty lens | 2 | $0.20 |
| noel-console | design/mockups/noel-console.png | imagegen2 high 1536×1024 transparent, refs box, cabinet, anchor | long console, blank green band, lens | 1 | $0.10 |
| noel-core | design/mockups/noel-core.png | imagegen2 high 1024×1536 transparent, refs box, cabinet, anchor | tall column, tinsel coils, lens | 1 | $0.10 |
| list-room-bg | design/mockups/list-room-bg.jpg | nanogen pro 2K 4:3, refs workshop-bg, anchor | empty List Room, blank scroll, flue; right third empty | 1 | $0.13 |
| deck-bg | design/mockups/deck-bg.jpg | nanogen pro 2K 4:3, refs list-room-bg, anchor | glass tower deck at night, aurora; centre open | 1 | $0.13 |
| bridge-bg | design/mockups/bridge-bg.jpg | nanogen pro 2K 4:3, refs deck-bg, anchor | brass viewport onto a violet galaxy; centre floor open | 1 | $0.13 |
| globe-map | design/mockups/globe-map.jpg (+ 2048×1024) | nanogen pro 2K 21:9, then 2 restyle edits | storybook equirectangular Earth; wave squiggles painted out in Pillow | 3 | $0.40 |
| stages-strip, act2-mock | design/mockups/*.png | code (Pillow) | composites of the above | – | $0 |

Seam repair on globe-map is still to do (asset phase).

Running total: about $1.28 of $20 (mockups: $1.28 of $5).

## Audio (made 2026-11-24, all accepted)

57 files in game/assets/audio/ (music 10, sfx 40, voice 7), MP3 96 kbps, about 8.8 MB. One try per music track; 42 effect tries (stamp and bell took 2); voices 3–5 takes each (Santa: "Mr. Pete - Warm & Wise"; NOEL: "River", one id for all five lines). About **$8.55** (music $3.45, effects $5.04, voices $0.06; 13,236 ElevenLabs credits).

Running total: about $9.83 of $30 (audio $8.55 of the $9 ring-fence).

## Acts 2–4, NOEL bodies, locks (made 2026-11-24, all accepted)

106 files: NOEL bodies trimmed from the mock pictures + `shared/noel-eyes.json`; 17 imagegen2 sheets (high, transparent, refs pip-anchor + toy-01 + the act's first sheet), one take each, cut into act2/act3/act4/locks files (`game/assets/sheets.json`); clerk-desk; globe map seam (2 nanogen edits that didn't fix it, then a Pillow ramp + crossfade); chain-run made tileable in Pillow. Every sheet checked for letters. About **$1.47** (helper's estimate).

Running total: about $11.30 of $30.

## Act 1, characters, icons, title, Pip's swings (made 2026-11-24, all accepted)

About 60 files: 7 toys, 3 hammers (+ hand versions and `act1/hammers.json`), tree-star, 6 presents, 4 crew figures, 7 upgrades (incl. Plug In NOEL), sleigh, finale-sky (nanogen), icons sheet + lens, 4 lucky things, pip-clerk/pip-coat/pip-suit, santa-slumped/beach, noel-box (+ dusty by edit), title-art 4:3 and 9:16 (nanogen), app-icon (2 takes), pip-swing (anim8gen, 6 tries) and pip-clerk-swing (14 tries: outfit edits of the pip-swing frames, registered with the same transform). About **$3.08**.

Running total: about **$14.40 of $30**.

## Endings (made 2026-11-24, all accepted)

ending-1…6, nanogen pro 2K 4:3 with the Endings table's references, 1600×1200 WebP. 12 calls (1: 2, 2: 2, 3: 1, 4: 1, 5: 3, 6: 2 + a pro edit to restore Pip's hat band). About **$2.88**.

**Running total: about $17.30 of $30.** Every asset in the design is made; nothing cut.


## Fix #3 (2026-11-25)

Act 1 now uses Chief Toy Officer's swing frames, hammers and step stool (already paid for there, $0). Act 2's clerk swing remade from those frames: 4 frames, 6 imagegen2 edits (medium, `--complexity low`), about **$0.45**.

Running total: about $17.75 (this change: $0.45 of its $20).

## Fixes #6 and #7 (2026-11-26)

toy-03 Puzzle Cube (3×3 on every face), toy-06 Wooden Train Set, toy-07 Remote Control Car: imagegen2 high 1024², transparent (native alpha), refs toy-01 + toy-02, one take each, trimmed to the toys' 384² frame with their feet on row 361. About **$0.21**.

Running total: about $17.96 (this change: $0.21 of its $20).

