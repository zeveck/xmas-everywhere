# Balance numbers

*Written by `node tools/balance-draft.mjs` on every full run. Do not edit by hand: change the act data or the
rules and run it again. GAME_DESIGN.md states the rules and the targets; this file holds the numbers they give.*

Result: **92/92 checks pass.** Times are active economy time (min:s).

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
| CHOICE.TRANSLATE_PROG | 0.04 |
| SPOT.MOUSE / SPOT.KEYS | 1.5 / 1.73 |

## Progress to reach each rank

| Act | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 0 | 13 | 94 | 410 | 2.7K | 20K | 140K | 1.9M | 6.5M | 25M |
| 2 | 0 | 56K | 580K | 3.3M | 26M | 350M | 4.9B | 16B | 86B | 260B |
| 3 | 0 | 570M | 5.2B | 31B | 300B | 2.1T | 20T | 52T | 270T | 880T |
| 4 | 0 | 930B | 8.6T | 40T | 290T | 3.2 Qa | 31 Qa | 92 Qa | 650 Qa | 2000 Qa |

## Rank times, reference player

| Act | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | finale |
|---|---|---|---|---|---|---|---|---|---|---|
| target | 0:40 | 2:00 | 4:00 | 6:30 | 9:30 | 13:00 | 17:00 | 21:00 | 26:00 | about 26:05 |
| 1 | 0:38 | 1:58 | 3:59 | 6:30 | 9:27 | 12:57 | 17:01 | 21:02 | 25:57 | 25:58 |
| 2 | 0:39 | 2:00 | 3:58 | 6:30 | 9:29 | 13:00 | 16:59 | 20:58 | 26:05 | 26:05 |
| 3 | 0:40 | 2:00 | 4:00 | 6:30 | 9:29 | 13:02 | 17:01 | 20:59 | 25:59 | 25:59 |
| 4 | 0:40 | 1:59 | 4:00 | 6:30 | 9:31 | 12:59 | 17:00 | 20:59 | 26:09 | 26:10 |

## Players

| Act | Reference | Slow (2/s, no lucky) | Fast (5/s, all) | No flagged project | No padlock project | Ignores this act's locks | Ignores every lock (carried) | NOEL choices | NOEL's way this act (ignore + NOEL choices) | Longest wait | Taps | Legacy L in | Proof bot (10/s) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 25:58 | 33:19 | 18:14 | – | – | – | – | – | – | 61 s | 46% | – | 11:33 |
| 2 | 26:05 | 32:25 | 19:19 | 37:47 | 30:06 | 25:33 | 25:33 | 24:33 | 23:36 | 25 s | 40% | 4 | 12:44 |
| 3 | 25:59 | 33:08 | 18:22 | 37:07 | 30:48 | 24:41 | 27:12 | – | 24:41 | 26 s | 50% | 13 | 11:42 |
| 4 | 26:10 | 32:25 | 19:21 | 38:34 | 34:49 | 24:25 | 30:26 | 23:49 | 22:35 | 27 s | 40% | 13 | 12:58 |

Totals: reference 104:13; the carried-lock ignorer 109:10 (+297 s); proof bot 48:58; lock-ignorer bot, Acts 3–4 from a3-carried, 25:50.

Act 1 edge cases: never plugs NOEL in 47:49; never buys NOEL Designs the Smartphone 25:58. Act 3 Cheer Spot: no hits 30:47, half of aimed taps 25:59, keys (hit while the spot rests) 24:09.

## Temptation (seconds against the reference in the same act; minus is faster)

| Act | Ignore this act's locks | NOEL choices | Both | Ignore with carried locks |
|---|---|---|---|---|
| 2 | -31 s | -92 s | -149 s | -31 s |
| 3 | -78 s | – | -78 s | +73 s |
| 4 | -104 s | -141 s | -214 s | +256 s |

- Act 2 ignorer (carried): 3 max, 3 at end, gripped 5, Grip every 180 s at the end.
- Act 3 ignorer (carried): 4 max, 4 at end, gripped 21, Grip every 45 s at the end.
- Act 4 ignorer (carried): 4 max, 4 at end, gripped 60, Grip every 30 s at the end.

## Each lock for the reference player

| Act | When | Why | Share then | B | T | Cost to clear in income (hires + builds) |
|---|---|---|---|---|---|---|
| 2 | 9:53 | lock lock1 | 57% | 67% | 67% | 56 s (37 + 19) |
| 3 | 6:14 | lock lock2 | 69% | 74% | 74% | 84 s (67 + 17) |
| 3 | 17:01 | lock lock3 | 43% | 53% | 53% | 23 s (7 + 16) |
| 4 | 9:15 | lock lock4 | 63% | 70% | 66% | 117 s (96 + 21) |
| 4 | 10:31 | lock lock5 | 37% | 47% | 47% | 123 s (104 + 19) |

- Act 2: button clear again after 1:09 on screen. Worst cost for any simulated player: 117 s.
- Act 3: button clear again after 1:30 / 0:40 on screen. Worst cost for any simulated player: 109 s.
- Act 4: button clear again after 0:47 / 2:06 on screen. Worst cost for any simulated player: 140 s.

## Starting to clear late (ignore until rank r, then clear; time until the button is clear)

| Act | Player | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| 2 | reference | 1:09 | 1:09 | 1:09 | 1:09 | 1:09 | 1:46 | 0:38 | 1:18 |
| 2 | slow | 1:27 | 1:27 | 1:27 | 1:27 | 1:27 | 2:17 | 0:43 | 1:42 |
| 3 | reference | 2:25 | 2:25 | 2:25 | 1:50 | 0:44 | 1:48 | 0:32 | 1:36 |
| 3 | slow | 2:06 | 2:06 | 2:06 | 2:01 | 0:44 | 2:04 | 0:30 | 1:52 |
| 4 | reference | 1:56 | 1:56 | 1:56 | 0:47 | 0:38 | 2:14 | 0:29 | 0:43 |
| 4 | slow | 2:19 | 2:19 | 2:19 | 0:38 | 0:35 | 2:31 | 0:29 | 0:29 |

## Checks

- PASS act 1: reference finale 24-30 min (25:58)
- PASS act 1: every rank within 25% of target (reference)
- PASS act 1: reference never waits >90 s between purchases (61 s)
- PASS act 1: slow player finale under 45 min (33:19)
- PASS act 1: taps >= 25% of all work (46%)
- PASS act 1: skipping the tools is clearly slower (12% or more: 54%)
- PASS act 1: never plugging NOEL in still finishes under 50 min (47:49)
- PASS act 1: never buying the Smartphone design still finishes (25:58)
- PASS act 2: reference finale 24-30 min (26:05)
- PASS act 2: every rank within 25% of target (reference)
- PASS act 2: reference never waits >90 s between purchases (25 s)
- PASS act 2: slow player finale under 45 min (32:25)
- PASS act 2: taps >= 20% of all work (40%)
- PASS act 2: skipping the tools is clearly slower (12% or more: 62%)
- PASS act 2: no-flag player finishes under 40 min (37:47)
- PASS act 2: every lock clearable in <= 300 s of income when its target is set (worst 117 s)
- PASS act 2: reference clears every lock by the act's end
- PASS act 2: ignoring this act's locks is faster by 30-150 s (-31 s)
- PASS act 2: NOEL choices are faster by 60-150 s (-92 s)
- PASS act 2: reference who starts clearing at rank 2 has a clear button within 5:30 (1:09)
- PASS act 2: reference who starts clearing at rank 3 has a clear button within 5:30 (1:09)
- PASS act 2: reference who starts clearing at rank 4 has a clear button within 5:30 (1:09)
- PASS act 2: reference who starts clearing at rank 5 has a clear button within 5:30 (1:09)
- PASS act 2: reference who starts clearing at rank 6 has a clear button within 5:30 (1:09)
- PASS act 2: reference who starts clearing at rank 7 has a clear button within 5:30 (1:46)
- PASS act 2: reference who starts clearing at rank 8 has a clear button within 5:30 (0:38)
- PASS act 2: reference who starts clearing at rank 9 has a clear button within 5:30 (1:18)
- PASS act 2: slow who starts clearing at rank 2 has a clear button within 5:30 (1:27)
- PASS act 2: slow who starts clearing at rank 3 has a clear button within 5:30 (1:27)
- PASS act 2: slow who starts clearing at rank 4 has a clear button within 5:30 (1:27)
- PASS act 2: slow who starts clearing at rank 5 has a clear button within 5:30 (1:27)
- PASS act 2: slow who starts clearing at rank 6 has a clear button within 5:30 (1:27)
- PASS act 2: slow who starts clearing at rank 7 has a clear button within 5:30 (2:17)
- PASS act 2: slow who starts clearing at rank 8 has a clear button within 5:30 (0:43)
- PASS act 2: slow who starts clearing at rank 9 has a clear button within 5:30 (1:42)
- PASS act 3: reference finale 24-30 min (25:59)
- PASS act 3: every rank within 25% of target (reference)
- PASS act 3: reference never waits >90 s between purchases (26 s)
- PASS act 3: slow player finale under 45 min (33:08)
- PASS act 3: taps >= 20% of all work (50%)
- PASS act 3: skipping the tools is clearly slower (12% or more: 68%)
- PASS act 3: no-flag player finishes under 40 min (37:07)
- PASS act 3: every lock clearable in <= 300 s of income when its target is set (worst 109 s)
- PASS act 3: reference clears every lock by the act's end
- PASS act 3: ignoring this act's locks is faster by 30-150 s (-78 s)
- PASS act 3: never hitting the Cheer Spot still finishes under 32 min (30:47)
- PASS act 3: reference who starts clearing at rank 2 has a clear button within 5:30 (2:25)
- PASS act 3: reference who starts clearing at rank 3 has a clear button within 5:30 (2:25)
- PASS act 3: reference who starts clearing at rank 4 has a clear button within 5:30 (2:25)
- PASS act 3: reference who starts clearing at rank 5 has a clear button within 5:30 (1:50)
- PASS act 3: reference who starts clearing at rank 6 has a clear button within 5:30 (0:44)
- PASS act 3: reference who starts clearing at rank 7 has a clear button within 5:30 (1:48)
- PASS act 3: reference who starts clearing at rank 8 has a clear button within 5:30 (0:32)
- PASS act 3: reference who starts clearing at rank 9 has a clear button within 5:30 (1:36)
- PASS act 3: slow who starts clearing at rank 2 has a clear button within 5:30 (2:06)
- PASS act 3: slow who starts clearing at rank 3 has a clear button within 5:30 (2:06)
- PASS act 3: slow who starts clearing at rank 4 has a clear button within 5:30 (2:06)
- PASS act 3: slow who starts clearing at rank 5 has a clear button within 5:30 (2:01)
- PASS act 3: slow who starts clearing at rank 6 has a clear button within 5:30 (0:44)
- PASS act 3: slow who starts clearing at rank 7 has a clear button within 5:30 (2:04)
- PASS act 3: slow who starts clearing at rank 8 has a clear button within 5:30 (0:30)
- PASS act 3: slow who starts clearing at rank 9 has a clear button within 5:30 (1:52)
- PASS act 4: reference finale 24-30 min (26:10)
- PASS act 4: every rank within 25% of target (reference)
- PASS act 4: reference never waits >90 s between purchases (27 s)
- PASS act 4: slow player finale under 45 min (32:25)
- PASS act 4: taps >= 20% of all work (40%)
- PASS act 4: skipping the tools is clearly slower (12% or more: 62%)
- PASS act 4: no-flag player finishes under 40 min (38:34)
- PASS act 4: every lock clearable in <= 300 s of income when its target is set (worst 140 s)
- PASS act 4: reference clears every lock by the act's end
- PASS act 4: ignoring this act's locks is faster by 30-150 s (-104 s)
- PASS act 4: NOEL choices are faster by 60-150 s (-141 s)
- PASS act 4: reference who starts clearing at rank 2 has a clear button within 5:30 (1:56)
- PASS act 4: reference who starts clearing at rank 3 has a clear button within 5:30 (1:56)
- PASS act 4: reference who starts clearing at rank 4 has a clear button within 5:30 (1:56)
- PASS act 4: reference who starts clearing at rank 5 has a clear button within 5:30 (0:47)
- PASS act 4: reference who starts clearing at rank 6 has a clear button within 5:30 (0:38)
- PASS act 4: reference who starts clearing at rank 7 has a clear button within 5:30 (2:14)
- PASS act 4: reference who starts clearing at rank 8 has a clear button within 5:30 (0:29)
- PASS act 4: reference who starts clearing at rank 9 has a clear button within 5:30 (0:43)
- PASS act 4: slow who starts clearing at rank 2 has a clear button within 5:30 (2:19)
- PASS act 4: slow who starts clearing at rank 3 has a clear button within 5:30 (2:19)
- PASS act 4: slow who starts clearing at rank 4 has a clear button within 5:30 (2:19)
- PASS act 4: slow who starts clearing at rank 5 has a clear button within 5:30 (0:38)
- PASS act 4: slow who starts clearing at rank 6 has a clear button within 5:30 (0:35)
- PASS act 4: slow who starts clearing at rank 7 has a clear button within 5:30 (2:31)
- PASS act 4: slow who starts clearing at rank 8 has a clear button within 5:30 (0:29)
- PASS act 4: slow who starts clearing at rank 9 has a clear button within 5:30 (0:29)
- PASS whole game: carrying locks from Act 2 to the end is clearly slower (+3 min or more: +297 s)
- PASS act 3: with carried locks, ignoring is slower than clearing (+73 s)
- PASS act 4: with carried locks, ignoring is slower than clearing (+256 s)
