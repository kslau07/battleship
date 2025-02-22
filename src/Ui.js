// Ui.js

import './reset.css';
import './global.css';
import './style.css';
import Game from './Game';
import populatePlaceShips from './ShipPlacement';
// import { setPlacementButtonsAndHandlers } from './ShipPlacement';

// const createGame = (gameOptions) => {
//   createGameGrids();
//   redrawGameGrids(gameObj);
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

const createGrids = () => {
  const template = document.querySelector('.template-game-grid').content;
  const gameGrids = template.querySelectorAll('.game-grid');
  gameGrids.forEach((gameGrid) => {
    const gridSize = 11; // 10 plus 1 to label axes

    // Create cells
    for (let i = 0; i < gridSize; i += 1) {
      for (let j = 0; j < gridSize; j += 1) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = `${i}`;
        cell.dataset.column = `${j}`;
        gameGrid.appendChild(cell);
        addAxisMarker(cell);
      }
    }
  });
};

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

// const populatePlacementGrid = () => {
//   const gameGrid = document.querySelector('.game-grid');
//   createGrid(gameGrid);
// };

function populateGame(gameInstance) {
  const readyCount = gameInstance.getReadyCount();

  if (readyCount !== 2) return;

  const mainDisplay = document.querySelector('.main-display');
  const gameGridOwn = mainDisplay.querySelector('.game-grid--own');

  mainDisplay.innerHTML = '';

  const template = document.querySelector('.template-take-turn').content;
  const gameDiv = template.querySelector('.take-turn');
  mainDisplay.replaceChildren(gameDiv);

  const takeTurnGridGroup = mainDisplay.querySelector('.take-turn__grid-group');
  const gameGridGuesses = mainDisplay.querySelector('.game-grid--guesses');
  takeTurnGridGroup.insertBefore(gameGridOwn, gameGridGuesses);

  mainDisplay
    .querySelectorAll('.game-grid')
    .forEach((grid) => grid.classList.add('take-turn'));
}

const initialize = () => {
  [1, 2].forEach(createShipImageElements);
  const gameInstance = new Game();
  createGrids();
  populateSelectOpponent(gameInstance);
};

// initialize(); // TODO: UNCOMMENT THIS LINE LATER

// TODO: DELETE ME - DEV ONLY
const testPopPlaceShips = () => {
  [1, 2].forEach(createShipImageElements);
  const gameInstance = new Game();
  createGrids();
  populatePlaceShips(gameInstance);

  // FIXME: DEV TEST DELETE ME
  const readyButton = document.querySelector('.menu__button--ready');
  readyButton.addEventListener('click', populateGame.bind(null, gameInstance));
};
testPopPlaceShips();
