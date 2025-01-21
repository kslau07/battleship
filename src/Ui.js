// Ui.js

import './reset.css';
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

const createGame = (gameOptions) => {
  const { opponentType, player1Name, player2Name } = gameOptions;
  const p1Instance = Game.createPlayer(player1Name);
  const p2Instance = Game.createPlayer(player2Name);
  const gameObj = new Game(p1Instance, p2Instance);

  createGameGrids();
  redrawGameGrids(gameObj);
};

const populateSelectionScreen = (gameOpts) => {};

// const createHexPattern = (menuFrag) => {
//   const template = document.querySelector('.hex-pattern-template');
//   const hexFrag = template.content.cloneNode(true);
//   const hexPatternCtr = hexFrag.querySelector('.hex-pattern-container');
//
//   // Add several .hex-column-container to create honeycomb pattern
//   for (let i = 0; i < 20; i += 1) {
//     const clone = hexFrag
//       .querySelector('.hex-column-container')
//       .cloneNode(true);
//     hexPatternCtr.appendChild(clone);
//
//     const leftOffset = 43;
//     const bottomOffset = -22;
//
//     clone.style.left = `${(i + 1) * leftOffset - 22}px`;
//
//     if (i % 2 === 0) {
//       clone.style.bottom = `${bottomOffset}px`;
//     }
//   }
//
//   const menuCtr = menuFrag.querySelector('.menu-container');
//   menuCtr.appendChild(hexPatternCtr);
// };

function nextMenu(gameOpts) {
  const overlay = document.querySelector('.overlay');
  const selectionMenu = overlay.querySelector('.menu-selection-container');
  const namingMenu = overlay.querySelector('.menu-naming-container');
  // const hexPatternCtr = overlay.querySelector('.hex-pattern-container');
  // hexPatternCtr.style.display = 'none';
  selectionMenu.style.display = 'none';
  namingMenu.style.display = 'grid';
}

const setupButtons = (gameOpts) => {
  const overlay = document.querySelector('.overlay');

  const selectOpponentbuttons = overlay.querySelectorAll(
    '.menu-selection-opponent__button',
  );

  selectOpponentbuttons.forEach((btn) => {
    // TODO: Figure out how to bind `this` to our function call.
    //       Either use: `bind`, `call` or `apply`

    btn.addEventListener('click', nextMenu.bind(btn, gameOpts));
  });
};

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

function populateInputNames(gameInstance) {
  const mainDisplay = document.querySelector('.main-display');
  const buttons = mainDisplay.querySelector('.menu_select_opponent_buttons');
  const template = document.querySelector('.template_menu_input_names').content;
  const inputNames = template.querySelector('.menu_input_names');
  // Add event-listener to next button
  buttons.replaceChildren(inputNames);
}

const loadMenu = () => {
  // * Instantiate Game. The instance will be used to keep track of our user's preferences, game score, etc.
  const gameInstance = new Game();

  populateSelectOpponent(gameInstance);

  // console.log(game);
  // const template = document.querySelector('.menu-template');
  // const menuFrag = template.content.cloneNode(true);
  // createHexPattern(menuFrag);
  // const gameOpts = {
  //   opponentType: 'human',
  //   player1Name: null,
  //   player2Name: null,
  // };
  // const body = document.querySelector('body');
  // body.appendChild(menuFrag);
  // setupButtons(gameOpts);
};

loadMenu();
