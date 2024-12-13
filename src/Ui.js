// Ui.js

import './global.css';
import './style.css';
import Game from './Game';

const createBaseGrid = () => {
  const grid = document.createElement('div');
  const gridSize = 10;

  for (let rowIdx = 0; rowIdx < gridSize; rowIdx += 1) {
    for (let colIdx = 0; colIdx < gridSize; colIdx += 1) {
      const cellContainer = document.createElement('div');
      cellContainer.classList.add('cell-container', `cc-${rowIdx}-${colIdx}`);
      grid.appendChild(cellContainer);
    }
  }

  grid.classList.add('grid');
  return grid;
};

const createGameGrids = (gameObj) => {
  const gridContainers = document.querySelectorAll('.grid-container');

  gridContainers.forEach((container) => {
    const baseGrid = createBaseGrid();
    container.appendChild(baseGrid);
  });
};

const createOwnCell = (cellCtr, cellObj) => {
  const cellDiv = document.createElement('div');
  cellDiv.classList.add('cell', 'own');
  cellDiv.textContent = cellObj.ship === 'none' ? '' : cellObj.ship.getName();
  cellCtr.appendChild(cellDiv);
};

// TODO: own-grid will eventually have to display hits/misses from other player

const redrawOwnGrid = (gameObj) => {
  const cellObjects = gameObj.getCurPlayer().getGameboard().getGrid().flat();
  const ownGridElem = document.querySelector('.grid-container.own')
    .childNodes[0];

  const ownCellContainers = ownGridElem.childNodes;
  ownCellContainers.forEach((cellCtr, i) =>
    createOwnCell(cellCtr, cellObjects[i]),
  );
};

const createGuessCell = (cellCtr, cellObj) => {
  const cellBtn = document.createElement('button');
  cellBtn.classList.add('cell', 'guess');

  // cellBtn.textContent = cellObj.ship === 'none' ? '' : cellObj.ship.getName();
  cellCtr.appendChild(cellBtn);
};

const redrawGuessGrid = (gameObj) => {
  const cellObjects = gameObj.getNotCurPlayer().getGameboard().getGrid().flat();
  const guessGridElem = document.querySelector('.grid-container.guess')
    .childNodes[0];

  const guessCellContainers = guessGridElem.childNodes;
  guessCellContainers.forEach((cellCtr, i) =>
    createGuessCell(cellCtr, cellObjects[i]),
  );
};

const populateGameGrids = (gameObj) => {
  redrawOwnGrid(gameObj);
  redrawGuessGrid(gameObj);

  // const gridContainers = document.querySelectorAll('.grid-container');
  //
  // let grids = [];
  // gridContainers.forEach((gridCtr) => {
  //   grids.push(gridCtr.childNodes[0]);
  // });
  //
  // grids.forEach((grid) => {
  //   console.log(grid.childNodes);
  // });
};

const createGame = () => {
  const gameObj = new Game();
  createGameGrids();
  populateGameGrids(gameObj);
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

createGame(); // FIXME: DELETE ME, DEVELOPMENT TOOL
