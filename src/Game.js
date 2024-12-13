// Game.js

import Gameboard from './Gameboard.js';
import Player from './Player.js';
import Ship from './Ship.js';

export default class Game {
  #player1;
  #player2;
  #curPlayer;

  static defaultShipSet = [
    // FIXME: UNCOMMENT BELOW
    // { name: 'Cruiser', length: 5 },
    // { name: 'Battleship', length: 4 },
    // { name: 'Destroyer', length: 3 },
    // { name: 'Submarine', length: 3 },
    { name: 'Patrol Boat', length: 2 },
  ];

  static createGameboard() {
    const shipSet = [];
    Game.defaultShipSet.forEach((ship) =>
      shipSet.push(new Ship(ship.name, ship.length)),
    );
    return new Gameboard(shipSet);
  }

  static createPlayer(name) {
    const gameboard = Game.createGameboard();
    return new Player(name, gameboard);
  }

  constructor(player1, player2) {
    player1 = player1 !== undefined ? player1 : Game.createPlayer('player1');
    player2 = player2 !== undefined ? player2 : Game.createPlayer('player2');

    this.#player1 = player1;
    this.#player2 = player2;
    const randPlayer = [player1, player2][Math.floor(Math.random() * 2)];
    this.#curPlayer = randPlayer;
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

  getNotCurPlayer() {
    return this.#curPlayer === this.#player1 ? this.#player2 : this.#player1;
  }
}
