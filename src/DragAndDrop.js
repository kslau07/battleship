// DragAndDrop.js
// This module contains handlers and helper functions for the Drag and Drop API.
// Notes: Export multiple functions here to allow tree-shaking in bundler

let draggedItem;

// Add all drag-and-drop handlers
export function addDragAndDropHandlers() {
  const ships = document.querySelectorAll('.ship');

  ships.forEach((ship) => {
    ship.draggable = true;
    ship.addEventListener('drag', dragHandler);
    ship.addEventListener('dragstart', dragstartHandler);
    ship.addEventListener('dragend', dragendHandler);
  });

  const cells = document.querySelectorAll('.cell');
  cells.forEach((cell) => {
    cell.addEventListener('dragenter', dragenterHandler);
    cell.addEventListener('dragleave', dragleaveHandler);
    cell.addEventListener('drop', dropHandler);
    cell.addEventListener('dragover', dragoverHandler);
  });
}

// FIXME: DELETE THIS NOTE -> drag fires continuously
function dragHandler(event) {}

function dragstartHandler(event) {
  draggedItem = this;
  event.target.classList.add('dragging');
  event.dataTransfer.setData('text/plain', event.target.dataset.id);
}

function dragendHandler(event) {
  event.target.classList.remove('dragging');
}

/*
  TODO: We will use dragover to add green/red indicator squares
  We will use dragleave to remove any green/red indicator squares
*/

// FIXME: DELETE THIS NOTE -> dragover fires continuously
function dragoverHandler(event) {
  draggedItem.dataset.id;
  event.preventDefault(); // Cannot drop in Chrome if we do not disable default behavior
  event.dataTransfer.dropEffect = 'move';
}

// FIXME: DELETE THIS NOTE -> dragenter fires once
function dragenterHandler(event) {
  event.target.classList.add('dropping');
}

function dragleaveHandler(event) {
  console.log('hello from dragleaveHandler');
  event.target.classList.remove('dropping');
}

function dropHandler(event) {
  // FIXME: DELETE ME
  // event.target.classList.remove('dropping');
  // console.log(event.dataTransfer.getData('text/plain')); // Works!
}
