// Ship.test.js

import Ship from './Ship';

describe('Ship class', () => {
  it('should exist', () => {
    expect(Ship).toBeDefined();
  });

  let shipInstance;

  beforeEach(() => {
    shipInstance = new Ship('Destroyer', 3);
  });

  // Test existence of certain Ship properties (methods)

  test('hit method exists', () => {
    expect(shipInstance).toHaveProperty('hit');
  });

  test('getHits method exists', () => {
    expect(shipInstance).toHaveProperty('getHits');
  });

  test('isSunk method exists', () => {
    expect(shipInstance).toHaveProperty('isSunk');
  });

  // Unit tests for the above methods in Ship

  // hit() method - COMMAND FUNCTION - produces side-effects, returns nothing
  describe('hit method', () => {
    it('when invoked once, increases `hits` from 0 to 1', () => {
      const oldHits = shipInstance.getHits();
      shipInstance.hit();
      const curHits = shipInstance.getHits();
      const difference = curHits - oldHits;
      expect(difference).toBe(1);
      expect(shipInstance.getHits()).toBe(1);
    });

    it('when invoked twice, increases `hits` from 0 to 2', () => {
      const oldHits = shipInstance.getHits();
      shipInstance.hit();
      shipInstance.hit();
      const curHits = shipInstance.getHits();
      const difference = curHits - oldHits;
      expect(difference).toBe(2);
      expect(shipInstance.getHits()).toBe(2);
    });
  });

  // isSunk() method - QUERY FUNCTION - no side-effects, returns a (boolean) value
  describe('isSunk method', () => {
    it('returns false when `hits` less than `length`', () => {
      shipInstance.hit();
      const result = shipInstance.isSunk();
      expect(result).toBe(false);
    });

    it('returns true when `hits` greater than or equal to `length`', () => {
      shipInstance.hit();
      shipInstance.hit();
      shipInstance.hit();
      const result = shipInstance.isSunk();
      expect(result).toBe(true);
    });
  });
});
