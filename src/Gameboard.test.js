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

  // Test existence of certain Gameboard properties (methods)
  // Test only the methods that need to interact with components outside of Gameboard

  test('getGrid method exists', () => {
    expect(gameboard).toHaveProperty('getGrid');
  });

  test('placeShip method exists', () => {
    expect(gameboard).toHaveProperty('placeShip');
  });

  test('receiveAttack method exists', () => {
    expect(gameboard).toHaveProperty('receiveAttack');
  });

  // Unit tests for the above methods

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
      beforeEach(() => {
        const fakedShip = { name: 'Patrol Boat', length: 2 };
        const coords = [0, 0];
        const orientation = 'horizontal';
        gameboard.placeShip(fakedShip, coords, orientation);
      });

      it('should place ship object named "Patrol Boat" on grid at [0, 0]', () => {
        const testCell = grid[0][0];
        const { name: shipName } = testCell.ship;
        expect(shipName).toBe('Patrol Boat');
      });

      it('should show that "Patrol Boat" occupies 2 cells on grid', () => {
        // Use reduce + filter to count number of cells that contain given ship on grid
        const numGridMatches = grid.reduce((acc, curColumn) => {
          const numColMatches = curColumn.filter(
            (curCell) => curCell.ship.name === 'Patrol Boat',
          );
          const count = numColMatches.length;
          return acc + count;
        }, 0);

        expect(numGridMatches).toBe(2);
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

    describe('when placing a second ship on the grid', () => {
      it('does not place the second ship when coords at [5, 4] are already occupied', () => {
        const fakedPatrolBoat = { name: 'Patrol Boat', length: 2 };
        const fakedDestroyer = { name: 'Destroyer', length: 3 };
        gameboard.placeShip(fakedPatrolBoat, [5, 4], 'horizontal');
        gameboard.placeShip(fakedDestroyer, [5, 4], 'horizontal');
        const shipNameOnCell = grid[5][4].ship.name;

        expect(shipNameOnCell).toBe('Patrol Boat');
        expect(shipNameOnCell).not.toBe('Destroyer');
      });

      it('places the second ship when coords at [1, 1] and unoccupied', () => {
        const fakedPatrolBoat = { name: 'Patrol Boat', length: 2 };
        gameboard.placeShip(fakedPatrolBoat, [5, 4], 'horizontal');

        const fakedDestroyer = { name: 'Destroyer', length: 3 };
        gameboard.placeShip(fakedDestroyer, [1, 1], 'horizontal');

        const shipNameOnFirstCoords = grid[5][4].ship.name;
        const shipNameOnSecondCoords = grid[1][1].ship.name;

        expect(shipNameOnFirstCoords).toBe('Patrol Boat');
        expect(shipNameOnSecondCoords).toBe('Destroyer');
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
        const grid = gameboard.getGrid();
        const targetCellShip = grid[targetCell[0]][targetCell[1]].ship;

        expect(targetCellShip).toBe('none');
      });
    });

    describe('when trying to place a ship (horizontally) that is out-of-bounds', () => {
      it('does not place the ship', () => {
        const fakedBattleship = { name: 'Battleship', length: 4 };
        const targetCell = [0, 7];
        gameboard.placeShip(fakedBattleship, targetCell, 'horizontal');

        const refreshGrid = gameboard.getGrid();
        const targetCellShip = refreshGrid[targetCell[0]][targetCell[1]].ship;

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

  // TODO:
  //      Gameboards should have a receiveAttack function that takes a pair of coordinates,
  //      determines whether or not the attack hit a ship and then sends the ‘hit’ function
  //      to the correct ship, or records the coordinates of the missed shot.
  //      1. Write test for recieveAttack
  //         a. This method will take `coords`
  //      2. Test should fail
  //      3. Write actual method -> receiveAttack(coords)
  //         a. Check grid at coords.
  //            i. Check if cell's `attacked` property is `false`.
  //               * If false, then update cell's `attacked` property to `true`.
  //               * If true, then return some kind of error that cell has already been attacked, do not check if there is a ship.
  //            ii. Check if cell's `ship` property is `none` or if there is a ship on it.
  //               * If there is a ship, invoke the ship's `hit()` method.
  //               * If there is none, do nothing.

  describe('receiveAttack method', () => {
    let grid;

    beforeEach(() => {
      grid = gameboard.getGrid();
    });

    it("it accepts `coords` and changes a cell's attacked property to true", () => {
      const targetCell = grid[0][0];
      expect(targetCell.attacked).toBe(false);
      const coords = [0, 0];

      gameboard.receiveAttack(coords);
      expect(targetCell.attacked).toBe(true);
    });

    it('does not raise an error when a cell is attacked the first time', () => {
      const coords = [9, 9];
      const attackOnce = () => {
        gameboard.receiveAttack(coords);
      };

      expect(attackOnce).not.toThrow(Error);
    });

    it('raises an error when a cell has already been attacked before', () => {
      const coords = [9, 9];
      const attackSameCellTwice = () => {
        gameboard.receiveAttack(coords);
        gameboard.receiveAttack(coords);
      };

      expect(attackSameCellTwice).toThrow(Error);
    });

    describe('when the given `coords` targets a cell with a ship', () => {
      it("calls the ship's `hit` method once", () => {
        const coords = [3, 4];
        const mockHit = jest.fn();
        const fakedCarrier = { name: 'Carrier', length: 5, hit: mockHit };

        gameboard.placeShip(fakedCarrier, coords, 'vertical');
        gameboard.receiveAttack(coords);

        // We make sure hit() is invoked through a mock.
        // We do not test its implementation details, that unit test lives in the Ship module already.
        expect(mockHit.mock.contexts[0]).toBe(fakedCarrier);
        expect(mockHit.mock.calls).toHaveLength(1);
      });
    });
  });

  describe('allSunk method', () => {
    it.skip('returns true when all ships for target gameboard have been sunk', () => {
      // Add all 5 ships to gameboard
      const fakedCarrier = { name: 'Carrier', length: 5, hit: mockHit };
      // const fakedCarrier = { name: 'Battleship', length: 4, hit: mockHit };
      // const fakedCarrier = { name: 'Destroyer', length: 3, hit: mockHit };
      // const fakedCarrier = { name: 'Submarine', length: 3, hit: mockHit };
      // const fakedCarrier = { name: 'Patrol Boat', length: 2, hit: mockHit };

      gameboard.placeShip();
      // Sink all of the ships
      // Invoke allSunk(), it should return true
      expect(gameboard.allSunk()).toBe(true);
    });

    it.skip('returns false when there are remaining ships on target gameboard', () => {
      expect(gameboard.allSunk()).toBe(false);
    });
  });
});
