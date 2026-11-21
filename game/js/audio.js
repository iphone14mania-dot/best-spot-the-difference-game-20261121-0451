// Synthesized sound effects for "Twin Peaks".
// No audio files: every sound is a few WebAudio oscillators, so the game
// stays fully offline and the sounds cost zero bytes of assets.

export class SoundBank {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensure() {
    if (!this.ctx) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
      } catch (e) {
        this.ctx = null;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') void this.ctx.resume();
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  tone(freq, dur, type, vol, delay) {
    if (this.muted || !this.ctx) return;
    const t0 = this.ctx.currentTime + (delay || 0);
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol || 0.18, t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  // The satisfying find: a bright two-note chime, rising.
  find() {
    this.ensure();
    this.tone(660, 0.14, 'sine', 0.2, 0);
    this.tone(990, 0.22, 'sine', 0.2, 0.09);
  }

  // A wrong click: a soft low buzz, never harsh.
  miss() {
    this.ensure();
    this.tone(160, 0.16, 'sawtooth', 0.08, 0);
    this.tone(120, 0.2, 'sawtooth', 0.06, 0.05);
  }

  // A hint: a gentle shimmer up the scale.
  hint() {
    this.ensure();
    this.tone(520, 0.12, 'triangle', 0.12, 0);
    this.tone(780, 0.12, 'triangle', 0.12, 0.08);
    this.tone(1040, 0.18, 'triangle', 0.1, 0.16);
  }

  // Winning a scene: a short rising arpeggio.
  win() {
    this.ensure();
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) => this.tone(f, 0.22, 'triangle', 0.16, i * 0.11));
  }

  // A quiet UI tick.
  click() {
    this.ensure();
    this.tone(880, 0.05, 'sine', 0.07, 0);
  }

  // Time running out: one low tick.
  timeTick() {
    this.ensure();
    this.tone(440, 0.07, 'square', 0.05, 0);
  }
}
