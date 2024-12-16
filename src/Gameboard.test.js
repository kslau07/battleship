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

  test('safePlaceShip method exists', () => {
    expect(gameboard).toHaveProperty('safePlaceShip');
  });

  test('receiveAttack method exists', () => {
    expect(gameboard).toHaveProperty('receiveAttack');
  });

  // Faked ships

  const fakedPatrolBoat = {
    getName() {
      return 'Patrol Boat';
    },

    getLength() {
      return 2;
    },
  };

  const fakedDestroyer = {
    getName() {
      return 'Destroyer';
    },
    getLength() {
      return 3;
    },
  };

  const fakedSubmarine = {
    getName() {
      return 'Submarine';
    },
    getLength() {
      return 3;
    },
  };

  const fakedBattleship = {
    getName() {
      return 'Battleship';
    },
    getLength() {
      return 4;
    },
  };
  const fakedCarrier = {
    getName() {
      return 'Carrier';
    },
    getLength() {
      return 5;
    },
  };

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

  describe('safePlaceShip method', () => {
    let grid;

    beforeEach(() => {
      grid = gameboard.getGrid();
    });

    describe('when ship has length:2, name:"Patrol Boat", and orientation is "horizontal"', () => {
      beforeEach(() => {
        const ship = fakedPatrolBoat;
        const coords = [0, 0];
        const orientation = 'horizontal';

        gameboard.safePlaceShip(ship, coords, orientation);
      });

      it('should place ship object named "Patrol Boat" on grid at [0, 0]', () => {
        const targetCell = grid[0][0];
        const shipName = targetCell.ship.getName();
        expect(shipName).toBe('Patrol Boat');
      });

      it('should show that "Patrol Boat" occupies 2 cells on grid', () => {
        // Use reduce + filter to count number of cells that contain given ship on grid
        const numGridMatches = grid.reduce((acc, curRow) => {
          const numRowMatches = curRow.filter(
            (curCell) =>
              curCell.ship !== 'none' &&
              curCell.ship.getName() === 'Patrol Boat',
          );
          const count = numRowMatches.length;
          return acc + count;
        }, 0);

        expect(numGridMatches).toBe(2);
      });

      it('should add "Patrol Boat" to grid cells [0, 0] and [0, 1]', () => {
        const cell1 = grid[0][0];
        const cell2 = grid[0][1];

        expect(cell1.ship.getName()).toBe('Patrol Boat');
        expect(cell2.ship.getName()).toBe('Patrol Boat');
      });
    });

    describe('when ship has length:3, name:"Destroyer" and coords are [5, 4]', () => {
      it('should add ship to cells [5, 4], [6, 4], [7, 4]  when we specify "vertical" for orientation', () => {
        const ship = fakedDestroyer;
        const coords = [5, 4];
        const orientation = 'vertical';
        gameboard.safePlaceShip(ship, coords, orientation);
        const cell1 = grid[5][4];
        const cell2 = grid[6][4];
        const cell3 = grid[7][4];

        expect(cell1.ship.getName()).toBe('Destroyer');
        expect(cell2.ship.getName()).toBe('Destroyer');
        expect(cell3.ship.getName()).toBe('Destroyer');
      });
    });

    describe('when placing a second ship on the grid', () => {
      it('does not place the second ship when coords at [5, 4] are already occupied', () => {
        // console.log = jest.fn();
        gameboard.safePlaceShip(fakedPatrolBoat, [5, 4], 'horizontal');
        gameboard.safePlaceShip(fakedDestroyer, [5, 4], 'horizontal');
        const shipNameOnCell = grid[5][4].ship.getName();

        expect(shipNameOnCell).toBe('Patrol Boat');
        expect(shipNameOnCell).not.toBe('Destroyer');
      });

      it('successfully places the second ship at unoccupied coordinates [1, 1]', () => {
        gameboard.safePlaceShip(fakedPatrolBoat, [5, 4], 'horizontal');
        gameboard.safePlaceShip(fakedDestroyer, [1, 1], 'horizontal');

        const shipNameOnFirstCoords = grid[5][4].ship.getName();
        const shipNameOnSecondCoords = grid[1][1].ship.getName();

        expect(shipNameOnFirstCoords).toBe('Patrol Boat');
        expect(shipNameOnSecondCoords).toBe('Destroyer');
      });
    });

    describe('when trying to place a long ship (Carrier) that spans across an occupied space', () => {
      it('does not place the second ship', () => {
        // console.log = jest.fn();
        gameboard.safePlaceShip(fakedSubmarine, [0, 7], 'horizontal');
        gameboard.safePlaceShip(fakedCarrier, [0, 3], 'horizontal');
        const shipNameOnCell = grid[0][7].ship.getName();

        expect(shipNameOnCell).not.toBe('Carrier');
        expect(shipNameOnCell).toBe('Submarine');
      });
    });

    describe('when trying to place a ship (vertically) that is out-of-bounds', () => {
      it('does not place the ship', () => {
        // console.log = jest.fn();
        const fakedBattleship = { name: 'Battleship', length: 4 };
        const targetCell = [7, 0];
        gameboard.safePlaceShip(fakedBattleship, targetCell, 'vertical');
        const grid = gameboard.getGrid();
        const targetCellShip = grid[targetCell[0]][targetCell[1]].ship;

        expect(targetCellShip).toBe('none');
      });
    });

    describe('when trying to place a ship (horizontally) that is out-of-bounds', () => {
      it('does not place the ship', () => {
        // console.log = jest.fn();
        const targetCell = [0, 7];
        gameboard.safePlaceShip(fakedBattleship, targetCell, 'horizontal');

        const refreshGrid = gameboard.getGrid();
        const targetCellShip = refreshGrid[targetCell[0]][targetCell[1]].ship;

        expect(targetCellShip).toBe('none');
      });
    });

    describe('when trying to place a ship out-of-range of grid -> [99, 0]', () => {
      it('shows "undefined" for cell at [99, 0]', () => {
        // console.log = jest.fn();
        const targetCell = [99, 0];
        gameboard.safePlaceShip(fakedSubmarine, targetCell, 'horizontal');
        const targetCellShip = grid[targetCell[0]]?.[targetCell[1]];

        expect(targetCellShip).toBeUndefined;
      });
    });
  });

  describe('placeAllShips method', () => {
    let grid;
    let defaultShipSet;
    // console.log = jest.fn();

    beforeEach(() => {
      defaultShipSet = [
        fakedPatrolBoat,
        fakedSubmarine,
        fakedBattleship,
        fakedDestroyer,
        fakedCarrier,
      ];

      grid = gameboard.getGrid();
    });

    it('changes length of getAllShips from 0 to 5', () => {
      const startingShipsLength = gameboard.getAllShips().length;
      gameboard.placeAllShips(defaultShipSet);
      const endingShipsLength = gameboard.getAllShips().length;

      expect(startingShipsLength).toBe(0);
      expect(endingShipsLength).toBe(5);
    });

    it('changes grid to have only 83 cells not occupied by a ship', () => {
      gameboard.placeAllShips(defaultShipSet);
      const grid = gameboard.getGrid();

      // Use reduce to count cells with ship === 'none'
      const numEmpty = grid.reduce((acc, curRow) => {
        const count = curRow.filter(
          (curCell) => curCell.ship === 'none',
        ).length;
        return acc + count;
      }, 0);

      expect(numEmpty).toBe(83); // 100 - 17 (17 is total length of all ships)
    });
  });

  describe('receiveAttack method', () => {
    let grid;

    beforeEach(() => {
      grid = gameboard.getGrid();
    });

    it("it accepts `coords` and changes a cell's attacked property to true", () => {
      const targetCell = grid[0][0];
      expect(targetCell.isAttacked()).toBe(false);
      const coords = [0, 0];

      gameboard.receiveAttack(coords);
      expect(targetCell.isAttacked()).toBe(true);
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
        const fakedCarrier = {
          getName() {
            return 'Carrier';
          },
          getLength() {
            return 5;
          },
          hit: mockHit,
        };

        gameboard.safePlaceShip(fakedCarrier, coords, 'vertical');
        gameboard.receiveAttack(coords);

        // We make sure hit() is invoked through a mock.
        // We do not test its implementation details, that unit test lives in the 'Ship' module already.
        expect(mockHit.mock.contexts[0]).toBe(fakedCarrier);
        expect(mockHit.mock.calls).toHaveLength(1);
      });
    });
  });

  describe('allSunk method', () => {
    beforeEach(() => {
      // Create 'sunk' ships by merging {sunk:true} to our ships
      const sunkObj = {
        isSunk() {
          return true;
        },
      };

      // Add all ships except Patrol Boat to grid
      const fakedSunkSubmarine = { ...fakedSubmarine, ...sunkObj };
      const fakedSunkDestroyer = { ...fakedCarrier, ...sunkObj };
      const fakedSunkBattleship = { ...fakedBattleship, ...sunkObj };
      const fakedSunkCarrier = { ...fakedCarrier, ...sunkObj };

      gameboard.safePlaceShip(fakedSunkCarrier, [4, 4], 'vertical');
      gameboard.safePlaceShip(fakedSunkBattleship, [1, 3], 'horizontal');
      gameboard.safePlaceShip(fakedSunkDestroyer, [4, 3], 'vertical');
      gameboard.safePlaceShip(fakedSunkSubmarine, [0, 6], 'horizontal');
    });

    it('returns true when all ships have been sunk on gameboard', () => {
      const fakedSunkPatrolBoat = {
        ...fakedPatrolBoat,
        isSunk() {
          return true;
        },
      };

      gameboard.safePlaceShip(fakedSunkPatrolBoat, [1, 9], 'vertical');
      expect(gameboard.allSunk()).toBe(true);
    });

    it('returns false when there are unsunk ships on gameboard', () => {
      const fakedSunkPatrolBoat = {
        ...fakedPatrolBoat,
        isSunk() {
          return false;
        },
      };

      gameboard.safePlaceShip(fakedSunkPatrolBoat, [1, 9], 'vertical');
      expect(gameboard.allSunk()).toBe(false);
    });
  });
});
