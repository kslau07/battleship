// Ui.js

import './global.css';
import './style.css';
import Game from './Game';

const foo = document.querySelector('#new-game-button');

const createCellElement = () => {
  const cellEl = document.createElement('div');
  cellEl.className = 'cell';
  return cellEl;
};

const createRowElement = (row) => {
  const rowEl = document.createElement('div');
  rowEl.className = 'row';
  row.forEach((cell) => {
    const cellEl = createCellElement();
    rowEl.appendChild(cellEl);
  });
  return rowEl;
};

const createGridElement = (playerGrid) => {
  const gridEl = document.createElement('div');
  gridEl.className = 'grid';

  playerGrid.forEach((row) => {
    const rowEl = createRowElement(row);
    gridEl.appendChild(rowEl);
  });

  return gridEl;
};

const createGame = () => {
  const game = new Game();
  const playerGrid = game.getPlayer1().getGameboard().getGrid();
  const gridContainer = document.querySelector('.grid-container');
  const gridEl = createGridElement(playerGrid);
  gridContainer.appendChild(gridEl);
};

foo.addEventListener('click', createGame);

// FIXME: DELETE ME, TESTING
// Press 't' to invoke createGame()
document.onkeyup = function () {
  var e = e || window.event; // For IE to cover IEs window event-object
  if (e.which == 84) {
    createGame();
    return false;
  }
};
