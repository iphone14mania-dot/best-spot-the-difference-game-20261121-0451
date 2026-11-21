# best-spot-the-difference-game-20261121-0451

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/iphone14mania-dot/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/iphone14mania-dot/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

**Twin Peaks** — a complete spot-the-difference game that runs fully offline
in a desktop browser from its own files. Six hand-painted scenes (Harbor
Morning, Forest Camp, Night Market, Mountain Cabin, Space Station, Garden
Party), 9 fair differences each — 54 in total — drawn twice from the same
painter, so the two panels match by construction and every difference is
hidden by design. Three difficulty levels, a 2x magnifier lens, full
keyboard play, hints with a cost and cooldown, combo scoring, time bonus,
accuracy stars, synthesized sound effects (no audio files), and best scores
kept per scene. Every scene is original art, code and names; nothing is
loaded over the network.

## Run it

```sh
node serve.ts
# open http://localhost:8080 in desktop Chrome
```

Or serve `game/` with any static HTTP server and open `game/index.html`.
The hand-in program copies the game and its screenshots to the output
directory and writes the dossier:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## How it plays

- Click a difference on either picture: a red ring with a checkmark marks
  it on both panels, a chime plays, and the game names what you found.
- Keyboard: arrow keys move the crosshair, Enter clicks, Tab swaps
  pictures, H hints, M toggles the lens, S mutes, R restarts, Esc returns
  to the menu, 1–6 pick a scene.
- Scoring: +100 per find, +25 per combo step for quick finds in a row,
  −25 for a wrong click, −50 per hint, and a time bonus at the win.
- Difficulty: Easy has no timer and 5 hints; Normal gives 5 minutes and
  3 hints; Hard gives 3 minutes, 1 hint and smaller targets.

## Verification (measured locally, Node 24, Chromium headless)

- Full play-through of all 6 scenes: **54/54 differences found by
  clicking their real coordinates, 0 misses**, alternating left/right
  panels; every scene reaches its win screen with 3 stars.
- Miss, hint (cost + cooldown), magnifier lens, keyboard crosshair +
  Enter, restart, next-scene and menu flows all exercised; **0 console
  errors, 0 page errors, 0 network requests** outside localhost.
- `node main.ts` run twice produces byte-identical output (see the
  dossier check in the kit).

---

<sub>Entered on [make.fun](https://make.fun/?ref=fcek93em&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
