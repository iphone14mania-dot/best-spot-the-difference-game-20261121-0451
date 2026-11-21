// The game engine for "Twin Peaks — Spot the Difference".
// Owns the round state (scene, difficulty, found set, score, combo), the
// click handling on both panels, the hint pulse, the timer wiring and the
// win / time-up endings. The two panels are painted once per scene by
// painters.js; this class only repaints the lightweight overlay canvases
// (found rings, hint pulse, miss marks, keyboard crosshair).

import { paintPanel } from './painters.js';
import { GameTimer } from './timer.js';
import { HintSystem, HINT_COST, HINT_PULSE_MS } from './hints.js';
import { recordBest } from './storage.js';
import { PANEL_WIDTH, PANEL_HEIGHT } from './scenes.js';

export const FIND_POINTS = 100;
export const COMBO_STEP = 25;
export const COMBO_WINDOW_MS = 8000;
export const MISS_PENALTY = 25;
export const TIME_BONUS_PER_SEC = 10;

export class Game {
  // ui: the DOM handles main.js wires up (canvases, overlays, HUD, modals).
  constructor(ui, sound) {
    this.ui = ui;
    this.sound = sound;
    this.scene = null;
    this.difficulty = null;
    this.status = 'menu'; // menu | playing | won | timeout
    this.found = new Set();
    this.misses = 0;
    this.score = 0;
    this.combo = 0;
    this.lastFindAt = 0;
    this.timer = null;
    this.hints = null;
    this.pulse = null; // { diff, until }
    this.missMark = null; // { panel, x, y, until }
    this.crosshair = null; // { panel, x, y } from the keyboard controls
    this.raf = 0;
    this.lastTickSecond = -1;
    this.toastTimer = 0;
  }

  start(scene, difficulty) {
    this.scene = scene;
    this.difficulty = difficulty;
    this.status = 'playing';
    this.found = new Set();
    this.misses = 0;
    this.score = 0;
    this.combo = 0;
    this.lastFindAt = 0;
    this.pulse = null;
    this.missMark = null;
    this.crosshair = null;
    this.lastTickSecond = -1;
    this.hints = new HintSystem(difficulty.hints);
    this.ui.sceneName.textContent = scene.name;
    this.ui.difficultyName.textContent = difficulty.name;
    this.paintPanels();
    this.updateHud();
    this.hideModals();
    if (this.timer) this.timer.stop();
    this.timer = new GameTimer(
      difficulty.timeLimitSec,
      (t) => this.onTimerTick(t),
      () => this.onTimeout(),
    );
    this.timer.start();
    this.startLoop();
  }

  quitToMenu() {
    this.status = 'menu';
    if (this.timer) this.timer.stop();
    this.stopLoop();
    this.hideModals();
  }

  paintPanels() {
    const lctx = this.ui.canvasL.getContext('2d');
    const rctx = this.ui.canvasR.getContext('2d');
    paintPanel(lctx, this.scene, 0, this.found);
    paintPanel(rctx, this.scene, 1, this.found);
  }

  // -- clicks ---------------------------------------------------------------

  canvasPoint(panel, clientX, clientY) {
    const canvas = panel === 0 ? this.ui.canvasL : this.ui.canvasR;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * PANEL_WIDTH,
      y: ((clientY - rect.top) / rect.height) * PANEL_HEIGHT,
    };
  }

  clickAt(panel, x, y) {
    if (this.status !== 'playing') return;
    const scale = this.difficulty.clickScale;
    let best = null;
    let bestDist = Infinity;
    for (const d of this.scene.diffs) {
      if (this.found.has(d.id)) continue;
      const dist = Math.hypot(x - d.x, y - d.y);
      if (dist <= d.r * scale && dist < bestDist) {
        best = d;
        bestDist = dist;
      }
    }
    if (best) this.registerFind(best);
    else this.registerMiss(panel, x, y);
  }

  registerFind(diff) {
    const now = Date.now();
    this.combo = now - this.lastFindAt <= COMBO_WINDOW_MS ? this.combo + 1 : 1;
    this.lastFindAt = now;
    const bonus = (this.combo - 1) * COMBO_STEP;
    const gained = FIND_POINTS + bonus;
    this.score += gained;
    this.found.add(diff.id);
    this.sound.find();
    this.toast('Found: ' + diff.label + '  +' + gained, 'good');
    this.paintPanels();
    this.updateHud();
    if (this.found.size === this.scene.diffs.length) this.onWin();
  }

  registerMiss(panel, x, y) {
    this.misses += 1;
    this.combo = 0;
    this.score = Math.max(0, this.score - MISS_PENALTY);
    this.sound.miss();
    this.missMark = { panel, x, y, until: Date.now() + 650 };
    this.toast('Not a difference  -' + MISS_PENALTY, 'bad');
    const panelEl = panel === 0 ? this.ui.panelL : this.ui.panelR;
    panelEl.classList.remove('shake');
    void panelEl.offsetWidth;
    panelEl.classList.add('shake');
    this.updateHud();
  }

  // -- hints ----------------------------------------------------------------

  useHint() {
    if (this.status !== 'playing') return;
    const now = Date.now();
    if (!this.hints.canUse(now)) {
      if (this.hints.remaining <= 0) this.toast('Out of hints for this scene', 'bad');
      else this.toast('Hint cooling down: ' + Math.ceil(this.hints.cooldownLeftMs(now) / 1000) + 's', 'bad');
      return;
    }
    const unfound = this.scene.diffs.filter((d) => !this.found.has(d.id));
    if (unfound.length === 0) return;
    const pick = unfound[Math.floor(Math.random() * unfound.length)];
    this.hints.use(now);
    this.score = Math.max(0, this.score - HINT_COST);
    this.sound.hint();
    this.pulse = { diff: pick, until: now + HINT_PULSE_MS };
    this.toast('Hint: look near the pulsing ring  -' + HINT_COST, 'hint');
    this.updateHud();
  }

  // -- timer ----------------------------------------------------------------

  onTimerTick(t) {
    const remaining = t.remainingSec();
    if (this.difficulty.timeLimitSec > 0) {
      this.ui.timerText.textContent = GameTimer.format(remaining);
      this.ui.timerBar.style.width = (t.fractionLeft() * 100).toFixed(1) + '%';
      this.ui.timerBar.classList.toggle('danger', remaining <= 60);
      this.ui.timerBar.classList.toggle('critical', remaining <= 30);
      const whole = Math.ceil(remaining);
      if (remaining <= 10 && whole !== this.lastTickSecond) {
        this.lastTickSecond = whole;
        this.sound.timeTick();
      }
    } else {
      this.ui.timerText.textContent = GameTimer.format(t.elapsedSec());
      this.ui.timerBar.style.width = '100%';
    }
  }

  onTimeout() {
    if (this.status !== 'playing') return;
    this.status = 'timeout';
    this.stopLoop();
    this.sound.miss();
    this.ui.timeoutFound.textContent = this.found.size + ' / ' + this.scene.diffs.length;
    this.ui.timeoutScore.textContent = this.score;
    this.ui.modalTimeout.classList.add('show');
  }

  onWin() {
    this.status = 'won';
    if (this.timer) this.timer.stop();
    this.stopLoop();
    const elapsed = this.timer ? this.timer.elapsedSec() : 0;
    const remaining = this.timer ? this.timer.remainingSec() : 0;
    const timeBonus = this.difficulty.timeLimitSec > 0 ? Math.floor(remaining) * TIME_BONUS_PER_SEC : 0;
    this.score += timeBonus;
    const attempts = this.found.size + this.misses;
    const accuracy = attempts > 0 ? this.found.size / attempts : 1;
    const stars = this.starsFor(accuracy, elapsed);
    const saved = recordBest(this.scene.id, this.difficulty.id, {
      score: this.score,
      timeSec: elapsed,
      stars,
      accuracy,
    });
    this.sound.win();
    this.ui.winStars.textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    this.ui.winScore.textContent = this.score;
    this.ui.winTime.textContent = GameTimer.format(elapsed);
    this.ui.winAccuracy.textContent = Math.round(accuracy * 100) + '%';
    this.ui.winBonus.textContent = '+' + timeBonus;
    this.ui.winBest.textContent = saved.score + ' pts';
    this.ui.modalWin.classList.add('show');
    this.updateHud();
  }

  starsFor(accuracy, elapsedSec) {
    const limit = this.difficulty.timeLimitSec;
    const fast = limit <= 0 || elapsedSec <= limit * 0.6;
    if (accuracy >= 0.9 && fast) return 3;
    if (accuracy >= 0.75) return 2;
    return 1;
  }

  // -- HUD + overlays --------------------------------------------------------

  updateHud() {
    const total = this.scene ? this.scene.diffs.length : 0;
    const found = this.found.size;
    this.ui.counter.textContent = found + '/' + total + ' found · ' + (total - found) + ' remaining';
    this.ui.counterDots.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('span');
      dot.className = 'dot' + (i < found ? ' found' : '');
      this.ui.counterDots.appendChild(dot);
    }
    this.ui.score.textContent = this.score;
    this.ui.combo.textContent = this.combo >= 2 ? 'COMBO x' + this.combo : '';
    this.ui.combo.classList.toggle('show', this.combo >= 2);
    const hintsLeft = this.hints ? this.hints.remaining : 0;
    this.ui.hintCount.textContent = hintsLeft;
    this.ui.hintBtn.disabled = hintsLeft <= 0;
  }

  toast(text, kind) {
    this.ui.toast.textContent = text;
    this.ui.toast.className = 'toast show ' + (kind || '');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.ui.toast.classList.remove('show');
    }, 2300);
  }

  hideModals() {
    this.ui.modalWin.classList.remove('show');
    this.ui.modalTimeout.classList.remove('show');
  }

  setCrosshair(panel, x, y) {
    this.crosshair = { panel, x, y };
  }

  clearCrosshair() {
    this.crosshair = null;
  }

  startLoop() {
    this.stopLoop();
    const frame = () => {
      if (this.status !== 'playing') return;
      this.renderOverlays();
      this.raf = requestAnimationFrame(frame);
    };
    this.raf = requestAnimationFrame(frame);
  }

  stopLoop() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  renderOverlays() {
    const now = Date.now();
    for (const panel of [0, 1]) {
      const overlay = panel === 0 ? this.ui.overL : this.ui.overR;
      const ctx = overlay.getContext('2d');
      ctx.clearRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT);
      // Found rings live on the base canvases (paintPanels); the overlay
      // carries only transient marks, so a repaint never loses a ring.
      if (this.pulse && now < this.pulse.until) {
        const t = (this.pulse.until - now) / HINT_PULSE_MS;
        const pulseR = this.pulse.diff.r + 10 + Math.sin(now / 130) * 5;
        ctx.save();
        ctx.globalAlpha = 0.35 + 0.65 * t;
        ctx.strokeStyle = '#ffd23f';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(this.pulse.diff.x, this.pulse.diff.y, pulseR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      if (this.missMark && this.missMark.panel === panel && now < this.missMark.until) {
        const a = (this.missMark.until - now) / 650;
        ctx.save();
        ctx.globalAlpha = a;
        ctx.strokeStyle = '#e5484d';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        const { x, y } = this.missMark;
        ctx.beginPath();
        ctx.moveTo(x - 11, y - 11);
        ctx.lineTo(x + 11, y + 11);
        ctx.moveTo(x + 11, y - 11);
        ctx.lineTo(x - 11, y + 11);
        ctx.stroke();
        ctx.restore();
      }
      if (this.crosshair && this.crosshair.panel === panel) {
        const { x, y } = this.crosshair;
        ctx.save();
        ctx.strokeStyle = '#e5484d';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#e5484d';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    if (this.pulse && now >= this.pulse.until) this.pulse = null;
    if (this.missMark && now >= this.missMark.until) this.missMark = null;
  }

  // A snapshot of the round, for tests and for the parent's review.
  state() {
    return {
      scene: this.scene ? this.scene.id : null,
      difficulty: this.difficulty ? this.difficulty.id : null,
      status: this.status,
      found: this.found.size,
      total: this.scene ? this.scene.diffs.length : 0,
      misses: this.misses,
      score: this.score,
      combo: this.combo,
      hintsLeft: this.hints ? this.hints.remaining : 0,
    };
  }
}
