// Player.js

import Gameboard from './Gameboard.js';

export default class Player {
  #name;
  #gameboard;

  static createGameboard() {
    // const shipSet = [];
    // Game.defaultShipSet.forEach((ship) =>
    //   shipSet.push(new Ship(ship.name, ship.length)),
    // );
    // return new Gameboard(shipSet);
    return new Gameboard();
  }

  constructor(name, computer = false, gameboard = Player.createGameboard()) {
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
