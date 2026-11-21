// The magnifier lens for "Twin Peaks".
// A circular lens that follows the mouse over either panel and shows that
// spot at 2x zoom, drawn from the panel's own canvases (base art plus the
// found rings). Toggle with the M key or the lens button.

export const LENS_SIZE = 180;
export const LENS_ZOOM = 2;

export class Magnifier {
  constructor(lensEl, lensCanvas) {
    this.lensEl = lensEl;
    this.lensCtx = lensCanvas.getContext('2d');
    this.enabled = false;
    this.visible = false;
    lensCanvas.width = LENS_SIZE;
    lensCanvas.height = LENS_SIZE;
  }

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled) this.hide();
    return this.enabled;
  }

  hide() {
    this.visible = false;
    this.lensEl.style.display = 'none';
  }

  // panelCanvas + overlayCanvas are the panel under the cursor; cx, cy are
  // canvas coordinates of the cursor; pageX, pageY place the lens on screen.
  showAt(panelCanvas, overlayCanvas, cx, cy, pageX, pageY) {
    if (!this.enabled) return;
    const src = LENS_SIZE / LENS_ZOOM;
    const sx = Math.max(0, Math.min(panelCanvas.width - src, cx - src / 2));
    const sy = Math.max(0, Math.min(panelCanvas.height - src, cy - src / 2));
    const c = this.lensCtx;
    c.save();
    c.beginPath();
    c.arc(LENS_SIZE / 2, LENS_SIZE / 2, LENS_SIZE / 2, 0, Math.PI * 2);
    c.clip();
    c.imageSmoothingEnabled = false;
    c.drawImage(panelCanvas, sx, sy, src, src, 0, 0, LENS_SIZE, LENS_SIZE);
    c.drawImage(overlayCanvas, sx, sy, src, src, 0, 0, LENS_SIZE, LENS_SIZE);
    c.restore();
    // A crosshair at the lens centre, so the player knows the exact spot.
    c.strokeStyle = 'rgba(229, 72, 77, 0.9)';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(LENS_SIZE / 2 - 10, LENS_SIZE / 2);
    c.lineTo(LENS_SIZE / 2 + 10, LENS_SIZE / 2);
    c.moveTo(LENS_SIZE / 2, LENS_SIZE / 2 - 10);
    c.lineTo(LENS_SIZE / 2, LENS_SIZE / 2 + 10);
    c.stroke();
    this.lensEl.style.display = 'block';
    // Keep the lens inside the viewport.
    const lx = Math.max(8, Math.min(window.innerWidth - LENS_SIZE - 8, pageX - LENS_SIZE / 2));
    const ly = Math.max(8, Math.min(window.innerHeight - LENS_SIZE - 8, pageY - LENS_SIZE - 12));
    this.lensEl.style.left = lx + 'px';
    this.lensEl.style.top = ly + 'px';
    this.visible = true;
  }
}
