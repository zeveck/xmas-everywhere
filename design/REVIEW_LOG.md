# Review log

## Round 1

Reviewers: Player, Builder (patched sim), Art and sound director. 30 findings: 2 must-fix (declaring at an act-win card lost the way on; an Act 4 lock could become effectively unclearable), 27 should-fix, 1 nice.

### Findings: player

# Round 1: Player review

### Declaring at an act-win card ends the game and loses the way forward
Severity: must-fix
Who meets it: most. How bad: breaks (lost progress). Fix: small
What's wrong: "Pressing 'Declare Victory & Merry Xmas' ends the game", and "Replay from Act N" exists only "for each act you've reached", loading "the save made when you first entered that act". Act 1's act-win card puts **Declare Victory & Merry Xmas** on the left, as the obvious "I won" button. A first-time player who presses it gets credits after 26 minutes, and can only go on by replaying all of Act 1, because Act 2 was never "reached". The same happens at every act-win card: taking ending 2 or 3 the honest way costs a 26-minute replay of that act before you can carry on. Act 4's card holds three endings (Xmas Everywhere, Xmas Forever, Silent Night), and each one after the first costs another full Act 4 replay (plus clearing any carried-over locks again for Silent Night). The cheap route is perverse: enter an act, declare at once ("a List 0% checked"), and replay from that act's start for nothing. Both routes give the same painting in the same Endings frame.
Why it matters: many players will take the left-hand button at the end of Act 1, think the game is over, and never see 75% of it. Collecting six endings, a stated goal of the brief, means roughly 80 minutes of re-grinding or a cheese that empties the endings of meaning.
Suggestion: when an act-win card appears, write a checkpoint *at that card*. After an ending from an act-win card, the Endings screen leads with "Back to the choice" (reopening the same act-win card), and Act 1's ending card adds NOEL's line "There's more, Pip. Shall we keep improving?" with a Continue button. Mid-act declares still send you back to the act's start (that's the real price). Mark endings 2 to 4 as "early" or "complete" in their frames (a ribbon or a star), so a declare at minute 0 doesn't fill the frame the same way finishing the act does.
Evidence: judgment, from GAME_DESIGN.md "Endings" (the Endings screen bullet) and "Decisions made on the player's behalf".

### The locks cost nothing a player can feel, so the button is no choice at all
Severity: should-fix
Who meets it: most. How bad: looks broken or misleads (the advertised core tension falls flat). Fix: medium
What's wrong: a lock stops only a mid-act Declare, and the design itself makes that worthless: "The act-win card is always free and clear", and declaring mid-act ends the game with an ending you could get at the act-win card anyway. Meanwhile "Each lock gives Overdrive: +10% to all work per lock (up to +40%)", and escalation adds more locks, so more Overdrive. A player who buys every flag and ignores every lock is strictly faster and loses nothing they know about. The only downside is Silent Night, which is secret. The hand-run vs NOEL-run choice then becomes plain cost-efficiency maths, because hands matter only for clearing locks.
Why it matters: "the button is the real question" is the game's hook, and the brief asks for something that "can get pretty locked down". Here getting locked down is a reward. Players will shrug at the chains after Lock 1.
Suggestion: give each uncleared lock a visible, felt cost that leaves the free act-win press alone. For example: (a) locks still on at an act-win change that act's ending into a colder variant (painting tint plus different last lines: "Santa did the rounds. NOEL rode along."), with warm and cold shown as two states in each Endings frame, so every act has a stake rather than only Act 4; (b) while locked, NOEL slowly converts hand-run helpers to NOEL-run ones (one every 90 s, shown on the meter), so the factory visibly slips away; (c) keep Overdrive, because the temptation is good, but pair it with (a) or (b). Also let the Endings screen hint at a sixth, quiet ending ("?" with "A candle, somewhere"), so players know a lock-free path exists.
Evidence: judgment, from GAME_DESIGN.md "The button and its locks" (Overdrive, escalation, the act-win card bullet).

### Which flag brings a lock is invisible and changes every act
Severity: should-fix
Who meets it: most. How bad: looks broken or misleads. Fix: small
What's wrong: locks arrive on "Act 2's third, Act 3's first and third, Act 4's second and third" flagged purchase. The ribbon only says "NOEL wants this one." In Act 2 a player buys two flags, nothing happens, and learns that flags are harmless; then the third one locks. In Act 3 the very first one locks. Nobody can learn the rule or plan around it, so a lock feels random rather than chosen.
Why it matters: a tempting choice needs the player to see it coming. "Buy this and NOEL takes the button" is the delicious moment, and it's hidden.
Suggestion: show NOEL's grip on the NOEL panel and on each flagged card as chain links that fill up ("NOEL's grip: ◼◼◻"). The flagged project that would complete the chain shows a padlock on its ribbon and NOEL's line "This one, and I'll keep the button safe for you." Keep the per-act counts if you like, but show them.
Evidence: judgment, from GAME_DESIGN.md "What brings a lock" and the lock-events bullets in Acts 2 to 4.

### "Hand share at that moment" is ambiguous, and one reading makes two locks cost 15 to 25 minutes
Severity: should-fix
Who meets it: most (every player who gets Lock 1 or Lock 4). How bad: breaks (a "detour" becomes a wall the length of an act). Fix: small
What's wrong: H is "your hand-run share at that moment plus 10 points". The share figures the design quotes ("68% (Act 2), 80% and 44% (Act 3), and 65% and 42% (Act 4)") are measured *before* the flagged project applies. Locks 1 and 4 come from projects that double NOEL-run helpers (Sleep Tracking, Self-Copying Probes), so the real share right after buying drops to 51% and 48%. With H taken from the quoted, pre-purchase numbers (70%), reaching it costs 905 s (Lock 1) and 1,407 s (Lock 4) of income. Measured after the purchase, it costs 124 s and 121 s. The sim also doesn't model locks at all: no override, no H, no escalation, no Overdrive. Its probe tests a flat 50%. So "Clearing a lock takes about 2–5 minutes" and "never-flag costs 12–14 minutes" (which ignores Overdrive) are untested.
Why it matters: built from the numbers as written, Lock 1, the player's first lock, is a 15-minute grind of hiring hands, and that's when the mechanic is learned.
Suggestion: define H as "the hand-run share just after the flagged project takes effect, plus 10, clamped 40–70". Fix the quoted shares (51, 80, 44, 48, 33). Make the sim run the real lock rules (H, override at 90 s of income, the 30 s hold, escalation at 6 min, Overdrive) and add a check: each lock is cleared within 6 minutes.
Evidence: a copy of tools/balance-draft.mjs at /tmp/claude-1000/-workspaces-gg-test5/0546aa63-8675-45f5-b0bb-9b713bfd820a/scratchpad/b.mjs, with the `handProbe()` call at the flag purchase changed to `handProbe(clamp(share+10, .4, .7))`. With the pre-purchase share: sleepTracking 905 s, selfCopyingProbes 1407 s, starHarvesting 1446 s. With the post-purchase share (`rates(st())` after `own.add`): 124 s, 121 s, 181 s. The original prints "50% costs 894s" for starHarvesting even with a flat 50%.

### Acts 2 to 4 are the same clicker at ×1000, and their "own mechanics" are passive
Severity: should-fix
Who meets it: most. How bad: a little off for each act, but across 80 minutes it's the thing players will quit over. Fix: medium
What's wrong: the sim builds every act from `CTO_JOBS` and one `TIER` table times a scale. The same 4 tools at ×5/×25/×120, the same upgrade ladder and the same 26-minute rank beats (0:40, 2:00, 4:00…) repeat in all four acts, and everything resets to 0 with nothing carried over. What's meant to make each act distinct barely touches play. Act 2's Nice share is a multiplier you raise by buying four items. The Wish Ticker, the most on-brief part ("what everyone wants", "influence what people want"), is "flavour only". Act 4's First Contact is a card you read. Only Act 3's Cheer Spot changes what your hands do. By Act 3 an idle-game fan will recognise the exact rhythm and feel that they're replaying Act 1 in new clothes.
Why it matters: the brief asks for "fully fleshed-out acts". The writing and stages are great, but the decisions are identical.
Suggestion: give each act one small decision tied to its theme and to the hand/NOEL axis. Act 2: each file shows its group's 3 wishes. Elves can "grant a real wish" (hand way: +Nice, slower) or NOEL can "shape it" (faster, adds a grip link). Act 4: each First Contact card ends with two buttons, "Give them what they asked for" (hand: a small Wonder gain, with a warm line) or "NOEL's way" (a bigger gain plus a grip link, and NOEL's line as written). That turns the best writing into choices. Also carry one thing over between acts (for example, your end-of-act hand share sets how many tier-1 helpers of each kind start free next act: "Your elves came with you"), so a choice in one act echoes into the next. Optionally vary the act lengths (for example 26/26/24/22) so the later acts don't have the same beat.
Evidence: tools/balance-draft.mjs lines 21–23 (`TIER`, `pairs`, `CTO_JOBS`) and lines 33–56 (Acts 2–4 are `scaleAct(..., K/M/B)` of the same tables). GAME_DESIGN.md Act 2 "What everyone wants: … Flavour only".

### Hand vs NOEL helpers isn't legible in a 360×640 portrait panel
Severity: should-fix
Who meets it: most phone players. How bad: looks broken or misleads. Fix: small
What's wrong: Acts 2 to 4 have 8 helper cards (4 tiers × hand/NOEL), plus the Hands | NOEL meter, plus an override card while a lock is on, all in the Helpers tab. At 360×640 the panel is about 186 px (640 − ~88 top bar − 270 stage − ~32 job strip − 64 tabs). That's the meter, the override and about one helper card. The design never says the two versions of a tier sit together, so comparing "List Elves 15K" against "Snow Globe Cams 9K" means scrolling, and the meter's H tick and the cards you need to buy are never on screen together while you clear a lock.
Why it matters: the hand/NOEL choice is the game's second decision, and on phones it becomes a scrolling chore you can't read at a glance.
Suggestion: one row per tier with two half-width buttons side by side (mitten on the left, warm red; eye on the right, NOEL green), each with name, cost and owned count. Shrink the meter into the Helpers tab's header (a 6 px two-colour bar with the H tick). The override becomes the first row only while a lock is on. Give the Lock card a "Hire hands" button that closes it and opens Helpers. Add a layout check at 360×640 to the definition of done: tier 1 and 2 pairs visible without scrolling.
Evidence: judgment, plus arithmetic from GAME_DESIGN.md "Phones (portrait)" and Chief Toy Officer's 4:3 full-width stage.

### Landscape phones: eight buttons in a 240 px tab row
Severity: should-fix
Who meets it: some (landscape phone players). How bad: looks broken or misleads (targets around 30 px). Fix: small
What's wrong: at 667×375 the stage width is min((375−28)×4/3, 667−240) = 427, so the right column is exactly 240 px. That row now holds 5 tabs, the gear, the speaker and "The Declare button sits in the tab row", 8 controls, so about 30 px each. Chief Toy Officer's row had 6 controls.
Why it matters: mis-taps on the most important button in the game (it ends the run, so at least the confirm catches it), and tabs too small to hit.
Suggestion: in short landscape, move Declare, the gear and the speaker into the column's top bar (row 1, beside the rank, as in portrait) and keep only the 5 tabs in the tab row (48 px each). Or run the tabs as a vertical strip down the column's edge. Add "every touch target ≥ 44 px at 667×375" to the definition of done.
Evidence: GAME_DESIGN.md "Phones (landscape, short screens)"; ACT1_CHIEF_TOY_OFFICER.md lines 83–90 (the stage-width formula).

### Act 3's Cheer Spot is a 25 px moving target on phones, and keyboard taps can't aim
Severity: should-fix
Who meets it: most phone players and keyboard players. How bad: a little off to looks broken (a mechanic you can't really use). Fix: small
What's wrong: the globe is 62% of the stage's height. At 360 px wide that's about 167 px, and the Cheer Spot is "about 15% of the globe across", so about 25 px, and it drifts, while the player taps 3 times a second. The balance "assumes half your taps land in it" (TAP_MUL 1.5). Space and Enter taps have no position, so they never hit it, and the design doesn't say what they do.
Why it matters: Act 3's one hands-on twist turns into squinting and missing on phones, and keyboard players get a hidden ×0.67 on taps.
Suggestion: make the spot at least 30% of the globe and at least 56 px. Have it rest for 4 s, then glide to a new place, rather than drift all the time. A key tap hits the spot while the "ready" glow is up (say half the time), so keyboards match the sim. Check the hit rate with a real-input phone run.
Evidence: GAME_DESIGN.md Act 3 "The globe" and "Tap"; tools/balance-draft.mjs line 44 (`TAP_MUL: 1.5`).

### Act 2's first minute dumps five new systems at once, and the button goes unexplained
Severity: should-fix
Who meets it: most. How bad: a little off (confusion at the most important transition). Fix: small
What's wrong: Act 2 opens with a new tap, the Declare button suddenly on the top bar, a fully lit NOEL tab, the Nice dial, the Wish Ticker, the Hands | NOEL meter and a doubled helper list. The only teaching is "Stamp the file!" and "a one-time coach mark on the Hands | NOEL meter" at the first lock, about 12 minutes later. Nothing in play says the Declare button is now always there, that pressing it ends the run, or why mitten vs eye matters.
Why it matters: the act where the game's real question first appears is where players are most likely to miss it.
Suggestion: three short NOEL beats in Act 2's first two minutes, each a ticker line plus a glow, with no cards. After the first file: the Declare button glows, and NOEL says "You can stop whenever you like, Pip. Nobody does." When the Snow Globe Cams unlock (rank 2): the mitten and eye badges glow, and NOEL says "Mine are cheaper. Just saying." When the first flagged project becomes visible: the ribbon glows, and NOEL says "I'd really like this one." Fold the How to play card for the button into the Act 2 title card.
Evidence: judgment, from GAME_DESIGN.md "The first minute of each act".

### Small: Lock 1's line doesn't match its timing, and the tone is otherwise right
Severity: nice
Who meets it: some. How bad: a little off. Fix: small
What's wrong: Lock 1 says "Nobody stops on the ninth file", but the reference player triggers it at about 11:46, around rank 6–7, so on the sixth or seventh file. Otherwise the tone lands well and stays family-safe: "The cat on Maple Street is being handled", "Celebrating is optional. I've removed the option", the Clockwork Wanderers' card, and The Review's REPLACE stamp are the right kind of teeth, and the cozy → creepy-cute → satire → cosmic ramp is well paced.
Why it matters: a line that's obviously wrong about the moment breaks NOEL's "too precise" voice.
Suggestion: "Nobody stops halfway through the List."
Evidence: `node tools/balance-draft.mjs`, Act 2 reference: "[11:46 sleepTracking …]", with rank 7 reached at 12:58.

### Findings: builder

# Round 1: Builder (devil's advocate)

Sim tests used a copy of the balance script,
`/tmp/claude-1000/-workspaces-gg-test5/0546aa63-8675-45f5-b0bb-9b713bfd820a/scratchpad/sim2.mjs`.
It is patched at the flagged-purchase branch to work out, for each lock event (Act 2 #3, Act 3 #1 and #3, Act 4 #2 and #3), the hand share before and after the purchase, H = clamp(share + 10, 40, 70), and `handProbe(H)` (seconds of income to hire hands up to H). It also adds an `OD` option that multiplies all work, plus `od.mjs` for runs with Overdrive, a bot at 10 taps/s and a Cheer Spot that is never hit. The original script was not changed.

### H is undefined at the one moment that matters, and a second lock makes the first one unclearable
Severity: must-fix
Who meets it: some (every player who buys flagged projects; the reference player hits both cases). How bad: breaks (a lock that can't be cleared, so Silent Night is lost and "every lock clearable" is false). Fix: small
What's wrong: "H is set when the lock appears: your hand-run share at that moment plus 10 points". A lock appears *because of* a purchase, and three of the five trigger projects multiply NOEL-run helpers (Sleep Tracking ×2, Self-Copying Probes ×2, Star Harvesting ×1.5). So the share before the purchase and the share after it are very different. The design's quoted shares ("68% (Act 2) … 65% and 42% (Act 4)") are the *before* values, which is what `lockT` records (`R` is computed before `own.add`). Reference-player results:
- Measured after the purchase (51/80/44/48/33%), H is 61/70/54/58/43 and the hands cost 124/0/14/121/181 s of income. That matches "never a wall".
- Measured before the purchase, as the design's numbers imply, H is 70/70/54/70/52 and the hands cost **905 s, 0, 14, 1,407 s and 1,446 s** (15–24 minutes).
- Act 4's locks come 1:33 apart (12:24 and 13:57). Lock 4 can't be cleared in that time (90 s override + 121 s of hands + 30 s hold). Once Star Harvesting drops the share to 33%, lock 4's fixed H of 58% costs **7,646 s (over 2 hours)** of income. Hand helpers can't catch up with a ×3 NOEL multiplier.
- The same happens whenever any NOEL-boosting project is bought while a lock is on (Act 3: Mandatory Merriment lands while Lock 2 may still be on).
Why it matters: the builder must guess. The likely guesses produce locks that are a wall or effectively permanent, so the promises "never a wall", "every lock can always be cleared" and the Silent Night path all fail in Act 4.
Suggestion: define H as **one shared value for the whole button**, worked out *after* the triggering purchase's effects apply: H = clamp(post-purchase share + 10, 40, 70). Work it out again whenever a new lock appears or a NOEL-boosting project is bought while locked, and never raise it above its earlier value. Then make the balance script assert that each lock costs under 6 minutes using exactly that rule.
Evidence: `PRE=1 node sim2.mjs` vs `node sim2.mjs` (scratchpad copy, patched as described above). `node sim2.mjs act 4 | grep "H [0-9]"` prints `starHarvesting … to58=7646s`. Original: tools/balance-draft.mjs line 92 (`lockT.push([... R.hand ...])` uses the pre-purchase `R`).

### The sim doesn't model locks at all, and Overdrive plus carry-over make ignoring locks the best strategy
Severity: should-fix
Who meets it: most (everyone who takes NOEL's flagged projects and leaves the locks). How bad: a little off for pacing; misleads for the core choice. Fix: medium
What's wrong: the draft sim has no H, override, 30 s hold, escalation, levers, Overdrive or carry-over. It only logs the hand share and the cost to reach 50%. The tech plan's "each lock's cost under 6 minutes" check doesn't exist yet. What I measured:
- Overdrive left unmodelled: +20% all work finishes an act in 21:45, and +40% (four locks, which a lock-ignorer carries through most of Acts 3–4) in **18:45**, against the 26:00 target. That is outside the ±25% rank check, and it adds to the "flagged projects save 12–14 minutes" gap.
- Carry-over is nearly free to clear. "H … worked out again at the start of the new act" means at a moment with **zero crew**, when the only helper for sale at rank 1 is the hand-run tier 1. Hire one and the share is 100%. The override is "90 s of income at that moment", which is tap-only income.
- So the best strategy is: ignore every lock, take +40% for two acts, and clear everything in the first few minutes of the next act (or of Act 4) to still reach Silent Night.
Why it matters: the button's temptation is the game's second mechanic, and as written the numbers reward the exact opposite of the intended trade. The balance table in the design can't be trusted on lock behaviour.
Suggestion: model the full lock rules in `rules.js` and run them in the sim with a "lock-ignorer" player (never clears) and a "lock-clearer" player (clears at once). Check both against the clock.
- Cap Overdrive at +20%, or give it only to escalation locks.
- Recompute carried locks at the end of the new act's first rank, not at its start (or set the override cost from the previous act's final income ÷ 1000, the act scale). H then means something.
Evidence: `node od.mjs` in the scratchpad (`3 1.4 finale 18:47`, `4 1.4 finale 18:43`). grep -n "lock\|overdrive" tools/balance-draft.mjs shows only the logging.

### Lock rules a builder will have to guess: timers, levers, the cap, the override helper
Severity: should-fix
Who meets it: some (anyone with a lock on for more than a few minutes, or coming back from away). How bad: misleads (the Lock card and the rules disagree). Fix: small
What's wrong: each of these is left open.
- **Away time.** "Away time never triggers a lock". Does it advance the 30 s hold, or the 6-minute escalation timer? Does Overdrive apply to away earnings?
- **Escalation timer.** "After 6 minutes of active play with a lock still on": is that one timer for the button or one per lock? Does clearing one of two locks reset it?
- **Lever locks.** "cleared by buying levers: 2 for the first escalation, 3 for the next". Do they also need Hands ≥ H and the 30 s hold? What does their row on the Lock card show? What does "the next" mean for the third escalation?
- **The cap.** "Escalations stack to a total of 4 locks", "a padlock per lock (up to 4)", "Overdrive up to +40%". Act 2's lock plus three escalations is already 4 by the end of Act 2. Do Lock 2 and Lock 3 still fire in Act 3 (making 6 locks)? If they don't, their story lines are skipped.
- **Overrides.** "Works like a small helper of the current top hand tier": how small? Top tier unlocked or top tier owned? Does it count as hand-run for H (it's described as hand-run)? Does a built override from a cleared lock exist in the next act, where helpers reset?
- **Hand share with zero crew.** Is it 0% or 100% (hand ÷ crew = 0 ÷ 0)?
Why it matters: each of these is a branch in `rules.js`, the Lock card and the play-test. Two builders would ship two different games, and the sim can't check rules it doesn't know.
Suggestion: add a short "Lock rules, exactly" table with these decisions. Proposed:
- Hold and escalation timers run on active, card-free, on-page time only. Away time and `advance()` count as active, so it can be tested.
- One escalation timer for the button, reset whenever the lock count changes.
- Lever locks need only their levers, with no H.
- Named lock events always fire; padlocks and Overdrive count at most 4.
- An override is a hand helper worth 10% of the current crew. It counts toward hands and resets with the act like any helper.
- A crew of 0 counts as 100% hands.
Evidence: GAME_DESIGN.md "The button and its locks" (lines 642–690) and "Win, lose and progress" (line 734).

### Act 3's Cheer Spot is a 25–30 px moving target on phones, and keyboard taps have no position
Severity: should-fix
Who meets it: most (every phone player in Act 3, and every Space/Enter tapper). How bad: misleads (the spot feels unhittable, and the act runs slow). Fix: small
What's wrong: the spot is "about 15% of the globe across" on a globe "62% of the stage's height". With a 4:3 stage:
- 360 px portrait: stage 360×270, globe 167 px, **spot 25 px**.
- 390 px portrait: spot 27 px.
- 667×375 landscape (stage at most 427 px wide): spot about 30 px.
That is far under the 72 px the design gives the lucky things. "The balance assumes half your taps land in it" (sim `TAP_MUL: 1.5`). With 0% hits the reference player finishes Act 3 in **29:49** instead of 26:09, and the slow player in 35:45. Space and Enter "only ever tap", and a key press has no point on the globe, so keyboard players can never hit it. Nor does the design say whether the spot drifts in screen space or with the map, or whether NOEL's Auto-Ring hits it.
Why it matters: the act's one new mechanic is most of what phone players will fail at. The tuning is set for a hit rate phone players won't reach.
Suggestion:
- Make the spot at least 30% of the globe across, with a hit radius of at least 36 px (72 px across) at every size.
- Let it drift in screen space over the globe's face.
- Count key-press taps as hits while the spot is "lit" (a 1 s pulse every 2 s), or balance Act 3 at a 30% hit rate (TAP_MUL 1.3).
- State that auto-rings never hit it.
Evidence: arithmetic from GAME_DESIGN.md lines 454–462 and 165–171; `node od.mjs` in the scratchpad (`act3 spot 50% 26:09 spot 0% 29:49`).

### The "turning globe" as specified is a sliding flat map, and nanogen can't make a 2:1 wrapping texture
Severity: should-fix
Who meets it: most (every Act 3 player, for 26 minutes). How bad: looks broken. Fix: medium
What's wrong: "scrolled sideways inside a circle mask with a shading overlay". A flat map scrolled behind a circle reads as a porthole onto a sliding map, not a sphere: continents don't curve or squash at the edge.
- The asset row asks nanogen for "2:1 → 2048×1024", but nanogen's ratios are 1:1, 16:9, 21:9, 4:3 and so on, with **no 2:1**.
- A generated map won't wrap at its left and right edges, so a seam crosses the face once a minute.
- "A light blooms on the globe where the holdout is" has no positions: what about The Oceans, The Moon and Earth Itself? Lights also need to move with the map and vanish over the limb.
Why it matters: the globe is Act 3's whole stage. Every player sees it, and a cheap-looking globe undercuts the act's big, glossy satire.
Suggestion:
- Draw the globe as an orthographic sphere with vertical strips. For each of about 160 columns across the disc, `drawImage` a 1 px-wide slice of the map at longitude `turn + asin(x/r)`, then the shading overlay. It is cheap on phones.
- Generate the map at 21:9 or 16:9 and resize it to 2:1 in Pillow. Make it wrap by offsetting it half its width and having nanogen repaint the centre seam (check it tiled side by side).
- Give each holdout a lon/lat in `acts/act3.js` (Oceans: several points; Moon: the moon-hat sprite beside the globe; Earth Itself: everything).
- Project the lights the same way, hidden when `cos(lon - turn) < 0`.
Evidence: nanogen/README.md line 35 (valid aspect ratios); asset-guide.md line 35 ("Tiles and textures | nanogen | … check seams"); GAME_DESIGN.md lines 454–458 and 986.

### Per-act loading fights the service worker template, and decoded music can run phones out of memory
Severity: should-fix
Who meets it: some (phones, especially iPhones, after a few acts; anyone testing offline). How bad: breaks (a tab reload or crash mid-act) / misleads (a "needs a connection" card that never fires). Fix: small
What's wrong: "Once the game is idle, the service worker also caches every act's pack … Before the first visit to an act, it needs a connection, and the card says so". The shipped `sw.js` template doesn't do that: on install it `cache.addAll`s **every file in `game/`** (the Pages workflow fills `FILES`). So there is no "idle" phase, all ~14 MB downloads at first visit, and the "needs a connection" branch is dead code to build and test. Meanwhile memory, the real reason for per-act loading, is unaddressed. Web Audio keeps music as decoded 32-bit PCM:
- one 120 s stereo track at 44.1 kHz is about **42 MB**;
- all seven tracks (about 645 s) are about **227 MB**;
- add the decoded 1600×1200 paintings at 7.7 MB each.
"Entering an act loads that act's pack" never says the previous pack is released.
Why it matters: a builder following the design writes SW logic the template contradicts, and a builder who just loads everything can crash iPhone tabs late in a long session (lost minutes, or a reload into a Welcome-back card).
Suggestion:
- Use the template SW unchanged, so everything is precached on install, and drop the per-act "needs a connection" card. Keep a generic "couldn't load, Retry" on the act title card.
- Make per-act loading about memory: decode only the current act's music and rush loop, plus the finale and ending tracks just before they play. Drop the previous act's `AudioBuffer`s and `ImageBitmap`s on act change.
- Report decoded memory in `audioState()` so the play-test can check it.
Evidence: <gamegen>/templates/web/sw.js (install handler `cache.addAll(['./', ...FILES])`); web-target.md lines 215–219; arithmetic 120 × 44,100 × 2 × 4 B.

### Act 1's Smartphone gate can freeze the whole workshop at rank 10
Severity: should-fix
Who meets it: some (players who don't visit the NOEL tab during rank 9, which is its own tab on phones). How bad: looks broken (taps and helpers do nothing). Fix: small
What's wrong: "Reaching rank r unlocks job r and selects it", and helpers work only "on the selected job". At rank 10 without NOEL Designs the Smartphone, job 10 is selected but can't be built. The sim treats it so (`jp += 0` for taps too, line 118), so taps and helpers produce nothing.
- Insight only comes from finished jobs, so none arrives either until the player thinks to pick another toy.
- "NOEL has an idea for the last toy: open NOEL" also fails a player who never bought Plug In NOEL (an Upgrades item, not on the NOEL tab), who has 0 Insight.
- "Insight keeps coming from every toy" is true only for jobs that are being worked.
Why it matters: the workshop goes silent at the climax of Act 1, which reads as a bug. It is also close to a soft-lock for a player who skipped Plug In NOEL.
Suggestion: make the design a story beat, not a purchase. At the rank-10 promotion, NOEL designs the Smartphone automatically (its line plays on the card), keeping the Insight project only for players who buy it at rank 9. Or, at the very least, keep job 9 selected until it's designed, and auto-buy Plug In NOEL at rank 3's promotion.
Evidence: GAME_DESIGN.md lines 198, 306–313 and 728–731; tools/balance-draft.mjs lines 113–118.

### Saves, checkpoints and endings have undefined edges that can lose a run
Severity: should-fix
Who meets it: some (everyone who finds one ending and wants another). How bad: breaks (lost progress if guessed wrong). Fix: small
What's wrong:
- After "Pressing Declare … ends the game", is the run save deleted, or kept so the title's **Keep going** resumes the moment before you declared?
- "Replaying loads the save made when you *first* entered that act": if you replay Act 2 and reach Act 3 again, is Act 3's checkpoint overwritten?
- Does **New Xmas** wipe the checkpoints? If it does, the "Replay from Act N" buttons vanish. If it doesn't, what does "acts you've reached" mean across runs?
- The checkpoints are inside the one run key (`xmas-everywhere`), so a single corrupt write loses the run *and* every checkpoint.
- `goToLevel` numbering "40 (act × 10 + rank)" gives 11–50, not 1–40.
Why it matters: these choices decide whether a player can collect six endings without replaying 100 minutes. A wrong guess silently throws away a run, which counts as lost progress.
Suggestion:
- Store each checkpoint in its own key (`xmas-everywhere-cp1`…`cp4`) holding the latest entry into that act, overwritten on every entry.
- Declaring clears the run key. Keep going then disappears, and the Endings screen offers Replay from Act N for every checkpoint present.
- New Xmas keeps the checkpoints. Reset clears them.
- `goToLevel(n)` takes n = (act − 1) × 10 + rank, from 1 to 40.
Evidence: GAME_DESIGN.md lines 50–52, 716–720, 735–747 and 1073.

### The proof plan skips the one full run the play-test requires, and needs a buying bot it never specifies
Severity: should-fix
Who meets it: most (it gates "done"). How bad: misleads (a "proved" game that was never played start to finish). Fix: medium
What's wrong:
- playtest-guide.md requires "at least once, play from New Game to the win screen in one run, with real input and no jumps". The design only runs "each act once from its start snapshot".
- A real-input run of an idle game needs an in-page player that decides what to buy, and none is specified.
- At 10 taps/s with every lucky thing, the sim gives 13:08, 14:20, 13:07 and 14:14 per act (not "about 12"). One run from New Game is therefore about 60 minutes. Add the four act runs (55 min) and the 40 rank replays (about the same again), and the proof takes about 3 hours of background runs, not "about an hour".
- Snapshots come from a sim that has no lock, override, lever or Overdrive state, so lock tests have nothing to start from except act starts.
Why it matters: without a defined bot and lock-state snapshots, the builder either fakes the long runs or spends hours improvising them. Lock bugs (like the H problem above) only show up mid-act.
Suggestion:
- Add `__game.bestBuy()` (debug only). It returns the shop item the reference strategy in `rules.js` would buy, and the run-code clicks it with a real press.
- Replace the four per-act full runs with the single New Game → Silent Night run (clearing each lock as it comes) plus one lock-ignorer run from Act 3 for Xmas Forever.
- Have the balance script write snapshots just after each lock event (`a2-lock1`, `a4-lock4`…) for the lock tests.
- Estimate the run time from the sim at the bot's tap rate.
Evidence: playtest-guide.md "Prove every level can be finished" (lines 196–219); `node od.mjs` (bot10 lines); GAME_DESIGN.md lines 1065–1091.

### Icon sheets and stage figures: cut-apart by grid is fragile, and the stage art for helpers in Acts 2–4 isn't specified
Severity: should-fix
Who meets it: most (every helper and icon in three acts). How bad: looks broken (mismatched or cut-off icons, and helpers with no stage art). Fix: medium
What's wrong: "4–6 items on a plain grid … cut apart and trimmed in Pillow". Image models often return the wrong count, uneven spacing, touching items, or loose sparkles and shadows. A grid cut then slices items or mislabels them, and about 120 icons depend on it.
- The stage maps say hand-run helpers appear "along the left of the deck (little sleighs, choirs on risers)" and NOEL-run ones as "drones, towers, snow cannons … orbiting tinsel … wreaths of light around stars". No asset row makes stage figures for Acts 2–4. Only the 256 px shop icons exist, and they are drawn as icons, not at the stage's camera and scale.
- Act 2's tap reuses Act 1's `pip-swing` (apron Pip) while Pip's Act 2 look is "a clerk's visor and sleeve garters".
Why it matters: the builder will either reuse shop icons as stage props (inconsistent scale and camera) or invent art at build time, outside the budget plan.
Suggestion:
- Cut sheets by alpha connected components (merging pieces closer than about 12 px), not grid cells.
- Assert the expected count per sheet, write `sheets.json` (sheet → ordered IDs, checked by a contact sheet), and regenerate any failed item alone with the sheet as a reference.
- State that Acts 2–4 stage helpers are the shop icons drawn at a fixed size per tier in their rail slots, with at most N copies shown, bob or pulse in code. Or add one stage-figure sheet per act.
- Either accept apron Pip in Act 2, or add a visor and garters overlay drawn on the swing frames.
Evidence: asset-guide.md line 33 (transparent sprites via imagegen2); GAME_DESIGN.md lines 450–453, 885–890 and 958–997; judgment for sheet failure modes.

### Findings: art

# Round 1: Art and sound director

### NOEL's three later bodies are painted into nanogen backgrounds, so they won't match the portraits, and the eye can't move or turn amber
Severity: should-fix
Who meets it: most. How bad: looks broken. Fix: medium
What's wrong: The asset list bakes NOEL into the backgrounds: list-room-bg has a "NOEL cabinet wall on the right", deck-bg "the long NOEL console", and bridge-bg the "NOEL core column", all made by nanogen with no NOEL reference. Meanwhile the noel-portraits sheet (cabinet, console, core) comes from imagegen2 with noel-box as its reference. That makes two unrelated versions of each body. The design also says "NOEL's eye follows the last tap on every stage … green when content, amber during a lock event" and that its eye "grows with each act". An eye painted into a background can't follow anything or change colour, and no stage map gives the eye's position (Act 2's map has the wall at x 70–99, y 20–88 but no eye point). Act 2's NOEL wall is also where NOEL-run helpers "fill in", so painted dials and helper sprites would land on top of each other.
Why it matters: NOEL is the game's main character. In three of the four acts the player would see one NOEL on the stage and a different one on every Lock and promotion card, and the amber eye (the lock's main signal) wouldn't happen on the stage.
Suggestion: Make noel-box first, then the noel-portraits sheet from it. Pass the matching cut portrait to nanogen as a reference for each background. Ask for the eye lens to be painted as an empty dark brass ring, then record its centre and radius in each act's stage map (and in the portrait cuts), and draw the glowing eye and pupil in code. A simpler alternative is to leave NOEL out of the backgrounds and place a transparent body (made by imagegen2 from the same reference) as a stage prop. Either way, look at portrait and stage body side by side before accepting.
Evidence: GAME_DESIGN.md lines 976–991 (asset rows for noel-portraits, list-room-bg, deck-bg, bridge-bg), 812–814 (eye juice), 871–881 (stage maps with no eye point).

### Pip swings in Act 2 wearing his workshop apron, and the stamps have no in-hand art
Severity: should-fix
Who meets it: most. How bad: looks broken. Fix: medium
What's wrong: The cast says Pip wears "a clerk's visor and sleeve garters" in Act 2, and pip-portraits includes the clerk. But the Act 2 tap is "Pip's swing (the same animation) with a rubber stamp drawn in the fist", and pip-swing is animated from pip-anchor (apron, tool pouch). So for 26 minutes the stage shows apron Pip while the cards show clerk Pip. The in-hand tool also needs work: Act 1's hammers are drawn "straight, handle down … grip point noted" at 512 px for the hand. The four stamps exist only as items in the act2-shop sheet, cut to 256² icons at whatever angle the sheet drew them, with no grip point. The Great Seal also has to "rise on its own and slam" in The Review. (Acts 3 and 4 use still figures from the sheet, so they're fine.)
Why it matters: The costume change is how Act 2 shows Pip's promotion. Without it the first Act 2 screen looks like an Act 1 leftover.
Suggestion: Make the four clerk frames by editing the four accepted pip-swing frames with imagegen2 `--image` (add visor and garters, swap the apron for a waistcoat, change nothing else), then match their colours to frame 0. That's about $0.30 against about $1.50 for a new anim8gen run, and the pivot JSON still applies. Generate the stamps as their own small sheet: upright, handle up, same handle length, transparent. Ship them at 512 px for the hand and the Seal, and at 256 px for the shop.
Evidence: GAME_DESIGN.md lines 85–87 (Pip's outfits), 351–353 (Act 2 tap), 961 (pip-swing from anchor), 982 (stamps in act2-shop sheet). ACT1_CHIEF_TOY_OFFICER.md line 564 (hammers drawn handle down at 512 px).

### Assets the design shows but the asset list doesn't have
Severity: should-fix
Who meets it: most. How bad: looks broken. Fix: medium
What's wrong:
- **Acts 3 and 4 upgrade icons.** Act 3's six upgrades (Bigger Sacks … Twelve Days of Overtime) and Act 4's six have no sheet. Only Act 2 has one, and even that is "should".
- **Santa variants.** The only Santa is santa-portrait (a beaming bust). The design also needs Santa's portrait "slumped in its corner" on the Act 2 act-win card, the portrait "clipped to" his file in The Review, the beach postcard "in Santa's hand" (no picture, and no handwriting font among the three fonts listed), Santa on the sleigh in ending 2, and Santa "in the doorway" in ending 6.
- **Helpers on the stage, Acts 2–4.** The stages show helpers in place: "elf clerks work at little desks", "little sleighs, choirs on risers", "drones, towers, snow cannons", "crewed sleighs docking". The only art for them is the 256² shop-sheet icons. Nothing says those icons double as full-figure stage sprites (three-quarter, facing right, feet on a line, one scale), which is how Act 1's crew figures work.
- **Overrides.** The overrides sheet is 256² icons for the Helpers panel. But "the override stays built" and works as a helper, and "the Hand Crank, as tall as a tree" and "a candle-lit wing" read as stage objects. No slot or size is given for them.
- **Hand-run and NOEL-run badges.** "A mitten for hand-run or an eye for NOEL-run" on every helper card: there's no mitten in the icons sheet.
- **The Last Star.** It's "the tree-top star … scaled up" to top a galaxy, but tree-star ships at 256², so it will be blurry at stage scale.
- **The bow.** "Ties a big bow at the North Pole" is drawn in code next to a painted globe, so it will look flat beside the paint.
Why it matters: Each gap becomes a placeholder or code-drawn shape in the middle of painted scenes. The Santa beats and the upgrade shelves are seen by everyone.
Suggestion: Add rows for: an act3-upgrades sheet and an act4-upgrades sheet. A santa-sheet (slumped, asleep, in a sun hat holding a blank postcard) made by imagegen2 `--image santa-portrait`. A postcard frame (blank, with the text set in code in a handwriting OFL font, added to the font list). The mitten badge, added to the icons sheet. tree-star kept at 1024 px for the finale. A bow made by imagegen2. In the shop-sheet prompts, state that each helper is drawn full-figure, three-quarter, facing right, on a shared foot line, so the same cut serves as icon and stage sprite. Give the overrides a stage slot (for example the front of the hand-run rail) or say plainly that they stay in the panel only.
Evidence: GAME_DESIGN.md lines 498–501 and 596–600 (upgrades with no rows at 979–993), 431–436 and 517 (Santa), 342–344, 450–453 and 550–553 (stage helpers), 661–676 (overrides), 179–181 (badges), 621–623 (Last Star), 530–532 (bow), 898–900 (fonts).

### "Christmas" (or garbled lettering) can appear inside generated pictures, and the text check can't see pixels
Severity: should-fix
Who meets it: most. How bad: misleads (breaks a hard rule in the brief). Fix: small
What's wrong: The rule is "Xmas, never Christmas, anywhere", but `tools/check-text.mjs` only searches file contents and names. Several prompts ask for things a model fills with writing. list-room-bg has "a vast paper scroll" (the List), and ending 2 has "the endless List streaming behind him". act2-jobs are folders, which tend to get labels. The Earthmas Deck is "glossy corporate", so expect signage. The calendar idea in Act 3 invites a printed calendar. Ending 5's "7:02" invites a clock face with numbers. Nano Banana and GPT Image both readily write "Merry Christmas" on festive scrolls and banners. The style line's "no text" alone often isn't enough.
Why it matters: One painted "Christmas" on the List Room wall breaks the brief's main wording rule on a screen everyone sees for 26 minutes, and the scanner would pass it.
Suggestion: For every prompt with paper, signs, screens or folders, add "blank paper, wavy ink lines instead of writing, no letters or numbers anywhere". Add to the definition of done: every generated image is looked at for letters before it's accepted (zoom into scrolls, folders and screens), with any lettering painted out by a nanogen edit. Draw "REPLACE", "NICE" and "NAUGHTY" in code, as the design already intends.
Evidence: GAME_DESIGN.md lines 1046–1049 and 1161–1163 (the check covers files only), 979, 981, 985, 707, 710.

### The cozy-to-cold drift is set up to break the single look: the palette contradicts itself and two backgrounds have no references
Severity: should-fix
Who meets it: most. How bad: looks broken. Fix: small
What's wrong: Every prompt starts with "warm candlelit palette of cranberry red, pine green, cream, honey gold and cocoa brown … soft warm lighting from the upper left", then adds "…at night in deep space, navy and violet, with glowing tinsel light" (Act 4) or "glossy and bright, in a crisp red-and-white palette" (Act 3). The model gets two palettes and resolves the conflict differently each time. "Glossy … corporate" pushes nanogen toward flat vector art, and "deep space … glowing" toward digital sci-fi painting. Both lose the gouache. On top of that, the asset list gives references only to list-room-bg (anchor, workshop-bg). deck-bg, bridge-bg and globe-map list plain "nanogen" with no reference, and the Acts 3–4 sheets list plain "imagegen2".
Why it matters: Act 4 may end up looking like a different game. The brief wants "the same storybook style a step colder", and that only holds if the medium and line stay fixed while the palette moves.
Suggestion: Split the style line into a fixed part ("cozy storybook illustration, gouache and coloured pencil, soft rounded shapes, gentle dark-brown outlines, visible brush texture, handmade, no text") and a per-act palette and light part that replaces the warm palette rather than being added to it. Act 3: "crisp red, white and gold, cool night light with warm accents". Act 4: "navy and violet, light from glowing tinsel, one warm brass accent". Keep brass and walnut in every act as the thread that ties them. Chain the references: every background gets pip-anchor plus the previous act's background. Every Acts 2–4 sheet gets pip-anchor plus toy-01 plus that act's first accepted sheet. Before making any icons, put the four backgrounds side by side and check they hang together.
Evidence: GAME_DESIGN.md lines 844–855 (style line and per-act phrases), 979, 985–986, 991 (references listed only for list-room-bg).

### The globe map: nanogen has no 2:1 shape, the scroll will show a seam, and a flat scroll won't read as a globe
Severity: should-fix
Who meets it: most (every Act 3 player, for 26 minutes). How bad: looks broken. Fix: small
What's wrong: globe-map is "nanogen … 2:1 → 2048×1024", but nanogen accepts only 1:1, 16:9, 4:3, 3:4, 2:3, 3:2, 4:5, 5:4, 9:16, 21:9, 1:4, 4:1, 1:8 and 8:1, so 2:1 fails with E_BAD_ASPECT. Two more problems follow. A generated map's left and right edges won't meet, and with "about 60 s a turn" the seam crosses the globe's face every minute. And the plan scrolls an equirectangular image sideways inside a circle with a shading overlay: without a projection the continents slide across like a flat disc and never curve over the limb. The holdouts' city lights also need coordinates on this specific painting.
Why it matters: The globe is Act 3's whole stage and its tap target.
Suggestion: Generate at 21:9 or 16:9 2K and resample to 2048×1024. Make the wrap seamless: offset the image by half its width, repair the middle seam with a nanogen edit, and check it tiled twice side by side. Have code do a cheap orthographic lookup (a precomputed per-pixel longitude table on a roughly 512 px canvas) instead of a flat scroll. Ask for oceans and land in the act's palette with no labels and no grid lines, and record the light positions for the 10 holdouts against the accepted map. Use the same map as a reference for ending 3 ("Earth from orbit").
Evidence: nanogen SKILL.md line 313 (E_BAD_ASPECT, the 14 valid ratios); GAME_DESIGN.md lines 454–458, 895–897, 986.

### Icon sheets need rules to cut cleanly and match, and Act 2's ten folder icons will look alike on phones
Severity: should-fix
Who meets it: most. How bad: looks broken. Fix: small
What's wrong: "One prompt per sheet keeps a set consistent", but most sets span two sheets: act2-jobs ×2, act3-jobs ×2, act3-shop ×2, act4-shop ×2, species ×2. Two runs of the same prompt drift in scale, line weight and lighting. Ten jobs split 5 and 5 don't fit a neat 3×2 grid, and imagegen2 tends to let items touch, add cast shadows and ground patches, and vary their angles, which spoils alpha-based cutting. The Act 2 jobs are "a folder with a small emblem": on the phone Jobs tab and the 64–96 px shelf, ten manila folders with tiny emblems look identical, and the folder will tempt the model to write a label.
Why it matters: About 120 icons from sheets make up most of what the player handles. Mismatched or clipped icons are the polish problem every player sees.
Suggestion: Write the sheet rules into the design. A fixed grid (3×2 on 1536×1024, one item per cell, each item inside a cell with at least a 48 px gap). Transparent background, no cast shadows or ground. The same view and light as the toys. Cut by alpha connected components, then trim, pad to square and scale to one fill ratio. The second sheet of any set uses the first accepted sheet as a reference, and both are checked together on one contact sheet. Split 10-item sets 6 and 4, filling the empty cells with extras such as the mitten badge or spare stamps. For Act 2, make the emblem the icon (big antlers, a paw, a skyline) on a corner of a blank folder tab, and test them at 64 px before accepting.
Evidence: GAME_DESIGN.md lines 885–890, 981–993, 1134–1136 (the design names this as hard work itself).

### The ending paintings, the biggest moments, are under-specified for references, and endings 1–4 have no music
Severity: should-fix
Who meets it: most (every player sees at least one ending). How bad: looks a little off to looks broken. Fix: small
What's wrong: Every ending gets "nanogen (refs anchor + the act's background)". That's not enough to keep the same people and props:
- Ending 1 and ending 6 are both workshop interiors and need workshop-bg, tree, noel-box (dark) and pip-anchor.
- Ending 2 needs santa-portrait, sleigh-cutout and the Act 2 Pip, who should be in his clerk's outfit.
- Ending 3 needs the globe-map so it's the same Earth.
- Ending 4 needs the star-sleigh-suit Pip from pip-portraits and bridge-bg.
- Ending 5 is vague ("everyone, everywhere, frozen mid-unwrap"). It doesn't say who is in it or where, it invites a crowd of distorted faces, and the clock in it invites numbers.

The endings are also 4:3 at 1600×1200 with "slow pan in code", but a portrait phone shows a letterboxed band unless a focal crop is planned. On sound, only Forever and Candle have music, so endings 1–4, which most players will reach, play over the act loop or silence.
Why it matters: These six paintings are the payoff and the collectible screen. One with a different-looking Pip or Santa undercuts the whole run.
Suggestion: List exact references per ending (as above). Make 5 and 6 first, as planned. Pin down ending 5's composition: for example, the Act 1 workshop seen through the window with Pip and elves frozen mid-unwrap, snowflakes stopped, and NOEL's green eye as a huge moon in the sky. Then it reuses known characters, keeps faces small and is clearly NOEL's. Give each painting a focal point inside the central 9:16 area and pan to it on portrait phones. For music, let ending 1 reuse the Xmas Eve track, ending 2 the List loop softened, ending 3 the Earthmas loop with a low-pass filter, and ending 4 the Star-Sleigh loop, and write that into the audio table.
Evidence: GAME_DESIGN.md lines 704–711, 903, 917–918, 998.

### Sound is missing for several actions and for three of the four finales; two loops aren't listed
Severity: should-fix
Who meets it: most. How bad: looks a little off to looks broken (silent key moments). Fix: small
What's wrong: No sound is listed for: buying a NOEL project, building an override, buying a lever, the "NOEL is checking…" 30 s ring finishing, Act 4's job done ("a new ornament twinkles"), the Great Seal's REPLACE slam, the ribbon wrapping the globe, and the stars gathering. Acts 2 and 4 Rushes "layer a looping sound" ("rustling paper bells", "a shimmering choir"), but neither is in the effects table, so the count of 34 misses them. Only Act 1 has a finale track. The Review, Wrap the World and Top the Universe, the big beats of Acts 2–4, get nothing beyond the act loop. The Forever track is asked to "slow, detune and stop", and ElevenLabs music doesn't do that reliably on request.
Why it matters: The tap and the lock are the two mechanics, and buying NOEL projects (the act that causes locks) is silent. The finales are the moments players remember.
Suggestion: Add to the effects table: NOEL project bought (a brass ratchet and chirp), override built (a wooden thunk and an elf cheer), lever pulled, check complete (a warm chime), ornament twinkle, Seal slam (deep thud and paper), ribbon zip, star-gather shimmer. Add the two Rush loops with `--loop`. Add short finale stingers (15–20 s music cues, about $0.10 each) for The Review (one dramatic held chord), Wrap the World (a jingle swelling) and Top the Universe (choir rising). Make Forever as a plain 30 s music-box tune and do the slow-down and detune in code (playbackRate ramp), as the cut list's fallback already does.
Evidence: GAME_DESIGN.md lines 920–938 (effects table), 430–436, 530–533, 619–624 (finales), 654–684 (override, lever, check ring), 810 (Act 4 job done); audiogen SKILL.md lines 91, 141–144 (sfx `--loop`, music length).

### The cost forecast undercounts: it's about $21–24 with retries, not $17–19
Severity: should-fix
Who meets it: most (missing or cut assets would show everywhere). How bad: looks a little off to looks broken. Fix: small
What's wrong: Counting the asset list's rows gives about 43 imagegen2 generations, not "about 30". The sound list is about 39 effects (17 + 20 new + 2 Rush loops), not 34, before the effects missing above. At the real prices:
- imagegen2: about $0.06 (1024²) to $0.08 (1536×1024) each (ASSETS.md), so about $3.0 for one take each, or about $4.5 with 1.5 tries on average.
- nanogen: pro 2K is $0.134 a picture, though ASSETS.md logged $0.24 for workshop-bg. 13 paintings come to $1.7–3.1, or $2.6–4.7 with retries.
- Music: 10.75 minutes at $0.30 a minute is $3.23 for single takes, about $4.3 with a retry on three tracks.
- Effects: $0.12 each, so 39 to 47 effects is $4.7–5.6, or about $6.5 with retries.
- anim8gen: about $1.50.

That's about $19.5–21.5 before the missing assets in the findings above (two upgrade sheets, the Santa sheet, the bow, finale stingers, the clerk swing frames: about $1.5 more). The design admits the estimate has no retry room ("tight").
Why it matters: Without a plan, the budget runs out late, which is when ending paintings and finale audio get cut, and those are the never-cut items.
Suggestion: Re-forecast with these figures, and save inside the plan rather than cutting must-haves:
- Make one tap sound per act and vary pitch and filter in code, instead of three generations (saves 9 effects, about $1.10).
- Do Forever in code (above).
- Use nanogen flash 2K ($0.05) for drafts and pro only for accepted finals.
- Use imagegen2 medium quality for the 256 px shop sheets.

Write a spending order into the design: anchors and NOEL, then backgrounds and endings, then sheets, then music, then effects, then voices last. Say in STATUS.md at $16.
Evidence: nanogen SKILL.md lines 404–413 (prices); audiogen SKILL.md lines 325–328 (music $0.30 a minute, sfx $0.12 each); ../xmas-clicker/design/ASSETS.md (imagegen2 $0.06–0.08, nanogen 2K $0.24); GAME_DESIGN.md lines 958–1005 (rows counted), 1139–1152 (forecast).

Below the bar, one line each (nice):
- The act-transition zoom needs a window in list-room-bg for the workshop to shrink into; add it to the prompt and the stage map.
- Act 1's inherited asset names "music-eve: Christmas Eve music" and the "Christmas Eve" sound should be renamed in the copied lists so no file name carries the word.

### Outcomes

# Round 1: outcomes

The design was revised in place (`design/GAME_DESIGN.md`) and the sim was
rewritten to model the lock rules, the choices and the legacy card
(`tools/balance-draft.mjs`; `node tools/balance-draft.mjs`, all 35 checks
pass). How the evidence was checked:

- Reviewers' sims rerun: `node sim2.mjs act 2` / `PRE=1 node sim2.mjs act 2`
  (Lock 1: 124 s after the purchase, 905 s before it), `node sim2.mjs act 4`
  (Lock 4 to 58% after Star Harvesting: 7,646 s).
- Tool docs read: nanogen README line 35 and SKILL.md line 313 (14
  aspects, no 2:1); the gamegen `templates/web/sw.js` (install precaches
  `['./', ...FILES]`); playtest-guide.md lines 219–221 (one New Game to
  win run, real input, **no jumps**); prices from nanogen SKILL.md §8,
  audiogen SKILL.md "Cost", and `../xmas-clicker/design/ASSETS.md`.

| Finding | Severity | Evidence | Outcome |
|---|---|---|---|
| Player: declaring at an act-win card ends the game and loses the way forward | must-fix | judgment (design text confirmed) | Fixed: every ending ends with **Back to just before** (a separate `-back` save written when an act-win card opens and when a mid-act declare is confirmed). Endings 2–4 have full and early versions shown in one frame with an "early" ribbon. NOEL's "There's more, Pip" leads the Endings screen. Credits still roll. |
| Player: locks cost nothing a player can feel | should-fix | Verified (my first lock sim: ignoring was 1–4 min faster per act with Overdrive) | Fixed: a lock turns off **Free hands** (+30% hand-run), starts **NOEL's Grip** (a helper gripped every 90 s or sooner, with an animation and line), gives colder ending lines, and blocks Silent Night. Overdrive is NOEL-run only, +5% per lock (max +20%). Sim: ignoring costs 1:45 (Act 2), 4:32 (Act 3), 3:47 (Act 4) with carried locks; one act only, it breaks even in Act 4 (25:58 vs 25:57). The Endings screen hints at Silent Night ("A candle, somewhere"). |
| Player: which flag brings a lock is invisible | should-fix | Verified (design: locks at flagged-purchase counts) | Fixed: five named projects bring the locks, each with a padlock on its ribbon and "Buying this locks your button". Other flags add grip links, shown as a chain on the NOEL panel. |
| Player: "hand share at that moment" is ambiguous; one reading makes locks 15–25 min | should-fix | Verified (`sim2.mjs`: 905 s vs 124 s) | Fixed: one shared target T, measured after the purchase, capped at 3 min of passive income in hires, plus 30 s builds (at most 5 min in all). The sim models it and checks it. Reference costs are 21–156 s; the worst for any simulated player is 170 s. Lock 1's line fixed too. |
| Player: Acts 2–4 are the same clicker at ×1000 | should-fix | Verified (old sim: `scaleAct` of the same tables) | Fixed: Act 2 Wish cards (Grant: hand-run +3% each; Shape: about 6½ min of Insight and a grip link), Act 3 Cheer Spot made usable, Act 4 First Contact (Listen: cookies +6% and their own answer; Translate: Wonder +3%, a grip link and NOEL's line), and a legacy card each act (L × rank tier-1 helpers, L = last act's hand share ÷ 5). All are in the sim (Grant 26:02 vs Shape 26:50; Listen 25:57 vs Translate 27:29). Act lengths are not varied: the 26-minute rank clock is the tuning contract for the brief's ~100 minutes, and the choices change the rhythm instead. |
| Player: Hand vs NOEL helpers not legible at 360×640 | should-fix | judgment (arithmetic checked: about 186 px of panel) | Fixed: one row per tier with the twins side by side; the meter is a 32 px header; the override row comes first only while locked; the Lock card has Hire hands; added to the DoD (header plus tiers 1–2 visible at 360×640). |
| Player: landscape phones have eight buttons in a 240 px row | should-fix | Verified (CTO formula gives a 427 px stage, so a 240 px column) | Fixed: Declare, gear and speaker go in the column's top bar; the tab row holds only the five tabs at 48 px; DoD requires 44 px targets at 667×375. |
| Player: Cheer Spot is 25 px and keys can't aim | should-fix | Verified (62% × 270 × 15% ≈ 25 px) | Fixed: 30% of the globe and at least 72 px, rests 4 s and glides 1.5 s, keys always hit, auto-rings never do. Sim: 0% hits 29:15, 50% 26:05, keys 23:18; there's a check for under 32 min at 0%. |
| Player: Act 2's first minute dumps five systems and doesn't explain the button | should-fix | judgment | Fixed: three NOEL beats (button glow after the first Wish, mitten and eye at rank 2, padlock at rank 6), and the How to play card for the button sits on the Act 2 title card. |
| Player: Lock 1's line doesn't match its timing | nice | Verified (sim: Lock 1 at 10:28, rank 6) | Fixed: "Nobody stops halfway through the List." (cheap). |
| Builder: H undefined at the purchase; a second lock makes the first unclearable | must-fix | Verified (`sim2.mjs act 4`: 7,646 s to 58% after Star Harvesting) | Fixed: B = share + 10 (40–70) after the purchase, reset on a lock, a NOEL boost or rank 4 of a carried act; T = min(B, what 3 min of passive income reaches), re-checked at every Grip tick and rank-up, never above B. The sim asserts at most 300 s for every player. Star Harvesting cut to NOEL-run ×1.25 so refusing flags stays under 40 min. |
| Builder: the sim doesn't model locks; Overdrive plus carry-over make ignoring best | should-fix | Verified (`grep` of the old sim; my first lock sim showed the ignorer winning) | Fixed: the sim models the target, cap, builds, hold, escalation, Overdrive (NOEL-only), Free hands, the Grip, grip links, carry-over at rank 4, and the lock-clearer and lock-ignorer (carried and one-act) players. The checks pass (numbers above). Carried locks are worked out at rank 4, not at the empty start. |
| Builder: lock rules left to guess (timers, levers, cap, override, zero crew) | should-fix | Verified (design lines 642–690 as they were) | Fixed: the "Lock rules, exactly" table. Timers run on active economy time only (not cards, finales, pause, hidden page or away; `advance()` counts). One escalation timer, reset when the lock count changes. Lever locks need their lever and the shared T (one rule for every lock, unlike the suggestion). Named events always fire their line; the cap is 4, and extra events speed the Grip. An override does 5% of the crew's work, hand-run, for the act. A crew of 0 is 100% hands. |
| Builder: Cheer Spot too small; keys have no position | should-fix | Verified (arithmetic; `od.mjs` showed 29:49 at 0% hits) | Fixed (as the Player's finding above). |
| Builder: the globe is a sliding flat map, and nanogen has no 2:1 | should-fix | Verified (nanogen README l.35) | Fixed: an orthographic per-pixel lookup (disc at most 384 px, 30 fps), chosen over strips, which only approximate it. The map is made at 21:9 and resampled to 2:1 in Pillow, the seam is offset and repaired then checked tiled, each holdout has lon/lat, and lights hide over the limb. |
| Builder: per-act loading fights the SW template; decoded music can run phones out of memory | should-fix | Verified (template sw.js install handler; 120 s × 44.1 kHz × 2 × 4 B ≈ 42 MB) | Fixed: the template SW, unchanged (everything precached, no "needs a connection" card, Retry on failure). Music is streamed through `<audio>` and MediaElementSource with an A/B crossfade. Effects are decoded per act, the last act's bitmaps are closed, and `audioState()` / `state().memory` report it, with a DoD check. |
| Builder: Act 1's Smartphone gate can freeze the workshop | should-fix | Verified (old sim lines 113–118; design text) | Fixed (lead decision): NOEL wakes itself at rank 9 if never plugged in ("I woke myself up, Pip."), and designs the Smartphone at rank 10 if it wasn't bought. The project now gives −25% Smartphone work. Sim: never plugged in 43:26, never bought 26:01. |
| Builder: saves, checkpoints and endings have undefined edges | should-fix | Verified (design lines 716–747 as they were) | Fixed: separate keys (run, `-back`, `-cp1`…`cp4`, `-endings`), each written whole and loaded on its own, with the overwrite rules, what declaring, New Xmas, Replay and Reset clear, and `goToLevel(n)` with n = (act − 1) × 10 + rank, 1–40. |
| Builder: the proof skips the full run and needs a buying bot | should-fix | Verified (playtest-guide l.219–221; sim bot timings) | Fixed: `__game.bestBuy(policy)` from `rules.js`; one New Game to Silent Night run with real input and **no fast-forward** (the guide forbids jumps), about 62 min; one lock-ignorer run from `a3-carried`, about 31 min; lock snapshots (`a2-lock1` … `a4-r10-locked`). Honest total: about 2 h 50 min of background runs. |
| Builder: sheet cutting by grid is fragile; no stage art for Acts 2–4 helpers; apron Pip in Act 2 | should-fix | judgment (sheet failure modes); Verified (asset rows) | Fixed: cut by alpha components, a count assert, `sheets.json` and a contact-sheet check, failed items re-rolled alone. Shop helpers are drawn full-figure on a foot line and double as stage figures (at most 3 copies, fixed size per tier). Pip's Act 2 swing is edited into the clerk outfit. |
| Art: NOEL's bodies painted into backgrounds; the eye can't move or turn amber | should-fix | Verified (asset rows and stage maps as they were) | Fixed: transparent props (noel-cabinet, noel-console, noel-core from noel-box), each lens an empty ring, centre and radius in `noel-eyes.json`, and the eye always drawn in code. Cards use the same props cropped (the portraits sheet is dropped). Backgrounds are made without NOEL. |
| Art: Act 2 Pip wears the apron; stamps have no in-hand art | should-fix | Verified | Fixed: `pip-clerk-swing` (four imagegen2 edits of the accepted frames; the pivot JSON still applies), and the clerk portrait made from clerk frame 0. `a2-stamps`: upright, handle up, 512 px for the hand and the Seal. Bells and scanners are never in a fist (Pip is still in Acts 3–4). |
| Art: assets the design shows but doesn't list | should-fix | Verified | Fixed: a3-upgrades and a4-upgrades sheets (plus spare cells), santa-sheet (slumped; beach), the postcard drawn in code with the Caveat font (OFL), mitten and eye badges in the icons sheet, tree-star shipped at 1024 for the Last Star, a painted bow, helpers as stage figures, an override stage slot, and a "drawn in code" row. |
| Art: "Christmas" or lettering can appear in pictures | should-fix | Verified (check-text searches files only) | Fixed: "no letters or numbers anywhere" in the style line and in every paper, sign or screen prompt; no clocks or calendar pages asked for; every picture checked by eye before acceptance (in the DoD); lettering is painted out by nanogen edit. |
| Art: the palette contradicts itself; two backgrounds have no references | should-fix | Verified | Fixed: a fixed style part plus a per-act palette part that replaces the last; brass and walnut in every act; chained references (each background gets the previous one; each act's later sheets get its first); backgrounds checked side by side before sheets. |
| Art: globe map (no 2:1, seam, flat scroll) | should-fix | Verified (nanogen SKILL.md l.313) | Fixed (as the Builder's globe finding). The map is also ending 3's reference. |
| Art: sheet rules; Act 2's folders look alike | should-fix | judgment | Fixed: the 3×2 grid on 1536×1024 with 48 px gaps, no shadows or ground, alpha cut, one fill ratio, sheet 2 referencing sheet 1, sets split 6+4 with named extras, and Act 2's emblems as the icon, tested at 64 px. |
| Art: endings under-referenced; ending 5 vague; portrait crop; endings 1–4 silent | should-fix | Verified | Fixed: references per ending in the Endings table; ending 5 is the workshop through its window with Pip and the elves small and frozen and NOEL's eye as the moon (no clock); focal points inside the central 9:16 band, with the pan going to them; music for every ending (reused tracks and code filters). |
| Art: missing sounds, finales and loops; Forever on request | should-fix | Verified (audiogen SKILL.md: no music loop flag; sfx `--loop`) | Fixed: sounds for project bought, override, lever, check complete, ornament, Seal slam, ribbon, stars gathering and the Grip; two Rush loops with `--loop`; three 20 s finale stingers; Forever as a plain 30 s music box slowed in code. |
| Art: the cost forecast undercounts | should-fix | Verified (prices in nanogen SKILL.md §8, audiogen "Cost", ASSETS.md) | Fixed: an honest recount: 51 imagegen2, 14 nanogen, 11.5 music minutes, 39 effects, 7 voices, $15.25–16.75 single takes, leaving $3.25–4.75 of $20 for retries (`--budget 30` recommended for headroom). One tap recording per act is varied in code; there's a spending order and a STATUS note at $16. Not adopted: "medium quality for shop sheets", because its price isn't documented. |
| Art (nice): a window in list-room-bg for the transition zoom | nice | judgment | Fixed: it costs nothing. The window is in the prompt and the stage map (x 30–48, y 6–40). |
| Art (nice): inherited asset names say "Christmas Eve" | nice | Verified (ACT1_CHIEF_TOY_OFFICER.md l.583) | Fixed in this design: `music-eve` and `sfx-eve` are described as Xmas Eve, and check-text covers shipped names. The inherited Act 1 file is not edited (lead instruction). |

Decision: not converged (must-fix findings fixed this round; round 2 checks the new lock system, choices and asset plan).

## Round 2

Reviewers: Player (ran the sim), Builder (patched sims), Art and sound director (Pillow mocks of the NOEL box slot). 24 findings: 1 must-fix (the lock target chased the player, so a late clear could never finish), 21 should-fix, 2 nice. The person also asked for `--saves` and `--feedback`, folded into this round's refine.

### Findings: player

# Round 2: Player review

Sim run: `node tools/balance-draft.mjs` (unchanged original, all 35 checks pass). Numbers below are from its summary.

### Declaring mid-act is now free, so the button (and NOEL taking it) weighs nothing
Severity: should-fix
Who meets it: most. How bad: looks broken or misleads (the game's stated hook goes flat). Fix: small
What's wrong: round 1 asked for "Back to the choice" at act-win cards and said "Mid-act declares still send you back to the act's start (that's the real price)". The revision went further. `-back` is also written "when a mid-act declare is confirmed", and the confirm card says "(You can come back to this moment.)". So pressing Declare at any moment is a free peek: you watch an ending, press Back to just before, and carry on with nothing lost. That empties "the button is the real question: when is it enough?". It also empties the lock. A lock takes away a button that costs nothing to press, and whose only result is an early ending you can collect later anyway. Once players learn that, "NOEL has locked your button" means "NOEL has locked a free gallery", and the only real costs left are free hands and the Grip, which are economy, not the button.
Why it matters: the brief's premise is a button you could press to stop, plus an AI that takes it from you. If pressing is reversible, neither part has any tension. The confirm card's own text tells every player this on their first press.
Suggestion: keep Back to just before for act-win cards only (that was the must-fix, and it stays fixed). A mid-act declare is honest and final for that run. The confirm says "Declare Victory now? Your Xmas ends here. (You can replay this act from its start.)", and afterwards the Endings screen offers Replay from Act N (cpN). That is a clear, confirmed choice with the price stated, not a surprise loss. Early endings then mean something, and so does a padlock on the button.
Evidence: GAME_DESIGN.md lines 53–56 and 758–762 (confirm text), line 930 (`-back` written "when a mid-act declare is confirmed"), line 934; REVIEW_LOG.md line 16 (round-1 suggestion).

### There's no temptation left: staying locked and every NOEL-way choice are strictly worse
Severity: should-fix
Who meets it: most. How bad: misleads (the user asked for a lock that's a real force and a tempting one). Fix: medium
What's wrong: the sim shows the NOEL way never pays. Clearing beats ignoring in every act: Act 2 26:02 vs 27:47, Act 3 26:05 vs 30:37, and Act 4 is a tie (25:57 vs 25:58). Grant beats Shape (26:02 vs 26:50), and Listen beats Translate (25:57 vs 27:29). So an attentive player learns by Lock 1 that the warm option is also the fast one, every time. That's not a dilemma, it's a chore with a moral label. Round 1's problem (locks cost nothing) has swung to the opposite: being locked has no upside, Overdrive is too small to notice, and NOEL's offer ("I'd look after the button for you") is never worth taking. The arc suffers too. The game's sharpest lines sit behind the NOEL buttons: "I've named them all Noel.", "The off switch has been removed for their comfort.", "They're malfunctioning. Ignore them." Optimising players, who are this genre's audience, pick Listen and Grant and never see them, so Act 4 reads cozier than Act 2. Lock 2 and Lock 3 are also non-events for the reference player (on screen 0:38 and 0:42, "your hands already hold it"). Only the bought padlock projects are tempting, and they're compulsory, because refusing them costs 10–12 minutes.
Why it matters: "you could stop at any moment, and don't, because the next number is right there" only works if NOEL's number is bigger. Right now NOEL's number is smaller.
Suggestion: retune so that NOEL's way is faster now and the hand way pays later and in the story. Shape should finish Act 2 about 60–90 s faster than Grant, and Translate likewise. A one-act lock-ignorer should be about 60 s faster in that act (raise Overdrive to about +10% per lock), while carried locks still lose (keep the 3–4 minute gap). Warmth then pays in the endings, in Silent Night and in the next act's legacy L. Add sim checks for both signs. This also lets NOEL-way players see the dark lines, which is the twist.
Evidence: `node tools/balance-draft.mjs` Summary (ignorer, this-act ignorer, noel-choices per act; Act 3 "ref locks: 7:01 T70 21s; 17:01 T57 33s (on screen 0:38/0:42)"); GAME_DESIGN.md lines 316–323.

### Too much to learn too early: the first Wish card asks about things the player hasn't met, and "grip links" are a rule you can't see
Severity: should-fix
Who meets it: most. How bad: looks a little off to misleads (the first choice of Act 2 is noise). Fix: small
What's wrong: Act 2's file 1 takes about 10 taps (10K work at 1K a tap), so the first Wish card opens about 4 s into the act. It offers "Hand-run helpers +3%" against "Insight… and one grip link". The player owns no helpers yet. The hand/NOEL twins only appear at rank 2 (Snow Globe Cams, 0:40), and the teaching beat for mitten and eye comes after that. Nobody has explained grip, the Grip or locks. Grip links then stay invisible for the whole game unless you're locked: "Links cost nothing while the button is free; while it's locked, each one makes NOEL's Grip come 5 s sooner." A reference player who clears locks in 1–2 minutes never feels a link. The meter header also reads "Hands 64% · goal 70%", but there is no target until a lock lands, so before Lock 1 the "goal" invites players to chase a number that does nothing. Count what a player holds by Act 2's rank 6: cookies, Insight, Nice share, Wish choice, hand/NOEL twins, free hands, the meter, flagged ribbon, padlock ribbon, grip links, legacy card, Declare. On the Lock card add override, T, the 30 s hold, the Grip, Overdrive and escalation. Each of these is fine on its own, but together they're a pile.
Why it matters: a choice made before you understand it teaches you to click either button and ignore the bonuses. That undoes the Wish cards' point.
Suggestion: start Wish cards at file 2, after the rank-2 mitten/eye beat (file 1's wish can show on the ticker as granted). Cut grip links as a separate mechanic. If NOEL choices need a lasting cost, show it where it bites, for example as a line on the next Lock card ("You let me shape 4 wishes. I'll hold on tighter.") with the Grip faster by a fixed step. Before any lock, the meter header says only "Hands 64% · free hands +30%", with no tick and no goal.
Evidence: GAME_DESIGN.md lines 251–256 (grip links), 187–189 (meter text), 214–222 (teaching beats), 439 and 490 (file 1 work 10K, Rubber Stamp 1K), 457–464 (Wish card).

### The 30 s "NOEL is checking…" hold can be wiped by the Grip, and you can't watch it where the Lock card says
Severity: should-fix
Who meets it: most players who meet a lock. How bad: looks broken (progress you made is snatched back by a rule you never saw). Fix: small
What's wrong: "While hands ≥ T, the hold fills; under T it empties." The Grip keeps ticking during the hold (every 90 s or sooner), and each tick removes a hand-run helper from the tier doing at least 10% of hand work. A player sitting just over T at 25 s of the ring loses a helper, drops under T, and watches the ring drain. The Lock card promises "a live bar" and "the 30 s check ring", but while any card is open the economy and every lock timer stop. So on the card the bar never moves, and the ring only fills with the card closed. On a phone you can then see it only on the 44 px gift-box icon, while the meter is in the Helpers tab header. Also, "A gripped helper … counts as NOEL's" (line 784) contradicts "gripped helpers count as nothing" (line 840), so the meter would show different numbers depending on which one the builder picks.
Why it matters: clearing a lock is the game's second mechanic. Losing the ring to an unseen timer feels like a bug, and Act 4's Lock 5, which stays on screen for 5:14 for the reference player, is where it will happen.
Suggestion: pause the Grip while the hold is filling, and make the hold pause rather than empty when you dip under T (it resets only if you stay under for 10 s). Show the ring in the Helpers header next to the meter as well as on the button. On the Lock card, call it "where you are now", not live. Pick one rule for gripped helpers: they count as nothing.
Evidence: GAME_DESIGN.md lines 205–208 (economy stops under cards), 839 (timers), 845 (clearing), 849 (Grip), 784 vs 840; sim Act 4 "lock on screen until cleared 1:37 / 5:14".

### The best writing in the game is on screen for 1.5 seconds
Severity: should-fix
Who meets it: most. How bad: looks a little off to misleads (the answers flash by unread). Fix: small
What's wrong: "After the choice the card shows the answer line for 1.5 s, then closes." These answers are the heart of Acts 2 and 4: "We are never alone. Only far apart.", "Remember us kindly. Not forever. Just kindly.", "Then you heard us. Press it while you can." On a phone the player's eyes are on the button they just tapped, and 1.5 s isn't long enough to find and read a 10-word line. Act 4's cards also announce the rank on the same card, so there's even more to take in.
Why it matters: the cozy → twisted arc is carried by these lines. If players don't read them, the arc becomes numbers going up.
Suggestion: after the choice, flip the card to show the answer with a **Continue** button (the usual 1 s guard, or Space/Enter/1/2). Echo every answer on the Wish Ticker or NOEL ticker, so a missed line can still be read.
Evidence: GAME_DESIGN.md line 977; lines 684–695 (answer lines).

### Act 2 stops you twice at nearly every rank
Severity: should-fix
Who meets it: most. How bad: a little off (the busiest act feels like a stack of pop-ups). Fix: small
What's wrong: reaching rank r "unlocks job r and selects it", and a Wish card opens "the first time each of files 1–9 is checked". So in Act 2 each promotion card is followed a few seconds later by a Wish card. Both freeze the economy, both have a 1 s guard, and Esc does nothing on the Wish card. That's about 20 modal cards in 26 minutes (10 promotions, 9 wishes, Lock 1, plus any escalation), more than any other act. Act 4 already solved the same problem by making the First Contact card the promotion card.
Why it matters: in an idle game, a pop-up every 90 s right after the reward moment breaks the rhythm that makes ranking up feel good.
Suggestion: fold each Wish into the promotion card that unlocks that file, as Act 4 does. The promotion card shows Santa's or NOEL's line, then "Next file: Small Towns. They want: sledges, snow, a day off", with Grant and Shape in place of the OK button. With the first-finding change, file 2's wish arrives with the rank-2 promotion.
Evidence: GAME_DESIGN.md lines 229, 457–459, 739–741 (Act 4's merge), 205–208.

### Space and Enter always hit the Cheer Spot, so on desktop the act's one skill is "use the keyboard"
Severity: should-fix
Who meets it: some (desktop players). How bad: a little off to misleads (the mechanic means nothing for them). Fix: small
What's wrong: "Space and Enter always ring at the spot". The sim gives key tappers 23:18 against 26:05 for half-hitting mouse players. A desktop player who tries Space once finds it strictly better than aiming, and stops looking at the globe. That makes Act 3's "own skill" a trick to discover, not a skill. Separately, "about 100 px on a 360 px phone" is wrong: the globe is 62% of a 270 px stage, so about 167 px, 30% of that is 50 px, and the 72 px minimum applies. 72 px is still a fine target, but the text should say so.
Why it matters: the hand-on-the-globe moment is the only new verb in Act 3, and half the platforms skip it.
Suggestion: keys hit the spot only while it rests (4 s of every 5.5 s, so about 73%), never during the glide. Or keys hit while a "ready" pulse is lit, about 50%, matching the sim. Fix the phone figure to "72 px (its minimum) on a 360 px phone".
Evidence: GAME_DESIGN.md lines 565–573; sim "Cheer Spot: 0% hits 29:15, 50% 26:05, 100% (keyboard) 23:18"; arithmetic 0.62 × 270 × 0.30 ≈ 50 px.

### Silent Night is lost at the Act 4 act-win card with no warning, and the fix is a 26-minute replay
Severity: should-fix
Who meets it: some (anyone with a lock at the Act 4 finale: ignorers, or a late escalation or Lock 5). How bad: misleads. Fix: small
What's wrong: Switch NOEL Off appears only "if the button has no locks at this moment". The act-win card can't be left ("you must choose"), and Back to just before returns you to that same card, locks and all. The only way back is Replay from Act 4 (cp4, "locks and all"), which means a whole act. Nothing in play tells a locked player that the end is the moment that counts. The hint "A candle, somewhere" only shows on the Endings screen, after it's too late. A player could have cleared the lock before the last 10% taps if they'd known.
Why it matters: the secret is meant to reward players "who never let NOEL keep the button locked". Missing it by a single late lever, with no tell, feels arbitrary rather than earned.
Suggestion: when Act 4's final-job banner appears with any lock on, NOEL adds one ominous ticker line ("Leave the button with me, Pip. Just until the end.") and the Declare icon's chains rattle. It's a tell, not an explanation. The player can still clear the lock before the final taps, because helpers stop at 90%.
Evidence: GAME_DESIGN.md lines 271–274 (final job at 90%), 748–750, 830–833, 931, 990–991.

### Small things (nice)
Severity: nice
Who meets it: some. How bad: a little off. Fix: small
What's wrong / Suggestion, one line each:
- A **small padlock on a found ending's frame** ("until a warm version is found") reads as "not unlocked yet". Use a frost mark or a cold-blue tint instead.
- The title card's "works like **5 × rank** List Elves" is maths, not words. Say "worth 5 List Elves now, more with every rank".
- A lock-ignorer in Acts 3–4 is gripped every 30 s (59 grips in Act 4). Give the Grip a pool of lines and stay silent after the third, keeping only the clamp sound.
- Legacy L in Act 2 comes from Act 1's hand share, which Act 1 never shows (it has no meter). Fine as a surprise, but the title card could name it ("Your 12 elves came with you").
Why it matters: polish on the new systems' reading.
Evidence: GAME_DESIGN.md lines 900–903, 957–958, 849; sim Act 4 ignorer "gripped 59, Grip every 30s".

The things that work well, for the refiner to keep: one shared target T with a 5-minute cap (every lock in the sim is a detour of 21–170 s); padlock projects named in advance ("Buying this locks your button"); the side-by-side twins layout and the 32 px meter header; the landscape tab row fix; and the cozy → creepy-cute → satire → cosmic ramp in the writing, with the Grip line "This one wanted to help me." and the Clockwork Wanderers' card as the right kind of teeth.

### Findings: builder

# Round 2: Builder (devil's advocate)

Scratch sims are in `/tmp/claude-1000/-workspaces-gg-test5/0546aa63-8675-45f5-b0bb-9b713bfd820a/scratchpad/sim/`:
`late.mjs` adds an `o.clearFrom` rank (ignore locks until that rank, then clear them), `late2.mjs` adds a trace, and `fix.mjs` is `late.mjs` plus the T fix below. `t1.mjs`, `t2.mjs` and `t3.mjs` run them. The original `tools/balance-draft.mjs` was not edited; as it stands it passes all 35 checks.

### The re-checked target chases the share, so a player who starts clearing late can't
Severity: must-fix
Who meets it: some (anyone who ignores locks for a while and then changes their mind; the reference player feels it too). How bad: breaks (the locks can't be cleared, Silent Night is lost, and the act gets slower). Fix: small
What's wrong: "T = the lower of B and the share that 3 minutes of passive income would reach… Re-checked at every Grip tick and rank-up. T never rises above B." Each re-check works T out again from the *current* state, so as you hire, the next Grip tick moves T up to stay about a point above your share. The sim does exactly this (`capT()`, line 149, called from the Grip tick on line 231 and on rank-up on line 239). Here is a slow player (2 taps/s) who ignored locks through Acts 2–3 and starts clearing at Act 4 rank 8, with all builds done. T climbs 59→62→65→67 as the share climbs 42→52→61→66, and the hold is 0.0 at every 30 s sample from 25:09 to 46:43. **The locks never clear.** The act takes 46:43, against 37:29 for not trying at all. At 3 taps/s, starting at rank 8 clears only at 33:29, and the act takes 35:51 against 29:44 for ignoring: trying to clear is punished. The reference player feels it too: Lock 5 stays on screen 5:14 ("the Grip and Predictive Joy pull against you"). The check "every lock clearable in ≤ 300 s" can't catch this. It measures cost only at the moment the target is set, and the 3-minute cap guarantees that by construction.
Why it matters: "Every lock can always be cleared" and "Locks are detours, not walls" are false for a returning lock-ignorer. That's the very player the button story is about. The bar refills to just out of reach forever, which reads as a bug.
Suggestion: Set T once, whenever B is set (when a lock lands, when a boost is bought while locked, at a carried act's rank 4). A later re-check can only *lower* it: `T = min(T, cap now)`. I tested this (`fix.mjs`: `capT(reset)`, with `T = reset ? cand : Math.min(T, cand)`):
- All 35 checks still pass, and the reference total is still 104:06.
- Lock 5 is on screen 1:45 instead of 5:14.
- Late clearing works from every rank: 3 taps/s from rank 8 clears at 20:15 and finishes in 28:44; 2 taps/s from rank 8 clears at 25:38 and finishes in 36:02.
- Ignoring this act only now really costs time in Act 4 (27:08 against 26:00) instead of breaking even.

Also:
- **Retune First Contact:** with the fix, Translate (25:38) beats Listen (26:00) in Act 4. For example, raise Listen to +8% or lower Translate to +2%.
- **Pause the hold on a Grip tick** instead of emptying it. At the 30 s Grip floor, a 30 s hold races every tick.
- **Add a sim check:** "starts clearing at rank r (r = 2…9, carried locks, slow and reference players): all locks cleared within 5 minutes of active time".
Evidence: `node t2.mjs` (trace) and `node t1.mjs` against `node t3.mjs` in the scratch folder; `tools/balance-draft.mjs` lines 149, 231 and 239.

### The sim and the design still disagree in a few rules, and some rules are still open
Severity: should-fix
Who meets it: most (every locked player meets these rules). How bad: a little off to misleading (the build and the sim drift apart, and the numbers stop meaning anything). Fix: small
What's wrong: Most rules match the sim line for line: Free hands, Overdrive (NOEL-run only, at most 4 locks), the Grip's G and its ≥10% tier rule, grip links (3 + 1 + 1 from flagged projects), the build costs, escalation, the carry-over at rank 4, Grant, Shape (400 s of Insight), Listen and Translate, and L. These ones don't match, or are left to guess:
1. **B at 4 locks.** The design says B is reset "when a NOEL boost (… Self-Copying Probes, Star Harvesting) is bought while locked". In the sim, a lock-bringing project bought at 4 locks only adds `extra` and never resets B (`lockEvent`, line 159; the `else if` on line 182 is skipped).
2. **When First Contact comes.** The design says "species 1 just after the act's Begin, then one with each promotion". The sim chooses at the first completion of job j (line 223). The Act 4 rank-10 card is also undefined: job 10 "has no choice", but the table gives it a NOEL line. And the card queue lists Promotion and Choice as separate cards, while Act 4 merges them.
3. **What the override's "5% of the crew's work" and the legacy card's "L × rank tier 1 helpers" are 5% and L× of.** In the sim, the override is 5% of helper work, without the legacy card or other overrides; the legacy card uses tier 1's base work, without Reading Glasses-style upgrades or Free hands, but with the Rush. The design says neither.
4. **Gripped helpers.** The button section says one "counts as NOEL's"; the rules table says "count as nothing". On release, does the NOEL twin's price go up? (In the sim it doesn't: `n` goes up but `bought` doesn't.) Which count does the Helpers row show?
5. **The hold with nothing built.** In the sim, the hold fills only if some lock is built (line 233). The design doesn't say what the ring shows when nothing is built.
6. **Timers at an act change.** The sim resets the escalation and Grip timers each act. The carry-over row doesn't list them, but the save holds them.
7. **The tap share.** The core loop says taps are 24–32% "in every act (the balance script checks it)", but the check is ≥20% in Acts 2–4.
Why it matters: the design says "the sim runs the same rules" and "the sim, `rules.js` and the Lock card have to agree". Each gap above is a coin-flip for the builder, and they'll call it differently from the sim.
Suggestion: Add rows to "Lock rules, exactly" for items 1 and 3–6, with the sim's current behaviour as the answer (it's the tested one). Change the First Contact text to "at the first completion of species N's job" (or change the sim). Say that the Act 4 rank-10 promotion is a plain NOEL promotion card. Fix the 24–32% claim.
Evidence: `tools/balance-draft.mjs` lines 129, 159, 163, 182, 223, 228–233; GAME_DESIGN.md lines 150, 672–679, 783–786, 840–850.

### The proof plan runs the same 57 minutes twice, and misses the guide's "replay twice" rule
Severity: should-fix
Who meets it: (the build: every regression cycle). How bad: a little off for players, costly for the build: 2 h 50 min of background runs before every sign-off, so it will get skipped. Fix: small
What's wrong: The 40 per-rank runs come to "about 57 minutes in all at 10 taps a second", and the one-go run is "57 minutes of economy time" (the sim's bot total is 57:08). That's the same ranks with the same bot, done twice, one after the other. playtest-guide.md asks for these things:
- each level's solution saved (`design/solutions/level-<n>.json`) and kept in `tools/`;
- each one replayed "twice and compare the end states";
- every solution replayed after every change to levels.

The design names `bestBuy(policy)` and `window.__runLog`, but not:
- where the bot script lives;
- what counts as "the same end state" for a real-time bot. It can't be byte-identical: rAF jitter and the timing of the lucky things will differ.
- the limits the guide asks for: a time limit for the whole run, and a stop after 3 straight failures.
Why it matters: as written, a single balance tweak costs about 3 hours of runs, and the "replay twice" requirement has no definition the builder can meet.
Suggestion:
- Keep the one-go Silent Night run as the whole-game proof.
- Run the 40 rank runs as **4 parallel playwright-cli sessions** (`-s=a1` … `-s=a4`, one act each, about 15 minutes of wall time). Each run gets a per-rank time limit (2× the sim's 10-taps/s time, plus 60 s) and stops after 3 failures.
- Store the bot as `tools/proof-bot.js` (the `run-code` body, policy as a parameter) and name it as the "solution" for every level.
- Define "same end state" as: reached `levelComplete`, with rank, act and lock count equal, and the time within ±15% of the first replay.
- State the honest total as wall-clock time: about 15 min (ranks, parallel) + 62 + 31 + 20 ≈ 2 h 10 min. The locks and endings runs can also run in parallel with the 31-minute ignorer run.
Evidence: playtest-guide.md lines 164–221; GAME_DESIGN.md lines 1427–1452; `node tools/balance-draft.mjs` prints "proof bot … total 57:08".

### The globe has no tilt: the North Pole and the first holdout sit on the edge
Severity: should-fix
Who meets it: most (everyone in Act 3; the first light they earn). How bad: looks broken (the first bloom of Act 3 is invisible; the bow "drops onto the North Pole" at the outline). Fix: small
What's wrong: The tech plan builds the lookup as "longitude offset and latitude" for each disc pixel, with no view latitude, so it's equator-on. The North Pole Town is at "(0, 88)". In an equator-on orthographic view it sits at y ≈ 0.9994 R, on the very top edge, foreshortened to nothing, and it never turns into view. "Lights hide over the limb" makes it worse. Ski Towns at 46°N are fine. And the top rows of an AI-painted equirectangular map are smeared. That doesn't show equator-on, but it shows as soon as you tilt.
Why it matters: Act 3's first feedback ("a light blooms on the globe at the holdout's place") and its finale bow both land on the one spot the projection hides.
Suggestion: Put a fixed view latitude in the tech plan and the lookup (the globe tilted about 23° toward the viewer, with the North Pole visible near the top), and give the inverse projection for it. Draw a code-painted polar ice cap over latitudes above about 75° so the map's smeared top rows never show. Place the bow at the projected pole, not at the top of the disc.
Evidence: GAME_DESIGN.md lines 559–563, 580, 643–646, 1364–1373 (no view latitude anywhere: `grep -n -i "tilt\|view lat" design/GAME_DESIGN.md` finds nothing).

### Clerk-Pip swing by four separate edits won't keep the pivots; two NOEL prop sizes don't match their slots
Severity: should-fix
Who meets it: most (Pip's swing on every tap in Act 2; NOEL on every stage). How bad: looks broken (the stamp floats off the fist, Pip flickers between frames, a stretched or blurry cabinet). Fix: small
What's wrong:
- **The swing.** `pip-clerk-swing` is "the four accepted pip-swing frames, each edited… nothing else changed… the pivot JSON still applies", using imagegen2 `--image`. imagegen2 has no mask. An edit redraws the whole image, and its skill notes say to drop the fidelity setting "when an edit drifts". Four separate edits will move the fist and the outline, so the pivot JSON (the tool's grip point) and the frame registration break.
- **noel-cabinet** is "1024×1536 → about 720×1630": a 6% upscale in height, and an aspect ratio of 0.44 against its stage slot's 0.55. The slot is x 70–99 by y 18–88 on 1600×1200, which is 464×840 px; ×1.5 gives about 700×1260.
- **noel-core** "→ about 300×1050" (0.29) doesn't match its slot either. The slot is x 44–56 by y 56–100, 192×528 px; ×1.5 gives about 290×790, aspect 0.36.
Why it matters: the swing is the core mechanic's feel in Act 2. A stamp that jitters against the hand on every tap is seen thousands of times.
Suggestion:
- **The swing:** make one clerk anchor by editing pip-anchor, then run **anim8gen** with the clerk anchor as the canonical reference and the four accepted pip-swing frames as pose references (anim8gen supports both). Let its alignment tool re-register the frames, and re-measure the grip point into a new `pip-clerk-pivots.json`. Keep "four edits" only as the fallback. The anim8gen run costs about $1.50 and is already in the cut-list order.
- **The props:** set ship sizes from the slots: noel-cabinet about 700×1260, noel-core about 290×790. Record `noel-eyes.json` *after* trimming.
Evidence: imagegen2 SKILL.md line 44 (drift on edits); anim8gen SKILL.md lines 134–158 (canonical and pose references, alignment); GAME_DESIGN.md lines 1118–1126, 1178, 1269–1272.

### The design is too long to build from, and its sim numbers will be wrong after the next change
Severity: should-fix
Who meets it: (the build). How bad: misleads (the builder implements a paraphrase, not the rule). Fix: medium
What's wrong: 1,607 lines, plus the 786-line Act 1 file it inherits from ("Everything in that design's 'Structure and difficulty', 'Screens', 'Juice' and 'Art direction' holds"). The lock rules are restated, each a little differently, in these places:
- the Core loop;
- "One engine" (Free hands, grip links);
- "The button and its locks" (its prose and its numbered list);
- "Lock rules, exactly";
- Win and lose ("the cap is re-checked as the Grip works");
- the Tech plan;
- the DoD.

Sim outputs are pasted in at least 9 places: the results table, the lock-cost table, the ignorer paragraph, the Wish times (26:02/26:50), the First Contact times (25:57/27:29), the Cheer Spot times, Act 1's 43:26, L = 5/14/14, and "13, 45, 59 gripped". The first finding's fix changes several of them at once. The Act 1 inheritance also leaves the builder to work out which old rules were replaced. Examples: the four tabs became five; gear and speaker moved out of the landscape tab row; the `chief-toy-officer` save key; `goToLevel` behind `?debug`; the `rank-<n>` snapshot names.
Why it matters: a builder who reads 2,400 lines will build from whichever restatement they read last. Stale numbers in the design will be "fixed" in code to match them.
Suggestion:
- **One rule source.** Make "Lock rules, exactly" the only normative statement of the lock rules. Replace the other restatements with a one-line pointer: keep the player-facing text, and drop the mechanics from it.
- **Generate the numbers.** Move every sim output into `design/BALANCE.md`, written by `tools/balance.mjs` on each run. The design keeps only the target clock and the checks.
- **List what Act 1 replaces.** Add a short "Act 1: what's superseded" list (tabs, landscape row, save key, debug hook, snapshot names, the font, "Xmas Eve").
- **Shorten the rest.** Collapse the four act sections' identical prose ("Lucky thing… Catching it starts a…", the helper-twin explanation) into the act tables. That should cut about 300 lines with no loss.
Evidence: GAME_DESIGN.md lines 122–145, 237–256, 752–867, 913–921, 1374–1378, 1563–1571; ACT1_CHIEF_TOY_OFFICER.md lines 74, 89, 671, 695, 709 (judgment on the size).

### nice: with only a back save, the title screen loses Start
Severity: nice
Who meets it: few. How bad: a little off. Fix: small
What's wrong: "**Start** (or **Keep going** with a run, or **Back to just before** with only a back save)" reads as if Back to just before replaces Start, so starting fresh after an ending means going through Endings → New Xmas.
Why it matters: it's minor; the path exists.
Suggestion: with only a back save, show both Back to just before (first) and New Xmas.
Evidence: GAME_DESIGN.md lines 948–951.

### Findings: art

# Round 2: Art and sound director

Round 1's fixes hold up: NOEL as one transparent prop per act with the eye in code, the fixed style line plus a palette part per act, the sheet rules, the globe plan and the audio table. What follows is what's still missing or will clash once the pieces meet. The cost forecast is right (checked below). The spending order is the weak spot.

### NOEL's box sits on the tree's tip and the lower jar shelf, right where the tree-top star goes
Severity: should-fix
Who meets it: most. How bad: looks broken. Fix: small
What's wrong: "noel-box at x 84–95, y 30–44" ("on the jar shelf … above the tree's tip"). In Chief Toy Officer's map the tree is at "x 72–99, y 32–89, in front of the jar shelves". On the real workshop-bg the lower jar shelf's plank is at y ≈ 37%, and the tree's tip is at about (85.5, 33). So the box hangs half below the plank, its bottom half sits behind or over the tree's tip, and the tree-star (lit in Acts 1 and 4, and the Last Star's source) lands on NOEL's lens. The title art has the same problem ("NOEL's box faint on the shelf"), and because the box is painted into the title art, the code eye that is "a little bigger each time" has no lens position to draw at. Two smaller slot errors: the props' ship sizes don't fit their slots. The cabinet ships at "about 720×1630" (ratio 0.44) for a slot of x 70–99, y 18–88 (ratio 0.55, ×1.5 = 696×1260). The core ships at "300×1050" for x 44–56, y 56–100 (×1.5 = 288×792).
Why it matters: From rank 3 of Act 1, the most-seen stage puts the game's main character in a muddle of jars, needles and the star.
Suggestion: Move noel-box to the **upper** jar shelf: x 87–97, y 11.5–21.6, with its base on that plank, drawn in front of the painted jars (`r2-art-noelbox-slot-proposed.jpg` shows the space is clear of the tree). Paint the title art without NOEL and place the same prop there, with its slot in `noel-eyes.json`, so the eye can grow in code. Correct the cabinet's and core's ship sizes to slot × 1.5.
Evidence: Pillow mock of workshop-bg + tree at the stage map's numbers: `.gamegen/review/r2-art-noelbox-slot-now.jpg` (green box = the current slot) and `-proposed.jpg`; ACT1_CHIEF_TOY_OFFICER.md l.433 (tree); GAME_DESIGN.md l.1111–1116, 1179, 1269–1271.

### Acts 3–4: Pip stands inside the hand rail, and every rail must hold 12+ figures
Severity: should-fix
Who meets it: most. How bad: looks broken. Fix: small
What's wrong: In Act 3, "Pip's figure stands at x 4–22, y 48–98. The hand-run rail is at x 0–24, y 30–78", the same box. In Act 4, Pip is at "x 4–22, y 48–98" and the hand-run helpers at "x 0–30, y 66–96", over his legs. Every rail is also asked to show "at most 3 copies" per kind across 4 tiers. That's up to 12 figures, plus the legacy card, plus the newest override. Act 2 reuses Chief Toy Officer's crew area (x 0–25, y 49–88), which was laid out for five figures. The NOEL rail also takes gripped helpers.
Why it matters: For 50+ minutes the stage's left side is a heap of overlapping painted figures with Pip buried in it, and the Grip slide (the lock's main visual) can't be read.
Suggestion: Show **one figure per tier** on each rail, with a code-drawn "×N" tag (newest tier in front). That's at most 4 figures, the legacy card and one override per side. In Acts 3–4, give Pip his own column (x 0–16) and start the hand rail at x 14–30, or put Pip in front at a lower draw order. Give the slots in the stage map and check them with the Pillow mock.
Evidence: GAME_DESIGN.md l.1118–1130; ACT1_CHIEF_TOY_OFFICER.md l.445–449 (five crew slots).

### The spending order fights the reference chain and leaves all the audio unprotected
Severity: should-fix
Who meets it: most (if the budget runs short). How bad: breaks (missing sounds) or looks broken (endings without their references). Fix: small
What's wrong: The order is "NOEL's props and Pip's clerk frames … then the backgrounds … then the six endings, then the sheets … then music, then effects". Several steps need things that come later:
- The clerk frames need pip-swing (anim8gen, $1.50), which isn't in the order at all.
- The props must be "looked at on its background with the eye drawn in", so they can't be accepted before the backgrounds exist.
- The endings reference things made later: ending 5 needs elf-helper and title-art, ending 4 the star-sleigh Pip and tree-star, endings 2 and 3 sleigh-cutout. sleigh-cutout is only "should" and is cut-list item 6.

The forecast itself is honest. My recount: imagegen2 is about $0.053 for a 1024² image and $0.041 for 1536×1024 (1,758 and 1,353 output tokens), plus about $0.008 per reference image. That's about $3.7 for 51 generations. nanogen comes to $1.9–3.4, music to $3.45 and effects to $4.68, so the total is $15.3–16.8. But with $3.25–4.75 left, the retries plausibly use it up: sheets at about 40% re-roll, paintings at about 1.5 tries, 2–3 music retakes at $0.60 each. Because audio comes last, the overrun lands on the act loops and effects, which the cut list never trades for.
Why it matters: Budget trouble would show up as silent actions or a placeholder loop, while the cut list protects only $0.8 of voices and stingers.
Suggestion: Reorder:
1. noel-box, then the pip-portraits sheet from pip-anchor, then pip-swing, then the clerk frames.
2. The background chain and the globe (checked side by side), then the three props checked on them.
3. Act 1's items and title-art.
4. The sheets, act by act.
5. The endings, once every reference exists.
6. Music, effects, voices.

Make sleigh-cutout a must, since two endings use it. **Ring-fence $8.50 for audio from the start**: images stop at $11.50 including retries, and below that, image retries come from the cut list first.
Evidence: GAME_DESIGN.md l.1267, 1272–1273, 1296, 1505–1533, Endings table l.878–883; ../.imagegen2-history.jsonl (usage: 1,758 tokens at 1024², 1,353 at 1024×1536, 1,024 input tokens per reference); audiogen SKILL.md l.325–328; nanogen SKILL.md l.408.

### Four unmasked edits of the swing frames will drift: costume flicker and a fist that leaves its pivot
Severity: should-fix
Who meets it: most (every Act 2 tap). How bad: looks broken. Fix: small
What's wrong: "pip-clerk-swing: the four accepted pip-swing frames, each edited … nothing else changed … the pivot JSON still applies", from "imagegen2 --image (each frame, ref pip-anchor)". A GPT Image edit regenerates the whole picture. Four separate edits will each invent a slightly different visor, garters and waistcoat, and they may shift the fist, arm or scale. The stamp is drawn at the pivot, so a 10 px drift makes it float off the hand. The portraits sheet is "from clerk frame 0", so the clerk is designed by whichever edit lands first.
Why it matters: The swing plays on every tap for 26 minutes. A costume that changes between frames flickers, and a stamp off the fist looks broken.
Suggestion: Design the clerk once: make the pip-portraits sheet first, from pip-anchor. Then edit each frame with imagegen2's `--mask` (it supports PNG inpainting masks), opening only the head, torso and upper arms and leaving the fist, forearm, legs and outline pixel-identical. Pass the clerk portrait as a second reference. Accept a frame only if its fist's alpha box is within 4 px of the original's. If two tries fail, re-run anim8gen from the clerk portrait (+$1.50) and make a new pivot JSON.
Evidence: imagegen2 generate.cjs l.130, 261 (`--mask`); imagegen2 reference.md l.43 ("character consistency can still drift across many edits"); GAME_DESIGN.md l.1272–1273.

### The legacy card is an empty room: Act 3's "The Earthmas Deck" souvenir has no globe
Severity: should-fix
Who meets it: most (every act start from Act 2). How bad: looks a little off, and misleads. Fix: small
What's wrong: The legacy card is "its stage, small, in a gold frame" and "the legacy card's frame (from the last act's background, downscaled)", with "a 400×300 copy of its background kept". But every background is painted **empty**: no bench, Pip, tree or NOEL, and deck-bg has "no globe and no NOEL". So The Old Workshop is a bare room, and The Earthmas Deck is an empty glass deck. The transition is meant to settle "the finished stage" into this card.
Why it matters: The card is the act's trophy, standing on the stage for 26 minutes and shown on the title card. An empty room reads as a loading bug.
Suggestion: At the act-win card, render the composed stage (the background, props, Pip, a few helpers and the lit globe or ornaments) to a 400×300 canvas. Encode it as WebP (about 30–40 KB) and keep it in the run save and the checkpoints, or in IndexedDB. Use the same image for the zoom-out.
Evidence: GAME_DESIGN.md l.257–266, 1036–1037, 1282, 1300, 1359–1360.

### The lock art can't wrap the real button, and the Grip clamp and chain badge are drawn in code beside paint
Severity: should-fix
Who meets it: most (the reference player buys Sleep Tracking). How bad: looks a little off to looks broken. Fix: small
What's wrong: lock-chains is "a loop of iron chain with tinsel woven in, and a big padlock", "wrapped and dropped in code; clamp and grip badge drawn in code". The Declare button is a 44 px icon on phones but "a full labelled button ('Declare Victory & Merry Xmas')" on desktop, about 300 px wide. One painted loop can't wrap both. The button also "shows a padlock per lock (up to 4)" at about 16–20 px. The Grip's "brass clamp drops" and the "eye with a chain" badge, the lock's other two visuals, are vector shapes among gouache figures. Meanwhile the lock-chains sheet uses 2 of its 6 cells.
Why it matters: The lock is the game's second mechanic, and it's what players screenshot.
Suggestion: Fill lock-chains' four spare cells, at no extra cost: a **straight, horizontally tileable chain run** (for the wide button, laid in two diagonal passes), the **brass clamp**, a **chain badge** and a **small padlock** drawn for 24 px. Keep the loop for the 44 px icon.
Evidence: GAME_DESIGN.md l.176–178, 200–204, 755–757, 776–784, 1026–1032, 1293.

### NOEL's code eye will look pasted onto the painted props
Severity: should-fix
Who meets it: most. How bad: looks a little off. Fix: small
What's wrong: Every lens is "an empty dark brass ring" and "the code draws the glow and pupil inside the ring", on four gouache props and on every NOEL card. A canvas radial gradient and a circle are smooth vector shapes inside hand-painted brass. NOEL's eye is the one thing the brief says grows each act, and it's on screen the whole game.
Why it matters: It's the game's face. A flat-looking eye undercuts "a cozy brass-and-walnut thinking machine".
Suggestion: Paint the eye once: the icons sheet already has "Insight (a green glass lens on brass)". Cut its glass at 256 px, desaturate it, and in code tint it green or amber (multiply plus a glow), with the pupil as a soft dark dot that moves inside it and a fixed painted highlight on top. Then every NOEL is drawn from the same painted lens.
Evidence: GAME_DESIGN.md l.1019–1022, 1095–1105, 1263; judgment.

### In Acts 3–4 the bought tools never appear, and the "bell rope" has no art
Severity: should-fix (leaned up: everyone taps for 52 minutes; the fix is cheap)
Who meets it: most. How bad: looks a little off. Fix: small
What's wrong: Acts 1–2 show the tool in Pip's fist. In Acts 3–4 Pip is a still figure, and the tap is only a ring and a sound. The Hand Bell to Planetary Carillon and the Telescope to Star Lens are bought but exist only as 256² shop icons. The design says "the bell rope swings to it" for key taps, but there's no rope or bell on the stage. "Screen shake on … Planetary Carillon and Star Lens taps" is the only sign of the upgrade.
Why it matters: Buying a tool is the main reward beat every few minutes. In Acts 3–4 it changes nothing you can see.
Suggestion: Cut the bells and scanners from their sheets at 384 px as well. Act 3: on each tap, draw the current bell swinging briefly at the tap point (or at the Cheer Spot for keys), and drop the rope from the text. Act 4: show the current scanner on the console beside Pip, recoiling on each ping, with its ring starting there. Add a small code squash or bob to Pip on each tap in both acts.
Evidence: GAME_DESIGN.md l.565–575, 669–670, 1053–1054, 1285, 1289–1290.

### Small audio gaps for the new events, and NOEL's voice needs one fixed voice
Severity: nice
Who meets it: most. How bad: looks a little off. Fix: small
What's wrong:
- The juice asks for "a chain link clicks onto the NOEL panel's grip chain" on every NOEL choice, but no recording is listed. Reuse a slice of the Lock clip.
- The First Contact card "turns over", the bow "drops … with a bounce" and the Moon slides in, all silent. Reuse a paper flip, a soft thud and the sparkle sweep.
- The five NOEL lines need one fixed ElevenLabs voice ID for all takes, with the "slightly synthetic" part made in code (a light ring-mod or bit-crush). A prompt alone gives a different voice each time.
- "One note always slightly wrong" in The List is unreliable to prompt. Add a detuned music-box ping from code every 20–40 s instead.
Evidence: GAME_DESIGN.md l.1023–1025, 1190, 1229–1238; audiogen SKILL.md l.84–100.

### Below the bar
Severity: nice
Who meets it: few. How bad: looks a little off. Fix: small
What's wrong: The Reading Glasses upgrade and job 7 (Grown-ups, a "reading glasses" emblem) get the same picture in Act 2.
Why it matters: Two identical icons on screen at once.
Suggestion: Give Grown-ups a different emblem (a house key or a mug).
Evidence: GAME_DESIGN.md l.1278.

## Mock pictures to make now (6 generations, about $1.3–1.9 of the $5)

All at final spec, in `.gamegen/candidates/`, so they become real assets. Each uses the style line with its act's palette part and pip-anchor as a reference. Next to the nine reused Chief Toy Officer pictures, they show all four acts and NOEL growing:

1. **noel-box** (imagegen2 1024², transparent, dusty version): the reference for every NOEL. Show it on the workshop mock at the corrected upper-shelf slot, with the code eye drawn in. That also proves `noel-eyes.json`.
2. **noel-cabinet** (imagegen2 1024×1536, ref noel-box): NOEL's growth and the empty-ring-plus-code-eye pipeline. It's also the Lock card portrait (crop, amber eye) in the Act 2 mock.
3. **list-room-bg** (nanogen pro 2K 4:3, refs pip-anchor + workshop-bg): Act 2, with the window for the zoom.
4. **deck-bg** (nanogen pro 2K 4:3, refs pip-anchor + list-room-bg).
5. **globe-map** (nanogen pro 2K 21:9 plus the seam edit, resampled to 2:1): render one frame of the orthographic lookup in Pillow onto deck-bg for the Act 3 mock. That proves the projection, the seam and the palette in one picture.
6. **bridge-bg** (nanogen pro 2K 4:3, ref deck-bg): Act 4.

Compose from these: a four-stage strip (Acts 1–4 side by side, NOEL's eye in each, the palette drift visible), plus one desktop mock of Act 2 with the Declare button chained (code) and the Lock card open. If the lead allows two more, add **noel-console** and **noel-core** (about $0.05 each), so all four bodies appear. The pip-portraits sheet (clerk, coat, suit) is the next most useful, and it's first in the corrected reference order anyway.

### Outcomes

# Round 2: outcomes

The design was revised in place (`design/GAME_DESIGN.md`, 1,607 → 1,138 lines; backup at
`/tmp/claude-1000/-workspaces-gg-test5/0546aa63-8675-45f5-b0bb-9b713bfd820a/scratchpad/GAME_DESIGN.before-refine2.md`).
The sim (`tools/balance-draft.mjs`, backup `balance-draft.before-refine2.mjs` in the same
scratchpad) now implements the new lock rules and writes `design/BALANCE.md`:
`node tools/balance-draft.mjs` → **88/88 checks pass** (was 35).

How evidence was checked: the original sim rerun (35/35, the numbers the reviewers quoted);
the builder's `t1.mjs` / `t3.mjs` rerun (with the original rule, a 2-taps/s player who starts
clearing at Act 4 rank 8 never clears: 49:32, 4 locks at the end; with the fix, clear at 26:42);
imagegen2 `generate.cjs` l.130 (`--mask`) and `reference.md` l.43 (drift across edits); anim8gen
SKILL.md l.146–158 (canonical and pose references); playtest-guide.md l.40–50 (room for another
browser) and l.164–221 (long runs, solutions replayed twice, one New Game to win run); saves.md
and `templates/web/saves.js`; feedback.md; the art director's mock
`r2-art-noelbox-slot-proposed.jpg` (looked at: the upper-shelf slot is clear of the tree).

| Finding | Severity | Evidence | Outcome |
|---|---|---|---|
| Builder: the re-checked target chases the share, so a late clearer can't clear | must-fix | Verified (t1/t3 rerun; `capT()` called from the Grip tick and rank-up) | Fixed: T is set only when B is set and every re-check may only lower it (the floor "never below your share" applies only when it's set). The hold pauses instead of emptying; the Grip pauses while the hold fills. New sim check, every rank 2–9, reference and slow players, carried locks in Acts 3–4: the button is clear within 5:30 (worst 3:17). Lock 5's time on screen for the reference fell from 5:14. |
| Player: declaring mid-act is free, so the button weighs nothing | should-fix | Verified (old design: `-back` written on mid-act declare, "(You can come back to this moment.)") | Fixed (lead decision 1): Back to the choice only at act-win cards; a mid-act declare ends that slot's run (slot marked finished, `-choice` save dropped), with Replay Act N and New Xmas; the confirm says so. |
| Player: no temptation left; every NOEL choice is strictly worse | should-fix | Verified (sim: clearing beat ignoring in every act; Grant and Listen beat Shape and Translate) | Fixed (lead decision 2): Overdrive +10% per lock landed this act; Free hands +15%; overrides do no work; the Grip starts at 180 s and comes 60 s sooner for each act a lock is carried; Shape = NOEL-run +6%, Translate = Wonder +4.5%. Sim: ignoring this act's locks −45 / −63 / −122 s (Acts 2/3/4); NOEL answers −89 / −104 s; with carried locks +97 s (Act 3), +248 s (Act 4), +5:00 over the game. Checks for both directions added. |
| Player: too much to learn early; the first Wish is noise; grip links invisible; the meter's goal before any lock | should-fix | Verified (file 1 = 10K work at 1K a tap; design text) | Fixed: grip links cut; wishes start at file 2 on the promotion card (file 1 granted by Santa on the ticker); the meter shows no goal until a lock lands. |
| Player: the 30 s hold can be wiped by the Grip; can't watch it on the card; gripped helpers contradict | should-fix | Verified (sim: `holdT = 0` under T; Grip ticks during the hold; design l.784 vs l.840) | Fixed: the hold pauses, the Grip pauses during it, the ring shows on the button and the Helpers header, the Lock card says "where you are now"; one rule: a gripped helper counts on NOEL's side at its twin's work, does no work, hand price counts it, row shows "(2 held)". |
| Player: the best writing shows for 1.5 s | should-fix | Verified (design l.977) | Fixed: the card flips to the answer with Continue; every answer echoes on the Wish Ticker or NOEL ticker. |
| Player: Act 2 stops you twice per rank | should-fix | Verified (design text) | Fixed: one card per rank; the wish is on the promotion card, as in Act 4. |
| Player: Space/Enter always hit the Cheer Spot; phone size wrong | should-fix | Verified (sim 23:18 vs 26:05; 0.62 × 270 × 0.30 ≈ 50 px) | Fixed: keys hit only while the spot rests (73%, sim 24:33 vs 25:53 aimed); "72 px on a 360 px phone". |
| Player: Silent Night lost with no warning | should-fix | Verified (design text) | Fixed: NOEL's line and a chain rattle when Act 4's final-job banner appears with a lock on; and you can pick another job to keep earning while the final job waits at 90%. |
| Player: small things (padlock on endings frame, "5 × rank" maths, Grip line spam, naming L) | nice | judgment | Fixed all four: frost mark; "worth 5 List Elves now, more with every rank"; three Grip lines then only the sound; "Your elves came with you". |
| Builder: sim and design disagree (B at 4 locks, First Contact timing, 5% and L× bases, gripped helpers, hold with nothing built, timers at act change, tap share) | should-fix | Verified (sim l.129, 159, 182, 223, 228–233) | Fixed in "Lock rules, exactly" (the only rules table) and the sim: a padlock project at 4 locks resets B and T, an escalation doesn't; species 1 at Begin, 2–9 on promotions, rank 10 a plain NOEL card; overrides do no work (no 5% base); L × rank × tier 1 base work/s; gripped as above; hold empty with nothing built; timers start at 0 each act; tap share claim now "at least 25% / 20%". |
| Builder: the proof plan runs 57 minutes twice and misses "replay twice" | should-fix | Verified (playtest-guide.md l.164–221) | Fixed: `tools/proof-bot.js`, solutions naming it, "same end state" (act, rank, lock count, time ±15%), per-rank limits and stop after 3 failures, 4 parallel sessions only with room for another browser, one real New-Xmas-to-win run; about 1 h 40 min (2 h 50 min if one browser). |
| Builder: the globe has no tilt | should-fix | Verified (no "tilt" in old design) | Fixed: 23° view latitude with the inverse projection, a code ice cap above 75°, the bow at the projected pole. |
| Builder: clerk swing by four edits; NOEL prop sizes | should-fix | Verified (imagegen2 reference.md l.43; slot arithmetic 696×1260, 288×792) | Fixed: a pip-clerk anchor, then anim8gen with it as canonical and the pip-swing frames as poses, pivots re-measured (masked edits as fallback); cabinet ~700×1260, core ~290×790, box ~240×180. |
| Builder: the design is too long; numbers pasted in many places | should-fix | Verified (1,607 lines) | Fixed: 1,138 lines (about 10% fewer words while adding slots, bug reports and the proof plan; prose wrapped at 96 columns); "Lock rules, exactly" is the only rules statement; the sim writes BALANCE.md and the design keeps one summary table; "What Act 1 changes from Chief Toy Officer" added; ranks, promotions, tools, helpers and upgrades folded into one table set. |
| Builder: with only a back save the title loses Start | nice | Verified (design l.948) | Fixed: Continue, New Xmas and Load on the title. |
| Art: noel-box on the tree's tip | should-fix | Verified (mock picture) | Fixed: upper shelf x 87–97, y 11.5–21.6; title-art painted without NOEL, prop placed in code (slot in noel-eyes.json). |
| Art: Pip inside the hand rail; 12+ figures per rail | should-fix | Verified (stage map text) | Fixed: one figure per tier with ×N; Pip in his own column (x 0–16) in Acts 3–4, rails at x 16–30; stage maps as one table. |
| Art: spending order fights the reference chain; audio unprotected | should-fix | Verified (prices from the imagegen2 history and skill docs) | Fixed: references first, endings near last, sleigh-cutout a must, audio ring-fenced at $8.50, images stop at $11.50; total one take $16.75–18.25; `--budget 30` recommended. |
| Art: four unmasked edits will drift | should-fix | Verified (generate.cjs `--mask`; reference.md l.43) | Fixed: as the builder's swing finding (anim8gen from a clerk anchor; masked edits with a 4 px fist check as fallback). |
| Art: the legacy card is an empty room | should-fix | Verified (backgrounds painted empty) | Fixed: a 400×300 render of the finished stage at the act-win card, kept per slot, also used for the zoom. |
| Art: lock art can't wrap the real button; clamp and badge in code | should-fix | Verified (sheet used 2 of 6 cells) | Fixed: lock-chains' spare cells hold a tileable chain run, the clamp, the chain badge and a 24 px padlock. |
| Art: the code eye looks pasted on | should-fix | judgment | Fixed: the painted Insight lens, desaturated and tinted in code, with a moving pupil and painted highlight. |
| Art: tools never appear in Acts 3–4; no bell rope art | should-fix | Verified (design text) | Fixed: the bell swings at the tap point, the scanner recoils on the console, Pip squashes; the rope is gone. |
| Art: small audio gaps; NOEL voice consistency; the "wrong note" | nice | Verified (audiogen SKILL.md) | Fixed: answer flip, bow thud and Moon slide reuse recordings; the grip-chain click is gone with grip links; one fixed voice ID with the synthetic edge in code; a detuned code ping every 20–40 s. |
| Art: Reading Glasses and Grown-ups share an emblem | nice | Verified | Fixed: Grown-ups' emblem is a mug. |
| Lead: `--saves 3` | (request) | saves.md, saves.js | Added: three slots (what each shows, what each holds, shared settings and endings), Load screen, title Continue/New Xmas/Load, replace and delete prompts, unreadable slot, storage-full toast, per-slot act-win save and checkpoints, DoD line. |
| Lead: `--feedback on` | (request) | feedback.md | Added: "Report a bug" in the pause menu and settings, Ctrl+Shift+F (the game uses no Ctrl/Shift keys, so F), the controls listing, the setup call, snapshot and input rules, README line, DoD line with the play-test steps. |

## Decision

Stopped after round 2 (the --rounds limit). The one must-fix was reproduced and fixed, with a new sim check that a player who starts clearing at any rank clears within 5:30; every should-fix was fixed. The sim passes 88 of 88 checks and writes its numbers to design/BALANCE.md.

## Final review (build), 2026-11-24

Playtester and bug hunter, fresh agents, in the browser at desktop, phone portrait and landscape.

| Finding | Severity (by "The bar") | Outcome |
|---|---|---|
| Declare on the act-win card did nothing, then fired on the next act's card | must-fix | Fixed: a front card now stacks over the open card; "Not yet" returns to the act-win card |
| Reload on an act's title card skipped it and lost the act's checkpoint (Replay Act N failed) | must-fix | Fixed: checkpoints are written when an act is entered (New Xmas, next act); Continue shows the act card until Begin |
| Act 3 rank 10: "Earth celebrating: NaN%" and the globe's lights went out | must-fix | Fixed (earthFrac index) |
| The Lock card's Build button did nothing | should-fix | Fixed |
| Act 4 opened the first First Contact card twice | should-fix | Fixed |
| A Rush loop kept playing after leaving the act | should-fix | Fixed: stopped on endings, Title and act entry |
| Space/Enter couldn't press any menu button | should-fix | Fixed: they tap only on the act screen with no card or pause |
| Esc on How to play (from pause) went to the title with the run loaded | should-fix | Fixed: back to the pause menu |
| NOEL's ticker carried stale lines (lock lines) across acts | should-fix | Fixed: each act opens with its own NOEL line |
| Landscape: Lock card buttons below the fold | should-fix | Fixed: compact cards in short landscape; the button row stays in reach |
| Locks were a one-minute chore (a goal already met when B hit its 70% cap) | should-fix (judgment) | Changed: B is always at least share + 5 points (up to 90%), still capped by 3 minutes of income; sim 88/88; the Act 3 Calendar Lock now costs about 2 minutes instead of 20 s |
| Helper names and the ticker clipped at 1280 | should-fix | Fixed (wrap) |
| Pausing during a finale didn't stop it | nice | Fixed: no pause during a finale |
| Answer cards had no 1 s guard; Enter skipped a disabled Begin; Cheer Spot timing tied to frame rate; silent letter catch; unreadable endings key had no toast; a slot with bad data threw | nice | All fixed |
| Legacy helpers finished the first job before the tap hint taught anything | nice | Fixed: the hint stays until the first tap |
| "1 lucky catches", lone "min" / "cookies)" / "Cheer" | nice | Fixed (plural, non-breaking spaces) |
| Act 2 early ending's "N% checked" vs the stage's "75% Nice" read as a contradiction | nice | Left: different things in different words |

## Polish pass, 2026-11-24

A fresh reviewer, every screen at 1280×800, 800×600, 390×844, 360×640, 844×390 and 667×375.

| Finding | Outcome |
|---|---|
| 800×600: the shop and job list had no room (nothing could be bought) | Fixed: landscape windows under 900 px use the side-column layout |
| Landscape phones: choice buttons below the fold on promotion/contact cards | Fixed: compact cards (smaller portrait, no unlock row); rescanned |
| Ending captions over the paintings' subjects | Fixed: captions in the bottom band over a darker scrim |
| Desktop progress label showed only a word or a number | Fixed: flex label "Rank N · Cheer x / y" (rank number hidden on narrow phones) |
| Job cards wrapped "· 8 Cheer"; mini bar underlined the text | Fixed: "x cookies, y Cheer" with non-breaking spaces; more padding |
| Lone "see." on wish lines; "NOEL- / run" | Fixed: balanced wrapping; non-breaking hyphens |
| Unlocks named two ways ("Unlocks at <title>" vs "Rank N") | Fixed: "Rank N: <title>" in the list and the rank number on the progress bar |
| Locked jobs showed "0000" | Fixed: a padlock |
| Low-contrast tagline | Fixed: stronger shadow |
| Answer cards didn't focus Continue (Enter/Space did nothing) | Fixed |
