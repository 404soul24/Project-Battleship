import { Ship } from '../components/Ship.js';
test("new Ships start with 0 hits",() =>{
    const mySubmarine = new Ship(3);
    expect(mySubmarine.hits).toBe(0);
})

test("calling hit() increases the number of hits", () =>{
    const mySubmarine = new Ship(3);
    mySubmarine.hit()
    expect(mySubmarine.hits).toBe(1);
})

test("new ship is not sunk initially", () =>{
    const mySubmarine = new Ship(3);
    expect(mySubmarine.isSunk()).toBe(false);
})
test("ship is sunk after taking hits equal to its length", () =>{
    const mySubmarine = new Ship(3);

    mySubmarine.hit();
    mySubmarine.hit();
    mySubmarine.hit();

    expect(mySubmarine.isSunk()).toBe(true);
})