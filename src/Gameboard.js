// Gameboard.js

export default class Gameboard {
  #grid;
  #allShips;
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
      // { name: 'Cruiser', length: 5 },
      // { name: 'Battleship', length: 4 },
      // { name: 'Destroyer', length: 3 },
      // { name: 'Submarine', length: 3 },
      // { name: 'Patrol Boat', length: 2 },

      // FIXME: DELETE BELOW
      { name: 'Submarine', length: 3 },
      { name: 'Patrol Boat', length: 2 },
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
    this.#allShips = []; // Ships are added by placeShip()

    if (shipSet !== undefined) {
      this.placeAllShips(shipSet);
    }
  }

  getGrid() {
    return this.#grid;
  }

  getAllShips() {
    return this.#allShips;
  }

  *#getNextCell(ship, coords, orientation) {
    const grid = this.getGrid();
    const len = ship.getLength();

    for (let i = 0; i < len; i += 1) {
      if (orientation === 'vertical') {
        yield grid[coords[0] + i]?.[coords[1]]; // Use optional chaining operator (?.) to try to access next hypothetical cell
      } else if (orientation === 'horizontal') {
        yield grid[coords[0]]?.[coords[1] + i];
      }
    }
  }

  // Check cell and throw relevant error
  #validateCell(cell, ship) {
    if (cell === undefined) {
      throw new RangeError(
        `Cannot place "${ship.getName()}" here because it is out of bounds.`,
      );
    } else if (cell.ship !== 'none') {
      throw new Error(
        `Cannot place "${ship.getName()}" here because it is occupied by "${cell.ship.getName()}".`,
      );
    }
  }

  // Iterate through cells at given coords and check for errors
  #validatePlacement(ship, coords, orientation) {
    const generator = this.#getNextCell(ship, coords, orientation);

    for (let nextCell of generator) {
      this.#validateCell(nextCell, ship);
    }
  }

  // Iterate through cells at given coords and set to ship instance
  #placeShip(ship, coords, orientation) {
    const generator = this.#getNextCell(ship, coords, orientation);

    for (let nextCell of generator) {
      nextCell.ship = ship;
    }

    this.#allShips.push(ship);
  }

  // Try to place a ship and intercept errors
  safePlaceShip(ship, coords, orientation) {
    try {
      this.#validatePlacement(ship, coords, orientation);
      this.#placeShip(ship, coords, orientation);
    } catch ({ name, message }) {
      console.log(`${name}: ${message}`);
    }
  }

  placeAllShips(shipSet) {
    this.placeAllShipsRandomly(shipSet);
  }

  randCoordinates() {
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
  placeAllShipsRandomly(shipSet) {
    let numShipsAdded;
    let success;
    let tries = 0;

    shipSet.forEach((ship, index) => {
      do {
        const randCoords = this.randCoordinates();
        const randOrient = this.randOrientation();
        this.safePlaceShip(ship, randCoords, randOrient);

        numShipsAdded = this.getAllShips().length;
        success = numShipsAdded === index + 1;

        tries += 1;
        if (tries > 1000)
          throw new Error('Oops! Tried too many times to place ship!'); // Prevent infinite loop
      } while (!success); // Loop again if ship couldn't be placed
    });
  }

  receiveAttack(coords) {
    const grid = this.getGrid();
    const targetCell = grid[coords[0]][coords[1]];
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
    const ships = this.getAllShips();
    return ships.every((ship) => ship.isSunk() === true);
  }
}
