// Boot + wiring for "Twin Peaks — Spot the Difference".
// Builds the scene menu from scenes.js, wires every button, owns the two
// screens (menu / play) and connects the engine, the keyboard controls and
// the magnifier. Exposes window.__game for play-testing.

import { SCENES, DIFFICULTIES, PANEL_WIDTH, PANEL_HEIGHT, totalDifferences } from './scenes.js';
import { paintPanel } from './painters.js';
import { Game } from './engine.js';
import { SoundBank } from './audio.js';
import { Magnifier } from './magnifier.js';
import { KeyboardControls } from './keyboard.js';
import { bestFor, totalStars } from './storage.js';

const $ = (id) => document.getElementById(id);

const sound = new SoundBank();
let difficultyId = 'normal';
let game = null;
let magnifier = null;
let keyboard = null;

function buildMenu() {
  const grid = $('scene-grid');
  grid.innerHTML = '';
  SCENES.forEach((scene, i) => {
    const best = bestFor(scene.id, difficultyId);
    const card = document.createElement('button');
    card.className = 'scene-card';
    card.type = 'button';
    card.innerHTML =
      '<span class="scene-num">' + (i + 1) + '</span>' +
      '<span class="scene-name">' + scene.name + '</span>' +
      '<span class="scene-tag">' + scene.tagline + '</span>' +
      '<span class="scene-meta">' +
        '<span class="stars">' + '★'.repeat(scene.difficulty) + '☆'.repeat(3 - scene.difficulty) + '</span>' +
        '<span class="diff-count">' + scene.diffs.length + ' differences</span>' +
      '</span>' +
      '<span class="scene-best">' + (best ? 'Best ' + best.score + ' pts · ' + '★'.repeat(best.stars) : 'Not played yet') + '</span>';
    card.addEventListener('click', () => {
      sound.click();
      startScene(scene.id);
    });
    grid.appendChild(card);
  });
  $('total-stars').textContent = totalStars() + ' / ' + SCENES.length * 3 + ' stars';
  $('total-diffs').textContent = totalDifferences() + ' differences across ' + SCENES.length + ' scenes';
}

function setDifficulty(id) {
  difficultyId = id;
  document.querySelectorAll('.diff-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.diff === id);
  });
  $('diff-blurb').textContent = DIFFICULTIES[id].blurb;
  buildMenu();
}

function showScreen(name) {
  $('screen-menu').classList.toggle('show', name === 'menu');
  $('screen-play').classList.toggle('show', name === 'play');
}

function startScene(sceneId) {
  const scene = SCENES.find((s) => s.id === sceneId);
  showScreen('play');
  game.start(scene, DIFFICULTIES[difficultyId]);
  keyboard.reset();
  magnifier.hide();
}

function backToMenu() {
  game.quitToMenu();
  magnifier.hide();
  showScreen('menu');
  buildMenu();
}

function wirePlay() {
  const ui = {
    canvasL: $('canvas-left'),
    canvasR: $('canvas-right'),
    overL: $('overlay-left'),
    overR: $('overlay-right'),
    panelL: $('panel-left'),
    panelR: $('panel-right'),
    sceneName: $('hud-scene'),
    difficultyName: $('hud-diff'),
    counter: $('counter'),
    counterDots: $('counter-dots'),
    score: $('score'),
    combo: $('combo'),
    timerText: $('timer-text'),
    timerBar: $('timer-bar'),
    hintBtn: $('hint-btn'),
    hintCount: $('hint-count'),
    toast: $('toast'),
    modalWin: $('modal-win'),
    modalTimeout: $('modal-timeout'),
    winStars: $('win-stars'),
    winScore: $('win-score'),
    winTime: $('win-time'),
    winAccuracy: $('win-accuracy'),
    winBonus: $('win-bonus'),
    winBest: $('win-best'),
    timeoutFound: $('timeout-found'),
    timeoutScore: $('timeout-score'),
  };
  for (const c of [ui.canvasL, ui.canvasR, ui.overL, ui.overR]) {
    c.width = PANEL_WIDTH;
    c.height = PANEL_HEIGHT;
  }
  game = new Game(ui, sound);
  window.__game = game;

  // Mouse clicks on either panel.
  const clickHandler = (panel) => (e) => {
    sound.ensure();
    const p = game.canvasPoint(panel, e.clientX, e.clientY);
    game.clearCrosshair();
    game.clickAt(panel, p.x, p.y);
  };
  ui.panelL.addEventListener('click', clickHandler(0));
  ui.panelR.addEventListener('click', clickHandler(1));

  // Magnifier follows the mouse over the panels.
  const moveHandler = (panel) => (e) => {
    if (!magnifier.enabled) return;
    const canvas = panel === 0 ? ui.canvasL : ui.canvasR;
    const overlay = panel === 0 ? ui.overL : ui.overR;
    const p = game.canvasPoint(panel, e.clientX, e.clientY);
    magnifier.showAt(canvas, overlay, p.x, p.y, e.clientX, e.clientY);
  };
  ui.panelL.addEventListener('mousemove', moveHandler(0));
  ui.panelR.addEventListener('mousemove', moveHandler(1));
  ui.panelL.addEventListener('mouseleave', () => magnifier.hide());
  ui.panelR.addEventListener('mouseleave', () => magnifier.hide());

  $('hint-btn').addEventListener('click', () => game.useHint());
  $('lens-btn').addEventListener('click', () => {
    const on = magnifier.toggle();
    $('lens-btn').classList.toggle('active', on);
    $('lens-btn').textContent = on ? 'Lens ON (M)' : 'Lens (M)';
  });
  $('menu-btn').addEventListener('click', () => { sound.click(); backToMenu(); });
  $('restart-btn').addEventListener('click', () => {
    sound.click();
    startScene(game.scene.id);
  });
  $('next-btn').addEventListener('click', () => {
    sound.click();
    const idx = SCENES.findIndex((s) => s.id === game.scene.id);
    startScene(SCENES[(idx + 1) % SCENES.length].id);
  });
  $('again-btn').addEventListener('click', () => {
    sound.click();
    startScene(game.scene.id);
  });
  $('retry-btn').addEventListener('click', () => {
    sound.click();
    startScene(game.scene.id);
  });
  $('timeout-menu-btn').addEventListener('click', () => { sound.click(); backToMenu(); });
  $('win-menu-btn').addEventListener('click', () => { sound.click(); backToMenu(); });

  keyboard = new KeyboardControls({
    isPlaying: () => game.status === 'playing',
    isMenu: () => game.status === 'menu',
    onCrosshairMove: (panel, x, y) => game.setCrosshair(panel, x, y),
    onCrosshairClick: (panel, x, y) => game.clickAt(panel, x, y),
    onHintKey: () => game.useHint(),
    onMagnifierKey: () => $('lens-btn').click(),
    onMuteKey: () => toggleMute(),
    onRestartKey: () => startScene(game.scene.id),
    onEscapeKey: () => {
      if (game.status === 'playing' || game.status === 'won' || game.status === 'timeout') backToMenu();
    },
    onSceneKey: (i) => {
      if (SCENES[i]) {
        sound.click();
        startScene(SCENES[i].id);
      }
    },
  });
}

function toggleMute() {
  const muted = sound.toggleMute();
  $('mute-btn').textContent = muted ? 'Sound OFF (S)' : 'Sound ON (S)';
  $('mute-btn').classList.toggle('muted', muted);
}

function boot() {
  document.querySelectorAll('.diff-btn').forEach((b) => {
    b.addEventListener('click', () => {
      sound.click();
      setDifficulty(b.dataset.diff);
    });
  });
  $('mute-btn').addEventListener('click', () => { sound.ensure(); toggleMute(); });
  magnifier = new Magnifier($('lens'), $('lens-canvas'));
  wirePlay();
  setDifficulty('normal');
  showScreen('menu');
  // A tiny live preview on the menu: the harbor scene, both panels, painted
  // once so the menu itself shows what the game looks like.
  const previewL = $('preview-left');
  const previewR = $('preview-right');
  if (previewL && previewR) {
    previewL.width = PANEL_WIDTH;
    previewL.height = PANEL_HEIGHT;
    previewR.width = PANEL_WIDTH;
    previewR.height = PANEL_HEIGHT;
    paintPanel(previewL.getContext('2d'), SCENES[0], 0, new Set());
    paintPanel(previewR.getContext('2d'), SCENES[0], 1, new Set());
  }
}

document.addEventListener('DOMContentLoaded', boot);
