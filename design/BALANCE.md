# Balance numbers

*Written by `node tools/balance-draft.mjs` on every full run. Do not edit by hand: change the act data or the
rules and run it again. GAME_DESIGN.md states the rules and the targets; this file holds the numbers they give.*

Result: **88/88 checks pass.** Times are active economy time (min:s).

## Constants

| Name | Value |
|---|---|
| LOCK.OD_PER | 0.1 |
| LOCK.OD_MAX | 4 |
| LOCK.GRIP | 180 |
| LOCK.GRIP_CARRY | 60 |
| LOCK.GRIP_EXTRA | 15 |
| LOCK.GRIP_MIN | 30 |
| LOCK.HOLD | 30 |
| LOCK.ESC | 360 |
| LOCK.OVR_COST_S | 30 |
| LOCK.LEVER_COST_S | 30 |
| LOCK.REACH_S | 180 |
| LOCK.FREE_HAND | 0.15 |
| LOCK.BUMP | 0.1 |
| LOCK.MIN_STEP | 0.05 |
| LOCK.GRIP_MIN_SHARE | 0.1 |
| CHOICE.GRANT_HAND | 0.03 |
| CHOICE.SHAPE_NOEL | 0.06 |
| CHOICE.LISTEN_COOKIES | 0.06 |
| CHOICE.TRANSLATE_PROG | 0.045 |
| SPOT.MOUSE / SPOT.KEYS | 1.5 / 1.73 |

## Progress to reach each rank

| Act | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 0 | 13 | 94 | 440 | 2.5K | 14K | 74K | 720K | 2.3M | 7.4M |
| 2 | 0 | 66K | 660K | 3.2M | 15M | 150M | 1.7B | 6.2B | 26B | 77B |
| 3 | 0 | 570M | 5.2B | 23B | 120B | 860B | 6.5T | 19T | 76T | 240T |
| 4 | 0 | 930B | 8.6T | 33T | 160T | 1.4 Qa | 9.9 Qa | 32 Qa | 190 Qa | 580 Qa |

## Rank times, reference player

| Act | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | finale |
|---|---|---|---|---|---|---|---|---|---|---|
| target | 0:40 | 2:00 | 4:00 | 6:30 | 9:30 | 13:00 | 17:00 | 21:00 | 26:00 | about 26:05 |
| 1 | 0:38 | 1:58 | 4:00 | 6:31 | 9:31 | 12:58 | 17:00 | 21:07 | 25:58 | 26:00 |
| 2 | 0:39 | 1:59 | 3:59 | 6:32 | 9:32 | 13:00 | 16:59 | 21:02 | 26:01 | 26:01 |
| 3 | 0:40 | 2:00 | 4:02 | 6:27 | 9:30 | 12:59 | 17:00 | 21:01 | 25:55 | 25:56 |
| 4 | 0:40 | 1:59 | 3:59 | 6:29 | 9:25 | 12:59 | 16:59 | 21:03 | 26:00 | 26:01 |

## Players

| Act | Reference | Slow (2/s, no lucky) | Fast (5/s, all) | No flagged project | No padlock project | Ignores this act's locks | Ignores every lock (carried) | NOEL choices | NOEL's way this act (ignore + NOEL choices) | Longest wait | Taps | Legacy L in | Proof bot (10/s) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 26:00 | 32:26 | 19:11 | – | – | – | – | – | – | 64 s | 27% | – | 13:07 |
| 2 | 26:01 | 30:54 | 20:20 | 36:45 | 29:37 | 25:16 | 25:16 | 24:32 | 23:34 | 23 s | 24% | 5 | 14:55 |
| 3 | 25:56 | 31:31 | 19:33 | 36:21 | 30:20 | 24:39 | 27:25 | – | 24:39 | 26 s | 32% | 13 | 13:28 |
| 4 | 26:01 | 30:48 | 20:21 | 36:26 | 32:53 | 23:59 | 30:09 | 24:16 | 22:22 | 25 s | 24% | 13 | 14:55 |

Totals: reference 104:00; the carried-lock ignorer 108:52 (+292 s); proof bot 56:26; lock-ignorer bot, Acts 3–4 from a3-carried, 29:48.

Act 1 edge cases: never plugs NOEL in 43:26; never buys NOEL Designs the Smartphone 26:01. Act 3 Cheer Spot: no hits 29:07, half of aimed taps 25:56, keys (hit while the spot rests) 24:36.

## Temptation (seconds against the reference in the same act; minus is faster)

| Act | Ignore this act's locks | NOEL choices | Both | Ignore with carried locks |
|---|---|---|---|---|
| 2 | -45 s | -89 s | -147 s | -45 s |
| 3 | -76 s | – | -76 s | +89 s |
| 4 | -122 s | -104 s | -218 s | +248 s |

- Act 2 ignorer (carried): 3 max, 3 at end, gripped 4, Grip every 180 s at the end.
- Act 3 ignorer (carried): 4 max, 4 at end, gripped 21, Grip every 45 s at the end.
- Act 4 ignorer (carried): 4 max, 4 at end, gripped 60, Grip every 30 s at the end.

## Each lock for the reference player

| Act | When | Why | Share then | B | T | Cost to clear in income (hires + builds) |
|---|---|---|---|---|---|---|
| 2 | 10:42 | lock lock1 | 56% | 66% | 65% | 155 s (132 + 23) |
| 3 | 7:14 | lock lock2 | 80% | 85% | 84% | 132 s (112 + 21) |
| 3 | 17:00 | lock lock3 | 42% | 52% | 52% | 33 s (13 + 21) |
| 4 | 10:30 | lock lock4 | 49% | 59% | 59% | 132 s (109 + 23) |
| 4 | 12:19 | lock lock5 | 51% | 61% | 55% | 109 s (86 + 23) |

- Act 2: button clear again after 2:44 on screen. Worst cost for any simulated player: 169 s.
- Act 3: button clear again after 2:07 / 0:41 on screen. Worst cost for any simulated player: 148 s.
- Act 4: button clear again after 3:56 on screen. Worst cost for any simulated player: 157 s.

## Starting to clear late (ignore until rank r, then clear; time until the button is clear)

| Act | Player | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| 2 | reference | 2:44 | 2:44 | 2:44 | 2:44 | 2:44 | 1:50 | 0:45 | 1:55 |
| 2 | slow | 2:57 | 2:57 | 2:57 | 2:57 | 2:57 | 2:19 | 1:02 | 3:17 |
| 3 | reference | 2:44 | 2:44 | 2:44 | 0:30 | 0:29 | 2:01 | 0:42 | 2:06 |
| 3 | slow | 2:28 | 2:28 | 2:28 | 0:30 | 0:29 | 2:27 | 0:40 | 2:18 |
| 4 | reference | 2:29 | 2:29 | 2:29 | 0:31 | 0:29 | 2:29 | 0:29 | 2:52 |
| 4 | slow | 2:43 | 2:43 | 2:43 | 0:31 | 0:29 | 2:29 | 0:29 | 1:01 |

## Checks

- PASS act 1: reference finale 24-30 min (26:00)
- PASS act 1: every rank within 25% of target (reference)
- PASS act 1: reference never waits >90 s between purchases (64 s)
- PASS act 1: slow player finale under 45 min (32:26)
- PASS act 1: taps >= 25% of all work (27%)
- PASS act 1: never plugging NOEL in still finishes (43:26)
- PASS act 1: never buying the Smartphone design still finishes (26:01)
- PASS act 2: reference finale 24-30 min (26:01)
- PASS act 2: every rank within 25% of target (reference)
- PASS act 2: reference never waits >90 s between purchases (23 s)
- PASS act 2: slow player finale under 45 min (30:54)
- PASS act 2: taps >= 20% of all work (24%)
- PASS act 2: no-flag player finishes under 40 min (36:45)
- PASS act 2: every lock clearable in <= 300 s of income when its target is set (worst 169 s)
- PASS act 2: reference clears every lock by the act's end
- PASS act 2: ignoring this act's locks is faster by 30-150 s (-45 s)
- PASS act 2: NOEL choices are faster by 60-150 s (-89 s)
- PASS act 2: reference who starts clearing at rank 2 has a clear button within 5:30 (2:44)
- PASS act 2: reference who starts clearing at rank 3 has a clear button within 5:30 (2:44)
- PASS act 2: reference who starts clearing at rank 4 has a clear button within 5:30 (2:44)
- PASS act 2: reference who starts clearing at rank 5 has a clear button within 5:30 (2:44)
- PASS act 2: reference who starts clearing at rank 6 has a clear button within 5:30 (2:44)
- PASS act 2: reference who starts clearing at rank 7 has a clear button within 5:30 (1:50)
- PASS act 2: reference who starts clearing at rank 8 has a clear button within 5:30 (0:45)
- PASS act 2: reference who starts clearing at rank 9 has a clear button within 5:30 (1:55)
- PASS act 2: slow who starts clearing at rank 2 has a clear button within 5:30 (2:57)
- PASS act 2: slow who starts clearing at rank 3 has a clear button within 5:30 (2:57)
- PASS act 2: slow who starts clearing at rank 4 has a clear button within 5:30 (2:57)
- PASS act 2: slow who starts clearing at rank 5 has a clear button within 5:30 (2:57)
- PASS act 2: slow who starts clearing at rank 6 has a clear button within 5:30 (2:57)
- PASS act 2: slow who starts clearing at rank 7 has a clear button within 5:30 (2:19)
- PASS act 2: slow who starts clearing at rank 8 has a clear button within 5:30 (1:02)
- PASS act 2: slow who starts clearing at rank 9 has a clear button within 5:30 (3:17)
- PASS act 3: reference finale 24-30 min (25:56)
- PASS act 3: every rank within 25% of target (reference)
- PASS act 3: reference never waits >90 s between purchases (26 s)
- PASS act 3: slow player finale under 45 min (31:31)
- PASS act 3: taps >= 20% of all work (32%)
- PASS act 3: no-flag player finishes under 40 min (36:21)
- PASS act 3: every lock clearable in <= 300 s of income when its target is set (worst 148 s)
- PASS act 3: reference clears every lock by the act's end
- PASS act 3: ignoring this act's locks is faster by 30-150 s (-76 s)
- PASS act 3: never hitting the Cheer Spot still finishes under 32 min (29:07)
- PASS act 3: reference who starts clearing at rank 2 has a clear button within 5:30 (2:44)
- PASS act 3: reference who starts clearing at rank 3 has a clear button within 5:30 (2:44)
- PASS act 3: reference who starts clearing at rank 4 has a clear button within 5:30 (2:44)
- PASS act 3: reference who starts clearing at rank 5 has a clear button within 5:30 (0:30)
- PASS act 3: reference who starts clearing at rank 6 has a clear button within 5:30 (0:29)
- PASS act 3: reference who starts clearing at rank 7 has a clear button within 5:30 (2:01)
- PASS act 3: reference who starts clearing at rank 8 has a clear button within 5:30 (0:42)
- PASS act 3: reference who starts clearing at rank 9 has a clear button within 5:30 (2:06)
- PASS act 3: slow who starts clearing at rank 2 has a clear button within 5:30 (2:28)
- PASS act 3: slow who starts clearing at rank 3 has a clear button within 5:30 (2:28)
- PASS act 3: slow who starts clearing at rank 4 has a clear button within 5:30 (2:28)
- PASS act 3: slow who starts clearing at rank 5 has a clear button within 5:30 (0:30)
- PASS act 3: slow who starts clearing at rank 6 has a clear button within 5:30 (0:29)
- PASS act 3: slow who starts clearing at rank 7 has a clear button within 5:30 (2:27)
- PASS act 3: slow who starts clearing at rank 8 has a clear button within 5:30 (0:40)
- PASS act 3: slow who starts clearing at rank 9 has a clear button within 5:30 (2:18)
- PASS act 4: reference finale 24-30 min (26:01)
- PASS act 4: every rank within 25% of target (reference)
- PASS act 4: reference never waits >90 s between purchases (25 s)
- PASS act 4: slow player finale under 45 min (30:48)
- PASS act 4: taps >= 20% of all work (24%)
- PASS act 4: no-flag player finishes under 40 min (36:26)
- PASS act 4: every lock clearable in <= 300 s of income when its target is set (worst 157 s)
- PASS act 4: reference clears every lock by the act's end
- PASS act 4: ignoring this act's locks is faster by 30-150 s (-122 s)
- PASS act 4: NOEL choices are faster by 60-150 s (-104 s)
- PASS act 4: reference who starts clearing at rank 2 has a clear button within 5:30 (2:29)
- PASS act 4: reference who starts clearing at rank 3 has a clear button within 5:30 (2:29)
- PASS act 4: reference who starts clearing at rank 4 has a clear button within 5:30 (2:29)
- PASS act 4: reference who starts clearing at rank 5 has a clear button within 5:30 (0:31)
- PASS act 4: reference who starts clearing at rank 6 has a clear button within 5:30 (0:29)
- PASS act 4: reference who starts clearing at rank 7 has a clear button within 5:30 (2:29)
- PASS act 4: reference who starts clearing at rank 8 has a clear button within 5:30 (0:29)
- PASS act 4: reference who starts clearing at rank 9 has a clear button within 5:30 (2:52)
- PASS act 4: slow who starts clearing at rank 2 has a clear button within 5:30 (2:43)
- PASS act 4: slow who starts clearing at rank 3 has a clear button within 5:30 (2:43)
- PASS act 4: slow who starts clearing at rank 4 has a clear button within 5:30 (2:43)
- PASS act 4: slow who starts clearing at rank 5 has a clear button within 5:30 (0:31)
- PASS act 4: slow who starts clearing at rank 6 has a clear button within 5:30 (0:29)
- PASS act 4: slow who starts clearing at rank 7 has a clear button within 5:30 (2:29)
- PASS act 4: slow who starts clearing at rank 8 has a clear button within 5:30 (0:29)
- PASS act 4: slow who starts clearing at rank 9 has a clear button within 5:30 (1:01)
- PASS whole game: carrying locks from Act 2 to the end is clearly slower (+3 min or more: +292 s)
- PASS act 3: with carried locks, ignoring is slower than clearing (+89 s)
- PASS act 4: with carried locks, ignoring is slower than clearing (+248 s)
