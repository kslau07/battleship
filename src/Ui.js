// Ui.js

import './reset.css';
import './global.css';
import './style.css';
import Game from './Game';

const endTurn = (gameObj) => {
  gameObj.endTurn();
  const isGameOver = gameObj.isGameOver();

  if (isGameOver === true) {
    console.log('Game over!');
  } else {
    console.log('not gameover!'); // FIXME: DELETE ME

    redrawGameGrids(gameObj);
  }
};

// Each grid column will contain 10 cells
const createGridColumns = () => {
  const grid = document.createElement('div');
  const gridSize = 10;

  for (let rowIdx = 0; rowIdx < gridSize; rowIdx += 1) {
    for (let colIdx = 0; colIdx < gridSize; colIdx += 1) {
      const cell = document.createElement('div');
      cell.classList.add('cell', `cell-${rowIdx}-${colIdx}`);
      grid.appendChild(cell);
    }
  }

  grid.classList.add('grid');
  return grid;
};

const createGameGrids = (gameObj) => {
  // TODO: Retrieve grids from templates
  // const gridContainers = document.querySelectorAll('.grid-container');
  // const gameGrids = document.querySelectorAll('.game-grid');

  gameGrids.forEach((grid) => {
    const gridColumns = createGridColumns();
    grid.appendChild(gridColumns);
  });
};

const createOwnCell = (cellCtr, cellObj) => {
  const cellDiv = document.createElement('div');
  cellDiv.classList.add('cell', 'own');
  cellDiv.textContent = cellObj.ship === 'none' ? '' : cellObj.ship.getName();
  cellCtr.appendChild(cellDiv);
};

const removeChildNodes = (parentEl) => {
  while (parentEl.firstChild) {
    parentEl.removeChild(parentEl.firstChild);
  }
};

const redrawOwnGrid = (gameObj) => {
  const cellObjects = gameObj.getCurPlayer().getGameboard().getGrid().flat();
  const ownGridElem = document.querySelector('.grid-container.own')
    .childNodes[0];

  const ownCellContainers = ownGridElem.childNodes;
  ownCellContainers.forEach((cellCtr, i) => {
    removeChildNodes(cellCtr);
    createOwnCell(cellCtr, cellObjects[i]);
  });
};

// FIXME: DELETE BELOW, TESTING ONLY
const revealShip = (cellObj) => {
  let content;
  if (cellObj.ship !== 'none') {
    content = '?';
  } else {
    content = '.';
  }
  return content;
};

const redrawCell = (cellBtn, cellObj) => {
  cellBtn.textContent = '';
  const isAttacked = cellObj.isAttacked();

  let content;
  if (isAttacked === false) {
    // FIXME: DELETE BELOW, TESTING ONLY
    content = revealShip(cellObj);
    // content = '-';
  } else if (isAttacked === true) {
    cellBtn.classList.add('attacked');
    cellBtn.disabled = true;

    if (cellObj.ship === 'none') {
      content = 'miss';
    } else {
      content = 'hit!';
    }
  }

  cellBtn.textContent = content;
};

const attackCellAndEndTurn = (gameObj, coords, cellBtn, cellObj) => {
  const curGuessBoard = gameObj.getCurEnemy().getGameboard();
  curGuessBoard.receiveAttack(coords);
  redrawCell(cellBtn, cellObj);
  endTurn(gameObj);
};

const createGuessCell = (gameObj, cellCtr, cellObj) => {
  const cellBtn = document.createElement('button');
  const coords = [cellObj.coords.rowIndex, cellObj.coords.columnIndex];
  cellBtn.classList.add('cell', 'guess', `cell-${coords[0]}-${coords[1]}`);

  cellBtn.addEventListener('click', () => {
    attackCellAndEndTurn(gameObj, coords, cellBtn, cellObj);
  });

  redrawCell(cellBtn, cellObj);
  cellCtr.appendChild(cellBtn);
};

const redrawGuessGrid = (gameObj) => {
  const cellObjects = gameObj.getCurEnemy().getGameboard().getGrid().flat();
  const guessGridElem = document.querySelector('.grid-container.guess')
    .childNodes[0];

  const guessCellContainers = guessGridElem.childNodes;
  guessCellContainers.forEach((cellCtr, i) => {
    removeChildNodes(cellCtr);
    createGuessCell(gameObj, cellCtr, cellObjects[i]);
  });
};

const redrawGameGrids = (gameObj) => {
  redrawOwnGrid(gameObj);
  redrawGuessGrid(gameObj);
};

const createGame = (gameOptions) => {
  // const { opponentType, player1Name, player2Name } = gameOptions;
  // const p1Instance = Game.createPlayer(player1Name);
  // const p2Instance = Game.createPlayer(player2Name);
  // const gameObj = new Game(p1Instance, p2Instance);

  createGameGrids();
  redrawGameGrids(gameObj);
};

// const createHexPattern = (menuFrag) => {
//   const template = document.querySelector('.hex-pattern-template');
//   const hexFrag = template.content.cloneNode(true);
//   const hexPatternCtr = hexFrag.querySelector('.hex-pattern-container');
//
//   // Add several .hex-column-container to create honeycomb pattern
//   for (let i = 0; i < 20; i += 1) {
//     const clone = hexFrag
//       .querySelector('.hex-column-container')
//       .cloneNode(true);
//     hexPatternCtr.appendChild(clone);
//
//     const leftOffset = 43;
//     const bottomOffset = -22;
//
//     clone.style.left = `${(i + 1) * leftOffset - 22}px`;
//
//     if (i % 2 === 0) {
//       clone.style.bottom = `${bottomOffset}px`;
//     }
//   }
//
//   const menuCtr = menuFrag.querySelector('.menu-container');
//   menuCtr.appendChild(hexPatternCtr);
// };

const addAxisMarker = (cell) => {
  const className = cell.className.split(' ')[1];
  const row = className.split('-')[1];
  const column = className.split('-')[2];
  cell.classList.add('axis-marker');

  if (row === '0' && column === '0') return;

  let marker;
  if (row === '0') {
    marker = column;
  } else if (column === '0') {
    const keycode = Number(row) + 65;
    marker = String.fromCharCode(keycode);
  }

  const axisMarkerText = document.createElement('span');
  axisMarkerText.textContent = marker;
  axisMarkerText.classList.add('axis-marker-text');
  cell.appendChild(axisMarkerText);
};

const createGrid = (gridContainer) => {
  const totalRows = 11; // NOTE: 1 extra row/cell for axis labels for UI
  const cellsPerRow = 11;

  for (let i = 0; i < totalRows; i += 1) {
    const column = document.createElement('div');
    column.classList.add('column', `column-${i}`);
    gridContainer.appendChild(column);

    for (let j = 0; j < cellsPerRow; j += 1) {
      const cell = document.createElement('div');
      cell.classList.add('cell', `cell-${i}-${j}`);
      column.appendChild(cell);
      addAxisMarker(cell);
    }
  }
};

const populatePlacementGrid = () => {
  const placementGrid = document.querySelector('.placement__grid');
  createGrid(placementGrid);
};

const populatePlacementBank = () => {
  const placementBank = document.querySelector('.placement__bank');
};

function populatePlaceShips(gameInstance) {
  // gameInstance.placeShipsRandomlyForPlayer(gameInstance.getPlayer2());
  const mainDisplay = document.querySelector('.main-display');
  const template = document.querySelector('.template-placement').content;
  const placeShipsDiv = template.querySelector('.placement');

  mainDisplay.replaceChildren(placeShipsDiv);
  populatePlacementGrid();
  populatePlacementBank();
}

function populateInputNames(gameInstance) {
  const mainDisplay = document.querySelector('.main-display');
  const template = document.querySelector('.template_menu_input_names').content;
  const inputNamesDiv = template.querySelector('.menu_input_names');
  const continueButton = inputNamesDiv.querySelector('.menu__button--continue');
  const player1Input = inputNamesDiv.querySelector(
    '.menu__text-input--player1',
  );
  const player2Input = inputNamesDiv.querySelector(
    '.menu__text-input--player2',
  );

  continueButton.addEventListener('click', () => {
    gameInstance.getPlayer1().setName(player1Input.value);
    gameInstance.getPlayer2().setName(player2Input.value);
    populatePlaceShips(gameInstance);
  });
  mainDisplay.replaceChildren(inputNamesDiv);
}

const populateSelectOpponent = (gameInstance) => {
  const mainDisplay = document.querySelector('.main-display');
  const template = document.querySelector(
    '.template_menu_select_opponent',
  ).content;
  const selectOpponentDiv = template.querySelector('.menu_select_opponent');

  const buttons = template.querySelectorAll('.menu__button--opponent');
  buttons.forEach((button) => {
    button.addEventListener(
      'click',
      populateInputNames.bind(button, gameInstance),
    );
  });

  mainDisplay.replaceChildren(selectOpponentDiv);
};

const loadMenu = () => {
  const gameInstance = new Game();
  populateSelectOpponent(gameInstance);
};

// loadMenu(); // TODO: UNCOMMENT THIS LINE LATER

// TODO: DELETE ME - DEV ONLY
const testPopPlaceShips = () => {
  const gameInstance = new Game();
  populatePlaceShips(gameInstance);
};
testPopPlaceShips();
