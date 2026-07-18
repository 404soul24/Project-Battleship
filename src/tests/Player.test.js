import { Player } from '../components/Player.js';
import { Gameboard } from '../components/Gameboard.js';

test("each player has their own gameboard", () => {
    const human = new Player("Human");
    
    // Check that the player's board is an instance of the Gameboard class
    expect(human.board).toBeInstanceOf(Gameboard);
});

test("computer player makes a choice within bounds", () => {
    const computer = new Player("Computer");
    
    const [row, col] = computer.getCoordinates();

    expect(row).toBeGreaterThanOrEqual(0);
    expect(row).toBeLessThan(10);
    expect(col).toBeGreaterThanOrEqual(0);
    expect(col).toBeLessThan(10);
});