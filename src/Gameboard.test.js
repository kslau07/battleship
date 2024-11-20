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
        const { name: shipName } = cell.ship;
        expect(shipName).toBe('Patrol Boat');
      });

      it('should show that "Patrol Boat" occupies 2 cells on grid', () => {
        // Use reduce + filter to count number of cells that contain given ship
        const matchedCells = grid.reduce((acc, curColumn) => {
          const matches = curColumn.filter(
            (curCell) => curCell.ship.name === 'Patrol Boat',
          );
          const count = matches.length;
          return acc + count;
        }, 0);

        expect(matchedCells).toBe(2);
      });

      it('should add "Patrol Boat" to grid cells [0, 0] and [0, 1]', () => {
        const cell1 = grid[0][0];
        const cell2 = grid[0][1];

        expect(cell1.ship.name).toBe('Patrol Boat');
        expect(cell2.ship.name).toBe('Patrol Boat');
      });
    });

    describe('when ship has length:3, name:"Destroyer" and coords are [5, 4]', () => {
      it('should add ship to cells [5, 4], [6, 4], [7, 4]  when we specify "vertical" for orientation', () => {
        const fakedDestroyer = { name: 'Destroyer', length: 3 };
        const coords = [5, 4];
        const orientation = 'vertical';
        gameboard.placeShip(fakedDestroyer, coords, orientation);
        const cell1 = grid[5][4];
        const cell2 = grid[6][4];
        const cell3 = grid[7][4];

        expect(cell1.ship.name).toBe('Destroyer');
        expect(cell2.ship.name).toBe('Destroyer');
        expect(cell3.ship.name).toBe('Destroyer');
      });
    });

    describe('when placing a second ship on the same cell [5, 4]', () => {
      it('does not place the second ship', () => {
        const fakedPatrolBoat = { name: 'Patrol Boat', length: 2 };
        const fakedDestroyer = { name: 'Destroyer', length: 3 };
        gameboard.placeShip(fakedPatrolBoat, [5, 4], 'horizontal');
        gameboard.placeShip(fakedDestroyer, [5, 4], 'horizontal');
        const shipNameOnCell = grid[5][4].ship.name;

        expect(shipNameOnCell).not.toBe('Destroyer');
        expect(shipNameOnCell).toBe('Patrol Boat');
      });
    });

    describe('when trying to place a long ship (Carrier) that spans across an occupied space', () => {
      it('does not place the second ship', () => {
        const fakedSubmarine = { name: 'Submarine', length: 3 };
        gameboard.placeShip(fakedSubmarine, [0, 7], 'horizontal');
        const fakedCarrier = { name: 'Carrier', length: 5 };
        gameboard.placeShip(fakedCarrier, [0, 3], 'horizontal');
        const shipNameOnCell = grid[0][7].ship.name;

        expect(shipNameOnCell).not.toBe('Carrier');
        expect(shipNameOnCell).toBe('Submarine');
      });
    });

    describe('when trying to place a ship (vertically) that is out-of-bounds', () => {
      it('does not place the ship', () => {
        const fakedBattleship = { name: 'Battleship', length: 4 };
        const targetCell = [7, 0];
        gameboard.placeShip(fakedBattleship, targetCell, 'vertical');
        const targetCellShip = grid[targetCell[0]][targetCell[1]].ship;

        expect(targetCellShip).toBe('none');
      });
    });

    describe('when trying to place a ship (horizontally) that is out-of-bounds', () => {
      it('does not place the ship', () => {
        const fakedBattleship = { name: 'Battleship', length: 4 };
        const targetCell = [0, 7];
        gameboard.placeShip(fakedBattleship, targetCell, 'horizontal');
        const targetCellShip = grid[targetCell[0]][targetCell[1]].ship;

        expect(targetCellShip).toBe('none');
      });
    });

    describe('when trying to place a ship out-of-range of grid -> [99, 0]', () => {
      it('shows "undefined" for cell at [99, 0]', () => {
        const fakedSubmarine = { name: 'Submarine', length: 3 };
        const targetCell = [99, 0];
        gameboard.placeShip(fakedSubmarine, targetCell, 'horizontal');
        const targetCellShip = grid[targetCell[0]]?.[targetCell[1]];

        expect(targetCellShip).toBeUndefined;
      });
    });
  });
});
