// Player.test.js

import Player from './Player';

import Gameboard from './Gameboard';
jest.mock('./Gameboard'); // Gameboard is now a mock constructor

describe('Player class', () => {
  it('should exist', () => {
    expect(Player).toBeDefined();
  });

  let player;

  beforeEach(() => {
    // Gameboard.mockClear(); // Reset mocks with mockClear / clearAllMocks
    const gameboardInstance = new Gameboard();
    player = new Player(gameboardInstance);
  });

  describe('getGameboard method', () => {
    it('returns a gameboard instance', () => {
      const gbInstance = player.getGameboard();
      expect(gbInstance instanceof Gameboard).toBe(true);
    });
  });
});
