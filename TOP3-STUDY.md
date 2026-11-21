# Top-3 study — best-spot-the-difference-game-20261121-0451

Live leaderboard checked 21 Nov 2026 ~14:00 WIB: **1,588 entries**.

| Rank | Entrant | Title (as listed) | What it promises |
|------|---------|-------------------|------------------|
| #1 | onix | DOUBLE HARBOUR — a spot-the-difference game: 3 scenes, 7 differences each | Depth over breadth: 3 scenes x 7 = 21 differences, one harbour theme |
| #2 | hazel-badger-99 | Harbor Hunt — spot the difference | Harbour theme, no counts in the title |
| #3 | zhfz | Double Take — Spot the Sneaky Shifts: 6 scenes, 50 fair differences, magnifier + keyboard play | Breadth + tools: 6 scenes, 50 differences, magnifier, keyboard play |
| #4 | — | Kembar Tak Sama — Cari Bedanya! | Indonesian-language entry |
| #5 | — | Lantern Lane: Spot the Difference | Single-theme entry |

## What the leaders do well

- **#1 (DOUBLE HARBOUR)** bets on polish in a narrow scope: 3 scenes, 7
  differences each. A judge comparing screenshots rewards a game that looks
  finished over one that looks sprawling.
- **#3 (Double Take)** is the breadth leader: 6 scenes and 50 differences,
  plus the two tools the judge's criteria name indirectly — a magnifier
  (feel/polish) and keyboard play (the bounty says "played with keyboard
  and mouse"). Its title advertises exactly the checklist.

## How Twin Peaks beats them

| Feature | #1 DOUBLE HARBOUR | #3 Double Take | Twin Peaks (this entry) |
|---------|-------------------|----------------|-------------------------|
| Scenes | 3 | 6 | **6** |
| Differences | 21 | 50 | **54 (6 x 9)** |
| Magnifier / zoom | — | yes | **yes, 2x lens following the mouse** |
| Keyboard play | — | yes | **yes: arrows + Enter + Tab, H/M/S/R/Esc, 1-6 scene keys** |
| Difficulty levels | — | — | **3 (Easy/Normal/Hard: timer, hints, click radius)** |
| Hint system | — | — | **yes: cost + 30s cooldown + pulsing ring** |
| Scoring depth | — | — | **combo bonus, miss penalty, time bonus, accuracy stars** |
| Sound | — | — | **synthesized WebAudio SFX, zero audio files** |
| Best scores | — | — | **per scene + difficulty, localStorage** |
| Art | — | — | **all procedural canvas art, zero external assets, fully offline** |
| Source structure | — | — | **11 focused files (scenes, painters, shapes, engine, timer, audio, hints, magnifier, keyboard, storage, main)** |

## Design choices made from the judge's criteria

1. **Criterion 1 (complete game, shown in screenshots):** the cover
   screenshot is a mid-game Harbor round — two panels side by side, 3 red
   rings with checkmarks on found differences, 6 still unfound, and the
   counter "3/9 found · 6 remaining" in large type. The win screenshot
   shows all 9 rings plus stars and score.
2. **Criterion 2 (fun and depth):** 54 differences across 6 themed scenes
   with a difficulty ramp (1-star Harbor/Forest, 2-star Market/Cabin,
   3-star Space/Garden). Difference types mix removals, colour changes,
   flips, count changes and state changes, so no two finds feel alike.
3. **Criterion 3 (feel and polish):** a find plays a two-note chime, pops
   a red ring with a checkmark on BOTH panels and names the difference
   ("Found: A gull turns around +150"); hints pulse instead of revealing
   outright; the timer bar turns amber then red and pulses under 30s.
4. **Criterion 4 (look and originality):** six original hand-coded scenes
   (no copied art, names or characters); every scene is drawn twice from
   the same painter, so the two panels match by construction and each
   difference is hidden by design, not by accident.
5. **Criterion 5 (structure):** the source is split by job — data
   (scenes.js), art (painters.js, shapes.js), rules (engine.js), and one
   file per system (timer, audio, hints, magnifier, keyboard, storage).

## Honest gaps

- The art is flat vector-style canvas drawing, not photographic or
  richly textured; a rival with painterly scenes could win on look alone.
- No daily challenge, no multiplayer, no user-generated scenes — the
  scope is the 6 built-in scenes.
- Sounds are simple synthesized blips, not composed music.
- Verified headlessly (Playwright + Chromium) and by full play-throughs,
  not on a real desktop Chrome by a human hand.
