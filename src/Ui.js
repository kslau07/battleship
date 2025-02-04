// Ui.js

import './reset.css';
import './global.css';
import './style.css';
import Game from './Game';
import { addDragAndDropHandlers } from './DragAndDrop';

// const endTurn = (gameObj) => {
//   gameObj.endTurn();
//   const isGameOver = gameObj.isGameOver();
//
//   if (isGameOver === true) {
//     console.log('Game over!');
//   } else {
//     console.log('not gameover!'); // FIXME: DELETE ME
//
//     redrawGameGrids(gameObj);
//   }
// };

// Each grid column will contain 10 cells
// const createGridColumns = () => {
//   const grid = document.createElement('div');
//   const gridSize = 10;
//
//   for (let rowIdx = 0; rowIdx < gridSize; rowIdx += 1) {
//     for (let colIdx = 0; colIdx < gridSize; colIdx += 1) {
//       const cell = document.createElement('div');
//       cell.classList.add('cell');
//       cell.dataset.id = `cell-${rowIdx}-{colIdx}`;
//       grid.appendChild(cell);
//     }
//   }
//
//   grid.classList.add('grid');
//   return grid;
// };

// const createGameGrids = (gameObj) => {
//   // TODO: Retrieve grids from templates
//   // const gridContainers = document.querySelectorAll('.grid-container');
//   // const gameGrids = document.querySelectorAll('.game-grid');
//
//   gameGrids.forEach((grid) => {
//     const gridColumns = createGridColumns();
//     grid.appendChild(gridColumns);
//   });
// };

// const createOwnCell = (cellCtr, cellObj) => {
//   const cellDiv = document.createElement('div');
//   cellDiv.classList.add('cell', 'own');
//   cellDiv.textContent = cellObj.ship === 'none' ? '' : cellObj.ship.getName();
//   cellCtr.appendChild(cellDiv);
// };
//
// const removeChildNodes = (parentEl) => {
//   while (parentEl.firstChild) {
//     parentEl.removeChild(parentEl.firstChild);
//   }
// };

// const redrawOwnGrid = (gameObj) => {
//   const cellObjects = gameObj.getCurPlayer().getGameboard().getGrid().flat();
//   const ownGridElem = document.querySelector('.grid-container.own')
//     .childNodes[0];
//
//   const ownCellContainers = ownGridElem.childNodes;
//   ownCellContainers.forEach((cellCtr, i) => {
//     removeChildNodes(cellCtr);
//     createOwnCell(cellCtr, cellObjects[i]);
//   });
// };

// // FIXME: DELETE BELOW, TESTING ONLY
// const revealShip = (cellObj) => {
//   let content;
//   if (cellObj.ship !== 'none') {
//     content = '?';
//   } else {
//     content = '.';
//   }
//   return content;
// };

// const redrawCell = (cellBtn, cellObj) => {
//   cellBtn.textContent = '';
//   const isAttacked = cellObj.isAttacked();
//
//   let content;
//   if (isAttacked === false) {
//     // FIXME: DELETE BELOW, TESTING ONLY
//     content = revealShip(cellObj);
//     // content = '-';
//   } else if (isAttacked === true) {
//     cellBtn.classList.add('attacked');
//     cellBtn.disabled = true;
//
//     if (cellObj.ship === 'none') {
//       content = 'miss';
//     } else {
//       content = 'hit!';
//     }
//   }
//
//   cellBtn.textContent = content;
// };

// const attackCellAndEndTurn = (gameObj, coords, cellBtn, cellObj) => {
//   const curGuessBoard = gameObj.getCurEnemy().getGameboard();
//   curGuessBoard.receiveAttack(coords);
//   redrawCell(cellBtn, cellObj);
//   endTurn(gameObj);
// };

// const createGuessCell = (gameObj, cellCtr, cellObj) => {
//   const cellBtn = document.createElement('button');
//   const coords = [cellObj.coords.rowIndex, cellObj.coords.columnIndex];
//   cellBtn.classList.add('cell', 'guess', `cell-${coords[0]}-${coords[1]}`);
//
//   cellBtn.addEventListener('click', () => {
//     attackCellAndEndTurn(gameObj, coords, cellBtn, cellObj);
//   });
//
//   redrawCell(cellBtn, cellObj);
//   cellCtr.appendChild(cellBtn);
// };
//
// const redrawGuessGrid = (gameObj) => {
//   const cellObjects = gameObj.getCurEnemy().getGameboard().getGrid().flat();
//   const guessGridElem = document.querySelector('.grid-container.guess')
//     .childNodes[0];
//
//   const guessCellContainers = guessGridElem.childNodes;
//   guessCellContainers.forEach((cellCtr, i) => {
//     removeChildNodes(cellCtr);
//     createGuessCell(gameObj, cellCtr, cellObjects[i]);
//   });
// };

// const redrawGameGrids = (gameObj) => {
//   redrawOwnGrid(gameObj);
//   redrawGuessGrid(gameObj);
// };

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
  const row = cell.dataset.row;
  const column = cell.dataset.column;

  if (row !== '0' && column !== '0') return; // No marker needed

  cell.classList.add('axis-marker');
  let marker;
  if (row === '0') {
    marker = column;
  } else if (column === '0') {
    const keycode = Number(row) + 64;
    marker = String.fromCharCode(keycode);
  }

  const axisMarkerText = document.createElement('span');
  axisMarkerText.textContent = marker;
  axisMarkerText.classList.add('axis-marker-text');
  cell.appendChild(axisMarkerText);
};

const createGrid = (gridContainer) => {
  const totalRows = 11; // NOTE: 1 extra row & col for axis markers
  const cellsPerRow = 11;

  // Create row elems
  for (let i = 0; i < totalRows; i += 1) {
    const row = document.createElement('div');
    row.classList.add('row');
    row.dataset.row = `${i}`;
    gridContainer.appendChild(row);

    // Create cells, child elems of each row
    for (let j = 0; j < cellsPerRow; j += 1) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = `${i}`;
      cell.dataset.column = `${j}`;
      row.appendChild(cell);
      addAxisMarker(cell);
    }
  }
};

const populatePlacementGrid = () => {
  const placementGrid = document.querySelector('.placement__grid');
  createGrid(placementGrid);
};

const populatePlacementBank = (gameInstance) => {
  // TODO: Append the current player's bank, use gameInstance to find current player
  const template = document.querySelector('.template-ships--player1').content;
  const images = template.querySelector('.ships--player1');
  const placementBankBody = document.querySelector('.placement__bank-body');
  placementBankBody.appendChild(images);
};

// Add listener for "rotate", which toggles images between normal and rotated ships
// HACK: This function may be too nested
function setRotateButton() {
  const rotateShipsBtn = this.querySelector('.placement__button--rotate-ships');

  rotateShipsBtn.addEventListener('click', () => {
    const ships = this.querySelector('.ships');
    const rotatedState = ships.classList.contains('rotated');

    this.querySelectorAll('.ship-wrapper').forEach((shipWrapper) => {
      if (rotatedState === false) {
        ships.classList.add('rotated');

        // FIXME: DELETE ME
        // shipWrapper.querySelector('.ship-rotated-image').style.display = 'none';

        // FIXME: UNCOMMENT BELOW
        shipWrapper.querySelector('.ship-rotated-image').style.display =
          'block';

        shipWrapper.querySelector('.ship-image').style.display = 'none';
        shipWrapper.dataset.rotated = 'true';
      } else {
        ships.classList.remove('rotated');
        shipWrapper.querySelector('.ship-rotated-image').style.display = 'none';
        shipWrapper.querySelector('.ship-image').style.display = 'block';
        shipWrapper.dataset.rotated = 'false';
      }
    });
  });
}

function populatePlaceShips(gameInstance) {
  const mainDisplay = document.querySelector('.main-display');
  const template = document.querySelector('.template-placement').content;
  const placementDiv = template.querySelector('.placement');
  const playerNameSpan = placementDiv.querySelector('.player-name');

  playerNameSpan.textContent = gameInstance.getPlayer1().getName(); // NOTE: WILL NEED TO GET BOTH PLAYERS HERE
  mainDisplay.replaceChildren(placementDiv);
  populatePlacementGrid();
  populatePlacementBank(gameInstance);
  setRotateButton.apply(placementDiv);
  addDragAndDropHandlers();
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

// Import ship images and append ship elements to template for later use
const createShipImageElements = (playerNum) => {
  const shipsSvgs = require.context('./assets/images/ships/', false);
  const getShipSvg = (fname) => shipsSvgs(`./${fname}`);
  const rotatedShipsSvgs = require.context(
    './assets/images/rotated-ships/',
    false,
  ); // For rotated images
  const getRotatedShipSvg = (fname) => rotatedShipsSvgs(`./${fname}`); // For rotated images
  const partialFileNames = [
    'Carrier',
    'Battleship',
    'Destroyer',
    'Submarine',
    'PatrolBoat',
  ];

  partialFileNames.forEach((fname) => {
    const template = document.querySelector(
      `.template-ships--player${playerNum}`,
    ).content;

    const ships = template.querySelector(`.ships--player${playerNum}`);
    const shipWrapper = document.createElement('div');
    shipWrapper.classList.add('ship-wrapper');
    shipWrapper.dataset.player = `player${playerNum}`;
    shipWrapper.dataset.ship = `${fname}`;
    shipWrapper.dataset.rotated = 'false';

    // Ships (non-rotated)
    const shipSvg = getShipSvg(`${fname}-Player${playerNum}.svg`);
    const shipElem = document.createElement('img');
    shipElem.classList.add('ship-image');
    shipElem.src = shipSvg;

    // Rotated ships
    const rotatedShipSvg = getRotatedShipSvg(
      `${fname}-Player${playerNum}-rotated.svg`,
    );
    const rotatedShipElem = document.createElement('img');
    rotatedShipElem.classList.add('ship-rotated-image');
    rotatedShipElem.src = rotatedShipSvg;

    shipWrapper.appendChild(shipElem);
    shipWrapper.appendChild(rotatedShipElem);
    ships.appendChild(shipWrapper);
  });
};

const initialize = () => {
  [1, 2].forEach(createShipImageElements);
  const gameInstance = new Game();
  populateSelectOpponent(gameInstance);
};

// initialize(); // TODO: UNCOMMENT THIS LINE LATER

// TODO: DELETE ME - DEV ONLY
const testPopPlaceShips = () => {
  [1, 2].forEach(createShipImageElements);
  const gameInstance = new Game();
  populatePlaceShips(gameInstance);
};
testPopPlaceShips();
