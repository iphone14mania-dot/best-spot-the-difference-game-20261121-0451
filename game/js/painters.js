// Scene painters for "Twin Peaks — Spot the Difference".
// Every scene is drawn twice from the same code: variant 0 is the left panel
// (the original), variant 1 is the right panel (with the differences applied).
// paintBase draws everything the two panels share; drawDiff draws one
// difference in its original or changed form, at the coordinates scenes.js
// gives it — so the art and the hit-test always agree.
//
// No randomness anywhere: the same scene paints the same pixels every time.

import { PANEL_WIDTH, PANEL_HEIGHT } from './scenes.js';
import * as S from './shapes.js';

export function paintPanel(ctx, scene, variant, foundIds) {
  paintSky(ctx, scene.sky);
  paintBase(ctx, scene.id);
  for (const d of scene.diffs) drawDiff(ctx, d, variant);
  for (const id of foundIds) {
    const d = scene.diffs.find((x) => x.id === id);
    if (d) drawFoundRing(ctx, d.x, d.y, d.r);
  }
}

function paintSky(ctx, colors) {
  const g = ctx.createLinearGradient(0, 0, 0, PANEL_HEIGHT);
  g.addColorStop(0, colors[0]);
  g.addColorStop(1, colors[1]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT);
}

// The satisfying mark: a bold red ring with a soft glow, drawn on both
// panels at the found difference.
export function drawFoundRing(ctx, x, y, r) {
  ctx.save();
  ctx.strokeStyle = 'rgba(229, 72, 77, 0.35)';
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.arc(x, y, r + 7, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#e5484d';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, r + 7, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#e5484d';
  ctx.beginPath();
  ctx.arc(x + (r + 7) * 0.7, y - (r + 7) * 0.7, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  const cx = x + (r + 7) * 0.7;
  const cy = y - (r + 7) * 0.7;
  ctx.moveTo(cx - 3.5, cy);
  ctx.lineTo(cx - 1, cy + 3);
  ctx.lineTo(cx + 4, cy - 3);
  ctx.stroke();
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Base scenes: everything both panels share.
// ---------------------------------------------------------------------------

function paintBase(ctx, id) {
  if (id === 'harbor') harborBase(ctx);
  else if (id === 'forest') forestBase(ctx);
  else if (id === 'market') marketBase(ctx);
  else if (id === 'cabin') cabinBase(ctx);
  else if (id === 'space') spaceBase(ctx);
  else if (id === 'garden') gardenBase(ctx);
}

function harborBase(ctx) {
  // Distant hills, sea, sun.
  S.ellipse(ctx, 120, 320, 180, 55, '#8fb8a8');
  S.ellipse(ctx, 420, 325, 200, 60, '#7fa898');
  S.circle(ctx, 480, 60, 26, '#ffd23f');
  S.rect(ctx, 0, 300, PANEL_WIDTH, 220, '#3d8ab5');
  S.waves(ctx, 340, PANEL_WIDTH, 'rgba(255,255,255,0.35)');
  S.waves(ctx, 400, PANEL_WIDTH, 'rgba(255,255,255,0.25)');
  S.waves(ctx, 470, PANEL_WIDTH, 'rgba(255,255,255,0.2)');
  // Static clouds and gulls.
  S.cloud(ctx, 80, 50, 16, 'rgba(255,255,255,0.9)');
  S.cloud(ctx, 400, 40, 13, 'rgba(255,255,255,0.85)');
  S.gull(ctx, 300, 70, 14, 1, '#33505e');
  S.gull(ctx, 420, 130, 11, -1, '#33505e');
  // Wooden pier from the left edge.
  S.rect(ctx, 0, 320, 190, 14, '#8a5a33');
  for (let x = 10; x < 190; x += 28) S.rect(ctx, x, 334, 8, 26, '#6e4525');
  // A small static boat.
  S.ellipse(ctx, 200, 335, 34, 12, '#7a4a21');
  S.triangle(ctx, 200, 335, 200, 285, 232, 335, '#fdfdf6');
  S.rect(ctx, 198, 282, 4, 54, '#5d463c');
  // The boat whose sail is a difference: hull only here.
  S.ellipse(ctx, 350, 318, 40, 13, '#7a4a21');
  S.rect(ctx, 348, 258, 4, 60, '#5d463c');
  // Lighthouse on the rocks, right side.
  S.ellipse(ctx, 455, 360, 70, 45, '#8d8578');
  S.ellipse(ctx, 505, 380, 45, 30, '#7a7264');
  S.rect(ctx, 437, 150, 36, 190, '#f2ead8');
  S.rect(ctx, 437, 210, 36, 22, '#e5484d');
  S.rect(ctx, 437, 280, 36, 22, '#e5484d');
  S.triangle(ctx, 430, 150, 480, 150, 455, 118, '#37474f');
  S.rect(ctx, 452, 96, 6, 24, '#37474f');
  S.circle(ctx, 455, 140, 10, '#ffe9a8');
}

function forestBase(ctx) {
  // Mountains and meadow.
  S.triangle(ctx, 0, 260, 140, 120, 280, 260, '#5b7a99');
  S.triangle(ctx, 200, 260, 340, 100, 480, 260, '#4a6a88');
  S.triangle(ctx, 400, 260, 500, 150, 560, 260, '#5b7a99');
  S.rect(ctx, 0, 360, PANEL_WIDTH, 160, '#4c8a4f');
  S.ellipse(ctx, 120, 400, 130, 26, '#5da35f');
  S.ellipse(ctx, 430, 430, 150, 30, '#5da35f');
  // Trees left and right; a branch reaches toward the bird's spot.
  S.pine(ctx, 60, 300, 150, 3, '#2e6b34');
  S.pine(ctx, 110, 330, 110, 3, '#357a3b');
  S.blobTree(ctx, 505, 260, 55, '#2e6b34');
  ctx.strokeStyle = '#6b4a2f';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(480, 150);
  ctx.lineTo(430, 125);
  ctx.stroke();
  // The tent: peak at (285, 150), base at y 300.
  S.triangle(ctx, 195, 300, 375, 300, 285, 150, '#e8843c');
  S.triangle(ctx, 255, 300, 315, 300, 285, 215, '#7a3b12');
  S.triangle(ctx, 285, 150, 375, 300, 330, 300, '#d9732f');
  S.rect(ctx, 283, 118, 4, 34, '#5d463c');
  // Campfire ring: stones and logs; the flame is a difference.
  S.circle(ctx, 255, 360, 9, '#8d8578');
  S.circle(ctx, 315, 360, 9, '#8d8578');
  S.circle(ctx, 270, 372, 8, '#8d8578');
  S.circle(ctx, 300, 372, 8, '#8d8578');
  ctx.save();
  ctx.translate(285, 362);
  ctx.rotate(0.5);
  S.rect(ctx, -22, -4, 44, 8, '#6b4a2f');
  ctx.rotate(-1.0);
  S.rect(ctx, -22, -4, 44, 8, '#7d5a38');
  ctx.restore();
  // A log for the lantern.
  S.ellipse(ctx, 405, 378, 42, 14, '#7d5a38');
  S.ellipse(ctx, 405, 374, 42, 12, '#a07a4e');
  // Static stars and grass tufts.
  S.star(ctx, 60, 60, 7, '#fff8d6');
  S.star(ctx, 330, 45, 6, '#fff8d6');
  S.star(ctx, 420, 80, 5, '#fff8d6');
  for (const gx of [40, 150, 250, 350, 470, 530]) {
    ctx.strokeStyle = '#3c7a40';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(gx, 500);
    ctx.lineTo(gx - 4, 484);
    ctx.moveTo(gx + 6, 500);
    ctx.lineTo(gx + 10, 486);
    ctx.stroke();
  }
}

function marketBase(ctx) {
  // String lights across the top; one bulb is a difference.
  ctx.strokeStyle = '#0d1226';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 40);
  ctx.quadraticCurveTo(280, 75, 560, 40);
  ctx.stroke();
  const bulbXs = [60, 120, 180, 240, 360, 420, 480, 530];
  for (const bx of bulbXs) {
    const by = 40 + Math.sin((bx / 560) * Math.PI) * 22 + 8;
    S.circle(ctx, bx, by, 6, '#ffd23f');
  }
  // Ground.
  S.rect(ctx, 0, 400, PANEL_WIDTH, 120, '#3d3350');
  S.rect(ctx, 0, 400, PANEL_WIDTH, 6, '#2c2440');
  // Left stall: fruit.
  S.rect(ctx, 40, 180, 160, 12, '#8a5a33');
  S.rect(ctx, 48, 192, 10, 150, '#6e4525');
  S.rect(ctx, 182, 192, 10, 150, '#6e4525');
  S.rect(ctx, 40, 330, 160, 70, '#5d463c');
  S.rect(ctx, 40, 330, 160, 10, '#7d5a38');
  // Center stall: noodles, with a blank sign board (text is a difference).
  S.rect(ctx, 220, 180, 140, 12, '#8a5a33');
  S.rect(ctx, 228, 192, 10, 150, '#6e4525');
  S.rect(ctx, 342, 192, 10, 150, '#6e4525');
  S.rect(ctx, 220, 330, 140, 70, '#5d463c');
  S.rect(ctx, 220, 330, 140, 10, '#7d5a38');
  S.rect(ctx, 245, 105, 80, 36, '#f2ead8');
  S.rect(ctx, 245, 105, 80, 36, 'rgba(0,0,0,0)');
  ctx.strokeStyle = '#5d463c';
  ctx.lineWidth = 3;
  ctx.strokeRect(245, 105, 80, 36);
  // Right stall: toys.
  S.rect(ctx, 380, 180, 140, 12, '#8a5a33');
  S.rect(ctx, 388, 192, 10, 150, '#6e4525');
  S.rect(ctx, 502, 192, 10, 150, '#6e4525');
  S.rect(ctx, 380, 330, 140, 70, '#5d463c');
  S.rect(ctx, 380, 330, 140, 10, '#7d5a38');
  // Crates and pots dressing the stalls.
  S.crate(ctx, 470, 380, 30);
  S.ellipse(ctx, 290, 345, 26, 10, '#37474f');
  S.ellipse(ctx, 290, 340, 26, 8, '#ffd23f');
  // Static stars.
  S.star(ctx, 200, 40, 6, '#fff8d6');
  S.star(ctx, 420, 30, 5, '#fff8d6');
}

function cabinBase(ctx) {
  // Mountains and snow.
  S.triangle(ctx, 0, 280, 130, 130, 260, 280, '#7d9db5');
  S.triangle(ctx, 220, 280, 360, 110, 500, 280, '#6b8ca6');
  S.triangle(ctx, 420, 280, 520, 160, 560, 280, '#7d9db5');
  S.rect(ctx, 0, 380, PANEL_WIDTH, 140, '#f4f9fd');
  S.ellipse(ctx, 150, 420, 140, 24, '#e3eef7');
  S.ellipse(ctx, 420, 450, 160, 26, '#e3eef7');
  // The cabin: walls x 120-280, roof peak (200, 190).
  S.rect(ctx, 120, 230, 160, 140, '#8a5a33');
  S.triangle(ctx, 105, 232, 295, 232, 200, 178, '#a03d2d');
  S.rect(ctx, 100, 226, 200, 10, '#7d2f22');
  S.rect(ctx, 185, 190, 22, 46, '#6e6e6e');
  S.rect(ctx, 182, 186, 28, 8, '#555');
  // Door with a knob; the wreath is a difference.
  S.rect(ctx, 195, 290, 42, 80, '#5d3a1e');
  S.circle(ctx, 230, 330, 3, '#ffd23f');
  // Window frames: the glass is a difference.
  ctx.strokeStyle = '#f2ead8';
  ctx.lineWidth = 5;
  ctx.strokeRect(168, 240, 34, 30);
  ctx.strokeRect(238, 240, 34, 30);
  // Pines around the cabin; one is a difference.
  S.pine(ctx, 330, 330, 90, 3, '#2e6b34');
  S.pine(ctx, 510, 300, 120, 3, '#2e6b34');
  S.pine(ctx, 40, 330, 80, 3, '#357a3b');
  // The snowman: body only; the scarf is a difference.
  S.circle(ctx, 425, 420, 42, '#ffffff');
  S.circle(ctx, 425, 360, 32, '#ffffff');
  S.circle(ctx, 425, 312, 22, '#ffffff');
  S.circle(ctx, 417, 306, 3, '#10202e');
  S.circle(ctx, 433, 306, 3, '#10202e');
  S.triangle(ctx, 425, 314, 425, 320, 445, 316, '#e8843c');
  ctx.strokeStyle = '#6b4a2f';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(395, 355);
  ctx.lineTo(365, 330);
  ctx.moveTo(455, 355);
  ctx.lineTo(485, 330);
  ctx.stroke();
  // Fence posts on the right.
  for (const fx of [300, 340, 380]) {
    S.rect(ctx, fx, 400, 8, 40, '#8a5a33');
  }
  S.rect(ctx, 295, 408, 95, 6, '#8a5a33');
  // Static snowflakes.
  for (const [sx, sy] of [[60, 60], [300, 50], [470, 150], [150, 90], [380, 200]]) {
    S.star(ctx, sx, sy, 5, 'rgba(255,255,255,0.9)');
  }
}

function spaceBase(ctx) {
  // Fixed star field (no randomness: same stars every paint).
  const stars = [
    [40, 120, 4], [110, 200, 3], [200, 90, 5], [260, 40, 3], [330, 170, 4],
    [390, 60, 3], [450, 140, 5], [520, 200, 3], [60, 300, 4], [130, 380, 3],
    [220, 430, 4], [330, 470, 3], [480, 480, 4], [540, 330, 3], [30, 470, 3],
    [170, 470, 3], [280, 120, 3], [500, 250, 4], [360, 380, 3], [90, 250, 3],
  ];
  for (const [sx, sy, sr] of stars) S.star(ctx, sx, sy, sr, 'rgba(255,248,214,0.9)');
  // The planet: body only; the ring is a difference.
  S.circle(ctx, 430, 410, 72, '#c96f4a');
  S.ellipse(ctx, 405, 390, 34, 16, '#a85738');
  S.ellipse(ctx, 455, 435, 26, 12, '#a85738');
  // Station: central module, docking arms, antenna mast.
  S.rect(ctx, 250, 260, 90, 84, '#cfd8dc');
  S.rect(ctx, 250, 260, 90, 12, '#90a4ae');
  S.rect(ctx, 250, 332, 90, 12, '#90a4ae');
  S.rect(ctx, 230, 290, 20, 24, '#90a4ae');
  S.rect(ctx, 340, 290, 20, 24, '#90a4ae');
  ctx.strokeStyle = '#90a4ae';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(295, 260);
  ctx.lineTo(295, 210);
  ctx.stroke();
  // Window frames: the glass is a difference.
  ctx.strokeStyle = '#607d8b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(285, 305, 20, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(320, 285, 10, 0, Math.PI * 2);
  ctx.stroke();
  S.circle(ctx, 320, 285, 8, '#4cc9f0');
  // Solar panel frame: the cells are a difference.
  S.rect(ctx, 168, 262, 64, 48, '#37474f');
  // Antenna mast with a light socket; the light is a difference.
  S.rect(ctx, 352, 84, 6, 40, '#90a4ae');
  S.rect(ctx, 348, 122, 14, 8, '#607d8b');
  // The astronaut: suit only; the visor is a difference.
  S.ellipse(ctx, 300, 225, 18, 24, '#eceff1');
  S.circle(ctx, 300, 195, 15, '#eceff1');
  ctx.strokeStyle = '#eceff1';
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(288, 215);
  ctx.lineTo(272, 200);
  ctx.moveTo(312, 215);
  ctx.lineTo(328, 200);
  ctx.moveTo(294, 246);
  ctx.lineTo(286, 266);
  ctx.moveTo(306, 246);
  ctx.lineTo(314, 266);
  ctx.stroke();
  // The satellite: body only; the dish is a difference.
  S.rect(ctx, 132, 138, 36, 24, '#b0bec5');
  S.rect(ctx, 132, 138, 36, 6, '#78909c');
  ctx.strokeStyle = '#78909c';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(132, 150);
  ctx.lineTo(112, 150);
  ctx.stroke();
}

function gardenBase(ctx) {
  // Lawn, fence and the big tree.
  S.rect(ctx, 0, 300, PANEL_WIDTH, 220, '#6fbf5a');
  S.ellipse(ctx, 150, 360, 160, 30, '#7cc968');
  S.ellipse(ctx, 420, 400, 170, 32, '#7cc968');
  S.rect(ctx, 0, 268, PANEL_WIDTH, 10, '#a9805a');
  for (let fx = 10; fx < 560; fx += 46) S.rect(ctx, fx, 240, 12, 60, '#c49a6b');
  S.blobTree(ctx, 80, 200, 60, '#2e7d32');
  // Bunting wire; one flag is a difference.
  ctx.strokeStyle = '#5d463c';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(60, 60);
  ctx.quadraticCurveTo(280, 105, 500, 60);
  ctx.stroke();
  const bunting = [[110, 72, '#e5484d'], [165, 82, '#3e7bfa'], [220, 88, '#2fbf71'], [360, 88, '#e5484d'], [415, 80, '#3e7bfa'], [460, 70, '#ffd23f']];
  for (const [bx, by, bc] of bunting) S.triangle(ctx, bx - 9, by, bx + 9, by, bx, by + 18, bc);
  // Picnic table with a cloth.
  S.rect(ctx, 210, 300, 170, 12, '#8a5a33');
  S.rect(ctx, 222, 312, 10, 70, '#6e4525');
  S.rect(ctx, 358, 312, 10, 70, '#6e4525');
  S.rect(ctx, 210, 300, 170, 12, '#f2ead8');
  S.rect(ctx, 210, 300, 170, 4, '#e5484d');
  // The cake: tiers only; the candles are a difference.
  S.ellipse(ctx, 285, 298, 34, 8, '#ffffff');
  S.rect(ctx, 258, 272, 54, 26, '#f7a8c4');
  S.rect(ctx, 266, 258, 38, 14, '#f7d6a8');
  S.ellipse(ctx, 285, 258, 19, 5, '#fff');
  // The teapot: body only; the steam is a difference.
  S.ellipse(ctx, 205, 292, 22, 15, '#4cc9f0');
  S.triangle(ctx, 226, 288, 240, 282, 226, 296, '#4cc9f0');
  S.circle(ctx, 205, 276, 5, '#4cc9f0');
  // A rug under the table and flower beds.
  S.ellipse(ctx, 285, 420, 130, 26, '#e8843c');
  S.ellipse(ctx, 285, 420, 110, 20, '#f7a8c4');
  S.flower(ctx, 40, 380, 10, '#e5484d');
  S.flower(ctx, 520, 360, 10, '#ffd23f');
  S.flower(ctx, 350, 470, 10, '#8b5cf6');
  S.flower(ctx, 180, 480, 10, '#ffd23f');
}

// ---------------------------------------------------------------------------
// Differences: one difference, two versions.
// variant 0 draws the original (left panel), variant 1 the change (right).
// ---------------------------------------------------------------------------

function drawDiff(ctx, d, variant) {
  const p = d.params || {};
  if (d.kind === 'toggle') {
    if (variant === 0) drawShape(ctx, d.shape, d.x, d.y, p);
  } else if (d.kind === 'color') {
    drawShape(ctx, d.shape, d.x, d.y, { ...p, color: variant === 0 ? p.a : p.b });
  } else if (d.kind === 'flip') {
    drawShape(ctx, d.shape, d.x, d.y, { ...p, dir: variant === 0 ? 1 : -1 });
  } else if (d.kind === 'count') {
    drawShape(ctx, d.shape, d.x, d.y, { ...p, count: variant === 0 ? 3 : 2 });
  } else if (d.kind === 'state') {
    drawShape(ctx, d.shape, d.x, d.y, { ...p, variant });
  }
}

// Every drawable difference shape. `o` carries color / dir / count / variant.
function drawShape(ctx, shape, x, y, o) {
  switch (shape) {
    case 'gull': S.gull(ctx, x, y, 15, o.dir || 1, '#33505e'); break;
    case 'fish': S.fish(ctx, x, y, 16, o.dir || 1, '#ff8c42'); break;
    case 'bird': S.gull(ctx, x, y, 13, 1, '#22303a'); break;
    case 'star': S.star(ctx, x, y, 11, '#fff8d6'); break;
    case 'cloud': S.cloud(ctx, x, y, 18, 'rgba(255,255,255,0.95)'); break;
    case 'crate': S.crate(ctx, x, y, 34); break;
    case 'starfish': S.starfish(ctx, x, y, 15, '#ff8c42'); break;
    case 'cat': S.cat(ctx, x, y, 22, '#2b2b3a'); break;
    case 'dog': S.dog(ctx, x, y, 24, '#b07a45'); break;
    case 'butterfly': S.butterfly(ctx, x, y, 14, 1, '#8b5cf6'); break;
    case 'comet': {
      S.circle(ctx, x, y, 8, '#fff8d6');
      const g = ctx.createLinearGradient(x, y, x - 46, y + 18);
      g.addColorStop(0, 'rgba(255,248,214,0.8)');
      g.addColorStop(1, 'rgba(255,248,214,0)');
      ctx.strokeStyle = g;
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 46, y + 18);
      ctx.stroke();
      break;
    }
    case 'smoke': {
      ctx.fillStyle = 'rgba(220,228,235,0.85)';
      ctx.beginPath();
      ctx.arc(x - 10, y + 12, 9, 0, Math.PI * 2);
      ctx.arc(x + 2, y, 12, 0, Math.PI * 2);
      ctx.arc(x + 12, y - 14, 9, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'steam': {
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      for (const dx of [-8, 2, 10]) {
        ctx.beginPath();
        ctx.moveTo(x + dx, y + 12);
        ctx.quadraticCurveTo(x + dx + 6, y, x + dx - 2, y - 12);
        ctx.stroke();
      }
      break;
    }
    case 'wreath': {
      ctx.strokeStyle = '#2e7d32';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(x, y, 13, 0, Math.PI * 2);
      ctx.stroke();
      S.circle(ctx, x - 9, y - 6, 3, '#e5484d');
      S.circle(ctx, x + 9, y + 4, 3, '#e5484d');
      S.circle(ctx, x, y + 10, 3, '#ffd23f');
      break;
    }
    case 'rock': S.ellipse(ctx, x, y, 18, 12, '#8d8578'); S.ellipse(ctx, x - 4, y - 4, 8, 5, '#a39a8b'); break;
    case 'backpack': {
      S.ellipse(ctx, x, y, 18, 22, '#3e7bfa');
      S.ellipse(ctx, x, y + 4, 12, 14, '#2f66d6');
      S.rect(ctx, x - 6, y - 24, 12, 8, '#2f66d6');
      break;
    }
    case 'flag': {
      ctx.fillStyle = o.color || '#e5484d';
      ctx.beginPath();
      ctx.moveTo(x, y - 14);
      ctx.lineTo(x + 24, y - 8);
      ctx.lineTo(x, y - 2);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'sail': {
      S.triangle(ctx, x, y + 26, x, y - 28, x + 30, y + 26, o.color || '#fdfdf6');
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y + 26);
      ctx.lineTo(x, y - 28);
      ctx.lineTo(x + 30, y + 26);
      ctx.closePath();
      ctx.stroke();
      break;
    }
    case 'buoy': {
      S.ellipse(ctx, x, y, 14, 18, o.color || '#e5484d');
      S.rect(ctx, x - 3, y - 26, 6, 10, '#37474f');
      S.circle(ctx, x, y - 28, 4, '#ffd23f');
      S.rect(ctx, x - 14, y - 2, 28, 5, 'rgba(255,255,255,0.75)');
      break;
    }
    case 'mushroom': {
      S.rect(ctx, x - 5, y - 2, 10, 16, '#f2ead8');
      ctx.fillStyle = o.color || '#e5484d';
      ctx.beginPath();
      ctx.arc(x, y, 17, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      S.circle(ctx, x - 7, y - 8, 3, '#fff');
      S.circle(ctx, x + 6, y - 11, 2.5, '#fff');
      break;
    }
    case 'flower': S.flower(ctx, x, y, 13, o.color || '#e5484d'); break;
    case 'umbrella': {
      ctx.fillStyle = o.color || '#e5484d';
      ctx.beginPath();
      ctx.arc(x, y + 6, 30, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.beginPath();
      ctx.arc(x, y + 6, 30, Math.PI * 1.25, Math.PI * 1.6);
      ctx.lineTo(x, y + 6);
      ctx.closePath();
      ctx.fill();
      S.rect(ctx, x - 2, y + 6, 4, 26, '#5d463c');
      break;
    }
    case 'scarf': {
      ctx.strokeStyle = o.color || '#e5484d';
      ctx.lineWidth = 9;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(x, y, 20, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
      S.rect(ctx, x + 8, y + 8, 9, 22, o.color || '#e5484d');
      break;
    }
    case 'visor': S.ellipse(ctx, x, y, 11, 8, o.color || '#ffd23f'); break;
    case 'antenna': {
      S.circle(ctx, x, y, 7, o.color || '#e5484d');
      const g = ctx.createRadialGradient(x, y, 2, x, y, 20);
      g.addColorStop(0, o.color === '#2fbf71' ? 'rgba(47,191,113,0.5)' : 'rgba(229,72,77,0.5)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();
      S.circle(ctx, x, y, 7, o.color || '#e5484d');
      break;
    }
    case 'balloon': {
      S.ellipse(ctx, x, y, 15, 19, o.color || '#e5484d');
      S.triangle(ctx, x - 4, y + 18, x + 4, y + 18, x, y + 24, o.color || '#e5484d');
      ctx.strokeStyle = '#5d463c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y + 24);
      ctx.quadraticCurveTo(x + 6, y + 40, x - 2, y + 52);
      ctx.stroke();
      break;
    }
    case 'bunting': S.triangle(ctx, x - 9, y - 9, x + 9, y - 9, x, y + 9, o.color || '#ffd23f'); break;
    case 'apples': {
      const spots = [[-14, 4], [12, 6], [0, -12]];
      for (let i = 0; i < (o.count || 3); i++) {
        S.circle(ctx, x + spots[i][0], y + spots[i][1], 11, '#e5484d');
        S.rect(ctx, x + spots[i][0] - 1, y + spots[i][1] - 15, 2, 6, '#6b4a2f');
      }
      break;
    }
    case 'balloons': {
      const cols = ['#e5484d', '#3e7bfa', '#ffd23f'];
      const spots = [[-16, 6], [14, -4], [0, -18]];
      for (let i = 0; i < (o.count || 3); i++) {
        S.ellipse(ctx, x + spots[i][0], y + spots[i][1], 12, 15, cols[i]);
        ctx.strokeStyle = '#5d463c';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x + spots[i][0], y + spots[i][1] + 15);
        ctx.lineTo(x, y + 34);
        ctx.stroke();
      }
      break;
    }
    case 'pine': S.pine(ctx, x, y + 40, 110, o.count || 3, '#2e6b34'); break;
    case 'panel': {
      const n = o.count || 3;
      for (let i = 0; i < n; i++) {
        S.rect(ctx, x - 28 + i * 20, y - 20, 17, 40, '#1b5e9e');
        S.rect(ctx, x - 28 + i * 20, y - 20, 17, 12, '#2f7fc9');
      }
      break;
    }
    case 'candles': {
      const spots = [-16, 0, 16];
      for (let i = 0; i < (o.count || 3); i++) {
        const cx = x + spots[i];
        S.rect(ctx, cx - 3, y - 14, 6, 16, '#fff');
        ctx.fillStyle = '#ff9f1c';
        ctx.beginPath();
        ctx.ellipse(cx, y - 19, 3.5, 6, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case 'window': {
      S.rect(ctx, x - 14, y - 12, 28, 24, o.variant === 0 ? '#ffd23f' : '#2c3e50');
      ctx.strokeStyle = '#5d463c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y - 12);
      ctx.lineTo(x, y + 12);
      ctx.moveTo(x - 14, y);
      ctx.lineTo(x + 14, y);
      ctx.stroke();
      break;
    }
    case 'flame': {
      const h = o.variant === 0 ? 30 : 16;
      ctx.fillStyle = '#ff9f1c';
      ctx.beginPath();
      ctx.ellipse(x, y + 6 - h / 2, 13, h / 2 + 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffd23f';
      ctx.beginPath();
      ctx.ellipse(x, y + 8 - h / 3, 7, h / 3 + 3, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'lantern': S.lantern(ctx, x, y, 15, o.variant === 0); break;
    case 'moon': S.moon(ctx, x, y, 20, o.variant === 1); break;
    case 'sign': {
      ctx.fillStyle = '#22303a';
      ctx.font = 'bold 17px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(o.variant === 0 ? 'RAMEN' : 'UDON', x, y + 1);
      break;
    }
    case 'bulb': S.circle(ctx, x, y, 7, o.variant === 0 ? '#ffd23f' : '#4a4a55'); break;
    case 'skis': {
      ctx.strokeStyle = '#e5484d';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      if (o.variant === 0) {
        ctx.beginPath();
        ctx.moveTo(x - 12, y - 28);
        ctx.lineTo(x - 12, y + 28);
        ctx.moveTo(x + 12, y - 28);
        ctx.lineTo(x + 12, y + 28);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(x - 18, y - 26);
        ctx.lineTo(x + 18, y + 26);
        ctx.moveTo(x + 18, y - 26);
        ctx.lineTo(x - 18, y + 26);
        ctx.stroke();
      }
      break;
    }
    case 'ring': {
      if (o.variant === 0) {
        ctx.strokeStyle = '#e8c07a';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.ellipse(x, y, 96, 26, -0.35, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(232,192,122,0.5)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(x, y, 108, 32, -0.35, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    }
    case 'dish': {
      const dir = o.variant === 0 ? -1 : 1;
      ctx.strokeStyle = '#90a4ae';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x + dir * 18, y);
      ctx.lineTo(x + dir * 30, y - 6);
      ctx.stroke();
      ctx.fillStyle = '#cfd8dc';
      ctx.beginPath();
      ctx.arc(x + dir * 34, y - 8, 13, dir === -1 ? Math.PI * 0.4 : Math.PI * 1.4, dir === -1 ? Math.PI * 1.6 : Math.PI * 0.6);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'earth': {
      if (o.variant === 0) {
        S.circle(ctx, x, y, 17, '#3e7bfa');
        S.ellipse(ctx, x - 5, y - 4, 7, 5, '#2fbf71');
        S.ellipse(ctx, x + 6, y + 6, 6, 4, '#2fbf71');
      } else {
        S.circle(ctx, x, y, 17, '#101828');
      }
      break;
    }
    case 'book': {
      if (o.variant === 0) {
        S.rect(ctx, x - 20, y - 12, 40, 24, '#f2ead8');
        ctx.strokeStyle = '#8a5a33';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 20, y - 12, 40, 24);
        ctx.beginPath();
        ctx.moveTo(x, y - 12);
        ctx.lineTo(x, y + 12);
        ctx.stroke();
        ctx.strokeStyle = '#b0a894';
        for (const ly of [-7, -2, 3, 8]) {
          ctx.beginPath();
          ctx.moveTo(x - 16, y + ly);
          ctx.lineTo(x - 4, y + ly);
          ctx.moveTo(x + 4, y + ly);
          ctx.lineTo(x + 16, y + ly);
          ctx.stroke();
        }
      } else {
        S.rect(ctx, x - 16, y - 12, 32, 24, '#3e7bfa');
        S.rect(ctx, x - 16, y - 12, 6, 24, '#2f66d6');
      }
      break;
    }
    case 'sunrays': {
      S.circle(ctx, x, y, 22, '#ffd23f');
      if (o.variant === 0) {
        ctx.strokeStyle = '#ffd23f';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        for (let i = 0; i < 8; i++) {
          const a = (Math.PI * i) / 4;
          ctx.beginPath();
          ctx.moveTo(x + Math.cos(a) * 28, y + Math.sin(a) * 28);
          ctx.lineTo(x + Math.cos(a) * 38, y + Math.sin(a) * 38);
          ctx.stroke();
        }
      }
      break;
    }
    default:
      break;
  }
}
