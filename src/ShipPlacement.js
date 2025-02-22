// ShipPlacement.js
// This module contains functions used during ship placement, and specifically uses the Drag and Drop API

export default function populatePlaceShips(gameInstance) {
  const mainDisplay = document.querySelector('.main-display');
  const template = document.querySelector('.template-placement').content;
  const placementDiv = template.querySelector('.placement');
  const playerNameSpan = placementDiv.querySelector('.player-name');
  const acceptButton = placementDiv.querySelector('.menu__button--ready');
  acceptButton.disabled = true;

  playerNameSpan.textContent = gameInstance.getCurPlayer().getName();
  mainDisplay.replaceChildren(placementDiv);

  // Insert game-grid
  const placementButtons = document.querySelector('.placement__buttons');
  const parent = placementButtons.parentNode;
  const gridTemplate = document.querySelector('.template-game-grid').content;
  const gameGrid = gridTemplate.querySelector('.game-grid');
  parent.insertBefore(gameGrid, placementButtons);
  populatePlacementBank(gameInstance);
  setPlacementButtonsAndHandlers(gameInstance);
}

const populatePlacementBank = (gameInstance) => {
  // TODO: Append the current player's bank, use gameInstance to find current player
  const template = document.querySelector('.template-ships--player1').content;
  const images = template.querySelector('.ships--player1').cloneNode(true);
  const placementBankBody = document.querySelector('.bank-body');
  placementBankBody.appendChild(images);
  checkReady(gameInstance);
};

function setPlacementButtonsAndHandlers(gameInstance) {
  const previousIndicatorNodes = [];
  const previousPlacementNodes = [];

  // FIXME: DELETE ME DEV ONLY
  document.onkeyup = function (e) {
    e = e || window.event;
    if (e.which === 82) {
      randomizeShipsInUI({ gameInstance, previousPlacementNodes });
      return false;
    } else if (e.which === 89) {
      randomizeShipsInUI({ gameInstance, previousPlacementNodes });
      return false;
    } else {
      console.log(e.keyCode);
    }
  };

  setPlacementButtons({ gameInstance, previousPlacementNodes });

  // NOTE: Optimization -> Combine dom queries to improve performance
  const nodeList = document.querySelectorAll(
    '.ship-wrapper, .game-grid, .axis-marker',
  );
  const ships = [...nodeList].filter((node) =>
    node.classList.contains('ship-wrapper'),
  );
  const grid = [...nodeList].find((node) =>
    node.classList.contains('game-grid'),
  );
  const axisMarkers = [...nodeList].filter((node) =>
    node.classList.contains('axis-marker'),
  );
  const dragObj = {
    gameInstance,
    shipName: null,
    orientation: null,
    previousIndicatorNodes,
    previousPlacementNodes,
  };

  ships.forEach((ship) => {
    ship.draggable = true;
    // ship.addEventListener('drag', dragHandler);
    ship.addEventListener('dragstart', function (event) {
      dragstartHandler.call(this, event, dragObj);
    });
    ship.addEventListener('dragend', dragendHandler);
  });

  if (grid) {
    grid.addEventListener(
      'dragenter',
      createHandler(dragenterHandler, dragObj),
    );
    grid.addEventListener('dragleave', dragleaveHandler);
    grid.addEventListener('drop', createHandler(dropHandler, dragObj));
    grid.addEventListener('dragover', allowDrop);
  } else {
    console.warn('.game-grid not found');
  }
}

function updateDragObj(dragObj) {
  const currentDrag = this;
  dragObj.shipElem = this;
  dragObj.shipName = currentDrag.dataset.ship;
  dragObj.orientation =
    currentDrag.dataset.rotated === 'true' ? 'vertical' : 'horizontal';

  // HACK: Excessive method chaining, consider adding facade method in Game instance
  const shipLength = dragObj.gameInstance
    .getPlayer1()
    .getGameboard()
    .getCreatedShips()
    .find((shipObj) => shipObj.getName() === dragObj.shipName)
    .getLength();

  dragObj.shipLength = shipLength;
}

// function dragHandler(event) {}

function dragstartHandler(event, dragObj) {
  updateDragObj.call(this, dragObj);
  event.currentTarget.classList.add('dragging');
  event.dataTransfer.setData('text/plain', event.currentTarget.dataset.ship);
}

function dragendHandler(event) {
  event.currentTarget.classList.remove('dragging');
}

function allowDrop(event) {
  event.preventDefault(); // preventDefault allows us to drop item
  event.dataTransfer.dropEffect = 'move';
}

// Wrapper function for handlers, allows passing in dragObj
function createHandler(handler, dragObj) {
  return function (event) {
    handler(event, dragObj);
  };
}

// Center the indicator cells around the dragged item
function determineStartCoord(dropCoord, shipLength, min = 1, max = 10) {
  const center = dropCoord - Math.floor(shipLength / 2);
  return Math.max(Math.min(center, max - shipLength + 1), min); // Normalize it to grid boundaries
}

function removePreviousIndicators({ previousIndicatorNodes }) {
  if (previousIndicatorNodes === undefined) return;

  const listLength = previousIndicatorNodes.length;
  for (let i = 0; i < listLength; i += 1) {
    previousIndicatorNodes.pop().style.background = 'none';
  }
}

// Store where ships are for placement validation
function storePlacementNodes({
  previousIndicatorNodes,
  previousPlacementNodes,
}) {
  // OPTIMIZE: Array.prototype.push.apply is faster than using spread syntax
  previousPlacementNodes.push.apply(
    previousPlacementNodes,
    previousIndicatorNodes,
  );
}

// Show red/green cells to visually aid ship placement
function indicatePlacementValidity(dropRow, dropColumn, dragObj) {
  const grid = document.querySelector('.game-grid');
  const {
    shipLength,
    orientation,
    previousIndicatorNodes,
    previousPlacementNodes,
  } = dragObj;

  const direction = { horizontal: [0, 1], vertical: [1, 0] };
  const [xFactor, yFactor] = direction[orientation];

  const rowStart =
    orientation === 'horizontal'
      ? dropRow
      : determineStartCoord(dropRow, shipLength);
  const columnStart =
    orientation === 'vertical'
      ? dropColumn
      : determineStartCoord(dropColumn, shipLength);

  // Add indicating cells, remove previous ones
  removePreviousIndicators({ previousIndicatorNodes });
  for (let i = 0; i < shipLength; i += 1) {
    const queryString = `.cell[data-row="${rowStart + xFactor * i}"][data-column="${columnStart + yFactor * i}"]`;
    const targetCell = grid.querySelector(queryString);
    const alreadyTaken = previousPlacementNodes.includes(targetCell);
    targetCell.style.background =
      alreadyTaken === true ? 'Red' : 'MediumSeaGreen';
    dragObj.previousIndicatorNodes.push(targetCell);
  }

  dragObj.rowStart = rowStart;
  dragObj.columnStart = columnStart;
}

// This function uses target ship's length and direction to show on UI if placement would be valid
function dragenterHandler(event, dragObj) {
  const cell = event.target.closest('.cell');
  if (cell === null) return; // axis-markers return null because pointer-events are set to none;

  const dropRow = Number(cell.dataset.row);
  const dropColumn = Number(cell.dataset.column);
  indicatePlacementValidity(dropRow, dropColumn, dragObj);
}

function dragleaveHandler() {}

function dropHandler(event, dragObj) {
  const {
    columnStart,
    shipElem,
    gameInstance,
    orientation,
    rowStart,
    shipName,
    previousIndicatorNodes,
    previousPlacementNodes,
  } = dragObj;
  const player1 = dragObj.gameInstance.getPlayer1();
  const shipObj = gameInstance.getShipForPlayer(player1, shipName);
  const gridCoords = [rowStart - 1, columnStart - 1]; // Index starts at 0

  // Try to place ship on grid
  const placed = dragObj.gameInstance.safePlaceShipForPlayer({
    player: player1,
    ship: shipObj,
    gridCoords,
    orientation,
  });

  if (placed !== false) {
    storePlacementNodes({ previousIndicatorNodes, previousPlacementNodes });
    const shipLength = shipObj.getLength();
    placeShipInUI({
      shipElem,
      shipLength,
      rowStart,
      columnStart,
      orientation,
      gameInstance,
    });
  } else {
    console.log('Ship was not placed, invalid locationn.');
  }

  removePreviousIndicators({ previousIndicatorNodes });
}

function placeShipInUI({
  shipElem,
  shipLength,
  rowStart,
  columnStart,
  orientation,
  gameInstance,
}) {
  const gameGrid = document.querySelector('.game-grid');
  const direction = { horizontal: [0, 1], vertical: [1, 0] };
  const [xFactor, yFactor] = direction[orientation];
  shipElem.classList.add('placed');
  shipElem.style.gridRowStart = rowStart + 1;
  shipElem.style.gridRowEnd = rowStart + 1 + xFactor * shipLength;
  shipElem.style.gridColumnStart = columnStart + 1;
  shipElem.style.gridColumnEnd = columnStart + 1 + yFactor * shipLength;
  shipElem.style['pointer-events'] = 'none';

  gameGrid.appendChild(shipElem);
  checkReady(gameInstance);
}

function randomizeShipsInUI({ gameInstance, previousPlacementNodes }) {
  resetShips({ gameInstance, previousPlacementNodes });

  const bank = document.querySelector('.bank');
  const placements = gameInstance.randomizeShipsCurrentPlayer();
  if (!placements) return;

  placements.forEach((placement) => {
    const { ship, gridCoords, orientation } = placement;
    const shipElem = bank.querySelector(
      `.ship-wrapper[data-ship="${ship.getName()}"]`,
    );
    const shipLength = ship.getLength();
    const rowStart = gridCoords[0] + 1; // Convert from array coords to ui coords
    const columnStart = gridCoords[1] + 1;

    if (orientation === 'vertical') rotateShip(shipElem);
    placeShipInUI({
      shipElem,
      shipLength,
      rowStart,
      columnStart,
      orientation,
      gameInstance,
    });
  });
}

function rotateShip(shipWrapper) {
  shipWrapper.querySelector('.ship-rotated-image').style.display = 'block';
  shipWrapper.querySelector('.ship-image').style.display = 'none';
  shipWrapper.dataset.rotated = 'true';
  shipWrapper.classList.add('rotated');
}

function unrotateShip(shipWrapper) {
  shipWrapper.querySelector('.ship-rotated-image').style.display = 'none';
  shipWrapper.querySelector('.ship-image').style.display = 'block';
  shipWrapper.dataset.rotated = 'false';
  shipWrapper.classList.remove('rotated');
}

function setRotateButton() {
  const placementDiv = document.querySelector('.placement');
  const rotateShipsBtn = placementDiv.querySelector(
    '.placement__button--rotate-ships',
  );

  rotateShipsBtn.addEventListener('click', () => {
    placementDiv.querySelectorAll('.ship-wrapper').forEach((shipWrapper) => {
      if (shipWrapper.classList.contains('placed')) return; // Do not rotate placed ships
      const rotated = shipWrapper.classList.contains('rotated');
      rotated === false ? rotateShip(shipWrapper) : unrotateShip(shipWrapper);
    });
  });
}

function setRandomizeButton({ gameInstance, previousPlacementNodes }) {
  const randomizeBtn = document.querySelector('.placement__button--randomize');
  randomizeBtn.addEventListener(
    'click',
    randomizeShipsInUI.bind(null, { gameInstance, previousPlacementNodes }),
  );
}

function resetShips({ gameInstance, previousPlacementNodes }) {
  gameInstance.getCurPlayerGameboard().emptyPlacements();
  const placementDiv = document.querySelector('.placement');
  const shipWrappers = placementDiv.querySelectorAll('.ship-wrapper');
  shipWrappers.forEach((sw) => unrotateShip.call(null, sw));
  const shipsCtr = placementDiv.querySelector('.ships');
  shipWrappers.forEach((sw) => {
    shipsCtr.appendChild(sw); // Move elem back to bank
    sw.classList.remove('placed');
    sw.style['pointer-events'] = 'initial';
  });

  gameInstance.getCurPlayerGameboard().buildNewEmptyGrid();
  previousPlacementNodes.length = 0;
  checkReady(gameInstance);
}

function setResetButton({ gameInstance, previousPlacementNodes }) {
  const resetBtn = document.querySelector('.placement__button--reset');
  resetBtn.addEventListener(
    'click',
    resetShips.bind(null, { gameInstance, previousPlacementNodes }),
  );
}

function setPlacementButtons({ gameInstance, previousPlacementNodes }) {
  setRotateButton();
  setRandomizeButton({ gameInstance, previousPlacementNodes });
  setResetButton({ gameInstance, previousPlacementNodes });
  setReadyButton({ gameInstance, previousPlacementNodes });
}

function switchPlacementScreen({ gameInstance, previousPlacementNodes }) {
  // Switch curPlayer
  gameInstance.switchCurPlayer();

  // Remove ships from ui
  resetShips({ gameInstance, previousPlacementNodes });
  // Reset counter / ready button
}

function setReadyButton({ gameInstance, previousPlacementNodes }) {
  const readyButton = document.querySelector('.menu__button--ready');
  readyButton.addEventListener('click', () => {
    const count = gameInstance.increaseReadyCount();

    if (count === 1) {
      switchPlacementScreen({ gameInstance, previousPlacementNodes });
    } else if (count === 2) {
      gameInstance.switchCurPlayer();
      // startGame function is called by the same element but different event-listener for organizational purposes
    }
  });
}

function checkReady(gameInstance) {
  // Counter for ships remaining to be placed
  const unplacedCountSpan = document.querySelector(
    '.bank-heading__unplaced-ships-count',
  );
  unplacedCountSpan.style.color = 'OrangeRed';
  const total = gameInstance.getCurPlayerGameboard().getCreatedShips().length;
  const placed = gameInstance.getCurPlayerGameboard().getPlacements().length;
  const curCount = total - placed;
  unplacedCountSpan.textContent = curCount;

  // Enable ready button when ships all placed
  const readyButton = document.querySelector('.menu__button--ready');
  if (curCount === 0) {
    readyButton.textContent = 'Ready!';
    readyButton.disabled = false;
  } else {
    readyButton.textContent = 'Not ready';
    readyButton.disabled = true;
  }
}
