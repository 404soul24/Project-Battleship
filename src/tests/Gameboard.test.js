import { Gameboard } from '../components/Gameboard.js';
import { Ship } from '../components/Ship.js';
test("board initializes as a 10x10 grid", () => {
    const myBoard = new Gameboard();
    
    expect(Array.isArray(myBoard.grid)).toBe(true);
    
    expect(myBoard.grid.length).toBe(10);
    
    expect(myBoard.grid[0].length).toBe(10);
});

test("places a ship horizontally at specified coordinates", () => {
    const myBoard = new Gameboard();
    const submarine = new Ship(3);

    myBoard.placeShip(submarine, 2, 3, true);

    expect(myBoard.grid[2][3]).toBe(submarine);
    expect(myBoard.grid[2][4]).toBe(submarine);
    expect(myBoard.grid[2][5]).toBe(submarine);
    
    expect(myBoard.grid[2][6]).toBe(null);
});