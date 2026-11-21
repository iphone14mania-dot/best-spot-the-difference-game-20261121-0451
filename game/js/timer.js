// Countdown timer for "Twin Peaks".
// Wall-clock based (Date.now), so a tab switch or a slow frame cannot cheat
// it. A limit of 0 means "no timer": it counts up instead and never expires.

export class GameTimer {
  constructor(limitSec, onTick, onExpire) {
    this.limitSec = limitSec;
    this.onTick = onTick;
    this.onExpire = onExpire;
    this.interval = null;
    this.startedAt = 0;
    this.pausedAt = 0;
    this.pausedTotal = 0;
    this.expired = false;
  }

  start() {
    this.stop();
    this.startedAt = Date.now();
    this.pausedTotal = 0;
    this.expired = false;
    this.interval = setInterval(() => this.tick(), 200);
    this.tick();
  }

  stop() {
    if (this.interval) clearInterval(this.interval);
    this.interval = null;
  }

  pause() {
    if (!this.pausedAt) this.pausedAt = Date.now();
  }

  resume() {
    if (this.pausedAt) {
      this.pausedTotal += Date.now() - this.pausedAt;
      this.pausedAt = 0;
    }
  }

  elapsedSec() {
    if (!this.startedAt) return 0;
    const end = this.pausedAt || Date.now();
    return Math.max(0, (end - this.startedAt - this.pausedTotal) / 1000);
  }

  remainingSec() {
    if (this.limitSec <= 0) return Infinity;
    return Math.max(0, this.limitSec - this.elapsedSec());
  }

  fractionLeft() {
    if (this.limitSec <= 0) return 1;
    return Math.max(0, this.remainingSec() / this.limitSec);
  }

  tick() {
    if (this.onTick) this.onTick(this);
    if (this.limitSec > 0 && this.remainingSec() <= 0 && !this.expired) {
      this.expired = true;
      this.stop();
      if (this.onExpire) this.onExpire();
    }
  }

  static format(sec) {
    if (!isFinite(sec)) return '--:--';
    const s = Math.ceil(sec);
    const m = Math.floor(s / 60);
    const r = s % 60;
    return String(m).padStart(2, '0') + ':' + String(r).padStart(2, '0');
  }
}
