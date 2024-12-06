// Game.test.js

import Game from './Game';
import Player from './Player';
import Gameboard from './Gameboard';

jest.mock('./Player');
jest.mock('./Gameboard');

describe('Game class', () => {
  it('should exist', () => {
    expect(Game).toBeDefined();
  });

  let gameInstance;

  beforeEach(() => {
    const gb1 = new Gameboard();
    const gb2 = new Gameboard();
    const player1 = new Player(gb1);
    const player2 = new Player(gb2);
    gameInstance = new Game(player1, player2);
  });

  describe('getPlayer1 method', () => {
    it('returns the player1 object', () => {
      const player1 = gameInstance.getPlayer1();
      expect(player1 instanceof Player).toBe(true);
    });
  });

  describe('getPlayer2 method', () => {
    it('returns the player2 object', () => {
      const player2 = gameInstance.getPlayer2();
      expect(player2 instanceof Player).toBe(true);
    });
  });
});
