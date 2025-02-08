// ShipPlacement.js
// This module contains functions used during ship placement, and specifically uses the Drag and Drop API
// Notes: Export multiple functions here to allow tree-shaking in bundler

// let currentDrag; // HACK: allowDrop (dragover handler) cannot see dragged item, we use a global variable to store the dragged item as a workaround.

// Add all drag-and-drop handlers
export function addDragAndDropHandlers(gameInstance) {
  // NOTE: Optimization -> Combine dom queries to improve performance
  const nodeList = document.querySelectorAll('.ship-wrapper, .placement__grid');
  const ships = [...nodeList].filter((node) =>
    node.classList.contains('ship-wrapper'),
  );
  const grid = [...nodeList].find((node) =>
    node.classList.contains('placement__grid'),
  );
  const gameObj = { gameInstance, currentDrag: null };

  ships.forEach((ship) => {
    ship.draggable = true;
    ship.addEventListener('drag', dragHandler);
    ship.addEventListener('dragstart', function (event) {
      dragstartHandler.call(this, event, gameObj);
    });
    ship.addEventListener('dragend', dragendHandler);
  });

  if (grid) {
    grid.addEventListener(
      'dragenter',
      createHandler(dragenterHandler, gameObj),
    );
    grid.addEventListener('dragleave', dragleaveHandler);
    grid.addEventListener('drop', dropHandler);
    grid.addEventListener('dragover', allowDrop);
  } else {
    console.warn('.placement__grid not found');
  }
}

function dragHandler(event) {}

function dragstartHandler(event, gameObj) {
  gameObj.currentDrag = this;
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

// Wrapper function for handlers, allows passing in gameObj
function createHandler(handler, gameObj) {
  return function (event) {
    handler(event, gameObj);
    // dragenterHandler(event, gameInstance);
  };
}

// Where we add the event listener, we have: grid.addEventListener((event) => createDragenterHandler(gameInstance)(event))
// We must pass in a callback function. The callback function we pass in is, the result of instantly invoking 'createDragenterHandler(gameInstance)' with (event)
// which, is the same as invoking the anonymous function that is returned immediately. The 'event' variable in parenthesis is passed to the anonymous function

function clampToGrid(mainAxisOffset, shipLength, min = 1, max = 10) {
  return Math.max(Math.min(mainAxisOffset, max - shipLength + 1), min);
}

// Indicate when ship placement is valid or invalid (show green or red cells)
function indicatePlacementValidity(
  shipLength,
  dropRow,
  dropColumn,
  rotatedState,
) {
  const grid = document.querySelector('.placement__grid');

  let mainAxisOffset;
  let crossAxis; // ships have a static height but differing lenths
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
  }
}

function removeIndication() {
  document
    .querySelectorAll('.cell')
    .forEach((cell) => (cell.style.background = 'teal'));
}

// TODO: CONTINUE HERE
// FIXME: dragleaveHandler is fired off AFTER the new and fresh dragenterHandler is fired off
// That is, new cell stuff happens, then old cell clean up happens.
// It would have been easier if it were the other way around.

// This function uses target ship's length and direction to show on UI if placement would be valid
function dragenterHandler(event, gameObj) {
  // const { currentDrag } = gameObj;
  // console.log(currentDrag);
  // const draggedShipName = currentDrag.dataset.ship;
  // console.log(draggedShipName);

  return;

  const gb = gameInstance.getPlayer1().getGameboard();
  const shipLength = gb
    .getCreatedShips()
    .find((shipObj) => shipObj.getName() === draggedShipName)
    .getLength();
  const dropRow = event.currentTarget.dataset.row;
  const dropColumn = event.currentTarget.dataset.column;
  let rotatedState = currentDrag.dataset.rotated;

  removeIndication();
  indicatePlacementValidity(shipLength, dropRow, dropColumn, rotatedState);
}

function dragleaveHandler(event) {
  // document
  // .querySelectorAll('.cell')
  // .forEach((cell) => (cell.style.background = 'Teal'));
}

function dropHandler(event) {
  // event.target -> identifies the element that triggered the event (where the ship was dropped)
  const cell = event.target.closest('.cell');
  // event.target.classList.remove('dropping');
  // console.log(event.dataTransfer.getData('text/plain')); // Works!
}
