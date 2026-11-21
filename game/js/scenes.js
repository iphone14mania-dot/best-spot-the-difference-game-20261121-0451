// Scene catalogue for "Twin Peaks — Spot the Difference".
// One scene = one pair of near-identical pictures. Each difference is data:
// its kind (how the two versions differ), its canvas position and the radius
// a click must land inside. painters.js draws every difference from this
// table, so the art and the hit-test can never drift apart.
//
// Canvas: each panel is 560 x 520. 6 scenes x 9 differences = 54 differences.

export const PANEL_WIDTH = 560;
export const PANEL_HEIGHT = 520;

export const DIFFICULTIES = {
  easy:   { id: 'easy',   name: 'Easy',   timeLimitSec: 0,   hints: 5, clickScale: 1.15, blurb: 'No timer. Five hints. Take your time.' },
  normal: { id: 'normal', name: 'Normal', timeLimitSec: 300, hints: 3, clickScale: 1.0,  blurb: 'Five minutes on the clock. Three hints.' },
  hard:   { id: 'hard',   name: 'Hard',   timeLimitSec: 180, hints: 1, clickScale: 0.8,  blurb: 'Three minutes. One hint. Smaller targets.' },
};

// kind families (see painters.js drawDiff):
//   toggle  — the thing is there on the left, gone on the right
//   color   — the same shape, a different colour
//   flip    — the same shape, mirrored
//   count   — one fewer of a repeated thing on the right
//   state   — two distinct drawings (lit/dark, big/small, text A/B, ...)
// shape names the drawing; params carries per-difference options.

export const SCENES = [
  {
    id: 'harbor',
    name: 'Harbor Morning',
    tagline: 'Boats, gulls and a lighthouse waking up.',
    difficulty: 1,
    sky: ['#bfe3f2', '#e8f6fb'],
    diffs: [
      { id: 'h1', kind: 'flip',  shape: 'gull',     x: 120, y: 80,  r: 26, label: 'A gull turns around' },
      { id: 'h2', kind: 'color', shape: 'flag',     x: 455, y: 95,  r: 24, label: 'The lighthouse flag changes colour', params: { a: '#e5484d', b: '#3e7bfa' } },
      { id: 'h3', kind: 'state', shape: 'window',   x: 455, y: 175, r: 20, label: 'A lighthouse window goes dark' },
      { id: 'h4', kind: 'flip',  shape: 'fish',     x: 280, y: 390, r: 28, label: 'A fish jumps the other way' },
      { id: 'h5', kind: 'toggle', shape: 'crate',   x: 95,  y: 335, r: 26, label: 'A crate vanishes from the pier' },
      { id: 'h6', kind: 'toggle', shape: 'cloud',   x: 210, y: 55,  r: 30, label: 'A cloud drifts away' },
      { id: 'h7', kind: 'color', shape: 'sail',     x: 350, y: 290, r: 30, label: 'A sail changes colour', params: { a: '#fdfdf6', b: '#ffd23f' } },
      { id: 'h8', kind: 'toggle', shape: 'starfish', x: 500, y: 450, r: 22, label: 'A starfish disappears' },
      { id: 'h9', kind: 'color', shape: 'buoy',     x: 180, y: 440, r: 24, label: 'A buoy changes colour', params: { a: '#e5484d', b: '#ffd23f' } },
    ],
  },
  {
    id: 'forest',
    name: 'Forest Camp',
    tagline: 'A tent, a fire and the woods at dusk.',
    difficulty: 1,
    sky: ['#2b4a6f', '#7fa8c9'],
    diffs: [
      { id: 'f1', kind: 'color', shape: 'flag',     x: 285, y: 140, r: 22, label: 'The tent flag changes colour', params: { a: '#e5484d', b: '#3e7bfa' } },
      { id: 'f2', kind: 'state', shape: 'flame',    x: 285, y: 340, r: 28, label: 'The campfire burns lower' },
      { id: 'f3', kind: 'color', shape: 'mushroom', x: 85,  y: 430, r: 22, label: 'A mushroom changes colour', params: { a: '#e5484d', b: '#8b5cf6' } },
      { id: 'f4', kind: 'state', shape: 'lantern',  x: 405, y: 365, r: 24, label: 'A lantern goes out' },
      { id: 'f5', kind: 'toggle', shape: 'bird',    x: 450, y: 115, r: 24, label: 'A bird flies away' },
      { id: 'f6', kind: 'toggle', shape: 'star',    x: 150, y: 55,  r: 20, label: 'A star winks out' },
      { id: 'f7', kind: 'toggle', shape: 'backpack', x: 175, y: 385, r: 26, label: 'A backpack disappears' },
      { id: 'f8', kind: 'color', shape: 'flower',   x: 485, y: 440, r: 20, label: 'A flower changes colour', params: { a: '#e5484d', b: '#ffd23f' } },
      { id: 'f9', kind: 'state', shape: 'moon',     x: 490, y: 55,  r: 26, label: 'The moon changes phase' },
    ],
  },
  {
    id: 'market',
    name: 'Night Market',
    tagline: 'Lanterns, stalls and a cat on the prowl.',
    difficulty: 2,
    sky: ['#1b2340', '#3a2d5c'],
    diffs: [
      { id: 'n1', kind: 'state', shape: 'lantern',  x: 105, y: 145, r: 24, label: 'A lantern goes out' },
      { id: 'n2', kind: 'state', shape: 'sign',     x: 285, y: 125, r: 26, label: 'The stall sign changes', params: { a: 'RAMEN', b: 'UDON' } },
      { id: 'n3', kind: 'toggle', shape: 'cat',     x: 455, y: 405, r: 26, label: 'The market cat wanders off' },
      { id: 'n4', kind: 'count', shape: 'apples',   x: 125, y: 335, r: 24, label: 'An apple goes missing' },
      { id: 'n5', kind: 'count', shape: 'balloons', x: 505, y: 155, r: 28, label: 'A balloon floats away' },
      { id: 'n6', kind: 'state', shape: 'bulb',     x: 305, y: 55,  r: 18, label: 'A string bulb goes dark' },
      { id: 'n7', kind: 'color', shape: 'umbrella', x: 205, y: 225, r: 28, label: 'An umbrella changes colour', params: { a: '#e5484d', b: '#2fbf71' } },
      { id: 'n8', kind: 'toggle', shape: 'fish',    x: 385, y: 325, r: 24, label: 'A fish leaves the stall' },
      { id: 'n9', kind: 'toggle', shape: 'star',    x: 55,  y: 55,  r: 20, label: 'A star winks out' },
    ],
  },
  {
    id: 'cabin',
    name: 'Mountain Cabin',
    tagline: 'Snow, pines and smoke from the chimney.',
    difficulty: 2,
    sky: ['#a8c8e0', '#eaf4fb'],
    diffs: [
      { id: 'm1', kind: 'toggle', shape: 'smoke',    x: 195, y: 115, r: 26, label: 'The chimney smoke stops' },
      { id: 'm2', kind: 'state', shape: 'window',   x: 185, y: 255, r: 22, label: 'A cabin window goes dark' },
      { id: 'm3', kind: 'color', shape: 'scarf',    x: 425, y: 365, r: 24, label: "The snowman's scarf changes colour", params: { a: '#e5484d', b: '#3e7bfa' } },
      { id: 'm4', kind: 'state', shape: 'skis',     x: 325, y: 385, r: 26, label: 'The skis cross over' },
      { id: 'm5', kind: 'count', shape: 'pine',     x: 90,  y: 205, r: 28, label: 'A pine loses a tier' },
      { id: 'm6', kind: 'toggle', shape: 'bird',    x: 480, y: 95,  r: 22, label: 'A bird flies away' },
      { id: 'm7', kind: 'toggle', shape: 'wreath',  x: 215, y: 305, r: 20, label: 'The wreath comes down' },
      { id: 'm8', kind: 'toggle', shape: 'rock',    x: 75,  y: 435, r: 24, label: 'A rock disappears' },
      { id: 'm9', kind: 'toggle', shape: 'star',    x: 520, y: 45,  r: 20, label: 'A star winks out' },
    ],
  },
  {
    id: 'space',
    name: 'Space Station',
    tagline: 'Orbit, planets and one very calm astronaut.',
    difficulty: 3,
    sky: ['#0b1026', '#1c2b52'],
    diffs: [
      { id: 's1', kind: 'state', shape: 'ring',     x: 430, y: 410, r: 30, label: 'The planet loses its ring' },
      { id: 's2', kind: 'color', shape: 'visor',    x: 300, y: 205, r: 22, label: 'The visor changes colour', params: { a: '#ffd23f', b: '#4cc9f0' } },
      { id: 's3', kind: 'state', shape: 'dish',     x: 150, y: 150, r: 26, label: 'The dish turns around' },
      { id: 's4', kind: 'count', shape: 'panel',    x: 200, y: 285, r: 28, label: 'A solar cell goes missing' },
      { id: 's5', kind: 'toggle', shape: 'star',    x: 80,  y: 60,  r: 20, label: 'A star winks out' },
      { id: 's6', kind: 'color', shape: 'antenna',  x: 355, y: 115, r: 18, label: 'The antenna light changes colour', params: { a: '#e5484d', b: '#2fbf71' } },
      { id: 's7', kind: 'toggle', shape: 'crate',   x: 455, y: 305, r: 24, label: 'A cargo crate disappears' },
      { id: 's8', kind: 'state', shape: 'earth',    x: 285, y: 305, r: 22, label: 'Earth vanishes from the window' },
      { id: 's9', kind: 'toggle', shape: 'comet',   x: 505, y: 75,  r: 26, label: 'A comet fades away' },
    ],
  },
  {
    id: 'garden',
    name: 'Garden Party',
    tagline: 'Cake, balloons and a dog with plans.',
    difficulty: 3,
    sky: ['#8ec9ee', '#d9f2ff'],
    diffs: [
      { id: 'g1', kind: 'count', shape: 'candles',  x: 285, y: 295, r: 24, label: 'A candle goes out' },
      { id: 'g2', kind: 'color', shape: 'balloon',  x: 120, y: 120, r: 26, label: 'A balloon changes colour', params: { a: '#e5484d', b: '#3e7bfa' } },
      { id: 'g3', kind: 'toggle', shape: 'dog',     x: 455, y: 425, r: 28, label: 'The dog runs off' },
      { id: 'g4', kind: 'color', shape: 'bunting',  x: 305, y: 75,  r: 20, label: 'A bunting flag changes colour', params: { a: '#ffd23f', b: '#2fbf71' } },
      { id: 'g5', kind: 'toggle', shape: 'steam',   x: 205, y: 280, r: 22, label: 'The teapot stops steaming' },
      { id: 'g6', kind: 'color', shape: 'flower',   x: 80,  y: 455, r: 20, label: 'A flower changes colour', params: { a: '#e5484d', b: '#8b5cf6' } },
      { id: 'g7', kind: 'toggle', shape: 'butterfly', x: 485, y: 185, r: 22, label: 'A butterfly flutters away' },
      { id: 'g8', kind: 'state', shape: 'book',     x: 355, y: 325, r: 22, label: 'A book closes' },
      { id: 'g9', kind: 'state', shape: 'sunrays',  x: 505, y: 55,  r: 26, label: 'The sun loses its rays' },
    ],
  },
];

export function sceneById(id) {
  return SCENES.find((s) => s.id === id) || SCENES[0];
}

export function totalDifferences() {
  return SCENES.reduce((n, s) => n + s.diffs.length, 0);
}
