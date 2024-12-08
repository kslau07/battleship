// Ship.js

export default class Ship {
  #name;
  #length;
  #hits;
  #sunk;

  constructor(name, length) {
    this.#name = name;
    this.#length = length;
    this.#hits = 0;
    this.#sunk = false;
  }

  getName() {
    return this.#name;
  }

  getLength() {
    return this.#length;
  }

  hit() {
    this.#hits += 1;
    this.#updateSunk();
  }

  getHits() {
    return this.#hits;
  }

  #updateSunk() {
    if (this.#hits >= this.#length) {
      this.#sunk = true;
    }
  }

  isSunk() {
    return this.#sunk;
  }
}
