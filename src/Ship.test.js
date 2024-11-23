// Ship.test.js

import Ship from './Ship';

describe('Ship class', () => {
  it('should exist', () => {
    expect(Ship).toBeDefined();
  });

  let ship;

  beforeEach(() => {
    ship = new Ship('Destroyer', 3);
  });

  // hit() method - COMMAND FUNCTION - produces side-effects, returns nothing
  describe('hit method', () => {
    it('when invoked once, increases `hits` from 0 to 1', () => {
      const oldHits = ship.getHits();
      ship.hit();
      const curHits = ship.getHits();
      const difference = curHits - oldHits;
      expect(difference).toBe(1);
      expect(ship.getHits()).toBe(1);
    });

    it('when invoked twice, increases `hits` from 0 to 2', () => {
      const oldHits = ship.getHits();
      ship.hit();
      ship.hit();
      const curHits = ship.getHits();
      const difference = curHits - oldHits;
      expect(difference).toBe(2);
      expect(ship.getHits()).toBe(2);
    });
  });

  // isSunk() method - QUERY FUNCTION - no side-effects, returns a boolean
  describe('isSunk method', () => {
    it('returns false when `hits` less than `length`', () => {
      ship.hit();
      const result = ship.isSunk();
      expect(result).toBe(false);
    });

    it('returns true when `hits` greater than or equal to `length`', () => {
      ship.hit();
      ship.hit();
      ship.hit();
      const result = ship.isSunk();
      expect(result).toBe(true);
    });
  });
});
