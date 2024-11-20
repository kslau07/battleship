// Gameboard.js

export default class Gameboard {
  static buildGrid() {
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
    this.grid = Gameboard.buildGrid();
  }

  getGrid() {
    return this.grid;
  }

  isValidCoordinates(coords) {
    const [colIndex, rowIndex] = coords;
    const maxIndex = 9;

    if (colIndex > maxIndex) return false;
    if (rowIndex > maxIndex) return false;

    return true;
  }

  isValidCell(nextCell) {
    if (nextCell === undefined) return 'Out of bounds';

    if (nextCell.ship !== 'none')
      return 'Cell is already occupied by another ship.';

    return true;
  }

  // Check ship placement cells are in-bounds and unoccupied
  isValidPlacement(ship, coords, orientation) {
    if (!this.isValidCoordinates(coords)) return false;

    const { grid } = this;

    let nextCell;
    for (let i = 0; i < ship.length; i += 1) {
      if (orientation === 'vertical') {
        nextCell = grid[coords[0] + i]?.[coords[1]]; // Use optional chaining operator (?.) to try to access next hypothetical cell
      } else if (orientation === 'horizontal') {
        nextCell = grid[coords[0]]?.[coords[1] + i];
      }

      if (this.isValidCell(nextCell) !== true) {
        return false;
      }
    }

    return true;
  }

  performPlacement(ship, coords, orientation) {
    const { grid } = this;

    let nextCell;
    for (let i = 0; i < ship.length; i += 1) {
      if (orientation === 'vertical') {
        nextCell = grid[coords[0] + i][coords[1]];
      } else if (orientation === 'horizontal') {
        nextCell = grid[coords[0]][coords[1] + i];
      }

      nextCell.ship = ship;
    }
  }

  placeShip(ship, coords, orientation) {
    if (this.isValidPlacement(ship, coords, orientation)) {
      this.performPlacement(ship, coords, orientation);
    }
  }
}
