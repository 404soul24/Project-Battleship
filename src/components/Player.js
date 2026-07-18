import { Gameboard } from './Gameboard.js';
import { Ship } from './Ship.js';

class Player {
  constructor(name) {
    this.name = name;
    this.board = new Gameboard();
    this.pastMoves = [];
  }

  getCoordinates() {
    let row, col, moveKey;
    do {
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);
      moveKey = `${row},${col}`;
    } while (this.pastMoves.includes(moveKey));
    this.pastMoves.push(moveKey);
    return [row, col];
  }

  placeShipsRandomly() {
    const sizes = [5, 4, 3, 3, 2];
    for (const size of sizes) {
      let placed = false;
      while (!placed) {
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);
        const isHorizontal = Math.random() < 0.5;
        const ship = new Ship(size);
        placed = this.board.placeShip(ship, row, col, isHorizontal);
      }
    }
  }
}

export { Player };
