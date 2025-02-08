// ShipPlacement.js
// This module contains functions used during ship placement, and specifically uses the Drag and Drop API
// Notes: Export multiple functions here to allow tree-shaking in bundler

// Add all drag-and-drop handlers
export function addDragAndDropHandlers(gameInstance) {
  // NOTE: Optimization -> Combine dom queries to improve performance
  const nodeList = document.querySelectorAll(
    '.ship-wrapper, .placement__grid, .axis-marker',
  );
  const ships = [...nodeList].filter((node) =>
    node.classList.contains('ship-wrapper'),
  );
  const grid = [...nodeList].find((node) =>
    node.classList.contains('placement__grid'),
  );
  const axisMarkers = [...nodeList].filter((node) =>
    node.classList.contains('axis-marker'),
  );
  const dragObj = {
    gameInstance,
    shipName: null,
    rotated: null,
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
    console.warn('.placement__grid not found');
  }
}

function updateDragObj(dragObj) {
  const currentDrag = this;
  dragObj.shipName = currentDrag.dataset.ship;
  dragObj.rotatedState = currentDrag.dataset.rotated;

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
  event.target.classList.remove('dragging');
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

function clampToGrid(mainAxisOffset, shipLength, min = 1, max = 10) {
  return Math.max(Math.min(mainAxisOffset, max - shipLength + 1), min);
}

function removePreviousIndicators(dragObj) {
  const { previousIndicatorNodes } = dragObj;
  if (previousIndicatorNodes === undefined) return;

  const listLength = previousIndicatorNodes.length;
  for (let i = 0; i < listLength; i += 1) {
    previousIndicatorNodes.pop().style.background = 'yellow';
  }
}

// Indicate when ship placement is valid or invalid (show green or red cells)
function indicatePlacementValidity(
  shipLength,
  dropRow,
  dropColumn,
  rotatedState,
  dragObj,
) {
  removePreviousIndicators(dragObj);
  const grid = document.querySelector('.placement__grid');

  let mainAxisOffset;
  let crossAxis; // cross axis is height of ship, same for all ships
  let length;
  let height;

  if (rotatedState === 'true') {
    length = 'row';
    height = 'column';
    mainAxisOffset = dropRow - Math.floor(shipLength / 2); // Center indicating squares
    mainAxisOffset = clampToGrid(mainAxisOffset, shipLength);
    crossAxis = dropColumn;
  } else if (rotatedState === 'false') {
    length = 'column';
    height = 'row';
    mainAxisOffset = dropColumn - Math.floor(shipLength / 2);
    mainAxisOffset = clampToGrid(mainAxisOffset, shipLength);
    crossAxis = dropRow;
  }

  for (let i = 0; i < shipLength; i += 1) {
    const queryString = `.cell[data-${length}="${mainAxisOffset + i}"][data-${height}="${crossAxis}"]`;
    const targetCell = grid.querySelector(queryString);
    targetCell.style.background = 'Chartreuse';
    dragObj.previousIndicatorNodes.push(targetCell);
  }
}

// This function uses target ship's length and direction to show on UI if placement would be valid
function dragenterHandler(event, dragObj) {
  const cell = event.target.closest('.cell');
  if (cell === null) return; // axis-markers return null because pointer-events are set to none;

  const { gameInstance, shipName, shipLength, rotatedState } = dragObj;

  const dropRow = cell.dataset.row;
  const dropColumn = cell.dataset.column;

  indicatePlacementValidity(
    shipLength,
    dropRow,
    dropColumn,
    rotatedState,
    dragObj,
  );
}

function dragleaveHandler(event) {}

// TODO: Get current player's gameboard and validate ship's placement!!

function dropHandler(event, dragObj) {
  const cell = event.target.closest('.cell');
  const { row, column } = cell.dataset;
  const { gameInstance, shipName, rotatedState } = dragObj;

  // TODO: To use safePlaceShip we need:
  // ship -> must be ship object
  // coords -> renamed to startCellCoords
  // orientation
  // const {shipName, };
  // safePlaceShip(ship, startCellCoords, orientation)
  const player1 = dragObj.gameInstance.getPlayer1();
  const shipObj = gameInstance.getShipForPlayer(player1, shipName);
  const startCellCoords = [row, column];
  const orientation = rotatedState === 'true' ? 'vertical' : 'horizontal';

  // FIXME: UNCOMMENT
  dragObj.gameInstance.safePlaceShipForPlayer(
    player1,
    shipObj,
    startCellCoords,
    orientation,
  );

  // gameBoard
  //safePlaceShip();
  // console.log('hello from dropHandler');
  // const cell = event.target.closest('.cell');
  // console.log('you are here');
  // console.log({ dragObj });
  // console.log(event.dataTransfer.getData('text/plain')); // Works!
}
