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

test("places a ship vertically at specified coordinates", () => {
    const myBoard = new Gameboard();
    const Destroyer = new Ship(2);

    myBoard.placeShip(Destroyer, 4, 5, false);

    expect(myBoard.grid[4][5]).toBe(Destroyer);
    expect(myBoard.grid[5][5]).toBe(Destroyer);
    
    expect(myBoard.grid[6][5]).toBe(null);
});

test("test if ship get hit",() =>{
    const myBoard = new Gameboard();
    const Destroyer = new Ship(2);

    myBoard.placeShip(Destroyer, 4, 5, false)

    myBoard.receiveAttack(4,5)

    expect(Destroyer.hits).toBe(1);
})

test("stock corrdinition of misse place",() =>{
    const myBoard = new Gameboard();
    myBoard.receiveAttack(4,5);

    expect(myBoard.missedAttack).toContainEqual([4, 5]);
})

test("reports whether all ships have been sunk", () => {
    const myBoard = new Gameboard();
    const tinyShip = new Ship(1);

    myBoard.placeShip(tinyShip, 0, 0, true);
    
    expect(myBoard.allShipsSunk()).toBe(false);

    myBoard.receiveAttack(0, 0);

    expect(myBoard.allShipsSunk()).toBe(true);
});