import {
  DIFFICULTIES,
  createGame,
  getRemainingMines,
  revealCell,
  toggleFlag,
} from './game.mjs';

const difficultySelect = document.querySelector('#difficulty-select');
const restartButton = document.querySelector('#restart-button');
const flagModeButton = document.querySelector('#flag-mode-button');
const mineCount = document.querySelector('#mine-count');
const timer = document.querySelector('#timer');
const statusMessage = document.querySelector('#status-message');
const board = document.querySelector('#board');

const statusText = {
  ready: '选择一个格子开始。',
  active: '小心推进，别踩到雷。',
  won: '胜利！所有安全格都已翻开。',
  lost: '踩雷了，重新开始再来一局。',
};

let game;
let seconds = 0;
let timerId = null;
let flagMode = false;

restartButton.addEventListener('click', startGame);
difficultySelect.addEventListener('change', startGame);
flagModeButton.addEventListener('click', () => {
  flagMode = !flagMode;
  flagModeButton.setAttribute('aria-pressed', String(flagMode));
});

startGame();

function startGame() {
  stopTimer();
  seconds = 0;
  flagMode = false;
  flagModeButton.setAttribute('aria-pressed', 'false');
  game = createGame(DIFFICULTIES[difficultySelect.value]);
  render();
}

function startTimer() {
  if (timerId) {
    return;
  }

  timerId = window.setInterval(() => {
    seconds += 1;
    updateHud();
  }, 1000);
}

function stopTimer() {
  if (timerId) {
    window.clearInterval(timerId);
    timerId = null;
  }
}

function handleReveal(index) {
  if (game.status === 'ready') {
    startTimer();
  }

  revealCell(game, index);

  if (game.status === 'won' || game.status === 'lost') {
    stopTimer();
  }

  render();
}

function handleFlag(index) {
  toggleFlag(game, index);
  render();
}

function render() {
  updateHud();
  renderBoard();
}

function updateHud() {
  mineCount.textContent = String(getRemainingMines(game)).padStart(3, '0');
  timer.textContent = String(seconds).padStart(3, '0');
  statusMessage.textContent = statusText[game.status];
  statusMessage.classList.toggle('is-won', game.status === 'won');
  statusMessage.classList.toggle('is-lost', game.status === 'lost');
}

function renderBoard() {
  board.innerHTML = '';
  board.style.setProperty('--cols', game.cols);
  board.setAttribute('aria-rowcount', String(game.rows));
  board.setAttribute('aria-colcount', String(game.cols));

  for (const cell of game.cells) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cell';
    button.setAttribute('role', 'gridcell');
    button.setAttribute('aria-label', getCellLabel(cell));
    button.dataset.count = String(cell.adjacentMines);

    if (cell.isRevealed) {
      button.classList.add('is-revealed');
      button.disabled = true;
      button.textContent = getRevealedText(cell);
    } else if (cell.isFlagged) {
      button.classList.add('is-flagged');
      button.textContent = 'F';
    }

    if (cell.isMine && cell.isRevealed) {
      button.classList.add('is-mine');
    }

    button.addEventListener('click', () => {
      if (flagMode) {
        handleFlag(cell.index);
      } else {
        handleReveal(cell.index);
      }
    });

    button.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      handleFlag(cell.index);
    });

    board.append(button);
  }
}

function getRevealedText(cell) {
  if (cell.isMine) {
    return 'M';
  }

  return cell.adjacentMines > 0 ? String(cell.adjacentMines) : '';
}

function getCellLabel(cell) {
  const position = `第 ${cell.row + 1} 行，第 ${cell.col + 1} 列`;

  if (cell.isFlagged) {
    return `${position}，已标旗`;
  }

  if (!cell.isRevealed) {
    return `${position}，未翻开`;
  }

  if (cell.isMine) {
    return `${position}，地雷`;
  }

  if (cell.adjacentMines === 0) {
    return `${position}，空白`;
  }

  return `${position}，周围有 ${cell.adjacentMines} 个地雷`;
}
