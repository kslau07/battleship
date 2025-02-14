// Gameboard.js

import Ship from './Ship.js';

export default class Gameboard {
  #grid;
  #createdShips;
  #placedShips;
  static #gridSize = 10;

  static #createCell() {
    let attacked = false;
    return {
      attack() {
        attacked = true;
      },
      isAttacked() {
        return attacked;
      },
      ship: 'none',
      coords: { rowIndex: undefined, columnIndex: undefined },
    };
  }

  static #buildGrid() {
    const gridArray = [];
    const numRows = Gameboard.#gridSize;
    const numCols = Gameboard.#gridSize;

    const maxIndex = Gameboard.#gridSize;
    for (let rowIdx = 0; rowIdx < maxIndex; rowIdx += 1) {
      const curRow = [];
      for (let colIdx = 0; colIdx < maxIndex; colIdx += 1) {
        const newCell = Gameboard.#createCell();
        newCell.coords.rowIndex = rowIdx;
        newCell.coords.columnIndex = colIdx;
        curRow.push(newCell);
      }
      gridArray.push(curRow);
    }

    return gridArray;
  }

  static createShip(name, length) {
    return new Ship(name, length);
  }

  static createDefaultShips() {
    const createdShips = [];
    const defaultShips = [
      // FIXME: UNCOMMENT BELOW
      { name: 'Carrier', length: 5 },
      { name: 'Battleship', length: 4 },
      { name: 'Destroyer', length: 3 },
      { name: 'Submarine', length: 3 },
      { name: 'PatrolBoat', length: 2 },

      // FIXME: DELETE BELOW
      // { name: 'Submarine', length: 3 },
      // { name: 'Patrol Boat', length: 2 },
    ];

    defaultShips.forEach((ship) => {
      const { name, length } = ship;
      const shipInstance = Gameboard.createShip(name, length);
      createdShips.push(shipInstance);
    });

    return createdShips;
  }

  constructor(shipSet = Gameboard.createDefaultShips()) {
    this.#grid = Gameboard.#buildGrid();
    this.#createdShips = shipSet;
    this.#placedShips = []; // Ship placement happens manually OR with placeShipsRandomly()
  }

  getGrid() {
    return this.#grid;
  }

  getCreatedShips() {
    return this.#createdShips;
  }

  getPlacedShips() {
    return this.#placedShips;
  }

  // This is a Generator Function
  // This is where our iterator is created.
  *#getNextCell(ship, startCellCoords, orientation) {
    // FIXME: DELETE ME IF NOT WORKING
    // startCellCoords = [Number(startCellCoords[0]), Number(startCellCoords[1])];
    // console.log('hello from generator function getNextCell');
    // console.log({ ship, startCellCoords, orientation });

    const grid = this.getGrid();
    const len = ship.getLength();

    // TODO: DELETE ME

    for (let i = 0; i < len; i += 1) {
      if (orientation === 'vertical') {
        yield grid[startCellCoords[0] + i]?.[startCellCoords[1]]; // Use optional chaining operator (?.) to try to access next hypothetical cell
      } else if (orientation === 'horizontal') {
        yield grid[startCellCoords[0]]?.[startCellCoords[1] + i];
      }
    }
  }

  // Check cell and throw relevant error
  #validateCell(cell, ship) {
    // TODO: REMOVE ERRORS THROWN
    // TODO: RETURN TRUE / FALSE USING CONDITIONAL (UTILIZE ||)
    // console.log('hello from validateCell');
    // console.log(cell);

    if (cell === undefined || cell.ship !== 'none') return false;

    // if (cell === undefined) {
    //   throw new RangeError(
    //     `Cannot place "${ship.getName()}" here because it is out of bounds.`,
    //   );
    // } else if (cell.ship !== 'none') {
    //   throw new Error(
    //     `Cannot place "${ship.getName()}" here because it is occupied by "${cell.ship.getName()}".`,
    //   );
    // }
  }

  // Iterate through cells at given startCellCoords and check for errors
  // TODO: Ask if we should use our method this.#getGrid() or just access the private variable this.#grid
  #validatePlacement(ship, startCellCoords, orientation) {
    console.log({ ship, startCellCoords, orientation });
    const shipLength = ship.getLength();
    const grid = this.getGrid();
    const xStart = startCellCoords[0];
    const yStart = startCellCoords[1];

    let offset = 0;
    let xOffset = 0;
    let yOffset = 0;

    for (let i = 0; i < shipLength; i += 1) {
      offset = i;
      if (orientation === 'horizontal') {
        yOffset = yStart + offset;
      } else if (orientation === 'vertical') {
        xOffset = xStart + offset;
      }
      const cell = grid[xStart + xOffset][yStart + yOffset];
      console.log(cell);
    }

    // TODO: Use a while-loop to loop through each coordinate and
    // return false if the intended cell is undefined or cell.ship !== 'none'

    // const generator = this.#getNextCell(ship, startCellCoords, orientation);

    // for (let nextCell of generator) {
    // console.log({ nextCell });
    // const isValid = this.#validateCell(nextCell, ship);
    // if (isValid === false) return false;
    // }

    // return true;
  }

  // Iterate through cells at given startCellCoords and set to ship instance
  #placeShip(ship, startCellCoords, orientation) {
    const generator = this.#getNextCell(ship, startCellCoords, orientation);

    for (let nextCell of generator) {
      nextCell.ship = ship;
    }
  }

  // Try to place a ship and intercept errors
  safePlaceShip(ship, startCellCoords, orientation) {
    // TODO: CONTINUE HERE
    // First! -> Get rid of generator function, we learned what we needed, now simplify our game
    //           Get rid of the 'cell' object and the grid object
    //              - We will use hash tables containing only things that are affected
    //              - eg misses: {row1: {item1: miss }, row2: {item1: hit}}
    //              - eg ships: {row1: {item1: 'Carrier' }, row2: {item3: 'PatrolBoat'}}
    // Use conditionals + booleans instead of try/catch + throwing errors
    // WE MUST MODIFY:
    // #validatePlacement
    // #placeShip
    // safePlaceShip
    const returnval = this.#validatePlacement(
      ship,
      startCellCoords,
      orientation,
    );

    // console.log('hello from safePlaceShip');
    // console.log('validatePlacement return val:', returnval);

    return;
    // try {
    //   this.#validatePlacement(ship, coords, orientation);
    //   this.#placeShip(ship, coords, orientation);
    // } catch ({ name, message }) {
    //   console.log(`${name}: ${message}`);
    //   return false;
    // }
    //
    // this.#placedShips.push(ship);
    // return true;
  }

  randomizeStartCell() {
    const size = Gameboard.#gridSize;
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    return [x, y];
  }

  randOrientation() {
    const choices = ['vertical', 'horizontal'];
    return choices[Math.floor(Math.random() * 2)];
  }

  // Given an array of ship objects, place each ship randomly using a do-while loop
  placeShipsRandomly(shipSet = this.#createdShips) {
    let numShipsAdded;
    let success;
    let tries = 0;

    shipSet.forEach((ship, index) => {
      do {
        const randStartCell = this.randomizeStartCell();
        const randOrient = this.randOrientation();
        this.safePlaceShip(ship, randStartCell, randOrient);

        numShipsAdded = this.getPlacedShips().length;
        success = numShipsAdded === index + 1;

        tries += 1;
        if (tries > 1000)
          throw new Error('Oops! Tried too many times to place ship!'); // Prevent infinite loop
      } while (!success); // Loop again if ship couldn't be placed
    });
  }

  receiveAttack(cellCoord) {
    const grid = this.getGrid();
    const targetCell = grid[cellCoord[0]][cellCoord[1]];
    const isAttacked = targetCell.isAttacked();

    if (isAttacked === true) {
      throw new Error('You have already attacked this cell!');
    }

    targetCell.attack();

    if (targetCell.ship !== 'none') {
      targetCell.ship.hit();
    }
  }

  allSunk() {
    const ships = this.getPlacedShips();
    return ships.every((ship) => ship.isSunk() === true);
  }
}
