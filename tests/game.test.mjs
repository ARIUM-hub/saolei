import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createGame,
  getRemainingMines,
  revealCell,
  toggleFlag,
} from '../src/game.mjs';

test('creates a board with the configured dimensions and mine count', () => {
  const game = createGame({ rows: 2, cols: 3, mines: 1 }, { minePositions: [5] });

  assert.equal(game.rows, 2);
  assert.equal(game.cols, 3);
  assert.equal(game.mines, 1);
  assert.equal(game.cells.length, 6);
  assert.equal(game.cells.filter((cell) => cell.isMine).length, 1);
});

test('keeps the first revealed cell safe when mines are generated lazily', () => {
  const game = createGame(
    { rows: 2, cols: 2, mines: 3 },
    { random: () => 0 },
  );

  revealCell(game, 0);

  assert.equal(game.cells[0].isMine, false);
  assert.equal(game.cells[0].isRevealed, true);
  assert.equal(game.status, 'won');
});

test('toggles flags and updates the remaining mine count', () => {
  const game = createGame({ rows: 2, cols: 2, mines: 1 }, { minePositions: [3] });

  toggleFlag(game, 3);
  assert.equal(game.cells[3].isFlagged, true);
  assert.equal(getRemainingMines(game), 0);

  toggleFlag(game, 3);
  assert.equal(game.cells[3].isFlagged, false);
  assert.equal(getRemainingMines(game), 1);
});

test('revealing a mine loses the game and exposes mines', () => {
  const game = createGame({ rows: 2, cols: 2, mines: 1 }, { minePositions: [0] });

  revealCell(game, 0);

  assert.equal(game.status, 'lost');
  assert.equal(game.cells[0].isRevealed, true);
});

test('revealing every safe cell wins the game', () => {
  const game = createGame({ rows: 2, cols: 2, mines: 1 }, { minePositions: [0] });

  revealCell(game, 1);
  revealCell(game, 2);
  revealCell(game, 3);

  assert.equal(game.status, 'won');
});
