// Twin Peaks — Spot the Difference: the hand-in program (Node 22, stdlib only).
// The grader runs this twice in a fresh container with no network: /bot holds
// this repository read-only, /output is writable. Both runs must write the
// same bytes, so this does nothing but copy files and build the dossier —
// no timestamps, no randomness, no environment reads beyond the output dir.
//
// What it hands in:
//   game/         the playable game, plain static files
//   screenshots/  3 or 4 captures of the game running in a browser
//   dossier.json  the judge's view, built by the kit's own library
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outDir, { recursive: true });
cpSync(join(repoRoot, 'game'), join(outDir, 'game'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

// The gate's caps, as the kit states them: the dossier text holds at most
// 160 KiB of source, screenshots are at most 4 files of 256 KiB each, and
// game/ holds at most 993 files and directories totalling 48 MiB, with no
// path longer than 1,000 bytes.
writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
