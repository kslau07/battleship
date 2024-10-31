// Ship.test.js

import { Ship } from './Ship';

describe('Ship class', () => {
  let ship;

  beforeEach(() => {
    ship = new Ship();
  });

  test('foo function', () => {
    expect(ship.foo()).toBe('foo value');
  });
});
