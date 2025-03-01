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
  const template = document.querySelector('.template-game-grids').content;
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

function addTorpedoAnimation__dev() {
  const grid = document.querySelector('.game-grid--guesses');
  const torpedo = document.createElement('div');
  torpedo.classList.add('torpedo');
  const torpedoImage = require('./assets/images/other/torpedo.svg');
  const torpedoImageElem = document.createElement('img');
  torpedoImageElem.classList.add('torpedo-image');
  torpedoImageElem.src = torpedoImage;
  torpedo.appendChild(torpedoImageElem);
  grid.appendChild(torpedo);

  const animation = torpedo.animate(
    [
      { offset: 0, transform: 'none' },
      { offset: 0.25, transform: 'translate(200px, 0)' },
      { offset: 0.5, transform: 'translate(200px, 200px)' },
      { offset: 0.75, transform: 'translate(0, 200px)' },
      { offset: 1, transform: 'none' },
    ],
    {
      delay: 500,
      endDelay: 0,
      iterationStart: 0,
      iterations: 1,
      duration: 1000,
      direction: 'normal',
      easing: 'cubic-bezier(0.6, 0, 1, 0.6)',
    },
  );
}

function addTorpedoAnimation() {
  // Add torpedo image
  const grid = document.querySelector('.game-grid--guesses');
  const torpedo = document.createElement('div');
  torpedo.classList.add('torpedo');
  const torpedoImage = require('./assets/images/other/torpedo.svg');
  const torpedoImageElem = document.createElement('img');
  torpedoImageElem.classList.add('torpedo-image');
  torpedoImageElem.src = torpedoImage;
  torpedo.appendChild(torpedoImageElem);
  grid.appendChild(torpedo);

  const gridBounds = grid.getBoundingClientRect();
  const torpedoBounds = torpedo.getBoundingClientRect();
  const centerTorpedo = torpedoBounds.width / 2;

  // TODO: MAKE TORPEDO APPEAR AT BOTTOM OF CURSOR
  grid.addEventListener('click', (event) => {
    // Torpedo animation
    const bounds = grid.getBoundingClientRect();
    const torpedo = grid.querySelector('.torpedo');

    // Find angle of right triangle after finding adj, opp and hyp sides of said triangle
    const ptA = bounds.y - bounds.y;
    const ptB = event.clientX - bounds.x;
    const ptC = event.clientY - bounds.y;
    const adj = ptC;
    const opp = ptB;
    const hyp = Math.hypot(adj, opp);

    const offsetDeg = (Math.asin(opp / hyp) * 180) / Math.PI;
    const baseDeg = 185;
    const targetDeg = baseDeg - offsetDeg;

    const offsetX = 62;
    const offsetY = 62;
    const targetX = event.clientX - bounds.x - offsetX;
    const targetY = event.clientY - bounds.y - offsetY;

    const duration = hyp * 0.3 + 600; // Use hypotenuse of triangle to vary duration
    const animation = torpedo.animate(
      [
        { offset: 0, opacity: 0, transform: 'translateX(-75px)' },
        {
          offset: 0.2,
          opacity: 1,
          transform: 'translateX(0px) rotateZ(0deg)',
        },
        {
          offset: 0.4,
          opacity: 1,
          transform: `translateX(0px) translateY(0px) rotateZ(${targetDeg}deg)`,
        },
        {
          offset: 0.6,
          opacity: 1,
          transform: `translateX(0px) translateY(0px) rotateZ(${targetDeg}deg)`,
        },
        {
          offset: 1,
          opacity: 1,
          transform: `translateX(${targetX}px) translateY(${targetY}px) rotateZ(${targetDeg}deg)`,
        },
      ],
      {
        delay: 0,
        endDelay: 0,
        fill: 'both',
        duration: duration,
        direction: 'normal',
        easing: 'ease-in',
      },
    );
  });
}

// const populatePlacementGrid = () => {
//   const gameGrid = document.querySelector('.game-grid');
//   createGrid(gameGrid);
// };

// Guesses-grid shows full width and length lines that follow cursor
function addCrosshairs() {
  const grid = document.querySelector('.game-grid--guesses');

  const crosshairX = document.createElement('div');
  const crosshairY = document.createElement('div');
  crosshairX.classList.add('crosshairX');
  crosshairY.classList.add('crosshairY');
  grid.appendChild(crosshairX);
  grid.appendChild(crosshairY);

  const bounds = grid.getBoundingClientRect();

  grid.addEventListener('mousemove', (event) => {
    crosshairX.setAttribute('style', `top: ${event.clientY - bounds.y}px;`);
    crosshairY.setAttribute('style', `left: ${event.clientX - bounds.x - 2}px`);
  });
}

function populateGame(gameInstance) {
  const readyCount = gameInstance.getReadyCount();

  if (readyCount !== 2) return;

  const mainDisplay = document.querySelector('.main-display');
  const gameGridOwn = mainDisplay.querySelector('.game-grid--own');
  const gameGridsTemplate = document.querySelector(
    '.template-game-grids',
  ).content;
  const gameGridGuesses = gameGridsTemplate.querySelector(
    '.game-grid--guesses',
  );

  mainDisplay.innerHTML = '';

  const template = document.querySelector('.template-take-turn').content;
  const gameDiv = template.querySelector('.take-turn');
  mainDisplay.replaceChildren(gameDiv);

  const takeTurnGridGroup = mainDisplay.querySelector('.take-turn__grid-group');
  takeTurnGridGroup.appendChild(gameGridGuesses);
  takeTurnGridGroup.appendChild(gameGridOwn);
  // const gameGridGuesses = mainDisplay.querySelector('.game-grid--guesses');
  // takeTurnGridGroup.insertBefore(gameGridOwn, gameGridGuesses);

  mainDisplay
    .querySelectorAll('.game-grid')
    .forEach((grid) => grid.classList.add('current-turn'));

  addCrosshairs();
  addTorpedoAnimation();

  gameGridGuesses.addEventListener('click', () => {
    const cell = event.target.closest('.cell');
    if (!cell) return;

    const { row, column } = cell.dataset;
    const attackResult = gameInstance
      .getCurPlayerGameboard()
      .receiveAttack([row - 1, column - 1]);
    // Code to reveal cell
    // Use animation + picture of missle

    if (attackResult.hit === true) {
      // hit
      cell.style['background'] = 'red';
    } else {
      // miss
      cell.style['background'] = 'SlateGray';
    }
  });
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
