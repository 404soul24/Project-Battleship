import { Player } from './components/Player.js';
import { Ship } from './components/Ship.js';

const humanPlayer = new Player("Player 1");
const computerPlayer = new Player("Computer AI");

humanPlayer.board.placeShip(new Ship(3), 2, 3, true);
computerPlayer.board.placeShip(new Ship(3), 5, 1, false);

const humanGridElement = document.getElementById('human-grid');
const computerGridElement = document.getElementById('computer-grid');

function handleTurn(targetRow, targetCol) {
    computerPlayer.board.receiveAttack(targetRow, targetCol);
    
    if (computerPlayer.board.allShipsSunk()) {
        alert("Victory! You destroyed the enemy fleet!");
        renderGameBoards();
        return;
    }

    const [compRow, compCol] = computerPlayer.getCoordinates();
    humanPlayer.board.receiveAttack(compRow, compCol);

    if (humanPlayer.board.allShipsSunk()) {
        alert("Defeat! The computer destroyed your fleet.");
        renderGameBoards();
        return;
    }

    renderGameBoards();
}

function renderGameBoards() {
    humanGridElement.innerHTML = '';
    computerGridElement.innerHTML = '';

    renderGrid(humanPlayer, humanGridElement, false);
    
    renderGrid(computerPlayer, computerGridElement, true);
}

function renderGrid(player, containerElement, isEnemyGrid) {
    player.board.grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellButton = document.createElement('button');
            cellButton.classList.add('cell'); 

            const isMiss = player.board.missedAttack.some(([r, c]) => r === rowIndex && c === colIndex);
            const isHit = cell !== null && !isMiss && player.board.grid[rowIndex][colIndex] === cell; 

            if (isMiss) {
                cellButton.classList.add('miss');
            } else if (cell !== null && isEnemyGrid === false) {
                cellButton.classList.add('ship');
            }

            if (isEnemyGrid && !isMiss) {
                cellButton.addEventListener('click', () => {
                    handleTurn(rowIndex, colIndex);
                });
            } else if (isEnemyGrid) {
                cellButton.disabled = true;
            }

            containerElement.appendChild(cellButton);
        });
    });
}

// Kickstart the game on page load
renderGameBoards();