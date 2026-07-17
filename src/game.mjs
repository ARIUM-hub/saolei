export const DIFFICULTIES = {
  beginner: { label: 'Beginner', rows: 9, cols: 9, mines: 10 },
  intermediate: { label: 'Intermediate', rows: 16, cols: 16, mines: 40 },
  expert: { label: 'Expert', rows: 16, cols: 30, mines: 99 },
};

export function createGame(config = DIFFICULTIES.beginner, options = {}) {
  const rows = Number(config.rows);
  const cols = Number(config.cols);
  const mines = Number(config.mines);
  const cellCount = rows * cols;

  if (!Number.isInteger(rows) || rows <= 0) {
    throw new Error('rows must be a positive integer');
  }

  if (!Number.isInteger(cols) || cols <= 0) {
    throw new Error('cols must be a positive integer');
  }

  if (!Number.isInteger(mines) || mines < 0 || mines >= cellCount) {
    throw new Error('mines must be a non-negative integer smaller than the board');
  }

  const game = {
    rows,
    cols,
    mines,
    status: 'ready',
    cells: Array.from({ length: cellCount }, (_, index) => ({
      index,
      row: Math.floor(index / cols),
      col: index % cols,
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacentMines: 0,
    })),
    flagsUsed: 0,
    revealedSafeCells: 0,
    minesPlaced: false,
    random: options.random ?? Math.random,
  };

  if (options.minePositions) {
    placeFixedMines(game, options.minePositions);
  }

  return game;
}

export function getRemainingMines(game) {
  return game.mines - game.flagsUsed;
}

export function toggleFlag(game, index) {
  const cell = game.cells[index];

  if (!cell || cell.isRevealed || game.status === 'lost' || game.status === 'won') {
    return game;
  }

  cell.isFlagged = !cell.isFlagged;
  game.flagsUsed += cell.isFlagged ? 1 : -1;
  return game;
}

export function revealCell(game, index) {
  const cell = game.cells[index];

  if (!cell || cell.isFlagged || cell.isRevealed || game.status === 'lost' || game.status === 'won') {
    return game;
  }

  if (!game.minesPlaced) {
    placeRandomMines(game, index);
  }

  if (game.status === 'ready') {
    game.status = 'active';
  }

  if (cell.isMine) {
    cell.isRevealed = true;
    game.status = 'lost';
    revealAllMines(game);
    return game;
  }

  revealSafeArea(game, index);
  updateWinState(game);
  return game;
}

function placeFixedMines(game, minePositions) {
  const uniquePositions = new Set(minePositions);

  if (uniquePositions.size !== game.mines) {
    throw new Error('minePositions length must match the configured mine count');
  }

  for (const index of uniquePositions) {
    if (!game.cells[index]) {
      throw new Error('minePositions contains an invalid cell index');
    }

    game.cells[index].isMine = true;
  }

  game.minesPlaced = true;
  updateAdjacentCounts(game);
}

function placeRandomMines(game, safeIndex) {
  const protectedIndexes = new Set([
    safeIndex,
    ...getNeighborIndexes(game, safeIndex),
  ]);
  let available = game.cells
    .map((cell) => cell.index)
    .filter((index) => !protectedIndexes.has(index));

  if (available.length < game.mines) {
    available = game.cells
      .map((cell) => cell.index)
      .filter((index) => index !== safeIndex);
  }

  for (let placed = 0; placed < game.mines; placed += 1) {
    const nextIndex = Math.floor(game.random() * available.length);
    const [mineIndex] = available.splice(nextIndex, 1);
    game.cells[mineIndex].isMine = true;
  }

  game.minesPlaced = true;
  updateAdjacentCounts(game);
}

function updateAdjacentCounts(game) {
  for (const cell of game.cells) {
    cell.adjacentMines = getNeighborIndexes(game, cell.index)
      .filter((neighborIndex) => game.cells[neighborIndex].isMine)
      .length;
  }
}

function revealSafeArea(game, startIndex) {
  const queue = [startIndex];
  const visited = new Set();

  while (queue.length > 0) {
    const index = queue.shift();

    if (visited.has(index)) {
      continue;
    }

    visited.add(index);
    const cell = game.cells[index];

    if (!cell || cell.isMine || cell.isFlagged || cell.isRevealed) {
      continue;
    }

    cell.isRevealed = true;
    game.revealedSafeCells += 1;

    if (cell.adjacentMines === 0) {
      queue.push(...getNeighborIndexes(game, index));
    }
  }
}

function updateWinState(game) {
  const safeCellCount = game.cells.length - game.mines;

  if (game.revealedSafeCells === safeCellCount) {
    game.status = 'won';
  }
}

function revealAllMines(game) {
  for (const cell of game.cells) {
    if (cell.isMine) {
      cell.isRevealed = true;
    }
  }
}

function getNeighborIndexes(game, index) {
  const cell = game.cells[index];
  const neighbors = [];

  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
      if (rowOffset === 0 && colOffset === 0) {
        continue;
      }

      const row = cell.row + rowOffset;
      const col = cell.col + colOffset;

      if (row >= 0 && row < game.rows && col >= 0 && col < game.cols) {
        neighbors.push(row * game.cols + col);
      }
    }
  }

  return neighbors;
}
