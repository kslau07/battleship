// Player.test.js

import Player from './Player';
import Gameboard from './Gameboard';

jest.mock('./Gameboard'); // Gameboard is now a mock constructor

describe('Player class', () => {
  it('should exist', () => {
    expect(Player).toBeDefined();
  });

  let p1Instance;

  beforeEach(() => {
    const gameboardInstance = new Gameboard();
    p1Instance = new Player('player1', gameboardInstance);
  });

  describe('getGameboard method', () => {
    it('returns a gameboard instance', () => {
      const gbInstance = p1Instance.getGameboard();
      expect(gbInstance instanceof Gameboard).toBe(true);
    });
  });
});
