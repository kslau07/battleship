// Player.test.js

import Player from './Player';
import Gameboard from './Gameboard';

jest.mock('./Gameboard'); // Gameboard is now a mock constructor

describe('Player class', () => {
  it('should exist', () => {
    expect(Player).toBeDefined();
  });

  let playerInstance;

  beforeEach(() => {
    // Gameboard.mockClear(); // Reset mocks with mockClear / clearAllMocks
    const gameboardInstance = new Gameboard();
    playerInstance = new Player(gameboardInstance);
  });

  describe('getGameboard method', () => {
    it('returns a gameboard instance', () => {
      const gbInstance = playerInstance.getGameboard();
      expect(gbInstance instanceof Gameboard).toBe(true);
    });
  });
});
