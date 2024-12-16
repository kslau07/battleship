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
  let player1;
  let player2;
  let gb1;
  let gb2;

  beforeEach(() => {
    gb1 = new Gameboard();
    gb2 = new Gameboard();
    player1 = new Player(gb1);
    player2 = new Player(gb2);
    gameInstance = new Game(player1, player2);
    gameInstance.createNewMatch(false); // Deterministic starting player
  });

  describe('getPlayers', () => {
    it('returns both players', () => {
      expect(gameInstance.getPlayers()).toEqual([player1, player2]);
    });
  });

  describe('getCurPlayer method', () => {
    it('returns the current player whose turn it is', () => {
      expect(gameInstance.getCurPlayer()).toBe(player1);
    });
  });

  describe('getCurEnemy method', () => {
    it('returns the player opposite the current player', () => {
      expect(gameInstance.getCurEnemy()).toBe(player2);
    });
  });

  describe('endTurn method', () => {
    it('invokes .allSunk on enemy gameboard to see if any ships remain', () => {
      const gameboard2 = gb2;
      const allSunkSpy = jest.spyOn(gameboard2, 'allSunk');
      const p2Spy = jest
        .spyOn(player2, 'getGameboard')
        .mockImplementation(() => gameboard2); // Make sure our mock player accesses our mock gameboard

      gameInstance.endTurn();
      expect(allSunkSpy).toHaveBeenCalled();
    });

    it('switches current player when game is not over yet (enemy has ships remaining)', () => {
      const gameboard2 = gb2;
      const allSunkSpy = jest
        .spyOn(gameboard2, 'allSunk')
        .mockImplementation(() => false); // Mock return of allSunk to be 'false'
      const p2Spy = jest
        .spyOn(player2, 'getGameboard')
        .mockImplementation(() => gameboard2);

      expect(gameInstance.getCurPlayer()).toBe(player1);
      gameInstance.endTurn();
      expect(gameInstance.getCurPlayer()).toBe(player2);
    });
  });

  describe('isGameOver method', () => {
    it('returns false when game is not over', () => {
      expect(gameInstance.isGameOver()).toBe(false);
    });
  });
});
