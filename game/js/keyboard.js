// Keyboard play for "Twin Peaks".
// Arrow keys move a crosshair over the panels, Enter or Space clicks where
// it sits, Tab swaps panels. H hints, M toggles the magnifier, S mutes,
// Esc goes back to the menu, R restarts the scene, 1-6 pick a scene from
// the menu. The crosshair is drawn on the panels' overlay canvases.

import { PANEL_WIDTH, PANEL_HEIGHT } from './scenes.js';

export const CROSSHAIR_STEP = 14;
export const CROSSHAIR_FAST_STEP = 48;

export class KeyboardControls {
  constructor(callbacks) {
    this.cb = callbacks;
    // Crosshair position in canvas coordinates, plus which panel (0/1).
    this.x = PANEL_WIDTH / 2;
    this.y = PANEL_HEIGHT / 2;
    this.panel = 0;
    this.active = false;
    this.onKeyDown = this.onKeyDown.bind(this);
    window.addEventListener('keydown', this.onKeyDown);
  }

  destroy() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  reset() {
    this.x = PANEL_WIDTH / 2;
    this.y = PANEL_HEIGHT / 2;
    this.panel = 0;
    this.active = false;
  }

  onKeyDown(e) {
    const k = e.key;
    if (k === 'ArrowLeft' || k === 'ArrowRight' || k === 'ArrowUp' || k === 'ArrowDown') {
      if (!this.cb.isPlaying()) return;
      e.preventDefault();
      this.active = true;
      const step = e.shiftKey ? CROSSHAIR_FAST_STEP : CROSSHAIR_STEP;
      if (k === 'ArrowLeft') this.x = Math.max(0, this.x - step);
      if (k === 'ArrowRight') this.x = Math.min(PANEL_WIDTH, this.x + step);
      if (k === 'ArrowUp') this.y = Math.max(0, this.y - step);
      if (k === 'ArrowDown') this.y = Math.min(PANEL_HEIGHT, this.y + step);
      this.cb.onCrosshairMove(this.panel, this.x, this.y);
      return;
    }
    if (k === 'Tab') {
      if (!this.cb.isPlaying()) return;
      e.preventDefault();
      this.active = true;
      this.panel = 1 - this.panel;
      this.cb.onCrosshairMove(this.panel, this.x, this.y);
      return;
    }
    if (k === 'Enter' || k === ' ') {
      if (!this.cb.isPlaying()) return;
      e.preventDefault();
      this.active = true;
      this.cb.onCrosshairClick(this.panel, this.x, this.y);
      return;
    }
    const lower = k.toLowerCase();
    if (lower === 'h' && this.cb.isPlaying()) { this.cb.onHintKey(); return; }
    if (lower === 'm' && this.cb.isPlaying()) { this.cb.onMagnifierKey(); return; }
    if (lower === 's') { this.cb.onMuteKey(); return; }
    if (lower === 'r' && this.cb.isPlaying()) { this.cb.onRestartKey(); return; }
    if (k === 'Escape') { this.cb.onEscapeKey(); return; }
    if (lower >= '1' && lower <= '6' && this.cb.isMenu()) {
      this.cb.onSceneKey(Number(lower) - 1);
    }
  }
}
