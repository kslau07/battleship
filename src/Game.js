// Game.js

import Player from './Player.js';

export default class Game {
  #player1;
  #player2;
  #curPlayer;
  #gameOver;

  static createPlayer(name) {
    return new Player(name);
  }

  constructor(player1, player2) {
    player1 = player1 !== undefined ? player1 : Game.createPlayer('player1');
    player2 = player2 !== undefined ? player2 : Game.createPlayer('player2');

    this.#player1 = player1;
    this.#player2 = player2;
  }

  createNewMatch(randomStartingPlayer = true) {
    this.#gameOver = false;

    if (randomStartingPlayer === true) {
      const randPlayer = [this.#player1, this.#player2][
        Math.floor(Math.random() * 2)
      ];
      this.#curPlayer = randPlayer;
    } else {
      this.#curPlayer = this.#player1;
    }
  }

  getPlayers() {
    return [this.#player1, this.#player2];
  }

  getCurPlayer() {
    return this.#curPlayer;
  }

  getCurEnemy() {
    return this.#curPlayer === this.#player1 ? this.#player2 : this.#player1;
  }

  #switchCurPlayer() {
    this.#curPlayer =
      this.#curPlayer === this.#player1 ? this.#player2 : this.#player1;
  }

  #endGame() {
    this.#gameOver = true;
  }

  #isTied() {
    return false;
  }

  #checkGameEndConditions() {
    const allSunk = this.getCurEnemy().getGameboard().allSunk();
    const tied = this.#isTied();

    if (allSunk === true || tied === true) {
      return true;
    }

    return false;
  }

  endTurn() {
    const isEndOfGame = this.#checkGameEndConditions();

    if (isEndOfGame === true) {
      this.#endGame();
    }

    this.#switchCurPlayer();
  }

  isGameOver() {
    return this.#gameOver;
  }
}
