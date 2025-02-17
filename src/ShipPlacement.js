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

function determineStartCell(gridVal, shipLength, min = 1, max = 10) {
  return Math.max(Math.min(gridVal, max - shipLength + 1), min);
}

function removePreviousIndicators({ previousIndicatorNodes }) {
  if (previousIndicatorNodes === undefined) return;

  const listLength = previousIndicatorNodes.length;
  for (let i = 0; i < listLength; i += 1) {
    previousIndicatorNodes.pop().style.background = 'none';
  }
}

// TODO: WHEN SHIP IS DRAGGED ON TOP OF AN ALREADY PLACED SHIP, THOSE CELLS DO NOT TURN GREEN
// TODO: SIMPLIFIY THIS FUNCTION

// Indicate when ship placement is valid or invalid (show green or red cells)
function indicatePlacementValidity(dropRow, dropColumn, dragObj) {
  const grid = document.querySelector('.game-grid');
  const { shipLength, orientation, previousIndicatorNodes } = dragObj;
  const direction = { horizontal: [0, 1], vertical: [1, 0] };
  const [xFactor, yFactor] = direction[orientation];

  // This code centers the indicator cells around the dragged item by dividing the length into 2 and subtracting it from the dropRow or dropColumn
  let rowStart = dropRow - xFactor * Math.floor(shipLength / 2);
  let columnStart = dropColumn - yFactor * Math.floor(shipLength / 2);
  rowStart =
    rowStart === dropRow ? dropRow : determineStartCell(rowStart, shipLength);
  columnStart =
    columnStart === dropColumn
      ? dropColumn
      : determineStartCell(columnStart, shipLength);
  dragObj.rowStart = rowStart;
  dragObj.columnStart = columnStart;

  // Add indicating cells, remove previous ones
  // removePreviousIndicators({ previousIndicatorNodes });
  for (let i = 0; i < shipLength; i += 1) {
    const queryString = `.cell[data-row="${rowStart + xFactor * i}"][data-column="${columnStart + yFactor * i}"]`;
    const targetCell = grid.querySelector(queryString);
    targetCell.style.background = 'Chartreuse';
    dragObj.previousIndicatorNodes.push(targetCell);
  }
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

  if (placed === false) {
    console.log('Ship was not been placed, there was something in the way.');
  } else {
    const shipLength = shipObj.getLength();
    placeShipInUI({
      shipElem,
      shipLength,
      rowStart,
      columnStart,
      orientation,
    });
  }

  // removePreviousIndicators({ previousIndicatorNodes });
}

// TODO: CONTINUE HERE
// What should we pass into placeShipInUI? It may be called from dropHandler() -OR- randomizeShipsInUI()
// Use .placed and .rotated classes to keep track of ship states
// Use appendChild (or append) on entire grid to move us from placement to actual game
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

  gameGrid.appendChild(shipElem);

  /* FIXME: DELETE ME TEST DIV */
  // const testDiv = document.createElement('div');
  // testDiv.classList.add('test-div');
  // testDiv.textContent = 'foo';
  // gameGrid.appendChild(testDiv);
}

function randomizeShipsInUI() {
  // for each created ship, call placeShipInUI()
}
