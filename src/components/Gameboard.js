class Gameboard {
  constructor() {
    this.grid = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => null),
    );
  }
  placeShip(ship, row, col, isHorizontal){
    
  }
}
export { Gameboard };