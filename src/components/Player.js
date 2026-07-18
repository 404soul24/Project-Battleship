import { Gameboard } from '../components/Gameboard.js';
class Player{
    constructor(name){
        this.name = name;
        this.board = new Gameboard();
        this.pastMoves = [];
    }
    getCoordinates(){
        let row, col, moveKey;

        do {
            row = Math.floor(Math.random() * 10);
            col = Math.floor(Math.random() * 10);
            moveKey = `${row},${col}`;
        } while (this.pastMoves.includes(moveKey));

        this.pastMoves.push(moveKey);
        return [row, col];
    }
}

export {Player};