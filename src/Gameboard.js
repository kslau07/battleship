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
    const gridLength = numRows;

    for (let rowIdx = 0; rowIdx < gridLength; rowIdx += 1) {
      const curRow = [];
      for (let colIdx = 0; colIdx < gridLength; colIdx += 1) {
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
    this.#placedShips = [];
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

  // Iterate through cells at given gridCoords and check for errors
  #validatePlacement({ ship, gridCoords, orientation }) {
    const shipLength = ship.getLength();
    const grid = this.getGrid();
    const [xStart, yStart] = gridCoords;
    const directions = { horizontal: [0, 1], vertical: [1, 0] };
    const [xFactor, yFactor] = directions[orientation];
    const placementCells = [];

    // NOTE: Redundant check for out-of-bounds, can delete
    // Check if ship would go out of bounds
    const xEnd = xStart + xFactor * (shipLength - 1);
    const yEnd = yStart + yFactor * (shipLength - 1);
    const gridLength = grid.length;
    if (xEnd >= gridLength || yEnd >= gridLength || xStart < 0 || yStart < 0) {
      return false;
    }

    // Check if all cells are available
    for (let i = 0; i < shipLength; i += 1) {
      const x = xStart + xFactor * i;
      const y = yStart + yFactor * i;

      if (grid[x][y] === undefined || grid[x][y].ship !== 'none') {
        return false;
      }

      placementCells.push(grid[x][y]);
    }

    return placementCells;
  }

  #placeShip(placementCells, ship, gridCoords, orientation) {
    placementCells.forEach((cell) => (cell.ship = ship));

    const placementObj = { ship, gridCoords, orientation };
    this.#placedShips.push(placementObj);
  }

  // Try to place a ship and return placement information
  safePlaceShip({ ship, gridCoords, orientation }) {
    const placement = this.#validatePlacement({
      ship,
      gridCoords,
      orientation,
    });

    if (placement === false) return false;

    this.#placeShip(placement, ship, gridCoords, orientation);
    return { ship, gridCoords, orientation };
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
