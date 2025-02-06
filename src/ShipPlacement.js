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
// Basic function works for rotated placement!
function loopLength(length, startRow, startColumn) {
  for (let i = 0; i < length; i += 1) {
    document.querySelector(
      `.cell[data-row="${startRow + i}"][data-column="${startColumn}"]`,
    ).style.background = 'red';
  }
}

// This function uses target ship's length and direction to show on UI if placement would be valid
function dragenterHandler(event, gameInstance) {
  event.target.classList.add('dropping');
  const draggedShipName = currentDrag.dataset.ship;

  const gb = gameInstance.getPlayer1().getGameboard();
  const shipObj = gb
    .getCreatedShips()
    .find((shipObj) => shipObj.getName() === draggedShipName);
  const shipLen = shipObj.getLength();
  const dropRow = event.currentTarget.dataset.row;
  const dropColumn = event.currentTarget.dataset.column;

  // <div class="cell" data-row="1" data-column="10"></div>
  // const dropCell = document.querySelector(
  //   `.cell[data-row="${dropRow}"][data-column="${dropColumn}"]`,
  // );

  let rotated = true;
  if (rotated === true) {
    // run rotated code
    let startRow = dropRow - Math.floor(shipLen / 2);
    startRow = startRow < 1 ? 1 : startRow;
    const startColumn = dropColumn;

    // const startCell = (document.querySelector(
    //   `.cell[data-row="${startRow}"][data-column="${dropColumn}"]`,
    // ).style.background = 'red');
    // TODO: Create helper function to loop through `length` times and change cell colors
    // loopLength(shipLen, startRow, startColumn);
    // console.log(shipLen, startRow, startColumn);

    loopLength(shipLen, startRow, startColumn);
  } else if (rotated === false) {
    // run non-rotated code
    // shipStartCell = document.querySelector(
    //   `.cell[data-row="${dropRow - 2}"][data-column="${dropColumn}"]`,
    // );
  }
}

function dragleaveHandler(event) {
  event.target.classList.remove('dropping');
}

function dropHandler(event) {
  // event.target.classList.remove('dropping');
  // console.log(event.dataTransfer.getData('text/plain')); // Works!
}
