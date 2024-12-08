// Ui.js

import './global.css';
import './style.css';
import Game from './Game';

const foo = document.querySelector('#new-game-button');

const createCellElement = (cellObj) => {
  const cellEl = document.createElement('div');
  cellEl.className = 'cell';
  cellEl.textContent = cellObj.ship === 'none' ? '' : cellObj.ship.getName();
  return cellEl;
};

const createRowElement = (rowObj) => {
  const rowEl = document.createElement('div');
  rowEl.className = 'row';
  rowObj.forEach((cellObj) => {
    const cellEl = createCellElement(cellObj);
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

// FIXME: DELETE ME, DEVELOPMENT TOOL
// Press 't' to invoke createGame()
document.onkeyup = function () {
  var e = e || window.event; // For IE to cover IEs window event-object
  if (e.which == 84) {
    createGame();
    return false;
  }
};

// FIXME: DELETE ME, DEVELOPMENT TOOL
createGame();
