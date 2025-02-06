// ShipPlacement.js
// This module contains functions used during ship placement, and specifically uses the Drag and Drop API
// Notes: Export multiple functions here to allow tree-shaking in bundler

let currentDrag; // HACK: allowDrop (dragover handler) cannot see dragged item, we use a global variable to store the dragged item as a workaround.

// Add all drag-and-drop handlers
export function addDragAndDropHandlers(gameInstance) {
  const ships = document.querySelectorAll('.ship-wrapper');
  ships.forEach((ship) => {
    ship.draggable = true;
    ship.addEventListener('drag', dragHandler); // fires when a draggable item is dragged
    ship.addEventListener('dragstart', dragstartHandler); // fires when a user starts dragging an item
    ship.addEventListener('dragend', dragendHandler); // fires when a drag operation ends
  });

  const cells = document.querySelectorAll('.cell');
  cells.forEach((cell) => {
    cell.addEventListener('dragenter', createDragenterHandler(gameInstance)); // fires when a dragged item enters a valid drop target
    cell.addEventListener('dragleave', dragleaveHandler); // fires when a dragged item leaves a valid drop target
    cell.addEventListener('drop', dropHandler); // fires when an item is dropped over a valid drop target
    cell.addEventListener('dragover', allowDrop); // fires every few hundred ms, when an item is being dragged over a valid drop target
  });
}

function dragHandler(event) {}

function dragstartHandler(event) {
  currentDrag = this;
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

// Wrapper function to pass gameInstance to dragenterHandler
function createDragenterHandler(gameInstance) {
  return function (event) {
    dragenterHandler(event, gameInstance);
  };
}

// Indicate on UI if ship placement is valid or invalid (show green or red cells)
// function indicatePlacementValidity(length, startRow, startColumn)
function indicatePlacementValidity(shipLen, dropRow, dropColumn, rotatedState) {
  console.log('hello zero');
  console.log({ shipLen, dropRow, dropColumn, rotatedState });
  const grid = document.querySelector('.placement__grid');
  if (rotatedState === 'true') {
    let startRow = dropRow - Math.floor(shipLen / 2);
    startRow = startRow < 1 ? 1 : startRow;

    for (let i = 0; i < shipLen; i += 1) {
      const curRow = startRow + i;
      const queryString = `.cell[data-row="${curRow}"][data-column="${dropColumn}"]`;
      const curCell = grid.querySelector(queryString);
      curCell.style.background = 'yellow';
    }
  } else if (rotatedState === 'false') {
    let startColumn = dropColumn - Math.floor(shipLen / 2);
    startColumn = startColumn < 1 ? 1 : startColumn;

    for (let i = 0; i < shipLen; i += 1) {
      const curColumn = startColumn + i;
      const queryString = `.cell[data-row="${dropRow}"][data-column="${curColumn}"]`;
      const curCell = grid.querySelector(queryString);
      curCell.style.background = 'orange';
    }
  }
}

function indicatePlacementValidityRotated(length, startRow, startColumn) {
  for (let i = 0; i < length; i += 1) {
    const queryString = `.cell[data-row="${startRow + i}"][data-column="${startColumn}"]`;
    const targetCell = (document.querySelector(queryString).style.background =
      'red');
  }
}

// This function uses target ship's length and direction to show on UI if placement would be valid
function dragenterHandler(event, gameInstance) {
  event.target.classList.add('dropping');
  const draggedShipName = currentDrag.dataset.ship;
  const gb = gameInstance.getPlayer1().getGameboard();
  const shipLen = gb
    .getCreatedShips()
    .find((shipObj) => shipObj.getName() === draggedShipName)
    .getLength();
  const dropRow = event.currentTarget.dataset.row;
  const dropColumn = event.currentTarget.dataset.column;
  let rotatedState = currentDrag.dataset.rotated;
  indicatePlacementValidity(shipLen, dropRow, dropColumn, rotatedState);
}

function dragleaveHandler(event) {
  event.target.classList.remove('dropping');
}

function dropHandler(event) {
  // event.target.classList.remove('dropping');
  // console.log(event.dataTransfer.getData('text/plain')); // Works!
}
