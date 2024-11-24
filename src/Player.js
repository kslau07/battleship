// Player.js

export default class Player {
  #gameboard;

  constructor(gameboard) {
    this.#gameboard = gameboard;
  }

  getGameboard() {
    return this.#gameboard;
  }
}
