// Ui.js

import './global.css';
import './style.css';
import Game from './Game';

const endTurn = (gameObj) => {
  gameObj.endTurn();
  const isGameOver = gameObj.isGameOver();

  if (isGameOver === true) {
    console.log('Game over!');
  } else {
    console.log('not gameover!'); // FIXME: DELETE ME

    redrawGameGrids(gameObj);
  }
};

const createBaseGrid = () => {
  const grid = document.createElement('div');
  const gridSize = 10;

  for (let rowIdx = 0; rowIdx < gridSize; rowIdx += 1) {
    for (let colIdx = 0; colIdx < gridSize; colIdx += 1) {
      const cellContainer = document.createElement('div');
      cellContainer.classList.add('cell-container', `cc-${rowIdx}-${colIdx}`);
      grid.appendChild(cellContainer);
    }
  }

  grid.classList.add('grid');
  return grid;
};

const createGameGrids = (gameObj) => {
  const gridContainers = document.querySelectorAll('.grid-container');

  gridContainers.forEach((container) => {
    const baseGrid = createBaseGrid();
    container.appendChild(baseGrid);
  });
};

const createOwnCell = (cellCtr, cellObj) => {
  const cellDiv = document.createElement('div');
  cellDiv.classList.add('cell', 'own');
  cellDiv.textContent = cellObj.ship === 'none' ? '' : cellObj.ship.getName();
  cellCtr.appendChild(cellDiv);
};

const removeChildNodes = (parentEl) => {
  while (parentEl.firstChild) {
    parentEl.removeChild(parentEl.firstChild);
  }
};

const redrawOwnGrid = (gameObj) => {
  const cellObjects = gameObj.getCurPlayer().getGameboard().getGrid().flat();
  const ownGridElem = document.querySelector('.grid-container.own')
    .childNodes[0];

  const ownCellContainers = ownGridElem.childNodes;
  ownCellContainers.forEach((cellCtr, i) => {
    removeChildNodes(cellCtr);
    createOwnCell(cellCtr, cellObjects[i]);
  });
};

// FIXME: DELETE BELOW, TESTING ONLY
const revealShip = (cellObj) => {
  let content;
  if (cellObj.ship !== 'none') {
    content = '?';
  } else {
    content = '.';
  }
  return content;
};

const redrawCell = (cellBtn, cellObj) => {
  cellBtn.textContent = '';
  const isAttacked = cellObj.isAttacked();

  let content;
  if (isAttacked === false) {
    // FIXME: DELETE BELOW, TESTING ONLY
    content = revealShip(cellObj);
    // content = '-';
  } else if (isAttacked === true) {
    cellBtn.classList.add('attacked');
    cellBtn.disabled = true;

    if (cellObj.ship === 'none') {
      content = 'miss';
    } else {
      content = 'hit!';
    }
  }

  cellBtn.textContent = content;
};

const attackCellAndEndTurn = (gameObj, coords, cellBtn, cellObj) => {
  const curGuessBoard = gameObj.getCurEnemy().getGameboard();
  curGuessBoard.receiveAttack(coords);
  redrawCell(cellBtn, cellObj);
  endTurn(gameObj);
};

const createGuessCell = (gameObj, cellCtr, cellObj) => {
  const cellBtn = document.createElement('button');
  const coords = [cellObj.coords.rowIndex, cellObj.coords.columnIndex];
  cellBtn.classList.add('cell', 'guess', `cell-${coords[0]}-${coords[1]}`);

  cellBtn.addEventListener('click', () => {
    attackCellAndEndTurn(gameObj, coords, cellBtn, cellObj);
  });

  redrawCell(cellBtn, cellObj);
  cellCtr.appendChild(cellBtn);
};

const redrawGuessGrid = (gameObj) => {
  const cellObjects = gameObj.getCurEnemy().getGameboard().getGrid().flat();
  const guessGridElem = document.querySelector('.grid-container.guess')
    .childNodes[0];

  const guessCellContainers = guessGridElem.childNodes;
  guessCellContainers.forEach((cellCtr, i) => {
    removeChildNodes(cellCtr);
    createGuessCell(gameObj, cellCtr, cellObjects[i]);
  });
};

const redrawGameGrids = (gameObj) => {
  redrawOwnGrid(gameObj);
  redrawGuessGrid(gameObj);
};

const showOverlay = () => {
  const overlay = document.getElementById('overlay');
  overlay.style.display = 'block';
};

// User inputs names and can begin game
const nextMenu = (gameOptions, clone) => {
  const overlay = document.getElementById('overlay');
  const namingScreen = clone.querySelector('#load-screen-naming');
  namingScreen.style.display = 'block';
  overlay.appendChild(namingScreen);

  const btnBeginGame = namingScreen.querySelector('#btn-begin-game');
  btnBeginGame.addEventListener('click', () => {
    const p1Name = namingScreen.querySelector('#input-player1-name').value;
    const p2Name = namingScreen.querySelector('#input-player2-name').value;
    gameOptions.player1Name = p1Name;
    gameOptions.player2Name = p2Name;
    console.log(`gameOptions:`, gameOptions);
  });
};

// User chooses opponent type and advances to next menu
const showMenu = (gameOpts) => {
  const overlay = document.getElementById('overlay');
  const template = document.getElementById('load-screen-template');
  const clone = template.content.cloneNode(true);
  const selectionScreen = clone.querySelector('#load-screen-selection');
  selectionScreen.style.display = 'block';
  overlay.appendChild(selectionScreen);

  const buttons = selectionScreen.querySelectorAll('button');
  buttons.forEach((button) => {
    button.addEventListener('click', function () {
      gameOpts.opponentType = this.value;
      overlay.removeChild(selectionScreen);
      nextMenu(gameOpts, clone);
    });
  });
};

const loadMenu = (gameOpts) => {
  showOverlay();
  showMenu(gameOpts);
};

const createGame = () => {
  const gameOpts = {};
  gameOpts.opponentType = 'human';
  gameOpts.player1Name = null;
  gameOpts.player2Name = null;

  loadMenu(gameOpts);
  // console.log(`Step 2:`, userInputs);
  // const gameObj = new Game();

  // TODO: Just retrieve our inputs from the load screen for now.
  // TODO: Below will be loaded with game type and names from user inputs from load screen

  // gameObj.createNewMatch();
  // createGameGrids();
  // redrawGameGrids(gameObj);
};

const createGameButton = document.querySelector('#new-game-button');
createGameButton.addEventListener('click', createGame);

document.onkeyup = function () {
  // FIXME: DELETE ME, DEVELOPMENT TOOL
  // Press 't' to invoke createGame()
  var e = e || window.event; // For IE to cover IEs window event-object
  if (e.which == 84) {
    createGame();
    return false;
  }
};

createGame();
