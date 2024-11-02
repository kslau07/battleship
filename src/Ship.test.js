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

  // FIXME: DELETE ME, NOT PUBLIC
  // it.skip('initializes with a name, length, 0 hits, and false for sunk', () => {
  //   expect(ship.name).toBe('Destroyer');
  //   expect(ship.length).toBe(3);
  //   expect(ship.hits).toBe(0);
  //   expect(ship.sunk).toBe(false);
  // });

  // hit() method - COMMAND FUNCTION - produces side-effects, returns nothing
  it('hit method', () => {
    ship.hit();
    expect(ship.hits).toBe(1);
  });
});
