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

  // FIXME: Change name of foo method
  describe('foo method', () => {
    it('should return 5', () => {
      const result = gameboard.foo();
      expect(result).toBe(5);
    });
  });
});
