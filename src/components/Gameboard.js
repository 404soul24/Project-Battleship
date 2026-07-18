class Gameboard {
  constructor() {
    this.grid = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => null)
    );
    this.missedAttack = [];
    this.ships = [];
    this.attackedCells = new Set();
  }

  placeShip(ship, row, col, isHorizontal) {
    for (let i = 0; i < ship.length; i++) {
      const r = isHorizontal ? row : row + i;
      const c = isHorizontal ? col + i : col;
      if (r >= 10 || c >= 10 || this.grid[r][c] !== null) return false;
    }
    for (let i = 0; i < ship.length; i++) {
      const r = isHorizontal ? row : row + i;
      const c = isHorizontal ? col + i : col;
      this.grid[r][c] = ship;
    }
    this.ships.push(ship);
    return true;
  }

  receiveAttack(row, col) {
    const key = `${row},${col}`;
    if (this.attackedCells.has(key)) return 'duplicate';
    this.attackedCells.add(key);

    const target = this.grid[row][col];
    if (target !== null) {
      target.hit();
      return 'hit';
    }
    this.missedAttack.push([row, col]);
    return 'miss';
  }

  allShipsSunk() {
    return this.ships.length > 0 && this.ships.every(s => s.isSunk());
  }
}

export { Gameboard };
