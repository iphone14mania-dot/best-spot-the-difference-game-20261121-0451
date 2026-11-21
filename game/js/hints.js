// The hint system for "Twin Peaks".
// A hint costs points, has a cooldown, and never hands over the answer for
// free: it pulses a ring around one unfound difference for a couple of
// seconds, then fades. The engine owns the pulse animation; this class owns
// the counts and the cooldown.

export const HINT_COST = 50;
export const HINT_COOLDOWN_MS = 30000;
export const HINT_PULSE_MS = 2200;

export class HintSystem {
  constructor(count) {
    this.remaining = count;
    this.cooldownUntil = 0;
  }

  canUse(now) {
    return this.remaining > 0 && now >= this.cooldownUntil;
  }

  cooldownLeftMs(now) {
    return Math.max(0, this.cooldownUntil - now);
  }

  // Spends one hint and starts the cooldown. Returns false when none is
  // available (out of hints, or still cooling down).
  use(now) {
    if (!this.canUse(now)) return false;
    this.remaining -= 1;
    this.cooldownUntil = now + HINT_COOLDOWN_MS;
    return true;
  }
}
