// Gameboard.test.js

import Gameboard from './Gameboard';

describe('Gameboard class', () => {
  it('should exist', () => {
    expect(Gameboard).toBeDefined();
  });

  let gameboard;

  beforeEach(() => {
    gameboard = new Gameboard();
  });

  describe('getGrid method', () => {
    it('should return an array', () => {
      const result = gameboard.getGrid();
      const isArray = Array.isArray(result);
      expect(isArray).toBe(true);
    });

    it('should return an array with 10 rows', () => {
      const gridArray = gameboard.getGrid();
      const len = gridArray.length;
      const numRows = 10;
      expect(len).toBe(numRows);
    });

    it('should return an array with each row containing 10 items', () => {
      const gridArray = gameboard.getGrid();

      // Loop through grid array and check sub-arrays
      gridArray.forEach((row) => {
        const len = row.length;
        const numItems = 10;
        expect(len).toBe(numItems);
      });
    });
  });

  describe('placeShip method', () => {
    let grid;

    beforeEach(() => {
      grid = gameboard.getGrid();
    });

    describe('when ship has length:2, name:"Patrol Boat", and orientation is "horizontal"', () => {
      let cell;

      beforeEach(() => {
        const fakedShip = { name: 'Patrol Boat', length: 2 };
        const coords = [0, 0];
        const orientation = 'horizontal';
        gameboard.placeShip(fakedShip, coords, orientation);
        cell = grid[0][0];
      });

      it('should place ship object named "Patrol Boat" on grid', () => {
        const { name } = cell.ship;
        expect(name).toBe('Patrol Boat');
      });

      it('should show that "Patrol Boat" occupies 2 cells on grid', () => {
        // Use reduce + filter to count number of cells that contain given ship
        const matchedCells = grid.reduce((acc, curColumn) => {
          const matches = curColumn.filter(
            (cell) => cell.ship.name == 'Patrol Boat',
          );
          const count = matches.length;
          return acc + count;
        }, 0);

        expect(matchedCells).toBe(2);
      });

      it('should add ship to cells [0, 0] and [0, 1] when we specify "horizontal" for orientation', () => {
        const fakedShip = { name: 'Patrol Boat', length: 2 };
        const coords = [0, 0];
        gameboard.placeShip(fakedShip, coords, 'horizontal');
        const cell1 = grid[0][0];
        const cell2 = grid[0][1];

        expect(cell1.ship.name).toBe('Patrol Boat');
        expect(cell2.ship.name).toBe('Patrol Boat');
      });
    });

    describe('when ship has length:3, name:"Destroyer" and coords are [5, 4]', () => {
      it('should add ship to cells [5, 4], [6, 4], [7, 4]  when we specify "vertical" for orientation', () => {
        const fakedShip = { name: 'Destroyer', length: 3 };
        const coords = [5, 4];
        const orientation = 'vertical';
        gameboard.placeShip(fakedShip, coords, orientation);
        const cell1 = grid[5][4];
        const cell2 = grid[6][4];
        const cell3 = grid[7][4];

        expect(cell1.ship.name).toBe('Destroyer');
        expect(cell2.ship.name).toBe('Destroyer');
        expect(cell3.ship.name).toBe('Destroyer');
      });
    });

    describe('when trying to place a ship on an occupied cell [5, 4]', () => {
      it.only('raises an error and does not place the ship', () => {
        const fakedShip1 = { name: 'Destroyer', length: 3 };
        const fakedShip2 = { name: 'Destroyer', length: 3 };
        gameboard.placeShip(fakedShip1, [5, 4], 'horizontal');
        gameboard.placeShip(fakedShip2, [5, 4], 'horizontal');
      });
    });

    describe('when trying to place a ship that will go out-of-bounds', () => {
      it.skip('', () => {});
    });
  });
});
