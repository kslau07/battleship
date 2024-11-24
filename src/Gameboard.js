// Gameboard.js

export default class Gameboard {
  #grid;
  #allShips;

  static #buildGrid() {
    const gridArray = [];
    const numRows = 10;
    const numCols = 10;

    Array.from({ length: numRows }, () => {
      const currentRow = [];
      Array.from({ length: numCols }, () => {
        const newCell = { attacked: false, ship: 'none' };
        currentRow.push(newCell);
      });
      gridArray.push(currentRow);
    });

    return gridArray;
  }

  constructor() {
    this.#grid = Gameboard.#buildGrid();
    this.#allShips = [];
  }

  getGrid() {
    return this.#grid;
  }

  getAllShips() {
    return this.#allShips;
  }

  // Check cell and throw relevant error
  #validateCell(cell, ship) {
    if (cell === undefined) {
      throw new RangeError('Out of bounds');
    } else if (cell.ship !== 'none') {
      throw new Error(
        `Cannot place "${ship.name}" because a cell is already occupied by "${cell.ship.name}".`,
      );
    }
  }

  *#getNextCell(ship, coords, orientation) {
    const grid = this.getGrid();

    for (let i = 0; i < ship.length; i += 1) {
      if (orientation === 'vertical') {
        yield grid[coords[0] + i]?.[coords[1]]; // Use optional chaining operator (?.) to try to access next hypothetical cell
      } else if (orientation === 'horizontal') {
        yield grid[coords[0]]?.[coords[1] + i];
      }
    }
  }

  placeShip(ship, coords, orientation) {
    const gridDeepClone = JSON.parse(JSON.stringify(this.#grid));
    const generator = this.#getNextCell(ship, coords, orientation);

    try {
      for (let nextCell of generator) {
        this.#validateCell(nextCell, ship);
        nextCell.ship = ship;
      }
      this.#allShips.push(ship); // Only add ship if no errors above
    } catch ({ name, message }) {
      console.log(`${name}: ${message}`);
      this.#grid = gridDeepClone; // Revert grid when error thrown
    }
  }

  receiveAttack(coords) {
    const grid = this.getGrid();
    const targetCell = grid[coords[0]][coords[1]];
    const { attacked } = targetCell;

    if (attacked === true) {
      throw new Error('You have already attacked this cell!');
    }

    if (targetCell.ship !== 'none') {
      targetCell.ship.hit();
    }

    targetCell.attacked = true;
  }

  allSunk() {
    const ships = this.getAllShips();
    return ships.every((ship) => ship.sunk === true);
  }
}
