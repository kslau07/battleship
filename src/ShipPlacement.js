// ShipPlacement.js
// This module contains functions used during ship placement, and specifically uses the Drag and Drop API
// Notes: Export multiple functions here to allow tree-shaking in bundler

// TODO: CONVERT FUNCTIONS THAT USE dragObj TO USE OBJECT PARAMETERS AND ONLY EXTRACT WHAT IS
// NECESSARY FROM THE OBJECT ARGUMENT

// Add all drag-and-drop handlers
export function addDragAndDropHandlers(gameInstance) {
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
    previousIndicatorNodes: [],
    previousPlacementNodes: [],
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

// HACK: Consider using an object parameter which looks like this:
//       function action({ dropRow, dropColumn, shipLength, shipName, orientation }) {}
//       It is essentially using a deconstructed object as parameters

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

// This code centers the indicator cells around the dragged item
function determineStartCoord(dropCoord, shipLength, min = 1, max = 10) {
  const center = dropCoord - Math.floor(shipLength / 2);
  return Math.max(Math.min(center, max - shipLength + 1), min); // Normalize it to grid boundaries
}

// Remove previous validation indicators
function removePreviousIndicators({ previousIndicatorNodes }) {
  if (previousIndicatorNodes === undefined) return;

  // Remove green indicators
  const listLength = previousIndicatorNodes.length;
  for (let i = 0; i < listLength; i += 1) {
    previousIndicatorNodes.pop().style.background = 'none';
  }
}

// Save placed ships' cells to check against new placements
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

// TODO: WHEN SHIP IS DRAGGED ON TOP OF AN ALREADY PLACED SHIP, THOSE CELLS DO NOT TURN GREEN
// TODO: SIMPLIFIY THIS FUNCTION

// Indicate when ship placement is valid or invalid (show green or red cells)
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
    targetCell.style.background = alreadyTaken === true ? 'Red' : 'Chartreuse';
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

// TODO: Get current player's gameboard and validate ship's placement!!

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
  // const orientation_old =
  //   orientation === 'true' ? 'vertical' : 'horizontal';

  // console.log(gameInstance.getPlayer1().getGameboard());

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
}

function randomizeShipsInUI(gameInstance) {
  const bank = document.querySelector('.bank');
  const placements = gameInstance.randomizeShipsCurrentPlayer();
  if (!placements) return;

  placements.forEach((placement) => {
    const { ship, gridCoords, orientation } = placement;
    const shipElem = bank.querySelector(
      `.ship-wrapper[data-ship="${ship.getName()}"]`,
    );
    const shipLength = ship.getLength();
    const rowStart = gridCoords[0] + 1; // Convert from grid to ui coords
    const columnStart = gridCoords[1] + 1;

    if (orientation === 'vertical') rotateShip(shipElem);
    placeShipInUI({ shipElem, shipLength, rowStart, columnStart, orientation });
  });
}

function rotateShip(shipWrapper) {
  shipWrapper.querySelector('.ship-rotated-image').style.display = 'block';
  shipWrapper.querySelector('.ship-image').style.display = 'none';
  shipWrapper.dataset.rotated = 'true';
}

function unrotateShip(shipWrapper) {
  shipWrapper.querySelector('.ship-rotated-image').style.display = 'none';
  shipWrapper.querySelector('.ship-image').style.display = 'block';
  shipWrapper.dataset.rotated = 'false';
}

function setRotateButton() {
  const placementDiv = document.querySelector('.placement');
  const rotateShipsBtn = placementDiv.querySelector(
    '.placement__button--rotate-ships',
  );

  rotateShipsBtn.addEventListener('click', () => {
    const ships = placementDiv.querySelector('.ships');
    const rotated = ships.classList.contains('rotated');

    placementDiv.querySelectorAll('.ship-wrapper').forEach((shipWrapper) => {
      if (shipWrapper.classList.contains('placed')) return; // Do not rotate placed ships

      if (rotated === false) {
        ships.classList.add('rotated');
        rotateShip(shipWrapper);
      } else {
        ships.classList.remove('rotated');
        unrotateShip(shipWrapper);
      }
    });
  });
}

function setRandomizeButton(gameInstance) {
  const randomizeBtn = document.querySelector('.placement__button--randomize');
  randomizeBtn.addEventListener('click', () => {
    randomizeShipsInUI(gameInstance);
  });
}

function setResetButton() {}

export function setPlacementButtons(gameInstance) {
  setRotateButton();
  setRandomizeButton(gameInstance);
  setResetButton(gameInstance);
}
