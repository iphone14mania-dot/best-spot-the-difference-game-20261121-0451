// Best scores for "Twin Peaks", kept in localStorage.
// One best per scene + difficulty. Everything is guarded: a browser without
// storage (or with it disabled) plays exactly the same, it just forgets.

const KEY = 'twinpeaks.best.v1';

export function loadBest() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (e) {
    return {};
  }
}

function saveAll(best) {
  try {
    localStorage.setItem(KEY, JSON.stringify(best));
  } catch (e) {
    // Storage unavailable: the game plays on without it.
  }
}

export function bestFor(sceneId, difficultyId) {
  const best = loadBest();
  return best[sceneId + ':' + difficultyId] || null;
}

// Keeps the better of the old and the new record (higher score wins; a tie
// goes to the faster time). Returns the stored record.
export function recordBest(sceneId, difficultyId, result) {
  const best = loadBest();
  const key = sceneId + ':' + difficultyId;
  const old = best[key];
  const entry = {
    score: result.score,
    timeSec: Math.round(result.timeSec * 10) / 10,
    stars: result.stars,
    accuracy: result.accuracy,
  };
  if (!old || entry.score > old.score || (entry.score === old.score && entry.timeSec < old.timeSec)) {
    best[key] = entry;
    saveAll(best);
  }
  return best[key];
}

export function totalStars() {
  const best = loadBest();
  return Object.values(best).reduce((n, b) => n + (b.stars || 0), 0);
}
