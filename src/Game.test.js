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
      const p1Instance = gameInstance.getPlayer1();
      expect(p1Instance instanceof Player).toBe(true);
    });
  });

  describe('getPlayer2 method', () => {
    it('returns the player2 object', () => {
      const p2Instance = gameInstance.getPlayer2();
      expect(p2Instance instanceof Player).toBe(true);
    });
  });

  describe('getPlayers', () => {
    it('returns both players', () => {
      const p1Instance = gameInstance.getPlayer1();
      const p2Instance = gameInstance.getPlayer2();

      expect(gameInstance.getPlayers()).toEqual({
        player1: p1Instance,
        player2: p2Instance,
      });
    });
  });

  describe('getOppositePlayer', () => {
    it('returns player2 when given player1 instance', () => {
      const p1Instance = gameInstance.getPlayer1();
      const p2Instance = gameInstance.getPlayer2();
      expect(gameInstance.getOppositePlayer(p1Instance)).not.toBe(p1Instance);
      expect(gameInstance.getOppositePlayer(p1Instance)).toBe(p2Instance);
    });

    it('returns player1 when given player2 instance', () => {
      const p1Instance = gameInstance.getPlayer1();
      const p2Instance = gameInstance.getPlayer2();
      expect(gameInstance.getOppositePlayer(p2Instance)).not.toBe(p2Instance);
      expect(gameInstance.getOppositePlayer(p2Instance)).toBe(p1Instance);
    });

    it('throws a TypeError when not given an instance of Player', () => {
      const incorrectObj = () => {
        gameInstance.getOppositePlayer('incorrect object');
      };

      expect(incorrectObj).toThrow(TypeError);
      expect(incorrectObj).toThrow(
        'Error: Expected an instance of the Player class.',
      );
    });
  });
});
