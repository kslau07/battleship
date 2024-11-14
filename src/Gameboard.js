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

  hasClearedSpace(ship, coords, orientation, grid) {
    const cells = [];

    for (let i = 0; i < ship.length; i += 1) {
      if (orientation === 'horizontal') {
        cells.push(grid[coords[0]][coords[1] + i]);
      } else if (orientation === 'vertical') {
        cells.push((grid[coords[0] + i][coords[1]].ship = ship));
      }
    }

    const isFree = cells.every((cell) => cell.ship === 'none');
    return isFree;
  }

  isWithinBoundaries(ship, coords, orientation) {}

  placeShip(ship, coords, orientation) {
    const { hasClearedSpace, isWithinBoundaries, grid } = this;

    if (!hasClearedSpace(ship, coords, orientation, grid)) {
      throw new Error('Oops! You already have a ship there!');
    }

    // if (!isWithinBoundaries(ship, coords, orientation)) {
    // throw new Error('Oops! Ship was placed out of bounds!');
    // }

    for (let i = 0; i < ship.length; i += 1) {
      if (orientation === 'horizontal') {
        grid[coords[0]][coords[1] + i].ship = ship;
      } else if (orientation === 'vertical') {
        grid[coords[0] + i][coords[1]].ship = ship;
      }
    }
  }
}
