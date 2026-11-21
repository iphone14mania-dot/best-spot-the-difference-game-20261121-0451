// Small canvas drawing helpers shared by every scene painter.
// Each helper draws one reusable motif at a position; painters.js composes
// them into full scenes and into the two versions of each difference.

export function ellipse(ctx, x, y, rx, ry, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

export function circle(ctx, x, y, r, color) {
  ellipse(ctx, x, y, r, r, color);
}

export function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

export function triangle(ctx, x1, y1, x2, y2, x3, y3, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  ctx.fill();
}

// A five-point star centred at (x, y) with outer radius r.
export function star(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

// A soft three-lobed cloud, width ~2.4x its height.
export function cloud(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x - 1.1 * s, y + 0.25 * s, 0.7 * s, 0, Math.PI * 2);
  ctx.arc(x, y - 0.35 * s, 0.9 * s, 0, Math.PI * 2);
  ctx.arc(x + 1.1 * s, y + 0.25 * s, 0.7 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(x - 1.7 * s, y, 3.4 * s, 0.55 * s);
}

// A pine tree: trunk plus `tiers` stacked triangles.
export function pine(ctx, x, y, h, tiers, color) {
  const trunkW = h * 0.09;
  rect(ctx, x - trunkW / 2, y - h * 0.12, trunkW, h * 0.12, '#6b4a2f');
  const tierH = (h * 0.92) / tiers;
  for (let i = 0; i < tiers; i++) {
    const w = h * (0.42 - i * 0.09);
    const top = y - h + i * tierH * 0.82;
    triangle(ctx, x - w, top + tierH, x + w, top + tierH, x, top, color);
  }
}

// A round leafy tree.
export function blobTree(ctx, x, y, r, color) {
  rect(ctx, x - r * 0.12, y - r * 0.7, r * 0.24, r * 0.7, '#6b4a2f');
  circle(ctx, x, y - r * 1.05, r * 0.75, color);
  circle(ctx, x - r * 0.55, y - r * 0.7, r * 0.5, color);
  circle(ctx, x + r * 0.55, y - r * 0.7, r * 0.5, color);
}

// A simple five-petal flower.
export function flower(ctx, x, y, r, petalColor) {
  for (let i = 0; i < 5; i++) {
    const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    ellipse(ctx, x + Math.cos(a) * r * 0.85, y + Math.sin(a) * r * 0.85, r * 0.55, r * 0.55, petalColor);
  }
  circle(ctx, x, y, r * 0.45, '#ffd23f');
}

// A gull / flying bird silhouette; dir 1 faces right, -1 faces left.
export function gull(ctx, x, y, s, dir, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(2, s * 0.14);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - dir * s, y);
  ctx.quadraticCurveTo(x - dir * s * 0.4, y - s * 0.55, x, y);
  ctx.quadraticCurveTo(x + dir * s * 0.4, y - s * 0.55, x + dir * s, y);
  ctx.stroke();
}

// A jumping fish; dir 1 faces right, -1 faces left.
export function fish(ctx, x, y, s, dir, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(dir, 1);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, s, s * 0.45, -0.35, 0, Math.PI * 2);
  ctx.fill();
  triangle(ctx, -s * 0.8, -s * 0.25, -s * 1.5, -s * 0.7, -s * 1.5, s * 0.25, color);
  circle(ctx, s * 0.45, -s * 0.15, s * 0.1, '#10202e');
  ctx.restore();
}

// A wooden crate with cross planks.
export function crate(ctx, x, y, s) {
  rect(ctx, x - s / 2, y - s / 2, s, s, '#b07a45');
  ctx.strokeStyle = '#7d5427';
  ctx.lineWidth = Math.max(2, s * 0.08);
  ctx.strokeRect(x - s / 2, y - s / 2, s, s);
  ctx.beginPath();
  ctx.moveTo(x - s / 2, y - s / 2);
  ctx.lineTo(x + s / 2, y + s / 2);
  ctx.moveTo(x + s / 2, y - s / 2);
  ctx.lineTo(x - s / 2, y + s / 2);
  ctx.stroke();
}

// A five-armed starfish.
export function starfish(ctx, x, y, r, color) {
  star(ctx, x, y, r, color);
  circle(ctx, x, y, r * 0.32, color);
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  for (let i = 0; i < 5; i++) {
    const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    circle(ctx, x + Math.cos(a) * r * 0.55, y + Math.sin(a) * r * 0.55, r * 0.09, 'rgba(0,0,0,0.15)');
  }
}

// A wavy sea line across the canvas at height y.
export function waves(ctx, y, w, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let x = 0; x <= w; x += 8) {
    const yy = y + Math.sin(x / 28) * 4;
    if (x === 0) ctx.moveTo(x, yy);
    else ctx.lineTo(x, yy);
  }
  ctx.stroke();
}

// A paper lantern; lit glows warm, unlit is flat grey-red.
export function lantern(ctx, x, y, r, lit) {
  if (lit) {
    const g = ctx.createRadialGradient(x, y, r * 0.2, x, y, r * 2.1);
    g.addColorStop(0, 'rgba(255, 190, 80, 0.55)');
    g.addColorStop(1, 'rgba(255, 190, 80, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r * 2.1, 0, Math.PI * 2);
    ctx.fill();
  }
  ellipse(ctx, x, y, r * 0.85, r, lit ? '#ffb03a' : '#8a6a5a');
  ctx.strokeStyle = lit ? '#c97e1e' : '#5d463c';
  ctx.lineWidth = 2;
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.ellipse(x, y + i * r * 0.45, r * 0.8, r * 0.18, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  rect(ctx, x - r * 0.3, y - r - 5, r * 0.6, 5, '#5d463c');
  rect(ctx, x - r * 0.3, y + r, r * 0.6, 5, '#5d463c');
}

// A sitting cat silhouette.
export function cat(ctx, x, y, s, color) {
  ellipse(ctx, x, y, s * 0.55, s * 0.7, color);
  circle(ctx, x + s * 0.1, y - s * 0.85, s * 0.42, color);
  triangle(ctx, x - s * 0.15, y - s * 1.1, x - s * 0.3, y - s * 1.55, x + s * 0.1, y - s * 1.25, color);
  triangle(ctx, x + s * 0.3, y - s * 1.1, x + s * 0.45, y - s * 1.55, x + s * 0.55, y - s * 1.2, color);
  ctx.strokeStyle = color;
  ctx.lineWidth = s * 0.14;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - s * 0.45, y + s * 0.5);
  ctx.quadraticCurveTo(x - s * 1.1, y + s * 0.4, x - s * 0.95, y - s * 0.2);
  ctx.stroke();
  circle(ctx, x + s * 0.28, y - s * 0.9, s * 0.07, '#ffd23f');
}

// A small sitting dog.
export function dog(ctx, x, y, s, color) {
  ellipse(ctx, x, y, s * 0.6, s * 0.5, color);
  circle(ctx, x + s * 0.55, y - s * 0.55, s * 0.42, color);
  ellipse(ctx, x + s * 0.35, y - s * 0.85, s * 0.16, s * 0.3, '#5d463c');
  ellipse(ctx, x + s * 0.8, y - s * 0.85, s * 0.16, s * 0.3, '#5d463c');
  circle(ctx, x + s * 0.72, y - s * 0.6, s * 0.07, '#10202e');
  ellipse(ctx, x + s * 0.95, y - s * 0.42, s * 0.14, s * 0.1, '#10202e');
  ctx.strokeStyle = color;
  ctx.lineWidth = s * 0.12;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - s * 0.55, y - s * 0.1);
  ctx.quadraticCurveTo(x - s * 1.0, y - s * 0.4, x - s * 0.85, y - s * 0.7);
  ctx.stroke();
}

// A butterfly; wings flap by `open` (0..1) for a little life.
export function butterfly(ctx, x, y, s, open, color) {
  const w = s * (0.4 + 0.6 * open);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x - w * 0.7, y - s * 0.25, w * 0.7, s * 0.55, -0.5, 0, Math.PI * 2);
  ctx.ellipse(x + w * 0.7, y - s * 0.25, w * 0.7, s * 0.55, 0.5, 0, Math.PI * 2);
  ctx.ellipse(x - w * 0.5, y + s * 0.35, w * 0.45, s * 0.35, 0.4, 0, Math.PI * 2);
  ctx.ellipse(x + w * 0.5, y + s * 0.35, w * 0.45, s * 0.35, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ellipse(ctx, x, y, s * 0.14, s * 0.55, '#2b2b3a');
}

// A crescent or full moon.
export function moon(ctx, x, y, r, crescent) {
  circle(ctx, x, y, r, '#f4f1de');
  if (crescent) {
    circle(ctx, x + r * 0.55, y - r * 0.2, r * 0.85, '#2b4a6f');
  }
  circle(ctx, x - r * 0.3, y - r * 0.2, r * 0.14, 'rgba(0,0,0,0.08)');
  circle(ctx, x + r * 0.2, y + r * 0.3, r * 0.1, 'rgba(0,0,0,0.08)');
}
