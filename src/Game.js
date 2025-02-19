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

  constructor(
    player1 = Game.createPlayer('Player One'),
    player2 = Game.createPlayer('Player Two'),
    newMatch = true,
  ) {
    this.#player1 = player1;
    this.#player2 = player2;

    if (newMatch === true) this.createNewMatch();
  }

  // Methods with 'facade pattern' to abstact away excessive method chaining

  getShipForPlayer(player, shipName) {
    return player
      .getGameboard()
      .getCreatedShips()
      .find((shipObj) => shipObj.getName() === shipName);
  }

  safePlaceShipForPlayer({ player, ship, gridCoords, orientation }) {
    return player
      .getGameboard()
      .safePlaceShip({ ship, gridCoords, orientation });
  }

  randomizeShipsCurrentPlayer() {
    return this.#curPlayer.getGameboard().placeShipsRandomly();
  }

  getCurrentPlayerGameboard() {
    return this.#curPlayer.getGameboard();
  }

  createNewMatch(randomizeStartingPlayer = true) {
    randomizeStartingPlayer = false; // FIXME: REMOVE LATER, force deterministic while dev

    this.#gameOver = false;

    if (randomizeStartingPlayer === true) {
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

  getPlayer1() {
    return this.#player1;
  }

  getPlayer2() {
    return this.#player2;
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
