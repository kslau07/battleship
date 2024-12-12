// Ui.js

import './global.css';
import './style.css';
import Game from './Game';

const createOwnCell = (cellObj) => {
  const cellDiv = document.createElement('div');
  cellDiv.className = 'cell own';
  cellDiv.textContent = cellObj.ship === 'none' ? '' : cellObj.ship.getName();
  return cellDiv;
};

const attackAndUpdateCell = (gameObj, playerObj, cellObj, cellBtn) => {
  cellObj.attack();

  if (cellObj.isAttacked() === true && cellObj.ship === 'none') {
    cellBtn.textContent = 'miss';
  } else if (cellObj.isAttacked() === true && cellObj.ship !== 'none') {
    cellBtn.textContent = 'hit!';
    cellBtn.style.background = 'red';
  }

  cellBtn.disabled = true;

  // TODO: Check end of game
};

const createEnemyCell = (gameObj, playerObj, cellObj) => {
  const cellBtn = document.createElement('button');
  cellBtn.className = `cell cell-${cellObj.rowIndex}-${cellObj.columnIndex}`;
  cellBtn.textContent = '';
  cellBtn.addEventListener('click', () => {
    attackAndUpdateCell(gameObj, playerObj, cellObj, cellBtn);
  });
  return cellBtn;
};

const createCellElement = (gameObj, playerObj, side, cellObj) => {
  let cellEl;

  if (side === 'own') {
    cellEl = createOwnCell(cellObj);
  } else if (side === 'enemy') {
    cellEl = createEnemyCell(gameObj, playerObj, cellObj);
  }

  return cellEl;
};

const createRowElement = (gameObj, playerObj, side, rowObj) => {
  const rowEl = document.createElement('div');
  rowEl.classList.add('row');

  rowObj.forEach((cellObj) => {
    const cellEl = createCellElement(gameObj, playerObj, side, cellObj);
    // cellEl.classList.add(`column-${columnIndex}`);// FIXME: ADD COORDS INFO AS CLASS
    rowEl.appendChild(cellEl);
  });
  return rowEl;
};

const createGridElement = (gameObj, playerObj, side) => {
  const playerGrid = playerObj.getGameboard().getGrid();
  const gridEl = document.createElement('div');
  gridEl.className = 'grid';

  playerGrid.forEach((rowObj, rowIndex) => {
    const rowEl = createRowElement(gameObj, playerObj, side, rowObj);
    rowEl.classList.add(`row-${rowIndex}`);

    gridEl.appendChild(rowEl);
  });

  return gridEl;
};

const populateGameboard = (gameObj, playerObj, side) => {
  const gridContainer = document.getElementById(
    `${playerObj.getName()}-${side}-grid`,
  );

  let gridElement;
  if (side === 'own') {
    gridElement = createGridElement(gameObj, playerObj, side);
  } else if (side === 'enemy') {
    const enemyObj = gameObj.getOppositePlayer(playerObj);
    gridElement = createGridElement(gameObj, enemyObj, side);
  }

  gridContainer.appendChild(gridElement);
};

const populateGrids = (gameObj) => {
  const players = gameObj.getPlayers();
  players.forEach((player) => {
    populateGameboard(gameObj, player, 'own');
    populateGameboard(gameObj, player, 'enemy');
  });
};

const createGame = () => {
  const game = new Game();
  const player1 = game.getPlayer1();
  const player2 = game.getPlayer2();
  populateGrids(game);
};

const createGameButton = document.querySelector('#new-game-button');
createGameButton.addEventListener('click', createGame);

document.onkeyup = function () {
  // FIXME: DELETE ME, DEVELOPMENT TOOL
  // Press 't' to invoke createGame()
  var e = e || window.event; // For IE to cover IEs window event-object
  if (e.which == 84) {
    createGame();
    return false;
  }
};

// createGame(); // FIXME: DELETE ME, DEVELOPMENT TOOL
