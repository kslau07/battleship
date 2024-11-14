// Ship.js

export default class Ship {
  constructor(name, length) {
    this.name = name;
    this.length = length;
    this.hits = 0;
    // this.sunk = false; // Do we need this?
  }

  hit() {
    this.hits += 1;
  }

  isSunk() {
    if (this.hits >= this.length) {
      return true;
    }

    return false;
  }
}
