// Player.js

export default class Player {
  #name;
  #gameboard;

  constructor(name, gameboard) {
    this.#name = name;
    this.#gameboard = gameboard;
  }

  getGameboard() {
    return this.#gameboard;
  }

  getName() {
    return this.#name;
  }
}
