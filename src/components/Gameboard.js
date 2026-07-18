class Gameboard {
  constructor() {
    this.grid = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => null),
    );
    this.missedAttack = [];
    this.ships = [];
  }
  placeShip(ship, row, col, isHorizontal) {
    for (let i = 0; i < ship.length; i++) {
      if (isHorizontal === true) {
        this.grid[row][col + i] = ship;
      } else {
        this.grid[row + i][col] = ship;
      }
    }
    this.ships.push(ship);
  }
  receiveAttack(row, col) {
    const targetCell = this.grid[row][col];
    if (targetCell !== null) {
      targetCell.hit();
    } else {
      this.missedAttack.push([row, col]);
    }
  }
  allShipsSunk() {
     return this.ships.every((ship) => ship.isSunk());
  }
}

export { Gameboard };
